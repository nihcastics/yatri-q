// Modular adapters for YATRI-Q - Easy backend integration
// These will be connected to FastAPI endpoints later

import { 
  mockTrains, 
  mockStations, 
  mockBookings, 
  mockRoundTripBundles, 
  mockTrackingData, 
  mockChatSuggestions 
} from './mock.js';

// Schedules Adapter
export class SchedulesAdapter {
  static async searchTrains({ from, to, date, class: trainClass, quota, passengers, options = {} }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter and transform mock data based on search params
    return mockTrains.map(train => ({
      ...train,
      searchRelevance: Math.random() * 100
    })).sort((a, b) => b.searchRelevance - a.searchRelevance);
  }
}

// Seat Prediction Adapter  
export class SeatAdapter {
  static async predictSeat({ trainNo, date, class: trainClass, quota }) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const train = mockTrains.find(t => t.trainNo === trainNo);
    return train ? train.seatPrediction : {
      probability: Math.floor(Math.random() * 100),
      band: Math.random() > 0.5 ? "likely" : "uncertain",
      insights: ["Moderate availability for this route", "Consider flexible dates"]
    };
  }
}

// Tatkal Prediction Adapter
export class TatkalAdapter {
  static async predictTatkal({ trainNo, date, class: trainClass }) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const train = mockTrains.find(t => t.trainNo === trainNo);
    return train ? train.tatkalPrediction : {
      bestWindows: [{ start: "10:00", end: "10:02" }],
      note: "Standard tatkal timing"
    };
  }
}

// Sentiment Analysis Adapter
export class SentimentAdapter {
  static async getSentiment({ trainNo, windowDays = 7 }) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const train = mockTrains.find(t => t.trainNo === trainNo);
    return train ? train.sentiment : {
      tag: "neutral",
      reason: "Limited recent feedback",
      snippets: ["Average service", "Standard amenities"]
    };
  }
}

// Live Tracking Adapter
export class TrackingAdapter {
  static async track({ trainNo, date, pnr = null }) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock tracking data with some randomization
    return {
      ...mockTrackingData,
      trainNo,
      delayMin: Math.floor(Math.random() * 30),
      currentIndex: Math.floor(Math.random() * mockTrackingData.path.length)
    };
  }
}

// Bookings Adapter
export class BookingsAdapter {
  static async getRecent() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBookings;
  }
  
  static async saveDraft(plan) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { id: Date.now(), ...plan, saved: true };
  }
  
  static async getPNRStatus({ pnr }) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const booking = mockBookings.find(b => b.pnr === pnr);
    return booking || { pnr, status: "Not found", error: true };
  }
}

// Authentication Adapter
export class AuthAdapter {
  static async loginPassword({ email, password }) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { 
      user: { id: "user1", name: "Travel Enthusiast", email }, 
      token: "mock-jwt-token"
    };
  }
  
  static async loginOTP({ mobile, otp }) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { 
      user: { id: "user1", name: "Travel Enthusiast", mobile }, 
      token: "mock-jwt-token" 
    };
  }
  
  static async logout() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  }
  
  static async me() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { 
      id: "user1", 
      name: "Travel Enthusiast", 
      email: "user@example.com",
      preferences: { notifications: true, theme: "light" }
    };
  }
}

// AI Chatbot Adapter (using Emergent LLM)
export class ChatbotAdapter {
  static async chat({ prompt, context = {} }) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock structured response for different query types
    if (prompt.toLowerCase().includes('fastest')) {
      return {
        type: 'search_suggestion',
        message: "I found the fastest options for you:",
        suggestions: {
          from: context.from || "NDLS",
          to: context.to || "CSTM", 
          class: "3A",
          quota: "GENERAL",
          sortBy: "duration"
        }
      };
    }
    
    if (prompt.toLowerCase().includes('cheapest')) {
      return {
        type: 'search_suggestion',
        message: "Here are the most economical options:",
        suggestions: {
          from: context.from || "NDLS",
          to: context.to || "BPL",
          class: "SL", 
          quota: "GENERAL",
          sortBy: "fare"
        }
      };
    }
    
    if (prompt.toLowerCase().includes('pnr') || prompt.match(/\d{10}/)) {
      const pnrMatch = prompt.match(/\d{10}/);
      if (pnrMatch) {
        return {
          type: 'pnr_status',
          message: `Let me check PNR ${pnrMatch[0]} for you:`,
          pnr: pnrMatch[0]
        };
      }
    }
    
    return {
      type: 'general',
      message: "I can help you find trains, check PNR status, plan round trips, and track live locations. What would you like to do?",
      suggestions: mockChatSuggestions.slice(0, 3)
    };
  }
  
  static getSuggestions() {
    return mockChatSuggestions;
  }
}