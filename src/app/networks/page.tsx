'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import NetworkCard from '@/components/NetworkCard';
import NetworkSearch from '@/components/NetworkSearch';
import NetworkModal from '@/components/NetworkModal';
import type { Network } from '@/types/network';

const suggestedNetworks: Network[] = [
  {
    id: '1',
    name: 'Tech Enthusiasts',
    description: 'Connect with fellow tech lovers and stay updated with latest trends',
    nodeCount: 1234,
    isPrivate: false,
    icon: '/network-icons/cloud.svg',
    joinLink: '/join/tech-enthusiasts',
    creator: 'TechFounder'
  },
  {
    id: '2',
    name: 'Creative Minds',
    description: 'A space for artists, designers, and creative professionals',
    nodeCount: 856,
    isPrivate: false,
    icon: '/network-icons/mesh.svg',
    joinLink: '/join/creative-minds',
    creator: 'ArtistPro'
  },
  {
    id: '3',
    name: 'Startup Network',
    description: 'Entrepreneurs and startup enthusiasts sharing knowledge',
    nodeCount: 567,
    isPrivate: true,
    icon: '/network-icons/private.svg',
    joinLink: '/join/startup-network',
    creator: 'StartupGuru'
  },
  {
    id: '4',
    name: 'Remote Workers',
    description: 'Community for remote workers and digital nomads',
    nodeCount: 2341,
    isPrivate: false,
    icon: '/network-icons/tunnel.svg',
    joinLink: '/join/remote-workers',
    creator: 'RemoteLeader'
  }
];

export default function NetworksHome() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const filteredNetworks = suggestedNetworks;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-blue-50 via-orange-50 to-white">
      {/* Background Grid */}
      <div className="fixed inset-0 -z-5 overflow-hidden">
        <div className="w-full h-full grid grid-cols-6 grid-rows-6 opacity-15 gap-0">
          {Array.from({ length: 36 }).map((_, index) => (
            <div 
              key={index} 
              className="border border-gray-200 flex items-center justify-center bg-white bg-opacity-5"
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Welcome Header */}
        <motion.div 
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6"
            variants={itemVariants}
          >
            Find Your <span className="text-orange-500">Network</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join networks that match your interests and connect with like-minded individuals
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="max-w-2xl mx-auto mb-12"
          variants={itemVariants}
        >
          <NetworkSearch />
        </motion.div>

        {/* Networks Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredNetworks.map((network) => (
            <motion.div
              key={network.id}
              variants={itemVariants}
            >
              <NetworkCard
                network={network}
                onClick={() => setSelectedNetwork(network)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results Message */}
        {filteredNetworks.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-600">No networks found matching your search.</p>
          </motion.div>
        )}

        {/* Network Modal */}
        <AnimatePresence>
          {selectedNetwork && (
            <NetworkModal
              network={selectedNetwork}
              isOpen={selectedNetwork !== null}
              onClose={() => setSelectedNetwork(null)}
              onJoin={(network) => {
                console.log(`Joining network: ${network.name}`);
                setSelectedNetwork(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}