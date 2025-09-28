'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  title:string
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
    { icon: 'search', label: 'Search', href: '/communications/search',title:'search anything' },
    { icon: 'chats', label: 'Chats', href: '/communications/chats',title:'open private chat rooms'},
    { icon: 'calls', label: 'Calls', href: '/communications/calls',title:'open and and start calls ' },
    { icon: 'post', label: 'Post', href: '/communications/post',title:'make post to any networks you are into' },
    { icon: 'profile', label: 'Profile', href: '/communications/profile',title:'view and edit your profile' },
  ];

  const moreNavItems: NavItem[] = [
    { icon: 'network', label: 'Networks', href: '/communications/networks',title:'veiw and joins networks' },
    
    { icon: 'notifications', label: 'Notifications', href: '/communications/notifications', title:'view and reading notifications'},
    { icon: 'settings', label: 'Settings', href: '/communications/settings',title:'edit and make new add new setting to your accounts' },
    { icon: 'ads', label: 'Ads', href: '/communications/ads',title:'manage your ads' },
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
        <div className="flex flex-col h-full p-4 bg-white min-[756px]:h-auto min-[756px]:m-4 min-[756px]:rounded-2xl min-[756px]:border min-[756px]:border-gray-500 min-[756px]">
          {/* Logo */}
          {/* <Link href="/" className="mb-6">
            <Image 
              src="/logomin.svg" 
              alt="Lookiy" 
              width={32} 
              height={32} 
              className="w-8 h-8"
            />
          </Link> */}

          {/* Navigation Items */}
          <nav className="flex flex-col items-start gap-2 w-full">
            {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={item.title}
                  className={`flex items-center w-full p-3 max-[756px]:p-2 rounded-xl transition-all duration-150 group
                    ${isActive 
                      ? 'bg-yellow-500 text-white border border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]' 
                      : `text-gray-600 bg-white border border-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] 
                        ${item.icon === 'post' 
                          ? 'hover:bg-green-50 hover:border-green-100 hover:text-green-500' 
                          : item.icon === 'chats'
                          ? 'hover:bg-blue-50 hover:border-blue-100 hover:text-blue-500'
                          : item.icon === 'calls'
                          ? 'hover:bg-cyan-50 hover:border-cyan-100 hover:text-cyan-500'
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
                    title={item.title}
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
    if (name === 'calls') return 'stroke-cyan-500';
    if (name === "chats") return 'stroke-blue-500';
    if (name === 'search') return 'stroke-orange-black'
    return 'stroke-gray-500';
  };

  const getHoverColor = () => {
    if (name === 'post') return 'group-hover:stroke-green-600';
    if (name === 'chats') return 'group-hover:stroke-blue-500';
    if (name === 'calls') return 'group-hover:stroke-cyan-600';
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
    calls: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
      <div className="relative w-6  h-6 overflow-hidden rounded-full border border-gray-200">
        <Image 
          src="data:image/jpeg;base64,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" 
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