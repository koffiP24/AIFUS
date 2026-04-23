const sections = [
  {
    title: "Objet du service",
    content:
      "La plateforme AIFUS 2026 permet aux membres et participants de consulter les événements, créer un compte, réserver une participation au gala et acheter des billets de tombola.",
  },
  {
    title: "Compte utilisateur",
    content:
      "L'utilisateur s'engage à fournir des informations exactes lors de l'inscription et à conserver la confidentialité de ses identifiants. Toute activité réalisée depuis le compte est réputée effectuée par son titulaire.",
  },
  {
    title: "Réservations et paiements",
    content:
      "Toute réservation au gala ou participation à la tombola est soumise aux disponibilités affichées sur la plateforme. Les validations de paiement et les références associées font foi pour l'accès aux événements.",
  },
  {
    title: "Comportement attendu",
    content:
      "L'utilisateur s'engage à ne pas perturber le fonctionnement du site, contourner les sécurités, ou utiliser les services à des fins frauduleuses ou contraires à la réglementation applicable.",
  },
  {
    title: "Évolution du service",
    content:
      "L'association AIFUS peut faire évoluer la plateforme, ses fonctionnalités et les présentes conditions pour améliorer l'organisation des festivités ou répondre à des contraintes techniques et réglementaires.",
  },
];

const Conditions = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-primary-800 to-primary-700 px-8 py-12 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary-200">
          Cadre d'utilisation
        </p>
        <h1 className="mb-4 text-4xl font-bold text-white">
          Conditions d'utilisation
        </h1>
        <p className="max-w-2xl text-primary-100">
          Ces conditions encadrent l'utilisation de la plateforme AIFUS 2026
          pour les inscriptions, réservations et interactions liées aux
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

export default Conditions;
