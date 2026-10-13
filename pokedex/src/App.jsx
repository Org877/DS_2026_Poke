import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import "./App.css";

const LIMIT = 15;
const API_URL = "https://pokeapi.co/api/v2/pokemon";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Usamos un offset para saber desde qué Pokémon empezar 
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    async function cargarLote() {
      setCargando(true);
      setError(null);
      try {
        // Obtenemos la lista con un límite de 10
        const res = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
        if (!res.ok) throw new Error(`No se pudo obtener la lista (${res.status})`);
        const data = await res.json();

        // La API nos devuelve una lista 
        const promesasDetalles = data.results.map(async (pokemon) => {
          const resDetalle = await fetch(pokemon.url);
          return await resDetalle.json();
        });

        //  Esperamos a que todas las peticiones terminen juntas
        const resultadosCompletos = await Promise.all(promesasDetalles);
        
        setPokemonList(resultadosCompletos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarLote();
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
        <span style={{ margin: "0 15px" }}>Mostrando del {offset + 1} al {offset + LIMIT}</span>
        <button onClick={siguiente} disabled={cargando}>Siguiente</button>
      </div>

      {cargando && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}

      <div className="pokemon-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {!cargando && !error && pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </>
  );
}

export default App;