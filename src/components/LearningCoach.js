import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';

function LearningCoach() {
  const [topic, setTopic] = useState('');
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAdvice = async () => {
    if (topic.trim() === '') return;

    setIsLoading(true);
    try {
      const response = await getGeminiResponse(topic, [], 'advisory');
      const parsedResources = response.split('\n').filter(line => line.trim() !== '').map(resource => {
        const [title, description] = resource.split(':');
        return { title: title.trim(), description: description.trim() };
      });
      setResources(parsedResources);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setResources([{ title: "Error", description: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Learning Resources</h2>
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Enter a topic you want to learn"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <button
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={getAdvice}
        disabled={isLoading}
      >
        {isLoading ? 'Finding Resources...' : 'Get Resources'}
      </button>
      {resources.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Recommended Resources:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg mb-2">{resource.title}</h4>
                <p className="text-gray-600">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningCoach;