"use client";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B2D8B" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    bg: "bg-bpce-50",
    tag: "Open Banking DSP2",
    title: "Connexion bancaire sécurisée",
    desc: "Accès en lecture seule via le protocole européen DSP2. Toutes vos banques françaises et européennes sont supportées. Aucun mot de passe stocké.",
    points: ["Compatibilité 99% des banques FR", "Chiffrement AES-256", "Accès révocable à tout moment"],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    bg: "bg-violet-50",
    tag: "Scoring avancé",
    title: "Algorithme de scoring prédictif",
    desc: "Notre algorithme va au-delà du simple taux d'endettement. Il analyse la dynamique de vos revenus, votre comportement de compte et valorise les profils atypiques (freelances, expatriés).",
    points: ["Score sur 100 points", "Valorisation des profils atypiques", "Comparaison avec 50 000+ dossiers"],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    bg: "bg-emerald-50",
    tag: "Certification HCSF",
    title: "Passeport de Crédit certifié",
    desc: "Un document officiel pré-audité selon les normes HCSF 2024. QR code de vérification intégré. Les banques reconnaissent immédiatement votre sérieux.",
    points: ["Conforme normes HCSF 2024", "QR code de vérification", "Valide 3 mois"],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    bg: "bg-amber-50",
    tag: "Plan d'action",
    title: "Feuille de route personnalisée",
    desc: "Simulation de scénarios de remise en forme financière. Date précise de retour à la solvabilité. Suivi hebdomadaire de votre progression.",
    points: ["Scénarios d'épargne optimisés", "Date de financement certifiée", "Alertes de progression"],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    bg: "bg-red-50",
    tag: "Diagnostic",
    title: "Analyse du refus bancaire",
    desc: "Décode les vraies raisons de votre refus que la banque ne vous communique pas. Irrégularité de revenus, crédit renouvelable, découverts... chaque signal négatif est identifié.",
    points: ["Identification précise des motifs", "Priorisation des corrections", "Rapport détaillé"],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    bg: "bg-cyan-50",
    tag: "Accompagnement",
    title: "Conseil expert intégré",
    desc: "Accès à des conseillers en crédit immobilier certifiés pour valider votre dossier avant dépôt. Mise en relation avec les banques les plus adaptées à votre profil.",
    points: ["Conseillers IOBSP certifiés", "Mise en relation directe", "Suivi jusqu'au déblocage"],
  },
];

export default function Features() {
  return (
    <section id="fonctionnalites" className="py-24 bg-[#F8FAFF]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-bpce-600 uppercase tracking-widest mb-3">
            Fonctionnalités
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            La technologie au service de votre accès à la propriété
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Un écosystème complet pour sécuriser chaque étape de votre parcours de crédit.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="card-hover bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center`}>
                  {f.icon}
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                  {f.tag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>

              <ul className="flex flex-col gap-1.5 mt-auto pt-2 border-t border-gray-50">
                {f.points.map((p, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
