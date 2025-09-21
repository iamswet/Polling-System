# Real-time Polling System

A modern, real-time polling application built with React, Redux, Express.js, and Socket.io. Teachers can create polls and students can answer them in real-time with live results display.

## Features

### Teacher Features
- ✅ Create new polls with custom questions and options
- ✅ View live polling results
- ✅ Control poll timing (30-180 seconds)
- ✅ Start/end polls manually
- ✅ Real-time chat with students
- ✅ Remove students from polls
- ✅ View poll statistics

### Student Features
- ✅ Enter unique name on first visit
- ✅ Join polls using poll ID
- ✅ Submit answers to poll questions
- ✅ View live polling results after submission
- ✅ 60-second timer for answering questions
- ✅ Real-time chat with teacher and other students

### Technical Features
- ✅ Real-time communication using Socket.io
- ✅ Redux for state management
- ✅ Responsive design for all devices
- ✅ Modern UI with smooth animations
- ✅ Docker containerization
- ✅ Production-ready deployment

## Technology Stack

- **Frontend**: React 18 with TypeScript, Redux Toolkit
- **Backend**: Express.js with Socket.io
- **Styling**: CSS3 with modern design patterns
- **Deployment**: Docker, Docker Compose, Nginx

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   ```

2. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:80
   - Backend: http://localhost:5000

## Usage Guide

### For Teachers

1. **Login as Teacher**
   - Click "Enter as Teacher" on the role selection screen

2. **Create a Poll**
   - Click "Create New Poll"
   - Enter your question
   - Add answer options (2-6 options)
   - Set time limit (30-180 seconds)
   - Click "Create Poll"

3. **Start the Poll**
   - Click "Start Poll" to begin
   - Share the Poll ID with students
   - Monitor live results

4. **Manage the Poll**
   - End poll manually if needed
   - Create new polls when appropriate
   - Use chat to communicate with students

### For Students

1. **Login as Student**
   - Enter your name
   - Click "Enter as Student"

2. **Join a Poll**
   - Enter the Poll ID provided by teacher
   - Click "Join Poll"

3. **Answer Questions**
   - Select your answer from the options
   - Click "Submit Answer"
   - View live results

4. **Chat**
   - Use the chat feature to communicate
   - Join another poll when ready

## API Endpoints

### WebSocket Events

**Teacher Events:**
- `create-poll` - Create a new poll
- `start-poll` - Start an active poll
- `end-poll` - End a poll manually
- `remove-student` - Remove a student from poll

**Student Events:**
- `join-poll` - Join a poll with ID and name
- `submit-answer` - Submit answer to current question
- `get-results` - Request current poll results

**Chat Events:**
- `chat-message` - Send a chat message

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # Socket.io service
│   │   └── types/         # TypeScript types
│   └── Dockerfile         # Frontend Docker config
├── server/                # Express.js backend
│   └── index.js          # Main server file
├── docker-compose.yml     # Docker Compose config
├── Dockerfile            # Backend Docker config
└── package.json          # Root package.json
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=production
PORT=5000
```

## Deployment Options

### Option 1: Docker (Recommended)
```bash
docker-compose up -d
```

### Option 2: Manual Deployment
1. Build the frontend: `cd client && npm run build`
2. Start the backend: `npm start`
3. Serve the frontend build files with a web server

### Option 3: Cloud Deployment
- **Heroku**: Use the included `Procfile`
- **AWS**: Use ECS with the Docker containers
- **DigitalOcean**: Use App Platform or Droplets
- **Vercel/Netlify**: Deploy frontend, use separate backend hosting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository or contact the development team.