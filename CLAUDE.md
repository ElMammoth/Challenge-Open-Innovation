@AGENTS.md

# Loan Coach — Documentation du projet

## Présentation

Loan Coach est une application web qui aide les primo-accédants à comprendre leur capacité d'emprunt immobilier selon les normes HCSF (Haut Conseil de Stabilité Financière) et à obtenir des recommandations personnalisées par IA pour débloquer leur crédit.

## Stack technique

- **Framework** : Next.js 16.2.1 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4 avec thème custom BPCE (violet)
- **IA** : Google Gemini 2.5 Flash (API gratuite via AI Studio)
- **Fonts** : Inter (Google Fonts)
- **Icons** : Lucide React + SVG inline

## Commande de dev

```bash
npm run dev
```

> Le flag `--webpack` est nécessaire car Turbopack ne fonctionne pas sur macOS Apple Silicon (M1/M2/M3). Il est configuré dans `package.json`.

## Architecture du projet

```
app/
├── api/
│   └── analyse/
│       └── route.ts          # API Route → appelle Gemini 2.5 Flash
├── globals.css               # Styles globaux + thème BPCE + utilitaires CSS
├── layout.tsx                # Layout racine (Inter font, metadata)
├── page.tsx                  # Page d'accueil (assemblage des sections)
└── favicon.ico

components/
├── Header.tsx                # Navbar fixe avec navigation + CTA
├── Hero.tsx                  # Section héros avec headline + CTA
├── Stats.tsx                 # Chiffres clés
├── Parcours.tsx              # Parcours utilisateur
├── HowItWorks.tsx            # Explication du fonctionnement
├── Features.tsx              # Fonctionnalités de la plateforme
├── HCSFExplainer.tsx         # Explication des normes HCSF
├── Simulator.tsx             # Simulateur multi-étapes (composant principal)
├── Pricing.tsx               # Page tarifs (retirée de la page principale)
├── FAQ.tsx                   # Questions fréquentes
├── CTA.tsx                   # Call-to-action final (liste d'attente email)
└── Footer.tsx                # Pied de page
```

## Le simulateur (composant principal)

Le simulateur (`components/Simulator.tsx`) est un parcours guidé en 5 étapes :

1. **Profil** — Âge, situation familiale (célibataire/couple/famille), type d'emploi (CDI/CDD/indépendant/fonctionnaire), ancienneté
2. **Revenus** — Revenus nets mensuels, revenus du co-emprunteur (si couple/famille), autres revenus (locatifs, primes...)
3. **Charges** — Crédits en cours, loyer actuel, pension alimentaire + jauge d'endettement en temps réel avec seuil HCSF 35%
4. **Projet** — Type de bien (ancien/neuf/construction/travaux), zone géographique, apport personnel, durée, taux d'intérêt
5. **Résultats** — Score de financement /100, budget total, mensualité max, badges de conformité HCSF, puis analyse IA complète

### Calcul du score

Le score sur 100 prend en compte :
- Marge par rapport au seuil HCSF de 35% (35 pts)
- Ratio apport / budget total (20 pts)
- Conformité HCSF durée + endettement (15 pts)
- Stabilité emploi CDI/fonctionnaire (10 pts) + ancienneté >= 2 ans (5 pts)
- Apport >= 10% du budget (10 pts)
- Tranche d'âge 25-45 ans (5 pts)

## API Route : `/api/analyse`

**Fichier** : `app/api/analyse/route.ts`

- Reçoit en POST toutes les données du profil utilisateur
- Construit un prompt structuré avec le profil complet (personnel, revenus, charges, projet, résultats calculés)
- Appelle l'API **Google Gemini 2.5 Flash** (`generativelanguage.googleapis.com`)
- Demande une réponse structurée en 4 sections : Diagnostic, Ce que la banque regarde, Plan d'action concret, Stratégie recommandée
- Gère le `thinkingBudget` de Gemini 2.5 Flash (1024 tokens de réflexion) et filtre les parties "thinking" de la réponse
- `maxOutputTokens: 8192` pour garantir une réponse complète

## Variables d'environnement

Fichier `.env.local` (non commité, dans `.gitignore`) :

```
GEMINI_API_KEY=<clé API Google AI Studio>
```

**Secret GitHub** (pour le déploiement) :
- Nom : `GEMINI_API_KEY`
- Valeur : la même clé API

## Branches

- **`main`** — Version stable de base
- **`cyprien`** — Branche de travail de Cyprien : simulateur multi-étapes + Gemini 2.5 Flash + suppression Pricing
- **`Eliott`** — Branche de travail d'Eliott : version avec chat bot IA conversationnel (endpoint `/api/grok`)

## Thème CSS (BPCE)

Le thème utilise une palette violette définie dans `globals.css` :
- Couleur primaire : `#6B2D8B` (bpce-600)
- Couleur foncée : `#4A1870` (primary)
- Toutes les variantes de 50 à 950 sont définies comme classes utilitaires CSS forcées (`.bg-bpce-600`, `.text-bpce-600`, etc.)

## Historique des décisions

1. **Suppression de Pricing** — La section tarifs a été retirée de la page principale car non pertinente pour le MVP
2. **Migration Groq → Gemini** — Initialement sur Groq (Llama 3.3 70B), migré vers Gemini 2.5 Flash pour la qualité et la gratuité
3. **Simulateur multi-étapes** — Le simulateur initial (curseurs + résultats côte à côte) a été remplacé par un parcours guidé en 5 étapes pour une meilleure UX et collecter plus de données de profil
4. **Webpack obligatoire** — Turbopack crash sur macOS ARM, donc `next dev --webpack` est forcé dans le script dev
5. **Rendu structuré de l'IA** — L'analyse IA est affichée en cartes colorées par section (diagnostic, banque, plan d'action, stratégie) avec des icônes et gradients dédiés

## Prochaines étapes prévues

- Intégrer le chat bot conversationnel de la branche Eliott dans la branche Cyprien
- Éventuellement fusionner les branches vers main
