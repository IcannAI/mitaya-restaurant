import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useCustomRouter } from '../hooks/useCustomRouter';
import { ShoppingCart, Menu as MenuIcon, X, Globe, MapPin } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { CartDrawer } from './CartDrawer';
import { AnimatePresence, motion } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, language, setLanguage, cart, setIsCartOpen } = useApp();
  const { path, navigate } = useCustomRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.menu'), href: '/menu' },
    { label: t('nav.reservation'), href: '/reservation' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-secondary bg-background">
      {/* Navbar */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent',
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 border-gray-100' : 'bg-transparent py-4'
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="text-2xl font-serif font-bold text-primary cursor-pointer"
            onClick={() => navigate('/')}
          >
            Mitaya's Restaurant
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href as any)}
                className={cn(
                  'text-sm font-semibold tracking-wide hover:text-primary transition-colors',
                  path === link.href ? 'text-primary' : 'text-gray-600'
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Lang Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'zh-TW' : 'en')}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              aria-label="Switch Language"
            >
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-in zoom-in">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[60px] left-0 right-0 bg-white shadow-lg z-30 border-b border-gray-100 overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    navigate(link.href as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    'text-lg font-medium text-left',
                    path === link.href ? 'text-primary' : 'text-gray-800'
                  )}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-[72px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl mb-4 text-primary">Mitaya's Restaurant</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              {t('hero.subtitle')}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Contact</h4>
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
              <MapPin size={16} />
              <span>{t('footer.address')}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Globe size={16} />
              <span>www.mitaya-restaurant.com</span>
            </div>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p className="text-gray-500 text-xs">{t('footer.rights')}</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};