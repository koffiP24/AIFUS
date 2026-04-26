import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Footer = ({ reserveMobileBottomSpace = false }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Accueil", href: "/" },
    { name: "Village", href: "/village" },
    { name: "Gala", href: "/gala" },
    { name: "Tombola", href: "/tombola" },
  ];

  const legalLinks = [
    { name: "Conditions", href: "/conditions" },
    { name: "Confidentialité", href: "/confidentialite" },
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
    {
      icon: MapPinIcon,
      text: "Abidjan, Côte d'Ivoire",
      href: "#",
    },
  ];

  return (
    <>
      {/* Mobile Footer */}
      <footer
        className={`mt-auto border-t border-slate-200/70 bg-gradient-to-br from-slate-50 to-white px-3 pt-4 backdrop-blur-xl dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 md:hidden ${
          reserveMobileBottomSpace
            ? "pb-[calc(var(--mobile-bottom-nav-space)+0.75rem)]"
            : "pb-4"
        }`}
      >
        <div className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-white/90 px-4 py-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/88">
          {/* Logo & Brand */}
          <div className="mb-5 flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="AIFUS"
              className="h-12 w-12 rounded-2xl object-contain shadow-lg"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                AIFUS 2026
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alumni, gala, village et tombola
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-5 grid grid-cols-2 gap-2">
            {quickLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="rounded-2xl bg-slate-100 px-3 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 hover:scale-105 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {item.name}
              </Link>
            ))}
            {legalLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="rounded-2xl bg-slate-100 px-3 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 hover:scale-105 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mb-4 space-y-2">
            {contacts.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                className="flex items-center gap-2 rounded-xl p-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary-400"
              >
                <contact.icon className="h-4 w-4 text-primary-500" />
                <span>{contact.text}</span>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-200 pt-3 text-center text-xs text-slate-400 dark:border-slate-800">
            © {currentYear} AIFUS. Expérience mobile optimisée.
          </div>
        </div>
      </footer>

      {/* Desktop Footer */}
      <footer className="mt-auto hidden bg-slate-950 text-white md:block">
        {/* Top Gradient Bar */}
        <div className="h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-amber-500"></div>

        <div className="mx-auto w-full max-w-7xl px-8 py-16 lg:px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="mb-6 flex items-center gap-4">
                <img
                  src="/logo.jpg"
                  alt="AIFUS"
                  className="h-14 w-14 rounded-2xl object-contain shadow-xl"
                />
                <div>
                  <span className="text-2xl font-bold">AIFUS</span>
                  <span className="ml-1 text-primary-400">2026</span>
                </div>
              </Link>

              <p className="mb-6 max-w-md leading-relaxed text-slate-400">
                Association des Ivoiriens formés en ex-URSS et en Russie. Un
                réseau de compétences pour la coopération académique et
                scientifique entre la Côte d'Ivoire et la Russie.
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                    <SparklesIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold">65 ans d'excellence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                    <AcademicCapIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold">500+ Alumni</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="mb-6 text-lg font-bold">Navigation</h3>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="group flex items-center gap-2 text-slate-400 transition-all hover:text-primary-400"
                    >
                      <span className="h-1 w-0 rounded-full bg-primary-500 transition-all group-hover:w-3"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
                {legalLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-slate-500 transition-colors hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-6 text-lg font-bold">Contact</h3>
              <ul className="space-y-4">
                {contacts.map((contact, index) => (
                  <li key={index}>
                    <a
                      href={contact.href}
                      className="group flex items-start gap-3 text-slate-400 transition-all hover:text-primary-400"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 group-hover:bg-primary-500/20 transition-colors">
                        <contact.icon className="h-4 w-4 text-primary-500" />
                      </div>
                      <span className="text-sm group-hover:text-slate-300">{contact.text}</span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Newsletter CTA */}
              <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/50 to-slate-900 p-4">
                <p className="mb-3 text-sm font-semibold text-primary-300">
                  Restez informé
                </p>
                <p className="mb-3 text-xs text-slate-400">
                  Recevez les dernières actualités de l'AIFUS
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600">
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="mx-auto max-w-7xl px-8 py-6 lg:px-16">
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
              <p>
                © {currentYear} AIFUS. Tous droits réservés.
              </p>
              <div className="flex items-center gap-4">
                {legalLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
