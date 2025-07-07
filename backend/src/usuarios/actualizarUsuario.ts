import { getConnection } from '../db/connection';

export const actualizarUsuario = async (id: number, nombre: string, correo: string) => {
  const connection = await getConnection();
  const result = await connection.execute(
    `UPDATE usuarios SET nombre = :nombre, correo = :correo WHERE id = :id`,
    [nombre, correo, id],
    { autoCommit: true }
  );
  await connection.close();
  return result.rowsAffected; // indica cuántos registros se actualizaron
};
