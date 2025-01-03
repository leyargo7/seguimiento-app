import React from 'react'

const CardDocument = ({ selectedCategory, selectedSubCategory, url, onClick, grado, grupo, sede, jornada, docente }) => {
  return (
    <div className="card hover:cursor-pointer" onClick={() => onClick(url)}>
      <h3>Sede: {sede}</h3>
      <h3>Jornada: {jornada}</h3>
      <h3>Docente: {docente}</h3>
      <br />
      <p className='bg-blue-300 text-black p-2 rounded'>{selectedCategory}</p>
      <p className='bg-blue-200 text-black p-2 rounded'>{selectedSubCategory}</p>
      <p>{grado}</p>
      <p>{grupo}</p>
    </div>
  )
}

export default CardDocument
