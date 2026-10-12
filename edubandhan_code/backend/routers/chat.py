from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import datetime
import uuid
from backend.database import get_db_cursor

router = APIRouter(prefix="/ws", tags=["WebSockets & Live Channels"])
api_router = APIRouter(prefix="/api/chat", tags=["Live Channel API"])

class ConnectionManager:
    def __init__(self):
        # channel_name -> list of WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = []
        self.active_connections[channel].append(websocket)

    def disconnect(self, websocket: WebSocket, channel: str):
        if channel in self.active_connections:
            if websocket in self.active_connections[channel]:
                self.active_connections[channel].remove(websocket)
            if not self.active_connections[channel]:
                del self.active_connections[channel]

    async def broadcast(self, channel: str, message: dict):
        if channel in self.active_connections:
            for connection in self.active_connections[channel]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

class SendMessageRequest(BaseModel):
    channel: str
    sender_name: str
    sender_role: str
    sender_avatar: Optional[str] = "👤"
    message_text: str
    category: Optional[str] = "GENERAL"  # 'UPDATE', 'QUERY', 'HOMEWORK', 'GENERAL'

@api_router.get("/channels")
def get_available_channels():
    class_channels = []
    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT c.id, c.grade, c.section, c.room_number,
                       u.full_name as teacher_name,
                       'class-' || lower(c.grade) || lower(c.section) as room_key,
                       (SELECT count(*) FROM students st WHERE st.class_id = c.id AND st.is_active = TRUE) as student_count,
                       (
                           SELECT count(DISTINCT sg.guardian_id)
                           FROM students st
                           JOIN student_guardians sg ON sg.student_id = st.id
                           WHERE st.class_id = c.id
                       ) as parent_count,
                       (SELECT count(*) FROM class_teachers ct WHERE ct.class_id = c.id) as teacher_count
                FROM classes c
                LEFT JOIN users u ON u.id = c.class_teacher_id
                ORDER BY c.grade, c.section;
            """)
            rows = cur.fetchall()
            for r in rows:
                t_count = max(r["teacher_count"] or 1, 1)
                p_count = r["parent_count"] or 0
                class_channels.append({
                    "id": r["room_key"],
                    "name": f"Class {r['grade']}-{r['section']} Live Community",
                    "description": f"Daily homework, academic notes & parent queries for Class {r['grade']}-{r['section']} (Faculty: {r['teacher_name'] or 'Assigned Faculty'})",
                    "icon": "📚",
                    "badge": f"Class {r['grade']}-{r['section']}",
                    "members": f"{p_count} Parents • {t_count} Teachers • Principal",
                    "class_id": str(r["id"])
                })
    except Exception as e:
        print(f"Error fetching dynamic class channels: {e}")

    # Fallback if DB empty
    if not class_channels:
        class_channels = [
            {
                "id": "class-8b",
                "name": "Class 8-B Community Channel",
                "description": "Daily homework, study materials, class notices & parent queries",
                "icon": "📚",
                "badge": "Active Class",
                "members": "28 Parents • 4 Teachers • Principal"
            }
        ]

    return class_channels + [
        {
            "id": "school-announcements",
            "name": "DPS Official Broadcast Channel",
            "description": "Principal circulars, holiday notices, fee deadlines & event alerts",
            "icon": "🏫",
            "badge": "School-Wide",
            "members": "All School Parents & Staff"
        },
        {
            "id": "parent-teacher-qna",
            "name": "Parent-Teacher Q&A Desk",
            "description": "Direct academic inquiries, bus transport questions & doubt clearing",
            "icon": "❓",
            "badge": "Open Discussion",
            "members": "Moderated by Teachers"
        }
    ]

@api_router.get("/history/{channel_name}")
def get_channel_history(channel_name: str):
    with get_db_cursor() as cur:
        cur.execute("""
            SELECT id, channel, sender_name, sender_role, sender_avatar, message_text, category,
                   TO_CHAR(created_at, 'HH12:MI AM') as timestamp, created_at
            FROM channel_messages
            WHERE channel = %s
            ORDER BY created_at ASC
            LIMIT 100;
        """, (channel_name,))
        messages = cur.fetchall()
        
        # Serialize datetime or uuids
        formatted = []
        for m in (messages or []):
            formatted.append({
                "id": str(m["id"]),
                "channel": m["channel"],
                "sender_name": m["sender_name"],
                "sender_role": m["sender_role"],
                "sender_avatar": m.get("sender_avatar") or "👤",
                "message_text": m["message_text"],
                "category": m.get("category") or "GENERAL",
                "timestamp": m.get("timestamp") or ""
            })
            
        return {
            "channel": channel_name,
            "count": len(formatted),
            "messages": formatted
        }

@api_router.post("/send")
async def send_message_http(req: SendMessageRequest):
    timestamp = datetime.datetime.now().strftime("%I:%M %p")
    msg_id = str(uuid.uuid4())
    
    with get_db_cursor(commit=True) as cur:
        cur.execute("""
            INSERT INTO channel_messages (id, channel, sender_name, sender_role, sender_avatar, message_text, category)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (msg_id, req.channel, req.sender_name, req.sender_role, req.sender_avatar, req.message_text, req.category))
    
    payload = {
        "id": msg_id,
        "channel": req.channel,
        "sender_name": req.sender_name,
        "sender_role": req.sender_role,
        "sender_avatar": req.sender_avatar,
        "message_text": req.message_text,
        "category": req.category,
        "timestamp": timestamp
    }
    await manager.broadcast(req.channel, payload)
    return {"status": "sent", "message": payload}

@router.websocket("/chat/{channel_name}")
async def websocket_chat_endpoint(websocket: WebSocket, channel_name: str):
    await manager.connect(websocket, channel_name)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            timestamp = datetime.datetime.now().strftime("%I:%M %p")
            payload["timestamp"] = timestamp
            msg_id = str(uuid.uuid4())
            payload["id"] = msg_id

            # Persist to Neon PostgreSQL
            try:
                with get_db_cursor(commit=True) as cur:
                    cur.execute("""
                        INSERT INTO channel_messages (id, channel, sender_name, sender_role, sender_avatar, message_text, category)
                        VALUES (%s, %s, %s, %s, %s, %s, %s);
                    """, (
                        msg_id,
                        channel_name,
                        payload.get("sender_name", "EduBandhan User"),
                        payload.get("sender_role", "MEMBER"),
                        payload.get("sender_avatar", "👤"),
                        payload.get("message_text", ""),
                        payload.get("category", "GENERAL")
                    ))
            except Exception as db_err:
                print(f"[WebSocket] Error persisting message: {db_err}")

            # Real-time broadcast to all clients in this channel
            await manager.broadcast(channel_name, payload)
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel_name)
    except Exception:
        manager.disconnect(websocket, channel_name)

@router.websocket("/consultation/{room_id}")
async def websocket_consultation_endpoint(websocket: WebSocket, room_id: str):
    channel = f"consultation-{room_id}"
    await manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
            except Exception:
                payload = {"type": "raw", "data": data}
            
            payload["server_time"] = datetime.datetime.now().strftime("%I:%M:%S %p")
            
            # If call_ended event is received, auto-update consultation status to COMPLETED
            if payload.get("type") == "call_ended":
                booking_id = payload.get("bookingId")
                try:
                    with get_db_cursor(commit=True) as cur:
                        if booking_id:
                            cur.execute("""
                                UPDATE consultation_bookings
                                SET status = 'COMPLETED'
                                WHERE id = %s;
                            """, (booking_id,))
                        else:
                            cur.execute("""
                                UPDATE consultation_bookings
                                SET status = 'COMPLETED'
                                WHERE webrtc_room_id = %s;
                            """, (room_id,))
                except Exception as err:
                    print(f"[WebSocket] Error auto-marking consultation COMPLETED: {err}")

            # Broadcast signaling / media state / chat to other participant in the room
            await manager.broadcast(channel, payload)
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)
        await manager.broadcast(channel, {"type": "peer_disconnected"})
    except Exception:
        manager.disconnect(websocket, channel)

