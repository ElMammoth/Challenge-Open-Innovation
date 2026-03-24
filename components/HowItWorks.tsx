"use client";

const steps = [
  {
    number: "01",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: "Connectez vos comptes",
    subtitle: "Open Banking sécurisé",
    desc: "Autorisez l'accès en lecture seule à vos comptes via le protocole DSP2. Aucune donnée n'est stockée sans votre accord. Analyse de vos 12 derniers mois en 30 secondes.",
    highlight: "DSP2 & chiffrement AES-256",
  },
  {
    number: "02",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Notre algorithme analyse votre profil",
    subtitle: "En quelques secondes",
    desc: "Notre système calcule votre taux d'endettement, votre reste à vivre, votre stabilité de revenus et détecte les comportements qui bloquent les banques.",
    highlight: "Score HCSF calculé instantanément",
  },
  {
    number: "03",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
    title: "Recevez votre plan d'action",
    subtitle: "Personnalisé et daté",
    desc: "Feuille de route semaine par semaine, simulations de scénarios, recommandations concrètes et date précise à laquelle vous serez finançable selon les normes HCSF.",
    highlight: "Objectif : 90 jours en moyenne",
  },
  {
    number: "04",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Générez votre Passeport de Crédit",
    subtitle: "Certifié et infalsifiable",
    desc: "Un document officiel pré-audité selon les normes HCSF, généré avec un QR code de vérification. Les banques savent immédiatement que votre dossier est sérieux.",
    highlight: "Confiance bancaire immédiate",
  },
];

export default function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-bpce-600 uppercase tracking-widest mb-3">
            Processus
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            De la connexion bancaire au passeport certifié, tout le parcours en 4 étapes simples.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bpce-100 to-transparent" />

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-start gap-4">
                <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0" style={{background:"linear-gradient(to bottom right,#6B2D8B,#431B5C)",boxShadow:"0 10px 25px -5px #D4B8E888"}}>
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{step.number}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-bpce-600 uppercase tracking-wide mb-1">
                    {step.subtitle}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{step.desc}</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bpce-50 border border-bpce-100">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B2D8B" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span className="text-xs font-semibold text-bpce-700">{step.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-bpce-50 to-emerald-50 rounded-2xl border border-bpce-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-gray-900 mb-1">Prêt à commencer ?</p>
            <p className="text-gray-500 text-sm">L'analyse initiale est 100% gratuite et prend moins de 5 minutes.</p>
          </div>
          <a
            href="#simulateur"
            className="flex-shrink-0 px-6 py-3.5 bg-bpce-600 text-white font-semibold rounded-xl hover:bg-bpce-700 transition-all shadow-lg shadow-bpce-200 flex items-center gap-2"
          >
            Tester le simulateur
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
