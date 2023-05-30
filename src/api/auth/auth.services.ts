import { ObjectId } from 'mongodb';
import jwt, { Secret } from 'jsonwebtoken';

export function createTokens(id: ObjectId) {
  const accessToken = jwt.sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '40d' });
  return {
    accessToken,
  };
}
