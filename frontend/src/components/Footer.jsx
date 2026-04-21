import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const liensUtiles = [
    { name: "Accueil", href: "/" },
    { name: "Village Opportunités", href: "/village" },
    { name: "Gala des Alumni", href: "/gala" },
    { name: "Tombola", href: "/tombola" },
  ];

  const contacts = [
    {
      icon: EnvelopeIcon,
      text: "alumni.aifus@gmail.com",
      href: "mailto:alumni.aifus@gmail.com",
    },
    {
      icon: PhoneIcon,
      text: "+225 07 08 00 99 07",
      href: "tel:+2250708009907",
    },
    { icon: MapPinIcon, text: "Abidjan, Côte d'Ivoire", href: "#" },
  ];

  return (
    <footer className="bg-slate-950 text-white mt-auto">
      <div className="h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-amber-500"></div>
      {/* Main Footer */}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/logo.jpg" alt="AIFUS" className="w-12 h-12 object-contain rounded-lg" />
              <div>
                <span className="text-xl font-bold">AIFUS</span>
                <span className="text-primary-400 ml-1">2026</span>
              </div>
            </Link>
            <p className="text-slate-400 mb-6 max-w-md">
              Association des Ivoiriens Formés en ex-URSS et en Russie. Un
              réseau de compétences pour la coopération académique et
              scientifique entre la Côte d'Ivoire et la Russie.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <StarIcon className="w-5 h-5 text-amber-400" />
                <span>65 ans d'excellence</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <AcademicCapIcon className="w-5 h-5 text-primary-400" />
                <span>500+ Alumni</span>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-3">
              {liensUtiles.map((lien) => (
                <li key={lien.name}>
                  <Link
                    to={lien.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                    {lien.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              {contacts.map((contact, index) => (
                <li key={index}>
                  <a
                    href={contact.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors flex items-start gap-3"
                  >
                    <contact.icon className="w-5 h-5 mt-0.5 shrink-0 text-primary-500" />
                    <span className="text-sm">{contact.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} AIFUS - Association des Ivoiriens Formés en
              ex-URSS
            </p>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-slate-500">Fraternité</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500">Excellence</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500">Coopération</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
