/*
  MI COMPRA - Historial de compras
*/

// Recuperar el historial guardado.
function obtenerHistorial() {
  try {
    return JSON.parse(
      localStorage.getItem("miCompraHistorial") || "[]"
    );
  } catch {
    return [];
  }
}

// Guardar una compra en el historial.
function guardarCompra(compra) {
  const historial = obtenerHistorial();

  const nuevaCompra = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    productos: compra.productos || [],
    total: Number(compra.total) || 0,
    supermercado: compra.supermercado || "Varios supermercados"
  };

  historial.unshift(nuevaCompra);

  localStorage.setItem(
    "miCompraHistorial",
    JSON.stringify(historial)
  );

  return nuevaCompra;
}

// Buscar compras anteriores.
function buscarCompras(texto) {
  const historial = obtenerHistorial();
  const busqueda = texto.toLowerCase().trim();

  return historial.filter(compra =>
    compra.productos.some(producto =>
      producto.nombre.toLowerCase().includes(busqueda)
    )
  );
}

// Consultar la evolución del precio de un producto.
function consultarEvolucionPrecio(nombreProducto) {
  const historial = obtenerHistorial();
  const resultados = [];

  historial.forEach(compra => {
    compra.productos.forEach(producto => {
      if (
        producto.nombre.toLowerCase() ===
        nombreProducto.toLowerCase()
      ) {
        resultados.push({
          fecha: compra.fecha,
          precio: producto.precio,
          supermercado: producto.supermercado
        });
      }
    });
  });

  return resultados;
}

// Eliminar todo el historial.
function borrarHistorial() {
  localStorage.removeItem("miCompraHistorial");
}
