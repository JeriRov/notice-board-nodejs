import { NextFunction, Request, Response } from 'express';
import { Categories } from './categories.model';

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await Categories.find().toArray();

    res.json({ categories: [...categories] });
  } catch (error) {
    next(error);
  }
}
