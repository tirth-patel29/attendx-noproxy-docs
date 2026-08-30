import { ArrowRight, Server, Shield, Smartphone, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

import { tables } from '../data/content/database';
import { apis } from '../data/content/generated-apis';
import { apps } from '../data/content/generated-apps';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">AttendX Engineering</h1>
        <p className="text-xl text-muted-foreground">Zero-Trust Attendance Infrastructure</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Backend APIs", value: apis.length, status: "Analyzed" },
          { label: "Database Tables", value: tables.length, status: "Mapped" },
          { label: "Frontend Applications", value: apps.length, status: "Audited" },
          { label: "Architecture Gates", value: "4", status: "Verified" }
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-1 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            <span className="font-mono text-xl font-bold">{stat.value}</span>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{stat.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-border" />

      {/* Modules */}
      <div>
        <h2 className="text-2xl font-bold mb-4">System at a Glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/architecture" className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary transition-all group flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Server size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Architecture</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">Explore the Judge, Metronome, and how the sub-second attendance flow processes requests.</p>
            <div className="flex items-center text-sm font-medium text-blue-500 mt-auto">
              Read docs <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link to="/database" className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary transition-all group flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Database</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">Interactive schema viewer. Explore the 6-tier academic hierarchy and immutable ledger.</p>
            <div className="flex items-center text-sm font-medium text-emerald-500 mt-auto">
              View schema <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link to="/security" className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary transition-all group flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Security</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">How the 4 Gates (Hardware, Biometric, Token, HMAC) defeat spoofing and proxy attacks.</p>
            <div className="flex items-center text-sm font-medium text-rose-500 mt-auto">
              View gates <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
      
      <div className="h-px w-full bg-border" />
      
      {/* Attendance Flow Visual */}
      <div>
        <h2 className="text-2xl font-bold mb-4">How AttendX Works</h2>
        <div className="bg-card border border-border rounded-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-[120px]">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg mb-3">
                <Smartphone size={24} />
              </div>
              <span className="font-semibold text-sm">Student App</span>
              <span className="text-xs text-muted-foreground mt-1">Biometrics & HMAC Signer</span>
            </div>
            
            <div className="hidden md:flex flex-1 items-center">
              <div className="h-[2px] w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-card text-xs font-bold uppercase tracking-wider text-primary border border-border rounded-full py-0.5">
                  &lt; 250ms
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center max-w-[120px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg mb-3">
                <Server size={24} />
              </div>
              <span className="font-semibold text-sm">The Judge</span>
              <span className="text-xs text-muted-foreground mt-1">Verifies Timestamp & Signature</span>
            </div>
            
            <div className="hidden md:flex flex-1 items-center">
              <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500/20 via-indigo-500 to-indigo-500/20 relative" />
            </div>
            
            <div className="flex flex-col items-center text-center max-w-[120px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg mb-3">
                <Database size={24} />
              </div>
              <span className="font-semibold text-sm">Ledger</span>
              <span className="text-xs text-muted-foreground mt-1">Immutable Record</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
