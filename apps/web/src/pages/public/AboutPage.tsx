import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Target, History, Award, Users } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('about.title')} | Energetika instituti</title>
      </Helmet>

      {/* Page hero */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">{t('about.title')}</h1>
          <p className="text-primary-200">O'zbekiston Respublikasi Fanlar akademiyasi</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">

          {/* Mission */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Target className="h-5 w-5 text-primary-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t('about.mission')}</h2>
            </div>
            <div className="bg-primary-50 rounded-xl p-6 border-l-4 border-primary-600">
              <p className="text-gray-700 leading-relaxed">
                {t('about.mission_text')}
              </p>
            </div>
          </section>

          {/* Key facts */}
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Ilmiy xodimlar", value: "120+" },
                { icon: Award, label: "Fan doktorlari", value: "18" },
                { icon: Target, label: "Yo'nalishlar", value: "8" },
                { icon: History, label: "Yillik tajriba", value: "30+" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="card p-5 text-center">
                  <div className="bg-primary-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary-700" />
                  </div>
                  <div className="text-2xl font-bold text-primary-700">{value}</div>
                  <div className="text-sm text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* History */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <History className="h-5 w-5 text-primary-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t('about.history')}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">{t('about.history_text')}</p>
            <p className="text-gray-700 leading-relaxed">
              Institut o'z faoliyati davomida O'zbekistonda energetika sohasini rivojlantirish,
              qayta tiklanuvchi energiya manbalarini joriy etish va energiya samaradorligini oshirish
              bo'yicha muhim ilmiy va amaliy natijalarga erishgan.
            </p>
          </section>

          {/* Research areas */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Asosiy tadqiqot yo'nalishlari</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Quyosh energetikasi",
                "Shamol energetikasi",
                "Gidroenergetika",
                "Energiya samaradorligi",
                "Energetika tizimlarini modellash",
                "Smart grid texnologiyalari",
                "Issiqlik energetikasi",
                "Energetika xavfsizligi",
              ].map((area) => (
                <div key={area} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                  <span className="text-sm text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
