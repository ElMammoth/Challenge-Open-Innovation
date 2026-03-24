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
  const [aiAnalyse, setAiAnalyse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

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

    return { maxMensualite, capaciteEmprunt, budgetTotal, tauxEndettementActuel, hcsfOk, score, margePct, isProblematic };
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

  async function handleAnalyse() {
    if (showSolutions && aiAnalyse) {
      setShowSolutions(false);
      return;
    }
    setShowSolutions(true);
    setAiLoading(true);
    setAiError("");
    setAiAnalyse("");

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revenu,
          autresCredits,
          apport,
          duree,
          tauxInteret,
          capaciteEmprunt: Math.round(result.capaciteEmprunt),
          budgetTotal: Math.round(result.budgetTotal),
          tauxEndettement: result.tauxEndettementActuel.toFixed(1),
          score: result.score,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiAnalyse(data.analyse);
      }
    } catch {
      setAiError("Impossible de contacter le service d'analyse. Réessayez dans un instant.");
    } finally {
      setAiLoading(false);
    }
  }

  function renderMarkdown(text: string) {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("### ")) {
        return <h4 key={i} className="text-base font-bold text-gray-900 mt-5 mb-2">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={i} className="text-xl font-extrabold text-gray-900 mt-6 mb-3">{line.replace("# ", "")}</h2>;
      }
      if (line.startsWith("- **") || line.startsWith("* **")) {
        const content = line.replace(/^[-*]\s*/, "");
        return (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-1.5">
            <span className="text-bpce-600 mt-0.5">&#8226;</span>
            <span dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          </li>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-1.5">
            <span className="text-bpce-600 mt-0.5">&#8226;</span>
            <span>{line.replace(/^[-*]\s*/, "")}</span>
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-1.5">
            <span className="text-bpce-600 font-bold mt-0.5">{line.match(/^(\d+)\./)?.[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          </li>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return (
        <p key={i} className="text-sm text-gray-700 leading-relaxed mb-1"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong class='text-gray-900'>$1</strong>") }}
        />
      );
    });
  }

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
                  <span>1 000 EUR</span><span>15 000 EUR</span>
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
                  <span>0 EUR</span><span>2 000 EUR</span>
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
                  <span>0 EUR</span><span>200 000 EUR</span>
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
                {result.maxMensualite > 0 ? formatEur(result.maxMensualite) : "0 EUR"}
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

            {/* BOUTON ANALYSE IA */}
            {result.isProblematic && (
              <button
                onClick={handleAnalyse}
                disabled={aiLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border-2"
                style={{
                  background: showSolutions ? "#FEF2F2" : "#EF4444",
                  color: showSolutions ? "#DC2626" : "white",
                  borderColor: showSolutions ? "#FECACA" : "#EF4444",
                  opacity: aiLoading ? 0.7 : 1,
                }}
              >
                {aiLoading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83"/>
                    </svg>
                    Analyse en cours...
                  </>
                ) : showSolutions ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Masquer l'analyse
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Analyser mon dossier avec l'IA
                  </>
                )}
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

        {/* PANNEAU ANALYSE IA */}
        {result.isProblematic && showSolutions && (
          <div className="mt-8 rounded-2xl border-2 border-red-100 bg-white overflow-hidden shadow-lg">
            {/* Header */}
            <div className="p-6 border-b border-red-50" style={{ background: "linear-gradient(to right, #FEF2F2, #FFF7ED)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Analyse personnalisée par IA
                  </h3>
                  <p className="text-sm text-gray-500">
                    Basée sur votre profil : {formatEur(revenu)}/mois, {formatEur(autresCredits)}/mois de crédits, {duree} ans, score {result.score}/100
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              {aiLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-bpce-200 border-t-bpce-600 animate-spin" />
                  <p className="text-sm text-gray-500 font-medium">Notre IA analyse votre situation...</p>
                  <p className="text-xs text-gray-400">Cela prend quelques secondes</p>
                </div>
              )}

              {aiError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-sm text-red-600 font-medium">{aiError}</p>
                  <button onClick={handleAnalyse} className="mt-3 text-sm text-red-500 underline hover:text-red-700">
                    Réessayer
                  </button>
                </div>
              )}

              {aiAnalyse && !aiLoading && (
                <div className="prose-sm max-w-none">
                  {renderMarkdown(aiAnalyse)}
                </div>
              )}
            </div>

            {/* Footer */}
            {aiAnalyse && !aiLoading && (
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
            )}
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
