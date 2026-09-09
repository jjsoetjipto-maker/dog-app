import React, { useState, useRef } from 'react';
import { PawPrint } from 'lucide-react';
import { UserProfile } from '../types';
import { DEMO_ACCOUNTS } from '../data/userData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onShowToast: (msg: string) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('marcus.vance@example.com');
  const [loginPassword, setLoginPassword] = useState('guardianpass123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupLocation, setSignupLocation] = useState('Austin, TX');
  const [signupRole, setSignupRole] = useState<'guardian' | 'adopter' | 'breeder'>('guardian');
  const [signupAvatar, setSignupAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80');
  const [signupPhotoName, setSignupPhotoName] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const signupFileInputRef = useRef<HTMLInputElement>(null);
  const signupCameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSignupPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Please choose a valid image file from your photos.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Image size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSignupAvatar(event.target.result);
        setSignupPhotoName(file.name);
        onShowToast(`Photo "${file.name}" selected from your device!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      onShowToast('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Check if it matches a demo account or construct a dynamic user
      const matchedDemo = DEMO_ACCOUNTS.find(
        (d) => d.user.email.toLowerCase() === loginEmail.toLowerCase()
      );

      const authenticatedUser: UserProfile = matchedDemo
        ? { ...matchedDemo.user, isLoggedIn: true }
        : {
            id: `user-${Date.now()}`,
            name: loginEmail.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()) || 'Guardian User',
            email: loginEmail,
            phone: '(512) 555-0182',
            location: 'Austin, TX',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
            role: 'guardian',
            bio: 'Ethical dog lover and dedicated guardian.',
            isLoggedIn: true
          };

      onLoginSuccess(authenticatedUser);
      onShowToast(`Welcome back, ${authenticatedUser.name}!`);
      onClose();
    }, 600);
  };

  const handleDemoLogin = (user: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ ...user, isLoggedIn: true });
      onShowToast(`Signed in as ${user.name}`);
      onClose();
    }, 400);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      onShowToast('Please complete all required fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim() || '(512) 890-4100',
        location: signupLocation.trim() || 'Austin, TX',
        avatarUrl: signupAvatar,
        role: signupRole,
        bio: `${signupName}’s verified PawPalace profile. Passionate companion advocate.`,
        isLoggedIn: true
      };

      onLoginSuccess(newUser);
      onShowToast(`Account created! Welcome to PawPalace, ${newUser.name}!`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        id="auth-modal-dialog"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#dee8ff] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-[#f9f9ff] to-white border-b border-[#dee8ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] border border-[#ffcfad] text-[#8d4b00] flex items-center justify-center shadow-xs">
              <PawPrint className="w-6 h-6 text-[#8d4b00] fill-[#8d4b00]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#111c2d] tracking-tight">
                {mode === 'login' ? 'Welcome Back' : 'Join PawPalace'}
              </h2>
              <p className="text-[11px] text-[#887364]">
                {mode === 'login' ? 'Sign in to access applications & saved companions' : 'Create an ethical companion guardian profile'}
              </p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#554336] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-4 pb-2">
          <div className="bg-[#f0f3ff] p-1 rounded-2xl flex text-xs font-bold">
            <button
              id="tab-auth-login"
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-[#111c2d] shadow-xs' : 'text-[#887364] hover:text-[#111c2d]'
              }`}
            >
              Log In
            </button>
            <button
              id="tab-auth-signup"
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-white text-[#111c2d] shadow-xs' : 'text-[#887364] hover:text-[#111c2d]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#887364]">
                    mail
                  </span>
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111c2d]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => onShowToast('Demo password reset link sent to your inbox.')}
                    className="text-[11px] font-semibold text-[#8d4b00] hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#887364]">
                    lock
                  </span>
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#887364] hover:text-[#111c2d] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#554336]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8d4b00] focus:ring-[#8d4b00] border-[#dee8ff]"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">login</span>
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* 1-Click Fast Demo Logins */}
              <div className="pt-3 border-t border-[#f0f3ff]">
                <p className="text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-2">
                  Or One-Click Test Accounts:
                </p>
                <div className="space-y-1.5">
                  {DEMO_ACCOUNTS.map((demo) => (
                    <button
                      key={demo.user.id}
                      type="button"
                      onClick={() => handleDemoLogin(demo.user)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[#f0f3ff] hover:bg-[#e7eeff] transition-colors text-left cursor-pointer border border-[#dee8ff]/50"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={demo.user.avatarUrl}
                          alt={demo.user.name}
                          className="w-7 h-7 rounded-full object-cover border border-white"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#111c2d] leading-tight">
                            {demo.user.name}
                          </p>
                          <p className="text-[10px] text-[#887364]">
                            {demo.user.location} • {demo.user.role}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#8d4b00] bg-white px-2 py-0.5 rounded-md border border-[#ffdcc3]">
                        Switch
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">
                  Full Name *
                </label>
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full px-3 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] mb-1">
                    Email *
                  </label>
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="w-full px-3 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] mb-1">
                    Phone
                  </label>
                  <input
                    id="signup-phone-input"
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="(512) 000-0000"
                    className="w-full px-3 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] mb-1">
                    Password *
                  </label>
                  <input
                    id="signup-password-input"
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111c2d] mb-1">
                    City, State
                  </label>
                  <input
                    id="signup-location-input"
                    type="text"
                    value={signupLocation}
                    onChange={(e) => setSignupLocation(e.target.value)}
                    placeholder="Austin, TX"
                    className="w-full px-3 py-2.5 bg-[#f9f9ff] border border-[#dee8ff] rounded-xl text-xs text-[#111c2d] font-semibold focus:outline-none focus:border-[#8d4b00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111c2d] mb-1">
                  I am a...
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSignupRole('guardian')}
                    className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                      signupRole === 'guardian'
                        ? 'border-[#8d4b00] bg-[#ffdcc3]/30 text-[#8d4b00]'
                        : 'border-[#dee8ff] bg-[#f9f9ff] text-[#554336]'
                    }`}
                  >
                    Puppy Guardian
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('adopter')}
                    className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                      signupRole === 'adopter'
                        ? 'border-[#8d4b00] bg-[#ffdcc3]/30 text-[#8d4b00]'
                        : 'border-[#dee8ff] bg-[#f9f9ff] text-[#554336]'
                    }`}
                  >
                    Rescue Adopter
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('breeder')}
                    className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                      signupRole === 'breeder'
                        ? 'border-[#8d4b00] bg-[#ffdcc3]/30 text-[#8d4b00]'
                        : 'border-[#dee8ff] bg-[#f9f9ff] text-[#554336]'
                    }`}
                  >
                    Breeder / Kennel
                  </button>
                </div>
              </div>

              {/* Photo Selector - Direct from Device Photos */}
              <div className="bg-[#f9f9ff] p-3.5 rounded-2xl border border-[#dee8ff] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#111c2d]">
                    Profile Picture
                  </label>
                  {signupPhotoName && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Photo selected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="relative group">
                    <img
                      src={signupAvatar}
                      alt="Selected Avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#8d4b00] shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => signupFileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#8d4b00] text-white flex items-center justify-center shadow-xs hover:bg-[#b15f00] cursor-pointer"
                      title="Upload photo"
                    >
                      <span className="material-symbols-outlined text-[13px]">add_a_photo</span>
                    </button>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {signupPhotoName ? (
                      <p className="text-xs font-bold text-[#111c2d] truncate max-w-[200px]">
                        {signupPhotoName}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#887364] leading-tight">
                        Upload your personal photo from your camera roll or device files.
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        ref={signupFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleSignupPhotoUpload}
                        className="hidden"
                      />
                      <input
                        ref={signupCameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleSignupPhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => signupFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-[#dee8ff] hover:border-[#8d4b00] rounded-xl text-xs font-bold text-[#111c2d] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm text-[#8d4b00]">photo_library</span>
                        <span>Choose from Photos</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => signupCameraInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-white border border-[#dee8ff] hover:border-[#8d4b00] rounded-xl text-xs font-bold text-[#554336] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Take selfie or photo with camera"
                      >
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                id="signup-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating Guardian Account...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">person_add</span>
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
