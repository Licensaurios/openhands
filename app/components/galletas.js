"use client";
import { useState } from "react";

export default function Estrellas() {

  const [galletas, setGalletas] = useState(1)

  const IncEstrellas = () => {
    setGalletas(galletas + 1)
  }


  return (
    <>
        <p> {galletas} 🍪 </p>
        <button onClick={IncEstrellas}>
          Agregar galleta
        </button>
    </>
  )

}