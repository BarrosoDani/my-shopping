/*
  MI COMPRA - Módulo de inteligencia artificial

  Este archivo organizará las funciones de IA.
  La conexión real con el servicio de IA
  la añadiremos más adelante desde un servidor seguro.
*/

// Analiza una lista escrita por el usuario.
function prepararLista(texto) {
  if (!texto || !texto.trim()) {
    return [];
  }

  return texto
    .split(/,|\n/)
    .map(producto => producto.trim())
    .filter(producto => producto.length > 0)
    .map(producto => ({
      nombre: producto,
      cantidad: 1,
      categoria: "Sin clasificar",
      nutricion: null,
      precio: null
    }));
}

// Estructura de la ficha de un producto.
function crearFichaProducto(datos) {
  return {
    nombre: datos.nombre || "Producto sin identificar",
    marca: datos.marca || "No disponible",
    formato: datos.formato || "No disponible",
    precio: datos.precio ?? null,
    supermercado: datos.supermercado || "No disponible",

    nutricion: {
      calorias: datos.calorias ?? null,
      proteinas: datos.proteinas ?? null,
      hidratos: datos.hidratos ?? null,
      grasas: datos.grasas ?? null,
      fuente: datos.fuenteNutricion || "Sin verificar"
    },

    ingredientes: datos.ingredientes || null,
    alergenos: datos.alergenos || null
  };
}

// Comprueba qué datos nutricionales están disponibles.
function comprobarNutricion(producto) {
  const nutricion = producto.nutricion || {};

  return {
    disponible:
      nutricion.calorias !== null ||
      nutricion.proteinas !== null ||
      nutricion.hidratos !== null ||
      nutricion.grasas !== null,

    fuente: nutricion.fuente || "Sin verificar"
  };
}
