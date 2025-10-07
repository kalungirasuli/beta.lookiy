'use client';

import { useState, useRef, useEffect } from 'react';

interface MessageBubbleProps {
  id: string;
  text: string;
  author: {
    name: string;
    avatar?: string;
  };
  timestamp?: string;
  isOwn?: boolean;
  reactions?: {
    like: number;
    comment: number;
    share: number;
    view: number;
  };
}

export default function MessageBubble({ 
  id, 
  text, 
  author, 
  timestamp, 
  isOwn = false,
  reactions = { like: 0, comment: 0, share: 0, view: 0 }
}: MessageBubbleProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeReportMenu, setActiveReportMenu] = useState<string | null>(null);
  const [reportIconVisible, setReportIconVisible] = useState<Set<string>>(new Set());
  const [activeReactions, setActiveReactions] = useState<Record<string, Set<string>>>({});
  
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setActiveReportMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleReaction = (reactionType: string) => {
    setActiveReactions(prev => {
      const newSet = new Set(prev[id] || []);
      if (newSet.has(reactionType)) {
        newSet.delete(reactionType);
      } else {
        newSet.add(reactionType);
      }
      return { ...prev, [id]: newSet };
    });
  };

  return (
    <>
      {/* Main container with message and menu button */}
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
        <div className="flex gap-2" style={{ marginBottom: '5px' }}>
          {/* Message Bubble */}
          <div className={`max-w-xs lg:max-w-md xl:max-w-lg bg-white rounded-xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 ${isOwn ? 'bg-orange-50' : 'bg-white'}`}>
            
            {/* Author Info */}
            {!isOwn && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{author.name}</span>
                {timestamp && (
                  <span className="text-xs text-gray-500">{timestamp}</span>
                )}
              </div>
            )}

            {/* Message Text */}
            <div className="text-gray-800 text-sm leading-relaxed">
              {text}
            </div>
          </div>

          {/* Menu Button - Separate from message bubble */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setActiveMenu(activeMenu === id ? null : id)}
              className="flex-shrink-0 bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 p-2 text-gray-700 hover:text-gray-900"
              aria-label="Message options menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 font-bold" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* Menu Dropdown */}
            {activeMenu === id && (
              <div className="absolute right-0 top-12 bg-white border-2 border-black rounded-xl py-2 z-10 min-w-[140px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                {/* Edit Option */}
                <button 
                  onClick={() => {
                    console.log('Edit message:', id);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 hover:translate-x-[2px] transition-all duration-150 flex items-center space-x-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>Edit</span>
                </button>

                {/* Delete Option */}
                <button 
                  onClick={() => {
                    console.log('Delete message:', id);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:translate-x-[2px] transition-all duration-150 flex items-center space-x-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Delete</span>
                </button>

                {/* Report Option */}
                {!reportIconVisible.has(id) ? (
                  <button 
                    onClick={() => {
                      setActiveReportMenu(id);
                      setReportIconVisible(prev => {
                        const next = new Set(prev);
                        next.add(id);
                        return next;
                      });
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 hover:translate-x-[2px] transition-all duration-150 flex items-center space-x-2 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                    <span>Report</span>
                  </button>
                ) : (
                  <div className="px-4 py-2">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          setActiveReportMenu(null);
                          setReportIconVisible(prev => {
                            const next = new Set(prev);
                            next.delete(id);
                            return next;
                          });
                        }}
                        className="w-1/2 px-2 py-2 text-xs text-gray-600 bg-gray-100 
                        shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] border border-black
                        hover:bg-gray-200 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[1px] hover:translate-y-[1px] text-center font-medium rounded"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Report message:', id);
                          setActiveMenu(null);
                          setActiveReportMenu(null);
                        }}
                        className="w-1/2 px-2 py-2 text-xs text-white bg-red-500 
                        shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] border border-black
                        hover:bg-red-600 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[1px] hover:translate-y-[1px] text-center font-medium rounded"
                      >
                        Report
                      </button>
                    </div>
                  </div>
                )}

                {/* Share Option */}
                <button 
                  onClick={() => {
                    console.log('Share message:', id);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 hover:translate-x-[2px] transition-all duration-150 flex items-center space-x-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span>Share</span>
                </button>

                {/* Details Option */}
                <button 
                  onClick={() => {
                    console.log('View details for message:', id);
                    setActiveMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 hover:translate-x-[2px] transition-all duration-150 flex items-center space-x-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Details</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reaction Buttons - Separate row like in audio component */}
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className="flex gap-1">
          {/* Like Button */}
          <button
            onClick={() => toggleReaction('like')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
              activeReactions[id]?.has('like')
                ? 'bg-white text-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,127,0.8)]'
                : 'bg-white text-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,127,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(220,38,127,0.8)] hover:translate-x-[2px] hover:translate-y-[2px]'
            } duration-150`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 font-bold" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold">{reactions.like}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => toggleReaction('comment')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer relative ${
              activeReactions[id]?.has('comment')
                ? 'bg-white text-blue-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(59,130,246,0.8)]'
                : 'bg-white text-blue-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(59,130,246,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(59,130,246,0.8)] hover:translate-x-[2px] hover:translate-y-[2px]'
            } duration-150`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 font-bold" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold">{reactions.comment}</span>
            {reactions.comment > 0 && (
              <span className="badge text-white text-[10px] bg-red-500 rounded-full font-bold absolute top-[-7px] right-[-7px] w-4 h-4 flex items-center justify-center border-2 border-white">
                {reactions.comment}
              </span>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={() => toggleReaction('share')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
              activeReactions[id]?.has('share')
                ? 'bg-white text-green-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(34,197,94,0.8)]'
                : 'bg-white text-green-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(34,197,94,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(34,197,94,0.8)] hover:translate-x-[2px] hover:translate-y-[2px]'
            } duration-150`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 font-bold" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span className="text-xs font-bold">{reactions.share}</span>
          </button>

          {/* View Button */}
          <button
            onClick={() => toggleReaction('view')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
              activeReactions[id]?.has('view')
                ? 'bg-white text-gray-900 border-2 border-black shadow-[4px_4px_0px_0px_rgba(107,114,128,0.8)]'
                : 'bg-white text-gray-900 border-2 border-black shadow-[4px_4px_0px_0px_rgba(107,114,128,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(107,114,128,0.8)] hover:translate-x-[2px] hover:translate-y-[2px]'
            } duration-150`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 font-bold" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold">{reactions.view}</span>
          </button>
        </div>
      </div>
    </>
  );
}