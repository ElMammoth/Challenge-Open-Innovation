import { NextResponse } from "next/server";

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
  const apiKey = process.env.XAI_API_KEY;
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

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Grok API error:", error);
    return NextResponse.json({ error: "Erreur lors de la communication avec Grok." }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({ message: data.choices[0].message.content });
}
