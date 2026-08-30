-- ============================================================
-- Zero-Trust Cryptographic Attendance Gateway — schema
-- Source: SRS (docs/) §2 "Complete Relational Database Schema"
-- Applied automatically on first DB boot via docker-entrypoint-initdb.d
-- ============================================================

-- Custom domain for standardized roll numbers (e.g. 24BCP182)
CREATE DOMAIN RollNumber AS VARCHAR(15)
  CHECK (VALUE ~ '^[0-9]{2}[A-Z]{3}[0-9]{3}$');

-- TABLE 1: Students (the ledger of who owns which hardware + signing key)
CREATE TABLE students (
  student_uuid     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_no          RollNumber UNIQUE NOT NULL,
  email            VARCHAR(120) UNIQUE NOT NULL,
  bound_device_id  VARCHAR(255),            -- Gate 1: the hardware "tattoo"
  secret_hmac_key  VARCHAR(64) NOT NULL,    -- Gate 4: cryptographic signer
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 2: Professors (who can start sessions & reset devices)
CREATE TABLE professors (
  prof_uuid    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        VARCHAR(120) UNIQUE NOT NULL,
  name         VARCHAR(100) NOT NULL,
  department   VARCHAR(50) NOT NULL
);

-- TABLE 3: Course sessions (the metronome's "active class")
CREATE TABLE course_sessions (
  session_uuid   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code    VARCHAR(20) NOT NULL,
  prof_uuid      UUID REFERENCES professors(prof_uuid) ON DELETE CASCADE,
  session_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 4: Ephemeral tokens (the Metronome cache — 3s rotating)
CREATE TABLE active_tokens (
  token_uuid        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_uuid      UUID REFERENCES course_sessions(session_uuid) ON DELETE CASCADE,
  token_val         VARCHAR(8) NOT NULL,
  created_at_epoch  BIGINT NOT NULL,
  expires_at_epoch  BIGINT NOT NULL
);

-- TABLE 5: The master attendance ledger
CREATE TABLE attendance_ledger (
  ledger_uuid          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_uuid         UUID REFERENCES course_sessions(session_uuid) ON DELETE CASCADE,
  student_uuid         UUID REFERENCES students(student_uuid) ON DELETE CASCADE,
  client_claimed_time  BIGINT NOT NULL,                     -- TrueObservedTime (ms)
  server_logged_time   TIMESTAMPTZ DEFAULT NOW(),
  verification_delta_ms INT NOT NULL,                       -- ObservedTime − TokenBirth
  status               VARCHAR(15) DEFAULT 'PRESENT',
  CONSTRAINT unique_attendance_claim UNIQUE(session_uuid, student_uuid)
);

-- CRITICAL PERFORMANCE INDICES (to survive ~70 concurrent POSTs)
CREATE INDEX idx_tokens_fast_lookup ON active_tokens (token_val, created_at_epoch);
CREATE INDEX idx_student_auth ON students (roll_no, bound_device_id);

-- TABLE 6: Device fingerprints (Gate 1 hardware binding history)
CREATE TABLE device_fingerprints (
  fingerprint_uuid  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_uuid      UUID REFERENCES students(student_uuid) ON DELETE CASCADE,
  device_id_hash    VARCHAR(64) NOT NULL,          -- SHA-256 of hardware UUID
  platform          VARCHAR(20) NOT NULL,          -- 'android' / 'ios'
  app_version       VARCHAR(20),
  os_version        VARCHAR(20),
  first_seen        TIMESTAMPTZ DEFAULT NOW(),
  last_seen         TIMESTAMPTZ DEFAULT NOW(),
  is_current        BOOLEAN DEFAULT TRUE,
  UNIQUE(student_uuid, device_id_hash)
);

-- TABLE 7: Biometric templates (Gate 2 — stored as encrypted blobs, never plaintext)
CREATE TABLE biometric_templates (
  template_uuid     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_uuid      UUID REFERENCES students(student_uuid) ON DELETE CASCADE,
  encrypted_blob    BYTEA NOT NULL,                -- AES-256-GCM encrypted
  nonce             BYTEA NOT NULL,                -- 12-byte nonce for GCM
  alg               VARCHAR(20) NOT NULL DEFAULT 'AES-256-GCM',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  is_active         BOOLEAN DEFAULT TRUE
);

-- TABLE 8: Crypto challenges (Gate 4 — server-issued nonces for timestamp protocol)
CREATE TABLE crypto_challenges (
  challenge_uuid    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_uuid      UUID REFERENCES course_sessions(session_uuid) ON DELETE CASCADE,
  challenge_nonce   VARCHAR(32) NOT NULL,          -- 16-byte hex
  issued_at_epoch   BIGINT NOT NULL,               -- server epoch ms
  expires_at_epoch  BIGINT NOT NULL,               -- +5s typical
  used              BOOLEAN DEFAULT FALSE,
  used_at_epoch     BIGINT,
  UNIQUE(session_uuid, challenge_nonce)
);

-- TABLE 9: Audit log (append-only, for forensics & dispute resolution)
CREATE TABLE audit_logs (
  log_uuid          BIGSERIAL PRIMARY KEY,
  event_type        VARCHAR(30) NOT NULL,          -- 'CLAIM_ATTEMPT', 'DEVICE_RESET', 'SESSION_START', etc.
  actor_uuid        UUID,                          -- student_uuid or prof_uuid
  session_uuid      UUID REFERENCES course_sessions(session_uuid),
  payload           JSONB NOT NULL,                -- full request/response
  source_ip         INET,
  user_agent        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Partition audit_logs by month for retention (optional, Phase 4+)
-- CREATE TABLE audit_logs_2026_08 PARTITION OF audit_logs FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

-- CRITICAL PERFORMANCE INDICES (to survive ~70 concurrent POSTs)
CREATE INDEX idx_tokens_fast_lookup ON active_tokens (token_val, created_at_epoch);
CREATE INDEX idx_student_auth ON students (roll_no, bound_device_id);
CREATE INDEX idx_device_fingerprints_student ON device_fingerprints (student_uuid, is_current);
CREATE INDEX idx_biometric_student ON biometric_templates (student_uuid, is_active);
CREATE INDEX idx_crypto_challenges_session ON crypto_challenges (session_uuid, used, expires_at_epoch);
CREATE INDEX idx_audit_logs_session_time ON audit_logs (session_uuid, created_at DESC);
CREATE INDEX idx_audit_logs_actor_time ON audit_logs (actor_uuid, created_at DESC);

-- Basic anon role needs SELECT/INSERT on the tables the app uses via PostgREST.
-- Tighten this down in Phase 3 once the backend role model is pinned.
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE ON
  students, course_sessions, active_tokens, attendance_ledger, professors,
  device_fingerprints, biometric_templates, crypto_challenges, audit_logs
  TO anon;
-- ============================================================
-- Zero-Trust Cryptographic Attendance Gateway — additional tables
-- Migration 002: Adds device_fingerprints, biometric_templates, crypto_challenges, audit_logs
-- Run AFTER 001_schema.sql
-- ============================================================

-- TABLE 6: Device fingerprints (Gate 1 hardware binding history)
CREATE TABLE device_fingerprints (
  fingerprint_uuid  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_uuid      UUID REFERENCES students(student_uuid) ON DELETE CASCADE,
  device_id_hash    VARCHAR(64) NOT NULL,          -- SHA-256 of hardware UUID
  platform          VARCHAR(20) NOT NULL,          -- 'android' / 'ios'
  app_version       VARCHAR(20),
  os_version        VARCHAR(20),
  first_seen        TIMESTAMPTZ DEFAULT NOW(),
  last_seen         TIMESTAMPTZ DEFAULT NOW(),
  is_current        BOOLEAN DEFAULT TRUE,
  UNIQUE(student_uuid, device_id_hash)
);

-- TABLE 7: Biometric templates (Gate 2 — stored as encrypted blobs, never plaintext)
CREATE TABLE biometric_templates (
  template_uuid     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_uuid      UUID REFERENCES students(student_uuid) ON DELETE CASCADE,
  encrypted_blob    BYTEA NOT NULL,                -- AES-256-GCM encrypted
  nonce             BYTEA NOT NULL,                -- 12-byte nonce for GCM
  alg               VARCHAR(20) NOT NULL DEFAULT 'AES-256-GCM',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  is_active         BOOLEAN DEFAULT TRUE
);

-- TABLE 8: Crypto challenges (Gate 4 — server-issued nonces for timestamp protocol)
CREATE TABLE crypto_challenges (
  challenge_uuid    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_uuid      UUID REFERENCES course_sessions(session_uuid) ON DELETE CASCADE,
  challenge_nonce   VARCHAR(32) NOT NULL,          -- 16-byte hex
  issued_at_epoch   BIGINT NOT NULL,               -- server epoch ms
  expires_at_epoch  BIGINT NOT NULL,               -- +5s typical
  used              BOOLEAN DEFAULT FALSE,
  used_at_epoch     BIGINT,
  UNIQUE(session_uuid, challenge_nonce)
);

-- TABLE 9: Audit log (append-only, for forensics & dispute resolution)
CREATE TABLE audit_logs (
  log_uuid          BIGSERIAL PRIMARY KEY,
  event_type        VARCHAR(30) NOT NULL,          -- 'CLAIM_ATTEMPT', 'DEVICE_RESET', 'SESSION_START', etc.
  actor_uuid        UUID,                          -- student_uuid or prof_uuid
  session_uuid      UUID REFERENCES course_sessions(session_uuid),
  payload           JSONB NOT NULL,                -- full request/response
  source_ip         INET,
  user_agent        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Partition audit_logs by month for retention (optional, Phase 4+)
-- CREATE TABLE audit_logs_2026_08 PARTITION OF audit_logs FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

-- CRITICAL PERFORMANCE INDICES (to survive ~70 concurrent POSTs)
CREATE INDEX idx_device_fingerprints_student ON device_fingerprints (student_uuid, is_current);
CREATE INDEX idx_biometric_student ON biometric_templates (student_uuid, is_active);
CREATE INDEX idx_crypto_challenges_session ON crypto_challenges (session_uuid, used, expires_at_epoch);
CREATE INDEX idx_audit_logs_session_time ON audit_logs (session_uuid, created_at DESC);
CREATE INDEX idx_audit_logs_actor_time ON audit_logs (actor_uuid, created_at DESC);

-- Grant permissions to anon role (tighten in Phase 3)
GRANT SELECT, INSERT, UPDATE ON
  device_fingerprints, biometric_templates, crypto_challenges, audit_logs
  TO anon;
-- ============================================================
-- Test data seed for Phase 2 development
-- Run after migrations 001 + 002
-- ============================================================

-- ===== 2 Professors =====
INSERT INTO professors (email, name, department) VALUES
  ('prof.alex@college.edu', 'Prof. Alex Chen', 'Computer Science'),
  ('prof.maria@college.edu', 'Prof. Maria Santos', 'Electrical Engineering')
ON CONFLICT (email) DO NOTHING;

-- ===== 5 Students (with HMAC keys for Gate 4) =====
-- Using dummy HMAC keys (64 hex chars = 32 bytes)
INSERT INTO students (roll_no, email, bound_device_id, secret_hmac_key) VALUES
  ('24BCS001', 'alice@student.college.edu', NULL, 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef'),
  ('24BCS002', 'bob@student.college.edu', NULL, 'b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01'),
  ('24BEE001', 'carol@student.college.edu', NULL, 'c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef012'),
  ('24BEE002', 'david@student.college.edu', NULL, 'd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0123'),
  ('24BCS003', 'eve@student.college.edu', NULL, 'e5f67890123456789abcdef0123456789abcdef0123456789abcdef01234')
ON CONFLICT (roll_no) DO NOTHING;

-- ===== 2 Course Sessions + Ephemeral tokens =====
DO $$
DECLARE
  v_alex UUID;
  v_maria UUID;
  v_session1 UUID;
  v_session2 UUID;
BEGIN
  SELECT prof_uuid INTO v_alex FROM professors WHERE email = 'prof.alex@college.edu';
  SELECT prof_uuid INTO v_maria FROM professors WHERE email = 'prof.maria@college.edu';

  -- Insert sessions and capture UUIDs using separate inserts
  INSERT INTO course_sessions (course_code, prof_uuid, session_date, is_active) VALUES
    ('CS101', v_alex, CURRENT_DATE, TRUE)
  ON CONFLICT DO NOTHING
  RETURNING session_uuid INTO v_session1;

  INSERT INTO course_sessions (course_code, prof_uuid, session_date, is_active) VALUES
    ('EE201', v_maria, CURRENT_DATE, TRUE)
  ON CONFLICT DO NOTHING
  RETURNING session_uuid INTO v_session2;

  -- If sessions already existed, fetch them
  IF v_session1 IS NULL THEN
    SELECT session_uuid INTO v_session1 FROM course_sessions WHERE course_code = 'CS101' LIMIT 1;
  END IF;
  IF v_session2 IS NULL THEN
    SELECT session_uuid INTO v_session2 FROM course_sessions WHERE course_code = 'EE201' LIMIT 1;
  END IF;

  -- ===== Ephemeral tokens for active sessions (3s rotating) =====
  INSERT INTO active_tokens (session_uuid, token_val, created_at_epoch, expires_at_epoch) VALUES
    (v_session1, '7X9K2M', EXTRACT(EPOCH FROM NOW())::BIGINT * 1000, (EXTRACT(EPOCH FROM NOW())::BIGINT + 3) * 1000),
    (v_session1, '4P8Q1R', (EXTRACT(EPOCH FROM NOW())::BIGINT + 3) * 1000, (EXTRACT(EPOCH FROM NOW())::BIGINT + 6) * 1000),
    (v_session2, '9L2W5Z', EXTRACT(EPOCH FROM NOW())::BIGINT * 1000, (EXTRACT(EPOCH FROM NOW())::BIGINT + 3) * 1000),
    (v_session2, '3H7Y0N', (EXTRACT(EPOCH FROM NOW())::BIGINT + 3) * 1000, (EXTRACT(EPOCH FROM NOW())::BIGINT + 6) * 1000);

  RAISE NOTICE 'Seeded: 2 professors, 2 sessions, 5 students, 4 tokens';
END $$;
-- ============================================================
-- PHASE 2: Database Migration - Zero-Trust Attendance Gateway
-- Admin & Teacher hierarchy (per CURRENT_WORKFLOW.md)
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ------------------------------------------------------------------
-- 1. ADMIN USERS (superuser table - Admin Portal only)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
    admin_uuid    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    name          VARCHAR(100) NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------
-- 2. DIVISIONS (academic structure, e.g. "Computer Engineering - Div A")
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS divisions (
    division_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50) NOT NULL UNIQUE
);

-- ------------------------------------------------------------------
-- 3. COURSES (each course belongs to one division)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
    course_code VARCHAR(20) PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    division_id UUID REFERENCES divisions(division_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------
-- 4. PROFESSORS (UPGRADE: add password_hash for provisioned logins)
-- ------------------------------------------------------------------
ALTER TABLE professors
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(128);

-- ------------------------------------------------------------------
-- 5. TEACHER ASSIGNMENTS (The Timetable - core routing table)
--    Links prof_uuid -> course_code -> division_id on a day/time block
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teacher_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prof_uuid     UUID REFERENCES professors(prof_uuid) ON DELETE CASCADE NOT NULL,
    course_code   VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE NOT NULL,
    division_id   UUID REFERENCES divisions(division_id) ON DELETE CASCADE NOT NULL,
    day_of_week   SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time    TIME NOT NULL,
    end_time      TIME NOT NULL,
    CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

-- ------------------------------------------------------------------
-- 6. STUDENTS (UPGRADE: add name + division_id)
-- ------------------------------------------------------------------
ALTER TABLE students
    ADD COLUMN IF NOT EXISTS name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS division_id UUID REFERENCES divisions(division_id) ON DELETE SET NULL;

-- Backfill name for existing students (derived from email local-part)
UPDATE students SET name = split_part(email, '@', 1) WHERE name IS NULL;

-- ------------------------------------------------------------------
-- PERFORMANCE INDICES for timetable + roster lookups
-- ------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_assignments_prof_day
    ON teacher_assignments (prof_uuid, day_of_week);
CREATE INDEX IF NOT EXISTS idx_assignments_course
    ON teacher_assignments (course_code);
CREATE INDEX IF NOT EXISTS idx_students_division
    ON students (division_id);
CREATE INDEX IF NOT EXISTS idx_courses_division
    ON courses (division_id);
-- ============================================================
-- 005_admin_seed.sql
-- Bootstrap the first Admin Console account.
-- Default credential (CHANGE AFTER FIRST LOGIN):
--   email:    admin@atmyhome.tech
--   password: Admin@123
-- Idempotent: will not overwrite an existing account.
-- ============================================================

INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'admin@atmyhome.tech',
  '$2b$12$e.65d.bYAlzP0ia5NUVyw.VXVZLB0iciOJ98NgLzBeH7OJscyZLY.',
  'System Admin'
)
ON CONFLICT (email) DO NOTHING;
-- ============================================================
-- 006_student_auth.sql
-- Student self-registration & device-bound auth (SRS §1 Phase 1)
-- ------------------------------------------------------------
-- - students.password_hash: bcrypt hash for app login
--   (NULL = password not set yet -> app shows "set password")
-- - students.secret_hmac_key: now generated at DEVICE-BIND time,
--   not at account creation (we cannot mint the device HMAC until
--   the student registers from their actual phone).
-- ============================================================

ALTER TABLE students
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(128);

ALTER TABLE students
    ALTER COLUMN secret_hmac_key DROP NOT NULL;
-- 007_api_keys.sql
-- Shared client API keys (transport-level gate for the client APK).
-- Only the SHA-256 *hash* of the key is ever stored — the raw key is shown to
-- the admin exactly once at mint time. Any active key authenticates a client
-- request (X-Api-Key header). Revocable per key.
CREATE TABLE IF NOT EXISTS api_keys (
  key_uuid     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash     TEXT NOT NULL UNIQUE,        -- sha256 hex of the raw key
  prefix       TEXT NOT NULL,               -- first chars, for the console UI
  label        TEXT NOT NULL,               -- human name e.g. "student-apk"
  status       TEXT NOT NULL DEFAULT 'active',  -- active | revoked
  created_by   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
-- ============================================================
-- PHASE 3: Database Migration - Zero-Trust Attendance Gateway
-- Academic Hierarchy Update
-- ============================================================

CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, code)
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(department_id, code)
);

-- Upgrade existing divisions table
ALTER TABLE divisions
    ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS code VARCHAR(20),
    ADD COLUMN IF NOT EXISTS academic_year INTEGER,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_id UUID REFERENCES divisions(division_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20),
    start_roll VARCHAR(15),
    end_roll VARCHAR(15),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upgrade existing students table
ALTER TABLE students
    ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS joining_year INTEGER,
    ADD COLUMN IF NOT EXISTS current_academic_year INTEGER,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add performance indices
CREATE INDEX IF NOT EXISTS idx_departments_college ON departments (college_id);
CREATE INDEX IF NOT EXISTS idx_branches_department ON branches (department_id);
CREATE INDEX IF NOT EXISTS idx_divisions_branch ON divisions (branch_id);
CREATE INDEX IF NOT EXISTS idx_batches_division ON batches (division_id);
CREATE INDEX IF NOT EXISTS idx_students_batch ON students (batch_id);
-- ============================================================
-- PHASE 3: Database Migration - Zero-Trust Attendance Gateway
-- Seed Academic Hierarchy (DEPSTAR, CSPIT)
-- ============================================================

DO $$ 
DECLARE
    depstar_id UUID;
    cspit_id UUID;
    dept_eng_depstar UUID;
    dept_eng_cspit UUID;
    branch_ce_depstar UUID;
    div_ce_24_depstar UUID;
BEGIN
    -- 1. COLLEGES
    INSERT INTO colleges (name, code) VALUES ('DEPSTAR', 'D') RETURNING id INTO depstar_id;
    INSERT INTO colleges (name, code) VALUES ('CSPIT', 'C') RETURNING id INTO cspit_id;

    -- 2. DEPARTMENTS
    INSERT INTO departments (college_id, name, code) VALUES (depstar_id, 'Engineering', 'ENG') RETURNING id INTO dept_eng_depstar;
    INSERT INTO departments (college_id, name, code) VALUES (cspit_id, 'Engineering', 'ENG') RETURNING id INTO dept_eng_cspit;

    -- 3. BRANCHES for DEPSTAR
    INSERT INTO branches (department_id, name, code) VALUES (dept_eng_depstar, 'Computer Engineering', 'CE') RETURNING id INTO branch_ce_depstar;
    INSERT INTO branches (department_id, name, code) VALUES (dept_eng_depstar, 'Computer Science', 'CS');
    INSERT INTO branches (department_id, name, code) VALUES (dept_eng_depstar, 'Information Technology', 'IT');
    INSERT INTO branches (department_id, name, code) VALUES (dept_eng_depstar, 'Artificial Intelligence & Machine Learning', 'AIML');

    -- 3. BRANCHES for CSPIT
    INSERT INTO branches (department_id, name, code) VALUES (dept_eng_cspit, 'Computer Engineering', 'CE');
    INSERT INTO branches (department_id, name, code) VALUES (dept_eng_cspit, 'Computer Science', 'CS');
    INSERT INTO branches (department_id, name, code) VALUES (dept_eng_cspit, 'Information Technology', 'IT');
    INSERT INTO branches (department_id, name, code) VALUES (dept_eng_cspit, 'Artificial Intelligence & Machine Learning', 'AIML');

    -- 4. DIVISIONS
    -- Assuming academic year 2024 for 3rd year students
    INSERT INTO divisions (name, branch_id, code, academic_year) VALUES ('CE 3rd Year (2024)', branch_ce_depstar, 'CE', 2024) RETURNING division_id INTO div_ce_24_depstar;
    
    -- 5. BATCHES
    -- CE1
    INSERT INTO batches (division_id, name, code, start_roll, end_roll) 
    VALUES (div_ce_24_depstar, 'CE1', 'CE1', '24DCE071', '24DCE075');
    
    -- CE2
    INSERT INTO batches (division_id, name, code, start_roll, end_roll) 
    VALUES (div_ce_24_depstar, 'CE2', 'CE2', '24DCE076', '24DCE151');
    
    -- D2D
    INSERT INTO batches (division_id, name, code, start_roll, end_roll) 
    VALUES (div_ce_24_depstar, 'D2D', 'D2D', 'D25D152', 'D25D179');

END $$;
