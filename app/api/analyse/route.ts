export async function POST(request: Request) {
  const body = await request.json();

  const situationLabel: Record<string, string> = {
    celibataire: "Célibataire",
    couple: "En couple",
    famille: "Famille avec enfants",
  };
  const emploiLabel: Record<string, string> = {
    cdi: "CDI",
    cdd: "CDD / Intérim",
    independant: "Indépendant",
    fonctionnaire: "Fonctionnaire",
  };
  const bienLabel: Record<string, string> = {
    ancien: "Bien ancien",
    neuf: "Bien neuf / VEFA",
    construction: "Construction",
    travaux: "Ancien avec travaux",
  };
  const locLabel: Record<string, string> = {
    paris: "Paris intra-muros",
    idf: "Île-de-France",
    grande_ville: "Grande ville",
    moyen: "Ville moyenne",
    rural: "Zone rurale",
  };

  const prompt = `Tu es un expert en crédit immobilier français, spécialisé dans les normes HCSF. Voici le profil complet d'un utilisateur :

**PROFIL PERSONNEL**
- Âge : ${body.age} ans
- Situation : ${situationLabel[body.situation] || body.situation}
- Emploi : ${emploiLabel[body.emploi] || body.emploi}
- Ancienneté : ${body.anciennete} an(s)

**REVENUS & CHARGES**
- Revenus totaux : ${body.revenu} EUR/mois
- Crédits en cours : ${body.autresCredits} EUR/mois
- Loyer actuel : ${body.loyer} EUR/mois

**PROJET IMMOBILIER**
- Type de bien : ${bienLabel[body.typeBien] || body.typeBien}
- Zone : ${locLabel[body.localisation] || body.localisation}
- Apport personnel : ${body.apport} EUR
- Durée souhaitée : ${body.duree} ans
- Taux estimé : ${body.tauxInteret}%

**RÉSULTATS CALCULÉS**
- Capacité d'emprunt : ${body.capaciteEmprunt} EUR
- Budget total : ${body.budgetTotal} EUR
- Taux d'endettement : ${body.tauxEndettement}%
- Score de financement : ${body.score}/100

Fais une analyse complète et personnalisée. Structure ta réponse EXACTEMENT ainsi :

## Diagnostic de votre dossier
Un paragraphe qui résume les points forts et les points faibles du dossier, en étant honnête mais encourageant.

## Ce que la banque va regarder
3-4 points clés que le banquier va évaluer dans CE dossier précis, avec des chiffres concrets.

## Plan d'action concret
Des actions numérotées, chiffrées et adaptées à SA situation. Pour chaque action, explique l'impact précis sur son dossier (ex: "cela ferait passer votre taux de X% à Y%").

## Stratégie recommandée
Un résumé en 3-4 phrases de la meilleure approche globale, avec un ordre de priorité clair.

RÈGLES :
- Sois clair, simple et vulgarisé (pas de jargon bancaire inutile)
- Utilise SES chiffres pour donner des exemples concrets
- Sois bienveillant et encourageant
- Si le dossier est bon, dis-le et donne des conseils pour optimiser
- Si le dossier est fragile, propose de vraies solutions réalistes
- Maximum 700 mots
- Réponds en français`;

  const apiKey = process.env.GROK_API;

  if (!apiKey) {
    return Response.json({ error: "Clé API manquante" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Tu es un conseiller expert en crédit immobilier français. Tu vulgarises les concepts financiers pour les rendre accessibles à tous. Tu donnes des conseils concrets, chiffrés et personnalisés." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `Erreur API: ${res.status}`, details: errText }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "Aucune analyse disponible.";

    return Response.json({ analyse: content });
  } catch {
    return Response.json({ error: "Erreur de connexion à l'API" }, { status: 500 });
  }
}
