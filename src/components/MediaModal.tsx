'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import SingleVideo from './SingleVideo';

interface MediaItem {
  src: string;
  type?: 'image' | 'video';
  poster?: string;
  alt?: string;
}

interface MediaModalProps {
  media: (string | MediaItem)[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({
  media,
  initialIndex = 0,
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Normalize media items
  const normalizedMedia: MediaItem[] = media.map((item) => {
    if (typeof item === 'string') {
      const isVideo = item.match(/\.(mp4|webm|ogg|mov|avi)$/i);
      return {
        src: item,
        type: isVideo ? 'video' : 'image',
        alt: 'Media content'
      };
    }
    return {
      ...item,
      type: item.type || (item.src.match(/\.(mp4|webm|ogg|mov|avi)$/i) ? 'video' : 'image'),
      alt: item.alt || 'Media content'
    };
  });

  // Reset index when modal opens or media changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, normalizedMedia.length - 1)));
    }
  }, [isOpen, initialIndex, normalizedMedia.length]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? normalizedMedia.length - 1 : prevIndex - 1
    );
  }, [normalizedMedia.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === normalizedMedia.length - 1 ? 0 : prevIndex + 1
    );
  }, [normalizedMedia.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || normalizedMedia.length === 0) {
    return null;
  }

  const currentMedia = normalizedMedia[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div className="relative w-screen h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-200 backdrop-blur-sm"
          aria-label="Close modal"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Navigation arrows */}
        {normalizedMedia.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous media"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-200 backdrop-blur-sm"
              aria-label="Next media"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Media content */}
        <div 
          className="w-full h-full flex items-center justify-center pointer-events-none"
        >
          <div 
            className="pointer-events-auto"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking on media container
          >
            {currentMedia.type === 'video' ? (
              <div 
                className="w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} // Extra protection to prevent modal closing
              >
                <SingleVideo
                  src={currentMedia.src}
                  alt={currentMedia.alt}
                  poster={currentMedia.poster}
                  className="w-full h-auto max-h-[90vh]"
                  muted={false}
                  autoPlay={false}
                  controls={true}
                  style={{
                    minWidth: '80vw',
                    maxWidth: '95vw'
                  }}
                />
              </div>
            ) : (
              <img
                src={currentMedia.src}
                alt={currentMedia.alt}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
                style={{
                  minWidth: '80vw',
                  maxWidth: '95vw'
                }}
              />
            )}
          </div>
        </div>

        {/* Media counter and dots */}
        {normalizedMedia.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3">
            {/* Dots indicator */}
            <div className="flex space-x-2">
              {normalizedMedia.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-white scale-110'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} / {normalizedMedia.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaModal;