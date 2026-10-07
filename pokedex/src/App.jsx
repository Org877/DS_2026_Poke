import { useState } from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  console.log("render")

  fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
    .then((res) => res.json())
    .then(data => setPokemon(data))


  return (
    <>
      <h1>Pokedex App</h1>
      <h3>{pokemon ? pokemon.name : "Cargando..."}</h3>
    </>
  )
}

export default App