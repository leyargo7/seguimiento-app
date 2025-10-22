'use client';
import HomeMain from '../../components/HomeMain.jsx';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { MdOutlineLogout } from 'react-icons/md';
import useStore from '../../store/useStore';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '../../components/footer.jsx';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Zustand
  const userRol = useStore((s) => s.userRol);                 // { email, rol, ... } | null
  const setUserRol = useStore((s) => s.setUserRol);

  const dataDocentes = useStore((s) => s.dataDocentes);
  const setDataDocentes = useStore((s) => s.setDataDocentes);

  const setDataRegistros = useStore((s) => s.setDataRegistros);
  const setAllSedesData = useStore((s) => s.setAllSedesData);
  const setAllGestionsData = useStore((s) => s.setAllGestionsData);
  const setAllGradosData = useStore((s) => s.setAllGradosData);
  const setAllGruposData = useStore((s) => s.setAllGruposData);

  // Para evitar redirecciones repetidas
  const redirectedRef = useRef(false);

  // Carga inicial de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/all-register-data`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Error al cargar datos');
        const result = await res.json();

        setDataRegistros(result.allRegister ?? []);
        setAllSedesData(result.sedes ?? []);
        setAllGestionsData(result.gestions ?? []);
        setAllGradosData(result.grados ?? []);
        setAllGruposData(result.grupos ?? []);
        setDataDocentes(result.dataDocentes ?? []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resolver rol del usuario con lógica "conservadora":
  // - Si lo encontramos: lo seteamos.
  // - Si NO lo encontramos: NO borramos el rol inmediatamente (evita parpadeos al refrescar listas).
  // - Solo redirigimos si antes sí teníamos rol del usuario y ahora confirmamos que ya no existe.
  useEffect(() => {
    if (status !== 'authenticated') return;
    const email = session?.user?.email;
    if (!email) return;
    if (!Array.isArray(dataDocentes)) return;

    const found = dataDocentes.find((u) => u.email === email);

    if (found) {
      // Actualiza solo si cambió (evita renders extra)
      if (!userRol || userRol.email !== found.email || userRol.rol !== found.rol) {
        setUserRol(found);
      }
      redirectedRef.current = false; // si volvió a aparecer, resetea bandera
    } else {
      // No lo encontramos en este tick: preserva el rol actual para no esconder el Dashboard por un "falso negativo"
      // Redirige solo si ya teníamos rol del usuario y no hemos redirigido aún (caso real de usuario no registrado)
      if (userRol && userRol.email === email && !redirectedRef.current) {
        redirectedRef.current = true;
        setUserRol(null);
        router.push('/info-register');
      }
      // Si userRol era null, simplemente espera a la próxima carga de dataDocentes.
    }
  }, [status, session, dataDocentes, userRol, setUserRol, router]);

  const isLoading = status === 'loading';

  if (isLoading) {
    return (
      <div className="bg-slate-950 text-white h-screen grid place-items-center">
        Cargando…
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white h-screen">
      <div className="flex justify-between p-3 bg-blue-950">
        <div className="flex gap-6">
          <div className="flex gap-3 items-center">
            <h1 className="place-content-center text-white">App Educa</h1>
            <Image
              className="w-12 rounded-lg"
              width={48}
              height={48}
              src="/images/logo2.jpg"
              alt="Logo"
            />
          </div>

          {['admin', 'root'].includes(userRol?.rol ?? '') && (
            <Link href="/dashboard" className="bg-blue-600 text-white p-2 rounded">
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex gap-6 items-center">
          <p className="place-content-center text-white">
            Hola {userRol?.rol ?? 'usuario'}: {session?.user?.name ?? ''}
          </p>

          <Link href="/register" className="bg-blue-600 text-white p-2 rounded">
            Registrar Evidencia
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 bg-gray-800 text-white p-2 rounded"
          >
            <MdOutlineLogout size={20} />
            Salir
          </button>
        </div>
      </div>

      <HomeMain />
      <Footer />
    </div>
  );
};

export default HomePage;
