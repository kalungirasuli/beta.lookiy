'use client';

import { FormEvent, useEffect, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { api, post } from '@/lib/client-api';

type Message = { _id: string; senderId: string; senderRole: string; content: string; createdAt?: string };
type User = { _id: string };

export function JourneyChat({ journeyId, active }: { journeyId: string; active: boolean }) {
  const [messages,setMessages]=useState<Message[]>([]);const [userId,setUserId]=useState('');const [content,setContent]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  useEffect(()=>{let live=true;api<User>('/api/session/me').then(user=>{if(live)setUserId(user._id);}).catch(()=>{});return()=>{live=false;};},[]);
  useEffect(()=>{let live=true;const load=()=>api<{messages:Message[]}>(`/api/client/chat/rooms/${journeyId}/messages?limit=50`).then(result=>{if(live){setMessages(result.messages);setError('');}}).catch(e=>{if(live)setError(e instanceof Error?e.message:'Chat unavailable.');});void load();const timer=setInterval(()=>void load(),15000);return()=>{live=false;clearInterval(timer);};},[journeyId]);
  async function send(event:FormEvent){event.preventDefault();if(!content.trim()||busy)return;setBusy(true);try{await post(`/api/client/chat/rooms/${journeyId}/messages`,{content:content.trim(),type:'TEXT'});setContent('');const result=await api<{messages:Message[]}>(`/api/client/chat/rooms/${journeyId}/messages?limit=50`);setMessages(result.messages);setError('');}catch(e){setError(e instanceof Error?e.message:'Could not send your message.');}finally{setBusy(false);}}
  return <div className="workspace-card" style={{marginTop:19}}><h2 style={{display:'flex',alignItems:'center',gap:9}}><MessageCircle size={21} color="#1769e8"/> Journey room</h2><div className="chat-messages">{messages.length?messages.map(message=><div key={message._id} className={`chat-message ${message.senderId===userId?'own':''}`}><span>{message.senderId===userId?'You':message.senderRole==='OPERATOR'?'Rider':'Journey member'}</span><p>{message.content}</p></div>):<p className="form-hint">No messages yet. Your journey room is ready when you need it.</p>}</div>{error&&<div className="form-error" role="alert" style={{marginTop:12}}>{error}</div>}{active&&<form className="chat-compose" onSubmit={send}><input className="text-field" aria-label="Message your journey room" value={content} onChange={e=>setContent(e.target.value)} placeholder="Message your journey room" maxLength={2000}/><button type="submit" aria-label="Send message" disabled={busy||!content.trim()}><Send size={18}/></button></form>}</div>;
}
