'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Check,
  LogOut,
  Music,
  Pencil,
  Settings,
} from 'lucide-react';
import AppPageLayout from '@/components/AppPageLayout';

const profileData = {
  name: 'Khushi Verma',
  handle: '@khushi',
  bio: 'saving for the things that matter ✦',
  following: 4,
  followers: 6,
  totalSaved: 2840,
  goalsCompleted: 1,
  instagram: 'khushi.jm',
  tiktok: '',
  snapchat: 'khushiverma',
};

const completedGoals = [
  {
    id: 1,
    name: 'Dyson Airwrap',
    category: 'Beauty',
    amountSaved: 500,
    completedDate: 'Jun 10, 2026',
    color: '#8FA8BC',
  },
];

const activeGoals = [
  {
    id: 1,
    name: 'Macbook Pro 14',
    category: 'Electronics',
    funded: 1374,
    goal: 2000,
    color: '#8FA8BC',
  },
  {
    id: 2,
    name: 'Air Forces 1 Blue',
    category: 'Fashion',
    funded: 102,
    goal: 250,
    color: '#A8B8C8',
  },
  {
    id: 3,
    name: 'Bottega Veneta Bag',
    category: 'Fashion',
    funded: 720,
    goal: 5900,
    color: '#7A94A8',
  },
];

const ACCENT_BLUE = '#8FA8BC';
const ACCENT_BLUE_LIGHT = '#A8B8C8';
const ACCENT_BLUE_MID = '#7A94A8';

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

const socialIconStyle: React.CSSProperties = {
  background: 'rgba(143,168,188,0.15)',
  border: '1px solid rgba(143,168,188,0.28)',
};

const formatMoney = (amount: number) =>
  `$${amount.toLocaleString('en-US')}`;

export default function ProfilePage() {
  const router = useRouter();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [bioText, setBioText] = useState(profileData.bio);
  const [handleText, setHandleText] = useState(profileData.handle);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const handleProfilePhotoClick = () => {
    setIsEditingProfile(true);
    /* profile picture upload coming soon */
  };

  return (
    <AppPageLayout>
      <div className="flex h-full flex-col gap-3 overflow-y-auto px-4 pt-[52px] pb-[90px] font-clash text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-normal text-[#FAF7EF]">Profile</h1>
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border p-2"
            style={innerGlassStyle}
            aria-label="Settings"
          >
            <Settings size={20} className="text-white" strokeWidth={2} />
          </button>
        </div>

        {/* SECTION 1 — PROFILE CARD */}
        <div style={cardStyle}>
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0">
              <div
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-[26px] font-normal text-white"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(143,168,188,0.35) 0%, rgba(143,168,188,0.12) 100%)',
                  border: '2px solid rgba(143,168,188,0.4)',
                }}
              >
                K
              </div>
              <button
                type="button"
                onClick={handleProfilePhotoClick}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border"
                style={{
                  ...innerGlassStyle,
                  background: 'rgba(250,247,239,0.14)',
                }}
                aria-label="Edit profile photo"
              >
                <Camera size={11} className="text-white" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[20px] font-normal text-[#FAF7EF]">
                {profileData.name}
              </p>

              {!isEditingHandle ? (
                <div className="flex items-center">
                  <span
                    className="text-[12px] text-white"
                    style={{ opacity: 0.45 }}
                  >
                    {handleText}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingHandle(true)}
                    className="ml-1.5 cursor-pointer border-none bg-transparent p-0"
                    aria-label="Edit handle"
                  >
                    <Pencil
                      size={12}
                      className="text-white"
                      style={{ opacity: 0.3 }}
                    />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={handleText}
                    onChange={(e) => setHandleText(e.target.value)}
                    className="w-full rounded-lg border px-2.5 py-1 font-clash text-[12px] text-white outline-none"
                    style={{
                      ...innerGlassStyle,
                      background: 'rgba(250,247,239,0.1)',
                      borderColor: 'rgba(143,168,188,0.35)',
                    }}
                  />
                  <div className="mt-1.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingHandle(false)}
                      className="cursor-pointer rounded-md border px-2.5 py-[3px] text-[10px] font-normal text-[#FAF7EF]"
                      style={{
                        background: 'rgba(143,168,188,0.22)',
                        borderColor: 'rgba(143,168,188,0.35)',
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHandleText(profileData.handle);
                        setIsEditingHandle(false);
                      }}
                      className="cursor-pointer border-none bg-transparent text-[10px] text-white"
                      style={{ opacity: 0.35 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-2 flex gap-3">
                <div className="text-center">
                  <p className="text-[12px] font-normal text-[#FAF7EF]" style={{ opacity: 0.85 }}>
                    {profileData.following}
                  </p>
                  <p
                    className="text-[9px] text-white"
                    style={{ opacity: 0.35 }}
                  >
                    Following
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-normal text-[#FAF7EF]" style={{ opacity: 0.85 }}>
                    {profileData.followers}
                  </p>
                  <p
                    className="text-[9px] text-white"
                    style={{ opacity: 0.35 }}
                  >
                    Followers
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-normal text-[#FAF7EF]" style={{ opacity: 0.85 }}>
                    {formatMoney(profileData.totalSaved)}
                  </p>
                  <p
                    className="text-[9px] text-white"
                    style={{ opacity: 0.35 }}
                  >
                    Saved
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-3 border-t pt-3"
            style={{ borderColor: 'rgba(250,247,239,0.06)' }}
          >
            {!isEditingBio ? (
              <>
                <p
                  className="text-[12px] italic leading-[1.5] text-white"
                  style={{ opacity: 0.55 }}
                >
                  {bioText}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingBio(true)}
                  className="mt-1.5 inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0"
                >
                  <Pencil
                    size={11}
                    className="text-white"
                    style={{ opacity: 0.3 }}
                  />
                  <span
                    className="text-[10px] text-white"
                    style={{ opacity: 0.3 }}
                  >
                    Edit bio
                  </span>
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  maxLength={80}
                  rows={3}
                  className="w-full resize-none rounded-[10px] border px-3 py-2.5 font-clash text-[12px] text-white outline-none"
                  style={{
                    ...innerGlassStyle,
                    background: 'rgba(250,247,239,0.1)',
                    borderColor: 'rgba(143,168,188,0.3)',
                  }}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className="text-[9px] text-white"
                    style={{ opacity: 0.25 }}
                  >
                    {bioText.length}/80
                  </span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setBioText(profileData.bio);
                        setIsEditingBio(false);
                      }}
                      className="mr-3 cursor-pointer border-none bg-transparent text-[10px] text-white"
                      style={{ opacity: 0.3 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBio(false)}
                      className="cursor-pointer rounded-lg border px-3.5 py-[5px] text-[10px] font-normal text-[#FAF7EF]"
                      style={{
                        background: 'rgba(143,168,188,0.22)',
                        borderColor: 'rgba(143,168,188,0.35)',
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* SECTION 2 — SOCIAL LINKS */}
        <div style={cardStyle}>
          <p className="mb-3 text-[13px] font-normal text-[#FAF7EF]">
            Social Links
          </p>

          <div
            className="flex items-center justify-between py-2.5"
            style={{ borderBottom: '1px solid rgba(250,247,239,0.06)' }}
          >
            <div className="flex items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={socialIconStyle}
              >
                <span className="text-[10px] font-normal text-white">IG</span>
              </div>
              <span className="ml-2.5 text-[12px] font-medium text-white">
                Instagram
              </span>
            </div>
            <div className="flex items-center">
              <span
                className="text-[11px] text-white"
                style={{ opacity: 0.4 }}
              >
                @{profileData.instagram}
              </span>
              <button
                type="button"
                className="ml-2 cursor-pointer border-none bg-transparent text-[9px] text-white"
                style={{ opacity: 0.25 }}
              >
                Edit
              </button>
            </div>
          </div>

          <div
            className="flex items-center justify-between py-2.5"
            style={{ borderBottom: '1px solid rgba(250,247,239,0.06)' }}
          >
            <div className="flex items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={socialIconStyle}
              >
                <Music size={14} className="text-white" strokeWidth={2} />
              </div>
              <span className="ml-2.5 text-[12px] font-medium text-white">
                TikTok
              </span>
            </div>
            <button
              type="button"
              className="cursor-pointer rounded-full border px-3.5 py-1 text-[10px] font-normal text-[#FAF7EF]"
              style={{
                ...innerGlassStyle,
                opacity: 0.7,
              }}
            >
              Connect
            </button>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={socialIconStyle}
              >
                <Camera size={14} className="text-white" strokeWidth={2} />
              </div>
              <span className="ml-2.5 text-[12px] font-medium text-white">
                Snapchat
              </span>
            </div>
            <div className="flex items-center">
              <span
                className="text-[11px] text-white"
                style={{ opacity: 0.4 }}
              >
                @{profileData.snapchat}
              </span>
              <button
                type="button"
                className="ml-2 cursor-pointer border-none bg-transparent text-[9px] text-white"
                style={{ opacity: 0.25 }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3 — MY GOALS */}
        <div style={cardStyle}>
          <p className="mb-3 text-[13px] font-normal text-[#FAF7EF]">My Goals</p>

          <div
            className="mb-3.5 flex gap-0 rounded-[10px] p-[3px]"
            style={{ background: 'rgba(250,247,239,0.06)' }}
          >
            {(['active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="flex-1 cursor-pointer rounded-lg border-none py-[7px] text-center text-[11px] font-normal capitalize transition-all duration-200"
                style={
                  activeTab === tab
                    ? {
                        background: 'rgba(143,168,188,0.18)',
                        color: '#FAF7EF',
                      }
                    : {
                        background: 'transparent',
                        color: 'rgba(250,247,239,0.4)',
                      }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'active' &&
            activeGoals.map((goal, index) => {
              const percent = Math.round((goal.funded / goal.goal) * 100);

              return (
                <div
                  key={goal.id}
                  className="flex items-center justify-between py-2.5"
                  style={{
                    borderBottom:
                      index === activeGoals.length - 1
                        ? 'none'
                        : '1px solid rgba(250,247,239,0.06)',
                  }}
                >
                  <div className="flex min-w-0 items-center">
                    <span
                      className="mr-2.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: goal.color }}
                    />
                    <div>
                      <p className="text-[12px] font-medium text-white">
                        {goal.name}
                      </p>
                      <p
                        className="text-[10px] text-white"
                        style={{ opacity: 0.35 }}
                      >
                        {goal.category}
                      </p>
                    </div>
                  </div>

                  <div className="mx-3 min-w-0 flex-1">
                    <div
                      className="h-[3px] overflow-hidden rounded-sm"
                      style={{ background: 'rgba(250,247,239,0.1)' }}
                    >
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${percent}%`,
                          background: goal.color,
                        }}
                      />
                    </div>
                    <p
                      className="mt-[3px] text-[9px] text-white"
                      style={{ opacity: 0.3 }}
                    >
                      {formatMoney(goal.funded)} of {formatMoney(goal.goal)}
                    </p>
                  </div>

                  <p
                    className="shrink-0 text-[11px] font-normal"
                    style={{ color: goal.color }}
                  >
                    {percent}%
                  </p>
                </div>
              );
            })}

          {activeTab === 'completed' &&
            (completedGoals.length > 0 ? (
              completedGoals.map((goal, index) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between py-2.5"
                  style={{
                    borderBottom:
                      index === completedGoals.length - 1
                        ? 'none'
                        : '1px solid rgba(250,247,239,0.06)',
                  }}
                >
                  <div className="flex min-w-0 items-center">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                      style={{
                        background: 'rgba(143,168,188,0.15)',
                        borderColor: 'rgba(143,168,188,0.3)',
                      }}
                    >
                      <Check size={14} className="text-white" strokeWidth={2} />
                    </div>
                    <div className="ml-2.5 min-w-0">
                      <p className="text-[12px] font-medium text-white">
                        {goal.name}
                      </p>
                      <p
                        className="text-[9px] text-white"
                        style={{ opacity: 0.3 }}
                      >
                        {goal.category} · {goal.completedDate}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className="text-[11px] font-normal"
                      style={{ color: ACCENT_BLUE_LIGHT }}
                    >
                      {formatMoney(goal.amountSaved)} saved
                    </p>
                    <p
                      className="text-[9px] text-white"
                      style={{ opacity: 0.3 }}
                    >
                      Completed
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p
                className="py-5 text-center text-[12px] text-white"
                style={{ opacity: 0.25 }}
              >
                No completed goals yet
              </p>
            ))}
        </div>

        {/* SECTION 4 — SAVINGS SUMMARY */}
        <div style={cardStyle}>
          <p className="mb-3 text-[13px] font-normal text-[#FAF7EF]">
            Savings Summary
          </p>
          <div className="flex gap-2">
            <div className="flex-1 rounded-xl text-center" style={{ ...innerGlassStyle, padding: '12px' }}>
              <p className="text-[20px] font-normal text-[#FAF7EF]">
                {formatMoney(profileData.totalSaved)}
              </p>
              <p
                className="text-[9px] text-white"
                style={{ opacity: 0.35 }}
              >
                Total saved
              </p>
            </div>
            <div className="flex-1 rounded-xl text-center" style={{ ...innerGlassStyle, padding: '12px' }}>
              <p className="text-[20px] font-normal text-[#FAF7EF]">
                {activeGoals.length}
              </p>
              <p
                className="text-[9px] text-white"
                style={{ opacity: 0.35 }}
              >
                Active goals
              </p>
            </div>
            <div className="flex-1 rounded-xl text-center" style={{ ...innerGlassStyle, padding: '12px' }}>
              <p className="text-[20px] font-normal text-[#FAF7EF]">
                {profileData.goalsCompleted}
              </p>
              <p
                className="text-[9px] text-white"
                style={{ opacity: 0.35 }}
              >
                Completed
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5 — LOG OUT */}
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border py-3.5 transition-colors hover:opacity-90"
          style={{
            background: 'rgba(53, 69, 82, 0.72)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(74, 95, 115, 0.45)',
          }}
        >
          <LogOut size={16} className="text-white" strokeWidth={2} />
          <span className="text-[13px] font-normal text-white" style={{ opacity: 0.85 }}>
            Log Out
          </span>
        </button>

        <p
          className="mt-2 text-center text-[10px] tracking-[2px] text-white"
          style={{ opacity: 0.15 }}
        >
          WNTED v1.0.0
        </p>
      </div>
    </AppPageLayout>
  );
}
