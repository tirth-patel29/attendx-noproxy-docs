import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  type Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { tables } from '../data/content/database';
import { Key } from 'lucide-react';

const TableNode = ({ data }: any) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden w-64 font-sans text-sm">
      <div className="bg-muted/80 p-2 font-bold border-b border-border text-foreground flex justify-between items-center">
        {data.label}
        <span className="text-[10px] font-normal bg-background px-1.5 py-0.5 rounded border border-border text-muted-foreground">{data.columns.length} cols</span>
      </div>
      <div className="p-0">
        {data.columns.map((col: any) => (
          <div key={col.name} className="flex justify-between items-center py-1.5 px-2 border-b border-border last:border-b-0 hover:bg-muted/30">
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {col.key === 'PK' ? <Key size={12} className="text-amber-500" /> : col.key === 'FK' ? <Key size={12} className="text-blue-500" /> : <div className="w-3" />}
              <span className={col.key === 'PK' ? 'font-bold' : ''}>{col.name}</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{col.type}</span>
          </div>
        ))}
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2 rounded-full bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 rounded-full bg-blue-500" />
    </div>
  );
};

const nodeTypes = {
  tableNode: TableNode,
};

type SchemaGraphProps = {
  onNodeClick?: (tableName: string) => void;
  selectedTable?: string;
};

export default function SchemaGraph({ onNodeClick, selectedTable }: SchemaGraphProps) {
  const initialNodes: Node[] = useMemo(() => {
    return tables.map((t, idx) => ({
      id: t.name,
      type: 'tableNode',
      position: { x: (idx % 4) * 350, y: Math.floor(idx / 4) * 300 },
      data: { table: t, isSelected: t.name === selectedTable },
    }));
  }, [selectedTable]);

  const initialEdges = useMemo(() => {
    const edges: Edge[] = [];
    tables.forEach(t => {
      t.columns.forEach(c => {
        if (c.key === 'FK' && c.references) {
          const targetTable = c.references.split('(')[0];
          edges.push({
            id: `e-${t.name}-${c.name}-${targetTable}`,
            source: targetTable,
            target: t.name,
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
          });
        }
      });
    });
    return edges;
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes((nds) => 
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: n.id === selectedTable
        }
      }))
    );
  }, [selectedTable, setNodes]);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="w-full h-full bg-background/50 border border-border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeClick && onNodeClick(node.id)}
        nodeTypes={nodeTypes}
        fitView
        className="bg-zinc-950/20"
      >
        <Controls className="bg-card border-border fill-foreground" />
        <MiniMap nodeStrokeColor={() => '#3b82f6'} nodeColor={() => '#18181b'} maskColor="rgba(0,0,0,0.5)" className="bg-card border-border" />
        <Background color="#52525b" gap={16} />
      </ReactFlow>
    </div>
  );
}
