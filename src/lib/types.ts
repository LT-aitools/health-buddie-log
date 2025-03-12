
export type MessageType = 'incoming' | 'outgoing';
export type HealthCategory = 'exercise' | 'food';
export type MessageChannel = 'whatsapp' | 'imessage' | 'voice' | 'sms' | 'twilio-whatsapp';

export interface HealthLog {
  id: string;
  timestamp: Date;
  rawMessage: string;
  category: HealthCategory;
  processed: {
    exercise?: {
      duration?: number; // minutes
      distance?: number; // miles/km
      type?: string; // running, walking, etc.
    };
    food?: {
      description: string;
    };
  };
  confidence: number;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  type: MessageType;
  channel: MessageChannel;
  confidence?: number;
  processed?: boolean;
  phoneNumber?: string; // Add phone number for Twilio messages
}

export interface CareTemplate {
  id: string;
  name: string;
  category: HealthCategory;
  frequency: string; // e.g., "3 times a week"
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

export interface TwilioAccount {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  isSetup: boolean;
}
