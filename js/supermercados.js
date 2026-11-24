/*
  MI COMPRA - Supermercados
*/

const SUPERMERCADOS = [
  "Mercadona",
  "DIA",
  "Ahorramás",
  "Alcampo",
  "Carrefour"
];

const SUPERMERCADOS_CON_FUENTE = [
  "Mercadona",
  "DIA",
  "Ahorramás",
  "Alcampo",
  "Carrefour"
];

function obtenerSupermercadosSeleccionados() {
  const guardados = MiCompraStorage.obtener(
    "miCompraSupermercados",
    SUPERMERCADOS
  );

  return guardados.filter(tienda =>
    SUPERMERCADOS.includes(tienda)
  );
}

function guardarSupermercadosSeleccionados(seleccion) {
  const validos = seleccion.filter(tienda =>
    SUPERMERCADOS.includes(tienda)
  );

  return MiCompraStorage.guardar(
    "miCompraSupermercados",
    validos
  );
}

function tieneFuenteDePrecios(tienda) {
  return SUPERMERCADOS_CON_FUENTE.includes(tienda);
}

function obtenerCatalogoSupermercados() {
  const seleccionados = obtenerSupermercadosSeleccionados();

  return SUPERMERCADOS.map(tienda => ({
    nombre: tienda,
    seleccionada: seleccionados.includes(tienda),
    fuenteDisponible: tieneFuenteDePrecios(tienda)
  }));
}
