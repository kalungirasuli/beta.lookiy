'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [togglePosition, setTogglePosition] = useState({ x: 16, y: 16 }); // 16px = 1rem
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setShouldShowMore(width >= 756);
      if (width >= 756) {
        setMoreMenuOpen(false);
      } else {
        // Close sidebar when switching to mobile
        setIsOpen(false);
      }

      // Add overflow hidden to body when mobile menu is open
      if (isOpen && width < 756) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset'; // Reset overflow when component unmounts
    };
  }, [isOpen]);

  const mainNavItems: NavItem[] = [
    { icon: 'chats', label: 'Chats', href: '/communications/chats' },
    { icon: 'post', label: 'Post', href: '/communications/post' },
    { icon: 'profile', label: 'Profile', href: '/communications/profile' },
  ];

  const moreNavItems: NavItem[] = [
    { icon: 'network', label: 'Networks', href: '/communications/networks' },
    { icon: 'search', label: 'Search', href: '/communications/search' },
    { icon: 'notifications', label: 'Notifications', href: '/communications/notifications' },
    { icon: 'settings', label: 'Settings', href: '/communications/settings' },
    { icon: 'ads', label: 'Ads', href: '/communications/ads' },
  ];

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onMouseDown={(e) => {
          // Store initial position for drag detection
          dragStartPosRef.current = { x: e.pageX, y: e.pageY };
          const button = e.currentTarget;
          const startX = e.pageX - togglePosition.x;
          const startY = e.pageY - togglePosition.y;
          let hasMoved = false;

          const handleMouseMove = (e: MouseEvent) => {
            const deltaX = Math.abs(e.pageX - dragStartPosRef.current.x);
            const deltaY = Math.abs(e.pageY - dragStartPosRef.current.y);
            
            // Only start dragging if moved more than 5px
            if (deltaX > 5 || deltaY > 5) {
              hasMoved = true;
              setIsDragging(true);
              setTogglePosition({
                x: Math.min(Math.max(0, e.pageX - startX), window.innerWidth - button.offsetWidth),
                y: Math.min(Math.max(0, e.pageY - startY), window.innerHeight - button.offsetHeight)
              });
            }
          };

          const handleMouseUp = () => {
            // If hasn't moved, treat as click
            if (!hasMoved) {
              setIsOpen(!isOpen);
            }
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
        onTouchStart={(e) => {
          e.preventDefault(); // Prevent ghost clicks
          const touch = e.touches[0];
          dragStartPosRef.current = { x: touch.pageX, y: touch.pageY };
          const button = e.currentTarget;
          const startX = touch.pageX - togglePosition.x;
          const startY = touch.pageY - togglePosition.y;
          let hasMoved = false;

          const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.pageX - dragStartPosRef.current.x);
            const deltaY = Math.abs(touch.pageY - dragStartPosRef.current.y);
            
            // Only start dragging if moved more than 5px
            if (deltaX > 5 || deltaY > 5) {
              hasMoved = true;
              setIsDragging(true);
              setTogglePosition({
                x: Math.min(Math.max(0, touch.pageX - startX), window.innerWidth - button.offsetWidth),
                y: Math.min(Math.max(0, touch.pageY - startY), window.innerHeight - button.offsetHeight)
              });
            }
          };

          const handleTouchEnd = () => {
            // If hasn't moved, treat as click
            if (!hasMoved) {
              setIsOpen(!isOpen);
            }
            setIsDragging(false);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
          };

          document.addEventListener('touchmove', handleTouchMove);
          document.addEventListener('touchend', handleTouchEnd);
        }}
        style={{
          transform: `translate(${togglePosition.x}px, ${togglePosition.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
        className={`
          fixed p-2 rounded-xl z-50 min-[756px]:hidden touch-none select-none
          transition-all duration-150
          ${isDragging 
            ? 'scale-95 shadow-none translate-y-[1px] translate-x-[1px]' 
            : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]'
          }
          bg-white border border-gray-200
          hover:bg-orange-50 hover:border-orange-100 hover:text-yellow-500
          active:shadow-none active:translate-x-[1px] active:translate-y-[1px]
        `}
      >
        <svg 
          className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 pointer-events-none" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 min-[756px]:hidden backdrop-blur-sm bg-white/30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          min-[756px]:translate-x-0 min-[756px]:static min-[756px]:bg-transparent
          bg-white w-64 min-[756px]:w-auto
        `}
      >
        <div className="flex flex-col h-full p-4 bg-white min-[756px]:h-auto min-[756px]:m-4 min-[756px]:rounded-2xl min-[756px]:border min-[756px]:border-gray-200 min-[756px]:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          {/* Logo */}
          <Link href="/" className="mb-6">
            <Image 
              src="/logomin.svg" 
              alt="Lookiy" 
              width={32} 
              height={32} 
              className="w-8 h-8"
            />
          </Link>

          {/* Navigation Items */}
          <nav className="flex flex-col items-start gap-2 w-full">
            {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center w-full p-3 max-[756px]:p-2 rounded-xl transition-all duration-150 group
                    ${isActive 
                      ? 'bg-yellow-500 text-white border border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]' 
                      : `text-gray-600 bg-white border border-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] 
                        ${item.icon === 'post' 
                          ? 'hover:bg-green-50 hover:border-green-100 hover:text-green-500' 
                          : item.icon === 'chats'
                          ? 'hover:bg-blue-50 hover:border-blue-100 hover:text-blue-500'
                          : 'hover:bg-orange-50 hover:border-orange-100 hover:text-yellow-500'
                        } active:shadow-none active:translate-x-[1px] active:translate-y-[1px]`
                    }`}
                >
                  <IconComponent name={item.icon} isActive={isActive} />
                  <span className="ml-3 min-[756px]:hidden">{item.label}</span>
                </Link>
              );
            })}

            {/* More Items */}
            <div className="w-full mt-4">
              {moreNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center w-full p-3 rounded-xl transition-all duration-150 group mb-2
                      ${isActive 
                        ? 'bg-yellow-500 text-white border border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]' 
                        : `text-gray-600 bg-white border border-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] 
                          ${item.icon === 'notifications'
                            ? 'hover:bg-purple-50 hover:border-purple-100 hover:text-purple-500'
                            : item.icon === 'settings'
                            ? 'hover:bg-gray-50 hover:border-gray-100 hover:text-gray-700'
                            : item.icon === 'ads'
                            ? 'hover:bg-red-50 hover:border-red-100 hover:text-red-500'
                            : 'hover:bg-orange-50 hover:border-orange-100 hover:text-yellow-500'
                          } active:shadow-none active:translate-x-[1px] active:translate-y-[1px]`
                      }`}
                  >
                    <IconComponent name={item.icon} isActive={isActive} />
                    <span className="ml-3 min-[756px]:hidden">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

// Icon component with all navigation icons
function IconComponent({ name, isActive = false }: { name: string; isActive?: boolean }) {
  const getIconColor = () => {
    if (isActive) return 'stroke-white';
    if (name === 'post') return 'stroke-green-500';
    return 'stroke-gray-500';
  };

  const getHoverColor = () => {
    if (name === 'post') return 'group-hover:stroke-green-600';
    if (name === 'chats') return 'group-hover:stroke-blue-500';
    if (name === 'notifications') return 'group-hover:stroke-purple-500';
    if (name === 'settings') return 'group-hover:stroke-gray-700';
    if (name === 'ads') return 'group-hover:stroke-red-500';
    return 'group-hover:stroke-orange-500';
  };

  const iconClasses = `w-6 h-6 max-[756px]:w-5 max-[756px]:h-5 ${getIconColor()} transition-colors ${getHoverColor()}`;
  
  const icons = {
    network: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    search: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    chats: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    notifications: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    profile: (
      <div className="relative w-6 h-6 overflow-hidden rounded-full border border-gray-200">
        <Image 
          src="/profile-placeholder.jpg" 
          alt="Profile" 
          fill
          className="transition-transform group-hover:scale-110"
        />
      </div>
    ),
    settings: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    ads: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    post: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    )
  };

  return icons[name as keyof typeof icons] || null;
}