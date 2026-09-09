import { Dog, GearProduct, Testimonial } from '../types';

export const DOGS: Dog[] = [
  {
    id: 'archie',
    name: 'Archie',
    breed: 'Golden Retriever',
    category: 'puppy',
    price: 1850,
    location: 'Austin, TX',
    distanceMiles: 12,
    ageText: '9 Weeks Old',
    gender: 'Male',
    color: 'Warm Golden',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCv7w2b1HvIVqRXEb6-MRcl6Z51jVBktADm5Z3JG8X-K2Ev4goCnAzgHN_Oti9LVt32hQOkZWHnMuDppYIHq7ubd0iJ1eI3iGNUBuP47WBsh6Gw9pvXFMt44EPxAJqJYKqXYhexnp-k3SCFJf4j_BR1UmA7Cx9LMCJug-UxeP8Vx1trx7G2nquS7Iob1uOpDF3ixHSTZh63fl9ri3PELcm5EXY3bbpEkZJV9riuU1W-IHdNWempEV9WA',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCv7w2b1HvIVqRXEb6-MRcl6Z51jVBktADm5Z3JG8X-K2Ev4goCnAzgHN_Oti9LVt32hQOkZWHnMuDppYIHq7ubd0iJ1eI3iGNUBuP47WBsh6Gw9pvXFMt44EPxAJqJYKqXYhexnp-k3SCFJf4j_BR1UmA7Cx9LMCJug-UxeP8Vx1trx7G2nquS7Iob1uOpDF3ixHSTZh63fl9ri3PELcm5EXY3bbpEkZJV9riuU1W-IHdNWempEV9WA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCCQiFLXAHOZARLqXEQK68HSDZYMhIDSPYLEOrLCoBDO25HV83ThzH71u7RUFxTbDyI6XcrdyrdFP18jHGkPYjUZijpywW3vEhPYE8qO9pFxbkQj6Eo92juB0I7zlH3kiaEFpGAo0x91VqZrah3QbFUDq9aYYbGtHTVqv-tXlK1odIYVQzeVQgiZXMuNCVLZzTYIoSMu6urJsRfbIgI655-lhMho2IS6K70oJDBF24wlBGqBeAQNU1ebQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8bzKzoKBF6IYOG2tkQOx469_zgpHJ8D0LbpZAWnd8YiA4vdPcGe-1nl4eazTzc-jYR0rYKF81u91V4wMDRs8W5_keE7m8Ix5jU9IfMvNivScHtU2pwN0w_k5J4GfcRtCVuXfKpfJayY0uzB33r2bdJZ3G8C5690RW8WlvvoDhfDu30q6OHlSExtQMZrha5dq0wPmMEYrfQybu7H7oo_dFAHV8nRT4qPpqSbcIU9EGcb6FdpY6b9RWQg'
    ],
    breederName: 'Sunridge Golden Retrievers',
    breederBadge: 'Tier-1 Certified Breeder',
    breederInitials: 'SG',
    breederRating: 4.98,
    breederReviewsCount: 42,
    badges: ['DNA Verified', 'OFA Cleared', '10-Yr Guarantee', 'Microchipped'],
    verifiedStatus: 'Genetically Screened',
    summary: 'Archie is a spirited, affectionate purebred Golden Retriever pup from champion bloodlines. Raised in-home with early neurological stimulation (ENS), daily positive socialization, and handled with love by certified trainers.',
    temperament: {
      breedHeritage: 'Purebred Golden Retriever (AKC Registered Lineage)',
      energyLevel: 'Moderate to High (Gentle Play & Loving Drive)',
      trainability: 'Eager to please, highly food motivated & responsive',
      coatColor: 'Warm Golden / Luxurious Double Coat',
      traits: ['Gentle with Children', 'Microchipped & Dewormed', 'Early Potty Trained', 'Crate Introduced', 'Embark 250+ Panel Clear']
    },
    healthCredentials: [
      { title: 'OFA Hip & Elbow Clearances', desc: 'Parent line scored OFA Excellent for both sire & dam hips and normal elbows.' },
      { title: 'OFA Advanced Cardiac Clear', desc: 'Certified by a board-certified veterinary cardiologist (normal heart valves).' },
      { title: 'OFA Eye Certification (CAER)', desc: 'Annual ophthalmologist exam clears sire and dam of inherited eye disorders.' },
      { title: 'Comprehensive DNA 250+ Panel', desc: 'Screened negative for PRA1, PRA2, prcd-PRA, Ichthyosis, and DM.' }
    ]
  },
  {
    id: 'bella',
    name: 'Bella',
    breed: 'Australian Shepherd',
    category: 'puppy',
    price: 1600,
    location: 'Denver, CO',
    distanceMiles: 45,
    ageText: '10 Weeks Old',
    gender: 'Female',
    color: 'Blue Merle',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu4ExruBUV0vpje8Nug1Qhu-8G1N1AYiRfQBXoLNorExSpwX_OSXx2h8gqNBga_VvHz8wLv_tP4ZCDxf4_OYbvxlhjWgvAa-QHbxQunnsNVaKdQpWWSZ9lX01JVcXQpI8H7bHKNw3tBikUBrCylJyMMWX009FqtONMFRc78LBN_CSbcaQLf7K-PJswQFl62rL2relNo7gmo44hRxDhEmTznz9b2D5GjbzAorZhhBq4T2zOJnxbHTGREg',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAu4ExruBUV0vpje8Nug1Qhu-8G1N1AYiRfQBXoLNorExSpwX_OSXx2h8gqNBga_VvHz8wLv_tP4ZCDxf4_OYbvxlhjWgvAa-QHbxQunnsNVaKdQpWWSZ9lX01JVcXQpI8H7bHKNw3tBikUBrCylJyMMWX009FqtONMFRc78LBN_CSbcaQLf7K-PJswQFl62rL2relNo7gmo44hRxDhEmTznz9b2D5GjbzAorZhhBq4T2zOJnxbHTGREg'
    ],
    breederName: 'Highland Aussie Acres',
    breederBadge: 'Ethical Kennel Standard',
    breederInitials: 'HA',
    breederRating: 4.95,
    breederReviewsCount: 28,
    badges: ['DNA Cleared', 'Puppy Culture', 'Microchipped'],
    verifiedStatus: 'Health Guaranteed',
    summary: 'Stunning Blue Merle female with striking markings, razor-sharp intelligence, and an adventurous, cuddly nature.',
    temperament: {
      breedHeritage: 'Australian Shepherd (ASDR / AKC)',
      energyLevel: 'High (Great for active families & hiking)',
      trainability: 'Exceptional, eager learner',
      coatColor: 'Blue Merle w/ Copper & White Trim',
      traits: ['Agility Potential', 'Loyal Companion', 'Vaccinated to Age', 'Raised indoors']
    },
    healthCredentials: [
      { title: 'MDR1 Gene Tested Clear', desc: 'Normal/Normal across multi-drug sensitivity gene panels.' },
      { title: 'CEA & PRA Negative', desc: 'Genetically free of Collie Eye Anomaly and Progressive Retinal Atrophy.' }
    ]
  },
  {
    id: 'milo',
    name: 'Milo',
    breed: 'French Bulldog',
    category: 'puppy',
    price: 2400,
    location: 'Miami, FL',
    distanceMiles: 80,
    ageText: '11 Weeks Old',
    gender: 'Male',
    color: 'Fawn / Black Mask',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgBkgdZGzLVwnO2XK3I_xyBKvJTIiB7GNvfdaPyzGszu12WAYbvllQAnIYGjtSUZEC_c0j_g2YJFniAQNP1t9dH-mXpGvORL4-m7Nd080t4CL81jEG2PEWXqbW_62uGdSrIGeVP7kLuSUmyYRDURo19jQvLCURuT6A3QQqsS_eRj-eL_3THI1pKitSz5NnVkdlbUs8p93Df_6_L-bB_BLGlWxT7COy_y9oNEr7drcOtpl5Adzn6fgYZA',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgBkgdZGzLVwnO2XK3I_xyBKvJTIiB7GNvfdaPyzGszu12WAYbvllQAnIYGjtSUZEC_c0j_g2YJFniAQNP1t9dH-mXpGvORL4-m7Nd080t4CL81jEG2PEWXqbW_62uGdSrIGeVP7kLuSUmyYRDURo19jQvLCURuT6A3QQqsS_eRj-eL_3THI1pKitSz5NnVkdlbUs8p93Df_6_L-bB_BLGlWxT7COy_y9oNEr7drcOtpl5Adzn6fgYZA'
    ],
    breederName: 'Palmetto Frenchies',
    breederBadge: 'Veterinary Verified',
    breederInitials: 'PF',
    breederRating: 4.92,
    breederReviewsCount: 31,
    badges: ['BOAS Screened', 'Spine X-Ray Cleared', '100% Home Raised'],
    verifiedStatus: 'Open Air Respiratory Cleared',
    summary: 'Milo is a calm, compact couch buddy with an open airway confirmation, wide nares, and zero allergy history in pedigree.',
    temperament: {
      breedHeritage: 'French Bulldog',
      energyLevel: 'Low to Medium',
      trainability: 'Friendly, clownish, responds to treat games',
      coatColor: 'Classic Warm Fawn',
      traits: ['Apartment Friendly', 'Gentle with cats', 'Loves naps', 'Socialized']
    },
    healthCredentials: [
      { title: 'BOAS Respiratory Grade 0', desc: 'Assessed by veterinary specialist; unobstructed nostril airways.' },
      { title: 'Patellas & Spine Screened', desc: 'No hemivertebrae, normal patellar articulation.' }
    ]
  },
  {
    id: 'luna',
    name: 'Luna',
    breed: 'Border Collie & Lab Mix',
    category: 'rescue',
    isRescue: true,
    price: 350,
    adoptionFeeLabel: 'Adoption Fee: $350 (Includes Spay & Shots)',
    location: 'Portland, OR',
    distanceMiles: 15,
    ageText: '8 Months Old',
    gender: 'Female',
    color: 'Sleek Black & White',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4PPRLLEyCfytw0YrbNRFOC60hrN2puMTb3FPUfysKRQmxauCPZG8082TGsANlxv0esweNbQ_O-zrjq1W0Qkdr5c8BwiemS0VrwDw0nVSjEppnUTWSUtq53S1H3hA8RfP5k86jczzyseXrqG2sQ8keV9-cwep4i2r1jCRG4VJ553V1AEjiYJbvUVKWMqJEinoGJPJa6afdSpJdiOxJwqHRgr-V5bLhvsdbMkbqpAuX_k6YFiRFo1iTdQ',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4PPRLLEyCfytw0YrbNRFOC60hrN2puMTb3FPUfysKRQmxauCPZG8082TGsANlxv0esweNbQ_O-zrjq1W0Qkdr5c8BwiemS0VrwDw0nVSjEppnUTWSUtq53S1H3hA8RfP5k86jczzyseXrqG2sQ8keV9-cwep4i2r1jCRG4VJ553V1AEjiYJbvUVKWMqJEinoGJPJa6afdSpJdiOxJwqHRgr-V5bLhvsdbMkbqpAuX_k6YFiRFo1iTdQ'
    ],
    breederName: 'Cascadia Canine Rescue',
    breederBadge: '501(c)(3) Accredited Shelter',
    breederInitials: 'CR',
    breederRating: 5.0,
    breederReviewsCount: 89,
    badges: ['Fully Vaccinated', 'Spayed', 'Behavior Tested', 'Foster Raised'],
    verifiedStatus: 'Foster Certified & Spayed',
    summary: 'Luna is a brilliant, loving young pup who was rescued from an overcrowded regional shelter. She knows sit, stay, fetch, and is thriving in foster care.',
    temperament: {
      breedHeritage: 'Border Collie x Labrador Retriever',
      energyLevel: 'Medium to High (Loves outdoor play and fetch)',
      trainability: 'Quick thinker, master of trick training',
      coatColor: 'Black w/ White Chest & Paws',
      traits: ['Spayed', 'Heartworm Negative', 'Good with other dogs', 'Housebroken']
    },
    healthCredentials: [
      { title: 'Full Veterinary Workup', desc: 'Up to date on Rabies, DHPP, Bordetella, and flea/tick preventative.' },
      { title: 'Behavior Assessed', desc: 'Passed multi-point shelter temperament evaluation with flying colors.' }
    ]
  },
  {
    id: 'cooper',
    name: 'Cooper',
    breed: 'Golden Retriever',
    category: 'puppy',
    price: 1850,
    location: 'Austin, TX',
    distanceMiles: 14,
    ageText: '9 Weeks Old',
    gender: 'Male',
    color: 'Honey Gold',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCQiFLXAHOZARLqXEQK68HSDZYMhIDSPYLEOrLCoBDO25HV83ThzH71u7RUFxTbDyI6XcrdyrdFP18jHGkPYjUZijpywW3vEhPYE8qO9pFxbkQj6Eo92juB0I7zlH3kiaEFpGAo0x91VqZrah3QbFUDq9aYYbGtHTVqv-tXlK1odIYVQzeVQgiZXMuNCVLZzTYIoSMu6urJsRfbIgI655-lhMho2IS6K70oJDBF24wlBGqBeAQNU1ebQ',
    breederName: 'Sunridge Goldens',
    breederBadge: 'Tier-1 Certified Breeder',
    breederInitials: 'SG',
    breederRating: 4.98,
    breederReviewsCount: 42,
    badges: ['DNA Verified', 'OFA Cleared', '10-Yr Guarantee', 'Dewormed'],
    verifiedStatus: 'Genetically Screened',
    summary: 'Cooper is Archie’s loving litter brother, boasting a soft honey coat, soulful eyes, and a relaxed, joyful demeanor.',
    temperament: {
      breedHeritage: 'Golden Retriever (AKC)',
      energyLevel: 'Moderate (Friendly & inquisitive)',
      trainability: 'Eager to please',
      coatColor: 'Honey Gold',
      traits: ['Microchipped', 'Gentle with toddlers', 'ENS protocol certified']
    }
  },
  {
    id: 'hazel',
    name: 'Hazel',
    breed: 'Pembroke Welsh Corgi',
    category: 'puppy',
    price: 2100,
    location: 'Seattle, WA',
    distanceMiles: 18,
    ageText: '8 Weeks Old',
    gender: 'Female',
    color: 'Red & White',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-kLi85m9tww5Ll_cLFtTQJ3pX16ddQ9VGJZCxstGiYQLTPuhO55qypgBGr5iRP9W2tU2XeU7xEpt65uoTk_txMfT8-hyT-6Gvyu9NXHX64eeQJQBmAWVPFhB_fZg3g5B8c3-gey4WPtgde4SuG3O8CKAwrnhJ8rdYP81JAtUDe9ZjWHDgZdO8hWxcEtld3XxvL4QP09gG82ABLYZyvMc4T5fgeAMUWXu0KUxlsnnEDomBVNNjiUPCcg',
    breederName: 'Emerald Sound Corgis',
    breederBadge: 'Tier-1 Certified Breeder',
    breederInitials: 'EC',
    breederRating: 4.96,
    breederReviewsCount: 37,
    badges: ['vWD1 Clear', 'DM Clear', 'Microchipped', 'Vaccinated'],
    verifiedStatus: 'Genetic Testing Clear',
    summary: 'Hazel is a charismatic, short-legged dynamo with classic fox-like ears, a big smile, and endless cuddles.',
    temperament: {
      breedHeritage: 'Pembroke Welsh Corgi',
      energyLevel: 'Moderate to High',
      trainability: 'Fast learner, loves interactive puzzles',
      coatColor: 'Red & White',
      traits: ['Affectionate', 'Watchful', 'Well socialized with cats']
    }
  },
  {
    id: 'bentley',
    name: 'Bentley',
    breed: 'Cavalier King Charles',
    category: 'puppy',
    price: 2600,
    location: 'Nashville, TN',
    distanceMiles: 32,
    ageText: '11 Weeks Old',
    gender: 'Male',
    color: 'Blenheim',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYujI_dOyu8aMpjvz2_LwPJvgMxMQn6wXIVLwolR8-TRiYxQXxtI4hniWFrUA9xAgCR3oPjq7cnEWFAl6uw0Fb3BEBLut8EBV8BiuI1DeuTG4fsk3pwH0U6yGXWpZqR2TJAclVtX_oKwkTAgTfiuWAeisESJh4J47M1ZU_hBM9AK1jiDxuiS4Gp7zR6d945dMtgJdIQG3l954CdHaSLy2WTw9oC1Uweeywi9gFOmILsgigl6RdfAgbKg',
    breederName: 'Cumberland Royal Paws',
    breederBadge: 'Cardio Certified Kennel',
    breederInitials: 'CP',
    breederRating: 4.97,
    breederReviewsCount: 29,
    badges: ['Cardio Clear (Doppler)', 'MRI Tested Sire', 'In-Home Raised'],
    verifiedStatus: 'Cardio Doppler Cleared',
    summary: 'Bentley is a true gentleman, calm, loving, and bred exclusively from parents cleared by cardiologist Doppler evaluations.',
    temperament: {
      breedHeritage: 'Cavalier King Charles Spaniel',
      energyLevel: 'Low to Moderate (Lap companion)',
      trainability: 'Gentle and sweet',
      coatColor: 'Rich Blenheim Chestnut & Silk White',
      traits: ['Lap dog extraordinaire', 'No aggression', 'Ideal for seniors & quiet homes']
    }
  },
  {
    id: 'rosie',
    name: 'Rosie',
    breed: 'Bernedoodle (F1B)',
    category: 'puppy',
    price: 2250,
    location: 'Boulder, CO',
    distanceMiles: 22,
    ageText: '10 Weeks Old',
    gender: 'Female',
    color: 'Tri-Color Merle',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACJnSureRqk6gZDdS9AULkwXJQ7eM0lqJiuyqg8dn-kqIRDvHs7nnzELDRfR3KKF3-h2C34uWnNzS3wk48rgLHoW7N3wsR3PuaeMbwXu7s_oufxe6-QgcI35c9psav9LrF72LvE1JsLRoeSsPFEnHJemzhCxJ7QtMMv1GZ920GFzco9V10mFvh3ks0Qy8SE31zdjV69bfDAzoUc1hHZNq7EEh-JcZoxKuEPM_1HhnWnoK1CZV_D1UeDw',
    breederName: 'Alpine Doodle Sanctuary',
    breederBadge: 'Hypoallergenic Certified',
    breederInitials: 'AD',
    breederRating: 4.93,
    breederReviewsCount: 35,
    badges: ['Hypoallergenic', 'OFA Hips', 'Non-Shedding Coat'],
    verifiedStatus: 'Furnishings FF Tested',
    summary: 'Rosie features a luxurious wavy fleece coat that does not shed. She brings the loyalty of the Bernese and the brain of the Poodle.',
    temperament: {
      breedHeritage: 'Bernese Mountain Dog x Standard Poodle (F1B)',
      energyLevel: 'Moderate',
      trainability: 'Super intelligent',
      coatColor: 'Tri-Color Classic',
      traits: ['Allergy Friendly', 'Family Protector', 'Water Loving']
    }
  },
  {
    id: 'shadow',
    name: 'Shadow',
    breed: 'Malinois / Shepherd Mix',
    category: 'rescue',
    isRescue: true,
    price: 300,
    adoptionFeeLabel: 'Adoption Fee: $300 (Fully Vetted)',
    location: 'San Diego, CA',
    distanceMiles: 9,
    ageText: '1.5 Years Old',
    gender: 'Male',
    color: 'Fawn / Black Mask',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsRtKu2pnA82i-o9BDAsAjOECE4UBAGKU3esmncbtC46wr1PEYxTe_-hwOj24ZQ4iSSFCiQFvxRzIROYHwPkSECO8HiobsSckRPWlvurq_DB9NRVvCWHl14lsD5dV0_I34GqIl9ZHbACQyUdbTudBCg8OY7yPUjtFPQWJk0_QQgS4i69ggowV1MS2XuKq-56DQMn2rt9e2gdak3urkmgoQZ_seDBarzbuEdMN9MB4drxCQFt7aiEE4Kg',
    breederName: 'Second Chance Working Dogs',
    breederBadge: 'Rescue & Rehabilitation 501c3',
    breederInitials: 'SC',
    breederRating: 4.99,
    breederReviewsCount: 114,
    badges: ['Neutered', 'Trained', 'Canine Good Citizen Ready', 'Active Partner'],
    verifiedStatus: 'Behavior Evaluation Complete',
    summary: 'Shadow is a loyal, athletic young shepherd mix with basic obedience dialed in. He seeks an active guardian who loves trail running, agility, or scent work.',
    temperament: {
      breedHeritage: 'Belgian Malinois x German Shepherd',
      energyLevel: 'High',
      trainability: 'Elite work ethic and devotion',
      coatColor: 'Fawn with Dark Mask',
      traits: ['Loyal Guardian', 'Neutered & Chipped', 'Crate trained']
    }
  },
  {
    id: 'penny',
    name: 'Penny',
    breed: 'Miniature Dachshund',
    category: 'puppy',
    price: 1900,
    location: 'Charlotte, NC',
    distanceMiles: 48,
    ageText: '9 Weeks Old',
    gender: 'Female',
    color: 'Red Dapple',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB2IUW0HKgVa2BwqA7gt3DGCdmgehHvVHMm-VYxq2VGPD8jyr7GuRHR1VUFVuOgTXIrFs8xws9Ix8-LQ4aijXQ4eo0c-7sLy5Cp6h-fDmGg4qgiNxH2sA0EmNajVff4wxxMccKw61gYfJCLA0FxO2FSrDE-cobE_N75FMQGbP6HeXhM8Qq09NSbpo5abFmomeM3C5XaAi7b2kCJvDUuu79DTG_gJdObui3B2sfQrOkX369ELZ6ZZjeQ',
    breederName: 'Blue Ridge Dachshunds',
    breederBadge: 'IVDD Screened Lineage',
    breederInitials: 'BR',
    breederRating: 4.95,
    breederReviewsCount: 24,
    badges: ['IVDD Low-Risk Parents', 'PRA-Cord1 Clear', 'Microchipped'],
    verifiedStatus: 'Genetically Clear',
    summary: 'Penny is a pint-sized bundle of charm with a silky red dapple coat, velvet ears, and a sweet, inquisitive spirit.',
    temperament: {
      breedHeritage: 'Miniature Dachshund',
      energyLevel: 'Moderate',
      trainability: 'Fun and curious',
      coatColor: 'Red Dapple Smooth',
      traits: ['Lap cuddler', 'Raised with children', 'Pre-spoiled']
    }
  }
];

export const GEAR_PRODUCTS: GearProduct[] = [
  {
    id: 'gear-harness',
    name: 'Tactical No-Pull All-Weather Dog Harness',
    brand: 'PawPalace Pro / K9 Elite',
    price: 48.00,
    originalPrice: 62.00,
    rating: 4.9,
    reviewsCount: 184,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyrfwB9zB0dLVdcHs9O7Xz1CEU9v1iJ-LgmVR0e8um4RuzWpZG5S78CNv2RDMCwCDfnB0v_DaLUkuTc4mOC6PMbwLlhLdE94DCEffPWiF5-93p8mX9GAWV74RBLZKM8vIforLX3-9_GYM5y-n3qkMKMbMs7hfjw6hZlimmoJ4OCuRIcduzEdNnq8kFoBzDgDoZNgWC56rjZVyyu-VcZHDJBT-hWcgqu1c84lgZEDLOCZ50OyGzqZxzqg',
    tag: 'Bestseller',
    tagColor: 'bg-[#8d4b00] text-white',
    category: 'harnesses',
    inStockBadge: 'In Stock • Ready to Ship',
    subBadge: 'VET RECOMMENDED',
    description: 'Military-grade 1050D nylon with dual leash attachment points (front chest no-pull ring and back control loop), reflective 3M stitching, and ergonomic breathable mesh.',
    colors: ['Desert Tan', 'Tactical Black', 'Ranger Green', 'Alpine Orange'],
    sizes: ['Small (15-22 lbs)', 'Medium (25-45 lbs)', 'Large (50-80 lbs)', 'X-Large (80+ lbs)'],
    specs: ['Tensile tested to 450 lbs pull force', 'Padded chest plate prevents tracheal strain', 'Quick-release alloy hardware buckles']
  },
  {
    id: 'gear-bed',
    name: 'Memory Foam Orthopedic Bolster Bed',
    brand: 'CanineRest Orthopedics',
    price: 89.00,
    originalPrice: 110.00,
    rating: 4.8,
    reviewsCount: 312,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1R22PZ14-PHhnIxfirpu0StZjrZKshxDg9ksoJO8FriClyTzpsff0zwtvuZYoGdd7QzLct5WLmkBjoGO3LKqZEm58ZRh7HbeeD_YXczUYGdDCmAHALgWOjq1dzzB3PUqjI3unoM-4s1KucRvAYOM9iGRzbgJ4dfxi66D95YDqprBQd2MvHOGE6oqoGzrQUXzccCHZzBlkxsDGmp-w2TypyznFIubYLe08rU-RPTbsJCzI8W8BLMWZZA',
    tag: 'Joint Support',
    tagColor: 'bg-[#006c4a] text-white',
    category: 'beds',
    inStockBadge: 'Low Stock • 6 Left',
    subBadge: 'ORTHOPEDIC GRADE',
    description: 'Human-grade therapeutic memory foam base relief for hips, joints, and spine. Removable tear-resistant cover is 100% waterproof and machine washable.',
    colors: ['Charcoal Gray', 'Warm Oatmeal', 'Midnight Navy'],
    sizes: ['Medium (36" x 28")', 'Large (44" x 34")', 'Giant (52" x 40")'],
    specs: ['4-inch high-density supportive base foam', 'Hypoallergenic internal waterproof liner', 'Non-skid silicone dotted bottom']
  },
  {
    id: 'gear-crate',
    name: 'Travel Kennel Airline-Approved Secure Crate',
    brand: 'K9 Voyager Safe',
    price: 145.00,
    originalPrice: 169.00,
    rating: 4.9,
    reviewsCount: 96,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8pyC_upWnESkxuygBwEPggYrIDgE9HaH-8XRuFQXoUlTgX2C8ROhQoXkkDxkegRxAlX1MK-92phixHC8MG-kfsvPSz_9FIQEKsgxSKUT_cpWgENmes8DObIN3HrQ2ypOseI9Nh1Z0_j9_Lp1Kixwb8MTKesv28qcRB1mcpfa3HJmLuEP-AfuGGjB0pUrsp_maBXgpGgSAVFanCeqoaCHXWBqUiSfMZrjg9YEGYc3vU3sxq9nr1hPTeA',
    tag: 'IATA Approved',
    tagColor: 'bg-[#a33900] text-white',
    category: 'crates',
    inStockBadge: 'In Stock',
    subBadge: 'IMPACT TESTED',
    description: 'Heavy-duty impact-resistant polymer travel crate with reinforced steel door lock, 360-degree ventilation slots, and tie-down strap channels for road trips and flights.',
    colors: ['Glacier Slate', 'Earth Khaki'],
    sizes: ['Medium 32-inch', 'Intermediate 36-inch', 'Large 40-inch'],
    specs: ['Complies with IATA Live Animal Regulations', 'Dual-spring pinch-proof door latch', 'Quick nestable breakdown for compact storage']
  },
  {
    id: 'gear-gps',
    name: 'GPS Real-Time Smart Tracking Collar',
    brand: 'HaloGuard Tech',
    price: 119.00,
    originalPrice: 149.00,
    rating: 4.9,
    reviewsCount: 247,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrs4GuCA8SHSAhMEzG5w-lY5EXJUuJYZrI7qja1OyZYieFEjJFLUfey9yx29wYB-pytyd0_ipiZqJCM0shp5hET93kba5kRduexeQAiRlHcYhozTacw8lZEthkrb2Pt5JkPTOhtWOLdBKMMxayM2gFLL25ns05LFnn3X_eJVOdjSAG3LekVWL_oExYr2b8e-pQ2PXZat60wB7P2-mg8BC0cxpvj5eFVk3_a-8VjndfWkQ_YtxhGNPPAA',
    tag: 'Smart Tech',
    tagColor: 'bg-[#263143] text-white',
    category: 'collars',
    inStockBadge: 'In Stock • Ships Free',
    subBadge: 'LTE + SATELLITE',
    description: 'Instant escape alerts, live 2-second location updates, virtual geofencing, and comprehensive canine health and sleep tracking with 30-day battery life.',
    colors: ['Safety Neon', 'Midnight Black', 'Sunset Coral'],
    sizes: ['Universal Adjustable (10" - 26")'],
    specs: ['IP68 Submersible waterproof rating', 'Multi-carrier global SIM included', 'Continuous health, bark, and itch monitoring']
  },
  {
    id: 'gear-leash',
    name: 'Multi-Functional Bungee Shock-Absorbing Leash',
    brand: 'ActiveK9 Labs',
    price: 28.00,
    originalPrice: 38.00,
    rating: 4.8,
    reviewsCount: 154,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD_qr2OGZQPhRVTyAEvb-l73qZcuYGWVR-Y2iV_YA0S8RuR_RvHBHMtdt-3KIZvUOdv-VAqsTqN9eq3EoQl-VDYxm8d7hfXAHhecD1hmS-922leX2upy9v9k0kveMZMcEr8AVbEvQPb_EG0qxavfR-vEWtSxJ2fEJuAokzAGwbGkL3-KewhosSbB9u_IE_kg7OTVaH6jRhqDM3xHEMEUvDVbZCWjsY574_FDOlvq45zjnWN2QLEB42cQ',
    tag: 'Shock Absorb',
    tagColor: 'bg-[#006c4a] text-white',
    category: 'harnesses',
    inStockBadge: 'In Stock',
    subBadge: 'ANTI-PULL SPRING',
    description: 'Dual-padded neoprene handles for close traffic control, 360-degree swivel carabiner rated to 800 lbs, and elastic core dampens sudden lunges.',
    colors: ['Desert Sand', 'Onyx Black', 'Safety Orange'],
    sizes: ['Standard 6-Foot', 'Long 8-Foot'],
    specs: ['Aircraft aluminum aviation carabiner', 'High-visibility 3M reflective threading', 'Car seatbelt clip integrated']
  },
  {
    id: 'gear-starter-kit',
    name: 'Puppy Starter Kit: Organic Chew Toys & Grooming',
    brand: 'NurturePup Organics',
    price: 34.99,
    originalPrice: 48.00,
    rating: 4.95,
    reviewsCount: 220,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEhf8oqxR_7difCqqyEnW0bnosIOKUUKNlw41BEI46YKAHtjJwFiryHLUyudzO53oS5Ve1My7NuHDsYGwGNS_i6NDMM7MLH7Bb1Z5os3wlNd9Tijy990yTfg16LveebBLW9OCRSqYZWpva-G_rcruCtCE2KAF6ED26YGTAecrzURJdGPq8UxBt2pERpG-CmTOS_Wf7kspJ13rw_DSyv2xzd99LiTi1EbXsESGzq1lySsJnLK8wtPspQA',
    tag: 'Starter Bundle',
    tagColor: 'bg-[#8d4b00] text-white',
    category: 'starter-kits',
    inStockBadge: 'In Stock • Best Value',
    subBadge: 'ORGANIC CERTIFIED',
    description: 'All-in-one ethical essentials bundle: 100% natural organic rubber teething chew, botanical oatmeal soothing shampoo, slicker brush, and training clicker.',
    colors: ['Natural Earth Bundle'],
    sizes: ['Puppy / Small Breed', 'Standard / Large Breed'],
    specs: ['BPA, PVC & phthalate-free natural materials', 'Veterinarian approved soothing formulas', 'Includes puppy potty training guide']
  }
];

export const TRUST_POINTS = [
  {
    icon: 'verified_user',
    title: 'Zero-Tolerance Puppy Mill Policy',
    desc: 'Every provider undergoes exhaustive background audits, in-person property inspections, and strict ethical kennel capacity caps.'
  },
  {
    icon: 'biotech',
    title: 'Compulsory Genetic & DNA Screening',
    desc: 'Direct submission of OFA, PennHIP, and breed-specific genetic clear testing before any litter may be listed.'
  },
  {
    icon: 'gavel',
    title: '10-Year Genetic Health Guarantee',
    desc: 'Unwavering contractual commitments with binding return policies and escrow backed health assurances.'
  },
  {
    icon: 'lock',
    title: 'PawPalace Escrow Protection',
    desc: 'Funds are safeguarded in third-party escrow and only released to the breeder after your independent 72-hour veterinary checkup.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    rating: 5,
    quote: 'Unrivaled peace of mind.',
    content: 'After hearing nightmare stories about online puppy scams and puppy mills, finding PawPalace was a breath of fresh air. The genetic records for our Golden were completely transparent, and our vet was blown away by the documentation package.',
    author: 'Elena & Marcus Vance',
    authorRole: 'Guardians to Archie',
    initials: 'EV'
  },
  {
    id: 'test-2',
    rating: 5,
    quote: 'The gear is genuinely vet-grade.',
    content: 'The orthopedic bed and tactical harness arrived in 2 days. The memory foam is denser than my own mattress! My German Shepherd’s morning stiffness resolved within two weeks.',
    author: 'Dr. Gregory Thorne, DVM',
    authorRole: 'Veterinary Orthopedist, Boulder CO',
    initials: 'GT'
  },
  {
    id: 'test-3',
    rating: 5,
    quote: 'Ethical rescue adoption made simple.',
    content: 'We adopted Luna through Cascadia Rescue on PawPalace. The communication was seamless, the foster was incredible, and the starter kit gear was top tier quality.',
    author: 'Sarah Jenkins',
    authorRole: 'Guardian to Luna',
    initials: 'SJ'
  }
];
