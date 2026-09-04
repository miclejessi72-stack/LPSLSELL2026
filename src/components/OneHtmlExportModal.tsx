import React, { useState } from 'react';
import { X, Copy, Download, Check, Code, Sparkles, FileCode } from 'lucide-react';
import { Product } from '../types';

interface OneHtmlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const OneHtmlExportModal: React.FC<OneHtmlExportModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Generate the standalone self-contained HTML
  const generateSingleHtml = () => {
    const productsJson = JSON.stringify(products, null, 2);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Limburg Power - CHP & Gas Engine Spare Parts</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    .font-display { font-family: 'Chakra Petch', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-[#9e1b27] selection:text-white">

  <!-- TOP BAR -->
  <div class="bg-[#111315] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
    <div class="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
      <div class="flex items-center gap-4">
        <span>📞 +49 (0) 2405 4084 100</span>
        <span>✉️ sales@limburg-power.com</span>
        <span class="text-emerald-400 font-semibold hidden md:inline">● 15,000+ OEM Parts in Stock</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-white font-mono">B2B Net / Excl. VAT</span>
        <span class="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-white font-mono">EUR (€)</span>
      </div>
    </div>
  </div>

  <!-- MAIN HEADER WITH EMBEDDED LOGO -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <!-- LIMBURG POWER LOGO -->
      <a href="#" class="flex items-center gap-2 select-none">
        <svg viewBox="0 0 520 160" height="46" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lpRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#8d1520" />
              <stop offset="50%" stop-color="#a31d2a" />
              <stop offset="100%" stop-color="#921722" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="514" height="154" rx="4" fill="none" stroke="#9e1b27" stroke-width="6" />
          <g id="left-symbol">
            <rect x="6" y="6" width="160" height="148" fill="#09090b" />
            <path d="M 68 18 L 42 54 L 42 98 L 112 98 C 134 98 144 86 144 70 C 144 54 132 44 114 44 L 92 44 L 80 60 L 108 60 C 118 60 124 64 124 70 C 124 76 118 80 108 80 L 62 80 L 62 60 L 82 32 Z" fill="#ffffff" />
            <polygon points="60,110 104,110 82,142" fill="#ffffff" />
          </g>
          <g id="right-text">
            <rect x="166" y="6" width="348" height="74" fill="#ffffff" />
            <g transform="translate(180, 58)">
              <text font-family="'Chakra Petch', system-ui" font-size="48" font-weight="800" letter-spacing="2.5" fill="#09090b">LIMB</text>
              <g transform="translate(142, -37)">
                <path d="M 0 0 L 12 0 L 12 24 C 12 34 18 38 27 38 C 36 38 42 34 42 24 L 42 0 L 54 0 L 54 24 C 54 42 42 48 27 48 C 12 48 0 42 0 24 Z" fill="#09090b" />
                <polygon points="42,16 54,4 54,26" fill="#9e1b27" />
              </g>
              <text x="204" y="0" font-family="'Chakra Petch', system-ui" font-size="48" font-weight="800" letter-spacing="2.5" fill="#09090b">RG</text>
              <polygon points="288,-36 308,-36 308,-20" fill="#9e1b27" />
            </g>
            <rect x="166" y="78" width="348" height="4" fill="#9e1b27" />
            <rect x="166" y="80" width="348" height="74" fill="url(#lpRed)" />
            <g transform="translate(182, 133)">
              <text x="0" y="0" font-family="'Chakra Petch', system-ui" font-size="44" font-weight="800" letter-spacing="3" fill="#ffffff">P</text>
              <g transform="translate(76, -16)">
                <circle cx="0" cy="0" r="19" fill="none" stroke="#ffffff" stroke-width="4" />
                <path d="M 2 -13 L -9 0 L -1 0 L -3 13 L 9 -1 L 1 -1 Z" fill="#ffffff" />
              </g>
              <text x="116" y="0" font-family="'Chakra Petch', system-ui" font-size="44" font-weight="800" letter-spacing="7" fill="#ffffff">WER</text>
            </g>
          </g>
        </svg>
      </a>

      <!-- SEARCH BAR -->
      <div class="flex-1 max-w-xl mx-4">
        <input
          id="searchInput"
          type="text"
          oninput="filterProducts()"
          placeholder="Search part #, OEM ref, Jenbacher, spark plug, filter..."
          class="w-full px-4 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#9e1b27]/20 focus:border-[#9e1b27] outline-none"
        />
      </div>

      <!-- AUTH & CART BUTTONS -->
      <div class="flex items-center gap-2">
        <button onclick="toggleAuthModal()" class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold hover:bg-slate-50">
          User / Admin Login
        </button>
        <button onclick="toggleAdminPanel()" class="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-black">
          Admin Panel
        </button>
        <button onclick="openCart()" class="px-3.5 py-1.5 rounded-lg bg-[#9e1b27] text-white text-xs font-bold hover:bg-[#83141f] flex items-center gap-1.5">
          <span>Cart (<span id="cartBadge">0</span>)</span>
        </button>
      </div>
    </div>
  </header>

  <!-- 3-STEP ENGINE FINDER -->
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="bg-gradient-to-r from-slate-900 to-[#9e1b27] text-white p-6 rounded-2xl shadow-lg">
      <h2 class="font-display text-xl font-bold">Find Spare Parts for your CHP Gas Engine</h2>
      <p class="text-xs text-slate-300 mt-1">Select your manufacturer and model to filter guaranteed OEM replacements.</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <select id="engineBrandSelect" onchange="filterProducts()" class="bg-white text-slate-900 px-3 py-2 rounded-lg text-xs font-semibold">
          <option value="">-- All Manufacturers --</option>
          <option value="Jenbacher">Jenbacher</option>
          <option value="MAN">MAN Engines</option>
          <option value="MWM">MWM / Caterpillar</option>
          <option value="MTU">MTU Onsite</option>
          <option value="Deutz">Deutz AG</option>
        </select>
        <select id="categorySelect" onchange="filterProducts()" class="bg-white text-slate-900 px-3 py-2 rounded-lg text-xs font-semibold">
          <option value="">-- All Categories --</option>
          <option value="ignition">Spark Plugs & Ignition</option>
          <option value="filters">Filters & Filtration</option>
          <option value="gaskets">Gaskets & Compensators</option>
          <option value="mechanics">Engine Mechanics</option>
          <option value="sensors">Sensors & Electronics</option>
          <option value="lubricants">Coolants & Lubricants</option>
        </select>
        <button onclick="filterProducts()" class="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black">
          Filter Parts Now
        </button>
      </div>
    </div>
  </div>

  <!-- PRODUCTS CATALOG GRID -->
  <main class="max-w-7xl mx-auto px-4 pb-12">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-slate-900 text-base">In-Stock Spare Parts</h3>
      <span id="productCount" class="text-xs text-slate-500 font-medium"></span>
    </div>
    <div id="productGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <!-- Injected via JavaScript -->
    </div>
  </main>

  <!-- ADMIN PANEL MODAL / OVERLAY -->
  <div id="adminModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-3xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="font-display font-bold text-lg text-slate-900">Limburg Power - Admin Console</h3>
        <button onclick="toggleAdminPanel()" class="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="p-3 bg-slate-50 rounded-xl border"><p class="text-xs text-slate-500">Total Products</p><p id="admTotalProd" class="text-xl font-bold font-mono">12</p></div>
        <div class="p-3 bg-slate-50 rounded-xl border"><p class="text-xs text-slate-500">Orders</p><p class="text-xl font-bold font-mono text-emerald-700">2</p></div>
        <div class="p-3 bg-slate-50 rounded-xl border"><p class="text-xs text-slate-500">Active RFQs</p><p class="text-xl font-bold font-mono text-[#9e1b27]">2</p></div>
      </div>
      <h4 class="font-bold text-sm text-slate-900 pt-2">Add New Product</h4>
      <form onsubmit="adminAddProduct(event)" class="grid grid-cols-2 gap-3 text-xs">
        <input id="newPartNum" required placeholder="Part Number (e.g. LP-9988)" class="border p-2 rounded" />
        <input id="newPartName" required placeholder="Product Title" class="border p-2 rounded" />
        <input id="newBrand" required placeholder="Brand (e.g. Denso)" class="border p-2 rounded" />
        <input id="newPrice" required type="number" step="0.01" placeholder="Price (EUR)" class="border p-2 rounded" />
        <input id="newStock" required type="number" placeholder="Stock Count" class="border p-2 rounded" />
        <input id="newImg" placeholder="Image URL" class="border p-2 rounded" />
        <button type="submit" class="col-span-2 py-2 bg-[#9e1b27] text-white font-bold rounded">Save Product to Live Store</button>
      </form>
    </div>
  </div>

  <!-- DATA & SCRIPTS -->
  <script>
    let products = ${productsJson};
    let cart = [];

    function renderProducts(list) {
      const grid = document.getElementById('productGrid');
      document.getElementById('productCount').innerText = list.length + ' parts available';
      grid.innerHTML = list.map(p => \`
        <div class="bg-white rounded-xl border border-slate-200 hover:border-slate-400 p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all">
          <div>
            <div class="w-full h-40 bg-slate-100 rounded-lg overflow-hidden mb-3">
              <img src="\${p.imageUrl}" alt="\${p.name}" class="w-full h-full object-cover" />
            </div>
            <div class="flex justify-between text-[11px] font-mono mb-1">
              <span class="font-bold text-[#9e1b27]">\${p.partNumber}</span>
              <span class="text-slate-500">\${p.brand}</span>
            </div>
            <h4 class="text-xs font-bold text-slate-900 line-clamp-2">\${p.name}</h4>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-base font-extrabold font-mono text-slate-900">€\${p.price.toFixed(2)}</span>
              <span class="text-[10px] text-slate-400 block">excl. VAT</span>
            </div>
            <button onclick="addToCart('\${p.id}')" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#9e1b27] text-white text-xs font-bold transition-colors">
              + Cart
            </button>
          </div>
        </div>
      \`).join('');
    }

    function filterProducts() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      const brand = document.getElementById('engineBrandSelect').value.toLowerCase();
      const cat = document.getElementById('categorySelect').value;

      const filtered = products.filter(p => {
        const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.partNumber.toLowerCase().includes(q) || p.oemNumber.toLowerCase().includes(q);
        const matchesCat = !cat || p.category === cat;
        const matchesBrand = !brand || p.engineCompatibility.some(e => e.toLowerCase().includes(brand));
        return matchesQuery && matchesCat && matchesBrand;
      });
      renderProducts(filtered);
    }

    function addToCart(id) {
      const p = products.find(item => item.id === id);
      if (p) {
        cart.push(p);
        document.getElementById('cartBadge').innerText = cart.length;
        alert('Added ' + p.name + ' to shopping cart!');
      }
    }

    function openCart() {
      if (cart.length === 0) {
        alert('Shopping cart is empty.');
        return;
      }
      const total = cart.reduce((s, i) => s + i.price, 0);
      alert('Cart total: €' + total.toFixed(2) + ' (' + cart.length + ' items). Ready for B2B dispatch!');
    }

    function toggleAdminPanel() {
      const el = document.getElementById('adminModal');
      el.classList.toggle('hidden');
    }

    function toggleAuthModal() {
      alert('Demo credentials:\\n\\nCustomer: client@energie-partner.de (Pass: demo1234)\\nAdmin: admin@limburg-power.com (Pass: admin2026)');
    }

    function adminAddProduct(e) {
      e.preventDefault();
      const newP = {
        id: 'prod-' + Date.now(),
        partNumber: document.getElementById('newPartNum').value,
        oemNumber: 'OEM-REF',
        name: document.getElementById('newPartName').value,
        brand: document.getElementById('newBrand').value,
        category: 'ignition',
        subCategory: 'Spare Parts',
        price: parseFloat(document.getElementById('newPrice').value) || 99,
        inStock: true,
        stockCount: parseInt(document.getElementById('newStock').value) || 50,
        description: 'Quality spare part',
        specifications: {},
        engineCompatibility: ['Jenbacher J320 GS'],
        imageUrl: document.getElementById('newImg').value || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        minOrderQty: 1
      };
      products.unshift(newP);
      renderProducts(products);
      toggleAdminPanel();
      alert('Product ' + newP.partNumber + ' added to catalog successfully!');
    }

    // Initialize
    renderProducts(products);
  </script>
</body>
</html>`;
  };

  const htmlContent = generateSingleHtml();

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'limburg-power-chp-store.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#9e1b27] flex items-center justify-center text-white">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                Full Code: 1-in-1 Self-Contained HTML Bundle
              </h3>
              <p className="text-xs text-slate-400">
                Single-file HTML export with embedded SVG logo, catalog, user & admin interfaces
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9e1b27]" />
              <span className="text-slate-800">
                Contains complete storefront, Limburg Power logo SVG, search, 3-step engine finder, cart, and admin console in a single file!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3.5 py-1.5 rounded-lg bg-[#9e1b27] hover:bg-[#861620] text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .html</span>
              </button>
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-700 block mb-1">
              Live Standalone HTML Code Preview ({htmlContent.length} bytes):
            </span>
            <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96 leading-relaxed select-all">
              {htmlContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
