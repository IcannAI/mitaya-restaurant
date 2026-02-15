import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS, CATEGORIES } from '../constants';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatPrice, cn } from '../lib/utils';
import { Search, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MenuPage: React.FC = () => {
  const { t, language, addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = activeCategory === 'popular' ? true : item.category === activeCategory;
      const matchesSearch = item.name[language].toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description[language].toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = vegetarianOnly ? item.isVegetarian : true;
      
      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [activeCategory, searchQuery, vegetarianOnly, language]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">{t('menu.title')}</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
      </div>

      {/* Controls */}
      <div className="sticky top-[72px] bg-background/95 backdrop-blur-sm z-20 py-4 mb-8 space-y-4 shadow-sm border-b border-gray-100 rounded-lg px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all',
                  activeCategory === cat.id
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                )}
              >
                {cat.label[language]}
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={t('menu.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <button
              onClick={() => setVegetarianOnly(!vegetarianOnly)}
              className={cn(
                'p-2 rounded-full border transition-colors',
                vegetarianOnly ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400 hover:text-green-500'
              )}
              title={t('menu.vegetarian')}
            >
              <Leaf size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.name[language]} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                {item.isVegetarian && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                    <Leaf size={10} className="mr-1" /> VEG
                  </div>
                )}
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold font-serif text-secondary">{item.name[language]}</h3>
                  <span className="text-primary font-bold">{formatPrice(item.price)}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4 flex-grow">{item.description[language]}</p>
                <Button 
                  onClick={() => addToCart(item)}
                  className="w-full"
                  variant="outline"
                >
                  {t('menu.add')}
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No dishes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};