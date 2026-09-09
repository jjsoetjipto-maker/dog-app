export type Screen = 'home' | 'find-dogs' | 'dog-gear' | 'dog-detail' | 'verified-breeders' | 'health-safety';

export interface Dog {
  id: string;
  name: string;
  breed: string;
  category: 'puppy' | 'young' | 'adult' | 'senior' | 'rescue';
  isRescue?: boolean;
  price: number;
  adoptionFeeLabel?: string;
  location: string;
  distanceMiles?: number;
  ageText: string;
  gender: 'Male' | 'Female';
  color: string;
  image: string;
  gallery?: string[];
  breederName: string;
  breederBadge: string; // e.g. 'Verified Breeder', 'Elite Breeder', 'Rescue Partner', 'AKC Inspected'
  breederInitials: string;
  breederRating: number;
  breederReviewsCount: number;
  badges: string[];
  verifiedStatus: string;
  summary?: string;
  temperament?: {
    breedHeritage: string;
    energyLevel: string;
    trainability: string;
    coatColor: string;
    traits: string[];
  };
  healthCredentials?: {
    title: string;
    desc: string;
  }[];
}

export interface GearProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag?: string;
  tagColor?: string;
  category: 'harnesses' | 'beds' | 'crates' | 'collars' | 'nutrition' | 'starter-kits';
  inStockBadge?: string;
  description: string;
  specs?: string[];
  colors?: string[];
  sizes?: string[];
  subBadge?: string;
}

export interface CartItem {
  product: GearProduct;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface SafeMeetingPoint {
  id: string;
  name: string;
  category: 'vet_clinic' | 'police_safe_zone' | 'dog_park' | 'breeder_facility' | 'other';
  categoryLabel: string;
  address: string;
  city: string;
  state?: string;
  zip?: string;
  rating?: number;
  reviewCount?: number;
  hours?: string;
  safetyFeatures: string[];
  mapsUri: string;
  googleMapsSnippet?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isGroundingVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'breeder';
  senderName: string;
  text: string;
  timestamp: string;
  proposedMeetingPoint?: SafeMeetingPoint;
}

export interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  content: string;
  author: string;
  authorRole: string;
  initials: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  role: 'guardian' | 'breeder' | 'adopter';
  bio?: string;
  isLoggedIn: boolean;
}

