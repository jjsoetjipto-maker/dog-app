import React, { useState, useRef, useEffect } from 'react';
import { Dog, GearProduct } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onAddDog?: (dog: Dog) => void;
  onAddGear?: (gear: GearProduct) => void;
  initialListingType?: 'dog' | 'gear';
}

export const PostListingModal: React.FC<PostListingModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onAddDog,
  onAddGear,
  initialListingType = 'dog'
}) => {
  const [listingType, setListingType] = useState<'dog' | 'gear'>(initialListingType);
  const [title, setTitle] = useState('');
  const [breedOrCategory, setBreedOrCategory] = useState('');
  const [gearCategory, setGearCategory] = useState<GearProduct['category']>('beds');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [kennelName, setKennelName] = useState('');
  const [ofaNumber, setOfaNumber] = useState('');
  const [description, setDescription] = useState('');
  const [ethicalConsent, setEthicalConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Photo Capture State
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoSource, setPhotoSource] = useState<'camera' | 'upload' | 'sample' | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync initialListingType whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setListingType(initialListingType);
    }
  }, [isOpen, initialListingType]);

  // Reset or set default sample if empty when switching type
  useEffect(() => {
    if (!photoUrl) {
      // Set a pleasant placeholder sample
      if (listingType === 'dog') {
        setPhotoUrl('https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&q=80');
        setPhotoSource('sample');
      } else {
        setPhotoUrl('https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80');
        setPhotoSource('sample');
      }
    }
  }, [listingType]);

  if (!isOpen) return null;

  const handlePhotoCaptured = (capturedDataUrl: string) => {
    setPhotoUrl(capturedDataUrl);
    setPhotoSource('camera');
    onShowToast(`Photo captured with camera! Added to ${listingType === 'dog' ? 'companion' : 'equipment'} listing.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        setPhotoSource('upload');
        onShowToast('Photo uploaded successfully from your device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !kennelName) {
      onShowToast('Please fill out all required fields.');
      return;
    }
    if (!ethicalConsent) {
      onShowToast('You must consent to the PawPalace Zero-Tolerance Ethical Inspection protocol.');
      return;
    }

    const finalPhoto = photoUrl || (listingType === 'dog'
      ? 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80');

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      if (listingType === 'dog' && onAddDog) {
        const newDog: Dog = {
          id: `dog-user-${Date.now()}`,
          name: title.trim(),
          breed: breedOrCategory || 'Golden Retriever',
          category: 'puppy',
          price: parseInt(price) || 1800,
          location: location || 'Austin, TX',
          ageText: '9 Weeks Old',
          gender: 'Male',
          color: 'Standard Pedigree',
          image: finalPhoto,
          gallery: [
            finalPhoto,
            'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&q=80'
          ],
          breederName: kennelName,
          breederBadge: 'Tier-1 Certified Breeder',
          breederInitials: kennelName.slice(0, 2).toUpperCase(),
          breederRating: 5.0,
          breederReviewsCount: 1,
          badges: ['DNA Verified', 'OFA Screened', 'Microchipped', photoSource === 'camera' ? 'Live Camera Verified' : 'Photo Documented'],
          verifiedStatus: 'Pending Owner Review',
          summary: description || `Newly submitted companion listing for ${title}. Camera photo attached. Awaiting verification by platform team.`,
          approvalStatus: 'pending',
          nameApprovalStatus: 'pending',
          photoApprovalStatus: 'pending',
          nameNotes: 'Awaiting Owner name verification.',
          photoNotes: photoSource === 'camera' ? 'Live camera photo captured by lister.' : 'Photo uploaded by lister.',
          submittedAt: 'Just now'
        };
        onAddDog(newDog);
        onShowToast(`Listing for ${newDog.name} with camera photo submitted for review!`);
      } else if (listingType === 'gear' && onAddGear) {
        const newGear: GearProduct = {
          id: `gear-user-${Date.now()}`,
          name: title.trim(),
          brand: kennelName.trim() || 'PawPalace Certified',
          price: parseInt(price) || 85,
          rating: 5.0,
          reviewsCount: 1,
          image: finalPhoto,
          category: gearCategory,
          tag: photoSource === 'camera' ? 'Camera Verified' : 'Community Listed',
          tagColor: 'bg-[#ffdcc3] text-[#8d4b00]',
          inStockBadge: 'In Stock',
          description: description || `Verified high-grade canine equipment: ${title.trim()}. Inspected for durability and safety compliance.`,
          specs: ['Orthopedic safe', 'Non-toxic materials', 'Verified by PawPalace Specialist'],
          colors: ['Slate Grey', 'Espresso', 'Hunter Green'],
          sizes: ['Small (15-25 lbs)', 'Medium (25-50 lbs)', 'Large (50-85 lbs)']
        };
        onAddGear(newGear);
        onShowToast(`Dog necessity listing for "${newGear.name}" with photo added to catalog!`);
      }

      onClose();
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div 
          id="post-listing-modal"
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#dee8ff] animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#111c2d] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ffdcc3] text-2xl">
                {listingType === 'dog' ? 'pets' : 'fitness_center'}
              </span>
              <div>
                <h3 className="font-['Epilogue'] font-bold text-base">
                  {listingType === 'dog' ? 'List a Companion Dog or Puppy' : 'List Dog Necessity / Product'}
                </h3>
                <p className="text-xs text-[#dee8ff]/80">
                  {listingType === 'dog'
                    ? 'Tier-1 Certified Breeder & Shelter Placement Standard'
                    : 'Verified Safe Dog Necessities & Ergonomic Care Standard'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
            
            {/* Listing Type Toggle */}
            <div>
              <label className="block font-bold text-[#111c2d] mb-1.5">What are you listing?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setListingType('dog')}
                  className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    listingType === 'dog'
                      ? 'bg-[#ffdcc3] text-[#8d4b00] border-[#8d4b00] shadow-xs'
                      : 'bg-[#f0f3ff] text-[#554336] border-[#dee8ff] hover:border-[#8d4b00]/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">pets</span>
                  <span>Dog / Puppy / Rescue</span>
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('gear')}
                  className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    listingType === 'gear'
                      ? 'bg-[#82f5c1] text-[#006c4a] border-[#006c4a] shadow-xs'
                      : 'bg-[#f0f3ff] text-[#554336] border-[#dee8ff] hover:border-[#006c4a]/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">fitness_center</span>
                  <span>Dog Necessities / Product</span>
                </button>
              </div>
            </div>

            {/* CAMERA & PHOTO SECTION */}
            <div className="p-4 bg-[#f8faff] rounded-2xl border border-[#dee8ff] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-sm text-[#111c2d] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#8d4b00]">photo_camera</span>
                    <span>
                      {listingType === 'dog' ? 'Dog Photo (Camera or Upload) *' : 'Necessity Photo (Camera or Upload) *'}
                    </span>
                  </label>
                  <p className="text-[11px] text-[#554336] mt-0.5">
                    {listingType === 'dog'
                      ? 'Take a live photo of your dog or litter for ethical verification.'
                      : 'Take a clear photo of the necessity item showing its authenticity and condition.'}
                  </p>
                </div>

                {photoSource && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    photoSource === 'camera'
                      ? 'bg-emerald-100 text-[#006c4a] border border-emerald-300'
                      : 'bg-[#ffdcc3] text-[#8d4b00]'
                  }`}>
                    <span className="material-symbols-outlined text-xs">
                      {photoSource === 'camera' ? 'photo_camera' : 'upload_file'}
                    </span>
                    <span>{photoSource === 'camera' ? 'Camera Captured' : 'Image Attached'}</span>
                  </span>
                )}
              </div>

              {/* Photo Preview & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-1">
                {/* Image Thumbnail Box */}
                <div className="relative w-32 h-28 sm:w-36 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#dee8ff] bg-[#111c2d] shrink-0 shadow-inner group">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Listing Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#8898b3] p-2 text-center">
                      <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                      <span className="text-[10px] mt-1">No photo yet</span>
                    </div>
                  )}

                  {photoSource === 'camera' && (
                    <div className="absolute top-1 left-1 bg-black/70 text-[#82f5c1] text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>LIVE CAM</span>
                    </div>
                  )}
                </div>

                {/* Primary Photo Action Triggers */}
                <div className="flex-1 w-full space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Take Photo With Camera Button */}
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="py-2.5 px-3 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow"
                    >
                      <span className="material-symbols-outlined text-base">photo_camera</span>
                      <span>Take Photo (Camera)</span>
                    </button>

                    {/* Upload from Files Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2.5 px-3 bg-white hover:bg-[#f0f3ff] text-[#111c2d] border border-[#dee8ff] rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-[#8d4b00]/40"
                    >
                      <span className="material-symbols-outlined text-base text-[#554336]">upload_file</span>
                      <span>Upload File</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-[#887364]">
                    Tip: Click <strong>&quot;Take Photo (Camera)&quot;</strong> to activate your webcam or phone camera.
                  </p>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Name / Title */}
            <div>
              <label className="block font-bold text-[#111c2d] mb-1">
                {listingType === 'dog' ? 'Companion / Litter Name *' : 'Equipment Title / Model *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={listingType === 'dog' ? 'e.g., Archie or Litter of 5 Golden Retrievers' : 'e.g., Deluxe Orthopedic Memory Foam Bed'}
                className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
              />
            </div>

            {/* Breed / Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#111c2d] mb-1">
                  {listingType === 'dog' ? 'Breed / Heritage *' : 'Equipment Category *'}
                </label>
                {listingType === 'dog' ? (
                  <input
                    type="text"
                    required
                    value={breedOrCategory}
                    onChange={(e) => setBreedOrCategory(e.target.value)}
                    placeholder="e.g. Golden Retriever"
                    className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                  />
                ) : (
                  <select
                    value={gearCategory}
                    onChange={(e) => setGearCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#006c4a] cursor-pointer"
                  >
                    <option value="beds">Orthopedic Beds & Loungers</option>
                    <option value="harnesses">Harnesses, Leashes & Collars</option>
                    <option value="crates">Travel Crates & Kennels</option>
                    <option value="collars">GPS Trackers & Smart Collars</option>
                    <option value="starter-kits">Puppy Starter Kits</option>
                    <option value="nutrition">Canine Nutrition & Supplements</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block font-bold text-[#111c2d] mb-1">
                  {listingType === 'dog' ? 'Adoption / Placement Fee ($) *' : 'Retail Price ($) *'}
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={listingType === 'dog' ? 'e.g. 1850' : 'e.g. 110'}
                  className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                />
              </div>
            </div>

            {/* Kennel / Brand & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#111c2d] mb-1">
                  {listingType === 'dog' ? 'Kennel / Breeder / Rescue Name *' : 'Brand / Manufacturer *'}
                </label>
                <input
                  type="text"
                  required
                  value={kennelName}
                  onChange={(e) => setKennelName(e.target.value)}
                  placeholder={listingType === 'dog' ? 'e.g. Sunridge Golden Retrievers' : 'e.g. Ruffwear / Orvis / KONG'}
                  className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#111c2d] mb-1">Location (City, State) *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Austin, TX"
                  className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                />
              </div>
            </div>

            {/* Description & Overview */}
            <div>
              <label className="block font-bold text-[#111c2d] mb-1">
                {listingType === 'dog' ? 'Companion Description & Temperament' : 'Equipment Details & Condition'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={listingType === 'dog' 
                  ? 'Describe personality, parent bloodlines, health clearances, and temperament...'
                  : 'Describe materials, ergonomic features, warranty, and compatibility...'}
                className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
              />
            </div>

            {/* Health Verification / OFA for dogs */}
            {listingType === 'dog' && (
              <div className="p-3.5 bg-[#f0f3ff] rounded-2xl border border-[#dee8ff] space-y-2">
                <label className="block font-bold text-[#006c4a] flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span>OFA / CHIC / DNA Clearance Registry Number</span>
                </label>
                <input
                  type="text"
                  value={ofaNumber}
                  onChange={(e) => setOfaNumber(e.target.value)}
                  placeholder="e.g. OFA-GR-189283-NORMAL"
                  className="w-full px-3 py-2 bg-white border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#006c4a]"
                />
                <p className="text-[11px] text-[#554336]">
                  Our vetting team automatically syncs with the Orthopedic Foundation for Animals database.
                </p>
              </div>
            )}

            {/* Ethical Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ethicalConsent}
                  onChange={(e) => setEthicalConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#8d4b00] focus:ring-[#ffdcc3]"
                />
                <span className="text-[11px] text-[#554336] leading-relaxed">
                  I hereby attest that our listings comply with the PawPalace Zero-Tolerance standards, and agree to in-person virtual/live audit, true representation of photo captures, and safe escrow transactions.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting Listing with Photo...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">task_alt</span>
                    <span>
                      {listingType === 'dog'
                        ? 'Submit Dog Listing with Photo'
                        : 'Submit Equipment Listing with Photo'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handlePhotoCaptured}
        subjectType={listingType}
        title={listingType === 'dog' ? 'Take Companion Dog Photo' : 'Take Canine Equipment Photo'}
        subtitle={listingType === 'dog' 
          ? 'Center the dog or puppy in the viewfinder for clear verified review'
          : 'Center the equipment item in the viewfinder under good lighting'}
      />
    </>
  );
};
