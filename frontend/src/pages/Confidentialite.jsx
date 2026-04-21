const sections = [
  {
    title: "Données collectées",
    content:
      "La plateforme peut collecter les informations saisies lors de l'inscription et de l'utilisation des services: nom, prénom, email, téléphone, réservations, billets et historiques de paiement.",
  },
  {
    title: "Finalités",
    content:
      "Ces données servent à gérer l'authentification, l'organisation des événements, le suivi des inscriptions, l'émission de confirmations et l'administration de la plateforme.",
  },
  {
    title: "Conservation et accès",
    content:
      "Les informations sont stockées dans la base de données de l'application et accessibles uniquement aux personnes autorisées impliquées dans la gestion technique ou organisationnelle des festivités.",
  },
  {
    title: "Sécurité",
    content:
      "AIFUS met en place des mesures raisonnables pour protéger les données, notamment l'authentification par mot de passe chiffré, le contrôle d'accès administrateur et la séparation front-end / back-end.",
  },
  {
    title: "Demandes relatives aux données",
    content:
      "Toute demande de correction, d'information ou de suppression relative aux données personnelles peut être adressée à l'équipe d'organisation via les canaux de contact officiels de l'association.",
  },
];

const Confidentialite = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-slate-900 px-8 py-12 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary-200">
          Données personnelles
        </p>
        <h1 className="mb-4 text-4xl font-bold text-white">
          Politique de confidentialité
        </h1>
        <p className="max-w-2xl text-primary-100">
          Cette page décrit les usages principaux des données manipulées par la
          plateforme AIFUS 2026 dans le cadre des inscriptions et des
          festivités.
        </p>
      </section>

      <section className="space-y-5">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800"
          >
            <h2 className="mb-3 text-2xl font-semibold">{section.title}</h2>
            <p className="text-slate-600 dark:text-slate-300">
              {section.content}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Confidentialite;
