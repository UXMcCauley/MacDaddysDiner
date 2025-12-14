import { ObjectId } from 'mongodb';

// Menu Types
export interface MenuItem {
  _id?: ObjectId;
  id: string;
  name: string;
  description?: string;
  price: number;
  popular?: boolean;
  featured?: boolean;
  available?: boolean;
}

export interface MenuCategory {
  _id?: ObjectId;
  id: string;
  name: string;
  description?: string;
  icon: string;
  order: number;
  items: MenuItem[];
}

export interface DailySpecial {
  _id?: ObjectId;
  day: string;
  name: string;
  description: string;
  price: number;
  active?: boolean;
}

export interface MenuData {
  _id?: ObjectId;
  lastUpdated: string;
  categories: MenuCategory[];
  specials: {
    daily: DailySpecial[];
  };
  notices: string[];
}

// Feedback Types
export interface Feedback {
  _id?: ObjectId;
  name: string;
  email: string;
  phone?: string;
  type: 'compliment' | 'complaint' | 'suggestion' | 'question' | 'other';
  message: string;
  rating?: number;
  visitDate?: string;
  createdAt: Date;
  read: boolean;
  replied: boolean;
  replyMessage?: string;
  repliedAt?: Date;
  archived: boolean;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
