"use client";
import { useState } from "react";

export default function Estrellas() {

  const [estrellas, setEstrellas] = useState(0)

  const IncEstrellas = () => {
    setEstrellas(estrellas + 5)
  }


  return (
    <>
        <p> {estrellas} ⭐ </p>
        <button onClick={IncEstrellas}>
          Incrementar contador de estrellas
        </button>
    </>
  )

}