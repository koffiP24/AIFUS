import { Link } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import { formatEventShortDate } from "../utils/eventSettings";
import {
  CalendarIcon,
  MapPinIcon,
  GiftIcon,
  StarIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const { getEvent } = useEvents();
  const villageEvent = getEvent("village");
  const galaEvent = getEvent("gala");
  const tombolaEvent = getEvent("tombola");

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

  evenements[0] = {
    ...evenements[0],
    title: "Village Opportunites",
    description: villageEvent?.description || evenements[0].description,
  };
  evenements[1] = {
    ...evenements[1],
    description: `Soiree de prestige reunissant toutes les generations d'alumni le ${formatEventShortDate(galaEvent)}.`,
    badge: formatEventShortDate(galaEvent),
  };
  evenements[2] = {
    ...evenements[2],
    description: `Tentez de gagner une voiture et de nombreux lots. Tirage prevu le ${formatEventShortDate(tombolaEvent)}.`,
  };

  const stats = [
    { label: "Alumni", value: "500+", icon: UserGroupIcon },
    { label: "Années", value: "65", icon: CalendarIcon },
    { label: "Partenaires", value: "20+", icon: StarIcon },
    { label: "Lots", value: "50+", icon: GiftIcon },
  ];

   return (
     <div className="min-h-screen">
       {/* Hero Section */}
       <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
         {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden">
           <div className="absolute -top-40 -left-40 h-80 w-80 animate-pulse-slow rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 blur-3xl"></div>
           <div className="absolute -bottom-40 -right-40 h-80 w-80 animate-pulse-slow rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 blur-3xl" style={{animationDelay: '1s'}}></div>
           <div className="absolute top-1/2 left-1/2 h-64 w-64 animate-float rounded-full bg-gradient-to-br from-purple-500/10 to-purple-600/10 blur-2xl" style={{animationDelay: '2s'}}></div>

           {/* Grid Pattern */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
         </div>

         <div className="relative px-6 py-20 md:px-12 md:py-32">
           <div className="mx-auto max-w-7xl">
             {/* Badge */}
             <div className="mb-8 flex justify-center animate-fade-in">
               <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 backdrop-blur-sm">
                 <SparklesIcon className="h-5 w-5 text-amber-400 animate-pulse" />
                 <span className="text-sm font-medium tracking-wide uppercase">Célébration des 65 ans</span>
               </div>
             </div>

             {/* Main Title */}
             <h1 className="mb-6 animate-slide-up text-center text-5xl font-bold tracking-tight md:text-7xl">
               <div className="mb-2">Festivités</div>
               <div className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                 AIFUS 2026
               </div>
             </h1>

             {/* Subtitle */}
             <p className="mx-auto mb-10 max-w-3xl animate-slide-up text-center text-xl leading-relaxed text-slate-300 md:text-2xl" style={{animationDelay: '0.2s'}}>
               Célébration des 65 ans des Alumni Ivoiriens formés en ex-URSS et en Russie
             </p>

             {/* Tagline */}
             <div className="mb-12 flex flex-wrap justify-center gap-3 animate-fade-in" style={{animationDelay: '0.4s'}}>
               <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">Village Ivoiro-Russe</span>
               <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">Gala des Alumni</span>
               <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">Grande Tombola</span>
             </div>

             {/* CTA Buttons */}
             <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
               <Link
                 to="/register"
                 className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/50"
               >
                 <span className="relative z-10">Rejoindre la communauté</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
               </Link>
               <Link
                 to="/gala"
                 className="group rounded-full border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105"
               >
                 Découvrir le programme
               </Link>
             </div>
           </div>
         </div>

         {/* Stats Bar */}
         <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-md">
           <div className="mx-auto max-w-7xl px-6 py-8">
             <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
               {stats.map((stat, index) => (
                 <div
                   key={index}
                   className="group text-center animate-fade-in"
                   style={{animationDelay: `${0.8 + index * 0.1}s`}}
                 >
                   <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 group-hover:from-primary-500/30 group-hover:to-primary-600/30 transition-all">
                     <stat.icon className="h-7 w-7 text-amber-400" />
                   </div>
                   <div className="mb-1 text-4xl font-bold">{stat.value}</div>
                   <div className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </section>

       {/* Événements */}
       <section className="py-20">
         <div className="mx-auto max-w-7xl px-6">
           <div className="mb-16 text-center">
             <div className="mb-4">
               <span className="inline-block rounded-full bg-gradient-to-r from-primary-100 to-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 dark:from-primary-900/30 dark:to-primary-800/30 dark:text-primary-300">
                 Les temps forts
               </span>
             </div>
             <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
               Trois événements exceptionnels
             </h2>
             <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
               Célébrer notre communauté et créer de nouvelles connexions
             </p>
           </div>

           <div className="grid gap-8 md:grid-cols-3">
             {evenements.map((evenement, index) => (
               <Link
                 key={evenement.id}
                 to={evenement.link}
                 className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl dark:bg-slate-800"
                 style={{animationDelay: `${index * 0.1}s`}}
               >
                 {/* Gradient Header */}
                 <div className={`h-2 bg-gradient-to-r ${evenement.color}`}></div>

                 {/* Icon */}
                 <div className="relative -mt-8 mb-6 flex justify-center">
                   <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${evenement.color} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                     <evenement.icon className="h-10 w-10 text-white" />
                   </div>
                 </div>

                 {/* Content */}
                 <div className="flex flex-1 flex-col px-6 pb-6 text-center">
                   <span className="mb-3 inline-block rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                     {evenement.badge}
                   </span>

                   <h3 className="mb-3 text-2xl font-bold group-hover:text-primary-600 transition-colors">
                     {evenement.title}
                   </h3>

                   <p className="flex-1 text-slate-600 dark:text-slate-400">
                     {evenement.description}
                   </p>

                   <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all">
                     <span>En savoir plus</span>
                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                     </svg>
                   </div>
                 </div>

                 {/* Hover Glow Effect */}
                 <div className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-amber-500/5"></div>
                 </div>
               </Link>
             ))}
           </div>
         </div>
       </section>

       {/* À propos */}
       <section className="py-20">
         <div className="mx-auto max-w-7xl px-6">
           <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-2xl dark:from-slate-800 dark:to-slate-900">
             <div className="grid md:grid-cols-2">
               {/* Text Content */}
               <div className="p-12 md:p-16">
                 <div className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-2 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                   À propos de l'AIFUS
                 </div>
                 <h2 className="mb-6 text-4xl font-bold tracking-tight">
                   Un réseau d'excellence
                 </h2>
                 <p className="mb-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                   L'Association des Ivoiriens Formés en ex-URSS (AIFUS) regroupe les anciens étudiants ivoiriens ayant poursuivi leurs études dans les universités soviétiques puis russes depuis les années 1960.
                 </p>
                 <p className="mb-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                   Elle constitue un réseau structuré de compétences et d'expertise qui contribue activement à la promotion de la coopération académique et scientifique entre la Côte d'Ivoire et la Russie.
                 </p>

                 {/* Values */}
                 <div className="flex flex-wrap gap-4">
                   <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-md dark:bg-slate-800">
                     <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                     <span className="font-semibold">Fraternité</span>
                   </div>
                   <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-md dark:bg-slate-800">
                     <div className="h-3 w-3 rounded-full bg-primary-500"></div>
                     <span className="font-semibold">Excellence</span>
                   </div>
                   <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-md dark:bg-slate-800">
                     <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                     <span className="font-semibold">Coopération</span>
                   </div>
                 </div>
               </div>

               {/* Stats Cards */}
               <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-slate-900 p-8 md:p-12">
                 {/* Background Pattern */}
                 <div className="absolute inset-0 opacity-10">
                   <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white blur-3xl"></div>
                   <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary-400 blur-3xl"></div>
                 </div>

                 <div className="relative">
                   <h3 className="mb-8 text-2xl font-bold text-white">
                     Chiffres clés
                   </h3>
                   <div className="grid grid-cols-2 gap-6">
                     <div className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20">
                       <div className="mb-2 text-5xl font-bold text-amber-400">65</div>
                       <div className="text-sm text-primary-100 uppercase tracking-wider">Ans d'existence</div>
                     </div>
                     <div className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20">
                       <div className="mb-2 text-5xl font-bold text-white">500+</div>
                       <div className="text-sm text-primary-100 uppercase tracking-wider">Membres</div>
                     </div>
                     <div className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20">
                       <div className="mb-2 text-5xl font-bold text-amber-300">30+</div>
                       <div className="text-sm text-primary-100 uppercase tracking-wider">Universités</div>
                     </div>
                     <div className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20">
                       <div className="mb-2 text-5xl font-bold text-white">15</div>
                       <div className="text-sm text-primary-100 uppercase tracking-wider">Promotions</div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>

       {/* CTA Final */}
       <section className="py-20">
         <div className="mx-auto max-w-7xl px-6">
           <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-slate-900 p-12 md:p-20 text-center shadow-2xl">
             {/* Background Effects */}
             <div className="absolute inset-0 opacity-20">
               <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-amber-400 blur-3xl"></div>
               <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary-400 blur-3xl"></div>
             </div>

             <div className="relative">
               <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
                 Faites partie de l'histoire
               </h2>
               <p className="mx-auto mb-10 max-w-2xl text-xl text-primary-100">
                 Rejoignez le réseau AIFUS et participez à la construction de l'avenir
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                 <Link
                   to="/register"
                   className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary-700 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-amber-50"
                 >
                   Devenir membre
                 </Link>
                 <Link
                   to="/contact"
                   className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                 >
                   Nous contacter
                 </Link>
               </div>
             </div>
           </div>
         </div>
       </section>
     </div>
   );
};

export default Home;
