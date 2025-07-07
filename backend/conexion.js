const oracledb = require('oracledb');

async function conectar() {
  try {
    const connection = await oracledb.getConnection({
      user: 'system',           // Ejemplo: system o tu usuario
      password: 'oracle123',    // Ejemplo: oracle123
      connectString: 'localhost/XEPDB1' // O el TNS de tu BD
    });

    const result = await connection.execute(`SELECT 'Conexión exitosa' AS mensaje FROM dual`);
    console.log(result.rows);

    await connection.close();
  } catch (err) {
    console.error('Error conectando a Oracle:', err);
  }
}

conectar();
