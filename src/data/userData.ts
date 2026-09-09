import { UserProfile } from '../types';

export const AVATAR_PRESETS = [
  {
    id: 'marcus',
    name: 'Marcus (Default)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHVzsyb8L47lJhd10o_xTGpk5iXusVVmVmNDwm_NrypBOuzi6TwBCR2WXZFR6clozyeeAuEXU-E-feAnRa-LHwLnDCPyyF2uVjN995uiG7qESiMrmvvJo_l2lGIvJHjj2hfvz1Au3f9Xkh6lmFOcDQ78KiqfLRIqCSi2MF_GJNkp6risMERaUD0iSnciC5G-z6uLXhRRuoEQUxLlJZh2ms8n-6r_LyiMbfCugrQ-khCYTyl0X8ZsWeig'
  },
  {
    id: 'elena',
    name: 'Elena (Warm Outdoor)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'david',
    name: 'David (Casual)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sarah',
    name: 'Sarah (Canine Trainer)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'alex',
    name: 'Alex (Active Guardian)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'chloe',
    name: 'Chloe (Sunny Garden)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'jordan',
    name: 'Jordan (Golden Hour)',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pup-golden',
    name: 'Golden Companion',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pup-playful',
    name: 'Playful Pup',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80'
  }
];

export const DEFAULT_USER: UserProfile = {
  id: 'user-marcus',
  name: 'Marcus Vance',
  email: 'marcus.vance@example.com',
  phone: '(512) 892-4011',
  location: 'Austin, TX',
  avatarUrl: AVATAR_PRESETS[0].url,
  role: 'guardian',
  bio: 'Lifelong golden retriever and active dog guardian. Passionate about ethical home breeding and puppy social conditioning.',
  isLoggedIn: true
};

export const DEMO_ACCOUNTS: { label: string; user: UserProfile }[] = [
  {
    label: 'Marcus Vance (Verified Guardian)',
    user: DEFAULT_USER
  },
  {
    label: 'Elena Rostova (Rescue Adopter)',
    user: {
      id: 'user-elena',
      name: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      phone: '(415) 320-9981',
      location: 'San Francisco, CA',
      avatarUrl: AVATAR_PRESETS[1].url,
      role: 'adopter',
      bio: 'Dedicated advocate for accredited rescue pups and senior dog welfare. Loving home with fenced acre.',
      isLoggedIn: true
    }
  },
  {
    label: 'David Chen (Canine Enthusiast)',
    user: {
      id: 'user-david',
      name: 'David Chen',
      email: 'david.chen@example.com',
      phone: '(206) 555-0149',
      location: 'Seattle, WA',
      avatarUrl: AVATAR_PRESETS[2].url,
      role: 'guardian',
      bio: 'Agility enthusiast, avid hiker, looking for a companion to join our Pacific Northwest outdoor adventures.',
      isLoggedIn: true
    }
  }
];

const USER_STORAGE_KEY = 'pawpalace_user_profile';

export const loadStoredUser = (): UserProfile => {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.id) {
        return parsed as UserProfile;
      }
    }
  } catch (e) {
    console.warn('Failed to load user profile from localStorage:', e);
  }
  return DEFAULT_USER;
};

export const saveStoredUser = (user: UserProfile) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to save user profile to localStorage:', e);
  }
};
