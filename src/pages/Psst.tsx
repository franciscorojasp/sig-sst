import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Psst = () => {
  const { procesosTrabajo, procesosPeligrosos, procesosPositivos } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Header
      doc.setFontSize(18);
      doc.text('Programa de Seguridad y Salud en el Trabajo', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Generado bajo lineamientos NT-03-2016 y LOPCYMAT', pageWidth / 2, 28, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 40);
      
      let currentY = 50;

      // Section 1: Procesos de Trabajo
      doc.setFontSize(14);
      doc.text('1. Identificación de Procesos de Trabajo', 14, currentY);
      currentY += 10;
      
      const ptData = procesosTrabajo.map(pt => [
        pt.codigo, 
        pt.denominacion, 
        pt.objeto, 
        pt.medios,
        pt.actividad,
        `${pt.organizacion.substring(0, 50)}...`,
        pt.fases || 'N/A'
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Cód', 'Denominación', 'Objeto (112)', 'Medios (112)', 'Actividad (113)', 'Org (114)', 'Fases (118)']],
        body: ptData,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [30, 95, 100] } // Teal Logo
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;

      // Section 2: Procesos Peligrosos
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(14);
      doc.text('2. Caracterización de Procesos Peligrosos (Numeral 120)', 14, currentY);
      currentY += 10;
      
      const ppData = procesosPeligrosos.map(pp => {
        const pt = procesosTrabajo.find(t => t.id === pp.procesoTrabajoId);
        return [
          pp.codigo, 
          pt ? pt.codigo : 'N/A', 
          pp.elemento, 
          pp.peligro,
          pp.descripcion,
          pp.consecuencias
        ];
      });
      
      autoTable(doc, {
        startY: currentY,
        head: [['NRC', 'Ref PT', 'Dimensión (120-122)', 'Peligro', 'Descripción', 'Impacto Salud (123)']],
        body: ppData,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [192, 57, 43] }
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;

      // Section 3: Procesos Positivos
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(14);
      doc.text('3. Procesos Positivos y Medidas de Control', 14, currentY);
      currentY += 10;
      
      const poData = procesosPositivos.map(po => {
        const pt = procesosTrabajo.find(t => t.id === po.procesoTrabajoId);
        return [
          po.codigo, 
          pt ? pt.codigo : 'N/A', 
          po.medida,
          po.beneficio
        ];
      });
      
      autoTable(doc, {
        startY: currentY,
        head: [['Cód', 'Ref PT', 'Medida Protectora', 'Beneficio a la Salud']],
        body: poData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [39, 174, 96] }
      });

      // Footer
      const pageCount = (doc.internal as any).getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 20, doc.internal.pageSize.height - 10, { align: 'right' });
      }

      doc.save('PSST_Documento.pdf');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el PDF. Asegúrese de tener datos para reportar.');
    } finally {
      setTimeout(() => setIsGenerating(false), 1000);
    }
  };

  return (
    <div className="flex-col gap-6 max-w-4xl mx-auto">
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Generación de Reportes PSST</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Sistema automatizado de informes técnicos según regulaciones vigentes LOPCYMAT y NT-03-2016.
        </p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>
              {procesosTrabajo.length}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Procesos de Trabajo</p>
          </div>
          
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#ef4444' }}>
              {procesosPeligrosos.length}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Riesgos Identificados</p>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#10b981' }}>
              {procesosPositivos.length}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Medidas Protectoras</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FileText size={20} /> Informes Técnicos
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>Incluye todos los Procesos de Trabajo caracterizados.</li>
              <li>Matriz de Procesos Peligrosos con sus estimaciones.</li>
              <li>Listado de Procesos Positivos y Protectores.</li>
              <li>Formato listo para impresión oficial.</li>
            </ul>
          </div>
          
          <div style={{ flexShrink: 0 }}>
            <button 
              onClick={generatePDF} 
              disabled={isGenerating || procesosTrabajo.length === 0}
              className="btn btn-primary shadow-md" 
              style={{ fontSize: '1.1rem', padding: '1rem 2rem', width: '100%', opacity: procesosTrabajo.length === 0 ? 0.5 : 1 }}
            >
              {isGenerating ? (
                <>Generando PDF...</>
              ) : (
                <><Download size={20} /> Exportar como PDF</>
              )}
            </button>
            {procesosTrabajo.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: '#ef4444', marginTop: '0.5rem', textAlign: 'center' }}>
                Debe registrar datos para generar reporte.
              </p>
            )}
          </div>
        </div>
      </div>
      <footer style={{ marginTop: '3rem', padding: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 1rem 0' }}>Desarrollado y Asesorado por ERGOEXPRESS, C.A.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <span>+58 424 4736489</span>
          <span>+58 412 4116804</span>
          <span>ergoexpressinfo@gmail.com</span>
          <span>@ergoexpress_ve</span>
        </div>
      </footer>
    </div>
  );
};
