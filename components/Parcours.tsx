"use client";
import { useState } from "react";

export default function Parcours() {
  const [active, setActive] = useState<"anticiper" | "rebondir">("anticiper");

  const paths = {
    anticiper: {
      badge: "Je n'ai pas encore déposé mon dossier",
      title: "Anticipez. Maximisez vos chances.",
      subtitle: "Avant même d'entrer en banque, Loan Coach scanne votre profil financier et vous dit exactement ce qu'une banque va voir, et ce qu'il faut améliorer.",
      steps: [
        {
          icon: "🔗",
          title: "Connexion Open Banking",
          desc: "Connectez votre compte bancaire en toute sécurité. Notre système analyse vos 12 derniers mois en quelques secondes.",
        },
        {
          icon: "📊",
          title: "Scoring HCSF automatique",
          desc: "Calcul instantané de votre taux d'endettement, reste à vivre et capacité d'emprunt selon les normes HCSF 2024.",
        },
        {
          icon: "🎯",
          title: "Optimisation du dossier",
          desc: "Notre algorithme identifie vos points faibles et vous donne des recommandations concrètes pour maximiser votre dossier.",
        },
        {
          icon: "🛂",
          title: "Passeport de Crédit",
          desc: "Générez un document certifié pré-audité qui rassure immédiatement la banque sur votre solvabilité.",
        },
      ],
      cta: "Analyser mon profil",
      ctaColor: "bg-bpce-600 hover:bg-bpce-700 shadow-bpce-200",
    },
    rebondir: {
      badge: "Mon dossier vient d'être refusé",
      title: "Comprenez. Rebondissez rapidement.",
      subtitle: "Un refus n'est pas une condamnation. Loan Coach décode les vraies raisons de votre refus, souvent invisibles, et trace la route la plus courte vers une réponse positive.",
      steps: [
        {
          icon: "🔍",
          title: "Diagnostic de refus",
          desc: "Notre algorithme identifie les vrais motifs de blocage : taux d'endettement, comportement de compte, historique de crédit.",
        },
        {
          icon: "🛠",
          title: "Scénarios de remise en forme",
          desc: "Simulation de plusieurs chemins : épargne, lissage de dépenses, restructuration de crédits, avec une date précise.",
        },
        {
          icon: "📅",
          title: "Feuille de route sur 90 jours",
          desc: "Un plan personnalisé semaine par semaine pour atteindre les seuils HCSF et redevenir finançable à une date certaine.",
        },
        {
          icon: "🛂",
          title: "Nouveau dépôt certifié",
          desc: "Une fois le profil stabilisé, générez un Passeport de Crédit renforcé pour repartir avec le maximum d'atouts.",
        },
      ],
      cta: "Comprendre mon refus",
      ctaColor: "bg-gray-900 hover:bg-gray-800 shadow-gray-200",
    },
  };

  const current = paths[active];

  return (
    <section id="parcours" className="py-24 bg-[#F8FAFF]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-bpce-600 uppercase tracking-widest mb-3">
            Deux parcours, une seule solution
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Loan Coach s'adapte à votre situation
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Que vous prépariez votre premier achat ou que vous veniez d'essuyer un refus, le parcours est pensé pour vous.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-1.5 flex gap-1 shadow-sm">
            <button
              onClick={() => setActive("anticiper")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                active === "anticiper"
                  ? "bg-bpce-600 text-white shadow-md shadow-bpce-200"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              J'anticipe mon achat
            </button>
            <button
              onClick={() => setActive("rebondir")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                active === "rebondir"
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              J'ai été refusé(e)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bpce-50 border border-bpce-100 mb-6">
              <span className="text-xs font-semibold text-bpce-700">{current.badge}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">{current.title}</h3>
            <p className="text-gray-500 text-base mb-10 max-w-2xl">{current.subtitle}</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {current.steps.map((step, i) => (
                <div key={i} className="relative">
                  {i < current.steps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-[calc(100%+8px)] w-[calc(100%-16px)] h-px bg-gray-100 z-0" />
                  )}
                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
                      {step.icon}
                    </div>
                    <div className="w-5 h-5 rounded-full bg-bpce-600 flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{step.title}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="#simulateur"
                className={`inline-flex items-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-all shadow-lg ${current.ctaColor}`}
              >
                {current.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
