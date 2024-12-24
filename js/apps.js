// Definición de productos con stock y detalles
const productos = {
    1: {
        nombre: "Consulta Médica",
        precio: 5000,
        stock: {
            lunes: 10,
            miercoles: 10
        },
        descripcion: "Consulta general con diagnóstico médico."
    },
    2: {
        nombre: "Consulta + Estudio",
        precio: 6500,
        stock: {
            lunes: 10,
            miercoles: 10
        },
        descripcion: "Consulta y realización de estudios con orden médica."
    },
    3: {
        nombre: "Estudio Médico",
        precio: 2000,
        stock: {
            martes: 20,
            viernes: 20
        },
        descripcion: "Realización de estudio con orden médica."
    }
};

// Variables globales
const IVA = 0.21;

// Función para cargar el carrito al cargar la página
document.addEventListener("DOMContentLoaded", cargarCarrito);

// Función para añadir un producto al carrito
function agregarAlCarrito(id, dia) {
    const producto = productos[id];

    // Validar stock disponible
    if (producto.stock[dia] <= 0) {
        alert("No hay turnos disponibles para este día.");
        return;
    }

    // Actualizar stock
    producto.stock[dia]--;
    document.getElementById(`${dia}-${id}`).textContent = producto.stock[dia];

    // Obtener carrito del localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ nombre: producto.nombre, precio: producto.precio, dia: dia });
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`${producto.nombre} añadido al carrito para el día ${dia}.`);
    renderizarCarrito();
}

// Función para mostrar la descripción del producto
function mostrarDescripcion(id) {
    const producto = productos[id];
    const card = document.getElementById(`producto-${id}`);

    // Verificar si ya se mostró la descripción
    if (card.querySelector(".descripcion")) {
        alert("La descripción ya está visible.");
        return;
    }

    // Crear un nuevo elemento para la descripción
    const descripcion = document.createElement("p");
    descripcion.className = "descripcion";
    descripcion.textContent = producto.descripcion;

    card.appendChild(descripcion);
}

// Función para renderizar el carrito en la vista
function renderizarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const subtotalCarrito = document.getElementById("subtotal-carrito");
    const ivaCarrito = document.getElementById("iva-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Limpiar lista anterior
    listaCarrito.innerHTML = "";

    // Totales iniciales
    let subtotal = 0;

    // Renderizar cada producto
    carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${item.nombre} - $${item.precio} (Día: ${item.dia})`;

        // Botón para eliminar producto
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.onclick = () => eliminarDelCarrito(index);

        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);

        // Sumar al subtotal
        subtotal += item.precio;
    });

    // Calcular IVA
    const iva = subtotal * IVA;

    // Actualizar totales
    subtotalCarrito.textContent = subtotal.toFixed(2);
    ivaCarrito.textContent = iva.toFixed(2);
    totalCarrito.textContent = (subtotal + iva).toFixed(2); // Total incluye IVA
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Recuperar el producto para devolver stock
    const item = carrito[index];
    const producto = productos[Object.keys(productos).find(key => productos[key].nombre === item.nombre)];
    producto.stock[item.dia]++;
    document.getElementById(`${item.dia}-${Object.keys(productos).find(key => productos[key].nombre === item.nombre)}`).textContent = producto.stock[item.dia];

    // Eliminar producto por índice
    carrito.splice(index, 1);

    // Actualizar localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Renderizar de nuevo
    renderizarCarrito();
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
    // Restaurar stock de todos los productos
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.forEach(item => {
        const producto = productos[Object.keys(productos).find(key => productos[key].nombre === item.nombre)];
        producto.stock[item.dia]++;
        document.getElementById(`${item.dia}-${Object.keys(productos).find(key => productos[key].nombre === item.nombre)}`).textContent = producto.stock[item.dia];
    });

    // Limpiar localStorage
    localStorage.removeItem("carrito");

    // Renderizar
    renderizarCarrito();
}

// Funciones relacionadas al modal de Checkout
function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Validar que hay productos en el carrito
    if (carrito.length === 0) {
        alert("No hay turnos seleccionados");
        return;
    }

    // Mostrar modal de checkout
    const modal = document.getElementById("checkout-modal");
    modal.style.display = "flex";

    // Actualizar totales en el modal
    const subtotal = parseFloat(document.getElementById("subtotal-carrito").textContent);
    const iva = subtotal * IVA;

    document.getElementById("modal-subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("modal-iva").textContent = iva.toFixed(2);
    document.getElementById("modal-total").textContent = (subtotal + iva).toFixed(2);
}

function realizarCompra() {
    // Simular compra
    alert("En caso de no poder concurrir comuniquese 24 hs antes al 0800-xxx-xxxx");

    // Vaciar carrito
    localStorage.removeItem("carrito");

    // Cerrar modal
    cerrarCheckout();

    // Renderizar carrito
    renderizarCarrito();
}

function cerrarCheckout() {
    const modal = document.getElementById("checkout-modal");
    modal.style.display = "none";
}

// Función para cargar el carrito al cargar la página
function cargarCarrito() {
    renderizarCarrito();
}


