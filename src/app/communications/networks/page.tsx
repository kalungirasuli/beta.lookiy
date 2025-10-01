"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// Badge animations
const badgeAnimations = `
@keyframes burst {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

@keyframes shine {
    0% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
    50% { filter: brightness(1.3) drop-shadow(0 0 5px currentColor); }
    100% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
}

@keyframes rotate {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(-15deg); }
    75% { transform: rotate(15deg); }
    100% { transform: rotate(0deg); }
}

@keyframes pulse {
    0% { transform: scale(1); filter: brightness(1); }
    50% { transform: scale(1.1); filter: brightness(1.2); }
    100% { transform: scale(1); filter: brightness(1); }
}

.badge-burst {
    animation: burst 1s ease-in-out infinite;
}

.badge-shine {
    animation: shine 2s ease-in-out infinite;
}

.badge-rotate {
    animation: rotate 2s ease-in-out infinite;
}

.badge-pulse {
    animation: pulse 1.5s ease-in-out infinite;
}
`;

// Add styles to head
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = badgeAnimations;
    document.head.appendChild(style);
}

interface Achievement {
    title: string;
    description: string;
    dateAttained: string;
    icon: string;
}

interface Post{
    id: string;
    topic: string;
    creator: string;
    role: string;
    profileimage: string;
    content: string[];
    createdAt: string;
    lastupdated: string;
    comment: number;
    like: number;
    shares: number;
    views: number;
    name: string;
    verified?: boolean;
    achievements?: {
        admin?: Achievement;
        moderator?: Achievement;
        vip?: Achievement;
        user?: Achievement;
        century?: Achievement;
        verified?: Achievement;
    };
}

export default function NetworkPostRoom() {
    // Sample post data
    const [activeReactions, setActiveReactions] = useState<Record<string, Set<string>>>({});
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    // Initialize bookmarked posts from localStorage
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bookmarkedPosts');
            return new Set(saved ? JSON.parse(saved) : []);
        }
        return new Set();
    });

    // Initialize reported posts state
    // Track which posts have the report icon visible
    const [reportIconVisible, setReportIconVisible] = useState<Set<string>>(new Set());

    // Track which post is being reported (showing violation choices)
    const [activeReportMenu, setActiveReportMenu] = useState<string | null>(null);

    // Track reported posts
    const [reportedPosts, setReportedPosts] = useState<Set<string>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('reportedPosts');
            return new Set(saved ? JSON.parse(saved) : []);
        }
        return new Set();
    });

    // Track selected rule violations for each post (multiple selections)
    const [ruleViolations, setRuleViolations] = useState<{ [postId: string]: Set<string> }>({});

    // Handle report toggle
    const toggleReport = (postId: string) => {
        setReportedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
                // Clear violations and hide icon when unreporting
                setRuleViolations(prev => {
                    const next = { ...prev };
                    delete next[postId];
                    return next;
                });
                setReportIconVisible(prev => {
                    const next = new Set(prev);
                    next.delete(postId);
                    return next;
                });
            } else {
                newSet.add(postId);
            }
            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('reportedPosts', JSON.stringify(Array.from(newSet)));
            }
            return newSet;
        });
        // Reset all menus
        setActiveMenu(null);
        setActiveReportMenu(null);
    };
    
    const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Handle click outside menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (activeMenu && menuRefs.current[activeMenu] && !menuRefs.current[activeMenu]?.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenu]);

    // Handle bookmark and persist to localStorage
    const toggleBookmark = (postId: string) => {
        setBookmarkedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('bookmarkedPosts', JSON.stringify(Array.from(newSet)));
            }
            return newSet;
        });
        setActiveMenu(null); // Close menu after bookmarking
    };

    const posts: Post[] = [
        {
            id: "1",
            topic: "The Future of AI in Healthcare",
            creator: "Dr. Sarah Johnson",
            role: "admin",
            profileimage: "/logo.svg",
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
            role: "modulator",
            profileimage: "/logo.svg",
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
        <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
            {posts.map((post) => (
                <div key={post.id} className="flex flex-col relative mb-15">
                    {/* Main Content Card */}
                    <div className="bg-white rounded-xl border-1 border-gray-300  p-6 pb-5 relative">
                        {/* Menu Button */}
                        <div 
                            className="absolute top-4 right-4" 
                            ref={(el: HTMLDivElement | null) => {
                                if (el) menuRefs.current[post.id] = el;
                            }}
                        >
                            <button 
                                onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-300"
                                aria-label="Post options menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenu === post.id && (
                                <div 
                                    className={`absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-[7px_7px_0px_0px_rgba(0,0,0,0.5)] border border-gray-200 z-50 transform transition-all duration-200 ease-out origin-top-right ${
                                        activeMenu === post.id ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                    }`}
                                >
                                    <div className="py-1">
                                        <button 
                                            onClick={() => {/* Add edit handler */}} 
                                            className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 text-left transition-colors duration-150"
                                        >
                                            Edit Post
                                        </button>
                                        <button 
                                            onClick={() => {/* Add delete handler */}} 
                                            className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 text-left transition-colors duration-150"
                                        >
                                            Delete Post
                                        </button>
                                        {reportedPosts.has(post.id) ? (
                                            <button 
                                                onClick={() => {
                                                    toggleReport(post.id);
                                                    setRuleViolations(prev => {
                                                        const next = { ...prev };
                                                        delete next[post.id];
                                                        return next;
                                                    });
                                                }}
                                                className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 text-left"
                                            >
                                                Unreport Post
                                            </button>
                                        ) : (
                                            <div className="w-full">
                                                {activeReportMenu === post.id ? (
                                                    <>
                                                        <div className={`p-2 space-y-2 transform transition-all duration-200 ease-out ${
                                                            activeReportMenu === post.id ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                                        }`}>
                                                            {['harassment', 'hate', 'misinformation', 'spam', 'violence', 'other'].map((violation) => {
                                                                const labels = {
                                                                    harassment: 'Harassment or Bullying',
                                                                    hate: 'Hate Speech',
                                                                    misinformation: 'Misinformation',
                                                                    spam: 'Spam or Misleading',
                                                                    violence: 'Violence or Threats',
                                                                    other: 'Other'
                                                                };
                                                                return (
                                                                    <label 
                                                                        key={violation} 
                                                                        htmlFor={`${post.id}-${violation}`}
                                                                        className="flex items-center hover:bg-gray-50 px-2 py-1 rounded cursor-pointer group"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`${post.id}-${violation}`}
                                                                            checked={ruleViolations[post.id]?.has(violation) || false}
                                                                            className="absolute w-0 h-0 opacity-0 peer"
                                                                            onChange={(e) => {
                                                                                setRuleViolations(prev => {
                                                                                    const newViolations = new Set(prev[post.id] || new Set());
                                                                                    if (e.target.checked) {
                                                                                        newViolations.add(violation);
                                                                                    } else {
                                                                                        newViolations.delete(violation);
                                                                                    }
                                                                                    return {
                                                                                        ...prev,
                                                                                        [post.id]: newViolations
                                                                                    };
                                                                                });
                                                                            }}
                                                                        />
                                                                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-2 transition-colors ${
                                                                            ruleViolations[post.id]?.has(violation)
                                                                                ? 'bg-orange-500 border-orange-500'
                                                                                : 'border-gray-300 hover:border-orange-300'
                                                                        }`}>
                                                                            {ruleViolations[post.id]?.has(violation) && (
                                                                                <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M13.5 4.5l-7 7-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-sm text-gray-600 select-none">
                                                                            {labels[violation as keyof typeof labels]}
                                                                        </span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="border-t border-gray-200 my-2 pt-2 flex gap-2 px-3">
                                                            <button 
                                                                onClick={() => {
                                                                    setActiveReportMenu(null);
                                                                    setRuleViolations(prev => {
                                                                        const next = { ...prev };
                                                                        delete next[post.id];
                                                                        return next;
                                                                    });
                                                                }}
                                                                className="w-1/2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 text-center font-medium rounded"
                                                            >
                                                                Cancel
                                                            </button>
                                                            {ruleViolations[post.id]?.size > 0 && (
                                                                <button 
                                                                    onClick={() => {
                                                                        toggleReport(post.id);
                                                                        setActiveReportMenu(null);
                                                                    }}
                                                                    className="w-1/2 px-2 py-2 text-xs text-white bg-red-500 
                                                                    shadow-[3px_3px_0px_0px_rgba(220,38,38,0.5)]
                                                                    hover:bg-red-600 text-center font-medium rounded"
                                                                >
                                                                    Report
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <button 
                                                        onClick={() => {
                                                            setActiveReportMenu(post.id);
                                                            setReportIconVisible(prev => {
                                                                const next = new Set(prev);
                                                                next.add(post.id);
                                                                return next;
                                                            });
                                                        }}
                                                        className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 text-left transition-colors duration-150"
                                                    >
                                                        Report Post
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <button 
                                            onClick={() => toggleBookmark(post.id)} 
                                            className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 text-left transition-colors duration-150"
                                        >
                                            {bookmarkedPosts.has(post.id) ? 'Remove Bookmark' : 'Bookmark Post'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Creator Info */}
                        <div className="flex items-center space-x-4 mb-4 border-b border-b-gray-300 pb-5">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200 flex-shrink-0 items-center justify-center flex">
                                <Image
                                    src={post.profileimage}
                                    alt={post.creator}
                                    width={48}
                                    height={48}
                                    className="object-fit mx-auto my-auto"
                                />
                            </div>
                            <div className="flex flex-col h-12 ">
                                <span className="text-sm font-semibold text-gray-900">{post.creator}</span>
                                <div className="flex gap-2 mt-2 mb-5">
                            {/* Admin Badge */}
                            {post.role === 'admin' && (
                                <div className="group relative">
                                    <div className="bg-violet-500 p-1 rounded-lg shadow-[3px_3px_0px_0px_rgba(139,92,246,0.5)] hover:bg-violet-600 transition-all duration-300 hover:-translate-y-1">
                                        <div className="badge-shine">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M5,16L3,5L8.5,12L12,5L15.5,12L21,5L19,16H5M19,19A1,1 0 0,1 18,20H6A1,1 0 0,1 5,19V18H19V19Z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-violet-500 text-white text-xs py-1 px-2 rounded-lg whitespace-nowrap shadow-[3px_3px_0px_0px_rgba(139,92,246,0.5)]">Admin</span>
                                </div>
                            )}

                            {/* Moderator Badge */}
                            {post.role === 'modulator' && (
                                <div className="group relative">
                                    <div className="bg-teal-500 p-1 rounded-lg hover:bg-teal-600 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(20,184,166,0.5)] hover:-translate-y-1">
                                        <div className="badge-rotate">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,4.53L17,7.03V11C17,15.08 14.76,18.71 12,20C9.24,18.71 7,15.08 7,11V7.03L12,4.53M10,10V12H14V10H10Z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Achievement Card Tooltip */}
                                    <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 z-50">
                                        <div className="bg-white rounded-xl shadow-[7px_7px_0px_0px_rgba(0,0,0,0.8)] p-3 border-1 border-gray-300 w-56">
                                            <div className="flex items-start space-x-3">
                                                {/* Icon Container */}
                                                <div className="bg-teal-100 p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(20,184,166,0.3)]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" />
                                                    </svg>
                                                </div>
                                                {/* Content */}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm text-gray-800">Moderator Badge</h3>
                                                    <p className="text-xs text-gray-500 mt-1">Community guardian with special privileges to help maintain a positive and constructive environment.</p>
                                                    <div className="flex items-center mt-2 text-[10px] text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        Attained {new Date(post.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Pointer */}
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t-2 border-l-2 border-teal-200 rotate-45"></div>
                                    </div>
                                </div>
                            )}

                            {/* VIP Badge */}
                            {post.role === 'vip' && (
                                <div className="group relative">
                                    <div className="bg-amber-500 p-1 rounded-lg hover:bg-amber-600 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(245,158,11,0.5)] hover:-translate-y-1">
                                        <div className="badge-pulse">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12,2L22,12H16V22H8V12H2L12,2M12,4.83L6.83,10H10V20H14V10H17.17L12,4.83Z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Achievement Card Tooltip */}
                                    <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 z-50">
                                        <div className="bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-3 border-1 border-gray-300 w-56">
                                            <div className="flex items-start space-x-3">
                                                {/* Icon Container */}
                                                <div className="bg-amber-100 p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(245,158,11,0.3)]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M20 12V4H4v8l8 8 8-8zM4 4l8 8 8-8H4z" />
                                                    </svg>
                                                </div>
                                                {/* Content */}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm text-gray-800">VIP Member</h3>
                                                    <p className="text-xs text-gray-500 mt-1">Premium member with exclusive access to special features and premium content.</p>
                                                    <div className="flex items-center mt-2 text-[10px] text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        Attained {new Date(post.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Pointer */}
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t-2 border-l-2 border-amber-200 rotate-45"></div>
                                    </div>
                                </div>
                            )}

                            {/* User Badge */}
                            {post.role === 'user' && (
                                <div className="group relative">
                                    <div className="bg-blue-500 p-1 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(59,130,246,0.5)] hover:-translate-y-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                        </svg>
                                    </div>
                                    {/* Achievement Card Tooltip */}
                                    <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 z-50">
                                        <div className="bg-white rounded-xl shadow-[3px_3px_0px_0px_rgba(59,130,246,0.3)] p-3 border-2 border-blue-200 w-56">
                                            <div className="flex items-start space-x-3">
                                                {/* Icon Container */}
                                                <div className="bg-blue-100 p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(59,130,246,0.3)]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                                    </svg>
                                                </div>
                                                {/* Content */}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm text-gray-800">Active Member</h3>
                                                    <p className="text-xs text-gray-500 mt-1">Engaged community member contributing to discussions and sharing valuable insights.</p>
                                                    <div className="flex items-center mt-2 text-[10px] text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        Attained {new Date(post.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Pointer */}
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t-2 border-l-2 border-blue-200 rotate-45"></div>
                                    </div>
                                </div>
                            )}

                            {/* Century Badge (1000 views) */}
                            {post.views >= 1000 && (
                                <div className="group relative">
                                    <div className="bg-yellow-500 p-1 rounded-lg hover:bg-yellow-600 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(234,179,8,0.5)] hover:-translate-y-1">
                                        <div className="badge-burst">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M16.23 18L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18M12 2C6.47 2 2 6.5 2 12a10 10 0 0020 0A10 10 0 0012 2z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Achievement Card Tooltip */}
                                    <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 z-50">
                                        <div className="bg-white rounded-xl shadow-[7px_7px_0px_0px_rgba(0,0,0,0.8)] p-3 border-1 border-gray-300 w-56">
                                            <div className="flex items-start space-x-3">
                                                {/* Icon Container */}
                                                <div className="bg-yellow-100 p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(234,179,8,0.3)]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                                    </svg>
                                                </div>
                                                {/* Content */}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm text-gray-800">Century Post</h3>
                                                    <p className="text-xs text-gray-500 mt-1">This post has achieved over 1,000 views, showing significant community engagement and reach.</p>
                                                    <div className="flex items-center mt-2 text-[10px] text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        Achieved {new Date(post.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Pointer */}
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t-2 border-l-2 border-yellow-200 rotate-45"></div>
                                    </div>
                                </div>
                            )}

                            {/* Verified Badge */}
                            {post.verified && (
                                <div className="group relative">
                                    <div className="bg-indigo-500 p-1 rounded-lg hover:bg-indigo-600 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.5)] hover:-translate-y-1">
                                        <div className="badge-shine">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Achievement Card Tooltip */}
                                    <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 z-50">
                                        <div className="bg-white rounded-xl shadow-[3px_3px_0px_0px_rgba(99,102,241,0.3)] p-3 border-2 border-indigo-200 w-56">
                                            <div className="flex items-start space-x-3">
                                                {/* Icon Container */}
                                                <div className="bg-indigo-100 p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(99,102,241,0.3)]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/>
                                                    </svg>
                                                </div>
                                                {/* Content */}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm text-gray-800">Verified Account</h3>
                                                    <p className="text-xs text-gray-500 mt-1">Authenticity confirmed by the platform. This user has been verified for their contributions and credibility.</p>
                                                    <div className="flex items-center mt-2 text-[10px] text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        Verified {new Date(post.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Pointer */}
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t-2 border-l-2 border-indigo-200 rotate-45"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                            <h2 className="text-lg font-bold text-gray-600">{post.topic}</h2>
                            {post.content.map((paragraph, index) => (
                                <p key={index} className="mb-2">{paragraph}</p>
                            ))}
                        </div>

                        {/* Post Metadata */}
                        <div className="text-xs text-gray-500 flex items-center justify-end space-x-2">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Reaction and Bookmark Container - Absolute positioned at the bottom */}
                    <div className="absolute -bottom-[calc(10%-12px)] right-4 flex gap-2">
                        {/* Report Icon - Only visible after selecting from menu */}
                        {(reportIconVisible.has(post.id) || reportedPosts.has(post.id)) && (
                            <div 
                                onClick={() => toggleReport(post.id)}
                                className={`flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer bg-white border-2 hover:bg-gray-50 shadow-lg hover:shadow-xl ${
                                    reportedPosts.has(post.id) 
                                        ? 'border-red-500 text-red-500' 
                                        : 'border-gray-300 text-gray-500'
                                }`}
                                title={reportedPosts.has(post.id) 
                                    ? 'Click to unreport this post' 
                                    : `Reported for: ${Array.from(ruleViolations[post.id] || []).join(', ') || 'rule violations'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}

                        {/* Bookmark Icon - Only shown when bookmarked */}
                        {bookmarkedPosts.has(post.id) && (
                            <div 
                                onClick={() => toggleBookmark(post.id)}
                                className="flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer bg-white border-2 border-gray-300 hover:bg-gray-50"
                                title="Remove Bookmark"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Reaction Container - Absolute positioned at the bottom */}
                    <div className="absolute left-4 -bottom-[10%] ">
                        <div className="flex items-center gap-1 px-4 py-2 w-max">
                            <div
                                onClick={() => {
                                    setActiveReactions(prev => {
                                        const newSet = new Set(prev[post.id] || [])
                                        if (newSet.has('like')) {
                                            newSet.delete('like')
                                        } else {
                                            newSet.add('like')
                                        }
                                        return { ...prev, [post.id]: newSet }
                                    })
                                }}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                    activeReactions[post.id]?.has('like')
                                        ? 'bg-white text-red-600 border border-red-600 shadow-[3px_3px_0px_0px_rgba(220,0,0,0.8)]'
                                        : 'bg-white text-red-600 border-1 border-gray-600  shadow-[1px_1px_0px_0px_rgba(220,0,0,0.8)'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs">{post.like}</span>
                            </div>

                            <div
                                onClick={() => {
                                    setActiveReactions(prev => {
                                        const newSet = new Set(prev[post.id] || [])
                                        if (newSet.has('comment')) {
                                            newSet.delete('comment')
                                        } else {
                                            newSet.add('comment')
                                        }
                                        return { ...prev, [post.id]: newSet }
                                    })
                                }}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                    activeReactions[post.id]?.has('comment')
                                        ? 'bg-white text-blue-600 border border-blue-600 shadow-[3px_3px_0px_0px_rgba(0,0,255,0.8)]'
                                        : 'bg-white text-blue-600 border border-gray-600  '
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs">{post.comment}</span>
                            </div>

                            <div
                                onClick={() => {
                                    setActiveReactions(prev => {
                                        const newSet = new Set(prev[post.id] || [])
                                        if (newSet.has('share')) {
                                            newSet.delete('share')
                                        } else {
                                            newSet.add('share')
                                        }
                                        return { ...prev, [post.id]: newSet }
                                    })
                                }}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                    activeReactions[post.id]?.has('share')
                                        ? 'bg-white text-green-600 border border-green-600 shadow-[3px_3px_0px_0px_rgba(0,100,0,0.8)]'
                                        : 'bg-white text-green-600 border border-gray-600   '
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                                <span className="text-xs">{post.shares}</span>
                            </div>

                            <div
                                onClick={() => {
                                    setActiveReactions(prev => {
                                        const newSet = new Set(prev[post.id] || [])
                                        if (newSet.has('view')) {
                                            newSet.delete('view')
                                        } else {
                                            newSet.add('view')
                                        }
                                        return { ...prev, [post.id]: newSet }
                                    })
                                }}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                    activeReactions[post.id]?.has('view')
                                        ? 'bg-white text-gray-900 border border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)]'
                                        : 'bg-white text-gray-900 border border-gray-600 '
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs">{post.views}</span>
                            </div>


                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}