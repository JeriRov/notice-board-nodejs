import * as z from 'zod';
import { WithId } from 'mongodb';
import { db } from '../../db';

export const CitiesModel = z.object({
  objectName: z.string(),
  objectCode: z.string(),
  objectCategory: z.string(),
  community: z.string(),
  region: z.string(),
});
export type City = z.infer<typeof CitiesModel>;
export type CityWithId = WithId<City>;
export const Cities = db.collection<City>('cities');
