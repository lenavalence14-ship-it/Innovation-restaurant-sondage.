"use client";

import { useRef, useState, useCallback, useEffect } from "react";

// Seuils de déclenchement : distance minimum OU vitesse minimum suffisent à valider un swipe.
const SEUIL_DISTANCE = 60; // px
const SEUIL_VITESSE = 0.35; // px/ms

type Direction = "avant" | "arriere" | null;

export function useSwipeNav(opts: {
  peutAvancer: boolean;
  peutReculer: boolean;
  onAvancer: () => void;
  onReculer: () => void;
}) {
  const { peutAvancer, peutReculer, onAvancer, onReculer } = opts;

  // offset visuel pendant le drag (en px, translateY appliqué à la carte active)
  const [offset, setOffset] = useState(0);
  const [enTransition, setEnTransition] = useState(false);

  const startY = useRef<number | null>(null);
  const startT = useRef<number>(0);
  const dragging = useRef(false);

  const reset = useCallback(() => {
    startY.current = null;
    dragging.current = false;
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (enTransition) return;
    startY.current = e.touches[0].clientY;
    startT.current = performance.now();
    dragging.current = true;
  }, [enTransition]);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragging.current || startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;

      // Résistance élastique si on essaie d'aller au-delà des bornes du parcours
      let applied = dy;
      if (dy < 0 && !peutAvancer) applied = dy * 0.25;
      if (dy > 0 && !peutReculer) applied = dy * 0.25;

      setOffset(applied);
    },
    [peutAvancer, peutReculer]
  );

  const onTouchEnd = useCallback(() => {
    if (!dragging.current || startY.current === null) {
      reset();
      return;
    }
    const dt = Math.max(1, performance.now() - startT.current);
    const vitesse = Math.abs(offset) / dt;
    const distanceOk = Math.abs(offset) > SEUIL_DISTANCE;
    const vitesseOk = vitesse > SEUIL_VITESSE;

    let direction: Direction = null;
    if (offset < 0 && (distanceOk || vitesseOk) && peutAvancer) direction = "avant";
    if (offset > 0 && (distanceOk || vitesseOk) && peutReculer) direction = "arriere";

    reset();

    if (direction) {
      setEnTransition(true);
      // Termine l'animation de sortie avant de changer réellement de carte,
      // pour garantir qu'un seul pas se joue même si l'utilisateur re-swipe vite.
      const cible = direction === "avant" ? -1 : 1;
      setOffset(cible * (typeof window !== "undefined" ? window.innerHeight : 800));
      window.setTimeout(() => {
        if (direction === "avant") onAvancer();
        else onReculer();
        setOffset(0);
        setEnTransition(false);
      }, 260);
    } else {
      // Retour élastique à la position d'origine, pas de changement de carte
      setOffset(0);
    }
  }, [offset, peutAvancer, peutReculer, onAvancer, onReculer, reset]);

  // Avance programmatique (ex: après avoir répondu à une question), même logique de verrouillage
  const avancerAuto = useCallback(() => {
    if (enTransition || !peutAvancer) return;
    setEnTransition(true);
    setOffset(typeof window !== "undefined" ? -window.innerHeight : -800);
    window.setTimeout(() => {
      onAvancer();
      setOffset(0);
      setEnTransition(false);
    }, 260);
  }, [enTransition, peutAvancer, onAvancer]);

  return {
    offset,
    enTransition,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    avancerAuto,
  };
}
