const API_URL = 'https://functions.poehali.dev/b00e5331-2fb0-4712-a39d-b582f892e78a';

export interface UserProfile {
  id: string;
  rating: number;
  totalChats: number;
  blockedUntil: string | null;
}

export interface ChatMessage {
  id: number;
  sender_id: string;
  text: string;
  timestamp: string;
}

export interface MatchResult {
  matched: boolean;
  session_id?: string;
  partner_id?: string;
  waiting?: boolean;
}

export const chatApi = {
  async registerUser(userId: string): Promise<UserProfile> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        user_id: userId,
      }),
    });
    return response.json();
  },

  async findMatch(userId: string, genderPreference: string, userGender: string): Promise<MatchResult> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'find_match',
        user_id: userId,
        gender_preference: genderPreference,
        user_gender: userGender,
      }),
    });
    return response.json();
  },

  async sendMessage(sessionId: string, senderId: string, message: string): Promise<any> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_message',
        session_id: sessionId,
        sender_id: senderId,
        message: message,
      }),
    });
    return response.json();
  },

  async getMessages(sessionId: string, sinceId: number = 0): Promise<ChatMessage[]> {
    const response = await fetch(
      `${API_URL}?action=get_messages&session_id=${sessionId}&since_id=${sinceId}`
    );
    const data = await response.json();
    return data.messages;
  },

  async rateChat(sessionId: string, raterId: string, rating: number): Promise<any> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'rate',
        session_id: sessionId,
        rater_id: raterId,
        rating: rating,
      }),
    });
    return response.json();
  },

  async endSession(sessionId: string, userId: string): Promise<any> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'end_session',
        session_id: sessionId,
        user_id: userId,
      }),
    });
    return response.json();
  },

  async getProfile(userId: string): Promise<UserProfile> {
    const response = await fetch(`${API_URL}?action=get_profile&user_id=${userId}`);
    return response.json();
  },
};
