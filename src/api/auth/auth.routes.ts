import { Router } from 'express';

import { validateRequest } from '../../middlewares';
import { UsersModel } from '../users/users.model';
import * as AuthHandlers  from './auth.handlers';

const router = Router();

router.post('/register', validateRequest({
  body: UsersModel,
}), AuthHandlers.registration);

router.post('/login', validateRequest({
  body: UsersModel.pick({ phoneNumber: true, password: true, email: true }).partial(),
}), AuthHandlers.login);

export default router;
