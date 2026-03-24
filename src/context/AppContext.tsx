import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Empresa {
  id: string;
  nombre: string;
  rif: string;
}

export interface PuestoTrabajo {
  id: string;
  empresaId: string;
  nombre: string;
  departamento: string;
}

// Mock Data
export const MOCK_EMPRESAS: Empresa[] = [
  { id: 'emp-1', nombre: 'Industrias Forestales C.A.', rif: 'J-30000000-1' },
  { id: 'emp-2', nombre: 'Constructora del Sur S.A.', rif: 'J-40000000-2' },
];

export const MOCK_PUESTOS: PuestoTrabajo[] = [
  { id: 'pue-1', empresaId: 'emp-1', nombre: 'Operador de Sierra', departamento: 'Corte' },
  { id: 'pue-2', empresaId: 'emp-1', nombre: 'Ensamblador', departamento: 'Producción' },
  { id: 'pue-3', empresaId: 'emp-2', nombre: 'Albañil', departamento: 'Obras Civiles' },
  { id: 'pue-4', empresaId: 'emp-2', nombre: 'Soldador', departamento: 'Estructuras' },
];

interface AppContextType {
  empresas: Empresa[];
  puestos: PuestoTrabajo[];
  activeEmpresa: Empresa | null;
  activePuesto: PuestoTrabajo | null;
  setActiveEmpresaId: (id: string) => void;
  setActivePuestoId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [empresas] = useState<Empresa[]>(MOCK_EMPRESAS);
  const [puestos] = useState<PuestoTrabajo[]>(MOCK_PUESTOS);
  
  const [activeEmpresaId, setActiveEmpresaIdState] = useState<string>(MOCK_EMPRESAS[0].id);
  const [activePuestoId, setActivePuestoIdState] = useState<string>(MOCK_PUESTOS[0].id);

  const activeEmpresa = empresas.find(e => e.id === activeEmpresaId) || null;
  const activePuesto = puestos.find(p => p.id === activePuestoId) || null;

  // Derived puestos for the currently selected empresa
  const availablePuestos = puestos.filter(p => p.empresaId === activeEmpresaId);

  const setActiveEmpresaId = (id: string) => {
    setActiveEmpresaIdState(id);
    // When changing company, automatically select the first valid position, or clear if none
    const firstPuestoForEmpresa = puestos.find(p => p.empresaId === id);
    setActivePuestoIdState(firstPuestoForEmpresa ? firstPuestoForEmpresa.id : '');
  };

  const setActivePuestoId = (id: string) => {
    setActivePuestoIdState(id);
  };

  return (
    <AppContext.Provider 
      value={{ 
        empresas, 
        puestos: availablePuestos, 
        activeEmpresa, 
        activePuesto, 
        setActiveEmpresaId, 
        setActivePuestoId 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
