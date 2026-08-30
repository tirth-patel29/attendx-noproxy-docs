import { useState } from 'react';
import { tables } from '../data/content/database';
import { Database, Key, TableProperties, ArrowRight } from 'lucide-react';

export default function DatabaseExplorerPage() {
  const [selectedTable, setSelectedTable] = useState(tables[0]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Database Explorer</h1>
        <p className="text-muted-foreground">Interactive schema viewer for the AttendX Postgres database.</p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Table List Sidebar */}
        <div className="w-64 border border-border rounded-lg bg-card overflow-y-auto">
          <div className="p-3 border-b border-border bg-muted/50 sticky top-0">
            <h3 className="font-semibold text-sm">Tables</h3>
          </div>
          <div className="p-2 space-y-1">
            {tables.map(table => (
              <button
                key={table.name}
                onClick={() => setSelectedTable(table)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${selectedTable.name === table.name ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                <TableProperties size={16} className={selectedTable.name === table.name ? "opacity-100" : "opacity-70"} />
                {table.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table Details */}
        <div className="flex-1 border border-border rounded-lg bg-card overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedTable.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono border border-border">
                    {selectedTable.columns.length} columns
                  </span>
                  {selectedTable.migrationHistory && (
                    <span className="text-xs bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded border border-indigo-500/20">
                      Defined in: {selectedTable.migrationHistory[selectedTable.migrationHistory.length - 1]}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">{selectedTable.purpose}</p>
          </div>

          <div className="p-0 flex-1 overflow-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold text-muted-foreground border-b border-border">Column</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground border-b border-border">Type</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground border-b border-border">Constraints</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground border-b border-border">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedTable.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium flex items-center gap-2">
                      {col.name}
                      {col.key === 'PK' && <Key size={14} className="text-amber-500" />}
                      {col.key === 'FK' && <ArrowRight size={14} className="text-blue-500" />}
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">{col.type}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {col.key === 'PK' && <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded border border-amber-500/20">Primary Key</span>}
                        {col.key === 'FK' && <span className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded border border-blue-500/20">Foreign Key</span>}
                        {col.key === 'UK' && <span className="text-[10px] uppercase font-bold bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded border border-purple-500/20">Unique</span>}
                        {!col.nullable && <span className="text-[10px] uppercase font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">Not Null</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {col.description || (col.references ? `References ${col.references}` : '—')}
                      {col.default && <div className="mt-1 font-mono text-xs opacity-70">Default: {col.default}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
