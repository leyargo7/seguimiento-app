"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { MdOutlineLogout } from "react-icons/md";
import useStore from "../../store/useStore";
import Image from "next/image";

const RegisterPage = () => {
  // --- Estados ---
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [linkFile, setLinkFile] = useState("");
  // Inicializamos con el año actual o el que prefieras por defecto
  const [anio, setAnio] = useState(new Date().getFullYear());

  const [jornada, setJornada] = useState("");
  const [grado, setGrado] = useState("");
  const [grupo, setGrupo] = useState("");

  const [sede, setSede] = useState("");
  const [docente, setDocente] = useState("");
  const [dataSedes, setDataSedes] = useState([]);
  const [dataGestions, setDataGestions] = useState([]);
  const [dataGrados, setDataGrados] = useState([]);
  const [dataGrupos, setDataGrupos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loadingSedes, setLoadingSedes] = useState(true);

  const { data: session } = useSession();

  // --- Store ---
  const allSedes = useStore((state) => state.allSedesData);
  const allGestions = useStore((state) => state.allGestionsData);
  const allGrados = useStore((state) => state.allGradosData);
  const allGrupos = useStore((state) => state.allGruposData);

  const staticOptionsMap = {};

  const getDynamicOptionsMap = () => {
    const dynamicOptionsMap = {};
    dataGestions.forEach(({ gestion, componentes }) => {
      if (!dynamicOptionsMap[gestion]) {
        dynamicOptionsMap[gestion] = [];
      }
      dynamicOptionsMap[gestion].push(...componentes);
    });
    return { ...staticOptionsMap, ...dynamicOptionsMap };
  };

  // --- Efectos ---
  useEffect(() => {
    setDataSedes(allSedes);
    setDataGestions(allGestions);
    setDataGrados(allGrados);
    setDataGrupos(allGrupos);
    setLoadingSedes(false);
  }, [allSedes, allGestions, allGrados, allGrupos]);

  useEffect(() => {
    if (sede) {
      const selectedSede = dataSedes.find((item) => item.sede === sede);
      setDocentes(selectedSede?.docentes || []);
    } else {
      setDocentes([]);
    }
  }, [sede, dataSedes]);

  // --- Handlers ---
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    const optionsMap = getDynamicOptionsMap();
    setSubOptions(optionsMap[selected] || []);
    setSelectedSubCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !sede ||
      !jornada ||
      !grado ||
      !grupo ||
      !docente ||
      !linkFile ||
      !selectedCategory ||
      !selectedSubCategory ||
      !fileName ||
      !anio
    ) {
      return alert("Por favor llena todos los campos obligatorios");
    }

    const regex = /\/d\/([a-zA-Z0-9_-]+)\//;
    const linkFileId = linkFile.match(regex);
    if (!linkFileId) {
      return alert("El link del archivo no es válido (Debe ser de Google Drive)");
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
      anio: parseInt(anio), // Enviamos el año como número
    };

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/add-register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Datos guardados exitosamente");
        window.location.href = "/home";
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error("Error al enviar los datos:", err);
      alert("Hubo un problema al guardar los datos.");
    }
  };

  // Clases comunes para inputs y selects para mantener consistencia
  const inputClasses = "bg-blue-950 text-white p-2 rounded w-full border border-blue-800 focus:border-blue-500 outline-none";
  const labelClasses = "font-semibold text-blue-900 mb-1";

  return (
    <div className="bg-slate-700 min-h-screen">
      {/* Header */}
      <div className="flex justify-between p-3 bg-blue-950 shadow-md">
        <div className="flex gap-3 items-center">
          <h2 className="place-content-center text-white font-bold text-xl"><Link href="/home">App Educa</Link></h2>
          <Image
            className="w-10 rounded-lg"
            width={500}
            height={500}
            src="/images/logo2.jpg"
            alt="Logo"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/home" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm transition">
            Seguimiento
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded gap-2 text-sm transition"
          >
            <MdOutlineLogout size={20} />
            Salir
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-blue-50">
          Registra tu evidencia
        </h1>

        {loadingSedes ? (
          <div className="text-xl text-blue-900 font-semibold animate-pulse">Cargando formulario...</div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 w-full max-w-5xl bg-blue-100 p-8 rounded-xl shadow-lg border border-blue-200"
          >
            
            {/* --- SECCIÓN 1: DATOS INSTITUCIONALES --- */}
            <div className="bg-white/50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-blue-800 font-bold mb-4 border-b border-blue-200 pb-1">Datos Institucionales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    
                    {/* Año Lectivo */}
                    <div className="flex flex-col">
                        <label className={labelClasses}>Año Lectivo:</label>
                        <select
                        name="anio"
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)}
                        className={`${inputClasses} font-bold text-yellow-400`} // Destacado
                        >
                        {/* <option value="2024">2024</option>
                        <option value="2025">2025</option> */}
                        <option value="2026">2026</option>
                        {/* <option value="2027">2027</option> */}
                        </select>
                    </div>

                    {/* Sede */}
                    <div className="flex flex-col">
                        <label className={labelClasses}>Sede Educativa:</label>
                        <select
                        name="sede"
                        value={sede}
                        onChange={(e) => setSede(e.target.value)}
                        className={inputClasses}
                        >
                        <option value="">-- Seleccionar --</option>
                        {dataSedes.map((item, index) => (
                            <option key={index} value={item.sede}>
                            {item.sede}
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* Jornada */}
                    <div className="flex flex-col">
                        <label className={labelClasses}>Jornada:</label>
                        <select
                        name="jornada"
                        value={jornada}
                        onChange={(e) => setJornada(e.target.value)}
                        className={inputClasses}
                        >
                        <option value="">-- Seleccionar --</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Completa">Completa</option>
                        <option value="Mañana y Tarde">Mañana y Tarde</option>
                        <option value="Nocturna">Nocturna</option>
                        </select>
                    </div>

                    {/* Docente */}
                    <div className="flex flex-col">
                        <label className={labelClasses}>Docente:</label>
                        <select
                        name="docente"
                        value={docente}
                        onChange={(e) => setDocente(e.target.value)}
                        className={inputClasses}
                        disabled={!sede} // Deshabilitar si no hay sede
                        >
                        <option value="">-- Seleccionar --</option>
                        {docentes.map((docente, index) => (
                            <option key={index} value={docente}>
                            {docente}
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* Grado */}
                    <div className="flex flex-col">
                        <label className={labelClasses}>Grado:</label>
                        <select
                        name="grado"
                        value={grado}
                        onChange={(e) => setGrado(e.target.value)}
                        className={inputClasses}
                        >
                        <option value="">-- Seleccionar --</option>
                        <option value="Transición">Transición</option>
                        <option value="Primero">Primero</option>
                        <option value="Segundo">Segundo</option>
                        <option value="Tercero">Tercero</option>
                        <option value="Cuarto">Cuarto</option>
                        <option value="Quinto">Quinto</option>
                        {dataGrados.map((g) => (
                            <option key={g._id} value={g.grado}>
                            {g.grado}
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* Grupo */}
                    <div className="flex flex-col">
                        <label className={labelClasses}>Grupo:</label>
                        <select
                        name="grupo"
                        value={grupo}
                        onChange={(e) => setGrupo(e.target.value)}
                        className={inputClasses}
                        >
                        <option value="">-- Seleccionar --</option>
                        <option value="0-1">0-1</option>
                        <option value="0-2">0-2</option>
                        <option value="0-3">0-3</option>
                        {dataGrupos.map((g) => (
                            <option key={g._id} value={g.grupo}>
                            {g.grupo}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 2: CLASIFICACIÓN --- */}
            <div className="bg-white/50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-blue-800 font-bold mb-4 border-b border-blue-200 pb-1">Clasificación de Evidencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Gestión */}
                    <div className="flex flex-col">
                        <label className={labelClasses}>Gestión:</label>
                        <select
                        id="category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className={inputClasses}
                        >
                        <option value="">-- Seleccionar Gestión --</option>
                        {Object.keys(getDynamicOptionsMap()).map((category, index) => (
                            <option key={index} value={category}>
                            {category}
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* Componente (Dinámico) */}
                    <div className="flex flex-col">
                         <label className={labelClasses}>Componente:</label>
                         {/* Renderizado condicional pero ocupando espacio o mensaje */}
                         {subOptions.length > 0 ? (
                            <select
                                id="subCategory"
                                value={selectedSubCategory}
                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                                className={inputClasses}
                            >
                                <option value="">-- Seleccionar Componente --</option>
                                {subOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                                ))}
                            </select>
                         ) : (
                            <div className="h-10 flex items-center px-3 bg-gray-200 text-gray-500 rounded border border-gray-300 italic text-sm">
                                Selecciona una gestión primero
                            </div>
                         )}
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 3: ARCHIVO --- */}
            <div className="bg-white/50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-blue-800 font-bold mb-4 border-b border-blue-200 pb-1">Detalles del Archivo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nombre del Archivo */}
                    <div className="flex flex-col">
                        <label className={labelClasses}>Nombre del Archivo:</label>
                        <input
                        type="text"
                        placeholder="Ej: Planeación Matemáticas Q1"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="bg-white text-black p-2 rounded w-full border-2 border-blue-950 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Link del Archivo */}
                    <div className="flex flex-col">
                        <label className={labelClasses}>Link (Google Drive):</label>
                        <input
                        type="text"
                        placeholder="Pega el link aquí..."
                        value={linkFile}
                        onChange={(e) => setLinkFile(e.target.value)}
                        className="bg-white text-black p-2 rounded w-full border-2 border-blue-950 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Botón de envío */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className={`py-3 px-10 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
                  !sede ||
                  !jornada ||
                  !grado ||
                  !grupo ||
                  !docente ||
                  !linkFile ||
                  !selectedCategory ||
                  !selectedSubCategory ||
                  !fileName ||
                  !anio
                    ? "bg-gray-400 cursor-not-allowed opacity-70"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
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
                  !fileName ||
                  !anio
                }
              >
                Enviar Registro
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;