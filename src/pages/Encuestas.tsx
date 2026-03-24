import { useState } from 'react';
import { Plus, Edit2, Trash2, Download, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/Modal';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { EncuestaGH } from '../types';

export const Encuestas = () => {
  const { encuestas, trabajadores, puestos, empresas, addEncuesta, deleteEncuesta, updateEncuesta, activeEmpresaId } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyEncuesta = (): EncuestaGH => ({
    id: '',
    correlativo: 0,
    trabajadorId: '',
    puestoId: '',
    empresaId: activeEmpresaId || '',
    fecha: new Date().toISOString().split('T')[0],
    microclima: {
      calor: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      frio: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      ventilacion: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      humedad: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      otros: ''
    },
    contaminantes: {
      ruido: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      quimicos: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      radiacionesIon: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      radiacionesNoIon: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      vibraciones: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      microbios: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      polvos: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      humos: { exp: false, prob: 'Baja', existent: '', necessary: '' },
      iluminacion: { exp: false, prob: 'Baja', existent: '', necessary: '' }
    },
    cargaFisica: {
      troncoDoblado: { exp: false, prob: 'Baja' },
      sentadoPie: { exp: false, prob: 'Baja' },
      agachado: { exp: false, prob: 'Baja' },
      arrodillado: { exp: false, prob: 'Baja' },
      movForzados: { exp: false, prob: 'Baja' },
      levantamientoPesos: { exp: false, prob: 'Baja' },
      repetitivos: { exp: false, prob: 'Baja' },
      empujarPesos: { exp: false, prob: 'Baja' },
      descripcion: ''
    },
    cargaMental: {
      monotonia: { exp: false, prob: 'Baja' },
      atencion: { exp: false, prob: 'Baja' },
      comunicacionPoca: { exp: false, prob: 'Baja' },
      supervisionExcesiva: { exp: false, prob: 'Baja' },
      descripcion: ''
    },
    seguridad: {
      herramientas: { exp: false, prob: 'Baja' },
      electricidad: { exp: false, prob: 'Baja' },
      señalizacion: { exp: false, prob: 'Baja' },
      objetosCortantes: { exp: false, prob: 'Baja' },
      superficiesResbaladizas: { exp: false, prob: 'Baja' },
      descripcion: ''
    },
    daños: {
      partesCuerpo: [],
      enfermedadesComunes: '',
      enfermedadOcupacional: { tiene: false, cual: '' },
      accidentes6Meses: { tiene: false, tipo: '', partes: '' }
    },
    mejorasPlanteadas: '',
    epp: { recibidos: false, listado: [] },
    educacion: { actividades: false, cuales: '', frecuencia: '' },
    observaciones: '',
    delegadoId: ''
  });

  const [formData, setFormData] = useState<EncuestaGH>(emptyEncuesta());

  const generatePDF = (encuesta: EncuestaGH) => {
    const doc = new jsPDF();
    const trab = trabajadores.find(t => t.id === encuesta.trabajadorId);
    const pue = puestos.find(p => p.id === encuesta.puestoId);
    const empresa = empresas.find(e => e.id === encuesta.empresaId);
    
    // Header
    doc.setFillColor(30, 95, 100); // Teal Brand
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('REPORTE TÉCNICO: ENCUESTA DE GRUPOS HOMOGÉNEOS', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('METODOLOGÍA ENFOQUE ALTERNO - ÓSCAR BETANCOURT', 105, 22, { align: 'center' });
    doc.text(`NRC: ${encuesta.correlativo.toString().padStart(5, '0')}`, 105, 30, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('1. DATOS DE IDENTIFICACIÓN', 14, 50);
    doc.setFont('helvetica', 'normal');
    
    autoTable(doc, {
      startY: 55,
      body: [
        ['EMPRESA:', empresa?.nombre || 'N/A', 'RIF:', empresa?.rif || 'N/A'],
        ['TRABAJADOR:', trab?.nombre || 'N/A', 'CÉDULA:', trab?.cedula || 'N/A'],
        ['PUESTO:', pue?.nombre || 'N/A', 'DEPTO:', pue?.departamento || 'N/A'],
        ['FECHA:', encuesta.fecha, 'ANTIGÜEDAD:', trab?.antiguedad || 'N/A']
      ],
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 1 }
    });

    let currentY = (doc as any).lastAutoTable.finalY + 10;

    // Table 1: Microclima y Contaminantes
    doc.setFont('helvetica', 'bold');
    doc.text('2. CARACTERIZACIÓN PROCESOS PELIGROSOS (NUMERAL 120)', 14, currentY);
    currentY += 5;
    
    const factorsData = [
      ['FACTOR', 'EXP', 'PROB', 'MEDIDAS EXISTENTES', 'NECESARIAS'],
      ['Ruido', encuesta.contaminantes.ruido.exp ? 'SI' : 'NO', encuesta.contaminantes.ruido.prob, encuesta.contaminantes.ruido.existent, encuesta.contaminantes.ruido.necessary],
      ['Iluminación', encuesta.contaminantes.iluminacion.exp ? 'SI' : 'NO', encuesta.contaminantes.iluminacion.prob, encuesta.contaminantes.iluminacion.existent, encuesta.contaminantes.iluminacion.necessary],
      ['Calor/Tª', encuesta.microclima.calor.exp ? 'SI' : 'NO', encuesta.microclima.calor.prob, encuesta.microclima.calor.existent, encuesta.microclima.calor.necessary],
      ['Químicos', encuesta.contaminantes.quimicos.exp ? 'SI' : 'NO', encuesta.contaminantes.quimicos.prob, encuesta.contaminantes.quimicos.existent, encuesta.contaminantes.quimicos.necessary],
      ['Vibraciones', encuesta.contaminantes.vibraciones.exp ? 'SI' : 'NO', encuesta.contaminantes.vibraciones.prob, encuesta.contaminantes.vibraciones.existent, encuesta.contaminantes.vibraciones.necessary],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [factorsData[0]],
      body: factorsData.slice(1),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 95, 100] }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Table 2: Cargas Física y Mental
    doc.setFont('helvetica', 'bold');
    doc.text('3. CARGA FÍSICA Y MENTAL (NUMERAL 121)', 14, currentY);
    currentY += 5;

    const cargaData = [
      ['TIPO DE CARGA', 'PERCEPCIÓN TRABAJADOR', 'PROBABILIDAD'],
      ['Posturas / Pesos', encuesta.cargaFisica.descripcion || 'Sin especificar', encuesta.cargaFisica.repetitivos.prob],
      ['Mental / Atención', encuesta.cargaMental.descripcion || 'Sin especificar', encuesta.cargaMental.atencion.prob],
      ['Org. del Trabajo', 'División y Jornada (Numeral 114)', 'Analizado'],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [cargaData[0]],
      body: cargaData.slice(1),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 73, 94] }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
    if (currentY > 250) { doc.addPage(); currentY = 20; }

    // Section: Daños y Mejoras
    doc.setFont('helvetica', 'bold');
    doc.text('4. MANIFESTACIONES TEMPRANAS Y MEJORAS (NUMERAL 123)', 14, currentY);
    currentY += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text('MANIFESTACIONES REPORTADAS:', 14, currentY);
    doc.setFontSize(8);
    const mtText = encuesta.daños.partesCuerpo.join(', ') || 'Ninguna reportada';
    doc.text(mtText, 70, currentY);
    currentY += 8;
    
    doc.setFontSize(10);
    doc.text('MEJORAS PLANTEADAS POR EL GRUPO:', 14, currentY);
    doc.setFontSize(8);
    const splitMejoras = doc.splitTextToSize(encuesta.mejorasPlanteadas || 'Sin observaciones del grupo.', 170);
    doc.text(splitMejoras, 14, currentY + 5);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    const str = `Página ${doc.getNumberOfPages()}`;
    doc.text(str, 105, 285, { align: 'center' });
    doc.text('Generado por SIG-SST ERGOEXPRESS - Control Documental Garantizado', 105, 290, { align: 'center' });

    const rawFileName = `${empresa?.nombre || 'EMP'}_${pue?.departamento || 'ST'}_${pue?.nombre || 'PST'}_${encuesta.correlativo.toString().padStart(4, '0')}.pdf`;
    const fileName = rawFileName.replace(/\s+/g, '_');
    doc.save(fileName);
  };

  const filtered = encuestas.filter(e => !activeEmpresaId || e.empresaId === activeEmpresaId);

  return (
    <div className="flex-col gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Encuestas de Grupos Homogéneos (NRC)</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Control Numérico Documental Profesional.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nueva Encuesta
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
         {filtered.map(e => {
            const trab = trabajadores.find(t => t.id === e.trabajadorId);
            const pue = puestos.find(p => p.id === e.puestoId);
            return (
              <div key={e.id} className="card p-6 border-t-4 border-accent-success">
                 <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <Users size={24} className="text-accent-success" />
                       <div>
                          <h3 className="text-sm font-bold m-0">{trab?.nombre || 'Trabajador'}</h3>
                          <span className="text-xs text-secondary">NRC: {e.correlativo.toString().padStart(4, '0')}</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="btn-icon" onClick={() => { setEditingId(e.id); setFormData(e); setIsModalOpen(true); }}><Edit2 size={14} /></button>
                       <button className="btn-icon text-red-500" onClick={() => deleteEncuesta(e.id)}><Trash2 size={14} /></button>
                    </div>
                 </div>
                 
                 <div className="text-xs space-y-2 mb-4">
                    <div className="flex justify-between"><span>Puesto:</span> <span className="font-bold">{pue?.nombre || 'N/A'}</span></div>
                    <div className="flex justify-between"><span>Fecha:</span> <span>{e.fecha}</span></div>
                 </div>

                 <button className="btn w-100 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30" onClick={() => generatePDF(e)}>
                    <Download size={14} /> Descargar Reporte NRC
                 </button>
              </div>
            );
         })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Encuesta" : "Nueva Encuesta GH"}>
         <form onSubmit={(ev) => {
            ev.preventDefault();
            if (editingId) updateEncuesta(editingId, formData);
            else addEncuesta({ ...formData, id: uuidv4() });
            setIsModalOpen(false);
            setEditingId(null);
            setFormData(emptyEncuesta());
         }} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                  <label>Trabajador</label>
                  <select required className="input-field" value={formData.trabajadorId} onChange={e => {
                     const t = trabajadores.find(tr => tr.id === e.target.value);
                     setFormData({...formData, trabajadorId: e.target.value, puestoId: t?.puestoId || '', empresaId: t?.empresaId || ''});
                  }}>
                     <option value="">Seleccionar...</option>
                     {trabajadores.filter(t => !activeEmpresaId || t.empresaId === activeEmpresaId).map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
               </div>
               <div className="flex flex-col gap-2">
                  <label>Fecha</label>
                  <input type="date" className="input-field" value={formData.fecha} onChange={ev => setFormData({...formData, fecha: ev.target.value})} />
               </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
               <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
               <button type="submit" className="btn btn-primary">{editingId ? "Actualizar" : "Guardar Encuesta"}</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};
