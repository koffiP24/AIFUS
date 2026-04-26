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
     <div className="min-h-screen">
       {/* Hero Section */}
       <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
         {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden">
           <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse-slow rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 blur-3xl"></div>
           <div className="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse-slow rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-3xl" style={{animationDelay: '1.5s'}}></div>
           <div className="absolute top-1/3 left-1/4 h-48 w-48 animate-float rounded-full bg-gradient-to-br from-white/5 to-white/10 blur-xl" style={{animationDelay: '2.5s'}}></div>

           {/* Geometric Pattern */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
         </div>

         <div className="relative px-6 py-20 md:px-12 md:py-28">
           <div className="mx-auto max-w-7xl">
             {/* Badge */}
             <div className="mb-8 flex justify-center animate-fade-in">
               <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-500/10 px-6 py-3 backdrop-blur-sm">
                 <MapPinIcon className="h-5 w-5 text-blue-300 animate-pulse" />
                 <span className="text-sm font-medium tracking-wide uppercase">Événement gratuit</span>
               </div>
             </div>

             {/* Main Title */}
             <h1 className="mb-6 animate-slide-up text-center text-5xl font-bold tracking-tight md:text-6xl">
               <div className="mb-2">Village Opportunités</div>
               <div className="bg-gradient-to-r from-blue-200 via-cyan-200 to-amber-200 bg-clip-text text-transparent">
                 Ivoiro-Russe
               </div>
             </h1>

             {/* Subtitle */}
             <p className="mx-auto mb-10 max-w-3xl animate-slide-up text-center text-xl leading-relaxed text-blue-100 md:text-2xl" style={{animationDelay: '0.2s'}}>
               Plateforme d'information, d'orientation et de coopération entre la Côte d'Ivoire et la Russie
             </p>

             {/* CTA Buttons */}
             <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
               <Link
                 to="/register"
                 className="group relative overflow-hidden rounded-full bg-gradient-to-r from-white to-blue-50 px-8 py-4 text-lg font-semibold text-blue-900 shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-50 hover:to-white"
               >
                 <span className="relative z-10">Réserver ma place</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 transition-opacity group-hover:opacity-100"></div>
               </Link>
               <a
                 href="#espaces"
                 className="group rounded-full border border-blue-300/50 bg-blue-500/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-300 hover:scale-105"
               >
                 Découvrir les espaces
               </a>
             </div>
           </div>
         </div>
       </section>

       {/* Introduction */}
       <section className="py-20">
         <div className="mx-auto max-w-4xl px-6 text-center">
           <div className="mb-8 inline-flex h-1 w-24 rounded-full bg-gradient-to-r from-primary-500 to-blue-500"></div>
           <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 md:text-xl">
             Dans le cadre des festivités des Alumni, l'AIFUS organise le{" "}
             <strong className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
               Village Opportunités Ivoiro-Russe
             </strong>
             , un espace ouvert de rencontres, d'échanges et d'information réunissant les alumni, les élèves et étudiants, les parents d'élèves, les universités, les entreprises partenaires et les institutions intéressées par la coopération entre la Côte d'Ivoire et la Russie.
           </p>
         </div>
       </section>

       {/* Objectifs */}
       <section className="py-20">
         <div className="mx-auto max-w-7xl px-6">
           <div className="mb-16 text-center">
             <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-primary-100 to-primary-50 px-4 py-2 text-sm font-bold text-primary-700 dark:from-primary-900/30 dark:to-primary-800/30 dark:text-primary-300">
               Nos objectifs
             </div>
             <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
               Pourquoi participer ?
             </h2>
             <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
               Découvrez les opportunités offertes par le Village
             </p>
           </div>

           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
             {objectifs.map((obj, index) => (
               <div
                 key={index}
                 className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800"
                 style={{animationDelay: `${index * 0.1}s`}}
               >
                 {/* Gradient Accent */}
                 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500"></div>

                 {/* Icon Container */}
                 <div className="mb-6 flex justify-center">
                   <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                     <obj.icon className="h-8 w-8 text-white" />
                   </div>
                 </div>

                 {/* Content */}
                 <h3 className="mb-3 text-center text-xl font-bold">{obj.title}</h3>
                 <p className="flex-1 text-center text-slate-600 dark:text-slate-400">
                   {obj.description}
                 </p>

                 {/* Hover Effect */}
                 <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5"></div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* Espaces */}
       <section id="espaces" className="py-20">
         <div className="mx-auto max-w-7xl px-6">
           <div className="mb-16 text-center">
             <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-100 to-cyan-50 px-4 py-2 text-sm font-bold text-blue-700 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300">
               Les espaces
             </div>
             <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
               Espaces thématiques
             </h2>
             <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
               Six espaces pour une expérience complète
             </p>
           </div>

           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
             {espaces.map((espace, index) => (
               <div
                 key={index}
                 className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800"
                 style={{animationDelay: `${index * 0.08}s`}}
               >
                 {/* Header Strip */}
                 <div className={`h-2 bg-gradient-to-r ${espace.color}`}></div>

                 {/* Icon & Content */}
                 <div className="p-6">
                   <div className="mb-4 flex justify-center">
                     <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${espace.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                       <espace.icon className="h-7 w-7 text-white" />
                     </div>
                   </div>

                   <h3 className="mb-2 text-center text-lg font-bold group-hover:text-primary-600 transition-colors">
                     {espace.title}
                   </h3>

                   <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                     {espace.description}
                   </p>
                 </div>

                 {/* Hover Glow */}
                 <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5"></div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* Call to Action */}
       <section className="py-20">
         <div className="mx-auto max-w-7xl px-6">
           <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-blue-900 p-12 md:p-16 text-center shadow-2xl">
             {/* Animated Background */}
             <div className="absolute inset-0 opacity-20">
               <div className="absolute top-0 left-1/3 h-64 w-64 animate-pulse-slow rounded-full bg-amber-400 blur-3xl"></div>
               <div className="absolute bottom-0 right-1/3 h-64 w-64 animate-pulse-slow rounded-full bg-white blur-3xl" style={{animationDelay: '2s'}}></div>
             </div>

             <div className="relative">
               <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
                 Participez au Village Opportunités
               </h2>
               <p className="mx-auto mb-10 max-w-2xl text-xl text-primary-100">
                 Une journée exceptionnelle pour la découverte, l'apprentissage et le networking. Entrée gratuite pour tous les membres AIFUS.
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                 <Link
                   to="/register"
                   className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary-700 shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-50 hover:to-white"
                 >
                   <span className="relative z-10">S'inscrire maintenant</span>
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 transition-opacity group-hover:opacity-100"></div>
                 </Link>
                 <Link
                   to="/gala"
                   className="group rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105"
                 >
                   Voir le Gala
                 </Link>
               </div>
             </div>
           </div>
         </div>
       </section>

       {/* Info */}
       <section className="py-20">
         <div className="mx-auto max-w-3xl px-6">
           <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-xl dark:from-slate-800 dark:to-slate-900">
             <div className="p-8 md:p-10">
               <h3 className="mb-8 flex items-center gap-3 text-2xl font-bold">
                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-600">
                   <MapPinIcon className="h-6 w-6 text-white" />
                 </div>
                 Informations pratiques
               </h3>

               <div className="grid gap-6">
                 <div className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg dark:bg-slate-800">
                   <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                     <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                   </div>
                   <div>
                     <p className="mb-1 font-semibold text-slate-900 dark:text-white">Date</p>
                     <p className="text-slate-600 dark:text-slate-400">
                       {formatEventDateLabel(villageEvent)} - {formatEventTimeRange(villageEvent)}
                     </p>
                   </div>
                 </div>

                 <div className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg dark:bg-slate-800">
                   <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                     <MapPinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                   </div>
                   <div>
                     <p className="mb-1 font-semibold text-slate-900 dark:text-white">Lieu</p>
                     <p className="text-slate-600 dark:text-slate-400">{villageEvent?.location || "Lieu à confirmer"}</p>
                   </div>
                 </div>

                 <div className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg dark:bg-slate-800">
                   <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                     <CheckCircleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                   </div>
                   <div>
                     <p className="mb-1 font-semibold text-slate-900 dark:text-white">Entrée</p>
                     <p className="text-slate-600 dark:text-slate-400">
                       Gratuit pour les membres AIFUS / 5 000 Fcfa pour les non-membres
                     </p>
                   </div>
                 </div>

                 <div className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg dark:bg-slate-800">
                   <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                     <UserGroupIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                   </div>
                   <div>
                     <p className="mb-1 font-semibold text-slate-900 dark:text-white">Public cible</p>
                     <p className="text-slate-600 dark:text-slate-400">
                       Élèves, étudiants, parents, professionnels, universitaires
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
     </div>
   );
};

export default Village;
