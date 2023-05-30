import * as z from 'zod';
import { WithId } from 'mongodb';
import { db } from '../../db';
import { CategoriesModel } from '../categories/categories.model';

export const ItemsModel = z.object({
  category: CategoriesModel,
  price: z.number(),
});
export type Item = z.infer<typeof ItemsModel>;
export type ItemWithId = WithId<Item>;
export const Items = db.collection<Item>('items');
