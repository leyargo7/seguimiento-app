"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { MdOutlineLogout } from 'react-icons/md'
import {  signOut } from 'next-auth/react'

const InfoRegisterPage = () => {

  const router = useRouter()

  const handleOut = () => {
    signOut({
      callbackUrl: '/',
    })
    localStorage.removeItem('my-store-educa')
    router.push('/')
  }

  return (
    <div>
      <div className="flex justify-between p-3 bg-blue-950">
        <div className='flex gap-6'>
          <h1 className="place-content-center text-white">App Educa</h1>
          
        </div>
        <div className="flex gap-6">


          <button
            onClick={handleOut}
            className="flex items-center bg-gray-800 text-white p-2 rounded"
          >
            <MdOutlineLogout size={24} />
            Regresar
          </button>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center pt-20'>
        <h1 className='text-2xl font-bold mb-9'>
          Tu correo aún no está registrado para comenzar a subir tus evidencias
        </h1>
        <h3 className='text-2xl font-bold mb-9'>
          Por favor, ponte en contacto con el Coordinador Bayardo y solicita
          la inscripción de tu correo
        </h3>

        <button className="bg-green-500 text-white p-2 rounded">
          <Link
            href="https://wa.me/573206923015"
            className="flex items-center gap-2"
            target="_blank"
          >
            <span>Contactar Coordinador</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </Link>
        </button>

        <h3 className='text-2xl font-bold mt-20'>
          En caso que no dispongas de whatsapp, puedes enviar un correo a la
          dirección bayardo.bayardo@gmail.com
        </h3>
      </div>
    </div>
  )
}

export default InfoRegisterPage
