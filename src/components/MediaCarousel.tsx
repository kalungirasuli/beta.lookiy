// 'use client';

// import { useState, useRef, useEffect, useCallback } from 'react';
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import SingleVideo from './SingleVideo';
// import SingleImage from './SingleImage';
// import MediaModal from './MediaModal';

// interface MediaItem {
//   src: string;
//   type?: 'image' | 'video';
//   poster?: string;
//   alt?: string;
// }

// interface MediaCarouselProps {
//   media: (string | MediaItem)[];
//   alt?: string;
//   className?: string;
//   onMediaClick?: (index: number) => void;
// }

// export default function MediaCarousel({ 
//   media, 
//   alt = "Carousel media",
//   className = "",
//   onMediaClick
// }: MediaCarouselProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);
//   const [containerWidth, setContainerWidth] = useState(0);
//   const [mediaWidth, setMediaWidth] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalStartIndex, setModalStartIndex] = useState(0);
//   const carouselRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Normalize media items
//   const normalizedMedia: MediaItem[] = media.map((item) => {
//     if (typeof item === 'string') {
//       const isVideo = item.match(/\.(mp4|webm|ogg|mov|avi)$/i);
//       return {
//         src: item,
//         type: isVideo ? 'video' : 'image',
//         alt: alt
//       };
//     }
//     return {
//       ...item,
//       type: item.type || (item.src.match(/\.(mp4|webm|ogg|mov|avi)$/i) ? 'video' : 'image'),
//       alt: item.alt || alt
//     };
//   });

//   // Handle media click
//   const handleMediaClick = (index: number) => {
//     if (onMediaClick) {
//       onMediaClick(index);
//     } else {
//       setModalStartIndex(index);
//       setIsModalOpen(true);
//     }
//   };

//   // Calculate dynamic media width based on container
//   const calculateMediaWidth = useCallback(() => {
//     if (!containerRef.current) return;
    
//     const container = containerRef.current;
//     const containerWidth = container.offsetWidth;
    
//     // If container width is 0, set default values and return
//     if (containerWidth === 0) {
//       setContainerWidth(300); // Default fallback
//       setMediaWidth(150); // Default fallback
//       return;
//     }
    
//     const padding = 32; // Total horizontal padding (16px each side)
//     const gap = containerWidth < 640 ? 8 : 16; // Gap between media items
//     const minItems = containerWidth < 640 ? 1.5 : containerWidth < 768 ? 2 : 2.5; // Minimum visible items
    
//     // Calculate optimal media width to show desired number of items
//     const availableWidth = containerWidth - padding;
//     const calculatedWidth = Math.floor((availableWidth - (gap * (minItems - 1))) / minItems);
    
//     // Set minimum and maximum constraints
//     const minWidth = 120;
//     const maxWidth = containerWidth < 640 ? 200 : containerWidth < 768 ? 220 : 280;
    
//     const finalWidth = Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
    
//     setContainerWidth(containerWidth);
//     setMediaWidth(finalWidth);
//   }, []);

//   // Update dimensions on mount and resize
//   useEffect(() => {
//     // Use setTimeout to ensure DOM is fully rendered
//     const timer = setTimeout(() => {
//       calculateMediaWidth();
//     }, 100);

//     const handleResize = () => {
//       calculateMediaWidth();
//     };

//     window.addEventListener('resize', handleResize);
    
//     return () => {
//       clearTimeout(timer);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [calculateMediaWidth]);

//   // Navigation functions
//   const goToPrevious = useCallback(() => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? normalizedMedia.length - 1 : prevIndex - 1
//     );
//   }, [normalizedMedia.length]);

//   const goToNext = useCallback(() => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === normalizedMedia.length - 1 ? 0 : prevIndex + 1
//     );
//   }, [normalizedMedia.length]);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'ArrowLeft') {
//         goToPrevious();
//       } else if (e.key === 'ArrowRight') {
//         goToNext();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [goToPrevious, goToNext]);

//   // Mouse drag handlers
//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (!carouselRef.current) return;
//     setIsDragging(true);
//     setStartX(e.pageX - carouselRef.current.offsetLeft);
//     setScrollLeft(carouselRef.current.scrollLeft);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging || !carouselRef.current) return;
//     e.preventDefault();
//     const x = e.pageX - carouselRef.current.offsetLeft;
//     const walk = (x - startX) * 2;
//     carouselRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleMouseUp = () => {
//     if (!isDragging || !carouselRef.current) return;
    
//     setIsDragging(false);
    
//     // Snap to nearest media item
//     const gap = containerWidth < 640 ? 8 : 16;
//     const scrollPosition = carouselRef.current.scrollLeft;
//     const nearestIndex = Math.round(scrollPosition / (mediaWidth + gap));
//     const clampedIndex = Math.max(0, Math.min(nearestIndex, normalizedMedia.length - 1));
    
//     setCurrentIndex(clampedIndex);
//   };

//   // Touch handlers for mobile
//   const handleTouchStart = (e: React.TouchEvent) => {
//     if (!carouselRef.current) return;
//     setIsDragging(true);
//     setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
//     setScrollLeft(carouselRef.current.scrollLeft);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     if (!isDragging || !carouselRef.current) return;
//     const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
//     const walk = (x - startX) * 2;
//     carouselRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleTouchEnd = () => {
//     handleMouseUp();
//   };

//   // Smooth scroll to current media item
//   useEffect(() => {
//     if (!carouselRef.current || mediaWidth === 0) return;
    
//     const gap = containerWidth < 640 ? 8 : 16;
//     const scrollPosition = currentIndex * (mediaWidth + gap);
    
//     carouselRef.current.scrollTo({
//       left: scrollPosition,
//       behavior: 'smooth'
//     });
//   }, [currentIndex, mediaWidth, containerWidth]);

//   if (!normalizedMedia || normalizedMedia.length === 0) {
//     return null;
//   }

//   return (
//     <div ref={containerRef} className={`relative w-[90%] md:w-full mx-auto ${className}`}>
//       {/* Navigation arrows for large devices */}
//       <button
//         onClick={goToPrevious}
//         className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white/90 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
//         aria-label="Previous media"
//       >
//         <FiChevronLeft className="w-6 h-6 text-gray-800" />
//       </button>

//       <button
//         onClick={goToNext}
//         className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white/90 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
//         aria-label="Next media"
//       >
//         <FiChevronRight className="w-6 h-6 text-gray-800" />
//       </button>

//       {/* Carousel container */}
//       <div
//         ref={carouselRef}
//         className="flex overflow-x-auto scrollbar-hide px-2 sm:px-4 py-2 sm:py-4 cursor-grab active:cursor-grabbing"
//         style={{ 
//           scrollbarWidth: 'none', 
//           msOverflowStyle: 'none',
//           gap: `${containerWidth < 640 ? 8 : 16}px`,
//           height: `${Math.max(240, containerWidth * 0.4)}px`
//         }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       >
//         {normalizedMedia.map((mediaItem, index) => (
//           <div
//             key={index}
//             className="flex-shrink-0 relative"
//             style={{ 
//               width: `${mediaWidth}px`,
//               height: '90%'
//             }}
//             onClick={() => setCurrentIndex(index)}
//           >
//             {mediaItem.type === 'video' ? (
//               <SingleVideo
//                 src={mediaItem.src}
//                 alt={mediaItem.alt || `${alt} ${index + 1}`}
//                 poster={mediaItem.poster}
//                 className={`w-full h-full transition-all duration-300 ${
//                   index === currentIndex 
//                     ? 'scale-100 opacity-100' 
//                     : 'scale-95 opacity-70 hover:opacity-85'
//                 }`}
//                 muted={true}
//                 autoPlay={false}
//                 controls={index === currentIndex}
//                 onClick={(e) => {
//                   // Prevent click from bubbling to parent which would trigger modal
//                   e.stopPropagation();
//                   // Only handle media click if not clicking on video controls
//                   if (e.target === e.currentTarget) {
//                     handleMediaClick(index);
//                   }
//                 }}
//               />
//             ) : (
//               <SingleImage
//                 src={mediaItem.src}
//                 alt={mediaItem.alt || `${alt} ${index + 1}`}
//                 className={`w-full h-full transition-all duration-300 ${
//                   index === currentIndex 
//                     ? 'scale-100 opacity-100' 
//                     : 'scale-95 opacity-70 hover:opacity-85'
//                 }`}
//                 onClick={() => handleMediaClick(index)}
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Dots indicator */}
//       <div className="flex justify-center mt-4 space-x-2">
//         {normalizedMedia.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             className={`w-3 h-3 rounded-full transition-all duration-200 ${
//               index === currentIndex
//                 ? 'bg-orange-600 scale-110'
//                 : 'bg-gray-300 hover:bg-gray-400'
//             }`}
//             aria-label={`Go to media ${index + 1}`}
//           />
//         ))}
//       </div>

//       {/* Media counter */}
//       <div className="text-center mt-2 text-sm text-gray-600">
//         {currentIndex + 1} / {normalizedMedia.length}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <MediaModal
//           media={normalizedMedia}
//           initialIndex={modalStartIndex}
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// }