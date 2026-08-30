import { apis } from '../data/content/apis';
import { Lock, Code2 } from 'lucide-react';

const MethodBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    POST: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    PUT: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    DELETE: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  };
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${colors[method] || 'bg-muted text-muted-foreground'}`}>
      {method}
    </span>
  );
};

export default function ApiReferencePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">API Reference</h1>
        <p className="text-muted-foreground">REST endpoints powering the AttendX gateway.</p>
      </div>

      <div className="space-y-8 mt-8">
        {apis.map((api, idx) => (
          <div key={idx} className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <MethodBadge method={api.method} />
              <code className="font-mono font-bold text-sm">{api.path}</code>
              <div className="ml-auto flex items-center gap-2 text-xs font-medium bg-muted px-2 py-1 rounded border border-border text-muted-foreground">
                <Lock size={12} />
                {api.authentication}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-foreground">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{api.purpose}</p>
                </div>

                {api.relatedTables && api.relatedTables.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-foreground">Touches Tables</h4>
                    <div className="flex flex-wrap gap-2">
                      {api.relatedTables.map(t => (
                        <span key={t} className="text-xs bg-muted border border-border px-2 py-1 rounded-md font-mono text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {api.requestBody && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      <Code2 size={16} className="text-muted-foreground" /> Request Body
                    </div>
                    <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-zinc-800">
                      <code>{api.requestBody}</code>
                    </pre>
                  </div>
                )}
                
                {api.responses.map((res, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      <div className={`w-2 h-2 rounded-full ${res.status < 400 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      Response {res.status} <span className="text-muted-foreground font-normal">({res.description})</span>
                    </div>
                    {res.body && (
                      <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-zinc-800">
                        <code>{res.body}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
