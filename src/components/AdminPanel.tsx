import React, { useState } from 'react';
import {
  Shield,
  Package,
  ShoppingCart,
  FileText,
  Users,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Download,
  RotateCcw,
  ArrowRight,
  Eye,
  X,
  Layers,
  Save,
} from 'lucide-react';
import { Product, Order, QuoteRequest, User as UserType } from '../types';
import { CATEGORIES, ENGINE_BRANDS } from '../data/catalog';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  quotes: QuoteRequest[];
  currentUser: UserType;
  currency: 'EUR' | 'USD' | 'GBP';
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], tracking?: string) => void;
  onRespondQuote: (quoteId: string, quotedPrice: number, adminNotes: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  quotes,
  currentUser,
  currency,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onRespondQuote,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'quotes' | 'users'>('analytics');
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Quote response modal state
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [quotePriceInput, setQuotePriceInput] = useState<number>(0);
  const [quoteNotesInput, setQuoteNotesInput] = useState<string>('');

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';

  // Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Processing' || o.status === 'Pending').length;
  const pendingQuotes = quotes.filter((q) => q.status === 'Pending' || q.status === 'Reviewing').length;
  const lowStockItems = products.filter((p) => p.stockCount < 20);

  // Filtered products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.oemNumber.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Initial Product Form State
  const initialNewProduct: Product = {
    id: `prod-${Date.now()}`,
    partNumber: 'LP-',
    oemNumber: '',
    name: '',
    brand: 'Limburg Power OEM',
    category: 'ignition',
    subCategory: 'Spare Parts',
    price: 99.00,
    inStock: true,
    stockCount: 50,
    description: '',
    specifications: {
      'Country of Origin': 'Germany',
      'Warranty': '12 Months continuous operation',
    },
    engineCompatibility: ['Jenbacher J320 GS', 'MAN E2876 LE302'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    minOrderQty: 1,
  };

  const [formData, setFormData] = useState<Product>(initialNewProduct);

  const handleOpenAdd = () => {
    setFormData({
      ...initialNewProduct,
      id: `prod-${Date.now()}`,
    });
    setIsAddingProduct(true);
    setEditingProduct(null);
  };

  const handleOpenEdit = (p: Product) => {
    setFormData({ ...p });
    setEditingProduct(p);
    setIsAddingProduct(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(formData);
      setEditingProduct(null);
    } else {
      onAddProduct(formData);
      setIsAddingProduct(false);
    }
  };

  const handleOpenQuoteModal = (q: QuoteRequest) => {
    setSelectedQuote(q);
    setQuotePriceInput(q.quotedPrice || 1200);
    setQuoteNotesInput(q.adminNotes || 'Special tiered discount applied. Parts available in Aachen.');
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuote) {
      onRespondQuote(selectedQuote.id, Number(quotePriceInput), quoteNotesInput);
      setSelectedQuote(null);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#9e1b27] flex items-center justify-center text-white shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-xl tracking-tight">
                  Limburg Power Administrative Console
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px] uppercase">
                  Live Control
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Exit to Customer Storefront
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-xl p-1.5 border border-slate-200 shadow-xs space-x-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Overview & Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4 text-blue-400" />
            <span>Spare Parts Catalog ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-amber-400" />
            <span>Orders Management ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-red-400" />
            <span>RFQ Inquiries ({quotes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>B2B Client Registry</span>
          </button>
        </div>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block">Total B2B Revenue</span>
                <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                  {currencySymbol}{totalRevenue.toFixed(2)}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-2 block">
                  ↑ 14.8% vs last month
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block">Pending Orders to Dispatch</span>
                <div className="text-2xl font-black font-mono text-amber-600 mt-1">
                  {pendingOrders}
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Central Warehouse Aachen
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block">Open RFQ Quote Requests</span>
                <div className="text-2xl font-black font-mono text-[#9e1b27] mt-1">
                  {pendingQuotes}
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Awaiting engineering approval
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block">Catalog Inventory Size</span>
                <div className="text-2xl font-black font-mono text-blue-600 mt-1">
                  {products.length} Products
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  {lowStockItems.length} items low in stock
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Incoming Orders</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {orders.slice(0, 4).map((o) => (
                    <div key={o.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">{o.orderNumber}</p>
                        <p className="text-slate-500 text-[11px]">{o.company} • {o.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-slate-900">{currencySymbol}{o.total.toFixed(2)}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Inventory Health Alerts</h3>
                {lowStockItems.length === 0 ? (
                  <p className="text-xs text-slate-500">All warehouse stock levels are healthy.</p>
                ) : (
                  <div className="space-y-2 text-xs">
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex justify-between items-center">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-amber-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-amber-700 font-mono">Part #{item.partNumber}</p>
                        </div>
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 shrink-0">
                          {item.stockCount} left
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG (CRUD) */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter by part number, name, OEM, or brand..."
                  className="w-full text-xs outline-none bg-transparent"
                />
              </div>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-lg bg-[#9e1b27] hover:bg-[#861620] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Spare Part</span>
              </button>
            </div>

            {/* Product Add / Edit Modal */}
            {(isAddingProduct || editingProduct) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-base text-slate-900">
                      {editingProduct ? 'Edit Spare Part' : 'Add New Spare Part to Catalog'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Part Number *</label>
                        <input
                          required
                          type="text"
                          value={formData.partNumber}
                          onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">OEM Cross-Reference</label>
                        <input
                          type="text"
                          value={formData.oemNumber}
                          onChange={(e) => setFormData({ ...formData, oemNumber: e.target.value })}
                          placeholder="e.g. Jenbacher 462719"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Product Title / Description *</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Brand</label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Badge Tag</label>
                        <select
                          value={formData.badge || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              badge: (e.target.value as any) || undefined,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="">No Badge</option>
                          <option value="OEM Genuine">OEM Genuine</option>
                          <option value="Fast Mover">Fast Mover</option>
                          <option value="Premium Alternative">Premium Alternative</option>
                          <option value="Special Offer">Special Offer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Price (EUR) *</label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Warehouse Stock *</label>
                        <input
                          required
                          type="number"
                          value={formData.stockCount}
                          onChange={(e) => setFormData({ ...formData, stockCount: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Min. Order Qty</label>
                        <input
                          type="number"
                          value={formData.minOrderQty || 1}
                          onChange={(e) => setFormData({ ...formData, minOrderQty: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Engine Compatibility (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.engineCompatibility.join(', ')}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            engineCompatibility: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProduct(false);
                          setEditingProduct(null);
                        }}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#9e1b27] hover:bg-[#861620] text-white rounded-lg font-bold flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Product</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Part Details</th>
                    <th className="px-4 py-3">OEM Cross-Ref</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">In Stock</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-mono font-bold text-[#9e1b27] block">
                              {p.partNumber}
                            </span>
                            <span className="font-bold text-slate-900 truncate max-w-xs block">
                              {p.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {p.oemNumber || '-'}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {p.brand}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {currencySymbol}{p.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            p.stockCount < 20
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stockCount} pcs
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${p.partNumber}?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900">All Client Orders</h3>
              <span className="text-xs text-slate-500">Total {orders.length} orders recorded</span>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order.id} className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-mono font-bold text-[#9e1b27]">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value as Order['status'])
                        }
                        className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <span className="font-mono font-extrabold text-sm text-slate-900">
                        {currencySymbol}{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900">{order.company}</p>
                      <p className="text-slate-600">Contact: {order.customerName} ({order.email})</p>
                      <p className="text-slate-600">
                        Dispatch to: {order.shippingAddress.street}, {order.shippingAddress.postalCode} {order.shippingAddress.city}, {order.shippingAddress.country}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">Line Items:</p>
                      <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                        {order.items.map((it, idx) => (
                          <li key={idx}>
                            {it.quantity}x {it.product.name} ({currencySymbol}{(it.product.price * it.quantity).toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Payment: <strong className="text-slate-700">{order.paymentMethod}</strong></span>
                    <span>Tracking: <strong className="text-slate-800 font-mono">{order.trackingNumber || 'DHL-EXP-Auto'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RFQ INQUIRIES & QUOTE GENERATOR */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900">Custom Quotation Requests (RFQs)</h3>
              <span className="text-xs text-slate-500">{quotes.length} total inquiries</span>
            </div>

            <div className="divide-y divide-slate-100">
              {quotes.map((q) => (
                <div key={q.id} className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-mono font-bold text-slate-900">
                        {q.quoteNumber}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        Client: {q.company} ({q.customerName})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          q.status === 'Quoted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {q.status}
                      </span>
                      <button
                        onClick={() => handleOpenQuoteModal(q)}
                        className="px-3 py-1 rounded-lg bg-[#9e1b27] text-white text-xs font-bold hover:bg-[#861620] transition-colors"
                      >
                        {q.quotedPrice ? 'Revise Quote' : 'Issue Quote'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-700">
                      <strong>Engine Target:</strong> {q.engineBrand} - {q.engineModel} (S/N: {q.engineSerial || 'N/A'})
                    </p>
                    <p className="text-slate-700">
                      <strong>Requested Items:</strong>
                    </p>
                    <ul className="list-disc list-inside pl-2 text-slate-600">
                      {q.items.map((it, idx) => (
                        <li key={idx}>
                          {it.quantity}x {it.productName} {it.partNumber && `(${it.partNumber})`} - {it.notes}
                        </li>
                      ))}
                    </ul>
                    {q.customerNotes && (
                      <p className="text-slate-500 italic mt-1">Customer Note: "{q.customerNotes}"</p>
                    )}
                  </div>

                  {q.quotedPrice && (
                    <div className="text-xs flex items-center justify-between text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 font-mono">
                      <span>Quoted Price: <strong>{currencySymbol}{q.quotedPrice.toFixed(2)}</strong></span>
                      <span className="font-sans text-[11px] text-emerald-600">{q.adminNotes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal for responding to Quote */}
            {selectedQuote && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-base text-slate-900">
                      Issue Quotation for {selectedQuote.quoteNumber}
                    </h3>
                    <button onClick={() => setSelectedQuote(null)}>
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Quoted Net Price ({currencySymbol}) *
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={quotePriceInput}
                        onChange={(e) => setQuotePriceInput(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Engineering / Dispatch Notes to Customer
                      </label>
                      <textarea
                        rows={3}
                        value={quoteNotesInput}
                        onChange={(e) => setQuoteNotesInput(e.target.value)}
                        placeholder="e.g. In stock ready for 24h courier. 30 days price validity."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedQuote(null)}
                        className="px-4 py-2 border border-slate-300 rounded-lg font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#9e1b27] hover:bg-[#861620] text-white rounded-lg font-bold"
                      >
                        Send Formal Quote
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: B2B CLIENTS REGISTRY */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Registered B2B Cogeneration Clients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm">Süd-Energie Biogas GmbH</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Approved B2B
                  </span>
                </div>
                <p className="text-slate-600">Contact: Markus Weber</p>
                <p className="text-slate-600">Email: client@energie-partner.de</p>
                <p className="text-slate-600">VAT: DE 284 921 734</p>
                <p className="text-slate-600">Registered Engines: 2 units (Jenbacher J320, MAN E2876)</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm">Rhein Cogen Kraftwerke AG</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Approved B2B
                  </span>
                </div>
                <p className="text-slate-600">Contact: Thomas Becker</p>
                <p className="text-slate-600">Email: t.becker@rhein-cogen.com</p>
                <p className="text-slate-600">VAT: DE 194 820 119</p>
                <p className="text-slate-600">Registered Engines: 1 unit (MWM TCG 2020)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
