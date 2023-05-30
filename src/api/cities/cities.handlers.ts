import { NextFunction, Request, Response } from 'express';
import { Cities, CitiesModel } from './cities.model';

export async function searchCities(req: Request, res: Response, next: NextFunction) {
  try {
    const { objectName } = CitiesModel.pick({ objectName: true }).parse(req.params);

    const regex = new RegExp(objectName.toUpperCase(), 'i');
    console.log(regex);
    const cities = await Cities.find({ objectName: { $regex: regex } }, { limit: 50 }).toArray();

    res.json({ cities: [...cities] });
  } catch (error) {
    next(error);
  }
}

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const cities = await Cities.find({}, { limit: 50 }).toArray();

    res.json({ cities: [...cities] });
  } catch (error) {
    next(error);
  }
}
