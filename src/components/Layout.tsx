import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../store/useStore';
import { 
  Menu, X, Sun, Moon, LayoutDashboard, Database, 
  Users, Factory, Activity, AlertTriangle, ShieldCheck,
  FileText, BarChart3, HelpCircle, Code, LogOut, ChevronRight, Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import './Layout.css';

// -------------------------------------------------------
// SECUENCIA METODOLÓGICA BETANCOURT + NT-03-2016
// -------------------------------------------------------
const navItems = [
  { path: '/', label: 'Panel General', icon: <LayoutDashboard size={18} />, section: null },
  
  // BLOQUE 1: REGISTRO BASE
  { path: '/empresas',     label: '1. Empresas',           icon: <Database size={18} />,       section: 'REGISTRO BASE' },
  { path: '/trabajadores', label: '2. Censo Trabajadores', icon: <Users size={18} />,          section: null },
  
  // BLOQUE 2: CARACTERIZACIÓN
  { path: '/puestos-trabajo',      label: '3. Puestos de Trabajo',   icon: <Factory size={18} />,       section: 'CARACTERIZACIÓN · BETANCOURT' },
  { path: '/procesos-trabajo',     label: '4. Procesos de Trabajo',  icon: <Activity size={18} />,      section: null },
  { path: '/procesos-peligrosos',  label: '5. Procesos Peligrosos',  icon: <AlertTriangle size={18} />, section: null },
  { path: '/procesos-positivos',   label: '6. Procesos Protectores', icon: <ShieldCheck size={18} />,   section: null },
  
  // BLOQUE 3: ENCUESTAS
  { path: '/encuestas', label: '7. Encuestas GH',     icon: <FileText size={18} />,  section: 'INVESTIGACIÓN PARTICIPATIVA' },
  
  // BLOQUE 4: REPORTES
  { path: '/psst',      label: '8. Informes y PSST',  icon: <BarChart3 size={18} />,  section: 'REPORTES E INFORMES' },
  { path: '/diagramas', label: 'Diagramas de Flujo',  icon: <BarChart3 size={18} />,  section: null },

  // SOPORTE
  { path: '/biblioteca', label: 'Biblioteca Técnica', icon: <Library size={18} />,     section: 'SOPORTE' },
  { path: '/help',       label: 'Ayuda y Guía',       icon: <HelpCircle size={18} />, section: null },
  { path: '/developers', label: 'ERGOEXPRESS',        icon: <Code size={18} />,       section: null },
];

export const Layout = () => {
  const { theme, toggleTheme } = useTheme();
  const { 
    empresas, 
    puestos, 
    activeEmpresaId, 
    activePuestoId, 
    setActiveEmpresaId, 
    setActivePuestoId,
    currentUser,
    setCurrentUser
  } = useStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const location = useLocation();

  const availablePuestos = puestos.filter(p => p.empresaId === activeEmpresaId);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        {/* Header con logo */}
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            {isSidebarOpen && (
              <h1 className="logo-text">
                SIG<span className="text-brand">SST</span>
              </h1>
            )}
          </div>
          <button className="icon-btn sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Filtros de contexto */}
        {isSidebarOpen && (
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <select
              className="header-select"
              style={{ maxWidth: '100%', width: '100%' }}
              value={activeEmpresaId || ''}
              onChange={(e) => { setActiveEmpresaId(e.target.value || null); setActivePuestoId(null); }}
            >
              <option value="">— Todas las Empresas —</option>
              {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
            </select>
            {activeEmpresaId && (
              <select
                className="header-select"
                style={{ maxWidth: '100%', width: '100%' }}
                value={activePuestoId || ''}
                onChange={(e) => setActivePuestoId(e.target.value || null)}
              >
                <option value="">— Todos los Puestos —</option>
                {availablePuestos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            )}
          </div>
        )}

        {/* Navegación */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <div key={item.path}>
                {item.section && isSidebarOpen && (
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em',
                    color: 'var(--text-muted)', padding: '0.75rem 1rem 0.2rem',
                    textTransform: 'uppercase', borderTop: '1px solid var(--border-color)',
                    marginTop: '0.25rem'
                  }}>
                    {item.section}
                  </div>
                )}
                <Link
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  title={!isSidebarOpen ? item.label : undefined}
                  onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isSidebarOpen && <span className="nav-label">{item.label}</span>}
                  {isActive && isSidebarOpen && (
                    <motion.span layoutId="nav-indicator" initial={false}>
                      <ChevronRight size={14} />
                    </motion.span>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer del sidebar */}
        {isSidebarOpen && (
          <div style={{
            padding: '1rem', borderTop: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem'
          }}>
            <button className="icon-btn" onClick={toggleTheme} title={`Modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.nombre || 'Usuario'}
            </span>
            <button className="icon-btn" onClick={handleLogout} title="Cerrar Sesión">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </aside>

      {/* Área principal */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={20} />
            </button>
            <span className="page-title hidden-mobile">
              SIG<span className="text-brand">SST</span>
            </span>
          </div>

          <div className="topbar-center context-selectors">
            <select className="header-select" value={activeEmpresaId || ''}
              onChange={(e) => { setActiveEmpresaId(e.target.value || null); setActivePuestoId(null); }}>
              <option value="">— Empresa —</option>
              {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
            </select>
            {activeEmpresaId && (
              <select className="header-select" value={activePuestoId || ''}
                onChange={(e) => setActivePuestoId(e.target.value || null)}>
                <option value="">— Puesto —</option>
                {availablePuestos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            )}
          </div>

          <div className="topbar-right">
            <button className="icon-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="user-profile" title={currentUser?.email}>
              {(currentUser?.nombre?.[0] || 'U').toUpperCase()}
            </div>
            <button className="icon-btn" onClick={handleLogout} title="Cerrar Sesión">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Contenido de la página */}
        <div className="content-scroll-area">
          <div className="content-inner fade-in">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Overlay móvil */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* PWA Install Banner */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{
              position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: '1rem', padding: '0.75rem 1.5rem', display: 'flex',
              alignItems: 'center', gap: '1rem', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>📲 Instalar SIG-SST como App</span>
            <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
              onClick={() => setShowInstallPrompt(false)}>Instalar</button>
            <button className="icon-btn" onClick={() => setShowInstallPrompt(false)}><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
