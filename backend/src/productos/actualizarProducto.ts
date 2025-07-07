import { getConnection } from '../db/connection';

export const actualizarProducto = async (
  id: number,
  nombre: string,
  descripcion: string,
  cantidad: number,
  precio: number
): Promise<number> => {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `BEGIN pkg_productos.actualizar_producto(:id, :nombre, :descripcion, :cantidad, :precio); END;`,
      {
        id,
        nombre,
        descripcion,
        cantidad,
        precio
      }
    );
    await connection.commit();
    return 1; // asumimos éxito, puedes revisar si deseas validar más
  } finally {
    await connection.close();
  }
};
