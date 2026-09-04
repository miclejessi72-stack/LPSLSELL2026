import React, { useState } from 'react';
import {
  ShoppingCart,
  Check,
  Clock,
  Eye,
  FileText,
  Copy,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  currency: 'EUR' | 'USD' | 'GBP';
  showVat: boolean;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenDetails: (product: Product) => void;
  onOpenRFQWithProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  showVat,
  onAddToCart,
  onOpenDetails,
  onOpenRFQWithProduct,
}) => {
  const [qty, setQty] = useState(product.minOrderQty || 1);
  const [copiedPart, setCopiedPart] = useState(false);
  const [addedEffect, setAddedEffect] = useState(false);

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';
  const effectivePrice = showVat ? product.price * 1.19 : product.price;

  const handleCopyPartNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.partNumber);
    setCopiedPart(true);
    setTimeout(() => setCopiedPart(false), 1500);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, qty);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1200);
  };

  // Best bulk discount price
  const lowestBulkPrice = product.tieredPricing && product.tieredPricing.length > 1
    ? (showVat ? product.tieredPricing[product.tieredPricing.length - 1].price * 1.19 : product.tieredPricing[product.tieredPricing.length - 1].price)
    : null;

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
        {product.badge ? (
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs tracking-wider ${
              product.badge === 'OEM Genuine'
                ? 'bg-[#9e1b27] text-white'
                : product.badge === 'Fast Mover'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-white'
            }`}
          >
            {product.badge}
          </span>
        ) : (
          <span></span>
        )}

        <span className="text-[11px] font-mono font-bold bg-white/90 backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
          {product.brand}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="px-3 py-1.5 rounded-md bg-white/95 text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-3.5 h-3.5 text-[#9e1b27]" />
            <span>Technical Specs</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Part Numbers Block */}
          <div className="flex items-center justify-between gap-2 text-xs font-mono mb-1.5">
            <button
              onClick={handleCopyPartNumber}
              className="inline-flex items-center gap-1 font-bold text-[#9e1b27] hover:text-[#7d141e] bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded transition-colors"
              title="Click to copy Part Number"
            >
              <span>{product.partNumber}</span>
              {copiedPart ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 opacity-60" />
              )}
            </button>
            <span className="text-[11px] text-slate-500 truncate" title={`OEM: ${product.oemNumber}`}>
              OEM: {product.oemNumber.split('/')[0]}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#9e1b27] transition-colors">
            {product.name}
          </h3>

          {/* Engine Compatibility Chips */}
          <div className="mt-2.5 flex items-center gap-1 flex-wrap">
            <Layers className="w-3 h-3 text-slate-400 shrink-0" />
            {product.engineCompatibility.slice(0, 2).map((eng, idx) => (
              <span
                key={idx}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium truncate max-w-[130px]"
              >
                {eng}
              </span>
            ))}
            {product.engineCompatibility.length > 2 && (
              <span className="text-[10px] text-slate-400 font-bold">
                +{product.engineCompatibility.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Price & Stock Section */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          {/* Stock availability indicator */}
          <div className="flex items-center justify-between text-xs mb-2">
            {product.inStock ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>In Stock ({product.stockCount} pcs)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Available on Request</span>
              </div>
            )}
            <span className="text-[10px] text-slate-400">24h Dispatch</span>
          </div>

          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tracking-tight">
                {currencySymbol}
                {effectivePrice.toFixed(2)}
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">
                {showVat ? 'incl. 19% VAT' : 'excl. VAT (B2B Net)'}
              </p>
            </div>

            {lowestBulkPrice && (
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Tier discount from:</span>
                <span className="text-xs font-mono font-bold text-[#9e1b27]">
                  {currencySymbol}
                  {lowestBulkPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Action Row: Stepper + Add to Cart */}
          <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50 h-9 shrink-0">
              <button
                onClick={() => setQty(Math.max(product.minOrderQty || 1, qty - 1))}
                className="px-2.5 h-full text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
              >
                -
              </button>
              <input
                type="number"
                min={product.minOrderQty || 1}
                value={qty}
                onChange={(e) => setQty(Math.max(product.minOrderQty || 1, parseInt(e.target.value) || 1))}
                className="w-9 text-center text-xs font-bold text-slate-800 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setQty(qty + 1)}
                className="px-2.5 h-full text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              className={`flex-1 h-9 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer ${
                addedEffect
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-[#9e1b27] text-white'
              }`}
            >
              {addedEffect ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Direct RFQ Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenRFQWithProduct(product);
              }}
              className="h-9 px-2.5 rounded-lg border border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-700 text-xs transition-colors"
              title="Request Custom Quotation (RFQ)"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
