import React from "react";

const COLORES_TIPO = {
  grass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  poison: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  fire: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  water: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  bug: "bg-lime-500/20 text-lime-300 border-lime-500/40",
  flying: "bg-indigo-400/20 text-indigo-200 border-indigo-400/40",
  normal: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  electric: "bg-amber-400/20 text-amber-300 border-amber-400/40",
  ground: "bg-yellow-700/30 text-yellow-200 border-yellow-600/40",
  fairy: "bg-pink-500/20 text-pink-300 border-pink-500/40",
  fighting: "bg-red-600/20 text-red-300 border-red-500/40",
  psychic: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
  rock: "bg-stone-500/20 text-stone-300 border-stone-500/40",
  steel: "bg-zinc-400/20 text-zinc-200 border-zinc-400/40",
  ice: "bg-cyan-400/20 text-cyan-200 border-cyan-400/40",
  ghost: "bg-violet-600/20 text-violet-300 border-violet-500/40",
  dragon: "bg-blue-600/20 text-blue-300 border-blue-500/40",
  dark: "bg-neutral-700/40 text-neutral-300 border-neutral-600/40",
};

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
    <article className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg hover:border-slate-600 hover:-translate-y-1 transition duration-200 h-full">
      <div className="w-full h-32 bg-slate-800/60 rounded-xl flex items-center justify-center p-2 mb-3">
        <img
          src={image}
          alt={nombre}
          className="w-28 h-28 object-contain drop-shadow-md"
        />
      </div>

      {id && <span className="text-xs font-mono text-slate-400">#{id}</span>}
      <h2 className="text-lg font-bold capitalize text-white mb-2">
        {nombre}
      </h2>

      {pokemon.types && (
        <ul className="flex flex-wrap justify-center gap-1.5 mb-3">
          {pokemon.types.map((t) => {
            const tipo = t.type.name;
            const estilo =
              COLORES_TIPO[tipo] ||
              "bg-slate-700/40 text-slate-300 border-slate-600/40";
            return (
              <li
                key={tipo}
                className={`text-xs font-semibold capitalize px-2.5 py-0.5 rounded-full border ${estilo}`}
              >
                {tipo}
              </li>
            );
          })}
        </ul>
      )}

      {pokemon.height && pokemon.weight && (
        <p className="text-xs text-slate-400 mb-4">
          {pokemon.height / 10}m · {pokemon.weight / 10}kg
        </p>
      )}

      <div className="mt-auto w-full flex flex-col gap-2">
        {onAgregar && (
          <button
            onClick={() => onAgregar(pokemon)}
            disabled={deshabilitado}
            className={`w-full py-2 px-3 rounded-xl text-sm font-semibold transition ${
              enEquipo
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                : deshabilitado
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            }`}
          >
            {enEquipo ? "En equipo" : "Agregar"}
          </button>
        )}

        {onQuitar && (
          <button
            onClick={() => onQuitar(pokemon)}
            className="w-full py-2 px-3 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer"
          >
            Quitar
          </button>
        )}
      </div>
    </article>
  );
};

export default PokemonCard;