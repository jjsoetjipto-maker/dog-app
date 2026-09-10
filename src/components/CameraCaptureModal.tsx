import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string) => void;
  title?: string;
  subtitle?: string;
  subjectType: 'dog' | 'gear';
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title,
  subtitle,
  subjectType
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraState, setCameraState] = useState<'idle' | 'starting' | 'active' | 'error' | 'captured'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashActive, setFlashActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [useCountdown, setUseCountdown] = useState(false);

  // Fallback sample photos if user cannot use camera (e.g. no hardware)
  const samplePhotos = subjectType === 'dog' ? [
    {
      label: 'Golden Puppy pose',
      url: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'French Bulldog front',
      url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Labrador Outdoor',
      url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'German Shepherd portrait',
      url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80'
    }
  ] : [
    {
      label: 'Orthopedic Bed',
      url: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Adventure Harness',
      url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Travel Crate',
      url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Smart GPS Collar',
      url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async (desiredFacing: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setCameraState('starting');
    setErrorMessage('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('error');
      setErrorMessage('Camera access is not supported on this browser or platform. You can upload a photo instead.');
      return;
    }

    try {
      // First try with facingMode
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: desiredFacing,
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        // Fallback without strict facing mode
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState('active');
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraState('error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was declined or blocked. Please allow camera access in your browser or upload a photo.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device was detected on your system. You can upload an image file directly.');
      } else {
        setErrorMessage(err.message || 'Unable to access camera. You can upload an image file instead.');
      }
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null);
      startCamera(facingMode);
    } else {
      stopCamera();
      setCameraState('idle');
      setCapturedPhoto(null);
      setCountdown(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera, facingMode]);

  const snapPhoto = () => {
    if (!videoRef.current) return;

    // Flash effect
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, flip horizontally so it acts like a mirror
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    stopCamera();
    setCapturedPhoto(dataUrl);
    setCameraState('captured');
  };

  const handleTriggerSnap = () => {
    if (useCountdown) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            snapPhoto();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      snapPhoto();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera(facingMode);
  };

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        stopCamera();
        setCapturedPhoto(reader.result);
        setCameraState('captured');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSamplePhoto = (url: string) => {
    stopCamera();
    setCapturedPhoto(url);
    setCameraState('captured');
  };

  if (!isOpen) return null;

  const defaultTitle = subjectType === 'dog' 
    ? 'Take Companion Dog Photo' 
    : 'Take Equipment & Gear Photo';

  const defaultSubtitle = subjectType === 'dog'
    ? 'Snap a live photo of the puppy or dog for verified ethical review'
    : 'Snap a live photo of your canine gear showing condition and authenticity';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        id="camera-capture-modal"
        className="w-full max-w-xl bg-[#111c2d] text-white rounded-3xl overflow-hidden shadow-2xl border border-[#2b3e5f] flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#22314a] flex items-center justify-between bg-[#152338]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdcc3] text-[#8d4b00] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">
                {subjectType === 'dog' ? 'pets' : 'photo_camera'}
              </span>
            </div>
            <div>
              <h3 className="font-['Epilogue'] font-bold text-base text-white">
                {title || defaultTitle}
              </h3>
              <p className="text-xs text-[#9fb0cf]">
                {subtitle || defaultSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Close camera"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Hidden File Input for alternative upload / device camera */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Viewfinder / Capture Canvas Container */}
        <div className="relative bg-black flex-1 min-h-[300px] sm:min-h-[380px] flex items-center justify-center overflow-hidden">
          {/* Flash animation */}
          {flashActive && (
            <div className="absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-150" />
          )}

          {/* Countdown indicator */}
          {countdown !== null && (
            <div className="absolute inset-0 z-25 flex items-center justify-center bg-black/40 backdrop-blur-xs">
              <span className="text-7xl font-black text-white drop-shadow-lg animate-ping">
                {countdown}
              </span>
            </div>
          )}

          {/* Active Live Video Stream */}
          {cameraState === 'active' && (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover max-h-[460px] ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder Guide Overlay Frame */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
                <div className="w-full flex justify-between items-center text-xs">
                  <span className="bg-black/60 text-[#ffdcc3] px-3 py-1 rounded-full border border-white/20 backdrop-blur-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span>LIVE VIEWFINDER</span>
                  </span>
                  <span className="bg-black/60 text-white/80 px-2.5 py-1 rounded-full text-[11px] backdrop-blur-xs">
                    {facingMode === 'environment' ? 'Rear Camera' : 'Front Camera'}
                  </span>
                </div>

                {/* Framing Box */}
                <div className="w-64 h-56 sm:w-80 sm:h-64 border-2 border-white/40 border-dashed rounded-3xl flex items-center justify-center relative shadow-inner">
                  <div className="text-center px-4 py-2 bg-black/50 rounded-2xl backdrop-blur-xs border border-white/10">
                    <span className="material-symbols-outlined text-white/70 text-2xl">
                      {subjectType === 'dog' ? 'pets' : 'center_focus_strong'}
                    </span>
                    <p className="text-[11px] font-semibold text-white/90 mt-1">
                      {subjectType === 'dog' ? 'Center companion inside frame' : 'Center equipment item in frame'}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-white/70 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                  Ensure good natural lighting for quick verification approval
                </div>
              </div>
            </div>
          )}

          {/* Starting / Loading Spinner */}
          {cameraState === 'starting' && (
            <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="w-10 h-10 border-3 border-[#ffdcc3] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-[#ffdcc3]">Initializing Camera Device...</p>
              <p className="text-[11px] text-[#9fb0cf]">Please grant camera access when prompted by browser</p>
            </div>
          )}

          {/* Captured Review Preview */}
          {cameraState === 'captured' && capturedPhoto && (
            <div className="relative w-full h-full flex items-center justify-center bg-[#0d1420]">
              <img
                src={capturedPhoto}
                alt="Captured Snapshot"
                className="w-full h-full object-contain max-h-[440px]"
              />
              <div className="absolute top-4 left-4 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-xs">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Photo Captured Successfully</span>
              </div>
            </div>
          )}

          {/* Error State with Fallback UI */}
          {cameraState === 'error' && (
            <div className="flex flex-col items-center justify-center p-6 text-center max-w-md">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-3xl">videocam_off</span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Camera Feed Unavailable</h4>
              <p className="text-xs text-[#cbd7ef] mb-4 leading-relaxed">
                {errorMessage}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>Upload from Files / Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="w-full sm:w-auto py-2.5 px-4 bg-[#1e2f4a] hover:bg-[#283e60] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all border border-[#3b547d]"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  <span>Retry</span>
                </button>
              </div>

              {/* Sample Photo Picks */}
              <div className="w-full mt-5 pt-4 border-t border-[#22314a]">
                <p className="text-[11px] text-[#8ea4c8] mb-2 font-medium">Or choose a verified sample photo:</p>
                <div className="grid grid-cols-4 gap-2">
                  {samplePhotos.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSamplePhoto(sample.url)}
                      className="group relative rounded-xl overflow-hidden border border-[#2b3e5f] hover:border-[#ffdcc3] transition-all cursor-pointer aspect-square"
                      title={sample.label}
                    >
                      <img src={sample.url} alt={sample.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#22314a] bg-[#152338]">
          {cameraState === 'active' && (
            <div className="flex items-center justify-between gap-3">
              {/* Camera Switch / Flip Button */}
              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="p-3 bg-[#1e2f4a] hover:bg-[#283e60] text-white rounded-2xl border border-[#374f75] cursor-pointer transition-all flex items-center gap-1 text-xs font-semibold"
                title="Switch Camera (Front/Back)"
              >
                <span className="material-symbols-outlined text-lg">flip_camera_ios</span>
                <span className="hidden sm:inline">Flip</span>
              </button>

              {/* Shutter Button (Center) */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTriggerSnap}
                  className="w-16 h-16 rounded-full bg-white text-[#111c2d] flex items-center justify-center border-4 border-[#ffdcc3] hover:scale-105 active:scale-95 shadow-xl transition-all cursor-pointer"
                  title="Take Photo"
                >
                  <span className="material-symbols-outlined text-3xl text-[#8d4b00]">photo_camera</span>
                </button>
              </div>

              {/* Timer & Upload fallback buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUseCountdown(!useCountdown)}
                  className={`p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                    useCountdown 
                      ? 'bg-[#ffdcc3] text-[#8d4b00] border-[#ffdcc3]' 
                      : 'bg-[#1e2f4a] text-white border-[#374f75] hover:bg-[#283e60]'
                  }`}
                  title="3-Second Timer"
                >
                  <span className="material-symbols-outlined text-lg">timer_3</span>
                  <span className="hidden sm:inline">{useCountdown ? '3s On' : 'Timer'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-[#1e2f4a] hover:bg-[#283e60] text-white rounded-2xl border border-[#374f75] cursor-pointer transition-all flex items-center gap-1 text-xs font-semibold"
                  title="Upload image from file"
                >
                  <span className="material-symbols-outlined text-lg">attach_file</span>
                  <span className="hidden sm:inline">File</span>
                </button>
              </div>
            </div>
          )}

          {cameraState === 'captured' && (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="py-3 px-5 bg-[#1e2f4a] hover:bg-[#283e60] text-white rounded-2xl border border-[#374f75] cursor-pointer transition-all flex items-center gap-2 text-xs font-bold"
              >
                <span className="material-symbols-outlined text-lg">replay</span>
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="py-3 px-6 bg-[#006c4a] hover:bg-[#00875c] text-white rounded-2xl cursor-pointer transition-all flex items-center gap-2 text-xs font-bold shadow-lg shadow-[#006c4a]/30"
              >
                <span className="material-symbols-outlined text-lg">check</span>
                <span>Use This Photo</span>
              </button>
            </div>
          )}

          {cameraState === 'error' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-[#1e2f4a] hover:bg-[#283e60] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
