import type { ApiEndpoint } from '../models';

export const apis: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/student/device/bind',
    purpose: 'First authenticated action. Mints the Gate-1 hardware tattoo and the Gate-4 HMAC signer in the same step, then returns the secret to the client secure storage.',
    authentication: 'Student JWT',
    requestBody: '{\n  "device_id_hash": "sha256..."\n}',
    responses: [
      { status: 200, description: 'Success', body: '{\n  "bound": true,\n  "student_uuid": "...",\n  "secret_hmac_key": "..."\n}' },
      { status: 409, description: 'Conflict', body: '{\n  "error": "This student is bound to a different device..."\n}' }
    ],
    relatedTables: ['students', 'audit_logs'],
    sourceFile: 'backend/src/routes/student.ts'
  },
  {
    method: 'POST',
    path: '/api/v1/attendance/claim-attendance',
    purpose: 'The primary Judge endpoint to submit a cryptographically signed claim.',
    authentication: 'API Key',
    requestBody: '{\n  "session_uuid": "...",\n  "student_uuid": "...",\n  "token_val": "AB12",\n  "client_claimed_time": 1725000000000,\n  "device_id_hash": "sha256...",\n  "nonce": "hex...",\n  "hmac_signature": "sha256..."\n}',
    responses: [
      { status: 200, description: 'Success', body: '{\n  "valid": true,\n  "status": "PRESENT"\n}' }
    ],
    relatedTables: ['attendance_ledger', 'course_sessions', 'students'],
    sourceFile: 'backend/src/routes/attendance.ts'
  },
  {
    method: 'POST',
    path: '/api/v1/admin/students/:uuid/reset-device',
    purpose: 'Gate-1 recovery: unbind the old hardware tattoo and rotate the Gate-4 HMAC signer.',
    authentication: 'Admin JWT',
    responses: [
      { status: 200, description: 'Success', body: '{\n  "message": "Device unbound and HMAC rotated."\n}' }
    ],
    relatedTables: ['students', 'audit_logs'],
    sourceFile: 'backend/src/routes/admin.ts'
  }
];
