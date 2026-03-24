export interface User {
  id: string;
  email: string;
  nombre: string;
  role: 'admin' | 'auditor' | 'empresa_rel';
  isVerified: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface Empresa {
  id: string;
  nombre: string;
  rif: string;
  direccion: string;
  telefono: string;
  email: string;
  departamentoPrincipal?: string; 
  logoUrl?: string;
  createdAt: string;
}

export interface Trabajador {
  id: string;
  empresaId: string;
  puestoId: string;
  nombre: string;
  cedula: string;
  edad: number;
  instrucción: string;
  antiguedad: string;
  genero: 'M' | 'F' | 'Otro';
  createdAt: string;
}

export interface PuestoTrabajo {
  id: string;
  empresaId: string;
  departamento?: string; 
  nombre: string;
  descripcion: string;
  organizacionTrabajo: string; 
  videoUrl?: string;
  analisisAi?: string;
  createdAt: string;
}

/**
 * Numeral 111 - Proceso de Trabajo (Metodología Betancourt)
 */
export interface ProcesoTrabajo {
  id: string;
  empresaId: string;
  puestoId: string;
  codigo: string;
  correlativo: number; 
  denominacion: string;
  
  // Numeral 112
  objeto: string; 
  medios: string; 
  
  // Numeral 113
  actividad: string; 
  
  // Numeral 114
  organizacion: string; 
  
  // Numeral 118
  fases?: string;
  
  // Numeral 120
  entorno?: string;
  serviciosBasicos?: string;
  
  createdAt: string;
}

/**
 * Numeral 120 - Procesos Peligrosos (Clasificación Betancourt)
 */
export interface ProcesoPeligroso {
  id: string;
  procesoTrabajoId: string;
  codigo: string;
  
  // Sub-numerales 120-122
  elemento: 
    | 'Del objeto de trabajo' 
    | 'De los medios, materias primas e insumos' 
    | 'De la organización y división del trabajo' 
    | 'De la interacción entre los medios, objeto y actividad' 
    | 'Del entorno de trabajo' 
    | 'De los medios de protección' 
    | 'De los servicios y condiciones de vida';

  descripcion: string;
  peligro: string;
  consecuencias: string; // Numeral 123 - Impactos en la salud
  createdAt: string;
}

export interface ProcesoPositivo {
  id: string;
  procesoTrabajoId: string;
  codigo: string;
  descripcion: string;
  beneficio: string;
  medida: string;
  createdAt: string;
}

export interface EncuestaGH {
  id: string;
  correlativo: number;
  trabajadorId: string;
  puestoId: string;
  empresaId: string;
  fecha: string;
  
  microclima: {
    calor: { exp: boolean; prob: string; existent: string; necessary: string };
    frio: { exp: boolean; prob: string; existent: string; necessary: string };
    ventilacion: { exp: boolean; prob: string; existent: string; necessary: string };
    humedad: { exp: boolean; prob: string; existent: string; necessary: string };
    otros: string;
  };
  contaminantes: {
    ruido: { exp: boolean; prob: string; existent: string; necessary: string };
    quimicos: { exp: boolean; prob: string; existent: string; necessary: string };
    radiacionesIon: { exp: boolean; prob: string; existent: string; necessary: string };
    radiacionesNoIon: { exp: boolean; prob: string; existent: string; necessary: string };
    vibraciones: { exp: boolean; prob: string; existent: string; necessary: string };
    microbios: { exp: boolean; prob: string; existent: string; necessary: string };
    polvos: { exp: boolean; prob: string; existent: string; necessary: string };
    humos: { exp: boolean; prob: string; existent: string; necessary: string };
    iluminacion: { exp: boolean; prob: string; existent: string; necessary: string };
  };
  
  cargaFisica: {
    troncoDoblado: { exp: boolean; prob: string };
    sentadoPie: { exp: boolean; prob: string };
    agachado: { exp: boolean; prob: string };
    arrodillado: { exp: boolean; prob: string };
    movForzados: { exp: boolean; prob: string };
    levantamientoPesos: { exp: boolean; prob: string };
    repetitivos: { exp: boolean; prob: string };
    empujarPesos: { exp: boolean; prob: string };
    descripcion: string;
  };
  cargaMental: {
    monotonia: { exp: boolean; prob: string };
    atencion: { exp: boolean; prob: string };
    comunicacionPoca: { exp: boolean; prob: string };
    supervisionExcesiva: { exp: boolean; prob: string };
    descripcion: string;
  };

  seguridad: {
    herramientas: { exp: boolean; prob: string };
    electricidad: { exp: boolean; prob: string };
    señalizacion: { exp: boolean; prob: string };
    objetosCortantes: { exp: boolean; prob: string };
    superficiesResbaladizas: { exp: boolean; prob: string };
    descripcion: string;
  };

  daños: {
    partesCuerpo: string[]; 
    enfermedadesComunes: string;
    enfermedadOcupacional: { tiene: boolean; cual: string };
    accidentes6Meses: { tiene: boolean; tipo: string; partes: string };
  };

  mejorasPlanteadas: string;
  epp: {
    recibidos: boolean;
    listado: { item: string; si: boolean; condicion: string; frecuencia: string }[];
  };
  educacion: {
    actividades: boolean;
    cuales: string;
    frecuencia: string;
  };
  observaciones: string;
  delegadoId: string;
}
