"use client";
import HomeMain from "../../components/HomeMain.jsx";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { MdOutlineLogout, MdSync } from "react-icons/md";
import useStore from "../../store/useStore.js";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "../../components/footer.jsx";

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- ESTADOS LOCALES ---
  const [selectedAnio, setSelectedAnio] = useState(new Date().getFullYear());
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Estados para el Cooldown (Antispam)
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // --- ZUSTAND STORE ---
  const userRol = useStore((s) => s.userRol);
  const setUserRol = useStore((s) => s.setUserRol);
  const dataDocentes = useStore((s) => s.dataDocentes);
  const getAllRegisterData = useStore((s) => s.getAllRegisterData);
  const lastSyncTime = useStore((s) => s.lastSyncTime);
  const setLastSyncTime = useStore((s) => s.setLastSyncTime);

  const redirectedRef = useRef(false);

  // 1. Cargar datos al cambiar el año
  useEffect(() => {
    if (getAllRegisterData) {
      getAllRegisterData(selectedAnio);
    }
  }, [selectedAnio, getAllRegisterData]);

  // 2. Resolver rol del usuario y redirecciones
  useEffect(() => {
    if (status !== "authenticated") return;
    const email = session?.user?.email;
    if (!email) return;
    if (!Array.isArray(dataDocentes)) return;

    const found = dataDocentes.find((u) => u.email === email);

    if (found) {
      if (
        !userRol ||
        userRol.email !== found.email ||
        userRol.rol !== found.rol
      ) {
        setUserRol(found);
      }
      redirectedRef.current = false;
    } else {
      if (userRol && userRol.email === email && !redirectedRef.current) {
        redirectedRef.current = true;
        setUserRol(null);
        router.push("/info-register");
      }
    }
  }, [status, session, dataDocentes, userRol, setUserRol, router]);

  // ----------------------------------------------------------------
  // 3. CONTROL DE ENFRIAMIENTO (COOLDOWN) PARA LA SINCRONIZACIÓN
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!lastSyncTime) return;

    const COOLDOWN_MS = 60000; // 60 segundos (1 minuto)
    
    const checkCooldown = () => {
      const now = Date.now();
      const timePassed = now - lastSyncTime;

      if (timePassed < COOLDOWN_MS) {
        setIsOnCooldown(true);
        setTimeLeft(Math.ceil((COOLDOWN_MS - timePassed) / 1000));
      } else {
        setIsOnCooldown(false);
        setTimeLeft(0);
      }
    };

    checkCooldown(); // Revisar inmediatamente al renderizar

    const interval = setInterval(checkCooldown, 1000); // Actualizar cada segundo
    return () => clearInterval(interval); // Limpiar al desmontar
  }, [lastSyncTime]);

  // ----------------------------------------------------------------
  // 4. FUNCIÓN DE SINCRONIZACIÓN RÁPIDA (1-Clic)
  // ----------------------------------------------------------------
  const handleQuickSync = async () => {
    // Evitar ejecución si está cargando o en cooldown
    if (isSyncing || isOnCooldown) return;
    
    setIsSyncing(true);
    
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/sync-drive`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email, 
          anio: parseInt(selectedAnio), 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); 
        
        // ¡Registramos la hora del éxito en Zustand para bloquear el botón!
        if (setLastSyncTime) setLastSyncTime(Date.now());

        // Refrescamos los datos en caliente para que aparezcan las nuevas cards
        if (getAllRegisterData) {
            getAllRegisterData(selectedAnio); 
        }
      } else {
        alert(`Aviso: ${result.message}`);
      }
    } catch (error) {
      console.error("Error en sincronización rápida:", error);
      alert("Hubo un problema de conexión al intentar sincronizar.");
    } finally {
      setIsSyncing(false);
    }
  };

  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <div className="bg-slate-950 text-white h-screen grid place-items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col">
      {/* --- NAVBAR --- */}
      <div className="flex flex-col md:flex-row justify-between p-3 bg-blue-950 gap-4 shadow-md z-10 border-b border-blue-900">
        
        {/* Lado Izquierdo: Logo y Dashboard */}
        <div className="flex gap-4 md:gap-6 items-center justify-between md:justify-start">
          <div className="flex gap-3 items-center">
            <h1 className="place-content-center text-white font-bold text-xl tracking-wide">
              App Educa
            </h1>
            <Image
              className="w-10 rounded-lg shadow-sm"
              width={48}
              height={48}
              src="/images/logo2.jpg"
              alt="Logo"
            />
          </div>

          {["admin", "root"].includes(userRol?.rol ?? "") && (
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold transition shadow-sm"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Lado Derecho: Controles y Usuario */}
        <div className="flex flex-wrap gap-3 items-center justify-center md:justify-end">
          
          {/* Selector Año */}
          <div className="flex items-center gap-2 bg-blue-900/50 px-2 py-1.5 rounded border border-blue-800">
            <label className="text-sm font-light text-blue-200 hidden sm:block">Vigencia:</label>
            <select
              value={selectedAnio}
              onChange={(e) => setSelectedAnio(e.target.value)}
              disabled={isSyncing}
              className="bg-transparent text-white cursor-pointer font-bold outline-none"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>

          {/* Botón de Sincronización Rápida (Con Cooldown) */}
          <button
            onClick={handleQuickSync}
            disabled={isSyncing || isOnCooldown}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-bold shadow-md transition-all ${
              isSyncing || isOnCooldown
                ? "bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600"
                : "bg-green-600 hover:bg-green-500 text-white border border-green-500 hover:scale-105"
            }`}
            title="Buscar archivos nuevos en Drive"
          >
            <MdSync className={`${isSyncing ? "animate-spin" : ""}`} size={20} />
            <span className="hidden md:inline">
               {isSyncing 
                  ? "Sincronizando..." 
                  : isOnCooldown 
                    ? `Espera ${timeLeft}s` 
                    : "Sincronizar"}
            </span>
          </button>

          {/* Saludo Usuario */}
          <p className="hidden lg:block place-content-center text-white text-sm border-l border-blue-800 pl-4">
            Hola, <span className="font-semibold text-blue-300">{session?.user?.name?.split(' ')[0] ?? ""}</span>
          </p>

          {/* Botón Registrar */}
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold transition shadow-sm"
          >
            <span className="hidden md:inline">Registrar Evidencia</span>
            <span className="md:hidden">Registrar</span>
          </Link>

          {/* Botón Salir */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-semibold transition shadow-sm"
          >
            <MdOutlineLogout size={18} />
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-grow w-full">
        <HomeMain />
      </main>
      
      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

export default HomePage;