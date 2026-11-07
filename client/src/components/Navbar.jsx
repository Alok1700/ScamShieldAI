import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  Info, 
  Globe, 
  Menu, 
  X,
  PhoneCall,
  Activity,
  Zap
} from 'lucide-react';
import { useScanStore } from '../store/scanStore';
import { scanService } from '../services/api';
import { t } from '../utils/i18n';

export default function Navbar() {
  const location = useLocation();
  const { language, setLanguage } = useScanStore();
  const [systemReady, setSystemReady] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    scanService.getReadiness()
      .then(data => setSystemReady(data.status === 'ready'))
      .catch(() => setSystemReady(false));

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t('nav.home', language) },
    { to: '/scanner', label: t('nav.scanner', language), icon: ShieldAlert, highlight: true },
    { to: '/awareness', label: t('nav.awareness', language), icon: BookOpen },
    { to: '/about', label: t('nav.about', language), icon: Info },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]' 
          : 'bg-background/60 backdrop-blur-lg border-b border-card-border/60'
      }`}
    >
      {/* Top micro cyber accent light line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-accent/50 to-transparent opacity-80 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 whitespace-nowrap">
        {/* Brand Logo - High-Tech Glowing Shield */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative p-[1.5px] rounded-xl bg-gradient-to-tr from-indigo-500 via-primary to-cyan-accent shadow-[0_0_20px_rgba(34,211,238,0.25)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-background/95 rounded-[10px] flex items-center justify-center backdrop-blur-md">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-accent group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-white transition-colors">
              ScamShield<span className="text-cyan-accent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">.AI</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-ping"></span>
              v1.0
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Capsule - Modern Sleek Floating Island */}
        <nav className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-card-bg/40 border border-white/[0.06] backdrop-blur-md shadow-inner shrink-0">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/25 via-indigo-500/20 to-cyan-500/20 text-cyan-accent border border-cyan-accent/40 shadow-[0_0_15px_-3px_rgba(34,211,238,0.3)]'
                    : 'text-text-secondary hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.icon && (
                  <link.icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-accent' : 'opacity-70 text-text-secondary group-hover:text-white'}`} />
                )}
                <span>{link.label}</span>
                {link.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools - Single Crisp Line */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
          {/* Emergency 1930 Cyber Helpline Pill */}
          <a
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            title="National Cyber Financial Fraud Helpline: 1930"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 transition-all text-xs font-mono"
          >
            <PhoneCall className="w-3 h-3 animate-pulse" />
            <span className="font-semibold text-[11px]">{t('nav.help1930', language)}</span>
          </a>

          {/* Engine Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-[0_0_10px_rgba(34,197,94,0.15)]">
            <span className={`w-2 h-2 rounded-full ${systemReady ? 'bg-success shadow-[0_0_8px_#22c55e]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`}></span>
            <span className="text-[11px] font-semibold">{systemReady ? t('nav.online', language) : t('nav.shieldActive', language)}</span>
          </div>

          {/* Compact Glass Language Selector */}
          <div className="relative flex items-center bg-card-bg/60 hover:bg-card-bg border border-white/[0.08] hover:border-cyan-accent/40 rounded-xl px-2.5 py-1 text-xs transition-colors backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-cyan-accent mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-text-primary focus:outline-none cursor-pointer text-xs pr-1 font-semibold"
              aria-label="Select explanation language"
            >
              <option value="en" className="bg-secondary-bg text-text-primary">EN - English</option>
              <option value="hi" className="bg-secondary-bg text-text-primary">HI - हिन्दी</option>
            </select>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-card-bg/80 border border-white/[0.08] hover:border-cyan-accent/40 text-text-secondary hover:text-white transition-all backdrop-blur-md"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-accent" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Glass Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-secondary-bg/95 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-cyan-500/20 text-cyan-accent border border-cyan-accent/30 shadow-cyber'
                    : 'text-text-secondary hover:text-white hover:bg-card-bg/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.icon && <link.icon className="w-4 h-4 opacity-80" />}
                  <span>{link.label}</span>
                </div>
                {link.highlight && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-accent/20 text-cyan-accent">
                    {t('nav.scanBadge', language)}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Mobile Language Switcher Pills */}
          <div className="pt-2 border-t border-card-border/60 flex items-center justify-between">
            <span className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-accent" />
              {t('nav.langSelect', language)}:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { code: 'en', label: 'EN' },
                { code: 'hi', label: 'हिन्दी' }
              ].map(item => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === item.code
                      ? 'bg-cyan-accent/20 text-cyan-accent border border-cyan-accent/40 shadow-sm'
                      : 'bg-card-bg/60 text-text-secondary hover:text-white border border-card-border/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-card-border/60 flex items-center justify-between text-xs text-text-secondary px-1">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className={`w-2 h-2 rounded-full ${systemReady ? 'bg-success' : 'bg-emerald-400'}`}></span>
              Status: {systemReady ? t('nav.statusEnginesOnline', language) : t('nav.statusShieldActive', language)}
            </span>
            <a 
              href="https://cybercrime.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-danger flex items-center gap-1 font-mono text-[11px] font-bold"
            >
              <PhoneCall className="w-3 h-3" />
              {t('nav.helpline1930', language)}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
