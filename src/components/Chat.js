import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, user: 'You' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getGeminiResponse(input, messages, 'text');
      const aiMessage = { text: aiResponse, user: 'AI' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prevMessages => [...prevMessages, { text: "Sorry, I encountered an error. Please try again.", user: 'AI' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Chat with AI Coach</h2>
      <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.user === 'You' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-3 rounded-lg ${message.user === 'You' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <strong>{message.user}:</strong><br />
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default Chat;