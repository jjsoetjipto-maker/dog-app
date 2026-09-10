import React, { useState, useEffect } from 'react';
import { Dog, ChatMessage, UserProfile, SafeMeetingPoint } from '../types';
import { SafeMeetingPointModal } from './SafeMeetingPointModal';
import { getFallbackMeetingPoints } from '../data/meetingPointsData';
import { getSellerForDog, getDogActivities } from '../data/dogCareAndActivities';

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

  const seller = getSellerForDog(dog);
  const activities = getDogActivities(dog);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: `init-${dog.id}`,
      sender: 'seller',
      senderName: seller.name,
      sellerProfile: seller,
      text: `Hello ${userNameFirst}! I'm ${seller.name}, the direct seller and caregiver of ${dog.name} at ${dog.breederName}. I've personally raised ${dog.name} with our family since birth, so I know ${pronounPossessive} personality, habits, and routine inside out! I'm here to chat with you directly about what ${dog.name} likes to do, ${pronounPossessive} health paperwork, or arrange a live video call. What would you like to know?`,
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
    const currentSeller = getSellerForDog(dog);

    setMessages([
      {
        id: `init-${dog.id}-${user?.id || 'default'}`,
        sender: 'seller',
        senderName: currentSeller.name,
        sellerProfile: currentSeller,
        text: `Hello ${currentFirstName}! I'm ${currentSeller.name}, the direct seller and caregiver of ${dog.name} at ${dog.breederName}. I've personally raised ${dog.name} with our family since birth, so I know ${pos} personality, habits, and routine inside out! I'm here to chat with you directly about what ${dog.name} likes to do, ${pos} health paperwork, or arrange a live video call. What would you like to know?`,
        timestamp: 'Just now'
      }
    ]);
    setInputText('');
  }, [dog.id, dog.name, dog.breederName, dog.gender, user?.name, user?.id]);

  if (!isOpen) return null;

  const quickPrompts = [
    `🎾 What does ${dog.name} like to do?`,
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
    onShowToast(`Proposed "${point.name}" to seller ${seller.name}!`);

    // Simulate realistic seller affirmative reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const sellerReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'seller',
        senderName: seller.name,
        sellerProfile: seller,
        text: `That is an excellent safe exchange point! As the seller, I know ${point.name} well — it is AAHA accredited, has plenty of well-lit parking, and is convenient for us. I will bring ${dog.name}'s AKC dossier, veterinary health certificate, and transition food pack ready for the escrow handoff!`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, sellerReply]);
    }, 1200);
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (text.includes('Propose Safe Meeting Point') || (text.includes('Meeting Point') && !text.includes('What does'))) {
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

    // Simulate realistic seller reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = `Thank you for asking! As ${dog.name}'s caregiver and seller here at ${dog.breederName}, I am delighted to share that with you. Let me coordinate any details right away.`;
      let attachedActivities: typeof activities | undefined = undefined;

      const lowerText = text.toLowerCase();

      // Check if user is asking what the dog likes to do
      if (
        lowerText.includes('like to do') ||
        lowerText.includes('likes to do') ||
        lowerText.includes('favorite') ||
        lowerText.includes('activities') ||
        lowerText.includes('hobbies') ||
        lowerText.includes('play') ||
        lowerText.includes('toys')
      ) {
        attachedActivities = activities;
        replyText = `I'm thrilled you asked! Because I care for ${dog.name} every single day, I know ${pronounPossessive} favorite activities and quirks by heart:\n\n` +
          `🎾 Favorite Toys: ${activities.favoriteToys.join(', ')}\n` +
          `🏃 Favorite Games: ${activities.favoriteGames.join(', ')}\n` +
          `🍖 Favorite Treats: ${activities.favoriteTreat}\n` +
          `💤 Downtime Style: ${activities.relaxationSpot}\n` +
          `✨ Charming Quirk: "${activities.dailyQuirk}"\n\n` +
          `${pronounSubject} has the happiest energy window between ${activities.energyWindow}. Would you like to schedule a live video call so I can show you ${dog.name} playing with ${pronounPossessive} favorite toy?`;
      } else if (lowerText.includes('video') || lowerText.includes('call')) {
        replyText = `I'd love to jump on a live video call with you! We have openings tomorrow at 2:00 PM CST or Thursday at 11:00 AM CST. I will have ${dog.name} right next to me with ${pronounPossessive} favorite toys so you can see ${pronounPossessive} cheerful personality live!`;
      } else if (lowerText.includes('ofa') || lowerText.includes('dna') || lowerText.includes('records') || lowerText.includes('health')) {
        replyText = `All official parent clearances and ${dog.name}'s vet records are fully verified in our seller vault. Both parents scored OFA Clear for hips, elbows, eyes, and heart. I can email the full laboratory PDF files directly to your inbox.`;
      } else if (lowerText.includes('delivery') || lowerText.includes('flight') || lowerText.includes('transport')) {
        replyText = `We personally coordinate flight nanny transport! A certified puppy escort carries ${dog.name} in cabin under their seat, giving ${dog.name} gentle care and water the entire journey. We also accommodate direct pickup at our facility.`;
      } else if (lowerText.includes('diet') || lowerText.includes('food')) {
        replyText = `${dog.name} is thriving on high-grade puppy kibble supplemented with organic goat milk and NuVet Plus vitamins. When you welcome ${dog.name}, I'll send home a complimentary 5 lb transition bag and feeding guideline chart!`;
      }

      const sellerReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'seller',
        senderName: seller.name,
        sellerProfile: seller,
        text: replyText,
        timestamp: 'Just now',
        activitiesInfo: attachedActivities
      };
      setMessages((prev) => [...prev, sellerReply]);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div 
        id="chat-drawer-container"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Chat Drawer Header: Prominently displaying the Seller */}
        <div className="p-4 bg-white border-b border-[#e7eeff] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Seller Avatar */}
            <div className="relative shrink-0">
              <img
                src={seller.avatarUrl}
                alt={seller.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#dee8ff] shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span 
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#006c4a] border-2 border-white rounded-full" 
                title="Seller is Online"
              ></span>
            </div>

            {/* Seller Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-sm text-[#111c2d] truncate">
                  {seller.name}
                </h3>
                <span className="bg-[#006c4a]/10 text-[#006c4a] border border-[#006c4a]/30 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  <span>Seller</span>
                </span>
              </div>
              <p className="text-xs text-[#554336] truncate">
                {seller.role}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#887364] mt-0.5">
                <span className="text-[#8d4b00] font-semibold">Placing {dog.name}</span>
                <span>•</span>
                <span>{seller.responseRate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Dog mini avatar pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#f0f3ff] border border-[#dee8ff] px-2 py-1 rounded-xl text-right">
              <img
                src={dog.image}
                alt={dog.name}
                className="w-6 h-6 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="text-[10px] text-left leading-tight">
                <span className="font-bold text-[#111c2d] block">{dog.name}</span>
                <span className="text-[#887364] block">{dog.breed.split(' ')[0]}</span>
              </div>
            </div>

            <button
              id="chat-drawer-close-btn"
              onClick={onClose}
              className="p-2 text-[#887364] hover:text-[#111c2d] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
              title="Close chat"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Direct Seller Security & Escrow Banner */}
        <div className="bg-[#f0f3ff] px-4 py-2 border-b border-[#dee8ff] flex items-center justify-between text-xs text-[#006c4a]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span className="text-[11px]">
              <strong>Direct Seller Chat:</strong> You are communicating directly with the verified caregiver of {dog.name}.
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#dee8ff] shrink-0">
            Escrow Protected
          </span>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9f9ff]">
          {messages.map((m) => {
            const isFromUser = m.sender === 'user';
            const isFromSeller = m.sender === 'seller' || m.sender === 'breeder';

            return (
              <div
                key={m.id}
                className={`flex items-end gap-2.5 ${isFromUser ? 'justify-end' : 'justify-start'}`}
              >
                {isFromSeller && (
                  <img
                    src={m.sellerProfile?.avatarUrl || seller.avatarUrl}
                    alt={m.senderName}
                    className="w-8 h-8 rounded-xl object-cover border border-[#dee8ff] mb-1 shrink-0 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                )}

                <div className={`flex flex-col ${isFromUser ? 'items-end' : 'items-start'} max-w-[88%] sm:max-w-md`}>
                  {/* Sender Name & Role Label */}
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#887364]">
                    <span className="font-bold text-[#111c2d]">
                      {isFromUser ? (user?.name || 'You') : `${m.senderName}`}
                    </span>
                    {isFromSeller && (
                      <span className="bg-[#006c4a]/10 text-[#006c4a] px-1.5 py-0.2 rounded font-bold text-[9px]">
                        Seller & Caregiver
                      </span>
                    )}
                    <span>•</span>
                    <span>{m.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs space-y-2.5 ${
                      isFromUser
                        ? 'bg-[#8d4b00] text-white rounded-br-xs'
                        : 'bg-white text-[#111c2d] border border-[#e7eeff] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* "What Does the Dog Like to Do" Interactive Activity Dossier Card */}
                    {m.activitiesInfo && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-[#fff9f4] border border-[#ffdcc3] text-[#111c2d] space-y-3 shadow-xs">
                        <div className="flex items-center justify-between gap-1 border-b border-[#ffe1cc] pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8d4b00] flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">sports_baseball</span>
                            <span>{dog.name}&apos;s Favorite Activities Dossier</span>
                          </span>
                          <span className="text-[10px] text-[#887364] bg-white px-2 py-0.5 rounded-md border border-[#ffdcc3]">
                            Direct Seller Notes
                          </span>
                        </div>

                        {/* Favorite Toys */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-[#111c2d] flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#8d4b00]">toys</span>
                            <span>Beloved Toys & Chews:</span>
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {m.activitiesInfo.favoriteToys.map((toy, tIdx) => (
                              <span
                                key={tIdx}
                                className="bg-white text-[#8d4b00] border border-[#ffdcc3] text-[11px] font-semibold px-2 py-0.5 rounded-lg"
                              >
                                {toy}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Favorite Games */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-[#111c2d] flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#006c4a]">directions_run</span>
                            <span>Favorite Games & Play:</span>
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {m.activitiesInfo.favoriteGames.map((game, gIdx) => (
                              <span
                                key={gIdx}
                                className="bg-white text-[#006c4a] border border-[#d2f4e3] text-[11px] font-semibold px-2 py-0.5 rounded-lg"
                              >
                                {game}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Quirk & Rest */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="bg-white p-2 rounded-xl border border-[#ffe1cc]">
                            <span className="font-bold text-[#8d4b00] block">✨ Daily Quirk:</span>
                            <span className="text-[#554336] leading-tight block mt-0.5">
                              {m.activitiesInfo.dailyQuirk}
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-[#ffe1cc]">
                            <span className="font-bold text-[#111c2d] block">💤 Relaxation Spot:</span>
                            <span className="text-[#554336] leading-tight block mt-0.5">
                              {m.activitiesInfo.relaxationSpot}
                            </span>
                          </div>
                        </div>

                        {/* Video Call Quick Button */}
                        <button
                          type="button"
                          onClick={() => handleSend(`I'd love to see ${dog.name} playing with ${pronounPossessive} favorite toys on a live video call!`)}
                          className="w-full py-2 bg-[#8d4b00] hover:bg-[#b15f00] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs mt-1"
                        >
                          <span className="material-symbols-outlined text-sm">videocam</span>
                          <span>Schedule Live Video Demo of Playtime</span>
                        </button>
                      </div>
                    )}

                    {/* Proposed Meeting Point Card */}
                    {m.proposedMeetingPoint && (
                      <div
                        className={`p-3 rounded-xl border text-left space-y-1.5 ${
                          isFromUser
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

                {isFromUser && (
                  <img
                    src={user?.avatarUrl}
                    alt={user?.name}
                    className="w-8 h-8 rounded-xl object-cover border border-[#ffdcc3] mb-1 shrink-0 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#887364] bg-white p-2.5 rounded-xl border border-[#e7eeff] w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#8d4b00] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#8d4b00] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#8d4b00] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] font-semibold text-[#111c2d] ml-1">
                {seller.name} (Seller) is typing...
              </span>
            </div>
          )}
        </div>

        {/* Featured Option: "What does the dog like to do?" Action Banner */}
        <div className="px-3 pt-2.5 bg-white border-t border-[#dee8ff]">
          <button
            type="button"
            onClick={() => handleSend(`What does ${dog.name} like to do? What are ${pronounPossessive} favorite toys, games, and daily routine?`)}
            className="w-full bg-gradient-to-r from-[#8d4b00] to-[#b15f00] hover:from-[#763f00] hover:to-[#964f00] text-white p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">sports_baseball</span>
              <span>Ask Seller: &ldquo;What does {dog.name} like to do?&rdquo;</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
              <span>View Hobbies & Toys</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </span>
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-white border-t border-gray-100">
          <p className="text-[10px] font-bold text-[#887364] uppercase tracking-wider mb-1.5">
            Suggested Questions for Seller {seller.name.split(' ')[0]}:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => {
              const isActivityOption = prompt.includes('like to do');
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer flex items-center gap-1 ${
                    isActivityOption
                      ? 'bg-amber-50 text-[#8d4b00] border-amber-300 font-bold hover:bg-amber-100'
                      : 'bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#554336] border-[#dee8ff]'
                  }`}
                >
                  {prompt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input area */}
        <div className="p-3 bg-white border-t border-[#e7eeff]">
          <div className="flex items-center gap-2 bg-[#f0f3ff] rounded-2xl p-1.5 border border-[#dee8ff] focus-within:border-[#8d4b00] focus-within:ring-2 focus-within:ring-[#ffdcc3]">
            <button
              onClick={() => onShowToast(`Phone call requested with seller ${seller.name}.`)}
              className="p-1.5 text-[#887364] hover:text-[#8d4b00] hover:bg-white rounded-xl transition-colors cursor-pointer"
              title={`Call Seller ${seller.name}`}
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
              placeholder={`Message seller ${seller.name}...`}
              className="flex-1 bg-transparent text-xs text-[#111c2d] placeholder-[#887364] focus:outline-none px-2"
            />

            <button
              id="chat-send-btn"
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="bg-[#8d4b00] hover:bg-[#b15f00] disabled:opacity-40 text-white p-2 rounded-xl transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
          <p className="text-[10px] text-center text-[#887364] mt-2 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-xs text-[#006c4a]">lock</span>
            <span>Direct conversation with verified seller {seller.name} • Monitored for safety</span>
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
