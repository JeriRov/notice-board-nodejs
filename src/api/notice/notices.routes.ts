import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import {authenticateToken, authenticateUser, validateRequest} from '../../middlewares';
import * as NoticeHandlers from './notices.handlers';
import { NoticesModel } from './notices.model';

const router = Router();

router.get('/', NoticeHandlers.findAll);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  NoticeHandlers.findOne,
);

router.post(
  '/',
  [validateRequest({
    body: NoticesModel,
  }), authenticateToken],
  NoticeHandlers.createOne,
);

router.put(
  '/:id',
  [validateRequest({
    params: ParamsWithId,
    body: NoticesModel,
  }), authenticateToken, authenticateUser],
  NoticeHandlers.updateOne,
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  NoticeHandlers.deleteOne,
);

export default router;
