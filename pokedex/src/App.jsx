import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

const LIMIT = 10;
const API_URL = "https://pokeapi.co/api/v2/pokemon";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Inicia en 0 (vacío)
  const [equipo, setEquipo] = useState([]);
  const [offset, setOffset] = useState(0);

  async function agregar(p) {
    if (equipo.length >= 6) return;
    if (equipo.some((e) => e.id === p.id)) return;
    
    // Guardamos en Firebase
    await setDoc(doc(db, "equipo", String(p.id)), {
      nombre: p.name || p.nombre,
      img: p.sprites?.other?.["official-artwork"]?.front_default || p.sprites?.front_default || p.img
    });
    setEquipo([...equipo, p]);
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
    <>
      <h1>Pokedex App</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={atras} disabled={offset === 0 || cargando}>
          Anterior
        </button>
        <span style={{ margin: "0 15px" }}>
          Mostrando del {offset + 1} al {offset + LIMIT}
        </span>
        <button onClick={siguiente} disabled={cargando}>
          Siguiente
        </button>
      </div>

      <h2>Mi equipo ({equipo.length}/6)</h2>
      <section className="equipo">
        {equipo.map((p) => ( <PokemonCard key={p.id} pokemon={p} />))}
      </section>

      {cargando && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}

      <div
        className="pokemon-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {!cargando && !error && pokemonList.map((pokemon) => (<PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onAgregar={agregar}
          />
        ))}
      </div>
    </>
  );
}

export default App;