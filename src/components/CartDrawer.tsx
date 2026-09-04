import React, { useState } from 'react';
import {
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle,
  FileText,
  Building,
  CreditCard,
  Send,
} from 'lucide-react';
import { CartItem, Product, User, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: 'EUR' | 'USD' | 'GBP';
  showVat: boolean;
  currentUser: User | null;
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  onConvertToRFQ: (items: CartItem[]) => void;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  showVat,
  currentUser,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onConvertToRFQ,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [vatId, setVatId] = useState(currentUser?.vatId || '');
  const [street, setStreet] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [postalCode, setPostalCode] = useState('52062');
  const [country, setCountry] = useState(currentUser?.country || 'Germany');
  const [paymentMethod, setPaymentMethod] = useState('Invoice (30 Days Net)');
  const [orderNotes, setOrderNotes] = useState('');

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';

  // Calculate items subtotal considering tiered pricing
  const subtotal = cart.reduce((acc, item) => {
    let unitPrice = item.product.price;
    if (item.product.tieredPricing && item.product.tieredPricing.length > 0) {
      const sortedTiers = [...item.product.tieredPricing].sort((a, b) => b.minQty - a.minQty);
      const tier = sortedTiers.find((t) => item.quantity >= t.minQty);
      if (tier) unitPrice = tier.price;
    }
    return acc + unitPrice * item.quantity;
  }, 0);

  const shippingCost = subtotal > 1500 ? 0 : 35.00;
  // If company has a VAT ID or reverse charge, tax can be 0 or 19%
  const taxRate = showVat ? 0.19 : 0;
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + shippingCost + tax;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `LP-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      email,
      company,
      vatId,
      shippingAddress: {
        street,
        city,
        postalCode,
        country,
      },
      items: [...cart],
      subtotal,
      tax,
      shippingCost,
      total: grandTotal,
      paymentMethod,
      status: 'Processing',
      trackingNumber: `DHL-EXP-${Math.floor(10000000 + Math.random() * 90000000)}DE`,
      createdAt: new Date().toISOString(),
      notes: orderNotes,
    };

    onPlaceOrder(newOrder);
    setCreatedOrder(newOrder);
    setCheckoutStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Top Drawer Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg">B2B Shopping Cart</span>
              <span className="px-2 py-0.5 rounded-full bg-[#9e1b27] text-white text-xs font-mono font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {checkoutStep === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                      <Truck className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Your cart is currently empty</h3>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                      Use our engine parts finder or browse the catalog to add verified CHP maintenance parts.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-4 py-2 rounded-lg bg-[#9e1b27] text-white text-xs font-bold hover:bg-[#851520] transition-colors"
                    >
                      Browse Spare Parts Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart Items List */}
                    <div className="divide-y divide-slate-100">
                      {cart.map((item) => {
                        let unitPrice = item.product.price;
                        if (item.product.tieredPricing && item.product.tieredPricing.length > 0) {
                          const sortedTiers = [...item.product.tieredPricing].sort((a, b) => b.minQty - a.minQty);
                          const tier = sortedTiers.find((t) => item.quantity >= t.minQty);
                          if (tier) unitPrice = tier.price;
                        }
                        const itemEffectivePrice = showVat ? unitPrice * 1.19 : unitPrice;

                        return (
                          <div key={item.product.id} className="py-3 flex gap-3 items-start">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {item.product.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-slate-500">
                                <span className="text-[#9e1b27] font-semibold">
                                  {item.product.partNumber}
                                </span>
                                <span>•</span>
                                <span>{currencySymbol}{itemEffectivePrice.toFixed(2)}/pc</span>
                              </div>

                              {/* Qty controller + remove */}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50 h-7">
                                  <button
                                    onClick={() => onUpdateQty(item.product.id, Math.max(item.product.minOrderQty || 1, item.quantity - 1))}
                                    className="px-2 h-full text-slate-600 hover:bg-slate-200 text-xs font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center text-xs font-bold text-slate-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                                    className="px-2 h-full text-slate-600 hover:bg-slate-200 text-xs font-bold"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-mono font-bold text-slate-900">
                                    {currencySymbol}{(itemEffectivePrice * item.quantity).toFixed(2)}
                                  </span>
                                  <button
                                    onClick={() => onRemoveItem(item.product.id)}
                                    className="text-slate-400 hover:text-red-600 transition-colors p-1"
                                    title="Remove item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick B2B Actions: Convert to RFQ */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span>Need an Official Quote for Purchasing?</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Export these items as a formal PDF Quotation (RFQ) with volume discounts and 30-day price lock.
                      </p>
                      <button
                        onClick={() => {
                          onConvertToRFQ(cart);
                          onClose();
                        }}
                        className="w-full py-1.5 px-2.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors text-center cursor-pointer"
                      >
                        Convert Cart to Official RFQ
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Shipping & Payment */}
            {checkoutStep === 'shipping' && (
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-2">
                  <span className="font-bold text-slate-900 block">B2B Invoicing & Dispatch</span>
                  <span className="text-[11px] text-slate-500">
                    Express courier dispatch with certified commercial invoice and tracking.
                  </span>
                </div>

                {!currentUser && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-red-900">Have a B2B Account?</p>
                      <p className="text-[11px] text-red-700">Sign in to auto-fill plant addresses.</p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="px-2.5 py-1 bg-[#9e1b27] text-white rounded font-bold hover:bg-[#841620]"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company / Plant Operator Name *</label>
                    <input
                      required
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. BioEnergie Kraftwerk GmbH"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Contact Person *</label>
                      <input
                        required
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="First & Last Name"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">EU VAT ID (Optional)</label>
                      <input
                        type="text"
                        value={vatId}
                        onChange={(e) => setVatId(e.target.value)}
                        placeholder="e.g. DE 123456789"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Business Email *</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="purchasing@company.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Plant Delivery Address *</label>
                    <input
                      required
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Street name & number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Postal Code</label>
                      <input
                        required
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">City</label>
                      <input
                        required
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    >
                      <option value="Germany">Germany (DE)</option>
                      <option value="Austria">Austria (AT)</option>
                      <option value="Netherlands">Netherlands (NL)</option>
                      <option value="France">France (FR)</option>
                      <option value="Italy">Italy (IT)</option>
                      <option value="Poland">Poland (PL)</option>
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="United States">United States (US)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">B2B Payment Terms</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
                    >
                      <option value="Invoice (30 Days Net)">Invoice (30 Days Net for Verified Accounts)</option>
                      <option value="Wire Transfer / SEPA">Bank Wire Transfer / Pro-Forma</option>
                      <option value="Corporate Credit Card">Corporate Credit Card (Visa / Mastercard / Amex)</option>
                    </select>
                  </div>
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {checkoutStep === 'success' && createdOrder && (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-xs font-mono font-bold text-[#9e1b27] mt-1">
                    {createdOrder.orderNumber}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs">
                    Confirmation has been dispatched to <strong className="text-slate-700">{createdOrder.email}</strong>. Our warehouse team is preparing your parts for express dispatch.
                  </p>
                </div>

                <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tracking Code:</span>
                    <span className="font-mono font-bold text-slate-900">{createdOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Terms:</span>
                    <span className="font-medium text-slate-800">{createdOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-200 pt-2">
                    <span>Total Amount:</span>
                    <span className="font-mono text-[#9e1b27]">{currencySymbol}{createdOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="w-full pt-4 space-y-2">
                  <button
                    onClick={() => {
                      onClearCart();
                      onClose();
                      setCheckoutStep('cart');
                    }}
                    className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-black transition-colors"
                  >
                    Return to Storefront
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer / Summary */}
          {cart.length > 0 && checkoutStep !== 'success' && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Parts Subtotal</span>
                  <span className="font-mono font-semibold">
                    {currencySymbol}{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard Express Freight</span>
                  <span className="font-mono font-semibold">
                    {shippingCost === 0 ? 'Free (over €1,500)' : `${currencySymbol}${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {showVat && (
                  <div className="flex justify-between text-slate-600">
                    <span>German MwSt. / VAT (19%)</span>
                    <span className="font-mono font-semibold">
                      {currencySymbol}{tax.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-[#9e1b27]">
                    {currencySymbol}{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full py-3 rounded-lg bg-[#9e1b27] hover:bg-[#851520] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to B2B Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClearCart}
                    className="w-full py-1.5 text-slate-400 hover:text-slate-600 text-[11px] font-medium transition-colors"
                  >
                    Clear All Items
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    form="checkout-form"
                    className="w-full py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Place Order</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full py-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                  >
                    Back to Items
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
