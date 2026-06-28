'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeftRight,
  ChevronRight,
  Pin,
  Search,
  UserPlus,
  X,
} from 'lucide-react';
import WntedLogo from '@/components/WntedLogo';
import ProfileInboxChatView, {
  type InboxChatMessage,
  type InboxChatParticipant,
} from '@/components/ProfileInboxChatView';
import styles from '@/app/home/home.module.css';

const initialsAvatarStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1.5px solid rgba(143,168,188,0.4)',
};

type FriendChat = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color: string;
  preview: string;
  time: string;
  unread?: boolean;
};

type TradeRequest = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color: string;
  offering: string;
  offeringImage: string;
  time: string;
};

type BotPriceMessage = {
  id: string;
  productName: string;
  image: string;
  previousPrice: number;
  currentPrice: number;
  time: string;
  unread?: boolean;
};

const PINNED_FRIENDS = [
  { id: 'maya', name: 'Maya', handle: '@maya.studies', initials: 'MC', color: '#8FA8BC' },
  { id: 'noah', name: 'Noah', handle: '@noahcreates', initials: 'NK', color: '#A8BC8F' },
  { id: 'zoe', name: 'Zoe', handle: '@zoebeauty', initials: 'ZR', color: '#BC8FA8' },
  { id: 'chloe', name: 'Chloe', handle: '@chloewishlist', initials: 'CP', color: '#BCA88F' },
  { id: 'alex', name: 'Alex', handle: '@alexkicks', initials: 'AT', color: '#8FA0BC' },
] as const;

const OWNED_TRADE_ITEMS = [
  { id: 'japan1', name: 'Japanese Garden', image: '/backgrounds/japan1.png' },
  { id: 'japan3', name: 'Sakura View', image: '/backgrounds/japan3.png' },
  { id: 'moss-dew-green', name: 'Dark Jungle Green', image: '/backgrounds/moss-dew/dark-jungle-green.png' },
  { id: 'white-pure', name: 'Pure White', image: '/backgrounds/white/pure-white.png' },
] as const;

const INITIAL_CHATS: FriendChat[] = [
  {
    id: 'chat-maya',
    name: 'Maya Chen',
    handle: '@maya.studies',
    initials: 'MC',
    color: '#8FA8BC',
    preview: 'Did you see the PS5 price drop?',
    time: '2m',
    unread: true,
  },
  {
    id: 'chat-noah',
    name: 'Noah Kim',
    handle: '@noahcreates',
    initials: 'NK',
    color: '#A8BC8F',
    preview: 'Want to trade backgrounds this week?',
    time: '1h',
    unread: true,
  },
  {
    id: 'chat-zoe',
    name: 'Zoe Reed',
    handle: '@zoebeauty',
    initials: 'ZR',
    color: '#BC8FA8',
    preview: 'Your Dyson goal is so close!',
    time: 'Yesterday',
  },
];

const INITIAL_TRADES: TradeRequest[] = [
  {
    id: 'trade-alex',
    name: 'Alex Torres',
    handle: '@alexkicks',
    initials: 'AT',
    color: '#8FA0BC',
    offering: 'Sakura View',
    offeringImage: '/backgrounds/japan3.png',
    time: '3h ago',
  },
  {
    id: 'trade-chloe',
    name: 'Chloe Park',
    handle: '@chloewishlist',
    initials: 'CP',
    color: '#BCA88F',
    offering: 'Japanese Garden',
    offeringImage: '/backgrounds/japan1.png',
    time: 'Yesterday',
  },
];

const INITIAL_BOT_MESSAGES: BotPriceMessage[] = [
  {
    id: 'price-macbook',
    productName: 'Macbook Pro 14',
    image: '/macBook.png',
    previousPrice: 1999,
    currentPrice: 1899,
    time: 'Today',
    unread: true,
  },
  {
    id: 'price-af1',
    productName: 'Air Forces 1 Blue',
    image: '/GreenSambas.png',
    previousPrice: 105,
    currentPrice: 89,
    time: 'Today',
    unread: true,
  },
  {
    id: 'price-ps5',
    productName: 'PlayStation 5',
    image: '/Ps5.png',
    previousPrice: 549,
    currentPrice: 499,
    time: 'Yesterday',
  },
  {
    id: 'price-headphones',
    productName: 'Sony Headphones',
    image: '/headphone.png',
    previousPrice: 320,
    currentPrice: 279,
    time: '2d ago',
  },
];

const CHAT_THREADS: Record<string, InboxChatMessage[]> = {
  'chat-maya': [
    {
      id: 'maya-1',
      text: 'Did you see the PS5 price drop?',
      fromMe: false,
    },
    {
      id: 'maya-2',
      text: 'Yes! I moved it to the top of my wishlist.',
      fromMe: true,
    },
    {
      id: 'maya-3',
      text: 'Same, the Wnted alert was so fast',
      fromMe: false,
    },
  ],
  'chat-noah': [
    {
      id: 'noah-1',
      text: 'Want to trade backgrounds this week?',
      fromMe: false,
    },
    {
      id: 'noah-2',
      text: 'Maybe — what are you offering?',
      fromMe: true,
    },
  ],
  'chat-zoe': [
    {
      id: 'zoe-1',
      text: 'Your Dyson goal is so close!',
      fromMe: false,
    },
    {
      id: 'zoe-2',
      text: 'Almost there, just need one more deposit',
      fromMe: true,
    },
  ],
  'chat-chloe': [
    {
      id: 'chloe-1',
      text: 'Sent you a trade offer ✦',
      fromMe: false,
    },
  ],
  'chat-alex': [
    {
      id: 'alex-1',
      text: 'Hey! Still down to swap backgrounds?',
      fromMe: false,
    },
  ],
  wnted: [
    {
      id: 'bot-1',
      text: 'Macbook Pro 14 dropped to $1,899 — save $100',
      fromMe: false,
    },
    {
      id: 'bot-2',
      text: 'Air Forces 1 Blue dropped to $89 — save $16',
      fromMe: false,
    },
  ],
};

const glassRowStyle: React.CSSProperties = {
  background: 'rgba(250,247,239,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.1)',
};

const formatPrice = (amount: number) =>
  `$${amount.toLocaleString('en-US')}`;

const formatBotPreview = (message: BotPriceMessage) => {
  const delta = message.currentPrice - message.previousPrice;
  if (delta < 0) {
    return `${message.productName} dropped to ${formatPrice(message.currentPrice)} — save ${formatPrice(Math.abs(delta))}`;
  }
  return `${message.productName} is now ${formatPrice(message.currentPrice)}`;
};

type ProfileInboxDrawerProps = {
  open: boolean;
  onClose: () => void;
  backgroundImage?: string | null;
  onUnreadCountChange?: (count: number) => void;
  onOpenUserProfile?: (handle: string) => void;
};

export function getInboxUnreadCount(
  chats: FriendChat[],
  trades: TradeRequest[],
  botMessages: BotPriceMessage[]
) {
  return (
    chats.filter((chat) => chat.unread).length +
    trades.length +
    botMessages.filter((message) => message.unread).length
  );
}

export default function ProfileInboxDrawer({
  open,
  onClose,
  backgroundImage = null,
  onUnreadCountChange,
  onOpenUserProfile,
}: ProfileInboxDrawerProps) {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [botMessages, setBotMessages] = useState(INITIAL_BOT_MESSAGES);
  const [tradesExpanded, setTradesExpanded] = useState(false);
  const [expandedOfferTradeId, setExpandedOfferTradeId] = useState<string | null>(
    null
  );
  const [selectedOfferItems, setSelectedOfferItems] = useState<
    Record<string, string>
  >({});
  const [activeChat, setActiveChat] = useState<InboxChatParticipant | null>(null);

  const tradePreview = useMemo(() => {
    if (trades.length === 0) return 'No pending offers';
    if (trades.length === 1) {
      return `${trades[0].name.split(' ')[0]} sent an offer`;
    }
    return `${trades.length} pending offers`;
  }, [trades]);

  useEffect(() => {
    if (open) return;
    setActiveChat(null);
  }, [open]);

  useEffect(() => {
    onUnreadCountChange?.(getInboxUnreadCount(chats, trades, botMessages));
  }, [chats, trades, botMessages, onUnreadCountChange]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeChat) {
          setActiveChat(null);
          return;
        }
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, activeChat]);

  const markChatRead = (chatId: string) => {
    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId ? { ...chat, unread: false } : chat
      )
    );
  };

  const openChat = (participant: InboxChatParticipant) => {
    setActiveChat(participant);
    if (!participant.isBot) {
      const chatId = participant.id.startsWith('chat-')
        ? participant.id
        : `chat-${participant.id}`;
      markChatRead(chatId);
    }
  };

  const openChatFromFriend = (chat: FriendChat) => {
    openChat({
      id: chat.id,
      name: chat.name,
      handle: chat.handle,
      initials: chat.initials,
      color: chat.color,
      activeLabel: `Active ${chat.time === 'Yesterday' ? '1d ago' : chat.time}`,
    });
  };

  const openChatFromPinned = (friend: (typeof PINNED_FRIENDS)[number]) => {
    const existing = chats.find((chat) => chat.id === `chat-${friend.id}`);
    if (existing) {
      openChatFromFriend(existing);
      return;
    }

    openChat({
      id: `chat-${friend.id}`,
      name: friend.name,
      handle: friend.handle,
      initials: friend.initials,
      color: friend.color,
      activeLabel: 'Active recently',
    });
  };

  const openWntedBotChat = () => {
    setBotMessages((current) =>
      current.map((message) => ({ ...message, unread: false }))
    );
    openChat({
      id: 'wnted',
      name: 'Wnted',
      handle: 'Price alerts',
      initials: 'W',
      color: '#8FA8BC',
      activeLabel: 'Automated updates',
      isBot: true,
    });
  };

  const activeMessages =
    activeChat && CHAT_THREADS[activeChat.id]
      ? CHAT_THREADS[activeChat.id]
      : activeChat
        ? [
            {
              id: 'fallback',
              text: 'Start a conversation',
              fromMe: false,
            },
          ]
        : [];

  const handleTradeAction = (tradeId: string) => {
    setTrades((current) => current.filter((trade) => trade.id !== tradeId));
    setExpandedOfferTradeId((current) => (current === tradeId ? null : current));
    setSelectedOfferItems((current) => {
      const next = { ...current };
      delete next[tradeId];
      return next;
    });
  };

  const toggleOfferPicker = (tradeId: string) => {
    setExpandedOfferTradeId((current) => (current === tradeId ? null : tradeId));
  };

  const selectOfferItem = (tradeId: string, itemId: string) => {
    setSelectedOfferItems((current) => ({ ...current, [tradeId]: itemId }));
  };

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 z-[200]"
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`absolute inset-0 z-[210] flex flex-col overflow-hidden font-clash text-white ${styles.drawerPanel} ${open ? styles.drawerPanelOpen : ''} ${styles.homeScroll}`}
        style={{
          background: backgroundImage ? 'transparent' : '#000000',
          borderLeft: '1px solid rgba(250,247,239,0.12)',
        }}
        aria-hidden={!open}
      >
        {backgroundImage && (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <Image
              src={backgroundImage}
              alt=""
              fill
              className="scale-110 object-cover blur-2xl"
              sizes="390px"
              priority
            />
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
          </div>
        )}

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {activeChat ? (
          <ProfileInboxChatView
            participant={activeChat}
            messages={activeMessages}
            onBack={() => setActiveChat(null)}
            onTrade={() => {
              setActiveChat(null);
              setTradesExpanded(true);
            }}
            onOpenProfile={onOpenUserProfile}
          />
        ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between px-4 pb-3 pt-[52px]">
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-1"
              aria-label="Add friends"
            >
              <UserPlus size={22} className="text-white" strokeWidth={2} />
            </button>
            <h2 className="text-[17px] font-semibold text-[#FAF7EF]">Inbox</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-1"
                aria-label="Search inbox"
              >
                <Search size={22} className="text-white" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-none bg-transparent p-1"
                aria-label="Close inbox"
              >
                <X size={20} className="text-white" style={{ opacity: 0.55 }} />
              </button>
            </div>
          </div>

          <div className="shrink-0 px-4 pb-1 pt-1">
            <p
              className="text-[10px] font-medium uppercase tracking-[1.2px] text-white"
              style={{ opacity: 0.35 }}
            >
              Pinned friends
            </p>
          </div>

          <div
            className="flex shrink-0 gap-3 overflow-x-auto px-4 pb-4"
            style={{ scrollbarWidth: 'none' }}
          >
            <button
              type="button"
              className="flex w-[62px] shrink-0 cursor-pointer flex-col items-center border-none bg-transparent p-0"
              aria-label="Pin a friend"
            >
              <div className="relative">
                <div
                  className="flex h-[54px] w-[54px] items-center justify-center rounded-full"
                  style={{
                    background: 'rgba(250,247,239,0.06)',
                    border: '1.5px dashed rgba(250,247,239,0.22)',
                  }}
                >
                  <Pin size={18} className="text-white" style={{ opacity: 0.55 }} />
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[12px] font-bold text-white"
                  style={{ background: '#8FA8BC' }}
                >
                  +
                </span>
              </div>
              <span
                className="mt-1.5 w-full truncate text-center text-[10px] text-white"
                style={{ opacity: 0.55 }}
              >
                Pin
              </span>
            </button>

            {PINNED_FRIENDS.map((friend) => (
              <button
                key={friend.id}
                type="button"
                onClick={() => openChatFromPinned(friend)}
                className="flex w-[62px] shrink-0 cursor-pointer flex-col items-center border-none bg-transparent p-0"
                aria-label={`Open chat with ${friend.name}`}
              >
                <div className="relative">
                  <div
                    className="flex h-[54px] w-[54px] items-center justify-center rounded-full text-[12px] font-semibold text-white"
                    style={initialsAvatarStyle}
                  >
                    {friend.initials}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 flex h-[16px] w-[16px] items-center justify-center rounded-full"
                    style={{
                      background: 'rgba(38,48,59,0.92)',
                      border: '1px solid rgba(143,168,188,0.35)',
                    }}
                    aria-hidden="true"
                  >
                    <Pin size={9} className="text-white" style={{ opacity: 0.8 }} />
                  </span>
                </div>
                <span
                  className="mt-1.5 w-full truncate text-center text-[10px] text-white"
                  style={{ opacity: 0.75 }}
                >
                  {friend.name}
                </span>
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pb-8">
            <button
              type="button"
              onClick={() => setTradesExpanded((expanded) => !expanded)}
              className="flex w-full cursor-pointer items-center gap-3 border-none px-4 py-3 text-left transition-colors hover:bg-[rgba(250,247,239,0.04)]"
              style={{ borderBottom: '1px solid rgba(250,247,239,0.06)' }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'rgba(143,168,188,0.22)' }}
              >
                <ArrowLeftRight size={20} className="text-white" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-white">Trade Requests</p>
                <p className="mt-0.5 truncate text-[12px] text-white" style={{ opacity: 0.45 }}>
                  {tradePreview}
                </p>
              </div>
              {trades.length > 0 && (
                <span
                  className="mr-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: '#FF3B30' }}
                  aria-hidden="true"
                />
              )}
              <ChevronRight
                size={16}
                className="shrink-0 text-white"
                style={{
                  opacity: 0.35,
                  transform: tradesExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {tradesExpanded && trades.length > 0 && (
              <div className="flex flex-col gap-3 px-4 py-3">
                {trades.map((trade) => {
                  const selectedOfferId = selectedOfferItems[trade.id];
                  const selectedOffer = OWNED_TRADE_ITEMS.find(
                    (item) => item.id === selectedOfferId
                  );
                  const offerPickerOpen = expandedOfferTradeId === trade.id;

                  return (
                    <div
                      key={trade.id}
                      className="overflow-hidden rounded-[14px] p-3"
                      style={glassRowStyle}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                          style={initialsAvatarStyle}
                        >
                          {trade.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-white">
                            {trade.name}
                          </p>
                          <p className="text-[10px] text-white" style={{ opacity: 0.4 }}>
                            {trade.handle} · {trade.time}
                          </p>
                        </div>
                      </div>

                      <div
                        className="mt-3 flex items-center gap-3 rounded-[10px] p-2.5"
                        style={{ background: 'rgba(0,0,0,0.22)' }}
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px]">
                          <Image
                            src={trade.offeringImage}
                            alt={trade.offering}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-white" style={{ opacity: 0.45 }}>
                            Offering
                          </p>
                          <p className="text-[12px] font-medium text-white">
                            {trade.offering}
                          </p>
                        </div>
                      </div>

                      {selectedOffer && (
                        <div
                          className="mt-2 flex items-center gap-3 rounded-[10px] p-2.5"
                          style={{ background: 'rgba(143,168,188,0.1)' }}
                        >
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[8px]">
                            <Image
                              src={selectedOffer.image}
                              alt={selectedOffer.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-white" style={{ opacity: 0.45 }}>
                              Your offer
                            </p>
                            <p className="text-[11px] font-medium text-white">
                              {selectedOffer.name}
                            </p>
                          </div>
                        </div>
                      )}

                      {offerPickerOpen && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {OWNED_TRADE_ITEMS.map((item) => {
                            const isSelected = selectedOfferId === item.id;

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => selectOfferItem(trade.id, item.id)}
                                className="flex cursor-pointer items-center gap-2 rounded-[10px] border-none p-2 text-left"
                                style={{
                                  background: isSelected
                                    ? 'rgba(143,168,188,0.18)'
                                    : 'rgba(0,0,0,0.22)',
                                  border: isSelected
                                    ? '1px solid rgba(143,168,188,0.35)'
                                    : '1px solid rgba(250,247,239,0.08)',
                                }}
                              >
                                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[6px]">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="36px"
                                  />
                                </div>
                                <span className="truncate text-[10px] font-medium text-white">
                                  {item.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleOfferPicker(trade.id)}
                          className="flex flex-1 cursor-pointer items-center justify-center rounded-[10px] border-none py-2 text-[11px] font-semibold text-white"
                          style={{
                            background: offerPickerOpen
                              ? 'rgba(143,168,188,0.22)'
                              : 'rgba(250,247,239,0.06)',
                            border: offerPickerOpen
                              ? '1px solid rgba(143,168,188,0.35)'
                              : '1px solid rgba(250,247,239,0.1)',
                          }}
                        >
                          Offer Item
                        </button>
                        <button
                          type="button"
                          disabled={!selectedOfferId}
                          onClick={() => handleTradeAction(trade.id)}
                          className="flex flex-1 cursor-pointer items-center justify-center rounded-[10px] border-none py-2 text-[11px] font-semibold text-[#FAF7EF] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                          style={{
                            background: 'rgba(250,247,239,0.14)',
                            border: '1px solid rgba(250,247,239,0.18)',
                          }}
                        >
                          Send Request
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTradeAction(trade.id)}
                        className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-[10px] border-none py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                        style={{
                          background: 'rgba(255,59,48,0.12)',
                          border: '1px solid rgba(255,59,48,0.28)',
                        }}
                      >
                        Decline Offer
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {botMessages.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={openWntedBotChat}
                className="flex w-full cursor-pointer items-center gap-3 border-none px-4 py-3 text-left transition-colors hover:bg-[rgba(250,247,239,0.04)]"
                style={{ borderBottom: '1px solid rgba(250,247,239,0.06)' }}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full"
                  style={{
                    background: 'rgba(250,247,239,0.1)',
                    border: '1px solid rgba(250,247,239,0.14)',
                  }}
                >
                  <WntedLogo size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-semibold text-white">
                      Wnted
                    </p>
                    <span
                      className="shrink-0 text-[11px] text-white"
                      style={{ opacity: 0.35 }}
                    >
                      {message.time}
                    </span>
                  </div>
                  <p
                    className="mt-0.5 truncate text-[12px] text-white"
                    style={{ opacity: message.unread ? 0.7 : 0.45 }}
                  >
                    {formatBotPreview(message)}
                  </p>
                </div>
                {message.unread && (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: '#FF3B30' }}
                    aria-label="Unread"
                  />
                )}
              </button>
            ))}

            {chats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => openChatFromFriend(chat)}
                className="flex w-full cursor-pointer items-center gap-3 border-none px-4 py-3 text-left transition-colors hover:bg-[rgba(250,247,239,0.04)]"
                style={{ borderBottom: '1px solid rgba(250,247,239,0.06)' }}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                  style={initialsAvatarStyle}
                >
                  {chat.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-semibold text-white">
                      {chat.name}
                    </p>
                    <span
                      className="shrink-0 text-[11px] text-white"
                      style={{ opacity: 0.35 }}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <p
                    className="mt-0.5 truncate text-[12px] text-white"
                    style={{ opacity: chat.unread ? 0.7 : 0.45 }}
                  >
                    {chat.preview}
                  </p>
                </div>
                {chat.unread && (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: '#FF3B30' }}
                    aria-label="Unread"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        )}
        </div>
      </div>
    </>
  );
}
