import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { validateRequest } from '../../middlewares';
import * as UserHandlers from './users.handlers';

const router = Router();

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  UserHandlers.findOne,
);

router.get(
  '/city/:cityId',
  UserHandlers.findUserCity,
);

export default router;
