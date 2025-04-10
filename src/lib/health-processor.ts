import { HealthCategory, HealthLog, Message } from './types';

// Simple NLP-like processing to extract information from health messages
export function processHealthMessage(message: string): { 
  category: HealthCategory | null;
  processed: any;
  confidence: number;
} {
  message = message.toLowerCase();
  let category: HealthCategory | null = null;
  let processed: any = {};
  let confidence = 0.7; // Default confidence

  // Check for "status" command
  if (message.trim() === 'status') {
    return { category: null, processed: { isStatusRequest: true }, confidence: 1.0 };
  }

  // Process exercise logs
  const exerciseKeywords = ['walk', 'run', 'jog', 'yoga', 'gym', 'workout', 'exercise', 'swim', 'hike', 'bike', 'cycling', 'pilates', 'class'];
  const exerciseMatch = exerciseKeywords.some(keyword => message.includes(keyword));
  
  if (exerciseMatch) {
    category = 'exercise';
    processed.exercise = {};
    
    // Extract duration
    const durationMatch = message.match(/(\d+)\s*(min|minute|minutes|hour|hours|hr|hrs)/);
    if (durationMatch) {
      let duration = parseInt(durationMatch[1]);
      if (durationMatch[2].startsWith('hour') || durationMatch[2].startsWith('hr')) {
        duration *= 60; // Convert hours to minutes
      }
      processed.exercise.duration = duration;
      confidence += 0.1;
    }
    
    // Extract distance
    const distanceMatch = message.match(/(\d+(?:\.\d+)?)\s*(mile|miles|km|kilometer|kilometers)/);
    if (distanceMatch) {
      processed.exercise.distance = parseFloat(distanceMatch[1]);
      confidence += 0.05;
    }
    
    // Extract exercise type with improved logic
    if (message.includes('pilates')) {
      processed.exercise.type = 'pilates';
      confidence += 0.1; // Higher confidence for specific exercise types
    } else if (message.includes('yoga')) {
      processed.exercise.type = 'yoga';
      confidence += 0.1;
    } else if (message.includes('run') || message.includes('jog')) {
      processed.exercise.type = 'running';
      confidence += 0.1;
    } else if (message.includes('walk') || message.includes('hike')) {
      processed.exercise.type = 'walking';
      confidence += 0.1;
    } else if (message.includes('swim')) {
      processed.exercise.type = 'swimming';
      confidence += 0.1;
    } else if (message.includes('bike') || message.includes('cycling')) {
      processed.exercise.type = 'cycling';
      confidence += 0.1;
    } else {
      // Default to first matching keyword
      for (const keyword of exerciseKeywords) {
        if (message.includes(keyword)) {
          processed.exercise.type = keyword;
          break;
        }
      }
    }
  }
  
  // Process food logs
  const foodKeywords = ['eat', 'ate', 'food', 'meal', 'breakfast', 'lunch', 'dinner', 'snack'];
  const foodMatch = foodKeywords.some(keyword => message.includes(keyword));
  
  if (foodMatch) {
    category = 'food';
    processed.food = {};
    
    // Extract food description - simplistic approach
    let description = message;
    for (const keyword of foodKeywords) {
      const regex = new RegExp(`(${keyword})(ed)?\\s+`, 'i');
      description = description.replace(regex, '');
    }
    
    description = description
      .replace(/^(i|had|have|was|my|for)(\s+)/i, '')
      .replace(/^(some|a|an)(\s+)/i, '');
    
    processed.food.description = description.trim();
    confidence += 0.1;
  }
  
  // Cap confidence at 0.98 (leaving room for human verification if needed)
  confidence = Math.min(confidence, 0.98);
  
  return { category, processed, confidence };
}

// Convert a message to a health log
export function messageToHealthLog(message: Message): HealthLog | null {
  if (message.type !== 'incoming') return null;
  
  const { category, processed, confidence } = processHealthMessage(message.content);
  
  if (!category) return null; // Not a health log or status request
  
  return {
    id: message.id,
    timestamp: new Date(message.timestamp),
    rawMessage: message.content,
    category,
    processed,
    confidence,
  };
}

// Generate a response to a health log
export function generateResponse(healthLog: HealthLog | null, isStatusRequest: boolean = false): string {
  if (isStatusRequest) {
    return "Generating your weekly health report. A PDF will be sent to you shortly.";
  }
  
  if (!healthLog) {
    return "I'm not sure I understood that. Could you please clarify if you're logging exercise or food?";
  }
  
  if (healthLog.confidence < 0.75) {
    console.warn(`Low confidence (${healthLog.confidence}) for message: ${healthLog.rawMessage}`);
    // You might want to handle low confidence cases differently
  }
  
  if (healthLog.category === 'exercise') {
    const { duration, type, distance } = healthLog.processed.exercise || {};
    let response = `Your exercise has been logged. `;
    
    if (duration) {
      response += `Great job on your ${duration}-minute `;
    } else {
      response += `Great job on your `;
    }
    
    if (type) {
      response += `${type}`;
    } else {
      response += `workout`;
    }
    
    if (distance) {
      response += ` covering ${distance} ${distance === 1 ? 'mile' : 'miles'}`;
    }
    
    response += '!';
    return response;
  }
  
  if (healthLog.category === 'food') {
    const { description } = healthLog.processed.food || {};
    let response = `Your meal has been logged. `;
    
    if (description) {
      // Capitalize first letter of description
      const formattedDescription = description.charAt(0).toUpperCase() + description.slice(1);
      response += `${formattedDescription} sounds nutritious!`;
    } else {
      response += `Thank you for the update!`;
    }
    
    return response;
  }
  
  return "Your health update has been logged. Thank you!";
}
