import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';
import { CharacteristicsModel } from '../characteristics/characteristics.model';

export const CategoriesModel = z.object({
  name: z.string(),
  characteristics: CharacteristicsModel.array().default([]),
});
export type Category = z.infer<typeof CategoriesModel>;
export type CategoryWithId = WithId<Category>;
export const Categories = db.collection<Category>('categories');



