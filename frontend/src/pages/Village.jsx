import { Link } from "react-router-dom";
import {
  MapPinIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useEvents } from "../context/EventContext";
import {
  formatEventDateLabel,
  formatEventTimeRange,
} from "../utils/eventSettings";

const Village = () => {
  const { getEvent } = useEvents();
  const villageEvent = getEvent("village");
  const objectifs = [
    {
      icon: AcademicCapIcon,
      title: "Informer",
      description: "Sur les possibilités d'études en Russie",
    },
    {
      icon: UserGroupIcon,
      title: "Valoriser",
      description: "Les parcours des alumni",
    },
    {
      icon: BuildingOfficeIcon,
      title: "Faciliter",
      description: "L'insertion professionnelle",
    },
    {
      icon: GlobeAltIcon,
      title: "Orienter",
      description: "Vers les filières stratégiques",
    },
  ];

  const espaces = [
    {
      title: "Espace Universités russes",
      description:
        "Orientation académique et présentation des universités partenaires",
      icon: AcademicCapIcon,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Espace Alumni",
      description: "Témoignages, mentoring et networking intergénérationnel",
      icon: UserGroupIcon,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Espace Entreprises",
      description: "Opportunités professionnelles et partenariats",
      icon: BuildingOfficeIcon,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Espace Culture Russie",
      description: "Immersion culturelle, langue et traditions",
      icon: GlobeAltIcon,
      color: "from-red-500 to-red-700",
    },
    {
      title: "Espace Conférences",
      description: "Panels, présentations et tables rondes",
      icon: CalendarIcon,
      color: "from-amber-500 to-amber-700",
    },
    {
      title: "Restauration & Networking",
      description: "Moments de partage et de découverte gastronomique",
      icon: MapPinIcon,
      color: "from-rose-500 to-rose-700",
    },
  ];

  return (
    <div className="space-y-16">
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

      {/* Objectifs */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Nos objectifs</h2>
          <p className="text-slate-500">
            Pourquoi participer au Village Opportunités
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

      {/* Espaces */}
      <section id="espaces">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Espaces thématiques</h2>
          <p className="text-slate-500">
            6 espaces pour une expérience complète
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Participez au Village Opportunités
        </h2>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          Une journée exceptionnelle pour découverte, apprentissage et
          networking. Entrée gratuite pour tous les membres AIFUS.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-all hover:scale-105"
          >
            S'inscrire maintenant
          </Link>
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
