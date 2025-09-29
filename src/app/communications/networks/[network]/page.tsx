import Image from "next/image";

interface Post{
    id: string;
    topic: string;
    creator: string;
    role: string;
    profileimage: string;
    content: string[];
    createdAt: string;
    lastupdated: string;
    comment:number;
    like:number;
    shares:number;
    views:number;
    name:string;
}

export default function NetworkPostRoom() {
    // Sample post data
    const posts: Post[] = [
        {
            id: "1",
            topic: "The Future of AI in Healthcare",
            creator: "Dr. Sarah Johnson",
            role: "Healthcare Tech Specialist",
            profileimage: "/DrawKit Vector Illustration Mental Health & Psychology (3).svg",
            content: ["AI is revolutionizing healthcare in unprecedented ways. From diagnosis to treatment planning, the integration of artificial intelligence is improving patient outcomes and streamlining medical processes."],
            createdAt: "2025-09-28T10:00:00Z",
            lastupdated: "2025-09-28T10:00:00Z",
            comment: 45,
            like: 230,
            shares: 89,
            views: 1200,
            name: "Sarah J."
        },
        {
            id: "2",
            topic: "Sustainable Technology Practices",
            creator: "Alex Chen",
            role: "Environmental Tech Consultant",
            profileimage: "/DrawKit Vector Illustration Mental Health & Psychology (4).svg",
            content: ["Implementing sustainable practices in technology development is no longer optional. Here's how companies can reduce their carbon footprint while maintaining innovation."],
            createdAt: "2025-09-28T09:30:00Z",
            lastupdated: "2025-09-28T09:30:00Z",
            comment: 32,
            like: 185,
            shares: 67,
            views: 890,
            name: "Alex C."
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            {posts.map((post) => (
                <div key={post.id} className="flex flex-col gap-3">
                    {/* Main Content Card */}
                    <div className="bg-white rounded-xl border-2 border-gray-600 shadow-[7px_7px_0px_0px_rgba(0,0,0,0.7)] p-6">
                        {/* Creator Info */}
                        <div className="flex items-start space-x-4 mb-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] flex-shrink-0">
                                <Image
                                    src={post.profileimage}
                                    alt={post.creator}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{post.topic}</h2>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">{post.creator}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500">{post.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                            {post.content.map((paragraph, index) => (
                                <p key={index} className="mb-2">{paragraph}</p>
                            ))}
                        </div>

                        {/* Post Metadata */}
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{post.views} views</span>
                        </div>
                    </div>

                    {/* Reaction Container - Separated from main content */}
                    <div className="flex items-center justify-between px-4">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border-2 border-red-600 shadow-[3px_3px_0px_0px_rgba(220,0,0,0.8)] hover:bg-red-600 hover:text-white active:shadow-[1px_1px_0px_0px_rgba(220,0,0,0.8)] active:translate-x-[1px] active:translate-y-[1px] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">{post.like}</span>
                        </button>

                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg border-2 border-blue-600 shadow-[3px_3px_0px_0px_rgba(0,0,255,0.8)] hover:bg-blue-600 hover:text-white active:shadow-[1px_1px_0px_0px_rgba(0,0,255,0.8)] active:translate-x-[1px] active:translate-y-[1px] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">{post.comment}</span>
                        </button>

                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-500 rounded-lg border-2 border-green-600 shadow-[3px_3px_0px_0px_rgba(0,100,0,0.8)] hover:bg-green-600 hover:text-white active:shadow-[1px_1px_0px_0px_rgba(0,100,0,0.8)] active:translate-x-[1px] active:translate-y-[1px] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                            <span className="text-sm font-medium">{post.shares}</span>
                        </button>

                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg border-2 border-gray-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] hover:bg-gray-600 hover:text-white active:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">{post.views}</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}