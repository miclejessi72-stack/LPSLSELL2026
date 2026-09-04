import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  FileText,
  Lock,
} from 'lucide-react';
import { LimburgLogo } from './LimburgLogo';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenAuth: (role?: 'user' | 'admin') => void;
  onOpenRFQ: () => void;
  onOpenExportModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenAuth,
  onOpenRFQ,
  onOpenExportModal,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-16">
      {/* Top USP Trust Strip */}
      <div className="border-b border-slate-800 bg-[#0d0f12] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#9e1b27]/20 border border-[#9e1b27]/30 flex items-center justify-center text-[#9e1b27] shrink-0">
              <Truck className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24-48h Global Express</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Central European dispatch from our high-density logistics center.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Certified OEM Quality</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Tested against manufacturer tolerances and continuous gas engine BMEP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">B2B Invoicing & Net Terms</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Reverse-charge EU invoices, 30-day payment terms for verified operators.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Expert CHP Engineering</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Direct hotline support for engine cross-referencing and service kits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <LimburgLogo height={44} />
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Limburg Power is an international specialist distributor of genuine and high-performance OEM spare parts for Combined Heat and Power (CHP) plants, stationary gas engines, and decentralized energy units.
            </p>

            <div className="space-y-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#9e1b27]" />
                <span>Industriepark Nord 7, 52062 Aachen / Limburg Region</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9e1b27]" />
                <span className="font-mono">+49 (0) 2405 4084 100</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9e1b27]" />
                <span>sales@limburg-power.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Engine Manufacturers */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              Engine Systems
            </h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><a href="#jenbacher" className="hover:text-white transition-colors">Jenbacher Series 2, 3, 4, 6</a></li>
              <li><a href="#man" className="hover:text-white transition-colors">MAN E2876 & E3268</a></li>
              <li><a href="#mwm" className="hover:text-white transition-colors">MWM TCG 2016 / 2020</a></li>
              <li><a href="#caterpillar" className="hover:text-white transition-colors">Caterpillar CG & G3500</a></li>
              <li><a href="#mtu" className="hover:text-white transition-colors">MTU Series 4000 Gas</a></li>
              <li><a href="#deutz" className="hover:text-white transition-colors">Deutz TBG 616 / 620</a></li>
              <li><a href="#scania" className="hover:text-white transition-colors">Scania Biogas Gensets</a></li>
            </ul>
          </div>

          {/* Col 3: Parts Categories */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              Spare Parts Range
            </h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><a href="#spark-plugs" className="hover:text-white transition-colors">Industrial Spark Plugs</a></li>
              <li><a href="#pre-chamber" className="hover:text-white transition-colors">Pre-Chamber Spark Plugs</a></li>
              <li><a href="#filters" className="hover:text-white transition-colors">Oil & Air Filtration</a></li>
              <li><a href="#upf" className="hover:text-white transition-colors">UPF Crankcase Separators</a></li>
              <li><a href="#gaskets" className="hover:text-white transition-colors">MLS Cylinder Head Gaskets</a></li>
              <li><a href="#compensators" className="hover:text-white transition-colors">Exhaust Expansion Bellows</a></li>
              <li><a href="#sensors" className="hover:text-white transition-colors">Knock & Speed Sensors</a></li>
            </ul>
          </div>

          {/* Col 4: Portals & Admin Access */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              B2B Portals & Tools
            </h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button
                  onClick={() => onOpenAuth('user')}
                  className="hover:text-white transition-colors text-left"
                >
                  Customer Account Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('admin')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 text-red-300 font-bold"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Panel Login</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRFQ}
                  className="hover:text-white transition-colors text-left"
                >
                  Submit Inquiry (RFQ)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenExportModal}
                  className="hover:text-white transition-colors text-left text-emerald-400 font-medium"
                >
                  Download 1-in-1 HTML Code
                </button>
              </li>
              <li><span className="text-slate-500">ISO 9001:2015 Certified</span></li>
              <li><span className="text-slate-500">DE 284 921 734 B2B Register</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-[#090a0c] py-4 px-4 sm:px-6 border-t border-slate-800 text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Limburg Power B.V. All rights reserved. Registered trademark. All OEM manufacturer names (Jenbacher, MAN, MWM, MTU, Caterpillar) are used for reference purposes only.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400">General Terms (B2B)</a>
            <a href="#imprint" className="hover:text-slate-400">Imprint / Impressum</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
