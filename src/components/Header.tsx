import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Phone,
  Mail,
  ShoppingCart,
  User as UserIcon,
  ChevronDown,
  X,
  Shield,
  FileText,
  Layers,
  ArrowRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { LimburgLogo } from './LimburgLogo';
import { User, Category, Product } from '../types';
import { CATEGORIES } from '../data/catalog';

interface HeaderProps {
  currentUser: User | null;
  cartCount: number;
  cartTotal: number;
  searchQuery: string;
  selectedCategory: string;
  currency: 'EUR' | 'USD' | 'GBP';
  showVat: boolean;
  onSearchChange: (query: string) => void;
  onCategorySelect: (catId: string) => void;
  onOpenCart: () => void;
  onOpenAuth: (defaultRole?: 'user' | 'admin') => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onOpenRFQ: () => void;
  onLogout: () => void;
  onCurrencyToggle: () => void;
  onVatToggle: () => void;
  onOpenExportModal: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  cartCount,
  cartTotal,
  searchQuery,
  selectedCategory,
  currency,
  showVat,
  onSearchChange,
  onCategorySelect,
  onOpenCart,
  onOpenAuth,
  onOpenDashboard,
  onOpenAdmin,
  onOpenRFQ,
  onLogout,
  onCurrencyToggle,
  onVatToggle,
  onOpenExportModal,
  allProducts,
  onSelectProduct,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter live search suggestions
  const searchSuggestions = searchQuery.trim().length > 1
    ? allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.oemNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR */}
      <div className="bg-[#121417] text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left contact & fast dispatch info */}
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="tel:+4924054084100"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#9e1b27]" />
              <span className="font-mono font-medium">+49 (0) 2405 4084 100</span>
              <span className="hidden sm:inline text-slate-400">(CHP Support Desk)</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a
              href="mailto:sales@limburg-power.com"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#9e1b27]" />
              <span className="hidden sm:inline">sales@limburg-power.com</span>
            </a>
            <span className="text-slate-700 hidden md:inline">|</span>
            <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>15,000+ OEM CHP Parts in Stock • Express Dispatch within 24h</span>
            </div>
          </div>

          {/* Right settings: Currency, VAT toggle, Export HTML */}
          <div className="flex items-center gap-3">
            {/* VAT Display Toggle */}
            <button
              onClick={onVatToggle}
              className="text-[11px] px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle VAT display"
            >
              Price: <span className="font-semibold text-white">{showVat ? 'Incl. 19% VAT' : 'Excl. VAT (B2B Net)'}</span>
            </button>

            {/* Currency switcher */}
            <button
              onClick={onCurrencyToggle}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-semibold transition-colors cursor-pointer"
            >
              {currency} ({currencySymbol})
            </button>

            {/* 1-in-1 Full HTML Export Button */}
            <button
              onClick={onOpenExportModal}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#9e1b27]/20 border border-[#9e1b27]/50 text-red-200 hover:bg-[#9e1b27] hover:text-white transition-colors cursor-pointer"
              title="Download single-file full code HTML"
            >
              <Sparkles className="w-3 h-3 text-[#9e1b27] group-hover:text-white" />
              <span>Full Code (1-in-1 HTML)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search, User Auth, Cart) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* LOGO */}
          <div
            onClick={() => {
              onCategorySelect('all');
              onSearchChange('');
            }}
            className="cursor-pointer shrink-0 transition-transform active:scale-95"
            title="Limburg Power - Gas Engine & CHP Spare Parts"
          >
            <LimburgLogo height={52} showTagline={true} />
          </div>

          {/* SEARCH BAR (Live instant lookup) */}
          <div className="flex-1 max-w-2xl relative">
            <div
              className={`flex items-center w-full border rounded-lg overflow-hidden transition-all bg-slate-50 ${
                isSearchFocused
                  ? 'border-[#9e1b27] ring-2 ring-[#9e1b27]/20 bg-white shadow-sm'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="pl-3.5 pr-2 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search by part number (e.g. LP-120564, 462719, Jenbacher, spark plug, filter)..."
                className="w-full py-2.5 pr-8 text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="pr-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Dropdown Popover */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden"
                onMouseDown={(e) => e.preventDefault()} // prevent input blur
              >
                <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 flex justify-between items-center">
                  <span>Found {searchSuggestions.length} matching CHP spare parts</span>
                  <span className="text-[10px] text-slate-400">Click to inspect</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        setIsSearchFocused(false);
                      }}
                      className="p-3 hover:bg-red-50/50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                            <span className="text-[#9e1b27] font-semibold">{product.partNumber}</span>
                            <span>•</span>
                            <span className="truncate">OEM: {product.oemNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-slate-900">
                          {currencySymbol}{product.price.toFixed(2)}
                        </span>
                        <p className="text-[10px] text-emerald-600 font-medium">In Stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Request Quote Button */}
            <button
              onClick={onOpenRFQ}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#9e1b27]" />
              <span>Request Quote (RFQ)</span>
            </button>

            {/* User Account / Login Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  currentUser
                    ? currentUser.role === 'admin'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-red-50/70 border-red-200 text-[#9e1b27]'
                    : 'bg-white border-slate-300 hover:border-slate-400 text-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-700 font-bold text-[11px]">
                  {currentUser ? (
                    currentUser.name.charAt(0)
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  {currentUser ? (
                    <>
                      <p className="leading-tight font-bold truncate max-w-[110px]">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] opacity-75 font-normal">
                        {currentUser.role === 'admin' ? 'Admin Control' : 'B2B Client'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="leading-tight font-bold">Sign In / Register</p>
                      <p className="text-[10px] text-slate-500 font-normal">B2B & Admin</p>
                    </>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* User Account Menu Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs">
                  {currentUser ? (
                    <div>
                      {/* Logged in header info */}
                      <div className="px-3 py-2.5 bg-slate-50 rounded-lg mb-2 border border-slate-100">
                        <p className="font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[10px] font-medium text-slate-600">{currentUser.company}</span>
                          <span
                            className={`text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                              currentUser.role === 'admin'
                                ? 'bg-[#9e1b27] text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {currentUser.role}
                          </span>
                        </div>
                      </div>

                      {/* Role-specific navigations */}
                      {currentUser.role === 'admin' ? (
                        <>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenAdmin();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-red-50 hover:text-[#9e1b27] rounded-lg transition-colors font-medium text-left"
                          >
                            <Shield className="w-4 h-4 text-[#9e1b27]" />
                            <span>Admin Management Panel</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenDashboard();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium text-left"
                          >
                            <Layers className="w-4 h-4 text-slate-600" />
                            <span>My CHP Plant & Orders</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenRFQ();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium text-left"
                      >
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span>Submit RFQ (Part Quote)</span>
                      </button>

                      {/* Switch to Admin / User quick toggle for testing */}
                      <div className="border-t border-slate-100 my-1 pt-1">
                        {currentUser.role !== 'admin' ? (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenAuth('admin');
                            }}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] text-[#9e1b27] hover:bg-red-50 rounded-lg"
                          >
                            <span>Switch to Admin Panel</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenAuth('user');
                            }}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                            <span>Switch to User View</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 my-1 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="p-2 text-center text-slate-600">
                        <p className="font-semibold text-slate-900">B2B Portal & Engine Fleet</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Access tiered pricing, order tracking, and registered engine parts.
                        </p>
                      </div>
                      <div className="space-y-1.5 mt-2">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAuth('user');
                          }}
                          className="w-full py-2 px-3 bg-[#9e1b27] hover:bg-[#861620] text-white font-bold rounded-lg text-center transition-colors"
                        >
                          Customer Sign In
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAuth('admin');
                          }}
                          className="w-full py-2 px-3 bg-slate-900 hover:bg-black text-white font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Shield className="w-3.5 h-3.5 text-red-400" />
                          <span>Admin Login</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SHOPPING CART BUTTON */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#9e1b27] hover:bg-[#88141f] text-white shadow-xs transition-all active:scale-95 cursor-pointer relative"
              title="View Shopping Cart & Quotation"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-white text-[#9e1b27] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] uppercase font-bold text-red-100 leading-none">Cart</p>
                <p className="text-xs font-mono font-bold leading-tight mt-0.5">
                  {currencySymbol}{cartTotal.toFixed(2)}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION BAR */}
      <nav className="bg-slate-900 text-slate-200 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none py-1.5 gap-2">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* All Products button */}
            <button
              onClick={() => onCategorySelect('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#9e1b27] text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              All Spare Parts
            </button>

            {CATEGORIES.map((cat: Category) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#9e1b27] text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Fast quote banner */}
          <div className="hidden lg:flex items-center gap-2 shrink-0 pl-4 border-l border-slate-800">
            <span className="text-[11px] text-slate-400">Need specific OEM parts?</span>
            <button
              onClick={onOpenRFQ}
              className="text-xs font-bold text-red-400 hover:text-red-300 underline underline-offset-2 flex items-center gap-1"
            >
              <span>Instant RFQ</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
