import { QRCodeSVG } from 'qrcode.react';
import { Mail, Phone, Camera, Globe, MessageSquare, Download, Share2, Rocket, Cloud, Zap } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export const Developers = () => {
  const currentUrl = window.location.origin;

  const features = [
    { icon: <Zap size={20} />, title: "Modo Offline", desc: "Funciona sin internet ni electricidad (PWA)." },
    { icon: <Cloud size={20} />, title: "Sincronización", desc: "Sube datos automáticamente al recuperar conexión." },
    { icon: <Rocket size={20} />, title: "IA Integrada", desc: "Análisis ergonómico visual de puestos por video." },
    { icon: <ShieldCheck size={20} />, title: "Auditoría", desc: "Seguimiento total de acciones y documentos (NRC)." },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold mb-4">Sobre los Desarrolladores</h1>
        <p className="text-secondary max-w-2xl mx-auto text-lg">
          Esta plataforma ha sido diseñada y construida por expertos en Seguridad y Salud en el Trabajo de Venezuela, combinando leyes vigentes con tecnología de vanguardia mundial.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="card p-8 flex flex-col items-center text-center gap-6 shadow-xl border-brand-primary/10"
        >
          <div className="p-4 bg-white rounded-2xl shadow-inner">
            <QRCodeSVG 
              value={currentUrl} 
              size={200} 
              level="H" 
              includeMargin={true}
              imageSettings={{
                src: logo,
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Escanea para Acceso Directo</h2>
            <p className="text-secondary text-sm">Escanea este código con tu cámara para abrir SIG-SST en cualquier dispositivo Android o iOS de manera instantánea.</p>
          </div>
          <div className="flex gap-4 w-100 flex-wrap justify-center mt-4">
             <div className="flex items-center gap-2 text-sm font-semibold bg-brand-primary/10 px-4 py-2 rounded-full text-brand-primary"><Share2 size={16} /> Compartir Enlace</div>
             <div className="flex items-center gap-2 text-sm font-semibold bg-brand-primary/10 px-4 py-2 rounded-full text-brand-primary"><Download size={16} /> Descargar QR</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="card p-8 bg-brand-primary/5 border-brand-primary/20">
             <div className="flex items-center gap-4 mb-6">
                <img src={logo} alt="ERGOEXPRESS" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                   <h2 className="text-2xl font-bold">ERGOEXPRESS, C.A.</h2>
                   <p className="text-brand-primary font-semibold">Consultora Integral de SST</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-4 text-secondary hover:text-brand-primary transition-colors cursor-pointer"><Phone size={20} /> <span>+58 424 4736489 / +58 412 4116804</span></div>
                <div className="flex items-center gap-4 text-secondary hover:text-brand-primary transition-colors cursor-pointer"><Mail size={20} /> <span>ergoexpressinfo@gmail.com</span></div>
                <div className="flex items-center gap-4 text-secondary hover:text-brand-primary transition-colors cursor-pointer"><Camera size={20} /> <span>@ergoexpress_ve</span></div>
                <div className="flex items-center gap-4 text-secondary hover:text-brand-primary transition-colors cursor-pointer"><Globe size={20} /> <span>www.ergoexpress.com.ve</span></div>
             </div>
             <button className="btn btn-primary w-100 mt-8 flex items-center justify-center gap-2"><MessageSquare size={18} /> Contactar Soporte Directo</button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {features.map((f, i) => (
          <div key={i} className="card p-6 border-brand-primary/5 hover:border-brand-primary/20 transition-all text-center">
             <div className="text-brand-primary mb-3 flex justify-center">{f.icon}</div>
             <h3 className="font-bold mb-2">{f.title}</h3>
             <p className="text-secondary text-xs">{f.desc}</p>
          </div>
        ))}
      </motion.div>

      <div className="text-center p-8 bg-brand-primary/5 rounded-3xl mt-8">
         <h2 className="text-2xl font-bold mb-4">¿Por qué instalar nuestra aplicación?</h2>
         <div className="max-w-2xl mx-auto text-secondary text-sm space-y-3">
            <p>✅ <strong>Independencia Eléctrica:</strong> Ingresa tus datos aunque no haya luz ni internet; el sistema guardará todo localmente y sincronizará al detectar conexión.</p>
            <p>✅ <strong>Acceso Instantáneo:</strong> Sin necesidad de abrir el navegador cada vez. Un toque desde tu pantalla de inicio.</p>
            <p>✅ <strong>Mayor Seguridad:</strong> Almacenamiento local encriptado y visualización nativa de archivos PDF.</p>
            <p>✅ <strong>Actualizaciones Transparentes:</strong> El sistema se mantiene al día con las últimas normativas INPSASEL de forma automática.</p>
         </div>
      </div>
    </div>
  );
};
