import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import "./App.css";

function App() {
  // Estados de la aplicación
  // Estado para guardar el nombre del Pokémon que se va a consultar 
  const [nombrePokemon, setNombrePokemon] = useState("pikachu");
  
  // Estado para almacenar los datos detallados del Pokémon devueltos por la API
  const [pokemon, setPokemon] = useState(null);
  
  // Estado para controlar si la peticion es true
  const [cargando, setCargando] = useState(true);
  
  // Estado para capturar y almacenar mensajes de error si la petición falla
  const [error, setError] = useState(null);

  // Efecto secundario para la petición a la API
  // Se ejecuta al montar el componente y cada vez que cambia la variable nombrePokemon
  useEffect(() => {
    async function cargarPokemon() {
      try {
        setCargando(true); // Activamos el indicador de carga
        setError(null);    // Limpiamos cualquier error previo

        // Hacemos la petición  a la PokéAPI usando el nombre actual
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`
        );

        // Si la respuesta no es exitosa lanzamos un error
        if (!res.ok) {
          throw new Error("Pokémon no encontrado");
        }

        // Convertimos la respuesta a JSON y actualizamos el estado del Pokémon
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        // Si ocurre un fallo en el try, lo capturamos y guardamos el mensaje
        setError(err.message);
      } finally {
        // Se ejecuta siempre al terminar (con éxito o error), desactivando la carga
        setCargando(false);
      }
    }

    cargarPokemon();
  }, [nombrePokemon]); // Dependencia: se vuelve a disparar si el usuario cambia de Pokémon

  //  Renderizado la interfaz 
  return (
    <>
      <h1>Pokedex App</h1>

      {/* Botones que actualizan el estado `nombrePokemon` al hacer clic */}
      <button onClick={() => setNombrePokemon("pikachu")}>
        Pikachu
      </button>

      <button onClick={() => setNombrePokemon("charizard")}>
        Charizard
      </button>

      <button onClick={() => setNombrePokemon("bulbasaur")}>
        Bulbasaur
      </button>

      <button onClick={() => setNombrePokemon("squirtle")}>
        Squirtle
      </button>

      <button onClick={() => setNombrePokemon("Ekans")}>
        Ekans
      </button>

      <button onClick={() => setNombrePokemon("Kyurem")}>
        Kyurem
      </button>

      {/*  muestra "Cargando..." si `cargando` = true */}
      {cargando && <p>Cargando...</p>}
      
      {/*  muestra el error si la variable `error` tiene contenido */}
      {error && <p>Error: {error}</p>}

      {/*  muestra la tarjeta solo si hay datos, ya no carga y no hay error */}
      {pokemon && !cargando && !error && (
        <PokemonCard pokemon={pokemon} />
      )}
    </>
  );
}

export default App;