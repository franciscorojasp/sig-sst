import { createClient } from '@supabase/supabase-js';

// TODO: Reemplaza esto con tu configuración real de Supabase
// Supabase es una excelente alternativa gratuita recomendada previamente
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

/* 
 * GUÍA DE INTEGRACIÓN CON ZUSTAND:
 * Para sustituir el almacenamiento local por persistencia en la nube:
 * 1. Crea las tablas 'procesos_trabajo', 'procesos_peligrosos' y 'procesos_positivos' en Supabase.
 * 2. En useStore.ts, utiliza supabase.from('tabla').insert(data) en lugar de solo set(state).
 * 3. Usa supabase.from('tabla').on('*', payload => ...) para actualizaciones en tiempo real.
 */
