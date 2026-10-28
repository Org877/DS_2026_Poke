//1. importaciones Firebase
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// doc() = crea una referencia a un documento.
// setDoc() = guarda información en Firestore.
// db = conexión configurada a Firebase.

// ------------------------------------------ //

// 2. guardar datos 
await setDoc(doc(db, "equipo", String(p.id)), {
  nombre: p.name || p.nombre,
  img: p.sprites?.other?.["official-artwork"]?.front_default ||
       p.sprites?.front_default ||
       p.img
});

doc(db, "equipo", String(p.id))


// Base de datos: db
// Colección: "equipo"

// ------------------------------------------ //

// 3. config firebase
import { db } from "./firebase";

// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Aqui se concecta a firebase

// db
// doc()
// setDoc()
// await setDoc(...)