import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/Modal';
import { v4 as uuidv4 } from 'uuid';
import type { ProcesoTrabajo } from '../types';

export const ProcesosTrabajo = () => {
  const { procesosTrabajo, puestos, addProcesoTrabajo, deleteProcesoTrabajo, updateProcesoTrabajo, activeEmpresaId, activePuestoId } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<ProcesoTrabajo>>({
    codigo: '',
    denominacion: '',
    objeto: '',
    medios: '',
    actividad: '',
    organizacion: '',
    fases: '',
    entorno: '',
    serviciosBasicos: '',
    empresaId: activeEmpresaId || '',
    puestoId: activePuestoId || ''
  });

  const handleOpenModal = (proceso?: ProcesoTrabajo) => {
    if (proceso) {
      setEditingId(proceso.id);
      setFormData(proceso);
    } else {
      setEditingId(null);
      setFormData({
        codigo: `PT-${(procesosTrabajo.length + 1).toString().padStart(3, '0')}`,
        denominacion: '',
        objeto: '',
        medios: '',
        actividad: '',
        organizacion: '',
        fases: '',
        entorno: '',
        serviciosBasicos: '',
        empresaId: activeEmpresaId || '',
        puestoId: activePuestoId || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProcesoTrabajo(editingId, formData);
    } else {
      addProcesoTrabajo({
        ...(formData as ProcesoTrabajo),
        id: uuidv4(),
        createdAt: new Date().toISOString()
      });
    }
    handleCloseModal();
  };

  const filtered = procesosTrabajo.filter(p => !activeEmpresaId || p.empresaId === activeEmpresaId);

  return (
    <div className="flex-col gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--brand-primary)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '1rem', marginBottom: '0.5rem' }}>
            PASO 4 DE 8 · BETANCOURT NUMERAL 111-118
          </div>
          <h2>Caracterización de Procesos de Trabajo</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Identificación, registro y caracterización por sus componentes: Objeto, Medios, Actividad, Organización, Fases y Entorno.</p>
        </div>
        <button className="btn btn-primary shadow-md" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Nuevo Proceso
        </button>
      </div>

      <div className="card flex items-center gap-2" style={{ marginBottom: '1.5rem', background: 'var(--bg-primary)' }}>
        <Search size={20} style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar..." 
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)' }} 
        />
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Cód</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Denominación</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Objeto</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Medios</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Organización</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{p.codigo}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{p.denominacion}</td>
                <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{p.objeto}</td>
                <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{p.medios}</td>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--brand-primary)' }}>{p.organizacion}</td>
                <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon" onClick={() => handleOpenModal(p)}><Edit2 size={16} /></button>
                        <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => deleteProcesoTrabajo(p.id)}><Trash2 size={16} /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Proceso" : "Nuevo Proceso de Trabajo"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label>Puesto Asociado</label>
               <select required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.puestoId} onChange={e => setFormData({...formData, puestoId: e.target.value})}>
                   <option value="">Seleccione puesto...</option>
                   {puestos.filter(pu => !activeEmpresaId || pu.empresaId === activeEmpresaId).map(pu => <option key={pu.id} value={pu.id}>{pu.nombre}</option>)}
               </select>
             </div>
             <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Denominación del Proceso</label>
                <input required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.denominacion} onChange={e => setFormData({...formData, denominacion: e.target.value})} />
             </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Objeto de Trabajo</label>
                <textarea rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.objeto} onChange={e => setFormData({...formData, objeto: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Medios de Trabajo</label>
                <textarea rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.medios} onChange={e => setFormData({...formData, medios: e.target.value})} />
              </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Fases del Proceso (Numeral 118)</label>
                <textarea rows={2} placeholder="Etapas cronológicas..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.fases} onChange={e => setFormData({...formData, fases: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Actividad / Trabajo Humano (Numeral 113)</label>
                <textarea rows={2} placeholder="Acciones físicas y mentales..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.actividad} onChange={e => setFormData({...formData, actividad: e.target.value})} />
              </div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Organización y División del Trabajo (Numeral 114)</label>
              <textarea rows={2} placeholder="Describa la división de tareas, jerarquías, ritmos y supervisión..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.organizacion} onChange={e => setFormData({...formData, organizacion: e.target.value})} />
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Entorno de Trabajo (Numeral 120)</label>
                <textarea rows={2} placeholder="Espacio físico, clima, iluminación..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.entorno} onChange={e => setFormData({...formData, entorno: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Servicios Básicos (Numeral 120)</label>
                <textarea rows={2} placeholder="Agua, comedores, baños, transporte..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.serviciosBasicos} onChange={e => setFormData({...formData, serviciosBasicos: e.target.value})} />
              </div>
           </div>

           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={handleCloseModal} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Cancelar</button>
            <button type="submit" className="btn btn-primary shadow-md" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none' }}>Guardar Caracterización</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
