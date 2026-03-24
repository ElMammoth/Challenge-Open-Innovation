"use client";

const plans = [
  {
    name: "Starter",
    tag: null,
    price: "Gratuit",
    period: "",
    desc: "Pour découvrir votre profil et comprendre les règles du jeu.",
    color: "border-gray-200",
    cta: "Commencer gratuitement",
    ctaStyle: "border border-bpce-600 text-bpce-600 hover:bg-bpce-50",
    features: [
      { text: "Simulateur HCSF complet", ok: true },
      { text: "Score de financement indicatif", ok: true },
      { text: "1 analyse de profil basique", ok: true },
      { text: "Connexion Open Banking", ok: false },
      { text: "Diagnostic de refus détaillé", ok: false },
      { text: "Passeport de Crédit certifié", ok: false },
      { text: "Feuille de route personnalisée", ok: false },
      { text: "Conseiller dédié", ok: false },
    ],
  },
  {
    name: "Pro",
    tag: "Le plus populaire",
    price: "29 €",
    period: "/ mois",
    desc: "Pour les primo-accédants qui veulent maximiser leurs chances dès le premier dépôt.",
    color: "border-bpce-600",
    cta: "Démarrer l'essai 7 jours",
    ctaStyle: "bg-bpce-600 text-white hover:bg-bpce-700 shadow-lg shadow-bpce-200",
    features: [
      { text: "Simulateur HCSF complet", ok: true },
      { text: "Score de financement détaillé", ok: true },
      { text: "Connexion Open Banking (DSP2)", ok: true },
      { text: "Analyse complète du profil", ok: true },
      { text: "Passeport de Crédit certifié", ok: true },
      { text: "Feuille de route 90 jours", ok: true },
      { text: "Diagnostic de refus détaillé", ok: false },
      { text: "Conseiller dédié", ok: false },
    ],
  },
  {
    name: "Premium",
    tag: "Après un refus",
    price: "59 €",
    period: "/ mois",
    desc: "Pour ceux qui ont essuyé un refus et veulent un plan de retour solide avec un expert.",
    color: "border-violet-500",
    cta: "Contacter un conseiller",
    ctaStyle: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200",
    features: [
      { text: "Tout le plan Pro inclus", ok: true },
      { text: "Diagnostic approfondi du refus", ok: true },
      { text: "Scénarios de remise en forme", ok: true },
      { text: "Feuille de route semaine par semaine", ok: true },
      { text: "Passeport de Crédit renforcé", ok: true },
      { text: "Conseiller IOBSP dédié", ok: true },
      { text: "Mise en relation prioritaire banques", ok: true },
      { text: "Suivi jusqu'au déblocage du prêt", ok: true },
    ],
  },
];

export default function Pricing() {
  return (
    <section id="tarifs" className="py-24 bg-[#F8FAFF]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-bpce-600 uppercase tracking-widest mb-3">Tarifs</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Un plan adapté à chaque situation
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Commencez gratuitement. Passez au plan supérieur quand vous êtes prêt à déposer.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border-2 ${plan.color} p-7 flex flex-col shadow-sm relative overflow-hidden ${
                plan.tag === "Le plus populaire" ? "shadow-bpce-100 shadow-lg" : ""
              }`}
            >
              {plan.tag && (
                <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  plan.tag === "Le plus populaire"
                    ? "bg-bpce-600 text-white"
                    : "bg-violet-100 text-violet-700"
                }`}>
                  {plan.tag}
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{plan.name}</p>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-sm mb-1">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{plan.desc}</p>
              </div>

              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2.5 text-sm ${f.ok ? "text-gray-700" : "text-gray-300"}`}>
                    {f.ok ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`w-full py-3.5 rounded-xl text-sm font-semibold text-center transition-all ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
          {[
            { icon: "🔒", text: "Données sécurisées et chiffrées" },
            { icon: "🔄", text: "Résiliation à tout moment" },
            { icon: "✅", text: "Essai 7 jours sans engagement" },
            { icon: "🏦", text: "Conforme DSP2 et RGPD" },
          ].map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              <span>{g.icon}</span>
              <span>{g.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
