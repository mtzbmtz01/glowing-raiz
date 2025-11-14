export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Orientation {
  STRAIGHT = 'STRAIGHT',
  GAY = 'GAY',
  LESBIAN = 'LESBIAN',
  BISEXUAL = 'BISEXUAL',
  OTHER = 'OTHER',
}

export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum ReportReason {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  HARASSMENT = 'HARASSMENT',
  SPAM = 'SPAM',
  FAKE_PROFILE = 'FAKE_PROFILE',
  UNDERAGE = 'UNDERAGE',
  OTHER = 'OTHER',
}

export interface User {
  id: string;
  email: string;
  authProvider: AuthProvider;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  age: number;
  gender: Gender;
  orientation: Orientation;
  photos: string[];
  interests: string[];
  latitude?: number;
  longitude?: number;
  locationUpdatedAt?: Date;
  preferredGender: Gender[];
  preferredMinAge: number;
  preferredMaxAge: number;
  preferredMaxDistance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  seen: boolean;
  seenAt?: Date;
  createdAt: Date;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: ReportReason;
  description?: string;
  resolved: boolean;
  createdAt: Date;
}

// API Request/Response types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: Gender;
  orientation: Orientation;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  age?: number;
  photos?: string[];
  interests?: string[];
  preferredGender?: Gender[];
  preferredMinAge?: number;
  preferredMaxAge?: number;
  preferredMaxDistance?: number;
}

export interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
}

export interface NearbyUsersRequest {
  latitude: number;
  longitude: number;
  maxDistance?: number;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
}

export interface ReportRequest {
  reportedId: string;
  reason: ReportReason;
  description?: string;
}

// Socket.IO events
export interface TypingEvent {
  userId: string;
  recipientId: string;
  isTyping: boolean;
}

export interface MessageSeenEvent {
  messageId: string;
  userId: string;
}

export interface NewMessageEvent {
  message: Message;
}
