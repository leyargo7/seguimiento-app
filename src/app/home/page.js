"use client"
import HomeMain from '../../components/HomeMain.jsx'
import Link from 'next/link'
import { signOut } from 'next-auth/react'


const HomePage = () => {



  return (
    <div>
      <div className="flex justify-around p-6">
        <h1>App Educa</h1>
        <Link href="/register" className="bg-blue-600 text-white p-3 rounded">
          Registrar Evidencia
        </Link>

        <button onClick={() => signOut({
          callbackUrl: '/'
        })} className="bg-red-600 text-white p-3 rounded">Cerrar Sesión</button>
      </div>

      <HomeMain />


    </div>
  )
}

export default HomePage
