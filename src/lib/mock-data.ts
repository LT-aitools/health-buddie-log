
import { CareTemplate, HealthLog, Message, WeeklySummary } from './types';

// Helper function to get date X days ago
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Sample care templates
export const mockCareTemplates: CareTemplate[] = [
  {
    id: '1',
    name: 'Regular Exercise',
    category: 'exercise',
    frequency: '3 times a week',
    active: true,
  },
  {
    id: '2',
    name: 'Daily Food Tracking',
    category: 'food',
    frequency: 'once a day',
    active: true,
  },
];

// Sample health logs
export const mockHealthLogs: HealthLog[] = [
  {
    id: '1',
    timestamp: daysAgo(6),
    rawMessage: 'I went for a run this morning for 30 minutes',
    category: 'exercise',
    processed: {
      exercise: {
        duration: 30,
        type: 'running',
      },
    },
    confidence: 0.95,
  },
  {
    id: '2',
    timestamp: daysAgo(5),
    rawMessage: 'Had a salad with grilled chicken for lunch',
    category: 'food',
    processed: {
      food: {
        description: 'salad with grilled chicken',
      },
    },
    confidence: 0.92,
  },
  {
    id: '3',
    timestamp: daysAgo(4),
    rawMessage: 'Walked for 45 minutes in the park, about 2 miles',
    category: 'exercise',
    processed: {
      exercise: {
        duration: 45,
        type: 'walking',
        distance: 2,
      },
    },
    confidence: 0.89,
  },
  {
    id: '4',
    timestamp: daysAgo(3),
    rawMessage: 'Dinner was pasta with tomato sauce and a side salad',
    category: 'food',
    processed: {
      food: {
        description: 'pasta with tomato sauce and a side salad',
      },
    },
    confidence: 0.94,
  },
  {
    id: '5',
    timestamp: daysAgo(2),
    rawMessage: 'Did yoga for 60 minutes today',
    category: 'exercise',
    processed: {
      exercise: {
        duration: 60,
        type: 'yoga',
      },
    },
    confidence: 0.91,
  },
  {
    id: '6',
    timestamp: daysAgo(1),
    rawMessage: 'Breakfast was oatmeal with berries and honey',
    category: 'food',
    processed: {
      food: {
        description: 'oatmeal with berries and honey',
      },
    },
    confidence: 0.93,
  },
  {
    id: '7',
    timestamp: new Date(),
    rawMessage: 'Swam for 40 minutes at the local pool',
    category: 'exercise',
    processed: {
      exercise: {
        duration: 40,
        type: 'swimming',
      },
    },
    confidence: 0.90,
  },
];

// Sample messages
export const mockMessages: Message[] = [
  {
    id: '1',
    content: 'I went for a run this morning for 30 minutes',
    timestamp: daysAgo(6),
    type: 'incoming',
    channel: 'whatsapp',
    processed: true,
  },
  {
    id: '2',
    content: 'Your exercise has been logged. Great job on your 30-minute run!',
    timestamp: daysAgo(6),
    type: 'outgoing',
    channel: 'whatsapp',
  },
  {
    id: '3',
    content: 'Had a salad with grilled chicken for lunch',
    timestamp: daysAgo(5),
    type: 'incoming',
    channel: 'whatsapp',
    processed: true,
  },
  {
    id: '4',
    content: 'Your meal has been logged. Salad with grilled chicken sounds nutritious!',
    timestamp: daysAgo(5),
    type: 'outgoing',
    channel: 'whatsapp',
  },
  {
    id: '5',
    content: 'Walked for 45 minutes in the park, about 2 miles',
    timestamp: daysAgo(4),
    type: 'incoming',
    channel: 'imessage',
    processed: true,
  },
  {
    id: '6',
    content: 'Your 45-minute walk has been logged. Great job getting 2 miles in!',
    timestamp: daysAgo(4),
    type: 'outgoing',
    channel: 'imessage',
  },
  {
    id: '7',
    content: 'Dinner was pasta with tomato sauce and a side salad',
    timestamp: daysAgo(3),
    type: 'incoming',
    channel: 'whatsapp',
    processed: true,
  },
  {
    id: '8',
    content: 'Your dinner has been logged. Thank you for the update!',
    timestamp: daysAgo(3),
    type: 'outgoing',
    channel: 'whatsapp',
  },
  {
    id: '9',
    content: 'Did yoga for 60 minutes today',
    timestamp: daysAgo(2),
    type: 'incoming',
    channel: 'voice',
    confidence: 0.91,
    processed: true,
  },
  {
    id: '10',
    content: 'Your 60-minute yoga session has been logged. Great dedication!',
    timestamp: daysAgo(2),
    type: 'outgoing',
    channel: 'whatsapp',
  },
  {
    id: '11',
    content: 'Breakfast was oatmeal with berries and honey',
    timestamp: daysAgo(1),
    type: 'incoming',
    channel: 'imessage',
    processed: true,
  },
  {
    id: '12',
    content: 'Your breakfast has been logged. Oatmeal with berries is a great way to start the day!',
    timestamp: daysAgo(1),
    type: 'outgoing',
    channel: 'imessage',
  },
  {
    id: '13',
    content: 'Swam for 40 minutes at the local pool',
    timestamp: new Date(),
    type: 'incoming',
    channel: 'whatsapp',
    processed: true,
  },
  {
    id: '14',
    content: 'Your 40-minute swim has been logged. Excellent workout!',
    timestamp: new Date(),
    type: 'outgoing',
    channel: 'whatsapp',
  },
  {
    id: '15',
    content: 'status',
    timestamp: new Date(),
    type: 'incoming',
    channel: 'whatsapp',
  },
  {
    id: '16',
    content: 'Generating your weekly health report. A PDF will be sent to you shortly.',
    timestamp: new Date(),
    type: 'outgoing',
    channel: 'whatsapp',
  },
];

// Weekly summary
export const mockWeeklySummary: WeeklySummary = {
  exerciseCount: 4,
  averageExerciseDuration: 43.75, // (30 + 45 + 60 + 40) / 4
  exerciseTypes: {
    'running': 1,
    'walking': 1,
    'yoga': 1,
    'swimming': 1,
  },
  foodLogCount: 3,
  startDate: daysAgo(7),
  endDate: new Date(),
};
