import { tables } from '../data/content/database';
import { apis } from '../data/content/generated-apis';
import { migrations } from '../data/content/generated-migrations';
import SchemaGraph from '../components/SchemaGraph';
import { Database, Search, TableProperties, X, Link2, Terminal, GitBranch } from 'lucide-react';
import { useState } from 'react';

export default function DatabaseExplorerPage() {
  const [selectedTableName, setSelectedTableName] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTable = tables.find(t => t.name === selectedTableName);

  // Find related APIs by checking if the table name is used in the API path or group
  const relatedApis = selectedTable ? apis.filter(api => 
    api.path.includes(selectedTable.name.replace(/s$/, '')) || // match singular
    api.group.includes(selectedTable.name.replace(/s$/, '')) ||
    api.path.includes(selectedTable.name)
  ) : [];

  // Find migration that created this table
  const createdByMigration = selectedTable ? migrations.find(m => m.createdTables.includes(selectedTable.name)) : undefined;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-2">
            <Database className="text-emerald-500" /> Database Explorer
          </h1>
          <p className="text-muted-foreground">Interactive schema diagram driven by actual Postgres migrations.</p>
        </div>
        
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search tables..." 
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
              {tables.filter(t => t.name.includes(searchQuery.toLowerCase())).map(t => (
                <button 
                  key={t.name}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                  onClick={() => {
                    setSelectedTableName(t.name);
                    setSearchQuery('');
                  }}
                >
                  <TableProperties size={14} className="text-emerald-500" /> {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0 relative">
        {/* Graph Area */}
        <div className="flex-1 border border-border rounded-xl bg-card overflow-hidden relative">
          <SchemaGraph onNodeClick={setSelectedTableName} selectedTable={selectedTableName} />
        </div>

        {/* Inspector Panel */}
        {selectedTable && (
          <div className="w-96 border border-border rounded-xl bg-card overflow-y-auto flex-shrink-0 animate-in slide-in-from-right-8 shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/50 sticky top-0 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableProperties size={18} className="text-emerald-500" />
                <h2 className="font-bold uppercase tracking-wider">{selectedTable.name}</h2>
              </div>
              <button onClick={() => setSelectedTableName(undefined)} className="p-1 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-8 flex-1">
              
              {/* Columns */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-1">Columns ({selectedTable.columns.length})</h3>
                <div className="bg-background border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-border">
                      {selectedTable.columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="p-2 font-mono font-medium flex items-center gap-2">
                            {col.isPrimaryKey ? <span title="Primary Key" className="text-amber-500">🔑</span> : col.isForeignKey ? <span title="Foreign Key" className="text-indigo-500">🔗</span> : null}
                            {col.name}
                          </td>
                          <td className="p-2 font-mono text-xs text-muted-foreground">{col.type}</td>
                          <td className="p-2 text-right">
                            {col.isNullable && <span className="bg-muted text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">NULL</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Relationships */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-1 flex items-center gap-2">
                  <Link2 size={14} /> Foreign Keys
                </h3>
                <div className="space-y-2">
                  {selectedTable.columns.filter(c => c.isForeignKey).length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No outgoing foreign keys.</p>
                  )}
                  {selectedTable.columns.filter(c => c.isForeignKey).map((col, idx) => (
                    <div key={idx} className="text-sm flex flex-col gap-1 bg-background border border-border p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-500">{selectedTable.name}.{col.name}</span>
                      </div>
                      <div className="text-muted-foreground">
                        points to <span className="font-mono font-bold text-foreground">{col.referencesTable}.{col.referencesColumn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Used By APIs */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-1 flex items-center gap-2">
                  <Terminal size={14} /> Related APIs
                </h3>
                <div className="space-y-2">
                  {relatedApis.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No direct API routes detected.</p>
                  )}
                  {relatedApis.map((api, idx) => (
                    <div key={idx} className="bg-background border border-border p-2 rounded-md flex items-center gap-3">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border w-12 text-center ${
                        api.method === 'GET' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        api.method === 'POST' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                        api.method === 'DELETE' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {api.method}
                      </span>
                      <code className="font-mono text-xs truncate" title={api.path}>{api.path}</code>
                    </div>
                  ))}
                </div>
              </section>

              {/* Created By Migration */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-1 flex items-center gap-2">
                  <GitBranch size={14} /> Migration Lineage
                </h3>
                {createdByMigration ? (
                  <div className="bg-background border border-border p-3 rounded-lg">
                    <div className="font-mono text-xs font-bold mb-1">{createdByMigration.file}</div>
                    <div className="text-sm text-muted-foreground capitalize">{createdByMigration.purpose}</div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Migration file not resolved.</p>
                )}
              </section>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
