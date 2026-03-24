"use client";
import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="cta" className="py-24 section-dark text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">
            Accès en avant-première
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
          Votre clé de propriété
          <br />
          <span className="gradient-text-green">vous attend.</span>
        </h2>

        <p className="text-xl text-bpce-100/70 mb-10 max-w-2xl mx-auto leading-relaxed">
          Rejoignez la liste d'attente et soyez parmi les premiers à accéder à Loan Coach.
          Analyse gratuite de votre profil garantie dès l'ouverture.
        </p>

        {/* Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              required
              className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all text-sm"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-white text-bpce-700 font-bold rounded-xl hover:bg-bpce-50 transition-all shadow-lg text-sm whitespace-nowrap"
            >
              Rejoindre la liste
            </button>
          </form>
        ) : (
          <div className="max-w-md mx-auto mb-8 p-5 bg-emerald-500/20 rounded-2xl border border-emerald-400/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Inscription confirmée !</p>
              <p className="text-emerald-300 text-sm">Vous serez notifié(e) en priorité à l'ouverture.</p>
            </div>
          </div>
        )}

        <p className="text-sm text-white/40 mb-16">
          Aucune carte bancaire requise. Désabonnement en 1 clic.
        </p>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-12">
          {[
            { value: "5 min", label: "Pour analyser votre profil" },
            { value: "90j", label: "Durée moyenne avant prêt" },
            { value: "100%", label: "Conforme HCSF 2024" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-extrabold text-white mb-1">{s.value}</p>
              <p className="text-sm text-bpce-100/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
