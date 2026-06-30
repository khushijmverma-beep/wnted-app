'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  CreditCard,
  HelpCircle,
  Lock,
  Mail,
  Moon,
  PiggyBank,
  Plus,
  Search,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import styles from '@/components/altDesign.module.css';
import AltSwipeDeck, { type AltSwipeItem } from '@/components/AltSwipeDeck';

type AltTab = 'home' | 'wishlist' | 'add' | 'activity' | 'profile';
type WishlistFilter = 'all' | 'pinned' | 'shared';
type OnboardingStep = 0 | 1 | 2 | 3;
type AddStep = 1 | 2 | 3;
type Overlay =
  | null
  | 'goal'
  | 'milestone'
  | 'stars'
  | 'leaderboard'
  | 'discovery'
  | 'campus'
  | 'success'
  | 'reminders'
  | 'settings'
  | 'appearance'
  | 'account'
  | 'notifications'
  | 'privacy'
  | 'support';

type ActivityFilter = 'All' | 'Price drops' | 'Reminders';

type Goal = {
  id: string;
  name: string;
  price: number;
  saved: number;
  image: string;
  pinned?: boolean;
  shared?: boolean;
  drop?: string;
};

const INITIAL_GOALS: Goal[] = [
  {
    id: 'jordan',
    name: 'Air Jordan 4 Retro',
    price: 210,
    saved: 120,
    image: '/pinned/jordan-4.png',
    pinned: true,
    shared: true,
    drop: 'Price dropped 14%',
  },
  {
    id: 'macbook',
    name: 'iPad Pro',
    price: 999,
    saved: 240,
    image: '/pinned/ipad-case.png',
    pinned: true,
    shared: true,
  },
  {
    id: 'headphones',
    name: 'Bose Headphones',
    price: 449,
    saved: 49,
    image: '/pinned/bose-headphones.png',
    pinned: true,
  },
  {
    id: 'camera',
    name: 'iPhone Pro',
    price: 850,
    saved: 689,
    image: '/pinned/iphone.png',
    pinned: true,
  },
];

const PINNED_LABELS: Record<string, string> = {
  jordan: 'Jordan 4',
  macbook: 'iPad',
  headphones: 'Bose Headphones',
  camera: 'iPhone',
};

const HOME_PINNED_GOAL_IDS = ['jordan', 'macbook', 'headphones', 'camera'] as const;

const TOP_PICK_OPTIONS = [
  { id: 'buds', name: 'Earbuds', price: 129, image: '/AirpodProMax.png', pinClass: 'pinSpan20' },
  { id: 'bag', name: 'Backpack', price: 89, image: '/BotegaBag.png', pinClass: 'pinSpan30' },
  { id: 'ipad', name: 'iPad', price: 799, image: '/pinned/ipad-case.png', pinClass: 'pinSpan24' },
  { id: 'dyson', name: 'Dyson', price: 499, image: '/dyson.png', pinClass: 'pinSpan18' },
  { id: 'jordan', name: 'Jordan 4', price: 210, image: '/pinned/jordan-4.png', pinClass: 'pinSpanWide' },
  { id: 'headphones', name: 'Bose Headphones', price: 449, image: '/pinned/bose-headphones.png', pinClass: 'pinSpan28' },
  { id: 'macbook', name: 'MacBook', price: 999, image: '/macBook.png', pinClass: 'pinSpan22' },
  { id: 'nike', name: 'Nike Dunks', price: 110, image: '/Nike.png', pinClass: 'pinSpan18' },
  { id: 'perfume', name: 'YSL Perfume', price: 135, image: '/LoweaPerfume.png', pinClass: 'pinSpan24' },
  { id: 'ps5', name: 'PlayStation 5', price: 499, image: '/Ps5.png', pinClass: 'pinSpan20' },
  { id: 'leggings', name: 'Lulu Leggings', price: 98, image: '/LuLuLeggings.png', pinClass: 'pinSpan18' },
  { id: 'airmax', name: 'AirPods Max', price: 549, image: '/AirpodMax.png', pinClass: 'pinSpan30' },
] as const;

const POPULAR = TOP_PICK_OPTIONS.slice(0, 4);

const DISCOVER_ITEMS: AltSwipeItem[] = [
  {
    id: 'jordan',
    name: 'Air Jordan 4 Retro',
    price: 210,
    image: '/GreenSambas.png',
    handle: '@alexkicks',
    caption: 'these green sambas for every outfit this summer',
    socialProof: 'Popular at Berkeley · Saved by 73 students',
  },
  {
    id: 'headphones',
    name: 'Sony Headphones',
    price: 449,
    image: '/headphone.png',
    handle: '@audiophile',
    caption: 'saving up every week until they’re mine',
    socialProof: 'Saved by 410 students',
  },
  {
    id: 'macbook',
    name: 'MacBook Air M2',
    price: 999,
    image: '/macBook.png',
    handle: '@devsaves',
    caption: 'senior year edits need this',
    socialProof: 'Trending on campus',
  },
  {
    id: 'dyson',
    name: 'Dyson Airwrap',
    price: 499,
    image: '/dyson.png',
    handle: '@zoebeauty',
    caption: 'birthday treat if i stay on track',
    socialProof: 'Saved by 4.1K students',
  },
  {
    id: 'ipad',
    name: 'iPad Pro',
    price: 799,
    image: '/IpadPro.png',
    handle: '@noahcreates',
    caption: 'digital planning + notes upgrade',
    socialProof: 'Popular for studying',
  },
  {
    id: 'buds',
    name: 'AirPods Pro',
    price: 249,
    image: '/AirpodProMax.png',
    handle: '@maya.studies',
    caption: 'library sessions need noise canceling',
    socialProof: 'Saved by 623 students',
  },
];

type LeaderboardEntry = {
  rank: number;
  name: string;
  stars: number;
  saved: number;
  streak: number;
  rankChange: number;
  color?: string;
  highlight?: boolean;
  handle: string;
};

const CAMPUSES = [
  { id: 'berkeley', name: 'UC Berkeley', shortName: 'Berkeley', students: 1284 },
  { id: 'ucla', name: 'UCLA', shortName: 'UCLA', students: 2103 },
  { id: 'usc', name: 'USC', shortName: 'USC', students: 987 },
  { id: 'stanford', name: 'Stanford', shortName: 'Stanford', students: 756 },
  { id: 'nyu', name: 'NYU', shortName: 'NYU', students: 1542 },
] as const;

type CampusId = (typeof CAMPUSES)[number]['id'];

const CAMPUS_LEADERBOARDS: Record<CampusId, LeaderboardEntry[]> = {
  berkeley: [
    { rank: 1, name: 'Emma', handle: '@emma.saves', stars: 210, saved: 1240, streak: 14, rankChange: 1, color: '#A5B4FC' },
    { rank: 2, name: 'Noah', handle: '@noahcreates', stars: 198, saved: 1180, streak: 11, rankChange: -1, color: '#FF6B9D' },
    { rank: 3, name: 'Ava', handle: '@ava.style', stars: 176, saved: 990, streak: 9, rankChange: 2, color: '#B9C0CC' },
    { rank: 4, name: 'Liam', handle: '@liam.kicks', stars: 162, saved: 860, streak: 8, rankChange: 0 },
    { rank: 5, name: 'Mia', handle: '@mia.studies', stars: 151, saved: 740, streak: 7, rankChange: 1 },
    { rank: 6, name: 'You', handle: '@emma.saves', stars: 138, saved: 1230, streak: 8, rankChange: 2, highlight: true },
    { rank: 7, name: 'Zoe', handle: '@zoebeauty', stars: 121, saved: 620, streak: 6, rankChange: -2 },
    { rank: 8, name: 'Jay', handle: '@jay.fits', stars: 109, saved: 540, streak: 5, rankChange: 0 },
    { rank: 9, name: 'Sofia', handle: '@sofia.notes', stars: 98, saved: 480, streak: 4, rankChange: 3 },
    { rank: 10, name: 'Ethan', handle: '@ethan.tech', stars: 91, saved: 410, streak: 3, rankChange: -1 },
  ],
  ucla: [
    { rank: 1, name: 'Chloe', handle: '@chloe.la', stars: 245, saved: 1420, streak: 16, rankChange: 2, color: '#A5B4FC' },
    { rank: 2, name: 'Marcus', handle: '@marcus.bruins', stars: 228, saved: 1310, streak: 12, rankChange: 0, color: '#FF6B9D' },
    { rank: 3, name: 'Priya', handle: '@priya.save', stars: 201, saved: 1150, streak: 10, rankChange: 1, color: '#B9C0CC' },
    { rank: 4, name: 'Tyler', handle: '@tyler.west', stars: 184, saved: 980, streak: 9, rankChange: -1 },
    { rank: 5, name: 'Nina', handle: '@nina.dreams', stars: 167, saved: 870, streak: 8, rankChange: 1 },
    { rank: 6, name: 'You', handle: '@emma.saves', stars: 138, saved: 1230, streak: 8, rankChange: 0, highlight: true },
    { rank: 7, name: 'Omar', handle: '@omar.la', stars: 132, saved: 760, streak: 7, rankChange: 2 },
    { rank: 8, name: 'Hannah', handle: '@hannah.goals', stars: 118, saved: 690, streak: 6, rankChange: -2 },
    { rank: 9, name: 'Leo', handle: '@leo.save', stars: 104, saved: 580, streak: 5, rankChange: 1 },
    { rank: 10, name: 'Ruby', handle: '@ruby.shop', stars: 96, saved: 520, streak: 4, rankChange: 0 },
  ],
  usc: [
    { rank: 1, name: 'Isabella', handle: '@bella.usc', stars: 232, saved: 1380, streak: 15, rankChange: 1, color: '#A5B4FC' },
    { rank: 2, name: 'Daniel', handle: '@daniel.trojan', stars: 214, saved: 1210, streak: 13, rankChange: -1, color: '#FF6B9D' },
    { rank: 3, name: 'Grace', handle: '@grace.goals', stars: 189, saved: 1040, streak: 10, rankChange: 2, color: '#B9C0CC' },
    { rank: 4, name: 'Chris', handle: '@chris.usc', stars: 171, saved: 920, streak: 8, rankChange: 0 },
    { rank: 5, name: 'Amira', handle: '@amira.save', stars: 158, saved: 810, streak: 7, rankChange: 1 },
    { rank: 6, name: 'You', handle: '@emma.saves', stars: 138, saved: 1230, streak: 8, rankChange: 3, highlight: true },
    { rank: 7, name: 'Jack', handle: '@jack.fits', stars: 126, saved: 700, streak: 6, rankChange: -2 },
    { rank: 8, name: 'Lily', handle: '@lily.wants', stars: 112, saved: 640, streak: 5, rankChange: 0 },
    { rank: 9, name: 'Ryan', handle: '@ryan.tech', stars: 99, saved: 560, streak: 4, rankChange: 1 },
    { rank: 10, name: 'Elena', handle: '@elena.shop', stars: 88, saved: 470, streak: 3, rankChange: -1 },
  ],
  stanford: [
    { rank: 1, name: 'Alice', handle: '@alice.stanford', stars: 256, saved: 1510, streak: 18, rankChange: 0, color: '#A5B4FC' },
    { rank: 2, name: 'Ben', handle: '@ben.tree', stars: 221, saved: 1290, streak: 14, rankChange: 1, color: '#FF6B9D' },
    { rank: 3, name: 'Cara', handle: '@cara.save', stars: 198, saved: 1120, streak: 11, rankChange: -1, color: '#B9C0CC' },
    { rank: 4, name: 'David', handle: '@david.goals', stars: 176, saved: 950, streak: 9, rankChange: 2 },
    { rank: 5, name: 'Ella', handle: '@ella.notes', stars: 163, saved: 880, streak: 8, rankChange: 0 },
    { rank: 6, name: 'You', handle: '@emma.saves', stars: 138, saved: 1230, streak: 8, rankChange: 1, highlight: true },
    { rank: 7, name: 'Finn', handle: '@finn.stanford', stars: 129, saved: 720, streak: 7, rankChange: -1 },
    { rank: 8, name: 'Gina', handle: '@gina.wants', stars: 115, saved: 650, streak: 6, rankChange: 2 },
    { rank: 9, name: 'Hugo', handle: '@hugo.tech', stars: 102, saved: 590, streak: 5, rankChange: 0 },
    { rank: 10, name: 'Ivy', handle: '@ivy.shop', stars: 94, saved: 500, streak: 4, rankChange: -2 },
  ],
  nyu: [
    { rank: 1, name: 'Julia', handle: '@julia.nyc', stars: 238, saved: 1360, streak: 15, rankChange: 2, color: '#A5B4FC' },
    { rank: 2, name: 'Kai', handle: '@kai.save', stars: 219, saved: 1250, streak: 12, rankChange: 0, color: '#FF6B9D' },
    { rank: 3, name: 'Luna', handle: '@luna.goals', stars: 192, saved: 1080, streak: 10, rankChange: 1, color: '#B9C0CC' },
    { rank: 4, name: 'Max', handle: '@max.nyu', stars: 174, saved: 940, streak: 9, rankChange: -1 },
    { rank: 5, name: 'Nora', handle: '@nora.shop', stars: 159, saved: 830, streak: 7, rankChange: 1 },
    { rank: 6, name: 'You', handle: '@emma.saves', stars: 138, saved: 1230, streak: 8, rankChange: 0, highlight: true },
    { rank: 7, name: 'Oscar', handle: '@oscar.nyc', stars: 124, saved: 710, streak: 6, rankChange: 2 },
    { rank: 8, name: 'Paige', handle: '@paige.wants', stars: 111, saved: 630, streak: 5, rankChange: -2 },
    { rank: 9, name: 'Quinn', handle: '@quinn.save', stars: 97, saved: 550, streak: 4, rankChange: 1 },
    { rank: 10, name: 'Rosa', handle: '@rosa.goals', stars: 89, saved: 490, streak: 3, rankChange: 0 },
  ],
};

const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Sienna', handle: '@sienna.global', stars: 412, saved: 2840, streak: 24, rankChange: 1, color: '#A5B4FC' },
  { rank: 2, name: 'Marco', handle: '@marco.save', stars: 388, saved: 2610, streak: 21, rankChange: -1, color: '#FF6B9D' },
  { rank: 3, name: 'Yuki', handle: '@yuki.goals', stars: 356, saved: 2390, streak: 19, rankChange: 2, color: '#B9C0CC' },
  { rank: 4, name: 'Aaliyah', handle: '@aaliyah.wants', stars: 331, saved: 2180, streak: 17, rankChange: 0 },
  { rank: 5, name: 'Theo', handle: '@theo.shop', stars: 298, saved: 1940, streak: 15, rankChange: 1 },
  { rank: 6, name: 'Camila', handle: '@camila.save', stars: 276, saved: 1820, streak: 14, rankChange: -2 },
  { rank: 7, name: 'Jin', handle: '@jin.global', stars: 254, saved: 1710, streak: 13, rankChange: 1 },
  { rank: 8, name: 'Freya', handle: '@freya.goals', stars: 231, saved: 1580, streak: 12, rankChange: 0 },
  { rank: 9, name: 'Andre', handle: '@andre.save', stars: 214, saved: 1460, streak: 11, rankChange: 2 },
  { rank: 10, name: 'You', handle: '@emma.saves', stars: 138, saved: 1230, streak: 8, rankChange: 4, highlight: true },
  { rank: 11, name: 'Nadia', handle: '@nadia.wants', stars: 132, saved: 1190, streak: 9, rankChange: -1 },
  { rank: 12, name: 'Felix', handle: '@felix.shop', stars: 126, saved: 1120, streak: 8, rankChange: 0 },
];

type CampusCategory = 'All' | 'Sneakers' | 'Tech' | 'Beauty' | 'Lifestyle';

const CAMPUS_TRENDING = [
  {
    id: 'jordan',
    name: 'Air Jordan 4 Retro',
    image: '/pinned/jordan-4.png',
    price: 210,
    saves: 73,
    rank: 1,
    change: '+18%',
    category: 'Sneakers' as const,
    weeklySaves: 12,
    avgWeekly: 24,
  },
  {
    id: 'dyson',
    name: 'Dyson Airwrap',
    image: '/dyson.png',
    price: 499,
    saves: 42,
    rank: 2,
    change: '+24%',
    category: 'Beauty' as const,
    weeklySaves: 9,
    avgWeekly: 18,
  },
  {
    id: 'macbook',
    name: 'MacBook Air M2',
    image: '/macBook.png',
    price: 999,
    saves: 38,
    rank: 3,
    change: '+11%',
    category: 'Tech' as const,
    weeklySaves: 7,
    avgWeekly: 32,
  },
  {
    id: 'headphones',
    name: 'Bose Headphones',
    image: '/pinned/bose-headphones.png',
    price: 449,
    saves: 31,
    rank: 4,
    change: '+8%',
    category: 'Tech' as const,
    weeklySaves: 5,
    avgWeekly: 15,
  },
  {
    id: 'nike',
    name: 'Nike Dunks',
    image: '/Nike.png',
    price: 110,
    saves: 28,
    rank: 5,
    change: '+15%',
    category: 'Sneakers' as const,
    weeklySaves: 6,
    avgWeekly: 12,
  },
  {
    id: 'leggings',
    name: 'Lulu Leggings',
    image: '/LuLuLeggings.png',
    price: 98,
    saves: 24,
    rank: 6,
    change: '+6%',
    category: 'Lifestyle' as const,
    weeklySaves: 4,
    avgWeekly: 10,
  },
];

const CAMPUS_SAVERS = [
  {
    name: 'Noah',
    handle: '@noahcreates',
    goalId: 'macbook',
    goal: 'MacBook Air M2',
    image: '/macBook.png',
    percent: 67,
    saved: 670,
    weekly: 32,
    dorm: 'Unit 2',
  },
  {
    name: 'Ava',
    handle: '@ava.style',
    goalId: 'dyson',
    goal: 'Dyson Airwrap',
    image: '/dyson.png',
    percent: 54,
    saved: 270,
    weekly: 22,
    dorm: 'Foothill',
  },
  {
    name: 'Liam',
    handle: '@liam.kicks',
    goalId: 'jordan',
    goal: 'Air Jordan 4 Retro',
    image: '/pinned/jordan-4.png',
    percent: 81,
    saved: 170,
    weekly: 18,
    dorm: 'Clark Kerr',
  },
  {
    name: 'Mia',
    handle: '@mia.studies',
    goalId: 'ipad',
    goal: 'iPad Pro',
    image: '/pinned/ipad-case.png',
    percent: 43,
    saved: 344,
    weekly: 28,
    dorm: 'Unit 3',
  },
  {
    name: 'Zoe',
    handle: '@zoebeauty',
    goalId: 'headphones',
    goal: 'Bose Headphones',
    image: '/pinned/bose-headphones.png',
    percent: 29,
    saved: 130,
    weekly: 14,
    dorm: 'Unit 1',
  },
];

const CAMPUS_DORMS = [
  { name: 'Unit 2', savers: 186, topItem: 'MacBook Air M2' },
  { name: 'Foothill', savers: 142, topItem: 'Dyson Airwrap' },
  { name: 'Unit 3', savers: 128, topItem: 'iPad Pro' },
];

const ACTIVITY_FEED = [
  {
    id: 'drop-jordan',
    kind: 'price_drop' as const,
    title: 'Air Jordan 4 Retro dropped 10%',
    body: 'Now $189 — $21 closer to your goal',
    time: '2h ago',
    goalId: 'jordan',
  },
  {
    id: 'drop-headphones',
    kind: 'price_drop' as const,
    title: 'Sony Headphones price alert',
    body: 'Down to $399 on Amazon',
    time: '6h ago',
    goalId: 'headphones',
  },
  {
    id: 'reminder-deposit',
    kind: 'reminder' as const,
    title: "Don't ghost your goals",
    body: 'Even $5 today keeps your 8-day streak alive',
    time: 'Today',
  },
  {
    id: 'contrib-noah',
    kind: 'social' as const,
    title: 'Noah contributed $15',
    body: 'to your Air Jordan 4 Retro goal',
    time: 'Yesterday',
    goalId: 'jordan',
  },
  {
    id: 'milestone-macbook',
    kind: 'milestone' as const,
    title: '62% milestone reached',
    body: 'MacBook Air M2 — you’re past halfway',
    time: '2d ago',
    goalId: 'macbook',
  },
  {
    id: 'campus-trend',
    kind: 'trend' as const,
    title: 'Campus trend: Dyson Airwrap',
    body: 'Saved by 42 students at Berkeley this week',
    time: '3d ago',
  },
];

function pct(saved: number, price: number) {
  return Math.min(100, Math.round((saved / price) * 100));
}

function money(n: number) {
  return `$${n.toLocaleString('en-US')}`;
}

function runCelebrationConfetti(
  container: HTMLElement,
  event?: { clientX: number; clientY: number }
) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '200';
  container.appendChild(canvas);

  const fire = confetti.create(canvas, { resize: true, useWorker: true });
  const rect = container.getBoundingClientRect();
  const origin = event
    ? {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      }
    : { x: 0.5, y: 0.42 };

  const colors = ['#A5B4FC', '#E8ECFF', '#FFD76A', '#FF6B9D', '#3BB273', '#FFFFFF'];

  fire({
    particleCount: 90,
    spread: 100,
    startVelocity: 42,
    origin,
    colors,
    shapes: ['star', 'circle', 'square'],
    scalar: 1.05,
  });

  fire({
    particleCount: 60,
    spread: 130,
    startVelocity: 36,
    origin: { x: origin.x, y: Math.max(0.12, origin.y - 0.08) },
    colors,
    ticks: 220,
    gravity: 0.9,
  });

  window.setTimeout(() => {
    fire({
      particleCount: 40,
      spread: 80,
      startVelocity: 28,
      origin: { x: 0.5, y: 0.35 },
      colors,
      shapes: ['star'],
    });
  }, 180);

  window.setTimeout(() => canvas.remove(), 2200);
}

function runStarConfetti(container: HTMLElement) {
  runCelebrationConfetti(container);
}

export default function AltDesignApp() {
  const shellRef = useRef<HTMLDivElement>(null);
  const successConfettiFired = useRef(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(0);
  const [tab, setTab] = useState<AltTab>('home');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [addStep, setAddStep] = useState<AddStep>(1);
  const [wishlistFilter, setWishlistFilter] = useState<WishlistFilter>('all');
  const [goalItems, setGoalItems] = useState<Goal[]>(INITIAL_GOALS);
  const [selectedGoalId, setSelectedGoalId] = useState(INITIAL_GOALS[0].id);
  const [stars, setStars] = useState(138);
  const [streak] = useState(8);
  const [totalSaved, setTotalSaved] = useState(1230);
  const [pickedTop4, setPickedTop4] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [weeklyReminders, setWeeklyReminders] = useState(true);
  const [savingsNudges, setSavingsNudges] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);
  const [campusVisible, setCampusVisible] = useState(true);
  const [campusFilter, setCampusFilter] = useState<CampusCategory>('All');
  const [leaderboardTab, setLeaderboardTab] = useState<'campus' | 'global'>('campus');
  const [selectedCampusId, setSelectedCampusId] = useState<CampusId>('berkeley');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('All');
  const [selectedAddItemId, setSelectedAddItemId] = useState(POPULAR[0].id);
  const [starBursts, setStarBursts] = useState<
    { id: number; x: number; y: number; amount: number }[]
  >([]);

  const shellClass = `${styles.shell} ${darkMode ? styles.shellDark : ''}`;
  const mutedText = 'text-[var(--alt-muted)]';

  const goals = useMemo(
    () =>
      goalItems.map((goal) => ({
        ...goal,
        percent: pct(goal.saved, goal.price),
      })),
    [goalItems]
  );

  const selectedGoal = useMemo(() => {
    const goal = goals.find((g) => g.id === selectedGoalId) ?? goals[0];
    const initial = INITIAL_GOALS.find((g) => g.id === goal.id);
    return {
      ...goal,
      image: initial?.image ?? goal.image,
      name: initial?.name ?? goal.name,
    };
  }, [goals, selectedGoalId]);

  const filteredGoals = useMemo(() => {
    if (wishlistFilter === 'pinned') return goals.filter((g) => g.pinned);
    if (wishlistFilter === 'shared') return goals.filter((g) => g.shared);
    return goals;
  }, [goals, wishlistFilter]);

  const filteredCampusTrending = useMemo(() => {
    if (campusFilter === 'All') return CAMPUS_TRENDING;
    return CAMPUS_TRENDING.filter((item) => item.category === campusFilter);
  }, [campusFilter]);

  const featuredCampusItem = filteredCampusTrending[0] ?? CAMPUS_TRENDING[0];

  const selectedCampus = useMemo(
    () => CAMPUSES.find((campus) => campus.id === selectedCampusId) ?? CAMPUSES[0],
    [selectedCampusId]
  );

  const activeLeaderboard = useMemo(() => {
    const source =
      leaderboardTab === 'global'
        ? GLOBAL_LEADERBOARD
        : CAMPUS_LEADERBOARDS[selectedCampusId];
    return source.map((entry) =>
      entry.highlight ? { ...entry, stars, saved: totalSaved } : entry
    );
  }, [leaderboardTab, selectedCampusId, stars, totalSaved]);

  const yourLeaderboardEntry = useMemo(
    () => activeLeaderboard.find((entry) => entry.highlight),
    [activeLeaderboard]
  );

  const filteredActivity = useMemo(() => {
    if (activityFilter === 'Price drops') {
      return ACTIVITY_FEED.filter((item) => item.kind === 'price_drop');
    }
    if (activityFilter === 'Reminders') {
      return ACTIVITY_FEED.filter((item) => item.kind === 'reminder');
    }
    return ACTIVITY_FEED;
  }, [activityFilter]);

  const toggleGoalPinned = (goalId: string) => {
    setGoalItems((items) =>
      items.map((item) =>
        item.id === goalId ? { ...item, pinned: !item.pinned } : item
      )
    );
  };

  const pinnedHomeGoals = useMemo(
    () =>
      HOME_PINNED_GOAL_IDS.map((id) => {
        const initial = INITIAL_GOALS.find((g) => g.id === id);
        const goal = goals.find((g) => g.id === id);
        if (!initial) return null;
        const saved = goal?.saved ?? initial.saved;
        const price = goal?.price ?? initial.price;
        return {
          ...initial,
          ...goal,
          image: initial.image,
          name: initial.name,
          saved,
          price,
          percent: pct(saved, price),
        };
      }).filter((goal): goal is NonNullable<typeof goal> => goal !== null),
    [goals]
  );

  const triggerStars = useCallback(
    (amount: number, event?: React.MouseEvent | { clientX: number; clientY: number }) => {
    setStars((s) => s + amount);
    const rect = shellRef.current?.getBoundingClientRect();
    if (rect && event) {
      const id = Date.now();
      setStarBursts((prev) => [
        ...prev,
        {
          id,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          amount,
        },
      ]);
      window.setTimeout(() => {
        setStarBursts((prev) => prev.filter((b) => b.id !== id));
      }, 1100);
    }
    if (shellRef.current) runStarConfetti(shellRef.current);
  }, []);

  const handleDiscoverWant = useCallback(
    (item: AltSwipeItem, event?: { clientX: number; clientY: number }) => {
      triggerStars(3, event);
      setGoalItems((prev) => {
        const existing = prev.find((goal) => goal.id === item.id);
        if (existing) {
          return prev.map((goal) =>
            goal.id === item.id ? { ...goal, pinned: true } : goal
          );
        }
        return [
          ...prev,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            saved: 0,
            image: item.image,
            pinned: true,
          },
        ];
      });
    },
    [triggerStars]
  );

  const openGoal = (id: string) => {
    setSelectedGoalId(id);
    setOverlay('goal');
  };

  const openCampusGoal = (id: string) => {
    const campusItem = CAMPUS_TRENDING.find((item) => item.id === id);
    const pick = TOP_PICK_OPTIONS.find((option) => option.id === id);
    const existing = goalItems.find((goal) => goal.id === id);

    if (!existing && (campusItem || pick)) {
      const source = campusItem ?? pick!;
      setGoalItems((prev) => [
        ...prev,
        {
          id: source.id,
          name: source.name,
          price: source.price,
          saved: 0,
          image: source.image,
        },
      ]);
    }

    openGoal(id);
  };

  const addMoney = (event: React.MouseEvent) => {
    const goal = goals.find((g) => g.id === selectedGoalId);
    if (!goal) return;
    const nextSaved = Math.min(goal.price, goal.saved + 30);
    setGoalItems((items) =>
      items.map((item) =>
        item.id === selectedGoalId ? { ...item, saved: nextSaved } : item
      )
    );
    setTotalSaved((t) => t + 30);
    triggerStars(5, event);
    if (pct(nextSaved, goal.price) >= 86) {
      setOverlay('milestone');
    }
    if (nextSaved >= goal.price) {
      setOverlay('success');
    }
  };

  useEffect(() => {
    if (tab === 'add') setAddStep(1);
  }, [tab]);

  useEffect(() => {
    if (onboardingStep !== 3 || onboardingDone) return;

    const timer = window.setTimeout(() => {
      if (!shellRef.current || successConfettiFired.current) return;
      successConfettiFired.current = true;
      runCelebrationConfetti(shellRef.current);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [onboardingDone, onboardingStep]);

  const finishOnboarding = () => {
    setGoalItems((prev) => {
      const byId = new Map(prev.map((goal) => [goal.id, goal]));

      for (const id of HOME_PINNED_GOAL_IDS) {
        const initial = INITIAL_GOALS.find((goal) => goal.id === id);
        if (!initial) continue;
        byId.set(id, { ...initial, ...byId.get(id), pinned: true });
      }

      for (const pickId of pickedTop4) {
        const pick = TOP_PICK_OPTIONS.find((option) => option.id === pickId);
        if (!pick) continue;
        const existing = byId.get(pickId);
        byId.set(
          pickId,
          existing
            ? { ...existing, pinned: true }
            : {
                id: pick.id,
                name: pick.name,
                price: pick.price,
                image: pick.image,
                saved: 0,
                pinned: true,
              }
        );
      }

      return Array.from(byId.values());
    });

    setOnboardingDone(true);
    setTab('home');
  };

  const renderSettingsHeader = (title: string, onBack: () => void) => (
    <div className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-[52px]">
      <button
        type="button"
        onClick={onBack}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]"
      >
        <ChevronLeft size={22} />
      </button>
      <span className="text-[18px] font-semibold">{title}</span>
    </div>
  );

  const renderSettingsToggle = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    enabled: boolean,
    onToggle: () => void
  ) => (
    <div className={`${styles.settingsRow} cursor-default`}>
      <div className={styles.settingsRowInner}>
        <span className="text-[var(--alt-blue-text)]">{icon}</span>
        <div className={styles.settingsRowCopy}>
          <p className="font-semibold">{title}</p>
          <p className={`text-[13px] ${mutedText}`}>{subtitle}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`${styles.toggleTrack} cursor-pointer border-none p-0 ${enabled ? styles.toggleTrackOn : ''}`}
      >
        <span className={`${styles.toggleThumb} ${enabled ? styles.toggleThumbOn : ''}`} />
      </button>
    </div>
  );

  const renderSettingsLink = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    onClick: () => void,
    meta?: string
  ) => (
    <button type="button" onClick={onClick} className={styles.settingsRow}>
      <div className={styles.settingsRowInner}>
        <span className="text-[var(--alt-blue-text)]">{icon}</span>
        <div className={styles.settingsRowCopy}>
          <p className="font-semibold">{title}</p>
          <p className={`text-[13px] ${mutedText}`}>{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {meta && <span className={styles.settingsMeta}>{meta}</span>}
        <ChevronRight size={18} className="text-[var(--alt-muted)]" />
      </div>
    </button>
  );

  if (!onboardingDone) {
    return (
      <div ref={shellRef} className={`absolute inset-0 z-[105] flex flex-col ${shellClass}`}>
        <div className="flex shrink-0 items-center justify-end px-4 pb-2 pt-[52px]">
          <button
            type="button"
            onClick={finishOnboarding}
            className="cursor-pointer border-none bg-transparent text-[13px] font-medium text-[var(--alt-muted)]"
          >
            Skip
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-6 pb-8">
          {onboardingStep === 0 && (
            <>
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className={`${styles.onboardingHero} mb-8`}>
                  <Image
                    src="/onboarding/welcome.png"
                    alt=""
                    width={320}
                    height={320}
                    className={styles.onboardingImage}
                    priority
                  />
                </div>
                <h1 className="max-w-[280px] text-[28px] font-semibold leading-tight">
                  This is where &quot;I wish&quot; becomes &quot;I got it.&quot;
                </h1>
              </div>
              <button type="button" className={styles.primaryBtn} onClick={() => setOnboardingStep(1)}>
                Let&apos;s Go →
              </button>
            </>
          )}

          {onboardingStep === 1 && (
            <>
              <div className="flex flex-1 flex-col items-center justify-center">
                <div className={`${styles.onboardingDiscoveryWrap} mb-6`}>
                  <Image
                    src="/onboarding/discovery.png"
                    alt=""
                    width={300}
                    height={360}
                    className={styles.onboardingImage}
                    priority
                  />
                  <button
                    type="button"
                    aria-label="Skip item"
                    className={`${styles.onboardingChoiceBtn} ${styles.onboardingChoiceBtnSkip}`}
                    onClick={() => setOnboardingStep(2)}
                  />
                  <button
                    type="button"
                    aria-label="Like item"
                    className={`${styles.onboardingChoiceBtn} ${styles.onboardingChoiceBtnWant}`}
                    onClick={(e) => {
                      handleDiscoverWant(DISCOVER_ITEMS[1], {
                        clientX: e.clientX,
                        clientY: e.clientY,
                      });
                    }}
                  />
                </div>
                <h1 className="max-w-[280px] text-center text-[28px] font-semibold leading-tight">
                  Find your next obsession.
                </h1>
              </div>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setOnboardingStep(2)}
              >
                Keep Going →
              </button>
            </>
          )}

          {onboardingStep === 2 && (
            <div className="flex min-h-0 flex-1 flex-col">
              <h1 className="mb-3 shrink-0 text-center text-[24px] font-semibold">Pick your Top 4.</h1>
              <div className={`${styles.pinBoard} ${styles.scroll} min-h-0 flex-1 overflow-y-auto pb-4`}>
                {TOP_PICK_OPTIONS.map((item) => {
                  const selected = pickedTop4.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setPickedTop4((prev) =>
                          selected
                            ? prev.filter((id) => id !== item.id)
                            : prev.length < 4
                              ? [...prev, item.id]
                              : prev
                        )
                      }
                      className={`${styles.pinCard} ${styles[item.pinClass]} cursor-pointer border-none text-left`}
                      style={{
                        outline: selected ? '2px solid var(--alt-blue)' : '1px solid var(--alt-border)',
                      }}
                    >
                      <div className={styles.pinImage}>
                        <Image src={item.image} alt="" fill className="object-cover" sizes="180px" />
                      </div>
                      <div className={styles.pinMeta}>
                        <p className="truncate text-[11px] font-semibold leading-tight">{item.name}</p>
                        <p className="text-[10px] text-[#8b90a0]">{money(item.price)}</p>
                      </div>
                      <span
                        className={styles.pinBadge}
                        style={{
                          background: selected ? 'var(--alt-blue)' : '#d0d7de',
                          color: selected ? 'var(--alt-blue-text)' : '#fff',
                        }}
                      >
                        {selected ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mb-2 shrink-0 text-center text-[12px] text-[#8b90a0]">
                {pickedTop4.length}/4 selected
              </p>
              <button
                type="button"
                className={`${styles.primaryBtn} shrink-0`}
                disabled={pickedTop4.length < 4}
                onClick={() => setOnboardingStep(3)}
                style={{ opacity: pickedTop4.length < 4 ? 0.45 : 1 }}
              >
                Next →
              </button>
            </div>
          )}

          {onboardingStep === 3 && (
            <>
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className={`${styles.onboardingHero} mb-8`}>
                  <Image
                    src="/onboarding/success.png"
                    alt=""
                    width={320}
                    height={320}
                    className={styles.onboardingImage}
                  />
                </div>
                <h1 className="max-w-[280px] text-[28px] font-semibold leading-tight">
                  You&apos;re officially in your saving era.
                </h1>
              </div>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={finishOnboarding}
              >
                Build My Wishlist
              </button>
            </>
          )}

          <div className={`${styles.dotRow} mt-5`}>
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                onClick={() => setOnboardingStep(i as OnboardingStep)}
                className="cursor-pointer border-none bg-transparent p-0"
              >
                <span
                  className={`${styles.dot} ${onboardingStep === i ? styles.dotActive : ''}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={shellRef} className={`absolute inset-0 z-[105] flex flex-col ${shellClass}`}>
      <div className={`min-h-0 flex-1 overflow-y-auto ${styles.scroll} pb-[88px]`}>
        {tab === 'home' && (
          <div className="px-5 pb-4 pt-[64px]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] font-medium">Hey Emma</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTab('activity')}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)] shadow-sm"
                >
                  <Bell size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setTab('profile')}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-blue-soft)] text-[13px] font-semibold text-[var(--alt-blue-text)]"
                >
                  EM
                </button>
              </div>
            </div>

            <h1 className="text-[26px] font-semibold leading-tight">You&apos;re in your saving era.</h1>
            <p className={`mt-2 text-[14px] leading-[1.45] ${mutedText}`}>
              You&apos;re $18 closer than yesterday. That&apos;s kinda iconic.
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setOverlay('stars')}
                className={`${styles.statPill} cursor-pointer border-none`}
              >
                <p className="flex items-center justify-center gap-1 text-[18px] font-semibold">
                  {stars}
                  <Star size={16} className="text-[#f5b301]" fill="#f5b301" />
                </p>
                <p className={`mt-0.5 text-[11px] ${mutedText}`}>Stars</p>
              </button>
              <button
                type="button"
                onClick={() => setOverlay('reminders')}
                className={`${styles.statPill} cursor-pointer border-none`}
              >
                <p className="text-[18px] font-semibold">{streak}-day</p>
                <p className={`mt-0.5 text-[11px] ${mutedText}`}>streak</p>
              </button>
              <button
                type="button"
                onClick={() => setTab('activity')}
                className={`${styles.statPill} cursor-pointer border-none`}
              >
                <p className="text-[18px] font-semibold">$48</p>
                <p className={`mt-0.5 text-[11px] ${mutedText}`}>Saved this week</p>
              </button>
            </div>

            <div className="mb-3 mt-6 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold">Pinned Goals</h2>
              <button
                type="button"
                onClick={() => setTab('wishlist')}
                className="cursor-pointer border-none bg-transparent text-[13px] font-semibold text-[var(--alt-blue-text)]"
              >
                See all
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {pinnedHomeGoals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => openGoal(goal.id)}
                    className={`${styles.pinnedGoalCard} cursor-pointer border-none p-3 text-left`}
                  >
                    <div className="relative mb-3 h-[100px] w-full overflow-hidden rounded-[14px] bg-[var(--alt-image-bg)]">
                      <Image src={goal.image} alt="" fill className="object-cover" sizes="160px" />
                    </div>
                    <p className="text-[14px] font-semibold">
                      {PINNED_LABELS[goal.id] ?? goal.name}
                    </p>
                    <div className={`${styles.progressTrack} mt-2`}>
                      <div className={styles.progressFill} style={{ width: `${goal.percent}%` }} />
                    </div>
                    <p className="mt-1.5 text-[13px] font-semibold text-[var(--alt-blue-text)]">
                      {goal.percent}%
                    </p>
                  </button>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTab('activity')}
                className={`${styles.card} cursor-pointer border-none p-3 text-left`}
              >
                <p className="text-[13px] font-semibold leading-snug">Price dropped 14%. Love that for you.</p>
              </button>
              <button
                type="button"
                onClick={() => setOverlay('campus')}
                className={`${styles.card} cursor-pointer border-none p-3 text-left`}
              >
                <p className="text-[13px] font-semibold leading-snug">Everyone on campus wants this.</p>
              </button>
            </div>
          </div>
        )}

        {tab === 'wishlist' && (
          <div className="px-5 pb-4 pt-[52px]">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-[24px] font-semibold">My Wishlist</h1>
              <button
                type="button"
                onClick={() => setTab('add')}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)] shadow-sm"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOverlay('discovery')}
              className={`${styles.primaryBtn} mb-4 flex cursor-pointer items-center justify-center gap-2 border-none`}
            >
              <Search size={18} />
              Discover
            </button>

            <div className="mb-4 flex gap-2">
              {(
                [
                  ['all', `All ${goals.length}`],
                  ['pinned', `Pinned ${goals.filter((g) => g.pinned).length}`],
                  ['shared', `Shared ${goals.filter((g) => g.shared).length}`],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setWishlistFilter(id)}
                  className="cursor-pointer rounded-full border-none px-3 py-2 text-[12px] font-semibold"
                  style={{
                    background: wishlistFilter === id ? 'var(--alt-blue)' : 'var(--alt-surface)',
                    color: wishlistFilter === id ? 'var(--alt-blue-text)' : 'var(--alt-muted)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {filteredGoals.length === 0 ? (
              <div className={`${styles.card} p-8 text-center`}>
                <div className="mb-4 flex justify-center text-[var(--alt-blue-text)]">
                  <ShoppingBag size={40} strokeWidth={1.5} />
                </div>
                <p className="text-[15px] font-semibold">Your wishlist is looking a little empty.</p>
                <p className={`mt-2 text-[13px] ${mutedText}`}>
                  Add your first item and start saving for what you want.
                </p>
                <button
                  type="button"
                  className={`${styles.primaryBtn} mt-5`}
                  onClick={() => setTab('add')}
                >
                  Add your first item
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredGoals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => openGoal(goal.id)}
                    className={`${styles.card} flex w-full cursor-pointer items-center gap-3 border-none p-3 text-left`}
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-[var(--alt-image-bg)]">
                      <Image src={goal.image} alt="" fill className="object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold">{goal.name}</p>
                      <p className="text-[12px] text-[#8b90a0]">
                        {money(goal.saved)} of {money(goal.price)}
                      </p>
                      {goal.drop && (
                        <p className="mt-0.5 text-[11px] font-medium text-[#3bb273]">{goal.drop}</p>
                      )}
                      <div className={`${styles.progressTrack} mt-2`}>
                        <div className={styles.progressFill} style={{ width: `${goal.percent}%` }} />
                      </div>
                    </div>
                    <span className="text-[13px] font-semibold text-[#5c62a8]">{goal.percent}%</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'add' && (
          <div className="px-5 pb-4 pt-[52px]">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-[22px] font-semibold">Add a new goal</h1>
              <button
                type="button"
                onClick={() => setTab('home')}
                className="cursor-pointer border-none bg-transparent text-[13px] font-medium text-[var(--alt-muted)]"
              >
                Cancel
              </button>
            </div>

            <div className="mb-5 flex gap-2 text-[12px] font-semibold">
              {(['1. Item', '2. Plan', '3. Details'] as const).map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setAddStep((i + 1) as AddStep)}
                  className="cursor-pointer border-none bg-transparent p-0"
                  style={{ color: addStep === i + 1 ? 'var(--alt-blue-text)' : 'var(--alt-muted)' }}
                >
                  {label}
                </button>
              ))}
            </div>

            {addStep === 1 && (
              <>
                <div className={`${styles.card} mb-4 flex items-center gap-2 p-3`}>
                  <Search size={18} className="text-[#8b90a0]" />
                  <input
                    placeholder="Search for the item or paste a link"
                    className="w-full border-none bg-transparent text-[14px] outline-none"
                  />
                </div>
                <p className="mb-3 text-[14px] font-semibold">Popular right now</p>
                <div className="grid grid-cols-2 gap-3">
                  {POPULAR.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedAddItemId(item.id)}
                      className={`${styles.card} cursor-pointer border-none p-3 text-left`}
                      style={{
                        outline:
                          selectedAddItemId === item.id
                            ? '2px solid var(--alt-blue)'
                            : '1px solid var(--alt-border)',
                      }}
                    >
                      <div className="relative mb-2 h-[72px] w-full">
                        <Image src={item.image} alt="" fill className="object-contain" />
                      </div>
                      <p className="text-[13px] font-semibold">{item.name}</p>
                      <p className={`text-[12px] ${mutedText}`}>{money(item.price)}</p>
                    </button>
                  ))}
                </div>
                <button type="button" className={`${styles.primaryBtn} mt-5`} onClick={() => setAddStep(2)}>
                  Next
                </button>
              </>
            )}

            {addStep === 2 && (
              <>
                <div className={`${styles.card} mb-4 p-4`}>
                  <p className="text-[14px] font-semibold">Weekly savings plan</p>
                  <p className="mt-2 text-[28px] font-semibold">$12.10 / week</p>
                  <p className="mt-1 text-[13px] text-[#8b90a0]">Reach your goal by Aug 1</p>
                </div>
                <button type="button" className={`${styles.primaryBtn} mt-2`} onClick={() => setAddStep(3)}>
                  Next
                </button>
              </>
            )}

            {addStep === 3 && (
              <>
                <div className={`${styles.card} mb-4 p-4`}>
                  <p className="text-[14px] font-semibold">Pin to home</p>
                  <p className="mt-1 text-[13px] text-[#8b90a0]">
                    Show this goal on your dashboard carousel.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={(e) => {
                    const pick = POPULAR.find((item) => item.id === selectedAddItemId) ?? POPULAR[0];
                    setGoalItems((prev) => {
                      const existing = prev.find((goal) => goal.id === pick.id);
                      if (existing) {
                        return prev.map((goal) =>
                          goal.id === pick.id ? { ...goal, pinned: true } : goal
                        );
                      }
                      return [
                        ...prev,
                        {
                          id: pick.id,
                          name: pick.name,
                          price: pick.price,
                          saved: 0,
                          image: pick.image,
                          pinned: true,
                        },
                      ];
                    });
                    triggerStars(8, e);
                    setTab('wishlist');
                  }}
                >
                  Save goal
                </button>
              </>
            )}
          </div>
        )}

        {tab === 'activity' && (
          <div className="px-5 pb-4 pt-[52px]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-[24px] font-semibold">Activity</h1>
                <p className={`mt-1 text-[13px] ${mutedText}`}>Alerts, drops & nudges</p>
              </div>
              <button
                type="button"
                onClick={() => setActivityFilter('All')}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-blue-soft)] text-[13px] font-semibold text-[var(--alt-blue-text)]"
              >
                {filteredActivity.length}
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              {(['All', 'Price drops', 'Reminders'] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActivityFilter(label)}
                  className="cursor-pointer rounded-full border-none px-3 py-2 text-[12px] font-semibold"
                  style={{
                    background: activityFilter === label ? 'var(--alt-blue)' : 'var(--alt-surface)',
                    color: activityFilter === label ? 'var(--alt-blue-text)' : 'var(--alt-muted)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {filteredActivity.map((item) => {
                const goal = item.goalId
                  ? goals.find((g) => g.id === item.goalId)
                  : undefined;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.kind === 'reminder') setOverlay('reminders');
                      else if (item.kind === 'trend') setOverlay('campus');
                      else if (item.kind === 'milestone' && goal) openGoal(goal.id);
                      else if (item.kind === 'social' && goal) openGoal(goal.id);
                      else if (goal) openGoal(goal.id);
                    }}
                    className={`${styles.card} flex w-full cursor-pointer items-start gap-3 border-none p-4 text-left`}
                  >
                    {goal ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[12px] bg-[var(--alt-image-bg)]">
                        <Image src={goal.image} alt="" fill className="object-contain p-1" />
                      </div>
                    ) : (
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] text-[var(--alt-blue-text)]"
                        style={{ background: 'var(--alt-blue-soft)' }}
                      >
                        {item.kind === 'price_drop' && (
                          <TrendingUp size={18} className="rotate-180" />
                        )}
                        {item.kind === 'reminder' && <Bell size={18} />}
                        {item.kind === 'social' && <Users size={18} />}
                        {item.kind === 'milestone' && <Target size={18} />}
                        {item.kind === 'trend' && <TrendingUp size={18} />}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[14px] font-semibold leading-tight">{item.title}</p>
                        <span className="shrink-0 text-[11px] text-[#8b90a0]">{item.time}</span>
                      </div>
                      <p className="mt-1 text-[13px] text-[#8b90a0]">{item.body}</p>
                      {item.kind === 'price_drop' && (
                        <span className="mt-2 inline-block rounded-full bg-[var(--alt-blue-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--alt-blue-text)]">
                          Price drop
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setOverlay('reminders')}
              className={`${styles.secondaryBtn} mt-4`}
            >
              Manage reminders
            </button>
          </div>
        )}

        {tab === 'profile' && (
          <div className="px-5 pb-4 pt-[52px]">
            <div className={`${styles.card} mb-4 overflow-hidden p-5`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--alt-blue-soft)] text-[22px] font-semibold text-[var(--alt-blue-text)]">
                    EM
                  </div>
                  <div>
                    <p className="text-[20px] font-semibold">Emma</p>
                    <p className={`text-[14px] ${mutedText}`}>@emma.saves</p>
                    <p className={`mt-2 text-[13px] leading-[1.45] ${mutedText}`}>
                      Saving for the things I actually want · Berkeley &apos;26
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOverlay('settings')}
                  className="cursor-pointer rounded-full border-none bg-[var(--alt-blue-soft)] px-3 py-1.5 text-[12px] font-semibold text-[var(--alt-blue-text)]"
                >
                  Edit
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--alt-border)] pt-4">
                {[
                  { value: money(totalSaved), label: 'Saved', action: () => setTab('wishlist') },
                  { value: String(goals.length), label: 'Goals', action: () => setTab('wishlist') },
                  { value: String(stars), label: 'Stars', action: () => setOverlay('stars') },
                ].map(({ value, label, action }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={action}
                    className="cursor-pointer border-none bg-transparent text-center"
                  >
                    <p className="text-[16px] font-semibold">{value}</p>
                    <p className={`mt-0.5 text-[11px] ${mutedText}`}>{label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold">Pinned goals</h2>
              <button
                type="button"
                onClick={() => setTab('wishlist')}
                className="cursor-pointer border-none bg-transparent text-[13px] font-semibold text-[#5c62a8]"
              >
                See all
              </button>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              {pinnedHomeGoals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => openGoal(goal.id)}
                    className={`${styles.card} cursor-pointer border-none p-3 text-left`}
                  >
                    <div className="relative mb-2 h-[72px] w-full overflow-hidden rounded-[12px] bg-[var(--alt-image-bg)]">
                      <Image src={goal.image} alt="" fill className="object-cover" sizes="160px" />
                    </div>
                    <p className="line-clamp-2 text-[12px] font-semibold">
                      {PINNED_LABELS[goal.id] ?? goal.name}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-[#5c62a8]">{goal.percent}%</p>
                  </button>
                ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setOverlay('stars')}
                className={`${styles.card} flex w-full cursor-pointer items-center justify-between border-none p-4`}
              >
                <span className="font-semibold">Star rewards</span>
                <Star size={18} className="text-[var(--alt-blue-text)]" />
              </button>
              <button
                type="button"
                onClick={() => setOverlay('leaderboard')}
                className={`${styles.card} flex w-full cursor-pointer items-center justify-between border-none p-4`}
              >
                <span className="font-semibold">Campus leaderboard</span>
                <Trophy size={18} className="text-[var(--alt-blue-text)]" />
              </button>
              <button
                type="button"
                onClick={() => setOverlay('reminders')}
                className={`${styles.card} flex w-full cursor-pointer items-center justify-between border-none p-4`}
              >
                <span className="font-semibold">Reminders</span>
                <Bell size={18} className="text-[var(--alt-blue-text)]" />
              </button>
              <button
                type="button"
                onClick={() => setOverlay('settings')}
                className={`${styles.card} flex w-full cursor-pointer items-center justify-between border-none p-4`}
              >
                <span className="font-semibold">Settings</span>
                <Settings size={18} className="text-[var(--alt-blue-text)]" />
              </button>
            </div>
          </div>
        )}
      </div>

      <nav className={`${styles.bottomNav} absolute bottom-0 left-0 right-0 z-[110] flex items-center justify-around px-2`}>
        {(
          [
            ['home', 'Home', Home],
            ['wishlist', 'Wishlist', Heart],
            ['add', 'Add', Plus],
            ['activity', 'Activity', Bell],
            ['profile', 'Profile', User],
          ] as const
        ).map(([id, label, Icon]) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex min-w-[56px] cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent text-[10px] ${active ? styles.navItemActive : 'text-[#8b90a0]'}`}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: id === 'add' ? 'var(--alt-blue)' : 'transparent',
                  color: id === 'add' ? 'var(--alt-blue-text)' : undefined,
                }}
              >
                <Icon size={id === 'add' ? 22 : 20} />
              </span>
              {id !== 'add' && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {overlay === 'goal' && (
        <div className="absolute inset-0 z-[115] flex flex-col bg-[var(--alt-bg)]">
          <div className="flex items-center justify-between px-4 pb-2 pt-[52px]">
            <button type="button" onClick={() => setOverlay(null)} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]">
              <ChevronLeft size={22} />
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => triggerStars(2, e)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]"
              >
                <Share2 size={18} />
              </button>
              <button
                type="button"
                onClick={() => toggleGoalPinned(selectedGoalId)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]"
              >
                <Heart size={18} fill={selectedGoal.pinned ? 'currentColor' : 'none'} className="text-[var(--alt-blue-text)]" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className={`${styles.card} relative mb-4 h-[260px] overflow-hidden`}>
              <Image src={selectedGoal.image} alt="" fill className="object-contain p-6" />
            </div>
            <h1 className="text-[24px] font-semibold">{selectedGoal.name}</h1>
            <p className="mt-1 text-[18px] font-semibold">{money(selectedGoal.price)}</p>
            <p className={`mt-2 text-[13px] ${mutedText}`}>{selectedGoal.percent}% of your goal</p>
            <div className={`${styles.progressTrack} mt-3`}>
              <div className={styles.progressFill} style={{ width: `${selectedGoal.percent}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { key: 'Target', value: 'Aug 1', action: () => setOverlay('reminders') },
                { key: 'Weekly', value: '$12.10', action: () => setTab('add') },
                { key: 'Friends', value: '2', action: () => setOverlay('campus') },
              ].map(({ key, value, action }) => (
                <button
                  key={key}
                  type="button"
                  onClick={action}
                  className={`${styles.card} cursor-pointer border-none p-3 text-center`}
                >
                  <p className={`text-[11px] ${mutedText}`}>{key}</p>
                  <p className="mt-1 text-[14px] font-semibold">{value}</p>
                </button>
              ))}
            </div>
            <button type="button" className={`${styles.primaryBtn} mt-6`} onClick={addMoney}>
              Add money
            </button>
            <button
              type="button"
              className={`${styles.secondaryBtn} mt-3`}
              onClick={(e) => triggerStars(3, e)}
            >
              Share goal
            </button>
          </div>
        </div>
      )}

      {overlay === 'milestone' && (
        <div
          className="absolute inset-0 z-[120] flex flex-col items-center justify-center px-6 text-center"
          style={{
            background: darkMode
              ? 'linear-gradient(180deg, #1c1e2e, #0a0a0c)'
              : 'linear-gradient(180deg, #e8ecff, #fafaff)',
          }}
        >
          <button type="button" onClick={() => setOverlay('goal')} className="absolute right-4 top-[52px] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]">
            <X size={20} />
          </button>
          <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[var(--alt-blue-text)]">Milestone</p>
          <h1 className="mt-3 max-w-[280px] text-[28px] font-semibold leading-tight">
            You&apos;re almost there!
          </h1>
          <p className={`mt-2 text-[15px] ${mutedText}`}>
            {selectedGoal.percent}% of your goal for {selectedGoal.name}
          </p>
          <div className="relative my-8">
            <span className={styles.milestoneRing} />
            <div className="relative h-40 w-40 overflow-hidden rounded-full bg-[var(--alt-surface)] shadow-lg">
              <Image src={selectedGoal.image} alt="" fill className="object-contain p-4" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-[28px] font-bold text-[var(--alt-blue-text)]">
              {selectedGoal.percent}%
            </div>
          </div>
          <p className="mb-5 text-[15px] font-medium">Just $30 left to go!</p>
          <button type="button" className={styles.primaryBtn} onClick={addMoney}>Add money</button>
          <button type="button" className={`${styles.secondaryBtn} mt-3`} onClick={() => setOverlay('goal')}>View goal</button>
        </div>
      )}

      {overlay === 'stars' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          <div className="flex items-center gap-2 px-4 pb-2 pt-[52px]">
            <button type="button" onClick={() => setOverlay(null)} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]">
              <ChevronLeft size={22} />
            </button>
            <span className={`text-[14px] font-semibold uppercase tracking-[0.08em] ${mutedText}`}>Star rewards</span>
          </div>
          <div className="flex-1 px-5">
            <p className="flex items-center gap-2 text-[42px] font-semibold">
              {stars}
              <Star size={32} className="text-[#f5b301]" fill="#f5b301" />
            </p>
            <p className={`mt-2 text-[15px] ${mutedText}`}>Earn stars every time you save.</p>
            <div className="mt-6 flex flex-col gap-3">
              {[
                { label: 'Discount drops', action: () => { setTab('activity'); setActivityFilter('Price drops'); setOverlay(null); } },
                { label: 'Limited rewards', action: () => triggerStars(5) },
                { label: 'Campus rankings', action: () => setOverlay('leaderboard') },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className={`${styles.card} flex w-full cursor-pointer items-center gap-3 border-none p-4 text-left`}
                >
                  <Star size={18} className="text-[#f5b301]" fill="#f5b301" />
                  <span className="font-semibold">{label}</span>
                </button>
              ))}
            </div>
            <button type="button" className={`${styles.primaryBtn} mt-6`} onClick={(e) => triggerStars(10, e)}>
              Claim daily stars
            </button>
          </div>
        </div>
      )}

      {overlay === 'leaderboard' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          <div className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-[52px]">
            <button type="button" onClick={() => setOverlay(null)} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]">
              <ChevronLeft size={22} />
            </button>
            <div>
              <span className="text-[18px] font-semibold">Leaderboard</span>
              <p className={`text-[12px] ${mutedText}`}>
                {leaderboardTab === 'campus'
                  ? `${selectedCampus.name} · ${selectedCampus.students.toLocaleString()} savers`
                  : 'All campuses · 48,200 savers'}
              </p>
            </div>
          </div>

          <div className="shrink-0 px-5 pb-3">
            <div className={`${styles.card} flex p-1`}>
              {(['campus', 'global'] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLeaderboardTab(id)}
                  className="flex-1 cursor-pointer rounded-[14px] border-none py-2.5 text-[13px] font-semibold capitalize"
                  style={{
                    background: leaderboardTab === id ? 'var(--alt-blue)' : 'transparent',
                    color: leaderboardTab === id ? 'var(--alt-blue-text)' : 'var(--alt-muted)',
                  }}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          {leaderboardTab === 'campus' && (
            <div className="shrink-0 px-5 pb-3">
              <p className={`mb-2 text-[12px] font-semibold uppercase tracking-[0.06em] ${mutedText}`}>
                Choose campus
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CAMPUSES.map((campus) => (
                  <button
                    key={campus.id}
                    type="button"
                    onClick={() => setSelectedCampusId(campus.id)}
                    className="shrink-0 cursor-pointer rounded-full border-none px-3 py-2 text-left"
                    style={{
                      background:
                        selectedCampusId === campus.id
                          ? 'var(--alt-blue)'
                          : 'var(--alt-surface)',
                      color:
                        selectedCampusId === campus.id
                          ? 'var(--alt-blue-text)'
                          : 'var(--alt-muted)',
                      boxShadow:
                        selectedCampusId === campus.id
                          ? 'none'
                          : 'var(--alt-shadow)',
                    }}
                  >
                    <p className="text-[12px] font-semibold">{campus.shortName}</p>
                    <p className="text-[10px] opacity-80">{campus.students.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={`min-h-0 flex-1 overflow-y-auto px-5 pb-8 ${styles.scroll}`}>
            {yourLeaderboardEntry && (
              <div className={`${styles.card} mb-4 p-4`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`text-[12px] font-semibold uppercase tracking-[0.06em] ${mutedText}`}>
                      Your rank
                    </p>
                    <p className="mt-1 text-[28px] font-semibold">#{yourLeaderboardEntry.rank}</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-1 text-[16px] font-semibold">
                      {yourLeaderboardEntry.stars}
                      <Star size={14} className="text-[#f5b301]" fill="#f5b301" />
                    </p>
                    <p className={`text-[12px] ${mutedText}`}>
                      {money(yourLeaderboardEntry.saved)} saved · {yourLeaderboardEntry.streak}-day streak
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-[var(--alt-blue-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--alt-blue-text)]">
                    {yourLeaderboardEntry.rank} of {activeLeaderboard.length} ranked
                  </span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      background:
                        yourLeaderboardEntry.rankChange >= 0 ? 'rgba(59,178,115,0.12)' : 'rgba(255,77,103,0.12)',
                      color: yourLeaderboardEntry.rankChange >= 0 ? '#3bb273' : '#ff4d67',
                    }}
                  >
                    {yourLeaderboardEntry.rankChange >= 0 ? '+' : ''}
                    {yourLeaderboardEntry.rankChange} this week
                  </span>
                </div>
              </div>
            )}

            <div className="mb-5 grid grid-cols-3 gap-2">
              {[
                [String(activeLeaderboard[0]?.stars ?? 0), 'Leader'],
                [String(yourLeaderboardEntry?.rank ?? '-'), 'Your rank'],
                [String(activeLeaderboard.length), 'Ranked'],
              ].map(([value, label]) => (
                <div key={label} className={`${styles.statPill} cursor-default`}>
                  <p className="text-[16px] font-semibold">{value}</p>
                  <p className={`mt-0.5 text-[10px] ${mutedText}`}>{label}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 flex items-end justify-center gap-3 pt-2">
              {[activeLeaderboard[1], activeLeaderboard[0], activeLeaderboard[2]]
                .filter((user): user is LeaderboardEntry => Boolean(user))
                .map((user) => (
                  <button
                    key={user.rank}
                    type="button"
                    onClick={() => triggerStars(1)}
                    className="flex cursor-pointer flex-col items-center border-none bg-transparent"
                    style={{ width: user.rank === 1 ? 96 : 80 }}
                  >
                    <span
                      className="mb-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-[var(--alt-blue-text)]"
                      style={{ background: 'var(--alt-blue-soft)' }}
                    >
                      #{user.rank}
                    </span>
                    <div
                      className="mb-2 flex items-center justify-center rounded-full font-semibold text-white"
                      style={{
                        width: user.rank === 1 ? 72 : 56,
                        height: user.rank === 1 ? 72 : 56,
                        background: user.color ?? 'var(--alt-blue)',
                      }}
                    >
                      {user.name[0]}
                    </div>
                    <p className="text-[12px] font-semibold">{user.name}</p>
                    <p className={`text-[10px] ${mutedText}`}>{user.handle}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold">
                      {user.stars}
                      <Star size={10} className="text-[#f5b301]" fill="#f5b301" />
                    </p>
                    <p className={`text-[10px] ${mutedText}`}>{money(user.saved)}</p>
                  </button>
                ))}
            </div>

            <h2 className="mb-3 text-[16px] font-semibold">Full rankings</h2>
            <div className="flex flex-col gap-2">
              {activeLeaderboard.map((user) => (
                <button
                  key={`${leaderboardTab}-${selectedCampusId}-${user.rank}`}
                  type="button"
                  onClick={() => triggerStars(1)}
                  className={`${styles.card} flex w-full cursor-pointer items-center gap-3 border-none p-3 text-left`}
                  style={{ background: user.highlight ? 'var(--alt-blue-soft)' : 'var(--alt-surface)' }}
                >
                  <span className={`w-6 text-center text-[13px] font-semibold ${mutedText}`}>
                    {user.rank}
                  </span>
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                    style={{ background: user.color ?? 'var(--alt-blue)' }}
                  >
                    {user.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{user.name}</p>
                      {user.highlight && (
                        <span className="rounded-full bg-[var(--alt-blue)] px-2 py-0.5 text-[10px] font-semibold text-[var(--alt-blue-text)]">
                          You
                        </span>
                      )}
                    </div>
                    <p className={`truncate text-[11px] ${mutedText}`}>{user.handle}</p>
                    <p className={`mt-0.5 text-[11px] ${mutedText}`}>
                      {money(user.saved)} saved · {user.streak}-day streak
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="flex items-center justify-end gap-1 font-semibold">
                      {user.stars}
                      <Star size={12} className="text-[#f5b301]" fill="#f5b301" />
                    </p>
                    <p
                      className="mt-1 text-[11px] font-semibold"
                      style={{ color: user.rankChange >= 0 ? '#3bb273' : '#ff4d67' }}
                    >
                      {user.rankChange >= 0 ? '+' : ''}
                      {user.rankChange}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (leaderboardTab === 'campus') setOverlay('campus');
                else setOverlay('discovery');
              }}
              className={`${styles.secondaryBtn} mt-5`}
            >
              {leaderboardTab === 'campus' ? 'See campus wants' : 'Discover trending items'}
            </button>
          </div>
        </div>
      )}

      {overlay === 'discovery' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)] pt-[52px]">
          <AltSwipeDeck
            showHeader
            title="Discover"
            items={DISCOVER_ITEMS}
            onBack={() => setOverlay(null)}
            onWant={(item, event) => {
              handleDiscoverWant(item, event);
            }}
          />
        </div>
      )}

      {overlay === 'campus' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-[52px]">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setOverlay(null)} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]">
                <ChevronLeft size={22} />
              </button>
              <div>
                <span className="text-[18px] font-semibold">Campus Wants</span>
                <p className={`text-[12px] ${mutedText}`}>Berkeley · 1,284 students saving</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOverlay('leaderboard')}
              className="cursor-pointer rounded-full border-none bg-[var(--alt-blue-soft)] px-3 py-1.5 text-[12px] font-semibold text-[var(--alt-blue-text)]"
            >
              Rankings
            </button>
          </div>

          <div className={`min-h-0 flex-1 overflow-y-auto px-5 pb-8 ${styles.scroll}`}>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                ['73', 'Top trend saves'],
                ['42', 'Active this week'],
                ['$28', 'Avg weekly save'],
              ].map(([value, label]) => (
                <div key={label} className={`${styles.statPill} cursor-default`}>
                  <p className="text-[16px] font-semibold">{value}</p>
                  <p className={`mt-0.5 text-[10px] leading-tight ${mutedText}`}>{label}</p>
                </div>
              ))}
            </div>

            <div className="mb-5 flex gap-2 overflow-x-auto">
              {(['All', 'Sneakers', 'Tech', 'Beauty', 'Lifestyle'] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setCampusFilter(label)}
                  className="shrink-0 cursor-pointer rounded-full border-none px-3 py-2 text-[12px] font-semibold"
                  style={{
                    background: campusFilter === label ? 'var(--alt-blue)' : 'var(--alt-surface)',
                    color: campusFilter === label ? 'var(--alt-blue-text)' : 'var(--alt-muted)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {featuredCampusItem && (
              <button
                type="button"
                onClick={() => openCampusGoal(featuredCampusItem.id)}
                className={`${styles.card} mb-5 w-full cursor-pointer border-none p-4 text-left`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-[var(--alt-blue-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--alt-blue-text)]">
                    #{featuredCampusItem.rank} this week
                  </span>
                  <span className="text-[12px] font-semibold text-[#3bb273]">
                    {featuredCampusItem.change} saves
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[16px] bg-[var(--alt-image-bg)]">
                    <Image src={featuredCampusItem.image} alt="" fill className="object-contain p-2" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--alt-blue-text)]">
                      {featuredCampusItem.category}
                    </p>
                    <p className="mt-1 text-[18px] font-semibold leading-tight">{featuredCampusItem.name}</p>
                    <p className="mt-1 text-[15px] font-semibold">{money(featuredCampusItem.price)}</p>
                    <p className={`mt-2 text-[12px] ${mutedText}`}>
                      Saved by {featuredCampusItem.saves} students · {featuredCampusItem.weeklySaves} new this week
                    </p>
                  </div>
                </div>
                <div className={`${styles.progressTrack} mt-4`}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.min(100, featuredCampusItem.saves)}%` }}
                  />
                </div>
                <p className={`mt-2 text-[12px] ${mutedText}`}>
                  Students save an average of ${featuredCampusItem.avgWeekly}/week toward this
                </p>
              </button>
            )}

            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold">Trending on campus</h2>
              <button
                type="button"
                onClick={() => setOverlay('discovery')}
                className="cursor-pointer border-none bg-transparent text-[12px] font-semibold text-[var(--alt-blue-text)]"
              >
                Discover
              </button>
            </div>
            <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
              {filteredCampusTrending.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openCampusGoal(item.id)}
                  className={`${styles.card} flex w-[120px] shrink-0 cursor-pointer flex-col border-none p-3 text-left`}
                >
                  <div className="relative mb-2 h-16 w-full">
                    <Image src={item.image} alt="" fill className="object-contain" />
                  </div>
                  <p className="line-clamp-2 text-[11px] font-semibold leading-tight">{item.name}</p>
                  <p className={`mt-1 text-[10px] ${mutedText}`}>{item.saves} saves</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#3bb273]">{item.change}</p>
                </button>
              ))}
            </div>

            <h2 className="mb-3 text-[16px] font-semibold">Students saving now</h2>
            <div className="mb-6 flex flex-col gap-3">
              {CAMPUS_SAVERS.map((saver) => (
                <button
                  key={saver.handle}
                  type="button"
                  onClick={() => openCampusGoal(saver.goalId)}
                  className={`${styles.card} flex w-full cursor-pointer items-start gap-3 border-none p-4 text-left`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--alt-blue-soft)] text-[13px] font-semibold text-[var(--alt-blue-text)]">
                    {saver.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[14px] font-semibold">{saver.name}</p>
                        <p className={`text-[12px] ${mutedText}`}>{saver.handle}</p>
                      </div>
                      <span className={`shrink-0 text-[11px] ${mutedText}`}>{saver.dorm}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-[var(--alt-image-bg)]">
                        <Image src={saver.image} alt="" fill className="object-contain p-1" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold">{saver.goal}</p>
                        <p className={`text-[11px] ${mutedText}`}>
                          {money(saver.saved)} saved · ${saver.weekly}/wk
                        </p>
                      </div>
                      <span className="text-[13px] font-semibold text-[var(--alt-blue-text)]">
                        {saver.percent}%
                      </span>
                    </div>
                    <div className={`${styles.progressTrack} mt-2`}>
                      <div className={styles.progressFill} style={{ width: `${saver.percent}%` }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <h2 className="mb-3 text-[16px] font-semibold">Dorms leading the pack</h2>
            <div className="mb-6 flex flex-col gap-2">
              {CAMPUS_DORMS.map((dorm, index) => (
                <button
                  key={dorm.name}
                  type="button"
                  onClick={() => setOverlay('leaderboard')}
                  className={`${styles.card} flex w-full cursor-pointer items-center justify-between border-none p-4 text-left`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-[13px] font-semibold ${mutedText}`}>{index + 1}</span>
                    <div>
                      <p className="font-semibold">{dorm.name}</p>
                      <p className={`text-[12px] ${mutedText}`}>Top want: {dorm.topItem}</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-[var(--alt-blue-text)]">
                    {dorm.savers} savers
                  </span>
                </button>
              ))}
            </div>

            <div className={`${styles.card} mb-4 p-4`}>
              <p className="text-[14px] font-semibold">Your campus pulse</p>
              <p className={`mt-1 text-[13px] leading-[1.45] ${mutedText}`}>
                6 students from your dorm saved for Jordan 4s this week. You&apos;re $18 away from
                matching the campus average pace.
              </p>
              <button
                type="button"
                onClick={() => openCampusGoal('jordan')}
                className={`${styles.primaryBtn} mt-4`}
              >
                View Jordan 4 goal
              </button>
            </div>
          </div>
        </div>
      )}

      {overlay === 'reminders' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          <div className="flex items-center gap-2 px-4 pb-2 pt-[52px]">
            <button type="button" onClick={() => setOverlay(null)} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]">
              <ChevronLeft size={22} />
            </button>
            <span className={`text-[14px] font-semibold uppercase tracking-[0.08em] ${mutedText}`}>Reminders</span>
          </div>
          <div className="px-5">
            <h1 className="text-[28px] font-semibold">Don&apos;t ghost your goals</h1>
            <button
              type="button"
              onClick={(e) => { triggerStars(2, e); addMoney(e); }}
              className={`${styles.card} mt-5 w-full cursor-pointer border-none p-4 text-left`}
            >
              <p className="font-semibold">Even $5 counts today</p>
              <p className={`mt-1 text-[13px] ${mutedText}`}>Small deposits keep your streak alive.</p>
            </button>
            <button
              type="button"
              onClick={() => setTab('add')}
              className={`${styles.card} mt-3 w-full cursor-pointer border-none p-4 text-left`}
            >
              <p className="font-semibold">One coffee = one step closer</p>
              <p className={`mt-1 text-[13px] ${mutedText}`}>Skip one latte, fund your wishlist.</p>
            </button>
            <button type="button" className={`${styles.primaryBtn} mt-5`} onClick={(e) => { triggerStars(4, e); setOverlay(null); }}>Save $5 now</button>
          </div>
        </div>
      )}

      {overlay === 'settings' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          {renderSettingsHeader('Settings', () => setOverlay(null))}
          <div className={`min-h-0 flex-1 overflow-y-auto px-5 pb-8 ${styles.scroll}`}>
            <div className={styles.settingsSection}>
              <p className={styles.settingsSectionLabel}>Account</p>
              <div className={styles.settingsGroup}>
                {renderSettingsLink(
                  <User size={18} />,
                  'Profile & bio',
                  'Name, username, campus',
                  () => setOverlay('account'),
                  'Emma'
                )}
                {renderSettingsLink(
                  <CreditCard size={18} />,
                  'Payment methods',
                  'Cards and deposit sources',
                  () => setTab('add'),
                  '2 linked'
                )}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <p className={styles.settingsSectionLabel}>Preferences</p>
              <div className={styles.settingsGroup}>
                {renderSettingsLink(
                  <Bell size={18} />,
                  'Notifications',
                  'Alerts, drops, and nudges',
                  () => setOverlay('notifications')
                )}
                {renderSettingsLink(
                  <Moon size={18} />,
                  'Appearance',
                  'Theme and display',
                  () => setOverlay('appearance'),
                  darkMode ? 'Dark' : 'Light'
                )}
                {renderSettingsLink(
                  <PiggyBank size={18} />,
                  'Savings plan',
                  'Weekly targets and auto-save',
                  () => setOverlay('reminders'),
                  '$12/wk'
                )}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <p className={styles.settingsSectionLabel}>Privacy</p>
              <div className={styles.settingsGroup}>
                {renderSettingsLink(
                  <Shield size={18} />,
                  'Privacy & security',
                  'Visibility and account protection',
                  () => setOverlay('privacy')
                )}
                {renderSettingsToggle(
                  <Lock size={18} />,
                  'Hide saved amounts',
                  'Mask balances on your profile',
                  hideBalances,
                  () => setHideBalances((on) => !on)
                )}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <p className={styles.settingsSectionLabel}>Support</p>
              <div className={styles.settingsGroup}>
                {renderSettingsLink(
                  <HelpCircle size={18} />,
                  'Help center',
                  'FAQs and troubleshooting',
                  () => setOverlay('support')
                )}
                {renderSettingsLink(
                  <Mail size={18} />,
                  'Send feedback',
                  'Tell us what to improve',
                  () => setOverlay('support')
                )}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <p className={styles.settingsSectionLabel}>About</p>
              <div className={styles.settingsGroup}>
                <div className={`${styles.settingsRow} cursor-default`}>
                  <div className={styles.settingsRowInner}>
                    <span className="text-[var(--alt-blue-text)]">
                      <Star size={18} />
                    </span>
                    <div className={styles.settingsRowCopy}>
                      <p className="font-semibold">Wnted</p>
                      <p className={`text-[13px] ${mutedText}`}>Version 0.1.0</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOverlay('support')}
                  className={styles.settingsRow}
                >
                  <div className={styles.settingsRowInner}>
                    <span className="text-[var(--alt-blue-text)]">
                      <Shield size={18} />
                    </span>
                    <div className={styles.settingsRowCopy}>
                      <p className="font-semibold">Privacy policy</p>
                      <p className={`text-[13px] ${mutedText}`}>How we use your data</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[var(--alt-muted)]" />
                </button>
                <button
                  type="button"
                  onClick={() => setOverlay('support')}
                  className={styles.settingsRow}
                >
                  <div className={styles.settingsRowInner}>
                    <span className="text-[var(--alt-blue-text)]">
                      <Share2 size={18} />
                    </span>
                    <div className={styles.settingsRowCopy}>
                      <p className="font-semibold">Terms of service</p>
                      <p className={`text-[13px] ${mutedText}`}>Usage and community rules</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[var(--alt-muted)]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {overlay === 'account' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          {renderSettingsHeader('Profile & bio', () => setOverlay('settings'))}
          <div className={`min-h-0 flex-1 overflow-y-auto px-5 pb-8 ${styles.scroll}`}>
            <div className={`${styles.card} mb-4 flex items-center gap-3 p-4`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--alt-blue-soft)] text-[18px] font-semibold text-[var(--alt-blue-text)]">
                EM
              </div>
              <div>
                <p className="font-semibold">Emma</p>
                <p className={`text-[13px] ${mutedText}`}>@emma.saves</p>
              </div>
            </div>
            <div className={styles.settingsGroup}>
              <div className={`${styles.settingsRow} cursor-default flex-col items-stretch gap-2`}>
                <p className={`text-[12px] font-semibold uppercase tracking-[0.06em] ${mutedText}`}>Display name</p>
                <input
                  defaultValue="Emma"
                  className="w-full rounded-[12px] border border-[var(--alt-border)] bg-[var(--alt-bg)] px-3 py-2 text-[14px] outline-none"
                />
              </div>
              <div className={`${styles.settingsRow} cursor-default flex-col items-stretch gap-2`}>
                <p className={`text-[12px] font-semibold uppercase tracking-[0.06em] ${mutedText}`}>Username</p>
                <input
                  defaultValue="emma.saves"
                  className="w-full rounded-[12px] border border-[var(--alt-border)] bg-[var(--alt-bg)] px-3 py-2 text-[14px] outline-none"
                />
              </div>
              <div className={`${styles.settingsRow} cursor-default flex-col items-stretch gap-2`}>
                <p className={`text-[12px] font-semibold uppercase tracking-[0.06em] ${mutedText}`}>Bio</p>
                <textarea
                  defaultValue="Saving for the things I actually want · Berkeley '26"
                  rows={3}
                  className="w-full resize-none rounded-[12px] border border-[var(--alt-border)] bg-[var(--alt-bg)] px-3 py-2 text-[14px] outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              className={`${styles.primaryBtn} mt-5`}
              onClick={() => setOverlay('settings')}
            >
              Save changes
            </button>
          </div>
        </div>
      )}

      {overlay === 'notifications' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          {renderSettingsHeader('Notifications', () => setOverlay('settings'))}
          <div className="px-5 pb-8">
            <div className={styles.settingsGroup}>
              {renderSettingsToggle(
                <TrendingUp size={18} className="rotate-180" />,
                'Price drop alerts',
                'When items on your wishlist go on sale',
                priceDropAlerts,
                () => setPriceDropAlerts((on) => !on)
              )}
              {renderSettingsToggle(
                <Bell size={18} />,
                'Weekly reminders',
                'Nudge you to keep your streak going',
                weeklyReminders,
                () => setWeeklyReminders((on) => !on)
              )}
              {renderSettingsToggle(
                <Target size={18} />,
                'Goal milestones',
                'Celebrate when you hit savings targets',
                savingsNudges,
                () => setSavingsNudges((on) => !on)
              )}
            </div>
            <button
              type="button"
              onClick={() => setOverlay('reminders')}
              className={`${styles.secondaryBtn} mt-4`}
            >
              Manage reminder schedule
            </button>
          </div>
        </div>
      )}

      {overlay === 'privacy' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          {renderSettingsHeader('Privacy & security', () => setOverlay('settings'))}
          <div className="px-5 pb-8">
            <div className={styles.settingsGroup}>
              {renderSettingsToggle(
                <Lock size={18} />,
                'Hide saved amounts',
                'Show progress without dollar totals',
                hideBalances,
                () => setHideBalances((on) => !on)
              )}
              {renderSettingsToggle(
                <Users size={18} />,
                'Show on campus leaderboard',
                'Let friends see your star rank',
                campusVisible,
                () => setCampusVisible((on) => !on)
              )}
            </div>
            <button
              type="button"
              onClick={() => setOverlay('leaderboard')}
              className={`${styles.secondaryBtn} mt-4`}
            >
              View leaderboard visibility
            </button>
          </div>
        </div>
      )}

      {overlay === 'support' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          {renderSettingsHeader('Help & feedback', () => setOverlay('settings'))}
          <div className="px-5 pb-8">
            <div className={styles.settingsGroup}>
              {renderSettingsLink(
                <HelpCircle size={18} />,
                'Getting started',
                'How wishlists and savings work',
                () => setTab('wishlist')
              )}
              {renderSettingsLink(
                <Bell size={18} />,
                'Report a bug',
                'Something not working right',
                () => triggerStars(1)
              )}
              {renderSettingsLink(
                <Mail size={18} />,
                'Request a feature',
                'Share what you want next',
                () => triggerStars(1)
              )}
            </div>
            <div className={`${styles.card} mt-4 p-4`}>
              <p className="font-semibold">Contact support</p>
              <p className={`mt-1 text-[13px] ${mutedText}`}>
                We usually reply within 24 hours at help@wnted.app
              </p>
              <button
                type="button"
                className={`${styles.primaryBtn} mt-4`}
                onClick={() => setOverlay('settings')}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {overlay === 'appearance' && (
        <div className="absolute inset-0 z-[120] flex flex-col bg-[var(--alt-bg)]">
          {renderSettingsHeader('Appearance', () => setOverlay('settings'))}
          <div className="px-5 pb-8">
            <div className={styles.settingsGroup}>
              {renderSettingsToggle(
                <Moon size={18} />,
                'Dark mode',
                'Switch light surfaces to dark',
                darkMode,
                () => setDarkMode((on) => !on)
              )}
            </div>
            <p className={`mt-4 text-[13px] ${mutedText}`}>
              More theme options coming soon.
            </p>
          </div>
        </div>
      )}

      {overlay === 'success' && (
        <div className="absolute inset-0 z-[120] flex flex-col items-center justify-center bg-[var(--alt-blue-soft)] px-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--alt-surface)]">
            <Star size={40} className="text-[#f5b301]" fill="#f5b301" />
          </div>
          <h1 className="text-[28px] font-semibold leading-tight">From &quot;someday&quot; to &quot;today.&quot;</h1>
          <p className={`mt-3 text-[15px] ${mutedText}`}>You saved for it. Now go enjoy it.</p>
          <button type="button" className={`${styles.primaryBtn} mt-8`} onClick={() => setOverlay(null)}>Shop again</button>
        </div>
      )}

      {starBursts.map((burst) => (
        <span
          key={burst.id}
          className={`${styles.starBurst} flex items-center gap-1`}
          style={{ left: burst.x, top: burst.y }}
        >
          +{burst.amount}
          <Star size={14} fill="currentColor" />
        </span>
      ))}

    </div>
  );
}
