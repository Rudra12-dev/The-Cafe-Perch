import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

const INITIAL_REVIEWS = [
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

function ensureReviewsData() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(INITIAL_REVIEWS, null, 2), 'utf-8');
  }
}

function readReviews() {
  ensureReviewsData();
  try {
    const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_REVIEWS;
  }
}

function writeReviews(reviews: unknown[]) {
  ensureReviewsData();
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '4mb' }));

  app.get('/api/reviews', (_req, res) => {
    const reviews = readReviews();
    res.json({ reviews });
  });

  app.post('/api/reviews', (req, res) => {
    const { name, role, rating, favoriteDish, vibeZone, comment, photoUrl } = req.body || {};

    const cleanName = String(name || '').trim();
    const cleanComment = String(comment || '').trim();
    const numRating = Math.min(5, Math.max(1, Number(rating) || 5));

    if (!cleanName || cleanComment.length < 5) {
      res.status(400).json({
        error: 'Please provide your name and a short review (at least 5 characters).',
      });
      return;
    }

    const reviews = readReviews();
    const newReview = {
      id: `rev-${Date.now()}`,
      name: cleanName.slice(0, 60),
      role: String(role || 'Aliganj Guest').trim().slice(0, 70) || 'Aliganj Guest',
      rating: numRating,
      favoriteDish: String(favoriteDish || 'Crispy Corn').trim().slice(0, 80),
      vibeZone: String(vibeZone || 'Open-Air Pet-Friendly Deck').trim().slice(0, 80),
      comment: cleanComment.slice(0, 800),
      photoUrl: typeof photoUrl === 'string' && photoUrl.length < 2500000 ? photoUrl : '',
      createdAt: 'Just now',
      helpfulCount: 1,
      verifiedGuest: true,
    };

    const updated = [newReview, ...reviews];
    writeReviews(updated);
    res.status(201).json({ review: newReview, reviews: updated });
  });

  app.post('/api/reviews/:id/helpful', (req, res) => {
    const { id } = req.params;
    const reviews = readReviews();
    const updated = reviews.map((rev: { id: string; helpfulCount?: number }) => {
      if (rev.id === id) {
        return { ...rev, helpfulCount: (rev.helpfulCount || 0) + 1 };
      }
      return rev;
    });
    writeReviews(updated);
    res.json({ reviews: updated });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Cafe Perch server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
