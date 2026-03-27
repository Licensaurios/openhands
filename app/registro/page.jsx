"use client";
import { useState } from "react";
/*{
    		"nombre": "Alexander",
    		"apellido1": "Vega",
    		"apellido2": "", 
    		"email": "tu_correo@uas.edu.mx",
    		"password": "tu_password_pro",
    		"password_confirm": "tu_password_pro"
	}*/

export default function registro() {
  const [correo, SetCorreo] = useState("");
  const [nombre, SetNombre] = useState("");
  const [apellido1, SetApellido1] = useState("");
  const [apellido2, SetApellido2] = useState("");
  const [password, SetPassword] = useState("");
  const [password_confirm, SetPassword_confirm] = useState("");
  const handleregistro = (e) => {
    const data = {
      nombre: nombre,
      apellido1: apellido1,
      apellido2: apellido2,
      email: correo,
      password: password,
      password_confirm: password_confirm,
    }; //fetch del registro POST
  };
  return (
    <>
      <div className="registro-container">
        <form onSubmit={handleregistro}>
          <label htmlFor="nombre">Nombre </label>
          <input
            id="nombre"
            type="text"
            onChange={(e) => SetNombre(e.target.value)}
          />
          <label htmlFor="apellido1">Apellido 1</label>
          <input
            id="apellido1"
            type="text"
            onChange={(e) => SetApellido1(e.target.value)}
          />
          <label htmlFor="apellido2">Apellido 2</label>
          <input
            id="apellido2"
            type="text"
            onChange={(e) => SetApellido2(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            onChange={(e) => SetCorreo(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            onChange={(e) => SetPassword(e.target.value)}
          />
          <label htmlFor="password_confirm">Confirm Password</label>
          <input
            id="password_confirm"
            type="password"
            onChange={(e) => SetPassword_confirm(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}
