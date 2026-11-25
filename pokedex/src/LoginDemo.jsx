import { useEffect, useState } from "react";
import {
  registrar,
  iniciarSesion,
  escucharSesion,
  cerrarSesion,
} from "./Data/auth";
import App from "./App";

function LoginDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [revisando, setRevisando] = useState(true);

  useEffect(() => {
    const dejarDeEscuchar = escucharSesion((user) => {
      setUsuario(user);
      setRevisando(false);
    });

    return dejarDeEscuchar;
  }, []);

  async function salir() {
    await cerrarSesion();
  }

  async function entrar(e) {
    e.preventDefault();
    setError("");

    try {
      await iniciarSesion(email, password);
    } catch (err) {
      setError(err.code);
    }
  }

  async function crearCuenta() {
    setError("");

    try {
      await registrar(email, password);
    } catch (err) {
      setError(err.code);
    }
  }

  if (revisando) {
    return <p>Cargando...</p>;
  }

  if (usuario) {
    return (
      <main>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span>Hola, {usuario.email}</span>
          <button onClick={salir}>Cerrar sesión</button>
        </div>

        <App />
      </main>
    );
  }

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={entrar}>
        <input
          type="email"
          value={email}
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          value={password}
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>

        <button type="button" onClick={crearCuenta}>
          Crear Cuenta
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </main>
  );
}

export default LoginDemo;