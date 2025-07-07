import { getConnection } from '../db/connection';

export const insertarUsuario = async (nombre: string, correo: string) => {
  const conn = await getConnection();

  try {
    const result = await conn.execute(
      `INSERT INTO usuarios (nombre, correo) VALUES (:nombre, :correo)`,
      { nombre, correo },
      { autoCommit: true }
    );
    console.log('Usuario insertado:', result.rowsAffected);
  } catch (err) {
    console.error('Error al insertar usuario:', err);
  } finally {
    await conn.close();
  }
};
