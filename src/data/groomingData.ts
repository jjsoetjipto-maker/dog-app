import { GroomingSalon, GroomingAppointment } from '../types';

export const GROOMING_SALONS: GroomingSalon[] = [
  {
    id: 'groom-barton-springs-spa',
    name: 'Barton Springs Canine Spa & Hydrotherapy',
    salonType: 'luxury-spa',
    typeLabel: 'Luxury Canine Spa & Wellness',
    rating: 4.96,
    reviewCount: 318,
    address: '1402 S Congress Ave',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    phone: '(512) 441-7297',
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM • Sun: 10:00 AM - 4:00 PM',
    isOpenNow: true,
    isMobileVan: false,
    acceptsWalkIns: true,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'
    ],
    headGroomer: {
      name: 'Camilla Rios, CMG',
      title: 'Certified Master Canine Groomer & Hydrotherapist',
      certifications: 'NDGAA Master Stylist • Fear Free Elite Certified',
      bio: 'Over 14 years perfecting breed-specific scissor styling, therapeutic ozone baths, and low-stress handling for timid companions.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    specialties: [
      'Warm Ozone Hydromassage Bath',
      'Organic Blueberry Tearless Facial',
      'Breed Standard Hand Scissoring',
      'Fear Free Low-Stress Handling'
    ],
    features: [
      '100% Cage-Free Drying Suites',
      'Organic Botanical Shampoos (Sulfate-Free)',
      'Orthopedic Hydrotherapy Tubs',
      'Live Video Stream for Guardians'
    ],
    priceRange: '$$$',
    coordinates: {
      lat: 30.2580,
      lng: -97.7660
    },
    services: [
      {
        id: 'srv-full-spa',
        name: 'The Royal Canine Signature Spa & Styling',
        description: 'Warm ozone hydro-bath, organic blueberry facial, hand scissoring haircut, sanitary trim, gland expression, and warm towel paw wrap.',
        durationMinutes: 90,
        startingPrice: 85
      },
      {
        id: 'srv-bath-blowout',
        name: 'Hydro-Massage Bath & Fluff Blowout',
        description: 'Double wash with botanical conditioning shampoo, velocity fluff dry (no cages), ear cleansing, and sanitary hygiene trim.',
        durationMinutes: 60,
        startingPrice: 55
      },
      {
        id: 'srv-deshedding',
        name: 'FURminator De-Shedding & Undercoat Release',
        description: 'Specialized deep undercoat release shampoo, high-velocity blowout to eject dead hairs, and 30-min thorough brushout.',
        durationMinutes: 75,
        startingPrice: 70
      },
      {
        id: 'srv-puppy-intro',
        name: 'First Puppy Gentle Spa Introduction (<6 Months)',
        description: 'Gentle warm water acclamation, mild tearless honey shampoo, face scissor styling, toe trim, and positive praise treat training.',
        durationMinutes: 45,
        startingPrice: 40
      },
      {
        id: 'srv-nail-dremel',
        name: 'Nail Trim & Diamond Dremel Filing',
        description: 'Smooth rounded nail trimming and soothing organic paw pad vitamin E balm massage.',
        durationMinutes: 15,
        startingPrice: 20
      }
    ]
  },
  {
    id: 'groom-paws-mobile-van',
    name: 'Paws on the Run Mobile Luxury Grooming Van',
    salonType: 'mobile-van',
    typeLabel: 'Doorstep Mobile Canine Spa',
    rating: 4.98,
    reviewCount: 246,
    address: 'Serving Greater Austin Metro (Direct to Your Driveway)',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 593-1820',
    hours: 'Mon - Sun: 7:30 AM - 7:00 PM • By Appointment',
    isOpenNow: true,
    isMobileVan: true,
    acceptsWalkIns: false,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80'
    ],
    headGroomer: {
      name: 'Tyler Jensen',
      title: 'Senior Mobile Stylist & Canine Behavioralist',
      certifications: 'AKC S.A.F.E. Certified Groomer • Pet First Aid & CPR',
      bio: 'Specializing in private, zero-car-ride grooming. Our luxury Mercedes Sprinter mobile salon arrives directly at your front door.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    specialties: [
      'Curbside Driveway Grooming (Zero Travel for Dogs)',
      '1-on-1 Dedicated Attention (No Other Pets)',
      'Solar & Inverter Powered (Ultra-Quiet)',
      'Heated Hydro-Surge Cleansing'
    ],
    features: [
      'Self-Contained Heated Pure Water Tank',
      'Medical-Grade HEPA Air Purification',
      'Low-Decibel Hand Blow Dryers',
      'No Exposure to Unfamiliar Dogs'
    ],
    priceRange: '$$$$',
    coordinates: {
      lat: 30.2729,
      lng: -97.7444
    },
    services: [
      {
        id: 'srv-mobile-full',
        name: 'Complete Mobile Doorstep Luxury Grooming',
        description: 'Full custom haircut, warm hydro-surge bath, blueberry facial, ear cleansing, teeth brushing, gland expression, and nail filing right outside your home.',
        durationMinutes: 80,
        startingPrice: 110
      },
      {
        id: 'srv-mobile-bath',
        name: 'Mobile Curbside Bath & De-Shed Spa',
        description: 'Warm pressurized bath, botanical dead sea mud scrub, blowout, full deshed brushout, and paw balm.',
        durationMinutes: 50,
        startingPrice: 75
      }
    ]
  },
  {
    id: 'groom-dapper-dog-boutique',
    name: 'The Dapper Dog Boutique & Gentle Grooming',
    salonType: 'boutique-salon',
    typeLabel: 'Neighborhood Boutique Salon',
    rating: 4.88,
    reviewCount: 194,
    address: '6811 Burnet Rd',
    city: 'Austin',
    state: 'TX',
    zip: '78757',
    phone: '(512) 459-3320',
    hours: 'Tue - Sat: 8:30 AM - 5:30 PM • Sun - Mon: Closed',
    isOpenNow: true,
    isMobileVan: false,
    acceptsWalkIns: true,
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80',
    headGroomer: {
      name: 'Elena Rostova',
      title: 'Lead Stylist & Rescue Rehabilitation Groomer',
      certifications: 'International Professional Groomers (IPG)',
      bio: 'Passionate about calming anxious rescues and older companions through patient, positive-reinforcement grooming.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
    },
    specialties: [
      'Hypoallergenic Colloidal Oatmeal Soaks',
      'Rescue Dog Rehabilitation Grooming',
      'Natural Essential Oil Calming Mist',
      'Walk-In Express Nail Trimming'
    ],
    features: [
      'Open-Concept Visible Grooming Stations',
      'Low Vibration Quiet Clippers',
      'Hypoallergenic & Scent-Free Options',
      'Complimentary Bandana & Treat Bag'
    ],
    priceRange: '$$',
    coordinates: {
      lat: 30.3540,
      lng: -97.7330
    },
    services: [
      {
        id: 'srv-boutique-haircut',
        name: 'Custom Breed Cut & Bath Package',
        description: 'Precision scissor styling, warm conditioning bath, sanitary clip, ear flush, and nail buffing.',
        durationMinutes: 75,
        startingPrice: 68
      },
      {
        id: 'srv-boutique-bath',
        name: 'Soothing Sensitive Skin Oatmeal Soak',
        description: 'Organic colloidal oatmeal bath soothing irritated, itchy skin, paired with conditioning coat butter.',
        durationMinutes: 50,
        startingPrice: 48
      }
    ]
  },
  {
    id: 'groom-highland-park-atelier',
    name: 'Highland Park Canine Salon & Atelier',
    salonType: 'luxury-spa',
    typeLabel: 'Prestige Canine Styling Atelier',
    rating: 4.97,
    reviewCount: 284,
    address: '4224 Oak Lawn Ave',
    city: 'Dallas',
    state: 'TX',
    zip: '75219',
    phone: '(214) 522-8830',
    hours: 'Mon - Sat: 8:00 AM - 6:30 PM',
    isOpenNow: true,
    isMobileVan: false,
    acceptsWalkIns: false,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    headGroomer: {
      name: 'Henri Delacroix, CMG',
      title: 'Master Scissor Artisan & European Show Stylist',
      certifications: 'European Grooming Association Master • AKC Show Judge',
      bio: 'Trained in Paris and Milan, Henri specializes in purebred breed-standard styling, show-coat preservation, and terrier hand-stripping.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    specialties: [
      'Authentic Terrier Hand-Stripping',
      'Poodle & Doodle Asian Fusion Styling',
      'Dead Sea Mineral Coat Restoration',
      'Safe Oxygen-Monitored Drying'
    ],
    features: [
      'Private Temperature-Controlled Suites',
      'Imported Silk Protein Conditioners',
      'Pulse Oximeter Monitored BOAS Care',
      'Sparkling Water Hydration Bowls'
    ],
    priceRange: '$$$$',
    coordinates: {
      lat: 32.8130,
      lng: -96.8120
    },
    services: [
      {
        id: 'srv-atelier-couture',
        name: 'The Atelier Haute Canine Styling',
        description: 'Consultation with Master Groomer, deep dead sea mineral mud wrap, artisan scissor hand-finish, teeth plaque treatment, and blueberry facial.',
        durationMinutes: 105,
        startingPrice: 125
      },
      {
        id: 'srv-atelier-strip',
        name: 'Terrier & Wirehair Hand-Stripping',
        description: 'Traditional manual dead-hair pulling preserving natural wiry coat texture and rich pigmentation.',
        durationMinutes: 120,
        startingPrice: 140
      }
    ]
  },
  {
    id: 'groom-preston-hollow-mobile',
    name: 'Preston Hollow Mobile Dog Styling Van',
    salonType: 'mobile-van',
    typeLabel: 'Concierge Mobile Grooming Unit',
    rating: 4.95,
    reviewCount: 168,
    address: 'Serving Dallas, Preston Hollow & Park Cities',
    city: 'Dallas',
    state: 'TX',
    zip: '75225',
    phone: '(214) 691-4402',
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    isOpenNow: true,
    isMobileVan: true,
    acceptsWalkIns: false,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
    headGroomer: {
      name: 'Brianna Hayes',
      title: 'Mobile Wellness Stylist',
      certifications: 'Fear Free Certified Professional • NDGAA Member',
      bio: 'Bringing 11 years of gentle grooming directly to the driveways of Dallas companion guardians.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
    },
    specialties: [
      'Direct Driveway Appointments',
      'Warm Hydro-Jet Cleansing',
      'Therapeutic Paw Pad Butter Treatment',
      'Hypoallergenic Tearless Baths'
    ],
    features: [
      'Self-Powered Silent Battery Inverters',
      'Fresh Filtered Warm Water Onboard',
      'No Crating or Multi-Pet Distractions',
      'Real-Time ETA SMS Notifications'
    ],
    priceRange: '$$$',
    coordinates: {
      lat: 32.8688,
      lng: -96.7981
    },
    services: [
      {
        id: 'srv-preston-mobile-full',
        name: 'Full Driveway Grooming & Breed Scissor Cut',
        description: 'Complete bath, de-matting brushout, breed styling, ear cleansing, teeth brushing, and sanitary trim.',
        durationMinutes: 75,
        startingPrice: 105
      }
    ]
  },
  {
    id: 'groom-metroplex-self-wash',
    name: 'Metroplex Gentle Paws & Self-Wash Spa',
    salonType: 'self-wash',
    typeLabel: 'Full Service Salon & Self-Wash Bays',
    rating: 4.82,
    reviewCount: 310,
    address: '2710 N Stemmons Fwy',
    city: 'Dallas',
    state: 'TX',
    zip: '75207',
    phone: '(214) 630-9190',
    hours: 'Daily: 7:30 AM - 8:00 PM (Bays Open Until 7:30 PM)',
    isOpenNow: true,
    isMobileVan: false,
    acceptsWalkIns: true,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    headGroomer: {
      name: 'Marcus Bell',
      title: 'Operations Director & Lead Groomer',
      certifications: 'Professional Pet Stylist • Certified Bathing Tech',
      bio: 'We offer both professional full-service styling and state-of-the-art self-wash suites where guardians bond with their pups without the mess at home.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    },
    specialties: [
      'Self-Wash Bays with Ergonomic Waist-High Tubs',
      'Professional Staff Grooming & Blowouts',
      'Commercial High-Velocity Blow Dryers',
      'Aprons, Towels & Specialty Shampoos Provided'
    ],
    features: [
      'Tearless Blueberry & Neem Shampoos on Tap',
      'No Reservation Required for Self-Wash',
      'Professional Stylists on Staff for Cuts',
      'Wheelchair & Ramp Accessible Tubs'
    ],
    priceRange: '$',
    coordinates: {
      lat: 32.8020,
      lng: -96.8410
    },
    services: [
      {
        id: 'srv-self-wash-bay',
        name: 'DIY Self-Wash Bay Session (All Supplies Included)',
        description: 'Access to waist-high stainless steel tub, warm water sprayers, 4 premium shampoos, fluffy towels, and professional blow dryers. Zero cleanup for you!',
        durationMinutes: 45,
        startingPrice: 22
      },
      {
        id: 'srv-pro-bath-cut',
        name: 'Professional Full Service Bath & Cut',
        description: 'Drop off with our certified staff for a comprehensive bath, brushout, haircut, nail clip, and ear cleaning.',
        durationMinutes: 70,
        startingPrice: 58
      }
    ]
  },
  {
    id: 'groom-heights-lounge',
    name: 'The Heights Dog Grooming & Wellness Lounge',
    salonType: 'boutique-salon',
    typeLabel: 'Holistic Boutique Grooming Studio',
    rating: 4.94,
    reviewCount: 275,
    address: '1120 Heights Blvd',
    city: 'Houston',
    state: 'TX',
    zip: '77008',
    phone: '(713) 861-7387',
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    isOpenNow: true,
    isMobileVan: false,
    acceptsWalkIns: true,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    headGroomer: {
      name: 'Jessica Tran',
      title: 'NDGAA Master Stylist & Holistic Groomer',
      certifications: 'National Dog Groomers Association • Canine Skin & Coat Specialist',
      bio: 'Over 13 years crafting breed perfection with gentle organic techniques that heal dry skin, eliminate hot spots, and leave coats silky.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    specialties: [
      'Silk Protein Deep Conditioning Coat Mask',
      'Asian Fusion Scissor Finishing',
      'Gentle Microbubble Skin Cleansing',
      'Deshedding Undercoat Exfoliation'
    ],
    features: [
      'Cage-Free Holding Playpens for Friendly Dogs',
      'All-Natural Botanical Extracts (Rosemary & Mint)',
      'Orthopedic Anti-Fatigue Grooming Tables',
      'Text Updates When Your Dog Is Finished'
    ],
    priceRange: '$$$',
    coordinates: {
      lat: 29.7990,
      lng: -95.4010
    },
    services: [
      {
        id: 'srv-heights-signature',
        name: 'The Heights Signature Styling & Spa',
        description: 'Custom scissored haircut, micro-bubble skin cleanse, silk conditioning mask, teeth gel, and nail dremel.',
        durationMinutes: 85,
        startingPrice: 82
      },
      {
        id: 'srv-heights-bath',
        name: 'Holistic Skin Soothing Bath & Brush',
        description: 'Herbal tea tree and rosemary bath soothing skin allergies, ear cleaning, and thorough brushout.',
        durationMinutes: 55,
        startingPrice: 52
      }
    ]
  },
  {
    id: 'groom-galleria-mobile',
    name: 'Galleria Mobile K9 Grooming Concierge',
    salonType: 'mobile-van',
    typeLabel: 'Luxury Mobile Grooming Concierge',
    rating: 4.97,
    reviewCount: 202,
    address: 'Serving Galleria, Memorial, River Oaks & West U',
    city: 'Houston',
    state: 'TX',
    zip: '77056',
    phone: '(713) 960-5511',
    hours: 'Daily: 7:00 AM - 7:00 PM • By Appointment',
    isOpenNow: true,
    isMobileVan: true,
    acceptsWalkIns: false,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
    headGroomer: {
      name: 'Derek Vance',
      title: 'Mobile Concierge Groomer & Behavior Specialist',
      certifications: 'Fear Free Certified Groomer • Pet CPR Instructor',
      bio: 'Equipped with custom Mercedes-Benz grooming vans delivering whisper-quiet, compassionate styling right to your home.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    specialties: [
      'Doorstep Driveway Grooming (Zero Stress)',
      'Individualized 1-on-1 Attention',
      'Warm Hydro-Massage with Organic Aloe',
      'Full Body Breed Scissoring'
    ],
    features: [
      'Climate-Controlled Mobile Spa Van',
      'Pure De-Ionized Warm Water System',
      'No Anxious Dog Waiting Areas',
      'Sanitized Between Every Dog'
    ],
    priceRange: '$$$$',
    coordinates: {
      lat: 29.7490,
      lng: -95.4620
    },
    services: [
      {
        id: 'srv-galleria-mobile-full',
        name: 'Concierge Driveway Full Groom & Style',
        description: 'Full custom haircut, deep moisturizing warm bath, blueberry face wash, ear cleaning, gland expression, and nail filing.',
        durationMinutes: 80,
        startingPrice: 115
      }
    ]
  },
  {
    id: 'groom-memorial-holistic',
    name: 'Memorial Paws Holistic Grooming & Spa',
    salonType: 'fear-free',
    typeLabel: 'Fear Free Certified Holistic Spa',
    rating: 4.92,
    reviewCount: 178,
    address: '9400 Katy Fwy',
    city: 'Houston',
    state: 'TX',
    zip: '77024',
    phone: '(713) 468-2200',
    hours: 'Mon - Sat: 8:00 AM - 5:30 PM',
    isOpenNow: true,
    isMobileVan: false,
    acceptsWalkIns: false,
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80',
    headGroomer: {
      name: 'Sophia Martinez',
      title: 'Fear-Free Certified Pet Stylist',
      certifications: 'Fear Free Elite Level • Canine Dermatology Assistant',
      bio: 'Specializing in fear-free techniques, low-noise equipment, lavender aromatherapy, and stress-free nail trimming.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    specialties: [
      'Fear-Free Certified Stress-Free Handling',
      'Lavender Aromatherapy Relaxation Suite',
      'Hypoallergenic Deep Mud Treatments',
      'Senior Dog Orthopedic Support Grooming'
    ],
    features: [
      'Quiet Low-Velocity Dryers (No Cages Ever)',
      'Orthopedic Cushioned Grooming Tables',
      'Calming Music & Pheromone Diffusers',
      'Paced Sessions with Rest Breaks'
    ],
    priceRange: '$$$',
    coordinates: {
      lat: 29.7730,
      lng: -95.5340
    },
    services: [
      {
        id: 'srv-fear-free-spa',
        name: 'Fear-Free Gentle Spa & Custom Haircut',
        description: 'Paced low-stress grooming session with aromatherapy, soothing bath, hand scissor cut, and gentle nail dremel.',
        durationMinutes: 90,
        startingPrice: 88
      },
      {
        id: 'srv-senior-care',
        name: 'Senior Dog Gentle Comfort Bath & Trim',
        description: 'Specially supported bathing with joint-comfort positioning, gentle hand drying, and hygiene clean up.',
        durationMinutes: 60,
        startingPrice: 60
      }
    ]
  }
];

// Haversine distance calculator in miles
export function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Local Storage keys
const SAVED_GROOMERS_KEY = 'pawpalace_saved_grooming_salons';
const GROOMING_APPOINTMENTS_KEY = 'pawpalace_grooming_appointments';

export function loadSavedGroomerIds(): string[] {
  try {
    const data = localStorage.getItem(SAVED_GROOMERS_KEY);
    return data ? JSON.parse(data) : ['groom-barton-springs-spa', 'groom-paws-mobile-van'];
  } catch {
    return ['groom-barton-springs-spa', 'groom-paws-mobile-van'];
  }
}

export function saveSavedGroomerIds(ids: string[]): void {
  try {
    localStorage.setItem(SAVED_GROOMERS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save groomers', e);
  }
}

export function loadStoredGroomingAppointments(): GroomingAppointment[] {
  try {
    const data = localStorage.getItem(GROOMING_APPOINTMENTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load appointments', e);
  }
  return [
    {
      id: 'groom-appt-demo-1',
      salonId: 'groom-barton-springs-spa',
      salonName: 'Barton Springs Canine Spa & Hydrotherapy',
      salonAddress: '1402 S Congress Ave, Austin, TX',
      salonPhone: '(512) 441-7297',
      petName: 'Archie',
      petBreed: 'Golden Retriever',
      petWeightLbs: 65,
      serviceId: 'srv-full-spa',
      serviceName: 'The Royal Canine Signature Spa & Styling',
      date: 'Tomorrow at 10:00 AM',
      timeSlot: 'Morning (10:00 AM)',
      guardianName: 'Marcus Vance',
      guardianPhone: '(512) 892-4011',
      guardianEmail: 'marcus.vance@example.com',
      specialNotes: 'Archie has mild skin sensitivities; please use colloidal oatmeal and gentle warm water.',
      status: 'confirmed',
      createdAt: '2026-09-23'
    }
  ];
}

export function saveStoredGroomingAppointments(appts: GroomingAppointment[]): void {
  try {
    localStorage.setItem(GROOMING_APPOINTMENTS_KEY, JSON.stringify(appts));
  } catch (e) {
    console.error('Failed to save appointments', e);
  }
}
