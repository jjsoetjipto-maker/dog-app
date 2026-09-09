import React from 'react';
import { Dog, GearProduct, Screen } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoritedDogIds: string[];
  favoritedGearIds: string[];
  allDogs: Dog[];
  allGear: GearProduct[];
  onToggleDogFavorite: (id: string) => void;
  onToggleGearFavorite: (id: string) => void;
  onSelectDog: (dog: Dog) => void;
  onAddToCart: (product: GearProduct) => void;
  setCurrentScreen: (screen: Screen) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  favoritedDogIds,
  favoritedGearIds,
  allDogs,
  allGear,
  onToggleDogFavorite,
  onToggleGearFavorite,
  onSelectDog,
  onAddToCart,
  setCurrentScreen
}) => {
  if (!isOpen) return null;

  const favoriteDogs = allDogs.filter((d) => favoritedDogIds.includes(d.id));
  const favoriteGear = allGear.filter((g) => favoritedGearIds.includes(g.id));
  const totalFavorites = favoriteDogs.length + favoriteGear.length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div 
        id="wishlist-drawer-container"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e7eeff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8d4b00] text-2xl">favorite</span>
            <h3 className="font-bold text-base text-[#111c2d]">
              Saved Wishlist ({totalFavorites})
            </h3>
          </div>
          <button
            id="wishlist-drawer-close-btn"
            onClick={onClose}
            className="p-1.5 text-[#887364] hover:text-[#111c2d] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {totalFavorites === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-[#f0f3ff] rounded-full flex items-center justify-center mx-auto mb-3 text-[#887364]">
                <span className="material-symbols-outlined text-3xl">favorite_border</span>
              </div>
              <h4 className="font-bold text-[#111c2d] text-sm">No favorites saved yet</h4>
              <p className="text-xs text-[#887364] mt-1 max-w-xs mx-auto">
                Click the heart icon on any puppy, rescue dog, or piece of canine gear to save it to your wishlist.
              </p>
            </div>
          ) : (
            <>
              {/* Dogs section */}
              {favoriteDogs.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs text-[#887364] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#8d4b00]">pets</span>
                    <span>Saved Companions ({favoriteDogs.length})</span>
                  </h4>
                  <div className="space-y-3">
                    {favoriteDogs.map((dog) => (
                      <div
                        key={dog.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[#dee8ff] bg-[#f9f9ff] hover:border-[#8d4b00] transition-colors"
                      >
                        <img
                          src={dog.image}
                          alt={dog.name}
                          className="w-16 h-16 rounded-xl object-cover border border-[#dee8ff] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h5 className="font-bold text-xs text-[#111c2d]">{dog.name}</h5>
                            <button
                              onClick={() => onToggleDogFavorite(dog.id)}
                              className="text-[#8d4b00] hover:text-[#554336] p-0.5 cursor-pointer"
                              title="Remove from favorites"
                            >
                              <span className="material-symbols-outlined text-base">favorite</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-[#554336]">{dog.breed} • {dog.ageText}</p>
                          <p className="text-[11px] font-bold text-[#8d4b00] mt-1">
                            ${dog.price.toLocaleString()}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => {
                                onSelectDog(dog);
                                setCurrentScreen('dog-detail');
                                onClose();
                              }}
                              className="text-[11px] bg-[#8d4b00] text-white px-3 py-1 rounded-full font-bold hover:bg-[#b15f00] transition-colors cursor-pointer"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gear section */}
              {favoriteGear.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs text-[#887364] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#006c4a]">fitness_center</span>
                    <span>Saved Gear & Equipment ({favoriteGear.length})</span>
                  </h4>
                  <div className="space-y-3">
                    {favoriteGear.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[#dee8ff] bg-[#f9f9ff] hover:border-[#006c4a] transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-[#dee8ff] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h5 className="font-bold text-xs text-[#111c2d] line-clamp-1">{product.name}</h5>
                            <button
                              onClick={() => onToggleGearFavorite(product.id)}
                              className="text-[#8d4b00] hover:text-[#554336] p-0.5 cursor-pointer"
                              title="Remove from favorites"
                            >
                              <span className="material-symbols-outlined text-base">favorite</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-[#554336]">{product.brand}</p>
                          <p className="text-[11px] font-bold text-[#8d4b00] mt-1">
                            ${product.price.toFixed(2)}
                          </p>
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                onAddToCart(product);
                              }}
                              className="text-[11px] bg-[#006c4a] text-white px-3 py-1 rounded-full font-bold hover:bg-[#005137] transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                              <span>Add to Bag</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
