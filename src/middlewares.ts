import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import ErrorResponse from './interfaces/ErrorResponse';
import RequestValidators from './interfaces/RequestValidators';
import jwt, { Secret } from 'jsonwebtoken';

export function validateRequest(validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422);
      }
      console.log(error);
      next(error);
    }
  };
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  });
  next();
}

export function decodeToken(req: Request) {
  const tokenFetch = req.headers.authorization;
  const token = tokenFetch ? tokenFetch.split(' ')[1] : '';
  let decodedToken: string | jwt.JwtPayload | undefined = '';
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err, decoded) => {
    if (err) {
      throw new Error('Invalid token');
    }
    decodedToken = (decoded as { userId: string }).userId;
  });
  return decodedToken;
}

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const decoded = decodeToken(req);
  if (req.body.userId !== decoded) {
    res.status(403);
    next("You don't have access to do this.");
  }
  next();
}

