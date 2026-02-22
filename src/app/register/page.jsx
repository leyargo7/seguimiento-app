"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  MdOutlineLogout,
  MdUploadFile,
  MdSync,
  MdContentCopy,
  MdCheck,
} from "react-icons/md";
import useStore from "../../store/useStore";
import Image from "next/image";

const RegisterPage = () => {
  // --- Estado para el botón de copiar ---
  const [isCopied, setIsCopied] = useState(false);
  // --- Estados de las Tabs ---
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' | 'sync'
  const [isSyncing, setIsSyncing] = useState(false); // Estado de carga para la sincronización

  // --- Estados de Datos Comunes (Sección 1) ---
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [sede, setSede] = useState("");
  const [jornada, setJornada] = useState("");
  const [grado, setGrado] = useState("");
  const [grupo, setGrupo] = useState("");
  const [docente, setDocente] = useState("");

  // --- Estados para Registro Manual ---
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [linkFile, setLinkFile] = useState("");
  const [fileName, setFileName] = useState("");

  // --- Estados para Sincronización Automática ---
  const [linkFolder, setLinkFolder] = useState("");

  // --- Datos del Store y Fetch ---
  const [dataSedes, setDataSedes] = useState([]);
  const [dataGestions, setDataGestions] = useState([]);
  const [dataGrados, setDataGrados] = useState([]);
  const [dataGrupos, setDataGrupos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loadingSedes, setLoadingSedes] = useState(true);

  const { data: session } = useSession();

  const allSedes = useStore((state) => state.allSedesData);
  const allGestions = useStore((state) => state.allGestionsData);
  const allGrados = useStore((state) => state.allGradosData);
  const allGrupos = useStore((state) => state.allGruposData);
  const userRole = useStore((state) => state.userRol?.rol || "docente"); // Obtenemos el rol

  // Pon aquí el correo real de tu Service Account (o sácalo de un .env)
  const botEmail = `${process.env.NEXT_PUBLIC_BOT_EMAIL}`;

  // --- Lógica de opciones dinámicas ---
  const getDynamicOptionsMap = () => {
    const dynamicOptionsMap = {};
    dataGestions.forEach(({ gestion, componentes }) => {
      if (!dynamicOptionsMap[gestion]) {
        dynamicOptionsMap[gestion] = [];
      }
      dynamicOptionsMap[gestion].push(...componentes);
    });
    return dynamicOptionsMap;
  };

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

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    const optionsMap = getDynamicOptionsMap();
    setSubOptions(optionsMap[selected] || []);
    setSelectedSubCategory("");
  };

  // ----------------------------------------------------------------
  // HANDLER: REGISTRO MANUAL
  // ----------------------------------------------------------------
  const handleManualSubmit = async (e) => {
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
      return alert(
        "El link del archivo no es válido (Debe ser de Google Drive)",
      );
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
      anio: parseInt(anio),
    };

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/add-register`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // ----------------------------------------------------------------
  // HANDLER: SINCRONIZACIÓN AUTOMÁTICA
  // ----------------------------------------------------------------
  const handleSyncSubmit = async (e) => {
    e.preventDefault();
    if (
      !sede ||
      !docente ||
      !linkFolder ||
      !anio
    ) {
      return alert(
        "Por favor llena todos los campos institucionales y pega el link de la carpeta.",
      );
    }

    // Extraer ID de la carpeta de Drive (Ej: https://drive.google.com/drive/folders/1Kh63L7...)
    const regexFolder = /\/folders\/([a-zA-Z0-9_-]+)/;
    const matchFolder = linkFolder.match(regexFolder);

    if (!matchFolder) {
      return alert(
        "El link de la carpeta no es válido. Asegúrate de copiarlo desde Google Drive.",
      );
    }

    const folderId = matchFolder[1];

    const data = {
      folderId, sede, docente,
      email: session.user.email,
      rol: userRole,
      anio: parseInt(anio),
    };

    setIsSyncing(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/sync-drive`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Muestra cuántos se agregaron y omitieron
        window.location.href = "/home";
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error("Error en sincronización:", err);
      alert("Hubo un problema al sincronizar la carpeta.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Clases comunes para inputs
  const inputClasses =
    "bg-blue-950 text-white p-2 rounded w-full border border-blue-800 focus:border-blue-500 outline-none";
  const labelClasses = "font-semibold text-blue-900 mb-1";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(botEmail);
    setIsCopied(true);
    // Devuelve el botón a su estado normal después de 2.5 segundos
    setTimeout(() => {
      setIsCopied(false);
    }, 6000);
  };

return (
    <div className="bg-slate-50 min-h-screen pb-10">
      {/* Header */}
      <div className="flex justify-between p-3 bg-blue-950 shadow-md">
        <div className="flex gap-3 items-center">
          <h2 className="place-content-center text-white font-bold text-xl">App Educa</h2>
          <Image className="w-10 rounded-lg" width={500} height={500} src="/images/logo2.jpg" alt="Logo" />
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/home" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm transition">
            Seguimiento
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded gap-2 text-sm transition">
            <MdOutlineLogout size={20} /> Salir
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-950">Registro de Evidencias</h1>

        {/* --- TABS DE NAVEGACIÓN --- */}
        <div className="flex gap-4 mb-8 bg-white p-2 rounded-full shadow-md border border-gray-200">
            <button 
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'manual' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <MdUploadFile size={20} />
                Registro Manual
            </button>
            <button 
                onClick={() => setActiveTab('sync')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'sync' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <MdSync size={20} />
                Sincronizar Carpeta
            </button>
        </div>

        {loadingSedes ? (
          <div className="text-xl text-blue-900 font-semibold animate-pulse">Cargando datos...</div>
        ) : (
          <form
            onSubmit={activeTab === 'manual' ? handleManualSubmit : handleSyncSubmit}
            className="flex flex-col gap-6 w-full max-w-5xl bg-blue-100 p-8 rounded-xl shadow-lg border border-blue-200"
          >
            {/* --- SECCIÓN 1: DATOS INSTITUCIONALES (COMÚN Y CONDICIONAL) --- */}
            <div className="bg-white/50 p-4 rounded-lg border border-blue-100 shadow-sm">
              <h3 className="text-blue-800 font-bold mb-4 border-b border-blue-200 pb-1">1. Datos Institucionales Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* SIEMPRE VISIBLES */}
                <div className="flex flex-col">
                  <label className={labelClasses}>Año Lectivo:</label>
                  <select name="anio" value={anio} onChange={(e) => setAnio(e.target.value)} className={`${inputClasses} font-bold text-yellow-400`}>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className={labelClasses}>Sede Educativa:</label>
                  <select name="sede" value={sede} onChange={(e) => setSede(e.target.value)} className={inputClasses}>
                    <option value="">-- Seleccionar --</option>
                    {dataSedes.map((item, index) => (<option key={index} value={item.sede}>{item.sede}</option>))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className={labelClasses}>Docente:</label>
                  <select name="docente" value={docente} onChange={(e) => setDocente(e.target.value)} className={inputClasses} disabled={!sede}>
                    <option value="">-- Seleccionar --</option>
                    {docentes.map((doc, index) => (<option key={index} value={doc}>{doc}</option>))}
                  </select>
                </div>

                {/* VISIBLES SOLO EN MODO MANUAL */}
                {activeTab === 'manual' && (
                  <>
                    <div className="flex flex-col animate-fade-in">
                      <label className={labelClasses}>Jornada:</label>
                      <select name="jornada" value={jornada} onChange={(e) => setJornada(e.target.value)} className={inputClasses}>
                        <option value="">-- Seleccionar --</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Completa">Completa</option>
                        <option value="Mañana y Tarde">Mañana y Tarde</option>
                        <option value="Nocturna">Nocturna</option>
                      </select>
                    </div>
                    <div className="flex flex-col animate-fade-in">
                      <label className={labelClasses}>Grado:</label>
                      <select name="grado" value={grado} onChange={(e) => setGrado(e.target.value)} className={inputClasses}>
                        <option value="">-- Seleccionar --</option>
                        <option value="Transición">Transición</option>
                        <option value="Primero">Primero</option>
                        <option value="Segundo">Segundo</option>
                        <option value="Tercero">Tercero</option>
                        <option value="Cuarto">Cuarto</option>
                        <option value="Quinto">Quinto</option>
                        {dataGrados.map((g) => (<option key={g._id} value={g.grado}>{g.grado}</option>))}
                      </select>
                    </div>
                    <div className="flex flex-col animate-fade-in">
                      <label className={labelClasses}>Grupo:</label>
                      <select name="grupo" value={grupo} onChange={(e) => setGrupo(e.target.value)} className={inputClasses}>
                        <option value="">-- Seleccionar --</option>
                        <option value="0-1">0-1</option>
                        <option value="0-2">0-2</option>
                        <option value="0-3">0-3</option>
                        {dataGrupos.map((g) => (<option key={g._id} value={g.grupo}>{g.grupo}</option>))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* --- RENDERIZADO CONDICIONAL SEGÚN LA TAB --- */}
            {activeTab === 'manual' ? (
              <>
                {/* MANUAL: SECCIÓN 2 y 3 */}
                <div className="bg-white/50 p-4 rounded-lg border border-blue-100 shadow-sm animate-fade-in">
                  <h3 className="text-blue-800 font-bold mb-4 border-b border-blue-200 pb-1">2. Clasificación de Evidencia (Manual)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className={labelClasses}>Gestión:</label>
                      <select value={selectedCategory} onChange={handleCategoryChange} className={inputClasses}>
                        <option value="">-- Seleccionar Gestión --</option>
                        {Object.keys(getDynamicOptionsMap()).map((cat, i) => (<option key={i} value={cat}>{cat}</option>))}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className={labelClasses}>Componente:</label>
                      {subOptions.length > 0 ? (
                        <select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} className={inputClasses}>
                          <option value="">-- Seleccionar Componente --</option>
                          {subOptions.map((opt, i) => (<option key={i} value={opt}>{opt}</option>))}
                        </select>
                      ) : (
                        <div className="h-10 flex items-center px-3 bg-gray-200 text-gray-500 rounded border border-gray-300 italic text-sm">Selecciona una gestión primero</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 p-4 rounded-lg border border-blue-100 shadow-sm animate-fade-in">
                  <h3 className="text-blue-800 font-bold mb-4 border-b border-blue-200 pb-1">3. Detalles del Archivo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className={labelClasses}>Nombre del Archivo:</label>
                      <input type="text" placeholder="Ej: Planeación Matemáticas Q1" value={fileName} onChange={(e) => setFileName(e.target.value)} className="bg-white text-black p-2 rounded w-full border-2 border-blue-950 focus:border-blue-500 outline-none"/>
                    </div>
                    <div className="flex flex-col">
                      <label className={labelClasses}>Link (Google Drive):</label>
                      <input type="text" placeholder="Pega el link aquí..." value={linkFile} onChange={(e) => setLinkFile(e.target.value)} className="bg-white text-black p-2 rounded w-full border-2 border-blue-950 focus:border-blue-500 outline-none"/>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* SYNC: SECCIÓN 2 */}
                <div className="bg-green-50/80 p-6 rounded-lg border-2 border-green-200 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3 mb-4 border-b border-green-300 pb-2">
                        <MdSync className="text-green-600" size={28}/>
                        <h3 className="text-green-800 font-bold text-lg">2. Sincronización Automática</h3>
                    </div>
                    
                    {/* CUADRO DE INSTRUCCIONES CON BOTÓN DE COPIAR */}
                    <div className="bg-white p-4 rounded border border-yellow-300 mb-6 text-sm text-gray-700 shadow-inner">
                        <p className="font-bold text-yellow-600 mb-2">¡Importante antes de sincronizar!</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Tus carpetas deben llamarse igual que las gestiones del sistema (Ej: "Gestión Académica").
                            </li>
                            <li>
                              <strong className="text-red-600">Regla de Oro:</strong> Cada archivo debe terminar con tu jornada, grado y grupo. Ej: <code className="bg-gray-100 p-1 rounded text-red-600">Evaluacion JM Tercero 0-2</code>. Los que no cumplan este formato serán ignorados.
                            </li>
                            <li>Debes darle acceso a nuestro sistema. Copia este correo y agrégalo a tu carpeta de Drive como <strong>"Lector"</strong>:</li>
                        </ul>
                        
                        {/* BOTÓN DE COPIAR */}
                        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 ml-1 sm:ml-5">
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-all shadow-sm ${
                                    isCopied 
                                    ? "bg-green-100 text-green-700 border border-green-400" 
                                    : "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300"
                                }`}
                            >
                                {isCopied ? <MdCheck size={18} /> : <MdContentCopy size={18} />}
                                {isCopied ? "¡Correo copiado!" : "Copiar correo del sistema"}
                            </button>
                            <span className="text-xs text-gray-500 italic">
                                {isCopied ? "Ve a Google Drive, compártelo y vuelve con el link." : "Haz clic para copiar."}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold text-green-900 mb-1">Link de la Carpeta Principal (Google Drive):</label>
                      <input 
                        type="text" 
                        placeholder="Ej: https://drive.google.com/drive/folders/1Kh63L..." 
                        value={linkFolder} 
                        onChange={(e) => setLinkFolder(e.target.value)} 
                        className="bg-white text-black p-3 rounded w-full border-2 border-green-600 focus:border-green-400 outline-none text-lg"
                      />
                    </div>
                </div>
              </>
            )}

            {/* --- BOTONES DE ENVÍO --- */}
            <div className="flex justify-center mt-4">
                {activeTab === 'manual' ? (
                    <button
                        type="submit"
                        className={`py-3 px-10 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
                            !sede || !jornada || !grado || !grupo || !docente || !linkFile || !selectedCategory || !selectedSubCategory || !fileName || !anio
                            ? "bg-gray-400 cursor-not-allowed opacity-70"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        disabled={!sede || !jornada || !grado || !grupo || !docente || !linkFile || !selectedCategory || !selectedSubCategory || !fileName || !anio}
                    >
                        Enviar Registro
                    </button>
                ) : (
                    <button
                        type="submit"
                        className={`flex items-center gap-2 py-3 px-10 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
                            !sede || !docente || !linkFolder || !anio || isSyncing
                            ? "bg-gray-400 cursor-not-allowed opacity-70"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                        disabled={!sede || !docente || !linkFolder || !anio || isSyncing}
                    >
                        {isSyncing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                Sincronizando...
                            </>
                        ) : (
                            <>
                                <MdSync size={24} />
                                Iniciar Sincronización
                            </>
                        )}
                    </button>
                )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
