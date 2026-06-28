import { AVATAR_COLOR_PALETTE } from './avatarColorPalette';

export type AvatarEditCategory = 'face' | 'clothes' | 'accessories';

export type AvatarClothingSlot = 'tops' | 'bottoms' | 'outerwear' | 'hair';

export type AvatarShopItem = {
  id: string;
  name: string;
  category: AvatarEditCategory;
  subCategory: string;
  modelPath: string;
  price: number;
  slot?: AvatarClothingSlot;
  isDefault?: boolean;
  customizableColor?: boolean;
};

export const AVATAR_EDIT_TABS: { id: AvatarEditCategory; label: string }[] = [
  { id: 'face', label: 'Face' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'accessories', label: 'Accessories' },
];

export const AVATAR_EDIT_SUBCATEGORIES: Record<
  AvatarEditCategory,
  { id: string; label: string }[]
> = {
  face: [
    { id: 'skin', label: 'Skin Color' },
    { id: 'nose', label: 'Nose' },
    { id: 'lips', label: 'Lips' },
    { id: 'hair', label: 'Hair' },
    { id: 'face-shape', label: 'Face Shape' },
    { id: 'eyebrows', label: 'Eyebrows' },
  ],
  clothes: [
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'outfits', label: 'Outfits' },
    { id: 'dresses', label: 'Dresses' },
  ],
  accessories: [
    { id: 'hats', label: 'Hats' },
    { id: 'glasses', label: 'Glasses' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'bags', label: 'Bags' },
    { id: 'watches', label: 'Watches' },
    { id: 'earrings', label: 'Earrings' },
  ],
};

export const AVATAR_SHOP_ITEMS: AvatarShopItem[] = [
  {
    id: 'oversized-tshirt',
    name: 'Oversized T-Shirt',
    category: 'clothes',
    subCategory: 'tops',
    modelPath: '/models/shirts/oversizedTshirt.glb',
    price: 0,
    slot: 'tops',
    isDefault: true,
    customizableColor: true,
  },
  {
    id: 'jeans',
    name: 'Jeans',
    category: 'clothes',
    subCategory: 'bottoms',
    modelPath: '/models/bottoms/jeans.glb',
    price: 0,
    slot: 'bottoms',
    isDefault: true,
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    category: 'clothes',
    subCategory: 'outerwear',
    modelPath: '/models/hoodies/hoodie.glb',
    price: 300,
    slot: 'outerwear',
  },
  {
    id: 'long-hair',
    name: 'Long Hair',
    category: 'face',
    subCategory: 'hair',
    modelPath: '/models/hair/longHair.glb',
    price: 0,
    slot: 'hair',
    isDefault: true,
    customizableColor: true,
  },
  {
    id: 'hair-bitten',
    name: 'Bitten Hair',
    category: 'face',
    subCategory: 'hair',
    modelPath: '/models/hair/hairBitten.glb',
    price: 700,
    slot: 'hair',
    customizableColor: true,
  },
  {
    id: 'long-hair-with-bow',
    name: 'Long Hair with Bow',
    category: 'face',
    subCategory: 'hair',
    modelPath: '/models/hair/longHairWithBow.glb',
    price: 700,
    slot: 'hair',
    customizableColor: true,
  },
  {
    id: 'ponytail',
    name: 'Ponytail',
    category: 'face',
    subCategory: 'hair',
    modelPath: '/models/hair/ponyTail.glb',
    price: 500,
    slot: 'hair',
    customizableColor: true,
  },
];

export const isHairModelPath = (modelPath: string) =>
  modelPath.startsWith('/models/hair/');

export const HAIR_PREVIEW_GLASS_STYLE = {
  background: 'rgba(250,247,239,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
} as const;

export const HAIR_PREVIEW_FIT_SIZE = 2.6;
export const HAIR_THUMB_FIT_SIZE = 2.1;

export const HAIR_PREVIEW_FIT_SIZES: Record<string, number> = {
  '/models/hair/longHairWithBow.glb': 7,
};

/** Extra multiplier after auto-fit. */
export const HAIR_DETAIL_SCALES: Record<string, number> = {
  '/models/hair/longHair.glb': 1,
  '/models/hair/hairBitten.glb': 1,
  '/models/hair/longHairWithBow.glb': 24,
  '/models/hair/ponyTail.glb': 1,
};

export const HAIR_THUMB_SCALE = 1;

export const HAIR_PREVIEW_CAMERA = {
  position: [0, 0, 1.05] as const,
  fov: 42,
};

export const HAIR_PREVIEW_CAMERAS: Record<
  string,
  { position: readonly [number, number, number]; fov: number }
> = {
  '/models/hair/longHairWithBow.glb': { position: [0, 0, 0.18], fov: 36 },
};

export const HAIR_PREVIEW_ORBIT: Record<string, { minDistance: number; maxDistance: number }> =
  {
    '/models/hair/longHairWithBow.glb': { minDistance: 0.12, maxDistance: 0.95 },
  };

export const DEFAULT_OWNED_AVATAR_ITEM_IDS = ['oversized-tshirt', 'jeans', 'long-hair'];

export const DEFAULT_EQUIPPED_AVATAR_SLOTS: Record<AvatarClothingSlot, string | null> =
  {
    tops: 'oversized-tshirt',
    bottoms: 'jeans',
    outerwear: null,
    hair: 'long-hair',
  };

export { AVATAR_COLOR_PALETTE };

export const CLOTHING_BASIC_COLORS = [
  { id: 'white', color: '#F5F5F5' },
  { id: 'cream', color: '#F0E6D8' },
  { id: 'beige', color: '#D4C4A8' },
  { id: 'gray', color: '#9CA3AF' },
  { id: 'charcoal', color: '#4B5563' },
  { id: 'black', color: '#1F2937' },
  { id: 'navy', color: '#1E3A5F' },
  { id: 'blue', color: '#3B82F6' },
  { id: 'sky', color: '#7DD3FC' },
  { id: 'teal', color: '#14B8A6' },
  { id: 'green', color: '#22C55E' },
  { id: 'olive', color: '#84CC16' },
  { id: 'yellow', color: '#FACC15' },
  { id: 'orange', color: '#F97316' },
  { id: 'red', color: '#EF4444' },
  { id: 'pink', color: '#F472B6' },
  { id: 'purple', color: '#A855F7' },
  { id: 'lavender', color: '#C4B5FD' },
] as const;

const clothingBasicHexes = new Set(
  CLOTHING_BASIC_COLORS.map((swatch) => swatch.color.toUpperCase())
);

export const CLOTHING_COLOR_PALETTE = [
  ...CLOTHING_BASIC_COLORS,
  ...AVATAR_COLOR_PALETTE.filter(
    (swatch) => !clothingBasicHexes.has(swatch.color.toUpperCase())
  ),
];

export const HAIR_NATURAL_COLORS = [
  { id: 'hair-black', color: '#1C1917' },
  { id: 'hair-espresso', color: '#2C1810' },
  { id: 'hair-brown', color: '#5C3D2E' },
  { id: 'hair-chestnut', color: '#7B4B2A' },
  { id: 'hair-auburn', color: '#8B3A2A' },
  { id: 'hair-copper', color: '#B45309' },
  { id: 'hair-blonde', color: '#D4A76A' },
  { id: 'hair-platinum', color: '#E8E0D5' },
  { id: 'hair-strawberry', color: '#C45C5C' },
  { id: 'hair-silver', color: '#B0B4BC' },
  { id: 'hair-lavender', color: '#9B8AA5' },
  { id: 'hair-blue', color: '#4A6FA5' },
] as const;

const hairNaturalHexes = new Set(
  HAIR_NATURAL_COLORS.map((swatch) => swatch.color.toUpperCase())
);

export const HAIR_COLOR_PALETTE = [
  ...HAIR_NATURAL_COLORS,
  ...AVATAR_COLOR_PALETTE.filter(
    (swatch) => !hairNaturalHexes.has(swatch.color.toUpperCase())
  ),
];

export const DEFAULT_AVATAR_ITEM_COLORS: Record<string, string> = {
  'oversized-tshirt': '#F5F5F5',
  'long-hair': '#5C3D2E',
};

export type EquippedClothingEntry = {
  modelPath: string;
  color?: string;
};

export const getAvatarItemColor = (
  itemId: string,
  itemColors: Record<string, string> = {}
) => itemColors[itemId] ?? DEFAULT_AVATAR_ITEM_COLORS[itemId];

export const getEquippedClothingEntries = (
  equippedSlots: Record<AvatarClothingSlot, string | null>,
  ownedItemIds: string[],
  itemColors: Record<string, string> = {}
): EquippedClothingEntry[] => {
  const entries: EquippedClothingEntry[] = [];

  (['bottoms', 'tops', 'outerwear', 'hair'] as AvatarClothingSlot[]).forEach((slot) => {
    const itemId = equippedSlots[slot];
    if (!itemId || !ownedItemIds.includes(itemId)) return;

    const item = getAvatarShopItem(itemId);
    if (!item?.modelPath) return;

    const entry: EquippedClothingEntry = { modelPath: item.modelPath };
    if (item.customizableColor) {
      entry.color = getAvatarItemColor(itemId, itemColors);
    }
    entries.push(entry);
  });

  return entries;
};

export const getAvatarShopItem = (id: string) =>
  AVATAR_SHOP_ITEMS.find((item) => item.id === id);

export const getAvatarItemsForSubCategory = (
  category: AvatarEditCategory,
  subCategory: string
) =>
  AVATAR_SHOP_ITEMS.filter(
    (item) => item.category === category && item.subCategory === subCategory
  );

export const getEquippedClothingPaths = (
  equippedSlots: Record<AvatarClothingSlot, string | null>,
  ownedItemIds: string[]
) =>
  getEquippedClothingEntries(equippedSlots, ownedItemIds).map(
    (entry) => entry.modelPath
  );
