"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parcours, Profil } from "@/lib/questions";
import { CarteQuestion } from "./CarteQuestion";
import { useSwipeNav } from "@/lib/useSwipeNav";
import { supabase } from "@/lib/supabaseClient";
import { MiniTest } from "./MiniTest";

type Etape = "accueil" | "sondage" | "fin" | "miniTest";

export function Sondage() {
  const [etape, setEtape] = useState<Etape>("accueil");
  const idGenere = useRef<string>(crypto.randomUUID());
  const [reponses, setReponses] = useState<Record<string, any>>({});
  const [index, setIndex] = useState(0);
  const reponseIdRef = useRef<string | null>(null);
  // Miroir en state de reponseIdRef.current : nécessaire pour l'utiliser dans le JSX
  // (accéder à ref.current pendant le render est interdit par React, voir règle react-hooks/refs).
  const [reponseId, setReponseId] = useState<string | null>(null);
  // DEBUG TEMPORAIRE — à retirer une fois le bug de sauvegarde confirmé/corrigé.
  const [debugMsg, setDebugMsg] = useState<string | null>(null);

  const questions = useMemo(() => parcours(reponses), [reponses]);
  const questionActuelle = questions[index];
  const profil: Profil | undefined = reponses["q1"];

  const peutReculer = index > 0;
  const aReponduActuelle = reponses[questionActuelle.id] !== undefined;
  const peutAvancer = index < questions.length - 1 && aReponduActuelle;

  const { offset, enTransition, handlers, avancerAuto } = useSwipeNav({
    peutAvancer,
    peutReculer,
    onAvancer: () => setIndex((i) => Math.min(i + 1, questions.length - 1)),
    onReculer: () => setIndex((i) => Math.max(i - 1, 0)),
  });

  async function sauvegarder(nouvellesReponses: Record<string, any>, complet: boolean) {
    try {
      if (!reponseIdRef.current) {
        reponseIdRef.current = idGenere.current;
        setReponseId(idGenere.current);
        const { error } = await supabase
          .from("reponses")
          .insert({ id: idGenere.current, profil: nouvellesReponses["q1"] ?? "client", reponses: nouvellesReponses, complet });
        if (error) {
          setDebugMsg(`INSERT a échoué: ${error.message} (code ${error.code})`);
          throw error;
        }
      } else {
        const { error } = await supabase.rpc("maj_reponse", {
          p_id: reponseIdRef.current,
          p_reponses: nouvellesReponses,
          p_complet: complet,
        });
        if (error) {
          setDebugMsg(`UPDATE (via fonction) a échoué: ${error.message} (code ${error.code})`);
          throw error;
        }
        setDebugMsg(null);
      }

      // Capture du lead séparément si Q17 vient d'être répondue
      if (nouvellesReponses["q17"] && reponseIdRef.current) {
        const lead = nouvellesReponses["q17"];
        await supabase.from("leads").insert({
          reponse_id: reponseIdRef.current,
          nom_restaurant: lead.nom_restaurant,
          contact: lead.contact,
          ville: lead.ville,
        });
      }
    } catch (e) {
      // Silencieux pour l'utilisateur : le sondage ne doit jamais bloquer sur une erreur réseau.
      console.error("Erreur de sauvegarde", e);
    }
  }

  function repondre(valeur: any) {
    const maj = { ...reponses, [questionActuelle.id]: valeur };
    setReponses(maj);

    const prochainParcours = parcours(maj);
    const estDerniere = index >= prochainParcours.length - 1;

    sauvegarder(maj, estDerniere);

    if (estDerniere) {
      window.setTimeout(() => setEtape("fin"), 380);
      return;
    }

    // force=true : on vient de répondre à l'instant, l'avancement est donc
    // toujours légitime, même si `peutAvancer` (calculé sur le render
    // précédent, avant que setReponses(maj) ne soit appliqué) vaut encore
    // `false` par stale closure. C'était la cause du blocage sur q1.
    avancerAuto(true);
  }

  if (etape === "accueil") {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center px-8 text-center">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-[#1877F2] mb-4">
          Bienvenue
        </p>
        <h1 className="font-display font-semibold text-[2rem] leading-[1.2] text-[#050505] mb-4">
          Sondage de modernisation de la restauration africaine
        </h1>
        <p className="font-body text-[#050505]/70 mb-10 max-w-sm">
          Aide-nous à réinventer le menu de restaurant en Afrique
        </p>
        <button
          onClick={() => setEtape("sondage")}
          className="w-full max-w-xs rounded-2xl bg-[#1877F2] text-[#FFFFFF] font-semibold py-4 active:scale-[0.98] transition-transform"
        >
          Commencer
        </button>
      </div>
    );
  }

  if (etape === "fin") {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center px-8 text-center">
        <div className="h-14 w-14 rounded-full bg-[#7A9B76]/20 border border-[#7A9B76]/40 flex items-center justify-center mb-6">
          <span className="text-[#7A9B76] text-2xl">✓</span>
        </div>
        <h1 className="font-display font-semibold text-[1.6rem] leading-[1.3] text-[#050505] mb-8">
          Merci de votre participation à l&apos;innovation de la restauration africaine
        </h1>

        {/* Mini-test viral : uniquement pour les clients, jamais pour les gérants
            (cahier des charges §2 + confirmation capture 3). Optionnel, placé en haut visuellement
            via l'ordre du flux : c'est ce que l'utilisateur voit juste après le message de fin. */}
        {profil === "client" && reponseId && (
          <div className="w-full max-w-xs rounded-2xl bg-[#F0F2F5] p-5">
            <p className="font-body font-semibold text-[#050505] mb-1">
              🎉 Découvre maintenant ton niveau d&apos;exigence au restaurant
            </p>
            <p className="font-body text-[#050505]/60 text-sm mb-4">⏱️ 30 secondes chrono.</p>
            <button
              onClick={() => setEtape("miniTest")}
              className="w-full rounded-2xl bg-[#1877F2] text-white font-semibold py-3.5 active:scale-[0.98] transition-transform"
            >
              Commencer le mini-test
            </button>
          </div>
        )}
      </div>
    );
  }

  if (etape === "miniTest" && reponseId) {
    return <MiniTest reponseId={reponseId} onPasser={() => setEtape("fin")} />;
  }

  const progression = ((index + 1) / questions.length) * 100;

  return (
    <div className="h-dvh w-full overflow-hidden relative flex flex-col">
      {/* Barre de progression fine en haut */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#050505]/10 z-20">
        <div
          className="h-full bg-[#1877F2] transition-all duration-300 ease-out"
          style={{ width: `${progression}%` }}
        />
      </div>

      {/* DEBUG TEMPORAIRE — bandeau visible à l'écran, à retirer après diagnostic */}
      {debugMsg && (
        <div className="absolute top-2 left-2 right-2 z-50 bg-red-600 text-white text-xs p-3 rounded-lg break-words">
          {debugMsg}
        </div>
      )}

      <div
        className="flex-1 relative touch-none"
        onTouchStart={handlers.onTouchStart}
        onTouchMove={handlers.onTouchMove}
        onTouchEnd={handlers.onTouchEnd}
      >
        <div
          className={questionActuelle.collerOptionsApresDescription ? "w-full" : "h-full w-full"}
          style={{
            transform: `translateY(${offset}px)`,
            transition: enTransition ? "transform 260ms cubic-bezier(0.22,1,0.36,1)" : "none",
          }}
        >
          <CarteQuestion
            key={questionActuelle.id}
            question={questionActuelle}
            profil={profil}
            valeurActuelle={reponses[questionActuelle.id]}
            onRepondre={repondre}
          />
        </div>
      </div>
    </div>
  );
          }
  
