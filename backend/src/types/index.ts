import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
  age: number;
  gender: string;
  orientation: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AppleAuthInput {
  idToken: string;
  user?: {
    email: string;
    name?: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface GoogleAuthInput {
  idToken: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  bio?: string;
  age?: number;
  gender?: string;
  orientation?: string;
  interests?: string[];
  searchRadius?: number;
  minAge?: number;
  maxAge?: number;
  genderPreference?: string[];
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
}

export interface NearbyUsersQuery {
  latitude: number;
  longitude: number;
  radius: number; // in miles
  minAge?: number;
  maxAge?: number;
  gender?: string[];
  limit?: number;
  offset?: number;
}

export interface SendMessageInput {
  receiverId: string;
  content: string;
}

export interface TypingIndicator {
  senderId: string;
  receiverId: string;
  isTyping: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  profile: {
    displayName: string;
    bio: string | null;
    age: number;
    gender: string;
    orientation: string;
    interests: string[];
    photos: {
      id: string;
      url: string;
      order: number;
      isProfile: boolean;
    }[];
  } | null;
  distance?: number; // in miles
}
