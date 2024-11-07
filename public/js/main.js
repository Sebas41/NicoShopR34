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


// main.js

function initializeNavbar() {
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = parseJwt(token);
        document.getElementById('loginNav').classList.add('d-none');
        document.getElementById('registerNav').classList.add('d-none');
        document.getElementById('logoutNav').classList.remove('d-none');
        document.getElementById('cartNav').classList.remove('d-none');
        if (decoded.role === 'admin') {
            document.getElementById('adminNav').classList.remove('d-none');
        }
    } else {
        document.getElementById('loginNav').classList.remove('d-none');
        document.getElementById('registerNav').classList.remove('d-none');
        document.getElementById('logoutNav').classList.add('d-none');
        document.getElementById('cartNav').classList.add('d-none');
        document.getElementById('adminNav').classList.add('d-none');
    }

    // Manejar el cierre de sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            alert('Sesión cerrada exitosamente.');
            window.location.href = 'index.html';
        });
    }
}

// Función para decodificar JWT
function parseJwt (token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};


// main.js

document.addEventListener('DOMContentLoaded', () => {

    // Función para cargar productos destacados en index.html
    const loadFeaturedProducts = () => {
        const featuredProductsDiv = document.getElementById('featuredProducts');
        if (featuredProductsDiv) {
            fetch('http://localhost:3000/productos')
                .then(response => response.json())
                .then(products => {
                    // Selecciona los primeros 4 productos como destacados
                    const featured = products.slice(0, 4);
                    featured.forEach(product => {
                        const productCard = document.createElement('div');
                        productCard.className = 'col-md-3';
                        productCard.innerHTML = `
                            <div class="card mb-4 shadow-sm">
                                <img src="images/${product.imagen || 'default.jpg'}" class="card-img-top" alt="${product.nombre}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.nombre}</h5>
                                    <p class="card-text">${product.descripcion.substring(0, 50)}...</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="text-primary">$${product.precio.toFixed(2)}</span>
                                        <button class="btn btn-sm btn-outline-secondary" onclick="addToCart(${product.id})">Agregar</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        featuredProductsDiv.appendChild(productCard);
                    });
                })
                .catch(error => console.error('Error al cargar productos:', error));
        }
    };

    loadFeaturedProducts();

    // Manejar el registro de usuario
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (username === '' || password === '') {
                alert('Por favor, completa todos los campos.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, role: 'cliente' })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    window.location.href = 'login.html';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error al registrar:', error);
                alert('Ocurrió un error. Por favor, intenta nuevamente.');
            }
        });
    }

    // Manejar el inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (username === '' || password === '') {
                alert('Por favor, completa todos los campos.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    localStorage.setItem('token', data.token);
                    const decoded = parseJwt(data.token);
                    if (decoded.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'shop.html';
                    }
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                alert('Ocurrió un error. Por favor, intenta nuevamente.');
            }
        });
    }

    // Manejar el formulario de agregar producto
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('productName').value.trim();
            const descripcion = document.getElementById('productDescription').value.trim();
            const precio = parseFloat(document.getElementById('productPrice').value);
            const cantidad = parseInt(document.getElementById('productQuantity').value, 10);
            const imagenInput = document.getElementById('productImage');
            let imagen = '';

            if (imagenInput.files.length > 0) {
                // Opcional: Manejo de subida de imágenes
                const file = imagenInput.files[0];
                // Para simplificar, asumiremos que las imágenes se cargan manualmente en el servidor
                imagen = file.name; // Nombre del archivo
            }

            if (nombre === '' || descripcion === '' || isNaN(precio) || isNaN(cantidad)) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                alert('No estás autenticado.');
                window.location.href = 'login.html';
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/productos/agregar', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ nombre, descripcion, precio, cantidad, imagen })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    addProductForm.reset();
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error al agregar producto:', error);
                alert('Ocurrió un error. Por favor, intenta nuevamente.');
            }
        });
    }


    // Cargar lista completa de productos en shop.html
    const loadProductList = () => {
        const productListDiv = document.getElementById('productList');
        if (productListDiv) {
            fetch('http://localhost:3000/productos')
                .then(response => response.json())
                .then(products => {
                    productListDiv.innerHTML = '';
                    products.forEach(product => {
                        const productCard = document.createElement('div');
                        productCard.className = 'col-md-4';
                        productCard.innerHTML = `
                            <div class="card mb-4 shadow-sm">
                                <img src="public/images/${product.imagen || 'default.jpg'}" class="card-img-top" alt="${product.nombre}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.nombre}</h5>
                                    <p class="card-text">${product.descripcion.substring(0, 100)}...</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="text-primary">$${product.precio}</span>
                                        <button class="btn btn-sm btn-outline-primary" onclick="addToCart(${product.id})">Agregar</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        productListDiv.appendChild(productCard);
                    });
                })
                .catch(error => console.error('Error al cargar productos:', error));
        }
    };

    loadProductList();


    // Mostrar los items en el carrito
    const displayCart = () => {
        const cartItemsDiv = document.getElementById('cartItems');
        if (cartItemsDiv) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
                return;
            }

            fetch('http://localhost:3000/productos')
                .then(response => response.json())
                .then(products => {
                    let total = 0;
                    let cartHTML = `
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    cart.forEach(item => {
                        const product = products.find(p => p.id === item.productoId);
                        if (product) {
                            const subtotal = product.precio * item.cantidad;
                            total += subtotal;
                            cartHTML += `
                                <tr>
                                    <td>${product.nombre}</td>
                                    <td>$${product.precio.toFixed(2)}</td>
                                    <td>${item.cantidad}</td>
                                    <td>$${subtotal.toFixed(2)}</td>
                                    <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${product.id})">Eliminar</button></td>
                                </tr>
                            `;
                        }
                    });
                    cartHTML += `
                            </tbody>
                        </table>
                        <h4 class="text-right">Total: $${total.toFixed(2)}</h4>
                    `;
                    cartItemsDiv.innerHTML = cartHTML;
                })
                .catch(error => console.error('Error al cargar el carrito:', error));
        }
    };

    displayCart();

    // Manejar la eliminación de un producto del carrito
    window.removeFromCart = function(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.productoId !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    };

    // Manejar la compra
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                alert('Debes iniciar sesión para realizar una compra.');
                window.location.href = 'login.html';
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/carrito/comprar', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ items: cart })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    localStorage.removeItem('cart');
                    window.location.href = 'factura.html';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error al realizar la compra:', error);
                alert('Ocurrió un error. Por favor, intenta nuevamente.');
            }
        });
    }

});
