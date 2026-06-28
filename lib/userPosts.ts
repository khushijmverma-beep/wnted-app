export type UserPost = {
  id: string;
  image: string;
  alt: string;
  handle: string;
  views: string;
};

const USER_POSTS: UserPost[] = [
  {
    id: 'green-sambas',
    image: '/GreenSambas.png',
    alt: 'Green Sambas',
    handle: '@alexkicks',
    views: '32.5K',
  },
  {
    id: 'nike',
    image: '/Nike.png',
    alt: 'Nike Sneakers',
    handle: '@alexkicks',
    views: '272K',
  },
  {
    id: 'nike-2',
    image: '/GreenSambas.png',
    alt: 'Sneaker rotation',
    handle: '@alexkicks',
    views: '40.9K',
  },
  {
    id: 'headphones',
    image: '/headphone.png',
    alt: 'Headphones',
    handle: '@audiophile',
    views: '9,696',
  },
  {
    id: 'ps5',
    image: '/Ps5.png',
    alt: 'PlayStation 5',
    handle: '@devsaves',
    views: '401K',
  },
  {
    id: 'macbook',
    image: '/macBook.png',
    alt: 'MacBook Pro',
    handle: '@devsaves',
    views: '36.7K',
  },
  {
    id: 'bottega-bag',
    image: '/BotegaBag.png',
    alt: 'Bottega Veneta Bag',
    handle: '@chloewishlist',
    views: '262K',
  },
  {
    id: 'dyson',
    image: '/dyson.png',
    alt: 'Dyson Airwrap',
    handle: '@zoebeauty',
    views: '32.7K',
  },
  {
    id: 'ipad-pro',
    image: '/IpadPro.png',
    alt: 'iPad Pro',
    handle: '@noahcreates',
    views: '18.2K',
  },
  {
    id: 'lulu-leggings',
    image: '/LuLuLeggings.png',
    alt: 'Lulu Leggings',
    handle: '@emmafit',
    views: '24.1K',
  },
  {
    id: 'airpod-max',
    image: '/AirpodMax.png',
    alt: 'AirPods Max',
    handle: '@sophiaaudio',
    views: '56.3K',
  },
  {
    id: 'airpod-pro',
    image: '/AirpodProMax.png',
    alt: 'AirPods Pro',
    handle: '@maya.studies',
    views: '31.4K',
  },
  {
    id: 'centella',
    image: '/CentellaSkinCare.png',
    alt: 'Centella Skincare',
    handle: '@jadeskin',
    views: '12.8K',
  },
  {
    id: 'aura-serum',
    image: '/AuraSerum.png',
    alt: 'Aura Serum',
    handle: '@jadeskin',
    views: '8.4K',
  },
];

import { CURRENT_USER_HANDLE } from '@/lib/userProfiles';

const FALLBACK_VIEWS = ['32.5K', '9,696', '272K', '401K', '36.7K', '40.9K'];

const normalizeHandle = (handle: string) => {
  const trimmed = handle.trim();
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

export const getPostsByHandle = (handle: string) => {
  const normalized = normalizeHandle(handle);
  const posts = USER_POSTS.filter((post) => post.handle === normalized);

  if (posts.length > 0) return posts;

  if (normalized === CURRENT_USER_HANDLE) return [];

  return FALLBACK_VIEWS.map((views, index) => ({
    id: `${normalized}-${index}`,
    image: USER_POSTS[index % USER_POSTS.length].image,
    alt: 'Post',
    handle: normalized,
    views,
  }));
};
