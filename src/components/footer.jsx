import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='fixed bottom-0 w-full text-center p-1 bg-blue-950 text-white'>
      <div>
        Desarrollado por 
        <Link href="https://arley-dev.vercel.app" className='text-blue-500 hover:text-blue-700'>
        <span> arley-dev</span>
        
        </Link>
        <br />

      </div>
    </div>
  )
}

export default Footer