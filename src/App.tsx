import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';

// Páginas
import { Dashboard } from './pages/Dashboard';
import { Empresas } from './pages/Empresas';
import { Trabajadores } from './pages/Trabajadores';
import { PuestosTrabajo } from './pages/PuestosTrabajo';
import { ProcesosTrabajo } from './pages/ProcesosTrabajo';
import { ProcesosPeligrosos } from './pages/ProcesosPeligrosos';
import { ProcesosPositivos } from './pages/ProcesosPositivos';
import { Encuestas } from './pages/Encuestas';
import { Diagramas } from './pages/Diagramas';
import { Psst } from './pages/Psst';
import { Login } from './pages/Login';
import { Developers } from './pages/Developers';
import { Help } from './pages/Help';
import { useStore } from './store/useStore';
import { Verify } from './pages/Verify';

import { useEffect } from 'react';

function App() {
  const { currentUser, syncFromCloud } = useStore();

  useEffect(() => {
    if (currentUser) {
      syncFromCloud();
    }
  }, [currentUser]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/verify-demo" element={<Verify />} />
          {!currentUser ? (
             <Route path="*" element={<Login />} />
          ) : (
             <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                {/* PASO 1 & 2: Registro base */}
                <Route path="empresas" element={<Empresas />} />
                <Route path="trabajadores" element={<Trabajadores />} />
                {/* PASO 3: Descripción de Puestos */}
                <Route path="puestos-trabajo" element={<PuestosTrabajo />} />
                {/* PASO 4: Caracterización del Proceso de Trabajo (Betancourt Numeral 111-118) */}
                <Route path="procesos-trabajo" element={<ProcesosTrabajo />} />
                {/* PASO 5: Identificación de Procesos Peligrosos (Numeral 120-123) */}
                <Route path="procesos-peligrosos" element={<ProcesosPeligrosos />} />
                {/* PASO 6: Procesos Protectores - Polo Positivo */}
                <Route path="procesos-positivos" element={<ProcesosPositivos />} />
                {/* PASO 7: Encuestas de Grupos Homogéneos NT-01-2008 */}
                <Route path="encuestas" element={<Encuestas />} />
                {/* PASO 8: Generación de Informes PSST */}
                <Route path="psst" element={<Psst />} />
                {/* Complementarios */}
                <Route path="diagramas" element={<Diagramas />} />
                <Route path="developers" element={<Developers />} />
                <Route path="help" element={<Help />} />
             </Route>
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
