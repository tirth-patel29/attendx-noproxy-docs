import type { AppApp } from '../models';

export const apps: AppApp[] = [
  {
    name: 'Admin Console',
    techStack: 'React, Vite, Tailwind CSS',
    purpose: 'System administration, hierarchy management, and provisioning.',
    url: 'https://admin.atmyhome.tech',
    pages: [
      { name: 'Dashboard', path: '/admin/src/pages/Dashboard.tsx', purpose: 'System overview and metrics.' },
      { name: 'Login', path: '/admin/src/pages/LoginPage.tsx', purpose: 'Admin authentication.' },
      { name: 'Colleges', path: '/admin/src/pages/Colleges.tsx', purpose: 'Manage top-level colleges.' },
      { name: 'Departments', path: '/admin/src/pages/Departments.tsx', purpose: 'Manage departments.' },
      { name: 'Branches', path: '/admin/src/pages/Branches.tsx', purpose: 'Manage branches.' },
      { name: 'Divisions', path: '/admin/src/pages/Divisions.tsx', purpose: 'Manage academic divisions.' },
      { name: 'Batches', path: '/admin/src/pages/Batches.tsx', purpose: 'Manage lab batches.' },
      { name: 'Courses', path: '/admin/src/pages/Courses.tsx', purpose: 'Manage courses.' },
      { name: 'Teachers', path: '/admin/src/pages/Teachers.tsx', purpose: 'Provision and manage professors.' },
      { name: 'Assignments', path: '/admin/src/pages/Assignments.tsx', purpose: 'Timetable management.' },
      { name: 'Students', path: '/admin/src/pages/Students.tsx', purpose: 'Manage student records and device resets.' },
      { name: 'API Keys', path: '/admin/src/pages/ApiKeys.tsx', purpose: 'Manage shared client keys.' }
    ]
  },
  {
    name: 'Professor Portal',
    techStack: 'React, Vite, Tailwind CSS',
    purpose: 'Classroom management and attendance metronome.',
    url: 'https://portal.atmyhome.tech',
    pages: [
      { name: 'Login', path: '/portal/src/pages/LoginPage.tsx', purpose: 'Professor authentication.' },
      { name: 'Dashboard', path: '/portal/src/pages/DashboardPage.tsx', purpose: 'Timetable and active sessions.' },
      { name: 'New Session', path: '/portal/src/pages/NewSessionPage.tsx', purpose: 'Start a class session.' },
      { name: 'Live Session', path: '/portal/src/pages/SessionPage.tsx', purpose: 'Metronome view displaying 3s rolling tokens.' }
    ]
  },
  {
    name: 'Student App',
    techStack: 'Flutter',
    purpose: 'Zero-trust attendance client.',
    url: 'Mobile (Android/iOS)',
    pages: [
      { name: 'Auth', path: '/app/lib/features/auth', purpose: 'Device binding and login.' },
      { name: 'Home', path: '/app/lib/features/home', purpose: 'Student dashboard and summary.' },
      { name: 'Scan', path: '/app/lib/features/scan', purpose: 'QR scanner and Metronome visual capture.' },
      { name: 'Claim', path: '/app/lib/features/claim', purpose: 'HMAC signature generation and Gate 4 protocol.' },
      { name: 'History', path: '/app/lib/features/history', purpose: 'Past attendance records.' },
      { name: 'Profile', path: '/app/lib/features/profile', purpose: 'Student identity.' }
    ]
  }
];
