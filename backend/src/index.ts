//import { insertarUsuario } from './usuarios/insertarUsuario';

//insertarUsuario('Edwin Flores', 'edwin@example.com');

//import { consultarUsuarios } from './usuarios/consultarUsuarios';

import { eliminarUsuario } from './usuarios/eliminarUsuario';
const main = async () => {
 // const usuarios = await consultarUsuarios();
 // console.log('Usuarios:', usuarios);
 const deleted = await eliminarUsuario(1);
  console.log('Filas eliminadas:', deleted);
};

main();

