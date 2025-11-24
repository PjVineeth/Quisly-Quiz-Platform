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
  const userId = normalizeId(user?._id);

  if (!userId) {
    throw new Error('Unable to determine user id while creating token');
  }

  return await new SignJWT({ 
    userId, 
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

    const userId = normalizeId((payload as Record<string, unknown>).userId);
    if (!userId) {
      console.error('Token payload is missing a valid user id');
      return null;
    }

    await connectDB();
    const user = await User.findById(userId).select('-password');
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

    const userId = normalizeId((payload as Record<string, unknown>).userId);
    if (!userId) {
      console.error('Token payload is missing a valid user id');
      return null;
    }

    await connectDB();
    const user = await User.findById(userId).select('-password');
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

function normalizeId(raw: unknown): string | null {
  if (!raw) return null;

  if (typeof raw === 'string') {
    return raw;
  }

  if (typeof raw === 'number') {
    return raw.toString();
  }

  if (typeof raw === 'object') {
    const value = raw as Record<string, unknown>;

    const hexFn = (value as { toHexString?: () => string }).toHexString;
    if (typeof hexFn === 'function') {
      const hexValue = hexFn.call(value);
      if (hexValue) return hexValue;
    }

    if (value.$oid && typeof value.$oid === 'string') {
      return value.$oid;
    }

    if (value._id) {
      const id = normalizeId(value._id);
      if (id) return id;
    }

    const toStringFn = (value as { toString?: () => string }).toString;
    if (typeof toStringFn === 'function') {
      const str = toStringFn.call(value);
      if (str && str !== '[object Object]') {
        return str;
      }
    }

    const bufferCandidate =
      'buffer' in value
        ? (value as { buffer?: unknown }).buffer
        : (value as { data?: unknown }).data;

    if (bufferCandidate) {
      const bytes = bufferLikeToBytes(bufferCandidate);

      if (bytes?.length) {
        return Buffer.from(bytes).toString('hex');
      }
    }
  }

  return null;
}

function bufferLikeToBytes(bufferLike: unknown): number[] | null {
  if (!bufferLike) return null;

  if (Array.isArray(bufferLike)) {
    return bufferLike.every((val) => typeof val === 'number') ? bufferLike : null;
  }

  if (typeof bufferLike === 'object') {
    const record = bufferLike as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return record.data.every((val) => typeof val === 'number')
        ? (record.data as number[])
        : null;
    }

    const entries = Object.keys(record)
      .map((key) => {
        const index = Number(key);
        const value = record[key];
        return { index, value };
      })
      .filter(({ index, value }) => !Number.isNaN(index) && typeof value === 'number')
      .sort((a, b) => a.index - b.index)
      .map(({ value }) => value as number);

    return entries.length ? entries : null;
  }

  return null;
}
