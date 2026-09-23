import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { Screen } from '../types';
import { useSettings } from '../context/SettingsContext';

interface FooterProps {
  setCurrentScreen: (screen: Screen) => void;
  onShowToast: (msg: string) => void;
  onSelectFeaturedDog?: () => void;
  onOpenSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentScreen, onShowToast, onSelectFeaturedDog, onOpenSettings }) => {
  const { t } = useSettings();
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
              <h4 className="font-bold text-sm text-white">{t.footerOfaTitle}</h4>
              <p className="text-xs text-[#dee8ff]/70 mt-1">{t.footerOfaDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#ffdcc3] text-3xl">lock</span>
            <div>
              <h4 className="font-bold text-sm text-white">{t.footerEscrowTitle}</h4>
              <p className="text-xs text-[#dee8ff]/70 mt-1">{t.footerEscrowDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#82f5c1] text-3xl">local_shipping</span>
            <div>
              <h4 className="font-bold text-sm text-white">{t.footerDeliveryTitle}</h4>
              <p className="text-xs text-[#dee8ff]/70 mt-1">{t.footerDeliveryDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#ffb77d] text-3xl">medical_services</span>
            <div>
              <h4 className="font-bold text-sm text-white">{t.footerWarrantyTitle}</h4>
              <p className="text-xs text-[#dee8ff]/70 mt-1">{t.footerWarrantyDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#263143]">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] border border-[#ffcfad] shadow-xs flex items-center justify-center text-[#8d4b00]">
                <PawPrint className="w-6 h-6 text-[#8d4b00] fill-[#8d4b00]" />
              </div>
              <span className="font-['Epilogue'] font-bold text-2xl tracking-tight text-white">
                Paw<span className="text-[#ffdcc3]">Palace</span>
              </span>
            </div>
            <p className="text-xs text-[#dee8ff]/80 leading-relaxed max-w-sm mb-4">
              {t.footerMission}
            </p>
            
            {/* Trust Badges */}
            <div className="flex items-center gap-2 text-[11px] text-[#82f5c1] font-semibold">
              <span className="material-symbols-outlined text-base">military_tech</span>
              <span>AKC Bred with H.E.A.R.T. Compliant</span>
            </div>
          </div>

          {/* Col 1: Find a Dog */}
          <div>
            <h4 className="font-bold text-sm text-[#ffdcc3] tracking-wider uppercase mb-4">
              {t.navFindDogs}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#dee8ff]/80">
              <li>
                <button 
                  onClick={() => setCurrentScreen('find-dogs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.catAllDogs}
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
                  {t.catRescueShelter}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('verified-breeders')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.navVerifiedBreeders}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Dog Necessities */}
          <div>
            <h4 className="font-bold text-sm text-[#ffdcc3] tracking-wider uppercase mb-4">
              {t.navDogGear}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#dee8ff]/80">
              <li>
                <button 
                  onClick={() => setCurrentScreen('dog-gear')}
                  className="hover:text-white transition-colors cursor-pointer text-left font-medium text-white"
                >
                  {t.allGearTab}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('dog-gear')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Raw Dog Food & Whole Prey Patties
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('dog-gear')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cold-Pressed Salmon & DHA Puppy Stew
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

          {/* Col 3: Vet Finder & Clinical Care */}
          <div>
            <h4 className="font-bold text-sm text-rose-300 tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-rose-400">local_hospital</span>
              <span>{t.navVetFinder || 'Vet Finder'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#dee8ff]/80">
              <li>
                <button 
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-rose-200 font-semibold flex items-center gap-1"
                >
                  <span>24/7 Emergency Hospitals</span>
                  <span className="bg-rose-500/30 text-rose-300 text-[10px] px-1 rounded">ER</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  AAHA Accredited Clinics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Fear Free Certified Vets
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pediatric Puppy Vaccines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  OFA Radiographs & Vetting
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentScreen('vet-finder')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-amber-300 font-bold"
                >
                  Book Vet Appointment
                </button>
              </li>
              <li className="pt-2 border-t border-white/10">
                <button 
                  onClick={() => setCurrentScreen('grooming-finder')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-emerald-300 font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-emerald-400">content_cut</span>
                  <span>Grooming Salons & Mobile Vans</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Ethical Compass Newsletter */}
          <div>
            <h4 className="font-bold text-sm text-[#ffdcc3] tracking-wider uppercase mb-4">
              {t.newsletterTitle}
            </h4>
            <p className="text-xs text-[#dee8ff]/70 leading-relaxed mb-3">
              {t.newsletterDesc}
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletterPlaceholder}
                className="w-full px-3 py-2 text-xs bg-[#263143] border border-[#3b485d] rounded-lg text-white placeholder-[#dee8ff]/40 focus:outline-none focus:border-[#ffdcc3]"
              />
              <button
                type="submit"
                className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {t.subscribeBtn}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#dee8ff]/60 gap-4">
          <p>{t.rightsReserved}</p>
          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <button 
              onClick={() => setCurrentScreen('vet-finder')}
              className="text-rose-300 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs text-rose-400">local_hospital</span>
              <span>Find Certified Vets</span>
            </button>
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
            {onOpenSettings && (
              <button 
                id="footer-settings-btn"
                onClick={onOpenSettings}
                className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-[#ffdcc3]"
                title="Application Settings, Theme & Language"
              >
                <span className="material-symbols-outlined text-xs">settings</span>
                <span>Settings & Theme</span>
              </button>
            )}
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
