
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import NetworkPostRoom from "./networks/page";
import PostImage from "@/components/postimagecontainer";
interface Profile {
  name: string;
  creator: string;
  users: number;
  description: string;
  icon: string;
  status: string;
  lastActive: string;
  auth: string;
}
interface TrendingThread {
  id: string;
  topic: string;
  likes: number;
  comments: number;
  shares: number;
  owner: string[];
  image: string;
}
export default async function CommunicationsPage({children}:{children:React.ReactNode}) {
 

  const profile : Profile={
    name: "Lookiy default users",
    creator:"kalungi Rasuli",
    users: 1200,
    description: "This is the default network for all Lookiy users. Connect, share, and collaborate with a vibrant community of professionals and enthusiasts. Join us to explore new opportunities and expand your network.",
    icon: "/default-network-icon.png",
    status: "Active",
    lastActive: "5 minutes ago",
    auth: "Public",
  };
  const demoPosts: TrendingThread[] = [
  {
    id: "post_001",
    topic: "How AI is transforming social media engagement",
    likes: 245,
    comments: 37,
    shares: 19,
    owner: ["kalungi_rasuli", "lookiy_admin"],
    image: "/DrawKit - Social Movements Illustration Pack/SVG/4_SOCIAL MEDIA.svg",
  },
  {
    id: "post_002",
    topic: "The importance of networking for young professionals",
    likes: 112,
    comments: 14,
    shares: 9,
    owner: ["sarah_k", "lookiy_network"],
    image: "/DrawKit - Social Movements Illustration Pack/SVG/4_SOCIAL MEDIA.svg",
  },
  {
    id: "post_003",
    topic: "Best productivity hacks for remote work",
    likes: 389,
    comments: 52,
    shares: 41,
    owner: ["remote_team", "kalungi_rasuli"],
    image: "/DrawKit - Social Movements Illustration Pack/SVG/4_SOCIAL MEDIA.svg",
  },
  {
    id: "post_004",
    topic: "Why consistency beats motivation in building habits",
    likes: 178,
    comments: 23,
    shares: 15,
    owner: ["growth_mindset", "lookiy_users"],
    image: "/DrawKit - Social Movements Illustration Pack/SVG/4_SOCIAL MEDIA.svg",
  },
  {
    id: "post_005",
    topic: "Exploring opportunities in the Ugandan tech ecosystem",
    likes: 531,
    comments: 76,
    shares: 58,
    owner: ["kalungi_rasuli", "xylophone_tech"],
    image: "/DrawKit - Social Movements Illustration Pack/SVG/4_SOCIAL MEDIA.svgy",
  },
];
  return (
    <div className="flex justify-center w-full bg-gray-50 min-h-screen">
      <div className="flex flex-col w-full h-auto max-w-[1265px]">
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
                <NetworkPostRoom/>
              </div>
            </main>

            {/* Additional Content - Hidden below lg, visible lg and up */}
            <section className="hidden lg:block w-80 bg-transparent">
              {/* Profile Card */}
              <div className="m-4 h-auto text-gray-400 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6 relative ">
                <div className="space-y-4">
                  {/* Network Image */}
                  <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden text-gray-500 border-2 border-black mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                    <Image 
                      src={profile.icon} 
                      alt={profile.name}
                      width={96}
                      height={96}
                      className="object-cover "
                    />
                  </div>

                  {/* Network Name */}
                  <h2 className="text-lg font-extrabold text-gray-900 tracking-tight text-center sm:text-xl md:text-2xl">
                    {profile.name}
                  </h2>

                  {/* Creator Badge */}
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-500">Created by</span>
                    <span className="inline-block px-3 py-1 bg-orange-500 font-extrabold text-gray-100 text-sm rounded-lg">
                      {profile.creator}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between py-2 border-y border-gray-100">
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900">{profile.users}</p>
                      <p className="text-xs text-gray-500">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">{profile.status}</p>
                      <p className="text-xs text-gray-500">{profile.lastActive}</p>
                    </div>
                  </div>

                  {/* Description */}
                                    <p className="text-sm text-gray-800 mt-2 mb-4">{profile.description.substring(0,100)+" ..."}</p>
                  
                  {/* Action Icons and Visibility Row */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Action Icons */}
                    <div className="flex items-center gap-3">
                      <button className="flex items-center justify-center bg-blue-50 text-blue-500 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:bg-blue-600 hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-1" title="Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="flex items-center justify-center bg-purple-50 text-purple-500 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:bg-purple-600 hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-1" title="QR Code">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                          <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                        </svg>
                      </button>
                      <button className="flex items-center justify-center bg-orange-50 text-orange-500 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:bg-orange-600 hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-1" title="Copy Link">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="flex items-center justify-center bg-green-50 text-green-500 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:bg-green-600 hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-1" title="Invite Members">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Visibility Badge */}
                    <span className="absolute top-2 right-3 text-sm font-medium text-white bg-green-500 px-2 py-1 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                      {profile.auth}
                    </span>
                  </div>
                </div>
              </div>
              {/* trending threads */}
              <section className=" h-auto mt-15">
                <h2 className="ml-4 text-xl text-gray-700 font-">  Trending threads</h2>
              <div className="m-4 h-auto text-gray-400 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
                <div className="space-y-4">
                  {demoPosts.map((post) => (
                    <div key={post.id} className="border-b border-gray-200 pb-4 last:border-0">     
                      <div className="flex items-start space-x-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] flex-shrink-0">
                          <Image 
                            src={post.image} 
                            alt={post.topic}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">{post.topic.substring(0,40)+"..."}</h3>
                          <p className="text-xs text-gray-500">By {post.owner.join(", ")}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <button className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 text-red-600 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:bg-red-600 hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              <span className="text-[10px] font-medium">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:bg-blue-600 hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                              <span className="text-[10px] font-medium">{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-50 text-green-500 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:bg-green-600 hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                              </svg>
                              <span className="text-[10px] font-medium">{post.shares}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </section>

            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
