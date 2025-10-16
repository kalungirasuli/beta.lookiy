'use client';

import MessageBubble from '@/components/Messagebubble';

export default function CarouselDemo() {
  const sampleImages = [
    'https://picsum.photos/200/300?random=1',
    'https://picsum.photos/200/300?random=2',
    'https://picsum.photos/200/300?random=3',
    'https://picsum.photos/200/300?random=4',
    'https://picsum.photos/200/300?random=5',
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          MessageBubble with ImageCarousel Demo
        </h1>
        
        <div className="space-y-6">
           {/* Message with single image */}
           <MessageBubble
             id="msg-1"
             text="Look at this beautiful sunset I captured! 🌅"
             author={{
               name: "Alice Johnson",
               avatar: "https://picsum.photos/40/40?random=10"
             }}
             timestamp="3 hours ago"
             isOwn={false}
             reactions={{
               like: 8,
               comment: 2,
               share: 1,
               view: 25
             }}
             images={['https://picsum.photos/400/300?random=1']}
           />

           {/* Message with multiple images */}
           <MessageBubble
             id="msg-2"
             text="Check out these amazing photos I took during my vacation! 📸"
             author={{
               name: "Alice Johnson",
               avatar: "https://picsum.photos/40/40?random=10"
             }}
             timestamp="2 hours ago"
             isOwn={false}
             reactions={{
               like: 12,
               comment: 3,
               share: 1,
               view: 45
             }}
             images={sampleImages}
           />

           {/* Message without images */}
           <MessageBubble
             id="msg-3"
             text="That's a great collection! The lighting in the third photo is perfect."
             author={{
               name: "Bob Smith",
               avatar: "https://picsum.photos/40/40?random=11"
             }}
             timestamp="1 hour ago"
             isOwn={true}
             reactions={{
               like: 5,
               comment: 0,
               share: 0,
               view: 12
             }}
           />

           {/* Another message with single image */}
           <MessageBubble
             id="msg-4"
             text="Here's my favorite shot from today 📷"
             author={{
               name: "Charlie Davis",
               avatar: "https://picsum.photos/40/40?random=12"
             }}
             timestamp="30 minutes ago"
             isOwn={false}
             reactions={{
               like: 15,
               comment: 4,
               share: 2,
               view: 38
             }}
             images={['https://picsum.photos/350/250?random=9']}
           />

           {/* Another message with different images */}
           <MessageBubble
             id="msg-5"
             text="Here are some more shots from the same trip 🌅"
             author={{
               name: "Alice Johnson",
               avatar: "https://picsum.photos/40/40?random=10"
             }}
             timestamp="15 minutes ago"
             isOwn={false}
             reactions={{
               like: 8,
               comment: 2,
               share: 0,
               view: 23
             }}
             images={[
               'https://picsum.photos/200/300?random=6',
               'https://picsum.photos/200/300?random=7',
               'https://picsum.photos/200/300?random=8'
             ]}
           />
         </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
           <h2 className="text-xl font-semibold mb-4">Integration Features:</h2>
           <ul className="space-y-2 text-gray-700">
             <li>✅ <strong>Smart Image Display:</strong> Single images use SingleImage component, multiple images use ImageCarousel</li>
             <li>✅ <strong>Single Image Features:</strong> Click to expand, hover effects, loading states, error handling</li>
             <li>✅ <strong>Carousel Features:</strong> Fixed 200px×300px size, touch/drag support, navigation controls</li>
             <li>✅ <strong>Object Contain:</strong> Images scale to fit without cropping</li>
             <li>✅ <strong>Responsive Design:</strong> Works on all screen sizes</li>
             <li>✅ <strong>Conditional Rendering:</strong> Only shows when images are provided</li>
             <li>✅ <strong>Modal Expansion:</strong> Single images can be expanded to full screen</li>
           </ul>
         </div>
      </div>
    </div>
  );
}