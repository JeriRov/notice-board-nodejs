import { Router } from 'express';
import * as CitiesHandlers  from './cities.handlers';
import { validateRequest } from '../../middlewares';
import { CitiesModel } from './cities.model';

const router = Router();


router.get('/names/:objectName',  validateRequest({
  params: CitiesModel.pick({ objectName: true }),
}), CitiesHandlers.searchCities);

router.get('/names', CitiesHandlers.findAll);

export default router;
