import React, { useState, useMemo } from 'react';
import { Dog, ApprovalStatus, UserProfile } from '../types';
import {
  OWNER_DEFAULT_PASSCODE,
  OWNER_DEFAULT_EMAIL,
  CURATED_REPLACEMENT_PHOTOS,
  saveManagedDogs,
  INITIAL_SUBMISSION_QUEUE
} from '../data/ownerApprovalData';

interface OwnerPortalScreenProps {
  dogs: Dog[];
  onUpdateDogs: (updatedDogs: Dog[]) => void;
  onExitToMarketplace: () => void;
  onShowToast: (msg: string) => void;
  onSelectDogPreview?: (dog: Dog) => void;
  currentUser?: UserProfile;
}

export const OwnerPortalScreen: React.FC<OwnerPortalScreenProps> = ({
  dogs,
  onUpdateDogs,
  onExitToMarketplace,
  onShowToast,
  onSelectDogPreview,
  currentUser
}) => {
  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      localStorage.removeItem('pawpalace_owner_authenticated');
      return sessionStorage.getItem('pawpalace_owner_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [accountInput, setAccountInput] = useState('');
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active tab in owner portal
  const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'new-submission' | 'guidelines'>('listings');

  // Filter and search
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending-photo' | 'pending-name' | 'needs-attention' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & In-line editing
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingPhotoUrl, setEditingPhotoUrl] = useState('');
  const [isReplacePhotoModalOpen, setIsReplacePhotoModalOpen] = useState(false);
  const [selectedDogForPhotoReplace, setSelectedDogForPhotoReplace] = useState<Dog | null>(null);

  // Zoom Image Inspector Modal
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string; dog: Dog } | null>(null);

  // New Submission Form state
  const [newDogName, setNewDogName] = useState('');
  const [newDogBreed, setNewDogBreed] = useState('Golden Retriever');
  const [newDogPrice, setNewDogPrice] = useState('1800');
  const [newDogLocation, setNewDogLocation] = useState('Austin, TX');
  const [newDogImage, setNewDogImage] = useState(CURATED_REPLACEMENT_PHOTOS[0].url);
  const [newDogBreeder, setNewDogBreeder] = useState('Highland Canine Heritage');

  // User Profile review mock items
  const [userReviewItems, setUserReviewItems] = useState([
    {
      id: 'u-1',
      name: currentUser?.name || 'Marcus Vance',
      email: currentUser?.email || 'm.vance@architect.io',
      role: 'guardian',
      avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      nameStatus: 'approved' as ApprovalStatus,
      avatarStatus: 'approved' as ApprovalStatus,
      registeredAt: 'Member since 2024'
    },
    {
      id: 'u-2',
      name: 'Sunridge Kennels Admin',
      email: 'contact@sunridgegoldens.com',
      role: 'breeder',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      nameStatus: 'approved' as ApprovalStatus,
      avatarStatus: 'pending' as ApprovalStatus,
      registeredAt: 'Applied yesterday'
    },
    {
      id: 'u-3',
      name: 'best_frenchie_lover_99',
      email: 'puppyfan99@gmail.com',
      role: 'adopter',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      nameStatus: 'flagged' as ApprovalStatus,
      avatarStatus: 'pending' as ApprovalStatus,
      registeredAt: 'Registered 3 hours ago'
    }
  ]);

  // Auth Handlers
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (
      accountInput.trim().toLowerCase() === OWNER_DEFAULT_EMAIL.toLowerCase() &&
      passcode.trim() === OWNER_DEFAULT_PASSCODE
    ) {
      setIsAuthenticated(true);
      setAuthError('');
      sessionStorage.setItem('pawpalace_owner_authenticated', 'true');
      onShowToast('Owner access verified! Welcome to the Executive Moderation Suite.');
    } else {
      setAuthError('Invalid owner account or password. Access denied.');
    }
  };

  const handleLogoutOwner = () => {
    setIsAuthenticated(false);
    setAccountInput('');
    setPasscode('');
    setAuthError('');
    sessionStorage.removeItem('pawpalace_owner_authenticated');
    try {
      localStorage.removeItem('pawpalace_owner_authenticated');
    } catch {}
    onShowToast('Locked Owner Portal.');
  };

  // Helper to update a dog in state and persist
  const updateDog = (dogId: string, updates: Partial<Dog>) => {
    const nextDogs = dogs.map((d) => {
      if (d.id === dogId) {
        const updated = {
          ...d,
          ...updates,
          lastReviewedAt: 'Just now',
          reviewedBy: OWNER_DEFAULT_EMAIL
        };
        // Compute overall approvalStatus
        const isPhotoApproved = (updates.photoApprovalStatus ?? updated.photoApprovalStatus) === 'approved';
        const isNameApproved = (updates.nameApprovalStatus ?? updated.nameApprovalStatus) === 'approved';
        const isPhotoRejected = (updates.photoApprovalStatus ?? updated.photoApprovalStatus) === 'rejected';
        const isNameRejected = (updates.nameApprovalStatus ?? updated.nameApprovalStatus) === 'rejected';

        if (isPhotoRejected || isNameRejected) {
          updated.approvalStatus = 'rejected';
        } else if (isPhotoApproved && isNameApproved) {
          updated.approvalStatus = 'approved';
        } else {
          updated.approvalStatus = 'pending';
        }

        return updated;
      }
      return d;
    });

    onUpdateDogs(nextDogs);
    saveManagedDogs(nextDogs);
  };

  // Photo actions
  const handleApprovePhoto = (dog: Dog) => {
    updateDog(dog.id, {
      photoApprovalStatus: 'approved',
      photoNotes: 'Approved by Owner. High-resolution, clear lighting, verified original.'
    });
    onShowToast(`Picture approved for "${dog.name}"!`);
  };

  const handleFlagPhoto = (dog: Dog, reason?: string) => {
    const defaultReason = reason || prompt('Enter feedback reason for flagging picture (e.g. Low resolution, Bad lighting):') || 'Lighting or resolution requires revision.';
    updateDog(dog.id, {
      photoApprovalStatus: 'flagged',
      photoNotes: defaultReason
    });
    onShowToast(`Picture flagged for "${dog.name}".`);
  };

  const handleRejectPhoto = (dog: Dog) => {
    updateDog(dog.id, {
      photoApprovalStatus: 'rejected',
      photoNotes: 'Picture rejected by Owner. Violates visual quality guidelines.'
    });
    onShowToast(`Picture rejected for "${dog.name}".`);
  };

  // Name actions
  const handleApproveName = (dog: Dog) => {
    updateDog(dog.id, {
      nameApprovalStatus: 'approved',
      nameNotes: 'Name approved by Owner. Verified pedigree standard.'
    });
    onShowToast(`Name "${dog.name}" approved!`);
  };

  const handleFlagName = (dog: Dog) => {
    const reason = prompt(`Enter reason for flagging name "${dog.name}":`, 'Contains emojis or non-standard formatting') || 'Needs formatting revision';
    updateDog(dog.id, {
      nameApprovalStatus: 'flagged',
      nameNotes: reason
    });
    onShowToast(`Name "${dog.name}" flagged for revision.`);
  };

  const handleRejectName = (dog: Dog) => {
    updateDog(dog.id, {
      nameApprovalStatus: 'rejected',
      nameNotes: 'Name rejected by Owner. Inappropriate or misleading.'
    });
    onShowToast(`Name rejected for "${dog.name}".`);
  };

  const handleSaveEditedName = (dogId: string) => {
    if (!editingName.trim()) {
      onShowToast('Name cannot be empty.');
      return;
    }
    updateDog(dogId, {
      name: editingName.trim(),
      nameApprovalStatus: 'approved',
      nameNotes: `Edited and approved by Owner (${OWNER_DEFAULT_EMAIL})`
    });
    setEditingDogId(null);
    onShowToast(`Saved and approved new name: "${editingName.trim()}"`);
  };

  // Photo replacement
  const handleOpenPhotoReplace = (dog: Dog) => {
    setSelectedDogForPhotoReplace(dog);
    setEditingPhotoUrl(dog.image);
    setIsReplacePhotoModalOpen(true);
  };

  const handleSaveReplacedPhoto = () => {
    if (!selectedDogForPhotoReplace || !editingPhotoUrl.trim()) return;
    updateDog(selectedDogForPhotoReplace.id, {
      image: editingPhotoUrl.trim(),
      photoApprovalStatus: 'approved',
      photoNotes: `Photo updated & approved by Owner on ${new Date().toLocaleDateString()}`
    });
    setIsReplacePhotoModalOpen(false);
    setSelectedDogForPhotoReplace(null);
    onShowToast(`Updated and approved photo for "${selectedDogForPhotoReplace.name}"!`);
  };

  // Both Approve
  const handleApproveBoth = (dog: Dog) => {
    updateDog(dog.id, {
      photoApprovalStatus: 'approved',
      nameApprovalStatus: 'approved',
      approvalStatus: 'approved',
      photoNotes: 'Approved by Owner.',
      nameNotes: 'Approved by Owner.'
    });
    onShowToast(`Fully approved "${dog.name}" (Picture & Name live on marketplace)!`);
  };

  // Batch actions
  const handleBatchApprovePendingPhotos = () => {
    const pendingDogs = dogs.filter((d) => d.photoApprovalStatus !== 'approved');
    if (pendingDogs.length === 0) {
      onShowToast('All pictures are already approved!');
      return;
    }
    const nextDogs = dogs.map((d) => {
      if (d.photoApprovalStatus !== 'approved') {
        return {
          ...d,
          photoApprovalStatus: 'approved' as ApprovalStatus,
          photoNotes: 'Batch approved by Owner.',
          approvalStatus: d.nameApprovalStatus === 'approved' ? ('approved' as ApprovalStatus) : d.approvalStatus,
          lastReviewedAt: 'Just now',
          reviewedBy: OWNER_DEFAULT_EMAIL
        };
      }
      return d;
    });
    onUpdateDogs(nextDogs);
    saveManagedDogs(nextDogs);
    onShowToast(`Approved ${pendingDogs.length} pending pictures in batch!`);
  };

  const handleBatchApprovePendingNames = () => {
    const pendingDogs = dogs.filter((d) => d.nameApprovalStatus !== 'approved');
    if (pendingDogs.length === 0) {
      onShowToast('All names are already approved!');
      return;
    }
    const nextDogs = dogs.map((d) => {
      if (d.nameApprovalStatus !== 'approved') {
        return {
          ...d,
          nameApprovalStatus: 'approved' as ApprovalStatus,
          nameNotes: 'Batch approved by Owner.',
          approvalStatus: d.photoApprovalStatus === 'approved' ? ('approved' as ApprovalStatus) : d.approvalStatus,
          lastReviewedAt: 'Just now',
          reviewedBy: OWNER_DEFAULT_EMAIL
        };
      }
      return d;
    });
    onUpdateDogs(nextDogs);
    saveManagedDogs(nextDogs);
    onShowToast(`Approved ${pendingDogs.length} pending names in batch!`);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset catalog to initial moderation queue state?')) {
      onUpdateDogs(INITIAL_SUBMISSION_QUEUE);
      saveManagedDogs(INITIAL_SUBMISSION_QUEUE);
      onShowToast('Catalog reset to standard baseline with pending demo items.');
    }
  };

  // Add new submission form
  const handleCreateSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDogName.trim()) {
      onShowToast('Please provide a companion name.');
      return;
    }

    const newDog: Dog = {
      id: `dog-${Date.now()}`,
      name: newDogName.trim(),
      breed: newDogBreed,
      category: 'puppy',
      price: parseInt(newDogPrice) || 1600,
      location: newDogLocation,
      ageText: '9 Weeks Old',
      gender: 'Male',
      color: 'Standard Breed Standard',
      image: newDogImage,
      gallery: [newDogImage],
      breederName: newDogBreeder,
      breederBadge: 'Tier-1 Certified Breeder',
      breederInitials: newDogBreeder.slice(0, 2).toUpperCase(),
      breederRating: 4.95,
      breederReviewsCount: 8,
      badges: ['DNA Verified', 'OFA Screened', 'Microchipped'],
      verifiedStatus: 'Pending Owner Review',
      summary: `Newly submitted purebred ${newDogBreed} companion awaiting Owner validation.`,
      approvalStatus: 'pending',
      nameApprovalStatus: 'pending',
      photoApprovalStatus: 'pending',
      submittedAt: 'Just now',
      nameNotes: 'Newly submitted name awaiting Owner confirmation.',
      photoNotes: 'Initial breeder uploaded picture awaiting Owner review.'
    };

    const nextDogs = [newDog, ...dogs];
    onUpdateDogs(nextDogs);
    saveManagedDogs(nextDogs);

    onShowToast(`New submission for "${newDog.name}" added to review queue!`);
    setNewDogName('');
    setActiveTab('listings');
    setStatusFilter('all');
  };

  // User moderation actions
  const handleApproveUserName = (userId: string) => {
    setUserReviewItems((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, nameStatus: 'approved' } : u))
    );
    onShowToast('User display name approved!');
  };

  const handleApproveUserAvatar = (userId: string) => {
    setUserReviewItems((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, avatarStatus: 'approved' } : u))
    );
    onShowToast('User profile picture approved!');
  };

  // Metrics computation
  const metrics = useMemo(() => {
    const total = dogs.length;
    const pendingPhotos = dogs.filter((d) => d.photoApprovalStatus === 'pending').length;
    const pendingNames = dogs.filter((d) => d.nameApprovalStatus === 'pending').length;
    const flagged = dogs.filter(
      (d) => d.photoApprovalStatus === 'flagged' || d.nameApprovalStatus === 'flagged'
    ).length;
    const fullyApproved = dogs.filter(
      (d) => d.photoApprovalStatus === 'approved' && d.nameApprovalStatus === 'approved'
    ).length;

    return { total, pendingPhotos, pendingNames, flagged, fullyApproved };
  }, [dogs]);

  // Filtered Dogs
  const filteredDogs = useMemo(() => {
    return dogs.filter((dog) => {
      // Status filter
      if (statusFilter === 'pending-photo' && dog.photoApprovalStatus !== 'pending') return false;
      if (statusFilter === 'pending-name' && dog.nameApprovalStatus !== 'pending') return false;
      if (statusFilter === 'needs-attention' && dog.photoApprovalStatus !== 'flagged' && dog.nameApprovalStatus !== 'flagged') return false;
      if (statusFilter === 'approved' && (dog.photoApprovalStatus !== 'approved' || dog.nameApprovalStatus !== 'approved')) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dog.name.toLowerCase().includes(q);
        const matchesBreed = dog.breed.toLowerCase().includes(q);
        const matchesBreeder = dog.breederName.toLowerCase().includes(q);
        const matchesLocation = dog.location.toLowerCase().includes(q);
        if (!matchesName && !matchesBreed && !matchesBreeder && !matchesLocation) return false;
      }

      return true;
    });
  }, [dogs, statusFilter, searchQuery]);

  // If NOT authenticated, render the Restricted Access Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b111e] text-[#f0f4ff] flex flex-col justify-center items-center p-4 selection:bg-[#ffdcc3] selection:text-[#111c2d]">
        <div className="w-full max-w-md bg-[#131c2e] border border-[#263750] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative ambient glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d97706]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#006c4a]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Return Bar */}
          <div className="relative mb-3 flex items-center justify-between">
            <button
              id="owner-signin-top-return-btn"
              type="button"
              onClick={onExitToMarketplace}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2538] hover:bg-[#23334c] border border-[#2b3d5b] text-xs font-semibold text-[#cbd7ef] hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Return to Marketplace</span>
            </button>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#5c7094]">Executive Login</span>
          </div>

          <div className="text-center space-y-3 mb-6 relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ffdcc3] text-[#8d4b00] shadow-md mb-2">
              <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
            </div>
            <div className="inline-block bg-[#223048] border border-[#3b4e6d] px-3 py-1 rounded-full text-[11px] font-bold text-[#ffdcc3] uppercase tracking-wider">
              PawPalace Executive Portal
            </div>
            <h1 className="font-['Epilogue'] font-black text-2xl text-white tracking-tight">
              Owner Sign-In
            </h1>
            <p className="text-xs text-[#9fb0cf] leading-relaxed">
              Restricted workspace for the platform owner to inspect, approve, and edit companion pictures and names before they go live.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-[#cbd7ef] mb-1.5">
                Owner Account
              </label>
              <input
                type="text"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                placeholder="Enter owner account"
                autoComplete="off"
                className="w-full px-3.5 py-2.5 bg-[#0b111e] border border-[#2b3d5a] focus:border-[#ffdcc3] rounded-xl text-xs text-white placeholder-[#5c7094] focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cbd7ef] mb-1.5">
                Owner Password
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter password"
                autoComplete="new-password"
                className="w-full px-3.5 py-2.5 bg-[#0b111e] border border-[#2b3d5a] focus:border-[#ffdcc3] rounded-xl text-xs text-white placeholder-[#5c7094] focus:outline-none transition-colors"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
                <span>{authError}</span>
              </div>
            )}

            <div className="pt-2 space-y-2.5">
              <button
                id="owner-signin-submit-btn"
                type="submit"
                className="w-full py-3 bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-lg shadow-[#d97706]/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Authenticate as Owner</span>
              </button>

              <button
                id="owner-signin-return-btn"
                type="button"
                onClick={onExitToMarketplace}
                className="w-full py-2.5 bg-[#172236] hover:bg-[#202f47] border border-[#2b3e5f] hover:border-[#3d557f] text-[#cbd7ef] hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Return to Public Marketplace</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#263750] flex items-center justify-between text-xs text-[#9fb0cf]">
            <button
              id="owner-signin-bottom-return-btn"
              onClick={onExitToMarketplace}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Marketplace</span>
            </button>
            <span className="text-[10px] text-[#5c7094]">PawPalace v2.4 Security</span>
          </div>
        </div>
      </div>
    );
  }

  // Render Owner Console
  return (
    <div className="min-h-screen bg-[#0a0f18] text-[#e3ecfc] flex flex-col selection:bg-[#ffdcc3] selection:text-[#111c2d]">
      
      {/* Top Owner Executive Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0f1726]/95 backdrop-blur-md border-b border-[#213049] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Portal Name */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8d4b00] to-[#ffdcc3] text-[#111c2d] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-2xl font-bold">shield_person</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-['Epilogue'] font-bold text-base text-white tracking-tight">
                    PawPalace Owner Portal
                  </h1>
                  <span className="bg-[#8d4b00]/40 text-[#ffdcc3] border border-[#8d4b00] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Executive Suite
                  </span>
                </div>
                <p className="text-[11px] text-[#93a6c8]">
                  Visual Moderation & Name Approval Console • Logged in as <span className="text-[#82f5c1] font-mono">{OWNER_DEFAULT_EMAIL}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions & Navigation */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={onExitToMarketplace}
                className="py-2 px-3.5 bg-[#172338] hover:bg-[#20314d] border border-[#2f4365] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                title="View the public marketplace as an adopter"
              >
                <span className="material-symbols-outlined text-sm text-[#ffdcc3]">visibility</span>
                <span className="hidden sm:inline">View Public Marketplace</span>
              </button>

              <button
                onClick={handleLogoutOwner}
                className="py-2 px-3 bg-[#0a0f18] hover:bg-red-950/40 border border-[#213049] hover:border-red-700/50 text-[#93a6c8] hover:text-red-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Lock portal"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                <span className="hidden md:inline">Lock</span>
              </button>
            </div>

          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 border-t border-[#1a263b] overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'listings'
                  ? 'bg-[#d97706] text-white shadow-xs'
                  : 'text-[#93a6c8] hover:text-white hover:bg-[#172338]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">pets</span>
              <span>Companions & Photos ({dogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('new-submission')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'new-submission'
                  ? 'bg-[#d97706] text-white shadow-xs'
                  : 'text-[#93a6c8] hover:text-white hover:bg-[#172338]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Add New Submission</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'users'
                  ? 'bg-[#d97706] text-white shadow-xs'
                  : 'text-[#93a6c8] hover:text-white hover:bg-[#172338]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">manage_accounts</span>
              <span>Breeder & User Avatars ({userReviewItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'guidelines'
                  ? 'bg-[#d97706] text-white shadow-xs'
                  : 'text-[#93a6c8] hover:text-white hover:bg-[#172338]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">policy</span>
              <span>Owner Approval Standards</span>
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleResetToDefaults}
                className="text-[11px] text-[#6f83a7] hover:text-[#ffdcc3] hover:underline cursor-pointer px-2"
                title="Reset demo data"
              >
                Reset Demo Queue
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Tab 1: Companion Listings & Photo/Name Approvals */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <div 
                onClick={() => setStatusFilter('all')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-[#1b273d] border-[#d97706] shadow-lg shadow-[#d97706]/10'
                    : 'bg-[#111928] border-[#22314a] hover:border-[#354c70]'
                }`}
              >
                <div className="flex items-center justify-between text-[#93a6c8] text-xs">
                  <span>Total Catalog</span>
                  <span className="material-symbols-outlined text-base">inventory_2</span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">{metrics.total}</div>
                <p className="text-[10px] text-[#93a6c8] mt-1">All managed entries</p>
              </div>

              <div 
                onClick={() => setStatusFilter('pending-photo')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'pending-photo'
                    ? 'bg-[#2a2215] border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-[#111928] border-[#22314a] hover:border-amber-700/50'
                }`}
              >
                <div className="flex items-center justify-between text-amber-300 text-xs">
                  <span>Photos Pending</span>
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                </div>
                <div className="text-2xl font-bold text-amber-400 mt-2">{metrics.pendingPhotos}</div>
                <p className="text-[10px] text-amber-300/70 mt-1">Needs visual inspection</p>
              </div>

              <div 
                onClick={() => setStatusFilter('pending-name')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'pending-name'
                    ? 'bg-[#2a2215] border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-[#111928] border-[#22314a] hover:border-amber-700/50'
                }`}
              >
                <div className="flex items-center justify-between text-amber-300 text-xs">
                  <span>Names Pending</span>
                  <span className="material-symbols-outlined text-base">badge</span>
                </div>
                <div className="text-2xl font-bold text-amber-400 mt-2">{metrics.pendingNames}</div>
                <p className="text-[10px] text-amber-300/70 mt-1">Needs name clearance</p>
              </div>

              <div 
                onClick={() => setStatusFilter('needs-attention')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'needs-attention'
                    ? 'bg-[#2f1816] border-red-500 shadow-lg shadow-red-500/10'
                    : 'bg-[#111928] border-[#22314a] hover:border-red-700/50'
                }`}
              >
                <div className="flex items-center justify-between text-rose-300 text-xs">
                  <span>Flagged / Review</span>
                  <span className="material-symbols-outlined text-base">flag</span>
                </div>
                <div className="text-2xl font-bold text-rose-400 mt-2">{metrics.flagged}</div>
                <p className="text-[10px] text-rose-300/70 mt-1">Changes requested</p>
              </div>

              <div 
                onClick={() => setStatusFilter('approved')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'approved'
                    ? 'bg-[#0f281e] border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-[#111928] border-[#22314a] hover:border-emerald-700/50'
                }`}
              >
                <div className="flex items-center justify-between text-emerald-300 text-xs">
                  <span>Fully Approved</span>
                  <span className="material-symbols-outlined text-base">verified</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-2">{metrics.fullyApproved}</div>
                <p className="text-[10px] text-emerald-300/70 mt-1">Live on Marketplace</p>
              </div>
            </div>

            {/* Filter Bar & Batch Actions */}
            <div className="bg-[#111928] rounded-2xl border border-[#22314a] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#5c7094] text-lg">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by dog name, breed, or breeder..."
                    className="w-full pl-9 pr-3.5 py-2 bg-[#0a0f18] border border-[#2b3d5a] rounded-xl text-xs text-white placeholder-[#5c7094] focus:outline-none focus:border-[#d97706]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-[#5c7094] hover:text-white"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  )}
                </div>

                <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#93a6c8]">
                  <span>Showing:</span>
                  <span className="font-bold text-white">{filteredDogs.length} of {dogs.length}</span>
                </div>
              </div>

              {/* Batch Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleBatchApprovePendingPhotos}
                  disabled={metrics.pendingPhotos === 0}
                  className="py-2 px-3 bg-[#1e2d44] hover:bg-[#283b58] disabled:opacity-40 disabled:cursor-not-allowed border border-[#3b4e6d] text-[#82f5c1] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">photo</span>
                  <span>Approve All Pending Photos ({metrics.pendingPhotos})</span>
                </button>

                <button
                  onClick={handleBatchApprovePendingNames}
                  disabled={metrics.pendingNames === 0}
                  className="py-2 px-3 bg-[#1e2d44] hover:bg-[#283b58] disabled:opacity-40 disabled:cursor-not-allowed border border-[#3b4e6d] text-[#ffdcc3] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">check_box</span>
                  <span>Approve All Pending Names ({metrics.pendingNames})</span>
                </button>
              </div>
            </div>

            {/* Moderation Queue Listing Cards */}
            <div className="space-y-4">
              {filteredDogs.length === 0 ? (
                <div className="bg-[#111928] border border-[#22314a] rounded-3xl p-12 text-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-[#5c7094]">search_off</span>
                  <h3 className="text-base font-bold text-white">No Companions Match Filter</h3>
                  <p className="text-xs text-[#93a6c8] max-w-md mx-auto">
                    No listings found for &ldquo;{statusFilter}&rdquo; or query &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="py-2 px-4 bg-[#1b273d] hover:bg-[#263753] text-[#ffdcc3] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredDogs.map((dog) => {
                  const isPhotoApproved = dog.photoApprovalStatus === 'approved';
                  const isNameApproved = dog.nameApprovalStatus === 'approved';
                  const isFullyApproved = isPhotoApproved && isNameApproved;
                  const isEditingThisName = editingDogId === dog.id;

                  return (
                    <div
                      key={dog.id}
                      className={`bg-[#111928] rounded-3xl border transition-all overflow-hidden ${
                        isFullyApproved
                          ? 'border-[#1e3427] hover:border-[#2f553f]'
                          : dog.photoApprovalStatus === 'flagged' || dog.nameApprovalStatus === 'flagged'
                          ? 'border-red-900/50 shadow-md shadow-red-950/20'
                          : 'border-[#2d3f5b] shadow-md'
                      }`}
                    >
                      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Column 1: Picture Inspection & Moderation (Cols 1-4) */}
                        <div className="lg:col-span-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#cbd7ef] uppercase tracking-wider flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#ffdcc3]">photo_camera</span>
                              <span>Picture Review</span>
                            </span>

                            {/* Photo Status Pill */}
                            {dog.photoApprovalStatus === 'approved' ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                <span>Photo Approved</span>
                              </span>
                            ) : dog.photoApprovalStatus === 'flagged' ? (
                              <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-700/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="material-symbols-outlined text-xs">warning</span>
                                <span>Photo Flagged</span>
                              </span>
                            ) : dog.photoApprovalStatus === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 bg-red-950/80 text-red-300 border border-red-700/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="material-symbols-outlined text-xs">cancel</span>
                                <span>Photo Rejected</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-[#282115] text-amber-400 border border-amber-500/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                                <span className="material-symbols-outlined text-xs">pending</span>
                                <span>Photo Pending Review</span>
                              </span>
                            )}
                          </div>

                          {/* Image Preview with Zoom Overlay */}
                          <div className="relative group rounded-2xl overflow-hidden border border-[#253550] aspect-4/3 bg-[#0a0f18]">
                            <img
                              src={dog.image}
                              alt={dog.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            
                            {/* Hover Overlay with Zoom Button */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                              <button
                                type="button"
                                onClick={() => setZoomedImage({ url: dog.image, title: dog.name, dog })}
                                className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                              >
                                <span className="material-symbols-outlined text-base">zoom_in</span>
                                <span>Inspect Full Res</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenPhotoReplace(dog)}
                                className="p-2 bg-[#d97706]/90 hover:bg-[#b45309] text-white rounded-xl backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                              >
                                <span className="material-symbols-outlined text-base">sync</span>
                                <span>Replace</span>
                              </button>
                            </div>

                            {dog.gallery && dog.gallery.length > 1 && (
                              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">collections</span>
                                <span>{dog.gallery.length} photos</span>
                              </span>
                            )}
                          </div>

                          {dog.photoNotes && (
                            <p className="text-[11px] text-[#93a6c8] bg-[#0a0f18] p-2 rounded-xl border border-[#1e2b40] italic">
                              &ldquo;{dog.photoNotes}&rdquo;
                            </p>
                          )}

                          {/* Photo Moderation Buttons */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <button
                              onClick={() => handleApprovePhoto(dog)}
                              className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                isPhotoApproved
                                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/60'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">done</span>
                              <span>Approve Photo</span>
                            </button>

                            <button
                              onClick={() => handleFlagPhoto(dog)}
                              className="py-1.5 px-2.5 bg-[#251e16] hover:bg-[#3d2f21] border border-amber-700/60 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Flag picture for revision"
                            >
                              <span className="material-symbols-outlined text-sm">flag</span>
                              <span>Flag</span>
                            </button>

                            <button
                              onClick={() => handleOpenPhotoReplace(dog)}
                              className="py-1.5 px-2.5 bg-[#172338] hover:bg-[#233552] border border-[#2f4365] text-[#cbd7ef] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Replace or upload a new photo"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              <span>Replace</span>
                            </button>
                          </div>
                        </div>

                        {/* Column 2: Name & Pedigree Moderation (Cols 5-8) */}
                        <div className="lg:col-span-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#cbd7ef] uppercase tracking-wider flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#ffdcc3]">badge</span>
                              <span>Companion Name Review</span>
                            </span>

                            {/* Name Status Pill */}
                            {dog.nameApprovalStatus === 'approved' ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                <span>Name Approved</span>
                              </span>
                            ) : dog.nameApprovalStatus === 'flagged' ? (
                              <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-700/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="material-symbols-outlined text-xs">warning</span>
                                <span>Name Flagged</span>
                              </span>
                            ) : dog.nameApprovalStatus === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 bg-red-950/80 text-red-300 border border-red-700/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                <span className="material-symbols-outlined text-xs">cancel</span>
                                <span>Name Rejected</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-[#282115] text-amber-400 border border-amber-500/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                                <span className="material-symbols-outlined text-xs">pending</span>
                                <span>Name Pending Review</span>
                              </span>
                            )}
                          </div>

                          {/* In-line Name Display or Editing Form */}
                          {isEditingThisName ? (
                            <div className="p-3 bg-[#0a0f18] rounded-2xl border border-[#d97706] space-y-2">
                              <label className="block text-[11px] text-[#ffdcc3] font-semibold">
                                Edit Companion Name (Owner Override)
                              </label>
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="w-full px-3 py-2 bg-[#131c2e] border border-[#3b4e6d] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#d97706]"
                                placeholder="Enter approved companion name"
                                autoFocus
                              />
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditedName(dog.id)}
                                  className="py-1.5 px-3 bg-[#d97706] hover:bg-[#b45309] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                >
                                  Save & Approve Name
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingDogId(null)}
                                  className="py-1.5 px-3 bg-[#1b273d] hover:bg-[#263753] text-[#cbd7ef] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 bg-[#0a0f18] rounded-2xl border border-[#22314a] flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-bold text-[#82f5c1] uppercase tracking-wider">
                                  {dog.breed} • {dog.gender}
                                </span>
                                <h3 className="font-['Epilogue'] font-black text-xl text-white mt-0.5 flex items-center gap-2">
                                  <span>{dog.name}</span>
                                  {dog.ageText && (
                                    <span className="text-xs font-normal text-[#93a6c8]">({dog.ageText})</span>
                                  )}
                                </h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDogId(dog.id);
                                  setEditingName(dog.name);
                                }}
                                className="py-1.5 px-2.5 bg-[#172338] hover:bg-[#243755] border border-[#2b3d5a] text-[#ffdcc3] rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Edit companion name"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                <span>Rename</span>
                              </button>
                            </div>
                          )}

                          {dog.nameNotes && (
                            <p className="text-[11px] text-[#93a6c8] bg-[#0a0f18] p-2 rounded-xl border border-[#1e2b40] italic">
                              &ldquo;{dog.nameNotes}&rdquo;
                            </p>
                          )}

                          {/* Companion Details Pill Grid */}
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 bg-[#0a0f18] rounded-xl border border-[#1e2b40]">
                              <span className="text-[#6f83a7] block text-[10px]">Breeder & Kennel</span>
                              <span className="font-bold text-white truncate block">{dog.breederName}</span>
                            </div>
                            <div className="p-2 bg-[#0a0f18] rounded-xl border border-[#1e2b40]">
                              <span className="text-[#6f83a7] block text-[10px]">Location & Price</span>
                              <span className="font-bold text-[#ffdcc3] block">${dog.price.toLocaleString()} • {dog.location}</span>
                            </div>
                          </div>

                          {/* Name Moderation Buttons */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <button
                              onClick={() => handleApproveName(dog)}
                              className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                isNameApproved
                                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/60'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">done</span>
                              <span>Approve Name</span>
                            </button>

                            <button
                              onClick={() => handleFlagName(dog)}
                              className="py-1.5 px-2.5 bg-[#251e16] hover:bg-[#3d2f21] border border-amber-700/60 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Flag name for formatting or content"
                            >
                              <span className="material-symbols-outlined text-sm">flag</span>
                              <span>Flag Name</span>
                            </button>

                            <button
                              onClick={() => handleRejectName(dog)}
                              className="py-1.5 px-2.5 bg-[#2b1617] hover:bg-[#422123] border border-red-700/50 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Reject name"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>

                        {/* Column 3: Overall Dossier Approval & Public Marketplace Actions (Cols 9-12) */}
                        <div className="lg:col-span-3 bg-[#0c1320] p-4 rounded-2xl border border-[#1e2c43] space-y-3.5 flex flex-col justify-between h-full">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#6f83a7] font-semibold">Catalog Status</span>
                              {isFullyApproved ? (
                                <span className="text-[10px] font-bold text-[#82f5c1] bg-[#006c4a]/30 border border-[#006c4a] px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">public</span>
                                  <span>LIVE ON MARKETPLACE</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-700/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">lock_clock</span>
                                  <span>APPROVAL PENDING</span>
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-[#93a6c8] space-y-1 bg-[#0a0f18] p-2.5 rounded-xl border border-[#1c293d]">
                              <div className="flex items-center justify-between">
                                <span>Picture:</span>
                                <span className={isPhotoApproved ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                                  {isPhotoApproved ? '✓ Verified' : 'Pending'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Name:</span>
                                <span className={isNameApproved ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                                  {isNameApproved ? '✓ Verified' : 'Pending'}
                                </span>
                              </div>
                              {dog.submittedAt && (
                                <div className="flex items-center justify-between text-[10px] text-[#5c7094] pt-1 border-t border-[#1c293d]">
                                  <span>Submitted:</span>
                                  <span>{dog.submittedAt}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleApproveBoth(dog)}
                              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isFullyApproved
                                  ? 'bg-[#1b2b22] text-[#82f5c1] border border-emerald-600/50 hover:bg-[#23382c]'
                                  : 'bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white shadow-lg shadow-[#d97706]/20'
                              }`}
                            >
                              <span className="material-symbols-outlined text-base">verified</span>
                              <span>{isFullyApproved ? 'Re-Approve Dossier' : 'Approve Both Picture & Name'}</span>
                            </button>

                            {onSelectDogPreview && (
                              <button
                                type="button"
                                onClick={() => onSelectDogPreview(dog)}
                                className="w-full py-2 px-3 bg-[#172338] hover:bg-[#21324d] text-[#cbd7ef] border border-[#2b3d5a] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                <span>Preview Listing View</span>
                              </button>
                            )}
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Add New Submission (Allows testing the review pipeline) */}
        {activeTab === 'new-submission' && (
          <div className="max-w-2xl mx-auto bg-[#111928] rounded-3xl border border-[#22314a] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#22314a] pb-4">
              <span className="text-[10px] font-bold text-[#ffdcc3] uppercase tracking-wider bg-[#d97706]/20 border border-[#d97706]/40 px-2.5 py-1 rounded-full">
                Owner Direct Intake Pipeline
              </span>
              <h2 className="font-['Epilogue'] font-bold text-xl text-white mt-2">
                Submit Companion Listing for Owner Approval
              </h2>
              <p className="text-xs text-[#93a6c8] mt-1">
                Simulate or intake a companion dossier with picture and name to test the visual moderation workflow.
              </p>
            </div>

            <form onSubmit={handleCreateSubmission} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd7ef] mb-1">
                    Companion Name *
                  </label>
                  <input
                    type="text"
                    value={newDogName}
                    onChange={(e) => setNewDogName(e.target.value)}
                    placeholder="e.g. Copper, Daisy, Winston"
                    className="w-full px-3.5 py-2.5 bg-[#0a0f18] border border-[#2b3d5a] focus:border-[#d97706] rounded-xl text-xs text-white placeholder-[#5c7094] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cbd7ef] mb-1">
                    Breed *
                  </label>
                  <select
                    value={newDogBreed}
                    onChange={(e) => setNewDogBreed(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0f18] border border-[#2b3d5a] focus:border-[#d97706] rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="Golden Retriever">Golden Retriever</option>
                    <option value="Australian Shepherd">Australian Shepherd</option>
                    <option value="French Bulldog">French Bulldog</option>
                    <option value="German Shepherd">German Shepherd</option>
                    <option value="Labrador Retriever">Labrador Retriever</option>
                    <option value="Bernese Mountain Dog">Bernese Mountain Dog</option>
                    <option value="Pembroke Welsh Corgi">Pembroke Welsh Corgi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd7ef] mb-1">
                    Adoption Fee ($)
                  </label>
                  <input
                    type="number"
                    value={newDogPrice}
                    onChange={(e) => setNewDogPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0f18] border border-[#2b3d5a] focus:border-[#d97706] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cbd7ef] mb-1">
                    Location (City, State)
                  </label>
                  <input
                    type="text"
                    value={newDogLocation}
                    onChange={(e) => setNewDogLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0f18] border border-[#2b3d5a] focus:border-[#d97706] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cbd7ef] mb-1">
                    Kennel / Breeder Name
                  </label>
                  <input
                    type="text"
                    value={newDogBreeder}
                    onChange={(e) => setNewDogBreeder(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0f18] border border-[#2b3d5a] focus:border-[#d97706] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#cbd7ef]">
                  Select or Enter Companion Picture URL
                </label>
                <input
                  type="url"
                  value={newDogImage}
                  onChange={(e) => setNewDogImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-[#0a0f18] border border-[#2b3d5a] focus:border-[#d97706] rounded-xl text-xs text-white focus:outline-none font-mono"
                />

                <p className="text-[11px] text-[#93a6c8]">Or pick from verified studio photos:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CURATED_REPLACEMENT_PHOTOS.slice(0, 4).map((curated, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewDogImage(curated.url)}
                      className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        newDogImage === curated.url
                          ? 'bg-[#1b273d] border-[#d97706]'
                          : 'bg-[#0a0f18] border-[#22314a] hover:border-[#354c70]'
                      }`}
                    >
                      <img src={curated.url} alt={curated.label} className="w-full h-14 object-cover rounded-lg" />
                      <span className="text-[10px] text-white font-medium truncate">{curated.breed}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#22314a]">
                <button
                  type="button"
                  onClick={() => setActiveTab('listings')}
                  className="py-2.5 px-4 bg-[#172338] hover:bg-[#20314d] text-[#cbd7ef] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-[#d97706]/20 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Submit for Review Queue</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Breeder & User Profiles Review */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-[#111928] rounded-2xl border border-[#22314a] p-5">
              <h3 className="font-['Epilogue'] font-bold text-base text-white">
                Breeder & Adopter Avatar & Display Name Governance
              </h3>
              <p className="text-xs text-[#93a6c8] mt-0.5">
                Inspect registered users and verified breeder accounts to ensure their avatar pictures and public display names comply with ethical community policies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userReviewItems.map((u) => (
                <div key={u.id} className="bg-[#111928] rounded-2xl border border-[#22314a] p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#2b3d5a]"
                      />
                      {u.avatarStatus === 'approved' && (
                        <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5">
                          <span className="material-symbols-outlined text-xs block">check</span>
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-[#ffdcc3] bg-[#ffdcc3]/10 px-2 py-0.5 rounded-md">
                        {u.role}
                      </span>
                      <h4 className="font-bold text-sm text-white truncate mt-1">{u.name}</h4>
                      <p className="text-xs text-[#93a6c8] truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1e2c43] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6f83a7]">Name Status:</span>
                      <span className={u.nameStatus === 'approved' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {u.nameStatus === 'approved' ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6f83a7]">Avatar Picture:</span>
                      <span className={u.avatarStatus === 'approved' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {u.avatarStatus === 'approved' ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleApproveUserName(u.id)}
                        className="flex-1 py-1.5 px-2 bg-[#172338] hover:bg-[#233552] border border-[#2f4365] text-white rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        Approve Name
                      </button>
                      <button
                        onClick={() => handleApproveUserAvatar(u.id)}
                        className="flex-1 py-1.5 px-2 bg-[#172338] hover:bg-[#233552] border border-[#2f4365] text-[#ffdcc3] rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        Approve Avatar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Guidelines & Policy Reference */}
        {activeTab === 'guidelines' && (
          <div className="bg-[#111928] rounded-3xl border border-[#22314a] p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-[#22314a] pb-4">
              <span className="text-[10px] font-bold text-[#82f5c1] uppercase tracking-wider bg-[#006c4a]/30 border border-[#006c4a] px-2.5 py-1 rounded-full">
                Compliance Protocol
              </span>
              <h2 className="font-['Epilogue'] font-bold text-xl text-white mt-2">
                Platform Owner Moderation & Approval Standards
              </h2>
              <p className="text-xs text-[#93a6c8] mt-1">
                Enforced by the Platform Owner before companion listings are published to prospective adopters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#cbd7ef]">
              <div className="p-5 rounded-2xl bg-[#0a0f18] border border-[#22314a] space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <span className="material-symbols-outlined text-[#ffdcc3]">photo_camera</span>
                  <h4>Picture Approval Criteria</h4>
                </div>
                <ul className="space-y-2 list-disc list-inside text-[#93a6c8] leading-relaxed">
                  <li><strong>Authenticity:</strong> Photos must be taken of the actual individual puppy, not generic stock photography or AI generation.</li>
                  <li><strong>Lighting & Clarity:</strong> The face, eyes, and coat markings must be in crisp focus and natural lighting.</li>
                  <li><strong>Watermarks:</strong> No contact phone numbers, external URLs, or unsolicited advertising banners stamped on the photo.</li>
                  <li><strong>Living Environment:</strong> The background must reflect a clean, sanitary nursery, living room, or lawn; never concrete cages or commercial mills.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#0a0f18] border border-[#22314a] space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <span className="material-symbols-outlined text-[#ffdcc3]">badge</span>
                  <h4>Name Approval Criteria</h4>
                </div>
                <ul className="space-y-2 list-disc list-inside text-[#93a6c8] leading-relaxed">
                  <li><strong>Clean Format:</strong> Names should be formatted in Title Case (e.g. &ldquo;Archie&rdquo;, &ldquo;Bella Mae&rdquo;), not ALL CAPS.</li>
                  <li><strong>No Spam Acronyms:</strong> Breed names or phone digits must not be stuffed into the pet name field.</li>
                  <li><strong>Respectful & Kind:</strong> Offensive, derogatory, or misleading pedigree claims must be flagged and revised.</li>
                  <li><strong>Kennel Suffix:</strong> Registered kennel names are permitted when verified by OFA/AKC pedigree records.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modal: Replace / Edit Photo */}
      {isReplacePhotoModalOpen && selectedDogForPhotoReplace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#111928] border border-[#2b3d5a] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#22314a] pb-3">
              <div>
                <h3 className="font-bold text-base text-white">
                  Replace Picture for &ldquo;{selectedDogForPhotoReplace.name}&rdquo;
                </h3>
                <p className="text-xs text-[#93a6c8]">Update photo URL or pick from verified library</p>
              </div>
              <button
                onClick={() => setIsReplacePhotoModalOpen(false)}
                className="p-1 text-[#93a6c8] hover:text-white rounded-full hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#cbd7ef] font-semibold mb-1">
                  Custom Picture URL
                </label>
                <input
                  type="url"
                  value={editingPhotoUrl}
                  onChange={(e) => setEditingPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#0a0f18] border border-[#2b3d5a] focus:border-[#d97706] rounded-xl text-xs text-white font-mono focus:outline-none"
                />
              </div>

              {/* Preview image */}
              {editingPhotoUrl && (
                <div className="space-y-1">
                  <span className="text-[10px] text-[#6f83a7]">Live Image Preview:</span>
                  <div className="aspect-16/9 rounded-xl overflow-hidden border border-[#2b3d5a] bg-[#0a0f18]">
                    <img src={editingPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Curated quick picks */}
              <div>
                <span className="text-[11px] text-[#93a6c8] font-semibold block mb-1.5">
                  Or pick a verified studio photo:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {CURATED_REPLACEMENT_PHOTOS.slice(0, 4).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingPhotoUrl(p.url)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                        editingPhotoUrl === p.url
                          ? 'bg-[#1b273d] border-[#d97706]'
                          : 'bg-[#0a0f18] border-[#22314a] hover:border-[#354c70]'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-white block truncate">{p.breed}</span>
                        <span className="text-[9px] text-[#93a6c8] block truncate">{p.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#22314a] flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsReplacePhotoModalOpen(false)}
                className="py-2 px-3.5 bg-[#172338] hover:bg-[#20314d] text-[#cbd7ef] rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReplacedPhoto}
                className="py-2 px-4 bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl font-bold cursor-pointer shadow-md shadow-[#d97706]/20 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                <span>Save & Approve Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Full Resolution Zoom & Photo Inspector */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-[#111928] border border-[#2b3d5a] rounded-3xl overflow-hidden shadow-2xl space-y-4"
          >
            <div className="p-4 bg-[#0a0f18] border-b border-[#22314a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffdcc3]">zoom_in</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Full-Resolution Visual Inspection</h4>
                  <p className="text-xs text-[#93a6c8]">{zoomedImage.dog.name} • {zoomedImage.dog.breed}</p>
                </div>
              </div>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-1.5 text-[#93a6c8] hover:text-white rounded-full hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-4 flex justify-center bg-black/60">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="p-4 border-t border-[#22314a] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#93a6c8]">
                <span className="material-symbols-outlined text-sm text-emerald-400">check</span>
                <span>Resolution & Lighting Clear</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleApprovePhoto(zoomedImage.dog);
                    setZoomedImage(null);
                  }}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">done</span>
                  <span>Approve This Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleFlagPhoto(zoomedImage.dog);
                    setZoomedImage(null);
                  }}
                  className="py-1.5 px-3 bg-amber-950 hover:bg-amber-900 border border-amber-700/60 text-amber-300 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">flag</span>
                  <span>Flag Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
