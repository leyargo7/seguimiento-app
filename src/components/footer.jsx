import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='fixed bottom-0 w-full text-center p-3 bg-blue-950 text-white'>
      <div>
        Desarrollado por 
        <Link href="https://leyargo.vercel.app" className='text-blue-500 hover:text-blue-700'>
        <span> leyargo code</span>
        
        </Link>
        <br />

      </div>
    </div>
  )
}

export default Footer