import React, { useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_QUOTES,
  DEMO_USERS,
  CATEGORIES,
  ENGINE_BRANDS,
} from './data/catalog';
import { Product, Order, QuoteRequest, User as UserType, CartItem, FilterState } from './types';
import { Header } from './components/Header';
import { EngineFinder } from './components/EngineFinder';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { RFQModal } from './components/RFQModal';
import { OneHtmlExportModal } from './components/OneHtmlExportModal';
import { Footer } from './components/Footer';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  FileText,
  Clock,
  CheckCircle,
  Filter,
  ArrowUpDown,
  Search,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';

export default function App() {
  // PERSISTENT STATE WITH LOCALSTORAGE
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lp_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lp_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('lp_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lp_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('lp_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0]; // Pre-authenticated as B2B client for easy testing
  });

  // PREFERENCES
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'GBP'>('EUR');
  const [showVat, setShowVat] = useState(false); // Default B2B net prices like Onergys
  const [currentView, setCurrentView] = useState<'shop' | 'dashboard' | 'admin'>('shop');

  // FILTERS
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    engineBrand: '',
    engineModel: '',
    searchQuery: '',
    inStockOnly: false,
    brand: 'all',
    sortBy: 'relevance',
  });

  // MODALS
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'user' | 'admin'>('user');
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqInitialProduct, setRfqInitialProduct] = useState<Product | null>(null);
  const [rfqInitialItems, setRfqInitialItems] = useState<{ productName: string; partNumber?: string; quantity: number }[]>([]);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('lp_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lp_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('lp_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lp_current_user');
    }
  }, [currentUser]);

  // Currency multiplier
  const currencyRate = currency === 'EUR' ? 1.0 : currency === 'USD' ? 1.08 : 0.85;

  // Shopping Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    let unitPrice = item.product.price;
    if (item.product.tieredPricing && item.product.tieredPricing.length > 0) {
      const sortedTiers = [...item.product.tieredPricing].sort((a, b) => b.minQty - a.minQty);
      const matched = sortedTiers.find((t) => item.quantity >= t.minQty);
      if (matched) unitPrice = matched.price;
    }
    const itemPrice = showVat ? unitPrice * 1.19 : unitPrice;
    return acc + itemPrice * item.quantity;
  }, 0);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity }]);
    }
    setCartDrawerOpen(true);
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    // Deduct stock
    const updatedProducts = products.map((prod) => {
      const itemInOrder = newOrder.items.find((i) => i.product.id === prod.id);
      if (itemInOrder) {
        const newStock = Math.max(0, prod.stockCount - itemInOrder.quantity);
        return {
          ...prod,
          stockCount: newStock,
          inStock: newStock > 0,
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    setCart([]);
  };

  const handleConvertToRFQ = (items: CartItem[]) => {
    setRfqInitialProduct(null);
    setRfqInitialItems(
      items.map((i) => ({
        productName: i.product.name,
        partNumber: i.product.partNumber,
        quantity: i.quantity,
      }))
    );
    setRfqModalOpen(true);
  };

  // Auth Operations
  const handleLoginSuccess = (user: UserType) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('shop');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('shop');
  };

  const handleOpenAuthModal = (defaultRole: 'user' | 'admin' = 'user') => {
    setAuthDefaultRole(defaultRole);
    setAuthModalOpen(true);
  };

  // Admin CRUD operations
  const handleAddProduct = (newProd: Product) => {
    setProducts([newProd, ...products]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(products.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: Order['status'],
    tracking?: string
  ) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status, trackingNumber: tracking || o.trackingNumber } : o
      )
    );
  };

  const handleRespondQuote = (quoteId: string, quotedPrice: number, adminNotes: string) => {
    setQuotes(
      quotes.map((q) =>
        q.id === quoteId
          ? {
              ...q,
              quotedPrice,
              adminNotes,
              status: 'Quoted',
            }
          : q
      )
    );
  };

  const handleSubmitQuote = (quote: QuoteRequest) => {
    setQuotes([quote, ...quotes]);
  };

  // Filter and sort products
  const displayedProducts = products
    .filter((product) => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      // Engine Brand filter
      if (filters.engineBrand) {
        const matchesBrand = product.engineCompatibility.some((comp) =>
          comp.toLowerCase().includes(filters.engineBrand.toLowerCase())
        );
        if (!matchesBrand) return false;
      }
      // Engine Model filter
      if (filters.engineModel) {
        const matchesModel = product.engineCompatibility.some((comp) =>
          comp.toLowerCase().includes(filters.engineModel.toLowerCase())
        );
        if (!matchesModel) return false;
      }
      // Manufacturer Brand filter
      if (filters.brand !== 'all' && product.brand !== filters.brand) {
        return false;
      }
      // In-stock only filter
      if (filters.inStockOnly && (!product.inStock || product.stockCount <= 0)) {
        return false;
      }
      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesQuery =
          product.name.toLowerCase().includes(query) ||
          product.partNumber.toLowerCase().includes(query) ||
          product.oemNumber.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.engineCompatibility.some((e) => e.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'stock') return b.stockCount - a.stockCount;
      return 0; // relevance
    });

  // Extract unique brands for filter dropdown
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      {/* 1. HEADER */}
      <Header
        currentUser={currentUser}
        cartCount={cartCount}
        cartTotal={cartTotal}
        searchQuery={filters.searchQuery}
        selectedCategory={filters.category}
        currency={currency}
        showVat={showVat}
        onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
        onCategorySelect={(cat) => setFilters({ ...filters, category: cat })}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenAuth={handleOpenAuthModal}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenRFQ={() => {
          setRfqInitialProduct(null);
          setRfqInitialItems([]);
          setRfqModalOpen(true);
        }}
        onLogout={handleLogout}
        onCurrencyToggle={() =>
          setCurrency((prev) => (prev === 'EUR' ? 'USD' : prev === 'USD' ? 'GBP' : 'EUR'))
        }
        onVatToggle={() => setShowVat(!showVat)}
        onOpenExportModal={() => setExportModalOpen(true)}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 2. VIEW SWITCHER (Shop / Customer Dashboard / Admin Panel) */}
      {currentView === 'admin' && currentUser?.role === 'admin' ? (
        <AdminPanel
          products={products}
          orders={orders}
          quotes={quotes}
          currentUser={currentUser}
          currency={currency}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onRespondQuote={handleRespondQuote}
          onClose={() => setCurrentView('shop')}
        />
      ) : currentView === 'dashboard' && currentUser ? (
        <CustomerDashboard
          user={currentUser}
          orders={orders}
          quotes={quotes}
          currency={currency}
          onFilterEngine={(b, m) => {
            setFilters({ ...filters, engineBrand: b, engineModel: m });
            setCurrentView('shop');
          }}
          onOpenRFQ={() => {
            setRfqInitialProduct(null);
            setRfqInitialItems([]);
            setRfqModalOpen(true);
          }}
          onClose={() => setCurrentView('shop')}
        />
      ) : (
        /* MAIN SHOP STOREFRONT VIEW */
        <main className="flex-1">
          {/* Quick Bar Notification for Test Role Switching */}
          <div className="bg-slate-900 text-slate-200 py-1.5 px-4 text-xs border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#9e1b27]">B2B Test Mode:</span>
                <span className="text-slate-300 hidden sm:inline">
                  Easily switch roles between Customer & Admin Panel with full live features
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentUser(DEMO_USERS[0]);
                    setCurrentView('dashboard');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Switch to Customer Portal
                </button>
                <button
                  onClick={() => {
                    setCurrentUser(DEMO_USERS[1]);
                    setCurrentView('admin');
                  }}
                  className="px-2 py-0.5 rounded bg-[#9e1b27] hover:bg-[#83141f] text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Switch to Admin Panel
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
            {/* HERO 3-STEP ENGINE FINDER (Signature Onergys Feature) */}
            <EngineFinder
              selectedBrand={filters.engineBrand}
              selectedModel={filters.engineModel}
              selectedCategory={filters.category}
              onFilterChange={(brand, model, cat) =>
                setFilters({
                  ...filters,
                  engineBrand: brand,
                  engineModel: model,
                  category: cat,
                })
              }
              onReset={() =>
                setFilters({
                  ...filters,
                  engineBrand: '',
                  engineModel: '',
                  category: 'all',
                })
              }
            />

            {/* ENGINE MANUFACTURERS LOGO/BADGE STRIP */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  OEM Compatible Gas Engine Manufacturers
                </span>
                <span className="text-[11px] text-slate-400">Click to filter store</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {ENGINE_BRANDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        engineBrand: filters.engineBrand === b.name ? '' : b.name,
                      })
                    }
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      filters.engineBrand === b.name
                        ? 'border-[#9e1b27] bg-red-50/50 text-[#9e1b27] font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold'
                    }`}
                  >
                    <span className="text-xs block truncate">{b.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {b.models.length} Models
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CATALOG TOOLBAR (Filter pills, In-Stock toggle, Sort by) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                {/* In stock toggle */}
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                    className="w-4 h-4 accent-[#9e1b27] rounded"
                  />
                  <span>In-Stock Only (Ready for 24h dispatch)</span>
                </label>

                {/* Filter by Part Manufacturer */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500">Brand:</span>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    className="px-2 py-1 border border-slate-300 rounded-md bg-white text-xs font-medium text-slate-800"
                  >
                    <option value="all">All Brands</option>
                    {uniqueBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filter Indicators & Sorting */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">
                  Showing <strong>{displayedProducts.length}</strong> of {products.length} spare parts
                </span>

                <div className="flex items-center gap-1 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="px-2.5 py-1 border border-slate-300 rounded-md bg-white text-xs font-medium text-slate-800"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Part Name (A-Z)</option>
                    <option value="stock">Warehouse Stock Level</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    No matching CHP spare parts found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Try clearing some filters or submit an RFQ with your engine serial number. Our engineering team can source hard-to-find parts directly from OEM suppliers.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() =>
                      setFilters({
                        category: 'all',
                        engineBrand: '',
                        engineModel: '',
                        searchQuery: '',
                        inStockOnly: false,
                        brand: 'all',
                        sortBy: 'relevance',
                      })
                    }
                    className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => {
                      setRfqInitialProduct(null);
                      setRfqInitialItems([]);
                      setRfqModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#9e1b27] text-white text-xs font-bold hover:bg-[#861620] transition-colors"
                  >
                    Submit Technical RFQ
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    showVat={showVat}
                    onAddToCart={handleAddToCart}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                    onOpenRFQWithProduct={(p) => {
                      setRfqInitialProduct(p);
                      setRfqInitialItems([]);
                      setRfqModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}

            {/* TECHNICAL INQUIRY & RFQ CALLOUT BANNER */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#9e1b27] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-xl space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-xs font-bold text-red-200">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Custom Engine Sourcing Service</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight">
                  Can't locate your specific part number or OEM drawing?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Provide your engine nameplate serial number or technical specification. Our certified cogeneration technicians will cross-reference internal manufacturer blueprints and prepare an expedited B2B quotation within 24 hours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setRfqInitialProduct(null);
                    setRfqInitialItems([]);
                    setRfqModalOpen(true);
                  }}
                  className="px-6 py-3 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs font-extrabold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#9e1b27]" />
                  <span>Request Custom RFQ</span>
                </button>

                <button
                  onClick={() => setExportModalOpen(true)}
                  className="px-6 py-3 rounded-lg bg-[#9e1b27] hover:bg-[#861620] text-white text-xs font-extrabold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Export 1-in-1 HTML</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 3. MODALS & DRAWERS */}
      {/* Product Technical Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        currency={currency}
        showVat={showVat}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenRFQ={(p) => {
          setRfqInitialProduct(p);
          setRfqInitialItems([]);
          setRfqModalOpen(true);
        }}
      />

      {/* Slide-over Shopping Cart Drawer with B2B Checkout */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        currency={currency}
        showVat={showVat}
        currentUser={currentUser}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        onConvertToRFQ={handleConvertToRFQ}
        onOpenAuth={() => {
          setCartDrawerOpen(false);
          setAuthModalOpen(true);
        }}
      />

      {/* Customer & Admin Login Interface */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authDefaultRole}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Technical RFQ / Quote Request Modal */}
      <RFQModal
        isOpen={rfqModalOpen}
        onClose={() => setRfqModalOpen(false)}
        currentUser={currentUser}
        initialProduct={rfqInitialProduct}
        initialItems={rfqInitialItems}
        onSubmitQuote={handleSubmitQuote}
      />

      {/* 1-in-1 Full HTML Code Exporter Modal */}
      <OneHtmlExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        products={products}
      />

      {/* 4. FOOTER */}
      <Footer
        onOpenAdmin={() => {
          if (currentUser?.role === 'admin') {
            setCurrentView('admin');
          } else {
            handleOpenAuthModal('admin');
          }
        }}
        onOpenAuth={handleOpenAuthModal}
        onOpenRFQ={() => {
          setRfqInitialProduct(null);
          setRfqInitialItems([]);
          setRfqModalOpen(true);
        }}
        onOpenExportModal={() => setExportModalOpen(true)}
      />
    </div>
  );
}
