import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Menu, X, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const NAV_ITEMS = [
  { id: 'how-it-works', label: 'How It Works', href: '/#how-it-works' },
  { id: 'voice-assessment', label: 'Voice Assessment', href: '/disclaimer' },
  { id: 'reports', label: 'Sample Briefing', href: '/report' },
  { id: 'about', label: 'About', href: '/#about' },
  { id: 'disclaimer', label: 'Disclaimer', href: '/disclaimer' },
] as const;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
    setIsMobileOpen(false);
  };

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    return location.pathname === href;
  };

  return (
    <>
      <header
        style={{
          backgroundColor: isScrolled
            ? 'color-mix(in sRGB, var(--theme-surface) 90%, transparent)'
            : 'color-mix(in sRGB, var(--theme-bg) 80%, transparent)',
          borderBottomColor: isScrolled ? 'var(--theme-border)' : 'var(--theme-border)',
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out border-b backdrop-blur-md"
      >
        <div
          className={
            'mx-auto max-w-7xl flex items-center justify-between px-5 sm:px-8 lg:px-12 transition-all duration-300 ease-out ' +
            (isScrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-[72px]')
          }
        >
          {/* Left: Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group shrink-0 focus:outline-none cursor-pointer"
            aria-label="Aura Home"
          >
            <div
              className="w-7.5 h-7.5 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]"
              style={{ backgroundColor: 'var(--theme-brand)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}
            >
              <Mic className="text-white w-4 h-4" strokeWidth={2.25} />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight" style={{ color: 'var(--theme-text)' }}>Aura</span>
          </button>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  style={{
                    color: active ? 'var(--theme-brand)' : 'var(--theme-text-muted)',
                    backgroundColor: active ? 'var(--theme-brand-light)' : 'transparent',
                  }}
                  className="relative px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none hover:opacity-90"
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{ border: '1px solid var(--theme-brand-light)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Theme Toggle + CTA + Auth + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ color: 'var(--theme-text-muted)' }}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:opacity-90 transition-all duration-200 focus:outline-none cursor-pointer border border-transparent hover:border-[var(--theme-border)] hover:bg-[var(--theme-border)]"
            >
              {theme === 'dark'
                ? <Sun size={16} strokeWidth={2} />
                : <Moon size={16} strokeWidth={2} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 mr-1">
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{ color: 'var(--theme-text)' }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none cursor-pointer hover:opacity-80"
                >
                  <UserIcon size={14} />
                  <span className="truncate max-w-[100px] sm:max-w-[150px]">
                    {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Profile'}
                  </span>
                </button>
                <button
                  onClick={() => signOut()}
                  style={{ color: 'var(--theme-text-muted)' }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none cursor-pointer hover:opacity-70"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/signin')}
                style={{ color: 'var(--theme-text-muted)' }}
                className="text-xs font-semibold uppercase tracking-wider transition-colors mr-1 focus:outline-none cursor-pointer hover:opacity-70"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => navigate('/disclaimer')}
              style={{ backgroundColor: 'var(--theme-brand)', borderColor: 'var(--theme-ink)', color: 'white', boxShadow: '2px 2px 0 var(--theme-ink)' }}
              className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 focus:outline-none hover:-translate-y-0.5 hover:translate-x-[-0.5px] cursor-pointer border"
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0 var(--theme-ink)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0 var(--theme-ink)'; }}
            >
              <Mic size={13} strokeWidth={2.5} />
              Start
            </button>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{ color: 'var(--theme-text-muted)' }}
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 focus:outline-none cursor-pointer hover:opacity-70"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className={(isScrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-[72px]') + ' transition-all duration-300 ease-out'} />

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 backdrop-blur-xs lg:hidden"
              style={{ backgroundColor: 'rgba(28,25,23,0.3)' }}
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ backgroundColor: 'var(--theme-bg)', borderLeftColor: 'var(--theme-border)' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm border-l shadow-xl lg:hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div style={{ borderBottomColor: 'var(--theme-border)' }} className="flex items-center justify-between px-6 h-16 border-b shrink-0">
                <div className="flex items-center gap-2.5">
                  <div style={{ backgroundColor: 'var(--theme-brand)' }} className="w-7 h-7 rounded-md flex items-center justify-center">
                    <Mic className="text-white w-4 h-4" strokeWidth={2.25} />
                  </div>
                  <span style={{ color: 'var(--theme-text)' }} className="font-serif font-bold text-lg tracking-tight">Aura</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    style={{ color: 'var(--theme-text-muted)' }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:opacity-70"
                  >
                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  </button>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    style={{ color: 'var(--theme-text-muted)' }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none cursor-pointer hover:opacity-70"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto py-8 px-5" aria-label="Mobile navigation">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item, i) => {
                    const active = isActive(item.href);
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * (i + 1) }}
                      >
                        <button
                          onClick={() => handleNavClick(item.href)}
                          style={{
                            color: active ? 'var(--theme-brand)' : 'var(--theme-text-muted)',
                            backgroundColor: active ? 'var(--theme-brand-light)' : 'transparent',
                            borderColor: active ? 'var(--theme-brand-light)' : 'transparent',
                          }}
                          className="w-full text-left px-5 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer border"
                        >
                          {item.label}
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
              <div style={{ borderTopColor: 'var(--theme-border)' }} className="px-5 py-6 border-t shrink-0 space-y-3">
                <button
                  onClick={() => handleNavClick('/disclaimer')}
                  style={{ backgroundColor: 'var(--theme-brand)' }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold text-white rounded-xl shadow-sm transition-all duration-200 cursor-pointer hover:opacity-90"
                >
                  <Mic size={16} strokeWidth={2.25} />
                  Start Voice Assessment
                </button>
                {user ? (
                  <button
                    onClick={() => { setIsMobileOpen(false); navigate('/dashboard'); }}
                    style={{ color: 'var(--theme-text)', backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer hover:opacity-80"
                  >
                    <UserIcon size={16} />
                    <span className="truncate max-w-[200px]">
                      {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Profile'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('/signin')}
                    style={{ color: 'var(--theme-text)', backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
                    className="w-full flex items-center justify-center px-5 py-4 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer hover:opacity-80"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
