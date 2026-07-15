"use client";

import { useState } from "react";
import { Question } from "@/lib/questions";
import { Carrousel } from "./Carrousel";

export function CarteQuestion({
  question,
  profil,
  valeurActuelle,
  onRepondre,
}: {
  question: Question;
  profil: "client" | "gerant" | undefined;
  valeurActuelle: any;
  onRepondre: (valeur: any) => void;
}) {
  const [optionValidee, setOptionValidee] = useState<string | null>(null);
  const [texteLibre, setTexteLibre] = useState("");
  const [champs, setChamps] = useState<Record<string, string>>({});

  function choisir(optionId: string, avecTexte: boolean) {
    if (avecTexte) {
      // n'avance pas tant que le texte n'est pas soumis
      setOptionValidee(optionId);
      return;
    }
    setOptionValidee(optionId);
    window.setTimeout(() => onRepondre(optionId), 340);
  }

  function soumettreTexte() {
    if (!optionValidee) return;
    window.setTimeout(() => onRepondre({ option: optionValidee, texte: texteLibre }), 200);
  }

  function soumettreTexteCourt(valeur: string) {
    onRepondre(valeur);
  }

  function soumettreLead() {
    const requis = question.champs?.every((c) => champs[c.id]?.trim());
    if (!requis) return;
    onRepondre(champs);
  }

  return (
    <div className="h-full w-full flex flex-col px-6 pt-6 pb-10 overflow-y-auto">
      {question.avecCarrousel && <Carrousel profil={profil} />}

      <h1 className="font-display font-semibold text-[1.25rem] leading-[1.25] text-[#050505] mb-2">
        {question.titre}
      </h1>

      {question.description && (
        <p className="font-body text-[0.85rem] leading-relaxed text-[#050505]/70 mb-5">
          {question.description}
        </p>
      )}

      <div className="flex-1" />

      {question.type === "choix_unique" && (
        <div className="flex flex-col gap-3 mt-4">
          {question.options?.map((opt) => {
            const active = optionValidee === opt.id;
            return (
              <div key={opt.id}>
                <button
                  onClick={() => choisir(opt.id, !!opt.texteConditionnel)}
                  className={`w-full text-left rounded-2xl px-5 py-3 font-body font-medium text-[0.92rem] border transition-all duration-200 ${
                    active
                      ? "bg-[#1877F2] text-[#FFFFFF] border-[#1877F2] scale-[0.98]"
                      : "bg-[#F0F2F5] text-[#050505] border-[#050505]/10 active:scale-[0.98] active:bg-[#F0F2F5]/80"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    {opt.label}
                    {active && (
                      <span className="inline-flex h-5 w-5 rounded-full bg-[#FFFFFF] text-[#1877F2] items-center justify-center text-xs shrink-0">
                        ✓
                      </span>
                    )}
                  </span>
                </button>

                {active && opt.texteConditionnel && (
                  <div className="mt-2 flex gap-2 animate-[fadein_0.2s_ease]">
                    <input
                      autoFocus
                      value={texteLibre}
                      onChange={(e) => setTexteLibre(e.target.value)}
                      placeholder={opt.placeholderTexte ?? "Précise ici"}
                      className="flex-1 rounded-xl bg-[#FFFFFF] border border-[#1877F2]/30 px-4 py-3 text-[#050505] placeholder:text-[#050505]/55 focus:outline-none focus:border-[#1877F2]"
                      onKeyDown={(e) => e.key === "Enter" && soumettreTexte()}
                    />
                    <button
                      onClick={soumettreTexte}
                      className="rounded-xl bg-[#1877F2] text-[#FFFFFF] px-4 font-semibold shrink-0"
                    >
                      OK
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {question.type === "texte_court" && (
        <TexteCourtForm valeurInitiale={valeurActuelle} onValider={soumettreTexteCourt} />
      )}

      {question.type === "champs_lead" && (
        <div className="flex flex-col gap-3 mt-4">
          {question.champs?.map((c) => (
            <div key={c.id} className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-[#050505]/50 font-body">
                {c.label}
              </label>
              <input
                value={champs[c.id] ?? ""}
                onChange={(e) => setChamps((s) => ({ ...s, [c.id]: e.target.value }))}
                className="rounded-xl bg-[#F0F2F5] border border-[#050505]/10 px-4 py-3.5 text-[#050505] focus:outline-none focus:border-[#1877F2]"
              />
            </div>
          ))}
          <button
            onClick={soumettreLead}
            className="mt-3 rounded-2xl bg-[#1877F2] text-[#FFFFFF] font-semibold py-4 active:scale-[0.98] transition-transform"
          >
            Envoyer
          </button>
        </div>
      )}
    </div>
  );
}

function TexteCourtForm({
  valeurInitiale,
  onValider,
}: {
  valeurInitiale: any;
  onValider: (v: string) => void;
}) {
  const [val, setVal] = useState(typeof valeurInitiale === "string" ? valeurInitiale : "");
  return (
    <div className="flex gap-2 mt-4">
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Ta réponse"
        className="flex-1 rounded-xl bg-[#F0F2F5] border border-[#050505]/10 px-4 py-3.5 text-[#050505] placeholder:text-[#050505]/55 focus:outline-none focus:border-[#1877F2]"
        onKeyDown={(e) => e.key === "Enter" && val.trim() && onValider(val.trim())}
      />
      <button
        onClick={() => val.trim() && onValider(val.trim())}
        className="rounded-xl bg-[#1877F2] text-[#FFFFFF] px-5 font-semibold shrink-0"
      >
        OK
      </button>
    </div>
  );
}
