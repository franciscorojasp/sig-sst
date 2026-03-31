import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Empresa, Trabajador, PuestoTrabajo, 
  ProcesoTrabajo, ProcesoPeligroso, ProcesoPositivo, 
  EncuestaGH, User, AuditLog 
} from '../types';
import { supabase } from '../lib/supabase';

interface AppState {
  currentUser: User | null;
  users: User[];
  auditLogs: AuditLog[];
  empresas: Empresa[];
  trabajadores: Trabajador[];
  puestos: PuestoTrabajo[];
  procesosTrabajo: ProcesoTrabajo[];
  procesosPeligrosos: ProcesoPeligroso[];
  procesosPositivos: ProcesoPositivo[];
  encuestas: EncuestaGH[];
  counters: { pt: number, egh: number, psst: number };
  activeEmpresaId: string | null;
  activePuestoId: string | null;
  setCurrentUser: (user: User | null) => void;
  syncFromCloud: () => Promise<void>;
  addAuditLog: (action: string, details: string) => void;
  setActiveEmpresaId: (id: string | null) => void;
  setActivePuestoId: (id: string | null) => void;
  addEmpresa: (empresa: Empresa) => Promise<void>;
  updateEmpresa: (id: string, updated: Partial<Empresa>) => Promise<void>;
  deleteEmpresa: (id: string) => Promise<void>;
  addTrabajador: (trabajador: Trabajador) => Promise<void>;
  updateTrabajador: (id: string, updated: Partial<Trabajador>) => Promise<void>;
  deleteTrabajador: (id: string) => Promise<void>;
  addPuesto: (puesto: PuestoTrabajo) => Promise<void>;
  updatePuesto: (id: string, updated: Partial<PuestoTrabajo>) => Promise<void>;
  deletePuesto: (id: string) => Promise<void>;
  addProcesoTrabajo: (proceso: ProcesoTrabajo) => Promise<void>;
  updateProcesoTrabajo: (id: string, updated: Partial<ProcesoTrabajo>) => Promise<void>;
  deleteProcesoTrabajo: (id: string) => Promise<void>;
  addProcesoPeligroso: (proceso: ProcesoPeligroso) => Promise<void>;
  updateProcesoPeligroso: (id: string, updated: Partial<ProcesoPeligroso>) => Promise<void>;
  deleteProcesoPeligroso: (id: string) => Promise<void>;
  addProcesoPositivo: (proceso: ProcesoPositivo) => Promise<void>;
  updateProcesoPositivo: (id: string, updated: Partial<ProcesoPositivo>) => Promise<void>;
  deleteProcesoPositivo: (id: string) => Promise<void>;
  addEncuesta: (encuesta: EncuestaGH) => Promise<void>;
  updateEncuesta: (id: string, updated: Partial<EncuestaGH>) => Promise<void>;
  deleteEncuesta: (id: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      auditLogs: [],
      empresas: [],
      trabajadores: [],
      puestos: [],
      procesosTrabajo: [],
      procesosPeligrosos: [],
      procesosPositivos: [],
      encuestas: [],
      counters: { pt: 0, egh: 0, psst: 0 },
      activeEmpresaId: null,
      activePuestoId: null,
      
      setCurrentUser: (user) => set({ currentUser: user }),

      syncFromCloud: async () => {
        const { data: emp } = await supabase.from('empresas').select('*');
        const { data: trab } = await supabase.from('trabajadores').select('*');
        const { data: pst } = await supabase.from('puestos_trabajo').select('*');
        const { data: pt } = await supabase.from('procesos_trabajo').select('*');
        const { data: pp } = await supabase.from('procesos_peligrosos').select('*');
        
        set({
          empresas: emp || [],
          trabajadores: trab || [],
          puestos: pst || [],
          procesosTrabajo: pt || [],
          procesosPeligrosos: pp || [],
        });
      },

      addAuditLog: (action, details) => {
        const log: AuditLog = { id: uuidv4(), userId: get().currentUser?.id || 'SYSTEM', action, details, timestamp: new Date().toISOString() };
        set((state) => ({ auditLogs: [log, ...state.auditLogs].slice(0, 500) }));
      },

      setActiveEmpresaId: (id) => set({ activeEmpresaId: id }),
      setActivePuestoId: (id) => set({ activePuestoId: id }),

      // EMPRESAS
      addEmpresa: async (e) => {
        set((state) => ({ empresas: [...state.empresas, e] }));
        await supabase.from('empresas').upsert(e);
      },
      updateEmpresa: async (id, u) => {
        set((state) => ({ empresas: state.empresas.map((e) => (e.id === id ? { ...e, ...u } : e)) }));
        await supabase.from('empresas').update(u).eq('id', id);
      },
      deleteEmpresa: async (id) => {
        set((state) => ({ empresas: state.empresas.filter((e) => e.id !== id) }));
        await supabase.from('empresas').delete().eq('id', id);
      },

      // TRABAJADORES
      addTrabajador: async (t) => {
        set((state) => ({ trabajadores: [...state.trabajadores, t] }));
        await supabase.from('trabajadores').upsert(t);
      },
      updateTrabajador: async (id, u) => {
        set((state) => ({ trabajadores: state.trabajadores.map((t) => (t.id === id ? { ...t, ...u } : t)) }));
        await supabase.from('trabajadores').update(u).eq('id', id);
      },
      deleteTrabajador: async (id) => {
        set((state) => ({ trabajadores: state.trabajadores.filter((t) => t.id !== id) }));
        await supabase.from('trabajadores').delete().eq('id', id);
      },

      // PUESTOS
      addPuesto: async (p) => {
        set((state) => ({ puestos: [...state.puestos, p] }));
        await supabase.from('puestos_trabajo').upsert(p);
      },
      updatePuesto: async (id, u) => {
        set((state) => ({ puestos: state.puestos.map((p) => (p.id === id ? { ...p, ...u } : p)) }));
        await supabase.from('puestos_trabajo').update(u).eq('id', id);
      },
      deletePuesto: async (id) => {
        set((state) => ({ puestos: state.puestos.filter((p) => p.id !== id) }));
        await supabase.from('puestos_trabajo').delete().eq('id', id);
      },

      // PROCESOS TRABAJO
      addProcesoTrabajo: async (p) => { 
        const newCorrelativo = get().counters.pt + 1;
        const process = { ...p, correlativo: newCorrelativo };
        set((s) => ({ procesosTrabajo: [...s.procesosTrabajo, process], counters: { ...s.counters, pt: newCorrelativo } }));
        await supabase.from('procesos_trabajo').upsert(process);
      },
      updateProcesoTrabajo: async (id, u) => {
        set((s) => ({ procesosTrabajo: s.procesosTrabajo.map(p => p.id === id ? {...p, ...u} : p) }));
        await supabase.from('procesos_trabajo').update(u).eq('id', id);
      },
      deleteProcesoTrabajo: async (id) => {
        set((s) => ({ procesosTrabajo: s.procesosTrabajo.filter(p => p.id !== id) }));
        await supabase.from('procesos_trabajo').delete().eq('id', id);
      },

      // PROCESOS PELIGROSOS
      addProcesoPeligroso: async (p) => {
        set((s) => ({ procesosPeligrosos: [...s.procesosPeligrosos, p] }));
        await supabase.from('procesos_peligrosos').upsert(p);
      },
      updateProcesoPeligroso: async (id, u) => {
        set((s) => ({ procesosPeligrosos: s.procesosPeligrosos.map(p => p.id === id ? {...p, ...u} : p) }));
        await supabase.from('procesos_peligrosos').update(u).eq('id', id);
      },
      deleteProcesoPeligroso: async (id) => {
        set((s) => ({ procesosPeligrosos: s.procesosPeligrosos.filter(p => p.id !== id) }));
        await supabase.from('procesos_peligrosos').delete().eq('id', id);
      },

      // PROCESOS POSITIVOS
      addProcesoPositivo: async (p) => {
        set((s) => ({ procesosPositivos: [...s.procesosPositivos, p] }));
        await supabase.from('procesos_positivos').upsert(p);
      },
      updateProcesoPositivo: async (id, u) => {
        set((s) => ({ procesosPositivos: s.procesosPositivos.map(p => p.id === id ? {...p, ...u} : p) }));
        await supabase.from('procesos_positivos').update(u).eq('id', id);
      },
      deleteProcesoPositivo: async (id) => {
        set((s) => ({ procesosPositivos: s.procesosPositivos.filter(p => p.id !== id) }));
        await supabase.from('procesos_positivos').delete().eq('id', id);
      },

      // ENCUESTAS
      addEncuesta: async (e) => { 
        const newCorrelativo = get().counters.egh + 1;
        const encuesta = { ...e, correlativo: newCorrelativo };
        set((s) => ({ encuestas: [...s.encuestas, encuesta], counters: { ...s.counters, egh: newCorrelativo } }));
        await supabase.from('encuestas_gh').upsert({
          id: encuesta.id,
          trabajador_id: encuesta.trabajadorId,
          puesto_id: encuesta.puestoId,
          empresa_id: encuesta.empresaId,
          fecha: encuesta.fecha,
          datos_raw: encuesta
        });
      },
      updateEncuesta: async (id, u) => {
        set((s) => ({ encuestas: s.encuestas.map(e => e.id === id ? {...e, ...u} : e) }));
        // For surveys, we update the whole raw data
        const updated = get().encuestas.find(e => e.id === id);
        if (updated) {
          await supabase.from('encuestas_gh').update({ datos_raw: updated }).eq('id', id);
        }
      },
      deleteEncuesta: async (id) => {
        set((s) => ({ encuestas: s.encuestas.filter(e => e.id !== id) }));
        await supabase.from('encuestas_gh').delete().eq('id', id);
      },
    }),
    { name: 'sig-sst-expert-v6' }
  )
);
