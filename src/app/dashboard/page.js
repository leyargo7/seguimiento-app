"use client";
import { useRouter } from "next/navigation";
import useStore from "../../store/useStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdOutlineLogout } from "react-icons/md";
//import CardDocument from '../../components/CardDocument'
import CardDashboard from "../../components/CardDashboard";
import ModalMain from "../../components/ModalMain";
import { signOut } from "next-auth/react";
import Image from "next/image";

function DashboardPage() {
  const [documentUrl, setDocumentUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validateLink, setValidateLink] = useState(false);
  const [filters, setFilters] = useState({
    sede: "",
    jornada: "",
    docente: "",
    grado: "",
    grupo: "",
    selectedCategory: "",
    selectedSubCategory: "",
  });
  const router = useRouter();

  const userRole = useStore((state) => state.userRol);
  const dataRegistros = useStore((state) => state.dataRegistros);

  const labelMap = {
    sede: "Sede",
    jornada: "Jornada",
    docente: "Docente",
    grado: "Grado",
    grupo: "Grupo",
    selectedCategory: "Gestión",
    selectedSubCategory: "Componente",
  };

  useEffect(() => {
    const allowedRoles = ["admin", "root"];

    if (allowedRoles.includes(userRole.rol)) {
      setValidateLink(true);
    } else {
      router.push("/home");
    }
  }, [userRole, router]);

  const openDocument = (url) => {
    setDocumentUrl(url);
    setIsModalOpen(true);
  };

  const closeDocument = () => {
    setDocumentUrl("");
    setIsModalOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      sede: "",
      jornada: "",
      docente: "",
      grado: "",
      grupo: "",
      selectedCategory: "",
      selectedSubCategory: "",
    });
  };

  const getUniqueValues = (key) => {
    const values = dataRegistros.map((user) => user[key]);
    return [...new Set(values)];
  };

  const filteredData = dataRegistros.filter((user) =>
    Object.entries(filters).every(([key, value]) =>
      value ? user[key]?.toLowerCase().includes(value.toLowerCase()) : true
    )
  );

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1); // Reinicia a la primera página cuando se aplican filtros
  }, [filteredData.length]);

  return (
    <div className="bg-slate-950">
      {validateLink && (
        <>
          <div className="flex justify-between p-3 bg-blue-950">
            <h2 className="place-content-center text-white">
              <div className="flex gap-3 items-center">
                <Link href="/home">App Educa</Link>
                <Image
                  className="w-12 rounded-lg"
                  width={500}
                  height={500}
                  src="/images/logo2.jpg"
                  alt="Logo"
                />
              </div>
            </h2>
            <div className="flex gap-6">
              <button
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
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
          <div className="flex flex-wrap gap-4 p-4 bg-slate-900">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6 px-4">
            {paginatedData.map((user) => (
              <div
                key={user._id}
                className="bg-slate-900 text-white rounded-lg p-4 shadow-md"
              >
                <CardDashboard
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

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-8 mb-12 px-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 text-gray-800"
                }`}
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md border ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 text-gray-800"
                }`}
              >
                Siguiente
              </button>
            </div>
          )}

          <ModalMain
            show={isModalOpen}
            onClose={closeDocument}
            documentUrl={documentUrl}
          />
        </>
      )}
    </div>
  );
}

export default DashboardPage;
