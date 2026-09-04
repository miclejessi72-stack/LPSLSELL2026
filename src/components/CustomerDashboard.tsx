import React, { useState } from 'react';
import {
  Layers,
  Package,
  FileText,
  Plus,
  Truck,
  CheckCircle,
  Clock,
  Building,
  User,
  ExternalLink,
  ChevronRight,
  Wrench,
  Download,
} from 'lucide-react';
import { User as UserType, Order, QuoteRequest, UserPlantEngine } from '../types';

interface CustomerDashboardProps {
  user: UserType;
  orders: Order[];
  quotes: QuoteRequest[];
  currency: 'EUR' | 'USD' | 'GBP';
  onFilterEngine: (brand: string, model: string) => void;
  onOpenRFQ: () => void;
  onClose: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  orders,
  quotes,
  currency,
  onFilterEngine,
  onOpenRFQ,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'orders' | 'quotes' | 'profile'>('fleet');
  const [registeredEngines, setRegisteredEngines] = useState<UserPlantEngine[]>(
    user.registeredEngines || []
  );

  // Add Engine Form
  const [showAddEngine, setShowAddEngine] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [newBrand, setNewBrand] = useState('Jenbacher');
  const [newModel, setNewModel] = useState('Jenbacher J320 GS');
  const [newSerial, setNewSerial] = useState('');
  const [newHours, setNewHours] = useState(15000);

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';

  // Filter orders for this user
  const userOrders = orders.filter((o) => o.email === user.email || o.customerName === user.name);
  const userQuotes = quotes.filter((q) => q.email === user.email || q.customerName === user.name);

  const handleAddEngineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEng: UserPlantEngine = {
      id: `eng-${Date.now()}`,
      plantName: newPlantName || 'New CHP Installation',
      brand: newBrand,
      model: newModel,
      serialNumber: newSerial || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      operatingHours: Number(newHours),
      commissionYear: 2022,
    };
    setRegisteredEngines([...registeredEngines, newEng]);
    setShowAddEngine(false);
    setNewPlantName('');
    setNewSerial('');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={onClose} className="hover:text-slate-900 font-semibold">
              Storefront
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold">B2B Customer Portal</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
          >
            Back to Shop Catalog
          </button>
        </div>

        {/* User Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-[#9e1b27] text-white flex items-center justify-center font-black text-xl shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  Verified B2B Client
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <Building className="w-3.5 h-3.5" />
                <span>{user.company}</span>
                {user.vatId && <span>• VAT: {user.vatId}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRFQ}
              className="px-4 py-2.5 rounded-lg bg-[#9e1b27] hover:bg-[#851520] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Submit New RFQ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4 text-xs sm:text-sm font-bold overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('fleet')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'fleet'
                ? 'border-[#9e1b27] text-[#9e1b27]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My CHP Engines Fleet ({registeredEngines.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#9e1b27] text-[#9e1b27]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Shipments ({userOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quotes'
                ? 'border-[#9e1b27] text-[#9e1b27]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quotations & RFQs ({userQuotes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#9e1b27] text-[#9e1b27]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Plant Addresses & Settings</span>
          </button>
        </div>

        {/* Tab 1: Engine Fleet */}
        {activeTab === 'fleet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Registered CHP Plants</h3>
                <p className="text-xs text-slate-500">
                  Select any engine to instantly filter the store for 100% compatible maintenance parts.
                </p>
              </div>
              <button
                onClick={() => setShowAddEngine(!showAddEngine)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Another Engine</span>
              </button>
            </div>

            {/* Add Engine Form Modal/Accordion */}
            {showAddEngine && (
              <form
                onSubmit={handleAddEngineSubmit}
                className="p-5 bg-white rounded-xl border border-slate-300 shadow-sm space-y-4 text-xs animate-in fade-in"
              >
                <h4 className="font-bold text-sm text-slate-900">Add New Gas Engine to Fleet</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Plant Name / Location</label>
                    <input
                      required
                      type="text"
                      value={newPlantName}
                      onChange={(e) => setNewPlantName(e.target.value)}
                      placeholder="e.g. Biogas Station 3"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Manufacturer</label>
                    <select
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Jenbacher">Jenbacher</option>
                      <option value="MAN Engines">MAN Engines</option>
                      <option value="MWM / Caterpillar Energy">MWM / Caterpillar</option>
                      <option value="MTU Onsite Energy">MTU Onsite</option>
                      <option value="Deutz AG">Deutz AG</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Model / Type</label>
                    <input
                      required
                      type="text"
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      placeholder="e.g. Jenbacher J320 GS"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Engine Serial Number</label>
                    <input
                      type="text"
                      value={newSerial}
                      onChange={(e) => setNewSerial(e.target.value)}
                      placeholder="e.g. JB-99214"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEngine(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#9e1b27] text-white font-bold hover:bg-[#851520]"
                  >
                    Save Engine
                  </button>
                </div>
              </form>
            )}

            {/* Grid of Registered Engines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registeredEngines.map((eng) => (
                <div
                  key={eng.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#9e1b27] uppercase tracking-wider">
                        {eng.brand}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        S/N: {eng.serialNumber}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 mt-1">
                      {eng.plantName}
                    </h4>
                    <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">
                      Model: {eng.model}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Running Hours:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {eng.operatingHours.toLocaleString()} h
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Next Service Interval:</span>
                        <span className="font-mono font-bold text-emerald-700">
                          In 1,600 h (Spark Plugs + Oil)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onFilterEngine(eng.brand, eng.model);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#9e1b27] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Find Matching Parts for this Engine</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900">Order History & Deliveries</h3>
              <span className="text-xs text-slate-500">Showing {userOrders.length} orders</span>
            </div>

            {userOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No orders found under this account yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {userOrders.map((order) => (
                  <div key={order.id} className="p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#9e1b27]">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            order.status === 'Dispatched'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Processing'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="font-mono font-extrabold text-sm text-slate-900">
                          {currencySymbol}{order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="font-medium text-slate-800">
                            {item.quantity}x {item.product.name} ({item.product.partNumber})
                          </span>
                          <span className="font-mono text-slate-600">
                            {currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Tracking: <strong className="text-slate-800 font-mono">{order.trackingNumber || 'Pending'}</strong></span>
                      </div>
                      <button
                        onClick={() => alert(`Generating Commercial Invoice for ${order.orderNumber}...`)}
                        className="text-[#9e1b27] hover:underline font-bold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Invoice PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Quotes / RFQs */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900">Submitted RFQs & Quotes</h3>
              <button
                onClick={onOpenRFQ}
                className="px-3 py-1.5 rounded-lg bg-[#9e1b27] text-white text-xs font-bold hover:bg-[#861620]"
              >
                + New RFQ
              </button>
            </div>

            {userQuotes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active quotations submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {userQuotes.map((q) => (
                  <div key={q.id} className="p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {q.quoteNumber}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          Engine: {q.engineModel || 'General Inquiry'}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          q.status === 'Quoted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Status: {q.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {q.items.map((it, idx) => (
                        <p key={idx} className="text-slate-700">
                          • <strong>{it.quantity}x</strong> {it.productName} ({it.partNumber || 'Custom'})
                        </p>
                      ))}
                    </div>

                    {q.quotedPrice && (
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-emerald-900">Special B2B Quoted Price:</span>
                          <span className="font-mono text-base font-extrabold text-emerald-800">
                            {currencySymbol}{q.quotedPrice.toFixed(2)}
                          </span>
                        </div>
                        {q.adminNotes && (
                          <p className="text-[11px] text-emerald-700 mt-1">
                            Limburg Power Note: {q.adminNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile / Plant Address */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Company & Dispatch Addresses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Company Details</span>
                <p className="text-slate-600">Company: {user.company}</p>
                <p className="text-slate-600">VAT ID: {user.vatId || 'Not set'}</p>
                <p className="text-slate-600">Contact: {user.name}</p>
                <p className="text-slate-600">Email: {user.email}</p>
                <p className="text-slate-600">Phone: {user.phone || '+49 (0) 89 4521 890'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Standard Delivery Address</span>
                <p className="text-slate-600">{user.company}</p>
                <p className="text-slate-600">{user.address || 'Kraftwerkstraße 14'}</p>
                <p className="text-slate-600">80331 {user.city || 'Munich'}</p>
                <p className="text-slate-600">{user.country || 'Germany'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
