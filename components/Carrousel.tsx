"use client";

import Image from "next/image";

const IMAGES_CLIENT = [
  { src: "/images/client-grille.png", alt: "Navigation du menu par catégories" },
  { src: "/images/plat-plein-ecran.png", alt: "Carte plein écran d'un plat" },
  { src: "/images/client-profil.png", alt: "Page du restaurant côté client" },
];

const IMAGES_GERANT = [
  { src: "/images/gerant-dashboard.png", alt: "Espace de gestion du restaurant" },
  { src: "/images/plat-plein-ecran.png", alt: "Carte plein écran d'un plat" },
];

export function Carrousel({
  profil,
  compact,
}: {
  profil: "client" | "gerant" | undefined;
  compact?: boolean;
}) {
  const images = profil === "gerant" ? IMAGES_GERANT : IMAGES_CLIENT;

  return (
    <div className={`w-full -mx-1 ${compact ? "mb-3" : "mb-5"}`}>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-1 pb-1 no-scrollbar">
        {images.map((img) => (
          <div
            key={img.src}
            className={`relative shrink-0 aspect-[9/16] rounded-2xl overflow-hidden snap-start border border-[#1877F2]/20 shadow-[0_8px_24px_rgba(0,0,0,0.4)] ${
              compact ? "w-[26%] max-w-[92px]" : "w-[42%] max-w-[150px]"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={compact ? "120px" : "220px"}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
