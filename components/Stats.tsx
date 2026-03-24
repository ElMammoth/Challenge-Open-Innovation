"use client";

const stats = [
  {
    value: "45%",
    label: "des dossiers refusés",
    sub: "en 2024 en France",
    color: "text-red-500",
    bg: "bg-red-50",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    value: "3,2M",
    label: "primo-accédants potentiels",
    sub: "en attente d'accès",
    color: "text-bpce-600",
    bg: "bg-bpce-50",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B2D8B" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    value: "35%",
    label: "taux d'endettement max",
    sub: "norme HCSF obligatoire",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    value: "90j",
    label: "pour redevenir finançable",
    sub: "avec notre feuille de route",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

export default function Stats() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-bpce-600 uppercase tracking-widest mb-2">
            Le contexte en chiffres
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            Le crédit immobilier en France : un parcours du combattant
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <div
              key={i}
              className="card-hover bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-3"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                {s.icon}
              </div>
              <div>
                <p className={`text-4xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Sources : Banque de France, HCSF, ACPR — données 2024
        </p>
      </div>
    </section>
  );
}
