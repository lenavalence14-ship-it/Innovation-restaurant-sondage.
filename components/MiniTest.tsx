"use client";

import { useMemo, useState } from "react";
import {
  QUESTIONS_MINI_TEST,
  ScoresMiniTest,
  calculerScoreGlobal,
  trouverProfil,
} from "@/lib/miniTestData";
import { CarteMiniTestQuestion } from "./CarteMiniTestQuestion";
import { CarteResultatMiniTest } from "./CarteResultatMiniTest";
import { supabase } from "@/lib/supabaseClient";

type EtapeMiniTest = "intro" | "questions" | "prenom" | "resultat" | "defi" | "partage";

export function MiniTest({ reponseId, onPasser }: { reponseId: string; onPasser: () => void }) {
  const [etape, setEtape] = useState<EtapeMiniTest>("intro");
  const [index, setIndex] = useState(0);
  const [pointsParDimension, setPointsParDimension] = useState<Record<string, number[]>>({});
  const [prenom, setPrenom] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const [resultat, setResultat] = useState<{
    id: string;
    scores: ScoresMiniTest;
    scoreGlobal: number;
    pourcentage: number | null;
  } | null>(null);

  const questionActuelle = QUESTIONS_MINI_TEST[index];

  function repondreQuestion(_optionId: string, points: number) {
    const dim = questionActuelle.dimension;
    const maj = { ...pointsParDimension, [dim]: [...(pointsParDimension[dim] ?? []), points] };
    setPointsParDimension(maj);

    if (index < QUESTIONS_MINI_TEST.length - 1) {
      setIndex(index + 1);
    } else {
      setEtape("prenom");
    }
  }

  // Une seule question par dimension dans ce mini-test (5 questions, 5 dimensions),
  // donc le score de la dimension = le point unique obtenu à sa question.
  const scores: ScoresMiniTest = useMemo(
    () => ({
      patience: pointsParDimension["patience"]?.[0] ?? 0,
      qualite: pointsParDimension["qualite"]?.[0] ?? 0,
      service: pointsParDimension["service"]?.[0] ?? 0,
      presentation: pointsParDimension["presentation"]?.[0] ?? 0,
      fiabilite: pointsParDimension["fiabilite"]?.[0] ?? 0,
    }),
    [pointsParDimension]
  );

  async function validerPrenom() {
    const nomPropre = prenom.trim();
    if (!nomPropre) return;

    setChargement(true);
    setErreur(null);

    const scoreGlobal = calculerScoreGlobal(scores);
    const profil = trouverProfil(scoreGlobal);

    try {
      const { data, error } = await supabase.rpc("enregistrer_mini_test", {
        p_reponse_id: reponseId,
        p_prenom: nomPropre,
        p_reponses_mini_test: pointsParDimension,
        p_score_patience: scores.patience,
        p_score_qualite: scores.qualite,
        p_score_service: scores.service,
        p_score_presentation: scores.presentation,
        p_score_fiabilite: scores.fiabilite,
        p_score_global: scoreGlobal,
        p_profil_id: profil.id,
      });

      if (error) throw error;

      const ligne = Array.isArray(data) ? data[0] : data;

      setResultat({
        id: ligne.id,
        scores,
        scoreGlobal,
        // Masqué pour les 2 premiers participants (géré côté fonction SQL) : null si absent.
        pourcentage:
          typeof ligne.plus_exigeant_que_pourcent === "number"
            ? ligne.plus_exigeant_que_pourcent
            : null,
      });
      setEtape("resultat");
    } catch (e) {
      console.error("Erreur enregistrement mini-test", e);
      setErreur("Une erreur est survenue, réessaie.");
    } finally {
      setChargement(false);
    }
  }

  if (etape === "intro") {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center px-8 text-center">
        <p className="text-4xl mb-4">🎉</p>
        <h1 className="font-display font-semibold text-[1.6rem] leading-[1.3] text-[#050505] mb-3">
          Découvre maintenant ton niveau d&apos;exigence au restaurant
        </h1>
        <p className="font-body text-[#050505]/60 mb-10">⏱️ 30 secondes chrono.</p>
        <button
          onClick={() => setEtape("questions")}
          className="w-full max-w-xs rounded-2xl bg-[#1877F2] text-white font-semibold py-4 active:scale-[0.98] transition-transform mb-3"
        >
          Commencer le mini-test
        </button>
        <button onClick={onPasser} className="font-body text-[#050505]/50 text-sm py-2">
          Passer
        </button>
      </div>
    );
  }

  if (etape === "questions") {
    return (
      <div className="h-dvh w-full overflow-hidden relative flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#050505]/10 z-20">
          <div
            className="h-full bg-[#1877F2] transition-all duration-300 ease-out"
            style={{ width: `${((index + 1) / QUESTIONS_MINI_TEST.length) * 100}%` }}
          />
        </div>
        <CarteMiniTestQuestion
          key={questionActuelle.id}
          question={questionActuelle}
          numero={index + 1}
          total={QUESTIONS_MINI_TEST.length}
          onRepondre={repondreQuestion}
        />
      </div>
    );
  }

  if (etape === "prenom") {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center px-8 text-center">
        <h1 className="font-display font-semibold text-[1.4rem] text-[#050505] mb-6">
          Quel est ton prénom ?
        </h1>
        <input
          autoFocus
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          placeholder="Gedy"
          className="w-full max-w-xs rounded-xl bg-[#F0F2F5] border border-[#050505]/10 px-4 py-3.5 text-center text-[#050505] placeholder:text-[#050505]/40 focus:outline-none focus:border-[#1877F2] mb-4"
          onKeyDown={(e) => e.key === "Enter" && validerPrenom()}
        />
        {erreur && <p className="text-red-500 text-xs mb-3">{erreur}</p>}
        <button
          onClick={validerPrenom}
          disabled={chargement || !prenom.trim()}
          className="w-full max-w-xs rounded-2xl bg-[#1877F2] text-white font-semibold py-4 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {chargement ? "..." : "Voir mon profil"}
        </button>
      </div>
    );
  }

  if (etape === "resultat" && resultat) {
    return (
      <div className="min-h-dvh w-full flex flex-col items-center px-4 py-8 bg-[#F0F2F5]">
        <h1 className="font-display font-semibold text-[1.3rem] text-[#050505] mb-6 text-center">
          🎉 Voici ton profil
        </h1>

        <CarteResultatMiniTest
          id="carte-resultat-mini-test"
          prenom={prenom}
          scores={resultat.scores}
          scoreGlobal={resultat.scoreGlobal}
          profil={trouverProfil(resultat.scoreGlobal)}
          pourcentageComparaison={resultat.pourcentage}
        />

        <div className="w-full max-w-sm mt-6 flex flex-col gap-3">
          <button
            onClick={() => setEtape("defi")}
            className="w-full rounded-2xl bg-[#1877F2] text-white font-semibold py-4 active:scale-[0.98] transition-transform"
          >
            🎯 Défier un ami
          </button>
        </div>
      </div>
    );
  }

  if (etape === "defi" && resultat) {
    return (
      <EcranDefi
        resultatId={resultat.id}
        onDefiCree={() => setEtape("partage")}
      />
    );
  }

  if (etape === "partage") {
    return <EcranPartage />;
  }

  return null;
}

// Écran des 2 questions de prédiction du CRÉATEUR, posées avant le partage
// (cahier des charges §13 : "Après la carte" ... "Puis :" — les 2 questions
// sont dans le flux du créateur, avant qu'il envoie le lien). Ces réponses
// sont sauvegardées pour les stats admin uniquement : il n'existe aucun
// mécanisme de retour ou de comparaison automatique après coup.
function EcranDefi({
  resultatId,
  onDefiCree,
}: {
  resultatId: string;
  onDefiCree: () => void;
}) {
  const [menuChoisi, setMenuChoisi] = useState<string | null>(null);
  const [penseAmiExigeant, setPenseAmiExigeant] = useState<boolean | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function creerLeDefi() {
    if (!menuChoisi || penseAmiExigeant === null) return;
    setChargement(true);
    setErreur(null);
    try {
      const { error } = await supabase.rpc("creer_defi", {
        p_createur_resultat_id: resultatId,
        p_reponse_menu_predite: menuChoisi,
        p_pense_ami_plus_exigeant: penseAmiExigeant,
      });
      if (error) throw error;
      onDefiCree();
    } catch (e) {
      console.error("Erreur création défi", e);
      setErreur("Impossible de continuer, réessaie.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center px-8 text-center">
      <h1 className="font-display font-semibold text-[1.2rem] text-[#050505] mb-8">
        🎯 Défie un ami
      </h1>

      <p className="font-body text-[#050505]/70 mb-4">Selon toi, lequel choisira-t-il ?</p>
      <div className="w-full max-w-xs flex flex-col gap-3 mb-8">
        {[
          { id: "numerique", label: "📱 Menu numérique" },
          { id: "papier", label: "📄 Menu papier" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setMenuChoisi(opt.id)}
            className={`w-full rounded-2xl px-5 py-3 font-body font-medium border transition-all ${
              menuChoisi === opt.id
                ? "bg-[#1877F2] text-white border-[#1877F2]"
                : "bg-[#F0F2F5] text-[#050505] border-[#050505]/10"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <p className="font-body text-[#050505]/70 mb-4">
        Penses-tu que ton meilleur ami est plus exigeant que toi ? 😱
      </p>
      <div className="w-full max-w-xs flex flex-col gap-3 mb-8">
        {[
          { id: true, label: "Oui" },
          { id: false, label: "Non" },
        ].map((opt) => (
          <button
            key={String(opt.id)}
            onClick={() => setPenseAmiExigeant(opt.id)}
            className={`w-full rounded-2xl px-5 py-3 font-body font-medium border transition-all ${
              penseAmiExigeant === opt.id
                ? "bg-[#1877F2] text-white border-[#1877F2]"
                : "bg-[#F0F2F5] text-[#050505] border-[#050505]/10"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {erreur && <p className="text-red-500 text-xs mb-3">{erreur}</p>}

      <button
        onClick={creerLeDefi}
        disabled={!menuChoisi || penseAmiExigeant === null || chargement}
        className="w-full max-w-xs rounded-2xl bg-[#1877F2] text-white font-semibold py-4 active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        {chargement ? "..." : "Continuer"}
      </button>
    </div>
  );
}

// Écran final : le lien renvoie simplement vers le sondage principal depuis le début
// (page d'accueil normale). Il n'y a pas de page de défi dédiée : l'ami qui clique
// refait tout le parcours (sondage → mini-test → sa propre carte), puis les deux
// comparent leurs cartes manuellement, en dehors du système (WhatsApp, Instagram...).
function EcranPartage() {
  const lien = typeof window !== "undefined" ? window.location.origin : "";
  const texte = `Je viens de découvrir mon niveau d'exigence au restaurant 🍽️.\n\nÀ ton avis, qui est le plus exigeant entre nous ?\n\nFais le test et on compare nos cartes profil.\n${lien}`;

  async function partager() {
    if (navigator.share) {
      try {
        await navigator.share({ text: texte });
      } catch {
        // partage annulé par l'utilisateur, rien à faire
      }
    } else {
      await navigator.clipboard.writeText(texte);
    }
  }

  async function copierLien() {
    await navigator.clipboard.writeText(texte);
  }

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center px-8 text-center">
      <p className="text-3xl mb-4">💬</p>
      <p className="font-body text-[#050505]/70 mb-8">
        Envoie-lui le test et comparez vos cartes profil.
      </p>
      <button
        onClick={partager}
        className="w-full max-w-xs rounded-2xl bg-[#1877F2] text-white font-semibold py-4 active:scale-[0.98] transition-transform mb-3"
      >
        📤 Envoyer le défi
      </button>
      <button
        onClick={copierLien}
        className="w-full max-w-xs rounded-2xl bg-[#F0F2F5] text-[#050505] font-semibold py-4 active:scale-[0.98] transition-transform"
      >
        📋 Copier le lien
      </button>
    </div>
  );
}
