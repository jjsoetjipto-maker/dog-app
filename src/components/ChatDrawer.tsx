import React, { useState, useEffect } from 'react';
import { Dog, ChatMessage, UserProfile, SafeMeetingPoint } from '../types';
import { SafeMeetingPointModal } from './SafeMeetingPointModal';
import { getFallbackMeetingPoints } from '../data/meetingPointsData';

interface ChatDrawerProps {
  dog: Dog;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ dog, user, isOpen, onClose, onShowToast }) => {
  const pronounSubject = dog.gender === 'Female' ? 'She' : 'He';
  const pronounPossessive = dog.gender === 'Female' ? 'her' : 'his';
  const userNameFirst = user?.name ? user.name.split(' ')[0] : 'Guardian';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: `init-${dog.id}`,
      sender: 'breeder',
      senderName: dog.breederName,
      text: `Hello ${userNameFirst}! Thank you for your interest in ${dog.name}. ${pronounSubject} is in exceptional health, energetic, and eager to meet ${pronounPossessive} prospective family. Both parents' OFA and genetic clearances are verified in ${pronounPossessive} PawPalace vault. Would you like to schedule an in-person or live video call this week?`,
      timestamp: 'Today at 10:14 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedMeetingPoint, setSelectedMeetingPoint] = useState<SafeMeetingPoint | null>(() => {
    return getFallbackMeetingPoints(dog?.location || 'Austin, TX')[0] || null;
  });

  // Synchronize chat messages whenever the user selects or inquires about a different dog or user profile changes
  useEffect(() => {
    if (!dog) return;
    const sub = dog.gender === 'Female' ? 'She' : 'He';
    const pos = dog.gender === 'Female' ? 'her' : 'his';
    const currentFirstName = user?.name ? user.name.split(' ')[0] : 'Guardian';
    setMessages([
      {
        id: `init-${dog.id}-${user?.id || 'default'}`,
        sender: 'breeder',
        senderName: dog.breederName,
        text: `Hello ${currentFirstName}! Thank you for your interest in ${dog.name}. ${sub} is in exceptional health, energetic, and eager to meet ${pos} prospective family. Both parents' OFA and genetic clearances are verified in ${pos} PawPalace vault. Would you like to schedule an in-person or live video call this week?`,
        timestamp: 'Just now'
      }
    ]);
    setInputText('');
  }, [dog.id, dog.name, dog.breederName, dog.gender, user?.name, user?.id]);

  if (!isOpen) return null;

  const quickPrompts = [
    '📍 Propose Safe Meeting Point',
    '📅 Schedule Live Video Call',
    '🧬 Ask about OFA & DNA records',
    '🚗 Ask about Flight Nanny Delivery',
    `🍼 What diet / food is ${dog.name} on?`
  ];

  const handleSelectMeetingPoint = (point: SafeMeetingPoint) => {
    setSelectedMeetingPoint(point);
    setIsMeetingModalOpen(false);

    const userMsg: ChatMessage = {
      id: `msg-mp-${Date.now()}`,
      sender: 'user',
      senderName: user?.name || 'Marcus Vance',
      text: `I would like to propose a verified meeting point for welcoming ${dog.name} at ${point.name}.`,
      timestamp: 'Just now',
      proposedMeetingPoint: point,
    };

    setMessages((prev) => [...prev, userMsg]);
    onShowToast(`Proposed "${point.name}" to ${dog.breederName}!`);

    // Simulate realistic breeder affirmative reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const breederReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'breeder',
        senderName: dog.breederName,
        text: `That is an excellent safe exchange point! ${point.name} is AAHA accredited, has plenty of well-lit parking, and is only 15 minutes away. We will have ${dog.name}'s AKC dossier, veterinary health certificate, and transition food pack ready for the escrow handoff!`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, breederReply]);
    }, 1200);
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (text.includes('Propose Safe Meeting Point') || text.includes('Meeting Point')) {
      setIsMeetingModalOpen(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: user?.name || 'Marcus Vance',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate realistic breeder reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = `Thank you for asking! For ${dog.name}, we are thrilled to accommodate that. Let me prepare the documentation and coordinate with our kennel coordinator right away.`;
      
      if (text.includes('Video') || text.includes('Call')) {
        replyText = `We would love to do a FaceTime / Zoom call! We have openings tomorrow at 2:00 PM CST or Thursday at 11:00 AM CST so you can see ${dog.name} playing with ${pronounPossessive} littermates.`;
      } else if (text.includes('OFA') || text.includes('DNA') || text.includes('records')) {
        replyText = `All official OFA numbers (Hips Excellent, Elbows Normal, Eyes Clear, Heart Doppler Clear) and the Embark 250-panel DNA report are attached right inside ${dog.name}'s verified certificate tab. I can also email the raw PDF certificates directly to you.`;
      } else if (text.includes('Delivery') || text.includes('Flight')) {
        replyText = `We offer chaperoned flight nanny delivery anywhere in the continental US! A licensed puppy concierge holds ${dog.name} in cabin under their seat, ensuring zero cargo stress. Ground transport is also available.`;
      } else if (text.includes('diet') || text.includes('food')) {
        replyText = `${dog.name} is currently eating Purina Pro Plan Puppy Large Breed Chicken & Rice kibble, supplemented with organic goat milk and NuVet Plus vitamins. We will send home a 5 lb transition bag with your starter kit!`;
      }

      const breederReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'breeder',
        senderName: dog.breederName,
        text: replyText,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, breederReply]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div 
        id="chat-drawer-container"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Chat Drawer Header */}
        <div className="p-4 bg-[#ffffff] border-b border-[#e7eeff] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={dog.image}
                alt={dog.name}
                className="w-12 h-12 rounded-xl object-cover border border-[#dee8ff]"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#006c4a] border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#111c2d]">
                  Inquiring about {dog.name}
                </h3>
                <span className="bg-[#ffdcc3] text-[#8d4b00] text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {dog.breed}
                </span>
              </div>
              <p className="text-xs text-[#554336] flex items-center gap-1">
                <span>{dog.breederName}</span>
                <span className="text-[#006c4a] material-symbols-outlined text-[14px]">verified</span>
              </p>
              <p className="text-[11px] text-[#006c4a] font-medium">
                {dog.breederBadge} • 99% Response Rate
              </p>
            </div>
          </div>

          <button
            id="chat-drawer-close-btn"
            onClick={onClose}
            className="p-2 text-[#887364] hover:text-[#111c2d] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Escrow Banner */}
        <div className="bg-[#f0f3ff] px-4 py-2.5 border-b border-[#dee8ff] flex items-center gap-2 text-xs text-[#006c4a]">
          <span className="material-symbols-outlined text-lg">verified_user</span>
          <span className="leading-snug">
            <strong>PawPalace Escrow Protection Active:</strong> Direct messaging is monitored for safety. Never wire funds outside the platform.
          </span>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9f9ff]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'breeder' && (
                <img
                  src={dog.image}
                  alt={dog.breederName}
                  className="w-7 h-7 rounded-full object-cover border border-[#dee8ff] mb-1 shrink-0"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#887364]">
                  <span>{m.senderName}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs space-y-2.5 ${
                    m.sender === 'user'
                      ? 'bg-[#8d4b00] text-white rounded-br-xs'
                      : 'bg-white text-[#111c2d] border border-[#e7eeff] rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.proposedMeetingPoint && (
                    <div
                      className={`p-3 rounded-xl border text-left space-y-1.5 ${
                        m.sender === 'user'
                          ? 'bg-black/15 border-white/20 text-white'
                          : 'bg-[#fffaf6] border-[#ffcfad] text-[#111c2d]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">pin_drop</span>
                          <span>Proposed Meeting Point</span>
                        </span>
                        <span className="text-[10px] opacity-80">Google Maps Grounded</span>
                      </div>
                      <p className="font-bold text-xs">{m.proposedMeetingPoint.name}</p>
                      <p className="text-[11px] opacity-90">{m.proposedMeetingPoint.address}</p>
                      <div className="flex items-center gap-2 pt-1 text-[10px]">
                        <a
                          href={m.proposedMeetingPoint.mapsUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold underline flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                          <span>Open in Google Maps</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {m.sender === 'user' && (
                <img
                  src={user?.avatarUrl}
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#ffdcc3] mb-1 shrink-0"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#887364] bg-white p-2.5 rounded-xl border border-[#e7eeff] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#8d4b00] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#8d4b00] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#8d4b00] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] font-medium ml-1">{dog.breederName} is typing...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-[#ffffff] border-t border-[#dee8ff]">
          <p className="text-[11px] font-bold text-[#887364] uppercase tracking-wider mb-2">
            Suggested Guardian Inquiries:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#554336] px-2.5 py-1.5 rounded-full border border-[#dee8ff] transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="p-3 bg-[#ffffff] border-t border-[#e7eeff]">
          <div className="flex items-center gap-2 bg-[#f0f3ff] rounded-2xl p-1.5 border border-[#dee8ff] focus-within:border-[#8d4b00] focus-within:ring-2 focus-within:ring-[#ffdcc3]">
            <button
              onClick={() => onShowToast('Audio call scheduling requested with breeder.')}
              className="p-1.5 text-[#887364] hover:text-[#8d4b00] hover:bg-white rounded-xl transition-colors cursor-pointer"
              title="Request Phone Call"
            >
              <span className="material-symbols-outlined text-lg">call</span>
            </button>
            <button
              onClick={() => onShowToast('Document attachment portal opened.')}
              className="p-1.5 text-[#887364] hover:text-[#8d4b00] hover:bg-white rounded-xl transition-colors cursor-pointer"
              title="Attach File"
            >
              <span className="material-symbols-outlined text-lg">attach_file</span>
            </button>
            <button
              onClick={() => setIsMeetingModalOpen(true)}
              className="p-1.5 text-[#887364] hover:text-[#8d4b00] hover:bg-white rounded-xl transition-colors cursor-pointer"
              title="Propose Safe Meeting Point (Google Maps Grounded)"
            >
              <span className="material-symbols-outlined text-lg text-[#8d4b00]">pin_drop</span>
            </button>
            
            <input
              id="chat-message-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={`Message ${dog.breederName}...`}
              className="flex-1 bg-transparent text-xs text-[#111c2d] placeholder-[#887364] focus:outline-none px-2"
            />

            <button
              id="chat-send-btn"
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="bg-[#8d4b00] hover:bg-[#b15f00] disabled:opacity-40 text-white p-2 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
          <p className="text-[10px] text-center text-[#887364] mt-2">
            Protected by PawPalace 256-bit encrypted escrow communication protocol.
          </p>
        </div>

      </div>

      {/* Safe Meeting Point Modal inside Chat */}
      <SafeMeetingPointModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        defaultLocation={dog.location}
        dogName={dog.name}
        dogBreed={dog.breed}
        selectedMeetingPoint={selectedMeetingPoint}
        onSelectMeetingPoint={handleSelectMeetingPoint}
        onShowToast={onShowToast}
      />
    </div>
  );
};
