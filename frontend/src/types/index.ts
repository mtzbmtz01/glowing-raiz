export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER';
export type Orientation = 'STRAIGHT' | 'GAY' | 'LESBIAN' | 'BISEXUAL' | 'PANSEXUAL' | 'ASEXUAL' | 'OTHER';

export interface Photo {
  id: string;
  url: string;
  order: number;
  isProfile: boolean;
}

export interface Profile {
  id: string;
  displayName: string;
  bio: string | null;
  age: number;
  gender: Gender;
  orientation: Orientation;
  interests: string[];
  searchRadius: number;
  minAge: number;
  maxAge: number;
  genderPreference: Gender[];
  photos: Photo[];
}

export interface User {
  id: string;
  email: string;
  profile: Profile | null;
  lastActiveAt?: string;
  distance?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
  age: number;
  gender: Gender;
  orientation: Orientation;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}
