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
  type Edge,
  type Node as FlowNode,
  MarkerType
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
  const initialNodes: FlowNode[] = useMemo(() => {
    return tables.map((t, idx) => ({
      id: t.name,
      type: 'tableNode',
      position: { x: (idx % 4) * 350, y: Math.floor(idx / 4) * 300 },
      data: { table: t, isSelected: t.name === selectedTable },
    }));
  }, [selectedTable]);

  const initialEdges = useMemo(() => {
    const edges: Edge[] = [];
    tables.forEach(table => {
      table.columns.filter(c => c.key === 'FK' && c.references).forEach(fk => {
        const [refTable, refCol] = fk.references!.split('(');
        const refTableName = refTable.trim();
        const refColName = refCol.replace(')', '').trim();
        
        const isSelectedEdge = selectedTable === table.name || selectedTable === refTableName;
        edges.push({
          id: `e-${table.name}-${refTableName}`,
          source: table.name,
          target: refTableName,
          label: `${fk.name} → ${refColName}`,
          animated: isSelectedEdge,
          markerEnd: { type: MarkerType.ArrowClosed, color: isSelectedEdge ? '#3b82f6' : '#52525b' },
          style: { 
            stroke: isSelectedEdge ? '#3b82f6' : '#52525b', 
            strokeWidth: isSelectedEdge ? 2 : 1 
          },
          labelStyle: { fill: isSelectedEdge ? '#3b82f6' : '#a1a1aa', fontWeight: 600, fontSize: 10 },
          labelBgStyle: { fill: '#18181b', stroke: '#27272a' },
        });
      });
    });
    return edges;
  }, [selectedTable]);

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

  useEffect(() => {
    setEdges((eds) =>
      eds.map((e) => {
        const isSelectedEdge = selectedTable === e.source || selectedTable === e.target;
        return {
          ...e,
          animated: isSelectedEdge,
          style: {
            stroke: isSelectedEdge ? '#3b82f6' : '#52525b',
            strokeWidth: isSelectedEdge ? 2 : 1
          },
          labelStyle: { fill: isSelectedEdge ? '#3b82f6' : '#a1a1aa', fontWeight: 600, fontSize: 10 },
        };
      })
    );
  }, [selectedTable, setEdges]);

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
