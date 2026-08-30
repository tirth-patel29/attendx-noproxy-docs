import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Edge,
  type Node as FlowNode,
  MarkerType,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { tables } from '../data/content/database';
import TableNode from './TableNode';
import dagre from 'dagre';
import type { DatabaseTable } from '../data/models';

const nodeTypes = {
  tableNode: TableNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: FlowNode[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 200 });

  nodes.forEach((node) => {
    // We are estimating the size of the node here because dagre needs it.
    // TableNode width is roughly 288px (w-72) and height depends on columns.
    const tableData = node.data.table as DatabaseTable;
    const height = 48 + (tableData.columns.length * 32); 
    dagreGraph.setNode(node.id, { width: 288, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = { ...node };

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    newNode.position = {
      x: nodeWithPosition.x - nodeWithPosition.width / 2,
      y: nodeWithPosition.y - nodeWithPosition.height / 2,
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

type SchemaGraphProps = {
  onNodeClick?: (tableName: string) => void;
  selectedTable?: string;
  tablesToRender?: DatabaseTable[];
};

export default function SchemaGraph({ onNodeClick, selectedTable, tablesToRender = tables }: SchemaGraphProps) {
  const { fitView } = useReactFlow();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nds: FlowNode[] = tablesToRender.map((t) => ({
      id: t.name,
      type: 'tableNode',
      position: { x: 0, y: 0 },
      data: { table: t, isSelected: t.name === selectedTable },
    }));

    const eds: Edge[] = [];
    tablesToRender.forEach(table => {
      table.columns.filter(c => c.key === 'FK' && c.references).forEach(fk => {
        const [refTable, refCol] = fk.references!.split('(');
        const refTableName = refTable.trim();
        const refColName = refCol.replace(')', '').trim();
        
        // Only create edge if the target table is actually in the rendered list
        if (!tablesToRender.find(t => t.name === refTableName)) return;

        const isSelectedEdge = selectedTable === table.name || selectedTable === refTableName;
        eds.push({
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

    return getLayoutedElements(nds, eds);
  }, [tablesToRender, selectedTable]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync when mode changes or table selection changes
  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    // Fit view after a small delay to allow nodes to render
    setTimeout(() => fitView({ padding: 0.2, duration: 500 }), 50);
  }, [initialNodes, initialEdges, setNodes, setEdges, fitView]);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="w-full h-full bg-background/50 overflow-hidden">
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
