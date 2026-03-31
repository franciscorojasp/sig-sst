import { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabase';

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { setCurrentUser } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error de acceso: " + error.message);
    } else if (data.user) {
      setCurrentUser({
        id: data.user.id,
        email: data.user.email!,
        nombre: data.user.user_metadata.nombre || data.user.email!,
        role: data.user.user_metadata.role || 'auditor',
        isVerified: true,
        createdAt: data.user.created_at
      });
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@gmail.com')) {
      alert("Por favor use una dirección válida de Gmail.");
      return;
    }
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          role: 'auditor'
        }
      }
    });

    if (error) {
      alert("Error de registro: " + error.message);
    } else {
      setIsRequestSent(true);
    }
    setLoading(false);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '2rem',
    background: 'radial-gradient(circle at top right, #041416, #000000)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'rgba(10, 35, 38, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    padding: '2.5rem',
    border: '1px solid rgba(77, 182, 172, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  };

  if (isRequestSent) {
    return (
      <div style={containerStyle}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={cardStyle}
        >
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(77, 182, 172, 0.1)', borderRadius: '50%', color: '#4db6ac' }}>
              <CheckCircle size={64} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', margin: 0 }}>Solicitud Enviada</h2>
            <p style={{ color: '#90aeb2', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Hemos enviado un email de verificación a <br/>
              <strong style={{ color: '#4db6ac' }}>{email}</strong>.<br/><br/>
              Habilita tu acceso haciendo clic en el enlace recibido.
            </p>
            <button 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#006064', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => setIsRequestSent(false)}
            >
              Volver al Inicio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={cardStyle}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '0', backgroundColor: 'transparent', borderRadius: '50%', marginBottom: '1rem', overflow: 'hidden' }}>
            <img src={logo} alt="ERGOEXPRESS Logo" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.025em' }}>
            SIG<span style={{ color: '#4db6ac' }}>SST</span>
          </h1>
          <p style={{ color: '#90aeb2', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 600 }}>Gestión Integral de Salud en el Trabajo</p>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isRegistering && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-teal-200 uppercase">Nombre Completo</label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-4 text-teal-500/50" size={20} />
                <input required type="text" className="w-full pl-12 pr-4 py-3 bg-teal-950/30 border border-teal-500/20 rounded-xl text-white outline-none focus:border-teal-400 transition-all" placeholder="Nombre y Apellido" value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-teal-200 uppercase">Correo Corporativo Gmail</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-teal-500/50" size={20} />
              <input required type="email" className="w-full pl-12 pr-4 py-3 bg-teal-950/30 border border-teal-500/20 rounded-xl text-white outline-none focus:border-teal-400 transition-all" placeholder="ejemplo@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-teal-200 uppercase">Contraseña</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-teal-500/50" size={20} />
              <input required type="password" className="w-full pl-12 pr-4 py-3 bg-teal-950/30 border border-teal-500/20 rounded-xl text-white outline-none focus:border-teal-400 transition-all" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-100 p-4 rounded-xl font-bold text-lg mt-4 flex items-center justify-center gap-2 transition-all ${loading ? 'bg-teal-900 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-900/40'}`}
            style={{ color: 'white', border: 'none' }}
          >
            {loading ? "Procesando..." : (isRegistering ? "Solicitar Registro" : "Acceder al Sistema")}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem' }}>
          <p style={{ color: '#90aeb2', fontSize: '0.875rem' }}>
            {isRegistering ? "¿Ya tienes una cuenta activa?" : "¿Aún no tienes acceso habilitado?"}
            <button 
              style={{ marginLeft: '0.5rem', color: '#4db6ac', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Inicia Sesión aquí" : "Regístrate ahora"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
