export type Screen = 'home' | 'find-dogs' | 'dog-gear' | 'dog-detail' | 'recommended-dogs' | 'verified-breeders' | 'health-safety' | 'owner-portal' | 'vet-finder' | 'grooming-finder';

export type ApprovalStatus = 'approved' | 'pending' | 'flagged' | 'rejected';

export interface DogPricePoint {
  date: string;
  price: number;
  milestone: string;
  note?: string;
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  category: 'puppy' | 'young' | 'adult' | 'senior' | 'rescue';
  isRescue?: boolean;
  price: number;
  priceHistory?: DogPricePoint[];
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
  // Owner moderation & governance fields
  approvalStatus?: ApprovalStatus;
  nameApprovalStatus?: ApprovalStatus;
  photoApprovalStatus?: ApprovalStatus;
  photoNotes?: string;
  nameNotes?: string;
  submittedAt?: string;
  lastReviewedAt?: string;
  reviewedBy?: string;
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
  approvalStatus?: ApprovalStatus;
  rejectionNotes?: string;
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

export interface DogActivitiesInfo {
  favoriteToys: string[];
  favoriteGames: string[];
  dailyQuirk: string;
  relaxationSpot: string;
  favoriteTreat: string;
  energyWindow: string;
  socialStyle: string;
}

export interface SellerProfileInfo {
  name: string;
  role: string;
  avatarUrl: string;
  kennelOrFacility: string;
  location: string;
  phoneVerified: boolean;
  yearsActive: number;
  responseRate: string;
  badge: string;
  quote?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'breeder' | 'seller';
  senderName: string;
  text: string;
  timestamp: string;
  proposedMeetingPoint?: SafeMeetingPoint;
  activitiesInfo?: DogActivitiesInfo;
  sellerProfile?: SellerProfileInfo;
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

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
export type AppCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';

export interface AppSettings {
  theme: ThemeMode;
  language: AppLanguage;
  currency: AppCurrency;
  distanceUnit: 'miles' | 'km';
  escrowAlerts: boolean;
  soundEffects: boolean;
}

export type VetCareType = 'emergency-hospital' | 'general-practice' | 'specialty-surgery' | 'urgent-care' | 'mobile-vet';

export interface VetReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  petType?: string;
}

export interface VetClinic {
  id: string;
  name: string;
  careType: VetCareType;
  typeLabel: string;
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  distanceMiles: number;
  phone: string;
  hours: string;
  isOpenNow: boolean;
  is24_7Emergency: boolean;
  image: string;
  gallery?: string[];
  leadVet: {
    name: string;
    title: string;
    credentials: string;
    bio: string;
    avatarUrl?: string;
  };
  accreditations: string[];
  services: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  acceptedInsurance: string[];
  virtualConsultAvailable: boolean;
  featuredReview?: VetReview;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface VetAppointment {
  id: string;
  clinicId: string;
  clinicName: string;
  clinicPhone: string;
  clinicAddress: string;
  petName: string;
  petBreed: string;
  reason: string;
  date: string;
  timeSlot: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt: string;
}

export type GroomingSalonType = 'luxury-spa' | 'boutique-salon' | 'mobile-van' | 'fear-free' | 'self-wash';

export interface GroomingServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  startingPrice: number;
}

export interface GroomingSalon {
  id: string;
  name: string;
  salonType: GroomingSalonType;
  typeLabel: string;
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  isOpenNow: boolean;
  isMobileVan?: boolean;
  acceptsWalkIns?: boolean;
  image: string;
  gallery?: string[];
  headGroomer: {
    name: string;
    title: string;
    certifications: string;
    bio: string;
    avatarUrl?: string;
  };
  specialties: string[];
  services: GroomingServiceItem[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceMiles?: number;
  features: string[];
}

export interface GroomingAppointment {
  id: string;
  salonId: string;
  salonName: string;
  salonAddress: string;
  salonPhone: string;
  petName: string;
  petBreed: string;
  petWeightLbs: number;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  specialNotes?: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
}


