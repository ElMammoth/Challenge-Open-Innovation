"use client";

export default function Hero() {
  return (
    <section className="hero-bg min-h-screen flex items-center pt-16 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-bpce-100/40 blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-100/30 blur-3xl translate-y-1/4 -translate-x-1/4" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in">
              Du refus bancaire
              <br />
              <span className="gradient-text">au prêt signé.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg animate-delay-1">
              Loan Coach analyse votre profil financier en temps réel via l'Open Banking,
              identifie vos points de blocage et vous trace une feuille de route précise
              pour devenir finançable, même après un refus.
            </p>

            {/* Two paths */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-delay-2">
              <a
                href="#simulateur"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-bpce-600 text-white font-semibold rounded-xl hover:bg-bpce-700 transition-all shadow-lg shadow-bpce-200 hover:shadow-bpce-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                J'anticipe mon dossier
              </a>
              <a
                href="#simulateur"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-800 font-semibold rounded-xl border border-gray-200 hover:border-bpce-300 hover:text-bpce-700 transition-all shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                J'ai été refusé(e)
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 animate-delay-3">
              <div className="flex items-center gap-1.5">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Gratuit pour commencer
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Conforme normes HCSF
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Données chiffrées en 5 min
              </div>
            </div>
          </div>

          {/* Right — Dashboard mockup */}
          <div className="hidden lg:block relative animate-delay-2">
            {/* Main card */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-bpce-100 border border-gray-100 p-6 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Passeport de Crédit</p>
                  <p className="text-lg font-bold text-gray-900">Sophie M., Conseillère</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
              </div>

              {/* Score bar */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Score de financement</span>
                  <span className="text-sm font-bold text-emerald-600">78 / 100</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] rounded-full" style={{background:"linear-gradient(to right,#7E30A8,#10B981)"}} />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Taux d'endettement", value: "28.4%", note: "< 35% HCSF" },
                  { label: "Durée max", value: "25 ans", note: "Conforme HCSF" },
                  { label: "Apport personnel", value: "18%", note: "Recommandé : 10%+" },
                  { label: "Reste à vivre", value: "1 840 €", note: "Confortable" },
                ].map((m) => (
                  <div key={m.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                    <p className="text-base font-bold text-gray-900">{m.value}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{m.note}</p>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Dossier prêt pour dépôt</p>
                  <p className="text-xs text-gray-500">Pré-audit HCSF validé, 3 banques recommandées</p>
                </div>
              </div>
            </div>

            {/* Floating notification */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl shadow-bpce-100 border border-gray-100 p-3 flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-bpce-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Points de blocage identifiés</p>
                <p className="text-xs text-gray-400">2 optimisations détectées</p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl shadow-bpce-100 border border-gray-100 p-3 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Finançable dans 90j</p>
                <p className="text-xs text-gray-400">Feuille de route générée</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
