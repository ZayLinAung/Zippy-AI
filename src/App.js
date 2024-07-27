import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import VoiceChat from './components/Voicechat'; // Ensure file name casing matches
import Chat from './components/Chat'; // Ensure file name casing matches
import LearningCoach from './components/LearningCoach'; // Ensure file name casing matches

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4">
          <ul className="flex justify-center space-x-4">
            <li>
              <Link to="/voice-chat" className="text-white hover:text-blue-200">Voice Chat</Link>
            </li>
            <li>
              <Link to="/text-chat" className="text-white hover:text-blue-200">Text Chat</Link>
            </li>
            <li>
              <Link to="/learning-resources" className="text-white hover:text-blue-200">Learning Resources</Link>
            </li>
          </ul>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/voice-chat" element={<VoiceChat />} />
            <Route path="/text-chat" element={<Chat />} />
            <Route path="/learning-resources" element={<LearningCoach />} />
            <Route path="/" element={<h1 className="text-4xl font-bold text-center text-blue-600">Welcome to AI Learning Assistant</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
