import { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [isRequestSent, setIsRequestSent] = useState(false);
  
  const { setCurrentUser, addPendingUser, users } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.isVerified);
    if (user) {
      setCurrentUser(user);
    } else {
      alert("Usuario no encontrado o aún no habilitado. Por favor, revisa tu correo de verificación.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@gmail.com')) {
      alert("Por favor use una dirección válida de Gmail.");
      return;
    }
    
    addPendingUser({
      id: uuidv4(),
      email,
      nombre,
      role: 'auditor',
      isVerified: false,
      createdAt: new Date().toISOString()
    });
    
    setIsRequestSent(true);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '2rem',
    background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    padding: '2.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s'
  };

  if (isRequestSent) {
    return (
      <div style={containerStyle}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={cardStyle}
        >
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', color: '#10b981' }}>
              <CheckCircle size={64} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', margin: 0 }}>Solicitud Enviada</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Hemos enviado un email de verificación a <br/>
              <strong style={{ color: '#3b82f6' }}>{email}</strong>.<br/><br/>
              Para propósitos de esta demostración, puedes usar el siguiente enlace:<br/>
              <a href={`/verify-demo?email=${email}`} style={{ color: '#3b82f6', fontWeight: 'bold' }}>Simular clic en enlace de verificación</a><br/><br/>
              Habilita tu acceso haciendo clic en el enlace recibido.
            </p>
            <button 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
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
            SIG<span style={{ color: '#26a69a' }}>SST</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 600 }}>Gestión Integral de Salud en el Trabajo</p>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isRegistering && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nombre Completo</label>
              <div style={inputWrapperStyle}>
                <UserIcon style={{ position: 'absolute', left: '1rem', color: '#64748b' }} size={20} />
                <input required type="text" style={inputStyle} placeholder="Nombre y Apellido" value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
            </div>
          )}

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Correo Corporativo Gmail</label>
            <div style={inputWrapperStyle}>
              <Mail style={{ position: 'absolute', left: '1rem', color: '#64748b' }} size={20} />
              <input required type="email" style={inputStyle} placeholder="ejemplo@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Contraseña de Acceso</label>
            <div style={inputWrapperStyle}>
              <Lock style={{ position: 'absolute', left: '1rem', color: '#64748b' }} size={20} />
              <input required type="password" style={inputStyle} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              backgroundColor: '#26a69a', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontWeight: 800, 
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 20px -3px rgba(38, 166, 154, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            {isRegistering ? "Solicitar Registro" : "Acceder al Sistema"}
            <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {isRegistering ? "¿Ya tienes una cuenta activa?" : "¿Aún no tienes acceso habilitado?"}
            <button 
              style={{ marginLeft: '0.5rem', color: '#3b82f6', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
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
