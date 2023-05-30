import { Response, Request, NextFunction } from 'express';
import { Filter, ObjectId } from 'mongodb';

import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { Notice, Notices, NoticeWithId, QuerySchema } from './notices.model';
import { Users } from '../users/users.model';
import { Cities } from '../cities/cities.model';

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const query = QuerySchema.parse(req.query);
    const offset = parseInt(query.offset || '0');
    const limit = parseInt(query.limit || '10');

    const dbQuery: Filter<Notice> = {
      'item.price': {
        $gte: !!query.minPrice ? parseInt(query.minPrice) : 0,
        $lte: !!query.maxPrice ? parseInt(query.maxPrice) : Infinity,
      },
    };

    if (query.search) {
      dbQuery.title = {
        $regex: query.search,
        $options: 'i',
      };
    }

    if (query.category) {
      dbQuery['item.category.name'] = query.category;
    }

    if (query.city) {
      dbQuery.city = query.city;
    }
    const notices = await Notices.find(dbQuery).skip(offset).sort({ dateAdded: -1 }).limit(limit).toArray();
    const noticesCount = await Notices.countDocuments(dbQuery);
    res.json({
      notices: [...notices],
      noticesCount,
    });
  } catch (error) {
    next(error);
  }
}
export async function createOne(req: Request<{}, NoticeWithId, Notice>, res: Response<NoticeWithId>, next: NextFunction) {
  try {
    console.log(req.body);
    const insertResult = await Notices.insertOne(req.body);
    if (!insertResult.acknowledged) next('Error inserting notice.');
    const city = await Cities.findOne({ objectName: req.body.city.toUpperCase() });
    if (city) {
      const updateUser = await Users.updateOne({ _id: new ObjectId(req.body.userId) }, {
        $set: {
          cityId: city?._id.toString(),
        },
      });
      if (!updateUser.acknowledged) next('Error updating user.');
    }
    res.status(201);
    res.json({
      _id: insertResult.insertedId,
      ...req.body,
    });
  } catch (error) {
    next(error);
  }
}

export async function findOne(req: Request<ParamsWithId, NoticeWithId, {}>, res: Response<NoticeWithId>, next: NextFunction) {
  try {
    const result = await Notices.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      next(`Notice with id "${req.params.id}" not found.`);
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}
export async function updateOne(req: Request<ParamsWithId, NoticeWithId, Notice>, res: Response<NoticeWithId>, next: NextFunction) {
  try {
    const result = await Notices.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    if (!result.value) {
      res.status(404);
      next(`Notice with id "${req.params.id}" not found.`);
      return;
    }
    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    const result = await Notices.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (!result.value) {
      res.status(404);
      next(`Notice with id "${req.params.id}" not found.`);
      return;
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
