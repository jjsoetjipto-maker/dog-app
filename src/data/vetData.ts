import { VetClinic, VetAppointment } from '../types';

export const VET_EMERGENCY_HOTLINES = [
  {
    name: 'ASPCA Animal Poison Control',
    phone: '(888) 426-4435',
    hours: '24/7 / 365 Days',
    note: 'Dedicated toxic ingestion triage and emergency antidote guidance.',
    badge: 'Poison Control'
  },
  {
    name: 'Pet Poison Helpline',
    phone: '(855) 764-7661',
    hours: '24/7 / 365 Days',
    note: 'Nationwide veterinary toxicology consults for dogs & puppies.',
    badge: 'Toxicology Hotline'
  },
  {
    name: 'PawPalace 24/7 Canine Emergency Dispatch',
    phone: '(800) 555-PAWS',
    hours: '24/7 Free Triage',
    note: 'Direct live nurse triage to locate nearest open veterinary trauma center.',
    badge: 'Emergency Triage'
  }
];

export const VET_CLINICS: VetClinic[] = [
  {
    id: 'vet-aves-austin',
    name: 'Austin Veterinary Emergency & Specialty (AVES)',
    careType: 'emergency-hospital',
    typeLabel: '24/7 Emergency & Specialty Trauma',
    rating: 4.94,
    reviewCount: 628,
    address: '7300 Ranch Rd 2222, Bldg 5, Suite 100',
    city: 'Austin',
    state: 'TX',
    zip: '78730',
    distanceMiles: 2.4,
    phone: '(512) 343-2837',
    hours: 'Open 24/7 / 365 Days',
    isOpenNow: true,
    is24_7Emergency: true,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80'
    ],
    leadVet: {
      name: 'Dr. Evelyn Reed, DVM, DACVS',
      title: 'Medical Director & Chief of Surgery',
      credentials: 'Board-Certified Veterinary Surgeon (DACVS) • Texas A&M Graduate',
      bio: 'Over 16 years leading veterinary trauma and critical orthopedic reconstructive surgery. Pioneered minimally invasive canine joint therapies.',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['AAHA Accredited', 'VECCS Level 1 Certified Trauma Center', 'Fear Free Certified'],
    services: [
      '24/7 Emergency & Intensive Care ICU',
      'Orthopedic & Soft Tissue Surgery',
      'OFA Canine Joint & Spine Clearances',
      'Diagnostic CT Scan & Digital Ultrasound',
      'Blood Bank & Transfusion Medicine',
      'Puppy Poison & Toxic Ingestion Care'
    ],
    priceRange: '$$$',
    acceptedInsurance: ['Trupanion', 'Healthy Paws', 'Lemonade', 'Nationwide', 'CareCredit', 'Scratchpay'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-1',
      author: 'Marcus Vance',
      rating: 5,
      date: '5 days ago',
      comment: 'When our golden puppy swallowed a foreign toy late on a Sunday night, Dr. Reed and the AVES team saved his life. Extremely compassionate, rapid triage, and totally transparent pricing.',
      petType: 'Golden Retriever'
    },
    coordinates: { lat: 30.3721, lng: -97.7915 }
  },
  {
    id: 'vet-capitol-city',
    name: 'Capitol City Canine Wellness & Animal Hospital',
    careType: 'general-practice',
    typeLabel: 'Comprehensive Family Practice',
    rating: 4.91,
    reviewCount: 412,
    address: '4205 N Lamar Blvd',
    city: 'Austin',
    state: 'TX',
    zip: '78756',
    distanceMiles: 1.1,
    phone: '(512) 459-4336',
    hours: 'Mon-Fri: 7:30 AM - 6:30 PM • Sat: 8:00 AM - 2:00 PM',
    isOpenNow: true,
    is24_7Emergency: false,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80'
    ],
    leadVet: {
      name: 'Dr. Michael Chen, DVM, CVA',
      title: 'Senior Veterinarian & Canine Pediatric Specialist',
      credentials: 'DVM Cornell University • Certified Veterinary Acupuncturist',
      bio: 'Specializes in ethical puppy social conditioning, neonatal wellness, pediatric immunizations, and preventive nutrition.',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['AAHA Accredited', 'Fear Free Gold Certified Practice', 'Cat & Dog Friendly Clinic'],
    services: [
      'Comprehensive Puppy First-Year Vaccine Series',
      'Microchipping & International Travel Health Certificates',
      'OFA Preliminary & Final Radiographs',
      'Advanced Dental Scaling & Digital Oral X-Rays',
      'Spay & Neuter Minimally Invasive Laparoscopy',
      'Nutritional & Allergy Allergy Desensitization'
    ],
    priceRange: '$$',
    acceptedInsurance: ['Trupanion', 'Lemonade', 'Embrace', 'Spot', 'CareCredit'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-2',
      author: 'Elena Rostova',
      rating: 5,
      date: '1 week ago',
      comment: 'The gentlest vet team in Austin. The Fear Free protocol made our rescue pup completely relaxed. Clear explanations and no unnecessary tests.',
      petType: 'Labrador Mix'
    },
    coordinates: { lat: 30.3105, lng: -97.7423 }
  },
  {
    id: 'vet-lone-star-specialty',
    name: 'Lone Star Veterinary Surgical & Orthopedic Center',
    careType: 'specialty-surgery',
    typeLabel: 'Board-Certified Orthopedics & Genetics',
    rating: 4.96,
    reviewCount: 388,
    address: '8111 Research Blvd',
    city: 'Austin',
    state: 'TX',
    zip: '78758',
    distanceMiles: 3.8,
    phone: '(512) 832-8400',
    hours: 'Mon-Fri: 8:00 AM - 5:30 PM • Emergency On-Call Surgeon',
    isOpenNow: true,
    is24_7Emergency: false,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    leadVet: {
      name: 'Dr. Sarah Thornton, DVM, DACVS, CCRP',
      title: 'Chief Orthopedic Surgeon',
      credentials: 'Diplomate ACVS • Certified Canine Rehabilitation Practitioner (CCRP)',
      bio: 'Nationally recognized authority on canine hip dysplasia, TPLO cruciate repair, and genetic orthopedic testing protocols.',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813589-94042898cf1e?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['AAHA Accredited Referral Specialty Hospital', 'American College of Veterinary Surgeons (ACVS)'],
    services: [
      'Official OFA Hip & Elbow Radiographs',
      'TPLO & Lateral Suture Cruciate Repair',
      'Canine Arthroscopy & Joint Preservation',
      'Canine Sports Medicine & Hydrotherapy Rehab',
      'Genetic Health Lineage Clearance Consults',
      'BOAS Airway Correction Surgery for Frenchies'
    ],
    priceRange: '$$$',
    acceptedInsurance: ['Trupanion', 'Healthy Paws', 'Nationwide', 'CareCredit', 'Scratchpay'],
    virtualConsultAvailable: false,
    featuredReview: {
      id: 'rev-3',
      author: 'David Chen',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Dr. Thornton completed our German Shepherd puppy’s preliminary OFA clearances and provided an outstanding orthopedic roadmap for his agility career.',
      petType: 'German Shepherd'
    },
    coordinates: { lat: 30.3551, lng: -97.7183 }
  },
  {
    id: 'vet-hill-country-urgent',
    name: 'Hill Country Pet Urgent Care (No Appointment Needed)',
    careType: 'urgent-care',
    typeLabel: 'Walk-In Urgent Care & Same-Day Relief',
    rating: 4.88,
    reviewCount: 310,
    address: '3810 S Lamar Blvd',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    distanceMiles: 4.2,
    phone: '(512) 444-8800',
    hours: 'Mon-Sun: 9:00 AM - 10:00 PM (365 Days)',
    isOpenNow: true,
    is24_7Emergency: false,
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
    leadVet: {
      name: 'Dr. Julian Morales, DVM',
      title: 'Urgent Care Medical Director',
      credentials: 'Emergency Medicine Fellowship • UC Davis Graduate',
      bio: 'Bridges the gap between regular family clinics and costly ER centers for immediate, non-life-threatening pet emergencies.',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['VECCS Accredited Urgent Care', 'Fear Free Certified Professionals'],
    services: [
      'Same-Day Walk-In Illness Examinations',
      'Minor Wound Repair & Laceration Suturing',
      'Ear Infections & Skin Allergy Flare-Ups',
      'Vomiting, Diarrhea & Dehydration IV Fluids',
      'Rapid In-House Bloodwork & Digital X-Rays',
      'Pain Relief & Fever Management'
    ],
    priceRange: '$$',
    acceptedInsurance: ['All Major Pet Insurances', 'CareCredit', 'Scratchpay'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-4',
      author: 'Chloe Bennett',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Saved our Saturday evening when Buster caught a foxtail in his paw pad. Minimal wait time, gentle care, and half the cost of a full ER.',
      petType: 'French Bulldog'
    },
    coordinates: { lat: 30.2452, lng: -97.7842 }
  },
  {
    id: 'vet-mobile-paws',
    name: 'Mobile Paws Integrative Concierge Vet',
    careType: 'mobile-vet',
    typeLabel: 'Mobile In-Home Veterinary Clinic',
    rating: 4.98,
    reviewCount: 224,
    address: 'Servicing Greater Austin, Round Rock & Lakeway',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    distanceMiles: 0.5,
    phone: '(512) 710-9922',
    hours: 'Mon-Fri: 8:00 AM - 6:00 PM • Weekend House Calls by Appt',
    isOpenNow: true,
    is24_7Emergency: false,
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
    leadVet: {
      name: 'Dr. Rebecca Alcott, DVM, CVA',
      title: 'Founder & Mobile Practitioner',
      credentials: 'DVM Tufts University • 12 Years Canine Concierge Medicine',
      bio: 'Brings high-tech diagnostics, gentle vaccines, and personalized veterinary care directly to your living room to eliminate clinic stress.',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['Mobile Veterinary Accreditation Association', 'Fear Free Elite Certified'],
    services: [
      'Stress-Free In-Home Puppy Exam & Vaccinations',
      'Mobile Microchip Implantation & Registration',
      'Senior Canine Arthritis Mobility Assessments',
      'At-Home Diagnostic Blood & Urine Panels',
      'Compassionate In-Home End of Life Hospice Care',
      'Litter Health Certificates for Ethical Breeders'
    ],
    priceRange: '$$$',
    acceptedInsurance: ['Trupanion', 'Lemonade', 'Healthy Paws', 'CareCredit'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-5',
      author: 'Jordan Miller',
      rating: 5,
      date: '2 days ago',
      comment: 'Having Dr. Alcott visit our home for our 8-week-old puppy’s first checkup was unbelievable. Zero anxiety, so informative, and our pup was wagging the entire time!',
      petType: 'Cavalier King Charles'
    },
    coordinates: { lat: 30.2672, lng: -97.7431 }
  },
  {
    id: 'vet-dallas-veterinary-er',
    name: 'Metroplex Veterinary Emergency Trauma & Specialty',
    careType: 'emergency-hospital',
    typeLabel: '24/7 Emergency & Specialty Trauma',
    rating: 4.92,
    reviewCount: 519,
    address: '12101 Greenville Ave',
    city: 'Dallas',
    state: 'TX',
    zip: '75243',
    distanceMiles: 195,
    phone: '(214) 555-8387',
    hours: 'Open 24/7 / 365 Days',
    isOpenNow: true,
    is24_7Emergency: true,
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80',
    leadVet: {
      name: 'Dr. Gregory Vance, DVM, DACVECC',
      title: 'Director of Critical Care & Trauma',
      credentials: 'Board-Certified Emergency & Critical Care Specialist (DACVECC)',
      bio: 'Leading intensive care specialist focusing on canine hemodynamic stabilization, toxic exposure antidotes, and complex trauma recovery.',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['VECCS Level 1 Certified Emergency Hospital', 'AAHA Accredited Specialty Center'],
    services: [
      '24/7 Continuous Intensive Care Monitoring',
      'Advanced Mechanical Ventilation & Oxygen ICU',
      'Trauma Ultrasound & Fast Thoracic Scans',
      'Surgical Foreign Body Extraction',
      'Snakebite Antivenom & Toxin Charcoal Therapy'
    ],
    priceRange: '$$$',
    acceptedInsurance: ['All Major Pet Insurances Accepted', 'CareCredit', 'Scratchpay'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-6',
      author: 'Amanda P.',
      rating: 5,
      date: '1 week ago',
      comment: 'Exceptional team in North Texas. They stabilized our Corgi within minutes and kept us updated with hourly photo texts.',
      petType: 'Pembroke Welsh Corgi'
    },
    coordinates: { lat: 32.9152, lng: -96.7441 }
  },
  {
    id: 'vet-houston-canine-wellness',
    name: 'Houston Bayou City Animal Hospital & Genetics Center',
    careType: 'general-practice',
    typeLabel: 'General Practice & Certified Genetics Hub',
    rating: 4.89,
    reviewCount: 374,
    address: '5310 Washington Ave',
    city: 'Houston',
    state: 'TX',
    zip: '77007',
    distanceMiles: 165,
    phone: '(713) 555-7387',
    hours: 'Mon-Sat: 7:30 AM - 7:00 PM • Sun: 10:00 AM - 4:00 PM',
    isOpenNow: true,
    is24_7Emergency: false,
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
    leadVet: {
      name: 'Dr. Kimberly Adams, DVM, PhD',
      title: 'Canine Genetics & Wellness Director',
      credentials: 'PhD in Veterinary Medical Genetics • DVM Texas A&M',
      bio: 'Author of published clinical papers on canine genetic disease prevention and pediatric wellness nutrition.',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813589-94042898cf1e?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['AAHA Accredited', 'OFA Partner Facility', 'Fear Free Certified'],
    services: [
      'Official OFA & PennHIP Certified Evaluations',
      'DNA Disease Screening Bloodwork Panels',
      'Puppy Early Socialization & Vaccine Protocols',
      'Advanced Dental Radiographs & Cleanings',
      'Cardiopulmonary Health Screenings'
    ],
    priceRange: '$$',
    acceptedInsurance: ['Trupanion', 'Lemonade', 'Nationwide', 'CareCredit'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-7',
      author: 'Robert Sterling',
      rating: 5,
      date: '4 days ago',
      comment: 'Top tier vet hospital for anyone looking for thorough genetic screening and ethical puppy guidance.',
      petType: 'Labrador Retriever'
    },
    coordinates: { lat: 29.7712, lng: -95.4121 }
  },
  {
    id: 'vet-austin-westlake',
    name: 'Westlake Animal Hospital & Integrative Canine Rehab',
    careType: 'general-practice',
    typeLabel: 'Full-Service Practice & Rehabilitation',
    rating: 4.93,
    reviewCount: 342,
    address: '3900 Bee Caves Rd',
    city: 'Austin',
    state: 'TX',
    zip: '78746',
    distanceMiles: 3.1,
    phone: '(512) 327-8300',
    hours: 'Mon-Fri: 7:00 AM - 7:00 PM • Sat: 8:00 AM - 3:00 PM',
    isOpenNow: true,
    is24_7Emergency: false,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
    leadVet: {
      name: 'Dr. Clara Hastings, DVM, DACVSMR',
      title: 'Head of Sports Medicine & Rehabilitation',
      credentials: 'Board-Certified Veterinary Sports Medicine • Colorado State Alum',
      bio: 'Pioneering gentle underwater treadmill hydrotherapy and laser arthritis management for active working breeds.',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['AAHA Accredited', 'Fear Free Practice', 'Canine Sports Medicine Certified'],
    services: [
      'Underwater Hydrotherapy Treadmill',
      'Class IV Regenerative Laser Therapy',
      'Comprehensive Puppy Vaccinations',
      'Pain Free Senior Canine Care',
      'Ultrasound Abdominal Diagnostics'
    ],
    priceRange: '$$$',
    acceptedInsurance: ['Trupanion', 'Healthy Paws', 'Lemonade', 'CareCredit'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-8',
      author: 'Tara Lin',
      rating: 5,
      date: '3 days ago',
      comment: 'The rehab pool and Dr. Hastings gave our 7-year-old Lab his running stride back. Exceptional facility and loving team.',
      petType: 'Labrador Retriever'
    },
    coordinates: { lat: 30.2798, lng: -97.7981 }
  },
  {
    id: 'vet-dallas-highland-park',
    name: 'Highland Park Canine Clinic & Surgical Atelier',
    careType: 'specialty-surgery',
    typeLabel: 'Boutique Surgical & Pediatric Medicine',
    rating: 4.97,
    reviewCount: 462,
    address: '4333 Lovers Ln',
    city: 'Dallas',
    state: 'TX',
    zip: '75225',
    distanceMiles: 193,
    phone: '(214) 521-1200',
    hours: 'Mon-Fri: 8:00 AM - 6:00 PM • Sat: 9:00 AM - 1:00 PM',
    isOpenNow: true,
    is24_7Emergency: false,
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
    leadVet: {
      name: 'Dr. Julian Sterling, DVM, DACVS',
      title: 'Lead Surgeon & Genetics Consultant',
      credentials: 'Diplomate American College of Veterinary Surgeons',
      bio: 'Specialist in minimally invasive laparoscopy, breed genetic screenings, and pediatric orthopedic surgeries.',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['AAHA Certified Hospital', 'Fear Free Gold Status', 'OFA Radiology Partner'],
    services: [
      'Minimally Invasive Laparoscopic Spay/Neuter',
      'OFA Joint & Cardiac Clearances',
      'Digital Dental Panoramic Imaging',
      'Regenerative Stem Cell Therapy',
      'Pre-Adoption Puppy Health Exams'
    ],
    priceRange: '$$$$',
    acceptedInsurance: ['All Major Pet Insurance Providers', 'CareCredit'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-9',
      author: 'Eleanor Vance',
      rating: 5,
      date: '6 days ago',
      comment: 'Top flight care in Dallas. Calm waiting suites, immaculate surgical theater, and Dr. Sterling is immensely gifted.',
      petType: 'Doodle'
    },
    coordinates: { lat: 32.8512, lng: -96.8041 }
  },
  {
    id: 'vet-houston-memorial-er',
    name: 'Memorial 24/7 Pet Emergency Trauma Center',
    careType: 'emergency-hospital',
    typeLabel: '24/7 Level-1 Emergency & Critical Care',
    rating: 4.95,
    reviewCount: 710,
    address: '8921 Katy Fwy',
    city: 'Houston',
    state: 'TX',
    zip: '77024',
    distanceMiles: 162,
    phone: '(713) 984-2424',
    hours: 'Open 24/7 / 365 Days',
    isOpenNow: true,
    is24_7Emergency: true,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    leadVet: {
      name: 'Dr. Marcus Holloway, DVM, DACVECC',
      title: 'Director of Emergency Critical Care',
      credentials: 'Board-Certified Emergency & Critical Care (DACVECC)',
      bio: 'Specialist in rapid trauma resuscitation, canine anti-venom protocols, and intensive respiratory ventilation.',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['VECCS Level-1 Trauma Hospital', 'AAHA Emergency Certified'],
    services: [
      '24/7 Immediate Trauma Resuscitation',
      'Oxygen Cage & Hyperbaric Therapy',
      'Emergency Foreign Body Surgery',
      'Complete Toxicology & Antidote Lab',
      'Continuous ICU Cardiac Telemetry'
    ],
    priceRange: '$$$',
    acceptedInsurance: ['Trupanion', 'Healthy Paws', 'Nationwide', 'CareCredit', 'Scratchpay'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-10',
      author: 'Brandon Ruiz',
      rating: 5,
      date: 'Yesterday',
      comment: 'Staff acted with surgical precision when our puppy suffered an acute allergic reaction. The 24/7 team in Houston is unmatched.',
      petType: 'Boxer'
    },
    coordinates: { lat: 29.7852, lng: -95.5101 }
  },
  {
    id: 'vet-san-antonio-mission-city',
    name: 'Mission City Veterinary Specialists & Emergency',
    careType: 'emergency-hospital',
    typeLabel: '24/7 Emergency & Specialty Referral',
    rating: 4.92,
    reviewCount: 429,
    address: '8221 Fredericksburg Rd',
    city: 'San Antonio',
    state: 'TX',
    zip: '78229',
    distanceMiles: 78,
    phone: '(210) 614-5454',
    hours: 'Open 24/7 / 365 Days',
    isOpenNow: true,
    is24_7Emergency: true,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    leadVet: {
      name: 'Dr. Sofia Navarro, DVM, DACVIM',
      title: 'Chief of Internal Medicine',
      credentials: 'Diplomate American College of Veterinary Internal Medicine (DACVIM)',
      bio: 'Expertise in canine immune disorders, endocrine diseases, and non-invasive endoscopy.',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813589-94042898cf1e?auto=format&fit=crop&w=300&q=80'
    },
    accreditations: ['AAHA Accredited', 'VECCS Certified', 'Fear Free Hospital'],
    services: [
      '24/7 Emergency Trauma & Triage',
      'Internal Medicine & Endoscopy',
      'Advanced Diagnostic CT & Fluoroscopy',
      'Transfusion Medicine & Plasma Banking',
      'Neonatal Puppy Intensive Care'
    ],
    priceRange: '$$$',
    acceptedInsurance: ['Trupanion', 'Lemonade', 'Embrace', 'CareCredit'],
    virtualConsultAvailable: true,
    featuredReview: {
      id: 'rev-11',
      author: 'Mariana Gomez',
      rating: 5,
      date: '5 days ago',
      comment: 'Incredible care for our pup during an emergency. Thorough explanations, transparent pricing, and wonderful bedside manner.',
      petType: 'German Shepherd'
    },
    coordinates: { lat: 29.5102, lng: -98.5671 }
  }
];

// Haversine formula to compute great-circle distance between two points in miles
export function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

const SAVED_VETS_STORAGE_KEY = 'pawpalace_saved_vet_ids';
const VET_APPOINTMENTS_STORAGE_KEY = 'pawpalace_vet_appointments';

export const loadSavedVetIds = (): string[] => {
  try {
    const raw = localStorage.getItem(SAVED_VETS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load saved vets from localStorage:', e);
  }
  return ['vet-aves-austin']; // pre-seed favorite for immediate rich feel
};

export const saveSavedVetIds = (ids: string[]) => {
  try {
    localStorage.setItem(SAVED_VETS_STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save vets to localStorage:', e);
  }
};

export const loadStoredAppointments = (): VetAppointment[] => {
  try {
    const raw = localStorage.getItem(VET_APPOINTMENTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load vet appointments from localStorage:', e);
  }
  // Pre-seed 1 confirmed appointment so guardians see the feature live immediately
  return [
    {
      id: 'appt-demo-1',
      clinicId: 'vet-aves-austin',
      clinicName: 'Austin Veterinary Emergency & Specialty (AVES)',
      clinicPhone: '(512) 343-2837',
      clinicAddress: '7300 Ranch Rd 2222, Austin, TX',
      petName: 'Archie',
      petBreed: 'Golden Retriever',
      reason: 'Routine Pediatric Puppy Wellness & Microchip Check',
      date: 'Tomorrow at 10:30 AM',
      timeSlot: 'Morning (10:30 AM)',
      guardianName: 'Marcus Vance',
      guardianPhone: '(512) 892-4011',
      guardianEmail: 'marcus.vance@example.com',
      notes: 'Please check OFA preliminary record and weight progression.',
      status: 'confirmed',
      createdAt: 'Yesterday'
    }
  ];
};

export const saveStoredAppointments = (appointments: VetAppointment[]) => {
  try {
    localStorage.setItem(VET_APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch (e) {
    console.warn('Failed to save appointments to localStorage:', e);
  }
};
