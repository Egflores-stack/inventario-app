import { getConnection } from '../db/connection';

export const eliminarUsuario = async (id: number) => {
  const connection = await getConnection();
  const result = await connection.execute(
    `DELETE FROM usuarios WHERE id = :id`,
    [id],
    { autoCommit: true }
  );
  await connection.close();
  return result.rowsAffected; // indica si se eliminó o no
};
