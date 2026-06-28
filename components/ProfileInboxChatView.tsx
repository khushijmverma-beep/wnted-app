'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Camera,
  ChevronLeft,
  Image as ImageIcon,
  Mic,
  Plus,
  Smile,
} from 'lucide-react';
import WntedLogo from '@/components/WntedLogo';

export type InboxChatParticipant = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color: string;
  activeLabel?: string;
  isBot?: boolean;
};

export type InboxChatMessage = {
  id: string;
  text: string;
  fromMe: boolean;
};

const inputBarStyle: React.CSSProperties = {
  background: 'rgba(250,247,239,0.08)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
};

type ProfileInboxChatViewProps = {
  participant: InboxChatParticipant;
  messages: InboxChatMessage[];
  onBack: () => void;
  onTrade?: () => void;
  onOpenProfile?: (handle: string) => void;
};

export default function ProfileInboxChatView({
  participant,
  messages,
  onBack,
  onTrade,
  onOpenProfile,
}: ProfileInboxChatViewProps) {
  const [draft, setDraft] = useState('');
  const isFriend = !participant.isBot;

  const openProfile = () => {
    if (!isFriend || !onOpenProfile) return;
    onOpenProfile(participant.handle);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="flex shrink-0 items-center gap-2 border-b px-3 pb-3 pt-[52px]"
        style={{ borderColor: 'rgba(250,247,239,0.08)' }}
      >
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 cursor-pointer border-none bg-transparent p-1"
          aria-label="Back to inbox"
        >
          <ChevronLeft size={24} className="text-white" strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={openProfile}
          disabled={!isFriend}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 border-none bg-transparent p-0 text-left disabled:cursor-default"
          aria-label={isFriend ? `View ${participant.name}'s profile` : participant.name}
        >
          {participant.isBot ? (
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{
                background: 'rgba(250,247,239,0.1)',
                border: '1px solid rgba(250,247,239,0.14)',
              }}
            >
              <WntedLogo size={22} />
            </div>
          ) : (
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
              style={{ background: participant.color }}
            >
              {participant.initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-white">
              {participant.name}
            </p>
            <p className="truncate text-[11px] text-white" style={{ opacity: 0.4 }}>
              {participant.activeLabel ?? participant.handle}
            </p>
          </div>
        </button>

        {isFriend && (
          <button
            type="button"
            onClick={onTrade}
            className="shrink-0 cursor-pointer rounded-full border-none px-3 py-1.5 text-[11px] font-semibold text-[#FAF7EF]"
            style={{
              background: 'rgba(250,247,239,0.12)',
              border: '1px solid rgba(250,247,239,0.18)',
            }}
          >
            Trade
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[78%] rounded-[18px] px-3.5 py-2.5 text-[13px] leading-relaxed text-white"
                style={
                  message.fromMe
                    ? {
                        background: 'rgba(143,168,188,0.35)',
                        border: '1px solid rgba(143,168,188,0.45)',
                      }
                    : {
                        background: 'rgba(250,247,239,0.08)',
                        border: '1px solid rgba(250,247,239,0.12)',
                      }
                }
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="shrink-0 border-t px-3 pb-6 pt-2"
        style={{ borderColor: 'rgba(250,247,239,0.08)' }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-none"
            style={inputBarStyle}
            aria-label="Camera"
          >
            <Camera size={18} className="text-white" style={{ opacity: 0.75 }} />
          </button>

          <div
            className="flex min-w-0 flex-1 items-center gap-1 rounded-full px-3 py-2"
            style={inputBarStyle}
          >
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Message..."
              className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-white outline-none placeholder:text-white/35"
            />
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-0.5"
              aria-label="Voice message"
            >
              <Mic size={18} className="text-white" style={{ opacity: 0.5 }} />
            </button>
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-0.5"
              aria-label="Attach image"
            >
              <ImageIcon size={18} className="text-white" style={{ opacity: 0.5 }} />
            </button>
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-0.5"
              aria-label="Stickers"
            >
              <Smile size={18} className="text-white" style={{ opacity: 0.5 }} />
            </button>
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-0.5"
              aria-label="More"
            >
              <Plus size={18} className="text-white" style={{ opacity: 0.5 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InboxPanelBackground({
  backgroundImage,
  children,
}: {
  backgroundImage?: string | null;
  children: React.ReactNode;
}) {
  return (
    <>
      {backgroundImage && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="scale-105 object-cover blur-sm"
            sizes="390px"
            priority
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        </div>
      )}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </>
  );
}
