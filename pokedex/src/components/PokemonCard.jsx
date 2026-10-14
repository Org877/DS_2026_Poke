import React from "react";

const PokemonCard = ({ pokemon, onAgregar, onQuitar }) => {
  // viene de Firebase tiene .img directa o de la PokéAPI
  const image = pokemon.img || pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default;
  const nombre = pokemon.name || pokemon.nombre;
  const id = pokemon.id;

  return (
    <article className="tarjeta">
      <img 
        src={image} 
        alt={nombre} 
        style={{ width: "120px", height: "120px", objectFit: "contain" }} 
      />
      <h2>
        {id ? `#${id} ` : ""}{nombre}
      </h2>
      
      {/* Si viene de Firebase, puede que no tenga types, height o weight, así que validamos con ?.* */}
      {pokemon.types && (
        <ul className="tipos">
          {pokemon.types.map((t) => (
            <li key={t.type.name}>{t.type.name}</li>
          ))}
        </ul>
      )}

      {pokemon.height && pokemon.weight && (
        <p>
          {pokemon.height / 10}m - peso: {pokemon.weight / 10}kg
        </p>
      )}

      {onAgregar && <button onClick={() => onAgregar(pokemon)}>Agregar</button>}
      {onQuitar && <button onClick={() => onQuitar(pokemon)}>Quitar</button>}
    </article>
  );
};

export default PokemonCard;