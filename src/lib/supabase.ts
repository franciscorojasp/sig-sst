import { createClient } from '@supabase/supabase-js';

// TODO: Reemplaza esto con tu configuración real de Supabase
// Supabase es una excelente alternativa gratuita recomendada previamente
const supabaseUrl = 'https://gxweleqduvjmbolvfppg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d2VsZXFkdXZqbWJvbHZmcHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MzA5NjQsImV4cCI6MjA5MDQwNjk2NH0.sixAzHTZMzTxJQljtyHLa_hDFw5lXfKsCtbrapFB4yM';

export const supabase = createClient(supabaseUrl, supabaseKey);

/* 
 * GUÍA DE INTEGRACIÓN CON ZUSTAND:
 * Para sustituir el almacenamiento local por persistencia en la nube:
 * 1. Crea las tablas 'procesos_trabajo', 'procesos_peligrosos' y 'procesos_positivos' en Supabase.
 * 2. En useStore.ts, utiliza supabase.from('tabla').insert(data) en lugar de solo set(state).
 * 3. Usa supabase.from('tabla').on('*', payload => ...) para actualizaciones en tiempo real.
 */
