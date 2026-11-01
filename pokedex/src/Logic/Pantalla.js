
// 1. HTML

document.documentElement.lang = "es";

// Crear y configurar el <head>
const head = document.head;
const metaCharset = document.createElement("meta");
metaCharset.setAttribute("charset", "UTF-8");
const metaViewport = document.createElement("meta");
metaViewport.name = "viewport";
metaViewport.content = "width=device-width, initial-scale=1.0";
const title = document.createElement("title");
title.textContent = "Pokédex y Equipo";

// Estilos incrustados
const style = document.createElement("style");
style.textContent = `
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
  }
  .pokemon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  .equipo {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .tarjeta {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
    border-radius: 8px;
  }
`;

head.appendChild(metaCharset);
head.appendChild(metaViewport);
head.appendChild(title);
head.appendChild(style);

// Crear y configurar el <body> dinámicamente
const body = document.body;
body.innerHTML = `
  <!-- 1. Controles de Paginación -->
  <div style="margin-bottom: 20px;">
    <button id="btn-atras">Anterior</button>
    <span id="info-paginacion" style="margin: 0 15px;">Mostrando del 1 al 10</span>
    <button id="btn-siguiente">Siguiente</button>
  </div>

  <!-- 2. Sección del Equipo Pokémon Seleccionado -->
  <h2 id="titulo-equipo">Mi equipo (0/6)</h2>
  <section class="equipo" id="contenedor-equipo">
    <!-- Aquí se renderizarán los Pokémon del equipo -->
  </section>

  <!-- 3. Mensajes de Estado (Carga y Errores) -->
  <div id="contenedor-estado">
    <!-- Mensaje de carga o error -->
  </div>

  <!-- 4. Cuadrícula Principal de Pokémon -->
  <div class="pokemon-grid" id="contenedor-grid">
    <!-- Aquí se renderizará la lista principal -->
  </div>
`;



// 2. ESTADO Y CONFIGURACIÓN

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 10;
let offset = 0;

let equipo = [];
let pokemonList = [];
let cargando = false;
let error = null;



// 3. FUNCIONES DE RENDERIZADO (UI)

function actualizarUI() {
  // Paginación
  const btnAtras = document.getElementById("btn-atras");
  const btnSiguiente = document.getElementById("btn-siguiente");
  const infoPaginacion = document.getElementById("info-paginacion");

  if (btnAtras && btnSiguiente && infoPaginacion) {
    btnAtras.disabled = (offset === 0 || cargando);
    btnSiguiente.disabled = cargando;
    infoPaginacion.textContent = `Mostrando del ${offset + 1} al ${offset + LIMIT}`;
  }

  // Equipo
  const tituloEquipo = document.getElementById("titulo-equipo");
  const contenedorEquipo = document.getElementById("contenedor-equipo");
  if (tituloEquipo && contenedorEquipo) {
    tituloEquipo.textContent = `Mi equipo (${equipo.length}/6)`;
    contenedorEquipo.innerHTML = equipo.map(p => `
      <div class="tarjeta">
        <img src="${p.sprites?.front_default || ''}" alt="${p.name}" width="80" />
        <p>${p.name}</p>
      </div>
    `).join("");
  }

  // Estado (Carga / Errores)
  const contenedorEstado = document.getElementById("contenedor-estado");
  if (contenedorEstado) {
    let htmlEstado = "";
    if (cargando) htmlEstado += `<p>Cargando...</p>`;
    if (error) htmlEstado += `<p style="color: red;">Error: ${error}</p>`;
    contenedorEstado.innerHTML = htmlEstado;
  }

  // Cuadrícula Principal
  const contenedorGrid = document.getElementById("contenedor-grid");
  if (contenedorGrid) {
    if (!cargando && !error) {
      contenedorGrid.innerHTML = pokemonList.map(pokemon => `
        <div class="tarjeta">
          <img src="${pokemon.sprites?.front_default || ''}" alt="${pokemon.name}" width="96" />
          <h3>${pokemon.name}</h3>
          <button onclick="agregarPorId(${pokemon.id})">Agregar</button>
        </div>
      `).join("");
    } else {
      contenedorGrid.innerHTML = "";
    }
  }
}



// 4. LÓGICA DE NEGOCIO Y API

async function cargarLote() {
  cargando = true;
  error = null;
  actualizarUI();

  try {
    const res = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
    if (!res.ok) throw new Error("No se pudo obtener la lista de Pokémon");
    const data = await res.json();

    const promesasDetalles = data.results.map(async (pokemon) => {
      const resDetalle = await fetch(pokemon.url);
      return await resDetalle.json();
    });

    pokemonList = await Promise.all(promesasDetalles);
  } catch (err) {
    error = err.message;
  } finally {
    cargando = false;
    actualizarUI();
  }
}

const siguiente = () => {
  offset += LIMIT;
  cargarLote();
};

const atras = () => {
  if (offset >= LIMIT) {
    offset -= LIMIT;
    cargarLote();
  }
};

async function agregar(p) {
  if (equipo.length >= 6) {
    alert("El equipo está lleno (máximo 6)");
    return;
  }
  if (equipo.some((e) => e.id === p.id)) {
    alert("Este Pokémon ya está en el equipo");
    return;
  }

  // Aquí iría tu lógica de Firebase si la requieres:
  /*
  await setDoc(doc(db, "equipo", String(p.id)), {
    nombre: p.name || p.nombre,
    img: p.sprites?.front_default
  });
  */

  equipo.push(p);
  actualizarUI();
}

window.agregarPorId = function(id) {
  const pokemonEncontrado = pokemonList.find(p => p.id === id);
  if (pokemonEncontrado) {
    agregar(pokemonEncontrado);
  }
};



// 5. INICIALIZACIÓN DE EVENTOS

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-siguiente").addEventListener("click", siguiente);
  document.getElementById("btn-atras").addEventListener("click", atras);
  cargarLote();
});