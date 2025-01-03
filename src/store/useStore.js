import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      //dataRegistros guarda los datos del Schema Registro del endpoint /all-register-data
      dataRegistros: [],
      //allSedesData guarda los datos del Schema Sede del endpoint /get-sedes-docentes
      allSedesData: [],
      allGestionsData: [],
      allGradosData: [],
      allGruposData: [],
      dataDocentes: [],

      emailUser:'',
      userRol: '',
      setDataRegistros: (newData) => set({ dataRegistros: newData }),
      setAllSedesData: (newData) => set({ allSedesData: newData }),
      setAllGestionsData: (newData) => set({ allGestionsData: newData }),
      setAllGradosData: (newData) => set({ allGradosData: newData }),
      setAllGruposData: (newData) => set({ allGruposData: newData }),
      setDataDocentes: (newData) => set({ dataDocentes: newData }),
      
      setEmailUser: (newEmail) => set({ emailUser: newEmail}),
      setUserRol: (newRol) => set({ userRol: newRol})
    }),
    {
      name: 'my-store-educa', // Nombre de la clave en el almacenamiento local
      getStorage: () => localStorage, // Cambia a sessionStorage si prefieres
    }
  )
);
  
  export default useStore;