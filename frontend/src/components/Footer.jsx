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
    { name: "Confidentialite", href: "/confidentialite" },
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
      text: "Abidjan, Cote d'Ivoire",
      href: "#",
    },
  ];

  return (
    <>
      <footer
        className={`mt-auto border-t border-slate-200/70 bg-white/75 px-3 pt-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 md:hidden ${
          reserveMobileBottomSpace
            ? "pb-[calc(var(--mobile-bottom-nav-space)+0.75rem)]"
            : "pb-4"
        }`}
      >
        <div className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-white/90 px-4 py-4 shadow-lg dark:border-white/10 dark:bg-slate-900/88">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="AIFUS"
              className="h-11 w-11 rounded-2xl object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                AIFUS 2026
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alumni, gala, village et tombola
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {legalLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="rounded-2xl bg-slate-100 px-3 py-3 text-center font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            {currentYear} AIFUS. Experience mobile optimisee.
          </p>
        </div>
      </footer>

      <footer className="mt-auto hidden bg-slate-950 text-white md:block">
        <div className="h-1 bg-gradient-to-r from-primary-500 via-sky-400 to-amber-500"></div>
        <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Link to="/" className="mb-4 flex items-center gap-3">
                <img
                  src="/logo.jpg"
                  alt="AIFUS"
                  className="h-12 w-12 rounded-xl object-contain"
                />
                <div>
                  <span className="text-xl font-bold">AIFUS</span>
                  <span className="ml-1 text-primary-400">2026</span>
                </div>
              </Link>
              <p className="max-w-md text-slate-400">
                Association des Ivoiriens formes en ex-URSS et en Russie. Un
                reseau de competences pour la cooperation academique et
                scientifique entre la Cote d'Ivoire et la Russie.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-amber-400" />
                  65 ans d'excellence
                </div>
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-primary-400" />
                  500+ Alumni
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Navigation</h3>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-slate-400 transition hover:text-primary-400"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                {legalLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-slate-500 transition hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact</h3>
              <ul className="space-y-3">
                {contacts.map((contact) => (
                  <li key={contact.text}>
                    <a
                      href={contact.href}
                      className="flex items-start gap-3 text-slate-400 transition hover:text-primary-400"
                    >
                      <contact.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                      <span className="text-sm">{contact.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
