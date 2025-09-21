const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/poll-history', (req, res) => {
  res.json(pollHistory.slice(-10)); // Return last 10 polls
});

// Store active polls and sessions
let activePolls = new Map();
let studentSessions = new Map();
let pollHistory = [];

// Poll data structure
class Poll {
  constructor(id, question, options, timeLimit = 60) {
    this.id = id;
    this.question = question;
    this.options = options;
    this.timeLimit = timeLimit;
    this.responses = new Map();
    this.isActive = false;
    this.startTime = null;
    this.teacherSocketId = null;
  }

  addResponse(studentId, answer) {
    this.responses.set(studentId, answer);
  }

  getResults() {
    const results = {};
    this.options.forEach(option => {
      results[option] = 0;
    });
    
    this.responses.forEach(answer => {
      if (results.hasOwnProperty(answer)) {
        results[answer]++;
      }
    });
    
    return {
      question: this.question,
      options: this.options,
      results,
      totalResponses: this.responses.size,
      timeRemaining: this.isActive ? Math.max(0, this.timeLimit - Math.floor((Date.now() - this.startTime) / 1000)) : 0
    };
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Teacher creates a new poll
  socket.on('create-poll', (data) => {
    const { question, options, timeLimit } = data;
    const pollId = uuidv4();
    const poll = new Poll(pollId, question, options, timeLimit || 60);
    poll.teacherSocketId = socket.id;
    activePolls.set(pollId, poll);
    
    socket.emit('poll-created', { pollId, poll });
    console.log('Poll created:', pollId);
  });

  // Teacher starts a poll
  socket.on('start-poll', (pollId) => {
    const poll = activePolls.get(pollId);
    if (poll && poll.teacherSocketId === socket.id) {
      poll.isActive = true;
      poll.startTime = Date.now();
      
      // Broadcast to all connected students
      io.emit('poll-started', { pollId, poll: poll.getResults() });
      
      // Set timer to automatically end poll
      setTimeout(() => {
        if (poll.isActive) {
          poll.isActive = false;
          const results = poll.getResults();
          
          // Store in history
          pollHistory.push({
            id: pollId,
            question: poll.question,
            options: poll.options,
            results: results.results,
            totalResponses: results.totalResponses,
            timeLimit: poll.timeLimit,
            endTime: new Date().toISOString()
          });
          
          io.emit('poll-ended', { pollId, results });
        }
      }, poll.timeLimit * 1000);
      
      console.log('Poll started:', pollId);
    }
  });

  // Student joins a poll
  socket.on('join-poll', (data) => {
    const { pollId, studentName } = data;
    const poll = activePolls.get(pollId);
    
    if (poll) {
      socket.join(pollId);
      studentSessions.set(socket.id, { pollId, studentName });
      socket.emit('poll-joined', { pollId, poll: poll.getResults() });
      console.log('Student joined poll:', studentName, pollId);
    } else {
      socket.emit('poll-not-found', { pollId });
    }
  });

  // Student submits answer
  socket.on('submit-answer', (data) => {
    const { pollId, answer } = data;
    const poll = activePolls.get(pollId);
    const studentSession = studentSessions.get(socket.id);
    
    if (poll && studentSession && poll.isActive) {
      poll.addResponse(socket.id, answer);
      
      // Broadcast updated results to all connected clients
      io.to(pollId).emit('poll-updated', { pollId, results: poll.getResults() });
      
      console.log('Answer submitted:', studentSession.studentName, answer);
    }
  });

  // Request current poll results
  socket.on('get-results', (pollId) => {
    const poll = activePolls.get(pollId);
    if (poll) {
      socket.emit('poll-results', { pollId, results: poll.getResults() });
    }
  });

  // Teacher ends poll manually
  socket.on('end-poll', (pollId) => {
    const poll = activePolls.get(pollId);
    if (poll && poll.teacherSocketId === socket.id) {
      poll.isActive = false;
      const results = poll.getResults();
      
      // Store in history
      pollHistory.push({
        id: pollId,
        question: poll.question,
        options: poll.options,
        results: results.results,
        totalResponses: results.totalResponses,
        timeLimit: poll.timeLimit,
        endTime: new Date().toISOString()
      });
      
      io.to(pollId).emit('poll-ended', { pollId, results });
      console.log('Poll ended manually:', pollId);
    }
  });

  // Teacher removes a student
  socket.on('remove-student', (data) => {
    const { pollId, studentSocketId } = data;
    const poll = activePolls.get(pollId);
    
    if (poll && poll.teacherSocketId === socket.id) {
      // Remove student's response if they had one
      poll.responses.delete(studentSocketId);
      studentSessions.delete(studentSocketId);
      
      // Notify the student they've been removed
      io.to(studentSocketId).emit('removed-from-poll');
      
      // Broadcast updated results
      io.to(pollId).emit('poll-updated', { pollId, results: poll.getResults() });
      
      console.log('Student removed:', studentSocketId);
    }
  });

  // Chat message
  socket.on('chat-message', (message) => {
    // Broadcast to all connected clients in the same poll
    const studentSession = studentSessions.get(socket.id);
    if (studentSession) {
      io.to(studentSession.pollId).emit('chat-message', message);
    } else {
      // If it's a teacher, broadcast to all their polls
      const teacherPolls = Array.from(activePolls.values()).filter(poll => poll.teacherSocketId === socket.id);
      teacherPolls.forEach(poll => {
        io.to(poll.id).emit('chat-message', message);
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const studentSession = studentSessions.get(socket.id);
    if (studentSession) {
      const poll = activePolls.get(studentSession.pollId);
      if (poll) {
        // Remove student's response
        poll.responses.delete(socket.id);
        studentSessions.delete(socket.id);
        
        // Broadcast updated results
        io.to(studentSession.pollId).emit('poll-updated', { 
          pollId: studentSession.pollId, 
          results: poll.getResults() 
        });
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});