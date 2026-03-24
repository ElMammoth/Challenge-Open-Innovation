"use client";
import { useState, useMemo, useCallback } from "react";

/* ── helpers ── */
function formatEur(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

/* ── types ── */
type Profile = {
  // Step 1 – Profil
  age: number;
  situation: "celibataire" | "couple" | "famille";
  emploi: "cdi" | "cdd" | "independant" | "fonctionnaire";
  anciennete: number;
  // Step 2 – Revenus
  revenu: number;
  revenuCoEmprunteur: number;
  autresRevenus: number;
  // Step 3 – Charges
  autresCredits: number;
  loyer: number;
  pensionAlimentaire: number;
  // Step 4 – Projet
  typeBien: "ancien" | "neuf" | "construction" | "travaux";
  localisation: "paris" | "idf" | "grande_ville" | "moyen" | "rural";
  apport: number;
  duree: number;
  tauxInteret: number;
};

const STEPS = [
  { id: 1, label: "Profil", icon: "👤" },
  { id: 2, label: "Revenus", icon: "💰" },
  { id: 3, label: "Charges", icon: "💳" },
  { id: 4, label: "Projet", icon: "🏠" },
  { id: 5, label: "Résultats", icon: "📊" },
];

const SITUATION_OPTIONS = [
  { value: "celibataire", label: "Célibataire", icon: "🧑" },
  { value: "couple", label: "En couple", icon: "👫" },
  { value: "famille", label: "Famille", icon: "👨‍👩‍👧" },
];

const EMPLOI_OPTIONS = [
  { value: "cdi", label: "CDI", desc: "Contrat à durée indéterminée" },
  { value: "fonctionnaire", label: "Fonctionnaire", desc: "Titulaire de la fonction publique" },
  { value: "cdd", label: "CDD / Intérim", desc: "Contrat temporaire" },
  { value: "independant", label: "Indépendant", desc: "Auto-entrepreneur, freelance..." },
];

const BIEN_OPTIONS = [
  { value: "ancien", label: "Ancien", icon: "🏚️", desc: "Bien existant" },
  { value: "neuf", label: "Neuf", icon: "🏗️", desc: "Programme neuf / VEFA" },
  { value: "construction", label: "Construction", icon: "🔨", desc: "Maison à construire" },
  { value: "travaux", label: "Avec travaux", icon: "🔧", desc: "Ancien + rénovation" },
];

const LOCALISATION_OPTIONS = [
  { value: "paris", label: "Paris intra-muros" },
  { value: "idf", label: "Île-de-France" },
  { value: "grande_ville", label: "Grande ville (Lyon, Marseille...)" },
  { value: "moyen", label: "Ville moyenne" },
  { value: "rural", label: "Zone rurale" },
];

export default function Simulator() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Profile>({
    age: 30,
    situation: "celibataire",
    emploi: "cdi",
    anciennete: 3,
    revenu: 3000,
    revenuCoEmprunteur: 0,
    autresRevenus: 0,
    autresCredits: 0,
    loyer: 0,
    pensionAlimentaire: 0,
    typeBien: "ancien",
    localisation: "grande_ville",
    apport: 20000,
    duree: 20,
    tauxInteret: 3.5,
  });
  const [aiAnalyse, setAiAnalyse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const update = useCallback(<K extends keyof Profile>(key: K, val: Profile[K]) => {
    setProfile(p => ({ ...p, [key]: val }));
  }, []);

  /* ── Calculs ── */
  const result = useMemo(() => {
    const revenuTotal = profile.revenu + profile.revenuCoEmprunteur + profile.autresRevenus;
    const chargesTotal = profile.autresCredits + profile.pensionAlimentaire;
    const tauxMensuel = profile.tauxInteret / 100 / 12;
    const nbMois = profile.duree * 12;
    const maxMensualite = revenuTotal * 0.35 - chargesTotal;
    const capaciteEmprunt = maxMensualite > 0
      ? (maxMensualite * (1 - Math.pow(1 + tauxMensuel, -nbMois))) / tauxMensuel
      : 0;
    const budgetTotal = Math.max(0, capaciteEmprunt + profile.apport);
    const tauxEndettement = revenuTotal > 0 ? (chargesTotal / revenuTotal) * 100 : 0;
    const hcsfOk = tauxEndettement <= 35 && profile.duree <= 25;
    const margePct = Math.max(0, 35 - tauxEndettement);

    // Score plus complet
    let score = 0;
    // Marge HCSF (35 pts)
    score += (margePct / 35) * 35;
    // Apport (20 pts)
    score += Math.min(20, (profile.apport / Math.max(1, budgetTotal)) * 100);
    // Conformité HCSF (15 pts)
    if (hcsfOk) score += 15;
    // Stabilité emploi (15 pts)
    if (profile.emploi === "cdi" || profile.emploi === "fonctionnaire") score += 10;
    if (profile.anciennete >= 2) score += 5;
    // Apport > 10% (10 pts)
    if (budgetTotal > 0 && (profile.apport / budgetTotal) >= 0.1) score += 10;
    // Age bonus (5 pts)
    if (profile.age >= 25 && profile.age <= 45) score += 5;

    score = Math.round(Math.min(100, Math.max(0, score)));
    const isProblematic = tauxEndettement > 35 || score < 50;

    return { revenuTotal, chargesTotal, maxMensualite, capaciteEmprunt, budgetTotal, tauxEndettement, hcsfOk, score, isProblematic };
  }, [profile]);

  /* ── Analyse IA ── */
  async function fetchAnalyse() {
    setAiLoading(true);
    setAiError("");
    setAiAnalyse("");
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revenu: result.revenuTotal,
          autresCredits: result.chargesTotal,
          apport: profile.apport,
          duree: profile.duree,
          tauxInteret: profile.tauxInteret,
          capaciteEmprunt: Math.round(result.capaciteEmprunt),
          budgetTotal: Math.round(result.budgetTotal),
          tauxEndettement: result.tauxEndettement.toFixed(1),
          score: result.score,
          age: profile.age,
          situation: profile.situation,
          emploi: profile.emploi,
          anciennete: profile.anciennete,
          typeBien: profile.typeBien,
          localisation: profile.localisation,
          loyer: profile.loyer,
        }),
      });
      const data = await res.json();
      if (data.error) setAiError(data.error);
      else setAiAnalyse(data.analyse);
    } catch {
      setAiError("Impossible de contacter le service d'analyse.");
    } finally {
      setAiLoading(false);
    }
  }

  function goToResults() {
    setStep(5);
    fetchAnalyse();
  }

  /* ── Score helpers ── */
  const getScoreColor = (s: number) => s >= 70 ? "text-emerald-600" : s >= 50 ? "text-amber-500" : "text-red-500";
  const getScoreLabel = (s: number) => s >= 70 ? "Dossier solide" : s >= 50 ? "Dossier perfectible" : "Dossier fragile";
  const getScoreBg = (s: number) => s >= 70 ? "bg-emerald-500" : s >= 50 ? "bg-amber-400" : "bg-red-500";

  /* ── Markdown renderer ── */
  function renderMarkdown(text: string) {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h4 key={i} className="text-base font-bold text-gray-900 mt-5 mb-2">{line.slice(4)}</h4>;
      if (line.startsWith("## ")) return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{line.slice(3)}</h3>;
      if (line.startsWith("# ")) return <h2 key={i} className="text-xl font-extrabold text-gray-900 mt-6 mb-3">{line.slice(2)}</h2>;
      if (line.match(/^[-*]\s/)) {
        const content = line.replace(/^[-*]\s*/, "");
        return (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-1.5">
            <span className="text-bpce-600 mt-0.5 shrink-0">&#8226;</span>
            <span dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-1.5">
            <span className="text-bpce-600 font-bold mt-0.5 shrink-0">{line.match(/^(\d+)\./)?.[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          </li>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-sm text-gray-700 leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong class='text-gray-900'>$1</strong>") }} />;
    });
  }

  /* ── UI Components ── */
  function OptionCard({ selected, onClick, children, className = "" }: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`p-4 rounded-xl border-2 text-left transition-all ${
          selected
            ? "border-bpce-600 bg-bpce-50 shadow-sm"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        } ${className}`}
      >
        {children}
      </button>
    );
  }

  function SliderField({ label, sublabel, value, min, max, step: s, format, color = "text-bpce-600", onChange }: {
    label: string; sublabel?: string; value: number; min: number; max: number; step: number;
    format: (v: number) => string; color?: string; onChange: (v: number) => void;
  }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">
            {label}
            {sublabel && <span className="ml-1 text-xs font-normal text-gray-400">({sublabel})</span>}
          </label>
          <span className={`text-lg font-bold ${color}`}>{format(value)}</span>
        </div>
        <input type="range" min={min} max={max} step={s} value={value} onChange={e => onChange(+e.target.value)} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{format(min)}</span><span>{format(max)}</span>
        </div>
      </div>
    );
  }

  /* ── Navigation ── */
  const canNext = step < 5;
  const canPrev = step > 1;

  return (
    <section id="simulateur" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-bpce-600 uppercase tracking-widest mb-3">
            Simulateur intelligent
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Évaluez votre dossier en 2 minutes
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Répondez à quelques questions et obtenez une analyse complète de votre capacité d'emprunt avec des recommandations personnalisées par IA.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => { if (s.id < step) setStep(s.id); if (s.id === 5 && step === 4) goToResults(); }}
                className={`flex flex-col items-center gap-1.5 transition-all ${
                  s.id === step ? "scale-105" : s.id < step ? "opacity-80 cursor-pointer" : "opacity-40"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                  s.id === step
                    ? "bg-bpce-600 text-white shadow-md"
                    : s.id < step
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                }`}>
                  {s.id < step ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  ) : (
                    <span className="text-sm">{s.icon}</span>
                  )}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  s.id === step ? "text-bpce-600" : s.id < step ? "text-emerald-600" : "text-gray-400"
                }`}>{s.label}</span>
              </button>
            ))}
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-bpce-600 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Card container */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 min-h-[420px]">

          {/* ── STEP 1: Profil ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Parlez-nous de vous</h3>
              <p className="text-sm text-gray-500 mb-8">Ces informations nous aident à évaluer votre profil emprunteur.</p>

              <div className="space-y-8">
                {/* Âge */}
                <SliderField label="Votre âge" value={profile.age} min={18} max={65} step={1}
                  format={v => `${v} ans`} onChange={v => update("age", v)} />

                {/* Situation */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Votre situation</label>
                  <div className="grid grid-cols-3 gap-3">
                    {SITUATION_OPTIONS.map(opt => (
                      <OptionCard key={opt.value} selected={profile.situation === opt.value}
                        onClick={() => update("situation", opt.value as Profile["situation"])}>
                        <div className="text-center">
                          <span className="text-2xl block mb-1">{opt.icon}</span>
                          <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </div>

                {/* Emploi */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Votre emploi</label>
                  <div className="grid grid-cols-2 gap-3">
                    {EMPLOI_OPTIONS.map(opt => (
                      <OptionCard key={opt.value} selected={profile.emploi === opt.value}
                        onClick={() => update("emploi", opt.value as Profile["emploi"])}>
                        <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </OptionCard>
                    ))}
                  </div>
                </div>

                {/* Ancienneté */}
                <SliderField label="Ancienneté dans le poste" value={profile.anciennete} min={0} max={30} step={1}
                  format={v => v === 0 ? "< 1 an" : `${v} an${v > 1 ? "s" : ""}`} onChange={v => update("anciennete", v)} />
              </div>
            </div>
          )}

          {/* ── STEP 2: Revenus ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Vos revenus mensuels</h3>
              <p className="text-sm text-gray-500 mb-8">Indiquez vos revenus nets mensuels avant impôt.</p>

              <div className="space-y-8">
                <SliderField label="Vos revenus nets mensuels" value={profile.revenu} min={1000} max={15000} step={100}
                  format={formatEur} onChange={v => update("revenu", v)} />

                {profile.situation !== "celibataire" && (
                  <SliderField label="Revenus du co-emprunteur" value={profile.revenuCoEmprunteur}
                    min={0} max={15000} step={100} format={formatEur} color="text-emerald-600"
                    onChange={v => update("revenuCoEmprunteur", v)} />
                )}

                <SliderField label="Autres revenus" sublabel="locatifs, primes, pensions..."
                  value={profile.autresRevenus} min={0} max={5000} step={50} format={formatEur} color="text-gray-900"
                  onChange={v => update("autresRevenus", v)} />

                {/* Résumé revenus */}
                <div className="bg-white rounded-xl border border-bpce-200 p-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total des revenus mensuels</span>
                  <span className="text-xl font-extrabold text-bpce-600">{formatEur(result.revenuTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Charges ── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Vos charges mensuelles</h3>
              <p className="text-sm text-gray-500 mb-8">Crédits en cours et charges récurrentes qui impactent votre taux d'endettement.</p>

              <div className="space-y-8">
                <SliderField label="Crédits en cours" sublabel="auto, conso, étudiant..."
                  value={profile.autresCredits} min={0} max={3000} step={50} format={formatEur} color="text-red-500"
                  onChange={v => update("autresCredits", v)} />

                <SliderField label="Loyer actuel" sublabel="si vous êtes locataire"
                  value={profile.loyer} min={0} max={3000} step={50} format={formatEur} color="text-gray-900"
                  onChange={v => update("loyer", v)} />

                <SliderField label="Pension alimentaire versée" value={profile.pensionAlimentaire}
                  min={0} max={2000} step={50} format={formatEur} color="text-gray-900"
                  onChange={v => update("pensionAlimentaire", v)} />

                {/* Jauge d'endettement en temps réel */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-700">Taux d'endettement actuel</span>
                    <span className={`text-lg font-bold ${
                      result.tauxEndettement <= 25 ? "text-emerald-600" : result.tauxEndettement <= 35 ? "text-amber-500" : "text-red-500"
                    }`}>
                      {result.tauxEndettement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      result.tauxEndettement <= 25 ? "bg-emerald-500" : result.tauxEndettement <= 35 ? "bg-amber-400" : "bg-red-500"
                    }`} style={{ width: `${Math.min(100, (result.tauxEndettement / 50) * 100)}%` }} />
                    {/* Marker 35% */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-red-400" style={{ left: "70%" }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">0%</span>
                    <span className="text-red-400 font-semibold">35% HCSF</span>
                    <span className="text-gray-400">50%</span>
                  </div>
                  {result.tauxEndettement > 35 && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      Votre taux dépasse la limite HCSF. L'IA vous proposera des solutions concrètes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Projet ── */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Votre projet immobilier</h3>
              <p className="text-sm text-gray-500 mb-8">Décrivez le bien que vous souhaitez acquérir.</p>

              <div className="space-y-8">
                {/* Type de bien */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Type de bien</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BIEN_OPTIONS.map(opt => (
                      <OptionCard key={opt.value} selected={profile.typeBien === opt.value}
                        onClick={() => update("typeBien", opt.value as Profile["typeBien"])}>
                        <div className="text-center">
                          <span className="text-2xl block mb-1">{opt.icon}</span>
                          <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.desc}</p>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </div>

                {/* Localisation */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Zone géographique</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {LOCALISATION_OPTIONS.map(opt => (
                      <OptionCard key={opt.value} selected={profile.localisation === opt.value}
                        onClick={() => update("localisation", opt.value as Profile["localisation"])}>
                        <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
                      </OptionCard>
                    ))}
                  </div>
                </div>

                <SliderField label="Apport personnel" value={profile.apport} min={0} max={300000} step={1000}
                  format={formatEur} color="text-emerald-600" onChange={v => update("apport", v)} />

                <SliderField label="Durée souhaitée" value={profile.duree} min={5} max={27} step={1}
                  format={v => `${v} ans`} onChange={v => update("duree", v)} />

                {profile.duree > 25 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1 -mt-4">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    &gt;25 ans : uniquement pour le neuf ou travaux &gt;25% du coût
                  </p>
                )}

                <SliderField label="Taux d'intérêt estimé" value={profile.tauxInteret} min={1} max={7} step={0.1}
                  format={v => `${v.toFixed(1)}%`} color="text-gray-900" onChange={v => update("tauxInteret", v)} />
              </div>
            </div>
          )}

          {/* ── STEP 5: Résultats ── */}
          {step === 5 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Votre diagnostic complet</h3>
              <p className="text-sm text-gray-500 mb-8">Résultats basés sur votre profil et analyse personnalisée par IA.</p>

              {/* Cards résumé */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {/* Score */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Score</p>
                  <p className={`text-4xl font-extrabold ${getScoreColor(result.score)}`}>{result.score}</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3 mb-2">
                    <div className={`h-full rounded-full ${getScoreBg(result.score)} transition-all duration-700`}
                      style={{ width: `${result.score}%` }} />
                  </div>
                  <p className={`text-xs font-semibold ${getScoreColor(result.score)}`}>{getScoreLabel(result.score)}</p>
                </div>

                {/* Budget */}
                <div className="bg-bpce-600 rounded-xl p-5 text-white text-center">
                  <p className="text-xs font-semibold text-bpce-200 uppercase tracking-wide mb-2">Budget total</p>
                  <p className="text-3xl font-extrabold">{formatEur(result.budgetTotal)}</p>
                  <p className="text-bpce-200 text-xs mt-2">
                    Prêt {formatEur(result.capaciteEmprunt)} + Apport {formatEur(profile.apport)}
                  </p>
                </div>

                {/* Mensualité */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Mensualité max</p>
                  <p className="text-3xl font-extrabold text-gray-900">
                    {result.maxMensualite > 0 ? formatEur(result.maxMensualite) : "0 EUR"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Endettement : {result.tauxEndettement.toFixed(1)}% / 35%
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  result.hcsfOk ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {result.hcsfOk ? "✓" : "⚠"} {result.hcsfOk ? "Conforme HCSF" : "Hors normes HCSF"}
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  profile.emploi === "cdi" || profile.emploi === "fonctionnaire"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {EMPLOI_OPTIONS.find(e => e.value === profile.emploi)?.label}
                </div>
                <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-bpce-50 text-bpce-700 border border-bpce-200">
                  {profile.duree} ans · {profile.tauxInteret.toFixed(1)}%
                </div>
                {profile.apport > 0 && (
                  <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Apport : {formatEur(profile.apport)}
                  </div>
                )}
              </div>

              {/* Analyse IA */}
              <div className="rounded-2xl border-2 border-bpce-200 bg-white overflow-hidden">
                <div className="p-5 border-b border-bpce-100" style={{ background: "linear-gradient(to right, #F5F0FA, #FFF7ED)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-bpce-600 flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/>
                        <path d="M18 14a6 6 0 00-12 0v4a2 2 0 002 2h8a2 2 0 002-2v-4z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">Analyse personnalisée par IA</h4>
                      <p className="text-xs text-gray-500">Recommandations adaptées à votre profil et votre projet</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {aiLoading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <div className="w-12 h-12 rounded-full border-4 border-bpce-200 border-t-bpce-600 animate-spin" />
                      <p className="text-sm text-gray-500 font-medium">Notre IA analyse votre dossier complet...</p>
                      <p className="text-xs text-gray-400">Profil, revenus, charges et projet pris en compte</p>
                    </div>
                  )}

                  {aiError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                      <p className="text-sm text-red-600 font-medium">{aiError}</p>
                      <button onClick={fetchAnalyse} className="mt-3 text-sm text-red-500 underline hover:text-red-700">Réessayer</button>
                    </div>
                  )}

                  {aiAnalyse && !aiLoading && (
                    <div className="prose-sm max-w-none">{renderMarkdown(aiAnalyse)}</div>
                  )}
                </div>

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
                      Obtenir mon Passeport de Crédit complet
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 5 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={!canPrev}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                canPrev ? "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50" : "text-gray-300 cursor-not-allowed"
              }`}
            >
              Précédent
            </button>

            <span className="text-xs text-gray-400">Étape {step} / {STEPS.length}</span>

            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-bpce-600 hover:bg-bpce-700 transition-all shadow-sm"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={goToResults}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg"
                style={{ background: "linear-gradient(to right, #6B2D8B, #EF4444)" }}
              >
                Analyser mon dossier
              </button>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Modifier mes informations
            </button>
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
