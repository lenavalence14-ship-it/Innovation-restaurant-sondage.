"use client";

import { useState } from "react";
import { QuestionMiniTest } from "@/lib/miniTestData";

// Vraies couleurs UNO — pleines dès le repos, pas seulement au clic.
// Une couleur fixe par position (1ère option = rouge, 2e = jaune, 3e = bleu),
// pour que l'oeil associe une couleur à une intensité de réponse d'un coup d'oeil.
const COULEURS_UNO = [
  { fond: "#E4483C", ombre: "#B8321F" }, // rouge UNO
  { fond: "#F5B02E", ombre: "#C88418" }, // jaune UNO
  { fond: "#1877F2", ombre: "#0F5AC2" }, // bleu (couleur de marque du sondage)
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
    <div className="h-full w-full flex flex-col px-5 pt-8 pb-6 bg-[#0B1220]">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-white/50 mb-4 text-center">
        Question {numero} / {total}
      </p>

      <h1 className="font-display font-semibold text-[1.15rem] leading-[1.3] text-white text-center mb-8 px-2">
        {question.titre}
      </h1>

      <div className="flex-1 flex items-center justify-center gap-3">
        {question.options.map((opt, i) => {
          const active = optionValidee === opt.id;
          const inactive = optionValidee !== null && !active;
          const couleur = COULEURS_UNO[i % COULEURS_UNO.length];

          return (
            <button
              key={opt.id}
              onClick={() => choisir(opt.id, opt.points)}
              disabled={optionValidee !== null}
              style={{
                backgroundColor: couleur.fond,
                boxShadow: active
                  ? `0 0 0 4px white, 0 8px 24px ${couleur.ombre}80`
                  : `0 6px 0 ${couleur.ombre}`,
              }}
              className={`relative flex-1 aspect-[3/4.2] rounded-2xl flex flex-col items-center justify-center gap-3 px-2 transition-all duration-200 ${
                active ? "scale-[1.06] -translate-y-1" : "active:scale-[0.95] active:translate-y-1"
              } ${inactive ? "opacity-30 scale-[0.94]" : ""}`}
            >
              {/* Ovale central façon carte UNO */}
              <div
                className="absolute inset-2 rounded-xl border-2 border-white/25"
                style={{ transform: "rotate(-8deg)" }}
              />
              <span className="text-4xl relative z-10 drop-shadow-sm">{opt.emoji}</span>
              <span className="font-body font-bold text-[0.72rem] leading-tight text-white text-center relative z-10 drop-shadow-sm">
                {opt.texte}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
              }
