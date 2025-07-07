import { getConnection } from '../db/connection';
import oracledb from 'oracledb';

export const obtenerProductos = async () => {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `BEGIN pkg_productos.obtener_productos(:cursor); END;`,
      {
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

 const resultSet = (result.outBinds as { cursor: oracledb.ResultSet<any> }).cursor;
    const rows = [];

    let row;
    while ((row = await resultSet?.getRow())) {
      rows.push(row);
    }

    await resultSet?.close();
    return rows;
  } finally {
    await connection.close();
  }
};
