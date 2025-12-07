import express from 'express';
import cors from 'cors';
import { authenticate, invalidateSession, RequestWithUser, requireRole } from './auth/authMiddleware';
import { createSession } from './auth/sessionStore';
import { findUser } from './auth/users';

// Usuarios
import { insertarUsuario } from './usuarios/insertarUsuario';
import { actualizarUsuario } from './usuarios/actualizarUsuario';
import { eliminarUsuario } from './usuarios/eliminarUsuario';
import { obtenerUsuarios } from './usuarios/obtenerUsuarios';

// Productos
import { insertarProducto } from './productos/insertarProducto';
import { obtenerProductos } from './productos/obtenerProductos';
import { actualizarProducto } from './productos/actualizarProducto';
import { eliminarProducto } from './productos/eliminarProducto';

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// --- AUTENTICACIÓN ---
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
  }

  const user = findUser(username, password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = createSession({ username: user.username, nombre: user.nombre, role: user.role });

  res.json({ token, user: { username: user.username, nombre: user.nombre, role: user.role } });
});

app.get('/auth/me', authenticate, (req, res) => {
  const request = req as RequestWithUser;
  res.json({ user: request.user });
});

app.post('/auth/logout', authenticate, (req, res) => {
  invalidateSession(req as RequestWithUser);
  res.json({ message: 'Sesión cerrada' });
});

// --- RUTAS DE USUARIOS ---

app.post('/usuarios', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { nombre, correo } = req.body;
    const id = await insertarUsuario(nombre, correo);
    res.status(201).json({ message: 'Usuario insertado', id });
  } catch (error) {
    res.status(500).json({ message: 'Error al insertar usuario', error });
  }
});

app.put('/usuarios/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, correo } = req.body;
    const rowsAffected = await actualizarUsuario(id, nombre, correo);
    if (rowsAffected && rowsAffected > 0) {
      res.json({ message: 'Usuario actualizado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
});

app.delete('/usuarios/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rowsAffected = await eliminarUsuario(id);
    if (rowsAffected && rowsAffected > 0) {
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
});

app.get('/usuarios', authenticate, async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
});

// --- RUTAS DE PRODUCTOS ---

app.post('/productos', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, precio } = req.body;

    if (!nombre || !descripcion || cantidad === undefined || precio === undefined) {
      return res.status(400).json({ message: 'Faltan datos obligatorios del producto' });
    }

    await insertarProducto(nombre, descripcion, cantidad, precio);
    res.status(201).json({ message: 'Producto insertado correctamente' });
  } catch (error) {
    console.error('Error al insertar producto:', error);
    res.status(500).json({ message: 'Error al insertar producto', error });
  }
});
app.get('/productos', authenticate, async (req, res) => {
  try {
    const productos = await obtenerProductos();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
});
app.put('/productos/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, descripcion, cantidad, precio } = req.body;
    const result = await actualizarProducto(id, nombre, descripcion, cantidad, precio);

    if (result > 0) {
      res.json({ message: 'Producto actualizado correctamente' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto', error });
  }
});
app.delete('/productos/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await eliminarProducto(id);

    if (result > 0) {
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Producto no eliminado' });
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

