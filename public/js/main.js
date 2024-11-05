// public/js/main.js

async function cargarProductos() {
    try {
        const response = await fetch('/productos');
        const productos = await response.json();
        // Renderizar los productos en el HTML
        console.log(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Llamar a la función cuando se carga la página
window.addEventListener('DOMContentLoaded', cargarProductos);
