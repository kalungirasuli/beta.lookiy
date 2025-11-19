// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';

// // Global video manager to handle multiple videos
// let globalVideoManager: {
//   currentVideo: HTMLVideoElement | null;
//   pauseOthers: (currentVideo: HTMLVideoElement) => void;
// } = {
//   currentVideo: null,
//   pauseOthers: (currentVideo: HTMLVideoElement) => {
//     // Pause all other videos when a new one starts
//     const allVideos = document.querySelectorAll('video');
//     allVideos.forEach(video => {
//       if (video !== currentVideo && !video.paused) {
//         video.pause();
//       }
//     });
//     globalVideoManager.currentVideo = currentVideo;
//   }
// };

// interface SingleVideoProps {
//   src: string;
//   alt?: string;
//   className?: string;
//   poster?: string;
//   autoPlay?: boolean;
//   muted?: boolean;
//   controls?: boolean;
//   onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
//   style?: React.CSSProperties;
// }

// const SingleVideo: React.FC<SingleVideoProps> = ({
//   src,
//   alt = 'Video content',
//   className = '',
//   poster,
//   autoPlay = false,
//   muted = true,
//   controls = false,
//   onClick,
//   style
// }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);
//   const [isMuted, setIsMuted] = useState(muted);
//   const [showControls, setShowControls] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const updateTime = () => {
//       if (!isDragging) {
//         setCurrentTime(video.currentTime);
//       }
//     };

//     const updateDuration = () => {
//       setDuration(video.duration);
//     };

//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };

//     video.addEventListener('timeupdate', updateTime);
//     video.addEventListener('loadedmetadata', updateDuration);
//     video.addEventListener('durationchange', updateDuration);
//     document.addEventListener('fullscreenchange', handleFullscreenChange);

//     return () => {
//       video.removeEventListener('timeupdate', updateTime);
//       video.removeEventListener('loadedmetadata', updateDuration);
//       video.removeEventListener('durationchange', updateDuration);
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, [isDragging]);

//   const togglePlay = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         // Pause other videos before playing this one
//         globalVideoManager.pauseOthers(videoRef.current);
//         videoRef.current.play();
//         setHasStarted(true);
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   const toggleFullscreen = async () => {
//     if (!containerRef.current) return;

//     try {
//       if (!document.fullscreenElement) {
//         await containerRef.current.requestFullscreen();
//       } else {
//         await document.exitFullscreen();
//       }
//     } catch (error) {
//       console.error('Error toggling fullscreen:', error);
//     }
//   };

//   const handleVideoEnd = () => {
//     setIsPlaying(false);
//   };

//   const handleVideoPlay = () => {
//     if (videoRef.current) {
//       // Pause other videos when this one starts playing
//       globalVideoManager.pauseOthers(videoRef.current);
//     }
//     setIsPlaying(true);
//     setHasStarted(true);
//   };

//   const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!videoRef.current || !duration) return;
    
//     const rect = e.currentTarget.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;
//     const percentage = clickX / rect.width;
//     const newTime = percentage * duration;
    
//     videoRef.current.currentTime = newTime;
//     setCurrentTime(newTime);
//   };

//   const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     setIsDragging(true);
//     handleSeek(e);
//   };

//   const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (isDragging) {
//       handleSeek(e);
//     }
//   };

//   const handleProgressMouseUp = () => {
//     setIsDragging(false);
//   };

//   const formatTime = (time: number) => {
//     if (isNaN(time)) return '0:00';
    
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

//   return (
//     <div 
//       ref={containerRef}
//       className={`relative group overflow-hidden rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] ${className} ${isFullscreen ? 'bg-black' : ''}`}
//       onMouseEnter={() => setShowControls(true)}
//       onMouseLeave={() => setShowControls(false)}
//       onClick={(e) => {
//         // Prevent event propagation to parent elements
//         e.stopPropagation();
//         // Call the onClick handler if provided
//         if (onClick) onClick(e);
//       }}
//     >
//       <video
//         ref={videoRef}
//         src={src}
//         poster={!hasStarted ? poster : undefined}
//         autoPlay={autoPlay}
//         muted={isMuted}
//         controls={controls}
//         playsInline
//         className={`w-full h-full object-cover ${isFullscreen ? 'object-contain' : ''}`}
//         onEnded={handleVideoEnd}
//         onPlay={handleVideoPlay}
//         onPause={() => setIsPlaying(false)}
//         aria-label={alt}
//         onClick={(e) => {
//           // Prevent click from bubbling to parent
//           e.stopPropagation();
//           if (!controls) {
//             togglePlay();
//           }
//         }}
//       />
      
//       {/* Persistent Play Button Overlay */}
//       {!controls && (
//         <>
//           {/* Main Play/Pause Button - Always visible when not playing */}
//           {!isPlaying && (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <button
//                 onClick={togglePlay}
//                 className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
//                 aria-label="Play video"
//               >
//                 <FaPlay className="w-8 h-8 text-gray-800 ml-1" />
//               </button>
//             </div>
//           )}
          
//           {/* Controls overlay when playing - removed black background */}
//           {isPlaying && (
//             <div className={`absolute inset-0 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
//               {/* Play/Pause Button */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <button
//                   onClick={togglePlay}
//                   className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
//                   aria-label="Pause video"
//                 >
//                   <FaPause className="w-6 h-6 text-gray-800" />
//                 </button>
//               </div>
              
//               {/* Bottom Controls */}
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
//                 {/* Progress Bar */}
//                 <div className="mb-2">
//                   <div 
//                     className="w-full h-2 bg-white/30 rounded-full cursor-pointer relative"
//                     onMouseDown={handleProgressMouseDown}
//                     onMouseMove={handleProgressMouseMove}
//                     onMouseUp={handleProgressMouseUp}
//                     onMouseLeave={handleProgressMouseUp}
//                   >
//                     <div 
//                       className="h-full bg-white rounded-full transition-all duration-100"
//                       style={{ width: `${progressPercentage}%` }}
//                     />
//                     <div 
//                       className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg cursor-pointer"
//                       style={{ left: `calc(${progressPercentage}% - 6px)` }}
//                     />
//                   </div>
//                 </div>
                
//                 {/* Controls Row */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={toggleMute}
//                       className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
//                       aria-label={isMuted ? 'Unmute video' : 'Mute video'}
//                     >
//                       {isMuted ? (
//                         <FaVolumeMute className="w-4 h-4 text-gray-800" />
//                       ) : (
//                         <FaVolumeUp className="w-4 h-4 text-gray-800" />
//                       )}
//                     </button>
//                   </div>
                  
//                   <div className="flex items-center space-x-3">
//                     {/* Time Display */}
//                     <div className="text-white text-sm font-medium">
//                       {formatTime(currentTime)} / {formatTime(duration)}
//                     </div>
                    
//                     {/* Fullscreen Button */}
//                     <button
//                       onClick={toggleFullscreen}
//                       className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
//                       aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
//                     >
//                       {isFullscreen ? (
//                         <FaCompress className="w-4 h-4 text-gray-800" />
//                       ) : (
//                         <FaExpand className="w-4 h-4 text-gray-800" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default SingleVideo;