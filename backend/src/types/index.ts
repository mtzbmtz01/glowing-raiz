import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface UserPayload {
  userId: string;
  email: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  gender: string;
  interestedIn: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  name?: string;
  bio?: string;
  birthDate?: string;
  gender?: string;
  interestedIn?: string;
  photos?: string[];
  latitude?: number;
  longitude?: number;
  location?: string;
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
}

export interface NearbyFilters {
  maxDistance?: number;
  minAge?: number;
  maxAge?: number;
  gender?: string;
}

export interface MessageData {
  receiverId: string;
  content: string;
}

export interface ReportData {
  reportedId: string;
  reason: string;
  details?: string;
}
