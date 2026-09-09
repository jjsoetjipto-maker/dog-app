import React, { useState, useEffect } from 'react';
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
import { OwnerPortalScreen } from './components/OwnerPortalScreen';
import { ChatDrawer } from './components/ChatDrawer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { PostListingModal } from './components/PostListingModal';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { Toast } from './components/Toast';

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

  // Post Listing Modal state
  const [isPostListingOpen, setIsPostListingOpen] = useState<boolean>(false);

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

  // Chat handlers
  const handleOpenChat = (dog: Dog) => {
    setChatDog(dog);
    setSelectedDog(dog);
    setIsChatOpen(true);
  };

  // Search trigger
  const handleTriggerSearch = () => {
    if (searchCategory === 'gear') {
      setCurrentScreen('dog-gear');
    } else {
      setCurrentScreen('find-dogs');
    }
    showToast(`Filtering catalog for "${searchQuery || 'All'}" in ${zipCode}...`);
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemsCount = favoritedDogIds.length + favoritedGearIds.length;

  const handleAddDogSubmission = (newDog: Dog) => {
    const updated = [newDog, ...dogs];
    setDogs(updated);
    saveManagedDogs(updated);
  };

  // Synchronize selected dog with updated state
  const activeSelectedDog = dogs.find((d) => d.id === selectedDog.id) || selectedDog;

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
        onOpenPostListing={() => setIsPostListingOpen(true)}
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
            dogs={dogs}
            gear={GEAR_PRODUCTS}
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
          />
        )}

        {currentScreen === 'find-dogs' && (
          <FindDogsScreen
            dogs={dogs}
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
          />
        )}

        {currentScreen === 'dog-gear' && (
          <GearScreen
            products={GEAR_PRODUCTS}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleGearFavorite}
            favoritedGearIds={favoritedGearIds}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'dog-detail' && (
          <DogDetailScreen
            dog={activeSelectedDog}
            user={user}
            onOpenLogin={() => setIsAuthModalOpen(true)}
            onOpenChat={handleOpenChat}
            onAddToCart={handleAddToCart}
            recommendedGear={GEAR_PRODUCTS}
            setCurrentScreen={setCurrentScreen}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'verified-breeders' && (
          <VerifiedBreedersScreen
            dogs={dogs}
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
        allDogs={dogs}
        allGear={GEAR_PRODUCTS}
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

      {/* Feedback Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Footer */}
      <Footer 
        setCurrentScreen={setCurrentScreen} 
        onShowToast={showToast}
        onSelectFeaturedDog={() => setSelectedDog(DOGS[0])}
      />

    </div>
  );
}
