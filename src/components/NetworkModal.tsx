// 'use client';

// import { Network } from '@/types/network';
// import { motion, AnimatePresence } from 'framer-motion';
// import Image from 'next/image';

// interface NetworkModalProps {
//   network: Network | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onJoin: (network: Network) => void;
// }

// export default function NetworkModal({ network, isOpen, onClose, onJoin }: NetworkModalProps) {
//   if (!network) return null;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
//             onClick={onClose}
//           />
          
//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: 20 }}
//             transition={{ type: "spring", stiffness: 300, damping: 25 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//           >
//             <div className="bg-white/70 backdrop-blur-glass border border-accent/10 rounded-2xl shadow-glass max-w-md w-full max-h-[90vh] overflow-y-auto">
//               {/* Header */}
//               <div className="p-6 border-b border-gray-100/50">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden">
//                       {network.icon ? (
//                         <Image 
//                           src={network.icon} 
//                           alt={`${network.name} icon`}
//                           width={80}
//                           height={80}
//                           className="object-cover h-full w-full"
//                         />
//                       ) : (
//                         <svg 
//                           xmlns="http://www.w3.org/2000/svg" 
//                           className="h-10 w-10 text-accent" 
//                           viewBox="0 0 20 20" 
//                           fill="currentColor"
//                         >
//                           <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
//                         </svg>
//                       )}
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-900 truncate">{network.name}</h2>
//                       <p className="text-sm text-gray-500">by {network.creator}</p>
//                       <div className="flex items-center space-x-3 mt-1">
//                         <span className="text-sm font-medium text-accent">{network.nodeCount.toLocaleString()} members</span>
//                         <span className={`text-xs px-2 py-1 rounded-full ${network.isPrivate ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                           {network.isPrivate ? 'Private' : 'Public'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={onClose}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                   >
//                     <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="p-6">
//                 {/* Description */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-3">About this Network</h3>
//                   <p className="text-gray-700 leading-relaxed">{network.description}</p>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="p-6 border-t border-gray-100/50 flex space-x-3">
//                 <button
//                   onClick={onClose}
//                   className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => onJoin(network)}
//                   className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
//                 >
//                   Join Network
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }