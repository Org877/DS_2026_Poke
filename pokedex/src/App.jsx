import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
// 1. Importamos deleteDoc y doc desde firestore
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

// Regla 
const LIMIT = 10; 
const API_URL = "https://pokeapi.co/api/v2/pokemon";

function App() { // Logica
  const [pokemonList, setPokemonList] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // El equipo inicia vacío 
  const [equipo, setEquipo] = useState([]);
  const [offset, setOffset] = useState(0);

  async function agregar(p) {
    // Regla 
    if (equipo.length >= 6) return; 
    
    // Regla 
    if (equipo.some((e) => e.id === p.id)) return; 
    
    // Base de Datos
    await setDoc(doc(db, "equipo", String(p.id)), {
      nombre: p.name || p.nombre,
      img: p.sprites?.other?.["official-artwork"]?.front_default || p.sprites?.front_default || p.img
    });
    setEquipo([...equipo, p]);
  }

  // 2. Función para quitar un Pokémon del equipo y de Firestore
  async function quitar(id) {
    try {
      // Eliminar de Firebase Firestore
      await deleteDoc(doc(db, "equipo", String(id)));
      
      // Actualizar el estado local filtrando el Pokémon eliminado
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
    <>
      {/* Pantalla */}
      <h1>Pokedex App</h1> 

      {/* Pantalla */}
      <div style={{ marginBottom: "20px" }}>
        {/* Regla */}
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

      {/* Pantalla*/}
      <h2>Mi equipo ({equipo.length}/6)</h2> 
      <section className="equipo">
        {equipo.map((p) => ( 
          <div key={p.id} style={{ position: "relative" }}>
            <PokemonCard pokemon={p} />
            {/* 3. Botón para quitar el Pokémon del equipo */}
            <button 
              onClick={() => quitar(p.id)}
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "5px"
              }}
            >
              Quitar
            </button>
          </div>
        ))}
      </section>

      {/* Regla de Negocio  */}
      {cargando && <p>Cargando...</p>} 
      {error && <p>Error: {error}</p>} 

      {/* Pantalla */}
      <div
        className="pokemon-grid" 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {!cargando && !error && pokemonList.map((pokemon) => (
          <PokemonCard 
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