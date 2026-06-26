'use client';

import { useState } from 'react';
import { Copy, Search, Share2 } from 'lucide-react';
import AppPageLayout from '@/components/AppPageLayout';

const currentUser = {
  name: 'Khushi',
  handle: '@khushi',
  profileLink: 'wnted.app/@khushi',
  following: 4,
  followers: 6,
};

const suggestedFriends = [
  {
    id: 1,
    name: 'Maya',
    handle: '@maya_saves',
    initials: 'MA',
    color: '#A8B8C8',
    goals: 3,
  },
  {
    id: 2,
    name: 'Jordan',
    handle: '@jordanwants',
    initials: 'JO',
    color: '#8FA8BC',
    goals: 5,
  },
  {
    id: 3,
    name: 'Riley',
    handle: '@riley.wnts',
    initials: 'RI',
    color: '#7A94A8',
    goals: 2,
  },
  {
    id: 4,
    name: 'Chloe',
    handle: '@chloewishlist',
    initials: 'CH',
    color: '#94A8B8',
    goals: 7,
  },
  {
    id: 5,
    name: 'Nadia',
    handle: '@nadia_goals',
    initials: 'NA',
    color: '#6B879C',
    goals: 4,
  },
];

const friends = [
  {
    id: 1,
    name: 'Priya',
    handle: '@priya.saves',
    initials: 'PR',
    color: '#A8B8C8',
    goals: 4,
    topGoal: 'Stanley Cup',
  },
  {
    id: 2,
    name: 'Aisha',
    handle: '@aishawants',
    initials: 'AI',
    color: '#8FA8BC',
    goals: 6,
    topGoal: 'Dyson Airwrap',
  },
  {
    id: 3,
    name: 'Zoe',
    handle: '@zoewishlist',
    initials: 'ZO',
    color: '#7A94A8',
    goals: 2,
    topGoal: 'MacBook Air',
  },
];

const friendActivity = [
  {
    id: 1,
    name: 'Priya',
    initials: 'PR',
    color: '#A8B8C8',
    action: 'contributed $25 to your Macbook goal',
    time: '2h ago',
    type: 'contribution',
    goalName: 'Macbook Pro 14',
    canContribute: false,
  },
  {
    id: 2,
    name: 'Aisha',
    initials: 'AI',
    color: '#8FA8BC',
    action: 'is saving for Dyson Airwrap',
    time: '5h ago',
    type: 'friend_goal',
    goalName: 'Dyson Airwrap',
    goalFunded: 200,
    goalTotal: 499,
    canContribute: true,
  },
  {
    id: 3,
    name: 'Zoe',
    initials: 'ZO',
    color: '#7A94A8',
    action: 'reached 100% on Stanley Cup!',
    time: '1d ago',
    type: 'milestone',
    goalName: 'Stanley Cup',
    canContribute: false,
  },
  {
    id: 4,
    name: 'Priya',
    initials: 'PR',
    color: '#94A8B8',
    action: 'started saving for AirPods Max',
    time: '2d ago',
    type: 'friend_goal',
    goalName: 'AirPods Max',
    goalFunded: 50,
    goalTotal: 549,
    canContribute: true,
  },
];

const priceAlerts = [
  {
    id: 1,
    item: 'Macbook Pro 14',
    change: -150,
    oldPrice: 2000,
    newPrice: 1850,
    time: '2h ago',
  },
  {
    id: 2,
    item: 'Air Forces 1 Blue',
    change: -20,
    oldPrice: 110,
    newPrice: 90,
    time: '3h ago',
  },
  {
    id: 3,
    item: 'Bottega Veneta Bag',
    change: 200,
    oldPrice: 3900,
    newPrice: 4100,
    time: '1d ago',
  },
];

const contributeQuickAmounts = [5, 10, 25, 50];

const ACCENT_BLUE = '#8FA8BC';
const ACCENT_BLUE_LIGHT = '#A8B8C8';
const ACCENT_BLUE_DARK = '#5E7384';

const cardStyle: React.CSSProperties = {
  background: 'rgba(250,247,239,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
  borderRadius: '16px',
  padding: '14px',
};

const innerGlassStyle: React.CSSProperties = {
  background: 'rgba(250,247,239,0.08)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
};

const horizontalScrollClass =
  'flex overflow-x-auto gap-2.5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const formatMoney = (amount: number) =>
  `$${amount.toLocaleString('en-US')}`;

export default function ActivityPage() {
  const [followedIds, setFollowedIds] = useState<number[]>([]);
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<string | null>(null);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [contributeAmount, setContributeAmount] = useState('');
  const [selectedContributeAmount, setSelectedContributeAmount] = useState<
    number | null
  >(null);

  const toggleFollow = (id: number) => {
    setFollowedIds((current) =>
      current.includes(id)
        ? current.filter((friendId) => friendId !== id)
        : [...current, id]
    );
  };

  const handleCopyHandle = async () => {
    try {
      await navigator.clipboard.writeText(currentUser.profileLink);
      setCopiedHandle(true);
      setTimeout(() => setCopiedHandle(false), 2000);
    } catch {
      setCopiedHandle(true);
      setTimeout(() => setCopiedHandle(false), 2000);
    }
  };

  const openContributeSheet = (goalName: string) => {
    setContributeGoal(goalName);
    setIsContributeOpen(true);
    setContributeAmount('');
    setSelectedContributeAmount(null);
  };

  const closeContributeSheet = () => {
    setIsContributeOpen(false);
    setContributeGoal(null);
    setContributeAmount('');
    setSelectedContributeAmount(null);
  };

  const handleContributeAmountChange = (value: string) => {
    setContributeAmount(value);
    const parsed = Number(value);
    setSelectedContributeAmount(parsed > 0 ? parsed : null);
  };

  const handleQuickContribute = (amount: number) => {
    setContributeAmount(String(amount));
    setSelectedContributeAmount(amount);
  };

  return (
    <AppPageLayout>
      <div className="relative h-full overflow-hidden">
        {/* PAGE WRAPPER */}
        <div className="flex h-full flex-col gap-3 overflow-y-auto px-4 pt-[52px] pb-[90px] font-clash text-white">
          {/* HEADER */}
          <h1 className="mb-1 text-[28px] font-normal text-[#FAF7EF]">Activity</h1>

          {/* YOUR HANDLE CARD */}
          <div style={cardStyle}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(143,168,188,0.35) 0%, rgba(143,168,188,0.12) 100%)',
                    border: '1.5px solid rgba(143,168,188,0.4)',
                  }}
                >
                  K
                </div>
                <div>
                  <p className="text-[15px] font-bold text-white">
                    {currentUser.name}
                  </p>
                  <p
                    className="text-[11px] text-white"
                    style={{ opacity: 0.4 }}
                  >
                    {currentUser.handle}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span
                  className="rounded-full border px-3 py-1 text-[10px] text-[#FAF7EF]"
                  style={{
                    ...innerGlassStyle,
                    opacity: 0.7,
                  }}
                >
                  {currentUser.following} following
                </span>
                <span
                  className="rounded-full border px-3 py-1 text-[10px] text-[#FAF7EF]"
                  style={{
                    ...innerGlassStyle,
                    opacity: 0.7,
                  }}
                >
                  {currentUser.followers} followers
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyHandle}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border py-2.5"
                style={{
                  ...innerGlassStyle,
                }}
              >
                <Copy
                  size={14}
                  className="text-white"
                  style={{ opacity: copiedHandle ? 0.8 : 0.5 }}
                />
                <span
                  className="text-[10px] text-white"
                  style={{ opacity: copiedHandle ? 0.8 : 0.5 }}
                >
                  {copiedHandle ? 'Copied!' : currentUser.profileLink}
                </span>
              </button>
              <button
                type="button"
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border py-2.5 text-[11px] font-bold text-[#FAF7EF]"
                style={{
                  ...innerGlassStyle,
                  background: 'rgba(143,168,188,0.22)',
                  borderColor: 'rgba(143,168,188,0.35)',
                }}
              >
                <Share2 size={14} className="text-[#FAF7EF]" />
                Share Profile
              </button>
            </div>
          </div>

          {/* FRIENDS ACTIVITY FEED */}
          <div style={cardStyle}>
            <p className="mb-3 text-[13px] font-semibold text-white">
              Friends Activity
            </p>

            {friendActivity.map((activity, index) => {
              const progressPercent =
                activity.type === 'friend_goal' &&
                activity.goalFunded != null &&
                activity.goalTotal
                  ? Math.round(
                      (activity.goalFunded / activity.goalTotal) * 100
                    )
                  : 0;

              return (
                <div
                  key={activity.id}
                  className="flex items-stretch gap-2.5 py-3"
                  style={{
                    borderBottom:
                      index === friendActivity.length - 1
                        ? 'none'
                        : '1px solid rgba(250,247,239,0.06)',
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{
                      background: `${activity.color}40`,
                      border: `1.5px solid ${activity.color}66`,
                    }}
                  >
                    {activity.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-white">
                      {activity.name}
                    </p>
                    <p
                      className="mt-0.5 text-[11px] leading-[1.4] text-white"
                      style={{ opacity: 0.45 }}
                    >
                      {activity.action}
                    </p>

                    {activity.type === 'friend_goal' &&
                      activity.canContribute &&
                      activity.goalFunded != null &&
                      activity.goalTotal != null && (
                        <div className="mt-1.5">
                          <div
                            className="h-[3px] overflow-hidden rounded-sm"
                            style={{ background: 'rgba(250,247,239,0.1)' }}
                          >
                            <div
                              className="h-full rounded-sm"
                              style={{
                                width: `${progressPercent}%`,
                                background: ACCENT_BLUE,
                              }}
                            />
                          </div>
                          <p
                            className="mt-[3px] text-[9px] text-white"
                            style={{ opacity: 0.3 }}
                          >
                            {formatMoney(activity.goalFunded)} of{' '}
                            {formatMoney(activity.goalTotal)}
                          </p>
                        </div>
                      )}

                    {activity.type === 'milestone' && (
                      <span
                        className="mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold"
                        style={{
                          background: 'rgba(143,168,188,0.15)',
                          color: ACCENT_BLUE_LIGHT,
                        }}
                      >
                        🎉 Goal Complete!
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex shrink-0 flex-col items-end self-stretch ${
                      activity.canContribute ? 'justify-between' : 'justify-start'
                    }`}
                  >
                    <span
                      className="whitespace-nowrap text-[9px] text-white"
                      style={{ opacity: 0.25 }}
                    >
                      {activity.time}
                    </span>
                    {activity.canContribute && (
                      <button
                        type="button"
                        onClick={() => openContributeSheet(activity.goalName)}
                        className="cursor-pointer rounded-lg border px-2.5 py-1 text-[9px] font-semibold text-[#FAF7EF]"
                        style={innerGlassStyle}
                      >
                        Contribute
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PRICE ALERTS */}
          <div style={cardStyle}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-white">
                Price Alerts
              </p>
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                style={{
                  background: 'rgba(143,168,188,0.15)',
                  color: ACCENT_BLUE_LIGHT,
                }}
              >
                {priceAlerts.length} new
              </span>
            </div>

            {priceAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className="flex items-center justify-between py-2.5"
                style={{
                  borderBottom:
                    index === priceAlerts.length - 1
                      ? 'none'
                      : '1px solid rgba(250,247,239,0.06)',
                }}
              >
                <div>
                  <p
                    className="text-[13px] font-bold"
                    style={{
                      color:
                        alert.change < 0 ? ACCENT_BLUE_LIGHT : ACCENT_BLUE_DARK,
                    }}
                  >
                    {alert.change < 0 ? '↓' : '↑'}{' '}
                    {formatMoney(Math.abs(alert.change))}{' '}
                    {alert.change < 0 ? 'off' : 'up'}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white">
                    {alert.item}
                  </p>
                  <p
                    className="text-[10px] text-white"
                    style={{ opacity: 0.35 }}
                  >
                    Now {formatMoney(alert.newPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className="text-[9px] text-white"
                    style={{ opacity: 0.25 }}
                  >
                    {alert.time}
                  </span>
                  <button
                    type="button"
                    className="mt-1 block cursor-pointer rounded-lg border px-2.5 py-1 text-[9px] font-medium text-[#FAF7EF]"
                    style={{
                      ...innerGlassStyle,
                      opacity: 0.65,
                    }}
                  >
                    View Item
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 2 — FIND FRIENDS */}
          <div style={cardStyle}>
            <p className="mb-3 text-[13px] font-semibold text-white">
              Find Friends
            </p>

            <div
              className="mb-3.5 flex items-center gap-2 rounded-[10px] border px-3.5 py-2.5"
              style={innerGlassStyle}
            >
              <Search
                size={14}
                className="shrink-0 text-white"
                style={{ opacity: 0.35 }}
              />
              <input
                type="text"
                placeholder="Search by @handle"
                className="w-full border-none bg-transparent font-clash text-[13px] text-white outline-none placeholder:text-white/25"
              />
            </div>

            <p
              className="mb-2.5 text-[9px] uppercase tracking-[1.5px] text-white"
              style={{ opacity: 0.3 }}
            >
              Suggested
            </p>

            <div className={horizontalScrollClass}>
              {suggestedFriends.map((friend) => {
                const isFollowed = followedIds.includes(friend.id);

                return (
                  <div
                    key={friend.id}
                    className="flex min-w-[90px] shrink-0 flex-col items-center gap-1.5 rounded-[14px] border p-3 text-center"
                    style={innerGlassStyle}
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold text-white"
                      style={{
                        background: `${friend.color}4D`,
                        border: `1.5px solid ${friend.color}80`,
                      }}
                    >
                      {friend.initials}
                    </div>
                    <p className="text-[10px] font-semibold text-white">
                      {friend.name}
                    </p>
                    <p
                      className="text-[9px] text-white"
                      style={{ opacity: 0.35 }}
                    >
                      {friend.handle}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleFollow(friend.id)}
                      className="cursor-pointer rounded-full border px-3 py-1 text-[9px] font-bold"
                      style={
                        isFollowed
                          ? {
                              background: 'rgba(143,168,188,0.18)',
                              borderColor: 'rgba(143,168,188,0.35)',
                              color: ACCENT_BLUE_LIGHT,
                            }
                          : {
                              background: 'rgba(250,247,239,0.06)',
                              borderColor: 'rgba(250,247,239,0.15)',
                              color: '#FAF7EF',
                            }
                      }
                    >
                      {isFollowed ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3 — FRIENDS LIST */}
          <div style={cardStyle}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-white">
                Your Friends
              </p>
              <span
                className="text-[10px] text-white"
                style={{ opacity: 0.3 }}
              >
                {friends.length}
              </span>
            </div>

            <div className={horizontalScrollClass}>
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex min-w-[110px] shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-[14px] border px-3 py-3.5 text-center"
                  style={innerGlassStyle}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold text-white"
                    style={{
                      background: `${friend.color}40`,
                      border: `1.5px solid ${friend.color}66`,
                    }}
                  >
                    {friend.initials}
                  </div>
                  <p className="text-[11px] font-semibold text-white">
                    {friend.name}
                  </p>
                  <p
                    className="text-[9px] text-white"
                    style={{ opacity: 0.35 }}
                  >
                    {friend.handle}
                  </p>
                  <span
                    className="rounded-full px-2.5 py-[3px] text-[9px] text-[#FAF7EF]"
                    style={{
                      ...innerGlassStyle,
                      opacity: 0.65,
                    }}
                  >
                    {friend.goals} goals
                  </span>
                  <p
                    className="max-w-[90px] truncate text-[9px] text-white"
                    style={{ opacity: 0.3 }}
                  >
                    {friend.topGoal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTRIBUTE BOTTOM SHEET */}
        {isContributeOpen && (
          <div
            className="absolute inset-0 z-40"
            style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
            onClick={closeContributeSheet}
            aria-hidden="true"
          />
        )}

        <div
          className="absolute bottom-0 left-0 right-0 z-50 px-6 pb-12 pt-5 transition-transform duration-300 ease-out"
          style={{
            background: 'rgba(250,247,239,0.08)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(250,247,239,0.12)',
            borderRadius: '24px 24px 0 0',
            transform: isContributeOpen ? 'translateY(0)' : 'translateY(100%)',
            pointerEvents: isContributeOpen ? 'auto' : 'none',
          }}
        >
          <div
            className="mx-auto mb-4 rounded-full"
            style={{ width: '32px', height: '3px', background: 'rgba(250,247,239,0.2)' }}
          />

          <p
            className="text-[11px] uppercase tracking-[1.5px] text-white"
            style={{ opacity: 0.4 }}
          >
            Contribute to
          </p>
          <p className="mb-5 text-[18px] font-bold text-white">
            {contributeGoal}
          </p>

          <div className="flex items-center justify-center gap-1.5">
            <span
              className="text-[28px] font-light text-white"
              style={{ opacity: 0.4 }}
            >
              $
            </span>
            <input
              type="number"
              value={contributeAmount}
              onChange={(e) => handleContributeAmountChange(e.target.value)}
              placeholder="0"
              className="w-[120px] border-none bg-transparent text-center font-clash text-[48px] font-bold text-white outline-none placeholder:text-white/15 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {contributeQuickAmounts.map((amount) => {
              const isActive =
                selectedContributeAmount === amount ||
                contributeAmount === String(amount);

              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickContribute(amount)}
                  className="cursor-pointer rounded-full border px-[18px] py-[7px] text-[12px] font-semibold transition-all duration-200"
                  style={{
                    background: isActive
                      ? 'rgba(143,168,188,0.22)'
                      : 'rgba(250,247,239,0.06)',
                    color: isActive ? '#FAF7EF' : '#FAF7EF',
                    borderColor: isActive
                      ? 'rgba(143,168,188,0.35)'
                      : 'rgba(250,247,239,0.12)',
                  }}
                >
                  ${amount}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-4 w-full cursor-pointer rounded-[14px] border py-[15px] text-[14px] font-bold text-[#FAF7EF]"
            style={{
              ...innerGlassStyle,
              background: 'rgba(143,168,188,0.28)',
              borderColor: 'rgba(143,168,188,0.4)',
            }}
          >
            Send Contribution
          </button>

          <p
            className="mt-3 text-center text-[10px] text-white"
            style={{ opacity: 0.3 }}
          >
            Your friend will be notified instantly
          </p>

          <button
            type="button"
            onClick={closeContributeSheet}
            className="mt-3 w-full cursor-pointer border-none bg-transparent text-center text-[11px] text-white"
            style={{ opacity: 0.3 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </AppPageLayout>
  );
}
