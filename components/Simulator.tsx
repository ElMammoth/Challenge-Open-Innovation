"use client";
import { useState, useMemo } from "react";

function formatEur(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default function Simulator() {
  const [revenu, setRevenu] = useState(3500);
  const [autresCredits, setAutresCredits] = useState(0);
  const [apport, setApport] = useState(30000);
  const [duree, setDuree] = useState(20);
  const [tauxInteret, setTauxInteret] = useState(3.5);
  const [showSolutions, setShowSolutions] = useState(false);

  const result = useMemo(() => {
    const tauxMensuel = tauxInteret / 100 / 12;
    const nbMois = duree * 12;
    const maxMensualite = revenu * 0.35 - autresCredits;
    const capaciteEmprunt = maxMensualite > 0
      ? (maxMensualite * (1 - Math.pow(1 + tauxMensuel, -nbMois))) / tauxMensuel
      : 0;
    const budgetTotal = Math.max(0, capaciteEmprunt + apport);
    const tauxEndettementActuel = autresCredits / revenu * 100;
    const hcsfOk = tauxEndettementActuel <= 35 && duree <= 25;
    const margePct = Math.max(0, 35 - tauxEndettementActuel);
    const scoreRaw = Math.min(100, Math.max(0,
      (margePct / 35) * 40 +
      (apport / (budgetTotal || 1)) * 30 * 10 +
      (hcsfOk ? 30 : 0)
    ));
    const score = Math.round(Math.min(100, scoreRaw));
    const isProblematic = tauxEndettementActuel > 35 || score < 45;

    // Solutions personnalisées
    const creditExcess = Math.max(0, autresCredits - revenu * 0.35);
    const creditToReduce = Math.ceil(creditExcess / 50) * 50;
    const revenuNeeded = autresCredits > 0 ? Math.ceil(autresCredits / 0.35 / 100) * 100 : 0;
    const revenuGap = Math.max(0, revenuNeeded - revenu);
    const dureeMax25 = duree > 25;
    const apportIdeal = Math.round(capaciteEmprunt * 0.1 / 1000) * 1000;

    const solutions = [];

    if (autresCredits > revenu * 0.35) {
      solutions.push({
        icon: "💳",
        priority: "haute",
        title: "Soldez ou rachetez vos crédits en cours",
        detail: `Vous devez réduire vos mensualités de crédits de ${formatEur(creditToReduce)}/mois pour repasser sous le seuil de 35%. Clôturer un crédit renouvelable ou racheter un crédit auto peut suffire.`,
        impact: "Impact immédiat",
        color: "border-red-200 bg-red-50",
        iconBg: "bg-red-100",
        badgeColor: "bg-red-100 text-red-700",
      });
    }

    if (revenuGap > 0) {
      solutions.push({
        icon: "💰",
        priority: "haute",
        title: "Augmentez vos revenus déclarés",
        detail: `Avec vos crédits actuels (${formatEur(autresCredits)}/mois), il vous faudrait ${formatEur(revenuNeeded)}/mois de revenus nets pour être sous les 35% HCSF. Un co-emprunteur ou des revenus locatifs peuvent être intégrés au dossier.`,
        impact: `+${formatEur(revenuGap)}/mois nécessaires`,
        color: "border-orange-200 bg-orange-50",
        iconBg: "bg-orange-100",
        badgeColor: "bg-orange-100 text-orange-700",
      });
    }

    if (duree < 25 && duree > 0) {
      const tauxMensuelCalc = tauxInteret / 100 / 12;
      const nbMois25 = 25 * 12;
      const maxMens25 = revenu * 0.35 - autresCredits;
      const capacite25 = maxMens25 > 0
        ? (maxMens25 * (1 - Math.pow(1 + tauxMensuelCalc, -nbMois25))) / tauxMensuelCalc
        : 0;
      const gainCapacite = Math.round((capacite25 - capaciteEmprunt) / 1000) * 1000;
      if (gainCapacite > 5000) {
        solutions.push({
          icon: "📅",
          priority: "moyenne",
          title: `Allongez la durée à 25 ans`,
          detail: `En passant de ${duree} à 25 ans, vous augmentez votre capacité d'emprunt de ${formatEur(gainCapacite)} supplémentaires, sans toucher à vos revenus ni à vos crédits. C'est la solution la plus simple et la plus rapide.`,
          impact: `+${formatEur(gainCapacite)} de capacité`,
          color: "border-bpce-200 bg-bpce-50",
          iconBg: "bg-bpce-100",
          badgeColor: "bg-bpce-100 text-bpce-700",
        });
      }
    }

    if (apport < apportIdeal && apportIdeal > 0) {
      solutions.push({
        icon: "🏦",
        priority: "moyenne",
        title: "Augmentez votre apport personnel",
        detail: `Un apport de ${formatEur(apportIdeal)} (10% du projet) rassure fortement la banque et peut débloquer une dérogation aux normes HCSF. Épargne personnelle, donation familiale ou déblocage de participation sont des sources valides.`,
        impact: "Améliore fortement le dossier",
        color: "border-emerald-200 bg-emerald-50",
        iconBg: "bg-emerald-100",
        badgeColor: "bg-emerald-100 text-emerald-700",
      });
    }

    solutions.push({
      icon: "🤝",
      priority: "conseil",
      title: "Ajoutez un co-emprunteur",
      detail: "Emprunter à deux permet de cumuler les revenus, ce qui peut faire baisser mécaniquement votre taux d'endettement. C'est l'une des solutions les plus efficaces pour les primo-accédants dont le revenu individuel est insuffisant.",
      impact: "Très efficace",
      color: "border-gray-200 bg-gray-50",
      iconBg: "bg-gray-100",
      badgeColor: "bg-gray-100 text-gray-600",
    });

    return { maxMensualite, capaciteEmprunt, budgetTotal, tauxEndettementActuel, hcsfOk, score, margePct, isProblematic, solutions };
  }, [revenu, autresCredits, apport, duree, tauxInteret]);

  const getScoreColor = (s: number) =>
    s >= 70 ? "text-emerald-600" : s >= 45 ? "text-amber-600" : "text-red-500";
  const getScoreLabel = (s: number) =>
    s >= 70 ? "Dossier solide" : s >= 45 ? "Dossier perfectible" : "Dossier fragile";
  const getScoreBg = (s: number) =>
    s >= 70 ? "from-emerald-500 to-bpce-500" : s >= 45 ? "from-amber-400 to-orange-500" : "from-red-500 to-rose-500";

  const getEndettementStatus = () => {
    const t = result.tauxEndettementActuel;
    if (t === 0) return { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", label: "Aucun crédit actif, excellent" };
    if (t <= 25) return { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", label: "Taux confortable, bien positionné" };
    if (t <= 35) return { color: "text-amber-600", bg: "bg-amber-50 border-amber-100", label: "Proche de la limite HCSF, attention" };
    return { color: "text-red-600", bg: "bg-red-50 border-red-100", label: "Dépasse la limite HCSF de 35%" };
  };

  const endettementStatus = getEndettementStatus();
  const totalTaux = autresCredits > 0 ? result.tauxEndettementActuel : 0;

  return (
    <section id="simulateur" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-bpce-600 uppercase tracking-widest mb-3">
            Simulateur HCSF
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Calculez votre capacité d'emprunt en temps réel
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Ajustez les curseurs et découvrez instantanément ce que la banque va calculer selon les normes HCSF 2024.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left — Inputs */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Votre situation financière</h3>

            <div className="flex flex-col gap-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Revenus nets mensuels</label>
                  <span className="text-lg font-bold text-bpce-600">{formatEur(revenu)}</span>
                </div>
                <input type="range" min={1000} max={15000} step={100} value={revenu}
                  onChange={e => setRevenu(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 000 €</span><span>15 000 €</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Autres crédits en cours
                    <span className="ml-1 text-xs font-normal text-gray-400">(auto, conso, étudiant...)</span>
                  </label>
                  <span className="text-lg font-bold text-gray-900">{formatEur(autresCredits)}</span>
                </div>
                <input type="range" min={0} max={2000} step={50} value={autresCredits}
                  onChange={e => setAutresCredits(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 €</span><span>2 000 €</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Apport personnel</label>
                  <span className="text-lg font-bold text-emerald-600">{formatEur(apport)}</span>
                </div>
                <input type="range" min={0} max={200000} step={1000} value={apport}
                  onChange={e => setApport(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 €</span><span>200 000 €</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Durée du prêt</label>
                  <span className="text-lg font-bold text-gray-900">{duree} ans</span>
                </div>
                <input type="range" min={5} max={27} step={1} value={duree}
                  onChange={e => setDuree(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5 ans</span><span>27 ans</span>
                </div>
                {duree > 25 && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Uniquement pour achat dans le neuf ou travaux représentant plus de 25% du coût
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Taux d'intérêt estimé</label>
                  <span className="text-lg font-bold text-gray-900">{tauxInteret.toFixed(1)}%</span>
                </div>
                <input type="range" min={1} max={7} step={0.1} value={tauxInteret}
                  onChange={e => setTauxInteret(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1%</span><span>7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Results */}
          <div className="flex flex-col gap-4">
            {/* Score */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Score Loan Coach</p>
              <div className="flex items-end gap-3 mb-3">
                <span className={`text-5xl font-extrabold ${getScoreColor(result.score)}`}>{result.score}</span>
                <span className="text-gray-400 text-sm mb-2">/ 100</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getScoreBg(result.score)} transition-all duration-500`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <p className={`text-sm font-semibold ${getScoreColor(result.score)}`}>
                {getScoreLabel(result.score)}
              </p>
            </div>

            {/* Budget total */}
            <div className="bg-bpce-600 rounded-2xl p-6 text-white">
              <p className="text-xs font-semibold text-bpce-200 uppercase tracking-wide mb-1">Budget total d'achat</p>
              <p className="text-4xl font-extrabold">{formatEur(result.budgetTotal)}</p>
              <p className="text-bpce-200 text-sm mt-1">
                Prêt : {formatEur(result.capaciteEmprunt)} + Apport : {formatEur(apport)}
              </p>
            </div>

            {/* Mensualite max */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Mensualité maximum HCSF</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.maxMensualite > 0 ? formatEur(result.maxMensualite) : "0 €"}
                <span className="text-sm font-normal text-gray-400 ml-1">/ mois</span>
              </p>
              {result.maxMensualite <= 0 && (
                <p className="text-xs text-red-500 mt-1">Vos autres crédits dépassent déjà la limite HCSF</p>
              )}
            </div>

            {/* Taux endettement */}
            <div className={`rounded-2xl border p-5 ${endettementStatus.bg}`}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Taux d'endettement actuel</p>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-2xl font-bold ${endettementStatus.color}`}>
                  {totalTaux.toFixed(1)}%
                </span>
                <span className="text-gray-400 text-sm mb-0.5">/ 35% max</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalTaux <= 25 ? "bg-emerald-500" : totalTaux <= 35 ? "bg-amber-400" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, (totalTaux / 35) * 100)}%` }}
                />
              </div>
              <p className={`text-xs font-medium ${endettementStatus.color}`}>{endettementStatus.label}</p>
            </div>

            {/* HCSF Badge */}
            <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
              result.hcsfOk ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
            }`}>
              {result.hcsfOk ? (
                <>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Conforme aux normes HCSF</p>
                    <p className="text-xs text-gray-500">Durée et taux validés</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Hors normes HCSF</p>
                    <p className="text-xs text-gray-500">Ajustez la durée ou réduisez les crédits</p>
                  </div>
                </>
              )}
            </div>

            {/* ── BOUTON SOLUTIONS (visible quand dossier problématique) ── */}
            {result.isProblematic && (
              <button
                onClick={() => setShowSolutions(!showSolutions)}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border-2"
                style={{
                  background: showSolutions ? "#FEF2F2" : "#EF4444",
                  color: showSolutions ? "#DC2626" : "white",
                  borderColor: showSolutions ? "#FECACA" : "#EF4444",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  {showSolutions
                    ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                    : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
                  }
                </svg>
                {showSolutions ? "Masquer les solutions" : "Comment obtenir mon crédit ?"}
              </button>
            )}

            {/* CTA normal */}
            {!result.isProblematic && (
              <a
                href="#cta"
                className="mt-1 w-full py-3.5 bg-bpce-600 text-white font-semibold rounded-xl hover:bg-bpce-700 transition-all text-center text-sm shadow-lg shadow-bpce-200"
              >
                Obtenir mon Passeport de Crédit
              </a>
            )}
          </div>
        </div>

        {/* ── PANNEAU SOLUTIONS (pleine largeur, s'ouvre sous le simulateur) ── */}
        {result.isProblematic && showSolutions && (
          <div className="mt-8 rounded-2xl border-2 border-red-100 bg-white overflow-hidden shadow-lg">
            {/* Header du panneau */}
            <div className="p-6 border-b border-red-50" style={{ background: "linear-gradient(to right, #FEF2F2, #FFF7ED)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {result.solutions.length} solution{result.solutions.length > 1 ? "s" : ""} pour débloquer votre crédit
                  </h3>
                  <p className="text-sm text-gray-500">
                    Basé sur votre situation actuelle — {formatEur(revenu)}/mois de revenus, {formatEur(autresCredits)}/mois de crédits, {duree} ans de durée.
                  </p>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {result.solutions.map((sol, i) => (
                <div key={i} className={`rounded-xl border-2 p-5 ${sol.color}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl ${sol.iconBg} flex items-center justify-center text-lg flex-shrink-0`}>
                      {sol.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm font-bold text-gray-900">{sol.title}</h4>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sol.badgeColor}`}>
                          {sol.impact}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{sol.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <a
                href="#cta"
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: "linear-gradient(to right, #6B2D8B, #4A1870)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Obtenir mon plan personnalisé complet
              </a>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Simulation indicative basée sur les normes HCSF 2024. Les résultats réels peuvent varier selon les établissements bancaires.
          Loan Coach ne se substitue pas à un conseiller en crédit immobilier.
        </p>
      </div>
    </section>
  );
}
