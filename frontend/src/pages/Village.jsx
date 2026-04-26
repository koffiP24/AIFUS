import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import {
  formatEventDateLabel,
  formatEventTimeRange,
} from "../utils/eventSettings";

const Village = () => {
  const { getEvent } = useEvents();
  const villageEvent = getEvent("village");

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const toggleScrollButton = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      setShowScroll(scrolled > 300);
    };
    window.addEventListener("scroll", toggleScrollButton);
    window.addEventListener("load", toggleScrollButton);
    return () => {
      window.removeEventListener("scroll", toggleScrollButton);
      window.removeEventListener("load", toggleScrollButton);
    };
  }, []);

  const objectifs = [
    {
      icon: AcademicCapIcon,
      title: "Informer",
      description:
        "Élèves et étudiants sur les possibilités d'études en Russie et ex-URSS",
    },
    {
      icon: UserGroupIcon,
      title: "Valoriser",
      description: "Les parcours des alumni formés en Russie",
    },
    {
      icon: BuildingOfficeIcon,
      title: "Faciliter",
      description:
        "L'insertion professionnelle des nouveaux diplômés",
    },
    {
      icon: GlobeAltIcon,
      title: "Orienter",
      description:
        "Vers les filières stratégiques pour le développement de la Côte d'Ivoire",
    },
  ];

  const publicCible = [
    "Élèves en classe de terminale",
    "Étudiants des universités et grandes écoles",
    "Parents d'élèves",
    "Alumni formés en Russie/ex-URSS",
    "Nouveaux diplômés",
    "Universités et institutions académiques",
    "Entreprises ivoiriennes et russes",
    "Institutions publiques",
  ];

  const activites = [
    {
      title: "Conférences & Panels",
      description:
        "Conditions d'accès, filières, bourses, vie étudiante, perspectives professionnelles",
    },
    {
      title: "Témoignages d'alumni",
      description:
        "Partage d'expériences académiques et professionnelles pour inspirer",
    },
    {
      title: "Forum des entreprises",
      description: "Stands, présentation d'activités, recrutement, networking",
    },
    {
      title: "Présentation universités",
      description: "Programmes, admission, bourses, coopération académique",
    },
  ];

  const filieresStrategiques = [
    "Ingénierie et infrastructures",
    "Technologies numériques et IA",
    "Génie rural et machinisme agricole",
    "Énergie et ressources naturelles",
    "Agriculture et agro-industrie",
    "Sciences médicales et pharmaceutiques",
    "Industrie et production",
    "Environnement et développement durable",
    "Recherche scientifique et innovation",
  ];

  const espaces = [
    {
      title: "Espace Universités russes",
      description:
        "Stands, supports documentaires, entretiens personnalisés, mini-conférences, conseils pratiques (inscription, visa, logement)",
      icon: AcademicCapIcon,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Espace Alumni",
      description:
        "Portraits, présentation secteurs d'activité, témoignages directs, mentoring express",
      icon: UserGroupIcon,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Espace Entreprises",
      description:
        "Stands, démonstrations, identification de talents, échanges avec alumni et étudiants",
      icon: BuildingOfficeIcon,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Espace Culture Russie",
      description:
        "Objets traditionnels, galerie photo, projections, espace souvenirs",
      icon: GlobeAltIcon,
      color: "from-red-500 to-red-700",
    },
    {
      title: "Espace Conférences",
      description:
        "Panels, témoignages, interventions institutionnelles, annonces officielles",
      icon: CalendarIcon,
      color: "from-amber-500 to-amber-700",
    },
    {
      title: "Restauration",
      description: "5 stands partenaires, plats locaux, snacks, boissons",
      icon: MapPinIcon,
      color: "from-rose-500 to-rose-700",
    },
    {
      title: "Espace Networking",
      description:
        "Discussions, rencontres B2B, échanges informels, projets professionnels",
      icon: CheckCircleIcon,
      color: "from-emerald-500 to-emerald-700",
    },
  ];

  const retombees = [
    "Meilleure information des jeunes sur les études en Russie",
    "Renforcement de la visibilité des alumni",
    "Développement de nouveaux partenariats académiques",
    "Identification de talents par les entreprises",
    "Renforcement des relations économiques et éducatives CI-Russie",
  ];

  return (
    <div className="space-y-16">
      {/* Scroll to top button - bouton alternatif */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        id="topBtn"
        className={`fixed bottom-6 left-6 pointer-events-auto rounded-2xl p-2 w-14 h-14 flex items-center justify-center hover:scale-105 transition-all duration-300 z-20 border border-white/30 scroll-btn group ${showScroll ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(99, 102, 241, 0.85)", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
        aria-label="Remonter en haut"
        title="Remonter en haut"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white drop-shadow-sm transition-transform group-active:translate-y-[-2px]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
      </button>

      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative px-8 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
            <MapPinIcon className="w-4 h-4 animate-spin" />
            <span>Événement gratuit</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Village Opportunités{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-amber-200">
              Ivoiro-Russe
            </span>
          </h1>

          <div className="flex flex-col items-center justify-center text-center w-full">
            <p className="text-xl md:text-2xl">
              Plateforme d'information, d'orientation et de coopération entre la
              Côte d'Ivoire et la Russie
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#espaces"
              className="px-8 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Découvrir les espaces
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Dans le cadre des festivités des Alumni, l'AIFUS organise le{" "}
          <strong className="text-primary-600">
            Village Opportunités Ivoiro-Russe
          </strong>
          , un espace ouvert de rencontres, d'échanges et d'information
          réunissant les alumni, les élèves et étudiants, les parents d'élèves,
          les universités, les entreprises partenaires et les institutions
          intéressés par la coopération entre la Côte d'Ivoire et la Russie.
        </p>
      </section>

      {/* Contexte */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-blue-100 dark:border-slate-700">
          <h3 className="text-2xl font-bold mb-4 text-center">Contexte</h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Plus de six décennies de coopération académique entre la Côte
            d'Ivoire et les universités soviétiques/russes. Beaucoup d'alumni
            ont contribué au développement national, mais les jeunes générations
            et parents disposent de peu d'informations sur les études en Russie.
            Le village vise à combler ce déficit d'information par des échanges
            directs entre alumni et jeunes, et à renforcer la visibilité des
            relations académiques et scientifiques ivoiro-russes.
          </p>
        </div>
      </section>

      {/* Objectifs */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Objectifs</h2>
          <p className="text-slate-500">
            Promouvoir les opportunités d'études, de coopération académique et
            économique entre la Côte d'Ivoire et la Russie
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {objectifs.map((obj, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mb-4">
                <obj.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{obj.title}</h3>
              <p className="text-slate-500 text-sm">{obj.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Public Cible */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Public Cible</h2>
          <p className="text-slate-500">Qui peut participer au Village ?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {publicCible.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow"
            >
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Activités */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Activités Prévues</h2>
          <p className="text-slate-500">
            Une journée riche en échanges, découvertes et opportunités
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activites.map((act, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-bold mb-3 text-primary-600">
                {act.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {act.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filières Stratégiques */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Filières Stratégiques</h2>
          <p className="text-slate-500">
            Domaines prioritaires pour le développement de la Côte d'Ivoire
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filieresStrategiques.map((filiere, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-lg transition-all"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"></div>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {filiere}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Espaces */}
      <section id="espaces">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Espaces thématiques</h2>
          <p className="text-slate-500">
            8 espaces structurés autour de 5 dimensions : orientation,
            opportunités, valorisation, immersion, convivialité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {espaces.map((espace, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              <div className={`h-1.5 bg-gradient-to-r ${espace.color}`}></div>

              <div className="p-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${espace.color} text-white mb-4`}
                >
                  <espace.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors">
                  {espace.title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {espace.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Retombées */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Retombées Attendues</h2>
          <p className="text-slate-500">
            Impact du Village sur la coopération ivoiro-russe
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {retombees.map((retombe, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow"
            >
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">
                {retombe}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Participez au Village Opportunités
        </h2>
        <div className="flex flex-col items-center justify-center text-center w-full">
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Une journée exceptionnelle pour découverte, apprentissage et
            networking. Entrée gratuite pour tous les membres AIFUS.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/gala"
            className="px-8 py-3 bg-primary-800 text-white font-semibold rounded-lg hover:bg-primary-900 transition-all"
          >
            Voir le Gala aussi
          </Link>
        </div>
      </section>

      {/* Info */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <MapPinIcon className="w-6 h-6 text-primary-600" />
            Informations pratiques
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-slate-500">
                  {formatEventDateLabel(villageEvent)} -{" "}
                  {formatEventTimeRange(villageEvent)}
                </p>
                <p className="hidden text-slate-500">
                  À confirmer - Durée : 1 journée complète
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Lieu</p>
                <p className="text-slate-500">
                  {villageEvent?.location || "Lieu à confirmer"}
                </p>
                <p className="hidden text-slate-500">Abidjan (à confirmer)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Entrée</p>
                <p className="text-slate-500">
                  Gratuit pour les membres AIFUS / 5 000 Fcfa pour les
                  non-membres
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Public cible</p>
                <p className="text-slate-500">
                  Élèves, étudiants, parents, professionnels, universitaires
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Village;