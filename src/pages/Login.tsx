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
    backgroundColor: '#0a2326',
    borderRadius: '24px',
    padding: '3rem 2.5rem',
    border: '1px solid #1a3f44',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 800,
    color: '#e0f2f1', // High contrast pale teal
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem'
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem 1rem 1rem 3.5rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1.5px solid #1a3f44',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s'
  };

  if (isRequestSent) {
    return (
      <div style={containerStyle} data-theme="dark">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={cardStyle}
        >
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(77, 182, 172, 0.1)', borderRadius: '50%', color: '#4db6ac' }}>
              <CheckCircle size={64} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e0f2f1', margin: 0 }}>Solicitud Enviada</h2>
            <p style={{ color: '#90aeb2', fontSize: '1rem', lineHeight: 1.6 }}>
              Hemos enviado un email de verificación a <br/>
              <strong style={{ color: '#4db6ac', fontWeight: 800 }}>{email}</strong>.<br/><br/>
              Habilita tu acceso haciendo clic en el enlace recibido.
            </p>
            <button 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#006064', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
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
    <div style={containerStyle} data-theme="dark">
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={cardStyle}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '0', backgroundColor: 'transparent', borderRadius: '50%', marginBottom: '1.5rem', overflow: 'hidden', border: '2px solid rgba(77, 182, 172, 0.3)' }}>
            <img src={logo} alt="ERGOEXPRESS Logo" style={{ width: '130px', height: '130px', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            SIG<span style={{ color: '#4db6ac' }}>SST</span>
          </h1>
          <p style={{ color: '#90aeb2', fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: 600 }}>Gestión Integral de Salud en el Trabajo</p>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isRegistering && (
            <div>
              <label style={labelStyle}>Nombre Completo</label>
              <div style={inputWrapperStyle}>
                <UserIcon style={{ position: 'absolute', left: '1.25rem', color: '#4db6ac' }} size={20} />
                <input required type="text" style={inputStyle} placeholder="Nombre y Apellido" value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>Correo Corporativo Gmail</label>
            <div style={inputWrapperStyle}>
              <Mail style={{ position: 'absolute', left: '1.25rem', color: '#4db6ac' }} size={20} />
              <input required type="email" style={inputStyle} placeholder="ejemplo@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <div style={inputWrapperStyle}>
              <Lock style={{ position: 'absolute', left: '1.25rem', color: '#4db6ac' }} size={20} />
              <input required type="password" style={inputStyle} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '1.25rem', 
              backgroundColor: loading ? '#0e2f33' : '#006064', 
              color: 'white', 
              border: 'none', 
              borderRadius: '16px', 
              fontWeight: 900, 
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: loading ? 'none' : '0 10px 25px -5px rgba(0, 96, 100, 0.5)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? "Procesando..." : (isRegistering ? "Solicitar Registro" : "Acceder al Sistema")}
            {!loading && <ArrowRight size={22} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
          <p style={{ color: '#90aeb2', fontSize: '0.9rem' }}>
            {isRegistering ? "¿Ya tienes una cuenta activa?" : "¿Aún no tienes acceso habilitado?"}
            <button 
              style={{ marginLeft: '1rem', color: '#4db6ac', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.95rem' }}
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
