// 1 Controles de Paginación (Anterior / Siguiente)
<div style={{ marginBottom: "20px" }}>

  {/* Botón para retroceder de página */}
  <button onClick={atras} disabled={offset === 0 || cargando}>
    Anterior
  </button>

  {/*  mostrando actualmente */}
  <span style={{ margin: "0 15px" }}>
    Mostrando del {offset + 1} al {offset + LIMIT}
  </span>

  {/* Botón para avanzar de página.  */}
  <button onClick={siguiente} disabled={cargando}>
    Siguiente
  </button>
</div>

{/* 2. Sección del Equipo Pokémon Seleccionado */}
// <h2>Mi equipo ({equipo.length}/6)</h2>
// <section className="equipo">
//  {/* Recorre el arreglo del equipo actual y renderiza una tarjeta por cada Pokémon */}
// {equipo.map((p) => (
// <PokemonCard key={p.id} pokemon={p} />
// ))}
// </section>

{/* 3. Mensajes de Estado (Carga y Errores) */}
{/* Muestra un texto de carga si la variable 'cargando' es verdadera */}
{cargando && <p>Cargando...</p>}
{/* Muestra un mensaje de error si la variable 'error' contiene algún valor */}
{error && <p>Error: {error}</p>}

{/* 4. Cuadrícula Principal de Pokémon  */}
<div
  className="pokemon-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  }}
>
  {/* 
    Se renderiza la lista de Pokémon solo si no está cargando y no hay errores. 
    Por cada Pokémon se crea una tarjeta con su respectiva función para agregarlo al equipo.
  */}
  {!cargando && !error && pokemonList.map((pokemon) => (
    <PokemonCard
      key={pokemon.id}
      pokemon={pokemon}
      onAgregar={agregar}
    />
  ))}
</div>