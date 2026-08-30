import ArchitectureGraph from '../components/ArchitectureGraph';

export default function ArchitecturePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">System Architecture</h1>
        <p className="text-muted-foreground">The real-time services powering the zero-trust attendance flow.</p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <ArchitectureGraph />

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
