export interface User {
  id: string;
  email: string;
  createdAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  birthDate: string;
  gender: string;
  interestedIn: string;
  photos: string[];
  latitude: number;
  longitude: number;
  location?: string;
  minAge: number;
  maxAge: number;
  maxDistance: number;
  isActive: boolean;
  lastActive: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
}

export interface Conversation {
  user: User;
  lastMessage: Message;
}

export interface NearbyUser extends User {
  distance: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
