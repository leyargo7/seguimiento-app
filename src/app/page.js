'use client'

import React from 'react'
import { signIn, useSession, signOut } from 'next-auth/react'


const AppPage = () => {
  const { data: session } = useSession()

  return (
    <div>
      <div>
        <h1>App Educa</h1>
        {session?.user ? (
          <div>
            <p>Hola, {session.user.name}</p>
            <button onClick={() => signOut({
              callbackUrl: '/'
            })}>Cerrar Sesión</button>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
          <button
            className="border border-slate-800 p-6"
            onClick={() => signIn('google', {
              callbackUrl: '/home'
            })}
          >
            Iniciar Sesión
          </button>
        </div>    
        )}
      </div>
      
    </div>
  )
}

export default AppPage
