import { Router } from 'express';
import * as CategoryHandlers  from './categories.handlers';

const router = Router();


router.get('/', CategoryHandlers.findAll);

export default router;
