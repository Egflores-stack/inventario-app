import { getConnection } from '../db/connection';

export const eliminarProducto = async (id: number): Promise<number> => {
  let connection;
  try {
    connection = await getConnection();

    await connection.execute(
      `BEGIN pkg_productos.eliminar_producto(:id); END;`,
      { id }
    );

    await connection.commit();

    console.log(`Producto con id ${id} eliminado correctamente.`);
    return 1; // Éxito
  } catch (error) {
    console.error(`Error al eliminar producto con id ${id}:`, error);
    return 0; // Fallo
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error('Error cerrando la conexión:', closeError);
      }
    }
  }
};
