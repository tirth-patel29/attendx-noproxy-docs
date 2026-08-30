import { apis } from '../data/content/generated-apis';
import { Lock, FileJson } from 'lucide-react';

const MethodBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    POST: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    PUT: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    DELETE: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  };
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${colors[method] || 'bg-muted text-muted-foreground'} w-14 text-center inline-block`}>
      {method}
    </span>
  );
};

export default function ApiReferencePage() {
  const groupedApis = apis.reduce((acc, api) => {
    if (!acc[api.group]) acc[api.group] = [];
    acc[api.group].push(api);
    return acc;
  }, {} as Record<string, typeof apis>);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">API Reference</h1>
        <p className="text-muted-foreground">Comprehensive reconciliation of the internal and external REST API endpoints across the AttendX backend.</p>
      </div>

      <div className="space-y-12 mt-8">
        {Object.entries(groupedApis).map(([group, groupApis]) => (
          <div key={group} className="space-y-4">
            <h2 className="text-xl font-bold border-b border-border pb-2 capitalize flex items-center gap-2">
              <FileJson className="w-5 h-5 text-muted-foreground" />
              {group} APIs
              <span className="text-xs font-mono font-normal text-muted-foreground ml-auto bg-muted px-2 py-0.5 rounded">backend/src/routes/{group}.ts</span>
            </h2>
            
            <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm divide-y divide-border">
              {groupApis.map((api, idx) => (

                <div key={idx} className="p-4 flex flex-col gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <MethodBadge method={api.method} />
                      <code className="font-mono font-bold text-sm text-foreground">{api.path}</code>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs font-medium bg-muted/50 px-2 py-1 rounded border border-border text-muted-foreground w-fit justify-end">
                      <Lock size={12} />
                      {api.security}
                    </div>
                  </div>

                  {/* Backend Trace visualizer */}
                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Request Trace</h3>
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 px-3 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-xs font-mono font-bold">
                        API Gateway
                      </div>
                      <div className="h-0.5 w-4 bg-border flex-shrink-0" />
                      
                      <div className="flex-shrink-0 flex items-center justify-center h-8 px-3 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-mono">
                        src/routes/{api.group}.ts
                      </div>
                      <div className="h-0.5 w-4 bg-border flex-shrink-0" />
                      
                      <div className="flex-shrink-0 flex items-center justify-center h-8 px-3 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-mono">
                        {api.security.length > 0 ? 'auth.middleware.ts' : 'public'}
                      </div>
                      <div className="h-0.5 w-4 bg-border flex-shrink-0" />
                      
                      <div className="flex-shrink-0 flex items-center justify-center h-8 px-3 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-mono">
                        {api.group}.service.ts
                      </div>
                      <div className="h-0.5 w-4 bg-border flex-shrink-0" />
                      
                      <div className="flex-shrink-0 flex items-center justify-center h-8 px-3 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono font-bold">
                        DB Table
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
