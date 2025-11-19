// 'use client';

// import NetworkSearch from './NetworkSearch';
// import { TypeAnimation } from 'react-type-animation';
// import Image from 'next/image';

// export default function Hero() {
//   return (
//     <section className="w-full min-h-screen py-10 md:py-16 lg:py-24 px-4 md:px-6 lg:px-12 flex flex-col items-center justify-center relative ">
//       <div className="max-w-5xl mx-auto text-center mb-12 animate-fade-in">
//         <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-8xl xl:text-8xl font-bold mb-4 md:mb-8 text-black tracking-tight">
//           Discover and Join Networks <br/>{' '}
//           <TypeAnimation
//             sequence={[
//               'Instantly',
//               2000,
//               'Securely',
//               2000,
//               'Globally',
//               2000,
//             ]}
//             wrapper="span"
//             speed={10}
//             repeat={Infinity}
//             className="text-accent text-5xl sm:text-6xl md:text-7xl xl:text-9xl font-bold"
//           />
//         </h1>
//         <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto px-2">
//           Search for networks in real-time and connect with nodes around the world. 
//           Enter a network name to get started.
//         </p>
//       </div>
      
//       <NetworkSearch />
      
//       {/* Floating elements for visual interest */}
//       <div className="absolute top-1/4 left-1/6 w-24 h-24 rounded-full bg-accent/5 animate-float" 
//            style={{ animationDelay: '0s' }}></div>
//       <div className="absolute bottom-1/3 right-1/6 w-32 h-32 rounded-full bg-accent/5 animate-float" 
//            style={{ animationDelay: '1s' }}></div>
//       <div className="absolute top-2/3 left-1/3 w-16 h-16 rounded-full bg-black/5 animate-float" 
//            style={{ animationDelay: '2s' }}></div>
//       <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-accent/10 animate-float" 
//            style={{ animationDelay: '1.5s' }}></div>
//       <div className="absolute bottom-1/4 left-1/5 w-28 h-28 rounded-full bg-black/5 animate-float" 
//            style={{ animationDelay: '0.7s' }}></div>
//       <div className="absolute top-1/2 right-1/3 w-12 h-12 rounded-full bg-accent/5 animate-float" 
//            style={{ animationDelay: '2.5s' }}></div>
           

//     </section>
//   );
// }