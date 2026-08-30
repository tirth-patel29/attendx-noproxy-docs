import { GitBranch, GitMerge, GitPullRequest, Search, TerminalSquare, AlertCircle } from 'lucide-react';

export default function DevelopmentPage() {
  const errors = [
    { code: 'ENOTFOUND supabase-db', cause: 'Local docker network is down or missing the supabase container.', fix: 'Run docker-compose up -d in the supabase directory.' },
    { code: 'ECONNREFUSED 127.0.0.1:5432', cause: 'Postgres is not accepting connections.', fix: 'Verify database URL in .env and ensure Postgres is running.' },
    { code: '401 Unauthorized', cause: 'JWT is expired, malformed, or missing.', fix: 'Clear local storage or re-login to retrieve a fresh token.' },
    { code: 'Academic hierarchy failure', cause: 'Missing parent references (e.g., Division mapped to non-existent Branch).', fix: 'Run the seed scripts in order: 009_seed_academic_hierarchy.sql.' },
    { code: 'Portal TypeScript errors', cause: 'Type definitions out of sync with backend.', fix: 'Re-generate the API client types using OpenAPI generator.' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Development Workflow</h1>
        <p className="text-muted-foreground">CI/CD pipelines, Git lifecycle, and Troubleshooting guide.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Troubleshooting */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-border pb-2">
            <AlertCircle className="text-rose-500" /> Common Errors
          </h2>
          <div className="space-y-4">
            {errors.map((e, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <div className="font-mono text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded inline-block mb-2">
                  {e.code}
                </div>
                <div className="text-sm font-semibold mb-1">Cause</div>
                <p className="text-sm text-muted-foreground mb-3">{e.cause}</p>
                <div className="text-sm font-semibold mb-1">Fix</div>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{e.fix}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CI/CD and Git */}
        <div className="space-y-12">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-border pb-2">
              <TerminalSquare className="text-indigo-500" /> Git Workflow
            </h2>
            <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center"><GitBranch size={20} /></div>
                  <div>
                    <h3 className="font-bold text-sm">1. Feature Branch</h3>
                    <p className="text-xs text-muted-foreground">git checkout -b feature/name</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center"><GitPullRequest size={20} /></div>
                  <div>
                    <h3 className="font-bold text-sm">2. Pull Request</h3>
                    <p className="text-xs text-muted-foreground">Automated tests run in Gitea Actions.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><GitMerge size={20} /></div>
                  <div>
                    <h3 className="font-bold text-sm">3. Merge & Deploy</h3>
                    <p className="text-xs text-muted-foreground">Merged to main. Auto-deployed to AWS.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-border pb-2">
              <Search className="text-emerald-500" /> Environment Variables
            </h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden text-sm">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-3 font-semibold">Variable</th>
                    <th className="p-3 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 font-mono text-xs">DATABASE_URL</td>
                    <td className="p-3 text-muted-foreground">PostgreSQL connection string</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">JWT_SECRET</td>
                    <td className="p-3 text-muted-foreground">Signing key for Admin/Student tokens</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">PORT</td>
                    <td className="p-3 text-muted-foreground">Backend API listening port (default: 3000)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
