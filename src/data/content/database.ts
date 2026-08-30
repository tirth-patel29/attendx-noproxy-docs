import type { DatabaseTable } from '../models';

export const tables: DatabaseTable[] = [
  {
    name: 'colleges',
    purpose: 'Top-level academic entity (e.g., CSPIT, DEPSTAR).',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, key: 'PK', default: 'uuid_generate_v4()' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, key: 'UK' },
      { name: 'code', type: 'VARCHAR(20)', nullable: false, key: 'UK' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'NOW()' }
    ],
    migrationHistory: ['008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'departments',
    purpose: 'Subset of a college (e.g., DCE, DCS).',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, key: 'PK', default: 'uuid_generate_v4()' },
      { name: 'college_id', type: 'UUID', nullable: false, key: 'FK', references: 'colleges(id)' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, key: 'UK' },
      { name: 'code', type: 'VARCHAR(20)', nullable: false }
    ],
    migrationHistory: ['008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'branches',
    purpose: 'Discipline within a department.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, key: 'PK', default: 'uuid_generate_v4()' },
      { name: 'department_id', type: 'UUID', nullable: false, key: 'FK', references: 'departments(id)' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, key: 'UK' },
      { name: 'code', type: 'VARCHAR(20)', nullable: false }
    ],
    migrationHistory: ['008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'divisions',
    purpose: 'Track or year group (e.g. Div A).',
    columns: [
      { name: 'division_id', type: 'UUID', nullable: false, key: 'PK', default: 'uuid_generate_v4()' },
      { name: 'branch_id', type: 'UUID', nullable: true, key: 'FK', references: 'branches(id)' },
      { name: 'name', type: 'VARCHAR(50)', nullable: false, key: 'UK' }
    ],
    migrationHistory: ['001_schema.sql', '008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'batches',
    purpose: 'Small cohort for lab sessions.',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, key: 'PK', default: 'uuid_generate_v4()' },
      { name: 'division_id', type: 'UUID', nullable: false, key: 'FK', references: 'divisions(division_id)' },
      { name: 'name', type: 'VARCHAR(50)', nullable: false }
    ],
    migrationHistory: ['008_phase3_academic_hierarchy.sql']
  },
  {
    name: 'students',
    purpose: 'Ledger of who owns which hardware and signing key.',
    columns: [
      { name: 'student_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'uuid_generate_v4()' },
      { name: 'roll_no', type: 'VARCHAR(20)', nullable: false, key: 'UK' },
      { name: 'email', type: 'VARCHAR(100)', nullable: false, key: 'UK' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: true },
      { name: 'bound_device_id', type: 'VARCHAR(64)', nullable: true, description: 'Gate 1 Hardware Tattoo' },
      { name: 'secret_hmac_key', type: 'VARCHAR(64)', nullable: true, description: 'Gate 4 Signer' },
      { name: 'division_id', type: 'UUID', nullable: true, key: 'FK', references: 'divisions(division_id)' },
      { name: 'batch_id', type: 'UUID', nullable: true, key: 'FK', references: 'batches(id)' }
    ],
    migrationHistory: ['001_schema.sql', '006_student_auth.sql']
  },
  {
    name: 'attendance_ledger',
    purpose: 'Master immutable attendance record.',
    columns: [
      { name: 'ledger_uuid', type: 'UUID', nullable: false, key: 'PK', default: 'uuid_generate_v4()' },
      { name: 'session_uuid', type: 'UUID', nullable: false, key: 'FK', references: 'course_sessions' },
      { name: 'student_uuid', type: 'UUID', nullable: false, key: 'FK', references: 'students' },
      { name: 'client_claimed_time', type: 'BIGINT', nullable: false, description: 'TrueObservedTime' },
      { name: 'verification_delta_ms', type: 'INT', nullable: false, description: 'Latency' },
      { name: 'status', type: 'VARCHAR(20)', nullable: false, default: "'PRESENT'" }
    ],
    migrationHistory: ['001_schema.sql']
  }
];
