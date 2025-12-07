# Inventario con autenticación por roles

Este proyecto incluye un backend en Express y un frontend en Vue que comparten un flujo de autenticación por token en memoria. Usa sesiones sencillas para permitir acceso de solo lectura o rol de administrador.

## Requisitos
- Node.js 18 o superior
- Un servidor Oracle accesible si quieres usar las operaciones reales de productos (la autenticación funciona sin base de datos)

## Cómo ejecutar el backend
1. Instala dependencias:
   ```bash
   npm install --prefix backend
   ```
2. Configura las credenciales de Oracle en `backend/src/db/connection.ts` según tu entorno.
3. Inicia el servidor de desarrollo en el puerto 3000:
   ```bash
   npm start --prefix backend
   ```

### Endpoints de autenticación
- **POST** `/auth/login` con `{ "username": "admin", "password": "admin123" }` o `{ "username": "usuario", "password": "usuario123" }`.
- **GET** `/auth/me` para validar la sesión (requiere header `Authorization: Bearer <token>`).
- **POST** `/auth/logout` para cerrar la sesión.

## Cómo ejecutar el frontend
1. Instala dependencias:
   ```bash
   npm install --prefix frontend
   ```
2. Inicia el cliente Vite (usa el backend en `http://localhost:3000` por defecto):
   ```bash
   npm run dev --prefix frontend -- --host
   ```
3. Abre `http://localhost:5173` y usa las credenciales demo:
   - Administrador: **admin / admin123** (puede agregar productos)
   - Solo lectura: **usuario / usuario123**

## Comportamiento de la UI
- Al iniciar sesión se guarda el token en `localStorage` y se verifica con `/auth/me` al recargar.
- El listado de productos envía el token en cada petición y muestra mensajes si la sesión expira.
- El formulario de productos solo aparece para el rol **admin**; un aviso de solo lectura aparece para otros usuarios.

## Consejos rápidos para probar
- Cerrar sesión desde el header invalida el token en el backend y limpia el almacenamiento local.
- Si el backend no puede conectarse a Oracle, las rutas de productos devolverán errores 500; el login seguirá funcionando para probar la protección por roles.
