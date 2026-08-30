import { apps } from '../data/content/generated-apps';
import { Smartphone, MonitorPlay, Settings2, AppWindow, Code2 } from 'lucide-react';

export default function ApplicationsPage() {
  const getIcon = (name: string) => {
    if (name.includes('Admin')) return <Settings2 size={24} className="text-amber-500" />;
    if (name.includes('Portal') || name.includes('Teacher')) return <MonitorPlay size={24} className="text-indigo-500" />;
    return <Smartphone size={24} className="text-emerald-500" />;
  };

  const getBadgeColor = (name: string) => {
    if (name.includes('Admin')) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    if (name.includes('Portal') || name.includes('Teacher')) return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
    return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Applications</h1>
        <p className="text-muted-foreground">The three independent clients connecting to the AttendX gateway.</p>
      </div>

      <div className="space-y-8 mt-8">
        {apps.map((app) => (
          <div key={app.name} className="border border-border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col md:flex-row">
            {/* App Sidebar Info */}
            <div className="w-full md:w-72 bg-muted/30 p-6 border-b md:border-b-0 md:border-r border-border">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${getBadgeColor(app.name)}`}>
                {getIcon(app.name)}
              </div>
              <h2 className="text-xl font-bold mb-2">{app.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{app.purpose}</p>
              
              <div className="space-y-3 mt-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tech Stack</div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Code2 size={16} className="text-muted-foreground" /> {app.techStack}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Production URL</div>
                  <div className="font-mono text-xs break-all bg-background border border-border p-2 rounded">
                    {app.url}
                  </div>
                </div>
              </div>
            </div>

            {/* Pages Grid */}
            <div className="flex-1 p-6 bg-card">
              <h3 className="font-semibold flex items-center gap-2 mb-4 text-foreground border-b border-border pb-2">
                <AppWindow size={18} className="text-muted-foreground" /> Application Pages ({app.pages.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {app.pages.map((page, idx) => (
                  <div key={idx} className="p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors group">
                    <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{page.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{page.purpose}</p>
                    <div className="text-[10px] font-mono bg-muted text-muted-foreground px-2 py-1 rounded border border-border truncate" title={page.path}>
                      {page.path}
                    </div>
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
