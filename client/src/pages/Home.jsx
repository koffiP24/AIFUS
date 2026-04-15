import { Link } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  GiftIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const evenements = [
    {
      id: 1,
      title: "Village Opportunités",
      description:
        "Espace d'information, d'orientation et de coopération entre la Côte d'Ivoire et la Russie.",
      link: "/village",
      icon: MapPinIcon,
      color: "from-blue-500 to-blue-700",
      badge: "Gratuit",
    },
    {
      id: 2,
      title: "Gala des Alumni",
      description:
        "Soirée de prestige réunissant toutes les générations d'alumni le 1er août 2026.",
      link: "/gala",
      icon: StarIcon,
      color: "from-amber-500 to-amber-700",
      badge: "40 000+",
    },
    {
      id: 3,
      title: "Grande Tombola",
      description:
        "Tentez de gagner une voiture et de nombreux lots ! Billets à 10 000 Fcfa.",
      link: "/tombola",
      icon: GiftIcon,
      color: "from-purple-500 to-purple-700",
      badge: "Voiture",
    },
  ];

  const stats = [
    { label: "Alumni", value: "500+", icon: UserGroupIcon },
    { label: "Années", value: "65", icon: CalendarIcon },
    { label: "Partenaires", value: "20+", icon: StarIcon },
    { label: "Lots", value: "50+", icon: GiftIcon },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-slate-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
            <StarIcon className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Célébration des 65 ans</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Festivités{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              AIFUS
            </span>{" "}
            2026
          </h1>

          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-xl md:text-2xl ...">
              Célébration des 65 ans des Alumni Ivoiriens formés en ex-URSS et
              en Russie
            </p>
          </div>
          <p className="text-lg text-primary-200 mb-8">
            Village Ivoiro-Russe • Gala des Alumni • Grande Tombola
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25"
            >
              Rejoindre la communauté
            </Link>
            <Link
              to="/gala"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all border border-white/20"
            >
              Découvrir le programme
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative bg-black/20 backdrop-blur-sm py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <stat.icon className="w-6 h-6 text-amber-400 mb-2" />
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-sm text-primary-200">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Événements */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Les temps forts</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Trois événements exceptionnels pour celebrate notre communauté et
            créer de nouvelles connexions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {evenements.map((evenement, index) => (
            <Link
              key={evenement.id}
              to={evenement.link}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${evenement.color}`}></div>

              <div className="p-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${evenement.color} text-white mb-4`}
                >
                  <evenement.icon className="w-6 h-6" />
                </div>

                <span className="inline-block px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full mb-3">
                  {evenement.badge}
                </span>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                  {evenement.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {evenement.description}
                </p>

                <div className="mt-4 flex items-center text-primary-600 font-medium text-sm">
                  <span>En savoir plus</span>
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* À propos */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-lg">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              À propos de l'AIFUS
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-6">
              Un réseau d'excellence
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              L'Association des Ivoiriens Formés en ex-URSS (AIFUS) regroupe les
              anciens étudiants ivoiriens ayant poursuivi leurs études dans les
              universités soviétiques puis russes depuis les années 1960.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Elle constitue un réseau structuré de compétences et d'expertise
              qui contribue activement à la promotion de la coopération
              académique et scientifique entre la Côte d'Ivoire et la Russie.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium">Fraternité</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-sm font-medium">Excellence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Coopération</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl rotate-3"></div>
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-8 text-center">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="block text-3xl font-bold text-primary-600">
                    65
                  </span>
                  <span className="text-sm text-slate-500">
                    Ans d'existence
                  </span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="block text-3xl font-bold text-amber-500">
                    500+
                  </span>
                  <span className="text-sm text-slate-500">Membres</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="block text-3xl font-bold text-purple-500">
                    30+
                  </span>
                  <span className="text-sm text-slate-500">Universités</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl">
                  <span className="block text-3xl font-bold text-green-500">
                    15
                  </span>
                  <span className="text-sm text-slate-500">Promotions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white py-12 px-8 text-center">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">
            Participez aux festivités 2026
          </h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Inscrivez-vous dès maintenant pour ne pas manquer nos événements
            exclusifs et bénéficier d'offres spéciales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-all hover:scale-105"
            >
              Créer un compte
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
            >
              Se connecter
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full translate-x-24 translate-y-24"></div>
      </section>
    </div>
  );
};

export default Home;
