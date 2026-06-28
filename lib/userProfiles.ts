import {
  DEFAULT_AVATAR_ITEM_COLORS,
  DEFAULT_EQUIPPED_AVATAR_SLOTS,
  type AvatarClothingSlot,
} from '@/lib/avatarItems';

export const CURRENT_USER_HANDLE = '@khushi';

export type PublicWishlistItem = {
  id: number;
  name: string;
  category: string;
  funded: number;
  goal: number;
  image: string;
  xpClaimed?: boolean;
};

export type UserPublicProfile = {
  handle: string;
  username: string;
  name: string;
  bio: string;
  following: number;
  followers: number;
  totalSaved: number;
  streak: number;
  xp: number;
  skinColor: string;
  backgroundImage: string | null;
  ownedAvatarItemIds: string[];
  equippedAvatarSlots: Record<AvatarClothingSlot, string | null>;
  avatarItemColors: Record<string, string>;
  wishlistItems: PublicWishlistItem[];
};

const baseAvatar = {
  ownedAvatarItemIds: ['oversized-tshirt', 'jeans', 'long-hair'],
  equippedAvatarSlots: { ...DEFAULT_EQUIPPED_AVATAR_SLOTS },
  avatarItemColors: { ...DEFAULT_AVATAR_ITEM_COLORS },
  skinColor: '#EACBB4',
};

const USER_PROFILES: Record<string, UserPublicProfile> = {
  '@alexkicks': {
    handle: '@alexkicks',
    username: 'alexkicks',
    name: 'Alex Torres',
    bio: 'sneaker rotation fund · $25/wk ✦',
    following: 18,
    followers: 214,
    totalSaved: 1840,
    streak: 9,
    xp: 9200,
    backgroundImage: '/backgrounds/japan3.png',
    ...baseAvatar,
    avatarItemColors: {
      ...DEFAULT_AVATAR_ITEM_COLORS,
      'oversized-tshirt': '#2F4F3A',
    },
    wishlistItems: [
      {
        id: 101,
        name: 'Green Sambas',
        category: 'Fashion',
        funded: 331,
        goal: 449,
        image: '/GreenSambas.png',
      },
      {
        id: 102,
        name: 'PlayStation 5',
        category: 'Electronics',
        funded: 320,
        goal: 499,
        image: '/Ps5.png',
      },
      {
        id: 103,
        name: 'Nike Sneakers',
        category: 'Fashion',
        funded: 88,
        goal: 160,
        image: '/Nike.png',
      },
    ],
  },
  '@maya.studies': {
    handle: '@maya.studies',
    username: 'maya.studies',
    name: 'Maya Chen',
    bio: 'college savings + tech goals 📚',
    following: 22,
    followers: 189,
    totalSaved: 2210,
    streak: 12,
    xp: 11400,
    backgroundImage: '/backgrounds/japan1.png',
    ...baseAvatar,
    equippedAvatarSlots: {
      ...DEFAULT_EQUIPPED_AVATAR_SLOTS,
      hair: 'ponytail',
    },
    ownedAvatarItemIds: ['oversized-tshirt', 'jeans', 'long-hair', 'ponytail'],
    wishlistItems: [
      {
        id: 201,
        name: 'Sony Headphones',
        category: 'Electronics',
        funded: 287,
        goal: 449,
        image: '/headphone.png',
      },
      {
        id: 202,
        name: 'PlayStation 5',
        category: 'Electronics',
        funded: 180,
        goal: 499,
        image: '/Ps5.png',
      },
    ],
  },
  '@noahcreates': {
    handle: '@noahcreates',
    username: 'noahcreates',
    name: 'Noah Kim',
    bio: 'digital planning + apple gear ✦',
    following: 31,
    followers: 256,
    totalSaved: 3120,
    streak: 6,
    xp: 13800,
    backgroundImage: '/backgrounds/moss-dew/dark-jungle-green.png',
    ...baseAvatar,
    avatarItemColors: {
      ...DEFAULT_AVATAR_ITEM_COLORS,
      'oversized-tshirt': '#1C1917',
    },
    wishlistItems: [
      {
        id: 301,
        name: 'iPad Pro',
        category: 'Electronics',
        funded: 410,
        goal: 1099,
        image: '/IpadPro.png',
      },
      {
        id: 302,
        name: 'PlayStation 5',
        category: 'Electronics',
        funded: 410,
        goal: 499,
        image: '/Ps5.png',
      },
    ],
  },
  '@zoebeauty': {
    handle: '@zoebeauty',
    username: 'zoebeauty',
    name: 'Zoe Reed',
    bio: 'beauty wishlist on a budget ✨',
    following: 44,
    followers: 512,
    totalSaved: 4280,
    streak: 14,
    xp: 16200,
    backgroundImage: '/backgrounds/floraison1.png',
    ...baseAvatar,
    equippedAvatarSlots: {
      ...DEFAULT_EQUIPPED_AVATAR_SLOTS,
      hair: 'long-hair',
    },
    wishlistItems: [
      {
        id: 401,
        name: 'Dyson Airwrap',
        category: 'Beauty',
        funded: 3840,
        goal: 4200,
        image: '/dyson.png',
      },
      {
        id: 402,
        name: 'Loewe Perfume',
        category: 'Beauty',
        funded: 198,
        goal: 320,
        image: '/LoweaPerfume.png',
      },
    ],
  },
  '@chloewishlist': {
    handle: '@chloewishlist',
    username: 'chloewishlist',
    name: 'Chloe Park',
    bio: 'luxury goals, realistic deposits ✦',
    following: 15,
    followers: 398,
    totalSaved: 3650,
    streak: 8,
    xp: 12100,
    backgroundImage: '/backgrounds/japan1.png',
    ...baseAvatar,
    wishlistItems: [
      {
        id: 501,
        name: 'Bottega Veneta Bag',
        category: 'Fashion',
        funded: 3100,
        goal: 5900,
        image: '/BotegaBag.png',
      },
      {
        id: 502,
        name: 'Air Forces 1 Blue',
        category: 'Fashion',
        funded: 62,
        goal: 130,
        image: '/GreenSambas.png',
      },
    ],
  },
  '@devsaves': {
    handle: '@devsaves',
    username: 'devsaves',
    name: 'Dev Morgan',
    bio: 'stacking for setup upgrades 💻',
    following: 9,
    followers: 142,
    totalSaved: 1980,
    streak: 5,
    xp: 7800,
    backgroundImage: '/backgrounds/dusk/jet.png',
    ...baseAvatar,
    wishlistItems: [
      {
        id: 601,
        name: 'Macbook Pro 14',
        category: 'Electronics',
        funded: 1000,
        goal: 2000,
        image: '/macBook.png',
      },
      {
        id: 602,
        name: 'PlayStation 5',
        category: 'Electronics',
        funded: 180,
        goal: 500,
        image: '/Ps5.png',
      },
    ],
  },
  '@audiophile': {
    handle: '@audiophile',
    username: 'audiophile',
    name: 'Jordan Lee',
    bio: 'one perfect pair at a time 🎧',
    following: 11,
    followers: 167,
    totalSaved: 449,
    streak: 11,
    xp: 6400,
    backgroundImage: '/backgrounds/silver-mist/granite-gray.png',
    ...baseAvatar,
    wishlistItems: [
      {
        id: 701,
        name: 'Sony Headphones',
        category: 'Electronics',
        funded: 449,
        goal: 449,
        image: '/headphone.png',
        xpClaimed: true,
      },
    ],
  },
  '@emmafit': {
    handle: '@emmafit',
    username: 'emmafit',
    name: 'Emma Walsh',
    bio: 'activewear + wellness fund 🏃‍♀️',
    following: 27,
    followers: 301,
    totalSaved: 1560,
    streak: 10,
    xp: 8900,
    backgroundImage: '/backgrounds/moss-dew/dark-jungle-green.png',
    ...baseAvatar,
    wishlistItems: [
      {
        id: 801,
        name: 'Lulu Leggings',
        category: 'Fashion',
        funded: 52,
        goal: 95,
        image: '/LuLuLeggings.png',
      },
      {
        id: 802,
        name: 'Air Forces 1 Blue',
        category: 'Fashion',
        funded: 225,
        goal: 300,
        image: '/GreenSambas.png',
      },
    ],
  },
  '@sophiaaudio': {
    handle: '@sophiaaudio',
    username: 'sophiaaudio',
    name: 'Sophia Nguyen',
    bio: 'commute soundtrack upgrades ✦',
    following: 19,
    followers: 228,
    totalSaved: 287,
    streak: 11,
    xp: 7100,
    backgroundImage: '/backgrounds/floraison2.png',
    ...baseAvatar,
    wishlistItems: [
      {
        id: 901,
        name: 'Sony Headphones',
        category: 'Electronics',
        funded: 287,
        goal: 449,
        image: '/headphone.png',
      },
      {
        id: 902,
        name: 'AirPods Max',
        category: 'Electronics',
        funded: 120,
        goal: 549,
        image: '/AirpodMax.png',
      },
    ],
  },
  '@jadeskin': {
    handle: '@jadeskin',
    username: 'jadeskin',
    name: 'Jade Rivera',
    bio: 'glass skin savings jar ✨',
    following: 36,
    followers: 445,
    totalSaved: 940,
    streak: 7,
    xp: 5600,
    backgroundImage: '/backgrounds/floraison3.png',
    ...baseAvatar,
    wishlistItems: [
      {
        id: 1001,
        name: 'Aura Serum',
        category: 'Beauty',
        funded: 198,
        goal: 320,
        image: '/AuraSerum.png',
      },
      {
        id: 1002,
        name: 'Rare Beauty Set',
        category: 'Beauty',
        funded: 48,
        goal: 95,
        image: '/CentellaSkinCare.png',
      },
    ],
  },
  '@lilyglow': {
    handle: '@lilyglow',
    username: 'lilyglow',
    name: 'Lily Park',
    bio: 'small deposits, big glow ✦',
    following: 14,
    followers: 119,
    totalSaved: 680,
    streak: 4,
    xp: 4200,
    backgroundImage: '/backgrounds/white/pure-white.png',
    ...baseAvatar,
    wishlistItems: [
      {
        id: 1101,
        name: 'YSL Perfume',
        category: 'Beauty',
        funded: 240,
        goal: 500,
        image: '/LoweaPerfume.png',
      },
    ],
  },
};

const normalizeHandle = (handle: string) => {
  const trimmed = handle.trim();
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

const buildFallbackProfile = (handle: string): UserPublicProfile => {
  const slug = handle.replace('@', '');
  const name = slug
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    handle,
    username: slug,
    name: name || 'Wnted User',
    bio: 'saving for something special ✦',
    following: 12,
    followers: 48,
    totalSaved: 420,
    streak: 3,
    xp: 2500,
    backgroundImage: '/backgrounds/dusk/chinese-black.png',
    ...baseAvatar,
    wishlistItems: [
      {
        id: 9000,
        name: 'Sony Headphones',
        category: 'Electronics',
        funded: 120,
        goal: 320,
        image: '/headphone.png',
      },
    ],
  };
};

export const getUserProfileByHandle = (handle: string): UserPublicProfile => {
  const normalized = normalizeHandle(handle);
  return USER_PROFILES[normalized] ?? buildFallbackProfile(normalized);
};

export const isCurrentUserHandle = (handle: string) =>
  normalizeHandle(handle) === CURRENT_USER_HANDLE;
