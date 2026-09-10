import { Dog, DogActivitiesInfo, SellerProfileInfo } from '../types';

export interface RaisingTip {
  id: string;
  category: 'first-48-hours' | 'potty-crate' | 'socialization' | 'nutrition' | 'manners';
  categoryLabel: string;
  categoryIcon: string;
  title: string;
  ruleOfThumb: string;
  explanation: string;
  actionSteps: string[];
  proBreederSecret: string;
  recommendedAge: string;
}

export const DOG_RAISING_TIPS: RaisingTip[] = [
  {
    id: 'tip-decompression',
    category: 'first-48-hours',
    categoryLabel: 'First 48 Hours',
    categoryIcon: 'home',
    title: 'The "3-3-3 Rule" of Decompression',
    ruleOfThumb: '3 Days to Decompress, 3 Weeks to Learn Routine, 3 Months to Feel at Home',
    explanation: 'When a puppy or dog arrives in a new environment, their cortisol (stress hormone) levels are elevated. Avoid inviting neighbors or hosting parties during the first 3 days.',
    actionSteps: [
      'Set up a quiet, puppy-proofed sanctuary zone with a crate and soft bedding away from heavy foot traffic.',
      'Keep interactions quiet, gentle, and low-key with calm vocal tones.',
      'Allow the puppy to explore one room at a time rather than overwhelming them with the entire house.'
    ],
    proBreederSecret: 'Place a ticking analog clock wrapped in a towel or a heartbeat plush inside the crate to simulate their mother’s heartbeat.',
    recommendedAge: 'All Ages (8 wks - Senior)'
  },
  {
    id: 'tip-night-crying',
    category: 'first-48-hours',
    categoryLabel: 'First 48 Hours',
    categoryIcon: 'bedtime',
    title: 'Conquering the First Night Whining',
    ruleOfThumb: 'Keep the Crate at Eye Level Beside Your Bed for Nights 1 to 4',
    explanation: 'Puppies have never slept alone; sudden isolation triggers primal abandonment fear. Being within scent and hearing distance prevents panic while maintaining crate boundaries.',
    actionSteps: [
      'Elevate the crate on a sturdy chair or nightstand next to your bed so the pup can see and smell you.',
      'Dangle your fingers through the grate for 2 minutes to reassure them without taking them out.',
      'Establish a quiet, cue phrase like "Bedtime, good pup" and keep room lights dim.'
    ],
    proBreederSecret: 'Never take a puppy out of the crate while they are actively screaming, or they learn noise equals release. Wait for a 3-second quiet pause before opening.',
    recommendedAge: '8 - 14 Weeks'
  },
  {
    id: 'tip-potty-15min',
    category: 'potty-crate',
    categoryLabel: 'Potty & Crate',
    categoryIcon: 'pets',
    title: 'The 15-Minute Biological Clock Rule',
    ruleOfThumb: 'Take Puppies to the Designated Grass Spot Every 15 Minutes After Waking, Eating, or Playing',
    explanation: 'A puppy’s bladder capacity in hours roughly equals their age in months (a 2-month-old can hold it max 2-3 hours, but digestion stimulates peristalsis within 15 minutes).',
    actionSteps: [
      'Carry the puppy directly to the exact same outdoor spot on a 6-foot leash (don’t let them roam).',
      'Stand still like a tree and give your cue word ("Go potty") once in a neutral tone.',
      'When they eliminate, reward within 2 SECONDS with enthusiastic praise and a pea-sized high-value treat.'
    ],
    proBreederSecret: 'Never punish an indoor accident after the fact. Dogs cannot connect delayed punishment with past actions. Clean accidents with enzymatic cleaner so the scent is completely neutralized.',
    recommendedAge: '8 - 24 Weeks'
  },
  {
    id: 'tip-crate-positive',
    category: 'potty-crate',
    categoryLabel: 'Potty & Crate',
    categoryIcon: 'security',
    title: 'Building a 5-Star Crate Den',
    ruleOfThumb: 'The Crate is a Cozy Bedroom, Never a Punishment Cell',
    explanation: 'Dogs are natural den animals. When introduced through games, high-value meals, and comfort items, the crate becomes their preferred safe haven.',
    actionSteps: [
      'Feed all regular daily meals inside the open crate with the door ajar.',
      'Scatter crunchy treats inside like a treasure hunt when the puppy isn’t looking.',
      'Give frozen peanut butter or wet food KONGs exclusively inside the crate.'
    ],
    proBreederSecret: 'Size matters: The crate should only be large enough for the pup to stand, turn around, and lie down. If it is too large, they will sleep on one side and soil the other.',
    recommendedAge: '8 - 16 Weeks'
  },
  {
    id: 'tip-rule-of-7',
    category: 'socialization',
    categoryLabel: 'Socialization & Play',
    categoryIcon: 'psychology',
    title: 'The Famous "Rule of 7" Socialization',
    ruleOfThumb: 'Expose Pups to 7 New Surfaces, 7 Friendly People, and 7 Objects by 16 Weeks',
    explanation: 'The critical socialization window closes between 14-16 weeks. Gentle, positive exposure prevents fear-based reactivity later in life.',
    actionSteps: [
      'Walk on 7 surfaces: Grass, hardwood, gravel, carpet, concrete, tile, and metal grates.',
      'Meet 7 kinds of people: Wearing hats, sunglasses, carrying umbrellas, high-vis vests, beards, children, and seniors.',
      'Encounter 7 sounds: Vacuum at a distance, sirens on TV, rustling plastic bags, doorbells, thunder recordings, fireworks at low volume, and hair dryers.'
    ],
    proBreederSecret: 'Quality over quantity: Always pair new sights with high-value treats (chicken or cheese). If the puppy looks hesitant, back up 10 feet and reward calm observation.',
    recommendedAge: '8 - 16 Weeks'
  },
  {
    id: 'tip-mental-enrichment',
    category: 'socialization',
    categoryLabel: 'Socialization & Play',
    categoryIcon: 'extension',
    title: '15 Minutes of Brain Work = 1 Hour of Physical Running',
    ruleOfThumb: 'Tire Their Minds, Not Just Their Growing Puppy Joints',
    explanation: 'Over-exercising a puppy can cause irreversible damage to open growth plates. Mental stimulation through scent work burns energy without skeletal impact.',
    actionSteps: [
      'Ditch the standard food bowl: Feed meals in snuffle mats, puzzle feeders, or rolled-up towels.',
      'Play the "Find It" game: Scatter kibble across living room rugs for 10 minutes of scent tracking.',
      'Introduce short 3-minute clicker training micro-sessions teaching "Sit", "Touch", and "Spin".'
    ],
    proBreederSecret: 'Licking releases endorphins and reduces heart rate. A lick mat with frozen Greek yogurt and pumpkin is the ultimate natural soother before bedtime.',
    recommendedAge: 'All Puppies & Adults'
  },
  {
    id: 'tip-puppy-teething',
    category: 'nutrition',
    categoryLabel: 'Nutrition & Teething',
    categoryIcon: 'restaurant',
    title: 'Soothing Sore Teething Gums',
    ruleOfThumb: 'Between 12 and 24 Weeks, Provide Cold Chews to Save Your Furniture',
    explanation: 'As 28 baby needle-teeth fall out and 42 adult teeth erupt, the puppy’s gums itch and throb painfully. They need appropriate textured resistance.',
    actionSteps: [
      'Soak an old clean washcloth in low-sodium bone broth, twist it into a rope, and freeze solid.',
      'Offer frozen whole carrots as a low-calorie, gum-numbing natural chew.',
      'Keep 3 distinct textures accessible: Rubber (KONG), pliable nylon (Benebone Puppy), and textured rope.'
    ],
    proBreederSecret: 'If the puppy mouths your hands or ankles, immediately freeze in place, emit a sharp "Ouch!", and redirect their mouth onto an authorized chew toy.',
    recommendedAge: '12 - 24 Weeks'
  },
  {
    id: 'tip-calibrated-meals',
    category: 'nutrition',
    categoryLabel: 'Nutrition & Teething',
    categoryIcon: 'scale',
    title: 'Calibrated Growth & Lean Body Conditioning',
    ruleOfThumb: 'Keep Puppies Lean; You Should Easily Feel Their Ribs Without Pressing',
    explanation: 'Excess weight in puppies accelerates orthopedic dysplasia in hips and elbows. Large breed puppies must not grow too rapidly.',
    actionSteps: [
      'Feed puppy formulations matched to their mature adult size (large-breed kibble has controlled calcium:phosphorus).',
      'Split daily food into 3 measured meals until 6 months of age, then transition to 2 meals.',
      'Treats should never exceed 10% of total daily caloric intake.'
    ],
    proBreederSecret: 'Use their daily kibble ration as training treats! Take 25% of their breakfast kibble in a pouch for training walks throughout the morning.',
    recommendedAge: '2 - 12 Months'
  },
  {
    id: 'tip-bite-inhibition',
    category: 'manners',
    categoryLabel: 'Manners & Bonding',
    categoryIcon: 'handshake',
    title: 'Teaching Soft Mouth & Bite Inhibition',
    ruleOfThumb: 'Teach Them How Hard They Can Bite Before Teaching Them Not to Bite at All',
    explanation: 'Littermates teach bite inhibition by yelping and stopping play when bitten too hard. Humans must replicate this lesson so the dog develops an automatic soft mouth.',
    actionSteps: [
      'When teeth make contact with human skin, make a high-pitched "Yip!" or "Ouch!"',
      'Turn your back and cross your arms for 10 seconds (fun ceases instantly).',
      'Resume play, and reward gentle tongue licks or toy holds with affectionate praise.'
    ],
    proBreederSecret: 'Never swat or tap a puppy on the nose. Physical corrections create hand-shyness and can turn playful mouthing into defensive snapping.',
    recommendedAge: '8 - 20 Weeks'
  }
];

export const DAILY_PUPPY_ROUTINE = [
  { time: '6:30 AM', activity: 'Wake Up & Immediate Potty', notes: 'Carry pup directly outside to designated spot; reward within 3s.' },
  { time: '7:00 AM', activity: 'Breakfast & Fresh Water', notes: 'Feed in crate or snuffle mat for mental enrichment.' },
  { time: '7:20 AM', activity: 'Post-Meal Potty Walk', notes: 'Digestive tract activates 15-20 min post eating.' },
  { time: '7:45 AM', activity: 'Interactive Play & Training', notes: '5-minute micro-session: Sit, Touch, Gentle Tug.' },
  { time: '8:30 AM', activity: 'Morning Nap in Crate', notes: 'Puppies need 18-20 hours of sleep daily to avoid overtired tantrums.' },
  { time: '11:30 AM', activity: 'Midday Potty & Backyard Sniff', notes: 'Allow free sniffing on grass or garden mulch.' },
  { time: '12:00 PM', activity: 'Lunch or Frozen KONG Snack', notes: 'Soothes teething gums and burns mental energy.' },
  { time: '1:00 PM', activity: 'Afternoon Quiet Den Nap', notes: 'Play soft classical music or white noise near crate.' },
  { time: '4:30 PM', activity: 'Safe Socialization Outing', notes: 'Sit in car trunk or park bench watching traffic & people safely.' },
  { time: '6:00 PM', activity: 'Dinner & Final Main Water Bowl', notes: 'Pick up water 2 hours before bedtime to prevent night leaks.' },
  { time: '7:30 PM', activity: 'Gentle Brush & Cuddle Time', notes: 'Handle paws, ears, and belly to prepare for vet checkups.' },
  { time: '10:00 PM', activity: 'Final Bedtime Potty & Sleep', notes: 'Calm, dark room; place soothing heartbeat toy in crate.' }
];

// Seller profiles for dog sellers / breeders / rescue leads
const SELLER_REGISTRY: Record<string, SellerProfileInfo> = {
  'Sunridge Golden Retrievers': {
    name: 'Eleanor Vance',
    role: 'Principal Preservation Breeder & Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    kennelOrFacility: 'Sunridge Golden Retrievers (AKC Breeder of Merit #2940)',
    location: 'Austin, TX',
    phoneVerified: true,
    yearsActive: 14,
    responseRate: '99% (typically replies in ~3 mins)',
    badge: 'Verified Master Preservation Breeder & Caregiver',
    quote: 'We raise every puppy in the center of our living room using ENS and Puppy Culture so they transition seamlessly into loving homes.'
  },
  'Highland Aussie Acres': {
    name: 'Sarah Jenkins',
    role: 'Head Breeder & Canine Behaviorist',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    kennelOrFacility: 'Highland Aussie Acres (State Certified #TX-4812)',
    location: 'Denver, CO',
    phoneVerified: true,
    yearsActive: 11,
    responseRate: '100% within 15 minutes',
    badge: 'Verified Ethical Breeder & Seller',
    quote: 'Our Aussies are bred for stable off-switches, clear minds, and boundless loyalty. Ask me anything about temperament!'
  },
  'Palmetto Frenchies': {
    name: 'Carlos Ramirez',
    role: 'Kennel Master & BOAS Preservation Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    kennelOrFacility: 'Palmetto Frenchies (Open Air Respiratory Certified)',
    location: 'Miami, FL',
    phoneVerified: true,
    yearsActive: 9,
    responseRate: '98% response rate',
    badge: 'Verified Preservation Breeder & Seller',
    quote: 'We breed specifically for open nostrils, clear breathing, and sweet affectionate clown personalities.'
  },
  'Cascadia Canine Rescue': {
    name: 'Elena Rostova',
    role: 'Senior Adoption Director & Foster Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    kennelOrFacility: 'Cascadia Canine Rescue (501(c)(3) Nonprofit #OR-9201)',
    location: 'Portland, OR',
    phoneVerified: true,
    yearsActive: 8,
    responseRate: '100% within 1 hour',
    badge: 'Verified Rescue Director & Foster Caregiver',
    quote: 'Our pups live in loving volunteer foster homes where their personalities, likes, and house manners are fully tested.'
  },
  'Heritage Cavaliers': {
    name: 'Claire Montgomery',
    role: 'Preservation Breeder & Cardiac Certified Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    kennelOrFacility: 'Heritage Cavaliers (OFA Clear Registry)',
    location: 'Raleigh, NC',
    phoneVerified: true,
    yearsActive: 16,
    responseRate: '99% within 10 minutes',
    badge: 'Verified Preservation Breeder & Seller',
    quote: 'Cavaliers are the ultimate gentle lap companions. We prioritize cardiac health and calm, affectionate spirits.'
  },
  'Alpine Berners': {
    name: 'Dr. Michael Sterling, DVM',
    role: 'Veterinarian & Alpine Berners Caregiver',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    kennelOrFacility: 'Alpine Bernese Mountain Dogs (OFA Champion Lineage)',
    location: 'Salt Lake City, UT',
    phoneVerified: true,
    yearsActive: 13,
    responseRate: '100% within 30 minutes',
    badge: 'Verified Veterinarian & Breeder Seller',
    quote: 'We focus on longevity, sound hips and elbows, and that legendary gentle giant temperament.'
  }
};

export function getSellerForDog(dog: Dog): SellerProfileInfo {
  if (dog.breederName && SELLER_REGISTRY[dog.breederName]) {
    return SELLER_REGISTRY[dog.breederName];
  }

  // Generate a realistic seller persona if breeder name doesn't match predefined map
  const nameParts = dog.breederName ? dog.breederName.split(' ') : ['PawPalace', 'Breeder'];
  const sellerFirstName = nameParts[0] || 'Eleanor';

  return {
    name: `${sellerFirstName} Vance`,
    role: `Licensed Caregiver & Seller at ${dog.breederName || 'Verified Facility'}`,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    kennelOrFacility: dog.breederName || 'Certified Breeding Kennel',
    location: dog.location || 'United States',
    phoneVerified: true,
    yearsActive: 10,
    responseRate: '99% within 15 minutes',
    badge: dog.isRescue ? 'Verified Rescue Coordinator & Caregiver' : 'Verified Breeder & Seller',
    quote: `I have cared for ${dog.name} every single day and know ${dog.gender === 'Female' ? 'her' : 'his'} habits, favorite toys, and routine inside out!`
  };
}

// Tailored activities and favorite things for each dog
export function getDogActivities(dog: Dog): DogActivitiesInfo {
  const isFemale = dog.gender === 'Female';
  const name = dog.name;

  if (dog.breed.toLowerCase().includes('golden')) {
    return {
      favoriteToys: ['Squeaky Plush Mallard Duck', 'KONG Classic filled with frozen peanut butter', 'Braided Cotton Rope Tug', 'Chuckit! Floating Water Bumper'],
      favoriteGames: ['Gentle Lawn Fetch & Soft Mouth Retrieve', 'Splashing in shallow kiddie pools & lawn sprinklers', 'Hide & Seek with hidden kibble scent trails'],
      dailyQuirk: `Carries ${isFemale ? 'her' : 'his'} favorite plush duck gently in ${isFemale ? 'her' : 'his'} mouth to greet you with rhythmic tail wags whenever you walk into the room!`,
      relaxationSpot: `Sprawled belly-up on the cool kitchen tile, or resting ${isFemale ? 'her' : 'his'} chin lovingly across your feet while you work.`,
      favoriteTreat: 'Crispy freeze-dried beef liver & organic steamed sweet potato chunks.',
      energyWindow: 'Playful and eager to learn between 8:00 AM - 10:00 AM, then content with soothing puppy naps.',
      socialStyle: 'Admires children, gentle with cats, and greets everyone like an old best friend.'
    };
  }

  if (dog.breed.toLowerCase().includes('aussie') || dog.breed.toLowerCase().includes('australian')) {
    return {
      favoriteToys: ['Flirt Pole with sheepskin lure', 'Outward Hound Level 2 Nina Ottosson Puzzle', 'Chuckit! Max Glow Tennis Ball', 'Herding Jolly Ball'],
      favoriteGames: ['Backyard Agility Hurdle runs', 'Learning new trick sequences (already knows "Sit", "Paw", and "Spin")', 'Frisbee gliding in the yard'],
      dailyQuirk: `Gives the gentlest little nose-taps against your knee when asking if it’s time to start morning training games!`,
      relaxationSpot: `Curled in a tight doughnut shape right next to your couch cushions where ${isFemale ? 'she' : 'he'} can keep an eye on the whole family.`,
      favoriteTreat: 'String cheese micro-cubes & dehydrated salmon training treats.',
      energyWindow: 'High enthusiasm during morning and twilight outdoor games; very calm when provided puzzle toys.',
      socialStyle: 'Extremely bonded to the family, sharp focus, respectful of boundaries.'
    };
  }

  if (dog.breed.toLowerCase().includes('french') || dog.breed.toLowerCase().includes('bulldog')) {
    return {
      favoriteToys: ['Soft textured rubber dental bone', 'Crinkle plush donut with squeaker', 'Snuffle foraging mat', 'Soft fleece tug rope'],
      favoriteGames: ['Short joyful living room zoomies across rugs', 'Rolling a soft indoor soccer ball with the snout', 'Gentle tug-of-war with human playmates'],
      dailyQuirk: `Makes adorable soft contented snore-purrs when tucked under a warm fleece blanket on someone’s lap.`,
      relaxationSpot: `Directly on any sunny patch of sunlight filtering through the window, resting on a plush memory foam bolster.`,
      favoriteTreat: 'Fresh crunchy carrot batons and a spoonful of chilled plain pumpkin puree.',
      energyWindow: 'Enthusiastic 15-minute bursts of clownish fun, followed by luxurious 2-hour naps.',
      socialStyle: 'Loves being the center of attention; enjoys cuddles with adults, kids, and other calm pets.'
    };
  }

  if (dog.breed.toLowerCase().includes('corgi')) {
    return {
      favoriteToys: ['Squeaky miniature rugby ball', 'Treat dispensing Bob-A-Lot wobble toy', 'Plush hedgehog with low-tone grunt'],
      favoriteGames: ['Herding soft plush toys into a neat corner', 'Exploring garden mulch pathways and sniffing flower beds', 'Practicing hand-touch targeting'],
      dailyQuirk: `Does an adorable little rear-leg "sploot" flat on the floor whenever enjoying a dental chew!`,
      relaxationSpot: `Underneath the coffee table where the floor is cool and sheltered.`,
      favoriteTreat: 'Dehydrated chicken tenders and blueberry rewards.',
      energyWindow: 'Spunky and cheerful all afternoon, loves a rhythmic walk around the neighborhood.',
      socialStyle: 'Outgoing, curious, vocal with happy greeting trills, and very sociable.'
    };
  }

  // Rescue or general companion
  return {
    favoriteToys: ['Benebone Wishbone Puppy Chew', 'Outward Hound Hide-A-Squirrel Puzzle', 'Ultra-durable rubber tug ring', 'Plush lamb with crinkle ears'],
    favoriteGames: ['Backyard sniffari scent discovery', 'Playing catch with bouncy tennis balls', 'Interactive food puzzle challenges'],
    dailyQuirk: `Does a joyful front-paw tap-dance of excitement whenever ${isFemale ? 'she' : 'he'} hears the leash click!`,
    relaxationSpot: `Head propped gently on the edge of the dog bed watching the birds through the patio glass.`,
    favoriteTreat: 'Organic peanut butter stuffed into a natural hollow marrow bone.',
    energyWindow: 'Loves morning sniff walks and evening snuggle sessions on the sofa.',
    socialStyle: 'Patient, attentive, eager to please, and deeply affectionate with guardians.'
  };
}
