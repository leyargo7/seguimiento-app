'use client'
import { useRouter } from 'next/navigation'
import useStore from '../../store/useStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MdOutlineLogout } from 'react-icons/md'
import CardDocument from '../../components/CardDocument'
import ModalMain from '../../components/ModalMain'
import { signOut } from 'next-auth/react'

function DashboardPage() {
  const [documentUrl, setDocumentUrl] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [validateLink, setValidateLink] = useState(false)
  const [filters, setFilters] = useState({
    sede: '',
    jornada: '',
    docente: '',
    grado: '',
    grupo: '',
    selectedCategory: '',
    selectedSubCategory: '',
  })
  const router = useRouter()

  const userRole = useStore((state) => state.userRol)
  const dataRegistros = useStore((state) => state.dataRegistros)

  const labelMap = {
    sede: 'Sede',
    jornada: 'Jornada',
    docente: 'Docente',
    grado: 'Grado',
    grupo: 'Grupo',
    selectedCategory: 'Gestión',
    selectedSubCategory: 'Componente',
  }

  useEffect(() => {
    if (userRole.rol === 'admin') {
      setValidateLink(true)
    } else if (userRole.rol === 'docente' || userRole === '') {
      router.push('/home')
    }
  }, [userRole])

  const openDocument = (url) => {
    setDocumentUrl(url)
    setIsModalOpen(true)
  }

  const closeDocument = () => {
    setDocumentUrl('')
    setIsModalOpen(false)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      sede: '',
      jornada: '',
      docente: '',
      grado: '',
      grupo: '',
      selectedCategory: '',
      selectedSubCategory: '',
    })
  }

  const getUniqueValues = (key) => {
    const values = dataRegistros.map((user) => user[key])
    return [...new Set(values)]
  }

  const filteredData = dataRegistros.filter((user) =>
    Object.entries(filters).every(([key, value]) =>
      value ? user[key]?.toLowerCase().includes(value.toLowerCase()) : true
    )
  )

  return (
    <div>
      {validateLink && (
        <>
          <div className="flex justify-between p-3 bg-blue-950">
            <h2 className="place-content-center text-white">
              <Link href="/home">App Educa</Link>
            </h2>
            <div className="flex gap-6">
              <button
                onClick={() =>
                  signOut({
                    callbackUrl: '/',
                  })
                }
                className="flex items-center bg-gray-800 text-white p-2 rounded gap-2"
              >
                <MdOutlineLogout size={24} />
                Salir
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-100">
            {Object.keys(filters).map((filter) => (
              <select
                key={filter}
                name={filter}
                value={filters[filter]}
                onChange={handleFilterChange}
                className="p-2 border rounded shadow-sm"
              >
                <option value="">{`Seleccionar ${labelMap[filter]}`}</option>
                {getUniqueValues(filter).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ))}
            <button
              onClick={clearFilters}
              className="p-2 bg-red-500 text-white rounded shadow-sm hover:bg-red-600 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredData.map((user) => (
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
                  url={`https://drive.google.com/file/d/${user.linkFileId}/preview`}
                  onClick={openDocument}
                  grado={user.grado}
                  grupo={user.grupo}
                  _id={user._id}
                  fileName={user.fileName}
                />
              </div>
            ))}
          </div>

          <ModalMain
            show={isModalOpen}
            onClose={closeDocument}
            documentUrl={documentUrl}
          />
        </>
      )}
    </div>
  )
}

export default DashboardPage
