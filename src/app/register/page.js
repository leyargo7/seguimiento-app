'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { MdOutlineLogout } from 'react-icons/md'
import useStore from '../../store/useStore'
import Image from 'next/image'

const RegisterPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subOptions, setSubOptions] = useState([]) // Opciones dinámicas
  const [selectedSubCategory, setSelectedSubCategory] = useState('') // Subcategoría seleccionada
  const [linkFile, setLinkFile] = useState('')

  const [jornada, setJornada] = useState('')
  const [grado, setGrado] = useState('')
  const [grupo, setGrupo] = useState('')

  const [sede, setSede] = useState('')
  const [docente, setDocente] = useState('')
  const [dataSedes, setDataSedes] = useState([])
  const [dataGestions, setDataGestions] = useState([])
  const [dataGrados, setDataGrados] = useState([])
  const [dataGrupos, setDataGrupos] = useState([])
  const [docentes, setDocentes] = useState([]) // Docentes filtrados
  const [fileName, setFileName] = useState('')
  const [loadingSedes, setLoadingSedes] = useState(true)

  const { data: session } = useSession()

  const allSedes = useStore((state) => state.allSedesData)
  const allGestions = useStore((state) => state.allGestionsData)
  const allGrados = useStore((state) => state.allGradosData)
  const allGrupos = useStore((state) => state.allGruposData)

  // Opciones para cada categoría
  const staticOptionsMap = {
    // 'Gestión Académica': [
    //   'Dominio Curricular',
    //   'Evaluación de Aprendizaje',
    //   'Pedagogía y Didáctica',
    //   'Planeación y Organización',
    // ],
    // 'Gestión Administrativa': ['Seguimiento de Procesos', 'Uso de Recursos'],
    // 'Gestión Comunitaria': [
    //   'Comunicación Institucional',
    //   'Comunidad y Entorno',
    // ],
    // Comportamental: [
    //   'Comunicación y Relaciones con la Comunidad',
    //   'Liderazgo y Trabajo en Equipo',
    // ],
  }

  // Combinar datos dinámicos con las opciones estáticas
  const getDynamicOptionsMap = () => {
    const dynamicOptionsMap = {}

    dataGestions.forEach(({ gestion, componentes }) => {
      if (!dynamicOptionsMap[gestion]) {
        dynamicOptionsMap[gestion] = []
      }
      dynamicOptionsMap[gestion].push(...componentes)
    })

    return { ...staticOptionsMap, ...dynamicOptionsMap }
  }

  // useEffect(() => {

  //   const fetchData = async () => {
  //     const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  //     const response = await fetch(`${baseUrl}/get-sedes-docentes`, {
  //       method: 'GET',
  //     })
  //     const data = await response.json()
  //     setDataSedes(data.sedes)
  //     setDataGestions(data.gestions)
  //     setDataGrados(data.grados)
  //     setDataGrupos(data.grupos)
  //     setLoadingSedes(false)
  //   }
  //   fetchData()

  // }, [])

  useEffect(() => {
    setDataSedes(allSedes)
    setDataGestions(allGestions)
    setDataGrados(allGrados)
    setDataGrupos(allGrupos)
    setLoadingSedes(false)
  }, [allSedes, allGestions, allGrados, allGrupos])

  useEffect(() => {
    if (sede) {
      const selectedSede = dataSedes.find((item) => item.sede === sede)
      setDocentes(selectedSede?.docentes || [])
    } else {
      setDocentes([]) // Vaciar docentes si no hay sede seleccionada
    }
  }, [sede, dataSedes])

  // Manejar cambio en la categoría
  const handleCategoryChange = (e) => {
    const selected = e.target.value
    setSelectedCategory(selected)

    const optionsMap = getDynamicOptionsMap()
    setSubOptions(optionsMap[selected] || []) // Establecer subopciones
    setSelectedSubCategory('') // Reiniciar subcategoría seleccionada
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !sede ||
      !jornada ||
      !grado ||
      !grupo ||
      !docente ||
      !linkFile ||
      !selectedCategory ||
      !selectedSubCategory ||
      !fileName
    ) {
      return alert('Por favor llena todos los campos obligatorios')
    }

    const regex = /\/d\/([a-zA-Z0-9_-]+)\//
    const linkFileId = linkFile.match(regex)
    if (!linkFileId) {
      return alert('El link del archivo no es válido')
    }

    const data = {
      sede,
      jornada,
      grado,
      grupo,
      docente,
      selectedCategory,
      selectedSubCategory,
      linkFileId: linkFileId[1],
      email: session.user.email,
      fileName,
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/add-register`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('Datos guardados exitosamente')
        window.location.href = '/home'
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (err) {
      console.error('Error al enviar los datos:', err)
      alert('Hubo un problema al guardar los datos.')
    }

    //window.location.href = '/home' // Redirigir a la página principal
  }

  return (
    <div>
      <div className="flex justify-between p-3 bg-blue-950">
        <div className="flex gap-3 items-center">
          <h2 className="place-content-center text-white">App Educa</h2>
          <Image
            className="w-12 rounded-lg"
            width={500}
            height={500}
            src="/images/logo2.jpg"
            alt="Logo"
          />
        </div>
        <div className="flex gap-6">
          <Link href="/home" className="bg-blue-600 text-white p-2 rounded">
            Seguimiento Escolar
          </Link>

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
      <div className="flex flex-col justify-center items-center mt-3">
        <h1 className="text-2xl font-bold mb-9">Registra tu evidencia</h1>

        {loadingSedes ? (
          <p>Cargando...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl bg-blue-200 p-6 rounded-lg">
              {/* Selección de sede */}
              <div className="flex flex-col">
                <label>Sede Educativa:</label>
                <select
                  name="sede"
                  id="sede"
                  value={sede}
                  onChange={(e) => setSede(e.target.value)}
                  className="bg-blue-950 text-white p-2 rounded"
                >
                  <option value=""></option>
                  {dataSedes.map((item, index) => (
                    <option key={index} value={item.sede}>
                      {item.sede}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selección de jornada */}
              <div className="flex flex-col">
                <label>Jornada:</label>
                <select
                  name="jornada"
                  id="jornada"
                  value={jornada}
                  onChange={(e) => setJornada(e.target.value)}
                  className="bg-blue-950 text-white p-2 rounded"
                >
                  <option value=""></option>
                  <option value="Mañana">Mañana</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Completa">Completa</option>
                </select>
              </div>

              {/* Selección de grado */}
              <div className="flex flex-col">
                <label>Grado:</label>
                <select
                  name="grado"
                  id="grado"
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                  className="bg-blue-950 text-white p-2 rounded"
                >
                  <option value=""></option>
                  <option value="Transición">Transición</option>
                  <option value="Primero">Primero</option>
                  <option value="Segundo">Segundo</option>
                  <option value="Tercero">Tercero</option>
                  <option value="Cuarto">Cuarto</option>
                  <option value="Quinto">Quinto</option>
                  {dataGrados.map((grado) => (
                    <option key={grado._id} value={grado.grado}>
                      {grado.grado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selección de grupo */}
              <div className="flex flex-col">
                <label>Grupo:</label>
                <select
                  name="grupo"
                  id="grupo"
                  value={grupo}
                  onChange={(e) => setGrupo(e.target.value)}
                  className="bg-blue-950 text-white p-2 rounded"
                >
                  <option value=""></option>
                  <option value="0-1">0-1</option>
                  <option value="0-2">0-2</option>
                  <option value="0-3">0-3</option>
                  {dataGrupos.map((grupo) => (
                    <option key={grupo._id} value={grupo.grupo}>
                      {grupo.grupo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre del docente */}
              <div className="flex flex-col">
                <label htmlFor="">Docente:</label>
                <select
                  name="docente"
                  id="docente"
                  value={docente}
                  onChange={(e) => setDocente(e.target.value)}
                  className="bg-blue-950 text-white p-2 rounded"
                >
                  <option value=""></option>
                  {docentes.map((docente, index) => (
                    <option key={index} value={docente}>
                      {docente}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selección de categoría */}
              <div className="flex flex-col">
                <label>Gestión:</label>
                <select
                  id="category"
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                  className="bg-blue-950 text-white p-2 rounded"
                >
                  <option value=""></option>
                  {Object.keys(getDynamicOptionsMap()).map(
                    (category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Selección de subcategoría */}

              {subOptions.length > 0 && (
                <>
                  <label>Componente:</label>
                  <select
                    id="subCategory"
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="bg-blue-950 text-white p-2 rounded"
                  >
                    <option value=""></option>
                    {subOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {/* Link del archivo */}
              <input
                type="text"
                placeholder="Pega el link de tu documento"
                value={linkFile}
                onChange={(e) => setLinkFile(e.target.value)}
                className="border-2 border-blue-950 rounded p-2 text-black"
              />

              {/* Nombre del archivo */}
              <input
                type="text"
                placeholder="Nombre del archivo"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="border-2 border-blue-950 rounded p-2 text-black"
              />

              {/* Botón de envío */}
            </div>
            <div className="">
              <button
                type="submit"
                className={`py-2 px-4 rounded ${
                  !sede ||
                  !jornada ||
                  !grado ||
                  !grupo ||
                  !docente ||
                  !linkFile ||
                  !selectedCategory ||
                  !selectedSubCategory ||
                  !fileName
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={
                  !sede ||
                  !jornada ||
                  !grado ||
                  !grupo ||
                  !docente ||
                  !linkFile ||
                  !selectedCategory ||
                  !selectedSubCategory ||
                  !fileName
                }
              >
                Enviar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default RegisterPage
