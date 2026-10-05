import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Product } from '../data/products';
import { ResilientImage } from './ResilientImage';

export interface CartItem {
  product: Product;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  colorway: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, colorway: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string, colorway: string) => void;
  onClearCart: () => void;
}

interface ConfirmedOrder {
  orderNumber: string;
  timestamp: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  paymentMethod: 'card' | 'cod';
  tailoringNote: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [tailoringNote, setTailoringNote] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 600;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 28;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !phone.trim() || !address.trim() || !postalCode.trim()) {
      setFormError('Please complete all required delivery verification fields.');
      return;
    }

    setFormError('');
    const orderNum = `AV-${Math.floor(1020 + Math.random() * 8900)}`;
    const newOrder: ConfirmedOrder = {
      orderNumber: orderNum,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: `${address.trim()}${city ? `, ${city.trim()}` : ''}`,
      postalCode: postalCode.trim(),
      paymentMethod,
      tailoringNote: tailoringNote.trim(),
      items: [...items],
      subtotal,
      shipping,
      total,
    };

    setConfirmedOrder(newOrder);
    onClearCart();
    setStep('confirmed');
  };

  const handleResetAndClose = () => {
    setStep('bag');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
    >
      <div className="w-full max-w-md bg-[#FBFBF9] h-full flex flex-col justify-between border-l border-black/10 shadow-2xl">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Return to bag"
                className="p-1 text-[#6E6A63] hover:text-[#141413] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-2xl font-normal text-[#141413]">
              {step === 'bag' && 'Shopping Bag'}
              {step === 'checkout' && 'Client Dispatch & Payment'}
              {step === 'confirmed' && 'Atelier Dispatch Receipt'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close drawer"
            className="w-9 h-9 flex items-center justify-center text-[#6E6A63] hover:text-[#141413] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Courier Threshold Banner */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="px-6 py-2.5 bg-[#F2EFE9] border-b border-black/5 text-xs text-[#3A3834] flex items-center justify-between">
            {amountToFreeShipping === 0 ? (
              <span>Complimentary DHL Express Courier unlocked</span>
            ) : (
              <span>
                Add <strong className="font-mono-tabular">${amountToFreeShipping}</strong> more for complimentary express courier
              </span>
            )}
            <span className="font-mono-tabular text-[#6E6A63]">
              Threshold: $600
            </span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'bag' && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <ShoppingBag className="w-8 h-8 text-[#6E6A63] stroke-[1.25] mb-3" />
                  <p className="font-display text-xl text-[#141413] mb-1">
                    Your garment bag is empty
                  </p>
                  <p className="text-xs text-[#6E6A63] max-w-xs mb-6">
                    Explore our Autumn / Winter 2026 architectural outerwear, heavy-gauge merino knitwear, and Italian tailoring.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-[#141413] text-[#FBFBF9] text-xs font-medium hover:bg-[#2A2927] transition-colors whitespace-nowrap"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-black/10">
                  {items.map((item) => {
                    const key = `${item.product.id}-${item.size}-${item.colorway}`;
                    return (
                      <li key={key} className="py-5 first:pt-0 flex gap-4">
                        <div className="w-20 h-26 bg-[#F2EFE9] shrink-0 overflow-hidden">
                          <ResilientImage
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-medium text-[#141413] leading-snug">
                                {item.product.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() =>
                                  onRemoveItem(item.product.id, item.size, item.colorway)
                                }
                                aria-label={`Remove ${item.product.name}`}
                                className="text-[#6E6A63] hover:text-[#141413] transition-colors p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="mt-1 text-xs text-[#6E6A63] flex items-center gap-1.5">
                              <span>Size {item.size}</span>
                              <span aria-hidden="true">·</span>
                              <span>{item.colorway}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center border border-black/15">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(item.product.id, item.size, item.colorway, -1)
                                }
                                aria-label="Decrease quantity"
                                className="w-7 h-7 flex items-center justify-center text-[#141413] hover:bg-black/5 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-mono-tabular text-[#141413]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(item.product.id, item.size, item.colorway, 1)
                                }
                                aria-label="Increase quantity"
                                className="w-7 h-7 flex items-center justify-center text-[#141413] hover:bg-black/5 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-sm font-mono-tabular font-medium text-[#141413]">
                              ${(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Payment Terms Selector */}
              <div>
                <span className="block text-xs font-medium text-[#141413] mb-2">
                  Payment Method
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 text-xs border text-left transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-[#141413] bg-[#141413] text-[#FBFBF9] font-medium'
                        : 'border-black/15 text-[#141413] hover:border-black/40'
                    }`}
                  >
                    Direct Card Settlement
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2.5 px-3 text-xs border text-left transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[#141413] bg-[#141413] text-[#FBFBF9] font-medium'
                        : 'border-black/15 text-[#141413] hover:border-black/40'
                    }`}
                  >
                    Cash on Delivery (COD)
                  </button>
                </div>
                {paymentMethod === 'cod' && (
                  <p className="mt-2 text-xs text-[#6E6A63] bg-[#F2EFE9] p-2.5">
                    Pay via courier terminal or cash upon inspection at your address. Total due on arrival:{' '}
                    <strong className="font-mono-tabular text-[#141413]">
                      ${total.toLocaleString()}
                    </strong>
                    .
                  </p>
                )}
              </div>

              {formError && (
                <div className="p-3 bg-red-950/5 border border-red-800/30 text-xs text-red-900">
                  {formError}
                </div>
              )}

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#6E6A63] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Elena Rostova"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-black/15 text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#6E6A63] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="elena@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-black/15 text-[#141413] focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6E6A63] mb-1">Telephone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-black/15 text-[#141413] font-mono-tabular focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#6E6A63] mb-1">Street Address & Suite *</label>
                  <input
                    type="text"
                    required
                    placeholder="42 Mercer Street, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-black/15 text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#6E6A63] mb-1">City</label>
                    <input
                      type="text"
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-black/15 text-[#141413] focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6E6A63] mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="10013"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-black/15 text-[#141413] font-mono-tabular focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#6E6A63] mb-1">
                    Complimentary Atelier Hemming / Dispatch Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Hem trousers to 78cm inseam; leave wooden hangers"
                    value={tailoringNote}
                    onChange={(e) => setTailoringNote(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-black/15 text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </div>
              </div>
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-6">
              <div className="p-4 bg-[#F2EFE9] border border-black/10 space-y-2">
                <div className="flex items-center gap-2 text-[#141413] font-medium text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#141413]" />
                  <span>
                    Order #{confirmedOrder.orderNumber} Confirmed — Preparing Shipment
                  </span>
                </div>
                <p className="text-xs text-[#6E6A63]">
                  Dispatched from our Milan logistics studio for{' '}
                  <strong className="text-[#141413]">{confirmedOrder.customerName}</strong>. A copy of your garment dossier has been sent to {confirmedOrder.email}.
                </p>
              </div>

              <div className="space-y-2 text-xs border-b border-black/10 pb-4">
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">Order Reference</span>
                  <span className="font-mono-tabular font-medium text-[#141413]">
                    #{confirmedOrder.orderNumber} · {confirmedOrder.timestamp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">Destination</span>
                  <span className="text-[#141413] text-right">
                    {confirmedOrder.address}, {confirmedOrder.postalCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A63]">Settlement Term</span>
                  <span className="text-[#141413]">
                    {confirmedOrder.paymentMethod === 'cod'
                      ? 'Cash on Delivery (Courier Verification)'
                      : 'Direct Card Settlement'}
                  </span>
                </div>
                {confirmedOrder.tailoringNote && (
                  <div className="flex justify-between">
                    <span className="text-[#6E6A63]">Atelier Note</span>
                    <span className="text-[#141413] text-right">{confirmedOrder.tailoringNote}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-[#141413] block">
                  Reserved Garments
                </span>
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-[#3A3834]">
                      {item.quantity}× {item.product.name} ({item.size}, {item.colorway})
                    </span>
                    <span className="font-mono-tabular text-[#141413]">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-black/10 flex justify-between text-sm font-medium text-[#141413]">
                  <span>Total Settled</span>
                  <span className="font-mono-tabular">${confirmedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        {step === 'bag' && items.length > 0 && (
          <div className="p-6 border-t border-black/10 bg-[#FBFBF9] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6E6A63]">
                <span>Subtotal</span>
                <span className="font-mono-tabular text-[#141413]">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#6E6A63]">
                <span>Express Courier Shipping</span>
                <span className="font-mono-tabular text-[#141413]">
                  {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                </span>
              </div>
              <div className="pt-2 border-t border-black/10 flex justify-between text-sm font-medium text-[#141413]">
                <span>Total</span>
                <span className="font-mono-tabular">${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('checkout')}
              className="w-full py-3.5 px-6 bg-[#141413] text-[#FBFBF9] text-xs font-medium tracking-wide hover:bg-[#2A2927] transition-colors whitespace-nowrap cursor-pointer"
            >
              Proceed to Client Dispatch · ${total.toLocaleString()}
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <div className="p-6 border-t border-black/10 bg-[#FBFBF9] space-y-3">
            <div className="flex justify-between text-sm font-medium text-[#141413]">
              <span>Total Due ({paymentMethod === 'cod' ? 'On Delivery' : 'Immediate'})</span>
              <span className="font-mono-tabular">${total.toLocaleString()}</span>
            </div>
            <button
              type="submit"
              form="checkout-form"
              className="w-full py-3.5 px-6 bg-[#141413] text-[#FBFBF9] text-xs font-medium tracking-wide hover:bg-[#2A2927] transition-colors whitespace-nowrap cursor-pointer"
            >
              Confirm Atelier Order · ${total.toLocaleString()}
            </button>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 border-t border-black/10 bg-[#FBFBF9]">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-3 px-6 bg-[#141413] text-[#FBFBF9] text-xs font-medium hover:bg-[#2A2927] transition-colors whitespace-nowrap"
            >
              Return to Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
