import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Database, Terminal, Shield, Users2, LayoutDashboard, BookOpen } from 'lucide-react';
import { tables } from '../data/content/database';
import { apis } from '../data/content/generated-apis';

type Result = {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  path: string;
};

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : onClose(); // toggle handled by App.tsx
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results: Result[] = [];
  
  if (query.length > 1) {
    const q = query.toLowerCase();
    
    // Search Pages
    const pages = [
      { title: 'Dashboard', path: '/', icon: LayoutDashboard },
      { title: 'Architecture', path: '/architecture', icon: BookOpen },
      { title: 'Database Explorer', path: '/database', icon: Database },
      { title: 'API Reference', path: '/api', icon: Terminal },
      { title: 'Academic Hierarchy', path: '/hierarchy', icon: Users2 },
      { title: 'Security Gates', path: '/security', icon: Shield },
    ];
    pages.forEach(p => {
      if (p.title.toLowerCase().includes(q)) {
        results.push({ id: p.path, title: p.title, subtitle: 'Page', icon: p.icon, path: p.path });
      }
    });

    // Search Tables
    tables.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.columns.some(c => c.name.toLowerCase().includes(q))) {
        results.push({ id: `db-${t.name}`, title: t.name, subtitle: 'Database Table', icon: Database, path: '/database' });
      }
    });

    // Search APIs
    apis.forEach(api => {
      if (api.path.toLowerCase().includes(q) || api.group.toLowerCase().includes(q)) {
        results.push({ id: `api-${api.method}-${api.path}`, title: api.path, subtitle: `API (${api.method})`, icon: Terminal, path: '/api' });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/50">
          <Search size={18} className="text-muted-foreground" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            placeholder="Search docs, APIs, tables..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">ESC</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {query.length <= 1 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search across the system.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {results.slice(0, 15).map((result, idx) => {
                const Icon = result.icon;
                return (
                  <button
                    key={result.id + idx}
                    onClick={() => {
                      navigate(result.path);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate">{result.title}</div>
                      <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
