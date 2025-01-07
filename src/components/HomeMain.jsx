'use client'
import React, { useEffect, useState } from 'react'
import CardDocument from './CardDocument'
import ModalMain from './ModalMain'
import useStore from '../store/useStore'
import { useSession } from 'next-auth/react'


const HomeMain = () => {
  const [documentUrl, setDocumentUrl] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [usersFilters, setUsersFilters] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [activeGestion, setActiveGestion] = useState(null) // Estado para gestión activa

  const { data: session } = useSession()

  
  const dataRegistros = useStore((state) => state.dataRegistros)
  const allGestionsData = useStore((state) => state.allGestionsData)
  const userRol = useStore((state) => state.userRol)
  const setUserRol = useStore((state) => state.setUserRol)

  const openDocument = (url) => {
    setDocumentUrl(url)
    setIsModalOpen(true)
  }

  const closeDocument = () => {
    setDocumentUrl('')
    setIsModalOpen(false)
  }


  useEffect(() => {
    if (session) {

      const filterUsers = dataRegistros.filter(
        (user) =>
          user.email === session.user.email &&
          (selectedSubCategory === '' || user.selectedSubCategory === selectedSubCategory)
      )
      setUsersFilters(filterUsers)

     
    }
  }, [session, selectedSubCategory, dataRegistros])

  // requiero otro useEffect para a traves de la session busque en dataRegistros si el rol es admin, el filtro va a traer uno o varios registros con el rol docente o admin, guarda en store userRol solamente el valor de el primer rol encontrado
  useEffect(() => {
    if (usersFilters.length > 0) {
      const userRol = dataRegistros.find((user) => user.email === session.user.email)

      setUserRol(userRol.rol)
    }
  }, [usersFilters, session, dataRegistros])


  const handleGestionClick = (gestionId) => {
    setActiveGestion((prev) => (prev === gestionId ? null : gestionId)) // Alterna entre mostrar u ocultar subcategorías
  }

  const handleSubCategoryClick = (componente) => {
    setSelectedSubCategory(componente)
    setActiveGestion(null) // Cierra el menú al seleccionar un componente
  }

  const resetFilters = () => {
    setSelectedSubCategory('')
    setActiveGestion(null)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Filtros</h2>
        <div className="flex flex-wrap gap-4">
          {allGestionsData.map((gestion) => (
            <div key={gestion._id} className="relative">
              <button
                className={`px-4 py-2 rounded ${
                  activeGestion === gestion._id ? 'bg-blue-500 text-white' : 'bg-blue-100'
                } hover:bg-blue-500 hover:text-white transition`}
                onClick={() => handleGestionClick(gestion._id)}
              >
                {gestion.gestion}
              </button>
              {activeGestion === gestion._id && (
                <div className="absolute mt-2 p-2 bg-gray-100 rounded shadow-lg z-10">
                  {gestion.componentes.map((componente) => (
                    <button
                      key={componente}
                      className={`block w-full text-left px-4 py-2 rounded ${
                        selectedSubCategory === componente
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-blue-500 hover:text-white'
                      } transition`}
                      onClick={() => handleSubCategoryClick(componente)} // Cierra el menú
                    >
                      {componente}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {selectedSubCategory && (
            <button
              className="px-4 py-2 rounded bg-red-300 text-white hover:bg-red-600 transition"
              onClick={resetFilters}
            >
              Limpiar Filtro
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {
          usersFilters.length > 0 ?
          usersFilters.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-lg rounded-lg p-4 hover:shadow-2xl transition-shadow duration-200"
          >
            <CardDocument

              sede={user.sede}
              jornada={user.jornada}
              docente={user.docente}
              selectedCategory={user.selectedCategory}
              selectedSubCategory={user.selectedSubCategory}
              fileName={user.fileName}
              url={`https://drive.google.com/file/d/${user.linkFileId}/preview`}
              onClick={openDocument}
              grado={user.grado}
              grupo={user.grupo}
              _id={user._id}
            />
           
          </div>
        )): <p>No hay registros para mostrar</p>
        }
      </div>

      <ModalMain show={isModalOpen} onClose={closeDocument} documentUrl={documentUrl} />
    </div>
  )
}

export default HomeMain
