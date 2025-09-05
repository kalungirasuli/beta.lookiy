import Image from 'next/image';
import { Network } from '@/types/network';
import { motion } from 'framer-motion';

interface NetworkCardProps {
  network: Network;
  isLast?: boolean;
  onClick?: (network: Network) => void;
}

export default function NetworkCard({ network, isLast = false, onClick }: NetworkCardProps) {
  return (
    <motion.div 
      className="relative p-3 sm:p-4 w-full text-left cursor-pointer rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 hover:shadow-lg hover:shadow-accent/10"
      onClick={() => onClick?.(network)}
    >
      <div className="flex items-center">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0 mr-4">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12">
              {/* Single solid ring */}
              <div className="absolute inset-0 rounded-full border-2 border-accent/30 scale-110" />
              
              {/* Main icon container */}
              <div 
                className="relative h-full w-full rounded-full bg-accent/10 flex items-center justify-center overflow-hidden flex-shrink-0 z-10"
              >
                {/* Fallback icon if network.icon is not available */}
                {!network.icon ? (
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 sm:h-7 sm:w-7 text-accent" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </motion.svg>
                ) : (
                  <Image 
                    src={network.icon} 
                    alt={`${network.name} group icon`}
                    width={48}
                    height={48}
                    className="object-cover h-full w-full"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className={`flex-1 min-w-0 ${!isLast ? 'border-b border-gray-200 pb-3 sm:pb-4' : ''}`}>
            <h3 
              className="font-semibold text-sm sm:text-base text-gray-800 truncate"
            >
              {network.name}
            </h3>
            <p 
              className="text-xs sm:text-sm text-gray-500"
            >
              {network.nodeCount.toLocaleString()} members
            </p>
          </div>
          
          {/* View icon */}
          <div className="flex-shrink-0 ml-3">
            <div 
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-accent/10 hover:shadow-md transition-all duration-200"
            >
              <svg className="w-4 h-4 text-gray-600 hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}