// Cliente API para Google Sheets utilizando Google Apps Script como backend

// El usuario debe configurar la URL de su Web App de Google Apps Script en las variables de entorno
const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '';

async function fetchFromSheets(params: Record<string, string>) {
  if (!API_URL) {
    console.warn("VITE_GOOGLE_SHEETS_API_URL no está configurada. Operación local simulada.");
    return { error: { message: "API URL no configurada" } };
  }
  try {
    const url = new URL(API_URL);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      mode: 'cors'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error en petición GET a Google Sheets:", error);
    return { error: { message: error.message || "Error de conexión con el servidor" } };
  }
}

async function postToSheets(payload: Record<string, any>) {
  if (!API_URL) {
    console.warn("VITE_GOOGLE_SHEETS_API_URL no está configurada. Operación local simulada.");
    return { error: { message: "API URL no configurada" } };
  }
  try {
    // Google Apps Script redirecciona las peticiones POST, fetch lo maneja automáticamente con redirect: 'follow'
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Evita peticiones preflight CORS complicadas en Apps Script
      },
      redirect: 'follow',
      mode: 'cors'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error en petición POST a Google Sheets:", error);
    return { error: { message: error.message || "Error de conexión con el servidor" } };
  }
}

export const googleSheets = {
  // Obtener toda la base de datos de una sola vez (empresas, trabajadores, puestos, etc.)
  readAll: async () => {
    const res = await fetchFromSheets({ action: 'read_all' });
    if (res.error) {
      return { data: null, error: res.error };
    }
    return { data: res, error: null };
  },

  // Simulación del patrón builder de Supabase
  from: (table: string) => {
    return {
      select: () => {
        // En caso de que se llame select individualmente, podemos simularlo o retornar error
        return {
          then: async (resolve: (val: any) => void) => {
            const all = await googleSheets.readAll();
            if (all.error) {
              resolve({ data: null, error: all.error });
            } else {
              const tableData = (all.data as any)[table] || [];
              resolve({ data: tableData, error: null });
            }
          }
        };
      },
      upsert: async (record: any) => {
        const res = await postToSheets({
          action: 'upsert',
          table,
          data: record,
          keyName: 'id'
        });
        if (res.error) return { error: res.error };
        return { error: null };
      },
      update: (updates: any) => {
        return {
          eq: async (keyName: string, keyValue: any) => {
            const res = await postToSheets({
              action: 'upsert',
              table,
              data: { ...updates, [keyName]: keyValue },
              keyName
            });
            if (res.error) return { error: res.error };
            return { error: null };
          }
        };
      },
      delete: () => {
        return {
          eq: async (keyName: string, keyValue: any) => {
            const res = await postToSheets({
              action: 'delete',
              table,
              id: keyValue,
              keyName
            });
            if (res.error) return { error: res.error };
            return { error: null };
          }
        };
      }
    };
  },

  auth: {
    // Iniciar sesión
    signInWithPassword: async ({ email, password }: { email: string; password?: string }) => {
      const res = await postToSheets({
        action: 'login',
        email,
        password
      });
      if (res.error) {
        return { data: null, error: res.error };
      }
      return { data: { user: res.user }, error: null };
    },

    // Registrarse
    signUp: async ({ email, password, options }: { email: string; password?: string; options?: { data?: { nombre?: string } } }) => {
      const nombre = options?.data?.nombre || email;
      const res = await postToSheets({
        action: 'register',
        email,
        password,
        nombre
      });
      if (res.error) {
        return { data: null, error: res.error };
      }
      return { data: { user: null, warning: res.warning }, error: null };
    },

    // Solicitar restablecimiento de contraseña
    resetPasswordForEmail: async (email: string, options?: { redirectTo?: string }) => {
      const res = await postToSheets({
        action: 'reset_password_request',
        email,
        redirectTo: options?.redirectTo
      });
      if (res.error) {
        return { error: res.error };
      }
      return { error: null };
    },

    // Validar token de restablecimiento de contraseña
    validateResetToken: async (email: string, token: string) => {
      const res = await fetchFromSheets({
        action: 'validate_reset_token',
        email,
        token
      });
      if (res.error) {
        return { success: false, error: res.error };
      }
      return { success: true, error: null };
    },

    // Confirmar nueva contraseña
    resetPasswordSubmit: async (email: string, token: string, password?: string) => {
      const res = await postToSheets({
        action: 'reset_password_submit',
        email,
        token,
        password
      });
      if (res.error) {
        return { data: null, error: res.error };
      }
      return { data: { user: res.user }, error: null };
    },

    // Verificar token de correo
    verifyEmail: async (email: string, token: string) => {
      const res = await fetchFromSheets({
        action: 'verify_token',
        email,
        token
      });
      if (res.error) {
        return { success: false, error: res.error };
      }
      return { success: true, error: null };
    },

    // Cerrar sesión
    signOut: async () => {
      // Como guardamos la sesión en Zustand/localStorage, el borrado se maneja en el cliente
      return;
    },

    // Simular getSession para compatibilidad de interfaces
    getSession: async () => {
      return { data: { session: null }, error: null };
    }
  }
};
