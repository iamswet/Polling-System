import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import socketService from './services/socketService';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import RoleSelector from './components/RoleSelector';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import './App.css';

function AppContent() {
  const { isTeacher, studentName } = useSelector((state: RootState) => state.poll);

  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  if (!isTeacher && !studentName) {
    return <RoleSelector />;
  }

  return (
    <div className="App">
      {isTeacher ? <TeacherDashboard /> : <StudentDashboard />}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
