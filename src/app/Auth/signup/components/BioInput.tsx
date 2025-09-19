'use client';

import React, { useState, useRef, useEffect } from 'react';

interface BioInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  error?: string;
}

interface TextSegment {
  text: string;
  isLink: boolean;
  isEmail: boolean;
  width: number;
  url?: string;
}

export default function BioInput({ value, onChange, maxLength = 500, error }: BioInputProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [segments, setSegments] = useState<TextSegment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectionStart, setSelectionStart] = useState(-1);
  const [selectionEnd, setSelectionEnd] = useState(-1);
  const [isComposing, setIsComposing] = useState(false);

  // Patterns for URLs and emails
  const emailPattern = /\S+@\S+/gi;
  const urlPattern = /\b\S+\.[a-zA-Z]{2,}\S*/gi;
  
  const font = '16px SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif';

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = e.target.value;
    const selectionStart = e.target.selectionStart;

    if (text.length <= maxLength) {
      // Save cursor position before React updates the component
      setCursorPosition(selectionStart);
      onChange(text);
    }
  };

  // Format the display text with highlighted links and emails
  const getFormattedText = () => {
    if (!value) return '';

    type Match = {
      start: number;
      end: number;
      text: string;
      type: 'url' | 'email';
      displayText?: string;
    };

    // Create a temporary array to store all matches and their positions
    let matches: Match[] = [];
    
    // Find emails first (they take precedence)
    let emailMatch: RegExpExecArray | null;
    while ((emailMatch = emailPattern.exec(value)) !== null) {
      const email = emailMatch[0];
      // Remove any trailing punctuation
      const cleanEmail = email.replace(/[.,!?]$/, '');
      
      // Only add if it's a complete word with @
      if (cleanEmail.includes('@')) {
        matches.push({
          start: emailMatch.index,
          end: emailMatch.index + cleanEmail.length,
          text: cleanEmail,
          type: 'email'
        });
      }
    }

    // Track matched ranges to avoid overlaps
    const matchedRanges: Array<[number, number]> = matches.map(m => [m.start, m.end]);

    // Find URLs
    let urlMatch: RegExpExecArray | null;
    while ((urlMatch = urlPattern.exec(value)) !== null) {
      const matchStart = urlMatch.index;
      const url = urlMatch[0];
      
      // Remove any trailing punctuation
      const cleanUrl = url.replace(/[.,!?]$/, '');
      const matchEnd = matchStart + cleanUrl.length;

      // Check if this range overlaps with any existing matches
      const isOverlapping = matchedRanges.some(([start, end]) => 
        (matchStart >= start && matchStart < end) || 
        (matchEnd > start && matchEnd <= end)
      );

      // Only add if it's not an email and contains a dot that's not at the end
      if (!isOverlapping && !cleanUrl.includes('@') && 
          cleanUrl.includes('.') && !cleanUrl.endsWith('.')) {
        matches.push({
          start: matchStart,
          end: matchEnd,
          text: cleanUrl,
          displayText: cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') 
            ? cleanUrl 
            : `https://${cleanUrl}`,
          type: 'url'
        });
        matchedRanges.push([matchStart, matchEnd]);
      }
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (prefer URLs over emails)
    matches = matches.reduce((acc, curr) => {
      if (acc.length === 0) return [curr];
      const prev = acc[acc.length - 1];
      if (curr.start >= prev.end) {
        acc.push(curr);
      } else if (curr.type === 'url') {
        // Replace the previous match if current is a URL
        acc[acc.length - 1] = curr;
      }
      return acc;
    }, [] as Match[]);

    // Build the final HTML
    let result = '';
    let lastIndex = 0;
    let originalValue = value; // Keep original value for slicing text

    matches.forEach(match => {
      // Add text before the match
      result += originalValue.slice(lastIndex, match.start);
      
      // Add the highlighted match
      const displayText = match.type === 'url' && match.displayText 
        ? match.displayText 
        : match.text;
      
      // Add the highlighted match with enhanced button-like styling
      const bgColorClass = match.type === 'url' ? 'bg-blue-50' : 'bg-purple-50';
      const textColorClass = match.type === 'url' ? 'text-blue-600' : 'text-purple-600';
      const highlightClass = `${bgColorClass} ${textColorClass} border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transform hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 ease-in-out`;
      
      result += `<span class="inline-block mx-2 px-3 py-1 ${highlightClass}" title="${displayText}">${match.text}</span>`;
      
      // Add space after the match if it's not at the end of the text and doesn't already have a space
      if (match.end < originalValue.length && originalValue[match.end] !== ' ') {
        result += '\u00A0'; // Single non-breaking space
        lastIndex = match.end + 1;
      } else {
        lastIndex = match.end;
      }
    });

    // Add any remaining text
    result += value.slice(lastIndex);

    return result;
  };

  // Restore cursor position after React updates
  React.useEffect(() => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.selectionStart = cursorPosition;
      textarea.selectionEnd = cursorPosition;
    }
  }, [value, cursorPosition]);

  const getTextSegments = (text: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    let lastIndex = 0;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return segments;
    
    ctx.font = font;

    const matches: { start: number; end: number; text: string; type: 'url' | 'email' }[] = [];

    // Find emails
    let emailMatch;
    while ((emailMatch = emailPattern.exec(text))) {
      const email = emailMatch[0].replace(/[.,!?]$/, '');
      if (email.includes('@')) {
        matches.push({
          start: emailMatch.index,
          end: emailMatch.index + email.length,
          text: email,
          type: 'email'
        });
      }
    }

    // Find URLs
    let urlMatch;
    while ((urlMatch = urlPattern.exec(text))) {
      const url = urlMatch[0].replace(/[.,!?]$/, '');
      if (!url.includes('@') && url.includes('.') && !url.endsWith('.')) {
        matches.push({
          start: urlMatch.index,
          end: urlMatch.index + url.length,
          text: url,
          type: 'url'
        });
      }
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Process matches and create segments
    matches.forEach(match => {
      if (lastIndex < match.start) {
        const normalText = text.slice(lastIndex, match.start);
        segments.push({
          text: normalText,
          isLink: false,
          isEmail: false,
          width: ctx.measureText(normalText).width
        });
      }

      segments.push({
        text: match.text,
        isLink: match.type === 'url',
        isEmail: match.type === 'email',
        width: ctx.measureText(match.text).width,
        url: match.type === 'url' ? 
          (match.text.startsWith('http') ? match.text : `https://${match.text}`) : 
          undefined
      });

      lastIndex = match.end;
    });

    if (lastIndex < text.length) {
      const normalText = text.slice(lastIndex);
      segments.push({
        text: normalText,
        isLink: false,
        isEmail: false,
        width: ctx.measureText(normalText).width
      });
    }

    return segments;
  };

  const drawText = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set default text styles
    ctx.font = font;
    ctx.textBaseline = 'top';
    
    let x = 16; // Left padding
    let y = 12; // Top padding
    let lineHeight = 24;
    let currentLineWidth = 0;
    let currentLine: TextSegment[] = [];
    
    segments.forEach(segment => {
      if (currentLineWidth + segment.width > canvas.width - 32) { // Account for padding
        // Draw current line
        drawLine(ctx, currentLine, x, y);
        y += lineHeight;
        currentLineWidth = 0;
        currentLine = [];
      }
      
      currentLine.push(segment);
      currentLineWidth += segment.width + (segment.isLink || segment.isEmail ? 16 : 0); // Add spacing for links
    });
    
    // Draw remaining line
    if (currentLine.length > 0) {
      drawLine(ctx, currentLine, x, y);
    }

    // Draw cursor
    if (cursorPosition >= 0) {
      drawCursor(ctx, cursorPosition);
    }
  };

  const drawLine = (ctx: CanvasRenderingContext2D, line: TextSegment[], startX: number, y: number) => {
    let x = startX;
    
    line.forEach(segment => {
      if (segment.isLink || segment.isEmail) {
        // Draw highlight background
        ctx.fillStyle = segment.isLink ? '#EFF6FF' : '#FAF5FF';
        const padding = 4;
        const height = 22;
        ctx.fillRect(x - padding, y, segment.width + padding * 2, height);
        
        // Draw border
        ctx.strokeStyle = segment.isLink ? '#93C5FD' : '#E9D5FF';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - padding, y, segment.width + padding * 2, height);
      }
      
      // Draw text
      ctx.fillStyle = segment.isLink ? '#2563EB' : segment.isEmail ? '#9333EA' : '#374151';
      ctx.fillText(segment.text, x, y);
      
      x += segment.width + (segment.isLink || segment.isEmail ? 16 : 0); // Add spacing after links
    });
  };

  const drawCursor = (ctx: CanvasRenderingContext2D, position: number) => {
    let currentPos = 0;
    let x = 16;
    let y = 12;
    let lineHeight = 24;
    
    for (const segment of segments) {
      if (position >= currentPos && position <= currentPos + segment.text.length) {
        const textBeforeCursor = segment.text.substring(0, position - currentPos);
        const cursorX = x + ctx.measureText(textBeforeCursor).width;
        
        ctx.beginPath();
        ctx.moveTo(cursorX, y);
        ctx.lineTo(cursorX, y + 20);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }
      
      currentPos += segment.text.length;
      x += segment.width + (segment.isLink || segment.isEmail ? 16 : 0);
      
      if (x > canvasRef.current!.width - 32) {
        x = 16;
        y += lineHeight;
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let currentX = 16;
    let currentY = 12;
    let lineHeight = 24;
    let position = 0;
    
    for (const segment of segments) {
      if (y >= currentY && y <= currentY + lineHeight) {
        if (x >= currentX && x <= currentX + segment.width) {
          const ctx = canvas.getContext('2d')!;
          ctx.font = font;
          
          // Find the exact character position
          const textWidth = segment.width;
          const charWidth = textWidth / segment.text.length;
          const relativeX = x - currentX;
          const charPosition = Math.round(relativeX / charWidth);
          
          position += Math.min(charPosition, segment.text.length);
          setCursorPosition(position);
          break;
        }
        position += segment.text.length;
      }
      
      currentX += segment.width + (segment.isLink || segment.isEmail ? 16 : 0);
      if (currentX > canvas.width - 32) {
        currentX = 16;
        currentY += lineHeight;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (isComposing) return;

    let newValue = value;
    let newPosition = cursorPosition;

    switch (e.key) {
      case 'Backspace':
        if (newPosition > 0) {
          newValue = value.slice(0, newPosition - 1) + value.slice(newPosition);
          newPosition--;
        }
        break;
      case 'Delete':
        if (newPosition < value.length) {
          newValue = value.slice(0, newPosition) + value.slice(newPosition + 1);
        }
        break;
      case 'ArrowLeft':
        if (newPosition > 0) newPosition--;
        break;
      case 'ArrowRight':
        if (newPosition < value.length) newPosition++;
        break;
      case 'Home':
        newPosition = 0;
        break;
      case 'End':
        newPosition = value.length;
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          if (value.length < (maxLength || Infinity)) {
            newValue = value.slice(0, newPosition) + e.key + value.slice(newPosition);
            newPosition++;
          }
        }
    }

    if (newValue !== value) {
      onChange(newValue);
    }
    if (newPosition !== cursorPosition) {
      setCursorPosition(newPosition);
    }

    if (e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  // Update segments when value changes
  useEffect(() => {
    if (canvasRef.current) {
      setSegments(getTextSegments(value));
    }
  }, [value]);

  // Draw when segments or cursor changes
  useEffect(() => {
    drawText();
  }, [segments, cursorPosition]);

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const updateSize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        canvas.getContext('2d')!.scale(window.devicePixelRatio, window.devicePixelRatio);
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  return (
    <div className="relative">
      <div className="relative bg-white rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all duration-200">
        <canvas
          ref={canvasRef}
          className="w-full min-h-[96px]"
          onClick={handleCanvasClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        />
      </div>
      <div className="flex justify-between mt-1">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-xs text-gray-500 ml-auto">
          {value.length}/{maxLength} characters
        </p>
      </div>
    </div>
  );
}