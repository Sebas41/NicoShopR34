// public/js/main.js
// Main Thread of the program

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

    // Función para cargar el historial de compras
    const purchaseHistoryDiv = document.getElementById('purchaseHistory');

    const loadPurchaseHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Por favor, inicia sesión para ver tu historial de compras.');
            window.location.href = 'login.html';    
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/orders/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const error = await response.json();
                purchaseHistoryDiv.innerHTML = `<p class="text-danger">${error.message}</p>`;
                return;
            }

            const orders = await response.json();

            // Renderizar el historial
            if (orders.length > 0) {
                let historyHTML = `
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Productos</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                orders.forEach(order => {
                    const productList = order.productos.map(p => `<li>${p.nombre} (x${p.cantidad})</li>`).join('');
                    historyHTML += `
                        <tr>
                            <td>${order.id}</td>
                            <td>${new Date(order.fecha).toLocaleString()}</td>
                            <td>$${order.total.toFixed(2)}</td>
                            <td><ul>${productList}</ul></td>
                        </tr>
                    `;
                });

                historyHTML += `</tbody></table>`;
                purchaseHistoryDiv.innerHTML = historyHTML;
            } else {
                purchaseHistoryDiv.innerHTML = '<p>No hay compras registradas.</p>';
            }
        } catch (error) {
            console.error('Error al cargar el historial:', error);
            purchaseHistoryDiv.innerHTML = '<p class="text-danger">Error al cargar el historial de compras.</p>';
        }
    };

    // Llamar a la función para cargar el historial
    loadPurchaseHistory();

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
                                    <p class="text-muted">Disponible: ${product.cantidad}</p> <!-- Muestra la cantidad disponible -->
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

                if (!response.ok) {
                    // Manejando el error de autenticación 401 (Unauthorized)
                    const errorData = await response.json();
                    alert(errorData.message);
                    return;
                }

                const data = await response.json();
                alert(data.message);

                // Almacena el token y decodifica el rol
                localStorage.setItem('token', data.token);
                const decodedToken = parseJwt(data.token);
                console.log('Rol del usuario:', decodedToken.role);

                // Redirige según el rol
                if (decodedToken.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'shop.html';
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                alert('Ocurrió un error. Por favor, intenta nuevamente.');
            }
        });
    }

     // Función para decodificar el JWT
    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

// Manejar el formulario de agregar producto
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Crear un objeto FormData
        const formData = new FormData();
        formData.append('nombre', document.getElementById('productName').value.trim());
        formData.append('descripcion', document.getElementById('productDescription').value.trim());
        formData.append('precio', parseFloat(document.getElementById('productPrice').value));
        formData.append('cantidad', parseInt(document.getElementById('productQuantity').value, 10));

        // Añadir el archivo de imagen si está presente
        const imagenInput = document.getElementById('productImage');
        if (imagenInput.files && imagenInput.files[0]) {
            formData.append('productImage', imagenInput.files[0]);
        }

        try {
            const response = await fetch('/productos/agregar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Incluir el token si es necesario
                },
                body: formData // Enviar FormData
            });

            if (response.ok) {
                const data = await response.json();
                alert('Producto agregado con éxito');
                console.log('Producto agregado:', data);
                
                // Limpiar los campos del formulario
                addProductForm.reset();
            } else {
                const errorData = await response.json();
                alert('Error al agregar producto: ' + errorData.message);
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Error al enviar el formulario');
        }
    });
}



    // Función para agregar producto
    async function agregarProducto(producto) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión como administrador para agregar productos.');
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
                body: JSON.stringify(producto)
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                addProductForm.reset(); // Limpiar el formulario
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
            alert('Ocurrió un error. Por favor, intenta nuevamente.');
        }
    }

   // Cargar lista completa de productos en shop.html
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
                            <img src="${product.imagen || '/uploads/default.jpg'}" class="card-img-top" alt="${product.nombre}">
                            <div class="card-body">
                                <h5 class="card-title">${product.nombre}</h5>
                                <p class="card-text">${product.descripcion.substring(0, 100)}...</p>
                                <p class="text-muted">Disponible: ${product.cantidad}</p>
                                
                                <!-- Selector de cantidad para que el usuario elija la cantidad -->
                                <div class="input-group mb-3">
                                    <input type="number" class="form-control" id="quantity-${product.id}" 
                                           min="1" max="${product.cantidad}" value="1" aria-label="Cantidad">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-primary" 
                                                onclick="addToCart(${product.id})">Agregar</button>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-primary">$${product.precio.toFixed(2)}</span>
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
    async function displayCart() {
        const cartItemsDiv = document.getElementById('cartItems');
        if (!cartItemsDiv) return;
    
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Por favor inicia sesión para ver tu carrito.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/carrito', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const data = await response.json();
            console.log("Datos del carrito en frontend:", data); // Debugging: Verifica que los datos sean correctos
    
            if (response.ok && data.productos && data.productos.length > 0) {
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
    
                // Fetch de productos desde el backend para obtener detalles como el nombre y precio
                const productos = await fetch('http://localhost:3000/productos').then(res => res.json());
    
                // Construye la lista de productos en el carrito
                data.productos.forEach(item => {
                    const product = productos.find(p => p.id === item.productoId); // Encuentra el producto
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
            } else {
                cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            alert('Hubo un problema al cargar el carrito.');
        }
    }
    
    

    displayCart();

    // Manejar la eliminación de un producto del carrito
    window.removeFromCart = async function(productId) {
        const token = localStorage.getItem('token');
    
        if (!token) {
            alert('Por favor inicia sesión para eliminar productos del carrito.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/carrito/eliminar`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productoId: productId })
            });
    
            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Producto eliminado del carrito');
                displayCart(); // Actualiza la vista del carrito después de eliminar el producto
            } else {
                alert(data.message || 'Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            alert('Hubo un problema al eliminar el producto del carrito.');
        }
    };
    

    // Manejar la compra
    const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para realizar una compra.');
            window.location.href = 'login.html';
            return;
        }

        try {
            // Obtén el carrito del usuario desde el backend
            const carritoResponse = await fetch('http://localhost:3000/carrito', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const carritoData = await carritoResponse.json();

            // Revisa si el carrito está vacío
            if (!carritoData.productos || carritoData.productos.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            // Realiza el checkout usando el carrito del backend
            fetch('http://localhost:3000/carrito/comprar', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: carritoData.productos })
            })
            .then(response => {
                if (response.status === 201) {
                    return response.json();
                } else {
                    throw new Error('Error al completar la compra');
                }
            })
            .then(data => {
                alert(data.message); // Mostrar el mensaje de éxito
                if (data.facturaUrl) {
                    const link = document.createElement('a');
                    link.href = data.facturaUrl;
                    link.setAttribute('download', `factura_${new Date().toISOString()}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    window.location.reload(); 

                }
            })
            .catch(error => console.error('Error:', error));            
        } catch (error) {
            console.error('Error al procesar el carrito:', error);
            alert('Ocurrió un error al procesar el carrito.');
        }
    });
}


    // Mostrar detalles de la factura en factura.html
    const displayInvoice = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        console.log('Order ID obtenido:', orderId); // Para confirmar que se obtiene el ID
    
        if (!orderId) {
            alert('No se encontró el ID de la orden.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const order = await response.json();
            console.log('Datos de la factura:', order); // Verifica los datos que devuelve el backend
    
            if (!order || order.error) {
                alert('Error al cargar la factura.');
                return;
            }
    
            // Código para mostrar los datos en el HTML
            const invoiceDiv = document.getElementById('invoice');
            let invoiceHTML = `
                <p><strong>ID de Compra:</strong> ${order.id}</p>
                <p><strong>Fecha:</strong> ${new Date(order.fecha).toLocaleString()}</p>
                <h4>Productos:</h4>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
    
            order.productos.forEach(item => {
                const subtotal = item.precioUnitario * item.cantidad;
                invoiceHTML += `
                    <tr>
                        <td>${item.nombre}</td>
                        <td>${item.cantidad}</td>
                        <td>$${item.precioUnitario.toFixed(2)}</td>
                        <td>$${subtotal.toFixed(2)}</td>
                    </tr>
                `;
            });
    
            invoiceHTML += `
                    </tbody>
                </table>
                <h4 class="text-right">Total: $${order.total.toFixed(2)}</h4>
            `;
    
            invoiceDiv.innerHTML = invoiceHTML;
    
        } catch (error) {
            console.error('Error al cargar la factura:', error);
            alert('Error al cargar la factura.');
        }
    };
    
    // Llama a `displayInvoice` cuando el DOM esté cargado
    document.addEventListener('DOMContentLoaded', displayInvoice);
    
    

    // Manejar el cierre de sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            alert('Sesión cerrada exitosamente.');
            window.location.href = `factura.html?orderId=${orderId}`;
        });
    }

    // Función para agregar productos al carrito
    window.addToCart = async function(productId) {
        const quantityInput = document.getElementById(`quantity-${productId}`);
        const quantity = parseInt(quantityInput.value);
    
        if (quantity > 0) {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Por favor inicia sesión para agregar productos al carrito.');
                return;
            }
    
            try {
                const response = await fetch('http://localhost:3000/carrito/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`  // Agrega el token en el encabezado de autorización
                    },
                    body: JSON.stringify({ productoId: productId, cantidad: quantity }) // Enviar los datos al backend
                });
    
                const data = await response.json();
                if (response.ok) {
                    alert(`Producto agregado al carrito (Cantidad: ${quantity}).`);
                } else {
                    alert(data.message || 'Error al agregar al carrito');
                }
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
                alert('Hubo un problema al agregar el producto al carrito.');
            }
        } else {
            alert('Por favor, selecciona una cantidad válida.');
        }
    };
    

    // Función para decodificar JWT
    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

});

// Navbar toggle

var nav = $("#navbarSupportedContent");
        var btn = $(".custom_menu-btn");
        btn.click
        btn.click(function (e) {
    
          e.preventDefault();
          nav.toggleClass("lg_nav-toggle");
          document.querySelector(".custom_menu-btn").classList.toggle("menu_btn-style")
        });
