// import React from 'react';
// import Image from 'next/image';

// interface PostImageProps {
//   data: string[];
//   className?: string;
// }

// const ImageCard = ({ src, alt }: { src: string; alt: string }) => (
//   <div className="relative w-full h-full overflow-hidden rounded-md border-2 border-gray-300">
//     <Image
//       src={src}
//       alt={`${alt} background`}
//       fill
//       className="object-cover blur-lg scale-150"
//       priority={false}
//     />
//     <div className="absolute inset-0 bg-white/30" />
//     <div className="relative flex items-center justify-center h-full bg-white">
//       <Image
//         src={src}
//         alt={alt}
//         fill
//         className="object-contain p-1"
//       />
//     </div>
//   </div>
// );

// export default function PostImage({ data, className = "" }: PostImageProps) {
//   const renderImageLayout = () => {
//     const imageCount = data.length;

//     if (imageCount === 0) return null;

//     if (imageCount === 1) {
//       return (
//         <div className="relative w-full overflow-hidden rounded-md border-2 border-gray-300 flex justify-center items-center" style={{ maxHeight: '500px' }}>
//           <div className="absolute inset-0">
//             <Image
//               src={data[0]}
//               alt="background"
//               fill
//               className="object-cover blur-lg"
//               priority={false}
//             />
//             <div className="absolute inset-0 bg-white/30" />
//           </div>
//           <Image
//             src={data[0]}
//             alt='Post image'
//             width={2000}
//             height={2000}
//             className="relative object-contain bg-white"
//             style={{ maxHeight: '500px', maxWidth: '100%', width: 'auto', height: 'auto' }}
//           />
//         </div>
//       );
//     }

//     const GridWrapper = ({ children, gridClasses }: { children: React.ReactNode; gridClasses: string }) => (
//       <div className="w-full max-h-[500px] aspect-square">
//         <div className={`${gridClasses} w-full h-full`}>
//           {children}
//         </div>
//       </div>
//     );

//     if (imageCount === 2) {
//       return (
//         <GridWrapper gridClasses="grid grid-cols-2 gap-1">
//           {data.slice(0, 2).map((src, id) => (
//             <ImageCard key={id} src={src} alt={`Post image ${id + 1}`} />
//           ))}
//         </GridWrapper>
//       );
//     }

//     if (imageCount === 3) {
//       return (
//         <GridWrapper gridClasses="grid grid-cols-2 grid-rows-2 gap-1">
//           <div className="row-span-2">
//             <ImageCard src={data[0]} alt="Post image 1" />
//           </div>
//           <ImageCard src={data[1]} alt="Post image 2" />
//           <ImageCard src={data[2]} alt="Post image 3" />
//         </GridWrapper>
//       );
//     }

//     if (imageCount === 4) {
//       return (
//         <GridWrapper gridClasses="grid grid-cols-2 grid-rows-2 gap-1">
//           {data.slice(0, 4).map((src, id) => (
//             <ImageCard key={id} src={src} alt={`Post image ${id + 1}`} />
//           ))}
//         </GridWrapper>
//       );
//     }

//     if (imageCount >= 5) {
//       return (
//         <GridWrapper gridClasses="grid grid-cols-2 grid-rows-2 gap-1">
//           {data.slice(0, 3).map((src, id) => (
//             <ImageCard key={id} src={src} alt={`Post image ${id + 1}`} />
//           ))}
//           <div className="relative">
//             <ImageCard src={data[3]} alt="Post image 4" />
//             <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
//                 <span className="text-xl font-bold text-gray-800">+{imageCount - 4}</span>
//               </div>
//             </div>
//           </div>
//         </GridWrapper>
//       );
//     }
//   };

//   return (
//     <div className={`w-full ${className}`}>
//       {renderImageLayout()}
//     </div>
//   );
// }