import oracledb from 'oracledb';



export const getConnection = async () => {
  return await oracledb.getConnection({
    user: 'system',
    password: 'oracle123',
    connectString: 'localhost/XEPDB1'
  });
};
