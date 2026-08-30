import { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Handle,
  Position
} from '@xyflow/react';

const AppNode = ({ data }: any) => (
  <div className="bg-card border-2 border-primary rounded-lg p-4 shadow-lg text-center w-40">
    <div className="font-bold text-sm text-foreground">{data.label}</div>
    <div className="text-xs text-muted-foreground mt-1">{data.tech}</div>
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-primary" />
  </div>
);

const ServiceNode = ({ data }: any) => (
  <div className="bg-muted border border-border rounded-xl p-4 shadow-sm text-center w-64">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-muted-foreground" />
    <div className="font-bold text-sm text-foreground mb-4 border-b border-border pb-2">{data.label}</div>
    <div className="flex gap-2 justify-center">
      <div className="text-xs bg-card border border-border px-2 py-1 rounded">REST API</div>
      <div className="text-xs bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-1 rounded">Judge</div>
      <div className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded">Metronome</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-muted-foreground" />
  </div>
);

const DatabaseNode = ({ data }: any) => (
  <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-lg p-4 shadow-lg text-center w-48">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-emerald-500" />
    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{data.label}</div>
    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400/70 mt-1">{data.tech}</div>
  </div>
);

const nodeTypes = {
  app: AppNode,
  service: ServiceNode,
  database: DatabaseNode
};

export default function ArchitectureGraph() {
  const nodes = useMemo(() => [
    { id: 'student', type: 'app', position: { x: 50, y: 50 }, data: { label: '📱 Student App', tech: 'Flutter / Dart' } },
    { id: 'portal', type: 'app', position: { x: 250, y: 50 }, data: { label: '👨‍🏫 Teacher Portal', tech: 'React / Vite' } },
    { id: 'admin', type: 'app', position: { x: 450, y: 50 }, data: { label: '🛠️ Admin Console', tech: 'React / Vite' } },
    { id: 'gateway', type: 'service', position: { x: 200, y: 250 }, data: { label: 'Attendance Gateway' } },
    { id: 'db', type: 'database', position: { x: 240, y: 450 }, data: { label: 'PostgreSQL', tech: 'Self-Hosted Supabase' } }
  ], []);

  const edges = useMemo(() => [
    { id: 'e1', source: 'student', target: 'gateway', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e2', source: 'portal', target: 'gateway', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e3', source: 'admin', target: 'gateway', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e4', source: 'gateway', target: 'db', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } }
  ], []);

  return (
    <div className="w-full h-[500px] border border-border rounded-xl overflow-hidden bg-background/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-zinc-950/20"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Controls showInteractive={false} className="bg-card border-border fill-foreground" />
        <Background color="#52525b" gap={16} />
      </ReactFlow>
    </div>
  );
}
