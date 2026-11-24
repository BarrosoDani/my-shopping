/*
  MI COMPRA - Escáner de fotografías

  Preparado para reconocer texto mediante OCR.
  La interpretación inteligente se añadirá después.
*/

// Comprueba si el navegador permite leer la imagen.
function comprobarImagen(archivo) {
  if (!archivo || !archivo.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen válida.");
  }

  const maximo = 10 * 1024 * 1024;

  if (archivo.size > maximo) {
    throw new Error("La imagen no puede superar los 10 MB.");
  }

  return true;
}

// Convierte una fotografía en texto.
async function leerTextoImagen(archivo, progreso = () => {}) {
  comprobarImagen(archivo);

  if (typeof Tesseract === "undefined") {
    throw new Error("El sistema OCR todavía no está cargado.");
  }

  const resultado = await Tesseract.recognize(
    archivo,
    "spa+eng",
    {
      logger: informacion => {
        if (informacion.status === "recognizing text") {
          progreso(
            Math.round(informacion.progress * 100)
          );
        }
      }
    }
  );

  return resultado.data.text.trim();
}

// Divide el texto reconocido en posibles productos.
function convertirTextoEnProductos(texto) {
  return texto
    .split(/\n/)
    .map(linea => linea.trim())
    .filter(linea => linea.length > 1)
    .map(linea => ({
      nombre: linea,
      confirmado: false
    }));
}
