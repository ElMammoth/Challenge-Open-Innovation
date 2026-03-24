"use client";
import { useState } from "react";

const faqs = [
  {
    q: "Qu'est-ce que le Passeport de Crédit Loan Coach ?",
    a: "Le Passeport de Crédit est un document certifié généré après une analyse complète de votre dossier selon les normes HCSF. Il atteste que votre profil a été pré-audité et que votre taux d'endettement, votre durée de prêt et votre reste à vivre sont conformes aux exigences réglementaires. Il inclut un QR code de vérification que les banques peuvent scanner pour confirmer son authenticité. C'est un signal fort qui distingue votre dossier de ceux non préparés.",
  },
  {
    q: "Comment fonctionne la connexion Open Banking ? Est-ce sécurisé ?",
    a: "Nous utilisons le protocole DSP2 (Directive Européenne sur les Services de Paiement) qui vous permet d'autoriser un accès en lecture seule à vos comptes bancaires. Cela signifie que nous pouvons lire votre historique de transactions mais ne pouvons jamais effectuer de virements. Toutes les données sont chiffrées avec AES-256 et vous pouvez révoquer cet accès à tout moment depuis l'application. Aucun mot de passe bancaire n'est stocké sur nos serveurs.",
  },
  {
    q: "Que se passe-t-il si mon taux d'endettement dépasse 35% ?",
    a: "Un taux d'endettement supérieur à 35% signifie que votre dossier ne peut pas être accepté en standard. Cependant, les banques disposent d'une marge de flexibilité de 20% de leurs dossiers, prioritairement réservée aux primo-accédants. Notre système analyse si vous pouvez bénéficier de cette dérogation et simule les scénarios pour revenir sous le seuil : rachat de crédit, apport supplémentaire, rallongement de durée (dans la limite HCSF), ou attente d'amortissement de crédits existants.",
  },
  {
    q: "Loan Coach peut-il garantir l'obtention de mon prêt ?",
    a: "Non, et aucun outil ne peut le faire de façon légitime. Loan Coach est un outil d'aide à la décision qui optimise votre dossier et maximise vos chances, mais la décision finale appartient toujours à la banque. Ce que nous garantissons : une analyse rigoureuse de votre profil, une feuille de route datée basée sur les normes HCSF, et un dossier pré-audité qui élimine les refus préventifs liés à des erreurs de préparation.",
  },
  {
    q: "Je suis freelance ou indépendant. Loan Coach est-il adapté à mon profil ?",
    a: "Absolument. C'est même l'un des points forts de notre algorithme. Les banques appliquent souvent des coefficients pénalisants aux revenus variables. Notre système analyse la régularité et la dynamique de vos revenus sur 24 mois pour construire un argumentaire adapté. Nous valorisons les tendances croissantes, la diversification des clients et la stabilité sectorielle pour présenter votre profil sous le meilleur angle possible.",
  },
  {
    q: "Combien de temps faut-il pour redevenir finançable après un refus ?",
    a: "En moyenne, nos utilisateurs atteignent les seuils HCSF en 90 jours avec notre feuille de route. Ce délai varie selon la nature du blocage : un crédit renouvelable actif peut être clôturé en quelques semaines, tandis qu'améliorer un reste à vivre insuffisant peut demander 3 à 6 mois d'épargne régulière. Notre algorithme calcule la date précise de votre retour à la solvabilité selon le scénario que vous choisissez.",
  },
  {
    q: "Mes données sont-elles partagées avec les banques sans mon accord ?",
    a: "Non. Vos données financières ne sont jamais partagées avec des tiers sans votre consentement explicite. Le Passeport de Crédit que vous générez est un document que vous choisissez de présenter ou non à votre banque. Nous ne vendons pas de données et ne sommes pas un courtier. Vous gardez le contrôle total de votre information à chaque étape.",
  },
  {
    q: "Quelle est la différence entre Loan Coach et un courtier immobilier ?",
    a: "Un courtier négocie les taux auprès des banques après que votre dossier est prêt. Loan Coach intervient en amont : nous préparons, optimisons et certifions votre dossier pour qu'il soit irréprochable avant même d'entrer chez un courtier ou en banque. Les deux approches sont complémentaires. Certains de nos clients Premium bénéficient d'une mise en relation directe avec des conseillers IOBSP certifiés pour combiner les deux.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-bpce-600 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-gray-500">
            Tout ce que vous devez savoir avant de vous lancer.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                  open === i ? "bg-bpce-600" : "bg-white border border-gray-200"
                }`}>
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={open === i ? "white" : "#6B7280"}
                    strokeWidth="2.5"
                    className={`transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </button>

              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 text-center p-6 bg-bpce-50 rounded-2xl border border-bpce-100">
          <p className="text-sm font-semibold text-gray-900 mb-1">Vous n'avez pas trouvé votre réponse ?</p>
          <p className="text-sm text-gray-500 mb-4">Notre équipe répond en moins de 24h.</p>
          <a
            href="mailto:contact@loancoach.fr"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-bpce-600 text-white font-semibold rounded-xl text-sm hover:bg-bpce-700 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
}
