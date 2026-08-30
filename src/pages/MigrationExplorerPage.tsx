import { migrations } from '../data/content/generated-migrations';
import { Database, Plus, RefreshCw, FileCode2 } from 'lucide-react';
import { useState } from 'react';

export default function MigrationExplorerPage() {
  const [selectedMigration, setSelectedMigration] = useState(migrations[migrations.length - 1]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Migration Explorer</h1>
        <p className="text-muted-foreground">Trace the immutable evolution of the AttendX PostgreSQL schema.</p>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-6 min-h-0 mt-8">
        {/* Timeline Sidebar */}
        <div className="w-full md:w-80 border border-border rounded-xl bg-card overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-border bg-muted/50 sticky top-0 z-10">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <RefreshCw size={16} /> Migration History
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {migrations.map((mig, idx) => (
              <div key={mig.file} className="relative pl-6">
                {/* Timeline line */}
                {idx !== migrations.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-border" />
                )}
                {/* Timeline node */}
                <div 
                  className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 flex items-center justify-center cursor-pointer transition-colors ${selectedMigration.file === mig.file ? 'border-card bg-emerald-500 z-10 ring-2 ring-emerald-500/50' : 'border-card bg-muted-foreground z-10'}`}
                  onClick={() => setSelectedMigration(mig)}
                />
                
                <div 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedMigration.file === mig.file ? 'bg-primary/5 border-primary/30' : 'bg-background border-border hover:bg-muted'}`}
                  onClick={() => setSelectedMigration(mig)}
                >
                  <div className="font-mono text-xs font-bold text-muted-foreground mb-1">
                    {mig.file.split('_')[0]}
                  </div>
                  <div className="font-semibold text-sm text-foreground capitalize mb-2">
                    {mig.purpose}
                  </div>
                  <div className="flex gap-2">
                    {mig.createdTables.length > 0 && (
                      <span className="text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded">
                        +{mig.createdTables.length} Tables
                      </span>
                    )}
                    {mig.insertedTables.length > 0 && (
                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded">
                        Seed Data
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        <div className="flex-1 border border-border rounded-xl bg-card overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border bg-muted/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <FileCode2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold font-mono">{selectedMigration.file}</h2>
                <div className="text-sm text-muted-foreground capitalize mt-1">
                  {selectedMigration.purpose} • {(selectedMigration.contentLength / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-8">
            {selectedMigration.createdTables.length > 0 && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4 text-foreground border-b border-border pb-2">
                  <Database size={18} className="text-blue-500" /> Tables Created
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedMigration.createdTables.map(t => (
                    <div key={t} className="p-3 bg-background border border-border rounded-lg flex items-center gap-3 group hover:border-primary/50 transition-colors">
                      <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Plus size={16} />
                      </div>
                      <span className="font-mono text-sm font-semibold">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMigration.insertedTables.length > 0 && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4 text-foreground border-b border-border pb-2">
                  <Database size={18} className="text-amber-500" /> Tables Seeded
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedMigration.insertedTables.map(t => (
                    <div key={t} className="p-3 bg-background border border-border rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                        SQL
                      </div>
                      <span className="font-mono text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMigration.createdTables.length === 0 && selectedMigration.insertedTables.length === 0 && (
              <div className="text-center p-12 text-muted-foreground border border-dashed border-border rounded-xl">
                This migration modifies existing schemas without creating new tables or inserting new seed data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
