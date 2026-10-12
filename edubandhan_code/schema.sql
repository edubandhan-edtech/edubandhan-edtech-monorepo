-- ============================================================================
-- EduBandhan (एडूबंधन) — Production Database Schema
-- Multi-Tenant Architecture with pgvector 512-D Facial Biometrics
-- ============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Clean Existing Tables (Idempotent Migration)
DROP TABLE IF EXISTS class_broadcasts CASCADE;
DROP TABLE IF EXISTS consultation_bookings CASCADE;
DROP TABLE IF EXISTS fee_invoices CASCADE;
DROP TABLE IF EXISTS fee_structures CASCADE;
DROP TABLE IF EXISTS attendance_logs CASCADE;
DROP TABLE IF EXISTS face_embeddings CASCADE;
DROP TABLE IF EXISTS student_guardians CASCADE;
DROP TABLE IF EXISTS guardians CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- ============================================================================
-- TABLE: schools (Multi-tenant Educational Institutions)
-- ============================================================================
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'DPS-ROU-001'
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    morning_cutoff_time TIME DEFAULT '08:30:00',
    saas_tier VARCHAR(50) DEFAULT 'STANDARD_TIER', -- ₹25/student/mo
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: users (RBAC: SuperAdmin, SchoolAdmin, Teacher, Parent)
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT')),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: classes (Classroom Grade & Section e.g. Class 8-B)
-- ============================================================================
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade VARCHAR(20) NOT NULL,       -- e.g. '8'
    section VARCHAR(10) NOT NULL,     -- e.g. 'B'
    room_number VARCHAR(50),
    class_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    academic_year VARCHAR(20) DEFAULT '2026-2027',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (school_id, grade, section, academic_year)
);

-- ============================================================================
-- TABLE: guardians (Parent Profiles with Verified KYC)
-- ============================================================================
CREATE TABLE guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    aadhaar_hash VARCHAR(255),
    is_kyc_verified BOOLEAN DEFAULT FALSE,
    relationship VARCHAR(50) DEFAULT 'Parent', -- 'Father', 'Mother', 'Guardian'
    fcm_push_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: students (Enrolled Students)
-- ============================================================================
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    admission_number VARCHAR(100) NOT NULL,
    roll_number INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE,
    gender VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (school_id, admission_number),
    UNIQUE (class_id, roll_number)
);

-- ============================================================================
-- TABLE: student_guardians (Many-to-Many Student to Parent Mapping)
-- ============================================================================
CREATE TABLE student_guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, guardian_id)
);

-- ============================================================================
-- TABLE: face_embeddings (512-D InsightFace/MobileFaceNet Biometric Vectors)
-- ============================================================================
CREATE TABLE face_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    embedding vector(512) NOT NULL,
    model_version VARCHAR(50) DEFAULT 'MobileFaceNet-V1-ONNX',
    confidence_quality_score FLOAT DEFAULT 0.98,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HNSW Cosine Distance Index for Sub-150ms Vector Search
CREATE INDEX IF NOT EXISTS idx_face_embeddings_hnsw 
ON face_embeddings USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- ============================================================================
-- TABLE: attendance_logs (Daily Check-in, Cutoff & Overrides)
-- ============================================================================
CREATE TABLE attendance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in_time TIME,
    status VARCHAR(50) NOT NULL DEFAULT 'PRESENT' CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
    confidence_score FLOAT, -- e.g. 0.994
    verified_by_kiosk BOOLEAN DEFAULT TRUE,
    manual_override_by UUID REFERENCES users(id) ON DELETE SET NULL,
    override_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, log_date)
);

CREATE INDEX idx_attendance_date ON attendance_logs (school_id, class_id, log_date);

-- ============================================================================
-- TABLE: fee_structures & fee_invoices (Itemized Fintech & 1-Tap UPI)
-- ============================================================================
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    tuition_fee NUMERIC(10,2) DEFAULT 0.00,
    lab_fee NUMERIC(10,2) DEFAULT 0.00,
    transport_fee NUMERIC(10,2) DEFAULT 0.00,
    exam_fee NUMERIC(10,2) DEFAULT 0.00,
    total_fee NUMERIC(10,2) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fee_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    guardian_id UUID REFERENCES guardians(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    tax_gst NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'OVERDUE', 'FAILED')),
    payment_mode VARCHAR(50), -- 'UPI', 'NET_BANKING', 'CARD'
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    paid_at TIMESTAMP WITH TIME ZONE,
    gst_receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: consultation_bookings (1-on-1 Micro-PTM & 80/20 Revenue Split)
-- ============================================================================
CREATE TABLE consultation_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    slot_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    slot_duration_minutes INT DEFAULT 10,
    fee_amount NUMERIC(10,2) DEFAULT 99.00,
    teacher_earnings NUMERIC(10,2) DEFAULT 79.20, -- 80%
    platform_commission NUMERIC(10,2) DEFAULT 19.80, -- 20%
    webrtc_room_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    post_call_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: class_broadcasts (Moderated WebSocket Classroom Circulars)
-- ============================================================================
CREATE TABLE class_broadcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE, -- NULL means school-wide broadcast
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'NOTICE' CHECK (category IN ('NOTICE', 'HOMEWORK', 'EMERGENCY', 'EXAM')),
    attachment_url TEXT,
    is_urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SEED DATA: Pilot School, Class 8-B, Teacher, Students & Demo Embeddings
-- ============================================================================

-- 1. Seed Pilot School
INSERT INTO schools (id, code, name, city, state, contact_email, contact_phone, morning_cutoff_time)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'DPS-ROU-001',
    'Delhi Public School, Rourkela',
    'Rourkela',
    'Odisha',
    'admin@dps-rourkela.edu.in',
    '+919876543210',
    '08:30:00'
);

-- 2. Seed Teachers & Principals
INSERT INTO users (id, school_id, role, full_name, email, phone, is_phone_verified)
VALUES 
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'TEACHER',
    'Mrs. Sunita Sharma',
    'sunita.sharma@dps-rourkela.edu.in',
    '+919876543211',
    TRUE
),
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'SCHOOL_ADMIN',
    'Dr. S. K. Mohanty (Principal)',
    'principal@dps-rourkela.edu.in',
    '+919876543212',
    TRUE
),
(
    'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'PARENT',
    'Mr. Rajesh Sharma',
    'rajesh.sharma@gmail.com',
    '+919876543213',
    TRUE
);

-- 3. Seed Class 8-B
INSERT INTO classes (id, school_id, grade, section, room_number, class_teacher_id)
VALUES (
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '8',
    'B',
    'Room 204 (2nd Floor)',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'
);

-- 4. Seed Guardian Profile
INSERT INTO guardians (id, user_id, relationship, is_kyc_verified)
VALUES (
    'f6a7b89c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
    'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
    'Father',
    TRUE
);

-- 5. Seed Students in Class 8-B
INSERT INTO students (id, school_id, class_id, admission_number, roll_number, first_name, last_name, dob, gender)
VALUES 
(
    '11111111-2222-3333-4444-555555555551',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    'DPS-2026-0801',
    1,
    'Rohan',
    'Sharma',
    '2012-05-14',
    'Male'
),
(
    '11111111-2222-3333-4444-555555555552',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    'DPS-2026-0802',
    2,
    'Aarav',
    'Kumar',
    '2012-08-22',
    'Male'
),
(
    '11111111-2222-3333-4444-555555555553',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    'DPS-2026-0803',
    3,
    'Priya',
    'Patel',
    '2012-03-10',
    'Female'
),
(
    '11111111-2222-3333-4444-555555555554',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    'DPS-2026-0804',
    4,
    'Vikram',
    'Singh',
    '2012-11-05',
    'Male'
),
(
    '11111111-2222-3333-4444-555555555555',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    'DPS-2026-0805',
    5,
    'Sneha',
    'Verma',
    '2012-07-19',
    'Female'
);

-- Map Rohan Sharma to Guardian Rajesh Sharma
INSERT INTO student_guardians (student_id, guardian_id, is_primary)
VALUES ('11111111-2222-3333-4444-555555555551', 'f6a7b89c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', TRUE);

-- 6. Seed Initial 512-D Face Embeddings for Rohan Sharma
-- (Generating 512 normalized values)
DO $$
DECLARE
    v_vec text;
BEGIN
    -- Construct a 512-dim mock vector representation '[0.044, 0.044, ...]'
    SELECT '[' || string_agg((0.04419)::text, ', ') || ']'
    INTO v_vec
    FROM generate_series(1, 512);

    EXECUTE format('
        INSERT INTO face_embeddings (student_id, embedding, confidence_quality_score)
        VALUES (''11111111-2222-3333-4444-555555555551'', %L::vector, 0.994)', v_vec);
END $$;

-- 7. Seed Initial Attendance Record for Today
INSERT INTO attendance_logs (school_id, class_id, student_id, log_date, check_in_time, status, confidence_score, verified_by_kiosk)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    '11111111-2222-3333-4444-555555555551',
    CURRENT_DATE,
    '08:12:34',
    'PRESENT',
    0.994,
    TRUE
);

-- 8. Seed Fee Invoice
INSERT INTO fee_invoices (school_id, student_id, guardian_id, invoice_number, amount, tax_gst, total_amount, payment_status)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '11111111-2222-3333-4444-555555555551',
    'f6a7b89c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
    'INV-2026-OCT-0801',
    14500.00,
    0.00,
    14500.00,
    'PENDING'
);

-- 9. Seed Class Broadcast
INSERT INTO class_broadcasts (school_id, class_id, sender_id, title, content, category)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Mathematics Chapter 4 Practice Homework',
    'Please complete Exercise 4.2 (Questions 1 to 10) in your homework notebook for submission tomorrow morning.',
    'HOMEWORK'
);
