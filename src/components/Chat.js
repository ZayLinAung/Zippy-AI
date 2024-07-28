import React, { useState } from "react";
import { getGeminiResponse } from "../services/geminiService";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = {
    background: 'linear-gradient(to bottom right, #8A70E0, #1EAE98)',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, user: "You" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await getGeminiResponse(input, messages, "text");
      const aiMessage = { text: aiResponse, user: "AI" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, I encountered an error. Please try again.",
          user: "AI",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex flex-row items-center justify-center gap-[20px]">
        <img className="w-[60px]" src="rocket.png" />
        <h2 className="text-3xl font-bold text-[#3ec8b3] mb-6 text-center font-[Roboto]">
          Chat with Zippy
        </h2>
      </div>

      <div className="h-96 overflow-y-auto mb-4 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.user === "You" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-3 rounded-lg ${
                message.user === "You" ? "bg-[#C1F5ED] font-[Roboto] font-[400]" : "bg-gray-100 font-[Roboto] font-[400]"
              }`}
            >
              <strong>{message.user}:</strong>
              <br />
              {message.text.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center">
        <input
          className="flex-grow shadow appearance-none border rounded-3xl py-4 px-3 text-gray-700 font-[Roboto] font-[500] leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <div>
        <button
          className="ml-4 bg-[#C1F5ED] text-[#4e574ae6] hover:bg-[#45de34] hover:text-[white] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
        </div>
       
      </div>
    </div>
  );
}

export default Chat;
