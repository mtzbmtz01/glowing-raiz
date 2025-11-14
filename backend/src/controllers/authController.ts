import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput, AppleAuthInput, GoogleAuthInput } from '../types';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName, age, gender, orientation }: RegisterInput = req.body;

    // Validate input
    if (!email || !password || !displayName || !age || !gender || !orientation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        authProvider: 'EMAIL',
        profile: {
          create: {
            displayName,
            age,
            gender: gender as any,
            orientation: orientation as any,
            interests: [],
          },
        },
      },
      include: {
        profile: {
          include: {
            photos: true,
          },
        },
      },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginInput = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          include: {
            photos: true,
          },
        },
      },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
};

export const appleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken, user: appleUser }: AppleAuthInput = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Apple ID token required' });
    }

    // TODO: Verify Apple ID token with Apple's servers
    // This is a placeholder - implement proper Apple Sign In verification
    // using apple-signin-auth or similar library

    // For now, extract email from the token (should be verified)
    const email = appleUser?.email || 'apple-user@placeholder.com';
    const appleId = idToken; // Should be extracted from verified token

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { appleId },
          { email },
        ],
      },
      include: {
        profile: {
          include: {
            photos: true,
          },
        },
      },
    });

    if (!user) {
      // Create new user
      const displayName = appleUser?.name
        ? `${appleUser.name.firstName} ${appleUser.name.lastName}`
        : 'Apple User';

      user = await prisma.user.create({
        data: {
          email,
          appleId,
          authProvider: 'APPLE',
          profile: {
            create: {
              displayName,
              age: 18, // Default, user should update
              gender: 'OTHER',
              orientation: 'OTHER',
              interests: [],
            },
          },
        },
        include: {
          profile: {
            include: {
              photos: true,
            },
          },
        },
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Apple auth error:', error);
    return res.status(500).json({ error: 'Apple authentication failed' });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken }: GoogleAuthInput = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token required' });
    }

    // TODO: Verify Google ID token with Google's servers
    // This is a placeholder - implement proper Google Sign In verification
    // using google-auth-library

    // For now, this is a placeholder
    const email = 'google-user@placeholder.com';
    const googleId = idToken; // Should be extracted from verified token

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email },
        ],
      },
      include: {
        profile: {
          include: {
            photos: true,
          },
        },
      },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          authProvider: 'GOOGLE',
          profile: {
            create: {
              displayName: 'Google User',
              age: 18, // Default, user should update
              gender: 'OTHER',
              orientation: 'OTHER',
              interests: [],
            },
          },
        },
        include: {
          profile: {
            include: {
              photos: true,
            },
          },
        },
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ error: 'Google authentication failed' });
  }
};
