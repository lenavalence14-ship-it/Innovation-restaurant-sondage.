"use client";

import { useEffect, useState } from "react";
import { QUESTIONS } from "@/lib/questions";

// IDs des questions dont la réponse est un texte libre écrit par l'utilisateur
// (à ne pas confondre avec q1 par ex., qui est une string "client"/"gerant" issue d'un choix).
const IDS_TEXTE_COURT = new Set(
  QUESTIONS.filter((q) => q.type === "texte_court").map((q) => q.id)
);

type Resultats = {
  reponses: any[];
  leads: any[];
};

export default function AdminPage() {
  const [connecte, setConnecte] = useState(false);
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [data, setData] = useState<Resultats | null>(null);

  async function seConnecter(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setChargement(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motDePasse }),
    });
    setChargement(false);
    if (!res.ok) {
      const j = await res.json();
      setErreur(j.erreur ?? "Erreur de connexion.");
      return;
    }
    setConnecte(true);
  }

  useEffect(() => {
    if (!connecte) return;
    fetch("/api/admin/resultats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setErreur("Impossible de charger les résultats."));
  }, [connecte]);

  if (!connecte) {
    return (
      <div className="h-dvh w-full flex items-center justify-center px-6">
        <form onSubmit={seConnecter} className="w-full max-w-sm flex flex-col gap-4">
          <h1 className="font-display font-semibold text-xl text-[#050505] mb-2">
            Espace administrateur
          </h1>
          <input
            type="password"
            autoFocus
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Mot de passe"
            className="rounded-xl bg-[#F0F2F5] border border-[#050505]/10 px-4 py-3.5 text-[#050505] placeholder:text-[#050505]/55 focus:outline-none focus:border-[#1877F2]"
          />
          {erreur && <p className="text-sm text-red-400">{erreur}</p>}
          <button
            disabled={chargement}
            className="rounded-xl bg-[#1877F2] text-[#FFFFFF] font-semibold py-3.5 disabled:opacity-50"
          >
            {chargement ? "Connexion…" : "Entrer"}
          </button>
        </form>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-dvh w-full flex items-center justify-center">
        <p className="text-[#050505]/60">Chargement des résultats…</p>
      </div>
    );
  }

  return <Dashboard data={data} onReinitialise={() => setData({ reponses: [], leads: [] })} />;
}

function Dashboard({ data, onReinitialise }: { data: Resultats; onReinitialise: () => void }) {
  const { reponses, leads } = data;
  const total = reponses.length;
  const complets = reponses.filter((r) => r.complet).length;
  const tauxCompletion = total ? Math.round((complets / total) * 100) : 0;
  const nbClient = reponses.filter((r) => r.profil === "client").length;
  const nbGerant = reponses.filter((r) => r.profil === "gerant").length;
  const [suppression, setSuppression] = useState(false);

  async function reinitialiser() {
    const confirmation = window.confirm(
      `Supprimer définitivement les ${total} réponse${total > 1 ? "s" : ""} et ${leads.length} lead${leads.length > 1 ? "s" : ""} ? Cette action est IRRÉVERSIBLE.`
    );
    if (!confirmation) return;

    setSuppression(true);
    const res = await fetch("/api/admin/reinitialiser", { method: "POST" });
    setSuppression(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(`Échec de la réinitialisation.\nStatut: ${res.status}\nErreur: ${j.erreur ?? "inconnue"}`);
      return;
    }
    onReinitialise();
  }

  return (
    <div className="min-h-dvh w-full px-5 py-8 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-1 gap-3">
        <h1 className="font-display font-semibold text-2xl text-[#050505]">
          Résultats du sondage
        </h1>
        <button
          onClick={reinitialiser}
          disabled={suppression || total === 0}
          className="shrink-0 rounded-lg border border-red-400/30 text-red-400 text-xs px-3 py-2 disabled:opacity-30"
        >
          {suppression ? "Suppression…" : "Tout réinitialiser"}
        </button>
      </div>
      <p className="text-[#050505]/50 text-sm mb-8">
        {total} participation{total > 1 ? "s" : ""} enregistrée{total > 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <Stat label="Taux de complétion" valeur={`${tauxCompletion}%`} />
        <Stat label="Réponses complètes" valeur={`${complets} / ${total}`} />
        <Stat label="Profil client" valeur={`${nbClient}`} />
        <Stat label="Profil gérant" valeur={`${nbGerant}`} />
      </div>

      <h2 className="font-display font-semibold text-lg text-[#050505] mb-3">
        Leads gérants intéressés ({leads.length})
      </h2>
      <div className="flex flex-col gap-2 mb-10">
        {leads.length === 0 && (
          <p className="text-[#050505]/55 text-sm">Aucun lead pour l&apos;instant.</p>
        )}
        {leads.map((l) => (
          <div key={l.id} className="rounded-xl bg-[#F0F2F5] border border-[#050505]/10 p-4">
            <p className="font-semibold text-[#050505]">{l.nom_restaurant}</p>
            <p className="text-sm text-[#050505]/70">{l.contact} · {l.ville}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display font-semibold text-lg text-[#050505] mb-3">
        Résultats par question
      </h2>
      <div className="flex flex-col gap-6">
        {QUESTIONS.filter((q) => q.type === "choix_unique").map((q) => {
          const comptes: Record<string, number> = {};
          reponses.forEach((r) => {
            const v = r.reponses?.[q.id];
            const optId = typeof v === "object" && v !== null ? v.option : v;
            if (!optId) return;
            comptes[optId] = (comptes[optId] ?? 0) + 1;
          });
          const totalQ = Object.values(comptes).reduce((a, b) => a + b, 0);
          if (totalQ === 0) return null;

          return (
            <div key={q.id} className="rounded-xl bg-[#F0F2F5] border border-[#050505]/10 p-4">
              <p className="font-medium text-[#050505] mb-3 text-sm">{q.titre}</p>
              <div className="flex flex-col gap-2">
                {q.options?.map((opt) => {
                  const n = comptes[opt.id] ?? 0;
                  const pct = totalQ ? Math.round((n / totalQ) * 100) : 0;
                  return (
                    <div key={opt.id}>
                      <div className="flex justify-between text-xs text-[#050505]/70 mb-1">
                        <span>{opt.label}</span>
                        <span>{pct}% ({n})</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#FFFFFF] overflow-hidden">
                        <div
                          className="h-full bg-[#1877F2]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="font-display font-semibold text-lg text-[#050505] mt-10 mb-3">
        Réponses texte libres
      </h2>
      <div className="flex flex-col gap-2 pb-10">
        {reponses.flatMap((r) =>
          Object.entries(r.reponses ?? {})
            .map(([qId, v]: [string, any]) => {
              // Deux formats possibles pour une réponse texte libre :
              // 1. Une string simple, MAIS seulement pour les questions de type
              //    "texte_court" (ex: q14) — sinon on capterait aussi q1 ("client"/"gerant").
              // 2. Un objet { texte: "..." } (option avec texteConditionnel, ex: q15/q17)
              if (IDS_TEXTE_COURT.has(qId) && typeof v === "string" && v.trim().length > 0) {
                return { qId, texte: v };
              }
              if (typeof v === "object" && v !== null && typeof v.texte === "string" && v.texte.trim().length > 0) {
                return { qId, texte: v.texte };
              }
              return null;
            })
            .filter((x): x is { qId: string; texte: string } => x !== null)
            .map(({ qId, texte }) => (
              <div
                key={r.id + qId}
                className="rounded-xl bg-[#F0F2F5] border border-[#050505]/10 p-3 text-sm"
              >
                <span className="text-[#1877F2]/80 text-xs uppercase">{qId}</span>
                <p className="text-[#050505]/90 mt-1">{texte}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

function Stat({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="rounded-xl bg-[#F0F2F5] border border-[#050505]/10 p-4">
      <p className="text-[#050505]/50 text-xs mb-1">{label}</p>
      <p className="font-display font-semibold text-xl text-[#050505]">{valeur}</p>
    </div>
  );
}
