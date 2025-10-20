'use client';

import { useState, useRef, useEffect } from 'react';
import { FaCirclePlay } from 'react-icons/fa6';
import ImageCarousel from './ImageCarousel';
import SingleImage from './SingleImage';
import SingleMedia from './SingleMedia';
import MediaCarousel from './MediaCarousel';
import MediaModal from './MediaModal';
import {BiSolidRightArrow} from 'react-icons/bi';
import {SlArrowRight} from 'react-icons/sl'

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
  reference?: {
    author: {
      name: string;
      avatar?: string;
    };
    content: string;
    images?: string[];
    audio?: {
      duration?: string;
      url?: string;
    };
  };
  images?: string[];
  media?: (string | { src: string; type?: 'image' | 'video'; poster?: string; alt?: string })[];
  children?: MessageBubbleProps[];
  child?:boolean,
  replies?: string[]
}

export default function MessageBubble({ 
  id, 
  text,   
  children,
  child = false,
  replies = [],
  author, 
  timestamp, 
  isOwn = false,
  reactions = { like: 0, comment: 0, share: 0, view: 0 },
  reference,
  images,  
  media
}: MessageBubbleProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeReportMenu, setActiveReportMenu] = useState<string | null>(null);
  const [reportIconVisible, setReportIconVisible] = useState<Set<string>>(new Set());
  const [activeReactions, setActiveReactions] = useState<Record<string, Set<string>>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState<(string | { src: string; type?: 'image' | 'video'; poster?: string; alt?: string })[]>([]);
  const [modalIndex, setModalIndex] = useState(0);
  
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

  const handleSingleMediaClick = () => {
    if (media && media.length === 1) {
      setModalMedia(media);
      setModalIndex(0);
      setIsModalOpen(true);
    }
  };
  
  const handleSingleImageClick = () => {
    if (images && images.length === 1) {
      // Convert images to the format expected by MediaModal
      const formattedMedia = images.map(img => ({ src: img, type: 'image' as const }));
      setModalMedia(formattedMedia);
      setModalIndex(0);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Main container with message and menu button */}
      {/* Avatar component for showing participants at a level */}
      {   
        child === false ? "" : (
          <div className="flex items-center gap-1 mb-2 px-2">
            <div className="flex -space-x-2">
              {children && children.slice(0, 5).map((childMessage, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs border-2 border-white dark:border-gray-800 transition-transform hover:scale-110 cursor-pointer`}
                  title={childMessage.author.name}
                >
                  {childMessage.author.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {children && children.length > 5 && (
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[10px] font-semibold border-2 border-white dark:border-gray-800 text-gray-700 dark:text-gray-200">
                  +{children.length - 5}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {children ? children.length : 0} {children && children.length === 1 ? 'participant' : 'participants'}
            </span>
          </div>
        )
      }
      <div className={`flex   ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
        <div className="flex relative gap-2" style={{ marginBottom: '5px' }}>
          {/* Message Bubble Container with Reactions */}
          <div className="relative mb-3">
            {/* Message Bubble */}
            <div className={`max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg bg-white rounded-xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 ${isOwn ? 'bg-orange-50' : 'bg-white'}`}>
              
              {/* Reference/Reply Section */}
              {reference && (
                <div className="bg-orange-50 border-2 border-black rounded-xl p-3 mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-orange-200 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] flex items-center justify-center">
                      <span className="text-[10px] font-bold text-black">
                        {reference.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-black">{reference.author.name}</span> <span className="text-xs font-bold text-black">{reference.author.name}</span>
                  </div>
                  
                  {/* Content and Image Layout */}
                  {reference.content ? (
                    // When there's text content, show image on the right
                    <div className="flex gap-2">
                      <div className="flex-1 text-xs text-black leading-relaxed font-medium">
                        {reference.content}
                      </div>
                      {reference.images && reference.images.length > 0 && (
                        <div className="flex-shrink-0 w-12 h-12">
                          <img 
                            src={reference.images[0]} 
                            alt="Referenced image"
                            className="w-full h-full object-cover rounded-lg border border-black"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    // When there's no text content, show image or audio below profile
                    <div className="mt-2">
                      {reference.images && reference.images.length > 0 && (
                        <img 
                          src={reference.images[0]} 
                          alt="Referenced image"
                          className="w-full max-w-[120px] h-auto object-cover rounded-lg border border-black"
                        />
                      )}
                      {reference.audio && (
                        <div className="flex items-center space-x-2 mt-1">
                          {/* Play icon */}
                          <FaCirclePlay className="text-orange-500 text-lg flex-shrink-0 cursor-pointer hover:text-orange-600 transition-colors duration-200" />
                          {/* Audio frequency bars */}
                          <div className="flex items-center justify-between space-x-0.5 h-6 flex-1 max-w-[100px]">
                            {Array.from({ length: 20 }, (_, index) => {
                              const height = Math.random() * 100 + 10;
                              return (
                                <div
                                  key={index}
                                  className="w-0.5 rounded-full bg-gradient-to-t from-orange-300 to-orange-500 border border-black shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)]"
                                  style={{
                                    height: `${Math.max(height * 0.2, 4)}px`,
                                    opacity: 0.8
                                  }}
                                />
                              );
                            })}
                          </div>
                          {reference.audio.duration && (
                            <span className="text-[10px] font-bold text-black">
                              {reference.audio.duration}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                 
                </div>
              )}

              {/* Author Info */}
              {!isOwn && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{author.name}</span>
                  <span className="text-sm font-medium text-gray-700"><SlArrowRight className='fill-slate-500 w-2 h-2'/></span>
                  <span className='text-sm font-medium text-blue-700'>{author.name}</span>

                  {timestamp && (
                    <span className="text-xs text-gray-500">{timestamp}</span>
                  )}
                </div>
              )}

              {/* Message Text */}
              <div className="text-gray-800 text-sm leading-relaxed">
                {text}
              </div>

              {/* Media Display */}
              {media && media.length > 0 ? (
                <div className="mt-3">
                  {media.length === 1 ? (
                    <SingleMedia 
                      src={typeof media[0] === 'string' ? media[0] : media[0].src}
                      type={typeof media[0] === 'string' ? undefined : media[0].type}
                      poster={typeof media[0] === 'string' ? undefined : media[0].poster}
                      alt={typeof media[0] === 'string' ? `Media from ${author.name}` : media[0].alt || `Media from ${author.name}`}
                      className="w-full"
                      onClick={handleSingleMediaClick}
                    />
                  ) : (
                    <MediaCarousel 
                      media={media}
                      alt={`Media from ${author.name}`}
                      className="w-full"
                      onMediaClick={(index) => {
                        setModalMedia(media);
                        setModalIndex(index);
                        setIsModalOpen(true);
                      }}
                    />
                  )}
                </div>
              ) : images && images.length > 0 && (
                <div className="mt-3">
                  {images.length === 1 ? (
                    <SingleImage 
                      src={images[0]}
                      alt={`Image from ${author.name}`}
                      className="w-full"
                      onClick={handleSingleImageClick}
                    />
                  ) : (
                    <ImageCarousel 
                      images={images}
                      alt={`Images from ${author.name}`}
                      className="w-full"
                      onImageClick={(index) => {
                        const formattedMedia = images.map(img => ({ src: img, type: 'image' as const }));
                        setModalMedia(formattedMedia);
                        setModalIndex(index);
                        setIsModalOpen(true);
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Reaction Icons - Outside bubble, attached to bottom border */}
            <div className="flex justify-start mt-2  ml-4">
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
                  {/* <span className="text-xs font-bold">{reactions.comment}</span> */}
                  {reactions.comment > 0 && (
                    <span className="badge text-white text-[10px] bg-red-500 rounded-full font-bold absolute top-[-7px] right-[-7px] w-4 h-4 flex items-center justify-center border-2 border-white">
                      {reactions.comment}
                    </span>
                  )}
                </button>
               
              </div>
            </div>
          </div>

          {/* Menu Button - Separate from message bubble */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setActiveMenu(activeMenu === id ? null : id)}
              className="flex-shrink-0 bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 p-1.5 text-gray-700 hover:text-gray-900"
              aria-label="Message options menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 font-bold" viewBox="0 0 20 20" fill="currentColor">
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

      {/* Media Modal */}
      {isModalOpen && (
        <MediaModal
          media={modalMedia}
          initialIndex={modalIndex}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}