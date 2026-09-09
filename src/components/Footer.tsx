import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { Screen } from '../types';

interface FooterProps {
  setCurrentScreen: (screen: Screen) => void;
  onShowToast: (msg: string) => void;
  onSelectFeaturedDog?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentScreen, onShowToast, onSelectFeaturedDog }) => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onShowToast('Please enter a valid email address');
      return;
    }
    onShowToast('Subscribed! Welcome to the PawPalace Ethical Companion Compass.');
    setEmail('');
  };

  return (
    <footer className="bg-[#111c2d] text-white pt-16 pb-12 border-t border-[#263143]">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-[#263143]/60 border border-[#3b485d]">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#85f8c4] text-3xl">verified</span>
            <div>
              <h4 className="font-bold text-sm text-white">100% OFA & DNA Screened</h4>
              <p className="text-xs text-[#dee8ff]/70 mt-1">Every breeding parent genetic clearance is uploaded to public registry.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#ffdcc3] text-3xl">lock</span>
            <div>
              <h4 className="font-bold text-sm text-white">PawPalace Safe Escrow</h4>
              <p className="text-xs text-[#dee8ff]/70 mt-1">Breeder is paid only after your independent 72-hour veterinary check.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#82f5c1] text-3xl">local_shipping</span>
            <div>
              <h4 className="font-bold text-sm text-white">Ethical Chaperoned Delivery</h4>
              <p className="text-xs text-[#dee8ff]/70 mt-1">Climate-controlled flight nannies and ground travel; never cargo freight.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#ffb77d] text-3xl">medical_services</span>
            <div>
              <h4 className="font-bold text-sm text-white">10-Year Genetic Health Warranty</h4>
              <p className="text-xs text-[#dee8ff]/70 mt-1">Comprehensive contractual coverage against hereditary disorders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#263143]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] border border-[#ffcfad] shadow-xs flex items-center justify-center text-[#8d4b00]">
                <PawPrint className="w-6 h-6 text-[#8d4b00] fill-[#8d4b00]" />
              </div>
              <span className="font-['Epilogue'] font-bold text-2xl tracking-tight text-white">
                Paw<span className="text-[#ffdcc3]">Palace</span>
              </span>
            </div>
            <p className="text-xs text-[#dee8ff]/80 leading-relaxed max-w-sm mb-6">
              The gold standard in ethical canine placement. Connecting discerning guardians with strictly audited home breeders, certified rescues, and veterinarian-engineered canine gear.
            </p>
            
            {/* Trust Badges */}
            <div className="flex items-center gap-3 text-xs text-[#82f5c1] font-semibold">
              <span className="material-symbols-outlined text-base">military_tech</span>
              <span>AKC Bred with H.E.A.R.T. Compliant & USDA Licensed</span>
            </div>
          </div>

          {/* Col 1: Find a Dog */}
          <div>
            <h4 className="font-bold text-sm text-[#ffdcc3] tracking-wider uppercase mb-4">
              Find Companions
            </h4>
            <ul className="space-y-2.5 text-xs text-[#dee8ff]/80">
              <li>
                <button 
                  onClick={() => setCurrentScreen('find-dogs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Verified Dogs & Puppies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (onSelectFeaturedDog) onSelectFeaturedDog();
                    setCurrentScreen('dog-detail');
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Featured: Archie (Golden)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('find-dogs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pembroke Welsh Corgis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('find-dogs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  French Bulldogs (BOAS Tested)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('find-dogs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shelter & Rescue Dogs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('verified-breeders')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Breeder Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Canine Gear */}
          <div>
            <h4 className="font-bold text-sm text-[#ffdcc3] tracking-wider uppercase mb-4">
              Vetted Gear
            </h4>
            <ul className="space-y-2.5 text-xs text-[#dee8ff]/80">
              <li>
                <button 
                  onClick={() => setCurrentScreen('dog-gear')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Canine Equipment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('dog-gear')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Orthopedic Bolster Beds
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('dog-gear')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Tactical No-Pull Harnesses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('dog-gear')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Airline-Approved Crates
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('dog-gear')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  GPS Real-Time Collars
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('dog-gear')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Organic Starter Bundles
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ethical Compass Newsletter */}
          <div>
            <h4 className="font-bold text-sm text-[#ffdcc3] tracking-wider uppercase mb-4">
              Ethical Compass
            </h4>
            <p className="text-xs text-[#dee8ff]/70 leading-relaxed mb-3">
              Monthly vet-reviewed breed genetics digests, recall alerts, and puppy readiness roadmaps.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter guardian email"
                className="w-full px-3 py-2 text-xs bg-[#263143] border border-[#3b485d] rounded-lg text-white placeholder-[#dee8ff]/40 focus:outline-none focus:border-[#ffdcc3]"
              />
              <button
                type="submit"
                className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Join Compass
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#dee8ff]/60 gap-4">
          <p>© 2026 PawPalace Inc. All rights reserved. Zero-Tolerance Puppy Mill Standard Enforced.</p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCurrentScreen('health-safety')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Breeder Code of Ethics
            </button>
            <button 
              onClick={() => setCurrentScreen('health-safety')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Escrow Protection Terms
            </button>
            <button 
              onClick={() => setCurrentScreen('health-safety')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Veterinary Review Protocol
            </button>
            <button 
              id="footer-owner-portal-btn"
              onClick={() => setCurrentScreen('owner-portal')}
              className="text-[#ffdcc3] hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Platform Owner Moderation Console"
            >
              <span className="material-symbols-outlined text-xs">shield_person</span>
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
