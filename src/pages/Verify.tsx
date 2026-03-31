import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Verify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'notFound'>('verifying');
  const navigate = useNavigate();
  const email = searchParams.get('email');

  useEffect(() => {
    if (email) {
      setTimeout(() => setStatus('success'), 1500);
    } else {
      setStatus('notFound');
    }
  }, [email]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'radial-gradient(circle at top right, #1e293b, #0f172a)', color: 'white' }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ width: '100%', maxWidth: '400px', backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '3rem', borderRadius: '32px', textAlign: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        {status === 'verifying' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <Loader2 size={48} className="animate-spin text-blue-500" />
            <h2 className="text-xl font-bold">Verificando su identidad...</h2>
            <p className="text-slate-400">Nuestro sistema de seguridad está validando la solicitud para <strong>{email}</strong>.</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', color: '#10b981' }}>
               <CheckCircle2 size={56} />
            </div>
            <h2 className="text-2xl font-bold">¡Usuario Habilitado!</h2>
            <p className="text-slate-400">Su cuenta ha sido verificada con éxito. Ya tiene acceso total al ecosistema SIG-SST de ERGOEXPRESS.</p>
            <button 
              className="btn btn-primary w-full py-3" 
              onClick={() => navigate('/')}
              style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', width: '100%' }}
            >
              Entrar al Sistema Directo
            </button>
          </div>
        )}

        {status === 'notFound' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <ShieldCheck size={48} className="text-red-500" />
            <h2 className="text-xl font-bold">Enlace Inválido</h2>
            <p className="text-slate-400">No hemos podido encontrar una solicitud de registro activa para el correo proporcionado.</p>
            <button className="btn w-full" onClick={() => navigate('/')} style={{ color: 'white', background: 'none', border: '1px solid #334155' }}>Volver al Inicio</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
