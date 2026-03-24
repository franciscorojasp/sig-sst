import { useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Video, Rocket, Sparkles, Download, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/Modal';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PuestoTrabajo } from '../types';

export const PuestosTrabajo = () => {
  const { puestos, empresas, addPuesto, deletePuesto, updatePuesto, activeEmpresaId } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<PuestoTrabajo>>({
    nombre: '',
    departamento: '',
    descripcion: '',
    organizacionTrabajo: '',
    empresaId: activeEmpresaId || '',
    videoUrl: '',
    analisisAi: ''
  });

  const handleOpenModal = (p?: PuestoTrabajo) => {
    setSelectedFileName(null);
    if (p) {
      setEditingId(p.id);
      setFormData(p);
    } else {
      setEditingId(null);
      setFormData({
        nombre: '',
        departamento: '',
        descripcion: '',
        organizacionTrabajo: '',
        empresaId: activeEmpresaId || '',
        videoUrl: '',
        analisisAi: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setFormData({ ...formData, videoUrl: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePuesto(editingId, formData);
    } else {
      addPuesto({
        ...(formData as PuestoTrabajo),
        id: uuidv4(),
        createdAt: new Date().toISOString()
      });
    }
    handleCloseModal();
  };

  const generateIndividualPDF = (pue: PuestoTrabajo) => {
    const { procesosTrabajo, procesosPeligrosos, encuestas, empresas } = useStore.getState();
    const emp = empresas.find(e => e.id === pue.empresaId);
    const relatedPT = procesosTrabajo.filter(pt => pt.puestoId === pue.id);
    const relatedPP = procesosPeligrosos.filter(pp => relatedPT.some(pt => pt.id === pp.procesoTrabajoId));
    const relatedEnc = encuestas.filter(e => e.puestoId === pue.id);
    const doc = new jsPDF();

    // Header Color Block
    doc.setFillColor(30, 95, 100);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('REPORTE TÉCNICO INDIVIDUAL', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`PUESTO: ${pue.nombre.toUpperCase()}`, 105, 25, { align: 'center' });
    doc.text(`DEPTO: ${pue.departamento || 'N/A'} | NRC: DOC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, 105, 32, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('1. RESUMEN DEL PUESTO Y ANÁLISIS IA (Numeral 111-114)', 14, 55);
    doc.setFont('helvetica', 'normal');
    
    const descLines = doc.splitTextToSize(`Descripción: ${pue.descripcion}\nOrganización: ${pue.organizacionTrabajo}`, 180);
    doc.text(descLines, 14, 62);

    let currentY = 62 + (descLines.length * 5) + 5;

    if (pue.analisisAi) {
       doc.setFillColor(240, 249, 248);
       doc.rect(14, currentY, 182, 35, 'F');
       doc.rect(14, currentY, 182, 35, 'S');
       doc.setFont('helvetica', 'bold');
       doc.text('RESULTADO ANÁLISIS IA ERGOEXPRESS:', 18, currentY + 8);
       doc.setFont('helvetica', 'normal');
       doc.setFontSize(8);
       const aiLines = doc.splitTextToSize(pue.analisisAi, 174);
       doc.text(aiLines, 18, currentY + 14);
       currentY += 45;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('2. CARACTERIZACIÓN DE PROCESOS PELIGROSOS ASOCIADOS (Numeral 120)', 14, currentY);
    currentY += 5;

    autoTable(doc, {
      startY: currentY,
      head: [['NRC', 'Dimensión/Elemento', 'Peligro', 'Consecuencia (Impacto 123)']],
      body: relatedPP.map(pp => [pp.codigo, pp.elemento, pp.peligro, pp.consecuencias]),
      theme: 'grid',
      styles: { fontSize: 7 },
      headStyles: { fillColor: [30, 95, 100] }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 240) { doc.addPage(); currentY = 20; }

    // --- CRITICALITY CHART SECTION ---
    doc.setFont('helvetica', 'bold');
    doc.text('PERFIL DE CRITICIDAD DIMENSIONAL (GRIFO TÉCNICO)', 14, currentY);
    currentY += 10;

    const dimensions = [
      'Del objeto de trabajo', 
      'De los medios, materias primas e insumos', 
      'De la organización y división del trabajo', 
      'De la interacción entre los medios, objeto y actividad', 
      'Del entorno de trabajo', 
      'De los medios de protección', 
      'De los servicios y condiciones de vida'
    ];

    const counts = dimensions.map(d => relatedPP.filter(p => p.elemento === d).length);
    const maxCount = Math.max(...counts, 1);
    const chartWidth = 140;

    dimensions.forEach((d, i) => {
      const barHeight = 6;
      const barPadding = 4;
      const barWidth = (counts[i] / maxCount) * chartWidth;
      
      doc.setFontSize(7);
      doc.text(`${d.substring(0, 45)}...`, 14, currentY + (i * (barHeight + barPadding)));
      
      // Bar background
      doc.setFillColor(240, 240, 240);
      doc.rect(80, currentY + (i * (barHeight + barPadding)) - 4, chartWidth, barHeight, 'F');
      
      // Data Bar
      const colors = [[30, 95, 100], [231, 76, 60], [241, 196, 15], [46, 204, 113], [52, 152, 219], [155, 89, 182], [149, 165, 166]];
      doc.setFillColor(colors[i][0], colors[i][1], colors[i][2]);
      doc.rect(80, currentY + (i * (barHeight + barPadding)) - 4, barWidth, barHeight, 'F');
      
      doc.text(counts[i].toString(), 80 + chartWidth + 5, currentY + (i * (barHeight + barPadding)));
    });

    currentY += (dimensions.length * 10) + 10;
    if (currentY > 260) { doc.addPage(); currentY = 20; }
    // ---------------------------------

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('3. RESULTADOS AGREGADOS ENCUESTAS GH (GRUPOS HOMOGÉNEOS)', 14, currentY);
    currentY += 5;

    const encData = relatedEnc.map(e => [e.fecha, 'SI', e.microclima.calor.prob, e.daños.partesCuerpo.join(', ') || 'Sin reportes']);

    autoTable(doc, {
      startY: currentY,
      head: [['Fecha', 'Participó', 'Percepción Prob.', 'Manifestaciones Tempranas (123)']],
      body: encData,
      theme: 'grid',
      styles: { fontSize: 7 },
      headStyles: { fillColor: [52, 73, 94] }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
    if (currentY > 240) { doc.addPage(); currentY = 20; }

    // --- AUTO-RECOMMENDATIONS SECTION ---
    doc.setFont('helvetica', 'bold');
    doc.text('4. RECOMENDACIONES TÉCNICAS SUGERIDAS (SISTEMA EXPERTO)', 14, currentY);
    currentY += 10;

    const recs: Record<string, string[]> = {
      'Del objeto de trabajo': ['Implementar rediseño de manipulación de cargas.', 'Sustitución de insumos químicos por alternativas biodegradables.', 'Manual de manejo seguro de materias primas.'],
      'De los medios, materias primas e insumos': ['Acondicionamiento herramental ergonómico.', 'Mantenimiento preventivo por horas de uso.', 'Instalación de resguardos mecánicos certificados.'],
      'De la organización y división del trabajo': ['Programa de pausas activas cada 2 horas.', 'Rotación sistemática entre puestos similares.', 'Reducción de ritmos impuestos por tecnología.'],
      'De la interacción entre los medios, objeto y actividad': ['Ajuste de planos de trabajo (alturas y alcances).', 'Capacitación en higiene postural dinámica.', 'Optimización de flujo biológico del trabajo.'],
      'Del entorno de trabajo': ['Adecuación lumínica según norma COVENIN.', 'Aislamiento acústico en fuente generadora.', 'Control de estrés térmico mediante hidratación.'],
      'De los medios de protección': ['Certificación internacional de equipos de protección.', 'Auditoría de cumplimiento de uso de EPP.', 'Reposición sistemática por desgaste técnico.'],
      'De los servicios y condiciones de vida': ['Garantizar hidratación potable continua.', 'Adecuación de áreas de descanso y bienestar.', 'Mejora de sistemas de ventilación en comedores.']
    };

    let recommended = 0;
    dimensions.forEach((d, i) => {
       if (counts[i] > 0) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.text(`- Acción para ${d}:`, 14, currentY);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          const lines = doc.splitTextToSize(recs[d][0], 170); // Just the top one for brevity
          doc.text(lines, 20, currentY + 4);
          currentY += 12;
          recommended++;
       }
    });

    if (recommended === 0) {
       doc.setFontSize(8);
       doc.text('No se detectaron criticidades elevadas. Mantener monitoreo epidemiológico.', 14, currentY);
    }
    // ------------------------------------

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Documento generado bajo Nomenclatura Correlativa (NRC) - ERGOEXPRESS C.A.', 105, 290, { align: 'center' });

    doc.save(`Reporte_${emp?.nombre || 'EE'}_${pue.nombre.replace(/\s+/g, '_')}.pdf`);
  };

  const simulateAiAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        analisisAi: "ANÁLISIS DE IA ERGOEXPRESS:\n\n1. POSTURA: Se detecta flexión de tronco mantenida > 20°.\n2. RITMO: Ciclos repetitivos cada 12 segundos.\n3. ORGANIZACIÓN: Alta carga cognitiva por control de panel.\n4. RECOMENDACIÓN: Implementar rotación cada 2 horas.",
        organizacionTrabajo: "División del trabajo: Manual-Semi-automático. Ritmos impuestos por máquina. Turnos rotativos de 8h."
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const filtered = puestos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(p => !activeEmpresaId || p.empresaId === activeEmpresaId);

  return (
    <div className="flex-col gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Puestos de Trabajo</h2>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Nuevo Puesto
        </button>
      </div>

      <div className="card flex items-center gap-2" style={{ marginBottom: '1.5rem', background: 'var(--bg-primary)' }}>
        <Search size={20} style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar puesto..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(pue => {
          const emp = empresas.find(e => e.id === pue.empresaId);
          return (
            <div key={pue.id} className="card p-6 border-l-4 border-brand-primary">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold m-0">{pue.nombre}</h3>
                  <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-bold uppercase">{emp?.nombre || 'Empresa'}</span>
                      <span className="text-[10px] bg-slate-500/10 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">{pue.departamento || 'Sin Depto'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-icon" onClick={() => handleOpenModal(pue)}><Edit2 size={16} /></button>
                  <button className="btn-icon text-red-500" onClick={() => deletePuesto(pue.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              
              <p className="text-sm text-secondary line-clamp-2">{pue.descripcion}</p>
              
              {pue.analisisAi && (
                <div className="mt-4 bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-xl text-xs">
                   <div className="flex items-center gap-2 text-brand-primary font-bold mb-2">
                      <Sparkles size={14} /> Análisis de IA Completado
                   </div>
                   <pre className="m-0 whitespace-pre-wrap font-sans">{pue.analisisAi}</pre>
                </div>
              )}

              <div className="flex gap-4 mt-6 pt-4 border-t border-border-color">
                 {pue.videoUrl && <div className="flex items-center gap-2 text-[10px] text-muted"><Video size={14} /> Video Analizado</div>}
                 <div className="flex items-center gap-2 text-[10px] text-brand-primary font-bold cursor-pointer hover:underline" onClick={() => generateIndividualPDF(pue)}>
                    <Download size={14} /> Descargar Reporte Individual Puesto
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Puesto de Trabajo" : "Nuevo Puesto de Trabajo"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label>Empresa</label>
              <select required className="input-field" value={formData.empresaId} onChange={e => setFormData({...formData, empresaId: e.target.value})} >
                <option value="" disabled>Seleccione...</option>
                {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label>Departamento (para Nomenclatura)</label>
              <input required className="input-field" placeholder="Ej: Administracion, Planta 1" value={formData.departamento} onChange={e => setFormData({...formData, departamento: e.target.value})} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label>Nombre del Puesto</label>
            <input required className="input-field" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2">
             <label>Descripción General de Tareas</label>
             <textarea rows={2} className="input-field" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2">
             <label>Organización del Trabajo (Betancourt)</label>
             <textarea rows={2} placeholder="División de tareas, ritmos, turnos..." className="input-field" value={formData.organizacionTrabajo} onChange={e => setFormData({...formData, organizacionTrabajo: e.target.value})} />
          </div>

          <div className="bg-slate-500/5 p-6 rounded-2xl border-2 border-dashed border-border-color flex flex-col items-center gap-4">
             <div className="text-center">
               <Video size={40} className={selectedFileName ? 'text-brand-primary' : 'text-muted'} />
               <p className="text-xs text-secondary mt-2">
                 {selectedFileName ? `Video: ${selectedFileName}` : "Archivo de video para análisis Ergonómico por IA"}
               </p>
             </div>
             
             <input type="file" accept="video/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

             <div className="flex gap-3">
               <button type="button" className="btn bg-white/10" onClick={() => fileInputRef.current?.click()}>
                 {selectedFileName ? <><CheckCircle size={16} /> Cambiar Video</> : "Seleccionar Video"}
               </button>
               <button type="button" className="btn btn-primary" onClick={simulateAiAnalysis} disabled={isAnalyzing || (!selectedFileName && !formData.videoUrl)}>
                 {isAnalyzing ? "Analizando Puesto..." : <><Rocket size={16} /> Procesar IA</>}
               </button>
             </div>
          </div>

          {formData.analisisAi && (
            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-xs italic">
              {formData.analisisAi}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={handleCloseModal} className="btn bg-transparent border border-border-color">Cancelar</button>
            <button type="submit" className="btn btn-primary">{editingId ? "Actualizar" : "Guardar Puesto"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
