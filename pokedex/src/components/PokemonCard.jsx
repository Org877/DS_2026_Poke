import React from "react";

const PokemonCard = ({ pokemon }) => {
  const image = pokemon.sprites.other["official-artwork"].front_default;

  return (
    <article className="tarjeta">
      <img 
        src={image} 
        alt={pokemon.name} 
        style={{ width: "120px", height: "120px", objectFit: "contain" }} 
      />
      <h2>
        #{pokemon.id} {pokemon.name}
      </h2>
      <ul className="tipos">
        {pokemon.types.map((t) => (
          <li key={t.type.name}>{t.type.name}</li>
        ))}
      </ul>
      <p>
        {pokemon.height / 10}m - peso: {pokemon.weight / 10}kg
      </p>
    </article>
  );
};

export default PokemonCard;