import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Building, Globe, Phone, Mail } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/Modal';
import { v4 as uuidv4 } from 'uuid';
import type { Empresa } from '../types';

export const Empresas = () => {
  const { empresas, addEmpresa, deleteEmpresa, updateEmpresa } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Empresa>>({
    nombre: '',
    rif: '',
    direccion: '',
    telefono: '',
    email: '',
    logoUrl: ''
  });

  const handleOpenModal = (empresa?: Empresa) => {
    if (empresa) {
      setEditingId(empresa.id);
      setFormData(empresa);
    } else {
      setEditingId(null);
      setFormData({
        nombre: '',
        rif: '',
        direccion: '',
        telefono: '',
        email: '',
        logoUrl: ''
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
      updateEmpresa(editingId, formData);
    } else {
      addEmpresa({
        ...(formData as Empresa),
        id: uuidv4(),
        createdAt: new Date().toISOString()
      });
    }
    handleCloseModal();
  };

  const filtered = empresas.filter(e => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.rif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Listado de Empresas Clientas</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gestión de entidades jurídicas para auditoría SST.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Registrar Empresa
        </button>
      </div>

      <div className="card flex items-center gap-2" style={{ marginBottom: '1.5rem', background: 'var(--bg-primary)' }}>
        <Search size={20} style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar empresa por nombre o RIF..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(emp => (
          <div key={emp.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {emp.logoUrl ? <img src={emp.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Building size={32} style={{ color: 'var(--text-muted)' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{emp.nombre}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>RIF: {emp.rif}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-icon" onClick={() => handleOpenModal(emp)}><Edit2 size={16} /></button>
                <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => deleteEmpresa(emp.id)}><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {emp.telefono}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> {emp.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: 'span 2' }}>
                <Globe size={14} /> {emp.direccion}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
            No hay empresas registradas. Comience agregando una nueva empresa.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Empresa" : "Registrar Nueva Empresa"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Razón Social</label>
              <input required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>RIF</label>
              <input required placeholder="J-00000000-0" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.rif} onChange={e => setFormData({...formData, rif: e.target.value})} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Teléfono</label>
              <input style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Correo Electrónico</label>
              <input type="email" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Dirección Fiscal</label>
            <textarea rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>URL del Logo (Opcional)</label>
            <input placeholder="https://ejemplo.com/logo.png" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} />
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
