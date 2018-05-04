import jwt from 'jsonwebtoken';
import 'dotenv/config';

const cert = process.env.CERT;

export const issueToken = async(data) =>
  await jwt.sign(data, cert, { expiresIn: '1d' });

export const verifyToken = async(token) =>
  await jwt.verify(token, cert);

export const extractAuthenticatedUser = async(req, res, next) => {
  const token = req.get('Authorization');
  // console.log(token);

  if (!token)
    return next();

  const { id } = await verifyToken(token);
  // console.log(id);
  req.authUserId = id;

  return next();
};
