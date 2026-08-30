import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Moon, Sun, BookOpen, Database, Shield, LayoutDashboard, Terminal, Code } from 'lucide-react';
import { useState } from 'react';

// Pages
import Dashboard from './pages/Dashboard';
import DatabaseExplorerPage from './pages/DatabaseExplorerPage';
import ApiReferencePage from './pages/ApiReferencePage';
import ArchitecturePage from './pages/ArchitecturePage';

const SidebarLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
    >
      <Icon size={18} />
      {children}
    </Link>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground min-h-screen flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              AX
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight">AttendX Engineering</h1>
              <p className="text-xs text-muted-foreground">Docs v2.0</p>
            </div>
          </div>
          
          <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">Overview</h2>
              <SidebarLink to="/" icon={LayoutDashboard}>Dashboard</SidebarLink>
              <SidebarLink to="/architecture" icon={BookOpen}>Architecture</SidebarLink>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">Deep Dives</h2>
              <SidebarLink to="/database" icon={Database}>Database & Models</SidebarLink>
              <SidebarLink to="/api" icon={Terminal}>API Reference</SidebarLink>
              <SidebarLink to="/security" icon={Shield}>Security Gates</SidebarLink>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          {/* Topbar */}
          <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-sm text-muted-foreground border border-border hover:bg-muted/80 w-64 justify-between transition-colors">
                <span className="flex items-center gap-2"><Search size={14} /> Search docs...</span>
                <span className="text-xs border border-border rounded px-1.5 py-0.5">⌘K</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="https://github.com/tirth-patel29/attendx-noproxy" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Code size={20} />
              </a>
              <button onClick={() => setDarkMode(!darkMode)} className="text-muted-foreground hover:text-foreground">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>

          <div className="p-8 flex-1 max-w-6xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/architecture" element={<ArchitecturePage />} />
              <Route path="/database" element={<DatabaseExplorerPage />} />
              <Route path="/api" element={<ApiReferencePage />} />
              <Route path="/security" element={<div className="text-xl font-bold">Security (To be built)</div>} />
            </Routes>
          </div>
        </main>

      </div>
    </div>
  );
}
