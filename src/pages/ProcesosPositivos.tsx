import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/Modal';
import { v4 as uuidv4 } from 'uuid';
import type { ProcesoPositivo } from '../types';

export const ProcesosPositivos = () => {
  const { procesosPositivos, procesosTrabajo, addProcesoPositivo, deleteProcesoPositivo, updateProcesoPositivo } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<ProcesoPositivo>>({
    codigo: '',
    procesoTrabajoId: '',
    descripcion: '',
    beneficio: '',
    medida: ''
  });

  const handleOpenModal = (proceso?: ProcesoPositivo) => {
    if (proceso) {
      setEditingId(proceso.id);
      setFormData(proceso);
    } else {
      setEditingId(null);
      setFormData({
        codigo: `PPO-${(procesosPositivos.length + 1).toString().padStart(3, '0')}`,
        procesoTrabajoId: '',
        descripcion: '',
        beneficio: '',
        medida: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProcesoPositivo(editingId, formData);
    } else {
      addProcesoPositivo({
        ...(formData as ProcesoPositivo),
        id: uuidv4(),
        createdAt: new Date().toISOString()
      });
    }
    handleCloseModal();
  };

  const filteredProcesos = procesosPositivos.filter(p => 
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.beneficio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Procesos Positivos / Protectores</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Elementos que dignifican y protegen al trabajador.</p>
        </div>
        <button className="btn btn-primary shadow-md" style={{ background: '#10b981' }} onClick={() => handleOpenModal()}>
          <Plus size={18} /> Nueva Medida Protectora
        </button>
      </div>

      <div className="card flex items-center gap-2" style={{ marginBottom: '1.5rem', background: 'var(--bg-primary)' }}>
        <Search size={20} style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar procesos positivos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)' }} 
        />
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>PT Asociado</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Medida Adoptada</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Beneficio a la Salud</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesos.length > 0 ? filteredProcesos.map((p) => {
              const pt = procesosTrabajo.find(t => t.id === p.procesoTrabajoId);
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{p.codigo}</td>
                  <td style={{ padding: '1rem' }}>{pt ? pt.codigo : 'No asociado'}</td>
                  <td style={{ padding: '1rem', fontWeight: '500', color: '#10b981' }}>{p.medida}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.beneficio}</td>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon" onClick={() => handleOpenModal(p)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" onClick={() => deleteProcesoPositivo(p.id)} style={{ color: 'var(--accent-danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No hay procesos positivos registrados. Haz clic en "Nueva Medida" para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Proceso Positivo" : "Nuevo Proceso Positivo"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Código</label>
              <input 
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                value={formData.codigo || ''}
                onChange={e => setFormData({...formData, codigo: e.target.value})}
              />
            </div>
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Proceso de Trabajo Asociado</label>
              <select 
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                value={formData.procesoTrabajoId || ''}
                onChange={e => setFormData({...formData, procesoTrabajoId: e.target.value})}
              >
                <option value="" disabled>Seleccione un proceso de trabajo...</option>
                {procesosTrabajo.map(pt => (
                  <option key={pt.id} value={pt.id}>{pt.codigo} - {pt.denominacion}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Medida Adoptada o Factor Protector</label>
            <input 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              value={formData.medida || ''}
              onChange={e => setFormData({...formData, medida: e.target.value})}
              placeholder="Ej. Uso de extractores de polvo, Pausas activas..."
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Descripción detallada</label>
            <textarea 
              rows={2}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              value={formData.descripcion || ''}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Beneficio Obtenido</label>
            <textarea 
              required rows={2}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              value={formData.beneficio || ''}
              onChange={e => setFormData({...formData, beneficio: e.target.value})}
              placeholder="Ej. Prevención de asma ocupacional..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={handleCloseModal} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary shadow-md" style={{ background: '#10b981', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', color: 'white' }}>
              {editingId ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
