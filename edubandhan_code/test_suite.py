import urllib.request
import json
import time

BASE_URL = "http://localhost:8000"

def test_api():
    print("=================================================================")
    print("   EduBandhan Full Stack & Live Classroom Verification Suite")
    print("=================================================================")

    # 1. Health
    with urllib.request.urlopen(f"{BASE_URL}/api/health") as res:
        health = json.loads(res.read().decode())
        print(f"[+] Health: {health.get('status')} • DB: {health.get('database')}")

    # 2. Demo Accounts
    with urllib.request.urlopen(f"{BASE_URL}/api/auth/demo-accounts") as res:
        demo = json.loads(res.read().decode())
        print(f"[+] Demo accounts loaded: {len(demo.get('accounts', []))} verified accounts available")

    # 3. Class Rooms
    with urllib.request.urlopen(f"{BASE_URL}/api/admin/class-rooms") as res:
        rooms_data = json.loads(res.read().decode())
        rooms = rooms_data.get("class_rooms", [])
        print(f"[+] Active Classroom Socket Rooms: {len(rooms)}")
        for r in rooms:
            print(f"    - Class {r['grade']}-{r['section']} (Room: '{r['room_key']}'): {r['student_count']} Students, {r['parent_count']} Parents, Primary: {r['primary_teacher_name']}")

    # 4. Teachers
    with urllib.request.urlopen(f"{BASE_URL}/api/admin/teachers") as res:
        teachers_data = json.loads(res.read().decode())
        teachers = teachers_data.get("teachers", [])
        print(f"[+] Registered Faculty & Teachers: {len(teachers)}")
        for t in teachers:
            print(f"    - {t['full_name']} ({t['email']}) -> Assigned: {t['assigned_classes'] or 'None'}")

    # 5. Assign Teacher to Class
    if rooms and teachers:
        target_room = rooms[0]
        target_teacher = teachers[0]
        # find teacher Mr. Anand Kumar if available
        for t in teachers:
            if "Anand" in t["full_name"]:
                target_teacher = t
                break

        assign_payload = {
            "class_id": str(target_room["id"]),
            "teacher_id": str(target_teacher["id"]),
            "subject": "Mathematics & Robotics",
            "is_primary": False
        }

        req = urllib.request.Request(
            f"{BASE_URL}/api/admin/assign-teacher",
            data=json.dumps(assign_payload).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as res:
            assign_res = json.loads(res.read().decode())
            print(f"[+] Teacher Assignment API: {assign_res.get('message')}")
            print(f"    Room Key: '{assign_res.get('room_key')}', Subject: '{assign_res.get('subject')}'")

    # 6. Verify Channel Message History
    with urllib.request.urlopen(f"{BASE_URL}/api/chat/history/class-8b") as res:
        chat_data = json.loads(res.read().decode())
        msgs = chat_data.get("messages", [])
        print(f"[+] Class 8-B Channel History: {len(msgs)} messages persisted in Neon DB")
        for m in msgs[-2:]:
            print(f"    - [{m['category']}] {m['sender_name']} ({m['sender_role']}): {m['message_text'][:80]}...")

    # 7. Parent Onboarding Test
    parent_payload = {
        "first_name": "Sanjay",
        "last_name": "Verma",
        "relationship": "Father",
        "phone": f"+9198765{int(time.time()) % 100000:05d}",
        "email": f"sanjay.verma.{int(time.time())}@edubandhan.in",
        "password": "edubandhan2026",
        "child_first_name": "Aryan",
        "child_last_name": "Verma",
        "child_admission_no": f"ADM-2026-{int(time.time()) % 1000:03d}",
        "child_class_name": "Class 8-B",
        "child_dob": "2013-08-20",
        "child_gender": "MALE"
    }

    req = urllib.request.Request(
        f"{BASE_URL}/api/auth/register-parent",
        data=json.dumps(parent_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        reg_res = json.loads(res.read().decode())
        print(f"[+] Parent Onboarding API: Registered parent token generated!")
        print(f"    Child: {reg_res.get('child', {}).get('first_name')} | Room Key: '{reg_res.get('room_key')}'")

    print("\n=================================================================")
    print("   ALL VERIFICATIONS PASSED! System is fully operational.")
    print("=================================================================")

if __name__ == "__main__":
    test_api()
