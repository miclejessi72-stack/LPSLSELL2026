import React, { useState } from 'react';
import { Wrench, ChevronRight, CheckCircle2, RotateCcw, Flame } from 'lucide-react';
import { ENGINE_BRANDS, CATEGORIES } from '../data/catalog';

interface EngineFinderProps {
  selectedBrand: string;
  selectedModel: string;
  selectedCategory: string;
  onFilterChange: (brand: string, model: string, category: string) => void;
  onReset: () => void;
}

export const EngineFinder: React.FC<EngineFinderProps> = ({
  selectedBrand,
  selectedModel,
  selectedCategory,
  onFilterChange,
  onReset,
}) => {
  const [brand, setBrand] = useState(selectedBrand);
  const [model, setModel] = useState(selectedModel);
  const [category, setCategory] = useState(selectedCategory);

  const currentBrandObj = ENGINE_BRANDS.find((b) => b.name === brand || b.id === brand);
  const availableModels = currentBrandObj ? currentBrandObj.models : [];

  const handleSearch = () => {
    onFilterChange(brand, model, category);
  };

  const handleQuickSelect = (brandName: string, modelName: string) => {
    setBrand(brandName);
    setModel(modelName);
    onFilterChange(brandName, modelName, category);
  };

  const hasActiveFilters = Boolean(brand || model || (category && category !== 'all'));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#9e1b27] px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
            <Wrench className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight">
              CHP & Gas Engine Spare Parts Finder
            </h2>
            <p className="text-xs text-slate-300">
              Select your engine manufacturer, model series, and component category to view guaranteed compatible OEM parts.
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setBrand('');
              setModel('');
              setCategory('all');
              onReset();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* 3 Step Selectors */}
      <div className="p-5 sm:p-6 bg-slate-50/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Engine Manufacturer */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">
                1
              </span>
              <span>1. Engine Manufacturer</span>
            </label>
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setModel('');
              }}
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#9e1b27] focus:ring-2 focus:ring-[#9e1b27]/20 outline-none transition-all shadow-2xs"
            >
              <option value="">-- All Manufacturers --</option>
              {ENGINE_BRANDS.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Engine Model */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">
                2
              </span>
              <span>2. Engine Series / Model</span>
            </label>
            <select
              value={model}
              disabled={!brand && availableModels.length === 0}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#9e1b27] focus:ring-2 focus:ring-[#9e1b27]/20 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400 shadow-2xs"
            >
              <option value="">{brand ? '-- All Compatible Models --' : '-- Choose Brand First --'}</option>
              {availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Component Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">
                3
              </span>
              <span>3. Component Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#9e1b27] focus:ring-2 focus:ring-[#9e1b27]/20 outline-none transition-all shadow-2xs"
            >
              <option value="all">-- All Categories --</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button & Quick Tags */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Quick Engine Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#9e1b27]" />
              <span>Popular CHP Units:</span>
            </span>
            {[
              { b: 'Jenbacher', m: 'Jenbacher J320 GS' },
              { b: 'MAN Engines', m: 'MAN E2876 LE302' },
              { b: 'MWM / Caterpillar Energy', m: 'MWM TCG 2020 V12' },
              { b: 'MAN Engines', m: 'MAN E2842 LE312' },
            ].map((tag) => (
              <button
                key={tag.m}
                onClick={() => handleQuickSelect(tag.b, tag.m)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                  model === tag.m
                    ? 'bg-[#9e1b27] border-[#9e1b27] text-white font-bold'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                }`}
              >
                {tag.m}
              </button>
            ))}
          </div>

          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#9e1b27] hover:bg-[#861620] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Show Matching Parts</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
