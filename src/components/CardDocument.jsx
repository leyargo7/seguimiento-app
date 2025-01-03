import React from 'react'
import { useRouter } from 'next/navigation'
import useStore from '../store/useStore'

import { FaTrashCanArrowUp } from 'react-icons/fa6'

const CardDocument = ({
  selectedCategory,
  selectedSubCategory,
  url,
  onClick,
  grado,
  grupo,
  sede,
  jornada,
  docente,
  _id,
}) => {

  const router = useRouter()
  const dataRegistros = useStore((state) => state.dataRegistros)
  const setDataRegistros = useStore((state) => state.setDataRegistros)


  const deleteDocument = async (id) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseUrl}/delete-register/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      alert('Datos eliminados exitosamente')
      //window.location.href = '/home'
      router.push('/home')
    } else {
      const error = await response.json()
      alert(`Error: ${error.message}`)
    }

    // actualiza el registro del estado  
    const newDataRegistros = dataRegistros.filter((user) => user._id !== id)
    setDataRegistros(newDataRegistros)

    
  }

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este registro?')
    if (confirmed) {
      deleteDocument(id)
    }
  }

  return (
    <>
      <div className="card hover:cursor-pointer" onClick={() => onClick(url)}>
        <h3>Sede: {sede}</h3>
        <h3>Jornada: {jornada}</h3>
        <h3>Docente: {docente}</h3>
        <br />
        <p className="bg-blue-300 text-black p-2 rounded">{selectedCategory}</p>
        <p className="bg-blue-200 text-black p-2 rounded">
          {selectedSubCategory}
        </p>
        <p>{grado}</p>
      </div>
      <div className="flex justify-between">
        <p>{grupo}</p>
        <button onClick={() => handleDeleteClick(_id)} className="rounded">
          <FaTrashCanArrowUp size={24} />
        </button>
      </div>
    </>
  )
}

export default CardDocument
