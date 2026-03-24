import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/Modal';
import { v4 as uuidv4 } from 'uuid';
import type { ProcesoPeligroso } from '../types';

export const ProcesosPeligrosos = () => {
  const { procesosPeligrosos, procesosTrabajo, addProcesoPeligroso, deleteProcesoPeligroso, updateProcesoPeligroso } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<ProcesoPeligroso>>({
    codigo: '',
    procesoTrabajoId: '',
    elemento: 'Del objeto de trabajo',
    descripcion: '',
    peligro: '',
    consecuencias: ''
  });

  const handleOpenModal = (proceso?: ProcesoPeligroso) => {
    if (proceso) {
      setEditingId(proceso.id);
      setFormData(proceso);
    } else {
      setEditingId(null);
      setFormData({
        codigo: `PP-${(procesosPeligrosos.length + 1).toString().padStart(3, '0')}`,
        procesoTrabajoId: '',
        elemento: 'Del objeto de trabajo',
        descripcion: '',
        peligro: '',
        consecuencias: ''
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
      updateProcesoPeligroso(editingId, formData);
    } else {
      addProcesoPeligroso({
        ...(formData as ProcesoPeligroso),
        id: uuidv4(),
        createdAt: new Date().toISOString()
      });
    }
    handleCloseModal();
  };

  const filteredProcesos = procesosPeligrosos.filter(p => 
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.peligro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '1rem', marginBottom: '0.5rem' }}>
            PASO 5 DE 8 · BETANCOURT NUMERAL 120-123
          </div>
          <h2>Identificación de Procesos Peligrosos</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Análisis de factores de riesgo según las 7 dimensiones de interacción del proceso de trabajo.</p>
        </div>
        <button className="btn btn-primary shadow-md" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Nuevo Riesgo
        </button>
      </div>

      <div className="card flex items-center gap-2" style={{ marginBottom: '1.5rem', background: 'var(--bg-primary)' }}>
        <Search size={20} style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar procesos peligrosos..." 
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
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Elemento</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Peligro / Riesgo</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Consecuencias</th>
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
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.875rem', 
                      backgroundColor: p.elemento.includes('objeto') ? 'rgba(239, 68, 68, 0.1)' : 
                                      p.elemento.includes('medios') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                      color: p.elemento.includes('objeto') ? '#ef4444' : 
                             p.elemento.includes('medios') ? '#3b82f6' : '#a855f7'
                    }}>
                      {p.elemento}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{p.peligro}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.consecuencias}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon" onClick={() => handleOpenModal(p)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" onClick={() => deleteProcesoPeligroso(p.id)} style={{ color: 'var(--accent-danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No hay procesos peligrosos registrados. Haz clic en "Nuevo Riesgo" para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Proceso Peligroso" : "Nuevo Proceso Peligroso"}>
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
            <label>Elemento Originador</label>
            <select 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              value={formData.elemento || 'Condiciones'}
              onChange={e => setFormData({...formData, elemento: e.target.value as any})}
            >
              <option value="Del objeto de trabajo">Del objeto de trabajo (Numeral 120a)</option>
              <option value="De los medios, materias primas e insumos">De los medios y materias primas (Numeral 121b)</option>
              <option value="De la organización y división del trabajo">De la organización y división (Numeral 121c)</option>
              <option value="De la interacción entre los medios, objeto y actividad">De la interacción componentes (Numeral 121d)</option>
              <option value="Del entorno de trabajo">Del entorno de trabajo (Numeral 122e)</option>
              <option value="De los medios de protección">De los medios de protección (Numeral 122f)</option>
              <option value="De los servicios y condiciones de vida">De los servicios y condiciones (Numeral 122g)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Peligro Identificado</label>
            <input 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              value={formData.peligro || ''}
              onChange={e => setFormData({...formData, peligro: e.target.value})}
              placeholder="Ej. Ruido de alta intensidad, Sobreesfuerzo físico..."
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
            <label>Consecuencias (Efectos a la salud)</label>
            <textarea 
              required rows={2}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              value={formData.consecuencias || ''}
              onChange={e => setFormData({...formData, consecuencias: e.target.value})}
              placeholder="Ej. Hipoacusia inducida por ruido, hernias..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={handleCloseModal} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary shadow-md" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer' }}>
              {editingId ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
