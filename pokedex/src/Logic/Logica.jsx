// 1. agregar(p)
async function agregar(p) {
  if (equipo.length >= 6) return;

  if (equipo.some((e) => e.id === p.id)) return;

  await setDoc(doc(db, "equipo", String(p.id)), {
    nombre: p.name || p.nombre,
    img: p.sprites?.other?.["official-artwork"]?.front_default ||
         p.sprites?.front_default ||
         p.img
  });

  setEquipo([...equipo, p]);
}

// El equipo no puede tener más de 6 Pokémon.
// No se pueden agregar Pokémon repetidos.
// Guarda el Pokémon en Firebase.
// Actualiza el estado del equipo.

// ------------------------------------------ //

// 2. cargarLote()
async function cargarLote() {
  setCargando(true);
  setError(null);

  const res = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);

  const data = await res.json();

  const promesasDetalles = data.results.map(async (pokemon) => {
    const resDetalle = await fetch(pokemon.url);
    return await resDetalle.json();
  });

  const resultadosCompletos = await Promise.all(promesasDetalles);

  setPokemonList(resultadosCompletos);
  setCargando(false);
}
// Consumir la API.
// Obtener los detalles completos de cada Pokemon.
// Preparar la información para mostrarla.

// ------------------------------------------ //

// 3. siguiente()
const siguiente = () => setOffset(offset + LIMIT);
// Cambia la página actual avanzando 10 registros.

// ------------------------------------------ //

// 4. atras()
const atras = () => {
  if (offset >= LIMIT) {
    setOffset(offset - LIMIT);
  }
};
//Impide navegar mas haya de la pagina principal
//Avanza 10 registros


// agregar()
// cargarLote()
// siguiente()
// atras()