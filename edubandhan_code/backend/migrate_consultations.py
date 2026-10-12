import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import get_db_cursor

def migrate():
    with get_db_cursor(commit=True) as cur:
        print("Migrating consultation_bookings table...")
        cur.execute("""
            ALTER TABLE consultation_bookings 
            ADD COLUMN IF NOT EXISTS room_passcode VARCHAR(50),
            ADD COLUMN IF NOT EXISTS rejection_remarks TEXT,
            ADD COLUMN IF NOT EXISTS query_topic TEXT;
        """)
        
        # Check existing constraints on status
        cur.execute("""
            SELECT conname FROM pg_constraint 
            WHERE conrelid = 'consultation_bookings'::regclass AND contype = 'c';
        """)
        constraints = [row['conname'] for row in cur.fetchall()]
        print(f"Existing constraints: {constraints}")
        
        for c in constraints:
            if 'status' in c:
                cur.execute(f"ALTER TABLE consultation_bookings DROP CONSTRAINT IF EXISTS {c};")
                print(f"Dropped constraint: {c}")

        cur.execute("""
            ALTER TABLE consultation_bookings 
            ADD CONSTRAINT consultation_bookings_status_check 
            CHECK (status IN ('PENDING', 'CONFIRMED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'));
        """)
        print("Successfully added new status constraint ('PENDING', 'CONFIRMED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED')")
        print("Consultation table successfully upgraded!")

if __name__ == "__main__":
    migrate()
