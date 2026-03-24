import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, User, Building, Briefcase } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/Modal';
import { v4 as uuidv4 } from 'uuid';
import type { Trabajador } from '../types';

export const Trabajadores = () => {
  const { trabajadores, empresas, puestos, addTrabajador, deleteTrabajador, updateTrabajador, activeEmpresaId } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Trabajador>>({
    nombre: '',
    cedula: '',
    edad: 18,
    instrucción: '',
    antiguedad: '',
    genero: 'M',
    empresaId: activeEmpresaId || '',
    puestoId: ''
  });

  const handleOpenModal = (t?: Trabajador) => {
    if (t) {
      setEditingId(t.id);
      setFormData(t);
    } else {
      setEditingId(null);
      setFormData({
        nombre: '',
        cedula: '',
        edad: 18,
        instrucción: '',
        antiguedad: '',
        genero: 'M',
        empresaId: activeEmpresaId || '',
        puestoId: ''
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
      updateTrabajador(editingId, formData);
    } else {
      addTrabajador({
        ...(formData as Trabajador),
        id: uuidv4(),
        createdAt: new Date().toISOString()
      });
    }
    handleCloseModal();
  };

  const filtered = trabajadores.filter(t => 
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.cedula.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(t => !activeEmpresaId || t.empresaId === activeEmpresaId);

  return (
    <div className="flex-col gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Listado de Trabajadores</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Relación de personal por empresa y puesto de trabajo.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Registrar Trabajador
        </button>
      </div>

      <div className="card flex items-center gap-2" style={{ marginBottom: '1.5rem', background: 'var(--bg-primary)' }}>
        <Search size={20} style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar trabajador..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map(t => {
          const emp = empresas.find(e => e.id === t.empresaId);
          const pue = puestos.find(p => p.id === t.puestoId);
          return (
            <div key={t.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-primary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.nombre}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>C.I: {t.cedula} | {t.edad} años</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Building size={12} /> {emp?.nombre || 'Sin Empresa'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Briefcase size={12} /> {pue?.nombre || 'Sin Puesto'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button className="btn-icon" onClick={() => handleOpenModal(t)}><Edit2 size={14} /></button>
                <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => deleteTrabajador(t.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
        
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
            No hay trabajadores registrados {activeEmpresaId ? 'en esta empresa' : ''}.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Trabajador" : "Nuevo Trabajador"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Nombre Completo</label>
              <input required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Cédula de Identidad</label>
              <input required placeholder="V-00000000" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Edad</label>
              <input type="number" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.edad} onChange={e => setFormData({...formData, edad: parseInt(e.target.value)})} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Género</label>
              <select required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.genero} onChange={e => setFormData({...formData, genero: e.target.value as any})} >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Grado de Instrucción</label>
              <input style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.instrucción} onChange={e => setFormData({...formData, instrucción: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Empresa</label>
              <select required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.empresaId} onChange={e => setFormData({...formData, empresaId: e.target.value})} >
                <option value="" disabled>Seleccione empresa...</option>
                {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Puesto de Trabajo</label>
              <select required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.puestoId} onChange={e => setFormData({...formData, puestoId: e.target.value})} >
                <option value="" disabled>Seleccione puesto...</option>
                {puestos.filter(p => p.empresaId === formData.empresaId).map(pue => <option key={pue.id} value={pue.id}>{pue.nombre}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Antigüedad en el Puesto</label>
            <input placeholder="Ej: 2 años y 6 meses" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.antiguedad} onChange={e => setFormData({...formData, antiguedad: e.target.value})} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={handleCloseModal} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Cancelar</button>
            <button type="submit" className="btn btn-primary shadow-md" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none' }}>{editingId ? "Actualizar" : "Guardar"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
