import React from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../lib/utils';
import { Minus, Plus, Trash2, X, ShoppingCart } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, language, t } = useApp();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-serif font-bold text-gray-900">{t('cart.title')}</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                  <ShoppingCart size={48} className="opacity-20" />
                  <p>{t('cart.empty')}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex items-start space-x-4 p-3 rounded-lg border border-gray-100 bg-white shadow-sm"
                  >
                    <img src={item.image} alt={item.name[language]} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-900">{item.name[language]}</h4>
                      <p className="text-sm text-primary font-bold">{formatPrice(item.price)}</p>
                      
                      <div className="flex items-center mt-2 space-x-3">
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="p-1 hover:text-primary transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs w-6 text-center font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-gray-50 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">{t('cart.total')}</span>
                  <span className="text-2xl font-bold font-serif text-primary">{formatPrice(cartTotal)}</span>
                </div>
                <Button className="w-full" size="lg">
                  {t('cart.checkout')}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};