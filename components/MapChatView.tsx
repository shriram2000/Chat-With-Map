import React, { useState, useRef, useEffect } from 'react';
import { getMapGroundedResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { SendIcon } from './icons/SendIcon';
import { Spinner } from './icons/Spinner';
import { SourceList } from './SourceList';
import { MapIcon } from './icons/MapIcon';

export const MapChatView: React.FC = () => {
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

   useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !location) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const { text, sources } = await getMapGroundedResponse(input, location);
    
    const botMessage: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'bot', 
      content: text,
      sources: sources
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (geoLoading) {
      return <div className="flex items-center justify-center h-full text-gray-400"><Spinner /> <span className="ml-2">Getting your location...</span></div>;
    }
    if (geoError) {
      return <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <MapIcon className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-red-400">Location Error</h2>
        <p className="text-gray-300 mt-2">Could not get your location: {geoError}</p>
        <p className="text-gray-400 mt-1 text-sm">Please enable location permissions in your browser settings and refresh the page.</p>
      </div>;
    }
    if (location) {
      return (
        <div className="flex flex-col h-full bg-gray-800">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.length === 0 && !isLoading && (
                <div className="text-center text-gray-400 pt-10">
                  <h2 className="text-2xl font-semibold">Map-Grounded Chat</h2>
                  <p className="mt-2">Your location is set. Ask me about nearby places!</p>
                  <p className="text-sm mt-1">(e.g., "Any good coffee shops near me?")</p>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mt-1"><BotIcon /></div>}
                  <div className={`p-3 rounded-lg max-w-xl ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.role === 'bot' && msg.sources && <SourceList chunks={msg.sources} sourceType="maps" />}
                  </div>
                  {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mt-1"><UserIcon /></div>}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mt-1"><BotIcon /></div>
                  <div className="p-3 rounded-lg bg-gray-700 flex items-center">
                    <Spinner />
                    <span className="ml-2 text-gray-400">Searching maps...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Ask about nearby places..."
                rows={1}
                className="flex-1 bg-gray-700 rounded-lg p-2 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none max-h-40"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()} className="bg-indigo-600 text-white p-2 rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors self-end flex-shrink-0">
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      );
    }
    return null;
  };

  return <div className="h-full">{renderContent()}</div>;
};
