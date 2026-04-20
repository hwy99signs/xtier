'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, ShieldCheck } from 'lucide-react';
import { cn, formatDateTime } from '@/lib/utils';
import { sendMessage, markAsRead } from '@/actions/message';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  sender: { firstName: string; lastName: string };
}

interface ChatInterfaceProps {
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  initialMessages: any[];
  otherUserRole?: string;
  backHref?: string;
}

export function ChatInterface({
  currentUserId,
  otherUserId,
  otherUserName,
  initialMessages,
  otherUserRole = 'Chauffeur',
  backHref
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map(m => ({ ...m, createdAt: new Date(m.createdAt) }))
  );
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMessages(initialMessages.map(m => ({ ...m, createdAt: new Date(m.createdAt) })));
    
    // Mark as read on mount/messages update
    if (initialMessages.length > 0) {
      markAsRead(otherUserId);
    }
  }, [initialMessages, otherUserId]);

  // Polling for updates
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const content = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    try {
      const result = await sendMessage(otherUserId, content);
      if (result.success && result.message) {
        // Append message immediately for responsive feel
        const newMessage = {
          ...result.message,
          createdAt: new Date(result.message.createdAt),
          sender: { firstName: 'You', lastName: '' } // Placeholder for local view
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] card-glass border-[#1a1a1a] overflow-hidden bg-black/40">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-[#1a1a1a] bg-black/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link 
              href={backHref}
              className="mr-2 p-2 rounded-xl hover:bg-white/5 transition-colors text-[#D4AF37]"
            >
              <ArrowLeft size={18} />
            </Link>
          )}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold">
            {otherUserName[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">{otherUserName}</p>
            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} /> {otherUserRole}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-bold text-[#555] uppercase tracking-widest">Secure Line</span>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-3">
            <Send size={40} className="text-[#D4AF37]" />
            <p className="text-xs uppercase tracking-[0.2em] font-bold">Encrypted communication live</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={cn(
                "flex flex-col max-w-[80%]",
                isMe ? "ml-auto items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words",
                  isMe 
                    ? "bg-[#D4AF37] text-black font-medium rounded-tr-none shadow-[0_4px_20px_rgba(212,175,55,0.1)]" 
                    : "bg-[#1a1a1a] text-[#A0A0A0] rounded-tl-none border border-white/5"
                )}>
                  {msg.content}
                </div>
                <p className="text-[9px] text-[#444] font-bold mt-1 uppercase tracking-tighter">
                  {formatDateTime(msg.createdAt)}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#1a1a1a] bg-black/60">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all pr-12"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className={cn(
              "absolute right-2 top-1.5 p-1.5 rounded-lg transition-all",
              inputValue.trim() ? "text-[#D4AF37] hover:bg-[#D4AF37]/10" : "text-[#333]"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
// Re-export Link if needed, but it's imported from next/link
import Link from 'next/link';
