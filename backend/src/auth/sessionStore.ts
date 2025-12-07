import crypto from 'crypto';

export type SessionUser = {
  username: string;
  nombre: string;
  role: 'admin' | 'viewer';
};

const sessions = new Map<string, SessionUser>();

export const createSession = (user: SessionUser) => {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, user);
  return token;
};

export const getSession = (token: string) => sessions.get(token);

export const deleteSession = (token: string) => sessions.delete(token);
