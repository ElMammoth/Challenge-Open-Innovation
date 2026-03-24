"use client";
import { useState, useMemo, useRef, useEffect } from "react";

function formatEur(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Simulator() {
  const [revenu, setRevenu] = useState(3500);
  const [autresCredits, setAutresCredits] = useState(0);
  const [apport, setApport] = useState(30000);
  const [duree, setDuree] = useState(20);
  const [tauxInteret, setTauxInteret] = useState(3.5);

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  const result = useMemo(() => {
    const tauxMensuel = tauxInteret / 100 / 12;
    const nbMois = duree * 12;
    const maxMensualite = revenu * 0.35 - autresCredits;
    const capaciteEmprunt = maxMensualite > 0
      ? (maxMensualite * (1 - Math.pow(1 + tauxMensuel, -nbMois))) / tauxMensuel
      : 0;
    const budgetTotal = Math.max(0, capaciteEmprunt + apport);
    const tauxEndettementActuel = autresCredits / revenu * 100;
    const hcsfOk = tauxEndettementActuel <= 35 && duree <= 25;
    const margePct = Math.max(0, 35 - tauxEndettementActuel);
    const scoreRaw = Math.min(100, Math.max(0,
      (margePct / 35) * 40 +
      (apport / (budgetTotal || 1)) * 30 * 10 +
      (hcsfOk ? 30 : 0)
    ));
    const score = Math.round(Math.min(100, scoreRaw));
    const isProblematic = tauxEndettementActuel > 35 || score < 45;

    return { maxMensualite, capaciteEmprunt, budgetTotal, tauxEndettementActuel, hcsfOk, score, margePct, isProblematic };
  }, [revenu, autresCredits, apport, duree, tauxInteret]);

  const getSimulatorContext = () => ({
    revenu,
    autresCredits,
    apport,
    duree,
    tauxInteret,
    score: result.score,
    tauxEndettement: result.tauxEndettementActuel,
    budgetTotal: result.budgetTotal,
    capaciteEmprunt: result.capaciteEmprunt,
  });

  const callGrok = async (msgs: Message[]) => {
    const response = await fetch("/api/grok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs, simulatorContext: getSimulatorContext() }),
    });
    if (!response.ok) throw new Error("Erreur API");
    const data = await response.json();
    return data.message as string;
  };

  const openChat = async () => {
    if (showChat) {
      setShowChat(false);
      return;
    }
    setShowChat(true);
    if (messages.length === 0) {
      setIsLoading(true);
      try {
        const initial: Message[] = [
          { role: "user", content: "Analyse ma situation et explique-moi comment obtenir mon crédit immobilier. Donne-moi les actions prioritaires." },
        ];
        const reply = await callGrok(initial);
        setMessages([{ role: "assistant", content: reply }]);
      } catch {
        setMessages([{ role: "assistant", content: "Bonjour ! Je suis votre conseiller IA Loan AI. Posez-moi vos questions sur votre dossier de crédit immobilier." }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const content = inputMessage.trim();
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);
    try {
      const reply = await callGrok(newMessages);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Une erreur est survenue. Veuillez réessayer." }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getScoreColor = (s: number) =>
    s >= 70 ? "text-emerald-600" : s >= 45 ? "text-amber-600" : "text-red-500";
  const getScoreLabel = (s: number) =>
    s >= 70 ? "Dossier solide" : s >= 45 ? "Dossier perfectible" : "Dossier fragile";
  const getScoreBg = (s: number) =>
    s >= 70 ? "from-emerald-500 to-bpce-500" : s >= 45 ? "from-amber-400 to-orange-500" : "from-red-500 to-rose-500";

  const getEndettementStatus = () => {
    const t = result.tauxEndettementActuel;
    if (t === 0) return { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", label: "Aucun crédit actif, excellent" };
    if (t <= 25) return { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", label: "Taux confortable, bien positionné" };
    if (t <= 35) return { color: "text-amber-600", bg: "bg-amber-50 border-amber-100", label: "Proche de la limite HCSF, attention" };
    return { color: "text-red-600", bg: "bg-red-50 border-red-100", label: "Dépasse la limite HCSF de 35%" };
  };

  const endettementStatus = getEndettementStatus();
  const totalTaux = autresCredits > 0 ? result.tauxEndettementActuel : 0;

  return (
    <section id="simulateur" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-bpce-600 uppercase tracking-widest mb-3">
            Loan AI
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Calculez votre capacité d'emprunt en temps réel
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Ajustez les curseurs et découvrez instantanément ce que la banque va calculer selon les normes HCSF 2024.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left — Inputs */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Votre situation financière</h3>

            <div className="flex flex-col gap-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Revenus nets mensuels</label>
                  <span className="text-lg font-bold text-bpce-600">{formatEur(revenu)}</span>
                </div>
                <input type="range" min={1000} max={15000} step={100} value={revenu}
                  onChange={e => setRevenu(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 000 €</span><span>15 000 €</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Autres crédits en cours
                    <span className="ml-1 text-xs font-normal text-gray-400">(auto, conso, étudiant...)</span>
                  </label>
                  <span className="text-lg font-bold text-gray-900">{formatEur(autresCredits)}</span>
                </div>
                <input type="range" min={0} max={2000} step={50} value={autresCredits}
                  onChange={e => setAutresCredits(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 €</span><span>2 000 €</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Apport personnel</label>
                  <span className="text-lg font-bold text-emerald-600">{formatEur(apport)}</span>
                </div>
                <input type="range" min={0} max={200000} step={1000} value={apport}
                  onChange={e => setApport(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 €</span><span>200 000 €</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Durée du prêt</label>
                  <span className="text-lg font-bold text-gray-900">{duree} ans</span>
                </div>
                <input type="range" min={5} max={27} step={1} value={duree}
                  onChange={e => setDuree(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5 ans</span><span>27 ans</span>
                </div>
                {duree > 25 && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Uniquement pour achat dans le neuf ou travaux représentant plus de 25% du coût
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Taux d'intérêt estimé</label>
                  <span className="text-lg font-bold text-gray-900">{tauxInteret.toFixed(1)}%</span>
                </div>
                <input type="range" min={1} max={7} step={0.1} value={tauxInteret}
                  onChange={e => setTauxInteret(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1%</span><span>7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Results */}
          <div className="flex flex-col gap-4">
            {/* Score */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Score Loan AI</p>
              <div className="flex items-end gap-3 mb-3">
                <span className={`text-5xl font-extrabold ${getScoreColor(result.score)}`}>{result.score}</span>
                <span className="text-gray-400 text-sm mb-2">/ 100</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getScoreBg(result.score)} transition-all duration-500`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <p className={`text-sm font-semibold ${getScoreColor(result.score)}`}>
                {getScoreLabel(result.score)}
              </p>
            </div>

            {/* Budget total */}
            <div className="bg-bpce-600 rounded-2xl p-6 text-white">
              <p className="text-xs font-semibold text-bpce-200 uppercase tracking-wide mb-1">Budget total d'achat</p>
              <p className="text-4xl font-extrabold">{formatEur(result.budgetTotal)}</p>
              <p className="text-bpce-200 text-sm mt-1">
                Prêt : {formatEur(result.capaciteEmprunt)} + Apport : {formatEur(apport)}
              </p>
            </div>

            {/* Mensualite max */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Mensualité maximum HCSF</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.maxMensualite > 0 ? formatEur(result.maxMensualite) : "0 €"}
                <span className="text-sm font-normal text-gray-400 ml-1">/ mois</span>
              </p>
              {result.maxMensualite <= 0 && (
                <p className="text-xs text-red-500 mt-1">Vos autres crédits dépassent déjà la limite HCSF</p>
              )}
            </div>

            {/* Taux endettement */}
            <div className={`rounded-2xl border p-5 ${endettementStatus.bg}`}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Taux d'endettement actuel</p>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-2xl font-bold ${endettementStatus.color}`}>
                  {totalTaux.toFixed(1)}%
                </span>
                <span className="text-gray-400 text-sm mb-0.5">/ 35% max</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalTaux <= 25 ? "bg-emerald-500" : totalTaux <= 35 ? "bg-amber-400" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, (totalTaux / 35) * 100)}%` }}
                />
              </div>
              <p className={`text-xs font-medium ${endettementStatus.color}`}>{endettementStatus.label}</p>
            </div>

            {/* HCSF Badge */}
            <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
              result.hcsfOk ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
            }`}>
              {result.hcsfOk ? (
                <>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Conforme aux normes HCSF</p>
                    <p className="text-xs text-gray-500">Durée et taux validés</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Hors normes HCSF</p>
                    <p className="text-xs text-gray-500">Ajustez la durée ou réduisez les crédits</p>
                  </div>
                </>
              )}
            </div>

            {/* Bouton IA — visible quand dossier problématique */}
            {result.isProblematic && (
              <button
                onClick={openChat}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border-2"
                style={{
                  background: showChat ? "#FEF2F2" : "#EF4444",
                  color: showChat ? "#DC2626" : "white",
                  borderColor: showChat ? "#FECACA" : "#EF4444",
                }}
              >
                {/* Icône IA */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  {showChat
                    ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                    : <><path d="M12 2a10 10 0 0110 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></>
                  }
                </svg>
                {showChat ? "Fermer le conseiller IA" : "Comment obtenir mon crédit ?"}
              </button>
            )}

            {/* CTA normal */}
            {!result.isProblematic && (
              <a
                href="#cta"
                className="mt-1 w-full py-3.5 bg-bpce-600 text-white font-semibold rounded-xl hover:bg-bpce-700 transition-all text-center text-sm shadow-lg shadow-bpce-200"
              >
                Obtenir mon Passeport de Crédit
              </a>
            )}
          </div>
        </div>

        {/* ── PANNEAU CHAT IA (pleine largeur, s'ouvre sous le simulateur) ── */}
        {result.isProblematic && showChat && (
          <div className="mt-8 rounded-2xl border-2 border-bpce-100 bg-white overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-5 border-b border-bpce-50 flex items-center gap-3"
              style={{ background: "linear-gradient(to right, #f5f0fb, #fdf4ff)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #6B2D8B, #4A1870)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2a10 10 0 0110 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                  <path d="M8 12h.01M12 12h.01M16 12h.01"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Conseiller IA Loan AI</p>
                <p className="text-xs text-gray-500">Propulsé par Loan AI · Basé sur votre situation réelle</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-emerald-600 font-medium">En ligne</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="p-5 flex flex-col gap-4 max-h-96 overflow-y-auto bg-gray-50/50">
              {messages.length === 0 && isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #6B2D8B, #4A1870)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 2a10 10 0 0110 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                      <path d="M8 12h.01M12 12h.01M16 12h.01"/>
                    </svg>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-bpce-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-bpce-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-bpce-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "assistant" ? (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #6B2D8B, #4A1870)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 2a10 10 0 0110 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                        <path d="M8 12h.01M12 12h.01M16 12h.01"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-300 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === "assistant"
                        ? "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                        : "text-white rounded-tr-sm"
                    }`}
                    style={msg.role === "user" ? { background: "linear-gradient(135deg, #6B2D8B, #4A1870)" } : {}}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator quand l'IA répond à un message de suivi */}
              {isLoading && messages.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #6B2D8B, #4A1870)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 2a10 10 0 0110 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                      <path d="M8 12h.01M12 12h.01M16 12h.01"/>
                    </svg>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-bpce-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-bpce-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-bpce-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question sur votre dossier..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 bg-gray-50"
                  style={{ "--tw-ring-color": "#6B2D8B" } as React.CSSProperties}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-40 flex items-center gap-2 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6B2D8B, #4A1870)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  <span className="hidden sm:inline">Envoyer</span>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                L'IA analyse votre profil en temps réel · Résultats indicatifs
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Simulation indicative basée sur les normes HCSF 2024. Les résultats réels peuvent varier selon les établissements bancaires.
          Loan AI ne se substitue pas à un conseiller en crédit immobilier.
        </p>
      </div>
    </section>
  );
}
