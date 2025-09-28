"use client";
import Sidebar from "@/components/Sidebar";

export default function CommunicationsPage() {
  return (
    <div className="flex justify-center w-full bg-gray-50 min-h-screen">
      <div className="flex flex-col w-full h-screen max-w-[1265px]">
        <div className="flex flex-1 relative h-screen">
          {/* Sidebar - Always visible */}
          <aside className="flex-shrink-0 bg-transparent z-50">
            <Sidebar />
          </aside>

          {/* Main Content Area - Flex row on lg and up */}
          <div className="flex flex-1 flex-col lg:flex-row w-full">
            {/* Chatroom - Always visible */}
            <main className="flex-1 w-full flex flex-col bg-white">
              <div className="h-full w-full">
                Chatroom content will go here
              </div>
            </main>

            {/* Additional Content - Hidden below lg, visible lg and up */}
            <section className="hidden lg:block w-80 bg-transparent">
              <div className="m-4 h-auto rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] p-4">
                Additional content will go here
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
