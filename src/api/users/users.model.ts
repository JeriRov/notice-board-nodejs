import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';
import { DEFAULT_USER_AVATAR } from '../../constants/defaults';

export const UsersModel = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email().optional(),
  avatar: z.string().default(DEFAULT_USER_AVATAR),
  phoneNumber: z.string(),
  password: z.string().min(8),
  salt: z.string().nullable().default(null),
  cityId: z.string().optional(),
});

export type User = z.infer<typeof UsersModel>;
export type UserWithId = WithId<User>;
export const Users = db.collection<User>('users');
