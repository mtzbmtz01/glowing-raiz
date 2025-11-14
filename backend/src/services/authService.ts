import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { RegisterData, LoginData } from '../types';

const prisma = new PrismaClient();

export class AuthService {
  static async register(data: RegisterData) {
    const { email, password, name, birthDate, gender, interestedIn } = data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        authProvider: 'email',
        profile: {
          create: {
            name,
            birthDate: new Date(birthDate),
            gender,
            interestedIn,
            photos: [],
            latitude: 0, // User should update location
            longitude: 0,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '30d' }
    );
    
    return { user, token };
  }
  
  static async login(data: LoginData) {
    const { email, password } = data;
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    
    // Update last active
    if (user.profile) {
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: { lastActive: new Date() },
      });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '30d' }
    );
    
    return { user, token };
  }
  
  static async getUser(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }
}
