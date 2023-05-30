import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';
import { ItemsModel } from '../items/items.model';
import { DEFAULT_NOTICE_PHOTO } from '../../constants/defaults';

export const NoticesModel = z.object({
  title: z.string().min(3),
  description: z.string(),
  dateAdded: z.string().default(() => Date.now().toString()),
  item: ItemsModel,
  userId: z.string(),
  city: z.string(),
  photos: z.array(z.string()).default([DEFAULT_NOTICE_PHOTO]),
  featured: z.boolean().default(false),
});
export type Notice = z.infer<typeof NoticesModel>;
export type NoticeWithId = WithId<Notice>;
export const Notices = db.collection<Notice>('notices');
export const QuerySchema = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  offset: z.string().optional(),
  limit: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  search: z.string().optional(),
});
