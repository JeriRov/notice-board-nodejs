import { Response, Request, NextFunction } from 'express';
import { User, Users, UsersModel } from '../users/users.model';
import bcrypt from 'bcrypt';
import { createTokens } from './auth.services';

export async function login(req: Request<{}, {}, User>, res: Response, next: NextFunction) {
  try {
    const { email, phoneNumber, password } = req.body;
    const user = await Users.findOne({ phoneNumber }) || email && await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid login or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid login or password' });
    }
    const { accessToken } = createTokens(user._id);
    res.json({
      accessToken,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      cityId: user.cityId,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      id: user._id,
    });
  } catch (error) {
    next(error);
  }
}

export async function registration(req: Request<{}, {}, User>, res: Response, next: NextFunction) {
  try {
    const user = UsersModel.parse(req.body);
    const existingUser = await Users.findOne({ phoneNumber: user.phoneNumber })
        || user.email && await Users.findOne({ email: user.email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone number already exists' });
    }
    const newSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, newSalt);
    user.salt = newSalt;
    user.password = hashedPassword;

    const insertResult = await Users.insertOne(user);
    if (!insertResult.acknowledged) {
      next('Error inserting user.');
      return;
    }

    const { accessToken } = createTokens(insertResult.insertedId);

    res.status(200).json({
      accessToken,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      cityId: user.cityId,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      id: insertResult.insertedId,
    });
  } catch (error) {
    next(error);
  }
}


