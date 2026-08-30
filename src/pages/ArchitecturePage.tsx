export default function ArchitecturePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">System Architecture</h1>
        <p className="text-muted-foreground">The real-time services powering the zero-trust attendance flow.</p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <div className="bg-card border border-border rounded-xl p-8 my-8 flex justify-center">
          <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
            {/* Top Row: Clients */}
            <div className="flex justify-between w-full gap-4">
              <div className="flex-1 bg-primary text-primary-foreground p-4 rounded-lg shadow text-center border border-primary/20">
                <span className="font-bold text-sm block">📱 Student App</span>
                <span className="text-xs opacity-80 mt-1 block">Flutter / Dart</span>
              </div>
              <div className="flex-1 bg-card text-card-foreground p-4 rounded-lg shadow text-center border border-border">
                <span className="font-bold text-sm block">👨‍🏫 Teacher Portal</span>
                <span className="text-xs text-muted-foreground mt-1 block">React / TS</span>
              </div>
              <div className="flex-1 bg-card text-card-foreground p-4 rounded-lg shadow text-center border border-border">
                <span className="font-bold text-sm block">🛠️ Admin Portal</span>
                <span className="text-xs text-muted-foreground mt-1 block">React / TS</span>
              </div>
            </div>

            {/* Down Arrows */}
            <div className="flex justify-between w-full px-12">
              <div className="w-px h-8 bg-border"></div>
              <div className="w-px h-8 bg-border"></div>
              <div className="w-px h-8 bg-border"></div>
            </div>

            {/* Middle Row: Gateway */}
            <div className="w-full bg-muted border border-border rounded-xl p-6">
              <div className="text-center mb-6">
                <span className="font-bold tracking-widest uppercase text-xs text-muted-foreground">Attendance Gateway (Node.js)</span>
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex-1 bg-card border border-border p-4 rounded-lg text-center shadow-sm">
                  <span className="font-semibold text-sm">🌐 REST API</span>
                </div>
                <div className="flex-1 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg text-center shadow-sm text-indigo-600 dark:text-indigo-400">
                  <span className="font-semibold text-sm">⚖️ The Judge</span>
                </div>
                <div className="flex-1 bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center shadow-sm text-amber-600 dark:text-amber-400">
                  <span className="font-semibold text-sm">⏱️ Metronome</span>
                </div>
              </div>
            </div>

            {/* Down Arrows */}
            <div className="w-px h-8 bg-border"></div>

            {/* Bottom Row: DB */}
            <div className="w-full max-w-sm bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl text-center shadow-sm">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-lg mb-1">🗄️ PostgreSQL</span>
              <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-wider font-semibold">Self-Hosted Supabase</span>
            </div>
          </div>
        </div>

        <h3>The Metronome</h3>
        <p>
          The Metronome is a dedicated service running on the Node.js backend. It maintains a <code>setInterval</code> loop that triggers every 3 seconds for active sessions.
          It mints ephemeral Base62 tokens and broadcasts them to the Teacher Portal via WebSockets.
        </p>

        <h3>The Judge</h3>
        <p>
          When a student claims attendance, they bypass normal REST endpoints and hit the Judge. The Judge verifies:
        </p>
        <ul>
          <li><strong>Gate 1 (Hardware):</strong> <code>bound_device_id</code> matches.</li>
          <li><strong>Gate 2 (Biometric):</strong> Claim is asserted by OS-level FaceID/TouchID.</li>
          <li><strong>Gate 4 (Cryptography):</strong> The HMAC-SHA256 signature matches the payload.</li>
          <li><strong>Gate 4 (Time):</strong> The <code>verification_delta_ms</code> is ≤ 250ms.</li>
        </ul>
      </div>
    </div>
  );
}
