import React, { useState } from 'react';
import { ChatView } from './components/ChatView';
import { MapChatView } from './components/MapChatView';
import { GoogleIcon } from './components/icons/GoogleIcon';
import { MapIcon } from './components/icons/MapIcon';

type View = 'web' | 'map';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('web');

  const navButtonClasses = (view: View) => 
    `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
      activeView === view
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-700 hover:bg-gray-600'
    }`;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Grounded AI Chat
          </h1>
          <nav className="flex gap-2">
            <button onClick={() => setActiveView('web')} className={navButtonClasses('web')}>
              <GoogleIcon />
              <span className="hidden sm:inline">Web Chat</span>
            </button>
            <button onClick={() => setActiveView('map')} className={navButtonClasses('map')}>
              <MapIcon />
              <span className="hidden sm:inline">Map Chat</span>
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {activeView === 'web' && <ChatView />}
        {activeView === 'map' && <MapChatView />}
      </main>
    </div>
  );
};

export default App;
