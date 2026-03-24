import { HelpCircle, Book, FileText, Activity, ShieldCheck, Factory, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export const Help = () => {
  const sections = [
    {
      icon: <Factory className="text-blue-500" />,
      title: "Gestión de Empresas y Puestos",
      content: "Lo primero es registrar la Empresa con su RIF. Luego, crea los Puestos de Trabajo. En cada puesto, puedes subir un video para que la IA de ERGOEXPRESS analice las posturas y movimientos automáticamente."
    },
    {
      icon: <Activity className="text-orange-500" />,
      title: "Caracterización de Procesos",
      content: "Define los Procesos de Trabajo vinculados a cada puesto. Describe el Objeto, Medios y la Organización del Trabajo. Luego, identifica los Procesos Peligrosos y Positivos para generar el mapa de riesgos."
    },
    {
      icon: <ShieldCheck className="text-green-500" />,
      title: "Censo y Encuestas GH",
      content: "Registra a los trabajadores en el censo. Para el control legal, realiza las Encuestas de Grupos Homogéneos. El sistema generará un PDF con nomenclatura NRC (Empresa-Depto-Puesto-Nro) lista para auditoría."
    },
    {
      icon: <FileText className="text-purple-500" />,
      title: "Generación de Informes",
      content: "En el módulo 'Informes Expertos', podrás consolidar toda la data en un Informe Técnico completo bajo la norma NT-03-2016."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <HelpCircle size={48} className="mx-auto text-brand-primary mb-4" />
        <h1 className="text-3xl font-extrabold mb-2">Guía de Uso SIG-SST</h1>
        <p className="text-secondary">Aprende a dominar la herramienta integral de seguridad y salud en el trabajo.</p>
      </div>

      <div className="grid gap-8">
        {sections.map((s, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="card p-6 flex gap-6 hover:shadow-lg transition-shadow"
          >
            <div className="p-4 bg-slate-500/5 rounded-2xl h-fit">{s.icon}</div>
            <div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-secondary leading-relaxed text-sm">{s.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-brand-primary" />
          <h2 className="text-xl font-bold">Consejos para Auditorías</h2>
        </div>
        <ul className="space-y-4 text-sm text-secondary">
          <li className="flex gap-3">
            <span className="font-bold text-brand-primary">01.</span>
            <span>Mantén siempre el **Active Empresa** seleccionada en la barra superior para filtrar los datos correctamente.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-brand-primary">02.</span>
            <span>Usa la **Nomenclatura NRC** en las encuestas para que los inspectores de INPSASEL encuentren la secuencia documental rápido.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-brand-primary">03.</span>
            <span>Aprovecha el **Análisis de Video por IA** para fundamentar tus recomendaciones ergonómicas con datos objetivos.</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 text-center p-6 border-2 border-dashed border-border-color rounded-2xl">
         <Book className="mx-auto text-muted mb-2" />
         <p className="text-xs text-muted">Para soporte técnico avanzado, contacta a ergoexpressinfo@gmail.com</p>
      </div>
    </div>
  );
};
