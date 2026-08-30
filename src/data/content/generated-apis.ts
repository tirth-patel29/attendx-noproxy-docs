import type { ApiEndpoint } from '../models';

export const apis: ApiEndpoint[] = [
  {
    "method": "GET",
    "path": "/resolve/:roll_no",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "GET",
    "path": "/colleges",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "POST",
    "path": "/colleges",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "PUT",
    "path": "/colleges/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "DELETE",
    "path": "/colleges/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "GET",
    "path": "/departments",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "POST",
    "path": "/departments",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "PUT",
    "path": "/departments/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "DELETE",
    "path": "/departments/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "GET",
    "path": "/branches",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "POST",
    "path": "/branches",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "PUT",
    "path": "/branches/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "DELETE",
    "path": "/branches/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "GET",
    "path": "/divisions",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "POST",
    "path": "/divisions",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "PUT",
    "path": "/divisions/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "DELETE",
    "path": "/divisions/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "GET",
    "path": "/batches",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "POST",
    "path": "/batches",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "PUT",
    "path": "/batches/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "DELETE",
    "path": "/batches/:id",
    "group": "academic",
    "security": "public",
    "file": "academic.ts"
  },
  {
    "method": "POST",
    "path": "/login",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/login/refresh",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/change-password",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "GET",
    "path": "/stats",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "GET",
    "path": "/teachers",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/teachers",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "PUT",
    "path": "/teachers/:uuid",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/teachers/:uuid/reset-password",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "DELETE",
    "path": "/teachers/:uuid",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "GET",
    "path": "/students",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "GET",
    "path": "/students/:uuid",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/students",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "PUT",
    "path": "/students/:uuid",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "DELETE",
    "path": "/students/:uuid",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/students/:uuid/reset-device",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/students/:uuid/rotate-hmac",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/students/:uuid/forgot-password",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "GET",
    "path": "/divisions",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/divisions",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "PUT",
    "path": "/divisions/:uuid",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "DELETE",
    "path": "/divisions/:uuid",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "GET",
    "path": "/courses",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/courses",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "PUT",
    "path": "/courses/:code",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "DELETE",
    "path": "/courses/:code",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "GET",
    "path": "/assignments",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/assignments",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "PUT",
    "path": "/assignments/:id",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "DELETE",
    "path": "/assignments/:id",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "GET",
    "path": "/api-keys",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/api-keys",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  },
  {
    "method": "POST",
    "path": "/api-keys/:uuid/revoke",
    "group": "admin",
    "security": "public",
    "file": "admin.ts"
  }
];
