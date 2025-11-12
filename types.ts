export type Role = 'user' | 'bot';

export interface Source {
  uri: string;
  title: string;
}

// Represents the structure of grounding chunks from the Gemini API response.
export interface GroundingChunk {
  web?: Source;
  maps?: Source;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  sources?: GroundingChunk[];
}
