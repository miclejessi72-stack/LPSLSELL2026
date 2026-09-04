import React, { useState } from 'react';
import { X, Shield, User, Lock, Mail, Building, ArrowRight, CheckCircle } from 'lucide-react';
import { UserRole, User as UserType } from '../types';
import { DEMO_USERS } from '../data/catalog';
import { LimburgLogo } from './LimburgLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'user',
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);

  // Form Fields
  const [email, setEmail] = useState(
    defaultRole === 'admin' ? 'admin@limburg-power.com' : 'client@energie-partner.de'
  );
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [vatId, setVatId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@limburg-power.com');
      setPassword('admin2026');
    } else {
      setEmail('client@energie-partner.de');
      setPassword('demo1234');
    }
    setError('');
  };

  const handleDemoLogin = (role: UserRole) => {
    const demoUser = DEMO_USERS.find((u) => u.role === role);
    if (demoUser) {
      onLoginSuccess(demoUser);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'login') {
      // Find matching user or generate authenticated session
      const found = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === selectedRole
      );

      if (found) {
        onLoginSuccess(found);
        onClose();
      } else {
        // Allow login with created profile
        const newUser: UserType = {
          id: `usr-${Date.now()}`,
          email,
          name: email.split('@')[0],
          company: selectedRole === 'admin' ? 'Limburg Power Admin HQ' : 'Custom Energy Plant GmbH',
          role: selectedRole,
          vatId: 'DE 99887766',
        };
        onLoginSuccess(newUser);
        onClose();
      }
    } else {
      // Register
      const registeredUser: UserType = {
        id: `usr-${Date.now()}`,
        email,
        name: name || 'Operator',
        company: company || 'Cogeneration Systems Ltd.',
        role: 'user',
        vatId,
        phone,
      };
      onLoginSuccess(registeredUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="pt-6 px-6 pb-4 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-3">
            <LimburgLogo height={38} />
          </div>

          <div className="text-center">
            <h2 className="text-base font-bold font-display tracking-tight text-white">
              Limburg Power B2B & Admin Portal
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure authentication for plant operators and logistics administrators
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="mt-4 grid grid-cols-2 p-1 bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => handleRoleSwitch('user')}
              className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'user'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Login</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-[#9e1b27] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* 1-Click Quick Demo Access Bar */}
        <div className="p-3 bg-amber-50/80 border-b border-amber-200 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 text-[11px]">Instant Demo Credentials:</span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('user')}
              className="py-1 px-2 rounded bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-medium text-[11px] text-left truncate transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="truncate">Demo User (Plant Mgr)</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="py-1 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-900 text-white font-medium text-[11px] text-left truncate transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3 h-3 text-red-400" />
              <span className="truncate">Demo Admin Panel</span>
            </button>
          </div>
        </div>

        {/* Login/Register Form */}
        <div className="p-6">
          {/* Tabs */}
          {selectedRole === 'user' && (
            <div className="flex border-b border-slate-200 mb-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('login')}
                className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'login'
                    ? 'border-[#9e1b27] text-[#9e1b27]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'register'
                    ? 'border-[#9e1b27] text-[#9e1b27]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Register B2B Account
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {activeTab === 'register' && selectedRole === 'user' && (
              <>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name *</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      required
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. BioEnergy Plant Aachen GmbH"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Person *</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">VAT ID</label>
                    <input
                      type="text"
                      value={vatId}
                      onChange={(e) => setVatId(e.target.value)}
                      placeholder="DE 123456789"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg uppercase"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {selectedRole === 'admin' ? 'Admin Username / Email' : 'Business Email *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'admin@limburg-power.com' : 'purchasing@company.de'}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-slate-900 hover:bg-black'
                  : 'bg-[#9e1b27] hover:bg-[#851520]'
              }`}
            >
              <span>{activeTab === 'login' ? `Sign In as ${selectedRole === 'admin' ? 'Admin' : 'Customer'}` : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer notice */}
          <p className="text-[11px] text-slate-400 text-center mt-4">
            Encrypted 256-bit TLS connection • Limburg Power B2B Platform
          </p>
        </div>
      </div>
    </div>
  );
};
