import React, { useState } from 'react';
import { CartItem } from '../types';
import { useSettings } from '../context/SettingsContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onShowToast: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onShowToast
}) => {
  const { t, formatPrice } = useSettings();
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = discountApplied ? rawSubtotal * 0.15 : 0;
  const subtotal = rawSubtotal - discountAmount;
  const freeShippingThreshold = 75;
  const freeShippingMet = subtotal >= freeShippingThreshold;
  const shipping = subtotal === 0 ? 0 : freeShippingMet ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === 'vet15' || promoCode.trim().toLowerCase() === 'puppylove') {
      setDiscountApplied(true);
      onShowToast('Promo code applied: 15% Canine Wellness Discount!');
    } else {
      onShowToast('Invalid code. Try "VET15" for 15% off.');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onShowToast('Escrow checkout successful! Order #PP-84920 placed with full buyer protection.');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div 
        id="cart-drawer-container"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e7eeff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8d4b00] text-2xl">shopping_bag</span>
            <h3 className="font-bold text-base text-[#111c2d]">
              {t.cartTitle} ({cart.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button
            id="cart-drawer-close-btn"
            onClick={onClose}
            className="p-1.5 text-[#887364] hover:text-[#111c2d] hover:bg-[#f0f3ff] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-[#f0f3ff] px-4 py-2.5 border-b border-[#dee8ff] text-xs">
          {freeShippingMet ? (
            <div className="flex items-center gap-1.5 text-[#006c4a] font-bold">
              <span className="material-symbols-outlined text-base">local_shipping</span>
              <span>Congratulations! You qualify for Free Carbon-Neutral Shipping!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-[#554336] mb-1 font-medium">
                <span>Add {formatPrice(freeShippingThreshold - subtotal)} more for Free Shipping</span>
                <span>{formatPrice(subtotal)} / {formatPrice(75)}</span>
              </div>
              <div className="w-full h-1.5 bg-[#dee8ff] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#006c4a] transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Item list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-[#f0f3ff] rounded-full flex items-center justify-center mx-auto mb-3 text-[#887364]">
                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
              </div>
              <h4 className="font-bold text-[#111c2d] text-sm">{t.cartEmptyTitle}</h4>
              <p className="text-xs text-[#887364] mt-1 max-w-xs mx-auto">
                {t.cartEmptyDesc}
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-[#dee8ff] hover:border-[#dbc2b0] transition-colors bg-[#f9f9ff]"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 rounded-lg object-cover border border-[#dee8ff] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs text-[#111c2d] line-clamp-1">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-[#887364] hover:text-[#ba1a1a] p-0.5 cursor-pointer"
                      title="Remove item"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#887364] mt-0.5">{item.product.brand}</p>
                  
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-[#dee8ff] rounded-lg bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-[#554336] hover:bg-[#f0f3ff] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-[#111c2d]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-[#554336] hover:bg-[#f0f3ff] cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-xs text-[#8d4b00]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-[10px] text-[#887364] line-through block">
                          ${(item.product.originalPrice * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo code form */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[#e7eeff] bg-[#f9f9ff]">
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Discount code (try VET15)"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#dee8ff] rounded-lg focus:outline-none focus:border-[#8d4b00]"
              />
              <button
                type="submit"
                className="bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#554336] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-[#dee8ff]"
              >
                Apply
              </button>
            </form>
          </div>
        )}

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[#e7eeff] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-[#554336]">
              <div className="flex justify-between">
                <span>{t.subtotalLabel}</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-[#006c4a] font-semibold">
                  <span>Vet Care 15% Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.freeShippingLabel}</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#dee8ff] font-bold text-sm text-[#111c2d]">
                <span>{t.totalLabel}</span>
                <span className="text-[#8d4b00]">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              id="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#8d4b00] hover:bg-[#b15f00] text-white py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isCheckingOut ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Processing Escrow Authorization...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>{t.checkoutBtn} • {formatPrice(total)}</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#887364]">
              🔒 100% Backed by PawPalace 30-Day Canine Comfort Guarantee.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
