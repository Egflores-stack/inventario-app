import { getConnection } from '../db/connection';

export const obtenerUsuarios = async () => {
  const connection = await getConnection();
  const result = await connection.execute(
    `SELECT id, nombre, correo FROM usuarios`,
    [],
    { outFormat: 4001 } // oracledb.OUT_FORMAT_OBJECT
  );
  await connection.close();
  return result.rows;
};
