export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(to bottom right,#6B2D8B,#431B5C)"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-bold text-lg text-white">
                Loan<span className="text-bpce-400">Coach</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-4">
              L'infrastructure technologique qui sécurise votre parcours de crédit immobilier, de l'anticipation au prêt signé.
            </p>
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-bpce-600/10 border border-bpce-600/20 text-xs font-semibold text-bpce-400">
                Conforme DSP2
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-xs font-semibold text-emerald-400">
                RGPD
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-violet-600/10 border border-violet-600/20 text-xs font-semibold text-violet-400">
                HCSF 2024
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Produit</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[
                { href: "#comment-ca-marche", label: "Comment ça marche" },
                { href: "#fonctionnalites", label: "Fonctionnalités" },
                { href: "#simulateur", label: "Simulateur HCSF" },
                { href: "#tarifs", label: "Tarifs" },
                { href: "#faq", label: "FAQ" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Légal</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[
                "Mentions légales",
                "Politique de confidentialité",
                "CGU",
                "Cookies",
                "Contact",
              ].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2024 Loan Coach. Tous droits réservés.</p>
          <p>
            Loan Coach n'est pas un établissement de crédit. Service d'aide à la décision uniquement.
          </p>
        </div>
      </div>
    </footer>
  );
}
