import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

export const CharacteristicsModel = z.object({
  name: z.string(),
  type: z.string(),
  value: z.string().optional(),
});
export type Characteristic = z.infer<typeof CharacteristicsModel>;
export type CharacteristicWithId = WithId<Characteristic>;
export const Characteristics = db.collection<Characteristic>('characteristics');
