import React from 'react';
import { Dog, Screen } from '../types';

interface VerifiedBreedersScreenProps {
  dogs: Dog[];
  onOpenChat: (dog: Dog) => void;
  onSelectDog: (dog: Dog) => void;
  setCurrentScreen: (screen: Screen) => void;
  onShowToast: (msg: string) => void;
}

export const VerifiedBreedersScreen: React.FC<VerifiedBreedersScreenProps> = ({
  dogs,
  onOpenChat,
  onSelectDog,
  setCurrentScreen,
  onShowToast
}) => {
  const uniqueBreeders = Array.from(new Set(dogs.map(d => d.breederName))).map(name => {
    return dogs.find(d => d.breederName === name)!;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#82f5c1]/20 border border-[#82f5c1] text-[#006c4a] text-xs font-bold">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Zero-Tolerance Mill Audited Directory</span>
        </div>
        <h1 className="font-['Epilogue'] font-bold text-3xl sm:text-4xl text-[#111c2d]">
          The PawPalace Certified Breeder & Shelter Registry
        </h1>
        <p className="text-xs sm:text-sm text-[#554336] leading-relaxed">
          Only 4% of applicants pass our exhaustive 32-point veterinary inspection, in-person facility audit, and mandatory parental DNA clear database requirements.
        </p>
      </div>

      {/* 3 Tier Standards Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] shadow-xs space-y-2">
          <span className="bg-[#ffdcc3] text-[#8d4b00] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
            Tier-1 In-Home Breeders
          </span>
          <h3 className="font-bold text-sm text-[#111c2d]">100% Home Whelped & Socialized</h3>
          <p className="text-xs text-[#554336] leading-relaxed">
            Puppies sleep, nurse, and play inside the breeder's living space with daily ENS (Early Neurological Stimulation) and child socialization.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] shadow-xs space-y-2">
          <span className="bg-[#82f5c1] text-[#006c4a] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
            Orthopedic Clearances
          </span>
          <h3 className="font-bold text-sm text-[#111c2d]">OFA / CHIC Registry Mandatory</h3>
          <p className="text-xs text-[#554336] leading-relaxed">
            Hips, elbows, eyes, and heart Doppler examinations must be registered with the Orthopedic Foundation for Animals prior to mating.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#dee8ff] shadow-xs space-y-2">
          <span className="bg-[#ffdbce] text-[#a33900] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
            Lifetime Sanctuary
          </span>
          <h3 className="font-bold text-sm text-[#111c2d]">Binding No-Shelter Guarantee</h3>
          <p className="text-xs text-[#554336] leading-relaxed">
            Every certified breeder contractually agrees to take back any dog at any point in their life if circumstances change.
          </p>
        </div>
      </div>

      {/* Breeder Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueBreeders.map((b) => (
          <div
            key={b.breederName}
            className="bg-white rounded-3xl p-6 border border-[#dee8ff] hover:border-[#dbc2b0] transition-all shadow-xs hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8d4b00] to-[#ffdcc3] text-[#8d4b00] font-bold text-base flex items-center justify-center border border-[#dee8ff] shrink-0">
                  {b.breederInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-sm text-[#111c2d] truncate">
                      {b.breederName}
                    </h3>
                    <span className="material-symbols-outlined text-sm text-[#006c4a]">verified</span>
                  </div>
                  <p className="text-xs text-[#887364] mt-0.5">{b.location}</p>
                  <p className="text-[11px] text-[#006c4a] font-semibold mt-0.5">{b.breederBadge}</p>
                </div>
              </div>

              <div className="p-3 bg-[#f0f3ff] rounded-2xl border border-[#dee8ff] space-y-1.5 text-xs text-[#554336] mb-4">
                <div className="flex justify-between">
                  <span>Specialty Breed:</span>
                  <strong className="text-[#111c2d]">{b.breed}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Guardian Satisfaction:</span>
                  <span className="text-[#8d4b00] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">star</span>
                    <span>{b.breederRating} / 5.0</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Escrow Clearance:</span>
                  <span className="text-[#006c4a] font-bold">100% Certified</span>
                </div>
              </div>

              <p className="text-xs text-[#554336] line-clamp-2 leading-relaxed">
                Audited facility with in-home nurseries, verified play paddocks, and strict OFA genetic documentation.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0f3ff] flex items-center gap-2">
              <button
                onClick={() => {
                  onSelectDog(b);
                  setCurrentScreen('dog-detail');
                }}
                className="flex-1 bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                View Available Litter
              </button>
              <button
                onClick={() => onOpenChat(b)}
                className="bg-[#8d4b00] hover:bg-[#b15f00] text-white p-2 rounded-xl transition-colors cursor-pointer"
                title="Message Breeder"
              >
                <span className="material-symbols-outlined text-base">chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
