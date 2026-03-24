import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Empresa, Trabajador, PuestoTrabajo, 
  ProcesoTrabajo, ProcesoPeligroso, ProcesoPositivo, 
  EncuestaGH, User, AuditLog 
} from '../types';

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
  addPendingUser: (user: User) => void;
  verifyUser: (email: string) => void;
  addAuditLog: (action: string, details: string) => void;
  setActiveEmpresaId: (id: string | null) => void;
  setActivePuestoId: (id: string | null) => void;
  addEmpresa: (empresa: Empresa) => void;
  updateEmpresa: (id: string, updated: Partial<Empresa>) => void;
  deleteEmpresa: (id: string) => void;
  addTrabajador: (trabajador: Trabajador) => void;
  updateTrabajador: (id: string, updated: Partial<Trabajador>) => void;
  deleteTrabajador: (id: string) => void;
  addPuesto: (puesto: PuestoTrabajo) => void;
  updatePuesto: (id: string, updated: Partial<PuestoTrabajo>) => void;
  deletePuesto: (id: string) => void;
  addProcesoTrabajo: (proceso: ProcesoTrabajo) => void;
  updateProcesoTrabajo: (id: string, updated: Partial<ProcesoTrabajo>) => void;
  deleteProcesoTrabajo: (id: string) => void;
  addProcesoPeligroso: (proceso: ProcesoPeligroso) => void;
  updateProcesoPeligroso: (id: string, updated: Partial<ProcesoPeligroso>) => void;
  deleteProcesoPeligroso: (id: string) => void;
  addProcesoPositivo: (proceso: ProcesoPositivo) => void;
  updateProcesoPositivo: (id: string, updated: Partial<ProcesoPositivo>) => void;
  deleteProcesoPositivo: (id: string) => void;
  addEncuesta: (encuesta: EncuestaGH) => void;
  updateEncuesta: (id: string, updated: Partial<EncuestaGH>) => void;
  deleteEncuesta: (id: string) => void;
}

// ==========================================
// CASOS DE EJEMPLO MAESTRO (PRO NIVEL)
// ==========================================

const CASE_1_EMPRESA: Empresa = {
  id: 'pol-001',
  nombre: 'ALIMENTOS POLAR - PLANTA MODELO',
  rif: 'J-00012345-6',
  direccion: 'Valencia, Edo. Carabobo',
  telefono: '+58 241-1111111',
  email: 'prevencion.polar@polar.com.ve',
  departamentoPrincipal: 'PRODUCCION (PLANTA HARINA)',
  createdAt: new Date().toISOString()
};

const CASE_2_EMPRESA: Empresa = {
  id: 'reg-002',
  nombre: 'CERVECERIA REGIONAL, C.A.',
  rif: 'J-30067891-0',
  direccion: 'Cagua, Edo. Aragua',
  telefono: '+58 244-2222222',
  email: 'seguridad@regional.com.ve',
  departamentoPrincipal: 'LOGISTICA Y OPERACIONES',
  createdAt: new Date().toISOString()
};

const INITIAL_PUESTOS: PuestoTrabajo[] = [
  { id: 'pst-101', empresaId: 'pol-001', departamento: 'EMPAQUETADO', nombre: 'Operador de Empaquetadora Automática', descripcion: 'Controla la dosificación y sellado de paquetes de 1kg.', organizacionTrabajo: 'Turnos rotativos 8h. Ritmo impuesto. Supervisión por PLC.', createdAt: new Date().toISOString() },
  { id: 'pst-102', empresaId: 'pol-001', departamento: 'MANTENIMIENTO', nombre: 'Mecánico de Planta', descripcion: 'Reparación de motores y bandas transportadoras.', organizacionTrabajo: 'Tareas variadas. Alta carga física. Guardia activa.', createdAt: new Date().toISOString() },
  { id: 'pst-201', empresaId: 'reg-002', departamento: 'ALMACEN', nombre: 'Montacarguistas de Despacho', descripcion: 'Carga de camiones con paletas de producto terminado.', organizacionTrabajo: 'Metas por hora. Supervisión por cámaras y jefe de patio.', createdAt: new Date().toISOString() }
];

const INITIAL_TRABAJADORES: Trabajador[] = [
  { id: 'tr-01', empresaId: 'pol-001', puestoId: 'pst-101', nombre: 'Carlos Silva', cedula: 'V-15.123.456', edad: 38, instrucción: 'Técnico Mecánico', antiguedad: '12 años', genero: 'M', createdAt: new Date().toISOString() },
  { id: 'tr-02', empresaId: 'pol-001', puestoId: 'pst-102', nombre: 'Luis Martínez', cedula: 'V-18.456.789', edad: 31, instrucción: 'Mecánico Industrial', antiguedad: '5 años', genero: 'M', createdAt: new Date().toISOString() },
  { id: 'tr-03', empresaId: 'reg-002', puestoId: 'pst-201', nombre: 'Maria Pérez', cedula: 'V-22.333.444', edad: 27, instrucción: 'TSU Seguridad Ind.', antiguedad: '2 años', genero: 'F', createdAt: new Date().toISOString() }
];

const INITIAL_PROCESOS: ProcesoTrabajo[] = [
  { id: 'pt-101', correlativo: 1, empresaId: 'pol-001', puestoId: 'pst-101', codigo: 'PT-01', denominacion: 'Embalaje Continua de Harina', objeto: 'Harina de maíz precocida 1kg.', medios: 'Empaquetadora Bosch, Sensores, Túnel de termocogido.', actividad: 'Supervisar sellado y retirar paquetes defectuosos.', organizacion: 'División por turnos, supervisión directa.', createdAt: new Date().toISOString() },
  { id: 'pt-201', correlativo: 1, empresaId: 'reg-002', puestoId: 'pst-201', codigo: 'PT-01', denominacion: 'Despacho de Producto Terminado', objeto: 'Cajas de bebidas en paletas.', medios: 'Montacargas Toyota 2.5T, Escáner RF.', actividad: 'Mover paletas del almacén al camión.', organizacion: 'Ritmo por orden de guía SAP.', createdAt: new Date().toISOString() }
];

const INITIAL_PELIGROS: ProcesoPeligroso[] = [
  { id: 'pp-01', codigo: 'PP-01', procesoTrabajoId: 'pt-101', elemento: 'De los medios, materias primas e insumos', descripcion: 'Riesgo de atrapamiento en correas.', peligro: 'Partes móviles descubiertas', consecuencias: 'Amputaciones, traumatismos graves.', createdAt: new Date().toISOString() },
  { id: 'pp-02', codigo: 'PP-02', procesoTrabajoId: 'pt-101', elemento: 'Del objeto de trabajo', descripcion: 'Exposición a partículas en suspensión.', peligro: 'Polvo de Maíz', consecuencias: 'Asma ocupacional, neumoconiosis.', createdAt: new Date().toISOString() },
  { id: 'pp-03', codigo: 'PP-03', procesoTrabajoId: 'pt-201', elemento: 'De la interacción entre los medios, objeto y actividad', descripcion: 'Caída de carga por mal estibado.', peligro: 'Inestabilidad de paletas', consecuencias: 'Aplastamientos, muertes.', createdAt: new Date().toISOString() }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        { id: 'ee-boss', email: 'ergoexpressinfo@gmail.com', nombre: 'Admin ERGOEXPRESS', role: 'admin', isVerified: true, createdAt: new Date().toISOString() }
      ],
      auditLogs: [],
      empresas: [CASE_1_EMPRESA, CASE_2_EMPRESA],
      trabajadores: INITIAL_TRABAJADORES,
      puestos: INITIAL_PUESTOS,
      procesosTrabajo: INITIAL_PROCESOS,
      procesosPeligrosos: INITIAL_PELIGROS,
      procesosPositivos: [],
      encuestas: [
        { 
          id: 'egh-1', 
          correlativo: 1, 
          trabajadorId: 'tr-01', 
          puestoId: 'pst-101', 
          empresaId: 'pol-001', 
          fecha: '2026-03-23', 
          microclima: { calor: { exp: true, prob: 'Media', existent: 'Extractores', necessary: 'AC' }, frio: { exp: false, prob: 'Baja', existent: '', necessary: '' }, ventilacion: { exp: true, prob: 'Media', existent: '', necessary: '' }, humedad: { exp: false, prob: 'Baja', existent: '', necessary: '' }, otros: '' },
          contaminantes: { ruido: { exp: true, prob: 'Alta', existent: '', necessary: 'Protección auditiva' }, quimicos: { exp: false, prob: 'Baja', existent: '', necessary: '' }, radiacionesIon: { exp: false, prob: 'Baja', existent: '', necessary: '' }, radiacionesNoIon: { exp: false, prob: 'Baja', existent: '', necessary: '' }, vibraciones: { exp: false, prob: 'Baja', existent: '', necessary: '' }, microbios: { exp: false, prob: 'Baja', existent: '', necessary: '' }, polvos: { exp: true, prob: 'Alta', existent: 'Mascarillas', necessary: '' }, humos: { exp: false, prob: 'Baja', existent: '', necessary: '' }, iluminacion: { exp: true, prob: 'Media', existent: '', necessary: '' } },
          cargaFisica: { troncoDoblado: { exp: true, prob: 'Alta' }, sentadoPie: { exp: true, prob: 'Media' }, agachado: { exp: false, prob: 'Baja' }, arrodillado: { exp: false, prob: 'Baja' }, movForzados: { exp: true, prob: 'Media' }, levantamientoPesos: { exp: false, prob: 'Baja' }, repetitivos: { exp: true, prob: 'Alta' }, empujarPesos: { exp: false, prob: 'Baja' }, descripcion: 'Movimientos repetitivos en empaque.' },
          cargaMental: { monotonia: { exp: true, prob: 'Alta' }, atencion: { exp: true, prob: 'Alta' }, comunicacionPoca: { exp: true, prob: 'Media' }, supervisionExcesiva: { exp: false, prob: 'Baja' }, descripcion: 'Ritmo intenso.' },
          seguridad: { herramientas: { exp: true, prob: 'Media' }, electricidad: { exp: false, prob: 'Baja' }, señalizacion: { exp: true, prob: 'Media' }, objetosCortantes: { exp: false, prob: 'Baja' }, superficiesResbaladizas: { exp: false, prob: 'Baja' }, descripcion: '' },
          daños: { partesCuerpo: ['Columna', 'Auditivo'], enfermedadesComunes: '', enfermedadOcupacional: { tiene: false, cual: '' }, accidentes6Meses: { tiene: false, tipo: '', partes: '' } },
          mejorasPlanteadas: 'Instalar protectores de ruido fijos.',
          epp: { recibidos: true, listado: [{ item: 'Tapaoidos', si: true, condicion: 'Bueno', frecuencia: 'Diario' }, { item: 'Mascarilla', si: true, condicion: 'Regular', frecuencia: 'Diario' }] },
          educacion: { actividades: true, cuales: 'Inducción SHA', frecuencia: 'Mensual' },
          observaciones: 'El trabajador presenta fatiga visual.',
          delegadoId: ''
        }
      ],
      counters: { pt: 1, egh: 1, psst: 0 },
      activeEmpresaId: 'pol-001',
      activePuestoId: 'pst-101',
      
      setCurrentUser: (user) => set({ currentUser: user }),
      addPendingUser: (user) => set((state) => ({ users: [...state.users, user] })),
      verifyUser: (email) => set((state) => ({ users: state.users.map(u => u.email === email ? { ...u, isVerified: true } : u) })),
      addAuditLog: (action, details) => {
        const log: AuditLog = { id: uuidv4(), userId: get().currentUser?.id || 'SYSTEM', action, details, timestamp: new Date().toISOString() };
        set((state) => ({ auditLogs: [log, ...state.auditLogs].slice(0, 500) }));
      },
      setActiveEmpresaId: (id) => set({ activeEmpresaId: id }),
      setActivePuestoId: (id) => set({ activePuestoId: id }),
      addEmpresa: (e) => set((state) => ({ empresas: [...state.empresas, e] })),
      updateEmpresa: (id, u) => set((state) => ({ empresas: state.empresas.map((e) => (e.id === id ? { ...e, ...u } : e)) })),
      deleteEmpresa: (id) => set((state) => ({ empresas: state.empresas.filter((e) => e.id !== id) })),
      addTrabajador: (t) => set((state) => ({ trabajadores: [...state.trabajadores, t] })),
      updateTrabajador: (id, u) => set((state) => ({ trabajadores: state.trabajadores.map((t) => (t.id === id ? { ...t, ...u } : t)) })),
      deleteTrabajador: (id) => set((state) => ({ trabajadores: state.trabajadores.filter((t) => t.id !== id) })),
      addPuesto: (p) => set((state) => ({ puestos: [...state.puestos, p] })),
      updatePuesto: (id, u) => set((state) => ({ puestos: state.puestos.map((p) => (p.id === id ? { ...p, ...u } : p)) })),
      deletePuesto: (id) => set((state) => ({ puestos: state.puestos.filter((p) => p.id !== id) })),
      addProcesoTrabajo: (p) => { set((s) => ({ procesosTrabajo: [...s.procesosTrabajo, { ...p, correlativo: s.counters.pt + 1 }], counters: { ...s.counters, pt: s.counters.pt + 1 } })) },
      updateProcesoTrabajo: (id, u) => set((s) => ({ procesosTrabajo: s.procesosTrabajo.map(p => p.id === id ? {...p, ...u} : p) })),
      deleteProcesoTrabajo: (id) => set((s) => ({ procesosTrabajo: s.procesosTrabajo.filter(p => p.id !== id) })),
      addProcesoPeligroso: (p) => set((s) => ({ procesosPeligrosos: [...s.procesosPeligrosos, p] })),
      updateProcesoPeligroso: (id, u) => set((s) => ({ procesosPeligrosos: s.procesosPeligrosos.map(p => p.id === id ? {...p, ...u} : p) })),
      deleteProcesoPeligroso: (id) => set((s) => ({ procesosPeligrosos: s.procesosPeligrosos.filter(p => p.id !== id) })),
      addProcesoPositivo: (p) => set((s) => ({ procesosPositivos: [...s.procesosPositivos, p] })),
      updateProcesoPositivo: (id, u) => set((s) => ({ procesosPositivos: s.procesosPositivos.map(p => p.id === id ? {...p, ...u} : p) })),
      deleteProcesoPositivo: (id) => set((s) => ({ procesosPositivos: s.procesosPositivos.filter(p => p.id !== id) })),
      addEncuesta: (e) => { set((s) => ({ encuestas: [...s.encuestas, { ...e, correlativo: s.counters.egh + 1 }], counters: { ...s.counters, egh: s.counters.egh + 1 } })) },
      updateEncuesta: (id, u) => set((s) => ({ encuestas: s.encuestas.map(e => e.id === id ? {...e, ...u} : e) })),
      deleteEncuesta: (id) => set((s) => ({ encuestas: s.encuestas.filter(e => e.id !== id) })),
    }),
    { name: 'sig-sst-expert-v6' }
  )
);
