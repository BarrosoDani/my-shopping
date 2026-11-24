/*
  MI COMPRA - Comparador de precios

  Compara precios reales recibidos de las fuentes
  de supermercados. Nunca inventa precios.
*/

// Supermercados que podremos seleccionar.
const supermercados = [
  "Mercadona",
  "DIA",
  "Ahorramás",
  "Alcampo",
  "Carrefour"
];

// Encuentra el precio más barato de un producto.
function encontrarPrecioMasBarato(precios) {
  if (!Array.isArray(precios)) {
    return null;
  }

  const disponibles = precios.filter(item =>
    Number.isFinite(item.precio) &&
    item.precio >= 0 &&
    item.supermercado
  );

  if (disponibles.length === 0) {
    return null;
  }

  disponibles.sort((a, b) => a.precio - b.precio);

  return disponibles[0];
}

// Compara todos los productos de una lista.
function compararProductos(productos) {
  if (!Array.isArray(productos)) {
    return [];
  }

  return productos.map(producto => {
    const mejorPrecio = encontrarPrecioMasBarato(
      producto.precios || []
    );

    return {
      nombre: producto.nombre,
      mejorOpcion: mejorPrecio,
      disponible: mejorPrecio !== null
    };
  });
}

// Calcula el coste total de las mejores opciones.
function calcularTotalComparacion(comparacion) {
  return comparacion.reduce((total, producto) => {
    if (!producto.disponible) {
      return total;
    }

    return total + producto.mejorOpcion.precio;
  }, 0);
}

// Devuelve los productos que todavía no tienen precio.
function productosSinPrecio(comparacion) {
  return comparacion
    .filter(producto => !producto.disponible)
    .map(producto => producto.nombre);
}
// PRUEBA DE CONEXIÓN CON SUPERFUDIS
async function probarConexionPrecios() {
  const url = "https://mi-compra-api.barrosodani09.workers.dev/";
  const datos = {
    items: [
      {
        query: "leche entera 1 litro",
        quantity: 1
      }
    ],
    retailers: [
      "Mercadona",
      "Dia",
      "ahorramas",
      "Alcampo",
      "Carrefour"
    ],
    include_delivery: false
  };

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    console.log("Respuesta de Superfudis:", resultado);

    return resultado;

  } catch (error) {
    console.error("Error al conectar con Superfudis:", error);
    return null;
  }
}
