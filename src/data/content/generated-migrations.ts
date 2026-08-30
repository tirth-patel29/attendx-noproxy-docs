export type MigrationData = {
  file: string;
  createdTables: string[];
  insertedTables: string[];
  contentLength: number;
  purpose: string;
};

export const migrations: MigrationData[] = [
  {
    "file": "001_schema.sql",
    "createdTables": [
      "students",
      "professors",
      "course_sessions",
      "active_tokens",
      "attendance_ledger",
      "device_fingerprints",
      "biometric_templates",
      "crypto_challenges",
      "audit_logs",
      "audit_logs_2026_08"
    ],
    "insertedTables": [],
    "contentLength": 6510,
    "purpose": "schema"
  },
  {
    "file": "002_additional_tables.sql",
    "createdTables": [
      "device_fingerprints",
      "biometric_templates",
      "crypto_challenges",
      "audit_logs",
      "audit_logs_2026_08"
    ],
    "insertedTables": [],
    "contentLength": 3561,
    "purpose": "additional tables"
  },
  {
    "file": "003_seed_test_data.sql",
    "createdTables": [],
    "insertedTables": [
      "professors",
      "students",
      "course_sessions",
      "active_tokens"
    ],
    "contentLength": 3088,
    "purpose": "seed test data"
  },
  {
    "file": "004_phase2_hierarchy.sql",
    "createdTables": [
      "admin_users",
      "divisions",
      "courses",
      "teacher_assignments"
    ],
    "insertedTables": [],
    "contentLength": 3705,
    "purpose": "phase2 hierarchy"
  },
  {
    "file": "005_admin_seed.sql",
    "createdTables": [],
    "insertedTables": [
      "admin_users"
    ],
    "contentLength": 566,
    "purpose": "admin seed"
  },
  {
    "file": "006_student_auth.sql",
    "createdTables": [],
    "insertedTables": [],
    "contentLength": 734,
    "purpose": "student auth"
  },
  {
    "file": "007_api_keys.sql",
    "createdTables": [
      "api_keys"
    ],
    "insertedTables": [],
    "contentLength": 860,
    "purpose": "api keys"
  },
  {
    "file": "008_phase3_academic_hierarchy.sql",
    "createdTables": [
      "colleges",
      "departments",
      "branches",
      "batches"
    ],
    "insertedTables": [],
    "contentLength": 2605,
    "purpose": "phase3 academic hierarchy"
  },
  {
    "file": "009_seed_academic_hierarchy.sql",
    "createdTables": [],
    "insertedTables": [
      "colleges",
      "departments",
      "branches",
      "divisions",
      "batches"
    ],
    "contentLength": 2651,
    "purpose": "seed academic hierarchy"
  }
];
