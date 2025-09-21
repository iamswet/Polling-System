import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { setCurrentPoll, setPollResults, addChatMessage, clearPoll } from '../store/slices/pollSlice';
import { Poll, PollResults, CreatePollData, ChatMessage } from '../types';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io('http://localhost:5000');
    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('poll-created', (data: { pollId: string; poll: Poll }) => {
      store.dispatch(setCurrentPoll(data.poll));
      store.dispatch(setPollId(data.pollId));
    });

    this.socket.on('poll-started', (data: { pollId: string; poll: PollResults }) => {
      store.dispatch(setPollResults(data.poll));
    });

    this.socket.on('poll-joined', (data: { pollId: string; poll: PollResults }) => {
      store.dispatch(setPollResults(data.poll));
    });

    this.socket.on('poll-updated', (data: { pollId: string; results: PollResults }) => {
      store.dispatch(setPollResults(data.results));
    });

    this.socket.on('poll-ended', (data: { pollId: string; results: PollResults }) => {
      store.dispatch(setPollResults(data.results));
    });

    this.socket.on('poll-results', (data: { pollId: string; results: PollResults }) => {
      store.dispatch(setPollResults(data.results));
    });

    this.socket.on('poll-not-found', () => {
      alert('Poll not found. Please check the poll ID.');
    });

    this.socket.on('removed-from-poll', () => {
      alert('You have been removed from the poll.');
      store.dispatch(clearPoll());
    });

    this.socket.on('chat-message', (message: ChatMessage) => {
      store.dispatch(addChatMessage(message));
    });
  }

  // Teacher methods
  createPoll(data: CreatePollData) {
    if (this.socket) {
      this.socket.emit('create-poll', data);
    }
  }

  startPoll(pollId: string) {
    if (this.socket) {
      this.socket.emit('start-poll', pollId);
    }
  }

  endPoll(pollId: string) {
    if (this.socket) {
      this.socket.emit('end-poll', pollId);
    }
  }

  removeStudent(pollId: string, studentSocketId: string) {
    if (this.socket) {
      this.socket.emit('remove-student', { pollId, studentSocketId });
    }
  }

  // Student methods
  joinPoll(pollId: string, studentName: string) {
    if (this.socket) {
      this.socket.emit('join-poll', { pollId, studentName });
    }
  }

  submitAnswer(pollId: string, answer: string) {
    if (this.socket) {
      this.socket.emit('submit-answer', { pollId, answer });
    }
  }

  getResults(pollId: string) {
    if (this.socket) {
      this.socket.emit('get-results', pollId);
    }
  }

  // Chat methods
  sendChatMessage(message: string, sender: string, isTeacher: boolean) {
    if (this.socket) {
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        sender,
        message,
        timestamp: Date.now(),
        isTeacher,
      };
      this.socket.emit('chat-message', chatMessage);
    }
  }

  getSocketId(): string | null {
    return this.socket?.id || null;
  }
}

export default new SocketService();