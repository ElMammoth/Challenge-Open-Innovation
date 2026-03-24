"use client";

export default function HCSFExplainer() {
  return (
    <section className="py-24 section-dark text-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-bpce-300 uppercase tracking-widest mb-3">
            Comprendre les règles du jeu
          </p>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Les normes HCSF : pourquoi elles bloquent des milliers de dossiers
          </h2>
          <p className="text-lg text-bpce-100/70 max-w-2xl mx-auto">
            Depuis 2022, ces règles sont obligatoires pour toutes les banques françaises.
            Les ignorer, c'est déposer un dossier voué à l'échec.
          </p>
        </div>

        {/* Two main rules */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Rule 1 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-bpce-500/20 border border-bpce-400/30 flex items-center justify-center">
                <span className="text-bpce-300 font-bold text-sm">01</span>
              </div>
              <span className="text-bpce-300 text-sm font-semibold uppercase tracking-wide">Règle n°1</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Taux d'endettement max : 35%</h3>
            <p className="text-bpce-100/60 text-sm mb-6">
              Vos mensualités de crédit (tous crédits confondus, assurance incluse) ne peuvent pas dépasser 35% de vos revenus nets.
            </p>

            {/* Visual example */}
            <div className="bg-white/5 rounded-xl p-5">
              <p className="text-xs font-semibold text-bpce-300 uppercase tracking-wide mb-4">Exemple concret</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Revenu net mensuel</span>
                <span className="text-sm font-bold text-white">3 000 €</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-white/70">Mensualité maximum</span>
                <span className="text-sm font-bold text-emerald-400">1 050 € max</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                <div className="h-full w-[35%] rounded-full" style={{background:"linear-gradient(to right,#9A58C6,#34D399)"}} />
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>0%</span>
                <span className="text-emerald-400 font-semibold">35% (limite HCSF)</span>
                <span>100%</span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p className="text-xs text-red-300">
                Un crédit auto, crédit renouvelable ou prêt étudiant actif réduit votre capacité d'emprunt immobilier. Loan Coach les détecte automatiquement.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                <span className="text-violet-300 font-bold text-sm">02</span>
              </div>
              <span className="text-violet-300 text-sm font-semibold uppercase tracking-wide">Règle n°2</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Durée max du prêt : 25 ans</h3>
            <p className="text-bpce-100/60 text-sm mb-6">
              La durée d'emprunt est limitée à 25 ans en général, 27 ans dans le neuf ou si les travaux représentent plus de 25% du coût total.
            </p>

            <div className="bg-white/5 rounded-xl p-5">
              <p className="text-xs font-semibold text-violet-300 uppercase tracking-wide mb-4">Durées autorisées</p>
              {[
                { label: "Ancien sans travaux", max: "25 ans", width: "w-[71%]", color: "bg-bpce-400" },
                { label: "Neuf / VEFA", max: "27 ans", width: "w-[77%]", color: "bg-violet-400" },
                { label: "Ancien + travaux > 25%", max: "27 ans", width: "w-[77%]", color: "bg-emerald-400" },
              ].map((r, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{r.label}</span>
                    <span className="text-white font-semibold">{r.max}</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${r.width} ${r.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <p className="text-xs text-emerald-300">
                Les banques peuvent déroger à ces règles pour 20% de leurs dossiers, prioritairement réservés aux primo-accédants en résidence principale.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-bpce-500/20 border border-bpce-400/30 flex-shrink-0 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-white mb-1">Loan Coach calcule tout cela automatiquement pour vous</p>
            <p className="text-bpce-100/60 text-sm">
              Plus besoin de maîtriser chaque règle par cœur. Notre système applique les normes HCSF en temps réel
              sur votre situation et vous dit exactement où vous en êtes, et comment optimiser votre dossier.
            </p>
          </div>
          <a
            href="#simulateur"
            className="flex-shrink-0 px-5 py-3 bg-bpce-600 text-white font-semibold rounded-xl hover:bg-bpce-500 transition-colors text-sm whitespace-nowrap"
          >
            Tester maintenant
          </a>
        </div>
      </div>
    </section>
  );
}
