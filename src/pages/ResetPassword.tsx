import { useState, useEffect } from 'react';
import { Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  const { setCurrentUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay una sesión activa de Supabase (el enlace de recuperación inicia sesión automáticamente)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
      } else {
        // En algunos casos, el fragmento de hash tarda un momento en ser analizado por el cliente Supabase
        const hash = window.location.hash;
        if (hash && (hash.includes('type=recovery') || hash.includes('access_token='))) {
          const timer = setTimeout(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
              setHasSession(!!session);
            });
          }, 800);
          return () => clearTimeout(timer);
        } else {
          setHasSession(false);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasSession(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setErrorMsg("Error al actualizar la contraseña: " + error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      
      // Auto login in our Zustand store
      if (data?.user) {
        setCurrentUser({
          id: data.user.id,
          email: data.user.email!,
          nombre: data.user.user_metadata.nombre || data.user.email!,
          role: data.user.user_metadata.role || 'auditor',
          isVerified: true,
          createdAt: data.user.created_at
        });
      }
    }
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

  if (hasSession === null) {
    return (
      <div style={containerStyle} data-theme="dark">
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', color: '#90aeb2' }}>
            <p>Verificando estado de la sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
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
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e0f2f1', margin: 0 }}>Contraseña Restablecida</h2>
            <p style={{ color: '#90aeb2', fontSize: '1rem', lineHeight: 1.6 }}>
              Tu contraseña ha sido actualizada con éxito y tu sesión ha sido iniciada.
            </p>
            <button 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#006064', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
              onClick={() => navigate('/')}
            >
              Ir al Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (hasSession === false) {
    return (
      <div style={containerStyle} data-theme="dark">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={cardStyle}
        >
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: '#ef4444' }}>
              <AlertCircle size={64} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fca5a5', margin: 0 }}>Acceso Inválido</h2>
            <p style={{ color: '#90aeb2', fontSize: '1rem', lineHeight: 1.6 }}>
              El enlace de recuperación es inválido, ha expirado o ya no está disponible. Por favor solicita un nuevo correo de recuperación desde el inicio de sesión.
            </p>
            <button 
              style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', color: '#4db6ac', border: '1px solid #1a3f44', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
              onClick={() => navigate('/')}
            >
              Volver al Login
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
          <p style={{ color: '#90aeb2', fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: 600 }}>Establecer Nueva Contraseña</p>
        </div>

        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {errorMsg && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', fontSize: '0.9rem' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label style={labelStyle}>Nueva Contraseña</label>
            <div style={inputWrapperStyle}>
              <Lock style={{ position: 'absolute', left: '1.25rem', color: '#4db6ac' }} size={20} />
              <input 
                required 
                type="password" 
                style={inputStyle} 
                placeholder="Mínimo 6 caracteres" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Confirmar Contraseña</label>
            <div style={inputWrapperStyle}>
              <Lock style={{ position: 'absolute', left: '1.25rem', color: '#4db6ac' }} size={20} />
              <input 
                required 
                type="password" 
                style={inputStyle} 
                placeholder="Repite la contraseña" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
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
            {loading ? "Actualizando..." : "Restablecer Contraseña"}
            {!loading && <ArrowRight size={22} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
          <button 
            style={{ color: '#4db6ac', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.95rem' }}
            onClick={() => navigate('/')}
          >
            Cancelar y volver al Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};
