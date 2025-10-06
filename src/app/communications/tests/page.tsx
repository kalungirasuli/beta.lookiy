import AudioRecord from "@/components/Audiorecord";


export default function Tests() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Audio Player Component Tests</h1>
      
      {/* Default AudioRecord */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Default Audio Player</h2>
        <AudioRecord />
      </div>

      {/* AudioRecord with custom duration */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Custom Duration</h2>
        <AudioRecord 
          duration="2:45"
          createdAt="5 minutes ago"
        />
      </div>

      {/* AudioRecord with longer duration */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Long Audio</h2>
        <AudioRecord 
          duration="15:32"
          createdAt="1 hour ago"
        />
      </div>

      {/* AudioRecord with recent timestamp */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Recent Recording</h2>
        <AudioRecord 
          duration="0:45"
          createdAt="Just now"
        />
      </div>

      {/* AudioRecord with older timestamp */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Older Recording</h2>
        <AudioRecord 
          duration="3:21"
          createdAt="Yesterday at 2:30 PM"
        />
      </div>

      {/* AudioRecord with custom styling */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Custom Styled</h2>
        <AudioRecord 
          duration="1:18"
          createdAt="Today at 9:15 AM"
          className="shadow-lg border-2 border-orange-200"
        />
      </div>

      {/* Multiple AudioRecords in a conversation-like layout */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Conversation Layout</h2>
        <div className="space-y-3">
          <div className="flex justify-start">
            <AudioRecord 
              duration="0:12"
              createdAt="2:45 PM"
              className="max-w-xs"
            />
          </div>
          <div className="flex justify-end">
            <AudioRecord 
              duration="0:08"
              createdAt="2:46 PM"
              className="max-w-xs"
            />
          </div>
          <div className="flex justify-start">
            <AudioRecord 
              duration="0:25"
              createdAt="2:47 PM"
              className="max-w-xs"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}