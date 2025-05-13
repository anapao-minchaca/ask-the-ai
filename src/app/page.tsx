'use client';

import { useState } from 'react';

type Message = {
  sender: 'user' | 'assistant';
  text: string;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const askTheAI = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = {
      sender: 'user',
      text: input.trim(),
    };
  
    // Optimistically update UI with user message
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input.trim() }),
      });
  
      const data = await res.json();
  
      const aiResponse: Message = {
        sender: 'assistant',
        text: data.response || 'No response from AI.',
      };
  
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        sender: 'assistant',
        text: 'There was an error contacting the AI.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  
    setInput('');
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
      {/* Message History */}
      <div className="w-full max-w-2xl space-y-4 mb-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow text-left ${
              msg.sender === 'user' ? 'bg-white' : 'bg-blue-100'
            } text-gray-900`}
          >
            <p className="text-sm font-semibold text-gray-700">
              {msg.sender === 'user' ? 'User:' : 'Assistant:'}
            </p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Textarea and Button */}
      <div className="w-full max-w-2xl">
        <textarea
          rows={5}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 shadow resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
        />
        <button
          onClick={askTheAI}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
        >
          Ask the AI
        </button>
      </div>
    </div>
  );
}
