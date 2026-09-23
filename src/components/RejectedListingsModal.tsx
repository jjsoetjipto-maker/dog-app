import React from 'react';
import { Dog } from '../types';

interface RejectedListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rejectedDogs: Dog[];
  onRestoreDog: (id: string) => void;
  onRestoreAll?: () => void;
}

export const RejectedListingsModal: React.FC<RejectedListingsModalProps> = ({
  isOpen,
  onClose,
  rejectedDogs,
  onRestoreDog,
  onRestoreAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#dee8ff] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#e7eeff] flex items-center justify-between bg-[#f9f9ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">visibility_off</span>
            </div>
            <div>
              <h2 className="font-['Epilogue'] font-bold text-lg text-[#111c2d]">
                Rejected & Hidden Listings ({rejectedDogs.length})
              </h2>
              <p className="text-xs text-[#554336] mt-0.5">
                These listings are strictly excluded from Dog of the Day, search results, and recommendations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#dee8ff] text-[#887364] hover:text-[#111c2d] flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {rejectedDogs.length === 0 ? (
            <div className="text-center py-12 text-[#887364] space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#f0f3ff] flex items-center justify-center mx-auto text-[#006c4a]">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="font-bold text-[#111c2d] text-sm">No Rejected Dogs</h3>
              <p className="text-xs max-w-sm mx-auto">
                You haven't rejected any dogs. Any companion you dismiss will be stored here and hidden from your feed.
              </p>
            </div>
          ) : (
            rejectedDogs.map((dog) => (
              <div
                key={dog.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#f9f9ff] border border-red-100 hover:border-red-200 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-red-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#111c2d] truncate">{dog.name}</h4>
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                        Hidden
                      </span>
                    </div>
                    <p className="text-xs text-[#554336] truncate mt-0.5">
                      {dog.breed} • {dog.ageText} • {dog.location}
                    </p>
                    <p className="text-[11px] text-red-600/80 mt-1 font-medium truncate">
                      {dog.photoNotes || dog.nameNotes || 'Excluded per user or moderation preference'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => onRestoreDog(dog.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-emerald-50 text-[#006c4a] border border-[#82f5c1] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">replay</span>
                    <span>Restore</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#e7eeff] bg-[#f9f9ff] flex items-center justify-between">
          <div>
            {rejectedDogs.length > 0 && onRestoreAll && (
              <button
                onClick={onRestoreAll}
                className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
              >
                Restore All Listings
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#111c2d] text-white hover:bg-[#8d4b00] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
