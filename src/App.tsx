import React, { useState, useEffect, useMemo } from 'react';
import { Screen, Dog, GearProduct, CartItem, UserProfile } from './types';
import { DOGS, GEAR_PRODUCTS } from './data/mockData';
import { loadStoredUser, saveStoredUser } from './data/userData';
import { loadManagedDogs, saveManagedDogs } from './data/ownerApprovalData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { GearScreen } from './components/GearScreen';
import { DogDetailScreen } from './components/DogDetailScreen';
import { FindDogsScreen } from './components/FindDogsScreen';
import { VerifiedBreedersScreen } from './components/VerifiedBreedersScreen';
import { HealthSafetyScreen } from './components/HealthSafetyScreen';
import { RecommendedDogsScreen } from './components/RecommendedDogsScreen';
import { OwnerPortalScreen } from './components/OwnerPortalScreen';
import { VetFinderScreen } from './components/VetFinderScreen';
import { GroomingFinderScreen } from './components/GroomingFinderScreen';
import { ChatDrawer } from './components/ChatDrawer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { PostListingModal } from './components/PostListingModal';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { Toast } from './components/Toast';
import { requestCurrentGPSLocation } from './services/locationService';

export default function App() {
  // Managed dogs state (persisted in localStorage with approval statuses)
  const [dogs, setDogs] = useState<Dog[]>(() => {
    return loadManagedDogs();
  });

  // Check URL parameters or hash on initial load for direct portal access
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (
          params.get('portal') === 'owner' ||
          params.get('owner') === 'true' ||
          window.location.hash === '#owner' ||
          window.location.hash === '#owner-portal'
        ) {
          return 'owner-portal';
        }
      }
    } catch {
      // ignore
    }
    return 'home';
  });

  const [selectedDog, setSelectedDog] = useState<Dog>(() => {
    const initialDogs = loadManagedDogs();
    return initialDogs[0] || DOGS[0];
  });

  // User Profile & Authentication State (persisted in localStorage)
  const [user, setUser] = useState<UserProfile>(loadStoredUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Google Maps Quota defense state
  const [isGmpQuotaExceeded, setIsGmpQuotaExceeded] = useState<boolean>(false);
  useEffect(() => {
    const handleQuota = () => setIsGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: GEAR_PRODUCTS[0], // Tactical Harness
      quantity: 1,
      selectedColor: 'Desert Tan',
      selectedSize: 'Medium (25-45 lbs)'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Wishlist state
  const [favoritedDogIds, setFavoritedDogIds] = useState<string[]>([]);
  const [favoritedGearIds, setFavoritedGearIds] = useState<string[]>(['gear-bed']);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Chat Drawer state
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatDog, setChatDog] = useState<Dog>(DOGS[0]);

  // Managed gear products (persisted in localStorage)
  const [gearProducts, setGearProducts] = useState<GearProduct[]>(() => {
    try {
      const saved = localStorage.getItem('pawpalace_managed_gear');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return GEAR_PRODUCTS;
  });

  // Post Listing Modal state
  const [isPostListingOpen, setIsPostListingOpen] = useState<boolean>(false);
  const [listingTypeToOpen, setListingTypeToOpen] = useState<'dog' | 'gear'>('dog');

  const handleOpenPostListing = (type: 'dog' | 'gear' = 'dog') => {
    setListingTypeToOpen(type);
    setIsPostListingOpen(true);
  };

  const handleAddGearSubmission = (newGear: GearProduct) => {
    const updated = [newGear, ...gearProducts];
    setGearProducts(updated);
    try {
      localStorage.setItem('pawpalace_managed_gear', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Global search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('78701');
  const [searchCategory, setSearchCategory] = useState<string>('all');

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Attempt to acquire device GPS on initial load to make GPS the current location app-wide
  useEffect(() => {
    requestCurrentGPSLocation()
      .then((coords) => {
        if (coords.lat > 32.5) setZipCode('75201'); // Dallas
        else if (coords.lng > -96.2) setZipCode('77002'); // Houston
        else if (coords.lat < 29.6) setZipCode('78205'); // San Antonio
        else setZipCode('78701'); // Austin
      })
      .catch(() => {
        // Silent catch if user has not yet interacted with permissions
      });
  }, []);

  // Auth & Profile handlers
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    saveStoredUser(loggedInUser);
    showToast(`Welcome, ${loggedInUser.name}!`);
    setIsAuthModalOpen(false);
  };

  const handleSaveProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  const handleLogout = () => {
    const loggedOut: UserProfile = { ...user, isLoggedIn: false };
    setUser(loggedOut);
    saveStoredUser(loggedOut);
    showToast('Signed out of your account.');
  };

  // Cart handlers
  const handleAddToCart = (product: GearProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from your bag.');
  };

  // Wishlist handlers
  const handleToggleDogFavorite = (id: string) => {
    setFavoritedDogIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleGearFavorite = (id: string) => {
    setFavoritedGearIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // User & Owner rejected dog IDs (persisted in localStorage)
  const [rejectedDogIds, setRejectedDogIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pawpalace_rejected_dog_ids');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const handleRejectDog = (id: string) => {
    setRejectedDogIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      try {
        localStorage.setItem('pawpalace_rejected_dog_ids', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    // Also update dog's approvalStatus so owner governance and persistence stay synchronized
    setDogs((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, approvalStatus: 'rejected' as const } : d));
      saveManagedDogs(updated);
      return updated;
    });

    const targetDog = dogs.find((d) => d.id === id);
    showToast(`Rejected ${targetDog ? targetDog.name : 'dog'}. It will not appear in Dog of the Day or marketplace.`);
  };

  const handleRestoreDog = (id: string) => {
    setRejectedDogIds((prev) => {
      const next = prev.filter((item) => item !== id);
      try {
        localStorage.setItem('pawpalace_rejected_dog_ids', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    setDogs((prev) => {
      const updated = prev.map((d) =>
        d.id === id
          ? {
              ...d,
              approvalStatus: 'approved' as const,
              photoApprovalStatus: 'approved' as const,
              nameApprovalStatus: 'approved' as const
            }
          : d
      );
      saveManagedDogs(updated);
      return updated;
    });

    const targetDog = dogs.find((d) => d.id === id);
    showToast(`Restored ${targetDog ? targetDog.name : 'dog'} to active listings!`);
  };

  const handleRestoreAllDogs = () => {
    setRejectedDogIds([]);
    try {
      localStorage.removeItem('pawpalace_rejected_dog_ids');
    } catch {
      // ignore
    }

    setDogs((prev) => {
      const updated = prev.map((d) => ({
        ...d,
        approvalStatus: 'approved' as const,
        photoApprovalStatus: 'approved' as const,
        nameApprovalStatus: 'approved' as const
      }));
      saveManagedDogs(updated);
      return updated;
    });

    showToast('Restored all rejected listings. All dogs are now available.');
  };

  // Rejection check helper: either in rejectedDogIds OR rejected in moderation
  const isDogRejected = (d: Dog) =>
    rejectedDogIds.includes(d.id) ||
    d.approvalStatus === 'rejected' ||
    d.photoApprovalStatus === 'rejected' ||
    d.nameApprovalStatus === 'rejected';

  // Public shop dogs: strictly excludes any dog rejected by the owner or user
  const shopDogs = useMemo(() => {
    return dogs.filter((d) => !isDogRejected(d));
  }, [dogs, rejectedDogIds]);

  // Public shop gear: strictly excludes any gear rejected by the owner
  const shopGearProducts = useMemo(() => {
    return gearProducts.filter((g) => g.approvalStatus !== 'rejected');
  }, [gearProducts]);

  // Chat handlers
  const handleOpenChat = (dog: Dog) => {
    if (isDogRejected(dog)) {
      showToast(`Chat is unavailable for "${dog.name}" because this listing was rejected by moderation.`);
      return;
    }
    setChatDog(dog);
    setSelectedDog(dog);
    setIsChatOpen(true);
  };

  // Search trigger
  const handleTriggerSearch = () => {
    if (searchCategory === 'gear') {
      setCurrentScreen('dog-gear');
    } else if (searchCategory === 'vets') {
      setCurrentScreen('vet-finder');
    } else if (searchCategory === 'grooming') {
      setCurrentScreen('grooming-finder');
    } else {
      setCurrentScreen('find-dogs');
    }
    showToast(`Filtering catalog for "${searchQuery || 'All'}" in ${zipCode}...`);
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist count only tallies active, non-rejected items
  const wishlistItemsCount = useMemo(() => {
    const shopDogIds = new Set(shopDogs.map((d) => d.id));
    const shopGearIds = new Set(shopGearProducts.map((g) => g.id));
    const validDogsCount = favoritedDogIds.filter((id) => shopDogIds.has(id)).length;
    const validGearCount = favoritedGearIds.filter((id) => shopGearIds.has(id)).length;
    return validDogsCount + validGearCount;
  }, [favoritedDogIds, favoritedGearIds, shopDogs, shopGearProducts]);

  const handleAddDogSubmission = (newDog: Dog) => {
    const updated = [newDog, ...dogs];
    setDogs(updated);
    saveManagedDogs(updated);
  };

  // Synchronize selected dog with updated state (prefer live shop dog if current was rejected)
  const activeSelectedDog = useMemo(() => {
    const found = dogs.find((d) => d.id === selectedDog.id);
    if (found) return found;
    return shopDogs[0] || dogs[0];
  }, [dogs, selectedDog.id, shopDogs]);

  // Render standalone Owner Web Portal if selected
  if (currentScreen === 'owner-portal') {
    return (
      <div className="min-h-screen bg-[#0a0f18] text-[#e3ecfc]">
        <OwnerPortalScreen
          dogs={dogs}
          onUpdateDogs={(updatedDogs) => {
            setDogs(updatedDogs);
            saveManagedDogs(updatedDogs);
            const refreshed = updatedDogs.find((d) => d.id === selectedDog.id);
            if (refreshed) {
              setSelectedDog(refreshed);
            }
          }}
          gearProducts={gearProducts}
          onUpdateGear={(updatedGear) => {
            setGearProducts(updatedGear);
            try {
              localStorage.setItem('pawpalace_managed_gear', JSON.stringify(updatedGear));
            } catch {}
          }}
          onExitToMarketplace={() => setCurrentScreen('home')}
          onShowToast={showToast}
          onSelectDogPreview={(dog) => {
            setSelectedDog(dog);
            setCurrentScreen('dog-detail');
          }}
          currentUser={user}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#111c2d] selection:bg-[#ffdcc3] selection:text-[#8d4b00]">
      {/* Google Maps Quota Exhaustion Banner */}
      {isGmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm flex items-center justify-between gap-4">
          <span className="flex-1 text-center">
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
          <button 
            onClick={() => setIsGmpQuotaExceeded(false)}
            className="text-amber-800 hover:text-amber-950 font-bold px-2 py-0.5 rounded cursor-pointer"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Navigation Header */}
      <Header
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        selectedDog={activeSelectedDog}
        user={user}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
        onLogout={handleLogout}
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlistItemsCount}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenPostListing={() => handleOpenPostListing('dog')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        zipCode={zipCode}
        setZipCode={setZipCode}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        onTriggerSearch={handleTriggerSearch}
      />

      {/* Main Screen Content */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <HomeScreen
            dogs={shopDogs}
            allDogs={dogs}
            gear={shopGearProducts}
            onSelectDog={(dog) => {
              setSelectedDog(dog);
              setCurrentScreen('dog-detail');
            }}
            onOpenChat={handleOpenChat}
            onAddToCart={handleAddToCart}
            onToggleDogFavorite={handleToggleDogFavorite}
            onToggleGearFavorite={handleToggleGearFavorite}
            favoritedDogIds={favoritedDogIds}
            favoritedGearIds={favoritedGearIds}
            setCurrentScreen={setCurrentScreen}
            onShowToast={showToast}
            onRejectDog={handleRejectDog}
            onRestoreDog={handleRestoreDog}
            onRestoreAllDogs={handleRestoreAllDogs}
            rejectedDogIds={rejectedDogIds}
          />
        )}

        {currentScreen === 'find-dogs' && (
          <FindDogsScreen
            dogs={shopDogs}
            allDogs={dogs}
            onSelectDog={(dog) => {
              setSelectedDog(dog);
              setCurrentScreen('dog-detail');
            }}
            onOpenChat={handleOpenChat}
            onToggleFavorite={handleToggleDogFavorite}
            favoritedDogIds={favoritedDogIds}
            setCurrentScreen={setCurrentScreen}
            onShowToast={showToast}
            initialSearchQuery={searchQuery}
            onOpenPostListing={() => handleOpenPostListing('dog')}
            onRejectDog={handleRejectDog}
            onRestoreDog={handleRestoreDog}
            onRestoreAllDogs={handleRestoreAllDogs}
            rejectedDogIds={rejectedDogIds}
          />
        )}

        {currentScreen === 'dog-gear' && (
          <GearScreen
            products={shopGearProducts}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleGearFavorite}
            favoritedGearIds={favoritedGearIds}
            onShowToast={showToast}
            onOpenPostGearListing={() => handleOpenPostListing('gear')}
          />
        )}

        {currentScreen === 'dog-detail' && (
          <DogDetailScreen
            dog={activeSelectedDog}
            user={user}
            onOpenLogin={() => setIsAuthModalOpen(true)}
            onOpenChat={handleOpenChat}
            onAddToCart={handleAddToCart}
            recommendedGear={shopGearProducts}
            setCurrentScreen={setCurrentScreen}
            onShowToast={showToast}
            onRejectDog={handleRejectDog}
            onRestoreDog={handleRestoreDog}
            rejectedDogIds={rejectedDogIds}
          />
        )}

        {currentScreen === 'recommended-dogs' && (
          <RecommendedDogsScreen
            dogs={shopDogs}
            onSelectDog={(dog) => {
              setSelectedDog(dog);
              setCurrentScreen('dog-detail');
            }}
            onOpenChat={handleOpenChat}
            onToggleFavorite={handleToggleDogFavorite}
            favoritedDogIds={favoritedDogIds}
            setCurrentScreen={setCurrentScreen}
            onShowToast={showToast}
            onRejectDog={handleRejectDog}
          />
        )}

        {currentScreen === 'verified-breeders' && (
          <VerifiedBreedersScreen
            dogs={shopDogs}
            onOpenChat={handleOpenChat}
            onSelectDog={(dog) => {
              setSelectedDog(dog);
              setCurrentScreen('dog-detail');
            }}
            setCurrentScreen={setCurrentScreen}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'health-safety' && (
          <HealthSafetyScreen
            setCurrentScreen={setCurrentScreen}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'vet-finder' && (
          <VetFinderScreen
            onShowToast={showToast}
            currentUser={user}
            initialSearchZip={zipCode}
          />
        )}

        {currentScreen === 'grooming-finder' && (
          <GroomingFinderScreen
            onShowToast={showToast}
            currentUser={user}
          />
        )}
      </main>

      {/* Slide-over Chat Drawer (Screen 3 Image 8) */}
      <ChatDrawer
        dog={chatDog}
        user={user}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onShowToast={showToast}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onShowToast={showToast}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favoritedDogIds={favoritedDogIds}
        favoritedGearIds={favoritedGearIds}
        allDogs={shopDogs}
        allGear={shopGearProducts}
        onToggleDogFavorite={handleToggleDogFavorite}
        onToggleGearFavorite={handleToggleGearFavorite}
        onSelectDog={(dog) => {
          setSelectedDog(dog);
          setCurrentScreen('dog-detail');
        }}
        onAddToCart={handleAddToCart}
        setCurrentScreen={setCurrentScreen}
      />

      {/* Post Listing Modal */}
      <PostListingModal
        isOpen={isPostListingOpen}
        onClose={() => setIsPostListingOpen(false)}
        onShowToast={showToast}
        onAddDog={handleAddDogSubmission}
        onAddGear={handleAddGearSubmission}
        initialListingType={listingTypeToOpen}
      />

      {/* Authentication (Login/Signup) Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={showToast}
      />

      {/* Edit Profile & Avatar Picture Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
        onShowToast={showToast}
      />

      {/* Settings & Language / Dark Mode Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onShowToast={showToast}
      />

      {/* Feedback Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Footer */}
      <Footer 
        setCurrentScreen={setCurrentScreen} 
        onShowToast={showToast}
        onSelectFeaturedDog={() => setSelectedDog(DOGS[0])}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

    </div>
  );
}
