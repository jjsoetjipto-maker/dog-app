export type WellnessCategory = 
  | 'preventive' 
  | 'nutrition' 
  | 'dental' 
  | 'joints' 
  | 'hydration' 
  | 'toxic-alert' 
  | 'mental-health';

export interface CanineWellnessTip {
  id: string;
  title: string;
  category: WellnessCategory;
  categoryLabel: string;
  categoryColor: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
  };
  icon: string;
  shortAdvice: string;
  fullExplanation: string;
  actionSteps: string[];
  vitalStat: string;
  vetSource: {
    name: string;
    title: string;
    credentials: string;
  };
  applicableAges: string;
  dayOfWeek: string;
  tags: string[];
  relatedProductId?: string;
  relatedProductLabel?: string;
}

export const CANINE_WELLNESS_TIPS: CanineWellnessTip[] = [
  {
    id: 'tip-skin-pinch-hydration',
    title: 'The 2-Second Skin Pinch Hydration Test',
    category: 'hydration',
    categoryLabel: 'Hydration & Vitals',
    categoryColor: {
      bg: 'bg-cyan-950/40',
      text: 'text-cyan-300',
      border: 'border-cyan-500/40',
      badgeBg: 'bg-cyan-500/20'
    },
    icon: 'water_drop',
    shortAdvice: 'Gently lift the loose skin between your dog’s shoulder blades. If skin takes over 1.5 seconds to snap back, your dog is sub-clinically dehydrated and needs immediate fresh electrolytes.',
    fullExplanation: 'Canine skin elasticity directly mirrors subcutaneous cellular hydration. In hot weather or after strenuous fetch sessions, panting rapidly depletes mucosal moisture. Checking gum tackiness (moist vs sticky) alongside the skin tent test gives a reliable 30-second dehydration assessment before heat exhaustion sets in.',
    actionSteps: [
      'Lift the nape skin 2 inches upward and release—it should spring flat in under 1 second.',
      'Check gums: they should feel slick and wet like saliva, not tacky or dry like sandpaper.',
      'Always maintain two separate stainless-steel or ceramic water stations at ambient temperature (avoid freezing cold water directly after heavy exercise).'
    ],
    vitalStat: 'Canine water intake baseline: 1 oz of water per pound of body weight daily (e.g., 50 lbs = ~6.2 cups).',
    vetSource: {
      name: 'Dr. Evelyn Reed, DVM, DACVS',
      title: 'Chief Veterinary Officer & Critical Care Surgeon',
      credentials: 'VECCS Level 1 Trauma Certified • Texas A&M Graduate'
    },
    applicableAges: 'All Canine Stages (Puppy to Senior)',
    dayOfWeek: 'Monday Wellness Focus',
    tags: ['Hydration', 'Dehydration', 'Summer Safety', 'Vital Signs'],
    relatedProductId: 'gear-travel-bottle',
    relatedProductLabel: 'Portable Stainless Travel Dispenser'
  },
  {
    id: 'tip-xylitol-birch-sugar',
    title: 'Hidden Xylitol (Birch Sugar) Toxicity Danger',
    category: 'toxic-alert',
    categoryLabel: 'Toxic Hazard Alert',
    categoryColor: {
      bg: 'bg-red-950/40',
      text: 'text-red-300',
      border: 'border-red-500/50',
      badgeBg: 'bg-red-500/20'
    },
    icon: 'warning',
    shortAdvice: 'Check peanut butter and sugar-free treats for "Xylitol" or "Birch Bark Extract". As little as 0.1g per kg causes acute canine hypoglycemia and irreversible liver necrosis.',
    fullExplanation: 'In humans, xylitol causes zero insulin spikes. In dogs, xylitol tricks the pancreas into releasing massive surges of insulin within 15–30 minutes, plummeting blood glucose to coma levels and triggering acute hepatic failure. Manufacturers often rebrand it as "Birch Bark Sugar" or "Wood Sugar".',
    actionSteps: [
      'Inspect peanut butter jars used for Kong stuffing—buy 100% single-ingredient roasted peanuts only.',
      'Never leave sugarless gum, breath mints, vitamin chewables, or keto baked goods in bags or low tables.',
      'If ingestion occurs, call the ASPCA Animal Poison Control ((888) 426-4435) immediately before attempting to induce vomiting.'
    ],
    vitalStat: 'Toxic threshold: 0.1g/kg causes hypoglycemia; 0.5g/kg causes acute liver failure (one piece of sugarless gum can endanger a 20-lb dog).',
    vetSource: {
      name: 'Dr. Gregory Vance, DVM, DACVECC',
      title: 'Director of Veterinary Toxicology & Critical Care',
      credentials: 'Diplomate ACVECC • Emergency Hospital Director'
    },
    applicableAges: 'All Ages',
    dayOfWeek: 'Tuesday Toxin Defense',
    tags: ['Toxic Foods', 'Xylitol', 'Emergency', 'Poison Prevention']
  },
  {
    id: 'tip-enzymatic-dental',
    title: 'Enzymatic Tooth Brushing: Halting 80% Periodontal Risk',
    category: 'dental',
    categoryLabel: 'Dental Hygiene',
    categoryColor: {
      bg: 'bg-teal-950/40',
      text: 'text-teal-300',
      border: 'border-teal-500/40',
      badgeBg: 'bg-teal-500/20'
    },
    icon: 'dentistry',
    shortAdvice: 'Over 80% of dogs show periodontal disease by age 3. Brushing 3x weekly with enzymatic poultry paste dissolves tartar before bacteria migrate into cardiac and kidney valves.',
    fullExplanation: 'Plaque calcifies into rock-hard calculus within 48 to 72 hours. While dental chews clean the cusps of premolars, only mechanical brushing removes subgingival biofilm where anaerobic bacteria breed. Never use human toothpaste, as foaming agents and fluoride are toxic to dogs.',
    actionSteps: [
      'Begin by allowing your dog to lick meat-flavored enzymatic paste from your finger for 3 consecutive days.',
      'Transition to a 360-degree soft finger brush or dual-headed canine toothbrush focusing on outside gumline surfaces.',
      'Target the large upper carnassial premolars where salivary duct minerals precipitate fastest.'
    ],
    vitalStat: 'Untreated periodontal disease shortens canine life expectancy by up to 2.5 years due to chronic microvascular strain.',
    vetSource: {
      name: 'Dr. Michael Chen, DVM, CVA',
      title: 'Senior Veterinary Dental & Pediatric Practitioner',
      credentials: 'DVM Cornell University • Fear Free Certified'
    },
    applicableAges: 'Puppies (12+ wks) & Adults',
    dayOfWeek: 'Wednesday Dental Routine',
    tags: ['Dental Care', 'Teeth Brushing', 'Longevity', 'Tartar'],
    relatedProductId: 'gear-dental-chew',
    relatedProductLabel: 'Vet-Approved Enzymatic Dental Kit'
  },
  {
    id: 'tip-five-minute-puppy-rule',
    title: 'The "5-Minute per Month of Age" Joint Rule',
    category: 'joints',
    categoryLabel: 'Orthopedics & Mobility',
    categoryColor: {
      bg: 'bg-amber-950/40',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20'
    },
    icon: 'accessibility_new',
    shortAdvice: 'Limit formal on-leash walking to 5 minutes per month of age, twice daily (e.g. 4 months = 20 mins max). Unclosed growth plates are easily deformed by repetitive high-impact pavement concussions.',
    fullExplanation: 'Canine growth plates (epiphyseal plates) remain open cartilaginous bands until 12 to 18 months of age (and up to 24 months in giant breeds like Great Danes). Repetitive road jogging or flying disc leaps before skeletal maturity causes micro-fractures, early osteoarthritis, and exacerbates genetic hip dysplasia.',
    actionSteps: [
      'Follow the formula: 3-month-old = 15 min walks; 6-month-old = 30 min walks twice daily.',
      'Allow free self-paced romp time on natural grass or dirt rather than forced continuous pavement trotting.',
      'Use ramps to prevent puppies and long-backed breeds (Corgis, Dachshunds) from leaping off high beds or SUVs.'
    ],
    vitalStat: 'Growth plates seal between 12-14 months in medium breeds and 18-24 months in large/giant breeds.',
    vetSource: {
      name: 'Dr. Sarah Thornton, DVM, DACVS, CCRP',
      title: 'Chief Orthopedic Surgeon & OFA Certifier',
      credentials: 'Diplomate ACVS • Canine Sports Medicine Certified'
    },
    applicableAges: 'Puppies (8 wks to 18 months)',
    dayOfWeek: 'Thursday Orthopedic Care',
    tags: ['Puppy Exercise', 'Joint Health', 'Growth Plates', 'Hip Dysplasia'],
    relatedProductId: 'gear-ortho-bed',
    relatedProductLabel: 'Dual-Layer Orthopedic Memory Foam Bed'
  },
  {
    id: 'tip-seven-second-asphalt',
    title: 'The 7-Second Asphalt Heat Safety Rule',
    category: 'preventive',
    categoryLabel: 'Thermal Health',
    categoryColor: {
      bg: 'bg-orange-950/40',
      text: 'text-orange-300',
      border: 'border-orange-500/40',
      badgeBg: 'bg-orange-500/20'
    },
    icon: 'thermostat',
    shortAdvice: 'Place the back of your bare hand firmly against pavement for 7 full seconds. If it feels uncomfortably hot to your skin, it will cause 2nd-degree thermal burns to canine paw pads within 60 seconds.',
    fullExplanation: 'When air temperature is 77°F (25°C), dark asphalt in direct sunlight can reach 125°F (52°C). At 87°F outside, pavement can reach 143°F (62°C), hot enough to fry an egg in 5 minutes and strip the keratinized dermis off dog paw pads. Dogs also release heat primarily through their pads and panting.',
    actionSteps: [
      'Schedule aerobic walks before 8:00 AM or after dusk during summer months.',
      'Stick to shaded grass, woodland trails, or equip breathable protective canine boots on hot surfaces.',
      'Rinse paws in cool (never ice cold) water if pads look pink, blistered, or if your dog licks them compulsively.'
    ],
    vitalStat: 'At 85°F ambient air temp, dark pavement reaches 135°F in sunny weather—burns occur in 60 seconds.',
    vetSource: {
      name: 'Dr. Julian Morales, DVM',
      title: 'Urgent Care Medical Director',
      credentials: 'Emergency Medicine Fellowship • UC Davis Graduate'
    },
    applicableAges: 'All Ages',
    dayOfWeek: 'Friday Heat Vigilance',
    tags: ['Paw Care', 'Heat Stroke', 'Summer Health', 'Pavement Safety']
  },
  {
    id: 'tip-post-meal-bloat-gdv',
    title: 'Post-Meal Bloat (GDV) 60-Minute Rest Rule',
    category: 'preventive',
    categoryLabel: 'Digestive Safety',
    categoryColor: {
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20'
    },
    icon: 'medication',
    shortAdvice: 'Enforce 60 minutes of calm rest immediately before and after meals. Vigorous running or rolling with a full stomach can trigger Gastric Dilatation-Volvulus (GDV stomach twist), a fatal veterinary emergency.',
    fullExplanation: 'Deep-chested breeds (Standard Poodles, Boxers, German Shepherds, Great Danes) have a deeper abdominal cavity that allows a heavy, gas-filled stomach to pivot on its axis. A twisted stomach cuts off vena cava blood supply within hours, causing hypovolemic shock. Slow-feeder bowls and smaller, divided meals dramatically lower risk.',
    actionSteps: [
      'No fetch, zoomies, or stair climbing for at least 1 hour post-feeding.',
      'Feed two or three smaller meals per day rather than one single heavy evening gorge.',
      'Use maze slow-feeder bowls to prevent rapid air swallowing (aerophagia).',
      'Watch for non-productive retching (trying to vomit with nothing coming up)—rush to 24/7 ER immediately.'
    ],
    vitalStat: 'GDV has a mortality rate up to 30% if delayed; prompt surgical decompression within 2 hours saves 90% of cases.',
    vetSource: {
      name: 'Dr. Evelyn Reed, DVM, DACVS',
      title: 'Chief Veterinary Officer & Trauma Surgeon',
      credentials: 'Board-Certified Veterinary Surgeon • VECCS Level 1'
    },
    applicableAges: 'All Ages (Especially Deep-Chested Breeds)',
    dayOfWeek: 'Saturday Digestive Alert',
    tags: ['GDV', 'Bloat', 'Emergency Surgery', 'Feeding Schedule'],
    relatedProductId: 'gear-slow-feeder',
    relatedProductLabel: 'Ergonomic Maze Slow-Feeder Bowl'
  },
  {
    id: 'tip-sniffari-mental-decompression',
    title: '15 Minutes of "Sniffari" Equals a 60-Minute Run',
    category: 'mental-health',
    categoryLabel: 'Canine Psychology',
    categoryColor: {
      bg: 'bg-indigo-950/40',
      text: 'text-indigo-300',
      border: 'border-indigo-500/40',
      badgeBg: 'bg-indigo-500/20'
    },
    icon: 'psychology',
    shortAdvice: 'Allow your dog to lead olfactory "sniffaris" on a loose leash. Scent processing engages 300 million olfactory receptors and burns as much mental cortisol as an hour of physical trotting.',
    fullExplanation: 'A dog’s olfactory cortex is 40 times larger than a human’s relative to brain size. When we constantly yank dogs away from telephone poles or grass patches, we deprive them of their primary sensory processing. Scent stimulation releases dopamine and reduces home hyper-reactivity, barking, and destructive chewing.',
    actionSteps: [
      'Dedicate at least 3 walks a week purely as "decompression sniff walks" with zero heel requirements on a 10-foot long line.',
      'Hide high-value treats inside rolled towels, snuffle mats, or grass patches for indoor scent work.',
      'Notice the behavioral difference: dogs that engage in scent work sleep 25% deeper and display less separation anxiety.'
    ],
    vitalStat: 'Dogs have up to 300 million olfactory receptors (vs. 6 million in humans), dedicating 10% of brain power to scent analysis.',
    vetSource: {
      name: 'Dr. Rebecca Alcott, DVM, CVA',
      title: 'Integrative Canine Behavioral Specialist',
      credentials: 'Tufts University DVM • Fear Free Elite Certified'
    },
    applicableAges: 'All Canine Stages',
    dayOfWeek: 'Sunday Mental Wellness',
    tags: ['Mental Health', 'Sniffari', 'Enrichment', 'Anxiety Relief']
  },
  {
    id: 'tip-rib-palpation-bcs',
    title: 'The Rib Palpation Test (BCS Score 4 to 5)',
    category: 'nutrition',
    categoryLabel: 'Weight & Longevity',
    categoryColor: {
      bg: 'bg-purple-950/40',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
      badgeBg: 'bg-purple-500/20'
    },
    icon: 'monitor_weight',
    shortAdvice: 'Run your hands along your dog’s ribcage without pressing hard. You should easily feel each rib like the back of your fingers in a flat hand. If it feels like the palm of your hand, your dog is overweight.',
    fullExplanation: 'Over 56% of companion dogs in the US are clinically overweight or obese. Excess adipose tissue produces continuous systemic pro-inflammatory cytokines, accelerating arthritis, cruciate ligament tears, diabetes, and reducing lifespan by an average of 1.8 to 2.5 years. Measuring kibble with a digital gram scale prevents slow weight creep.',
    actionSteps: [
      'Conduct the hand test: Back of fingers = ideal body condition; Knuckles = too thin; Flat palm = overweight.',
      'Look from above: your dog should have an observable hourglass tuck behind the ribcage.',
      'Calculate treats as strictly 10% or less of total daily caloric expenditure; substitute raw baby carrots or green beans for training rewards.'
    ],
    vitalStat: 'Purina 14-year lifespan study proved dogs kept at an ideal BCS (4-5) lived an average of 1.8 years longer with delayed arthritis onset.',
    vetSource: {
      name: 'Dr. Kimberly Adams, DVM, PhD',
      title: 'Canine Nutrition & Genetics Director',
      credentials: 'PhD in Veterinary Medical Genetics • DVM Texas A&M'
    },
    applicableAges: 'Adults & Seniors',
    dayOfWeek: 'Weekly Longevity Check',
    tags: ['Weight Management', 'BCS', 'Canine Obesity', 'Longevity']
  },
  {
    id: 'tip-ear-canal-yeast-check',
    title: 'The L-Shaped Ear Canal Moisture & Yeast Trap',
    category: 'preventive',
    categoryLabel: 'Hygiene & Infection Prevention',
    categoryColor: {
      bg: 'bg-rose-950/40',
      text: 'text-rose-300',
      border: 'border-rose-500/40',
      badgeBg: 'bg-rose-500/20'
    },
    icon: 'hearing',
    shortAdvice: 'Canine ear canals have a vertical drop followed by a horizontal bend (an "L" shape), trapping moisture after swimming or baths. Always dry thoroughly with pH-balanced drying flushes to halt yeast otitis.',
    fullExplanation: 'Because the ear canal takes a 90-degree corner before reaching the tympanic membrane, water cannot drain naturally by shaking alone. Trapped moisture combined with canine body warmth creates an incubation chamber for Malassezia yeast and Pseudomonas bacteria, especially in floppy-eared breeds (Spaniels, Retrievers, Doodles).',
    actionSteps: [
      'Always apply a veterinary ear cleanser containing a drying agent (salicylic or benzoic acid) immediately after swimming or lake trips.',
      'Squirt the cleanser, gently massage the base of the ear for 30 seconds until you hear a "squish", then let them shake.',
      'Never insert cotton swabs (Q-tips) into the canal, which packs debris deeper against the eardrum.'
    ],
    vitalStat: 'Otitis externa accounts for over 15% of all emergency canine veterinary visits nationwide.',
    vetSource: {
      name: 'Dr. Michael Chen, DVM, CVA',
      title: 'Senior Veterinarian & Allergy Specialist',
      credentials: 'DVM Cornell University • 14 Years Clinical Practice'
    },
    applicableAges: 'All Ages (Floppy & Heavy Coated Breeds)',
    dayOfWeek: 'Post-Bath Ear Protocol',
    tags: ['Ear Infections', 'Yeast Otitis', 'Swimming Dogs', 'Grooming']
  },
  {
    id: 'tip-omega-3-joint-lubrication',
    title: 'Marine EPA & DHA Omega-3s vs Plant Flaxseed',
    category: 'nutrition',
    categoryLabel: 'Anti-Inflammatory Nutrition',
    categoryColor: {
      bg: 'bg-blue-950/40',
      text: 'text-blue-300',
      border: 'border-blue-500/40',
      badgeBg: 'bg-blue-500/20'
    },
    icon: 'set_meal',
    shortAdvice: 'Dogs convert less than 5% of plant ALA (flaxseed/chia) into anti-inflammatory EPA and DHA. For joint cartilage cushioning and allergic pruritus relief, use purified cold-water marine oil (wild Alaskan salmon or anchovy).',
    fullExplanation: 'Unlike humans, dogs lack the enzymatic desaturase efficiency to convert plant-based short-chain Omega-3 fatty acids into long-chain EPA (eicosapentaenoic acid) and DHA. Marine-derived fatty acids directly integrate into cell membranes, suppressing COX-2 inflammatory pathways that break down articular joint cartilage.',
    actionSteps: [
      'Look for third-party tested marine oils (anchovy, sardine, or wild salmon) in opaque UV-blocking glass bottles.',
      'Refrigerate after opening to prevent peroxidation and rancidity.',
      'Dose at approximately 75-100 mg combined EPA/DHA per kg of body weight for active joint therapy.'
    ],
    vitalStat: 'Canine conversion of plant ALA to active EPA is under 5%—marine sources provide 100% bioavailable joint lubrication.',
    vetSource: {
      name: 'Dr. Kimberly Adams, DVM, PhD',
      title: 'Canine Nutrition & Genetics Specialist',
      credentials: 'Texas A&M Veterinary Genetics • Clinical Nutrition Consultant'
    },
    applicableAges: 'Adults & Seniors (and large-breed puppies after 6 months)',
    dayOfWeek: 'Daily Nutritional Boost',
    tags: ['Omega-3', 'Joint Health', 'Supplements', 'Coat & Skin']
  },
  {
    id: 'tip-tick-check-hotspots',
    title: 'The 5 Critical Canine Tick Check Hotspots',
    category: 'preventive',
    categoryLabel: 'Parasite Defense',
    categoryColor: {
      bg: 'bg-lime-950/40',
      text: 'text-lime-300',
      border: 'border-lime-500/40',
      badgeBg: 'bg-lime-500/20'
    },
    icon: 'bug_report',
    shortAdvice: 'Ticks prefer thin-skinned, vascular areas. After wooded hikes, inspect: (1) inside and behind ears, (2) between all paw toes, (3) groin & armpits, (4) under the collar, and (5) under the tail base.',
    fullExplanation: 'Ticks transmit Borrelia burgdorferi (Lyme disease), Anaplasma, and Ehrlichia. Most pathogens require 24 to 48 hours of tick attachment before transmission into the canine bloodstream, making prompt daily manual body checks the single best defense alongside oral or topical preventatives.',
    actionSteps: [
      'Run your fingertips firmly against the grain of the fur over the 5 critical hotspots after any outdoor excursion.',
      'Use fine-tipped tweezers or a tick-removal tool to grasp the tick as close to the skin as possible and pull straight upward without twisting.',
      'Never burn ticks or smother them with petroleum jelly, which induces regurgitation of infected fluids into the bite wound.'
    ],
    vitalStat: 'Removing an attached tick within 24 hours of attachment reduces Lyme transmission odds by over 95%.',
    vetSource: {
      name: 'Dr. Gregory Vance, DVM, DACVECC',
      title: 'Director of Emergency Medicine',
      credentials: 'VECCS Level 1 Trauma Director'
    },
    applicableAges: 'All Ages',
    dayOfWeek: 'Post-Hike Parasite Check',
    tags: ['Ticks', 'Lyme Disease', 'Outdoor Safety', 'First Aid']
  },
  {
    id: 'tip-theobromine-chocolate-calculator',
    title: 'Dark vs. Milk Chocolate Toxicity Thresholds',
    category: 'toxic-alert',
    categoryLabel: 'Toxicology Protocol',
    categoryColor: {
      bg: 'bg-rose-950/40',
      text: 'text-rose-300',
      border: 'border-rose-500/50',
      badgeBg: 'bg-rose-500/20'
    },
    icon: 'cookie',
    shortAdvice: 'Baking chocolate and dark cocoa contain up to 10x more theobromine than milk chocolate. 1 oz of baker’s chocolate can induce fatal cardiac arrhythmias in a 50 lb dog.',
    fullExplanation: 'Theobromine and caffeine belong to the methylxanthine class. Dogs metabolize theobromine extremely slowly (half-life of 17.5 hours). Symptoms escalate from hyperactivity and vomiting to cardiac arrhythmias, muscle tremors, seizures, and heart failure. White chocolate contains negligible theobromine but carries a severe pancreatitis risk due to high butterfat.',
    actionSteps: [
      'Keep holiday gift boxes, baking bars, and dark chocolate chips locked in high pantries.',
      'If ingestion occurs: record exact chocolate type (milk, 70% dark, cocoa powder) and quantity consumed in ounces or grams.',
      'Contact a 24/7 veterinary emergency hospital immediately for calculated toxin dosing and timely gastric lavage.'
    ],
    vitalStat: 'Mild signs start at 20 mg/kg theobromine; severe cardiovascular collapse occurs at 40-50 mg/kg (Cocoa powder has ~800 mg per oz).',
    vetSource: {
      name: 'Dr. Evelyn Reed, DVM, DACVS',
      title: 'Chief Veterinary Officer',
      credentials: 'Board-Certified Veterinary Surgeon • VECCS Level 1'
    },
    applicableAges: 'All Ages',
    dayOfWeek: 'Holiday Toxin Alert',
    tags: ['Chocolate', 'Theobromine', 'Toxic Foods', 'Emergency Poisoning']
  }
];

const SAVED_WELLNESS_TIPS_KEY = 'pawpalace_saved_wellness_tip_ids';

export const loadSavedWellnessTipIds = (): string[] => {
  try {
    const raw = localStorage.getItem(SAVED_WELLNESS_TIPS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load saved wellness tips from localStorage:', e);
  }
  return ['tip-skin-pinch-hydration', 'tip-xylitol-birch-sugar'];
};

export const saveSavedWellnessTipIds = (ids: string[]) => {
  try {
    localStorage.setItem(SAVED_WELLNESS_TIPS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save wellness tips to localStorage:', e);
  }
};

/**
 * Returns today's featured wellness tip deterministically based on current calendar date.
 */
export const getTodayFeaturedWellnessTip = (): CanineWellnessTip => {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const index = dayOfYear % CANINE_WELLNESS_TIPS.length;
  return CANINE_WELLNESS_TIPS[index];
};
