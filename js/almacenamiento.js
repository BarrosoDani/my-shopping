/*
  MI COMPRA - Sistema de almacenamiento
  Guarda datos en el navegador del usuario.
*/

const MiCompraStorage = {

  // Guardar cualquier información.
  guardar(clave, datos) {
    try {
      localStorage.setItem(clave, JSON.stringify(datos));
      return true;
    } catch (error) {
      console.error("No se pudieron guardar los datos:", error);
      return false;
    }
  },

  // Recuperar información.
  obtener(clave, valorPredeterminado = null) {
    try {
      const datos = localStorage.getItem(clave);

      return datos === null
        ? valorPredeterminado
        : JSON.parse(datos);

    } catch (error) {
      console.error("No se pudieron recuperar los datos:", error);
      return valorPredeterminado;
    }
  },

  // Eliminar información concreta.
  eliminar(clave) {
    localStorage.removeItem(clave);
  },

  // Crear una copia de seguridad de la aplicación.
  crearCopia() {
    return {
      version: 1,
      fecha: new Date().toISOString(),

      productos: this.obtener("miCompraProductos", []),
      historial: this.obtener("miCompraHistorial", []),
      supermercados: this.obtener("miCompraSupermercados", [])
    };
  },

  // Descargar la copia de seguridad.
  descargarCopia() {
    const copia = this.crearCopia();

    const archivo = new Blob(
      [JSON.stringify(copia, null, 2)],
      { type: "application/json" }
    );

    const enlace = document.createElement("a");
    const url = URL.createObjectURL(archivo);

    enlace.href = url;
    enlace.download = "mi-compra-copia-seguridad.json";
    enlace.click();

    URL.revokeObjectURL(url);
  },

  // Restaurar una copia de seguridad.
  restaurarCopia(texto) {
    try {
      const copia = JSON.parse(texto);

      if (
        copia.version !== 1 ||
        !Array.isArray(copia.productos) ||
        !Array.isArray(copia.historial)
      ) {
        throw new Error("El archivo no es una copia válida.");
      }

      this.guardar("miCompraProductos", copia.productos);
      this.guardar("miCompraHistorial", copia.historial);
      this.guardar(
        "miCompraSupermercados",
        Array.isArray(copia.supermercados)
          ? copia.supermercados
          : []
      );

      return true;

    } catch (error) {
      console.error("Error al restaurar la copia:", error);
      return false;
    }
  }
};
