
async function buscarImagenProducto(ean) {
  if (!ean) return null;

  try {
    const respuesta = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(ean)}?fields=code,product_name,image_front_url,image_url`
    );

    if (!respuesta.ok) return null;

    const datos = await respuesta.json();

    if (datos.status !== 1 || !datos.product) {
      return null;
    }

    return (
      datos.product.image_front_url ||
      datos.product.image_url ||
      null
    );

  } catch (error) {
    console.error("Error buscando imagen:", error);
    return null;
  }
}
