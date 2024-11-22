# NicoShopR34

## Integrantes

- Ricardo Andrés Chamorro Martínez  
- Sebastián Erazo Ochoa  
- Oscar Stiven Muñoz Ramírez  
- Diego Armando Polanco Lozano  
- Luis Manuel Rojas Correa  

## Descripción del programa

NicoShopR34 es una plataforma de comercio electrónico diseñada para facilitar la compra y venta de productos de manera eficiente y sencilla. El proyecto fue desarrollado como trabajo final del curso **Computación en Internet I**, implementando una arquitectura cliente-servidor que permite gestionar roles, inventarios y compras.  

El sistema incluye autenticación segura y persistencia de datos, ofreciendo tanto a clientes como a administradores una experiencia ágil y funcional.  

## Tecnologías utilizadas

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js con Express.js  
- **Persistencia de datos**: Archivos JSON (o base de datos opcional)  
- **Autenticación**: JSON Web Tokens (JWT)  

## Funcionalidades principales

### Administrador:
- Iniciar sesión en su cuenta.  
- Agregar nuevos productos al inventario especificando:  
  - Nombre del producto  
  - Descripción  
  - Precio  
  - Cantidad disponible  

### Cliente:
- Registrarse o iniciar sesión.  
- Explorar productos disponibles en la tienda.  
- Agregar productos al carrito de compras.  
- Realizar compras, generando una factura que incluye detalles de los productos adquiridos, cantidades y el precio total.  
- Visualizar el historial de compras realizadas.  

## Instrucciones de configuración

### Prerrequisitos
- Tener instalado [Node.js](https://nodejs.org/) en el sistema.  
- Clonar este repositorio:
  ```bash
  git clone https://github.com/Sebas41/NicoShopR34.git
  
- Instalar las dependencias necesarias:
  cd NicoShopR34
  npm install

### Configuración del Administrador
El usuario administrador no se crea desde la interfaz gráfica. Para configurarlo:  
1. Edita el archivo `createAdmin.js` para establecer el nombre de usuario y la contraseña deseados.  
2. Ejecuta el siguiente comando:
node createAdmin.js

### Ejecución del programa
Inicia el servidor ejecutando:  
node app.js

Tambien puedes ejecutarlo utilizando:

 `npm run start` ó  `npm start` .

Accede a la aplicación desde tu navegador en `http://localhost:3000`.

### Detalles adicionales
- Para registrar un nuevo cliente, utiliza la opción **Sign Up** en la barra de navegación.  
- Los datos se almacenan en archivos JSON por defecto, asegurando una implementación sencilla y funcional.

## Créditos
Este proyecto fue desarrollado como homenaje al profesor Nicolás, destacando su impacto en el aprendizaje del equipo.
