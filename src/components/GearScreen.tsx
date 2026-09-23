import React, { useState, useMemo } from 'react';
import { GearProduct } from '../types';
import { TESTIMONIALS } from '../data/mockData';
import { useSettings } from '../context/SettingsContext';

interface GearScreenProps {
  products: GearProduct[];
  onAddToCart: (product: GearProduct) => void;
  onToggleFavorite: (id: string) => void;
  favoritedGearIds: string[];
  onShowToast: (msg: string) => void;
  onOpenPostGearListing?: () => void;
}

export const GearScreen: React.FC<GearScreenProps> = ({
  products,
  onAddToCart,
  onToggleFavorite,
  favoritedGearIds,
  onShowToast,
  onOpenPostGearListing
}) => {
  const { t, formatPrice } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = [
    { id: 'all', label: t.allGearTab, icon: 'apps' },
    { id: 'nutrition', label: 'Dog Food & Nutrition', icon: 'restaurant' },
    { id: 'beds', label: t.bedsTab, icon: 'bed' },
    { id: 'harnesses', label: t.harnessesTab, icon: 'hiking' },
    { id: 'crates', label: t.travelTab, icon: 'luggage' },
    { id: 'collars', label: 'GPS Smart Collars', icon: 'radar' },
    { id: 'starter-kits', label: 'Starter Kits & Bundles', icon: 'package_2' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Rejection safeguard: Exclude any equipment rejected by owner from the shop
      if (p.approvalStatus === 'rejected') return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (p.price > maxPrice) return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (selectedBrand !== 'all' && !p.brand.toLowerCase().includes(selectedBrand.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [products, selectedCategory, maxPrice, minRating, selectedBrand, sortBy]);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Top Banner Ribbon */}
      <div className="bg-[#006c4a] text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm">verified_user</span>
        <span>Veterinarian-Approved Dog Necessities: Rigorously field-tested for orthopedic ergonomics, impact safety, and behavioral well-being.</span>
      </div>

      {/* Editorial Header Stage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#111c2d] to-[#263143] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#82f5c1]/20 border border-[#82f5c1]/40 text-[#82f5c1] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">health_and_safety</span>
              <span>{t.gearBadge}</span>
            </div>
            <h1 className="font-['Epilogue'] font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
              {t.gearTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#dee8ff]/80 leading-relaxed">
              {t.gearSubtitle}
            </p>

            {onOpenPostGearListing && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenPostGearListing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ffdcc3] hover:bg-[#ffe3ce] text-[#8d4b00] rounded-2xl font-bold text-xs shadow-lg transition-all cursor-pointer hover:scale-102"
                >
                  <span className="material-symbols-outlined text-lg">photo_camera</span>
                  <span>List Dog Necessity / Product (Take Live Photo)</span>
                </button>
              </div>
            )}
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-white hidden md:block">
            <span className="material-symbols-outlined text-[280px]">pets</span>
          </div>
        </div>
      </section>

      {/* Visual Category Snapping Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#8d4b00] text-white border-[#8d4b00] shadow-sm scale-102'
                  : 'bg-white text-[#554336] border-[#dee8ff] hover:border-[#dbc2b0] hover:bg-[#f0f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Two-Column Layout (Filters + Product Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-[#dee8ff] shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#e7eeff]">
                <h3 className="font-bold text-sm text-[#111c2d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#8d4b00]">tune</span>
                  <span>Filter Dog Necessities</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSize('all');
                    setMaxPrice(200);
                    setSelectedBrand('all');
                    setMinRating(0);
                  }}
                  className="text-[11px] text-[#8d4b00] font-bold hover:underline cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Companion Size Pill Buttons */}
              <div>
                <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-2">
                  Companion Size / Weight
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'Small (<25 lbs)', 'Medium (25-55 lbs)', 'Large (55-85 lbs)', 'Giant (85+ lbs)'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size === selectedSize ? 'all' : size)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#ffdcc3] text-[#8d4b00] border-[#8d4b00]'
                          : 'bg-[#f0f3ff] text-[#554336] border-[#dee8ff] hover:bg-[#dee8ff]'
                      }`}
                    >
                      {size === 'all' ? 'All Sizes' : size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="font-bold text-[#887364] uppercase text-[11px] tracking-wider">Max Price</span>
                  <span className="font-bold text-[#8d4b00]">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="200"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#8d4b00] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#887364] mt-1">
                  <span>$25</span>
                  <span>$100</span>
                  <span>$200+</span>
                </div>
              </div>

              {/* Verified Brands */}
              <div>
                <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-2">
                  Certified Brands
                </label>
                <div className="space-y-1.5 text-xs text-[#554336]">
                  {[
                    { id: 'all', name: 'All Certified Brands' },
                    { id: 'CanineVitality', name: 'CanineVitality Whole Prey' },
                    { id: 'OceanK9', name: 'OceanK9 Coastal Labs' },
                    { id: 'PureHeritage', name: 'PureHeritage Kitchen' },
                    { id: 'GastroCare', name: 'GastroCare Veterinary Line' },
                    { id: 'PawPalace', name: 'PawPalace Pro / K9 Elite' },
                    { id: 'CanineRest', name: 'CanineRest Orthopedics' },
                    { id: 'Voyager', name: 'K9 Voyager Safe' },
                    { id: 'HaloGuard', name: 'HaloGuard Smart Tech' },
                    { id: 'NurturePup', name: 'NurturePup Organics' }
                  ].map((brand) => (
                    <label key={brand.id} className="flex items-center gap-2 cursor-pointer hover:text-[#111c2d]">
                      <input
                        type="radio"
                        name="brandFilter"
                        checked={selectedBrand === brand.id}
                        onChange={() => setSelectedBrand(brand.id)}
                        className="text-[#8d4b00] focus:ring-[#ffdcc3]"
                      />
                      <span>{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-2">
                  Minimum Rating
                </label>
                <div className="space-y-1.5 text-xs text-[#554336]">
                  {[
                    { value: 0, label: 'Any Rating' },
                    { value: 4.8, label: '4.8 ★ & Above (Top Rated)' },
                    { value: 4.5, label: '4.5 ★ & Above' }
                  ].map((r) => (
                    <label key={r.value} className="flex items-center gap-2 cursor-pointer hover:text-[#111c2d]">
                      <input
                        type="radio"
                        name="ratingFilter"
                        checked={minRating === r.value}
                        onChange={() => setMinRating(r.value)}
                        className="text-[#8d4b00] focus:ring-[#ffdcc3]"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Vet Safety Tip Card in Sidebar */}
              <div className="p-4 rounded-2xl bg-[#f0f3ff] border border-[#dee8ff]">
                <div className="flex items-center gap-1.5 text-[#006c4a] font-bold text-xs mb-1">
                  <span className="material-symbols-outlined text-sm">lightbulb</span>
                  <span>Vet Safety Tip</span>
                </div>
                <p className="text-[11px] text-[#554336] leading-relaxed">
                  <strong>Why No-Pull Harnesses Matter:</strong> Traditional neck collars can cause tracheal collapse and cervical vertebra trauma during sudden pulls. Front-clip harnesses redirect momentum safely across the skeletal chest plate.
                </p>
              </div>

            </div>
          </div>

          {/* Right Product Showcase Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#dee8ff]">
              <div>
                <p className="text-xs text-[#554336]">
                  Showing <strong className="text-[#111c2d]">{filteredProducts.length}</strong> veterinarian-verified products
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {onOpenPostGearListing && (
                  <button
                    type="button"
                    onClick={onOpenPostGearListing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">photo_camera</span>
                    <span>List Dog Necessity with Photo</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  <span className="text-[#887364]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#f0f3ff] border border-[#dee8ff] rounded-xl px-3 py-1.5 font-bold text-[#111c2d] focus:outline-none focus:border-[#8d4b00] cursor-pointer"
                  >
                    <option value="featured">Featured Essentials</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isFavorited = favoritedGearIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#dee8ff] hover:border-[#dbc2b0] transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col group"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-[#f0f3ff]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {product.tag && (
                        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs ${product.tagColor}`}>
                          {product.tag}
                        </span>
                      )}

                      <button
                        onClick={() => {
                          onToggleFavorite(product.id);
                          onShowToast(isFavorited ? 'Removed from wishlist' : `Saved ${product.name} to wishlist!`);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#887364] hover:text-[#ba1a1a] transition-colors cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-base">
                          {isFavorited ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>

                      {/* Stock Badge Overlay */}
                      <div className="absolute bottom-3 left-3 bg-[#111c2d]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-xl">
                        {product.inStockBadge}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#006c4a] uppercase tracking-wider block">
                          {product.subBadge}
                        </span>
                        <h3 className="font-bold text-xs text-[#111c2d] group-hover:text-[#8d4b00] transition-colors line-clamp-2 mt-1">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-[#887364] mt-0.5">{product.brand}</p>

                        <p className="text-xs text-[#554336] line-clamp-2 mt-2 leading-relaxed">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs text-[#8d4b00] mt-2 font-bold">
                          <span className="material-symbols-outlined text-xs text-[#b15f00]">star</span>
                          <span>{product.rating}</span>
                          <span className="text-[11px] text-[#887364] font-normal">({product.reviewsCount} reviews)</span>
                        </div>

                        {/* Price Display */}
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="font-bold text-base text-[#111c2d]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-[#887364] line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Bag Button */}
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onShowToast(`Added ${product.name} to your bag!`);
                          }}
                          className="w-full bg-[#111c2d] hover:bg-[#8d4b00] text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-sm">shopping_bag</span>
                          <span>{t.addToBagBtn}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 3 Guarantees Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdcc3] text-[#8d4b00] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">autorenew</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#111c2d]">30-Day Canine Comfort Trial</h4>
              <p className="text-xs text-[#554336] mt-1">If your pup doesn't experience deeper rest or better walks, return or exchange hassle-free.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#82f5c1] text-[#006c4a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#111c2d]">Impact-Rated Hardware</h4>
              <p className="text-xs text-[#554336] mt-1">Military alloy zinc buckles and reinforced box-stitching withstand up to 450 lbs of pull force.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f0f3ff] text-[#263143] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">eco</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#111c2d]">Non-Toxic Organic Cert</h4>
              <p className="text-xs text-[#554336] mt-1">Free of endocrine disruptors, phthalates, BPA, and heavy metals. Pure chew safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4b00] uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-base">reviews</span>
            <span>Verified Guardian Experiences</span>
          </div>
          <h2 className="font-['Epilogue'] font-bold text-2xl sm:text-3xl text-[#111c2d]">
            Trusted by Veterinarians & Discerning Guardians
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="p-6 rounded-3xl bg-white border border-[#dee8ff] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#b15f00] mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">star</span>
                  ))}
                </div>
                <h4 className="font-bold text-sm text-[#111c2d] mb-2">"{t.quote}"</h4>
                <p className="text-xs text-[#554336] leading-relaxed">{t.content}</p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#f0f3ff]">
                <div className="w-8 h-8 rounded-full bg-[#ffdcc3] text-[#8d4b00] font-bold text-xs flex items-center justify-center">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-xs text-[#111c2d]">{t.author}</p>
                  <p className="text-[11px] text-[#887364]">{t.authorRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
