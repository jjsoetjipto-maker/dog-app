import React, { useState } from 'react';
import { Dog } from '../types';

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onAddDog?: (dog: Dog) => void;
}

export const PostListingModal: React.FC<PostListingModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onAddDog
}) => {
  const [listingType, setListingType] = useState<'dog' | 'gear'>('dog');
  const [title, setTitle] = useState('');
  const [breedOrCategory, setBreedOrCategory] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [kennelName, setKennelName] = useState('');
  const [ofaNumber, setOfaNumber] = useState('');
  const [ethicalConsent, setEthicalConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
          image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&q=80'
          ],
          breederName: kennelName,
          breederBadge: 'Tier-1 Certified Breeder',
          breederInitials: kennelName.slice(0, 2).toUpperCase(),
          breederRating: 4.95,
          breederReviewsCount: 3,
          badges: ['DNA Verified', 'OFA Screened', 'Microchipped'],
          verifiedStatus: 'Pending Owner Review',
          summary: `Newly submitted companion listing for ${title}. Awaiting picture and name approval by the platform owner.`,
          approvalStatus: 'pending',
          nameApprovalStatus: 'pending',
          photoApprovalStatus: 'pending',
          nameNotes: 'Awaiting Owner name verification.',
          photoNotes: 'Awaiting Owner picture quality inspection.',
          submittedAt: 'Just now'
        };
        onAddDog(newDog);
      }

      onShowToast('Listing application submitted! The Platform Owner will review and approve the picture and name.');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        id="post-listing-modal"
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#dee8ff] animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#111c2d] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#ffdcc3] text-2xl">verified</span>
            <div>
              <h3 className="font-bold text-base">Submit Verified Listing Application</h3>
              <p className="text-xs text-[#dee8ff]/80">PawPalace Tier-1 Breeder & Certified Gear Standard</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Listing Type Toggle */}
          <div>
            <label className="block font-bold text-[#111c2d] mb-1.5">What are you listing?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setListingType('dog')}
                className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  listingType === 'dog'
                    ? 'bg-[#ffdcc3] text-[#8d4b00] border-[#8d4b00]'
                    : 'bg-[#f0f3ff] text-[#554336] border-[#dee8ff]'
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
                    ? 'bg-[#82f5c1] text-[#006c4a] border-[#006c4a]'
                    : 'bg-[#f0f3ff] text-[#554336] border-[#dee8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-base">fitness_center</span>
                <span>Canine Gear / Product</span>
              </button>
            </div>
          </div>

          {/* Name / Title */}
          <div>
            <label className="block font-bold text-[#111c2d] mb-1">
              {listingType === 'dog' ? 'Companion / Litter Name *' : 'Product Model / Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={listingType === 'dog' ? 'e.g., Archie or Litter of 5 Golden Retrievers' : 'e.g., Memory Foam Orthopedic Bed'}
              className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
            />
          </div>

          {/* Breed / Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#111c2d] mb-1">
                {listingType === 'dog' ? 'Breed / Heritage *' : 'Equipment Category *'}
              </label>
              <input
                type="text"
                required
                value={breedOrCategory}
                onChange={(e) => setBreedOrCategory(e.target.value)}
                placeholder={listingType === 'dog' ? 'e.g. Golden Retriever' : 'e.g. Orthopedic Bed'}
                className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
              />
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
                placeholder="e.g. 1850"
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
                placeholder="e.g. Sunridge Golden Retrievers"
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
                I hereby attest that our facilities comply with the PawPalace Zero-Tolerance Mill standard, and agree to in-person virtual/live audit, 10-year genetic guarantee adherence, and safe escrow payouts.
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
                  <span>Verifying Credentials & Submitting...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">task_alt</span>
                  <span>Submit for Veterinary Audit & Approval</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
