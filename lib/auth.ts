import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import connectDB from './mongodb';
import User from './models/User';

const resolvedJwtSecret = process.env.JWT_SECRET;
if (!resolvedJwtSecret) {
  console.warn('[auth] JWT_SECRET is not set. Set it in your environment for security.');
}
const secret = new TextEncoder().encode(resolvedJwtSecret ?? '');

export async function createToken(user: any) {
  return await new SignJWT({ 
    userId: user._id, 
    email: user.email, 
    name: user.name,
    role: user.role 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    console.log('Token from request:', token ? 'Present' : 'Missing');
    
    if (!token) return null;

    const payload = await verifyToken(token);
    console.log('Token payload:', payload);
    
    if (!payload) return null;

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    console.log('User found:', user ? user.name : 'Not found');
    return user;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

export async function getUserFromToken(token: string) {
  try {
    const payload = await verifyToken(token);
    if (!payload) return null;

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}
