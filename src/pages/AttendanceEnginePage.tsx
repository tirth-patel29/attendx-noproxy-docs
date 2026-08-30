import { QrCode, Smartphone, Cpu, LockKeyhole, Server, Database, CheckCircle2 } from 'lucide-react';

export default function AttendanceEnginePage() {
  const steps = [
    {
      id: 1,
      actor: "Teacher Portal",
      title: "Initiate Session",
      desc: "Teacher selects a Course Session and clicks 'Start'. The Portal opens a secure WebSocket to the Gateway.",
      icon: <Server size={24} />,
      color: "indigo"
    },
    {
      id: 2,
      actor: "The Metronome",
      title: "Token Emission",
      desc: "The backend Metronome service begins emitting 4-character Base62 tokens every 3000ms. The Portal displays these as a rapidly rotating QR code.",
      icon: <QrCode size={24} />,
      color: "indigo"
    },
    {
      id: 3,
      actor: "Student App",
      title: "Biometric Pre-check",
      desc: "The student opens the scanner. The app requests FaceID/TouchID. Without this local biometric assertion, the camera will not activate.",
      icon: <Smartphone size={24} />,
      color: "rose"
    },
    {
      id: 4,
      actor: "Student App",
      title: "Token Capture & Sign",
      desc: "The camera captures the ephemeral token. The local secure enclave signs the token, device_id, and current UTC timestamp using the student's unique HMAC-SHA256 secret.",
      icon: <Cpu size={24} />,
      color: "rose"
    },
    {
      id: 5,
      actor: "The Judge",
      title: "Cryptographic Verification",
      desc: "The Gateway receives the payload. It verifies the HMAC signature. It checks that the transit delta (current_server_time - payload_time) is ≤ 250ms.",
      icon: <LockKeyhole size={24} />,
      color: "amber"
    },
    {
      id: 6,
      actor: "PostgreSQL",
      title: "Ledger Commit",
      desc: "The verified claim is committed to the immutable attendance_ledger table. The WebSocket fires an 'ACK' back to the Teacher Portal.",
      icon: <Database size={24} />,
      color: "emerald"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Attendance Engine</h1>
        <p className="text-muted-foreground">The cryptographic sequence of a zero-trust attendance claim.</p>
      </div>

      <div className="mt-12 relative max-w-3xl mx-auto">
        {/* Vertical Line */}
        <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-border z-0" />

        <div className="space-y-12">
          {steps.map((step) => {
            const colors = {
              indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30',
              rose: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
              amber: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
              emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
            }[step.color];

            return (
              <div key={step.id} className="relative flex items-start gap-8 z-10 group">
                <div className={`w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center border shadow-lg bg-card transition-transform group-hover:scale-105 ${colors}`}>
                  {step.icon}
                </div>
                
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{step.actor}</div>
                  <h3 className="text-xl font-bold mb-2">{step.id}. {step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 flex items-center gap-4 relative z-10 max-w-2xl mx-auto">
          <CheckCircle2 size={32} className="text-emerald-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400">Sequence Complete</h4>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              This entire sequence (Steps 4-6) executes in under ~45ms on average, establishing mathematical proof of physical presence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
