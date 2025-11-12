import React, { useState, useRef, useEffect } from 'react';
import { getSearchGroundedResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { SendIcon } from './icons/SendIcon';
import { Spinner } from './icons/Spinner';
import { SourceList } from './SourceList';

export const ChatView: React.FC = () => {
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
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const { text, sources } = await getSearchGroundedResponse(input);
    
    const botMessage: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'bot', 
      content: text, 
      sources: sources
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 pt-10">
              <h2 className="text-2xl font-semibold">Web-Grounded Chat</h2>
              <p className="mt-2">Ask me anything! I'll use Google Search to find the latest information.</p>
              <p className="text-sm mt-1">(e.g., "Who won the latest F1 race?")</p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mt-1"><BotIcon /></div>}
              <div className={`p-3 rounded-lg max-w-xl ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.role === 'bot' && msg.sources && <SourceList chunks={msg.sources} sourceType="web" />}
              </div>
              {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mt-1"><UserIcon /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mt-1"><BotIcon /></div>
              <div className="p-3 rounded-lg bg-gray-700 flex items-center">
                <Spinner />
                <span className="ml-2 text-gray-400">Thinking...</span>
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
            placeholder="Ask a question..."
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
};
