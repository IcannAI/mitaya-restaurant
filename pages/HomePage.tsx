import React from 'react';
import { useApp } from '../context/AppContext';
import { useCustomRouter } from '../hooks/useCustomRouter';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { formatPrice } from '../lib/utils';

export const HomePage: React.FC = () => {
  const { t, language } = useApp();
  const { navigate } = useCustomRouter();

  const featuredItems = MENU_ITEMS.filter(i => i.category === 'popular' || i.category === 'main').slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Restaurant Ambience" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-light text-gray-200 mb-8"
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/reservation')}
              className="bg-primary hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
            >
              {t('hero.cta')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            { icon: Star, title: "Michelin Experience", desc: "Award-winning chefs curating perfect plates." },
            { icon: Clock, title: "Fresh Ingredients", desc: "Farm to table, sourced daily from local producers." },
            { icon: MapPin, title: "Prime Location", desc: "Located in the heart of the city with a stunning view." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow border border-transparent hover:border-gray-100"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Menu Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-serif font-bold text-secondary">Signatures</h2>
            <button 
              onClick={() => navigate('/menu')}
              className="flex items-center text-primary font-bold hover:underline"
            >
              View Full Menu <ArrowRight size={16} className="ml-2" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name[language]} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-secondary shadow-sm">
                    {formatPrice(item.price)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 font-serif">{item.name[language]}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description[language]}</p>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:border-primary group-hover:text-white"
                    onClick={() => navigate('/menu')}
                  >
                    Order Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};