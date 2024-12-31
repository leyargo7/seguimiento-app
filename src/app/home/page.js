'use client'
import HomeMain from '../../components/HomeMain.jsx'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { MdOutlineLogout } from 'react-icons/md'
import useStore from '../../store/useStore'
import { useEffect } from 'react'

const HomePage = () => {
  const { data: session } = useSession()

  // const dataRegistros = useStore((state) => state.dataRegistros)
  // const allSedesData = useStore((state) => state.allSedesData)
  // const allGestionsData = useStore((state) => state.allGestionsData)
  // const allGradosData = useStore((state) => state.allGradosData)
  // const allGruposData = useStore((state) => state.allGruposData)

  const setDataRegistros   = useStore((state) => state.setDataRegistros)
  const setAllSedesData    = useStore((state) => state.setAllSedesData)
  const setAllGestionsData = useStore((state) => state.setAllGestionsData)
  const setAllGradosData   = useStore((state) => state.setAllGradosData)
  const setAllGruposData   = useStore((state) => state.setAllGruposData)


  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/all-register-data`)
      const result = await response.json()

      setDataRegistros(result.allRegister)
      setAllSedesData(result.sedes)
      setAllGestionsData(result.gestions)
      setAllGradosData(result.grados)
      setAllGruposData(result.grupos)
    }

    fetchData()
  }, [setDataRegistros])

  return (
    <div>
      <div className="flex justify-between p-3 bg-blue-950">
        <h1 className="place-content-center text-white">App Educa</h1>
        <div className="flex gap-6">
          <p className="place-content-center text-white">
            Hola, {session?.user?.name}
          </p>
          <Link href="/register" className="bg-blue-600 text-white p-2 rounded">
            Registrar Evidencia
          </Link>

          <button
            onClick={() =>
              signOut({
                callbackUrl: '/',
              })
            }
            className="flex items-center bg-gray-800 text-white p-2 rounded"
          >
            <MdOutlineLogout size={24} />
            Salir
          </button>
        </div>
      </div>

      <HomeMain />
    </div>
  )
}

export default HomePage
