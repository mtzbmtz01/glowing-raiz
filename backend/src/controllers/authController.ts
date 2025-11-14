import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  age: z.number().min(18).max(100),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  orientation: z.enum(['STRAIGHT', 'GAY', 'LESBIAN', 'BISEXUAL', 'OTHER']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        authProvider: 'EMAIL',
        profile: {
          create: {
            name: validatedData.name,
            age: validatedData.age,
            gender: validatedData.gender,
            orientation: validatedData.orientation,
            photos: [],
            interests: [],
            preferredGender: validatedData.gender === 'MALE' ? ['FEMALE'] : ['MALE'],
          },
        },
      },
      include: {
        profile: true,
      },
    });
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    
    // Remove password from response
    const { password: _password, ...userWithoutPassword } = user;
    
    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        profile: true,
      },
    });
    
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await comparePassword(
      validatedData.password,
      user.password
    );
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if user is suspended
    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Account suspended' });
    }
    
    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    
    // Remove password from response
    const { password: _password2, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        profile: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password: _password3, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
