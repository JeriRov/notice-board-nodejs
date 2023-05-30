import { NextFunction, Request, Response } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { ObjectId } from 'mongodb';
import { User, Users, UserWithId } from './users.model';
import { Cities, City } from '../cities/cities.model';


export async function findOne(req: Request<ParamsWithId, UserWithId, {}>, res: Response<UserWithId>, next: NextFunction) {
  try {
    const result = await Users.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      next(`Notice with id "${req.params.id}" not found.`);
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function findUserCity(req: Request<User, City, {}>, res: Response<City>, next: NextFunction) {
  try {
    const result = await Cities.findOne({
      _id: new ObjectId(req.params.cityId),
    });
    if (!result) {
      res.status(404);
      next(`City with id "${req.params.cityId}" not found.`);
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}
