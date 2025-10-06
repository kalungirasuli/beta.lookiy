'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AudioRecordProps {
  audioUrl?: string;
  duration?: string;
  createdAt?: string;
  className?: string;
}

const AudioRecord: React.FC<AudioRecordProps> = ({
  audioUrl = '',
  duration = '0:30',
  createdAt = 'Just now',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate random frequency bars data
  const frequencyBars = Array.from({ length: 40 }, () => Math.random() * 100 + 10);

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

  const formatCreatedAt = (createdAt: string) => {
    // Convert common time formats to short format
    if (createdAt.toLowerCase().includes('just now') || createdAt.toLowerCase().includes('now')) {
      return 'now';
    }
    if (createdAt.includes('minute')) {
      const match = createdAt.match(/(\d+)\s*minute/);
      return match ? `${match[1]}m` : createdAt;
    }
    if (createdAt.includes('hour')) {
      const match = createdAt.match(/(\d+)\s*hour/);
      return match ? `${match[1]}h` : createdAt;
    }
    if (createdAt.includes('day')) {
      const match = createdAt.match(/(\d+)\s*day/);
      return match ? `${match[1]}d` : createdAt;
    }
    // For other formats, try to extract time patterns
    if (createdAt.includes('ago')) {
      return createdAt.replace(/\s*ago/, '').replace(/\s+/, '');
    }
    return createdAt;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className={`bg-white border border-gray-300 rounded-full p-2 max-w-xs ${className}`}>
      {/* Audio element */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}
      
      {/* Main audio player container */}
      <div className="flex items-center space-x-1">
        {/* Play/Pause Button - No container, soft curved edges */}
        <button
          onClick={togglePlayPause}
          className="flex-shrink-0 transition-colors duration-200"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            // Pause icon with soft curves
            <svg
              className="w-5 h-5 text-orange-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4c0-1.1.9-2 2-2s2 .9 2 2v16c0 1.1-.9 2-2 2s-2-.9-2-2V4zm8 0c0-1.1.9-2 2-2s2 .9 2 2v16c0 1.1-.9 2-2 2s-2-.9-2-2V4z" />
            </svg>
          ) : (
            // Play icon with soft curves
            <svg
              className="w-5 h-5 text-orange-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5c0-1.1.9-2 2-2 .4 0 .8.1 1.1.4l8 7c.6.5.6 1.4 0 1.9l-8 7c-.3.3-.7.4-1.1.4-1.1 0-2-.9-2-2V5z" />
            </svg>
          )}
        </button>

        {/* Frequency Bars Visualization */}
        <div className="flex-1 flex items-center justify-center space-x-0.5 h-4">
          {frequencyBars.map((height, index) => {
            const isActive = progress > (index / frequencyBars.length) * 100;
            return (
              <div
                key={index}
                className={`w-0.5 rounded-full transition-all duration-150 ${
                  isActive ? 'bg-orange-400' : 'bg-gray-400'
                }`}
                style={{
                  height: `${Math.max(height * 0.2, 3)}px`,
                  opacity: isActive ? 1 : 0.6
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Duration and Created timestamp at the bottom */}
      <div className="flex justify-between items-center mt-1 text-[10px]">
        <span className="text-gray-600 font-medium">
          {audioDuration > 0 ? formatTime(currentTime) : duration}
        </span>
        <span className="text-gray-500">
          {formatCreatedAt(createdAt)}
        </span>
      </div>
    </div>
  );
};

export default AudioRecord;