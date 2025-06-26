import React from "react";
import { useRouter } from "next/navigation";
import useStore from "../store/useStore";

import { FaTrashAlt } from "react-icons/fa";

const CardDashboard = ({
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
  fileName,

}) => {



  const router = useRouter();
  const dataRegistros = useStore((state) => state.dataRegistros);
  const setDataRegistros = useStore((state) => state.setDataRegistros);
  const dataRolUser = useStore((state) => state.userRol);

  const deleteDocument = async (id) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/delete-register/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Datos eliminados exitosamente");
      //window.location.href = '/home'
      //router.push('/home')
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }

    // actualiza el registro del estado
    const newDataRegistros = dataRegistros.filter((user) => user._id !== id);
    setDataRegistros(newDataRegistros);
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este registro?"
    );
    if (confirmed) {
      deleteDocument(id);
    }
  };

  return (
    <>
      <div
        className="card hover:cursor-pointer max-w-full rounded p-1 flex flex-col justify-between h-full"
        onClick={() => onClick(url)}
      >
        <div className="flex-1">
          <h3>Sede: {sede}</h3>
          <h3>Jornada: {jornada}</h3>
          <h3>Docente: {docente}</h3>

          <br />
          <p className="bg-blue-300 text-black p-2 rounded">
            {selectedCategory}
          </p>
          <p className="bg-blue-200 text-black p-2 rounded">
            {selectedSubCategory}
          </p>
          <p className="bg-purple-400 text-black p-2 rounded break-words">
            {fileName}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 border-t pt-2">
          <p>{grado}</p>
          <p>{grupo}</p>

        
          {
            dataRolUser.rol === 'root' && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Previene que el click active el onClick del card
                  handleDeleteClick(_id);
                }}
                className="rounded hover:text-red-600"
              >
                <FaTrashAlt size={24} />
              </button>
            )
          }
        </div>
      </div>
    </>
  );
};

export default CardDashboard;
