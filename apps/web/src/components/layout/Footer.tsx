import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Zap } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-white font-bold">Energetika muammolari instituti</div>
                <div className="text-xs text-gray-400">O'zbekiston Respublikasi Fanlar akademiyasi</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Energetika sohasidagi ilmiy tadqiqotlar va innovatsiyalar markazi.
              Muqobil energiya va energiya samaradorligi yo'nalishida faoliyat yuritadi.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('common.language') === 'Til' ? "Sahifalar" : "Pages"}
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/about', label: t('nav.about') },
                { to: '/structure', label: t('nav.structure') },
                { to: '/news', label: t('nav.news') },
                { to: '/publications', label: t('nav.publications') },
                { to: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('contact.title')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-400" />
                <span>Toshkent shahri, Mirzo Ulug'bek tumani</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary-400" />
                <a href="tel:+998712620000" className="hover:text-white transition-colors">
                  +998 71 262-00-00
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary-400" />
                <a href="mailto:info@energetika.uz" className="hover:text-white transition-colors">
                  info@energetika.uz
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4 flex-shrink-0 text-primary-400" />
                <span>Du-Ju: 9:00 – 18:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-800">
        <div className="container py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-500">
            © {year} Energetika muammolari instituti. {t('footer.rights')}.
          </p>
          <Link
            to="/admin"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
