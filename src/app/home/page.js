'use client'
import HomeMain from '../../components/HomeMain.jsx'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { MdOutlineLogout } from 'react-icons/md'
import useStore from '../../store/useStore'
import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const HomePage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const userRol = useStore((state) => state.userRol)

  const setUserRol = useStore((state) => state.setUserRol)
  const dataDocentes = useStore((state) => state.dataDocentes)

  const setDataRegistros = useStore((state) => state.setDataRegistros)
  const setAllSedesData = useStore((state) => state.setAllSedesData)
  const setAllGestionsData = useStore((state) => state.setAllGestionsData)
  const setAllGradosData = useStore((state) => state.setAllGradosData)
  const setAllGruposData = useStore((state) => state.setAllGruposData)
  const setDataDocentes = useStore((state) => state.setDataDocentes)

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
      setDataDocentes(result.dataDocentes)
    }

    fetchData()
  }, [setDataRegistros, setDataDocentes])

  useEffect(() => {
    if (session && dataDocentes.length > 0) {
      const userRol = dataDocentes.find(
        (user) => user.email === session.user.email
      )
      if (!userRol) {
        router.push('/info-register')
      } else {
        setUserRol(userRol)
      }
    }
  }, [session, dataDocentes, setUserRol, router, userRol])

  return (
    <div>
      <div className="flex justify-between p-3 bg-blue-950">
        <div className="flex gap-6">
          <div className='flex gap-3 items-center'>
            <h1 className="place-content-center text-white">App Educa</h1>
            <Image
              className="w-12 rounded-lg"
              width={500}
              height={500}
              src="/images/logo2.jpg"
              alt="Logo"
            />
          </div>
          {userRol.rol === 'admin' && (
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white p-2 rounded"
            >
              Dashboard
            </Link>
          )}
        </div>
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
