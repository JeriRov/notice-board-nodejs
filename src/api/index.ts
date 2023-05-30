import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import notices from './notice/notices.routes';
import auth from './auth/auth.routes';
import categories from './categories/categories.routes';
import cities from './cities/cities.routes';
import users from './users/users.routes';
const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - Notice Board',
  });
});

router.use('/notices', notices);
router.use('/cities', cities);
router.use('/categories', categories);
router.use('/auth', auth);
router.use('/users', users);
export default router;
