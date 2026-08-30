import { Server, Cloud, ArrowRight, ArrowDown } from 'lucide-react';

export default function DeploymentPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Deployment Architecture</h1>
        <p className="text-muted-foreground">The evolution of AttendX from self-hosted Homelab to AWS Production.</p>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Phase 1: Homelab */}
        <div className="w-full md:w-1/2 p-8 rounded-xl border-2 border-border bg-card/50 flex flex-col items-center text-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Server size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Phase 1</h2>
          <h3 className="text-xl font-bold mb-2">Self-Hosted Homelab</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Development and initial testing phase spanning ~6 months. Ran entirely on local bare-metal hardware.
          </p>
          <div className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
            Local Network • Docker Swarm
          </div>
        </div>

        {/* Transition Arrow */}
        <div className="hidden md:flex flex-col items-center text-muted-foreground">
          <ArrowRight size={32} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-2">Migrated</span>
        </div>
        <div className="flex md:hidden flex-col items-center text-muted-foreground">
          <ArrowDown size={32} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-2">Migrated</span>
        </div>

        {/* Phase 2: AWS */}
        <div className="w-full md:w-1/2 p-8 rounded-xl border-2 border-blue-500/50 bg-blue-500/5 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-4 relative z-10">
            <Cloud size={32} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 mb-1 relative z-10">Phase 2 (Current)</h2>
          <h3 className="text-xl font-bold mb-2 relative z-10">AWS Production</h3>
          <p className="text-sm text-muted-foreground mb-4 relative z-10">
            Highly available cloud infrastructure utilizing managed database services and load-balanced API gateways.
          </p>
          <div className="flex flex-col gap-2 w-full relative z-10">
            <div className="bg-background border border-border p-2 rounded text-xs font-mono text-left flex justify-between items-center">
              <span>API Gateway</span>
              <span className="text-blue-500 font-bold">api.atmyhome.tech</span>
            </div>
            <div className="bg-background border border-border p-2 rounded text-xs font-mono text-left flex justify-between items-center">
              <span>Teacher Portal</span>
              <span className="text-blue-500 font-bold">portal.atmyhome.tech</span>
            </div>
            <div className="bg-background border border-border p-2 rounded text-xs font-mono text-left flex justify-between items-center">
              <span>Admin Portal</span>
              <span className="text-blue-500 font-bold">admin.atmyhome.tech</span>
            </div>
            <div className="bg-background border border-border p-2 rounded text-xs font-mono text-left flex justify-between items-center">
              <span>PostgreSQL</span>
              <span className="text-blue-500 font-bold">supabase.atmyhome.tech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
