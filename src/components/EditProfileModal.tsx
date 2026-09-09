import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  onShowToast: (msg: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  onShowToast
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [location, setLocation] = useState(user.location);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process selected file from device photos or camera
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please select a valid image file (JPG, PNG, WebP, HEIC).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Image size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatarUrl(event.target.result);
        setPhotoFileName(file.name);
        onShowToast(`Photo "${file.name}" loaded! Click "Save Profile Changes" to apply.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setPhotoFileName('Custom Web URL');
    setCustomUrlInput('');
    setShowUrlInput(false);
    onShowToast('Photo URL applied! Click "Save Profile Changes" to confirm.');
  };

  const handleRemovePhoto = () => {
    // Generate initials avatar placeholder or standard default
    const initialPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=ffdcc3&color=8d4b00&size=256&bold=true`;
    setAvatarUrl(initialPlaceholder);
    setPhotoFileName(null);
    onShowToast('Profile photo removed. You can pick another photo from your device.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Please provide your name.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const updated: UserProfile = {
        ...user,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim() || 'Austin, TX',
        bio: bio.trim(),
        avatarUrl: avatarUrl
      };

      onSave(updated);
      onShowToast('Profile & profile picture successfully updated!');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        id="edit-profile-modal-dialog"
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#dee8ff] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-b from-[#f9f9ff] to-white border-b border-[#dee8ff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] text-[#8d4b00] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-[#111c2d] tracking-tight">
                Update Profile & Photo
              </h2>
              <p className="text-[11px] text-[#887364]">
                Choose your own picture directly from your phone or computer photos
              </p>
            </div>
          </div>
          <button
            id="close-edit-profile-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#554336] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Photo Picker Section - Direct from Photos */}
          <div className="bg-[#f9f9ff] p-5 rounded-2xl border border-[#dee8ff] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-[#111c2d] uppercase tracking-wider">
                  Your Profile Picture
                </h3>
                <p className="text-[11px] text-[#887364]">
                  Upload your personal picture from your camera roll, photo albums, or files
                </p>
              </div>
              {photoFileName && (
                <span className="px-2.5 py-0.5 bg-[#ffdcc3] text-[#8d4b00] rounded-full text-[10px] font-bold">
                  Custom Photo Selected
                </span>
              )}
            </div>

            {/* Drag and drop & photo preview area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-2xl p-5 transition-all text-center flex flex-col items-center justify-center gap-3 ${
                isDragOver
                  ? 'border-[#8d4b00] bg-[#ffdcc3]/20 scale-[1.01]'
                  : 'border-[#dee8ff] bg-white hover:border-[#8d4b00]/60'
              }`}
            >
              {/* Circular Avatar Preview */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-[#8d4b00]/30 transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                  <span className="material-symbols-outlined text-xl">photo_library</span>
                  <span className="text-[10px] font-bold">Change</span>
                </div>
              </div>

              {/* Status or filename info */}
              {photoFileName ? (
                <div className="text-center">
                  <p className="text-xs font-bold text-[#111c2d] flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                    <span className="max-w-[200px] truncate">{photoFileName}</span>
                  </p>
                  <p className="text-[10px] text-[#887364]">
                    Photo ready to save
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xs font-bold text-[#111c2d]">
                    Choose a picture from your device photos
                  </p>
                  <p className="text-[11px] text-[#887364]">
                    Supports JPG, PNG, WebP, or HEIC (up to 10MB)
                  </p>
                </div>
              )}

              {/* Action Buttons to select from photos */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {/* Hidden File Input for browsing Photos / Camera Roll */}
                <input
                  ref={fileInputRef}
                  id="profile-photo-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Hidden Camera Input for capturing on mobile */}
                <input
                  ref={cameraInputRef}
                  id="profile-photo-camera-input"
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Primary Button: Choose from Photos */}
                <button
                  id="choose-from-photos-btn"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">photo_library</span>
                  <span>Choose from Photos</span>
                </button>

                {/* Secondary Button: Take Photo */}
                <button
                  id="take-photo-btn"
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-3.5 py-2 bg-white hover:bg-[#f0f3ff] border border-[#dee8ff] hover:border-[#8d4b00] text-[#111c2d] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-[#8d4b00]">photo_camera</span>
                  <span>Take Photo</span>
                </button>

                {/* Remove button if custom photo was loaded */}
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-2 bg-white hover:bg-[#ffdad6]/40 border border-[#dee8ff] hover:border-[#ba1a1a] text-[#ba1a1a] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Remove current photo"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  <span>Reset</span>
                </button>
              </div>

              {/* Drag instruction notice */}
              <p className="text-[10px] text-[#887364]">
                Tip: You can also drag and drop a photo file directly onto this box
              </p>
            </div>

            {/* Optional URL toggle */}
            <div className="pt-1">
              {!showUrlInput ? (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="text-[11px] text-[#8d4b00] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">link</span>
                  <span>Or use a link to an image from the web</span>
                </button>
              ) : (
                <div className="bg-white p-3 rounded-xl border border-[#dee8ff] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#111c2d]">
                      Web Image URL
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(false)}
                      className="text-[10px] text-[#887364] hover:underline cursor-pointer"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://example.com/my-photo.jpg"
                      className="flex-1 px-3 py-1.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] focus:outline-none focus:border-[#8d4b00]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3.5 py-1.5 bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Name & Basic Info Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Display Name *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#887364]">
                  person
                </span>
                <input
                  id="edit-profile-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#887364]">
                    mail
                  </span>
                  <input
                    id="edit-profile-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#887364]">
                    call
                  </span>
                  <input
                    id="edit-profile-phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(512) 000-0000"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">
                  Location (City, State)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#887364]">
                    location_on
                  </span>
                  <input
                    id="edit-profile-location-input"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Austin, TX"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">
                  Guardian Role
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#887364]">
                    shield
                  </span>
                  <select
                    value={user.role}
                    disabled
                    className="w-full pl-9 pr-4 py-2.5 bg-[#f0f3ff] border border-[#dee8ff] rounded-xl text-xs text-[#554336] font-semibold cursor-not-allowed opacity-80"
                  >
                    <option value="guardian">Verified Companion Guardian</option>
                    <option value="adopter">Accredited Rescue Adopter</option>
                    <option value="breeder">Ethical Breeder Partner</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111c2d] mb-1">
                Bio & Home Environment Note
              </label>
              <textarea
                id="edit-profile-bio-input"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell breeders and rescue coordinators about your household, fenced yard, and dog companionship experience..."
                className="w-full px-3 py-2 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] focus:outline-none focus:border-[#8d4b00] resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#dee8ff] text-xs font-bold text-[#554336] hover:bg-[#f0f3ff] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-profile-changes-btn"
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

