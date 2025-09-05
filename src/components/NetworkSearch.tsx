'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import NetworkCard from './NetworkCard';
import NetworkModal from './NetworkModal';
import { Network } from '@/types/network';
import { motion, AnimatePresence } from 'framer-motion';

// Mock API response for demonstration
const mockNetworks: Network[] = [
  {
    id: 'network1',
    name: 'Decentralized Cloud',
    icon: '/network-icons/cloud.svg', // This would be a real icon in production
    nodeCount: 1247,
    joinLink: '/join/network1',
    creator: 'CloudTech Solutions',
    description: 'A distributed cloud computing network that provides scalable infrastructure for modern applications. Join thousands of nodes worldwide to contribute computing power and earn rewards.',
    isPrivate: false
  },
  {
    id: 'network2',
    name: 'Global Mesh',
    icon: '/network-icons/mesh.svg',
    nodeCount: 856,
    joinLink: '/join/network2',
    creator: 'MeshNet Foundation',
    description: 'A peer-to-peer mesh network connecting devices globally without traditional internet infrastructure. Perfect for resilient communication in remote areas.',
    isPrivate: false
  },
  {
    id: 'network3',
    name: 'Secure Tunnel',
    icon: '/network-icons/tunnel.svg',
    nodeCount: 2103,
    joinLink: '/join/network3',
    creator: 'SecureNet Inc.',
    description: 'Enterprise-grade secure tunneling network providing encrypted connections for businesses. Ensure your data remains private with military-grade encryption.',
    isPrivate: true
  },
  {
    id: 'network4',
    name: 'Private Network',
    icon: '/network-icons/private.svg',
    nodeCount: 512,
    joinLink: '/join/network4',
    creator: 'PrivacyFirst Collective',
    description: 'A privacy-focused network for individuals who value anonymity and data protection. Connect securely without compromising your digital footprint.',
    isPrivate: true
  },
];

// Simulate API call with delay
const searchNetworks = async (query: string): Promise<Network[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query) return [];
  
  // Filter networks based on query
  return mockNetworks.filter(network => 
    network.name.toLowerCase().includes(query.toLowerCase())
  );
};

export default function NetworkSearch() {
  const [query, setQuery] = useState('');
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<any>(null);

  // Keep track of previous search results for smooth transitions
  const prevNetworksRef = useRef<Network[]>([]);
  // Track if the current search has no results to show create option
  const [hasNoResults, setHasNoResults] = useState(false);
  
  // Modal state
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNetworkClick = (network: Network) => {
    setSelectedNetwork(network);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNetwork(null);
  };

  const handleJoinNetwork = (network: Network) => {
    console.log(`Joining network: ${network.name}`);
    alert(`Joining ${network.name}!`);
    handleCloseModal();
  };

  useEffect(() => {
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Don't search if query is empty
    if (query.length < 1) {
      setNetworks([]);
      setIsSearching(false);
      setHasNoResults(false);
      return;
    }

    // Only set searching state if we don't have previous results
    if (networks.length === 0) {
      setIsSearching(true);
    }
    
    // Debounce search with 300ms delay
    searchTimeout.current = setTimeout(async () => {
      // Only show loading if we don't have previous results to display
      if (networks.length === 0) {
        setIsLoading(true);
      }
      
      try {
        const results = await searchNetworks(query);
        
        // Only update state if matches are found to prevent unnecessary re-renders
        if (results.length > 0) {
          setNetworks(results);
          prevNetworksRef.current = results;
          setIsLoading(false);
          setIsSearching(true);
          setHasNoResults(false);
        } else {
          // If no results found, show create option but don't update networks
          setHasNoResults(true);
          if (networks.length === 0) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Search failed:', error);
        // Only update loading state if we were showing loading
        if (networks.length === 0) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query, networks.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto relative px-4 sm:px-6 md:px-0"
    >
      <form onSubmit={(e) => e.preventDefault()} className="w-full relative">
        <motion.input
          type="text"
          placeholder="Enter network name or link..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl sm:rounded-3xl border-2 border-accent/60 
                     shadow-input focus:outline-none text-gray-900
                     transition-all duration-300 bg-white/95 backdrop-blur-glass
                     hover:border-accent/80 focus:border-accent hover:shadow-lg
                     focus:animate-input-glow focus:ring-0 placeholder:text-gray-500"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </form>

      {query.length > 0 && (
        <motion.div 
          className="mt-6 transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 sm:p-5 overflow-hidden">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto search-results-container" style={{ overscrollBehavior: 'contain' }}>
      
        {/* Loading state */}
        {isLoading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full"></div>
          </motion.div>
        )}
        
        {/* Results container */}
        {!isLoading && query.length >= 1 && (
          <div>
            {/* Search results - show if any exist */}
            {networks.length > 0 && (
              <div>
                <div className="border-b border-white/30 py-2 px-4 bg-white/10 backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-700">Existing Networks</p>
                </div>
                <div className="pt-3">
                  <AnimatePresence initial={false}>
                    {networks.map((network, index) => (
                      <motion.div 
                        key={network.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="text-left"
                      >
                        <NetworkCard 
                          network={network} 
                          isLast={index === networks.length - 1}
                          onClick={handleNetworkClick}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Create network option - only show when no exact matches found */}
            {networks.length === 0 && !networks.some(network => 
              network.name.toLowerCase() === query.toLowerCase()
            ) && (
              <motion.div 
                key="create-network"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => {
                    console.log(`Creating new network: ${query}`);
                    // Here you would typically navigate to create network page or open a modal
                    alert(`Creating network: "${query}"`);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Create "{query}"</h3>
                      <p className="text-sm text-gray-500">Set up a new network with this name</p>
                    </div>
                    <div className="text-accent">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

            </div>
          </div>
        </motion.div>
      )}

      {/* Network Details Modal */}
      <NetworkModal
        network={selectedNetwork}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onJoin={handleJoinNetwork}
      />
    </motion.div>
  );
}