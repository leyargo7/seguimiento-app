import { useState, useEffect } from "react";
import Image from "next/image";

const phrasesWithImages = [
  { text: "La evaluación es el puente entre la enseñanza y el aprendizaje, permitiendo identificar fortalezas y áreas de mejora.", image: "/images/evaluation1.jpg" },
  { text: "Evaluar no es solo medir conocimientos, sino también comprender cómo los estudiantes aplican lo que saben.", image: "/images/evaluation2.jpg" },
  { text: "La evaluación formativa fomenta un aprendizaje continuo y significativo.", image: "/images/evaluation3.jpg" },
  { text: "Un buen proceso de evaluación debe ser justo, inclusivo y adaptado a las necesidades de los estudiantes.", image: "/images/evaluation4.jpg" },
  { text: "La evaluación no debe ser el fin del aprendizaje, sino el inicio de nuevas oportunidades para crecer.", image: "/images/evaluation5.jpg" },
  { text: "Evaluar es más que calificar; es interpretar, retroalimentar y guiar hacia el logro de objetivos educativos.", image: "/images/evaluation6.jpg" },
  { text: "En la educación, evaluar es acompañar a los estudiantes en su desarrollo integral.", image: "/images/evaluation7.jpg" },
  { text: "Las mejores evaluaciones inspiran a reflexionar y mejorar, no solo a obtener resultados.", image: "/images/evaluation8.jpg" },
  { text: "Una evaluación efectiva es aquella que logra captar no solo lo que se sabe, sino también cómo se piensa y resuelve.", image: "/images/evaluation9.jpg" },
  { text: "La evaluación educativa debe centrarse en el aprendizaje, no solo en la enseñanza.", image: "/images/evaluation10.jpg" },
];

export default function Slideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % phrasesWithImages.length);
    }, 10000); // Cambia cada 5 segundos
    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
  }, []);

  return (
   
    <div className="flex flex-col items-center justify-center lg:flex-row gap-10 p-3">
      <Image
        className="w-6/12 rounded-lg"
        width={400}
        height={400}
        src={phrasesWithImages[currentIndex].image}
        alt={`Imagen ${currentIndex + 1}`}
      />
      <p style={{fontSize: "1.8rem", fontStyle: "italic" }} className="text-center">
        {phrasesWithImages[currentIndex].text}
      </p>
    </div>
  );
}
