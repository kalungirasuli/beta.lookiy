'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaCirclePause,FaCirclePlay,FaStop, FaEllipsisVertical, FaTrash, FaFlag,FaInfo, FaShare, FaHeart, FaComment } from "react-icons/fa6";
import { VscReactions } from "react-icons/vsc";
import { FaRegCommentDots } from "react-icons/fa";
import LoadingRing from './LoadingRing';
interface AudioRecordProps {
  audioUrl?: string;
  duration?: string;
  createdAt?: string;
  className?: string;
}

const AudioRecord: React.FC<AudioRecordProps> = ({
  audioUrl = '',
  duration = '0:30',
  createdAt = 'now',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate random frequency bars data
  const frequencyBars = Array.from({ length: 30 }, () => Math.random() * 100 + 10);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setAudioDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isLoading) {
      // Stop loading/downloading
      setIsLoading(false);
      setLoadingProgress(0);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuAction = (action: string) => {
    console.log(`${action} clicked`);
    setShowMenu(false);
    // Add specific handlers for each action here
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <>
    <div className="div flex gap-2 " style={{
      marginBottom:'5px'
    }}>
    <div className={`bg-white border-2 border-black rounded-xl p-2 w-[200px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 ${className}`}>
      {/* Audio element */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}
      
      {/* Main audio player container */}
      <div className="flex items-center space-x-3">
        {/* Play/Pause/Loading Button - Direct icon without container */}
        <div
          onClick={togglePlayPause}
          className="flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-150"
          aria-label={isLoading ? 'Stop' : isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            // Loading ring with stop icon
            <LoadingRing progress={loadingProgress} size={32} strokeWidth={2}>
              <FaStop className='w-5 h-5 text-gray-400'/>
            </LoadingRing>
          ) : isPlaying ? (
            // Pause icon with soft curves
           <FaCirclePause className="w-8 h-8 text-blue-600 hover:text-blue-700 transition-colors duration-200" />
          ) : (
            // Play icon with soft curves
            <FaCirclePlay className="w-8 h-8 text-blue-600 hover:text-blue-700 transition-colors duration-200" />
          )}
        </div>

        {/* Frequency Bars Visualization - Cartoon Style */}
        <div className="flex-1 flex items-center justify-between space-x-0.5 h-8">
          {frequencyBars.map((height, index) => {
            const isActive = progress > (index / frequencyBars.length) * 100;
            return (
              <div
                key={index}
                className={`w-0.5 rounded-full transition-all duration-150 border border-black ${
                  isActive 
                    ? 'bg-gradient-to-t from-blue-400 to-blue-600 shadow-[1px_1px_0px_0px_rgba(59,130,246,0.4)]' 
                    : 'bg-gradient-to-t from-gray-200 to-gray-400 shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)]'
                }`}
                style={{
                  height: `${Math.max(height * 0.25, 6)}px`,
                  opacity: isActive ? 1 : 0.6
                }}
              />
            );
          })}
        </div>

        {/* Menu Toggle Button */}
        
      </div>
      {/* time */}
      
    </div>
    <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex-shrink-0 bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 p-2 text-gray-700 hover:text-gray-900"
            aria-label="Menu"
          >
            <FaEllipsisVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white border-2 border-black rounded-xl py-2 z-10 min-w-[140px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
              <button
                onClick={() => handleMenuAction('delete')}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:translate-x-[2px] transition-all duration-150 flex items-center space-x-2 font-medium"
              >
                <FaTrash className="w-3 h-3" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => handleMenuAction('report')}
                className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 hover:translate-x-[2px] transition-all duration-150 flex items-center space-x-2 font-medium"
              >
                <FaFlag className="w-3 h-3" />
                <span>Report</span>
              </button>
              <button
                onClick={() => handleMenuAction('details')}
                className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 hover:translate-x-[2px] transition-all duration-150 flex items-center space-x-2 font-medium"
              >
                <FaInfo className="w-3 h-3" />
                <span>Details</span>
              </button>
              <button
                onClick={() => handleMenuAction('share')}
                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 hover:translate-x-[2px] transition-all duration-150 flex items-center space-x-2 font-medium"
              >
                <FaShare className="w-3 h-3" />
                <span>Share</span>
              </button>
            </div>
          )}
        </div>
    </div>
    {/* reactions */}
    <div className="">
      <div className="flex gap-1">
        <button type='button' className='flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-purple-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(128,0,128,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(128,0,128,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150'>
          <FaHeart className="h-3 w-3" />
          <span className='text-xs font-bold'>2</span>
        </button>
        <button type='button' className='flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-blue-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(59,130,246,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(59,130,246,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 relative'>
          <FaComment className="h-3 w-3" />
          <span className='badge text-white text-[10px] bg-red-500 rounded-full font-bold absolute top-[-7px] right-[-7px] w-4 h-4 flex items-center justify-center border-2 border-white'>2</span>
        </button>
      </div>
    </div>
    </>
  );
};

export default AudioRecord;