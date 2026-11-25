import { useEffect, useState } from "react";
import {
  registrar,
  iniciarSesion,
  escucharSesion,
  cerrarSesion,
} from "./Data/auth";

import { cargarNotas, guardarNotas } from "./Data/notas";

function LoginDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [revisando, setRevisando] = useState(true);

  const [texto, setTexto] = useState("");
  const [notas, setNotas] = useState([]);

  // Cargar notas cuando el usuario inicia sesión
  useEffect(() => {
    if (!usuario) return;

    cargarNotas(usuario.uid)
      .then(setNotas)
      .catch((err) => setError(err.message));
  }, [usuario]);

  // Escuchar el estado de autenticación de Firebase
  useEffect(() => {
    const dejarDeEscuchar = escucharSesion((user) => {
      setUsuario(user);
      setRevisando(false);
    });

    return dejarDeEscuchar;
  }, []);

  async function guardar(e) {
    e.preventDefault();
    setError("");

    try {
      // Ajusta esto según cómo reciba los parámetros tu función guardarNotas en "./Data/notas"
      await guardarNotas(usuario.uid, texto);
      setTexto(""); // Limpiar el input tras guardar
      // Recargar notas para ver la nueva
      const nuevasNotas = await cargarNotas(usuario.uid);
      setNotas(nuevasNotas);
    } catch (err) {
      setError(err.code || err.message);
    }
  }

  async function salir() {
    await cerrarSesion();
    setNotas([]);
    setTexto("");
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

  // Pantalla de carga inicial
  if (revisando) {
    return <p>Cargando...</p>;
  }

  // Vista si el usuario YA está logueado
  if (usuario) {
    return (
      <main>
        <h1>Hola, {usuario.email}</h1>
        <p>Tu uid: {usuario.uid}</p>
        <button onClick={salir}>Cerrar sesión</button>
        
        <form onSubmit={guardar}>
          <input 
            type="text" 
            value={texto}
            onChange={(e) => setTexto(e.target.value)} 
            placeholder="Escribe una nota..."
          />
          <button type="submit" disabled={texto.trim() === ''}>Guardar Nota</button>
        </form>

        {error && <p className="error">{error}</p>}

        <ul>
          {notas.map((nota) => (
            <li key={nota.id}>{nota.texto}</li>
          ))}
        </ul>
      </main>
    );
  }

  // Vista si el usuario NO está logueado (Login / Registro)
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
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
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