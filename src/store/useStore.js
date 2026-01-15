// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// const useStore = create(
//   persist(
//     (set) => ({
//       //dataRegistros guarda los datos del Schema Registro del endpoint /all-register-data
//       dataRegistros: [],
//       //allSedesData guarda los datos del Schema Sede del endpoint /get-sedes-docentes
//       allSedesData: [],
//       allGestionsData: [],
//       allGradosData: [],
//       allGruposData: [],
//       dataDocentes: [],

//       emailUser:'',
//       userRol: '',
//       setDataRegistros: (newData) => set({ dataRegistros: newData }),
//       setAllSedesData: (newData) => set({ allSedesData: newData }),
//       setAllGestionsData: (newData) => set({ allGestionsData: newData }),
//       setAllGradosData: (newData) => set({ allGradosData: newData }),
//       setAllGruposData: (newData) => set({ allGruposData: newData }),
//       setDataDocentes: (newData) => set({ dataDocentes: newData }),
      
//       setEmailUser: (newEmail) => set({ emailUser: newEmail}),
//       setUserRol: (newRol) => set({ userRol: newRol})
//     }),
//     {
//       name: 'my-store-educa', // Nombre de la clave en el almacenamiento local
//       getStorage: () => localStorage, // Cambia a sessionStorage si prefieres
//     }
//   )
// );
  
//   export default useStore;


import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      // --- ESTADOS DE DATOS ---
      dataRegistros: [],
      allSedesData: [],
      allGestionsData: [],
      allGradosData: [],
      allGruposData: [],
      dataDocentes: [],
      
      emailUser: '',
      userRol: '',

      // --- NUEVO: Estado de Carga ---
      isLoading: false,

      // --- SETTERS MANUALES ---
      setDataRegistros: (newData) => set({ dataRegistros: newData }),
      setAllSedesData: (newData) => set({ allSedesData: newData }),
      setAllGestionsData: (newData) => set({ allGestionsData: newData }),
      setAllGradosData: (newData) => set({ allGradosData: newData }),
      setAllGruposData: (newData) => set({ allGruposData: newData }),
      setDataDocentes: (newData) => set({ dataDocentes: newData }),
      setEmailUser: (newEmail) => set({ emailUser: newEmail }),
      setUserRol: (newRol) => set({ userRol: newRol }),

      // --- ACCIÓN ASÍNCRONA (MODIFICADA) ---
      getAllRegisterData: async (anio) => {
        try {
          // 1. Activar carga inmediatamente (esto limpia la vista vieja)
          set({ isLoading: true });

          const yearToFetch = anio || new Date().getFullYear();
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-register-data?anio=${yearToFetch}`);
          
          if (!response.ok) {
            throw new Error('Error al obtener datos');
          }

          const data = await response.json();

          // 2. Guardar datos y desactivar carga
          set({
            dataRegistros: data.allRegister,
            allSedesData: data.sedes,
            allGestionsData: data.gestions,
            allGradosData: data.grados,
            allGruposData: data.grupos,
            dataDocentes: data.dataDocentes,
            isLoading: false // Terminó la carga
          });

          console.log(`Datos cargados para el año: ${yearToFetch}`);

        } catch (error) {
          console.error("Error en getAllRegisterData:", error);
          // Importante: Desactivar carga si falla para no dejar la pantalla congelada
          set({ isLoading: false });
        }
      },

    }),
    {
      name: 'my-store-educa', 
      getStorage: () => localStorage,
    }
  )
);

export default useStore;