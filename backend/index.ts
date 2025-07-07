const oracledb = require('oracledb');
//import oracledb from 'oracledb';

async function main() {
  try {
    const conn = await oracledb.getConnection({
      user: 'system',
      password: 'oracle123',
      connectString: 'localhost/XEPDB1'
    });

    const result = await conn.execute('SELECT * FROM dual');
    console.log('Resultado:', result.rows);

    await conn.close();
  } catch (err) {
    console.error('Error al conectar a Oracle:', err);
  }
}

main();
