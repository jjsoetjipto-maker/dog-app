import React from 'react';
import { Screen } from '../types';

interface HealthSafetyScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  onShowToast: (msg: string) => void;
}

export const HealthSafetyScreen: React.FC<HealthSafetyScreenProps> = ({
  setCurrentScreen,
  onShowToast
}) => {
  const pledges = [
    {
      num: '01',
      title: 'Mandatory OFA & PennHIP Clearances',
      desc: 'No dog may be paired without official hip, elbow, cardiac, and eye certifications from the Orthopedic Foundation for Animals.',
      icon: 'medical_services'
    },
    {
      num: '02',
      title: 'Compulsory DNA Screening (250+ Genetic Panels)',
      desc: 'Direct laboratory submission through Embark or Wisdom Health to screen against Progressive Retinal Atrophy, Degenerative Myelopathy, and breed-specific mutations.',
      icon: 'biotech'
    },
    {
      num: '03',
      title: 'Zero Cages or Outdoor Commercial Pens',
      desc: 'All mothers and litters must be whelped and raised inside human residences with constant human bonding, climate control, and sanitation.',
      icon: 'cottage'
    },
    {
      num: '04',
      title: 'Early Neurological Stimulation (ENS) & Puppy Culture',
      desc: 'Structured neonatal handling from days 3 to 16, resulting in enhanced cardiovascular performance, stronger stress tolerance, and disease immunity.',
      icon: 'psychology'
    },
    {
      num: '05',
      title: '10-Year Genetic Health Warranty',
      desc: 'A legally binding warranty backing every companion against life-altering inherited conditions with full escrow reimbursement guarantees.',
      icon: 'gavel'
    },
    {
      num: '06',
      title: 'PawPalace 72-Hour Veterinary Escrow',
      desc: 'Your payment stays safely locked in third-party escrow. Breeders receive funds only after your independent primary veterinarian approves physical wellness.',
      icon: 'lock'
    },
    {
      num: '07',
      title: 'Lifetime Rehoming & Sanctuary Contract',
      desc: 'A strict zero-shelter commitment: if a guardian can ever no longer care for their pet, the breeder or PawPalace concierge immediately welcomes the pet back.',
      icon: 'favorite'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcc3] text-[#8d4b00] text-xs font-bold">
          <span className="material-symbols-outlined text-sm">shield_with_heart</span>
          <span>The PawPalace Ethical Standard</span>
        </div>
        <h1 className="font-['Epilogue'] font-bold text-3xl sm:text-4xl text-[#111c2d]">
          The 7-Point Health, Genetic & Welfare Pledge
        </h1>
        <p className="text-xs sm:text-sm text-[#554336] leading-relaxed">
          How we engineered the most trustworthy, cruelty-free companion adoption network in the world.
        </p>
      </div>

      {/* Escrow Timeline Graphic */}
      <div className="bg-gradient-to-r from-[#111c2d] to-[#263143] text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-['Epilogue'] font-bold text-lg text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#82f5c1]">lock</span>
            <span>How PawPalace Escrow Protects You</span>
          </h3>
          <span className="bg-[#82f5c1]/20 text-[#82f5c1] text-xs font-bold px-3 py-1 rounded-full border border-[#82f5c1]/30">
            100% Guaranteed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <span className="text-[#ffdcc3] font-bold text-sm block">Step 1: Secure Deposit</span>
            <p className="text-[#dee8ff]/80">Guardian applies and reserves pup. Funds are placed into neutral third-party escrow.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <span className="text-[#82f5c1] font-bold text-sm block">Step 2: Safe Hand-off</span>
            <p className="text-[#dee8ff]/80">Pup arrives via local meet or chaperoned in-cabin flight nanny with full health records.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <span className="text-[#ffdcc3] font-bold text-sm block">Step 3: Vet Clearance</span>
            <p className="text-[#dee8ff]/80">Your vet examines pup within 72 hours. Only after clearance are escrow funds disbursed.</p>
          </div>
        </div>
      </div>

      {/* 7 Pledges List */}
      <div className="space-y-4">
        {pledges.map((p) => (
          <div
            key={p.num}
            className="bg-white rounded-3xl p-6 border border-[#dee8ff] shadow-xs flex items-start gap-5 hover:border-[#8d4b00] transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ffdcc3] text-[#8d4b00] flex items-center justify-center shrink-0 font-['Epilogue'] font-bold text-lg">
              {p.num}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#006c4a]">{p.icon}</span>
                <h3 className="font-bold text-sm sm:text-base text-[#111c2d]">{p.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#554336] leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="text-center p-8 bg-[#f0f3ff] rounded-3xl border border-[#dee8ff] space-y-4">
        <h3 className="font-bold text-base text-[#111c2d]">Ready to Meet a Verified Companion?</h3>
        <p className="text-xs text-[#554336] max-w-md mx-auto">
          Explore dogs and puppies raised under these rigorous ethical safeguards today.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setCurrentScreen('find-dogs')}
            className="bg-[#8d4b00] hover:bg-[#b15f00] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
          >
            Browse Verified Dogs
          </button>
          <button
            onClick={() => setCurrentScreen('dog-gear')}
            className="bg-white text-[#111c2d] border border-[#dee8ff] hover:bg-[#dee8ff] px-6 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
          >
            Browse Vet-Approved Gear
          </button>
        </div>
      </div>

    </div>
  );
};
