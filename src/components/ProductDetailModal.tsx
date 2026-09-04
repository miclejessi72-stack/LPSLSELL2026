import React, { useState } from 'react';
import {
  X,
  Check,
  ShoppingCart,
  FileText,
  ShieldCheck,
  Truck,
  Layers,
  Copy,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  currency: 'EUR' | 'USD' | 'GBP';
  showVat: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenRFQ: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  showVat,
  onClose,
  onAddToCart,
  onOpenRFQ,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(product.minOrderQty || 1);
  const [copiedPart, setCopiedPart] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'engines' | 'pricing'>('specs');

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';

  // Calculate price based on selected quantity tiered pricing
  const calculateUnitPrice = (qty: number) => {
    let price = product.price;
    if (product.tieredPricing && product.tieredPricing.length > 0) {
      const sortedTiers = [...product.tieredPricing].sort((a, b) => b.minQty - a.minQty);
      const matchedTier = sortedTiers.find((t) => qty >= t.minQty);
      if (matchedTier) {
        price = matchedTier.price;
      }
    }
    return showVat ? price * 1.19 : price;
  };

  const currentUnitPrice = calculateUnitPrice(quantity);
  const lineTotal = currentUnitPrice * quantity;

  const handleCopyPartNumber = () => {
    navigator.clipboard.writeText(product.partNumber);
    setCopiedPart(true);
    setTimeout(() => setCopiedPart(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#9e1b27] font-mono text-xs font-bold text-white uppercase">
              {product.partNumber}
            </span>
            <span className="text-xs text-slate-300 font-mono hidden sm:inline">
              OEM Ref: {product.oemNumber}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Product Image & Badges */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#9e1b27] text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded shadow-md">
                    {product.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
                  {product.brand}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#9e1b27] shrink-0" />
                  <span className="font-semibold text-slate-700">100% Tested OEM Quality</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">24-48h Global Courier</span>
                </div>
              </div>

              {/* Datasheet download simulator */}
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#9e1b27]" />
                  <div>
                    <p className="font-bold text-slate-900">Technical Datasheet (PDF)</p>
                    <p className="text-[11px] text-slate-500">Dimensions, torque specs & drawings</p>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Downloading technical datasheet for ${product.partNumber}...`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-red-200 text-[#9e1b27] font-bold text-xs hover:bg-red-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Right: Details, Pricing & Actions */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPartNumber}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#9e1b27] font-mono font-bold text-xs transition-colors"
                  >
                    <span>Part #{product.partNumber}</span>
                    {copiedPart ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <span className="text-xs text-slate-500 font-mono">
                    OEM #{product.oemNumber}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {product.name}
                </h1>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                      {currencySymbol}{currentUnitPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      / unit {showVat ? '(incl. VAT)' : '(excl. VAT net)'}
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs text-slate-400 block">Total ({quantity} units):</span>
                    <span className="text-lg font-bold text-[#9e1b27]">
                      {currencySymbol}{lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Stock info */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Ready in Central Warehouse ({product.stockCount} in stock)</span>
                  </span>
                  <span className="text-slate-500">Min. Order: {product.minOrderQty || 1} pc</span>
                </div>

                {/* Stepper + Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white h-11 shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(product.minOrderQty || 1, quantity - 1))}
                      className="px-3.5 h-full text-slate-600 hover:bg-slate-100 font-bold text-base"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={product.minOrderQty || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.minOrderQty || 1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 h-full text-slate-600 hover:bg-slate-100 font-bold text-base"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="flex-1 h-11 rounded-lg bg-[#9e1b27] hover:bg-[#861620] text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Shopping Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenRFQ(product);
                      onClose();
                    }}
                    className="h-11 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Request tailored B2B quotation"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">RFQ Quote</span>
                  </button>
                </div>
              </div>

              {/* Tiered Pricing Table */}
              {product.tieredPricing && product.tieredPricing.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700">
                    Graduated Bulk Volume Discounts
                  </div>
                  <div className="grid grid-cols-4 divide-x divide-slate-200 text-center py-2 bg-white">
                    {product.tieredPricing.map((tier, idx) => (
                      <div key={idx} className="p-1">
                        <span className="text-slate-500 block text-[11px] font-medium">
                          From {tier.minQty} pcs
                        </span>
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          {currencySymbol}
                          {(showVat ? tier.price * 1.19 : tier.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Tabs: Technical Specifications & Engine Compatibility */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex border-b border-slate-200 gap-6">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 text-sm font-bold transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-[#9e1b27] text-[#9e1b27]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Technical Parameters
              </button>
              <button
                onClick={() => setActiveTab('engines')}
                className={`pb-3 text-sm font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'engines'
                    ? 'border-[#9e1b27] text-[#9e1b27]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Engine Compatibility</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                  {product.engineCompatibility.length}
                </span>
              </button>
            </div>

            <div className="pt-4">
              {activeTab === 'specs' ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-slate-200">
                      {Object.entries(product.specifications).map(([key, val], idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-4 py-2.5 font-bold text-slate-700 w-1/3">
                            {key}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-slate-900">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {product.engineCompatibility.map((eng, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2.5"
                    >
                      <Layers className="w-4 h-4 text-[#9e1b27] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{eng}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">Direct Replacement Guaranteed</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
