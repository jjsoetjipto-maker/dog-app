import { AppLanguage } from '../types';

export interface TranslationDictionary {
  // Brand & General
  brandName: string;
  brandTagline: string;
  verified: string;
  topNotice: string;
  ethicalStandard: string;
  breederDirectory: string;
  ownerPortal: string;
  
  // Navigation
  navHome: string;
  navFindDogs: string;
  navDogGear: string;
  navVetFinder: string;
  navGrooming?: string;
  navPupProfile: string;
  navRecommended: string;
  navVerifiedBreeders: string;
  navPledge: string;
  escrowActive: string;
  postListing: string;
  savedFavorites: string;
  shoppingBag: string;
  logInSignUp: string;
  signOut: string;
  settings: string;

  // Recommended Match Finder
  recommendedTitle: string;
  recommendedSubtitle: string;
  lifestyleQuizTitle: string;
  matchScoreLabel: string;
  livingSpaceLabel: string;
  activityLevelLabel: string;
  sizePreferenceLabel: string;
  resetPreferencesBtn: string;
  topMatchesLabel: string;
  compareMatchesBtn: string;
  
  // Search Bar
  searchPlaceholder: string;
  allCatalog: string;
  dogsPuppies: string;
  petGear: string;
  rescueShelters: string;
  zipPlaceholder: string;
  exploreBtn: string;
  
  // Dog of the Day
  dogOfTheDayTitle: string;
  dogOfTheDaySubtitle: string;
  dogOfTheDayBadge: string;
  rejectHideBtn: string;
  rejectToast: string;
  restoreToast: string;
  hiddenRejectedCount: string;
  viewProfileBtn: string;
  inquireBreederBtn: string;
  dnaClearance: string;
  escrowGuarantee: string;
  healthWarranty: string;
  allHiddenNotice: string;
  restoreCatalogBtn: string;
  
  // Home Sections & Cards
  verifiedDogsSectionTitle: string;
  viewAllVerifiedDogs: string;
  popularCategories: string;
  startingAt: string;
  availableNow: string;
  vetVettedGear: string;
  exploreAllGear: string;
  ourPillarsTitle: string;
  ourPillarsSubtitle: string;
  
  // Settings Modal
  settingsModalTitle: string;
  settingsModalSubtitle: string;
  tabAppearance: string;
  tabLanguageRegion: string;
  tabPreferences: string;
  themeModeLabel: string;
  themeLight: string;
  themeLightDesc: string;
  themeDark: string;
  themeDarkDesc: string;
  themeSystem: string;
  themeSystemDesc: string;
  languageSelectLabel: string;
  currencySelectLabel: string;
  distanceUnitsLabel: string;
  unitMiles: string;
  unitKilometers: string;
  escrowSafetyAlerts: string;
  escrowSafetyAlertsDesc: string;
  soundEffects: string;
  soundEffectsDesc: string;
  resetDefaultsBtn: string;
  saveSettingsBtn: string;
  settingsSavedToast: string;
  
  // Quick Actions & Tooltips
  toggleThemeTooltip: string;
  changeLanguageTooltip: string;
  openSettingsTooltip: string;

  // Hero & Home Section
  heroNetworkBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroTitle3: string;
  heroDesc: string;
  heroFindDogTab: string;
  heroShopGearTab: string;
  heroBreedLabel: string;
  heroAllBreeds: string;
  heroRadiusLabel: string;
  heroNationwide: string;
  heroWithin50: string;
  heroWithin150: string;
  heroWithin300: string;
  heroLifeStageLabel: string;
  heroAllAges: string;
  heroPuppyStage: string;
  heroYoungStage: string;
  heroAdultStage: string;
  heroEquipLabel: string;
  heroAllGear: string;
  heroShowcaseColor: string;
  heroSearchBtn: string;
  dogTipsBannerTitle: string;

  // Find Dogs Screen
  findDogsBadge: string;
  findDogsTitle: string;
  findDogsSubtitle: string;
  activeFiltersLabel: string;
  activeCategoryAll: string;
  activeCategoryPuppies: string;
  activeCategoryRescues: string;
  ofaClearedLineage: string;
  geneticDnaPanel: string;
  resetFiltersBtn: string;
  filterCompanionsTitle: string;
  categoryTypeLabel: string;
  catAllDogs: string;
  catEthicalPuppies: string;
  catRescueShelter: string;
  breedLabel: string;
  breedSearchPlaceholder: string;
  genderLabel: string;
  genderAll: string;
  genderMale: string;
  genderFemale: string;
  ageLabel: string;
  ageAll: string;
  agePuppy: string;
  ageYoung: string;
  ageAdult: string;
  maxAdoptionFee: string;
  healthClearancesLabel: string;
  ofaScreenedOnly: string;
  dnaPanelOnly: string;
  matchAlertTitle: string;
  matchAlertDesc: string;
  matchAlertPlaceholder: string;
  matchAlertBtn: string;
  showingLabel: string;
  verifiedCompanionsCount: string;
  listDogWithPhotoBtn: string;
  chartsOn: string;
  chartsOff: string;
  sortByLabel: string;
  sortByFeatured: string;
  sortByPriceLow: string;
  sortByPriceHigh: string;
  sortByAge: string;
  noDogsFoundTitle: string;
  noDogsFoundDesc: string;
  cardReserveBtn: string;
  cardChatBtn: string;
  cardInquireBtn: string;
  cardGeneticallyScreened: string;
  cardHealthGuaranteed: string;
  cardPendingReview: string;

  // Dog Detail Screen
  backToCompanions: string;
  adoptionFeeLabel: string;
  reserveEscrowBtn: string;
  chatBreederBtn: string;
  safeMeetingBtn: string;
  certifiedBreederLabel: string;
  healthPedigreeTitle: string;
  dnaSummaryTitle: string;
  orthopedicOfaTitle: string;
  personalityTraitTitle: string;
  aboutCompanionTitle: string;
  recommendedGearTitle: string;

  // Gear Screen
  gearBadge: string;
  gearTitle: string;
  gearSubtitle: string;
  addToBagBtn: string;
  inBagBadge: string;
  allGearTab: string;
  bedsTab: string;
  harnessesTab: string;
  travelTab: string;
  nutritionTab: string;

  // Footer & Guarantees
  footerMission: string;
  footerOfaTitle: string;
  footerOfaDesc: string;
  footerEscrowTitle: string;
  footerEscrowDesc: string;
  footerDeliveryTitle: string;
  footerDeliveryDesc: string;
  footerWarrantyTitle: string;
  footerWarrantyDesc: string;
  newsletterTitle: string;
  newsletterDesc: string;
  newsletterPlaceholder: string;
  subscribeBtn: string;
  rightsReserved: string;

  // Drawers
  cartTitle: string;
  cartEmptyTitle: string;
  cartEmptyDesc: string;
  subtotalLabel: string;
  freeShippingLabel: string;
  totalLabel: string;
  checkoutBtn: string;
  wishlistTitle: string;
  wishlistEmptyTitle: string;
  wishlistEmptyDesc: string;
  adoptViewBtn: string;
}
