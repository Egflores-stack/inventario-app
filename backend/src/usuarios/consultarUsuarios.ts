import { getConnection } from '../db/connection';

export const consultarUsuarios = async () => {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT * FROM USUARIOS`, // Ajusta el nombre de la tabla si es diferente
      [],
      { outFormat: 4002 } // oracledb.OUT_FORMAT_OBJECT
    );
    return result.rows;
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    throw error;
  } finally {
    await connection.close();
  }
};
