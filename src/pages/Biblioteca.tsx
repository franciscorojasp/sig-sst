import { useState } from 'react';
import { 
  BookOpen, Search, FileText, Download, Shield, Scale, 
  ExternalLink, Info, LayoutGrid, List, Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Documento {
  id: string;
  titulo: string;
  categoria: 'legal' | 'tecnica' | 'iso' | 'guia';
  descripcion: string;
  archivo?: string; // Si está en public/docs
  tags: string[];
}

const DOCUMENTOS: Documento[] = [
  {
    id: 'LOPCYMAT',
    titulo: 'Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo',
    categoria: 'legal',
    descripcion: 'Ley fundamental que rige la seguridad y salud laboral en Venezuela.',
    archivo: '/docs/LOPCYMAT.pdf',
    tags: ['Ley', 'Venezuela', 'Base']
  },
  {
    id: 'REGL-LOPCYMAT',
    titulo: 'Reglamento Parcial de la LOPCYMAT',
    categoria: 'legal',
    descripcion: 'Normas detalladas para la aplicación de la LOPCYMAT.',
    archivo: '/docs/regl_par_lopcymat.pdf',
    tags: ['Reglamento', 'Legal']
  },
  {
    id: 'RCHST',
    titulo: 'Reglamento de las Condiciones de Higiene y Seguridad en el Trabajo',
    categoria: 'legal',
    descripcion: 'Marco regulatorio para condiciones físicas y ambientales en centros de trabajo.',
    archivo: '/docs/RCHST.pdf',
    tags: ['Higiene', 'Seguridad', 'Vigente']
  },
  {
    id: 'NT-PSST-2023',
    titulo: 'NT-04-2023: Programa de Seguridad y Salud en el Trabajo',
    categoria: 'tecnica',
    descripcion: 'Nueva norma técnica para la elaboración y registro del PSST.',
    archivo: '/docs/NT-04-2023-PSST.pdf',
    tags: ['Norma Técnica', 'PSST', '2023']
  },
  {
    id: 'NT-SSST',
    titulo: 'NT SSST: Servicios de Seguridad y Salud en el Trabajo',
    categoria: 'tecnica',
    descripcion: 'Requisitos para la organización y funcionamiento de los SSST.',
    archivo: '/docs/NT_SSST.pdf',
    tags: ['Servicios', 'Salud', 'Gestión']
  },
  {
    id: 'GUIA-DELEGADOS',
    titulo: 'Guía para Elección de Delegados de Prevención',
    categoria: 'guia',
    descripcion: 'Procedimiento técnico para la elección de representantes de los trabajadores.',
    archivo: '/docs/Guia-tecnica-para-el-proceso-de-eleccion-de-los-delegados-y-delegadas-de-prevencion.pdf',
    tags: ['Delegados', 'Participación', 'Guía']
  },
  {
    id: 'ISO-45001',
    titulo: 'ISO 45001:2018',
    categoria: 'iso',
    descripcion: 'Estándar internacional para Sistemas de Gestión de Seguridad y Salud en el Trabajo.',
    archivo: '/docs/ISO-45001.pdf',
    tags: ['ISO', 'Internacional', 'Sistemas de Gestión']
  },
  // Documentos de referencia (no copiados pero indexados)
  {
    id: 'NVC-2249',
    titulo: 'COVENIN 2249-93: Iluminación en Tareas y Áreas de Trabajo',
    categoria: 'tecnica',
    descripcion: 'Niveles de iluminancia y criterios para evaluación lumínica.',
    tags: ['COVENIN', 'Iluminación', 'Física']
  },
  {
    id: 'NVC-2254',
    titulo: 'COVENIN 2254-95: Ambiente Térmico',
    categoria: 'tecnica',
    descripcion: 'Evaluación de calor y frío en ambientes de trabajo.',
    tags: ['COVENIN', 'Temperatura', 'Estrés Térmico']
  },
  {
    id: 'NVC-1565',
    titulo: 'COVENIN 1565-95: Ruido Ocupacional',
    categoria: 'tecnica',
    descripcion: 'Límites de exposición y métodos de medición de ruido.',
    tags: ['COVENIN', 'Ruido', 'Higiene']
  },
  {
    id: 'ISO-45003',
    titulo: 'ISO 45003: Gestión de Riesgos Psicosociales',
    categoria: 'iso',
    descripcion: 'Directrices para la gestión del bienestar mental en el trabajo.',
    tags: ['ISO', 'Psicosocial', 'Internacional']
  }
];

export const Biblioteca = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocs = DOCUMENTOS.filter(doc => {
    const matchesSearch = doc.titulo.toLowerCase().includes(search.toLowerCase()) || 
                          doc.descripcion.toLowerCase().includes(search.toLowerCase()) ||
                          doc.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCat === 'todos' || doc.categoria === selectedCat;
    return matchesSearch && matchesCat;
  });

  const categories = [
    { id: 'todos', label: 'Todos', icon: <Library size={16} /> },
    { id: 'legal', label: 'Marco Legal', icon: <Scale size={16} /> },
    { id: 'tecnica', label: 'Normas Técnicas', icon: <Shield size={16} /> },
    { id: 'iso', label: 'Estándares ISO', icon: <ExternalLink size={16} /> },
    { id: 'guia', label: 'Guías y Manuales', icon: <BookOpen size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Biblioteca Técnica SST
          </h1>
          <p className="text-secondary max-w-2xl">
            Repositorio centralizado de normativa legal venezolana, estándares internacionales y guías técnicas para la gestión integral de seguridad y salud.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-500/5 p-1 rounded-xl border border-border-color">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-slate-500/10'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-slate-500/10'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input 
            type="text"
            placeholder="Buscar por título, norma o palabra clave..."
            className="input pl-12 w-full py-3 h-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="lg:col-span-2 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedCat === cat.id 
                  ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm' 
                  : 'bg-white/5 border-border-color hover:border-brand-primary/50'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Documentos */}
      <motion.div 
        layout
        className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
          : "flex flex-col gap-4"
        }
      >
        <AnimatePresence mode='popLayout'>
          {filteredDocs.map((doc) => (
            <motion.div
              layout
              key={doc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`card group hover:shadow-xl transition-all border-l-4 ${
                doc.categoria === 'legal' ? 'border-l-blue-500' :
                doc.categoria === 'tecnica' ? 'border-l-indigo-500' :
                doc.categoria === 'iso' ? 'border-l-emerald-500' : 'border-l-amber-500'
              } ${viewMode === 'list' ? 'flex flex-row items-center p-4' : 'p-6 space-y-4'}`}
            >
              <div className={`p-4 rounded-2xl h-fit ${
                doc.categoria === 'legal' ? 'bg-blue-500/10 text-blue-500' :
                doc.categoria === 'tecnica' ? 'bg-indigo-500/10 text-indigo-500' :
                doc.categoria === 'iso' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              } ${viewMode === 'list' ? 'mr-6' : ''}`}>
                <FileText size={viewMode === 'list' ? 24 : 32} />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg leading-snug group-hover:text-brand-primary transition-colors">
                    {doc.titulo}
                  </h3>
                </div>
                
                <p className="text-secondary text-sm leading-relaxed">
                  {doc.descripcion}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {doc.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-500/5 text-muted text-[10px] uppercase font-bold rounded-md tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`${viewMode === 'list' ? 'ml-6' : 'pt-4'}`}>
                {doc.archivo ? (
                  <a 
                    href={doc.archivo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full flex items-center justify-center gap-2 py-2 text-sm shadow-indigo-500/20"
                  >
                    <Download size={16} />
                    Consultar PDF
                  </a>
                ) : (
                  <div className="px-4 py-2 bg-slate-500/10 text-muted rounded-xl text-center text-xs flex items-center gap-2">
                    <Info size={14} />
                    Consulta Local
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-20 bg-slate-500/5 rounded-3xl border-2 border-dashed border-border-color">
          <Library className="mx-auto text-muted mb-4 opacity-20" size={64} />
          <h3 className="text-xl font-bold opacity-50">No se encontraron documentos</h3>
          <p className="text-muted">Intenta cambiar los filtros o el término de búsqueda.</p>
        </div>
      )}

      {/* Info Panel */}
      <div className="card p-8 bg-brand-primary/5 border border-brand-primary/10 rounded-3xl flex flex-col md:flex-row items-center gap-8">
        <div className="p-5 bg-white shadow-xl rounded-2xl">
           <Library className="text-brand-primary" size={40} />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h4 className="font-bold text-xl">¿Buscas algo más específico?</h4>
          <p className="text-secondary text-sm">
            Esta base de conocimiento se sincroniza automáticamente con la biblioteca física de ERGOEXPRESS. Para solicitar la digitalización de un estándar adicional, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};
