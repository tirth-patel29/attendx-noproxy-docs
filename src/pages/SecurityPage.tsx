import { Fingerprint, Cpu, Timer, LockKeyhole, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Zero-Trust Architecture</h1>
        <p className="text-muted-foreground">The 4-Gate security model preventing proxy attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gate 1 */}
        <div className="bg-card border-2 border-border hover:border-indigo-500/50 transition-colors rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -z-10 group-hover:bg-indigo-500/10 transition-colors" />
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center mb-4">
            <Cpu size={24} />
          </div>
          <h3 className="text-lg font-bold mb-2">Gate 1: Hardware Tattoo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Cryptographic device binding. The student's device generates a unique hardware signature upon first login.
            Subsequent attempts from unmapped hardware are rejected outright by the Gateway.
          </p>
          <div className="text-xs font-mono bg-muted px-2 py-1 rounded inline-block text-muted-foreground">
            device_id_hash
          </div>
        </div>

        {/* Gate 2 */}
        <div className="bg-card border-2 border-border hover:border-rose-500/50 transition-colors rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full -z-10 group-hover:bg-rose-500/10 transition-colors" />
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-lg flex items-center justify-center mb-4">
            <Fingerprint size={24} />
          </div>
          <h3 className="text-lg font-bold mb-2">Gate 2: Flesh Lock</h3>
          <p className="text-sm text-muted-foreground mb-4">
            OS-level biometric assertion. The client app requests FaceID / TouchID. The local secure enclave signs the intent 
            before the payload can be constructed.
          </p>
          <div className="text-xs font-mono bg-muted px-2 py-1 rounded inline-block text-muted-foreground">
            LocalAuth
          </div>
        </div>

        {/* Gate 3 */}
        <div className="bg-card border-2 border-border hover:border-amber-500/50 transition-colors rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -z-10 group-hover:bg-amber-500/10 transition-colors" />
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center mb-4">
            <Timer size={24} />
          </div>
          <h3 className="text-lg font-bold mb-2">Gate 3: Micro-Twitch Token</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The Metronome service emits ephemeral 4-character Base62 tokens every 3000ms. A captured token is only valid 
            for the exact temporal window it was minted in.
          </p>
          <div className="text-xs font-mono bg-muted px-2 py-1 rounded inline-block text-muted-foreground">
            token_val & TTL
          </div>
        </div>

        {/* Gate 4 */}
        <div className="bg-card border-2 border-border hover:border-emerald-500/50 transition-colors rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:bg-emerald-500/10 transition-colors" />
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center mb-4">
            <LockKeyhole size={24} />
          </div>
          <h3 className="text-lg font-bold mb-2">Gate 4: HMAC-SHA256 Time-Sync</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The final payload is cryptographically signed using a client-specific secret. The Judge evaluates the signature 
            and enforces a strict network transit delta (≤ 250ms).
          </p>
          <div className="text-xs font-mono bg-muted px-2 py-1 rounded inline-block text-muted-foreground">
            hmac_signature
          </div>
        </div>
      </div>

      <div className="mt-12 bg-rose-500/5 border border-rose-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-4">
          <AlertTriangle size={20} /> Attack Vector Analysis
        </h2>
        <div className="space-y-4">
          <div className="bg-background border border-border p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-1 text-foreground">Vector: Replay Attack (Screenshot sharing)</h4>
            <p className="text-sm text-muted-foreground">
              Mitigation: Gate 3 rotates the token before the screenshot can be transmitted via WhatsApp/Telegram.
            </p>
          </div>
          <div className="bg-background border border-border p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-1 text-foreground">Vector: Spoofed API Request (cURL/Postman)</h4>
            <p className="text-sm text-muted-foreground">
              Mitigation: Gate 4 requires the payload to be signed with the HMAC secret stored in the secure enclave. Even if the secret is extracted, the 250ms time-sync window makes manual forging impossible.
            </p>
          </div>
          <div className="bg-background border border-border p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-1 text-foreground">Vector: Giving phone to a friend</h4>
            <p className="text-sm text-muted-foreground">
              Mitigation: Gate 2 requires the actual owner's biometric scan to authorize the signature sequence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
