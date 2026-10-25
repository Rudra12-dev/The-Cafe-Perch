/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Phone,
  Clock,
  Calendar,
  Check,
  X,
  ArrowUpRight,
  ShoppingBag,
  Plus,
  Minus,
  Send,
  Search,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Star,
  ThumbsUp,
  Camera,
  MessageSquarePlus,
} from 'lucide-react';

type MenuCategory = 'all' | 'bites' | 'mains' | 'brews' | 'combos';

interface MenuItem {
  id: string;
  name: string;
  category: 'bites' | 'mains' | 'brews' | 'combos';
  categoryLabel: string;
  price: number;
  description: string;
  image: string;
  servingNote: string;
  pairing: string;
  prepTime: string;
  isSignature?: boolean;
}

interface GalleryItem {
  id: string;
  title: string;
  zone: string;
  caption: string;
  image: string;
  spanClass: string;
}

interface CustomerReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  favoriteDish: string;
  vibeZone: string;
  comment: string;
  photoUrl?: string;
  createdAt: string;
  helpfulCount: number;
  verifiedGuest?: boolean;
}

const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Aarav Srivastava',
    role: 'Lead Guitarist, Velvet Chord · Lucknow University',
    rating: 5,
    favoriteDish: 'Crispy Corn & Hazelnut Iced Coffee',
    vibeZone: 'Live Acoustic / Open-Mic Corner',
    comment:
      'Before discovering The Cafe Perch near Kapda Kothi, our college band struggled to find an affordable acoustic hangout in Aliganj. Yash bhai hosted our 18-person unplugged evening with Crispy Corn, Alfredo Pasta, and Iced Coffees under ₹3,200 total.',
    photoUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    createdAt: '2 days ago',
    helpfulCount: 19,
    verifiedGuest: true,
  },
  {
    id: 'rev-2',
    name: 'Nandini Verma',
    role: 'Product Designer · Sector H, Aliganj',
    rating: 5,
    favoriteDish: 'Paneer Grilled Sandwich',
    vibeZone: 'Laptop-Friendly Power Desk',
    comment:
      'Working from home used to kill my productivity during power cuts. Now I spend 4 hours every afternoon at The Perch’s laptop desks—150 Mbps Wi-Fi, plug points right by the seat, and the ₹139 Paneer Grilled Sandwich is unbeatable.',
    photoUrl:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    createdAt: '5 days ago',
    helpfulCount: 14,
    verifiedGuest: true,
  },
  {
    id: 'rev-3',
    name: 'Rohan & Kritika Mehrotra',
    role: 'Architecture Consultants · Sector J, Aliganj',
    rating: 5,
    favoriteDish: 'Fresh Steamed Momos & KitKat Shake',
    vibeZone: 'Open-Air Pet-Friendly Deck',
    comment:
      'Finding a genuinely pet-friendly cafe in Lucknow where staff actually welcome dogs was rare. The open-air canopy at Sector J gave our beagle Bruno fresh water immediately while we enjoyed steamed momos and thick KitKat shakes.',
    photoUrl:
      'https://images.unsplash.com/photo-1625220194771-7ebedd0b7d1c?auto=format&fit=crop&w=600&q=80',
    createdAt: '1 week ago',
    helpfulCount: 23,
    verifiedGuest: true,
  },
  {
    id: 'rev-4',
    name: 'Devansh Tiwari',
    role: 'CA Finalist · Near Kapda Kothi, Aliganj',
    rating: 4,
    favoriteDish: 'Creamy Alfredo White Sauce Penne',
    vibeZone: 'Open-Air Pet-Friendly Deck',
    comment:
      'Superb white sauce pasta and Belgian Oreo shake at student-friendly prices. Evening hours around 7:30 PM get lively and packed, so pre-booking on Yash Patel’s WhatsApp saves waiting time.',
    photoUrl: '',
    createdAt: '2 weeks ago',
    helpfulCount: 8,
    verifiedGuest: true,
  },
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'crispy-corn',
    name: 'Crispy Corn',
    category: 'bites',
    categoryLabel: 'Bites & Starters',
    price: 129,
    description:
      'Golden wok-tossed sweet corn kernels dusted with house smoked paprika, roasted garlic, fresh coriander, and kaffir lime zest.',
    image:
      'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=600&q=80',
    servingNote: 'Serves 1–2 · Crunchy Bar-Style Starter',
    pairing: 'Pairs best with Hazelnut Iced Coffee',
    prepTime: '10 mins',
    isSignature: true,
  },
  {
    id: 'paneer-sandwich',
    name: 'Paneer Grilled Sandwich',
    category: 'bites',
    categoryLabel: 'Bites & Starters',
    price: 139,
    description:
      'Thick-cut malai cottage cheese marinated in mint-cilantro pesto, layered with molten cheddar and caramelized onions in toasted jumbo bread.',
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    servingNote: '4 Jumbo Triangles · Served with Salted Crisps',
    pairing: 'Pairs best with Classic Cold Coffee',
    prepTime: '12 mins',
    isSignature: true,
  },
  {
    id: 'steamed-momos',
    name: 'Fresh Steamed Momos',
    category: 'bites',
    categoryLabel: 'Bites & Starters',
    price: 119,
    description:
      'Six hand-pleated thin-skin Tibetan dumplings packed with finely minced farm greens, ginger, and our fiery roasted sesame red chili dip.',
    image:
      'https://images.unsplash.com/photo-1625220194771-7ebedd0b7d1c?auto=format&fit=crop&w=600&q=80',
    servingNote: '6 Pieces · House Schezwan & Mayo Dip',
    pairing: 'Pairs best with Emerald Mint Mojito',
    prepTime: '10 mins',
    isSignature: true,
  },
  {
    id: 'kurkure-momos',
    name: 'Tandoori Kurkure Momos',
    category: 'bites',
    categoryLabel: 'Bites & Starters',
    price: 149,
    description:
      'Crunchy panko-crusted dumplings tossed in smoky tandoori masala butter, mint chutney drizzle, and pickled lachha onions.',
    image:
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    servingNote: '6 Pieces · Extra Crunchy Signature',
    pairing: 'Pairs best with Belgian Oreo Shake',
    prepTime: '14 mins',
    isSignature: true,
  },
  {
    id: 'honey-chilli-potato',
    name: 'Crispy Honey Chilli Potato',
    category: 'bites',
    categoryLabel: 'Bites & Starters',
    price: 149,
    description:
      'Double-fried potato fingers glazed in wok-seared red chili garlic reduction, wildflower honey, toasted white sesame seeds, and spring scallions.',
    image:
      'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    servingNote: 'Shareable Platter · Sweet & Spicy Glaze',
    pairing: 'Pairs best with Fresh Strawberry Shake',
    prepTime: '12 mins',
  },
  {
    id: 'chilli-paneer',
    name: 'Wok-Tossed Chilli Paneer Dry',
    category: 'bites',
    categoryLabel: 'Bites & Starters',
    price: 189,
    description:
      'Velvety cubes of fresh cottage cheese flash-fried with tri-color bell peppers, crushed black pepper, soy-garlic glaze, and green chilies.',
    image:
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    servingNote: '8 Pieces · Indo-Chinese Classic',
    pairing: 'Pairs best with Veg Hakka Noodles',
    prepTime: '15 mins',
  },
  {
    id: 'alfredo-pasta',
    name: 'Creamy Alfredo White Sauce Penne',
    category: 'mains',
    categoryLabel: 'Continental & Italian',
    price: 189,
    description:
      'Al-dente durum wheat penne folded into velvety parmesan-garlic béchamel sauce with roasted broccoli, sweet corn, black olives, and garlic bread.',
    image:
      'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
    servingNote: 'Served with 2 Toasted Herb Garlic Breads',
    pairing: 'Pairs best with Emerald Mint Mojito',
    prepTime: '15 mins',
    isSignature: true,
  },
  {
    id: 'farmhouse-pizza',
    name: 'Farmhouse Loaded Cheese Pizza (9")',
    category: 'mains',
    categoryLabel: 'Continental & Italian',
    price: 229,
    description:
      'Hand-stretched artisan crust topped with San Marzano herb sauce, 100% mozzarella pull, grilled mushrooms, crisp capsicum, jalapeños, and sweet corn.',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    servingNote: '6 Slices · Medium 9-Inch Pan Crust',
    pairing: 'Pairs best with KitKat Thick Shake',
    prepTime: '18 mins',
    isSignature: true,
  },
  {
    id: 'perch-burger',
    name: 'The Perch Crunchy Veg Burger & Fries',
    category: 'mains',
    categoryLabel: 'Continental & Italian',
    price: 139,
    description:
      'Herb-crusted vegetable & cheese patty stacked inside a butter-toasted sesame brioche bun with chipotle southwest sauce, slaw, and salted fries.',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    servingNote: 'Includes Side of Crispy Salted Fries',
    pairing: 'Pairs best with Hazelnut Iced Coffee',
    prepTime: '12 mins',
  },
  {
    id: 'hakka-noodles-bowl',
    name: 'Street-Style Hakka Noodles & Manchurian Bowl',
    category: 'mains',
    categoryLabel: 'Chinese & Bowls',
    price: 169,
    description:
      'Smoky high-flame wok noodles tossed with julienned cabbage, carrots, and bean sprouts, served alongside 3 vegetable Manchurian dumplings in garlic gravy.',
    image:
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    servingNote: 'Full Meal Bowl · Student Favorite',
    pairing: 'Pairs best with Emerald Mint Cooler',
    prepTime: '14 mins',
  },
  {
    id: 'iced-coffee',
    name: 'Hazelnut Iced Coffee',
    category: 'brews',
    categoryLabel: 'Brews & Shakes',
    price: 159,
    description:
      'Double-shot Chikmagalur arabica espresso shaken over crystal ice with roasted Piedmont hazelnut reduction and cold-frothed cream.',
    image:
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    servingNote: '350 ml Tall Glass · 100% Arabica',
    pairing: 'Pairs best with Paneer Grilled Sandwich',
    prepTime: '6 mins',
    isSignature: true,
  },
  {
    id: 'kitkat-shake',
    name: 'Signature KitKat Crunch Thick Shake',
    category: 'brews',
    categoryLabel: 'Brews & Shakes',
    price: 180,
    description:
      'Rich Belgian chocolate ice cream blended thick with wafer-crunch KitKat bars, topped with whipped cream swirl and dark ganache drizzle.',
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    servingNote: '350 ml · Topped with KitKat Fingers',
    pairing: 'Pairs best with Crispy Corn',
    prepTime: '7 mins',
    isSignature: true,
  },
  {
    id: 'oreo-shake',
    name: 'Belgian Oreo Crumble Shake',
    category: 'brews',
    categoryLabel: 'Brews & Shakes',
    price: 160,
    description:
      'Velvety vanilla bean & dark cocoa shake spun with crushed Oreo cookies, crowned with chocolate fudge and a whole Oreo biscuit.',
    image:
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    servingNote: '350 ml · Aliganj Top Seller',
    pairing: 'Pairs best with Tandoori Kurkure Momos',
    prepTime: '7 mins',
  },
  {
    id: 'strawberry-shake',
    name: 'Fresh Strawberry Cream Shake',
    category: 'brews',
    categoryLabel: 'Brews & Shakes',
    price: 130,
    description:
      'Mahabaleshwar berry compote blended with chilled dairy cream and vanilla ice cream for a refreshing pastel-pink treat.',
    image:
      'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    servingNote: '350 ml · Real Berry Compote',
    pairing: 'Pairs best with Crispy Honey Chilli Potato',
    prepTime: '6 mins',
  },
  {
    id: 'emerald-mojito',
    name: 'Emerald Mint & Kaffir Cooler',
    category: 'brews',
    categoryLabel: 'Brews & Shakes',
    price: 129,
    description:
      'Garden-fresh muddled spearmint leaves, pressed green lime, crushed ice, and sparkling botanical soda with a Himalayan black salt rim.',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    servingNote: '350 ml · Zero Caffeine Refresher',
    pairing: 'Pairs best with Farmhouse Loaded Pizza',
    prepTime: '5 mins',
  },
  {
    id: 'student-duo-combo',
    name: 'The Perch Acoustic Duo Combo (For 2)',
    category: 'combos',
    categoryLabel: 'Curated Combos',
    price: 399,
    description:
      '1 Crispy Corn + 1 Paneer Grilled Sandwich + 2 Hazelnut Iced Coffees. Save ₹87 on our most-ordered date & bestie table combo.',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    servingNote: 'Serves 2 · Save ₹87 Instantly',
    pairing: 'Complete Table Experience',
    prepTime: '15 mins',
    isSignature: true,
  },
];

const LOOKBOOK_PHOTOS: GalleryItem[] = [
  {
    id: 'look-1',
    title: 'Open-Air Botanical Canopy Deck',
    zone: 'Outdoor Courtyard · Pet-Friendly',
    caption:
      'Breezy evening seating under warm string lights right near Kapda Kothi, Sector J. Leash-friendly with complimentary pet water bowls.',
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    spanClass: 'lg:col-span-7',
  },
  {
    id: 'look-2',
    title: 'Specialty Espresso & Thick Shake Bar',
    zone: 'Indoor Bar · 100% Arabica',
    caption:
      'Where our baristas pull fresh Chikmagalur espresso shots and spin thick KitKat & Belgian Oreo shakes until 11:00 PM.',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',
    spanClass: 'lg:col-span-5',
  },
  {
    id: 'look-3',
    title: 'Weekend Unplugged Acoustic Stage',
    zone: 'Jam Lounge · Fri–Sun 7:30 PM',
    caption:
      'Intimate live acoustic guitar sets, open-mic poetry, and indie jam nights for Lucknow University and Aliganj creators.',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
    spanClass: 'lg:col-span-4',
  },
  {
    id: 'look-4',
    title: 'Creator Desks & 150 Mbps Work Pods',
    zone: 'Quiet Work Zone · Universal Plugs',
    caption:
      'Ergonomic wood tables with power sockets at every seat so freelancers and students can work uninterrupted from 10:00 AM.',
    image:
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80',
    spanClass: 'lg:col-span-4',
  },
  {
    id: 'look-5',
    title: 'Group Birthday & Celebration Table',
    zone: 'Private Corner · 10–30 Guests',
    caption:
      'Custom table styling, curated party platters starting at ₹199/guest, and zero venue rental fee when pre-booked with Yash Patel.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    spanClass: 'lg:col-span-4',
  },
];

const HERO_VIBES = [
  {
    id: 'canopy',
    label: 'Open-Air Canopy',
    kicker: 'B-34, Sector J, Aliganj · Near Kapda Kothi',
    quote: '“Where every cup feels like a breather above the city rush.”',
    sub: 'Lush greenery, pet-friendly outdoor tables, and golden-hour cold brews curated by Yash Patel.',
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'acoustic',
    label: 'Acoustic Jam Nights',
    kicker: 'Every Friday – Sunday · 7:30 PM Onwards',
    quote: '“Lucknow’s warmest stage for indie musicians & unplugged stories.”',
    sub: 'Zero entry fee on jam nights. Grab a ₹129 Crispy Corn & ₹180 KitKat Shake by the stage.',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'workspace',
    label: '150 Mbps Study Pods',
    kicker: 'Open Daily 10:00 AM – 11:00 PM · Power at Every Seat',
    quote: '“Ship your next project over a ₹159 Hazelnut Iced Coffee.”',
    sub: 'Dedicated laptop desks, high-speed fiber Wi-Fi, and peaceful daytime acoustics.',
    image:
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
  },
];

const RATING_LABELS: Record<number, string> = {
  5: '5/5 — Loved Everything at The Perch!',
  4: '4/5 — Great Food & Cozy Vibe',
  3: '3/5 — Good Hangout Spot',
  2: '2/5 — Could Be Better',
  1: '1/5 — Needs Improvement',
};

function FeatherLogoIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="perchGradient"
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="55%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path
        d="M26.5 5.5C21.5 5.5 14.2 8.1 10.1 14.3C7.9 17.6 6.8 21.6 6.5 25.5L12.5 19.5C14.8 19.5 18.2 18.8 20.8 16.9L16.5 15.5L22.6 13.8C24.9 11.4 26.3 8.4 26.5 5.5Z"
        stroke="url(#perchGradient)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 26.5L17.5 14.5"
        stroke="url(#perchGradient)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VegMark() {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 whitespace-nowrap shrink-0"
      title="100% Pure Vegetarian"
    >
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 border border-emerald-400 rounded-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </span>
      <span>Pure Veg</span>
    </span>
  );
}

function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-900 via-emerald-950/50 to-zinc-950"
        aria-hidden={!failed}
      >
        <FeatherLogoIcon className="w-10 h-10 mb-2 opacity-75" />
        <span className="text-xs font-medium text-zinc-400">{fallbackLabel}</span>
      </div>
      {!failed && (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setFailed(true)}
          className="relative z-10 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </div>
  );
}

export default function App() {
  // Hero interactive atmosphere switcher
  const [activeHeroVibe, setActiveHeroVibe] = useState(0);

  // Digital Menu filters & search
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyUnder150, setOnlyUnder150] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Cart / Pre-Order Tray
  const [cart, setCart] = useState<Record<string, number>>({
    'crispy-corn': 1,
    'iced-coffee': 1,
  });
  const [isTrayDrawerOpen, setIsTrayDrawerOpen] = useState(false);
  const [orderType, setOrderType] = useState<'dine-in' | 'pickup'>('dine-in');

  // Lookbook Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [customLightboxPhoto, setCustomLightboxPhoto] = useState<{
    url: string;
    title: string;
    caption: string;
  } | null>(null);

  // Party & Group Calculator state
  const [partyGuests, setPartyGuests] = useState(10);
  const [partyTier, setPartyTier] = useState<'chill' | 'acoustic' | 'feast'>('acoustic');

  // Real Customer Reviews state (persisted via /api/reviews + localStorage fallback)
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const cached = localStorage.getItem('perch_verified_reviews_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_REVIEWS;
  });
  const [reviewFilter, setReviewFilter] = useState<'all' | '5star' | 'photos'>('all');
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // New Review Form Fields
  const [revName, setRevName] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [revDish, setRevDish] = useState('Crispy Corn');
  const [revZone, setRevZone] = useState('Open-Air Pet-Friendly Deck');
  const [revComment, setRevComment] = useState('');
  const [revPhotoData, setRevPhotoData] = useState('');
  const [revError, setRevError] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessBanner, setReviewSuccessBanner] = useState(false);

  // RSVP Booking Form state
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCount, setGuestCount] = useState('2 Guests');
  const [visitDate, setVisitDate] = useState('Today, Evening (5 PM - 8 PM)');
  const [seatingZone, setSeatingZone] = useState('Open-Air Pet-Friendly Deck');
  const [specialNote, setSpecialNote] = useState('');
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedReservation, setSubmittedReservation] = useState<{
    name: string;
    phone: string;
    guests: string;
    time: string;
    zone: string;
  } | null>(null);

  // Fetch live persisted reviews from server on mount
  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
          try {
            localStorage.setItem('perch_verified_reviews_v1', JSON.stringify(data.reviews));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // Fallback to existing state if offline
      });
  }, []);

  const reviewStats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return { avg: '4.9', total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    for (const r of reviews) {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
      sum += star;
    }
    return {
      avg: (sum / total).toFixed(1),
      total,
      counts,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (reviewFilter === '5star') return r.rating === 5;
      if (reviewFilter === 'photos') return Boolean(r.photoUrl && r.photoUrl.trim().length > 0);
      return true;
    });
  }, [reviews, reviewFilter]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 720;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.8);
          setRevPhotoData(compressed);
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = revName.trim();
    const cleanComment = revComment.trim();

    if (!cleanName) {
      setRevError('Please enter your name so guests can see who wrote the review.');
      return;
    }
    if (cleanComment.length < 8) {
      setRevError('Please write at least a short sentence sharing your experience at The Perch.');
      return;
    }

    setRevError('');
    setIsSubmittingReview(true);

    const payload = {
      name: cleanName,
      role: revRole.trim() || 'Sector J, Aliganj Guest',
      rating: revRating,
      favoriteDish: revDish,
      vibeZone: revZone,
      comment: cleanComment,
      photoUrl: revPhotoData,
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          localStorage.setItem('perch_verified_reviews_v1', JSON.stringify(data.reviews));
        }
      } else {
        throw new Error('Fallback to local persistence');
      }
    } catch {
      const fallbackReview: CustomerReview = {
        id: `rev-${Date.now()}`,
        ...payload,
        createdAt: 'Just now',
        helpfulCount: 1,
        verifiedGuest: true,
      };
      const updated = [fallbackReview, ...reviews];
      setReviews(updated);
      try {
        localStorage.setItem('perch_verified_reviews_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
    } finally {
      setIsSubmittingReview(false);
      setRevName('');
      setRevRole('');
      setRevRating(5);
      setRevComment('');
      setRevPhotoData('');
      setIsReviewModalOpen(false);
      setReviewFilter('all');
      setReviewSuccessBanner(true);
      setTimeout(() => setReviewSuccessBanner(false), 6000);
    }
  };

  const handleHelpfulVote = async (id: string) => {
    if (upvotedIds[id]) return;
    setUpvotedIds((prev) => ({ ...prev, [id]: true }));

    const optimistic = reviews.map((r) =>
      r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
    );
    setReviews(optimistic);
    try {
      localStorage.setItem('perch_verified_reviews_v1', JSON.stringify(optimistic));
      await fetch(`/api/reviews/${id}/helpful`, { method: 'POST' });
    } catch {
      // already updated optimistically
    }
  };

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = !onlyUnder150 || item.price <= 150;
      return matchesCat && matchesSearch && matchesPrice;
    });
  }, [activeCategory, searchQuery, onlyUnder150]);

  const cartSummary = useMemo(() => {
    let totalItems = 0;
    let totalPrice = 0;
    const items: Array<{ item: MenuItem; qty: number; subtotal: number }> = [];
    const lines: string[] = [];

    for (const item of MENU_ITEMS) {
      const qty = cart[item.id] || 0;
      if (qty > 0) {
        const subtotal = qty * item.price;
        totalItems += qty;
        totalPrice += subtotal;
        items.push({ item, qty, subtotal });
        lines.push(`${qty}x ${item.name} (₹${subtotal})`);
      }
    }
    return { totalItems, totalPrice, items, lines };
  }, [cart]);

  const partyEstimate = useMemo(() => {
    const perPersonRate = partyTier === 'chill' ? 199 : partyTier === 'acoustic' ? 279 : 349;
    const total = partyGuests * perPersonRate;
    const includes =
      partyTier === 'chill'
        ? '1 Signature Cold Coffee/Mojito + 1 Starter (Crispy Corn / Momos) + Shared Fries'
        : partyTier === 'acoustic'
        ? '1 Thick Shake/Iced Brew + 2 Starters + Farmhouse Pizza Slices + Reserved Stage Deck'
        : 'Unlimited Welcome Coolers + 3 Starters + Alfredo Pasta & Pizza Platter + Custom Cake Table Setup';
    return { perPersonRate, total, includes };
  }, [partyGuests, partyTier]);

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[id];
      } else {
        updated[id] = next;
      }
      return updated;
    });
  };

  const handleApplyPartyToRsvp = () => {
    setGuestCount(`${partyGuests} Guests (Group Package)`);
    setSeatingZone('Open-Air Pet-Friendly Deck');
    setSpecialNote(
      `Group Package (${partyTier.toUpperCase()} @ ₹${partyEstimate.perPersonRate}/person, Est. ₹${partyEstimate.total})`
    );
    const el = document.getElementById('reserve');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = guestName.trim();
    const cleanedPhone = guestPhone.replace(/\D/g, '');

    if (!trimmedName) {
      setFormError('Please enter your full name so Yash Patel’s team can reserve your table.');
      return;
    }
    if (cleanedPhone.length < 10) {
      setFormError('Please enter a valid 10-digit WhatsApp mobile number.');
      return;
    }

    setFormError('');
    setSubmittedReservation({
      name: trimmedName,
      phone: guestPhone.trim(),
      guests: guestCount,
      time: visitDate,
      zone: seatingZone,
    });
    setIsModalOpen(true);
  };

  const buildWhatsAppOrderLink = () => {
    const modeLabel =
      orderType === 'dine-in'
        ? 'Dine-In Table Pre-Order'
        : 'Self-Pickup (B-34, Sector J, Near Kapda Kothi)';
    const baseText =
      cartSummary.lines.length > 0
        ? `Hey Yash! New ${modeLabel} for The Cafe Perch:%0A${encodeURIComponent(
            cartSummary.lines.join('\n')
          )}%0ATotal: ₹${cartSummary.totalPrice}`
        : encodeURIComponent(
            "Hey Yash! I'd like to reserve a table at The Cafe Perch, Sector J, Aliganj."
          );
    return `https://wa.me/917880931148?text=${baseText}`;
  };

  const currentHero = HERO_VIBES[activeHeroVibe];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Contract: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/85 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title, single line with custom feather vector */}
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-zinc-50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400 rounded-sm"
          >
            <FeatherLogoIcon className="w-6 h-6 shrink-0" />
            <span>The Cafe Perch</span>
          </a>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300"
          >
            <a
              href="#menu"
              className="nav-link-emerald hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0"
            >
              Digital Menu
            </a>
            <a
              href="#lookbook"
              className="nav-link-emerald hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0"
            >
              Photo Lookbook
            </a>
            <a
              href="#packages"
              className="nav-link-emerald hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0"
            >
              Party Calculator
            </a>
            <a
              href="#story"
              className="nav-link-emerald hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0"
            >
              Guest Reviews ({reviewStats.total})
            </a>
            <a
              href="#location"
              className="nav-link-emerald hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0"
            >
              Location
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsTrayDrawerOpen(true)}
              className="perch-card-lift inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:brightness-105 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                Table Tray ({cartSummary.totalItems}) · ₹{cartSummary.totalPrice}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero Section: Split 1440px desktop presence with interactive Vibe Switcher */}
        <section className="relative overflow-hidden border-b border-zinc-900 pt-8 pb-14 lg:py-20">
          <div
            className="pointer-events-none absolute -top-36 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-24 right-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Column: Value Proposition */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-medium text-emerald-400 tracking-wide mb-4">
                  B-34, Sector J, Aliganj · Near Kapda Kothi · Hosted by Yash Patel
                </p>

                <h1
                  className="font-display font-bold tracking-tight text-zinc-50 leading-[1.07] mb-6"
                  style={{
                    fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                    textWrap: 'balance',
                  }}
                >
                  Aliganj’s Signature Sanctuary for{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
                    Craft Cold Brews, Wood-Fired Bites &amp; Live Acoustic Nights
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8">
                  Step into Sector J’s favorite open-air courtyard and creator lounge. Whether you
                  are craving ₹129 Crispy Corn, a thick ₹180 KitKat Shake, creamy Alfredo Penne, or
                  a pet-friendly evening table under warm string lights—The Cafe Perch is built for
                  unhurried conversations.
                </p>

                {/* Primary Decision Block */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <a
                    href="#reserve"
                    className="perch-card-lift inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 shadow-lg shadow-emerald-500/15 whitespace-nowrap shrink-0"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Your Table in 30s</span>
                  </a>

                  <a
                    href="#menu"
                    className="perch-card-lift inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-zinc-100 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 whitespace-nowrap shrink-0"
                  >
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <span>Explore 16+ Dishes &amp; Shakes</span>
                  </a>
                </div>

                {/* Unboxed Clean Metadata */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-zinc-400">
                  <span>Open 7 Days (10:00 AM – 11:00 PM)</span>
                  <span aria-hidden="true">·</span>
                  <span>Continental, Italian, Chinese &amp; Brews</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-emerald-400">
                    ₹400–₹500 Avg. for Two
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Multi-Scene Hero Showcase */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="perch-card-lift group relative w-full rounded-2xl overflow-hidden border border-zinc-800/90 bg-zinc-900 min-h-[410px] lg:h-full flex flex-col justify-between">
                  <img
                    src={currentHero.image}
                    alt={currentHero.label}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Measured contrast scrim */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/25"
                    aria-hidden="true"
                  />

                  {/* Top interactive scene selector tabs inside Hero media */}
                  <div className="relative z-10 p-4 flex items-center gap-1.5 flex-wrap">
                    {HERO_VIBES.map((vibe, idx) => (
                      <button
                        key={vibe.id}
                        type="button"
                        onClick={() => setActiveHeroVibe(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer backdrop-blur-md ${
                          activeHeroVibe === idx
                            ? 'bg-emerald-400 text-zinc-950 shadow-sm'
                            : 'bg-zinc-950/75 text-zinc-200 border border-zinc-700/80 hover:border-emerald-400/50'
                        }`}
                      >
                        {vibe.label}
                      </button>
                    ))}
                  </div>

                  {/* Bottom Scrim Caption */}
                  <div className="relative z-10 p-6 sm:p-7">
                    <p className="text-xs font-medium text-emerald-300 mb-2">
                      {currentHero.kicker}
                    </p>
                    <p className="font-display text-xl sm:text-2xl font-semibold text-zinc-50 mb-2">
                      {currentHero.quote}
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-300 mb-4">{currentHero.sub}</p>
                    <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-4 text-xs text-zinc-300">
                      <span className="font-mono tabular-nums">
                        Direct Desk: +91 78809 31148
                      </span>
                      <a
                        href="https://wa.me/917880931148?text=Hey%20Yash!%20I%20saw%20The%20Cafe%20Perch%20website%20and%20want%20to%20visit%20today."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                      >
                        <span>WhatsApp Yash Patel</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-width 4-Column Quantitative Proof & Aggregator Strip */}
            <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="perch-card-lift p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                <p className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-zinc-50 mb-1">
                  {reviewStats.avg} ★ / 5.0
                </p>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Live guest rating across {reviewStats.total} verified community reviews &amp;
                  aggregators
                </p>
              </div>

              <div className="perch-card-lift p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                <p className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
                  ₹119 – ₹229
                </p>
                <p className="text-xs sm:text-sm text-zinc-400">
                  All-day student-friendly pricing on Momos, Crispy Corn, Pastas &amp; Thick Shakes
                </p>
              </div>

              <div className="perch-card-lift p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                <p className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-zinc-50 mb-1">
                  10 AM – 11 PM
                </p>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Open 7 days a week for breakfast, remote work coffees &amp; late-night hangouts
                </p>
              </div>

              <div className="perch-card-lift p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                <p className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-amber-400 mb-1">
                  &lt; 5 Mins
                </p>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Direct WhatsApp table &amp; birthday celebration confirmation by Yash Patel’s team
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Multi-Category Digital Menu with Search & Dish Spotlight */}
        <section id="menu" className="py-16 lg:py-24 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-xs font-medium text-emerald-400 tracking-wide mb-2">
                  01. Complete Digital Menu · Continental, Italian, Chinese &amp; Specialty Brews
                </p>
                <h2
                  className="font-display text-2xl sm:text-4xl font-bold text-zinc-50 tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Crafted Fresh in Sector J — Pre-Order to Your Table
                </h2>
              </div>

              {/* Search & Under ₹150 Quick Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search KitKat shake, momos, pasta..."
                    aria-label="Search menu items"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setOnlyUnder150((prev) => !prev)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    onlyUnder150
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  Under ₹150 Pocket Savers
                </button>
              </div>
            </div>

            {/* Category Filter Bar */}
            <div
              role="tablist"
              aria-label="Menu Category Tabs"
              className="flex items-center gap-1.5 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 overflow-x-auto mb-10"
            >
              {(
                [
                  { id: 'all', label: `All Items (${MENU_ITEMS.length})` },
                  {
                    id: 'bites',
                    label: `Bites & Starters (${
                      MENU_ITEMS.filter((i) => i.category === 'bites').length
                    })`,
                  },
                  {
                    id: 'mains',
                    label: `Pizza, Pasta & Mains (${
                      MENU_ITEMS.filter((i) => i.category === 'mains').length
                    })`,
                  },
                  {
                    id: 'brews',
                    label: `Brews & Thick Shakes (${
                      MENU_ITEMS.filter((i) => i.category === 'brews').length
                    })`,
                  },
                  {
                    id: 'combos',
                    label: `Curated Combos (${
                      MENU_ITEMS.filter((i) => i.category === 'combos').length
                    })`,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-zinc-950 shadow-sm'
                      : 'text-zinc-300 hover:text-zinc-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Empty State if search filters out everything */}
            {filteredMenu.length === 0 ? (
              <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-12 text-center">
                <p className="text-base font-semibold text-zinc-200 mb-2">
                  No dishes matched “{searchQuery}”
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 mb-4">
                  Try clearing your search filter or switching back to All Items.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setOnlyUnder150(false);
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 cursor-pointer"
                >
                  Reset Menu Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredMenu.map((item) => {
                  const qty = cart[item.id] || 0;
                  return (
                    <motion.article
                      layout
                      key={item.id}
                      className="perch-card-lift group rounded-2xl bg-zinc-900/70 border border-zinc-800/90 hover:border-emerald-500/40 overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div
                          onClick={() => setSelectedDish(item)}
                          className="cursor-pointer relative"
                        >
                          <ResilientImage
                            src={item.image}
                            alt={item.name}
                            fallbackLabel={item.name}
                            className="h-56 w-full"
                          />
                          <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-md bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-[11px] font-medium text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Pairing &amp; Details
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-2">
                            <span>
                              {item.categoryLabel}
                              {item.isSignature ? ' · House Bestseller' : ''}
                            </span>
                            <VegMark />
                          </div>

                          <div className="flex items-baseline justify-between gap-4 mb-2.5">
                            <h3
                              onClick={() => setSelectedDish(item)}
                              className="font-display text-lg font-semibold text-zinc-50 group-hover:text-emerald-300 transition-colors cursor-pointer"
                            >
                              {item.name}
                            </h3>
                            <span className="font-mono tabular-nums text-lg font-bold text-emerald-400 shrink-0">
                              ₹{item.price}
                            </span>
                          </div>

                          <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                            {item.description}
                          </p>

                          <p className="text-xs text-zinc-500">
                            Prep: <span className="font-mono tabular-nums">{item.prepTime}</span> ·{' '}
                            {item.pairing}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-3 border-t border-zinc-800/70 flex items-center justify-between gap-4">
                        <span className="text-xs text-zinc-400 truncate">{item.servingNote}</span>

                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Tray</span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-2 bg-zinc-950 border border-emerald-500/40 rounded-lg px-2 py-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, -1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="p-1 text-zinc-300 hover:text-emerald-400 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono tabular-nums text-xs font-semibold text-emerald-300 min-w-[1.25rem] text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="p-1 text-zinc-300 hover:text-emerald-400 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}

            {/* Persistent Pre-Order Summary Bar */}
            <div className="mt-10 perch-card-lift rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-zinc-100">
                      Your Table Pre-Order Tray
                    </h3>
                    <span className="text-xs text-zinc-400">·</span>
                    <span className="font-mono tabular-nums text-sm font-semibold text-emerald-400">
                      {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'Item' : 'Items'} (₹
                      {cartSummary.totalPrice})
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                    {cartSummary.lines.length > 0
                      ? cartSummary.lines.join(' · ')
                      : 'Add your favorite bites & shakes above so your order is steaming hot when you reach Sector J.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTrayDrawerOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Review &amp; Customize Tray
                </button>
                <a
                  href={buildWhatsAppOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:brightness-105 whitespace-nowrap shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: High-Resolution Photo Lookbook & Interactive Lightbox Gallery */}
        <section id="lookbook" className="py-16 lg:py-24 border-b border-zinc-900 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="text-xs font-medium text-emerald-400 tracking-wide mb-2">
                  02. Visual Lookbook · Inside B-34, Sector J, Aliganj
                </p>
                <h2
                  className="font-display text-2xl sm:text-4xl font-bold text-zinc-50 tracking-tight mb-3"
                  style={{ textWrap: 'balance' }}
                >
                  Explore Every Corner Before You Step In
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                  Click any photograph to inspect full-screen details of our open-air pet-friendly
                  courtyard, espresso &amp; shake bar, acoustic stage, and laptop power pods.
                </p>
              </div>
              <span className="text-xs text-zinc-400 whitespace-nowrap shrink-0">
                Click any photo to open Fullscreen Lookbook
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {LOOKBOOK_PHOTOS.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(index)}
                  className={`${photo.spanClass} perch-card-lift group rounded-2xl bg-zinc-900/70 border border-zinc-800/90 hover:border-emerald-500/40 overflow-hidden cursor-pointer flex flex-col justify-between`}
                >
                  <ResilientImage
                    src={photo.image}
                    alt={photo.title}
                    fallbackLabel={photo.title}
                    className={index < 2 ? 'h-72 sm:h-80 w-full' : 'h-60 w-full'}
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 text-xs text-emerald-400 font-medium mb-1.5">
                      <span>{photo.zone}</span>
                      <span className="text-zinc-400 group-hover:text-emerald-300 transition-colors">
                        Expand Photo &#8599;
                      </span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-50 mb-1.5">
                      {photo.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Interactive Birthday / College Party Estimator */}
        <section
          id="packages"
          className="py-16 lg:py-24 border-b border-zinc-900 bg-zinc-900/25"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6">
                <p className="text-xs font-medium text-emerald-400 tracking-wide mb-2">
                  03. Interactive Group &amp; Birthday Planner
                </p>
                <h2
                  className="font-display text-2xl sm:text-4xl font-bold text-zinc-50 tracking-tight mb-4"
                  style={{ textWrap: 'balance' }}
                >
                  Hosting a Birthday, Farewell or College Jam in Aliganj?
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
                  Skip expensive banquet halls that charge ₹5,000+ just for space. At The Cafe
                  Perch, you pay <strong className="text-emerald-400">₹0 venue rental</strong>—only
                  for the fresh food and shakes your guests enjoy. Use our live calculator to plan
                  your group budget in seconds.
                </p>

                <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Complimentary birthday cake table setup &amp; custom acoustic playlist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Semi-private Open-Air Canopy or Indoor Lounge seating for 6–35 guests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct coordination with owner Yash Patel (+91 78809 31148)</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="perch-card-lift rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-50">
                      Instant Group Package Estimator
                    </h3>
                    <span className="font-mono tabular-nums text-xs text-emerald-400">
                      Zero Hall Fee
                    </span>
                  </div>

                  {/* Guest Count Slider */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                      <label htmlFor="party-guests-range" className="font-medium text-zinc-300">
                        Number of Guests
                      </label>
                      <span className="font-mono tabular-nums text-base font-bold text-emerald-400">
                        {partyGuests} Guests
                      </span>
                    </div>
                    <input
                      id="party-guests-range"
                      type="range"
                      min={4}
                      max={35}
                      value={partyGuests}
                      onChange={(e) => setPartyGuests(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-zinc-500 font-mono tabular-nums mt-1">
                      <span>4 Guests</span>
                      <span>15 Guests</span>
                      <span>35 Guests</span>
                    </div>
                  </div>

                  {/* Tier Selector */}
                  <div className="mb-6">
                    <p className="text-xs font-medium text-zinc-300 mb-2.5">
                      Select Food &amp; Shake Tier
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPartyTier('chill')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          partyTier === 'chill'
                            ? 'bg-emerald-500/15 border-emerald-400 text-zinc-50'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <p className="text-xs font-semibold">Coffee &amp; Bites</p>
                        <p className="font-mono tabular-nums text-sm font-bold text-emerald-400 mt-0.5">
                          ₹199 / guest
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPartyTier('acoustic')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          partyTier === 'acoustic'
                            ? 'bg-emerald-500/15 border-emerald-400 text-zinc-50'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <p className="text-xs font-semibold">Acoustic Party</p>
                        <p className="font-mono tabular-nums text-sm font-bold text-emerald-400 mt-0.5">
                          ₹279 / guest
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPartyTier('feast')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          partyTier === 'feast'
                            ? 'bg-emerald-500/15 border-emerald-400 text-zinc-50'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <p className="text-xs font-semibold">Full Perch Feast</p>
                        <p className="font-mono tabular-nums text-sm font-bold text-emerald-400 mt-0.5">
                          ₹349 / guest
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Output Summary Box */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 mb-6">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <span className="text-xs text-zinc-400">Estimated All-Inclusive Total</span>
                      <span className="font-mono tabular-nums text-2xl font-bold text-emerald-400">
                        ₹{partyEstimate.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <strong className="text-zinc-100">Includes:</strong> {partyEstimate.includes}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyPartyToRsvp}
                    className="w-full py-3.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:brightness-105 cursor-pointer"
                  >
                    Lock This ₹{partyEstimate.total.toLocaleString('en-IN')} Package in RSVP Form &darr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Real Interactive Customer Reviews & Photo Wall */}
        <section id="story" className="py-16 lg:py-24 border-b border-zinc-900 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header + Write a Review Primary CTA */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-medium text-emerald-400 tracking-wide mb-2">
                  04. Live Community Guestbook · Post Your Real Experience
                </p>
                <h2
                  className="font-display text-2xl sm:text-4xl font-bold text-zinc-50 tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Real Reviews from Aliganj &amp; Lucknow University Guests
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="perch-card-lift inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:brightness-105 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Write a Real Review</span>
                </button>
              </div>
            </div>

            {reviewSuccessBanner && (
              <div
                role="status"
                className="mb-8 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs sm:text-sm text-emerald-300 flex items-center justify-between gap-4"
              >
                <span>
                  Thank you! Your review has been published live to The Cafe Perch community wall.
                </span>
                <button
                  type="button"
                  onClick={() => setReviewSuccessBanner(false)}
                  className="text-emerald-200 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Rating Summary Dashboard + Filter Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
              {/* Left 5 Cols: Live Score & Star Distribution Bars */}
              <div className="lg:col-span-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="text-left sm:pr-6 sm:border-r border-zinc-800 shrink-0">
                  <p className="font-mono tabular-nums text-4xl sm:text-5xl font-bold text-zinc-50">
                    {reviewStats.avg}
                  </p>
                  <div className="flex items-center gap-1 text-amber-400 my-2" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400 font-mono tabular-nums">
                    Based on {reviewStats.total} reviews
                  </p>
                </div>

                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewStats.counts[star] || 0;
                    const pct =
                      reviewStats.total > 0 ? Math.round((count / reviewStats.total) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-2.5 text-xs">
                        <span className="font-mono tabular-nums text-zinc-300 w-7 shrink-0">
                          {star} ★
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800/80">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono tabular-nums text-zinc-400 w-8 text-right shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 7 Cols: Interactive Filter Controls & Instant Prompt */}
              <div className="lg:col-span-7 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-100 mb-1">
                    Visited B-34, Sector J Recently? Share Your Honest Feedback
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Whether you tried our ₹129 Crispy Corn, jammed at an unplugged open-mic evening,
                    or worked from our 150 Mbps laptop desks, your review helps fellow Lucknowites
                    discover their favorite dish and table corner.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-800/80">
                  <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setReviewFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        reviewFilter === 'all'
                          ? 'bg-emerald-400 text-zinc-950'
                          : 'text-zinc-300 hover:text-zinc-50'
                      }`}
                    >
                      All Reviews ({reviews.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('5star')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        reviewFilter === '5star'
                          ? 'bg-emerald-400 text-zinc-950'
                          : 'text-zinc-300 hover:text-zinc-50'
                      }`}
                    >
                      5 ★ Rated ({reviewStats.counts[5] || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('photos')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        reviewFilter === 'photos'
                          ? 'bg-emerald-400 text-zinc-950'
                          : 'text-zinc-300 hover:text-zinc-50'
                      }`}
                    >
                      With Guest Photos (
                      {reviews.filter((r) => r.photoUrl && r.photoUrl.trim().length > 0).length})
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Post Review with Photo &rarr;</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((rev) => (
                <article
                  key={rev.id}
                  className="perch-card-lift p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 flex flex-col justify-between"
                >
                  <div>
                    {/* Star Row & Timestamp */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1" aria-label={`${rev.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-zinc-500">{rev.createdAt}</span>
                    </div>

                    {/* Unboxed Metadata: Dish Ordered & Vibe Zone */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-emerald-400 mb-3">
                      <span>Ordered: {rev.favoriteDish}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-zinc-400">{rev.vibeZone}</span>
                    </div>

                    {/* Review Comment */}
                    <p className="text-sm text-zinc-200 leading-relaxed mb-4">“{rev.comment}”</p>

                    {/* Optional Guest Photo Thumbnail */}
                    {rev.photoUrl && rev.photoUrl.trim().length > 0 && (
                      <div
                        onClick={() =>
                          setCustomLightboxPhoto({
                            url: rev.photoUrl!,
                            title: `${rev.name} — ${rev.favoriteDish}`,
                            caption: rev.comment,
                          })
                        }
                        className="mb-4 rounded-xl overflow-hidden border border-zinc-800 h-40 w-full cursor-pointer group relative bg-zinc-950"
                      >
                        <img
                          src={rev.photoUrl}
                          alt={`Photo shared by ${rev.name}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-zinc-950/80 text-[11px] text-zinc-200">
                          View Photo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Reviewer Attribution + Helpful Upvote Button */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{rev.name}</p>
                      <p className="text-xs text-zinc-400">{rev.role}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleHelpfulVote(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        upvotedIds[rev.id]
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Breathtaking RSVP / Table Booking Form + Exact Location Details */}
        <section id="reserve" className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Direct RSVP Form */}
              <div className="lg:col-span-7 perch-card-lift rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-10">
                <p className="text-xs font-medium text-emerald-400 tracking-wide mb-2">
                  05. Instant Priority Table &amp; Celebration RSVP
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-50 mb-2">
                  Reserve Your Perch in 30 Seconds
                </h2>
                <p className="text-sm text-zinc-400 mb-8">
                  Zero booking fee. Lock in an open-air pet-friendly table, plug-in work desk, or
                  group celebration corner. Yash Patel’s team confirms via WhatsApp within 5 minutes.
                </p>

                <form onSubmit={handleBookingSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="guest-name"
                        className="block text-xs font-medium text-zinc-300 mb-2"
                      >
                        Your Full Name *
                      </label>
                      <input
                        id="guest-name"
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Aditya Pratap"
                        className="perch-card-lift w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="guest-phone"
                        className="block text-xs font-medium text-zinc-300 mb-2"
                      >
                        WhatsApp Number *
                      </label>
                      <input
                        id="guest-phone"
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="perch-card-lift w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 font-mono tabular-nums placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label
                        htmlFor="guest-count"
                        className="block text-xs font-medium text-zinc-300 mb-2"
                      >
                        Party Size
                      </label>
                      <input
                        id="guest-count"
                        type="text"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="perch-card-lift w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="visit-date"
                        className="block text-xs font-medium text-zinc-300 mb-2"
                      >
                        Preferred Slot
                      </label>
                      <select
                        id="visit-date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="perch-card-lift w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-400"
                      >
                        <option value="Today, Morning (10 AM - 1 PM)">
                          Today, Morning (10 AM - 1 PM)
                        </option>
                        <option value="Today, Afternoon (1 PM - 5 PM)">
                          Today, Afternoon (1 PM - 5 PM)
                        </option>
                        <option value="Today, Evening (5 PM - 8 PM)">
                          Today, Evening (5 PM - 8 PM)
                        </option>
                        <option value="Tonight, Late Chill (8 PM - 11 PM)">
                          Tonight, Late Chill (8 PM - 11 PM)
                        </option>
                        <option value="Tomorrow, Evening Slot">Tomorrow, Evening Slot</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="seating-zone"
                        className="block text-xs font-medium text-zinc-300 mb-2"
                      >
                        Preferred Vibe Zone
                      </label>
                      <select
                        id="seating-zone"
                        value={seatingZone}
                        onChange={(e) => setSeatingZone(e.target.value)}
                        className="perch-card-lift w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-400"
                      >
                        <option value="Open-Air Pet-Friendly Deck">
                          Open-Air Pet-Friendly Deck
                        </option>
                        <option value="Live Acoustic / Open-Mic Corner">
                          Live Acoustic / Open-Mic Corner
                        </option>
                        <option value="Laptop-Friendly Power Desk">
                          Laptop-Friendly Power Desk
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="special-note"
                      className="block text-xs font-medium text-zinc-300 mb-2"
                    >
                      Special Request (Optional — Pet bowl, birthday cake setup, power strip)
                    </label>
                    <input
                      id="special-note"
                      type="text"
                      value={specialNote}
                      onChange={(e) => setSpecialNote(e.target.value)}
                      placeholder="e.g. Bringing our golden retriever / Need corner table with plug point"
                      className="perch-card-lift w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs sm:text-sm text-amber-300"
                    >
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="perch-card-lift w-full py-4 px-6 rounded-xl font-semibold text-sm sm:text-base text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:brightness-105 transition-all cursor-pointer"
                  >
                    Confirm Table Reservation
                  </button>
                </form>
              </div>

              {/* Right Column: Hardcoded Verified Business Location & Hours */}
              <div id="location" className="lg:col-span-5 space-y-6">
                <div className="perch-card-lift rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-8">
                  <p className="text-xs font-medium text-emerald-400 tracking-wide mb-2">
                    Verified Business Coordinates
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-50 mb-6">
                    Visit The Cafe Perch Today
                  </h3>

                  <div className="space-y-5 text-sm">
                    <div className="flex items-start gap-3.5">
                      <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-zinc-100 mb-0.5">Exact Location</p>
                        <p className="text-zinc-300 leading-relaxed">
                          B-34, Sector J, Aliganj, Lucknow, Uttar Pradesh 226024 (Near Kapda Kothi)
                        </p>
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=The+Cafe+Perch+B-34+Sector+J+Aliganj+Lucknow+226024"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 mt-2"
                        >
                          <span>Open Directions in Google Maps</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80 flex items-start gap-3.5">
                      <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-zinc-100 mb-0.5">Operational Hours</p>
                        <p className="font-mono tabular-nums text-zinc-300">
                          10:00 AM - 11:00 PM (Open 7 Days)
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          Morning Breakfast, Daytime Co-Working &amp; Late-Night Cold Brews
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80 flex items-start gap-3.5">
                      <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-zinc-100 mb-0.5">
                          Official WhatsApp &amp; Direct Desk
                        </p>
                        <p className="font-mono tabular-nums text-zinc-200 font-medium">
                          +91 78809 31148
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Owner &amp; Host: <strong className="text-zinc-200">Yash Patel</strong>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <a
                            href="tel:+917880931148"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 text-xs font-semibold text-zinc-200 whitespace-nowrap shrink-0"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Call +917880931148</span>
                          </a>
                          <a
                            href="https://wa.me/917880931148"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-semibold text-emerald-300 whitespace-nowrap shrink-0"
                          >
                            <span>WhatsApp Yash’s Team</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-base font-bold text-zinc-100 mb-2">
              <FeatherLogoIcon className="w-5 h-5" />
              <span>The Cafe Perch</span>
            </div>
            <p className="text-xs text-zinc-400">
              B-34, Sector J, Aliganj, Lucknow, Uttar Pradesh 226024 (Near Kapda Kothi) · Owned by
              Yash Patel
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            <a href="#menu" className="hover:text-emerald-400 transition-colors">
              Digital Menu
            </a>
            <a href="#lookbook" className="hover:text-emerald-400 transition-colors">
              Photo Lookbook
            </a>
            <a href="#packages" className="hover:text-emerald-400 transition-colors">
              Party Calculator
            </a>
            <a href="#story" className="hover:text-emerald-400 transition-colors">
              Guest Reviews
            </a>
            <a href="#reserve" className="hover:text-emerald-400 transition-colors">
              Table RSVP
            </a>
            <a
              href="tel:+917880931148"
              className="font-mono tabular-nums text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              +91 78809 31148
            </a>
          </div>
        </div>
      </footer>

      {/* Write a Real Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="write-review-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto"
            onClick={() => setIsReviewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl my-8"
            >
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                aria-label="Close review form"
                className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <p className="text-xs font-medium text-emerald-400 mb-1">
                The Cafe Perch · B-34, Sector J, Aliganj
              </p>
              <h3 id="write-review-title" className="font-display text-2xl font-bold text-zinc-50 mb-1">
                Post Your Real Guest Review
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6">
                Your review is published live on this page to help fellow guests in Lucknow.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Interactive 1-5 Star Selector */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-2">
                    Your Overall Rating *
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = (hoverRating ?? revRating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => setRevRating(star)}
                            aria-label={`Rate ${star} out of 5 stars`}
                            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-amber-400/50 transition-transform hover:scale-105 cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                active ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-medium text-amber-300">
                      {RATING_LABELS[hoverRating ?? revRating]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="rev-name"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Your Name *
                    </label>
                    <input
                      id="rev-name"
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="e.g. Priyanshu Mishra"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="rev-role"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Area / College / Profession
                    </label>
                    <input
                      id="rev-role"
                      type="text"
                      value={revRole}
                      onChange={(e) => setRevRole(e.target.value)}
                      placeholder="e.g. Sector J Resident / LU Student"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="rev-dish"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Favorite Dish / Drink Tried
                    </label>
                    <select
                      id="rev-dish"
                      value={revDish}
                      onChange={(e) => setRevDish(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-400"
                    >
                      {MENU_ITEMS.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} (₹{m.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="rev-zone"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Seating Zone Visited
                    </label>
                    <select
                      id="rev-zone"
                      value={revZone}
                      onChange={(e) => setRevZone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-400"
                    >
                      <option value="Open-Air Pet-Friendly Deck">
                        Open-Air Pet-Friendly Deck
                      </option>
                      <option value="Live Acoustic / Open-Mic Corner">
                        Live Acoustic / Open-Mic Corner
                      </option>
                      <option value="Laptop-Friendly Power Desk">
                        Laptop-Friendly Power Desk
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="rev-comment"
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Your Honest Review *
                  </label>
                  <textarea
                    id="rev-comment"
                    rows={3}
                    required
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="Tell others how the food, coffee, Wi-Fi, or vibe was..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Optional Real Photo Upload from Phone/Laptop */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Add a Food or Vibe Photo (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-400/50 text-xs font-medium text-zinc-200 cursor-pointer">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span>{revPhotoData ? 'Change Photo' : 'Upload Photo from Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {revPhotoData && (
                      <div className="flex items-center gap-2">
                        <img
                          src={revPhotoData}
                          alt="Upload preview"
                          className="w-10 h-10 rounded-lg object-cover border border-emerald-400/50"
                        />
                        <button
                          type="button"
                          onClick={() => setRevPhotoData('')}
                          className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {revError && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-300"
                  >
                    {revError}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="flex-1 py-3.5 px-5 rounded-xl text-sm font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:brightness-105 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Publishing Review...' : 'Publish Real Review Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="py-3.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Guest Review Photo Lightbox */}
      <AnimatePresence>
        {customLightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-lg"
            onClick={() => setCustomLightboxPhoto(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setCustomLightboxPhoto(null)}
                aria-label="Close guest photo"
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-950/80 text-zinc-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="h-[360px] sm:h-[420px] w-full bg-zinc-950">
                <img
                  src={customLightboxPhoto.url}
                  alt={customLightboxPhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-zinc-50 mb-1">
                  {customLightboxPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300">“{customLightboxPhoto.caption}”</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dish Spotlight Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md"
            onClick={() => setSelectedDish(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedDish(null)}
                aria-label="Close dish details"
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-950/80 text-zinc-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <ResilientImage
                src={selectedDish.image}
                alt={selectedDish.name}
                fallbackLabel={selectedDish.name}
                className="h-64 w-full"
              />
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-2">
                  <span>
                    {selectedDish.categoryLabel} · Prep {selectedDish.prepTime}
                  </span>
                  <VegMark />
                </div>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <h3 className="font-display text-2xl font-bold text-zinc-50">
                    {selectedDish.name}
                  </h3>
                  <span className="font-mono tabular-nums text-xl font-bold text-emerald-400">
                    ₹{selectedDish.price}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  {selectedDish.description}
                </p>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-1 mb-6">
                  <p>
                    <span className="text-zinc-500">Portion:</span> {selectedDish.servingNote}
                  </p>
                  <p>
                    <span className="text-zinc-500">Barista Pairing:</span> {selectedDish.pairing}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      updateCartQty(selectedDish.id, 1);
                      setSelectedDish(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 cursor-pointer"
                  >
                    Add to Table Tray (₹{selectedDish.price})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDish(null)}
                    className="py-3 px-4 rounded-xl text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Photo Lookbook Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-lg"
            onClick={() => setLightboxIndex(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close photo lightbox"
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-950/80 text-zinc-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-[360px] sm:h-[480px] w-full bg-zinc-950">
                <img
                  src={LOOKBOOK_PHOTOS[lightboxIndex].image}
                  alt={LOOKBOOK_PHOTOS[lightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + LOOKBOOK_PHOTOS.length) % LOOKBOOK_PHOTOS.length
                    )
                  }
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/80 text-zinc-100 hover:bg-emerald-400 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % LOOKBOOK_PHOTOS.length)
                  }
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/80 text-zinc-100 hover:bg-emerald-400 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-emerald-400 mb-1">
                    {LOOKBOOK_PHOTOS[lightboxIndex].zone} · Photo {lightboxIndex + 1} of{' '}
                    {LOOKBOOK_PHOTOS.length}
                  </p>
                  <h3 className="font-display text-xl font-bold text-zinc-50 mb-1">
                    {LOOKBOOK_PHOTOS[lightboxIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    {LOOKBOOK_PHOTOS[lightboxIndex].caption}
                  </p>
                </div>
                <a
                  href="#reserve"
                  onClick={() => {
                    setSeatingZone(LOOKBOOK_PHOTOS[lightboxIndex].title);
                    setLightboxIndex(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 whitespace-nowrap shrink-0"
                >
                  Reserve This Zone &rarr;
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-Over Table Pre-Order Tray Drawer */}
      <AnimatePresence>
        {isTrayDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex justify-end bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setIsTrayDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col justify-between p-6"
            >
              <div className="overflow-y-auto pr-1">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <h3 className="font-display text-xl font-bold text-zinc-50">
                      Your Perch Order Tray
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Direct WhatsApp dispatch to B-34, Sector J, Aliganj
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTrayDrawerOpen(false)}
                    aria-label="Close tray drawer"
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Dine-in vs Pickup Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 my-5">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine-in')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      orderType === 'dine-in'
                        ? 'bg-emerald-400 text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Dine-In Table Pre-Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      orderType === 'pickup'
                        ? 'bg-emerald-400 text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Self-Pickup (Kapda Kothi)
                  </button>
                </div>

                {cartSummary.items.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-zinc-400 mb-4">Your tray is currently empty.</p>
                    <button
                      type="button"
                      onClick={() => setIsTrayDrawerOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-950 bg-emerald-400 cursor-pointer"
                    >
                      Browse Menu Items
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartSummary.items.map(({ item, qty, subtotal }) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-zinc-100">{item.name}</p>
                          <p className="font-mono tabular-nums text-xs text-zinc-400">
                            ₹{item.price} each · Subtotal ₹{subtotal}
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, -1)}
                            className="p-1 text-zinc-300 hover:text-emerald-400 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono tabular-nums text-xs font-semibold text-emerald-300 min-w-[1.25rem] text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            className="p-1 text-zinc-300 hover:text-emerald-400 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-zinc-400">
                    Estimated Total (Pay at Cafe Counter / UPI)
                  </span>
                  <span className="font-mono tabular-nums text-2xl font-bold text-emerald-400">
                    ₹{cartSummary.totalPrice}
                  </span>
                </div>

                <a
                  href={buildWhatsAppOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:brightness-105"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Order to Yash’s WhatsApp (+917880931148)</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom RSVP Confirmation Modal Overlay */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 p-6 sm:p-8 text-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close confirmation modal"
              className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-5">
              <Check className="w-6 h-6" />
            </div>

            <h3
              id="rsvp-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-zinc-50 mb-3"
            >
              ✨ Table Reserved! Hey, Yash Patel's team will text you on WhatsApp within 5 minutes
              to confirm.
            </h3>

            {submittedReservation && (
              <div className="my-5 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-left text-xs text-zinc-300 space-y-1.5">
                <p>
                  <span className="text-zinc-500">Guest:</span>{' '}
                  <strong className="text-zinc-100">{submittedReservation.name}</strong> (
                  <span className="font-mono tabular-nums">{submittedReservation.phone}</span>)
                </p>
                <p>
                  <span className="text-zinc-500">Party &amp; Slot:</span>{' '}
                  {submittedReservation.guests} · {submittedReservation.time}
                </p>
                <p>
                  <span className="text-zinc-500">Zone:</span> {submittedReservation.zone}
                </p>
                <p>
                  <span className="text-zinc-500">Address:</span> B-34, Sector J, Aliganj (Near
                  Kapda Kothi)
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <a
                href={`https://wa.me/917880931148?text=${encodeURIComponent(
                  `Hey Yash! Just reserved a table at The Cafe Perch for ${
                    submittedReservation?.name || 'us'
                  } (${submittedReservation?.guests || '2 Guests'}, ${
                    submittedReservation?.time || 'Today'
                  } in ${submittedReservation?.zone || 'Open-Air Deck'}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:brightness-105"
              >
                <span>Send Instant WhatsApp Ping</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Conversion Widget: Permanent green WhatsApp floating icon at bottom right with animate-ping */}
      <a
        href="https://wa.me/917880931148?text=Hey%20Yash!%20I'd%20like%20to%20book%20a%20table%20or%20order%20at%20The%20Cafe%20Perch%20(Sector%20J,%20Aliganj)."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly with Yash Patel's team on WhatsApp (+91 78809 31148)"
        className="fixed bottom-5 right-5 z-40 group inline-flex items-center gap-3"
      >
        <span className="hidden sm:inline-block px-3.5 py-2 rounded-xl bg-zinc-900/95 border border-emerald-500/40 text-xs font-semibold text-emerald-300 shadow-lg backdrop-blur-md">
          Chat with Yash’s Team
        </span>
        <span className="relative flex items-center justify-center w-14 h-14">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"
            aria-hidden="true"
          />
          <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-xl shadow-emerald-500/30 transition-transform duration-200 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
              aria-hidden="true"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.126.556 4.124 1.535 5.862l-1.535 5.603 5.747-1.508c1.693.924 3.635 1.449 5.699 1.449 6.627 0 12-5.373 12-12s-5.373-12-11.446-11.406z" />
            </svg>
          </span>
        </span>
      </a>
    </div>
  );
}
