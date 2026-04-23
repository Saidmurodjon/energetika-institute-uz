import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactApi } from '@/lib/api';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta harf'),
  email: z.string().email('Email noto\'g\'ri'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Mavzu kiriting'),
  message: z.string().min(10, 'Xabar kamida 10 ta belgi'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await contactApi.send(data);
      setSent(true);
      reset();
    } catch {
      alert(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('contact.title')} | Energetika instituti</title>
      </Helmet>

      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">{t('contact.title')}</h1>
          <p className="text-primary-200">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-gray-900 mb-4 text-lg">{t('contact.address')}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 p-2.5 rounded-lg flex-shrink-0">
                    <MapPin className="h-4 w-4 text-primary-700" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Manzil</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      Toshkent shahri, Mirzo Ulug'bek tumani
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 p-2.5 rounded-lg flex-shrink-0">
                    <Phone className="h-4 w-4 text-primary-700" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Telefon</div>
                    <a href="tel:+998712620000" className="text-sm text-primary-700 hover:underline mt-0.5 block">
                      +998 71 262-00-00
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 p-2.5 rounded-lg flex-shrink-0">
                    <Mail className="h-4 w-4 text-primary-700" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Email</div>
                    <a href="mailto:info@energetika.uz" className="text-sm text-primary-700 hover:underline mt-0.5 block">
                      info@energetika.uz
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 p-2.5 rounded-lg flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary-700" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{t('contact.working_hours')}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      Du–Ju: 9:00 – 18:00<br />
                      Sh–Ya: Dam olish
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-16 w-16 text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('contact.success')}</h3>
                <p className="text-gray-500 mb-6">Tez orada javob beramiz.</p>
                <button onClick={() => setSent(false)} className="btn-secondary">
                  Yana xabar yuborish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">{t('contact.name')} *</label>
                    <input
                      {...register('name')}
                      className="input"
                      placeholder="Ism Familiya"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label">{t('contact.email')} *</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input"
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">{t('contact.phone')}</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="input"
                      placeholder="+998 90 000-00-00"
                    />
                  </div>
                  <div>
                    <label className="label">{t('contact.subject')} *</label>
                    <input
                      {...register('subject')}
                      className="input"
                      placeholder="Mavzu"
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">{t('contact.message')} *</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="input resize-none"
                    placeholder="Xabaringiz..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto px-8 py-2.5"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      {t('common.loading')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      {t('contact.send')}
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
