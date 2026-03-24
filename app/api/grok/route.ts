import { NextResponse } from "next/server";

// ── Choisir le provider IA ──────────────────────────────────────────────────
// "groq"   → Llama 3.3 70B via Groq       (groq.com)
// "gemini" → Gemini 2.0 Flash via Google  (ai.google.dev)
const AI_PROVIDER: "groq" | "gemini" = "groq";
// ───────────────────────────────────────────────────────────────────────────

const PROVIDERS = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile",
    apiKey: () => process.env.GROQ_API_KEY,
  },
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-1.5-flash",
    apiKey: () => process.env.GEMINI_API_KEY,
  },
};

interface SimulatorContext {
  revenu: number;
  autresCredits: number;
  apport: number;
  duree: number;
  tauxInteret: number;
  score: number;
  tauxEndettement: number;
  budgetTotal: number;
  capaciteEmprunt: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const provider = PROVIDERS[AI_PROVIDER];
  const apiKey = provider.apiKey();

  if (!apiKey) {
    return NextResponse.json({ error: "Clé API non configurée." }, { status: 500 });
  }

  const { messages, simulatorContext }: { messages: Message[]; simulatorContext: SimulatorContext } =
    await request.json();

  const formatEur = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  const systemPrompt = `Tu es un conseiller expert en crédit immobilier, spécialisé dans les normes HCSF 2024 françaises.
Tu travailles pour Loan Coach et aides les utilisateurs à débloquer leur dossier de prêt immobilier.

Situation actuelle du simulateur de l'utilisateur :
- Revenus nets mensuels : ${formatEur(simulatorContext.revenu)}
- Autres crédits en cours : ${formatEur(simulatorContext.autresCredits)}/mois
- Apport personnel : ${formatEur(simulatorContext.apport)}
- Durée souhaitée : ${simulatorContext.duree} ans
- Taux d'intérêt estimé : ${simulatorContext.tauxInteret}%
- Score Loan Coach : ${simulatorContext.score}/100
- Taux d'endettement actuel : ${simulatorContext.tauxEndettement.toFixed(1)}% (limite HCSF : 35%)
- Capacité d'emprunt calculée : ${formatEur(simulatorContext.capaciteEmprunt)}
- Budget total d'achat : ${formatEur(simulatorContext.budgetTotal)}

Règles de réponse :
- Réponds TOUJOURS en français
- Sois concis, chaleureux et actionnable (max 4-5 phrases par réponse)
- Donne des conseils chiffrés et précis basés sur les données du simulateur
- Tu peux utiliser des emojis avec parcimonie pour rendre la réponse lisible
- Si l'utilisateur pose une question hors sujet crédit immobilier, ramène-le poliment au sujet`;

  const response = await fetch(provider.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[${AI_PROVIDER}] API error ${response.status}:`, error);
    return NextResponse.json({ error: `Erreur API ${AI_PROVIDER} (${response.status}): ${error}` }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({ message: data.choices[0].message.content });
}
