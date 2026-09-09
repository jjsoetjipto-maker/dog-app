import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { Screen, Dog, UserProfile } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedDog: Dog;
  user: UserProfile;
  onOpenLogin: () => void;
  onOpenEditProfile: () => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenPostListing: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  zipCode: string;
  setZipCode: (zip: string) => void;
  searchCategory: string;
  setSearchCategory: (cat: string) => void;
  onTriggerSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  setCurrentScreen,
  selectedDog,
  user,
  onOpenLogin,
  onOpenEditProfile,
  onLogout,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onOpenPostListing,
  searchQuery,
  setSearchQuery,
  zipCode,
  setZipCode,
  searchCategory,
  setSearchCategory,
  onTriggerSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerSearch();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#e7eeff] shadow-[0_2px_12px_rgba(17,28,45,0.04)]">
      {/* Top Banner Notice */}
      <div className="bg-[#111c2d] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px] text-[#ffdcc3]">verified_user</span>
            <span className="font-medium tracking-wide">
              100% OFA & DNA Screened Providers • 10-Year Genetic Health Warranty & Escrow Protection
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/80 text-[11px]">
            <button 
              onClick={() => setCurrentScreen('health-safety')}
              className="hover:text-[#ffdcc3] transition-colors cursor-pointer"
            >
              7-Point Ethical Standard
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentScreen('verified-breeders')}
              className="hover:text-[#ffdcc3] transition-colors cursor-pointer"
            >
              Breeder Verification Directory
            </button>
            <span>•</span>
            <button 
              id="header-owner-portal-btn"
              onClick={() => setCurrentScreen('owner-portal')}
              className="inline-flex items-center gap-1 text-[#ffdcc3] hover:text-white bg-[#8d4b00]/70 hover:bg-[#8d4b00] px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-colors cursor-pointer border border-[#ffcfad]/50 shadow-xs"
              title="Platform Owner Console for Approving Pictures and Names"
            >
              <span className="material-symbols-outlined text-[13px]">shield_person</span>
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            id="brand-logo-btn"
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] border border-[#ffcfad] shadow-xs group-hover:scale-105 group-hover:bg-[#ffcfad] transition-all flex items-center justify-center text-[#8d4b00]">
              <PawPrint className="w-6 h-6 text-[#8d4b00] fill-[#8d4b00]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Epilogue'] font-bold text-xl sm:text-2xl text-[#111c2d] tracking-tight">
                  Paw<span className="text-[#8d4b00]">Palace</span>
                </span>
                <span className="bg-[#ffdcc3] text-[#8d4b00] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-[#554336] font-medium hidden sm:block">
                Ethical Dogs, Puppies & Canine Gear
              </p>
            </div>
          </button>

          {/* Search Bar - Center */}
          <form 
            id="header-search-form"
            onSubmit={handleSearchSubmit} 
            className="hidden lg:flex items-center flex-1 max-w-2xl bg-[#f0f3ff] rounded-full p-1 border border-[#dee8ff] hover:border-[#dbc2b0] focus-within:border-[#8d4b00] focus-within:ring-2 focus-within:ring-[#ffdcc3] transition-all"
          >
            {/* Category select */}
            <div className="relative border-r border-[#dee8ff] pr-1">
              <select
                id="header-category-select"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-semibold text-[#111c2d] cursor-pointer focus:outline-none"
              >
                <option value="all">All Catalog</option>
                <option value="dogs">Dogs & Puppies</option>
                <option value="gear">Pet Gear & Equipment</option>
                <option value="rescues">Rescue Shelters</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-base text-[#887364] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Keyword Input */}
            <div className="relative flex-1 flex items-center pl-3">
              <span className="material-symbols-outlined text-lg text-[#887364] mr-2">
                search
              </span>
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search breed, 'Golden Retriever', or 'Orthopedic Bed'..."
                className="w-full bg-transparent text-xs text-[#111c2d] placeholder-[#887364] focus:outline-none"
              />
            </div>

            {/* Zip code input */}
            <div className="flex items-center border-l border-[#dee8ff] px-3 py-1">
              <span className="material-symbols-outlined text-base text-[#887364] mr-1">
                location_on
              </span>
              <input
                id="header-zip-input"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Zip e.g. 78701"
                className="w-24 bg-transparent text-xs text-[#111c2d] placeholder-[#887364] focus:outline-none"
              />
            </div>

            {/* Search Submit button */}
            <button
              id="header-search-submit-btn"
              type="submit"
              className="bg-[#8d4b00] hover:bg-[#b15f00] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Post Listing / Become Breeder Button */}
            <button
              id="header-post-listing-btn"
              onClick={onOpenPostListing}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4b00] bg-[#ffdcc3] hover:bg-[#ffb77d] px-3.5 py-2 rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Post Listing</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 text-[#554336] hover:text-[#8d4b00] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
              title="Saved Favorites"
            >
              <span className="material-symbols-outlined text-xl">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#8d4b00] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 text-[#554336] hover:text-[#8d4b00] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
              title="Shopping Bag"
            >
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#006c4a] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar with dropdown or Login button */}
            {user.isLoggedIn ? (
              <div className="relative">
                <button
                  id="header-user-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-[#f0f3ff] transition-all cursor-pointer border border-[#dee8ff]"
                  title="Account Menu"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#ffdcc3]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden xl:inline text-xs font-bold text-[#111c2d] max-w-[110px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="material-symbols-outlined text-xs text-[#887364]">
                    expand_more
                  </span>
                </button>

                {profileOpen && (
                  <div 
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e7eeff] p-2 text-xs z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="p-3 border-b border-[#f0f3ff] flex items-center gap-3">
                      <div 
                        className="relative group cursor-pointer"
                        onClick={() => { onOpenEditProfile(); setProfileOpen(false); }}
                        title="Click to choose a photo from your device"
                      >
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#ffdcc3] shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-xs">photo_camera</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#111c2d] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#887364] truncate">{user.location} • {user.role}</p>
                        <button
                          type="button"
                          onClick={() => { onOpenEditProfile(); setProfileOpen(false); }}
                          className="text-[10px] font-bold text-[#8d4b00] hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">photo_library</span>
                          <span>Upload from your photos</span>
                        </button>
                      </div>
                    </div>

                    <div className="py-1.5 space-y-0.5">
                      <button 
                        id="edit-profile-menu-btn"
                        onClick={() => { onOpenEditProfile(); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 bg-[#ffdcc3]/30 hover:bg-[#ffdcc3]/60 rounded-xl text-[#8d4b00] font-bold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">photo_camera</span>
                        <span>Change Photo & Profile Details</span>
                      </button>
                      <button 
                        onClick={() => { setCurrentScreen('find-dogs'); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-[#f0f3ff] rounded-xl text-[#554336] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">pets</span>
                        <span>My Inquiries & Applications</span>
                      </button>
                      <button 
                        onClick={() => { onOpenCart(); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-[#f0f3ff] rounded-xl text-[#554336] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">local_shipping</span>
                        <span>Orders & Escrow Status</span>
                      </button>
                      <button 
                        onClick={() => { setCurrentScreen('health-safety'); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-[#f0f3ff] rounded-xl text-[#554336] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">verified_user</span>
                        <span>DNA & Health Vault</span>
                      </button>

                      <div className="border-t border-[#f0f3ff] my-1"></div>

                      <button 
                        id="dropdown-owner-portal-btn"
                        onClick={() => { setCurrentScreen('owner-portal'); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 bg-[#ffdcc3]/30 hover:bg-[#ffdcc3]/70 rounded-xl text-[#8d4b00] flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <span className="material-symbols-outlined text-base text-[#8d4b00]">shield_person</span>
                        <span>Owner Portal (Approvals)</span>
                      </button>
                    </div>

                    <div className="border-t border-[#f0f3ff] pt-1">
                      <button 
                        id="header-logout-btn"
                        onClick={() => { onLogout(); setProfileOpen(false); }}
                        className="w-full text-left px-3 py-2 text-[#a33900] hover:bg-[#ffdad6]/40 rounded-xl flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>Log In / Sign Up</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              id="header-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#554336] hover:bg-[#f0f3ff] rounded-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="mt-3 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#f0f3ff] rounded-xl p-1 border border-[#dee8ff]">
            <span className="material-symbols-outlined text-lg text-[#887364] ml-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dogs, gear, breeders..."
              className="w-full px-2 py-1.5 text-xs bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#8d4b00] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Find
            </button>
          </form>
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <nav className="bg-[#f0f3ff]/80 border-t border-[#e7eeff] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-1 sm:gap-2">
            
            <button
              id="nav-tab-home"
              onClick={() => setCurrentScreen('home')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'home'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </button>

            <button
              id="nav-tab-find-dogs"
              onClick={() => setCurrentScreen('find-dogs')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'find-dogs'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">pets</span>
              <span>Find Dogs</span>
              <span className="bg-[#ffdcc3] text-[#8d4b00] text-[10px] px-1 rounded-full font-bold">
                10 Available
              </span>
            </button>

            <button
              id="nav-tab-gear"
              onClick={() => setCurrentScreen('dog-gear')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'dog-gear'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
              <span>Dog Equipment & Gear</span>
              <span className="bg-[#82f5c1] text-[#006c4a] text-[10px] px-1 rounded-full font-bold">
                Vet Vetted
              </span>
            </button>

            <button
              id="nav-tab-dog-detail"
              onClick={() => setCurrentScreen('dog-detail')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'dog-detail'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">stars</span>
              <span>{selectedDog ? `${selectedDog.name} (${selectedDog.breed})` : 'Pup Profile'}</span>
            </button>

            <button
              id="nav-tab-breeders"
              onClick={() => setCurrentScreen('verified-breeders')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'verified-breeders'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Verified Breeders</span>
            </button>

            <button
              id="nav-tab-health-safety"
              onClick={() => setCurrentScreen('health-safety')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'health-safety'
                  ? 'bg-[#8d4b00] text-white shadow-sm'
                  : 'text-[#554336] hover:bg-[#dee8ff]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">shield_with_heart</span>
              <span>7-Point Ethical Pledge</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-[#554336]">
            <span className="flex items-center gap-1 text-[#006c4a] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#006c4a] inline-block animate-ping"></span>
              Escrow Protection Active
            </span>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#dee8ff] py-3 space-y-1">
            <button
              onClick={() => { setCurrentScreen('home'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentScreen('find-dogs'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              Find Dogs & Puppies
            </button>
            <button
              onClick={() => { setCurrentScreen('dog-gear'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              Dog Equipment & Gear
            </button>
            <button
              onClick={() => { setCurrentScreen('dog-detail'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg flex items-center justify-between"
            >
              <span>{selectedDog ? `${selectedDog.name}'s Profile` : 'Pup Profile'}</span>
              <span className="text-[10px] text-[#8d4b00] font-semibold">{selectedDog?.breed}</span>
            </button>
            <button
              onClick={() => { setCurrentScreen('verified-breeders'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              Verified Breeders
            </button>
            <button
              onClick={() => { setCurrentScreen('health-safety'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#111c2d] hover:bg-[#e7eeff] rounded-lg"
            >
              7-Point Health & Ethical Pledge
            </button>
            <button
              id="mobile-owner-portal-btn"
              onClick={() => { setCurrentScreen('owner-portal'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#8d4b00] bg-[#ffdcc3]/40 hover:bg-[#ffdcc3]/70 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">shield_person</span>
                <span>Owner Portal (Approvals)</span>
              </span>
              <span className="text-[10px] uppercase font-bold bg-[#8d4b00] text-white px-1.5 py-0.5 rounded">Owner</span>
            </button>
            {/* User status in mobile menu */}
            <div className="pt-2 border-t border-[#dee8ff]">
              {user.isLoggedIn ? (
                <div className="bg-[#f0f3ff] p-3 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#ffdcc3]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#111c2d] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#887364] truncate">{user.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { onOpenEditProfile(); setMobileMenuOpen(false); }}
                    className="w-full text-center py-2 bg-white hover:bg-[#ffdcc3]/30 text-[#8d4b00] rounded-xl text-xs font-bold border border-[#ffdcc3] flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    <span>Change Photo & Profile</span>
                  </button>
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="w-full text-center py-1.5 text-[#a33900] text-xs font-semibold hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                  className="w-full bg-[#8d4b00] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span>Log In / Sign Up</span>
                </button>
              )}
            </div>

            <div className="pt-1">
              <button
                onClick={() => { onOpenPostListing(); setMobileMenuOpen(false); }}
                className="w-full bg-[#111c2d] text-white py-2 rounded-xl text-xs font-bold"
              >
                + Post Ethical Listing
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
