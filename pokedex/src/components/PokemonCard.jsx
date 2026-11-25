import React from "react";

const PokemonCard = ({
  pokemon,
  onAgregar,
  onQuitar,
  deshabilitado = false,
  enEquipo = false,
}) => {
  const image =
    pokemon.img ||
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;
  const nombre = pokemon.name || pokemon.nombre;
  const id = pokemon.id;

  return (
    <article className="bg-slate-800 border-2 border-slate-600 rounded-sm p-4 flex flex-col items-center text-center h-full">
      <div className="w-full aspect-square bg-slate-900 border border-slate-700 flex items-center justify-center p-3 mb-3">
        <img
          src={image}
          alt={nombre}
          className="w-32 h-32 object-contain"
        />
      </div>

      <h2 className="text-lg font-bold capitalize text-white mb-1">
        {id ? `#${id} ` : ""}
        {nombre}
      </h2>

      {pokemon.types && (
        <ul className="flex flex-wrap justify-center gap-1.5 mb-2">
          {pokemon.types.map((t) => (
            <li
              key={t.type.name}
              className="text-xs uppercase font-semibold bg-slate-700 text-slate-200 px-2 py-0.5 rounded-sm"
            >
              {t.type.name}
            </li>
          ))}
        </ul>
      )}

      {pokemon.height && pokemon.weight && (
        <p className="text-xs text-slate-300 mb-4">
          {pokemon.height / 10}m · {pokemon.weight / 10}kg
        </p>
      )}

      <div className="mt-auto w-full flex flex-col gap-2">
        {onAgregar && (
          <button
            onClick={() => onAgregar(pokemon)}
            disabled={deshabilitado}
            className={`w-full py-2 text-sm font-bold rounded-sm transition ${
              enEquipo
                ? "bg-emerald-700 text-white cursor-default"
                : deshabilitado
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
            }`}
          >
            {enEquipo ? "En equipo" : "Agregar"}
          </button>
        )}

        {onQuitar && (
          <button
            onClick={() => onQuitar(pokemon)}
            className="w-full py-2 text-sm font-bold rounded-sm bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
          >
            Quitar
          </button>
        )}
      </div>
    </article>
  );
};

export default PokemonCard;