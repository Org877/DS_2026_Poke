import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import "./App.css";
 

const API_URL = "https://pokeapi.co/api/v2/pokemon/";
 
function App() {
  const [pokemon, setPokemon] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
 
  const [id, setId] = useState(1);
 
  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
       
        const res = await fetch(`${API_URL}${id}`);
       
        if (!res.ok) throw new Error(`Pokemon no encontrado (${res.status})`);
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }
 
    cargar();
  }, [id]);
 
  const siguiente = () => setId(id + 1);
  const atras = () => {
    if (id > 1) {
      setId(id - 1);
    }
  };
 
  return (
    <>
      <h1>Pokedex App</h1>
 
      <div style={{ marginBottom: "20px" }}>
        <button onClick={atras} disabled={id <= 1}>
          Anterior
        </button>
        <span style={{ margin: "0 15px" }}>ID: {id}</span>
        <button onClick={siguiente}>Siguiente</button>
      </div>
 
      {cargando && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {pokemon && !cargando && !error && <PokemonCard pokemon={pokemon} />}
    </>
  );
}
 
export default App;