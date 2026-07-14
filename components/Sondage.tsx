"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parcours, Profil } from "@/lib/questions";
import { CarteQuestion } from "./CarteQuestion";
import { useSwipeNav } from "@/lib/useSwipeNav";
import { supabase } from "@/lib/supabaseClient";

type Etape = "accueil" | "sondage" | "fin";

export function Sondage() {
  const [etape, setEtape] = useState<Etape>("accueil");
  const [reponses, setReponses] = useState<Record<string, any>>({});
  const [index, setIndex] = useState(0);
  const reponseIdRef = useRef<string | null>(null);

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
        const { data, error } = await supabase
          .from("reponses")
          .insert({ profil: nouvellesReponses["q1"] ?? "client", reponses: nouvellesReponses, complet })
          .select("id")
          .single();
        if (error) throw error;
        reponseIdRef.current = data.id;
      } else {
        const { error } = await supabase
          .from("reponses")
          .update({
            reponses: nouvellesReponses,
            complet,
            profil: nouvellesReponses["q1"] ?? "client",
            updated_at: new Date().toISOString(),
          })
          .eq("id", reponseIdRef.current);
        if (error) throw error;
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
    avancerAuto();
  }

  if (etape === "accueil") {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center px-8 text-center">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-[#E8A33D] mb-4">
          Bienvenue
        </p>
        <h1 className="font-display font-semibold text-[2rem] leading-[1.2] text-[#F5EDE3] mb-4">
          Sondage de modernisation de la restauration africaine
        </h1>
        <p className="font-body text-[#F5EDE3]/70 mb-10 max-w-sm">
          Aide-nous à réinventer le menu de restaurant en Afrique
        </p>
        <button
          onClick={() => setEtape("sondage")}
          className="w-full max-w-xs rounded-2xl bg-[#E8A33D] text-[#1A1410] font-semibold py-4 active:scale-[0.98] transition-transform"
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
        <h1 className="font-display font-semibold text-[1.6rem] leading-[1.3] text-[#F5EDE3]">
          Merci de votre participation à l&apos;innovation de la restauration africaine
        </h1>
      </div>
    );
  }

  const progression = ((index + 1) / questions.length) * 100;

  return (
    <div className="h-dvh w-full overflow-hidden relative flex flex-col">
      {/* Barre de progression fine en haut */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F5EDE3]/10 z-20">
        <div
          className="h-full bg-[#E8A33D] transition-all duration-300 ease-out"
          style={{ width: `${progression}%` }}
        />
      </div>

      <div
        className="flex-1 relative touch-none"
        onTouchStart={handlers.onTouchStart}
        onTouchMove={handlers.onTouchMove}
        onTouchEnd={handlers.onTouchEnd}
      >
        <div
          className="h-full w-full"
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
