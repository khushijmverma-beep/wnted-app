'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Check,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Heart,
  Home as HomeIcon,
  Inbox,
  Lock,
  Menu,
  MessageCircle,
  MoreVertical,
  Plus,
  Pencil,
  Search,
  Share2,
  ShoppingBag,
  Trophy,
  User,
  Gift,
  Star,
  RotateCw,
  Image as ImageIcon,
  Link2,
  X,
} from 'lucide-react';
import WntedLogo from '@/components/WntedLogo';
import SearchScreen from '@/components/SearchScreen';
import AvatarCategoryPanel from '@/components/AvatarCategoryPanel';
import AvatarInventoryGrid from '@/components/AvatarInventoryGrid';
import AvatarShopGrid from '@/components/AvatarShopGrid';
import AvatarShopItemDetail from '@/components/AvatarShopItemDetail';
import DepositView from '@/components/DepositView';
import FlyReward from '@/components/FlyReward';
import LeaderboardView from '@/components/LeaderboardView';
import XPPill from '@/components/XPPill';
import ProfileMenuDrawer from '@/components/ProfileMenuDrawer';
import ProfileInboxDrawer from '@/components/ProfileInboxDrawer';
import ProfileInfoPostsTabBar, {
  type ProfileDetailTab,
} from '@/components/ProfileInfoPostsTabBar';
import UserPostsGrid from '@/components/UserPostsGrid';
import {
  AVATAR_EDIT_SUBCATEGORIES,
  AVATAR_EDIT_TABS,
  AVATAR_SHOP_ITEMS,
  CLOTHING_COLOR_PALETTE,
  HAIR_COLOR_PALETTE,
  AVATAR_COLOR_PALETTE,
  DEFAULT_AVATAR_ITEM_COLORS,
  DEFAULT_EQUIPPED_AVATAR_SLOTS,
  DEFAULT_OWNED_AVATAR_ITEM_IDS,
  getAvatarItemColor,
  getAvatarItemsForSubCategory,
  getAvatarShopItem,
  getEquippedClothingEntries,
  type AvatarClothingSlot,
  type AvatarEditCategory,
  type AvatarShopItem,
} from '@/lib/avatarItems';
import { runWhiteConfetti } from '@/lib/runWhiteConfetti';
import { getPostsByHandle } from '@/lib/userPosts';
import {
  getUserProfileByHandle,
  isCurrentUserHandle,
  type UserPublicProfile,
} from '@/lib/userProfiles';
import styles from '@/app/home/home.module.css';

const WelcomeScreen = dynamic(() => import('@/components/WelcomeScreen'), {
  ssr: false,
});

const AvatarViewer = dynamic(() => import('@/components/AvatarViewer'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-[12px]"
      style={{
        height: '100%',
        minHeight: 200,
        background: 'rgba(250,247,239,0.04)',
      }}
    />
  ),
});

const PROFILE_DATA = {
  name: 'Khushi Verma',
  username: 'khushi_vma',
  handle: '@khushi',
  bio: 'saving for the things that matter ✦',
  following: 4,
  followers: 6,
  totalSaved: 2840,
  streak: 7,
};

const phoneFrameStyle: React.CSSProperties = {
  width: '390px',
  height: '844px',
  borderRadius: '40px',
  border: '1px solid rgba(250,247,239,0.08)',
  background: '#000000',
};

const INK = '#000000';
const SLATE = '#8A97A8';

type RecommendedProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
};

const RECOMMENDED_PRODUCTS: RecommendedProduct[] = [
  {
    id: 5,
    name: 'iPad Pro',
    category: 'Electronics',
    price: 1099,
    image: '/IpadPro.png',
  },
  {
    id: 7,
    name: 'AirPods Max',
    category: 'Electronics',
    price: 549,
    image: '/AirpodMax.png',
  },
  {
    id: 6,
    name: 'Lulu Leggings',
    category: 'Fashion',
    price: 98,
    image: '/LuLuLeggings.png',
  },
  {
    id: 20,
    name: 'YSL Perfume',
    category: 'Beauty',
    price: 135,
    image: '/LoweaPerfume.png',
  },
  {
    id: 13,
    name: 'Sony Headphones',
    category: 'Electronics',
    price: 349,
    image: '/AirpodProMax.png',
  },
  {
    id: 8,
    name: 'Rare Beauty Set',
    category: 'Beauty',
    price: 65,
    image: '/CentellaSkinCare.png',
  },
];

const WNTS_CARD_STYLE: React.CSSProperties = {
  background: 'rgba(250,247,239,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
  borderRadius: '16px',
  padding: '14px',
};

type WishlistItem = {
  id: number;
  name: string;
  category: string;
  funded: number;
  goal: number;
  image: string;
  xpClaimed?: boolean;
};

const INITIAL_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 1,
    name: 'Macbook Pro 14',
    category: 'Electronics',
    funded: 1374,
    goal: 2000,
    image: '/macBook.png',
  },
  {
    id: 2,
    name: 'Air Forces 1 Blue',
    category: 'Fashion',
    funded: 102,
    goal: 250,
    image: '/GreenSambas.png',
  },
  {
    id: 3,
    name: 'Bottega Veneta Bag',
    category: 'Fashion',
    funded: 720,
    goal: 5900,
    image: '/BotegaBag.png',
  },
  {
    id: 4,
    name: 'Dyson Airwrap',
    category: 'Beauty',
    funded: 500,
    goal: 500,
    image: '/dyson.png',
    xpClaimed: false,
  },
  {
    id: 5,
    name: 'PlayStation 5',
    category: 'Electronics',
    funded: 350,
    goal: 500,
    image: '/Ps5.png',
  },
  {
    id: 6,
    name: 'Sony Headphones',
    category: 'Electronics',
    funded: 180,
    goal: 320,
    image: '/headphone.png',
  },
];

const formatWntsMoney = (amount: number) =>
  `$${amount.toLocaleString('en-US')}`;

const formatRecommendedPrice = (price: number) =>
  `$${price.toLocaleString('en-US')}`;

const canRemoveWishlistItem = (item: WishlistItem) =>
  item.funded === 0 || item.funded >= item.goal;

const PROFILE_AVATAR_HEIGHT = 320;
const PROFILE_AVATAR_EDIT_HEIGHT = 260;
const PROFILE_WISHLIST_WIDGET_BOTTOM_GAP = 28;

const FREE_SKIN_TONES = [
  { id: 'tone-1', color: '#F7E6D7' },
  { id: 'tone-2', color: '#F2DFCF' },
  { id: 'tone-3', color: '#EED6C2' },
  { id: 'tone-4', color: '#EACBB4' },
  { id: 'tone-5', color: '#E6C2A6' },
  { id: 'tone-6', color: '#E1B895' },
  { id: 'tone-7', color: '#DBAC88' },
  { id: 'tone-8', color: '#F1D2B6' },
  { id: 'tone-9', color: '#EBC6A6' },
  { id: 'tone-10', color: '#E6BB97' },
  { id: 'tone-11', color: '#E0B18A' },
  { id: 'tone-12', color: '#D9A67D' },
  { id: 'tone-13', color: '#D49B6F' },
  { id: 'tone-14', color: '#C89263' },
  { id: 'tone-15', color: '#D8A47A' },
  { id: 'tone-16', color: '#CC956E' },
  { id: 'tone-17', color: '#C48A63' },
  { id: 'tone-18', color: '#BC7F58' },
  { id: 'tone-19', color: '#B4754F' },
  { id: 'tone-20', color: '#A86B45' },
  { id: 'tone-21', color: '#9D613E' },
  { id: 'tone-22', color: '#A66A44' },
  { id: 'tone-23', color: '#9A5F3D' },
  { id: 'tone-24', color: '#8E5536' },
  { id: 'tone-25', color: '#804B2F' },
  { id: 'tone-26', color: '#744027' },
  { id: 'tone-27', color: '#64361F' },
  { id: 'tone-28', color: '#572E18' },
  { id: 'tone-29', color: '#4F2D1F' },
  { id: 'tone-30', color: '#452718' },
  { id: 'tone-31', color: '#3A2114' },
  { id: 'tone-32', color: '#301B11' },
  { id: 'tone-33', color: '#26150E' },
  { id: 'tone-34', color: '#1C0F0A' },
  { id: 'tone-35', color: '#120A07' },
] as const;

const getSkinToneColor = (toneId: string) =>
  FREE_SKIN_TONES.find((tone) => tone.id === toneId)?.color ?? FREE_SKIN_TONES[3].color;

const getWishlistFundingTotals = (items: WishlistItem[]) => {
  const totalFunded = items.reduce((sum, item) => sum + item.funded, 0);
  const totalGoal = items.reduce((sum, item) => sum + item.goal, 0);
  const progressPercent =
    totalGoal > 0 ? Math.round((totalFunded / totalGoal) * 100) : 0;

  return { totalFunded, totalGoal, progressPercent };
};

function ProfileFundingRing({
  progressPercent,
  totalFunded,
  totalGoal,
}: {
  progressPercent: number;
  totalFunded: number;
  totalGoal: number;
}) {
  const ringSize = 100;
  const ringRadius = 41;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const progressFilled =
    (Math.min(progressPercent, 100) / 100) * ringCircumference;
  const ringCenter = ringSize / 2;

  const fundingLabel = `${formatWntsMoney(totalFunded)} of ${formatWntsMoney(totalGoal)}`;

  return (
    <div className="group relative flex flex-col items-center">
      <div
        className="relative flex cursor-default items-center justify-center"
        style={{ width: ringSize, height: ringSize }}
        title={fundingLabel}
        aria-label={`${progressPercent}% funded, ${fundingLabel}`}
      >
        <div
          className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-[8px] px-2.5 py-1 text-[10px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={{
            background: 'rgba(250,247,239,0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(250,247,239,0.18)',
          }}
          role="tooltip"
        >
          {fundingLabel}
        </div>
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          aria-hidden="true"
          style={{
            filter:
              'drop-shadow(0 0 4px rgba(138, 151, 168, 0.45)) drop-shadow(0 0 10px rgba(138, 151, 168, 0.25))',
          }}
        >
          <circle
            cx={ringCenter}
            cy={ringCenter}
            r={ringRadius}
            stroke="rgba(250,247,239,0.14)"
            strokeWidth="4.5"
            fill="none"
          />
          <circle
            cx={ringCenter}
            cy={ringCenter}
            r={ringRadius}
            stroke={SLATE}
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${progressFilled} ${ringCircumference}`}
            transform={`rotate(-90 ${ringCenter} ${ringCenter})`}
            style={{
              filter:
                'drop-shadow(0 0 5px rgba(138, 151, 168, 0.75)) drop-shadow(0 0 12px rgba(138, 151, 168, 0.4))',
            }}
          />
        </svg>
        <div className="pointer-events-none absolute flex flex-col items-center">
          <span className="text-[17px] font-medium text-white">
            {progressPercent}%
          </span>
          <span className="text-[10px] text-white">funded</span>
        </div>
      </div>
    </div>
  );
}

function ProfileWishlistBreakdown({ items }: { items: WishlistItem[] }) {
  return (
    <div
      className={`h-full min-h-0 flex-1 overflow-y-auto ${styles.homeScroll}`}
      style={{
        ...WNTS_CARD_STYLE,
        borderRadius: '12px',
        padding: '10px',
      }}
    >
      <div className="flex flex-col gap-2.5">
        {items.map((item) => {
          const percent = Math.round((item.funded / item.goal) * 100);

          return (
            <div key={item.id} className="flex items-center gap-2">
              <div
                className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[8px]"
                style={{
                  background: 'rgba(250,247,239,0.08)',
                  border: '1px solid rgba(250,247,239,0.1)',
                }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-white">
                  {item.name}
                </p>
                <p className="text-[9px] text-white">
                  {formatWntsMoney(item.funded)} of {formatWntsMoney(item.goal)}
                </p>
              </div>
              <p className="shrink-0 text-[10px] font-medium text-white">
                {percent}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AvatarShopItemRow({
  item,
  isOwned,
  isEquipped,
  canAfford,
  isSignedIn,
  onRequireSignIn,
  onPurchase,
  onEquip,
}: {
  item: AvatarShopItem;
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
  isSignedIn: boolean;
  onRequireSignIn: () => void;
  onPurchase: () => void;
  onEquip: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 rounded-[8px] px-2.5 py-2"
      style={{
        background: 'rgba(250,247,239,0.05)',
        border: '1px solid rgba(250,247,239,0.08)',
      }}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-white">{item.name}</p>
        <p className="text-[9px] text-white" style={{ opacity: 0.45 }}>
          {item.price === 0 ? 'Free' : `${item.price.toLocaleString('en-US')} XP`}
        </p>
      </div>
      {isOwned ? (
        <button
          type="button"
          onClick={onEquip}
          className="shrink-0 cursor-pointer rounded-full border-none px-3 py-1.5 text-[10px] font-semibold text-[#FAF7EF]"
          style={{
            background: isEquipped
              ? 'rgba(138,151,168,0.28)'
              : 'rgba(250,247,239,0.14)',
            border: '1px solid rgba(250,247,239,0.18)',
          }}
        >
          {isEquipped ? 'Unequip' : 'Equip'}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (!isSignedIn) {
              onRequireSignIn();
              return;
            }
            onPurchase();
          }}
          disabled={!canAfford && isSignedIn}
          className="shrink-0 cursor-pointer rounded-full border-none px-3 py-1.5 text-[10px] font-semibold text-[#FAF7EF] disabled:cursor-default disabled:opacity-40"
          style={{
            background: 'rgba(250,247,239,0.14)',
            border: '1px solid rgba(250,247,239,0.18)',
          }}
        >
          Buy
        </button>
      )}
    </div>
  );
}

function ProfileAvatarEditorPanel({
  activeCategory,
  activeSubCategory,
  selectedSkinTone,
  ownedAvatarItemIds,
  equippedAvatarSlots,
  avatarItemColors,
  previewBackgroundImage,
  onCategoryChange,
  onSubCategoryChange,
  onSkinToneChange,
  onEquipAvatarItem,
  onAvatarItemColorChange,
}: {
  activeCategory: AvatarEditCategory;
  activeSubCategory: string;
  selectedSkinTone: string;
  ownedAvatarItemIds: string[];
  equippedAvatarSlots: Record<AvatarClothingSlot, string | null>;
  avatarItemColors: Record<string, string>;
  previewBackgroundImage?: string | null;
  onCategoryChange: (category: AvatarEditCategory) => void;
  onSubCategoryChange: (subCategoryId: string) => void;
  onSkinToneChange: (toneId: string) => void;
  onEquipAvatarItem: (item: AvatarShopItem) => void;
  onAvatarItemColorChange: (itemId: string, color: string) => void;
}) {
  const ownedClothingItems = getAvatarItemsForSubCategory(
    activeCategory,
    activeSubCategory
  ).filter((item) => ownedAvatarItemIds.includes(item.id));
  const customizableItem = ownedClothingItems.find((item) => item.customizableColor);
  const selectedClothingColor = customizableItem
    ? getAvatarItemColor(customizableItem.id, avatarItemColors)
    : null;
  const inventoryBreadcrumb = `${AVATAR_EDIT_TABS.find((tab) => tab.id === activeCategory)?.label ?? activeCategory} > ${
    AVATAR_EDIT_SUBCATEGORIES[activeCategory].find(
      (subcategory) => subcategory.id === activeSubCategory
    )?.label ?? activeSubCategory
  }`;
  const itemColorPalette =
    activeSubCategory === 'hair' ? HAIR_COLOR_PALETTE : CLOTHING_COLOR_PALETTE;

  return (
    <AvatarCategoryPanel
      activeCategory={activeCategory}
      activeSubCategory={activeSubCategory}
      onCategoryChange={onCategoryChange}
      onSubCategoryChange={onSubCategoryChange}
    >
      {activeSubCategory === 'skin' ? (
        <div>
          <p
            className="mb-2 text-[9px] font-medium uppercase tracking-[1.2px] text-white"
            style={{ opacity: 0.4 }}
          >
            Free
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {FREE_SKIN_TONES.map((tone) => {
              const isSelected = selectedSkinTone === tone.id;

              return (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => onSkinToneChange(tone.id)}
                  className="flex cursor-pointer flex-col items-center gap-1 border-none bg-transparent p-0"
                  aria-label={`Skin tone ${tone.id}`}
                >
                  <span
                    className="h-6 w-6 rounded-full transition-transform"
                    style={{
                      background: tone.color,
                      border: isSelected
                        ? '2px solid #FAF7EF'
                        : '2px solid rgba(250,247,239,0.15)',
                      boxShadow: isSelected
                        ? '0 0 0 2px rgba(138,151,168,0.45)'
                        : 'none',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : activeCategory === 'clothes' || activeSubCategory === 'hair' ? (
        <div className="flex flex-col gap-3">
          <AvatarInventoryGrid
            items={ownedClothingItems}
            equippedSlots={equippedAvatarSlots}
            itemColors={avatarItemColors}
            previewBackgroundImage={previewBackgroundImage}
            onEquip={onEquipAvatarItem}
            breadcrumb={inventoryBreadcrumb}
            columns={3}
          />
          {customizableItem && selectedClothingColor && (
            <div>
              <p
                className="mb-2 text-[9px] font-medium uppercase tracking-[1.2px] text-white"
                style={{ opacity: 0.4 }}
              >
                {customizableItem.name} Color
              </p>
              <div className="grid grid-cols-12 gap-1">
                {itemColorPalette.map((swatch) => {
                  const isSelected = selectedClothingColor === swatch.color;

                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() =>
                        onAvatarItemColorChange(customizableItem.id, swatch.color)
                      }
                      className="flex cursor-pointer flex-col items-center border-none bg-transparent p-0"
                      aria-label={`${customizableItem.name} color ${swatch.id}`}
                    >
                      <span
                        className="h-4 w-4 rounded-full transition-transform"
                        style={{
                          background: swatch.color,
                          border: isSelected
                            ? '2px solid #FAF7EF'
                            : '2px solid rgba(250,247,239,0.15)',
                          boxShadow: isSelected
                            ? '0 0 0 2px rgba(138,151,168,0.45)'
                            : 'none',
                          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p
          className="py-6 text-center text-[10px] text-white"
          style={{ opacity: 0.35 }}
        >
          Options coming soon
        </p>
      )}
    </AvatarCategoryPanel>
  );
}

function AvatarStorePanel({
  activeCategory,
  activeSubCategory,
  ownedAvatarItemIds,
  avatarItemColors,
  previewBackgroundImage,
  onCategoryChange,
  onSubCategoryChange,
  onSelectItem,
}: {
  activeCategory: AvatarEditCategory;
  activeSubCategory: string;
  ownedAvatarItemIds: string[];
  avatarItemColors: Record<string, string>;
  previewBackgroundImage?: string | null;
  onCategoryChange: (category: AvatarEditCategory) => void;
  onSubCategoryChange: (subCategoryId: string) => void;
  onSelectItem: (item: AvatarShopItem) => void;
}) {
  const shopItems = getAvatarItemsForSubCategory(
    activeCategory,
    activeSubCategory
  ).filter((item) => !item.isDefault);
  const inventoryBreadcrumb = `${AVATAR_EDIT_TABS.find((tab) => tab.id === activeCategory)?.label ?? activeCategory} > ${
    AVATAR_EDIT_SUBCATEGORIES[activeCategory].find(
      (subcategory) => subcategory.id === activeSubCategory
    )?.label ?? activeSubCategory
  }`;

  return (
    <AvatarCategoryPanel
      activeCategory={activeCategory}
      activeSubCategory={activeSubCategory}
      onCategoryChange={onCategoryChange}
      onSubCategoryChange={onSubCategoryChange}
      excludedSubCategoryIds={['skin']}
      className="min-h-[280px]"
    >
      {shopItems.length === 0 ? (
        <p
          className="py-6 text-center text-[10px] text-white"
          style={{ opacity: 0.35 }}
        >
          {activeCategory === 'face'
            ? 'Face items coming soon'
            : 'Nothing for sale here yet'}
        </p>
      ) : (
        <AvatarShopGrid
          items={shopItems}
          ownedAvatarItemIds={ownedAvatarItemIds}
          itemColors={avatarItemColors}
          previewBackgroundImage={previewBackgroundImage}
          onSelectItem={onSelectItem}
          breadcrumb={inventoryBreadcrumb}
        />
      )}
    </AvatarCategoryPanel>
  );
}

function ProfileView({
  variant = 'self',
  otherProfile = null,
  xp,
  totalSaved,
  wishlistItems,
  ownedAvatarItemIds,
  equippedAvatarSlots,
  avatarItemColors,
  previewBackgroundImage,
  onOpenStore,
  onEquipAvatarItem,
  onAvatarItemColorChange,
  onOpenProfileMenu,
  onOpenInbox,
  inboxUnreadCount,
  onBack,
}: {
  variant?: 'self' | 'other';
  otherProfile?: UserPublicProfile | null;
  xp: number;
  totalSaved: number;
  wishlistItems: WishlistItem[];
  ownedAvatarItemIds: string[];
  equippedAvatarSlots: Record<AvatarClothingSlot, string | null>;
  avatarItemColors: Record<string, string>;
  previewBackgroundImage?: string | null;
  onOpenStore: () => void;
  onEquipAvatarItem: (item: AvatarShopItem) => void;
  onAvatarItemColorChange: (itemId: string, color: string) => void;
  onOpenProfileMenu: () => void;
  onOpenInbox: () => void;
  inboxUnreadCount: number;
  onBack?: () => void;
}) {
  const isOwnProfile = variant !== 'other';
  const displayProfile = isOwnProfile
    ? {
        name: PROFILE_DATA.name,
        username: PROFILE_DATA.username,
        handle: PROFILE_DATA.handle,
        bio: PROFILE_DATA.bio,
        following: PROFILE_DATA.following,
        followers: PROFILE_DATA.followers,
        totalSaved,
        streak: PROFILE_DATA.streak,
        xp,
        skinColor: getSkinToneColor(FREE_SKIN_TONES[3].id),
        wishlistItems,
        ownedAvatarItemIds,
        equippedAvatarSlots,
        avatarItemColors,
      }
    : {
        name: otherProfile!.name,
        username: otherProfile!.username,
        handle: otherProfile!.handle,
        bio: otherProfile!.bio,
        following: otherProfile!.following,
        followers: otherProfile!.followers,
        totalSaved: otherProfile!.totalSaved,
        streak: otherProfile!.streak,
        xp: otherProfile!.xp,
        skinColor: otherProfile!.skinColor,
        wishlistItems: otherProfile!.wishlistItems,
        ownedAvatarItemIds: otherProfile!.ownedAvatarItemIds,
        equippedAvatarSlots: otherProfile!.equippedAvatarSlots,
        avatarItemColors: otherProfile!.avatarItemColors,
      };
  const [avatarEditOpen, setAvatarEditOpen] = useState(false);
  const [avatarViewMode, setAvatarViewMode] = useState<'3d' | '2d'>('3d');
  const [isFollowing, setIsFollowing] = useState(false);
  const [detailTab, setDetailTab] = useState<ProfileDetailTab>(
    variant === 'other' ? 'posts' : 'info'
  );
  const userPosts = useMemo(
    () => getPostsByHandle(displayProfile.handle),
    [displayProfile.handle]
  );
  const [avatarEditCategory, setAvatarEditCategory] =
    useState<AvatarEditCategory>('face');
  const [avatarEditSubCategory, setAvatarEditSubCategory] = useState('skin');
  const [selectedSkinTone, setSelectedSkinTone] = useState(FREE_SKIN_TONES[3].id);
  const selectedSkinColor = isOwnProfile
    ? getSkinToneColor(selectedSkinTone)
    : displayProfile.skinColor;
  const profileWishlistItems = displayProfile.wishlistItems;
  const profileOwnedAvatarItemIds = displayProfile.ownedAvatarItemIds;
  const profileEquippedAvatarSlots = displayProfile.equippedAvatarSlots;
  const profileAvatarItemColors = displayProfile.avatarItemColors;
  const clothingItems = useMemo(
    () =>
      getEquippedClothingEntries(
        profileEquippedAvatarSlots,
        profileOwnedAvatarItemIds,
        profileAvatarItemColors
      ),
    [profileEquippedAvatarSlots, profileOwnedAvatarItemIds, profileAvatarItemColors]
  );
  const fundingTotals = useMemo(
    () => getWishlistFundingTotals(profileWishlistItems),
    [profileWishlistItems]
  );

  useEffect(() => {
    setDetailTab(isOwnProfile ? 'info' : 'posts');
    if (!isOwnProfile) {
      setIsFollowing(false);
    }
  }, [isOwnProfile, displayProfile.handle]);

  const handleToggleAvatarViewMode = () => {
    setAvatarViewMode((mode) => (mode === '3d' ? '2d' : '3d'));
  };

  const handleAvatarEditCategoryChange = (category: AvatarEditCategory) => {
    setAvatarEditCategory(category);
    setAvatarEditSubCategory(AVATAR_EDIT_SUBCATEGORIES[category][0].id);
  };

  const handleToggleAvatarEdit = () => {
    if (!isOwnProfile) return;
    setAvatarEditOpen((open) => {
      if (open) return false;
      setAvatarEditCategory('face');
      setAvatarEditSubCategory('skin');
      return true;
    });
  };

  const editProfileButtonStyle: React.CSSProperties = {
    background: 'rgba(250,247,239,0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(250,247,239,0.12)',
    borderRadius: '8px',
  };

  return (
    <div
      className={`relative flex min-h-0 flex-1 flex-col overflow-y-auto pb-[88px] pt-[72px] font-clash text-white ${styles.homeScroll}`}
    >
      {isOwnProfile && avatarEditOpen && (
        <div className="absolute inset-x-4 top-10 z-10 flex items-center justify-between">
          <p className="text-[11px] text-white" style={{ opacity: 0.4 }}>
            ✦ {xp.toLocaleString('en-US')} XP
          </p>
          <button
            type="button"
            onClick={onOpenStore}
            aria-label="Shop"
            className="shrink-0 cursor-pointer border-none bg-transparent p-1"
          >
            <ShoppingBag size={22} className="text-white" strokeWidth={2} />
          </button>
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col px-4">
        <div className="shrink-0">
          {!avatarEditOpen && (
            <>
          {isOwnProfile ? (
          <div className="relative mb-4 flex items-center justify-center">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0"
              aria-label="Account switcher"
            >
              <Lock size={13} className="text-white" strokeWidth={2.25} />
              <span className="text-[15px] font-semibold text-[#FAF7EF]">
                {displayProfile.username}
              </span>
              <ChevronDown size={16} className="text-white" strokeWidth={2.25} />
              <span
                className="ml-0.5 h-[6px] w-[6px] shrink-0 rounded-full"
                style={{ background: '#FF3B30' }}
                aria-hidden="true"
              />
            </button>

            <div className="absolute right-0 flex items-center gap-1">
              <button
                type="button"
                aria-label={
                  inboxUnreadCount > 0
                    ? `Inbox, ${inboxUnreadCount} notifications`
                    : 'Inbox'
                }
                onClick={onOpenInbox}
                className="relative shrink-0 cursor-pointer border-none bg-transparent p-1"
              >
                <Inbox size={22} className="text-white" strokeWidth={2} />
                {inboxUnreadCount > 0 && (
                  <span
                    className="absolute -right-0.5 top-0 flex h-[15px] min-w-[15px] items-center justify-center rounded-full px-[4px] text-[9px] font-semibold leading-none text-white"
                    style={{ background: '#FF3B30' }}
                    aria-hidden="true"
                  >
                    {inboxUnreadCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                aria-label="Menu"
                onClick={onOpenProfileMenu}
                className="shrink-0 cursor-pointer border-none bg-transparent p-1"
              >
                <Menu size={22} className="text-white" strokeWidth={2} />
              </button>
            </div>
          </div>
          ) : (
          <div className="relative mb-4 flex items-center justify-center">
            <button
              type="button"
              onClick={onBack}
              className="absolute left-0 cursor-pointer border-none bg-transparent p-1"
              aria-label="Back"
            >
              <ChevronLeft size={24} className="text-white" strokeWidth={2} />
            </button>
            <span className="text-[15px] font-semibold text-[#FAF7EF]">
              {displayProfile.username}
            </span>
          </div>
          )}

          <div className="-mt-[6px] flex items-center gap-5">
            <div
              className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full"
              style={{
                background: 'rgba(250,247,239,0.08)',
                border: '1px solid rgba(250,247,239,0.14)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              aria-hidden="true"
            >
              <User size={32} className="text-white" style={{ opacity: 0.65 }} strokeWidth={1.75} />
            </div>

            <div className="flex min-w-0 flex-1 justify-around gap-2">
              <div className="text-center">
                <p className="text-[14px] font-normal leading-none text-[#FAF7EF]">
                  {displayProfile.followers}
                </p>
                <p className="mt-1 text-[11px] text-white" style={{ opacity: 0.45 }}>
                  followers
                </p>
              </div>
              <div className="text-center">
                <p className="text-[14px] font-normal leading-none text-[#FAF7EF]">
                  {displayProfile.following}
                </p>
                <p className="mt-1 text-[11px] text-white" style={{ opacity: 0.45 }}>
                  following
                </p>
              </div>
              <div className="text-center">
                <p className="text-[14px] font-normal leading-none text-[#FAF7EF]">
                  ${displayProfile.totalSaved.toLocaleString('en-US')}
                </p>
                <p className="mt-1 text-[11px] text-white" style={{ opacity: 0.45 }}>
                  saved
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#FAF7EF]">{displayProfile.name}</p>
              <p className="mt-0.5 text-[12px] text-white" style={{ opacity: 0.45 }}>
                {displayProfile.handle}
              </p>
              <p
                className="mt-1.5 text-[12px] leading-relaxed text-white"
                style={{ opacity: 0.55 }}
              >
                {displayProfile.bio}
              </p>
              <p className="mt-1 text-[11px] text-white" style={{ opacity: 0.4 }}>
                ✦ {displayProfile.xp.toLocaleString('en-US')} XP
              </p>
              {isOwnProfile ? (
              <button
                type="button"
                className="mt-3 cursor-pointer border-none py-2 text-[12px] font-semibold text-[#FAF7EF]"
                style={{ ...editProfileButtonStyle, width: 'calc(100% - 30px)' }}
              >
                Edit profile
              </button>
              ) : (
              <>
              <button
                type="button"
                onClick={() => setIsFollowing((following) => !following)}
                className="mt-3 cursor-pointer border-none py-2 text-[12px] font-semibold text-[#FAF7EF]"
                style={{
                  ...editProfileButtonStyle,
                  width: 'calc(100% - 30px)',
                  background: isFollowing
                    ? 'rgba(143,168,188,0.22)'
                    : editProfileButtonStyle.background,
                  border: isFollowing
                    ? '1px solid rgba(143,168,188,0.35)'
                    : editProfileButtonStyle.border,
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              </>
              )}
            </div>
            <div className="-ml-[140px] -mt-4 shrink-0">
              <ProfileFundingRing
                progressPercent={fundingTotals.progressPercent}
                totalFunded={fundingTotals.totalFunded}
                totalGoal={fundingTotals.totalGoal}
              />
            </div>
          </div>

          <ProfileInfoPostsTabBar
            active={detailTab}
            onChange={setDetailTab}
            className="mt-3"
            infoFirst={isOwnProfile}
          />
            </>
          )}
        </div>

        {isOwnProfile && avatarEditOpen ? (
          <div className="mt-8 flex flex-col">
            <h1 className="mb-4 text-center text-[18px] font-normal tracking-[0.5px] text-[#FAF7EF]">
              Customize Your Wntie!
            </h1>
            <div className="flex justify-center">
              <div
                className="relative w-[46%] shrink-0"
                style={{ height: PROFILE_AVATAR_EDIT_HEIGHT }}
              >
                <AvatarViewer
                  height={PROFILE_AVATAR_EDIT_HEIGHT}
                  scale={0.7}
                  cameraZ={6.2}
                  skinColor={selectedSkinColor}
                  clothingItems={clothingItems}
                  focusRegion={avatarEditCategory}
                />
              </div>
            </div>

            <div className="mt-3 h-[280px]">
              <ProfileAvatarEditorPanel
                activeCategory={avatarEditCategory}
                activeSubCategory={avatarEditSubCategory}
                selectedSkinTone={selectedSkinTone}
                ownedAvatarItemIds={ownedAvatarItemIds}
                equippedAvatarSlots={equippedAvatarSlots}
                avatarItemColors={avatarItemColors}
                previewBackgroundImage={previewBackgroundImage}
                onCategoryChange={handleAvatarEditCategoryChange}
                onSubCategoryChange={setAvatarEditSubCategory}
                onSkinToneChange={setSelectedSkinTone}
                onEquipAvatarItem={onEquipAvatarItem}
                onAvatarItemColorChange={onAvatarItemColorChange}
              />
            </div>

            <button
              type="button"
              onClick={handleToggleAvatarEdit}
              className="mt-3 w-full cursor-pointer rounded-xl border-none py-3.5 text-[14px] font-semibold text-[#FAF7EF]"
              style={{ background: 'rgba(250,247,239,0.14)' }}
            >
              Done
            </button>
          </div>
        ) : detailTab === 'posts' ? (
          <UserPostsGrid posts={userPosts} className="mt-4" />
        ) : (
          <>
            <div
              className="mt-4 flex shrink-0 items-stretch gap-3"
              style={{ height: PROFILE_AVATAR_HEIGHT }}
            >
              <div className="relative w-[46%] shrink-0" style={{ height: PROFILE_AVATAR_HEIGHT }}>
                <AvatarViewer
                  height={PROFILE_AVATAR_HEIGHT}
                  scale={0.7}
                  cameraZ={6.2}
                  skinColor={selectedSkinColor}
                  clothingItems={clothingItems}
                  autoRotate={avatarViewMode === '3d'}
                />

                <button
                  type="button"
                  onClick={handleToggleAvatarViewMode}
                  className="absolute bottom-5 left-2 flex h-7 min-w-[34px] cursor-pointer items-center justify-center rounded-full border-none px-2 text-[10px] font-semibold tracking-[0.5px] text-white"
                  style={{
                    ...WNTS_CARD_STYLE,
                    borderRadius: '999px',
                    padding: '0 8px',
                  }}
                  aria-label={
                    avatarViewMode === '3d'
                      ? 'Stop auto-rotate'
                      : 'Resume auto-rotate'
                  }
                >
                  {avatarViewMode === '3d' ? '3D' : '2D'}
                </button>

                {isOwnProfile && (
                <div className="absolute bottom-5 right-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleToggleAvatarEdit}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-none"
                    style={{
                      ...WNTS_CARD_STYLE,
                      borderRadius: '999px',
                      padding: 0,
                    }}
                    aria-label="Edit character"
                  >
                    <Pencil size={12} className="text-white" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={onOpenStore}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-none"
                    style={{
                      ...WNTS_CARD_STYLE,
                      borderRadius: '999px',
                      padding: 0,
                    }}
                    aria-label="Shop"
                  >
                    <ShoppingBag size={12} className="text-white" strokeWidth={1.75} />
                  </button>
                </div>
                )}
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <div
                  className="flex min-h-0 flex-1 flex-col"
                  style={{ paddingBottom: PROFILE_WISHLIST_WIDGET_BOTTOM_GAP }}
                >
                  <ProfileWishlistBreakdown items={profileWishlistItems} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WntsWishlistView({
  items,
  onClaimXp,
  onRemoveFromWishlist,
  wishlistProductIds,
  onToggleWishlist,
}: {
  items: WishlistItem[];
  onClaimXp: (itemId: number, event: React.MouseEvent<HTMLButtonElement>) => void;
  onRemoveFromWishlist: (itemId: number) => void;
  wishlistProductIds: number[];
  onToggleWishlist: (product: RecommendedProduct) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-y-auto px-4 pb-[88px] pt-[100px] font-clash text-white ${styles.homeScroll}`}
    >
      <div
        style={{ ...WNTS_CARD_STYLE, borderRadius: '12px', overflow: 'visible' }}
        className={`relative ${openMenuId !== null ? 'z-30' : 'z-10'} ${styles.wishlistGlow}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-white">My Wishlist</p>
          <button
            type="button"
            className="cursor-pointer rounded-full border px-[14px] py-1 text-[10px] text-[#FAF7EF]"
            style={{
              background: 'rgba(250,247,239,0.05)',
              borderColor: 'rgba(250,247,239,0.18)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            + Add Item
          </button>
        </div>
        {items.map((item, index) => {
          const percent = Math.round((item.funded / item.goal) * 100);
          const isFullyFunded = item.funded >= item.goal;
          const canRemove = canRemoveWishlistItem(item);
          const isMenuOpen = openMenuId === item.id;

          return (
            <div
              key={item.id}
              className={`relative flex items-center justify-between gap-2 py-2.5 ${
                isMenuOpen ? 'z-40' : ''
              }`}
              style={{
                borderBottom: '1px solid rgba(250,247,239,0.06)',
              }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div
                  className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[8px]"
                  style={{
                    background: 'rgba(250,247,239,0.08)',
                    border: '1px solid rgba(250,247,239,0.1)',
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-white">
                    {item.name}
                  </p>
                  <p
                    className="text-[10px] text-white"
                    style={{ opacity: 0.4 }}
                  >
                    {item.category}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <p className="text-[11px] font-medium" style={{ color: SLATE }}>
                  ({percent}%)
                </p>
                {isFullyFunded ? (
                  <div className="flex items-center gap-2">
                    {item.xpClaimed ? (
                      <span
                        className="inline-block rounded-full px-2.5 py-[3px] text-[9px] font-medium"
                        style={{
                          background: 'rgba(138,151,168,0.2)',
                          color: SLATE,
                        }}
                      >
                        ✓ Fully Funded
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(event) => onClaimXp(item.id, event)}
                        className="cursor-pointer whitespace-nowrap rounded-full border-none px-2.5 py-1 text-[9px] font-semibold text-[#FAF7EF] transition-opacity hover:opacity-90"
                        style={{
                          background: 'rgba(250,247,239,0.14)',
                          border: '1px solid rgba(250,247,239,0.22)',
                        }}
                      >
                        Claim 300 XP
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className="my-1 h-[3px] w-20 overflow-hidden rounded-sm"
                      style={{ background: 'rgba(250,247,239,0.1)' }}
                    >
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${percent}%`,
                          background: SLATE,
                        }}
                      />
                    </div>
                    <p
                      className="text-[9px] text-white"
                      style={{ opacity: 0.3 }}
                    >
                      {formatWntsMoney(item.funded)} of{' '}
                      {formatWntsMoney(item.goal)}
                    </p>
                  </>
                )}
              </div>

              <div
                className="relative shrink-0"
                ref={isMenuOpen ? menuRef : undefined}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuId(isMenuOpen ? null : item.id)
                  }
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 transition-opacity hover:opacity-80"
                  aria-label={`Options for ${item.name}`}
                  aria-expanded={isMenuOpen}
                >
                  <MoreVertical
                    size={16}
                    className="text-white"
                    style={{ opacity: 0.55 }}
                    strokeWidth={2}
                  />
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-1 min-w-[168px] overflow-hidden rounded-xl py-1"
                    style={{
                      background: '#1C1C1E',
                      border: '1px solid rgba(250,247,239,0.12)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    }}
                  >
                    {canRemove ? (
                      <button
                        type="button"
                        onClick={() => {
                          onRemoveFromWishlist(item.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full cursor-pointer border-none bg-transparent px-3 py-2.5 text-left text-[12px] font-medium text-[#FAF7EF] transition-colors hover:bg-[rgba(250,247,239,0.08)]"
                      >
                        Remove from wishlist
                      </button>
                    ) : (
                      <p
                        className="px-3 py-2.5 text-[11px] leading-snug text-white"
                        style={{ opacity: 0.4 }}
                      >
                        Can&apos;t remove items you&apos;ve started saving for
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div
          className="my-4"
          style={{ borderTop: '1px solid rgba(250,247,239,0.08)' }}
        />

        <p className="mb-3 text-[13px] font-semibold text-white">Recommended</p>
        <div className="grid grid-cols-2 gap-2.5">
          {RECOMMENDED_PRODUCTS.map((product) => {
            const isWishlisted = wishlistProductIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="relative overflow-hidden rounded-xl"
                style={{
                  background: 'rgba(250,247,239,0.04)',
                  border: '1px solid rgba(250,247,239,0.1)',
                }}
              >
                <div className="relative mx-2 mt-2 h-[88px] overflow-hidden rounded-[8px]">
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    aria-label={
                      isWishlisted
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                    className="absolute right-1 top-1 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-none"
                    style={{
                      background: isWishlisted
                        ? 'rgba(138,151,168,0.35)'
                        : 'rgba(0,0,0,0.45)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(250,247,239,0.18)',
                    }}
                  >
                    {isWishlisted ? (
                      <Check size={14} className="text-white" strokeWidth={2.5} />
                    ) : (
                      <Plus size={14} className="text-white" strokeWidth={2.5} />
                    )}
                  </button>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] font-medium leading-tight text-white">
                    {product.name}
                  </p>
                  <p
                    className="text-[9px] uppercase text-white"
                    style={{ opacity: 0.4, letterSpacing: '0.5px' }}
                  >
                    {product.category}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white">
                    {formatRecommendedPrice(product.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type MainTab = 'home' | 'store' | 'deposit' | 'leaderboard' | 'profile';
type HomeTab = 'wnts' | 'forYou';
type HomeOverlay = 'add' | 'search';
type RankTab = 'mostXP' | 'mostSaved';

type StoreBackground = {
  id: string;
  collectionId: string;
  name: string;
  image: string;
  price: number;
  colorHex?: string;
};

type StoreCollection = {
  id: string;
  name: string;
  coverImage: string;
  itemCountLabel: string;
  packLabel: string | null;
  cardHeroColor?: string;
  backgrounds: StoreBackground[];
};

const FREE_COLLECTION: StoreCollection = {
  id: 'white',
  name: 'White',
  coverImage: '/backgrounds/white/pure-white.png',
  itemCountLabel: '1 background',
  packLabel: 'Free',
  backgrounds: [
    {
      id: 'white-pure',
      collectionId: 'white',
      name: 'Pure White',
      image: '/backgrounds/white/pure-white.png',
      price: 0,
    },
  ],
};

const STORE_COLLECTIONS: StoreCollection[] = [
  {
    id: 'japanese',
    name: 'Japanese Collection',
    coverImage: '/backgrounds/japan1.png',
    itemCountLabel: '4 backgrounds',
    packLabel: 'Whole pack · 4,800 XP',
    backgrounds: [
      {
        id: 'japan1',
        collectionId: 'japanese',
        name: 'Japanese Garden',
        image: '/backgrounds/japan1.png',
        price: 1200,
      },
      {
        id: 'japan2',
        collectionId: 'japanese',
        name: 'Kyoto Street',
        image: '/backgrounds/japan2.png',
        price: 1200,
      },
      {
        id: 'japan3',
        collectionId: 'japanese',
        name: 'Sakura View',
        image: '/backgrounds/japan3.png',
        price: 1200,
      },
      {
        id: 'japan4',
        collectionId: 'japanese',
        name: 'Torii Path',
        image: '/backgrounds/japan4.png',
        price: 1200,
      },
    ],
  },
  {
    id: 'floraison',
    name: 'Floraison',
    coverImage: '/backgrounds/floraison2.png',
    itemCountLabel: '3 backgrounds',
    packLabel: 'Whole pack · 3,600 XP',
    backgrounds: [
      {
        id: 'floraison-gold-iris',
        collectionId: 'floraison',
        name: 'Gold Iris',
        image: '/backgrounds/floraison1.png',
        price: 1200,
      },
      {
        id: 'floraison-midnight-bloom',
        collectionId: 'floraison',
        name: 'Midnight Bloom',
        image: '/backgrounds/floraison2.png',
        price: 1200,
      },
      {
        id: 'floraison-ornate-garden',
        collectionId: 'floraison',
        name: 'Ornate Garden',
        image: '/backgrounds/floraison3.png',
        price: 1200,
      },
    ],
  },
  {
    id: 'dusk-at-sea',
    name: 'Dusk at Sea',
    coverImage: '/backgrounds/dusk-cover.png',
    itemCountLabel: '5 colors',
    packLabel: '300 XP each',
    backgrounds: [
      {
        id: 'dusk-chinese-black',
        collectionId: 'dusk-at-sea',
        name: 'Chinese Black',
        image: '/backgrounds/dusk/chinese-black.png',
        price: 300,
        colorHex: '#0C1519',
      },
      {
        id: 'dusk-dark-jungle-green',
        collectionId: 'dusk-at-sea',
        name: 'Dark Jungle Green',
        image: '/backgrounds/dusk/dark-jungle-green.png',
        price: 300,
      },
      {
        id: 'dusk-jet',
        collectionId: 'dusk-at-sea',
        name: 'Jet',
        image: '/backgrounds/dusk/jet.png',
        price: 300,
      },
      {
        id: 'dusk-coffee',
        collectionId: 'dusk-at-sea',
        name: 'Coffee',
        image: '/backgrounds/dusk/coffee.png',
        price: 300,
      },
      {
        id: 'dusk-antique-brass',
        collectionId: 'dusk-at-sea',
        name: 'Antique Brass',
        image: '/backgrounds/dusk/antique-brass.png',
        price: 300,
      },
    ],
  },
  {
    id: 'silver-mist',
    name: 'Silver Mist',
    coverImage: '/backgrounds/silver-mist-cover.png',
    itemCountLabel: '5 colors',
    packLabel: '300 XP each',
    backgrounds: [
      {
        id: 'silver-granite-gray',
        collectionId: 'silver-mist',
        name: 'Granite Gray',
        image: '/backgrounds/silver-mist/granite-gray.png',
        price: 300,
        colorHex: '#666B64',
      },
      {
        id: 'silver-jet-stream',
        collectionId: 'silver-mist',
        name: 'Jet Stream',
        image: '/backgrounds/silver-mist/jet-stream.png',
        price: 300,
      },
      {
        id: 'silver-light-slate-gray',
        collectionId: 'silver-mist',
        name: 'Light Slate Gray',
        image: '/backgrounds/silver-mist/light-slate-gray.png',
        price: 300,
      },
      {
        id: 'silver-smoke-granite',
        collectionId: 'silver-mist',
        name: 'Smoke Granite',
        image: '/backgrounds/silver-mist/smoke-granite.png',
        price: 300,
      },
      {
        id: 'silver-dark-jungle-green',
        collectionId: 'silver-mist',
        name: 'Dark Jungle Green',
        image: '/backgrounds/silver-mist/dark-jungle-green.png',
        price: 300,
      },
    ],
  },
  {
    id: 'moss-dew',
    name: 'Moss&Dew',
    coverImage: '/backgrounds/moss-dew-cover.png',
    itemCountLabel: '5 colors',
    packLabel: '300 XP each',
    backgrounds: [
      {
        id: 'moss-dark-jungle-green',
        collectionId: 'moss-dew',
        name: 'Dark Jungle Green',
        image: '/backgrounds/moss-dew/dark-jungle-green.png',
        price: 300,
        colorHex: '#1E2B22',
      },
      {
        id: 'moss-dolphin-gray',
        collectionId: 'moss-dew',
        name: 'Dolphin Gray',
        image: '/backgrounds/moss-dew/dolphin-gray.png',
        price: 300,
      },
      {
        id: 'moss-quick-silver',
        collectionId: 'moss-dew',
        name: 'Quick Silver',
        image: '/backgrounds/moss-dew/quick-silver.png',
        price: 300,
      },
      {
        id: 'moss-ash-gray',
        collectionId: 'moss-dew',
        name: 'Ash Gray',
        image: '/backgrounds/moss-dew/ash-gray.png',
        price: 300,
      },
      {
        id: 'moss-manatee',
        collectionId: 'moss-dew',
        name: 'Manatee',
        image: '/backgrounds/moss-dew/manatee.png',
        price: 300,
      },
    ],
  },
  {
    id: 'crimson-heart',
    name: 'Crimson Heart',
    coverImage: '/backgrounds/crimson-heart-cover.png',
    itemCountLabel: '5 colors',
    packLabel: '800 XP each',
    cardHeroColor: '#391214',
    backgrounds: [
      {
        id: 'crimson-soft-dove',
        collectionId: 'crimson-heart',
        name: 'Soft Dove',
        image: '/backgrounds/crimson-heart/soft-dove.png',
        price: 800,
        colorHex: '#C0BAB3',
      },
      {
        id: 'crimson-spiced-hot-chocolate',
        collectionId: 'crimson-heart',
        name: 'Spiced Hot Chocolate',
        image: '/backgrounds/crimson-heart/spiced-hot-chocolate.png',
        price: 800,
      },
      {
        id: 'crimson-moon-rock',
        collectionId: 'crimson-heart',
        name: 'Moon Rock',
        image: '/backgrounds/crimson-heart/moon-rock.png',
        price: 800,
      },
      {
        id: 'crimson-dark-sienna',
        collectionId: 'crimson-heart',
        name: 'Dark Sienna',
        image: '/backgrounds/crimson-heart/dark-sienna.png',
        price: 800,
      },
      {
        id: 'crimson-black-raspberry',
        collectionId: 'crimson-heart',
        name: 'Black Raspberry',
        image: '/backgrounds/crimson-heart/black-raspberry.png',
        price: 800,
      },
    ],
  },
  {
    id: 'frozen-threshold',
    name: 'Frozen Threshold',
    coverImage: '/backgrounds/frozen-threshold-cover.png',
    itemCountLabel: '4 colors',
    packLabel: '200 XP each',
    backgrounds: [
      {
        id: 'frozen-blue-bark',
        collectionId: 'frozen-threshold',
        name: 'Blue Bark',
        image: '/backgrounds/frozen-threshold/blue-bark.png',
        price: 200,
        colorHex: '#19262C',
      },
      {
        id: 'frozen-winter-balsam',
        collectionId: 'frozen-threshold',
        name: 'Winter Balsam',
        image: '/backgrounds/frozen-threshold/winter-balsam.png',
        price: 200,
      },
      {
        id: 'frozen-stormcloud',
        collectionId: 'frozen-threshold',
        name: 'Stormcloud',
        image: '/backgrounds/frozen-threshold/stormcloud.png',
        price: 200,
      },
      {
        id: 'frozen-dawnstone',
        collectionId: 'frozen-threshold',
        name: 'Dawnstone',
        image: '/backgrounds/frozen-threshold/dawnstone.png',
        price: 200,
      },
    ],
  },
  {
    id: 'linen-olive',
    name: 'Linen & Olive',
    coverImage: '/backgrounds/linen-olive-cover.png',
    itemCountLabel: '5 colors',
    packLabel: '350 XP each',
    backgrounds: [
      {
        id: 'linen-ebony',
        collectionId: 'linen-olive',
        name: 'Ebony',
        image: '/backgrounds/linen-olive/ebony.png',
        price: 350,
        colorHex: '#616951',
      },
      {
        id: 'linen-shadow',
        collectionId: 'linen-olive',
        name: 'Shadow',
        image: '/backgrounds/linen-olive/shadow.png',
        price: 350,
      },
      {
        id: 'linen-tan',
        collectionId: 'linen-olive',
        name: 'Tan',
        image: '/backgrounds/linen-olive/tan.png',
        price: 350,
      },
      {
        id: 'linen-light-goldenrod-yellow',
        collectionId: 'linen-olive',
        name: 'Light Goldenrod Yellow',
        image: '/backgrounds/linen-olive/light-goldenrod-yellow.png',
        price: 350,
      },
      {
        id: 'linen-gold-fusion',
        collectionId: 'linen-olive',
        name: 'Gold Fusion',
        image: '/backgrounds/linen-olive/gold-fusion.png',
        price: 350,
      },
    ],
  },
];

const STORE_BACKGROUNDS = [
  ...STORE_COLLECTIONS.flatMap((collection) => collection.backgrounds),
  ...FREE_COLLECTION.backgrounds,
];

const getStoreCollection = (id: string) =>
  id === FREE_COLLECTION.id
    ? FREE_COLLECTION
    : STORE_COLLECTIONS.find((collection) => collection.id === id);

const STORE_COLLECTION_DISPLAY_ORDER = [
  'japanese',
  'floraison',
  'dusk-at-sea',
  'silver-mist',
  'moss-dew',
  'crimson-heart',
  'frozen-threshold',
  'linen-olive',
] as const;

const getOrderedStoreCollections = () =>
  STORE_COLLECTION_DISPLAY_ORDER.map((id) =>
    STORE_COLLECTIONS.find((collection) => collection.id === id)
  ).filter((collection): collection is StoreCollection => Boolean(collection));

const getCollectionPackPrice = (
  collection: StoreCollection,
  ownedBackgroundIds: string[]
) => {
  const unowned = collection.backgrounds.filter(
    (background) => !ownedBackgroundIds.includes(background.id)
  );

  if (unowned.length === 0) return null;

  return unowned.reduce((total, background) => total + background.price, 0);
};

const formatBackgroundPrice = (price: number) =>
  price === 0 ? 'Free' : `✦ ${price.toLocaleString('en-US')} XP`;

const isPhotoCollection = (collection: StoreCollection) =>
  collection.id === 'japanese' || collection.id === 'floraison';

const isLightHexColor = (hex: string) => {
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return (r * 299 + g * 587 + b * 114) / 1000 > 168;
};

const STORE_FRIENDS = [
  {
    id: 'maya',
    name: 'Maya Chen',
    handle: '@maya.studies',
    initials: 'MC',
    color: '#8FA8BC',
  },
  {
    id: 'noah',
    name: 'Noah Kim',
    handle: '@noahcreates',
    initials: 'NK',
    color: '#A8BC8F',
  },
  {
    id: 'zoe',
    name: 'Zoe Reed',
    handle: '@zoebeauty',
    initials: 'ZR',
    color: '#BC8FA8',
  },
  {
    id: 'alex',
    name: 'Alex Torres',
    handle: '@alexkicks',
    initials: 'AT',
    color: '#8FA0BC',
  },
  {
    id: 'chloe',
    name: 'Chloe Park',
    handle: '@chloewishlist',
    initials: 'CP',
    color: '#BCA88F',
  },
] as const;

const getStoreBackgroundImage = (id: string | null) =>
  STORE_BACKGROUNDS.find((background) => background.id === id)?.image ??
  null;

const DAILY_SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const PAID_SPIN_BASE_COSTS = [50, 100, 1000, 2000] as const;

type SpinReward =
  | { type: 'nothing' }
  | { type: 'xp'; amount: number }
  | { type: 'background'; backgroundId: string; backgroundName: string };

type SpinSegment = {
  id: string;
  label: string;
  color: string;
  weight: number;
  reward: Omit<SpinReward, 'backgroundId' | 'backgroundName'> & {
    type: 'nothing' | 'xp' | 'background';
    amount?: number;
  };
};

const SPIN_SEGMENTS: SpinSegment[] = [
  {
    id: 'nothing',
    label: '—',
    color: '#1c1c1e',
    weight: 46,
    reward: { type: 'nothing' },
  },
  {
    id: 'xp-25',
    label: '25',
    color: '#2e353f',
    weight: 18,
    reward: { type: 'xp', amount: 25 },
  },
  {
    id: 'xp-50',
    label: '50',
    color: '#1c1c1e',
    weight: 12,
    reward: { type: 'xp', amount: 50 },
  },
  {
    id: 'xp-100',
    label: '100',
    color: '#2e353f',
    weight: 12,
    reward: { type: 'xp', amount: 100 },
  },
  {
    id: 'background',
    label: 'BG',
    color: '#3a424d',
    weight: 7,
    reward: { type: 'background' },
  },
  {
    id: 'xp-250',
    label: '250',
    color: '#1c1c1e',
    weight: 10,
    reward: { type: 'xp', amount: 250 },
  },
];

const getPaidSpinCost = (extraSpinCount: number) => {
  if (extraSpinCount < PAID_SPIN_BASE_COSTS.length) {
    return PAID_SPIN_BASE_COSTS[extraSpinCount];
  }
  return 2000 * 2 ** (extraSpinCount - PAID_SPIN_BASE_COSTS.length + 1);
};

const formatSpinCountdown = (ms: number) => {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const getDailySpinCooldownRemaining = (lastDailySpinAt: number | null) => {
  if (!lastDailySpinAt) return 0;
  return Math.max(0, DAILY_SPIN_COOLDOWN_MS - (Date.now() - lastDailySpinAt));
};

const canClaimDailySpin = (lastDailySpinAt: number | null) =>
  getDailySpinCooldownRemaining(lastDailySpinAt) === 0;

const pickWeightedSpinSegment = () => {
  const total = SPIN_SEGMENTS.reduce((sum, segment) => sum + segment.weight, 0);
  let roll = Math.random() * total;
  for (let index = 0; index < SPIN_SEGMENTS.length; index += 1) {
    roll -= SPIN_SEGMENTS[index].weight;
    if (roll <= 0) {
      return { segment: SPIN_SEGMENTS[index], index };
    }
  }
  return {
    segment: SPIN_SEGMENTS[SPIN_SEGMENTS.length - 1],
    index: SPIN_SEGMENTS.length - 1,
  };
};

const getSpinWheelRotation = (winIndex: number, currentRotation: number) => {
  const segmentAngle = 360 / SPIN_SEGMENTS.length;
  const targetMod =
    (360 - (winIndex * segmentAngle + segmentAngle / 2)) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  let delta = targetMod - currentMod;
  if (delta <= 0) delta += 360;
  return currentRotation + 360 * 7 + delta;
};

const getSpinBackgroundPrize = (ownedBackgroundIds: string[]) => {
  const pool = STORE_BACKGROUNDS.filter(
    (background) =>
      !ownedBackgroundIds.includes(background.id) && background.price <= 800
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
};

const resolveSpinReward = (
  segment: SpinSegment,
  ownedBackgroundIds: string[]
): SpinReward => {
  if (segment.reward.type === 'nothing') return { type: 'nothing' };
  if (segment.reward.type === 'xp') {
    return { type: 'xp', amount: segment.reward.amount ?? 0 };
  }

  const background = getSpinBackgroundPrize(ownedBackgroundIds);
  if (!background) return { type: 'xp', amount: 100 };
  return {
    type: 'background',
    backgroundId: background.id,
    backgroundName: background.name,
  };
};

const describeSpinReward = (reward: SpinReward) => {
  if (reward.type === 'nothing') return 'Better luck next time';
  if (reward.type === 'xp') return `You won ${reward.amount} XP`;
  return `You won ${reward.backgroundName}`;
};

function AppEquippedBackground({
  image,
  blurClassName = 'blur-sm',
  overlayClassName = 'bg-black/55',
}: {
  image: string;
  blurClassName?: string;
  overlayClassName?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        className={`scale-110 object-cover ${blurClassName}`}
        sizes="390px"
        priority
      />
      <div
        className={`absolute inset-0 ${overlayClassName}`}
        aria-hidden="true"
      />
    </div>
  );
}

function BackgroundPreviewBar({
  backgroundName,
  onExit,
}: {
  backgroundName: string;
  onExit: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[88px] z-[95] flex justify-center px-4">
      <div
        className="pointer-events-auto flex items-center gap-3 rounded-full py-2 pl-4 pr-2"
        style={{
          background: 'rgba(250,247,239,0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(250,247,239,0.12)',
        }}
      >
        <p className="text-[12px] font-medium text-white">
          Previewing <span style={{ opacity: 0.7 }}>{backgroundName}</span>
        </p>
        <button
          type="button"
          onClick={onExit}
          className="cursor-pointer rounded-full border-none px-3 py-1.5 text-[11px] font-semibold text-[#FAF7EF]"
          style={{
            background: 'rgba(250,247,239,0.14)',
            border: '1px solid rgba(250,247,239,0.18)',
          }}
        >
          Exit
        </button>
      </div>
    </div>
  );
}

function TradeRequestModal({
  background,
  selectedFriendId,
  onSelectFriend,
  onSend,
  onClose,
}: {
  background: StoreBackground;
  selectedFriendId: string | null;
  onSelectFriend: (friendId: string) => void;
  onSend: () => void;
  onClose: () => void;
}) {
  const [offerConfirmed, setOfferConfirmed] = useState(true);

  return (
    <>
      <button
        type="button"
        className="absolute inset-0 z-[110] cursor-default border-none p-0"
        style={{ background: 'rgba(0,0,0,0.55)' }}
        onClick={onClose}
        aria-label="Close trade request"
      />
      <div className="pointer-events-none absolute inset-0 z-[111] flex items-end justify-center px-4 pb-[88px]">
        <div
          className="pointer-events-auto w-full max-w-[360px] overflow-hidden rounded-[20px] font-clash text-white"
          style={{
            background: '#1C1C1E',
            border: '1px solid rgba(250,247,239,0.12)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b px-4 py-4" style={{ borderColor: 'rgba(250,247,239,0.08)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[17px] font-medium text-white">Request a trade</h2>
                <p
                  className="mt-1 text-[12px] leading-relaxed text-white"
                  style={{ opacity: 0.45 }}
                >
                  Choose a friend to send this background to
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-none bg-transparent p-0"
                aria-label="Close"
              >
                <X size={20} className="text-white" style={{ opacity: 0.55 }} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px]">
              <Image
                src={background.image}
                alt={background.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-white">{background.name}</p>
              <p className="text-[11px] text-white" style={{ opacity: 0.4 }}>
                Background · Your offer
              </p>
            </div>
          </div>

          <div className="max-h-[220px] overflow-y-auto px-4 pb-2">
            {STORE_FRIENDS.map((friend) => {
              const isSelected = selectedFriendId === friend.id;

              return (
                <button
                  key={friend.id}
                  type="button"
                  onClick={() => onSelectFriend(friend.id)}
                  className="mb-2 flex w-full cursor-pointer items-center gap-3 rounded-xl border-none px-3 py-2.5 text-left transition-colors"
                  style={{
                    background: isSelected
                      ? 'rgba(138,151,168,0.18)'
                      : 'rgba(250,247,239,0.05)',
                    border: isSelected
                      ? '1px solid rgba(138,151,168,0.35)'
                      : '1px solid rgba(250,247,239,0.08)',
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                    style={{
                      background: `${friend.color}4D`,
                      border: `1px solid ${friend.color}80`,
                    }}
                  >
                    {friend.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-white">{friend.name}</p>
                    <p className="text-[11px] text-white" style={{ opacity: 0.4 }}>
                      {friend.handle}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-[11px] font-medium" style={{ color: SLATE }}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 px-4 py-4">
            <button
              type="button"
              onClick={() => setOfferConfirmed((confirmed) => !confirmed)}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border-none py-3 text-[13px] font-semibold text-white transition-opacity"
              style={{
                background: offerConfirmed
                  ? 'rgba(143,168,188,0.22)'
                  : 'rgba(250,247,239,0.08)',
                border: offerConfirmed
                  ? '1px solid rgba(143,168,188,0.35)'
                  : '1px solid rgba(250,247,239,0.12)',
              }}
            >
              Offer Item
            </button>
            <button
              type="button"
              disabled={!selectedFriendId || !offerConfirmed}
              onClick={onSend}
              className="flex flex-1 cursor-pointer rounded-xl border-none py-3 text-[13px] font-semibold text-[#FAF7EF] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: 'rgba(250,247,239,0.14)',
                border: '1px solid rgba(250,247,239,0.18)',
              }}
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function StoreIntroModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button
        type="button"
        className="absolute inset-0 z-[80] cursor-default border-none p-0"
        style={{ background: 'rgba(0,0,0,0.55)' }}
        onClick={onClose}
        aria-label="Close store info"
      />
      <div className="pointer-events-none absolute inset-0 z-[81] flex items-center justify-center px-6">
        <div
          className="pointer-events-auto w-full max-w-[300px] rounded-[20px] px-5 py-5 font-clash text-[#FAF7EF]"
          style={{
            background: '#1C1C1E',
            border: '1px solid rgba(250,247,239,0.12)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <h2 className="pr-8 text-[18px] font-medium text-white">Welcome to the Store</h2>
          <p
            className="mt-2 text-[13px] leading-relaxed text-white"
            style={{ opacity: 0.55 }}
          >
            Spend your XP on exclusive items like profile backgrounds. Earn XP by
            wishlisting, liking, and funding your goals.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full cursor-pointer rounded-xl border-none py-3 text-[14px] font-semibold text-[#FAF7EF]"
            style={{ background: 'rgba(250,247,239,0.14)' }}
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
}

function SpinWidgetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-1.5 rounded-full border-none px-3 py-1.5 text-[11px] font-medium tracking-[0.4px] text-white ${styles.spinWidgetPill}`}
      aria-label="Open daily spin"
    >
      <Star size={12} fill="currentColor" strokeWidth={1.5} />
      Spin
    </button>
  );
}

const SPIN_ANIMATION_MS = 4800;

function SpinWheel({
  rotation,
  spinning,
  onTransitionEnd,
}: {
  rotation: number;
  spinning: boolean;
  onTransitionEnd?: (event: React.TransitionEvent<HTMLDivElement>) => void;
}) {
  const gradient = useMemo(
    () =>
      SPIN_SEGMENTS.map((segment, index) => {
        const start = (index / SPIN_SEGMENTS.length) * 100;
        const end = ((index + 1) / SPIN_SEGMENTS.length) * 100;
        return `${segment.color} ${start}% ${end}%`;
      }).join(', '),
    []
  );
  const segmentAngle = 360 / SPIN_SEGMENTS.length;
  const labelRadius = 80;

  const getLabelPosition = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.sin(radians) * labelRadius,
      y: -Math.cos(radians) * labelRadius,
    };
  };

  return (
    <div className="relative mx-auto" style={{ width: 220, height: 220 }}>
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: `12px solid ${SLATE}`,
        }}
        aria-hidden="true"
      />
      <div
        className={`${styles.spinWheel} ${spinning ? '' : styles.spinWheelIdle}`}
        style={{
          background: `conic-gradient(from 0deg, ${gradient})`,
          transform: `rotate(${rotation}deg)`,
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {SPIN_SEGMENTS.map((segment, index) => {
          const angle = index * segmentAngle + segmentAngle / 2;
          const { x, y } = getLabelPosition(angle);

          return (
          <div
            key={segment.id}
            className={styles.spinWheelLabel}
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <span
              className={styles.spinWheelLabelText}
              style={{
                opacity: segment.reward.type === 'nothing' ? 0.35 : 0.85,
              }}
            >
              {segment.label}
            </span>
          </div>
        )})}
        <div className={styles.spinWheelHub} aria-hidden="true" />
      </div>
    </div>
  );
}

function GlitterSpinPanel({
  xp,
  lastDailySpinAt,
  extraSpinCount,
  ownedBackgroundIds,
  isSignedIn,
  onRequireSignIn,
  onClose,
  onPaidSpinCharge,
  onSpinComplete,
  inline = false,
}: {
  xp: number;
  lastDailySpinAt: number | null;
  extraSpinCount: number;
  ownedBackgroundIds: string[];
  isSignedIn: boolean;
  onRequireSignIn: () => void;
  onClose?: () => void;
  onPaidSpinCharge: (cost: number) => void;
  onSpinComplete: (payload: {
    isDaily: boolean;
    reward: SpinReward;
  }) => void;
  inline?: boolean;
}) {
  const [phase, setPhase] = useState<'prompt' | 'spinning' | 'result'>('prompt');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastReward, setLastReward] = useState<SpinReward | null>(null);
  const [countdownMs, setCountdownMs] = useState(() =>
    getDailySpinCooldownRemaining(lastDailySpinAt)
  );
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef(phase);
  const pendingSpinRef = useRef<{
    isDaily: boolean;
    reward: SpinReward;
  } | null>(null);

  phaseRef.current = phase;

  const dailyAvailable = canClaimDailySpin(lastDailySpinAt);
  const paidSpinCost = getPaidSpinCost(extraSpinCount);
  const canAffordPaidSpin = xp >= paidSpinCost;

  useEffect(() => {
    const tick = () => {
      setCountdownMs(getDailySpinCooldownRemaining(lastDailySpinAt));
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [lastDailySpinAt, phase]);

  useEffect(
    () => () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    },
    []
  );

  const finishSpin = () => {
    if (phaseRef.current !== 'spinning' || !pendingSpinRef.current) return;

    const { isDaily, reward } = pendingSpinRef.current;
    pendingSpinRef.current = null;

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }

    setSpinning(false);
    setLastReward(reward);
    setPhase('result');
    onSpinComplete({ isDaily, reward });
  };

  const scheduleSpinFallback = () => {
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = setTimeout(finishSpin, SPIN_ANIMATION_MS + 400);
  };

  const handleWheelTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (event.propertyName !== 'transform') return;
    if (event.target !== event.currentTarget) return;
    finishSpin();
  };

  const runSpin = (isDaily: boolean) => {
    if (!isSignedIn) {
      onRequireSignIn();
      return;
    }
    if (!isDaily && !canAffordPaidSpin) return;
    if (phaseRef.current === 'spinning') return;

    const spinCost = paidSpinCost;
    if (!isDaily) {
      onPaidSpinCharge(spinCost);
    }

    const { segment, index } = pickWeightedSpinSegment();
    const reward = resolveSpinReward(segment, ownedBackgroundIds);
    const nextRotation = getSpinWheelRotation(index, wheelRotation);

    pendingSpinRef.current = { isDaily, reward };

    setPhase('spinning');
    setSpinning(true);
    scheduleSpinFallback();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setWheelRotation(nextRotation);
      });
    });
  };

  const handleClose = () => {
    if (phase === 'spinning') return;
    onClose?.();
  };

  const handleDone = () => {
    if (phase === 'spinning') return;
    if (inline) {
      setPhase('prompt');
      setLastReward(null);
      return;
    }
    onClose?.();
  };

  const panelContent = (
    <div
      className={`flex w-full flex-col overflow-y-auto font-clash text-white ${
        inline
          ? `rounded-[16px] px-4 py-5 ${styles.spinModalGlass}`
          : `pointer-events-auto max-h-[min(720px,92%)] max-w-[340px] rounded-[20px] px-4 py-5 ${styles.spinModalGlass}`
      }`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <h2 className="shrink-0 text-[18px] font-medium text-white">
              {inline ? 'Glitter Spin' : 'Daily Spin'}
            </h2>
            {!dailyAvailable && (
              <span
                className={`font-mono text-[20px] font-medium tracking-wider text-white ${styles.spinTimerGlow}`}
              >
                {formatSpinCountdown(countdownMs)}
              </span>
            )}
          </div>
          {!inline && onClose && (
            <button
              type="button"
              onClick={handleClose}
              disabled={phase === 'spinning'}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent disabled:opacity-30"
              aria-label="Close"
            >
              <X size={18} className="text-white" style={{ opacity: 0.7 }} />
            </button>
          )}
        </div>
        <p className="mt-1 text-[12px] text-white" style={{ opacity: 0.45 }}>
          Spin for XP or a background
        </p>
      </div>

      <SpinWheel
        rotation={wheelRotation}
        spinning={spinning}
        onTransitionEnd={handleWheelTransitionEnd}
      />

      {phase === 'prompt' && (
        <div className="mt-5 flex flex-col gap-3">
          {dailyAvailable ? (
            <>
              <p className="text-center text-[13px] leading-relaxed text-white" style={{ opacity: 0.7 }}>
                Your daily spin is ready. Want to try your luck?
              </p>
              <button
                type="button"
                onClick={() => runSpin(true)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none py-3.5 text-[14px] font-semibold text-[#FAF7EF]"
                style={{ background: 'rgba(250,247,239,0.14)' }}
              >
                <RotateCw size={16} strokeWidth={2} />
                Spin for free
              </button>
            </>
          ) : (
            <>
              <p className="text-center text-[12px] leading-relaxed text-white" style={{ opacity: 0.5 }}>
                Don&apos;t want to wait? Spend XP for an extra spin.
              </p>
              <button
                type="button"
                disabled={!canAffordPaidSpin}
                onClick={() => runSpin(false)}
                className="w-full cursor-pointer rounded-xl border-none py-3.5 text-[14px] font-semibold text-[#FAF7EF] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: 'rgba(250,247,239,0.14)' }}
              >
                Spin again · ✦ {paidSpinCost.toLocaleString('en-US')} XP
              </button>
              {!canAffordPaidSpin && (
                <p className="text-center text-[11px] text-white" style={{ opacity: 0.4 }}>
                  Not enough XP for another spin
                </p>
              )}
            </>
          )}
        </div>
      )}

      {phase === 'spinning' && (
        <p className="mt-5 text-center text-[13px] text-white" style={{ opacity: 0.55 }}>
          Spinning…
        </p>
      )}

      {phase === 'result' && lastReward && (
        <div className="mt-5 flex flex-col gap-3">
          <div
            className="rounded-xl px-4 py-4 text-center"
            style={{
              background: 'rgba(250,247,239,0.06)',
              border: '1px solid rgba(250,247,239,0.1)',
            }}
          >
            <p className="text-[11px] uppercase tracking-[0.5px] text-white" style={{ opacity: 0.45 }}>
              You got
            </p>
            <p className="mt-1 text-[16px] font-medium text-white">
              {describeSpinReward(lastReward)}
            </p>
          </div>
          {!dailyAvailable && (
            <button
              type="button"
              disabled={!canAffordPaidSpin}
              onClick={() => runSpin(false)}
              className="w-full cursor-pointer rounded-xl border-none py-3 text-[14px] font-semibold text-[#FAF7EF] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: 'rgba(250,247,239,0.14)' }}
            >
              Spin again · ✦ {paidSpinCost.toLocaleString('en-US')} XP
            </button>
          )}
          <button
            type="button"
            onClick={handleDone}
            className="w-full cursor-pointer rounded-xl border-none py-3 text-[14px] font-semibold text-[#FAF7EF]"
            style={{ background: 'rgba(250,247,239,0.14)' }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );

  if (inline) {
    return panelContent;
  }

  return (
    <>
      <button
        type="button"
        className="absolute inset-0 z-[110] cursor-default border-none p-0"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={handleClose}
        aria-label="Close spin"
      />
      <div className="pointer-events-none absolute inset-0 z-[111] flex items-center justify-center px-4">
        {panelContent}
      </div>
    </>
  );
}

function DailySpinModal({
  xp,
  lastDailySpinAt,
  extraSpinCount,
  ownedBackgroundIds,
  isSignedIn,
  onRequireSignIn,
  onClose,
  onPaidSpinCharge,
  onSpinComplete,
}: {
  xp: number;
  lastDailySpinAt: number | null;
  extraSpinCount: number;
  ownedBackgroundIds: string[];
  isSignedIn: boolean;
  onRequireSignIn: () => void;
  onClose: () => void;
  onPaidSpinCharge: (cost: number) => void;
  onSpinComplete: (payload: {
    isDaily: boolean;
    reward: SpinReward;
  }) => void;
}) {
  return (
    <GlitterSpinPanel
      xp={xp}
      lastDailySpinAt={lastDailySpinAt}
      extraSpinCount={extraSpinCount}
      ownedBackgroundIds={ownedBackgroundIds}
      isSignedIn={isSignedIn}
      onRequireSignIn={onRequireSignIn}
      onClose={onClose}
      onPaidSpinCharge={onPaidSpinCharge}
      onSpinComplete={onSpinComplete}
      inline={false}
    />
  );
}

type StoreScreenTab = 'store' | 'owned';
type StoreShopTab = 'avatar' | 'backgrounds' | 'glitter';

function StoreCategoryTabBar({
  active,
  onChange,
}: {
  active: StoreShopTab;
  onChange: (tab: StoreShopTab) => void;
}) {
  const tabs: { id: StoreShopTab; label: string }[] = [
    { id: 'backgrounds', label: 'Backgrounds' },
    { id: 'avatar', label: 'Avatar' },
    { id: 'glitter', label: 'Glitter' },
  ];

  return (
    <div className="mb-4 flex gap-1">
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="flex-1 cursor-pointer rounded-[10px] border-none py-2 text-[11px] font-semibold text-white transition-opacity"
            style={{
              background: isActive
                ? 'rgba(138,151,168,0.22)'
                : 'rgba(250,247,239,0.06)',
              border: isActive
                ? '1px solid rgba(138,151,168,0.45)'
                : '1px solid rgba(250,247,239,0.08)',
              opacity: isActive ? 1 : 0.55,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function BackgroundShopRow({
  background,
  isOwned,
  isEquipped,
  isPreviewing,
  canAfford,
  isSignedIn,
  onRequireSignIn,
  onPurchase,
  onPreview,
  onTrade,
  onEquip,
  onUnequip,
}: {
  background: StoreBackground;
  isOwned: boolean;
  isEquipped: boolean;
  isPreviewing: boolean;
  canAfford: boolean;
  isSignedIn: boolean;
  onRequireSignIn: () => void;
  onPurchase: () => void;
  onPreview: () => void;
  onTrade: (background: StoreBackground) => void;
  onEquip: (id: string) => void;
  onUnequip: () => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        ...WNTS_CARD_STYLE,
        borderRadius: '14px',
        padding: '12px',
      }}
    >
      <div className="relative mb-3 h-[140px] w-full overflow-hidden rounded-[10px]">
        <Image
          src={background.image}
          alt={background.name}
          fill
          className="object-cover"
          sizes="360px"
        />
        {isEquipped && !isPreviewing && (
          <span
            className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-white"
            style={{
              background: 'rgba(250,247,239,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(250,247,239,0.12)',
            }}
          >
            Equipped
          </span>
        )}
        {isPreviewing && (
          <span
            className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-white"
            style={{
              background: 'rgba(250,247,239,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(250,247,239,0.12)',
            }}
          >
            Previewing
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-white">{background.name}</p>
          <p className="text-[11px] text-white" style={{ opacity: 0.45 }}>
            {formatBackgroundPrice(background.price)}
          </p>
        </div>
        {isOwned ? (
          <BackgroundItemActions
            background={background}
            isEquipped={isEquipped}
            onTrade={onTrade}
            onEquip={onEquip}
            onUnequip={onUnequip}
          />
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onPreview}
              className="shrink-0 cursor-pointer rounded-full border-none px-3 py-2 text-[11px] font-semibold text-[#FAF7EF] transition-opacity hover:opacity-90"
              style={{
                background: isPreviewing
                  ? 'rgba(250,247,239,0.14)'
                  : 'rgba(250,247,239,0.08)',
                border: '1px solid rgba(250,247,239,0.18)',
              }}
            >
              Preview
            </button>
            <button
              type="button"
              disabled={!canAfford}
              onClick={() => {
                if (!isSignedIn) {
                  onRequireSignIn();
                  return;
                }
                onPurchase();
              }}
              className="shrink-0 cursor-pointer rounded-full border-none px-4 py-2 text-[11px] font-semibold text-[#FAF7EF] transition-opacity disabled:cursor-not-allowed"
              style={{
                background: canAfford
                  ? 'rgba(250,247,239,0.14)'
                  : 'rgba(250,247,239,0.06)',
                border: '1px solid rgba(250,247,239,0.18)',
                opacity: canAfford ? 1 : 0.45,
              }}
            >
              {background.price === 0 ? 'Get' : 'Buy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionThemeCard({
  collection,
  ownedCount,
  onOpen,
}: {
  collection: StoreCollection;
  ownedCount: number;
  onOpen: () => void;
}) {
  const previewImages = collection.backgrounds.slice(0, 3);
  const isPhoto = isPhotoCollection(collection);
  const heroColor =
    collection.cardHeroColor ??
    collection.backgrounds[0]?.colorHex ??
    '#0C1519';
  const useLightText = isPhoto || !isLightHexColor(heroColor);
  const titleColor = useLightText ? '#FFFFFF' : '#1C1C1E';
  const subtitleOpacity = useLightText ? 0.65 : 0.72;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative w-full cursor-pointer overflow-hidden rounded-xl border-none p-0 text-left"
      style={{
        ...WNTS_CARD_STYLE,
        borderRadius: '14px',
      }}
    >
      <div className="relative h-[150px] w-full overflow-hidden">
        {isPhoto ? (
          <>
            <Image
              src={collection.coverImage}
              alt={collection.name}
              fill
              className="object-cover"
              sizes="360px"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.72) 100%)',
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: heroColor }}
            aria-hidden="true"
          />
        )}
        {ownedCount > 0 && (
          <span
            className="absolute right-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white"
            style={{
              background: 'rgba(250,247,239,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(250,247,239,0.12)',
            }}
          >
            {ownedCount}/{collection.backgrounds.length} owned
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <p
            className="text-[15px] font-medium"
            style={{ color: titleColor }}
          >
            {collection.name}
          </p>
          <p
            className="text-[11px]"
            style={{ color: titleColor, opacity: subtitleOpacity }}
          >
            {collection.itemCountLabel}
            {collection.packLabel ? ` · ${collection.packLabel}` : ''}
          </p>
        </div>
      </div>
      {previewImages.length > 1 && (
        <div className="flex gap-1.5 p-3">
          {previewImages.map((background) => (
            <div
              key={background.id}
              className="relative h-10 flex-1 overflow-hidden rounded-md"
            >
              <Image
                src={background.image}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
          ))}
        </div>
      )}
      <div
        className="flex items-center justify-between border-t px-3 py-2.5"
        style={{ borderColor: 'rgba(250,247,239,0.08)' }}
      >
        <span className="text-[11px] text-white" style={{ opacity: 0.45 }}>
          View collection
        </span>
        <ChevronRight size={16} className="text-white" style={{ opacity: 0.45 }} />
      </div>
    </button>
  );
}

function CollectionDetailView({
  collection,
  xp,
  ownedBackgroundIds,
  equippedBackgroundId,
  previewBackgroundId,
  isSignedIn,
  onBack,
  onRequireSignIn,
  onPurchaseBackground,
  onPurchasePack,
  onPreviewBackground,
  onTrade,
  onEquipBackground,
  onUnequipBackground,
}: {
  collection: StoreCollection;
  xp: number;
  ownedBackgroundIds: string[];
  equippedBackgroundId: string | null;
  previewBackgroundId: string | null;
  isSignedIn: boolean;
  onBack: () => void;
  onRequireSignIn: () => void;
  onPurchaseBackground: (id: string, price: number) => void;
  onPurchasePack: (ids: string[], price: number) => void;
  onPreviewBackground: (id: string) => void;
  onTrade: (background: StoreBackground) => void;
  onEquipBackground: (id: string) => void;
  onUnequipBackground: () => void;
}) {
  const unowned = collection.backgrounds.filter(
    (background) => !ownedBackgroundIds.includes(background.id)
  );
  const packPrice = getCollectionPackPrice(collection, ownedBackgroundIds);
  const canAffordPack = packPrice !== null && xp >= packPrice;
  const showPack =
    unowned.length > 0 && collection.backgrounds.length > 1;

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[13px] font-medium text-white"
        style={{ opacity: 0.75 }}
      >
        <ChevronLeft size={18} strokeWidth={2} />
        All themes
      </button>

      <div>
        <h2 className="text-[20px] font-medium text-white">{collection.name}</h2>
        <p className="mt-1 text-[12px] text-white" style={{ opacity: 0.45 }}>
          {collection.itemCountLabel}
          {collection.packLabel ? ` · ${collection.packLabel}` : ''}
        </p>
      </div>

      {showPack && packPrice !== null && (
        <div
          className="rounded-xl p-4"
          style={{
            ...WNTS_CARD_STYLE,
            borderRadius: '14px',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-medium text-white">Buy whole pack</p>
              <p className="text-[11px] text-white" style={{ opacity: 0.45 }}>
                Get all {unowned.length} remaining · ✦{' '}
                {packPrice.toLocaleString('en-US')} XP
              </p>
            </div>
            <button
              type="button"
              disabled={!canAffordPack}
              onClick={() => {
                if (!isSignedIn) {
                  onRequireSignIn();
                  return;
                }
                onPurchasePack(
                  unowned.map((background) => background.id),
                  packPrice
                );
              }}
              className="shrink-0 cursor-pointer rounded-full border-none px-4 py-2 text-[11px] font-semibold text-[#FAF7EF] transition-opacity disabled:cursor-not-allowed"
              style={{
                background: canAffordPack
                  ? 'rgba(250,247,239,0.14)'
                  : 'rgba(250,247,239,0.06)',
                border: '1px solid rgba(250,247,239,0.18)',
                opacity: canAffordPack ? 1 : 0.45,
              }}
            >
              Buy pack
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {collection.backgrounds.map((background) => {
          const isOwned = ownedBackgroundIds.includes(background.id);
          const isEquipped = equippedBackgroundId === background.id;
          const isPreviewing = previewBackgroundId === background.id;
          const canAfford = background.price === 0 || xp >= background.price;

          return (
            <BackgroundShopRow
              key={background.id}
              background={background}
              isOwned={isOwned}
              isEquipped={isEquipped}
              isPreviewing={isPreviewing}
              canAfford={canAfford}
              isSignedIn={isSignedIn}
              onRequireSignIn={onRequireSignIn}
              onPurchase={() =>
                onPurchaseBackground(background.id, background.price)
              }
              onPreview={() => onPreviewBackground(background.id)}
              onTrade={onTrade}
              onEquip={onEquipBackground}
              onUnequip={onUnequipBackground}
            />
          );
        })}
      </div>
    </div>
  );
}

function BackgroundItemActions({
  background,
  isEquipped,
  onTrade,
  onEquip,
  onUnequip,
}: {
  background: StoreBackground;
  isEquipped: boolean;
  onTrade: (background: StoreBackground) => void;
  onEquip: (id: string) => void;
  onUnequip: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => onTrade(background)}
        className="shrink-0 cursor-pointer rounded-full border-none px-3 py-2 text-[11px] font-semibold text-[#FAF7EF] transition-opacity hover:opacity-90"
        style={{
          background: 'rgba(250,247,239,0.08)',
          border: '1px solid rgba(250,247,239,0.18)',
        }}
      >
        Trade
      </button>
      {isEquipped ? (
        <button
          type="button"
          onClick={onUnequip}
          className="shrink-0 cursor-pointer rounded-full border-none px-4 py-2 text-[11px] font-semibold text-[#FAF7EF] transition-opacity hover:opacity-90"
          style={{
            background: 'rgba(250,247,239,0.14)',
            border: '1px solid rgba(250,247,239,0.18)',
          }}
        >
          Unequip
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onEquip(background.id)}
          className="shrink-0 cursor-pointer rounded-full border-none px-4 py-2 text-[11px] font-semibold text-[#FAF7EF] transition-opacity hover:opacity-90"
          style={{
            background: 'rgba(250,247,239,0.14)',
            border: '1px solid rgba(250,247,239,0.18)',
          }}
        >
          Equip
        </button>
      )}
    </div>
  );
}

function OwnedView({
  ownedBackgroundIds,
  equippedBackgroundId,
  ownedAvatarItemIds,
  equippedAvatarSlots,
  avatarItemColors,
  previewBackgroundImage,
  isSignedIn,
  onRequireSignIn,
  onPurchaseBackground,
  onTrade,
  onEquipBackground,
  onUnequipBackground,
  onEquipAvatarItem,
}: {
  ownedBackgroundIds: string[];
  equippedBackgroundId: string | null;
  ownedAvatarItemIds: string[];
  equippedAvatarSlots: Record<AvatarClothingSlot, string | null>;
  avatarItemColors: Record<string, string>;
  previewBackgroundImage?: string | null;
  isSignedIn: boolean;
  onRequireSignIn: () => void;
  onPurchaseBackground: (id: string, price: number) => void;
  onTrade: (background: StoreBackground) => void;
  onEquipBackground: (id: string) => void;
  onUnequipBackground: () => void;
  onEquipAvatarItem: (item: AvatarShopItem) => void;
}) {
  const ownedAvatarItems = AVATAR_SHOP_ITEMS.filter((item) =>
    ownedAvatarItemIds.includes(item.id)
  );
  const categories = getOrderedStoreCollections()
    .map((collection) => ({
    id: collection.id,
    label: collection.name,
    items: collection.backgrounds.filter((background) =>
      ownedBackgroundIds.includes(background.id)
    ),
  })).filter((category) => category.items.length > 0);

  const renderOwnedCard = (background: StoreBackground) => {
    const isEquipped = equippedBackgroundId === background.id;
    const isOwned = ownedBackgroundIds.includes(background.id);

    return (
      <div
        key={background.id}
        className="overflow-hidden rounded-xl"
        style={{
          ...WNTS_CARD_STYLE,
          borderRadius: '14px',
          padding: '12px',
        }}
      >
        <div className="relative mb-3 h-[140px] w-full overflow-hidden rounded-[10px]">
          <Image
            src={background.image}
            alt={background.name}
            fill
            className="object-cover"
            sizes="360px"
          />
          {isEquipped && (
            <span
              className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-white"
              style={{
                background: 'rgba(250,247,239,0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(250,247,239,0.12)',
              }}
            >
              Equipped
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-white">{background.name}</p>
            <p className="text-[11px] text-white" style={{ opacity: 0.45 }}>
              {FREE_COLLECTION.name}
            </p>
          </div>
          {isOwned ? (
            <BackgroundItemActions
              background={background}
              isEquipped={isEquipped}
              onTrade={onTrade}
              onEquip={onEquipBackground}
              onUnequip={onUnequipBackground}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isSignedIn) {
                  onRequireSignIn();
                  return;
                }
                onPurchaseBackground(background.id, background.price);
              }}
              className="shrink-0 cursor-pointer rounded-full border-none px-4 py-2 text-[11px] font-semibold text-[#FAF7EF] transition-opacity hover:opacity-90"
              style={{
                background: 'rgba(250,247,239,0.14)',
                border: '1px solid rgba(250,247,239,0.18)',
              }}
            >
              Get
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {ownedAvatarItems.length > 0 && (
        <section>
          <AvatarInventoryGrid
            items={ownedAvatarItems}
            equippedSlots={equippedAvatarSlots}
            itemColors={avatarItemColors}
            previewBackgroundImage={previewBackgroundImage}
            onEquip={onEquipAvatarItem}
            breadcrumb="Avatar > Inventory"
            columns={4}
          />
        </section>
      )}

      {categories.length === 0 && ownedAvatarItems.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center px-6 py-10 text-center"
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background: 'rgba(250,247,239,0.06)',
              border: '1px solid rgba(250,247,239,0.12)',
            }}
          >
            <Gift size={24} className="text-white" style={{ opacity: 0.5 }} />
          </div>
          <p className="text-[15px] font-medium text-white">Nothing owned yet</p>
          <p
            className="mt-2 max-w-[240px] text-[12px] leading-relaxed text-white"
            style={{ opacity: 0.45 }}
          >
            Items you buy in the Store will show up here, organized by category.
          </p>
        </div>
      ) : (
        categories.map((category) => (
          <section key={category.id}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-white">
                {category.label}
              </h2>
              <span
                className="text-[11px] text-white"
                style={{ opacity: 0.4 }}
              >
                {category.items.length}{' '}
                {category.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {category.items.map((background) => {
                const isEquipped = equippedBackgroundId === background.id;

                return (
                  <div
                    key={background.id}
                    className="overflow-hidden rounded-xl"
                    style={{
                      ...WNTS_CARD_STYLE,
                      borderRadius: '14px',
                      padding: '12px',
                    }}
                  >
                    <div className="relative mb-3 h-[140px] w-full overflow-hidden rounded-[10px]">
                      <Image
                        src={background.image}
                        alt={background.name}
                        fill
                        className="object-cover"
                        sizes="360px"
                      />
                      {isEquipped && (
                        <span
                          className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-white"
                          style={{
                            background: 'rgba(250,247,239,0.08)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(250,247,239,0.12)',
                          }}
                        >
                          Equipped
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-white">
                          {background.name}
                        </p>
                        <p
                          className="text-[11px] text-white"
                          style={{ opacity: 0.45 }}
                        >
                          {getStoreCollection(background.collectionId)?.name ??
                            'Background'}
                        </p>
                      </div>
                      <BackgroundItemActions
                        background={background}
                        isEquipped={isEquipped}
                        onTrade={onTrade}
                        onEquip={onEquipBackground}
                        onUnequip={onUnequipBackground}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-white">
            {FREE_COLLECTION.name}
          </h2>
          <span className="text-[11px] text-white" style={{ opacity: 0.4 }}>
            Free
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {FREE_COLLECTION.backgrounds.map(renderOwnedCard)}
        </div>
      </section>
    </div>
  );
}

function StoreView({
  xp,
  xpPillRef,
  ownedBackgroundIds,
  equippedBackgroundId,
  previewBackgroundId,
  ownedAvatarItemIds,
  equippedAvatarSlots,
  avatarItemColors,
  lastDailySpinAt,
  extraSpinCount,
  isSignedIn,
  onRequireSignIn,
  onPurchaseBackground,
  onPurchasePack,
  onPurchaseAvatarItem,
  onEquipAvatarItem,
  onPreviewBackground,
  onEquipBackground,
  onUnequipBackground,
  onPaidSpinCharge,
  onSpinComplete,
}: {
  xp: number;
  xpPillRef: React.RefObject<HTMLDivElement | null>;
  ownedBackgroundIds: string[];
  equippedBackgroundId: string | null;
  previewBackgroundId: string | null;
  ownedAvatarItemIds: string[];
  equippedAvatarSlots: Record<AvatarClothingSlot, string | null>;
  avatarItemColors: Record<string, string>;
  lastDailySpinAt: number | null;
  extraSpinCount: number;
  isSignedIn: boolean;
  onRequireSignIn: () => void;
  onPurchaseBackground: (id: string, price: number) => void;
  onPurchasePack: (ids: string[], price: number) => void;
  onPurchaseAvatarItem: (id: string, price: number) => void;
  onEquipAvatarItem: (item: AvatarShopItem) => void;
  onPreviewBackground: (id: string) => void;
  onEquipBackground: (id: string) => void;
  onUnequipBackground: () => void;
  onPaidSpinCharge: (cost: number) => void;
  onSpinComplete: (payload: {
    isDaily: boolean;
    reward: SpinReward;
  }) => void;
}) {
  const [introOpen, setIntroOpen] = useState(true);
  const [spinOpen, setSpinOpen] = useState(false);
  const [storeScreenTab, setStoreScreenTab] = useState<StoreScreenTab>('store');
  const [storeShopTab, setStoreShopTab] = useState<StoreShopTab>('backgrounds');
  const [selectedShopItem, setSelectedShopItem] = useState<AvatarShopItem | null>(null);
  const [storeAvatarCategory, setStoreAvatarCategory] =
    useState<AvatarEditCategory>('clothes');
  const [storeAvatarSubCategory, setStoreAvatarSubCategory] = useState('outerwear');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(
    null
  );
  const [tradeBackground, setTradeBackground] = useState<StoreBackground | null>(
    null
  );
  const [selectedTradeFriendId, setSelectedTradeFriendId] = useState<
    string | null
  >(null);

  const openTradeModal = (background: StoreBackground) => {
    setSelectedTradeFriendId(null);
    setTradeBackground(background);
  };

  const closeTradeModal = () => {
    setTradeBackground(null);
    setSelectedTradeFriendId(null);
  };

  const selectedCollection = selectedCollectionId
    ? getStoreCollection(selectedCollectionId)
    : null;

  const activeBackgroundImage = useMemo(
    () => getStoreBackgroundImage(previewBackgroundId ?? equippedBackgroundId),
    [previewBackgroundId, equippedBackgroundId]
  );

  const handleStoreTabChange = (tab: StoreScreenTab) => {
    setStoreScreenTab(tab);
    setSelectedCollectionId(null);
    setSelectedShopItem(null);
  };

  const handleStoreShopTabChange = (tab: StoreShopTab) => {
    setStoreShopTab(tab);
    setSelectedCollectionId(null);
    setSelectedShopItem(null);
  };

  const handleStoreAvatarCategoryChange = (category: AvatarEditCategory) => {
    setStoreAvatarCategory(category);
    const firstSubCategory =
      AVATAR_EDIT_SUBCATEGORIES[category].find((sub) => sub.id !== 'skin') ??
      AVATAR_EDIT_SUBCATEGORIES[category][0];
    setStoreAvatarSubCategory(firstSubCategory.id);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {introOpen && <StoreIntroModal onClose={() => setIntroOpen(false)} />}
      {spinOpen && (
        <DailySpinModal
          xp={xp}
          lastDailySpinAt={lastDailySpinAt}
          extraSpinCount={extraSpinCount}
          ownedBackgroundIds={ownedBackgroundIds}
          isSignedIn={isSignedIn}
          onRequireSignIn={onRequireSignIn}
          onClose={() => setSpinOpen(false)}
          onPaidSpinCharge={onPaidSpinCharge}
          onSpinComplete={onSpinComplete}
        />
      )}
      {tradeBackground && (
        <TradeRequestModal
          background={tradeBackground}
          selectedFriendId={selectedTradeFriendId}
          onSelectFriend={setSelectedTradeFriendId}
          onSend={closeTradeModal}
          onClose={closeTradeModal}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[100] flex items-start justify-between px-4 pb-3 pt-10">
        <div className="pointer-events-auto flex items-end gap-3">
          <UnderlineTabBar
            tabs={[
              { id: 'store', label: 'Store' },
              { id: 'owned', label: 'Owned' },
            ]}
            active={storeScreenTab}
            onChange={handleStoreTabChange}
          />
          {!selectedCollection && !selectedShopItem && (
            <SpinWidgetButton
              onClick={() => {
                if (!isSignedIn) {
                  onRequireSignIn();
                  return;
                }
                setSpinOpen(true);
              }}
            />
          )}
        </div>
        <div className="pointer-events-auto flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
          <XPPill ref={xpPillRef} amount={xp} />
        </div>
      </div>

      <div
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[88px] pt-[100px] ${styles.homeScroll}`}
      >
        {storeScreenTab === 'owned' ? (
          <OwnedView
            ownedBackgroundIds={ownedBackgroundIds}
            equippedBackgroundId={equippedBackgroundId}
            ownedAvatarItemIds={ownedAvatarItemIds}
            equippedAvatarSlots={equippedAvatarSlots}
            avatarItemColors={avatarItemColors}
            previewBackgroundImage={activeBackgroundImage}
            isSignedIn={isSignedIn}
            onRequireSignIn={onRequireSignIn}
            onPurchaseBackground={onPurchaseBackground}
            onTrade={openTradeModal}
            onEquipBackground={onEquipBackground}
            onUnequipBackground={onUnequipBackground}
            onEquipAvatarItem={onEquipAvatarItem}
          />
        ) : selectedCollection ? (
          <CollectionDetailView
            collection={selectedCollection}
            xp={xp}
            ownedBackgroundIds={ownedBackgroundIds}
            equippedBackgroundId={equippedBackgroundId}
            previewBackgroundId={previewBackgroundId}
            isSignedIn={isSignedIn}
            onBack={() => setSelectedCollectionId(null)}
            onRequireSignIn={onRequireSignIn}
            onPurchaseBackground={onPurchaseBackground}
            onPurchasePack={onPurchasePack}
            onPreviewBackground={onPreviewBackground}
            onTrade={openTradeModal}
            onEquipBackground={onEquipBackground}
            onUnequipBackground={onUnequipBackground}
          />
        ) : (
          <>
            <StoreCategoryTabBar
              active={storeShopTab}
              onChange={handleStoreShopTabChange}
            />

            {storeShopTab === 'avatar' && (
              <AvatarStorePanel
                activeCategory={storeAvatarCategory}
                activeSubCategory={storeAvatarSubCategory}
                ownedAvatarItemIds={ownedAvatarItemIds}
                avatarItemColors={avatarItemColors}
                previewBackgroundImage={activeBackgroundImage}
                onCategoryChange={handleStoreAvatarCategoryChange}
                onSubCategoryChange={setStoreAvatarSubCategory}
                onSelectItem={setSelectedShopItem}
              />
            )}

            {storeShopTab === 'backgrounds' && (
              <section>
                <div className="flex flex-col gap-3">
                  {getOrderedStoreCollections().map((collection) => {
                    const ownedCount = collection.backgrounds.filter((background) =>
                      ownedBackgroundIds.includes(background.id)
                    ).length;

                    return (
                      <CollectionThemeCard
                        key={collection.id}
                        collection={collection}
                        ownedCount={ownedCount}
                        onOpen={() => setSelectedCollectionId(collection.id)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {storeShopTab === 'glitter' && (
              <p
                className="py-10 text-center text-[12px] text-white"
                style={{ opacity: 0.35 }}
              >
                Glitter coming soon
              </p>
            )}
          </>
        )}
      </div>

      {selectedShopItem && (
        <AvatarShopItemDetail
          item={selectedShopItem}
          isOwned={ownedAvatarItemIds.includes(selectedShopItem.id)}
          isEquipped={
            selectedShopItem.slot != null &&
            equippedAvatarSlots[selectedShopItem.slot] === selectedShopItem.id
          }
          canAfford={xp >= selectedShopItem.price}
          isSignedIn={isSignedIn}
          backgroundImage={activeBackgroundImage}
          itemColors={avatarItemColors}
          onClose={() => setSelectedShopItem(null)}
          onRequireSignIn={onRequireSignIn}
          onPurchase={() => onPurchaseAvatarItem(selectedShopItem.id, selectedShopItem.price)}
          onEquip={() => onEquipAvatarItem(selectedShopItem)}
        />
      )}
    </div>
  );
}

function TikTokTopBar<T extends string>({
  tabs,
  active,
  onChange,
  leftSlot,
  afterTabs,
  rightSlot,
  className = '',
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  leftSlot?: React.ReactNode;
  afterTabs?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 pb-3 pt-10 ${className}`}
    >
      <div className="flex shrink-0 items-center justify-start">
        {leftSlot}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-4">
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative flex min-h-[44px] cursor-pointer items-center border-none bg-transparent px-2 text-[15px] leading-none text-white transition-opacity duration-200 ${styles.tabUnderlineCenter} ${isActive ? styles.tabUnderlineCenterActive : ''}`}
              style={{
                opacity: isActive ? 1 : 0.45,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tab.label}
            </button>
          );
        })}
        {afterTabs}
      </div>
      <div className="flex w-[44px] shrink-0 items-center justify-end">
        {rightSlot}
      </div>
    </div>
  );
}

function UnderlineTabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex items-end gap-6">
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative cursor-pointer border-none bg-transparent pb-1 text-[18px] font-medium tracking-[0.5px] text-white transition-opacity duration-200 ${styles.tabUnderlineFull} ${isActive ? styles.tabUnderlineFullActive : ''}`}
            style={{ opacity: isActive ? 1 : 0.45 }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

const PRODUCT_INTERESTS = [
  'Electronics',
  'Fashion',
  'Beauty',
  'Sneakers',
  'Handbags',
  'Skincare',
  'Jewelry',
  'Home',
  'Tech',
  'Fitness',
  'Luxury',
  'Watches',
  'Travel',
  'Sports',
  'Gaming',
  'Shoes',
  'Accessories',
  'Fragrance',
  'Streetwear',
  'Designer',
  'Sunglasses',
  'Makeup',
  'Haircare',
  'Wellness',
  'Laptops',
  'Tablets',
  'Audio',
  'Cameras',
  'Smart Home',
  'Kitchen',
  'Furniture',
  'Decor',
  'Outdoor',
  'Camping',
  'Yoga',
  'Running',
  'Swimwear',
  'Denim',
  'Boots',
  'Vintage',
  'Collectibles',
  'Skincare Tools',
  'Phone Cases',
  'Bags',
  'Coats',
  'Dresses',
  'Golf',
  'Tennis',
  'Skateboards',
  'Art & Prints',
] as const;

type FeedPostData = {
  id: string;
  image: string;
  alt: string;
  handle: string;
  caption: string;
  likes: string;
  comments: string;
  wishlists: string;
  shares: string;
};

const FEED_POSTS: FeedPostData[] = [
  {
    id: 'headphones',
    image: '/headphone.png',
    alt: 'Headphones',
    handle: '@audiophile',
    caption:
      'these are the ones… saving up every week until they’re mine ✦ #audio #wishlist',
    likes: '1.4K',
    comments: '62',
    wishlists: '410',
    shares: '29',
  },
  {
    id: 'green-sambas',
    image: '/GreenSambas.png',
    alt: 'Green Sambas',
    handle: '@alexkicks',
    caption:
      'these green sambas >>> every outfit this summer ✦ #sneakers #adidas',
    likes: '3.2K',
    comments: '156',
    wishlists: '967',
    shares: '72',
  },
  {
    id: 'ps5',
    image: '/Ps5.png',
    alt: 'PlayStation 5',
    handle: '@devsaves',
    caption:
      'saving $40/wk for the ps5 — almost there for game night ✦ #gaming #wishlist',
    likes: '2.8K',
    comments: '118',
    wishlists: '640',
    shares: '44',
  },
  {
    id: 'lowea-perfume',
    image: '/LoweaPerfume.png',
    alt: 'Loewe Perfume',
    handle: '@khushi',
    caption:
      'this loewe scent is everything… saving $45/week until it’s mine ✦ #beauty #wishlist',
    likes: '2.4K',
    comments: '148',
    wishlists: '892',
    shares: '56',
  },
  {
    id: 'bottega-bag',
    image: '/BotegaBag.png',
    alt: 'Bottega Veneta Bag',
    handle: '@chloewishlist',
    caption:
      'dream bag unlocked in my head… $120/week and she’s mine by fall ✦ #luxury #fashion',
    likes: '8.1K',
    comments: '412',
    wishlists: '3.2K',
    shares: '189',
  },
  {
    id: 'macbook',
    image: '/macBook.png',
    alt: 'MacBook Pro',
    handle: '@devsaves',
    caption:
      '14" pro for senior year edits — halfway there already ✦ #tech #goals',
    likes: '5.6K',
    comments: '267',
    wishlists: '1.8K',
    shares: '94',
  },
  {
    id: 'dyson',
    image: '/dyson.png',
    alt: 'Dyson Airwrap',
    handle: '@zoebeauty',
    caption:
      'birthday treat to myself if i stay on track… 3 months to go ✦ #beauty #dyson',
    likes: '12.4K',
    comments: '891',
    wishlists: '4.1K',
    shares: '302',
  },
  {
    id: 'ipad-pro',
    image: '/IpadPro.png',
    alt: 'iPad Pro',
    handle: '@noahcreates',
    caption:
      'replacing my old ipad for digital planning + notes ✦ #apple #productivity',
    likes: '1.9K',
    comments: '88',
    wishlists: '540',
    shares: '41',
  },
  {
    id: 'lulu-leggings',
    image: '/LuLuLeggings.png',
    alt: 'Lulu Leggings',
    handle: '@emmafit',
    caption:
      'align leggings restock wait is over — adding to my activewear fund ✦ #fitness',
    likes: '4.7K',
    comments: '203',
    wishlists: '1.2K',
    shares: '118',
  },
  {
    id: 'airpod-max',
    image: '/AirpodMax.png',
    alt: 'AirPods Max',
    handle: '@sophiaaudio',
    caption:
      'midnight colorway is calling my name… commute upgrade loading ✦ #audio',
    likes: '6.3K',
    comments: '334',
    wishlists: '2.1K',
    shares: '145',
  },
  {
    id: 'airpod-pro',
    image: '/AirpodProMax.png',
    alt: 'AirPods Pro',
    handle: '@maya.studies',
    caption:
      'library sessions need noise canceling — $15/week goal started ✦ #study',
    likes: '2.1K',
    comments: '97',
    wishlists: '623',
    shares: '38',
  },
  {
    id: 'centella',
    image: '/CentellaSkinCare.png',
    alt: 'Centella Skincare',
    handle: '@jadeskin',
    caption:
      'glass skin routine upgrade — restocking my shelf slowly ✦ #skincare #kbeauty',
    likes: '3.8K',
    comments: '174',
    wishlists: '890',
    shares: '67',
  },
  {
    id: 'nike',
    image: '/Nike.png',
    alt: 'Nike Sneakers',
    handle: '@alexkicks',
    caption:
      'need these for rotation… $25/wk until they’re in the collection ✦ #nike #sneakers',
    likes: '4.1K',
    comments: '192',
    wishlists: '1.1K',
    shares: '81',
  },
  {
    id: 'aura-serum',
    image: '/AuraSerum.png',
    alt: 'Aura Serum',
    handle: '@jadeskin',
    caption:
      'glow routine essential — stacking $20/week for this serum ✦ #skincare #beauty',
    likes: '3.5K',
    comments: '164',
    wishlists: '978',
    shares: '59',
  },
];

type FeedComment = {
  handle: string;
  text: string;
  time: string;
  progress: string;
  likes?: number;
};

const FEED_COMMENTS: Record<string, FeedComment[]> = {
  headphones: [
    {
      handle: '@sophiaaudio',
      text: 'Week 11 — $287 of $449 saved. commuting with broken earbuds is pain 😭',
      time: '2h',
      progress: '64%',
    },
    {
      handle: '@maya.studies',
      text: 'just dropped another $40!! only $112 left on these 🎧',
      time: '5h',
      progress: '75%',
    },
    {
      handle: '@noahcreates',
      text: 'pasted my tracker: $180/$449 · auto-save $25/wk · on track for july',
      time: '8h',
      progress: '40%',
    },
    {
      handle: '@alexkicks',
      text: 'same ones!! $331 saved so far, price alert helped me stack an extra $60',
      time: '1d',
      progress: '74%',
    },
  ],
  'ps5': [
    {
      handle: '@alexkicks',
      text: '$320/$499 ps5 fund — week 8, pasted my deposit tracker 🎮',
      time: '1h',
      progress: '64%',
    },
    {
      handle: '@noahcreates',
      text: 'same console!! $410/$499 so close i can taste it',
      time: '3h',
      progress: '82%',
    },
    {
      handle: '@maya.studies',
      text: '$180/$499 started $35/wk after finals',
      time: '6h',
      progress: '36%',
    },
    {
      handle: '@audiophile',
      text: 'GOAL HIT $499/$499 — picking up this weekend!!',
      time: '12h',
      progress: '100%',
    },
  ],
  'lowea-perfume': [
    {
      handle: '@jadeskin',
      text: '$198/$320 on this scent — 12 weeks of $25 deposits ✨',
      time: '1h',
      progress: '62%',
    },
    {
      handle: '@zoebeauty',
      text: 'FINALLY hit 80% today. one more month of saving and she’s mine',
      time: '3h',
      progress: '80%',
    },
    {
      handle: '@emmafit',
      text: 'pasting progress: $145 saved · goal $320 · started march',
      time: '6h',
      progress: '45%',
    },
    {
      handle: '@chloewishlist',
      text: 'we’re on the same bottle lol — $256/$320, so close',
      time: '12h',
      progress: '80%',
    },
  ],
  'bottega-bag': [
    {
      handle: '@khushi',
      text: '$2,840/$4,200 saved. $120/wk is aggressive but i’m committed',
      time: '45m',
      progress: '68%',
    },
    {
      handle: '@lilyglow',
      text: 'month 4 update: $1,920 saved. pasted my wnted goal screenshot below lol',
      time: '2h',
      progress: '46%',
    },
    {
      handle: '@devsaves',
      text: 'same bag!! just crossed 50% — $2,100/$4,200',
      time: '4h',
      progress: '50%',
    },
    {
      handle: '@sophiaaudio',
      text: 'slow and steady: $680 so far, $85/wk auto-deposit',
      time: '1d',
      progress: '16%',
    },
  ],
  macbook: [
    {
      handle: '@noahcreates',
      text: '$1,374/$2,000 — literally halfway. senior year edits need this',
      time: '30m',
      progress: '69%',
    },
    {
      handle: '@maya.studies',
      text: 'pasted: $890/$2,000 · 14" pro · 11 weeks in',
      time: '2h',
      progress: '45%',
    },
    {
      handle: '@audiophile',
      text: 'same config! $1,620 saved, price dropped $150 so goal updated 🙌',
      time: '5h',
      progress: '81%',
    },
    {
      handle: '@alexkicks',
      text: '$440/$2,000 week 6. painful but worth it for final cut',
      time: '9h',
      progress: '22%',
    },
  ],
  dyson: [
    {
      handle: '@jadeskin',
      text: '$389/$599 — birthday fund at 65%, 8 weeks to go',
      time: '1h',
      progress: '65%',
    },
    {
      handle: '@emmafit',
      text: 'same airwrap!! $512 saved, pasted my weekly $45 deposit streak',
      time: '3h',
      progress: '85%',
    },
    {
      handle: '@zoebeauty',
      text: 'just hit $200/$599. slow month but back on track tomorrow',
      time: '7h',
      progress: '33%',
    },
    {
      handle: '@lilyglow',
      text: '$599 GOAL MET ✅ took 5 months of $30/wk',
      time: '1d',
      progress: '100%',
    },
  ],
  'green-sambas': [
    {
      handle: '@alexkicks',
      text: '$84/$130 — week 3. these green sambas are worth every dollar',
      time: '20m',
      progress: '65%',
    },
    {
      handle: '@chloewishlist',
      text: 'pasted tracker: $52/$130 · size 8.5 · restock alert saved me $15',
      time: '4h',
      progress: '40%',
    },
    {
      handle: '@devsaves',
      text: 'same pair!! $118/$130 literally buying next friday 🟢',
      time: '6h',
      progress: '91%',
    },
  ],
  'ipad-pro': [
    {
      handle: '@noahcreates',
      text: '$540/$899 for the ipad pro — digital planning fund update',
      time: '2h',
      progress: '60%',
    },
    {
      handle: '@maya.studies',
      text: '$312/$899 week 8. pasted my notes app savings log lol',
      time: '5h',
      progress: '35%',
    },
    {
      handle: '@sophiaaudio',
      text: 'same one for procreate! $710/$899 so close i can taste it',
      time: '11h',
      progress: '79%',
    },
  ],
  'lulu-leggings': [
    {
      handle: '@emmafit',
      text: '$98/$128 align leggings — activewear fund week 5 💪',
      time: '1h',
      progress: '77%',
    },
    {
      handle: '@jadeskin',
      text: 'same leggings!! $64/$128, $16/wk auto-save',
      time: '3h',
      progress: '50%',
    },
    {
      handle: '@zoebeauty',
      text: 'GOAL HIT $128/$128 — ordering tonight!!',
      time: '8h',
      progress: '100%',
    },
  ],
  'airpod-max': [
    {
      handle: '@sophiaaudio',
      text: '$412/$549 midnight max — commute upgrade 75% funded',
      time: '40m',
      progress: '75%',
    },
    {
      handle: '@audiophile',
      text: 'same colorway! pasted: $289/$549 · $35/wk',
      time: '2h',
      progress: '53%',
    },
    {
      handle: '@maya.studies',
      text: '$501/$549!!! one more deposit and i’m done',
      time: '6h',
      progress: '91%',
    },
  ],
  'airpod-pro': [
    {
      handle: '@maya.studies',
      text: '$168/$249 — library sessions need anc. week 7 update',
      time: '1h',
      progress: '67%',
    },
    {
      handle: '@noahcreates',
      text: 'same pros! $225/$249 pasted my deposit history',
      time: '4h',
      progress: '90%',
    },
    {
      handle: '@devsaves',
      text: '$90/$249 started $15/wk goal last month',
      time: '9h',
      progress: '36%',
    },
  ],
  centella: [
    {
      handle: '@jadeskin',
      text: '$44/$68 centella set — glass skin fund week 4 ✨',
      time: '2h',
      progress: '65%',
    },
    {
      handle: '@lilyglow',
      text: 'same routine restock! $58/$68 almost there',
      time: '5h',
      progress: '85%',
    },
    {
      handle: '@zoebeauty',
      text: 'pasted: $22/$68 · k-beauty shelf slowly filling up',
      time: '12h',
      progress: '32%',
    },
  ],
  nike: [
    {
      handle: '@emmafit',
      text: 'week 9 — $225/$300 saved for these. rotation needs an upgrade 👟',
      time: '2h',
      progress: '75%',
    },
    {
      handle: '@sophiaaudio',
      text: 'same colorway!! pasted tracker: $140/$300 · $30/wk',
      time: '6h',
      progress: '47%',
    },
    {
      handle: '@noahcreates',
      text: 'just added $50 — $190/$300. almost there',
      time: '1d',
      progress: '63%',
    },
  ],
  'aura-serum': [
    {
      handle: '@khushi',
      text: '$48/$95 saved — glass skin fund is moving ✨',
      time: '3h',
      progress: '51%',
    },
    {
      handle: '@zoebeauty',
      text: 'week 4 update: $36/$95. auto-save $12/wk on this one',
      time: '7h',
      progress: '38%',
    },
    {
      handle: '@maya.studies',
      text: 'pasted my goal: $72/$95 · restock in two weeks hopefully',
      time: '1d',
      progress: '76%',
    },
  ],
};

const DEFAULT_FEED_COMMENTS: FeedComment[] = [
  {
    handle: '@khushi',
    text: '$240/$500 saved so far — auto-deposit every friday',
    time: '1h',
    progress: '48%',
  },
  {
    handle: '@chloewishlist',
    text: 'same product!! pasted my wnted goal: 62% funded',
    time: '3h',
    progress: '62%',
  },
  {
    handle: '@devsaves',
    text: 'week 6 update: $180/$500. staying consistent this time',
    time: '6h',
    progress: '36%',
  },
];

function ClickableUsername({
  handle,
  className = '',
  style,
  onOpenProfile,
}: {
  handle: string;
  className?: string;
  style?: React.CSSProperties;
  onOpenProfile: (handle: string) => void;
}) {
  const normalized = handle.startsWith('@') ? handle : `@${handle}`;

  if (normalized === '@you') {
    return (
      <span className={className} style={style}>
        {handle}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onOpenProfile(normalized);
      }}
      className={`cursor-pointer border-none bg-transparent p-0 text-left font-inherit ${className}`}
      style={style}
    >
      {handle}
    </button>
  );
}

function FeedCommentRow({
  comment,
  defaultLikes,
  onOpenProfile,
}: {
  comment: FeedComment;
  defaultLikes: number;
  onOpenProfile: (handle: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes ?? defaultLikes);

  const toggleLike = () => {
    setLiked((value) => !value);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
  };

  return (
    <div
      className="rounded-2xl px-3.5 py-3"
      style={{
        background: 'rgba(250,247,239,0.06)',
        border: '1px solid rgba(250,247,239,0.1)',
      }}
    >
      <div className="mb-1.5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <ClickableUsername
            handle={comment.handle}
            onOpenProfile={onOpenProfile}
            className="text-[13px] font-semibold text-white"
          />
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{
              background: 'rgba(138, 151, 168, 0.35)',
            }}
          >
            {comment.progress}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleLike}
          className="flex shrink-0 cursor-pointer flex-col items-center gap-0.5 border-none bg-transparent p-0"
          aria-label={liked ? 'Unlike comment' : 'Like comment'}
        >
          <Heart
            size={18}
            className={liked ? 'fill-white text-white' : 'text-white'}
            strokeWidth={2}
            style={{ opacity: liked ? 1 : 0.55 }}
          />
          <span
            className="text-[12px] font-medium text-white"
            style={{ opacity: liked ? 1 : 0.55 }}
          >
            {likeCount}
          </span>
        </button>
      </div>
      <p className="text-[13px] leading-[1.45] text-white">{comment.text}</p>
      <p className="mt-2 text-[11px] text-white" style={{ opacity: 0.4 }}>
        {comment.time} ago
      </p>
    </div>
  );
}

const COMMENT_EMOJIS = ['😭', '💀', '💔', '👏', '😔', '🤣', '😲', '😂'];

function FeedCommentComposer({
  productName,
  wishlisted,
  onPost,
}: {
  productName: string;
  wishlisted: boolean;
  onPost: (text: string) => void;
}) {
  const [commentText, setCommentText] = useState('');

  const fieldStyle: React.CSSProperties = {
    background: 'rgba(250,247,239,0.06)',
    border: '1px solid rgba(250,247,239,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  };

  const canPost = wishlisted && commentText.length >= 1;

  const handlePost = () => {
    if (!canPost) return;
    onPost(commentText);
    setCommentText('');
  };

  return (
    <div
      className="shrink-0 px-4 pb-5 pt-3"
      style={{ borderTop: '1px solid rgba(250,247,239,0.08)' }}
    >
      {!wishlisted && (
        <p
          className="mb-3 text-center text-[12px] leading-[1.45] text-white"
          style={{ opacity: 0.45 }}
        >
          Add this item to your wishlist to comment on your savings progress
        </p>
      )}

      {wishlisted && (
        <div className="mb-3 flex items-center justify-between gap-1">
          {COMMENT_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setCommentText((value) => value + emoji)}
              className="cursor-pointer border-none bg-transparent p-0 text-[22px] leading-none"
              aria-label={`Add ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={fieldStyle}
        >
          <User size={15} className="text-white" style={{ opacity: 0.55 }} />
        </div>

        <div
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-2"
          style={{
            ...fieldStyle,
            opacity: wishlisted ? 1 : 0.55,
          }}
        >
          <input
            type="text"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && canPost) {
                event.preventDefault();
                handlePost();
              }
            }}
            disabled={!wishlisted}
            placeholder={
              wishlisted
                ? `What do you think of ${productName}?`
                : 'Add to wishlist to comment'
            }
            className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-white outline-none placeholder:text-white/35 disabled:cursor-not-allowed"
          />
          {wishlisted && (
            <>
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-0"
                aria-label="Add photo"
              >
                <ImageIcon
                  size={18}
                  className="text-white"
                  style={{ opacity: 0.45 }}
                  strokeWidth={2}
                />
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-[4px] border px-1 py-0.5 text-[9px] font-semibold tracking-[0.5px] text-white"
                style={{
                  borderColor: 'rgba(250,247,239,0.22)',
                  opacity: 0.45,
                }}
                aria-label="Add GIF"
              >
                GIF
              </button>
            </>
          )}
        </div>

        {canPost ? (
          <button
            type="button"
            onClick={handlePost}
            className="shrink-0 cursor-pointer border-none bg-transparent p-0 text-[14px] font-semibold text-white"
          >
            Post
          </button>
        ) : (
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent p-0"
            aria-label="Send gift"
            disabled={!wishlisted}
            style={{ opacity: wishlisted ? 0.55 : 0.25 }}
          >
            <Gift size={22} className="text-white" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}

const BOTTOM_NAV_HEIGHT = 72;

function FeedCommentsSheet({
  open,
  onClose,
  productName,
  comments,
  wishlisted,
  onOpenProfile,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
  comments: FeedComment[];
  wishlisted: boolean;
  onOpenProfile: (handle: string) => void;
}) {
  const [composerKey, setComposerKey] = useState(0);
  const [userComments, setUserComments] = useState<FeedComment[]>([]);

  useEffect(() => {
    if (!open) {
      setComposerKey((key) => key + 1);
      setUserComments([]);
    }
  }, [open]);

  const handlePost = (text: string) => {
    setUserComments((current) => [
      {
        handle: '@you',
        text: text.trim(),
        time: 'now',
        progress: '0%',
      },
      ...current,
    ]);
  };

  const allComments = [...userComments, ...comments];

  return (
    <>
      {open && (
        <button
          type="button"
          className="absolute inset-0 z-[100] cursor-default border-none p-0"
          style={{
            background: 'rgba(0,0,0,0.32)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
          onClick={onClose}
          aria-label="Close comments"
        />
      )}

        <div
          className="absolute left-0 right-0 z-[100] flex h-[58%] max-h-[58%] flex-col overflow-hidden font-clash text-white transition-transform duration-300 ease-out"
        style={{
          bottom: BOTTOM_NAV_HEIGHT,
          background: 'rgba(250,247,239,0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(250,247,239,0.14)',
          borderRadius: '24px 24px 0 0',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          pointerEvents: open ? 'auto' : 'none',
        }}
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 flex-col items-center px-4 pb-3 pt-3">
          <div
            className="mb-3 rounded-full"
            style={{
              width: '36px',
              height: '4px',
              background: 'rgba(250,247,239,0.22)',
            }}
          />
          <div className="flex w-full items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold text-white">Comments</p>
              <p
                className="mt-0.5 text-[12px] text-white"
                style={{ opacity: 0.5 }}
              >
                Saving progress on {productName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border-none bg-transparent p-1 text-[13px] font-medium text-white"
              style={{ opacity: 0.55 }}
            >
              Close
            </button>
          </div>
        </div>

        <div
          className="commentsScroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-4"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          onWheel={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-3">
            {allComments.map((comment, index) => (
              <FeedCommentRow
                key={`${comment.handle}-${comment.time}-${index}`}
                comment={comment}
                defaultLikes={[24, 18, 31, 12, 9][index % 5]}
                onOpenProfile={onOpenProfile}
              />
            ))}
          </div>
        </div>

        <FeedCommentComposer
          key={composerKey}
          productName={productName}
          wishlisted={wishlisted}
          onPost={handlePost}
        />
      </div>
    </>
  );
}

type AddPostStep = 'camera' | 'microphone' | 'create' | 'details';
type CreatePostTab = 'image' | 'link';

type WishlistItemOption = WishlistItem;

const IOS_ALERT_STYLE: React.CSSProperties = {
  borderRadius: '14px',
  background: 'rgba(44, 44, 46, 0.94)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
};

const IOS_ALERT_DIVIDER = 'rgba(84, 84, 88, 0.65)';

function IOSPermissionAlert({
  title,
  message,
  onAllow,
  onDeny,
}: {
  title: string;
  message: string;
  onAllow: () => void;
  onDeny: () => void;
}) {
  return (
    <div className="w-[270px] overflow-hidden text-center" style={IOS_ALERT_STYLE}>
      <div className="px-4 pt-5 pb-4">
        <p className="text-[17px] font-semibold leading-[1.3] text-white">
          {title}
        </p>
        <p
          className="mt-2 text-[13px] font-normal leading-[1.45] text-white"
          style={{ opacity: 0.85 }}
        >
          {message}
        </p>
      </div>

      <div className="flex border-t" style={{ borderColor: IOS_ALERT_DIVIDER }}>
        <button
          type="button"
          onClick={onDeny}
          className="flex-1 cursor-pointer border-none bg-transparent py-[11px] text-[17px] font-normal"
          style={{ color: '#0A84FF' }}
        >
          Don&apos;t Allow
        </button>
        <div className="w-px" style={{ background: IOS_ALERT_DIVIDER }} />
        <button
          type="button"
          onClick={onAllow}
          className="flex-1 cursor-pointer border-none bg-transparent py-[11px] text-[17px] font-normal"
          style={{ color: '#0A84FF' }}
        >
          Allow
        </button>
      </div>
    </div>
  );
}

function AddPostOverlay({
  onClose,
  wishlistItems,
}: {
  onClose: () => void;
  wishlistItems: WishlistItem[];
}) {
  const [step, setStep] = useState<AddPostStep>('camera');
  const [createTab, setCreateTab] = useState<CreatePostTab>('image');
  const [linkValue, setLinkValue] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedWishlistItem, setSelectedWishlistItem] =
    useState<WishlistItemOption | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (uploadPreview) {
        URL.revokeObjectURL(uploadPreview);
      }
    };
  }, [uploadPreview]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
    }

    setUploadPreview(URL.createObjectURL(file));
  };

  const canPostDetails =
    caption.trim().length > 0 && selectedWishlistItem !== null;

  if (step === 'camera') {
    return (
      <div
        className="absolute inset-0 z-30 flex items-center justify-center px-6 font-clash"
        style={{ background: INK }}
      >
        <IOSPermissionAlert
          title={`"Wnted" Would Like to Access the Camera`}
          message="This lets you capture photos and videos, and apply effects."
          onAllow={() => setStep('microphone')}
          onDeny={() => setStep('microphone')}
        />
      </div>
    );
  }

  if (step === 'microphone') {
    return (
      <div
        className="absolute inset-0 z-30 flex items-center justify-center px-6 font-clash"
        style={{ background: INK }}
      >
        <IOSPermissionAlert
          title={`"Wnted" Would Like to Access the Microphone`}
          message="To record audio, allow us to access your Microphone."
          onAllow={() => setStep('create')}
          onDeny={() => setStep('create')}
        />
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div
        className="absolute inset-0 z-30 flex flex-col font-clash text-white"
        style={{ background: INK }}
      >
        <div className="flex items-center justify-between px-4 pt-10 pb-3">
          <button
            type="button"
            onClick={() => setStep('create')}
            className="flex h-10 w-10 cursor-pointer items-center justify-center border-none bg-transparent p-0"
            aria-label="Back"
          >
            <ChevronLeft size={22} className="text-white" strokeWidth={2} />
          </button>
          <p className="text-[16px] font-medium text-white">New Post</p>
          <button
            type="button"
            onClick={onClose}
            disabled={!canPostDetails}
            className="cursor-pointer border-none bg-transparent px-1 py-2 text-[15px] font-semibold disabled:cursor-not-allowed"
            style={{
              color: '#FAF7EF',
              opacity: canPostDetails ? 1 : 0.35,
            }}
          >
            Post
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8">
          {uploadPreview && (
            <div
              className="relative mb-4 h-[140px] w-[105px] shrink-0 overflow-hidden rounded-xl"
              style={{
                background: 'rgba(250,247,239,0.06)',
                border: '1px solid rgba(250,247,239,0.1)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadPreview}
                alt="Post preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <label className="mb-2 block text-[12px] font-medium uppercase tracking-[1px] text-white" style={{ opacity: 0.45 }}>
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Write a caption..."
            rows={4}
            className="mb-5 w-full resize-none rounded-xl border-none px-4 py-3 text-[14px] leading-relaxed text-white outline-none placeholder:text-[rgba(250,247,239,0.35)]"
            style={{
              background: 'rgba(250,247,239,0.06)',
              border: '1px solid rgba(250,247,239,0.12)',
            }}
          />

          <label className="mb-3 block text-[12px] font-medium uppercase tracking-[1px] text-white" style={{ opacity: 0.45 }}>
            Wishlist Item
          </label>
          <p
            className="mb-3 text-[13px] text-white"
            style={{ opacity: 0.45 }}
          >
            Link this post to an item you&apos;re saving for
          </p>
          <div className="flex flex-col gap-2">
            {wishlistItems.map((item) => {
              const isSelected = selectedWishlistItem?.id === item.id;
              const percent = Math.round((item.funded / item.goal) * 100);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedWishlistItem(item)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200"
                  style={{
                    background: isSelected
                      ? 'rgba(138,151,168,0.18)'
                      : 'rgba(250,247,239,0.06)',
                    border: isSelected
                      ? '1px solid rgba(138,151,168,0.45)'
                      : '1px solid rgba(250,247,239,0.1)',
                  }}
                >
                  <div
                    className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[8px]"
                    style={{
                      background: 'rgba(250,247,239,0.08)',
                      border: '1px solid rgba(250,247,239,0.1)',
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-white">
                      {item.name}
                    </p>
                    <p
                      className="text-[11px] text-white"
                      style={{ opacity: 0.4 }}
                    >
                      {item.category} · {percent}% funded
                    </p>
                  </div>
                  {isSelected && (
                    <span
                      className="shrink-0 text-[11px] font-medium"
                      style={{ color: SLATE }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col font-clash text-white"
      style={{ background: INK }}
    >
      <div className="flex items-center justify-between px-4 pt-10 pb-4">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 cursor-pointer items-center justify-center border-none bg-transparent p-0"
          aria-label="Close"
        >
          <X size={22} className="text-white" strokeWidth={2} />
        </button>

        <div
          className="flex items-center rounded-full p-1"
          style={{
            background: 'rgba(250,247,239,0.08)',
            border: '1px solid rgba(250,247,239,0.12)',
          }}
        >
          {(
            [
              { id: 'image' as const, label: 'Upload Image' },
              { id: 'link' as const, label: 'Product Link' },
            ] as const
          ).map((tab) => {
            const isActive = createTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCreateTab(tab.id)}
                className="cursor-pointer rounded-full border-none px-4 py-2 text-[13px] font-medium text-white transition-all duration-200"
                style={{
                  background: isActive
                    ? 'rgba(250,247,239,0.14)'
                    : 'transparent',
                  opacity: isActive ? 1 : 0.55,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="h-10 w-10" aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-8">
        {createTab === 'image' ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-[320px] flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl p-6"
              style={{
                background: 'rgba(250,247,239,0.04)',
                border: '1px dashed rgba(250,247,239,0.18)',
              }}
            >
              {uploadPreview ? (
                <div className="relative h-full w-full min-h-[280px] overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadPreview}
                    alt="Selected upload"
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <>
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: 'rgba(250,247,239,0.08)' }}
                  >
                    <ImageIcon
                      size={28}
                      className="text-white"
                      style={{ opacity: 0.7 }}
                      strokeWidth={1.75}
                    />
                  </div>
                  <p className="text-[16px] font-medium text-white">
                    Tap to upload an image
                  </p>
                  <p
                    className="max-w-[240px] text-center text-[13px] text-white"
                    style={{ opacity: 0.45 }}
                  >
                    Share a photo of the product you want to save for
                  </p>
                </>
              )}
            </button>

            {uploadPreview && (
              <button
                type="button"
                onClick={() => setStep('details')}
                className="mt-4 w-full cursor-pointer rounded-xl border-none py-3.5 text-[15px] font-semibold text-[#26303B] transition-opacity hover:opacity-90"
                style={{ background: '#FAF7EF' }}
              >
                Next
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col gap-4 pt-2">
            <p
              className="text-[14px] text-white"
              style={{ opacity: 0.55 }}
            >
              Paste a link to the product you want to add
            </p>
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3.5"
              style={{
                background: 'rgba(250,247,239,0.06)',
                border: '1px solid rgba(250,247,239,0.12)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <Link2
                size={18}
                className="shrink-0 text-white"
                style={{ opacity: 0.35 }}
                strokeWidth={1.75}
              />
              <input
                type="url"
                value={linkValue}
                onChange={(event) => setLinkValue(event.target.value)}
                placeholder="https://..."
                className="flex-1 border-none bg-transparent text-[14px] text-white outline-none placeholder:text-[rgba(250,247,239,0.35)]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedActionButton({
  icon,
  count,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  count: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative z-20 flex cursor-pointer flex-col items-center gap-1 border-none bg-transparent p-0"
      aria-label={label}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          background: 'rgba(0,0,0,0.22)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        {icon}
      </div>
      <span className="text-[11px] font-medium text-white">{count}</span>
    </button>
  );
}

function SignInModal({
  open,
  onClose,
  onSignIn,
}: {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
}) {
  if (!open) return null;

  const glassFieldStyle: React.CSSProperties = {
    background: 'rgba(250,247,239,0.06)',
    border: '1px solid rgba(250,247,239,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  };

  return (
    <>
      <button
        type="button"
        className="absolute inset-0 z-[120] cursor-default border-none p-0"
        style={{
          background: 'rgba(0,0,0,0.38)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        onClick={onClose}
        aria-label="Close sign in"
      />

      <div className="pointer-events-none absolute inset-0 z-[121] flex items-center justify-center px-5">
        <div
          className="pointer-events-auto w-full max-w-[320px] overflow-y-auto rounded-[20px] px-5 py-5 font-clash text-[#FAF7EF]"
          style={{
            maxHeight: '78%',
            background: 'rgba(250,247,239,0.08)',
            border: '1px solid rgba(250,247,239,0.14)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.28)',
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative pr-8">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-0 top-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0"
              aria-label="Close sign in"
            >
              <X
                size={20}
                className="text-[#FAF7EF]"
                style={{ opacity: 0.65 }}
                strokeWidth={2}
              />
            </button>

            <h2 className="text-[20px] font-medium text-[#FAF7EF]">
              Welcome to{' '}
              <span className="text-[rgba(250,247,239,0.65)]">Wnted</span>
            </h2>
            <p className="mt-1 text-[13px] font-normal text-[rgba(250,247,239,0.45)]">
              Sign in to like, comment, and save items to your wishlist
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3.5"
              style={glassFieldStyle}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FAF7EF"
                strokeWidth="1.5"
                opacity="0.35"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="email"
                placeholder="Email address"
                autoComplete="email"
                className="login-input flex-1 border-none bg-transparent text-[14px] text-[#FAF7EF] outline-none placeholder:text-[rgba(250,247,239,0.35)]"
              />
            </div>
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3.5"
              style={glassFieldStyle}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FAF7EF"
                strokeWidth="1.5"
                opacity="0.35"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                className="login-input flex-1 border-none bg-transparent text-[14px] text-[#FAF7EF] outline-none placeholder:text-[rgba(250,247,239,0.35)]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onSignIn}
            className="mt-5 w-full cursor-pointer rounded-xl border py-3.5 text-[15px] font-medium text-[#FAF7EF] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'rgba(62,78,96,0.55)',
              borderColor: 'rgba(250,247,239,0.18)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            Sign in
          </button>

          <p className="mt-4 text-center text-[12px] text-[rgba(250,247,239,0.35)]">
            Or connect using
          </p>

          <div className="mt-3 flex gap-3">
            <button
              type="button"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-[12px] font-medium text-[rgba(250,247,239,0.75)]"
              style={glassFieldStyle}
            >
              <span className="text-[14px] font-medium opacity-60">f</span>
              Facebook
            </button>
            <button
              type="button"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-[12px] font-medium text-[rgba(250,247,239,0.75)]"
              style={glassFieldStyle}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <path
                  d="M12 8v8M8 12h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
              Google
            </button>
          </div>

          <p className="mt-5 text-center text-[12px] text-[rgba(250,247,239,0.4)]">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-0 font-medium text-[rgba(250,247,239,0.75)]"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

function FeedPostCard({
  post,
  priority = false,
  isSignedIn,
  onRequireSignIn,
  onXpEarned,
  onOpenProfile,
}: {
  post: FeedPostData;
  priority?: boolean;
  isSignedIn: boolean;
  onRequireSignIn: () => void;
  onXpEarned?: (delta: number, animate?: boolean, applyOnComplete?: boolean) => void;
  onOpenProfile: (handle: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const comments = FEED_COMMENTS[post.id] ?? DEFAULT_FEED_COMMENTS;

  const guardAction = (action: () => void) => {
    if (!isSignedIn) {
      onRequireSignIn();
      return;
    }

    action();
  };

  const handleWishlist = () => {
    guardAction(() => {
      const adding = !wishlisted;
      onXpEarned?.(adding ? 5 : -5, adding);
      setWishlisted(adding);
    });
  };

  const handleLike = () => {
    guardAction(() => {
      const adding = !liked;
      onXpEarned?.(adding ? 1 : -1, adding, false);
      setLiked(adding);
    });
  };

  const handleComment = () => {
    guardAction(() => setCommentsOpen(true));
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={post.image}
        alt={post.alt}
        fill
        className="pointer-events-none object-cover"
        priority={priority}
        sizes="390px"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 18%, transparent 55%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* RIGHT — ACTION BUTTONS */}
      <div className="pointer-events-auto absolute right-3 bottom-[108px] z-20 flex flex-col items-center gap-5">
        <FeedActionButton
          label="Add to wishlist"
          count={post.wishlists}
          onClick={handleWishlist}
          icon={
            <Image
              src="/wishListIcon.png"
              alt=""
              width={26}
              height={26}
              className="object-contain"
              style={{
                filter: 'brightness(0) invert(1)',
                opacity: wishlisted ? 1 : 0.95,
              }}
            />
          }
        />
        <FeedActionButton
          label="Like"
          count={post.likes}
          onClick={handleLike}
          icon={
            <Heart
              size={26}
              className={liked ? 'fill-white text-white' : 'text-white'}
              strokeWidth={2}
            />
          }
        />
        <FeedActionButton
          label="Comment"
          count={post.comments}
          onClick={handleComment}
          icon={
            <MessageCircle size={26} className="text-white" strokeWidth={2} />
          }
        />
        <FeedActionButton
          label="Share"
          count={post.shares}
          icon={<Share2 size={24} className="text-white" strokeWidth={2} />}
        />
      </div>

      {/* BOTTOM — HANDLE + CAPTION */}
      <div className="absolute bottom-[96px] left-4 right-[72px] z-10">
        <ClickableUsername
          handle={post.handle}
          onOpenProfile={onOpenProfile}
          className="mb-1.5 block text-[15px] font-semibold text-white"
        />
        <p className="text-[13px] font-normal leading-[1.45] text-white">
          {post.caption}
        </p>
      </div>

      <FeedCommentsSheet
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        productName={post.alt}
        comments={comments}
        wishlisted={wishlisted}
        onOpenProfile={onOpenProfile}
      />
    </div>
  );
}

function FeedFeed({
  isSignedIn,
  onRequireSignIn,
  onXpEarned,
  onOpenProfile,
}: {
  isSignedIn: boolean;
  onRequireSignIn: () => void;
  onXpEarned: (delta: number, animate?: boolean, applyOnComplete?: boolean) => void;
  onOpenProfile: (handle: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideHeight, setSlideHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      setSlideHeight(container.clientHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(container);

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 1) return;

      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;

      const nextScroll = Math.max(
        0,
        Math.min(maxScroll, container.scrollTop + event.deltaY)
      );

      if (nextScroll === container.scrollTop) return;

      event.preventDefault();
      container.scrollTop = nextScroll;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      const slide = container.clientHeight;
      if (slide <= 0) return;

      const currentIndex = Math.round(container.scrollTop / slide);
      const nextIndex =
        event.key === 'ArrowDown'
          ? Math.min(FEED_POSTS.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);

      if (nextIndex === currentIndex) return;

      event.preventDefault();
      container.scrollTo({
        top: nextIndex * slide,
        behavior: 'smooth',
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      observer.disconnect();
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="feedScroll absolute inset-0 overflow-y-auto overscroll-y-contain"
      style={{
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}
    >
      {FEED_POSTS.map((post, index) => (
        <section
          key={post.id}
          className="relative w-full shrink-0 snap-start snap-always"
          style={{
            height: slideHeight > 0 ? slideHeight : '100%',
            minHeight: slideHeight > 0 ? slideHeight : '100%',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
        >
          <FeedPostCard
            post={post}
            priority={index === 0}
            isSignedIn={isSignedIn}
            onRequireSignIn={onRequireSignIn}
            onXpEarned={onXpEarned}
            onOpenProfile={onOpenProfile}
          />
        </section>
      ))}
    </div>
  );
}

function MainAppShell({ promptSignInOnMount = false }: { promptSignInOnMount?: boolean }) {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [homeOverlay, setHomeOverlay] = useState<HomeOverlay | null>(null);
  const [homeTab, setHomeTab] = useState<HomeTab>('forYou');
  const [rankTab, setRankTab] = useState<RankTab>('mostXP');
  const [xp, setXp] = useState(15000);
  const [ownedBackgroundIds, setOwnedBackgroundIds] = useState<string[]>([]);
  const [ownedAvatarItemIds, setOwnedAvatarItemIds] = useState<string[]>(
    DEFAULT_OWNED_AVATAR_ITEM_IDS
  );
  const [equippedAvatarSlots, setEquippedAvatarSlots] = useState(
    DEFAULT_EQUIPPED_AVATAR_SLOTS
  );
  const [avatarItemColors, setAvatarItemColors] = useState<Record<string, string>>(
    DEFAULT_AVATAR_ITEM_COLORS
  );
  const [equippedBackgroundId, setEquippedBackgroundId] = useState<string | null>(
    null
  );
  const [previewBackgroundId, setPreviewBackgroundId] = useState<string | null>(
    null
  );
  const [lastDailySpinAt, setLastDailySpinAt] = useState<number | null>(null);
  const [extraSpinCount, setExtraSpinCount] = useState(0);
  const [xpRewardActive, setXpRewardActive] = useState(false);
  const [xpRewardKey, setXpRewardKey] = useState(0);
  const [xpRewardAmount, setXpRewardAmount] = useState(5);
  const [rewardFlyKind, setRewardFlyKind] = useState<'xp' | 'cash'>('xp');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [wntsAfterSignIn, setWntsAfterSignIn] = useState(false);
  const [profileAfterSignIn, setProfileAfterSignIn] = useState(false);
  const [depositAfterSignIn, setDepositAfterSignIn] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [depositMenuOpen, setDepositMenuOpen] = useState(false);
  const [profileInboxOpen, setProfileInboxOpen] = useState(false);
  const [inboxUnreadCount, setInboxUnreadCount] = useState(6);
  const [viewingUserHandle, setViewingUserHandle] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState(INITIAL_WISHLIST_ITEMS);
  const [totalSaved, setTotalSaved] = useState(PROFILE_DATA.totalSaved);
  const homeShellRef = useRef<HTMLDivElement>(null);
  const appShellRef = useRef<HTMLDivElement>(null);
  const xpPillRef = useRef<HTMLDivElement>(null);
  const xpRewardAmountRef = useRef(5);
  const xpRewardApplyOnCompleteRef = useRef(true);
  const [xpFlyTarget, setXpFlyTarget] = useState<'pill' | 'topLeft'>('pill');

  useEffect(() => {
    if (promptSignInOnMount) {
      setSignInOpen(true);
    }
  }, [promptSignInOnMount]);

  const handleXpEarned = useCallback(
    (
      delta: number,
      animate = false,
      applyOnComplete = true,
      flyTarget: 'pill' | 'topLeft' = 'pill'
    ) => {
      if (delta > 0 && animate) {
        setRewardFlyKind('xp');
        setXpFlyTarget(flyTarget);
        xpRewardAmountRef.current = delta;
        xpRewardApplyOnCompleteRef.current = applyOnComplete;
        setXpRewardAmount(delta);
        setXpRewardKey((key) => key + 1);
        setXpRewardActive(true);

        if (!applyOnComplete) {
          setXp((amount) => amount + delta);
        }
        return;
      }

      setXp((amount) => Math.max(0, amount + delta));
    },
    []
  );

  const handleXpRewardComplete = useCallback(() => {
    if (xpRewardApplyOnCompleteRef.current) {
      setXp((amount) => amount + xpRewardAmountRef.current);
    }
    setXpRewardActive(false);
  }, []);

  const handleToggleWishlist = useCallback(
    (
      product: {
        id: number;
        name: string;
        category: string;
        price: number;
        image?: string;
      },
      flyTarget: 'pill' | 'topLeft' = 'pill'
    ) => {
      const isWishlisted = wishlistItems.some((item) => item.id === product.id);

      if (isWishlisted) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.id !== product.id)
        );
        handleXpEarned(-5);
        return;
      }

      setWishlistItems((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          funded: 0,
          goal: product.price,
          image: product.image ?? '/headphone.png',
          xpClaimed: false,
        },
      ]);
      handleXpEarned(5, true, true, flyTarget);
    },
    [wishlistItems, handleXpEarned]
  );

  const handleRemoveFromWishlist = useCallback((itemId: number) => {
    setWishlistItems((prev) => {
      const item = prev.find((entry) => entry.id === itemId);
      if (!item || !canRemoveWishlistItem(item)) return prev;
      return prev.filter((entry) => entry.id !== itemId);
    });
  }, []);

  const activeBackgroundId = previewBackgroundId ?? equippedBackgroundId;

  const activeBackgroundImage = useMemo(
    () => getStoreBackgroundImage(activeBackgroundId),
    [activeBackgroundId]
  );

  const previewBackgroundName = useMemo(() => {
    if (!previewBackgroundId) return '';
    return (
      STORE_BACKGROUNDS.find((background) => background.id === previewBackgroundId)
        ?.name ?? ''
    );
  }, [previewBackgroundId]);

  useEffect(() => {
    if (activeTab !== 'store') {
      setPreviewBackgroundId(null);
    }
  }, [activeTab]);

  const handlePreviewBackground = useCallback((id: string) => {
    setPreviewBackgroundId(id);
  }, []);

  const handleExitPreview = useCallback(() => {
    setPreviewBackgroundId(null);
  }, []);

  const handlePurchaseBackground = useCallback(
    (id: string, price: number) => {
      if (ownedBackgroundIds.includes(id) || xp < price) return;
      setXp((amount) => amount - price);
      setOwnedBackgroundIds((prev) => [...prev, id]);
      setEquippedBackgroundId(id);
      setPreviewBackgroundId(null);
    },
    [xp, ownedBackgroundIds]
  );

  const handlePurchasePack = useCallback(
    (ids: string[], price: number) => {
      const toBuy = ids.filter((id) => !ownedBackgroundIds.includes(id));
      if (toBuy.length === 0 || xp < price) return;
      setXp((amount) => amount - price);
      setOwnedBackgroundIds((prev) => [...prev, ...toBuy]);
      setEquippedBackgroundId(toBuy[0]);
      setPreviewBackgroundId(null);
    },
    [xp, ownedBackgroundIds]
  );

  const handleEquipBackground = useCallback((id: string) => {
    if (!ownedBackgroundIds.includes(id)) return;
    setEquippedBackgroundId(id);
  }, [ownedBackgroundIds]);

  const handleUnequipBackground = useCallback(() => {
    setEquippedBackgroundId(null);
  }, []);

  const handlePurchaseAvatarItem = useCallback(
    (id: string, price: number) => {
      if (ownedAvatarItemIds.includes(id) || xp < price) return;

      setXp((amount) => amount - price);
      setOwnedAvatarItemIds((prev) => [...prev, id]);

      const item = getAvatarShopItem(id);
      if (item?.slot) {
        setEquippedAvatarSlots((prev) => ({ ...prev, [item.slot!]: id }));
      }
    },
    [ownedAvatarItemIds, xp]
  );

  const handleEquipAvatarItem = useCallback(
    (item: AvatarShopItem) => {
      if (!ownedAvatarItemIds.includes(item.id) || !item.slot) return;

      setEquippedAvatarSlots((prev) => {
        const isEquipped = prev[item.slot!] === item.id;
        return { ...prev, [item.slot!]: isEquipped ? null : item.id };
      });
    },
    [ownedAvatarItemIds]
  );

  const handleAvatarItemColorChange = useCallback((itemId: string, color: string) => {
    setAvatarItemColors((prev) => ({ ...prev, [itemId]: color }));
  }, []);

  const triggerRewardFly = useCallback(
    (kind: 'xp' | 'cash', amount: number, applyOnComplete: boolean) => {
      setRewardFlyKind(kind);
      setXpFlyTarget('pill');
      xpRewardAmountRef.current = amount;
      xpRewardApplyOnCompleteRef.current = applyOnComplete;
      setXpRewardAmount(amount);
      setXpRewardKey((key) => key + 1);
      setXpRewardActive(true);
    },
    []
  );

  const handlePaidSpinCharge = useCallback((cost: number) => {
    setXp((amount) => amount - cost);
    setExtraSpinCount((count) => count + 1);
  }, []);

  const handleSpinComplete = useCallback(
    ({
      isDaily,
      reward,
    }: {
      isDaily: boolean;
      reward: SpinReward;
    }) => {
      if (isDaily) {
        setLastDailySpinAt(Date.now());
        setExtraSpinCount(0);
      }

      if (reward.type === 'xp') {
        if (appShellRef.current) {
          runWhiteConfetti(appShellRef.current);
        }
        triggerRewardFly('xp', reward.amount, true);
      } else if (reward.type === 'background') {
        setOwnedBackgroundIds((prev) =>
          prev.includes(reward.backgroundId)
            ? prev
            : [...prev, reward.backgroundId]
        );
      }
    },
    [triggerRewardFly]
  );

  const handleDepositComplete = useCallback(
    ({
      goalId,
      amount,
      xpEarned,
    }: {
      goalId: number;
      amount: number;
      xpEarned: number;
    }) => {
      setTotalSaved((saved) => saved + amount);
      setWishlistItems((prev) =>
        prev.map((item) =>
          item.id === goalId
            ? {
                ...item,
                funded: Math.min(item.goal, item.funded + amount),
              }
            : item
        )
      );
      setXp((current) => current + xpEarned);
    },
    []
  );

  const handleClaimWishlistXp = useCallback(
    (itemId: number, event: React.MouseEvent<HTMLButtonElement>) => {
      if (appShellRef.current) {
        runWhiteConfetti(appShellRef.current, event.nativeEvent);
      }
      setWishlistItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, xpClaimed: true } : item
        )
      );
      handleXpEarned(300, true);
    },
    [handleXpEarned]
  );

  const wishlistProductIds = useMemo(
    () => wishlistItems.map((item) => item.id),
    [wishlistItems]
  );

  const viewingUserProfile = useMemo(
    () => (viewingUserHandle ? getUserProfileByHandle(viewingUserHandle) : null),
    [viewingUserHandle]
  );

  const handleOpenUserProfile = useCallback((handle: string) => {
    if (isCurrentUserHandle(handle)) {
      setViewingUserHandle(null);
      setActiveTab('profile');
      return;
    }
    setViewingUserHandle(handle.startsWith('@') ? handle : `@${handle}`);
  }, []);

  useEffect(() => {
    if (activeTab !== 'profile') {
      setProfileMenuOpen(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!viewingUserHandle) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewingUserHandle(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewingUserHandle]);

  return (
    <div
      ref={appShellRef}
      className="relative flex h-full flex-col overflow-hidden font-clash text-white"
      style={{ background: activeBackgroundImage ? 'transparent' : INK }}
    >
      {activeBackgroundImage && (
        <AppEquippedBackground
          image={activeBackgroundImage}
          blurClassName={activeTab === 'deposit' ? 'blur-3xl' : 'blur-sm'}
          overlayClassName={
            activeTab === 'deposit' ? 'bg-black/72' : 'bg-black/55'
          }
        />
      )}

      {activeTab === 'deposit' && (
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background: activeBackgroundImage
              ? 'rgba(0,0,0,0.18)'
              : 'rgba(0,0,0,0.35)',
          }}
          aria-hidden="true"
        />
      )}

      {previewBackgroundId && activeTab === 'store' && (
        <BackgroundPreviewBar
          backgroundName={previewBackgroundName}
          onExit={handleExitPreview}
        />
      )}

      {/* MAIN CONTENT */}
      <main
        className={`relative z-10 flex min-h-0 flex-1 flex-col ${
          activeTab === 'home' ? '' : 'pb-[88px]'
        }`}
      >
        {/* TAB 1 — HOME */}
        {activeTab === 'home' && (
          <div ref={homeShellRef} className="relative h-full min-h-0 flex-1">
            {homeTab === 'forYou' && !homeOverlay && (
              <FeedFeed
                isSignedIn={isSignedIn}
                onRequireSignIn={() => setSignInOpen(true)}
                onXpEarned={handleXpEarned}
                onOpenProfile={handleOpenUserProfile}
              />
            )}
            {homeTab === 'wnts' && !homeOverlay && isSignedIn && (
              <WntsWishlistView
                items={wishlistItems}
                onClaimXp={handleClaimWishlistXp}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                wishlistProductIds={wishlistProductIds}
                onToggleWishlist={handleToggleWishlist}
              />
            )}

            {!homeOverlay && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-[100]">
                <TikTokTopBar
                  className="pointer-events-auto"
                  tabs={[
                    { id: 'wnts', label: 'Wnts' },
                    { id: 'forYou', label: 'For You' },
                  ]}
                  active={homeTab}
                  onChange={(tab) => {
                    setHomeOverlay(null);
                    if (tab === 'wnts' && !isSignedIn) {
                      setWntsAfterSignIn(true);
                      setSignInOpen(true);
                      return;
                    }
                    setHomeTab(tab);
                  }}
                  leftSlot={<XPPill ref={xpPillRef} amount={xp} />}
                  afterTabs={
                    homeTab !== 'wnts' ? (
                      <button
                        type="button"
                        onClick={() => setHomeOverlay('add')}
                        className="flex h-11 w-11 cursor-pointer items-center justify-center border-none bg-transparent p-0"
                        aria-label="Add post"
                      >
                        <Plus size={22} className="text-white" strokeWidth={2} />
                      </button>
                    ) : undefined
                  }
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setHomeOverlay('search')}
                      className="flex h-11 w-11 cursor-pointer items-center justify-center border-none bg-transparent p-0"
                      aria-label="Search"
                    >
                      <Search
                        size={22}
                        className="text-white"
                        strokeWidth={2}
                      />
                    </button>
                  }
                />
              </div>
            )}

            {homeOverlay === 'add' && (
              <AddPostOverlay
                onClose={() => setHomeOverlay(null)}
                wishlistItems={wishlistItems}
              />
            )}
            {homeOverlay === 'search' && (
              <SearchScreen
                onClose={() => setHomeOverlay(null)}
                wishlistProductIds={wishlistProductIds}
                onToggleWishlist={(product) =>
                  handleToggleWishlist(product, 'topLeft')
                }
              />
            )}

            {xpRewardActive && activeTab === 'home' && (
              <FlyReward
                key={xpRewardKey}
                active={xpRewardActive}
                amount={xpRewardAmount}
                kind={rewardFlyKind}
                targetRef={xpPillRef}
                containerRef={homeShellRef}
                flyTarget={xpFlyTarget}
                onComplete={handleXpRewardComplete}
              />
            )}

          </div>
        )}

        {/* TAB 2 — STORE */}
        {activeTab === 'store' && (
          <StoreView
            xp={xp}
            xpPillRef={xpPillRef}
            ownedBackgroundIds={ownedBackgroundIds}
            equippedBackgroundId={equippedBackgroundId}
            previewBackgroundId={previewBackgroundId}
            ownedAvatarItemIds={ownedAvatarItemIds}
            equippedAvatarSlots={equippedAvatarSlots}
            avatarItemColors={avatarItemColors}
            lastDailySpinAt={lastDailySpinAt}
            extraSpinCount={extraSpinCount}
            isSignedIn={isSignedIn}
            onRequireSignIn={() => setSignInOpen(true)}
            onPurchaseBackground={handlePurchaseBackground}
            onPurchasePack={handlePurchasePack}
            onPurchaseAvatarItem={handlePurchaseAvatarItem}
            onEquipAvatarItem={handleEquipAvatarItem}
            onPreviewBackground={handlePreviewBackground}
            onEquipBackground={handleEquipBackground}
            onUnequipBackground={handleUnequipBackground}
            onPaidSpinCharge={handlePaidSpinCharge}
            onSpinComplete={handleSpinComplete}
          />
        )}

        {/* TAB 3 — DEPOSIT */}
        {activeTab === 'deposit' && isSignedIn && (
          <DepositView
            goals={wishlistItems.map((item) => ({
              id: item.id,
              name: item.name,
              funded: item.funded,
              goal: item.goal,
            }))}
            streak={PROFILE_DATA.streak}
            totalSaved={totalSaved}
            xp={xp}
            onDepositComplete={handleDepositComplete}
            onOpenMenu={() => setDepositMenuOpen(true)}
          />
        )}

        {/* TAB 4 — LEADERBOARD (Ranks) */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            activeTab={rankTab}
            onTabChange={setRankTab}
            xp={xp}
            totalSaved={totalSaved}
          />
        )}

        {/* TAB 5 — PROFILE */}
        {activeTab === 'profile' && isSignedIn && (
          <ProfileView
            xp={xp}
            totalSaved={totalSaved}
            wishlistItems={wishlistItems}
            ownedAvatarItemIds={ownedAvatarItemIds}
            equippedAvatarSlots={equippedAvatarSlots}
            avatarItemColors={avatarItemColors}
            previewBackgroundImage={activeBackgroundImage}
            onOpenStore={() => setActiveTab('store')}
            onEquipAvatarItem={handleEquipAvatarItem}
            onAvatarItemColorChange={handleAvatarItemColorChange}
            onOpenProfileMenu={() => setProfileMenuOpen(true)}
            onOpenInbox={() => setProfileInboxOpen(true)}
            inboxUnreadCount={inboxUnreadCount}
          />
        )}
      </main>

      {viewingUserProfile && (
        <div className="absolute inset-0 z-[220] flex flex-col overflow-hidden">
          {viewingUserProfile.backgroundImage && (
            <AppEquippedBackground image={viewingUserProfile.backgroundImage} />
          )}
          <ProfileView
            variant="other"
            otherProfile={viewingUserProfile}
            xp={viewingUserProfile.xp}
            totalSaved={viewingUserProfile.totalSaved}
            wishlistItems={viewingUserProfile.wishlistItems}
            ownedAvatarItemIds={viewingUserProfile.ownedAvatarItemIds}
            equippedAvatarSlots={viewingUserProfile.equippedAvatarSlots}
            avatarItemColors={viewingUserProfile.avatarItemColors}
            previewBackgroundImage={viewingUserProfile.backgroundImage}
            onOpenStore={() => {}}
            onEquipAvatarItem={() => {}}
            onAvatarItemColorChange={() => {}}
            onOpenProfileMenu={() => {}}
            onOpenInbox={() => {}}
            inboxUnreadCount={0}
            onBack={() => setViewingUserHandle(null)}
          />
        </div>
      )}

      {activeTab === 'deposit' && isSignedIn && (
        <ProfileMenuDrawer
          open={depositMenuOpen}
          onClose={() => setDepositMenuOpen(false)}
          onLogOut={() => {
            setDepositMenuOpen(false);
            setIsSignedIn(false);
            setActiveTab('home');
          }}
        />
      )}

      {activeTab === 'profile' && isSignedIn && (
        <>
        <ProfileMenuDrawer
          open={profileMenuOpen}
          onClose={() => setProfileMenuOpen(false)}
          onLogOut={() => {
            setProfileMenuOpen(false);
            setIsSignedIn(false);
            setActiveTab('home');
          }}
        />
        <ProfileInboxDrawer
          open={profileInboxOpen}
          onClose={() => setProfileInboxOpen(false)}
          backgroundImage={activeBackgroundImage}
          onUnreadCountChange={setInboxUnreadCount}
          onOpenUserProfile={handleOpenUserProfile}
        />
        </>
      )}

      {xpRewardActive && activeTab === 'store' && (
        <FlyReward
          key={xpRewardKey}
          active={xpRewardActive}
          amount={xpRewardAmount}
          kind={rewardFlyKind}
          targetRef={xpPillRef}
          containerRef={appShellRef}
          flyTarget="pill"
          onComplete={handleXpRewardComplete}
        />
      )}

      <SignInModal
        open={signInOpen}
        onClose={() => {
          setSignInOpen(false);
          setWntsAfterSignIn(false);
          setProfileAfterSignIn(false);
          setDepositAfterSignIn(false);
        }}
        onSignIn={() => {
          setIsSignedIn(true);
          setSignInOpen(false);
          if (wntsAfterSignIn) {
            setHomeTab('wnts');
            setWntsAfterSignIn(false);
          }
          if (profileAfterSignIn) {
            setActiveTab('profile');
            setProfileAfterSignIn(false);
          }
          if (depositAfterSignIn) {
            setActiveTab('deposit');
            setDepositAfterSignIn(false);
          }
        }}
      />

      {/* BOTTOM NAV BAR */}
      {!homeOverlay && !viewingUserHandle && (
      <nav
        className="pointer-events-auto absolute bottom-0 left-0 right-0 z-[90] flex items-center justify-around font-clash"
        style={{
          height: '72px',
          paddingBottom: '16px',
          background: 'rgba(250,247,239,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(250,247,239,0.12)',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="flex min-w-[56px] cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent"
        >
          <HomeIcon
            size={22}
            className="text-white"
            style={{ opacity: activeTab === 'home' ? 1 : 0.5 }}
            strokeWidth={2}
          />
          <span
            className="text-[9px] text-white"
            style={{ opacity: activeTab === 'home' ? 1 : 0.4 }}
          >
            Home
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('store')}
          className="flex min-w-[56px] cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent"
        >
          <ShoppingBag
            size={22}
            className="text-white"
            style={{ opacity: activeTab === 'store' ? 1 : 0.5 }}
            strokeWidth={2}
          />
          <span
            className="text-[9px] text-white"
            style={{ opacity: activeTab === 'store' ? 1 : 0.4 }}
          >
            Store
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isSignedIn) {
              setDepositAfterSignIn(true);
              setSignInOpen(true);
              return;
            }
            setActiveTab('deposit');
          }}
          className="flex min-w-[56px] cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent"
          style={{ marginTop: '6px' }}
          aria-label="Deposit"
        >
          <span
            className="flex items-center justify-center rounded-full border"
            style={{
              width: '56px',
              height: '56px',
              background:
                activeTab === 'deposit'
                  ? 'rgba(143,168,188,0.28)'
                  : 'rgba(250,247,239,0.16)',
              borderColor:
                activeTab === 'deposit'
                  ? 'rgba(143,168,188,0.45)'
                  : 'rgba(250,247,239,0.24)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow:
                activeTab === 'deposit'
                  ? '0 0 18px rgba(143, 168, 188, 0.35), 0 0 36px rgba(143, 168, 188, 0.2)'
                  : '0 0 18px rgba(255, 255, 255, 0.18), 0 0 36px rgba(250, 247, 239, 0.12), 0 0 56px rgba(255, 255, 255, 0.06)',
            }}
          >
            <DollarSign
              size={22}
              className="text-[#FAF7EF]"
              strokeWidth={2}
            />
          </span>
          <span className="block h-[9px]" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className="flex min-w-[56px] cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent"
        >
          <Trophy
            size={22}
            className="text-white"
            style={{ opacity: activeTab === 'leaderboard' ? 1 : 0.5 }}
            strokeWidth={2}
          />
          <span
            className="text-[9px] text-white"
            style={{ opacity: activeTab === 'leaderboard' ? 1 : 0.4 }}
          >
            Ranks
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isSignedIn) {
              setProfileAfterSignIn(true);
              setSignInOpen(true);
              return;
            }
            setActiveTab('profile');
          }}
          className="flex min-w-[56px] cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent"
        >
          <User
            size={22}
            className="text-white"
            style={{ opacity: activeTab === 'profile' ? 1 : 0.5 }}
            strokeWidth={2}
          />
          <span
            className="text-[9px] text-white"
            style={{ opacity: activeTab === 'profile' ? 1 : 0.4 }}
          >
            Profile
          </span>
        </button>
      </nav>
      )}
    </div>
  );
}

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);
  const [promptSignInOnMount, setPromptSignInOnMount] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      setShowPermissions(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const dismissPermissions = () => {
    setShowPermissions(false);
    setShowInterests(true);
  };

  const completeInterests = () => {
    setShowInterests(false);
    setPromptSignInOnMount(true);
    setShowMainApp(true);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const showWelcome =
    !showLoader && !showPermissions && !showInterests && !showMainApp;

  return (
    <>
      <Head>
        <title>Wnted</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        .loader {
          width: 60px;
          aspect-ratio: 4;
          --_g: no-repeat radial-gradient(
            circle closest-side, #FFFFFF 90%, #0000
          );
          background:
            var(--_g) 0%   50%,
            var(--_g) 50%  50%,
            var(--_g) 100% 50%;
          background-size: calc(100%/3) 100%;
          animation: l7 1s infinite linear;
        }
        @keyframes l7 {
          33% {
            background-size: calc(100%/3) 0%,
                             calc(100%/3) 100%,
                             calc(100%/3) 100%
          }
          50% {
            background-size: calc(100%/3) 100%,
                             calc(100%/3) 0%,
                             calc(100%/3) 100%
          }
          66% {
            background-size: calc(100%/3) 100%,
                             calc(100%/3) 100%,
                             calc(100%/3) 0%
          }
        }
        .feedScroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .feedScroll::-webkit-scrollbar {
          display: none;
        }
        .commentsScroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(250, 247, 239, 0.22) transparent;
        }
        .commentsScroll::-webkit-scrollbar {
          width: 4px;
        }
        .commentsScroll::-webkit-scrollbar-thumb {
          background: rgba(250, 247, 239, 0.22);
          border-radius: 999px;
        }
        @keyframes xpRewardPop {
          0% {
            opacity: 0;
            transform: scale(0.35);
          }
          18% {
            opacity: 1;
            transform: scale(1.15);
          }
          28% {
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .xp-reward-toast {
          animation: xpRewardPop 0.9s ease-out forwards;
        }
      `}</style>

      {/* LOADING SCREEN */}
      {showLoader && (
      <div
        className="fixed inset-0 z-30 flex min-h-screen items-center justify-center bg-black font-clash"
      >
        <div
          className="relative overflow-hidden"
          style={phoneFrameStyle}
        >
          <div
            className="relative z-10 flex h-full flex-col items-center justify-center"
            style={{ gap: '24px' }}
          >
            <WntedLogo size={32} />
            <span className="text-[18px] font-medium tracking-[2px] text-white">
              WNTED
            </span>
            <div className="loader" />
          </div>
        </div>
      </div>
      )}

      {/* PERMISSIONS SCREEN */}
      {showPermissions && (
      <div
        className="fixed inset-0 z-30 flex min-h-screen items-center justify-center bg-black font-clash"
      >
        <div
          className="relative overflow-hidden"
          style={phoneFrameStyle}
        >
          <div className="relative z-10 flex h-full flex-col px-6 pt-[52px]">
            <h1 className="text-[22px] font-normal leading-[1.3] text-white">
              Allow permissions
            </h1>
            <p
              className="mt-3 max-w-[320px] text-[14px] font-normal leading-[1.55] text-white"
              style={{ opacity: 0.55 }}
            >
              To stay on top of price alerts, savings goals, friend activity,
              and more, allow Wnted to send you notifications.
            </p>

            <div className="flex flex-1 items-center justify-center pb-16">
              <div
                className="w-[270px] overflow-hidden text-center"
                style={{
                  borderRadius: '14px',
                  background: 'rgba(44, 44, 46, 0.94)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <div className="px-4 pt-5 pb-4">
                  <p className="text-[17px] font-normal leading-[1.3] text-white">
                    &ldquo;Wnted&rdquo; Would Like to Send You Notifications
                  </p>
                  <p
                    className="mt-2 text-[13px] font-normal leading-[1.45] text-white"
                    style={{ opacity: 0.85 }}
                  >
                    Notifications may include alerts, sounds, and icon badges.
                    These can be configured in Settings.
                  </p>
                </div>

                <div
                  className="flex border-t"
                  style={{ borderColor: 'rgba(84, 84, 88, 0.65)' }}
                >
                  <button
                    type="button"
                    onClick={dismissPermissions}
                    className="flex-1 cursor-pointer border-none bg-transparent py-[11px] text-[17px] font-normal"
                    style={{ color: '#0A84FF' }}
                  >
                    Don&apos;t Allow
                  </button>
                  <div
                    className="w-px"
                    style={{ background: 'rgba(84, 84, 88, 0.65)' }}
                  />
                  <button
                    type="button"
                    onClick={dismissPermissions}
                    className="flex-1 cursor-pointer border-none bg-transparent py-[11px] text-[17px] font-normal"
                    style={{ color: '#0A84FF' }}
                  >
                    Allow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* INTERESTS SCREEN */}
      {showInterests && (
      <div
        className="fixed inset-0 z-30 flex min-h-screen items-center justify-center bg-black font-clash"
      >
        <div
          className="relative overflow-hidden"
          style={phoneFrameStyle}
        >
          <div className="relative z-10 flex h-full flex-col px-5 pt-[52px] pb-6">
            <h1 className="text-[22px] font-medium leading-[1.3] text-white">
              Choose what you like
            </h1>
            <p
              className="mt-2 text-[14px] font-normal leading-[1.55] text-white"
              style={{ opacity: 0.55 }}
            >
              Your feed will be personalized based on what you like.
            </p>

            <div className="mt-8 min-h-0 flex-1 overflow-y-auto pb-6">
              <div className="flex flex-wrap content-start gap-4 pr-1">
                {PRODUCT_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className="cursor-pointer rounded-full border px-5 py-3 text-[15px] font-medium text-white transition-all duration-200"
                      style={{
                        background: isSelected
                          ? 'rgba(138, 151, 168, 0.28)'
                          : 'rgba(250, 247, 239, 0.08)',
                        borderColor: isSelected
                          ? '#8A97A8'
                          : 'rgba(250, 247, 239, 0.18)',
                      }}
                    >
                      {interest} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex shrink-0 gap-3 pt-2">
              <button
                type="button"
                onClick={completeInterests}
                className="flex-1 cursor-pointer rounded-full border-none py-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
                style={{
                  background: 'rgba(250, 247, 239, 0.12)',
                }}
              >
                Skip
              </button>
              <button
                type="button"
                onClick={completeInterests}
                disabled={selectedInterests.length === 0}
                className="flex-1 rounded-full border-none py-3.5 text-[15px] font-medium text-white transition-all duration-200"
                style={{
                  background:
                    selectedInterests.length > 0
                      ? '#8A97A8'
                      : 'rgba(138, 151, 168, 0.35)',
                  cursor:
                    selectedInterests.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: selectedInterests.length > 0 ? 1 : 0.7,
                }}
              >
                Next ({selectedInterests.length})
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* MAIN APP */}
      {showMainApp && (
      <div
        className="fixed inset-0 z-30 flex min-h-screen items-center justify-center bg-black font-clash"
      >
        <div
          className="relative overflow-hidden"
          style={phoneFrameStyle}
        >
          <MainAppShell promptSignInOnMount={promptSignInOnMount} />
        </div>
      </div>
      )}

      {showWelcome && <WelcomeScreen />}
    </>
  );
}
