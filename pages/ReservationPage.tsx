import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Phone, Mail } from 'lucide-react';
// 同時匯入 schema 和型別
import { reservationSchema, type ReservationFormData } from '../types';

export const ReservationPage: React.FC = () => {
  const { t } = useApp();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
  });

  const onSubmit = async (data: ReservationFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Reservation Data:", data);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 min-h-[calc(100vh-200px)]">
      {/* Contact Info / Map Placeholder */}
      <div className="w-full md:w-1/2 space-y-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-secondary mb-4">{t('res.title')}</h1>
          <p className="text-gray-500 leading-relaxed">
            Reserve your table for an unforgettable dining experience. 
            For parties larger than 10, please contact us directly.
          </p>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-8">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-secondary">Address</h3>
              <p className="text-gray-500">123 Culinary Ave, Food City, FC 90210</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-secondary">Phone</h3>
              <p className="text-gray-500">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-secondary">Email</h3>
              <p className="text-gray-500">reservations@mitaya-restaurant.com</p>
            </div>
          </div>
        </div>

        {/* Static Map Image Placeholder */}
        <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden shadow-inner relative group cursor-pointer">
           <img 
            src="https://picsum.photos/seed/map/800/400?grayscale&blur=2" 
            alt="Location Map" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
            <div className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center">
              <MapPin size={16} className="text-primary mr-2" />
              View on Google Maps
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit">
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-2">{t('res.success')}</h2>
            <p className="text-gray-500">We look forward to seeing you!</p>
            <Button className="mt-8" variant="outline" onClick={() => setIsSuccess(false)}>
              Make Another Reservation
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input 
              label={t('res.name')} 
              placeholder="John Doe" 
              {...register('name')} 
              error={errors.name?.message}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label={t('res.date')} 
                type="datetime-local" 
                {...register('date')} 
                error={errors.date?.message}
              />
              <Input 
                label={t('res.guests')} 
                type="number" 
                min={1} 
                max={10} 
                {...register('guests')} 
                error={errors.guests?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('res.notes')}
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                placeholder="Allergies, special occasions, high chair needed..."
                {...register('notes')}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              {t('res.submit')}
            </Button>
            
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-sm text-center">{t('res.error')}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};