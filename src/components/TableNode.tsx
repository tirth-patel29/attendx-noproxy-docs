import { Handle, Position } from '@xyflow/react';
import { Database, Key, Link2, Hash, AlignLeft } from 'lucide-react';
import type { TableDefinition } from '../data/models';

type TableNodeProps = {
  data: {
    table: TableDefinition;
    isSelected: boolean;
  };
};

export default function TableNode({ data }: TableNodeProps) {
  const { table, isSelected } = data;

  const getIcon = (type: string) => {
    if (type.includes('uuid')) return <Hash size={12} className="text-muted-foreground" />;
    if (type.includes('timestamp')) return <Hash size={12} className="text-muted-foreground" />;
    if (type.includes('varchar') || type.includes('text')) return <AlignLeft size={12} className="text-muted-foreground" />;
    return <Hash size={12} className="text-muted-foreground" />;
  };

  return (
    <div className={`bg-card rounded-xl border-2 shadow-xl w-72 overflow-hidden transition-colors ${isSelected ? 'border-primary ring-4 ring-primary/20' : 'border-border hover:border-primary/50'}`}>
      
      {/* Target handle for incoming relationships (top) */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary" />
      
      {/* Header */}
      <div className="bg-muted/50 p-3 border-b border-border flex items-center gap-2">
        <Database size={16} className="text-blue-500" />
        <span className="font-bold text-sm text-foreground">{table.name}</span>
      </div>

      {/* Columns */}
      <div className="flex flex-col divide-y divide-border/50 bg-background">
        {table.columns.map((col, idx) => (
          <div key={idx} className="flex items-center justify-between px-3 py-2 text-xs hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex items-center gap-1 w-8 flex-shrink-0">
                {col.isPrimaryKey ? (
                  <Key size={14} className="text-amber-500" title="Primary Key" />
                ) : col.isForeignKey ? (
                  <Link2 size={14} className="text-indigo-500" title="Foreign Key" />
                ) : (
                  <span className="w-3" />
                )}
                {col.isUnique && <span className="w-1.5 h-1.5 rotate-45 bg-rose-500 rounded-sm" title="Unique" />}
              </div>
              <span className="font-mono font-medium truncate">{col.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground ml-2 flex-shrink-0">
              <span className="font-mono text-[10px] uppercase">{col.type}</span>
              {col.isNullable && <span className="bg-muted px-1 rounded text-[9px] border border-border">NULL</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Source handle for outgoing relationships (bottom) */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500" />
    </div>
  );
}
