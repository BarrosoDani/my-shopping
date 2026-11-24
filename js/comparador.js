
/*
  MI COMPRA - Comparador de precios
  Consulta precios reales mediante Cloudflare y Superfudis.
*/

const supermercados = [
  "Mercadona",
  "DIA",
  "Ahorramás",
  "Alcampo",
  "Carrefour"
];

const URL_COMPARADOR =
  "https://mi-compra-api.barrosodani09.workers.dev/";

// Encuentra el precio más barato.
function encontrarPrecioMasBarato(precios) {
  if (!Array.isArray(precios)) return null;

  const disponibles = precios.filter(item =>
    Number.isFinite(item.precio) &&
    item.precio >= 0 &&
    item.supermercado
  );

  disponibles.sort((a, b) => a.precio - b.precio);

  return disponibles.length ? disponibles[0] : null;
}

// Compara productos.
function compararProductos(productos) {
  if (!Array.isArray(productos)) return [];

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

function calcularTotalComparacion(comparacion) {
  return comparacion.reduce((total, producto) => {
    if (!producto.disponible) return total;
    return total + producto.mejorOpcion.precio;
  }, 0);
}

function productosSinPrecio(comparacion) {
  return comparacion
    .filter(producto => !producto.disponible)
    .map(producto => producto.nombre);
}

// Crea texto de forma segura.
function crearTexto(etiqueta, contenido) {
  const elemento = document.createElement(etiqueta);
  elemento.textContent = contenido;
  return elemento;
}

// Formatea precios.
function formatoPrecio(precio) {
  if (!Number.isFinite(Number(precio))) {
    return "Precio no disponible";
  }

  return Number(precio).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR"
  });
}

// Consulta de prueba.
async function probarConexionPrecios() {
  const datos = {
    items: [
      { query: "leche entera 1 litro", quantity: 1 }
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
    const respuesta = await fetch(URL_COMPARADOR, {
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
    console.error("Error al conectar:", error);
    return null;
  }
}

// FUNCIÓN PRINCIPAL DEL BOTÓN COMPARAR PRECIOS.
async function compararMiCompra() {
  const contenedor = document.getElementById(
    "resultadosComparacion"
  );

  const boton = document.getElementById("botonComparar");

  if (!contenedor || !boton) return;

  if (!Array.isArray(productos) || productos.length === 0) {
    contenedor.replaceChildren(
      crearTexto("p", "Añade productos a tu lista primero.")
    );
    return;
  }

  if (productos.some(p => p.comprado)) {
    // Los productos comprados también se comparan.
  }

  const productosConsulta = productos.slice(0, 10);

  if (productos.length > 10) {
    contenedor.replaceChildren(
      crearTexto(
        "p",
        "Superfudis permite comparar hasta 10 productos por consulta. Se compararán los primeros 10."
      )
    );
  } else {
    contenedor.replaceChildren();
  }

  boton.disabled = true;
  boton.textContent = "Comparando...";

  const cargando = crearTexto("p", "Buscando precios reales...");
  contenedor.appendChild(cargando);

  const datos = {
    items: productosConsulta.map(producto => ({
      query: producto.nombre,
      quantity: producto.cantidad
    })),
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
    const respuesta = await fetch(URL_COMPARADOR, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || resultado.status !== "ok") {
      throw new Error(
        resultado.error || "No se pudieron obtener los precios."
      );
    }

    mostrarResultadosComparacion(resultado);

  } catch (error) {
    console.error("Error comparando precios:", error);

    contenedor.replaceChildren(
      crearTexto(
        "p",
        "No se pudieron consultar los precios. Inténtalo de nuevo más tarde."
      )
    );

  } finally {
    boton.disabled = false;
    boton.textContent = "Comparar precios";
  }
}

// MUESTRA LOS RESULTADOS EN LA PÁGINA.

function mostrarResultadosComparacion(resultado) {
  const contenedor = document.getElementById(
    "resultadosComparacion"
  );

  contenedor.replaceChildren();

  const titulo = crearTexto("h3", "Elige tus productos");
  titulo.style.marginBottom = "15px";
  contenedor.appendChild(titulo);

  (resultado.items || []).forEach((item, indice) => {
    const tarjeta = document.createElement("div");

    tarjeta.style.background = "#111216";
    tarjeta.style.border = "1px solid #393a42";
    tarjeta.style.borderRadius = "12px";
    tarjeta.style.padding = "16px";
    tarjeta.style.marginBottom = "16px";

    const productoAPI = item.product || {};
    const ofertas = Array.isArray(item.offers)
      ? [...item.offers]
      : [];

    ofertas.sort((a, b) =>
      Number(a.price_eur) - Number(b.price_eur)
    );

    const productoLista = productos.find(p =>
      p.nombre === item.query
    );

    tarjeta.appendChild(
      crearTexto(
        "h3",
        productoAPI.name || item.query || "Producto"
      )
    );

    if (productoAPI.brand) {
      tarjeta.appendChild(
        crearTexto("p", "Marca: " + productoAPI.brand)
      );
    }

    tarjeta.appendChild(
      crearTexto("p", "Cantidad: " + item.quantity)
    );

    tarjeta.appendChild(
      crearTexto(
        "p",
        "Formato: " +
        (productoAPI.volume_total
          ? productoAPI.volume_total + " ml"
          : productoAPI.format || "No disponible")
      )
    );

    tarjeta.appendChild(
      crearTexto("h4", "Ofertas disponibles")
    );

    if (ofertas.length === 0) {
      tarjeta.appendChild(
        crearTexto("p", "No se encontraron ofertas.")
      );
    }

    ofertas.forEach((oferta, posicion) => {
      const fila = document.createElement("div");

      fila.style.padding = "14px 0";
      fila.style.borderBottom = "1px solid #393a42";

      const precioUnitario = Number(oferta.price_eur);

      fila.appendChild(
        crearTexto(
          "strong",
          oferta.retailer || "Supermercado"
        )
      );

      const precio = crearTexto(
        "h3",
        formatoPrecio(precioUnitario)
      );

      precio.style.color = "#b8f36b";
      fila.appendChild(precio);

      if (oferta.brand) {
        fila.appendChild(
          crearTexto("p", "Marca: " + oferta.brand)
        );
      }

      if (
        oferta.comparison_unit &&
        oferta.eur_per_unit != null
      ) {
        fila.appendChild(
          crearTexto(
            "p",
            "Precio por " + oferta.comparison_unit +
            ": " + formatoPrecio(Number(oferta.eur_per_unit))
          )
        );
      }

      if (posicion === 0) {
        const etiqueta = crearTexto(
          "p",
          "★ Opción más barata encontrada"
        );

        etiqueta.style.color = "#b8f36b";
        fila.appendChild(etiqueta);
      }

      if (oferta.source_url) {
        const enlace = document.createElement("a");
        enlace.href = oferta.source_url;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.textContent = "Ver producto en la tienda";
        enlace.style.color = "#b8f36b";
        fila.appendChild(enlace);
      }

      const boton = document.createElement("button");

      boton.textContent = "Elegir este producto";
      boton.style.display = "block";
      boton.style.marginTop = "10px";

      boton.addEventListener("click", () => {
        if (
          !productoLista ||
          !Number.isFinite(precioUnitario) ||
          precioUnitario < 0
        ) {
          return;
        }

        productoLista.precioUnitario = precioUnitario;
        productoLista.supermercado = oferta.retailer || "";
        productoLista.marca =
          oferta.brand || productoAPI.brand || "";
        productoLista.nombreComercial =
          oferta.name || productoAPI.name || "";
        productoLista.formato =
          productoAPI.format || "";
        productoLista.enlaceTienda =
          oferta.source_url || "";

        guardarProductos();
        mostrarProductos();

        boton.textContent = "✓ Producto seleccionado";
        boton.disabled = true;
      });

      fila.appendChild(boton);
      tarjeta.appendChild(fila);
    });

    contenedor.appendChild(tarjeta);
  });

  if (resultado.superfudis_url) {
    const enlace = document.createElement("a");

    enlace.href = resultado.superfudis_url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent =
      "Ver comparación completa en Superfudis";
    enlace.style.color = "#b8f36b";

    contenedor.appendChild(enlace);
  }
}
