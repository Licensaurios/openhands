"use client";
import { useState } from "react";
import "./login.css";
export default function Login() {
  const [correo, SetCorreo] = useState("");
  const [password, SetPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reponse = await fetch("");
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
    console.log("logeando...");
  };
  return (
    <>
      <div className="login-container">
        <h1>Ingresa a tu cuenta</h1>

        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="correo">Correo </label>
          <input
            id="correo"
            type="text"
            onChange={(e) => SetCorreo(e.target.value)}
          />
          <label htmlFor="password">Contraseña </label>
          <input
            id="password"
            type="password"
            onChange={(e) => SetPassword(e.target.value)}
          />
          <a href="">Olvide mi contraseña</a>
          <button>Iniciar sesion</button>
        </form>
        <div className="divider">
          <span>o continúa con</span>
        </div>
        <div>
          <button className="icons-login">
            <img src="../assets/icons/google.svg" alt="" />
            Continuar con Google
          </button>
          <button className="icons-login">
            <img src="../assets/icons/facebook.svg" alt="" />
            Continuar con Facebook
          </button>
          <button className="icons-login">
            <img src="../assets/icons/github.svg" alt="" />
            Continuar con Github
          </button>
        </div>
      </div>
    </>
  );
}
