import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

// Regla
const LIMIT = 10;
const API_URL = "https://pokeapi.co/api/v2/pokemon";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // El equipo inicia vacío
  const [equipo, setEquipo] = useState([]);
  const [offset, setOffset] = useState(0);

  async function agregar(p) {
    // Regla: máximo 6 y sin repetidos
    if (equipo.length >= 6) return;
    if (equipo.some((e) => e.id === p.id)) return;

    // Base de Datos
    await setDoc(doc(db, "equipo", String(p.id)), {
      nombre: p.name || p.nombre,
      img:
        p.sprites?.other?.["official-artwork"]?.front_default ||
        p.sprites?.front_default ||
        p.img,
    });
    setEquipo([...equipo, p]);
  }

  // Función para quitar un Pokémon del equipo y de Firestore
  async function quitar(id) {
    try {
      await deleteDoc(doc(db, "equipo", String(id)));
      setEquipo(equipo.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar de Firestore:", err);
    }
  }

  useEffect(() => {
    async function cargarLote() {
      setCargando(true);
      setError(null);

      const res = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
      if (!res.ok) throw new Error(`No se pudo obtener la lista (${res.status})`);
      const data = await res.json();

      const promesasDetalles = data.results.map(async (pokemon) => {
        const resDetalle = await fetch(pokemon.url);
        return await resDetalle.json();
      });

      const resultadosCompletos = await Promise.all(promesasDetalles);
      setPokemonList(resultadosCompletos);
      setCargando(false);
    }

    cargarLote().catch((err) => {
      setError(err.message);
      setCargando(false);
    });
  }, [offset]);

  const siguiente = () => setOffset(offset + LIMIT);
  const atras = () => {
    if (offset >= LIMIT) {
      setOffset(offset - LIMIT);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Encabezado y controles de paginación */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Pokédex App
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Selecciona hasta 6 cartas para armar tu equipo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={atras}
            disabled={offset === 0 || cargando}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Anterior
          </button>

          <span className="text-sm text-slate-300 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
            Mostrando del {offset + 1} al {offset + LIMIT}
          </span>

          <button
            onClick={siguiente}
            disabled={cargando}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-sm font-bold text-slate-950 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Sección Mi Equipo */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-xl font-bold text-white mb-4">
          Mi equipo{" "}
          <span className="text-amber-400 font-semibold">
            ({equipo.length}/6)
          </span>
        </h2>

        {equipo.length === 0 ? (
          <p className="text-sm text-slate-400 border border-dashed border-slate-800 rounded-xl py-6 text-center">
            Tu equipo está vacío. Presiona <strong>+ Agregar</strong> en
            cualquier carta para añadirla.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {equipo.map((p) => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                onQuitar={() => quitar(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Estados de carga y error */}
      {cargando && (
        <p className="py-12 text-center text-slate-400 animate-pulse">
          Cargando cartas...
        </p>
      )}
      {error && (
        <p className="bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl p-4 text-sm">
          Error: {error}
        </p>
      )}

      {/* Cuadrícula principal de cartas */}
      {!cargando && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemonList.map((pokemon) => {
            const yaEnEquipo = equipo.some((e) => e.id === pokemon.id);
            return (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onAgregar={agregar}
                deshabilitado={yaEnEquipo || equipo.length >= 6}
                enEquipo={yaEnEquipo}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;