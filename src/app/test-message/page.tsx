'use client';

import MessageBubble from '@/components/Messagebubble';
import AudioRecord from '@/components/Audiorecord';
import { audio } from 'framer-motion/client';

export default function TestMessagePage() {
  const sampleMessages = [
    {
      id: '1',
      text: 'Hey everyone! Just wanted to share some exciting news about our upcoming project launch. We\'ve been working really hard on this and can\'t wait to show you what we\'ve built!',
      author: { name: 'Alice Johnson' },
      timestamp: '2 min ago',
      isOwn: false,
      reactions: { like: 12, comment: 3, share: 2, view: 45 }
    },
    {
      id: '2',
      text: 'That sounds amazing! I\'m really excited to see what you\'ve been working on. Keep up the great work!',
      author: { name: 'You' },
      timestamp: '1 min ago',
      isOwn: true,
      reactions: { like: 5, comment: 1, share: 0, view: 12 },
      reference: {
        author: { name: 'Alice Johnson' },
        content: 'Hey everyone! Just wanted to share some exciting news about our upcoming project launch...',
        images: ['https://picsum.photos/200/300?random=10']
      }
    },
    {
      id: '3',
      text: 'Thanks for the support! We should definitely schedule a demo session soon. What do you think about next week?',
      author: { name: 'Bob Smith' },
      timestamp: '30 sec ago',
      isOwn: false,
      reactions: { like: 8, comment: 2, share: 1, view: 23 },
      reference: {
        author: { name: 'Alice Johnson' },
        content: 'Here\'s a voice message explaining the project details',
        audio: {
          duration: '1:45',
          url: '/audio/sample.mp3'
        }
      }
    },
    {
      id: '4',
      text: 'Next week works perfectly for me! Tuesday afternoon would be ideal if that fits everyone\'s schedule.',
      author: { name: 'Carol Davis' },
      timestamp: '15 sec ago',
      isOwn: false,
      reactions: { like: 3, comment: 0, share: 0, view: 8 },
      reference: {
        author: { name: 'Bob Smith' },
        content: '',
        audio: {
          duration: '0:32',
          url: '/audio/response.mp3'
        }
      },
      media: [
        'https://picsum.photos/200/300?random=6',
        { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'video' as const, poster: 'https://picsum.photos/200/300?random=7' },
        'https://picsum.photos/200/300?random=8'
      ],
      
    },
    {
      id: '5',
      text: 'Perfect! I\'ll send out calendar invites for Tuesday at 2 PM. Looking forward to showing everyone what we\'ve accomplished!',
      author: { name: 'You' },
      timestamp: 'just now',
      isOwn: true,
      reactions: { like: 2, comment: 0, share: 0, view: 4 },
      reference: {
        author: { name: 'Carol Davis' },
        content: 'Next week works perfectly for me! Tuesday afternoon would be ideal...',
        images: ['https://picsum.photos/250/200?random=12']
      },
      media: [
        { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'video' as const, poster: 'https://picsum.photos/400/300?random=1' },
      ],

    },
    {
      id: '6',
      text: 'Here\'s a quick demo video of the new features we\'ve been working on!',
      author: { name: 'Alice Johnson' },
      timestamp: 'just now',
      isOwn: false,
      reactions: { like: 15, comment: 4, share: 3, view: 67 },
      media: [
        { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'video' as const, poster: 'https://picsum.photos/500/300?random=20', alt: 'Demo video of new features' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Message Bubble Component Test</h1>
          <p className="text-gray-600">Testing the MessageBubble component with text messages, reactions, and menu functionality.</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sample Conversation with Threading</h2>
          
          <div className="space-y-4">
            {sampleMessages.map((message) => (
              
              <MessageBubble
                key={message.id}
                id={message.id}
                text={message.text}
                author={message.author}
                timestamp={message.timestamp}
                isOwn={message.isOwn}
                reactions={message.reactions}
                reference={message.reference}
                {...(message as any)}
              />
            ))}
            <AudioRecord duration="2:30" createdAt="5m" />
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Component Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Text message display with proper formatting</li>
              <li>• Author information with avatar placeholder</li>
              <li>• <strong>Reference/Threading system</strong> - Reply to specific messages with quoted content</li>
              <li>• Reaction buttons (like, comment, share, view) with toggle functionality</li>
              <li>• Menu dropdown with bookmark and report options</li>
              <li>• Different styling for own vs. other messages</li>
              <li>• Consistent homecoming design with 4px shadows</li>
              <li>• Hover effects and smooth transitions</li>
              <li>• Faded gray background for referenced messages with rounded corners</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}