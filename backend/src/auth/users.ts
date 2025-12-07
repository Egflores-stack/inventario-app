export type AuthUser = {
  username: string;
  password: string;
  nombre: string;
  role: 'admin' | 'viewer';
};

const demoUsers: AuthUser[] = [
  { username: 'admin', password: 'admin123', nombre: 'Administrador', role: 'admin' },
  { username: 'usuario', password: 'usuario123', nombre: 'Empleado', role: 'viewer' }
];

export const findUser = (username: string, password: string) => {
  return demoUsers.find(
    (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password
  );
};
