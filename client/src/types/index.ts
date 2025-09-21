export interface Poll {
  id: string;
  question: string;
  options: string[];
  timeLimit: number;
  responses: Map<string, string>;
  isActive: boolean;
  startTime: number | null;
  teacherSocketId: string | null;
}

export interface PollResults {
  question: string;
  options: string[];
  results: { [key: string]: number };
  totalResponses: number;
  timeRemaining: number;
}

export interface StudentSession {
  pollId: string;
  studentName: string;
}

export interface AppState {
  currentPoll: Poll | null;
  pollResults: PollResults | null;
  studentName: string | null;
  isTeacher: boolean;
  pollId: string | null;
  connectedStudents: string[];
  chatMessages: ChatMessage[];
  showChat: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: number;
  isTeacher: boolean;
}

export interface CreatePollData {
  question: string;
  options: string[];
  timeLimit?: number;
}