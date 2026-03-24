import { Activity, Factory, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Dashboard = () => {
  const { procesosTrabajo, procesosPeligrosos, procesosPositivos } = useStore();

  return (
    <div className="flex-col gap-4">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Panel de Control</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Resumen integral de gestión SST bajo el enfoque de procesos.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Metric Card 1 */}
        <div className="card flex items-center gap-4" style={{ padding: '1.5rem', background: 'var(--bg-primary)' }}>
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            color: 'var(--accent-primary)',
            padding: '1.25rem',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Factory size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{procesosTrabajo.length}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Procesos de Trabajo Registrados</p>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="card flex items-center gap-4" style={{ padding: '1.5rem', background: 'var(--bg-primary)' }}>
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            color: '#ef4444',
            padding: '1.25rem',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Activity size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{procesosPeligrosos.length}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Procesos Peligrosos Detectados</p>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="card flex items-center gap-4" style={{ padding: '1.5rem', background: 'var(--bg-primary)' }}>
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            color: '#10b981',
            padding: '1.25rem',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{procesosPositivos.length}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Expresiones Saludables (Positivas)</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', minHeight: '300px', background: 'var(--bg-primary)' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Estadísticas y Análisis</h3>
        {procesosTrabajo.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
            No hay procesos registrados. Comienza añadiendo un Proceso de Trabajo.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Tasa Riesgo / Proceso</p>
              <h4 style={{ fontSize: '1.5rem', margin: 0 }}>
                {(procesosPeligrosos.length / procesosTrabajo.length).toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>peligros por PT</span>
              </h4>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Tasa Medidas / Riesgo</p>
              <h4 style={{ fontSize: '1.5rem', margin: 0 }}>
                {procesosPeligrosos.length > 0 ? (procesosPositivos.length / procesosPeligrosos.length).toFixed(1) : 0} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>medidas por peligro</span>
              </h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
