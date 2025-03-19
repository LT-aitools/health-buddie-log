// src/lib/types.ts

export type MessageType = 'incoming' | 'outgoing';
export type HealthCategory = 'exercise' | 'food';
export type MessageChannel = 'whatsapp' | 'imessage' | 'voice' | 'sms' | 'twilio-whatsapp';

export interface HealthLog {
  id: string;
  timestamp: Date;
  rawMessage: string;
  category: HealthCategory;
  confidence: number;
  processed: {
    exercise?: {
      duration?: number; 
      distance?: number;
      type?: string;
    };
    food?: {
      description?: string;
    };
  };
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  type: MessageType;
  channel: MessageChannel;
  confidence?: number;
  processed?: boolean;
  processed_data?: {
    exercise?: {
      duration?: number;
      type?: string;
      distance?: string;
    };
    food?: {
      description?: string;
    }
  };
  category?: HealthCategory;
}

export interface CareTemplate {
  id: string;
  name: string;
  category: HealthCategory;
  frequency: string;
  active: boolean;
}

export interface WeeklySummary {
  exerciseCount: number;
  averageExerciseDuration: number;
  exerciseTypes: { [key: string]: number };
  foodLogCount: number;
  startDate: Date;
  endDate: Date;
}

export interface PDFReportOptions {
  startDate: Date;
  endDate: Date;
  includeRawMessages: boolean;
}

export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  createdAt: Date;
  lastActive: Date;
  verified: boolean;
}