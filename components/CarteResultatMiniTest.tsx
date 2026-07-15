"use client";

import { forwardRef } from "react";
import { ScoresMiniTest, ProfilMiniTest, dimensionsDominantes, pointDeTolerance } from "@/lib/miniTestData";

const BARRES: { cle: keyof ScoresMiniTest; label: string }[] = [
  { cle: "patience", label: "Patience" },
  { cle: "qualite", label: "Qualité" },
  { cle: "service", label: "Service" },
  { cle: "presentation", label: "Présentation" },
  { cle: "fiabilite", label: "Fiabilité" },
];

function BarreScore({ label, valeur }: { label: string; valeur: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-body text-[0.8rem] text-white/70">{label}</span>
        <span className="font-body text-[0.8rem] font-semibold text-white">{valeur}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1877F2] to-[#7A9B76] transition-all duration-700 ease-out"
          style={{ width: `${valeur}%` }}
        />
      </div>
    </div>
  );
}

export const CarteResultatMiniTest = forwardRef<
  HTMLDivElement,
  {
    prenom: string;
    scores: ScoresMiniTest;
    scoreGlobal: number;
    profil: ProfilMiniTest;
    pourcentageComparaison: number | null; // null tant que masqué (2 premiers participants)
    id: string; // utilisé comme identifiant DOM pour la capture/export image
  }
>(function CarteResultatMiniTest(
  { prenom, scores, scoreGlobal, profil, pourcentageComparaison, id },
  ref
) {
  const dominantes = dimensionsDominantes(scores);
  const tolerance = pointDeTolerance(scores);
  const etoilesPleines = "⭐".repeat(profil.etoiles);
  const etoilesVides = "☆".repeat(5 - profil.etoiles);

  return (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-sm mx-auto rounded-[2rem] p-7 bg-gradient-to-b from-[#0B1220] to-[#050505] border border-white/10 shadow-2xl"
    >
      <div className="text-center mb-6">
        <p className="font-display font-bold text-2xl text-white uppercase tracking-wide">
          {prenom} {profil.emoji}
        </p>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-[#7A9B76] mt-1">
          {profil.nom}
        </p>
        <p className="text-xl mt-2">
          {etoilesPleines}
          <span className="text-white/20">{etoilesVides}</span>
        </p>
        <p className="font-body text-white/50 text-xs mt-1">Score : {scoreGlobal}/100</p>
      </div>

      <div className="mb-6">
        {BARRES.map((b) => (
          <BarreScore key={b.cle} label={b.label} valeur={scores[b.cle]} />
        ))}
      </div>

      <p className="font-body text-[0.82rem] leading-relaxed text-white/80 mb-6 text-center">
        {profil.description}
      </p>

      <div className="mb-4">
        <p className="font-body text-xs uppercase tracking-wide text-white/50 mb-2">
          🙋🏽 Ce qui compte le plus pour toi
        </p>
        {dominantes.map((d, i) => (
          <p key={i} className="font-body text-sm text-white mb-1">
            {d.emoji} {d.texte}
          </p>
        ))}
      </div>

      <div className="mb-6">
        <p className="font-body text-xs uppercase tracking-wide text-white/50 mb-2">
          🙋🏽 Tu es plus tolérant sur
        </p>
        <p className="font-body text-sm text-white">• {tolerance}</p>
      </div>

      {pourcentageComparaison !== null && (
        <div className="rounded-2xl bg-white/5 border border-white/10 py-3 px-4 text-center">
          <p className="font-body text-sm text-white">
            😱 Tu es plus exigeant que{" "}
            <span className="font-bold text-[#7A9B76]">{pourcentageComparaison}%</span> des
            participants.
          </p>
        </div>
      )}
    </div>
  );
});
