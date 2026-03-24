export async function POST(request: Request) {
  const { revenu, autresCredits, apport, duree, tauxInteret, capaciteEmprunt, budgetTotal, tauxEndettement, score } =
    await request.json();

  const prompt = `Tu es un expert en crédit immobilier français, spécialisé dans les normes HCSF. Un utilisateur a le profil suivant :

- Revenus nets mensuels : ${revenu} EUR
- Crédits en cours : ${autresCredits} EUR/mois
- Apport personnel : ${apport} EUR
- Durée souhaitée : ${duree} ans
- Taux d'intérêt estimé : ${tauxInteret}%
- Capacité d'emprunt calculée : ${capaciteEmprunt} EUR
- Budget total : ${budgetTotal} EUR
- Taux d'endettement actuel : ${tauxEndettement}%
- Score de financement : ${score}/100

Son dossier est actuellement fragile ou hors normes HCSF. Donne-lui une analyse personnalisée et concrète pour débloquer son crédit immobilier.

REGLES :
- Sois clair, simple et vulgarisé (pas de jargon bancaire inutile)
- Donne des actions concrètes et chiffrées basées sur SES chiffres
- Structure ta réponse en sections avec des titres courts
- Pour chaque solution, explique l'impact concret sur son dossier
- Termine par un résumé en 2-3 phrases de la stratégie globale recommandée
- Réponds en français
- Utilise un ton bienveillant et encourageant, pas alarmiste
- Maximum 600 mots`;

  const apiKey = process.env.GROK_API;

  if (!apiKey) {
    return Response.json({ error: "Clé API manquante" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages: [
          { role: "system", content: "Tu es un conseiller expert en crédit immobilier français. Tu vulgarises les concepts financiers pour les rendre accessibles à tous." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `Erreur API Grok: ${res.status}`, details: errText }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "Aucune analyse disponible.";

    return Response.json({ analyse: content });
  } catch (err) {
    return Response.json({ error: "Erreur de connexion à l'API" }, { status: 500 });
  }
}
