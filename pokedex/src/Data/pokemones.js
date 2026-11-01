// Todo lo que habla de pokeapi
import {normalizar } from "../pokemon"
const API_URL = "https://pokeapi.co/api/v2/pokemon";

export async function buscarPokemon(consulta) {
    const res = await fetch('${API}/pokemon/${consulta}')
    if(!res.ok) throw new Error('pokemon no encontrado (${res.status}')
        return normalizar(await res.json)

    
}

export async function listarPokemones(offset, limite) {
    // 1. lista de pokemon (nombre o id, url)
    const res = await fetch('${API}/pokemon?limit=${limite}&offset=${offset}')
    if (res.ok) throw new Error('Error al cargar la lista (${res.status}')
        const lista = await res.json
    
    // 2. Pedir detalle de cada pokemon en paralelo
    const detalle = await Promise.all (
        lista.results.map(p => fetch(p.url).then)
    )
}