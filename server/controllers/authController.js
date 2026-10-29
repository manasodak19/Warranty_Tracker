import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function setAuthCookie(res, user) {
  const token = jwt.sign({}, process.env.JWT_SECRET, {
    subject: user.id,
    expiresIn: '7d',
  });
  res.cookie('warrantyToken', token, cookieOptions);
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== 'string' || !name.trim() || name.trim().length > 100 ||
      typeof email !== 'string' || !emailPattern.test(email.trim()) ||
      typeof password !== 'string' || password.length < 8 || password.length > 128
    ) {
      return res.status(400).json({
        message: 'Enter a name, a valid email address, and a password of 8 to 128 characters.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    setAuthCookie(res, user);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    setAuthCookie(res, user);
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'Your account is no longer available.' });
    }
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

export function logout(req, res) {
  res.clearCookie('warrantyToken', { ...cookieOptions, maxAge: undefined });
  return res.json({ message: 'You have been logged out.' });
}
