import type { DatabaseTable } from '../models';

export const tables: DatabaseTable[] = [
  {
    name: 'colleges',
    purpose: 'Top-level academic entity (e.g., CSPIT, DEPSTAR).',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, key: 'UK' },
      { name: 'code', type: 'VARCHAR(10)', nullable: false, key: 'UK' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' }
    ],
    migrationHistory: ['008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'departments',
    purpose: 'Subset of a college (e.g., Engineering).',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'college_id', type: 'UUID', nullable: true, key: 'FK', references: 'colleges(id)' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'code', type: 'VARCHAR(10)', nullable: false },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' }
    ],
    migrationHistory: ['008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'branches',
    purpose: 'Discipline within a department (e.g., Computer Engineering).',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'department_id', type: 'UUID', nullable: true, key: 'FK', references: 'departments(id)' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'code', type: 'VARCHAR(10)', nullable: false },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' }
    ],
    migrationHistory: ['008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'divisions',
    purpose: 'Track or year group (e.g. CE 3rd Year).',
    columns: [
      { name: 'division_id', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'name', type: 'VARCHAR(50)', nullable: false, key: 'UK' },
      { name: 'branch_id', type: 'UUID', nullable: true, key: 'FK', references: 'branches(id)' },
      { name: 'code', type: 'VARCHAR(20)', nullable: true },
      { name: 'academic_year', type: 'INTEGER', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' }
    ],
    migrationHistory: ['004_phase2_hierarchy.sql', '008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'batches',
    purpose: 'Small cohort for lab sessions.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'division_id', type: 'UUID', nullable: true, key: 'FK', references: 'divisions(division_id)' },
      { name: 'name', type: 'VARCHAR(50)', nullable: false },
      { name: 'code', type: 'VARCHAR(20)', nullable: true },
      { name: 'start_roll', type: 'VARCHAR(15)', nullable: true },
      { name: 'end_roll', type: 'VARCHAR(15)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' }
    ],
    migrationHistory: ['008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'students',
    purpose: 'Ledger of who owns which hardware and signing key.',
    columns: [
      { name: 'student_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'roll_no', type: 'RollNumber', nullable: false, key: 'UK' },
      { name: 'email', type: 'VARCHAR(120)', nullable: false, key: 'UK' },
      { name: 'name', type: 'VARCHAR(100)', nullable: true },
      { name: 'password_hash', type: 'VARCHAR(128)', nullable: true },
      { name: 'bound_device_id', type: 'VARCHAR(255)', nullable: true, description: 'Gate 1 Hardware Tattoo' },
      { name: 'secret_hmac_key', type: 'VARCHAR(64)', nullable: true, description: 'Gate 4 Signer' },
      { name: 'division_id', type: 'UUID', nullable: true, key: 'FK', references: 'divisions(division_id)' },
      { name: 'batch_id', type: 'UUID', nullable: true, key: 'FK', references: 'batches(id)' },
      { name: 'joining_year', type: 'INTEGER', nullable: true },
      { name: 'current_academic_year', type: 'INTEGER', nullable: true },
      { name: 'is_active', type: 'BOOLEAN', nullable: true, default: 'TRUE' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' }
    ],
    migrationHistory: ['001_schema.sql', '004_phase2_hierarchy.sql', '006_student_auth.sql', '008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'professors',
    purpose: 'Teachers who can start sessions.',
    columns: [
      { name: 'prof_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'email', type: 'VARCHAR(120)', nullable: false, key: 'UK' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'department', type: 'VARCHAR(50)', nullable: false },
      { name: 'password_hash', type: 'VARCHAR(128)', nullable: true }
    ],
    migrationHistory: ['001_schema.sql', '004_phase2_hierarchy.sql']
  },
  {
    name: 'admin_users',
    purpose: 'Superuser table for Admin Portal.',
    columns: [
      { name: 'admin_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'email', type: 'VARCHAR(120)', nullable: false, key: 'UK' },
      { name: 'password_hash', type: 'VARCHAR(128)', nullable: false },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' }
    ],
    migrationHistory: ['004_phase2_hierarchy.sql']
  },
  {
    name: 'courses',
    purpose: 'Each course belongs to one division.',
    columns: [
      { name: 'course_code', type: 'VARCHAR(20)', nullable: false, key: 'PK' },
      { name: 'title', type: 'VARCHAR(100)', nullable: false },
      { name: 'division_id', type: 'UUID', nullable: true, key: 'FK', references: 'divisions(division_id)' }
    ],
    migrationHistory: ['004_phase2_hierarchy.sql']
  },
  {
    name: 'teacher_assignments',
    purpose: 'The Timetable - core routing table linking profs to courses to divisions.',
    columns: [
      { name: 'assignment_id', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'prof_uuid', type: 'UUID', nullable: false, key: 'FK', references: 'professors(prof_uuid)' },
      { name: 'course_code', type: 'VARCHAR(20)', nullable: false, key: 'FK', references: 'courses(course_code)' },
      { name: 'division_id', type: 'UUID', nullable: false, key: 'FK', references: 'divisions(division_id)' },
      { name: 'day_of_week', type: 'SMALLINT', nullable: false },
      { name: 'start_time', type: 'TIME', nullable: false },
      { name: 'end_time', type: 'TIME', nullable: false }
    ],
    migrationHistory: ['004_phase2_hierarchy.sql']
  },
  {
    name: 'course_sessions',
    purpose: 'The metronome\'s active class instance.',
    columns: [
      { name: 'session_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'course_code', type: 'VARCHAR(20)', nullable: false },
      { name: 'prof_uuid', type: 'UUID', nullable: true, key: 'FK', references: 'professors(prof_uuid)' },
      { name: 'session_date', type: 'DATE', nullable: false, default: 'CURRENT_DATE' },
      { name: 'is_active', type: 'BOOLEAN', nullable: true, default: 'TRUE' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' }
    ],
    migrationHistory: ['001_schema.sql']
  },
  {
    name: 'active_tokens',
    purpose: 'Ephemeral tokens for the Metronome cache (3s rotating).',
    columns: [
      { name: 'token_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'session_uuid', type: 'UUID', nullable: true, key: 'FK', references: 'course_sessions(session_uuid)' },
      { name: 'token_val', type: 'VARCHAR(8)', nullable: false },
      { name: 'created_at_epoch', type: 'BIGINT', nullable: false },
      { name: 'expires_at_epoch', type: 'BIGINT', nullable: false }
    ],
    migrationHistory: ['001_schema.sql']
  },
  {
    name: 'attendance_ledger',
    purpose: 'Master immutable attendance record.',
    columns: [
      { name: 'ledger_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'session_uuid', type: 'UUID', nullable: true, key: 'FK', references: 'course_sessions(session_uuid)' },
      { name: 'student_uuid', type: 'UUID', nullable: true, key: 'FK', references: 'students(student_uuid)' },
      { name: 'client_claimed_time', type: 'BIGINT', nullable: false, description: 'TrueObservedTime' },
      { name: 'server_logged_time', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'verification_delta_ms', type: 'INT', nullable: false, description: 'ObservedTime − TokenBirth' },
      { name: 'status', type: 'VARCHAR(15)', nullable: true, default: "'PRESENT'" }
    ],
    migrationHistory: ['001_schema.sql']
  },
  {
    name: 'device_fingerprints',
    purpose: 'Gate 1 hardware binding history.',
    columns: [
      { name: 'fingerprint_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'student_uuid', type: 'UUID', nullable: true, key: 'FK', references: 'students(student_uuid)' },
      { name: 'device_id_hash', type: 'VARCHAR(64)', nullable: false },
      { name: 'platform', type: 'VARCHAR(20)', nullable: false },
      { name: 'app_version', type: 'VARCHAR(20)', nullable: true },
      { name: 'os_version', type: 'VARCHAR(20)', nullable: true },
      { name: 'first_seen', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'last_seen', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'is_current', type: 'BOOLEAN', nullable: true, default: 'TRUE' }
    ],
    migrationHistory: ['002_additional_tables.sql']
  },
  {
    name: 'biometric_templates',
    purpose: 'Gate 2 — stored as encrypted blobs, never plaintext.',
    columns: [
      { name: 'template_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'student_uuid', type: 'UUID', nullable: true, key: 'FK', references: 'students(student_uuid)' },
      { name: 'encrypted_blob', type: 'BYTEA', nullable: false },
      { name: 'nonce', type: 'BYTEA', nullable: false },
      { name: 'alg', type: 'VARCHAR(20)', nullable: false, default: "'AES-256-GCM'" },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' },
      { name: 'is_active', type: 'BOOLEAN', nullable: true, default: 'TRUE' }
    ],
    migrationHistory: ['002_additional_tables.sql']
  },
  {
    name: 'crypto_challenges',
    purpose: 'Gate 4 — server-issued nonces for timestamp protocol.',
    columns: [
      { name: 'challenge_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'session_uuid', type: 'UUID', nullable: true, key: 'FK', references: 'course_sessions(session_uuid)' },
      { name: 'challenge_nonce', type: 'VARCHAR(32)', nullable: false },
      { name: 'issued_at_epoch', type: 'BIGINT', nullable: false },
      { name: 'expires_at_epoch', type: 'BIGINT', nullable: false },
      { name: 'used', type: 'BOOLEAN', nullable: true, default: 'FALSE' },
      { name: 'used_at_epoch', type: 'BIGINT', nullable: true }
    ],
    migrationHistory: ['002_additional_tables.sql']
  },
  {
    name: 'audit_logs',
    purpose: 'Append-only, for forensics & dispute resolution.',
    columns: [
      { name: 'log_uuid', type: 'BIGSERIAL', nullable: false, key: 'PK' },
      { name: 'event_type', type: 'VARCHAR(30)', nullable: false },
      { name: 'actor_uuid', type: 'UUID', nullable: true },
      { name: 'session_uuid', type: 'UUID', nullable: true, key: 'FK', references: 'course_sessions(session_uuid)' },
      { name: 'payload', type: 'JSONB', nullable: false },
      { name: 'source_ip', type: 'INET', nullable: true },
      { name: 'user_agent', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: true, default: 'NOW()' }
    ],
    migrationHistory: ['002_additional_tables.sql']
  },
  {
    name: 'api_keys',
    purpose: 'Shared client API keys (transport-level gate for the client APK).',
    columns: [
      { name: 'key_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'gen_random_uuid()' },
      { name: 'key_hash', type: 'TEXT', nullable: false, key: 'UK' },
      { name: 'prefix', type: 'TEXT', nullable: false },
      { name: 'label', type: 'TEXT', nullable: false },
      { name: 'status', type: 'TEXT', nullable: false, default: "'active'" },
      { name: 'created_by', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, default: 'now()' },
      { name: 'last_used_at', type: 'TIMESTAMPTZ', nullable: true }
    ],
    migrationHistory: ['007_api_keys.sql']
  }
];
