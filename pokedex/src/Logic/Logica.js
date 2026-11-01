
// 1. CONFIGURACIÓN Y ESTADO GLOBAL

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 10;
let offset = 0;

let equipo = [];       // Almacena hasta 6 Pokémon
let pokemonList = [];  // Almacena el lote actual de Pokémon obtenidos de la API


// import { db } from "./firebaseConfig.js";
// import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js";



// 2. FUNCIONES PRINCIPALES


/**
 * Carga un lote de Pokémon desde la PokeAPI según el offset y el límite.
 */
async function cargarLote() {
  try {
    console.log("Cargando lote...");
    // Opcional: Mostrar indicador de carga en el DOM
    // document.getElementById("loader").style.display = "block";

    const res = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
    const data = await res.json();

    // Obtener los detalles completos de cada Pokémon en paralelo
    const promesasDetalles = data.results.map(async (pokemon) => {
      const resDetalle = await fetch(pokemon.url);
      return await resDetalle.json();
    });

    pokemonList = await Promise.all(promesasDetalles);
    
    // Aquí puedes llamar a una función para pintar los Pokémon en pantalla
    // renderizarListaPokemon(pokemonList);

    console.log("Lote cargado con éxito:", pokemonList);
    return pokemonList;
  } catch (error) {
    console.error("Error al cargar el lote:", error);
  } finally {
    // Ocultar indicador de carga
    // document.getElementById("loader").style.display = "none";
  }
}

/**
 * Avanza a la siguiente página de registros.
 */
const siguiente = () => {
  offset += LIMIT;
  cargarLote();
};

/**
 * Retrocede a la página anterior sin pasar del inicio (0).
 */
const atras = () => {
  if (offset >= LIMIT) {
    offset -= LIMIT;
    cargarLote();
  } else {
    console.log("Ya estás en la primera página.");
  }
};

/**
 * Agrega un Pokémon al equipo, validando límites, duplicados y guardándolo en Firebase.
 * @param {Object} p - Objeto del Pokémon
 */
async function agregar(p) {
  // Validación 1: El equipo no puede tener más de 6 Pokémon.
  if (equipo.length >= 6) {
    alert("¡El equipo está lleno! Máximo 6 Pokémon.");
    return;
  }

  // Validación 2: No se pueden agregar Pokémon repetidos.
  if (equipo.some((e) => e.id === p.id)) {
    alert("Este Pokémon ya está en tu equipo.");
    return;
  }

  try {
    // Validación 3: Guarda el Pokémon en Firebase Firestore.
    await setDoc(doc(db, "equipo", String(p.id)), {
      nombre: p.name || p.nombre,
      img: p.sprites?.other?.["official-artwork"]?.front_default ||
           p.sprites?.front_default ||
           p.img
    });

    // Validación 4: Actualiza el estado del equipo localmente.
    equipo.push(p);
    
    console.log(`¡${p.name || p.nombre} agregado al equipo!`, equipo);
    
    // Opcional: Actualizar la interfaz del equipo en pantalla
    // renderizarEquipo();

  } catch (error) {
    console.error("Error al guardar el Pokémon en Firebase:", error);
  }
}


// 3. EJEMPLO DE INICIALIZACIÓN

// Para arrancar la aplicación por primera vez:
// cargarLote();