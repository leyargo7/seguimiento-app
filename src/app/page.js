'use client'

import React, { use, useEffect, useState } from 'react'
import { signIn, useSession, signOut } from 'next-auth/react'
//import useStore from '../store/useStore'
import { MdOutlineLogout } from 'react-icons/md'
import { FaPersonWalkingLuggage } from 'react-icons/fa6'
import Link from 'next/link'
import Slideshow from '../components/Slideshow'
import Footer from '../components/footer'
import Spinner from '../components/Spinner'
import Image from 'next/image'

const AppPage = () => {
  const [stateSession, setStateSession] = useState(false)
  const { data: session } = useSession()


  useEffect(() => {
    if (session) {
      setStateSession(true)
    }
  }, [session])

 
  useEffect(() => {
    if (!session) {
      setStateSession(true)
    }
    
  }, [session])

  return (
    <div>
      <div className="flex bg-blue-950 text-white items-center justify-around p-3">
        <div className="flex gap-3 items-center">
        <h1>App Educa</h1>
        <Image
          className="w-12 rounded-lg"
          width={500}
          height={500}
          src="/images/logo2.jpg"
          alt="Logo"
        />
        </div>
        {!stateSession ? (
          <Spinner />
        ) :   session?.user ? (
          <div className="flex items-center gap-9">
            <p>Hola, {session.user.name}</p>
            <Link href="/home" className="bg-blue-600 text-white p-2 rounded">
              Seguimiento Escolar
            </Link>
            <button
              className="flex bg-gray-800 text-white p-2 rounded"
              onClick={() =>
                signOut({
                  callbackUrl: '/',
                })
              }
            >
              <MdOutlineLogout size={24} />
              Salir
            </button>
          </div>
        ) : (
          // <div className="flex justify-center items-center h-screen">
          <div className="">
            <button
              className="flex  gap-3 bg-slate-200 border border-slate-800 p-2 rounded text-black"
              onClick={() =>
                signIn('google', {
                  callbackUrl: '/home',
                })
              }
            >
              <FaPersonWalkingLuggage size={24} />
              Inicia con Google
            </button>
          </div>
        )}
      </div>
      <div className="bg-gradient-to-t from-yellow-300 via-yellow-500 to-blue-800  p-3 text-center">
        <h3 className='text-center mt-2 font-bold text-2xl'>INSTITUCION EDUCATIVA MUNICIPAL</h3>
        <h1 className='text-center font-bold text-4xl'>NACIONAL</h1>
      </div>

      <div className="flex justify-center mb-3">
        <Slideshow />
      </div>

      <Footer />
    </div>
  )
}

export default AppPage
