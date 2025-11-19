// 'use client';

// import { useState, useRef, useEffect, useCallback } from 'react';
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// interface ImageCarouselProps {
//   images: string[];
//   alt?: string;
//   className?: string;
// }

// export default function ImageCarousel({ 
//   images, 
//   alt = "Carousel image",
//   className = ""
// }: ImageCarouselProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);
//   const [containerWidth, setContainerWidth] = useState(0);
//   const [imageWidth, setImageWidth] = useState(0);
//   const carouselRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Calculate dynamic image width based on container
//   const calculateImageWidth = useCallback(() => {
//     if (!containerRef.current) return;
    
//     const container = containerRef.current;
//     const containerWidth = container.offsetWidth;
    
//     // If container width is 0, set default values and return
//     if (containerWidth === 0) {
//       setContainerWidth(300); // Default fallback
//       setImageWidth(150); // Default fallback
//       return;
//     }
    
//     const padding = 32; // Total horizontal padding (16px each side)
//     const gap = containerWidth < 640 ? 8 : 16; // Gap between images
//     const minImages = containerWidth < 640 ? 1.5 : containerWidth < 768 ? 2 : 2.5; // Minimum visible images
    
//     // Calculate optimal image width to show desired number of images
//     const availableWidth = containerWidth - padding;
//     const calculatedWidth = Math.floor((availableWidth - (gap * (minImages - 1))) / minImages);
    
//     // Set minimum and maximum constraints
//     const minWidth = 120;
//     const maxWidth = containerWidth < 640 ? 200 : containerWidth < 768 ? 220 : 280;
    
//     const finalWidth = Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
    
//     setContainerWidth(containerWidth);
//     setImageWidth(finalWidth);
//   }, []);

//   // Update dimensions on mount and resize
//   useEffect(() => {
//     // Use setTimeout to ensure DOM is fully rendered
//     const timer = setTimeout(() => {
//       calculateImageWidth();
//     }, 0);
    
//     const handleResize = () => {
//       calculateImageWidth();
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => {
//       clearTimeout(timer);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [calculateImageWidth]);

//   // Navigate to previous image
//   const goToPrevious = useCallback(() => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   }, [images.length]);

//   // Navigate to next image
//   const goToNext = useCallback(() => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     );
//   }, [images.length]);

//   // Handle keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === 'ArrowLeft') {
//         goToPrevious();
//       } else if (event.key === 'ArrowRight') {
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
    
//     // Snap to nearest image
//     const gap = containerWidth < 640 ? 8 : 16;
//     const scrollPosition = carouselRef.current.scrollLeft;
//     const nearestIndex = Math.round(scrollPosition / (imageWidth + gap));
//     const clampedIndex = Math.max(0, Math.min(nearestIndex, images.length - 1));
    
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

//   // Smooth scroll to current image
//   useEffect(() => {
//     if (!carouselRef.current || imageWidth === 0) return;
    
//     const gap = containerWidth < 640 ? 8 : 16;
//     const scrollPosition = currentIndex * (imageWidth + gap);
    
//     carouselRef.current.scrollTo({
//       left: scrollPosition,
//       behavior: 'smooth'
//     });
//   }, [currentIndex, imageWidth, containerWidth]);

//   if (!images || images.length === 0) {
//     return null;
//   }

//   return (
//     <div ref={containerRef} className={`relative w-[90%] md:w-full mx-auto ${className}`}>
//       {/* Navigation arrows for large devices */}
//       <button
//         onClick={goToPrevious}
//         className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white/90 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
//         aria-label="Previous image"
//       >
//         <FiChevronLeft className="w-6 h-6 text-gray-800" />
//       </button>

//       <button
//         onClick={goToNext}
//         className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white/90 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
//         aria-label="Next image"
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
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="flex-shrink-0 relative"
//             style={{ 
//               width: `${imageWidth}px`,
//               height: '90%'
//             }}
//             onClick={() => setCurrentIndex(index)}
//           >
//             <img
//               src={image}
//               alt={`${alt} ${index + 1}`}
//               className={`w-full h-full rounded-lg shadow-md transition-all duration-300 object-cover ${
//                 index === currentIndex 
//                   ? 'scale-100 opacity-100' 
//                   : 'scale-95 opacity-70 hover:opacity-85'
//               }`}
//               draggable={false}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Dots indicator */}
//       <div className="flex justify-center mt-4 space-x-2">
//         {images.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             className={`w-3 h-3 rounded-full transition-all duration-200 ${
//               index === currentIndex
//                 ? 'bg-orange-600 scale-110'
//                 : 'bg-gray-300 hover:bg-gray-400'
//             }`}
//             aria-label={`Go to image ${index + 1}`}
//           />
//         ))}
//       </div>

//       {/* Image counter */}
//       <div className="text-center mt-2 text-sm text-gray-600">
//         {currentIndex + 1} / {images.length}
//       </div>
//     </div>
//   );
// }