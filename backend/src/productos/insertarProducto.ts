import { getConnection } from '../db/connection';

export const insertarProducto = async (
  nombre: string,
  descripcion: string,
  cantidad: number,
  precio: number
): Promise<void> => {
  const connection = await getConnection();
  try {
    await connection.execute(
      `BEGIN pkg_productos.insertar_producto(:nombre, :descripcion, :cantidad, :precio); END;`,
      {
        nombre,
        descripcion,
        cantidad,
        precio
      }
    );
    await connection.commit(); // Importante si tu conexión no está en modo autocommit
  } finally {
    await connection.close();
  }
};
