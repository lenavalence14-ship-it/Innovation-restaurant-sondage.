"use client";

import { useState } from "react";
import { QuestionMiniTest } from "@/lib/miniTestData";

// Couleurs façon UNO — une par position d'option (jusqu'à 3 options par question ici).
const COULEURS = [
  { bg: "bg-[#EF4444]", border: "border-[#EF4444]" }, // rouge
  { bg: "bg-[#F59E0B]", border: "border-[#F59E0B]" }, // jaune/orange
  { bg: "bg-[#1877F2]", border: "border-[#1877F2]" }, // bleu
];

export function CarteMiniTestQuestion({
  question,
  numero,
  total,
  onRepondre,
}: {
  question: QuestionMiniTest;
  numero: number;
  total: number;
  onRepondre: (optionId: string, points: number) => void;
}) {
  const [optionValidee, setOptionValidee] = useState<string | null>(null);

  function choisir(optionId: string, points: number) {
    if (optionValidee) return; // évite double-tap pendant l'animation
    setOptionValidee(optionId);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(15);
    }

    window.setTimeout(() => onRepondre(optionId, points), 320);
  }

  return (
    <div className="h-full w-full flex flex-col px-6 pt-8 pb-10">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-[#1877F2] mb-6 text-center">
        Question {numero} / {total}
      </p>

      <h1 className="font-display font-semibold text-[1.3rem] leading-[1.3] text-[#050505] text-center mb-10">
        {question.titre}
      </h1>

      <div className="flex-1 flex flex-col gap-4 justify-center">
        {question.options.map((opt, i) => {
          const active = optionValidee === opt.id;
          const couleur = COULEURS[i % COULEURS.length];
          return (
            <button
              key={opt.id}
              onClick={() => choisir(opt.id, opt.points)}
              className={`w-full rounded-3xl px-5 py-6 border-2 transition-all duration-200 flex items-center gap-4 ${
                active
                  ? `${couleur.bg} ${couleur.border} scale-[0.96] text-white`
                  : "bg-white border-[#050505]/10 active:scale-[0.97]"
              }`}
            >
              <span className="text-3xl shrink-0">{opt.emoji}</span>
              <span
                className={`font-body font-semibold text-[0.95rem] text-left leading-snug ${
                  active ? "text-white" : "text-[#050505]"
                }`}
              >
                {opt.texte}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
