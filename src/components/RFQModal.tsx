import React, { useState } from 'react';
import { X, FileText, Plus, Trash2, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product, QuoteRequest, User as UserType } from '../types';
import { ENGINE_BRANDS } from '../data/catalog';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  initialProduct?: Product | null;
  initialItems?: { productName: string; partNumber?: string; quantity: number }[];
  onSubmitQuote: (quote: QuoteRequest) => void;
}

export const RFQModal: React.FC<RFQModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialProduct,
  initialItems,
  onSubmitQuote,
}) => {
  if (!isOpen) return null;

  const [company, setCompany] = useState(currentUser?.company || '');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [engineBrand, setEngineBrand] = useState('Jenbacher');
  const [engineModel, setEngineModel] = useState('Jenbacher J320 GS');
  const [engineSerial, setEngineSerial] = useState('');
  const [urgency, setUrgency] = useState<QuoteRequest['urgency']>('Standard (24h)');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Items list
  const defaultItems = initialProduct
    ? [
        {
          productName: initialProduct.name,
          partNumber: initialProduct.partNumber,
          quantity: initialProduct.minOrderQty || 4,
          notes: '',
        },
      ]
    : initialItems && initialItems.length > 0
    ? initialItems.map((i) => ({ ...i, notes: '' }))
    : [
        {
          productName: 'Denso GL3-5 Industrial Iridium Spark Plug',
          partNumber: 'LP-120564',
          quantity: 24,
          notes: 'Standard 2,000h maintenance kit',
        },
      ];

  const [items, setItems] = useState(defaultItems);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productName: '',
        partNumber: '',
        quantity: 1,
        notes: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuote: QuoteRequest = {
      id: `rfq-${Date.now()}`,
      quoteNumber: `LP-RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      email,
      company,
      phone,
      engineBrand,
      engineModel,
      engineSerial,
      urgency,
      items,
      customerNotes,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    onSubmitQuote(newQuote);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 space-y-5 relative">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#9e1b27] flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Request for Quotation (RFQ)
              </h3>
              <p className="text-xs text-slate-500">
                Direct quotation from Limburg Power technical engineering team
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">RFQ Received by Engineering</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our CHP spare parts specialists will review your part numbers against manufacturer drawings and reply within {urgency === 'Urgent Breakdown (Same Day)' ? '2 hours' : '24 hours'}.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-lg bg-[#9e1b27] text-white text-xs font-bold hover:bg-[#861620]"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Plant Operator Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Plant Name *</label>
                <input
                  required
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. BioEnergy Plant Aachen"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Person *</label>
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="First & Last Name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="purchasing@company.de"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 (0) ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Engine Data */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block text-xs">
                Cogeneration Unit & Engine Reference
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Engine Brand</label>
                  <select
                    value={engineBrand}
                    onChange={(e) => setEngineBrand(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                  >
                    {ENGINE_BRANDS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Engine Model / Series</label>
                  <input
                    type="text"
                    value={engineModel}
                    onChange={(e) => setEngineModel(e.target.value)}
                    placeholder="e.g. Jenbacher J320 GS"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Serial # / Year</label>
                  <input
                    type="text"
                    value={engineSerial}
                    onChange={(e) => setEngineSerial(e.target.value)}
                    placeholder="e.g. JB-12345 (optional)"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Line Items List */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800">Requested Spare Parts</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9e1b27] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <input
                      required
                      type="text"
                      placeholder="Part Name or Description"
                      value={item.productName}
                      onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Part # / OEM Ref"
                      value={item.partNumber || ''}
                      onChange={(e) => handleItemChange(idx, 'partNumber', e.target.value)}
                      className="w-32 px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-mono"
                    />
                    <input
                      required
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1.5 border border-slate-300 rounded bg-white text-xs text-center font-bold"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Inquiry Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as QuoteRequest['urgency'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Standard (24h)">Standard Inquiry (Quotation within 24 hours)</option>
                <option value="Urgent Breakdown (Same Day)">Urgent Breakdown / Plant Stoppage (Immediate)</option>
                <option value="Planned Overhaul">Planned Overhaul / Turnaround (Scheduled delivery)</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Additional Requirements / Notes</label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Include any specific OEM drawings, packaging requirements, certificate of origin..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#9e1b27] hover:bg-[#861620] text-white rounded-lg font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit RFQ to Limburg Power</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
