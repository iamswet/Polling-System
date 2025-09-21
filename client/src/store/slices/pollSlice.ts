import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, Poll, PollResults, ChatMessage } from '../../types';

const initialState: AppState = {
  currentPoll: null,
  pollResults: null,
  studentName: null,
  isTeacher: false,
  pollId: null,
  connectedStudents: [],
  chatMessages: [],
  showChat: false,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setCurrentPoll: (state, action: PayloadAction<Poll>) => {
      state.currentPoll = action.payload;
    },
    setPollResults: (state, action: PayloadAction<PollResults>) => {
      state.pollResults = action.payload;
    },
    setStudentName: (state, action: PayloadAction<string>) => {
      state.studentName = action.payload;
    },
    setIsTeacher: (state, action: PayloadAction<boolean>) => {
      state.isTeacher = action.payload;
    },
    setPollId: (state, action: PayloadAction<string>) => {
      state.pollId = action.payload;
    },
    setConnectedStudents: (state, action: PayloadAction<string[]>) => {
      state.connectedStudents = action.payload;
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    toggleChat: (state) => {
      state.showChat = !state.showChat;
    },
    clearPoll: (state) => {
      state.currentPoll = null;
      state.pollResults = null;
      state.pollId = null;
      state.connectedStudents = [];
    },
  },
});

export const {
  setCurrentPoll,
  setPollResults,
  setStudentName,
  setIsTeacher,
  setPollId,
  setConnectedStudents,
  addChatMessage,
  toggleChat,
  clearPoll,
} = pollSlice.actions;

export default pollSlice.reducer;