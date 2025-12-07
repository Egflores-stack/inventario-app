import { NextFunction, Request, Response } from 'express';
import { deleteSession, getSession, SessionUser } from './sessionStore';

export type RequestWithUser = Request & { user?: SessionUser; token?: string };

const extractToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '').trim();
};

export const authenticate = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación requerido' });
  }

  const session = getSession(token);
  if (!session) {
    return res.status(401).json({ message: 'Sesión no válida o expirada' });
  }

  req.user = session;
  req.token = token;
  next();
};

export const requireRole = (role: 'admin') => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Sesión no válida' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    next();
  };
};

export const invalidateSession = (req: RequestWithUser) => {
  if (req.token) {
    deleteSession(req.token);
  }
};
