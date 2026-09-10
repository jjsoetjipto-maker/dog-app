import { Dog, ApprovalStatus } from '../types';
import { DOGS } from './mockData';

const STORAGE_KEY = 'pawpalace_managed_dogs';
const OWNER_AUTH_KEY = 'pawpalace_owner_authenticated';
export const OWNER_DEFAULT_PASSCODE = 'paste393';
export const OWNER_DEFAULT_EMAIL = 'jj.soetjipto@gmail.com';

// Pre-seeded approval states so the Owner Portal has a rich, realistic queue immediately
export const INITIAL_SUBMISSION_QUEUE: Dog[] = [
  ...DOGS.map((dog, idx) => {
    // Archie and Bella are already fully approved
    if (idx === 0) {
      return {
        ...dog,
        approvalStatus: 'approved' as ApprovalStatus,
        nameApprovalStatus: 'approved' as ApprovalStatus,
        photoApprovalStatus: 'approved' as ApprovalStatus,
        photoNotes: 'High-definition, clear eye contact, verified parentage.',
        nameNotes: 'Standard pedigree format approved.',
        submittedAt: '2 days ago',
        lastReviewedAt: 'Yesterday',
        reviewedBy: OWNER_DEFAULT_EMAIL,
      };
    }
    if (idx === 1) {
      return {
        ...dog,
        approvalStatus: 'approved' as ApprovalStatus,
        nameApprovalStatus: 'approved' as ApprovalStatus,
        photoApprovalStatus: 'approved' as ApprovalStatus,
        photoNotes: 'AAHA clinic verified photo timestamp.',
        nameNotes: 'Name clean and registered.',
        submittedAt: '3 days ago',
        lastReviewedAt: '2 days ago',
        reviewedBy: OWNER_DEFAULT_EMAIL,
      };
    }
    // Luna has photo pending review
    if (idx === 2) {
      return {
        ...dog,
        approvalStatus: 'pending' as ApprovalStatus,
        nameApprovalStatus: 'approved' as ApprovalStatus,
        photoApprovalStatus: 'pending' as ApprovalStatus,
        photoNotes: 'Awaiting owner review for background clarity.',
        nameNotes: 'Breed-appropriate name verified.',
        submittedAt: '4 hours ago',
      };
    }
    // Winston has name flagged (e.g., breeder submitted as "WINSTON-CHAMPION-100")
    if (idx === 3) {
      return {
        ...dog,
        approvalStatus: 'pending' as ApprovalStatus,
        nameApprovalStatus: 'flagged' as ApprovalStatus,
        photoApprovalStatus: 'approved' as ApprovalStatus,
        nameNotes: 'Breeder typed name in ALL CAPS. Owner should standardize.',
        photoNotes: 'Excellent natural lighting and clear facial marking.',
        submittedAt: '1 hour ago',
      };
    }
    // Default rest to approved
    return {
      ...dog,
      approvalStatus: 'approved' as ApprovalStatus,
      nameApprovalStatus: 'approved' as ApprovalStatus,
      photoApprovalStatus: 'approved' as ApprovalStatus,
      submittedAt: '1 week ago',
      reviewedBy: OWNER_DEFAULT_EMAIL,
    };
  }),
  // Extra pending submissions specifically waiting for owner approval
  {
    id: 'pending-copper',
    name: 'Cooper 🐾',
    breed: 'Labrador Retriever',
    category: 'puppy',
    price: 1550,
    location: 'Houston, TX',
    distanceMiles: 80,
    ageText: '8 Weeks Old',
    gender: 'Male',
    color: 'Chocolate Brown',
    image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80'
    ],
    breederName: 'Lone Star Labradors',
    breederBadge: 'Tier-1 Certified Breeder',
    breederInitials: 'LL',
    breederRating: 4.92,
    breederReviewsCount: 19,
    badges: ['DNA Verified', 'OFA Hips Clear', 'Microchipped'],
    verifiedStatus: 'Pending Owner Review',
    summary: 'Spirited chocolate lab puppy from working hunting lineage. Super loving and gentle temperament.',
    approvalStatus: 'pending' as ApprovalStatus,
    nameApprovalStatus: 'pending' as ApprovalStatus,
    photoApprovalStatus: 'pending' as ApprovalStatus,
    nameNotes: 'Contains emoji in submitted name. Owner may want to remove emoji.',
    photoNotes: 'Main picture high quality; check gallery photo #2 for lighting.',
    submittedAt: 'Just now',
  },
  {
    id: 'pending-daisy',
    name: 'Daisy Mae',
    breed: 'French Bulldog',
    category: 'puppy',
    price: 2400,
    location: 'Dallas, TX',
    distanceMiles: 110,
    ageText: '11 Weeks Old',
    gender: 'Female',
    color: 'Lilac Fawn',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'
    ],
    breederName: 'Prestige Frenchies',
    breederBadge: 'AKC Inspected',
    breederInitials: 'PF',
    breederRating: 4.88,
    breederReviewsCount: 14,
    badges: ['DNA Verified', 'Cardiac Clear', 'Microchipped'],
    verifiedStatus: 'Pending Owner Review',
    summary: 'Adorable lilac fawn Frenchie with wide open nares and clear respiratory health clearances.',
    approvalStatus: 'pending' as ApprovalStatus,
    nameApprovalStatus: 'approved' as ApprovalStatus,
    photoApprovalStatus: 'flagged' as ApprovalStatus,
    photoNotes: 'Single photo provided. Owner may request additional headshot and profile angle.',
    submittedAt: '35 minutes ago',
  },
  {
    id: 'rejected-buster',
    name: 'Buster',
    breed: 'Beagle',
    category: 'puppy',
    price: 950,
    location: 'Fort Worth, TX',
    distanceMiles: 190,
    ageText: '10 Weeks Old',
    gender: 'Male',
    color: 'Tri-Color Classic',
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&q=80'
    ],
    breederName: 'Lone Star Kennels (Unverified)',
    breederBadge: 'Rejected Applicant',
    breederInitials: 'LS',
    breederRating: 3.2,
    breederReviewsCount: 2,
    badges: ['Unverified Source'],
    verifiedStatus: 'Rejected by Owner',
    summary: 'Puppy submission rejected by platform owner due to missing parental health and OFA genetic clearances.',
    approvalStatus: 'rejected' as ApprovalStatus,
    nameApprovalStatus: 'rejected' as ApprovalStatus,
    photoApprovalStatus: 'rejected' as ApprovalStatus,
    nameNotes: 'Rejected: Applicant submitted misleading pedigree registration.',
    photoNotes: 'Rejected by Owner: Low resolution, missing required dam nursing verification photos. Excluded from public shop.',
    submittedAt: 'Yesterday',
    lastReviewedAt: 'Yesterday',
    reviewedBy: OWNER_DEFAULT_EMAIL,
  }
];

export const CURATED_REPLACEMENT_PHOTOS = [
  {
    label: 'Golden Retriever Pup (Studio High-Res)',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    breed: 'Golden Retriever',
  },
  {
    label: 'Australian Shepherd (Outdoor Natural Light)',
    url: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=800&q=80',
    breed: 'Australian Shepherd',
  },
  {
    label: 'French Bulldog Pup (Clean Contrast)',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    breed: 'French Bulldog',
  },
  {
    label: 'German Shepherd Puppy (Verified Clear)',
    url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
    breed: 'German Shepherd',
  },
  {
    label: 'Labrador Retriever Pup (High Dynamic Range)',
    url: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&q=80',
    breed: 'Labrador Retriever',
  },
  {
    label: 'Bernese Mountain Puppy (Crisp Focus)',
    url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    breed: 'Bernese Mountain Dog',
  },
  {
    label: 'Corgi Pup (Clear Headshot)',
    url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    breed: 'Pembroke Welsh Corgi',
  }
];

export function loadManagedDogs(): Dog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading managed dogs from localStorage:', err);
  }
  return INITIAL_SUBMISSION_QUEUE;
}

export function saveManagedDogs(dogs: Dog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dogs));
  } catch (err) {
    console.error('Error saving managed dogs to localStorage:', err);
  }
}

export function isOwnerAuthenticated(): boolean {
  try {
    return localStorage.getItem(OWNER_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setOwnerAuthenticated(auth: boolean): void {
  try {
    if (auth) {
      localStorage.setItem(OWNER_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(OWNER_AUTH_KEY);
    }
  } catch (err) {
    console.error('Error updating owner auth state:', err);
  }
}
