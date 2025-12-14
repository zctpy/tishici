export enum Sender {
  User = 'user',
  Model = 'model',
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
  isFinalOutput?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface GeminiConfig {
  temperature: number;
  topK: number;
  topP: number;
}
