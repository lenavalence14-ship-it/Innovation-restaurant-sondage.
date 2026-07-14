// Questions du sondage — contenu verbatim, ne pas reformuler.
// "commune" = vue par tout le monde. "client" / "gerant" = vue seulement par ce profil.

export type Profil = "client" | "gerant";

export type ChoixOption = {
  id: string;
  label: string;
  // Si true, un champ texte libre apparaît sous cette option quand elle est sélectionnée.
  texteConditionnel?: boolean;
  placeholderTexte?: string;
};

export type Question = {
  id: string;
  section: "commune" | "client" | "gerant";
  type: "choix_unique" | "texte_court" | "champs_lead";
  titre: string;
  // Sous-texte descriptif (pour Q2, Q5, Q15...)
  description?: string;
  options?: ChoixOption[];
  // Affiche le carrousel d'images associé au profil courant
  avecCarrousel?: boolean;
  // Cette question n'apparaît que si la réponse à `dependDe` vaut une des `valeursRequises`
  dependDe?: string;
  valeursRequises?: string[];
  champs?: { id: string; label: string }[];
};

export const QUESTIONS: Question[] = [
  // ---------- SECTION COMMUNE ----------
  {
    id: "q1",
    section: "commune",
    type: "choix_unique",
    titre:
      "Tu es devant un restaurant. Tu y entres pour manger, ou c'est toi qui gères la salle ?",
    options: [
      { id: "client", label: "J'y vais pour manger" },
      { id: "gerant", label: "C'est mon resto, ou j'y travaille" },
    ],
  },
  {
    id: "q2",
    section: "commune",
    type: "choix_unique",
    titre:
      "Tu scannes un code QR sur la table. Le menu s'ouvre en plein écran, tu défiles comme sur TikTok, chaque plat en vidéo, et ta commande part directement à la cuisine dès que tu valides. À côté, y'a un resto avec le menu papier classique, où tu dois attendre le serveur des dizaines de minutes avant même de commander. Tu vas où ce soir ?",
    avecCarrousel: true,
    options: [
      { id: "tiktok", label: "Le resto avec le menu comme sur TikTok" },
      { id: "papier", label: "Le resto avec le menu papier" },
    ],
  },
  {
    id: "q3",
    section: "commune",
    type: "choix_unique",
    titre:
      "La dernière fois que t'as attendu plus de 10 minutes juste pour qu'on prenne ta commande, c'était :",
    options: [
      { id: "semaine", label: "Cette semaine" },
      { id: "mois", label: "Ce mois" },
      { id: "longtemps", label: "Ça fait longtemps" },
      { id: "jamais", label: "Ça m'arrive jamais" },
    ],
  },
  {
    id: "q4a",
    section: "commune",
    type: "choix_unique",
    titre:
      "Ça t'est déjà arrivé de te lever et partir d'un resto parce que t'attendais trop pour commander ?",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
  },
  {
    id: "q4b",
    section: "commune",
    type: "choix_unique",
    titre:
      "Ça t'est déjà arrivé de regarder un menu papier, rien ne te donne envie, et te dire \"je reviendrai pas ici\" ?",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
  },
  {
    id: "q5",
    section: "commune",
    type: "choix_unique",
    titre:
      "Deux restos, même quartier, mêmes plats, même prix. Un avec un menu comme sur TikTok où tu commandes direct sans attendre personne, l'autre avec le menu papier classique où tu dois attendre le serveur des dizaines de minutes. Tu choisis lequel ?",
    avecCarrousel: true,
    options: [
      { id: "tiktok", label: "Le menu comme sur TikTok" },
      { id: "papier", label: "Le menu papier" },
    ],
  },

  // ---------- SECTION CLIENT ----------
  {
    id: "q6",
    section: "client",
    type: "choix_unique",
    titre:
      "T'as déjà voulu savoir si un plat était trop épicé ou s'il contenait un allergène, et t'as dû attendre le serveur pour demander ?",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
  },
  {
    id: "q7",
    section: "client",
    type: "choix_unique",
    titre:
      "Tu sors en groupe, personne n'arrive à se décider. Ça irait plus vite avec une vidéo de chaque plat sur le téléphone, ou avec tout le monde qui se bat sur la même feuille papier ?",
    avecCarrousel: true,
    options: [
      { id: "video", label: "Avec la vidéo" },
      { id: "papier", label: "Avec le papier" },
    ],
  },
  {
    id: "q8a",
    section: "client",
    type: "choix_unique",
    titre:
      "T'as déjà commandé un plat en pensant que c'était autre chose, juste parce que le nom sur le papier prêtait à confusion ?",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
  },
  {
    id: "q8b",
    section: "client",
    type: "choix_unique",
    titre:
      "T'as déjà voulu commander un plat, mais t'as pas osé, parce que tu savais pas à quoi ça allait ressembler ?",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
  },
  {
    id: "q9",
    section: "client",
    type: "choix_unique",
    titre:
      "Si tu pouvais voir les avis d'autres clients sur un plat avant de commander, tu regarderais ?",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
      { id: "savais_pas", label: "Je savais même pas que ça pouvait exister" },
    ],
  },
  {
    id: "q10",
    section: "client",
    type: "choix_unique",
    titre:
      "Avec ce menu comme sur TikTok, où ta commande part direct sans attendre le serveur :",
    options: [
      { id: "pret", label: "Je serais prêt à l'utiliser" },
      { id: "non_interesse", label: "Non, ça ne m'intéresse pas" },
      {
        id: "non_raison",
        label: "Non, à cause de :",
        texteConditionnel: true,
        placeholderTexte: "Dis-nous pourquoi",
      },
    ],
  },

  // ---------- SECTION GÉRANT / PROPRIÉTAIRE ----------
  {
    id: "q11a",
    section: "gerant",
    type: "choix_unique",
    titre:
      "Des clients qui repartent sans commander parce qu'ils ont trop attendu ?",
    options: [
      { id: "jamais", label: "Jamais" },
      { id: "rarement", label: "Rarement" },
      { id: "souvent", label: "Souvent" },
      { id: "tres_souvent", label: "Très souvent" },
    ],
  },
  {
    id: "q11b",
    section: "gerant",
    type: "choix_unique",
    titre:
      "Des clients qui repartent parce que ton menu papier les a pas convaincus ?",
    options: [
      { id: "jamais", label: "Jamais" },
      { id: "rarement", label: "Rarement" },
      { id: "souvent", label: "Souvent" },
      { id: "tres_souvent", label: "Très souvent" },
    ],
  },
  {
    id: "q12",
    section: "gerant",
    type: "choix_unique",
    titre:
      "Un client qui hésite devant ton menu en papier, sans photo pour se décider, et qui finit par ne pas commander le plat — ça t'est déjà arrivé de le remarquer ?",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
  },
  {
    id: "q13",
    section: "gerant",
    type: "choix_unique",
    titre: "Ton menu, tu le changes souvent (nouveau plat, prix, rupture) ?",
    options: [
      { id: "souvent", label: "Souvent" },
      { id: "de_temps_en_temps", label: "De temps en temps" },
      { id: "presque_jamais", label: "Presque jamais" },
    ],
  },
  {
    id: "q14",
    section: "gerant",
    type: "texte_court",
    titre: "Combien tu dépenses par mois rien qu'en impression de menu ?",
  },
  {
    id: "q15",
    section: "gerant",
    type: "choix_unique",
    titre: "Avec ce système :",
    description:
      "Les commandes des clients arrivent directement chez toi depuis l'application. Ton serveur n'a plus besoin d'aller demander à chaque table. Plus aucun client ne part faute d'attente. Tu ajoutes, modifies, retires ou désactives un plat toi-même en un clic. Tu vois combien de fois chaque plat est regardé et commandé. Tu vois quel plat les gens regardent beaucoup mais commandent peu. Le système te suggère des changements à partir de ces données. Qu'est-ce qui te dérangerait encore ?",
    avecCarrousel: true,
    options: [
      { id: "rien", label: "Rien, ça me va" },
      {
        id: "oui_derange",
        label: "Oui, ce qui me dérange :",
        texteConditionnel: true,
        placeholderTexte: "Dis-nous ce qui te dérange",
      },
    ],
  },
  {
    id: "q16",
    section: "gerant",
    type: "choix_unique",
    titre: "Après tout ça, qu'est-ce que tu en penses pour ton resto ?",
    options: [
      { id: "oui", label: "Oui, je le veux pour mon resto" },
      { id: "non", label: "Non" },
    ],
  },
  {
    id: "q16_raisons",
    section: "gerant",
    type: "choix_unique",
    titre: "À cause de :",
    dependDe: "q16",
    valeursRequises: ["non"],
    options: [
      { id: "prix", label: "Le prix" },
      { id: "complique", label: "Trop compliqué à gérer" },
      { id: "clients_papier", label: "Mes clients sont habitués au papier" },
      {
        id: "autre",
        label: "Autre :",
        texteConditionnel: true,
        placeholderTexte: "Précise",
      },
    ],
  },
  {
    id: "q17",
    section: "gerant",
    type: "champs_lead",
    titre:
      "Tu fais partie des premiers à dire oui. Les premiers inscrits seront les premiers contactés pour l'installation lors de l'ouverture de la plateforme.",
    dependDe: "q16",
    valeursRequises: ["oui"],
    champs: [
      { id: "nom_restaurant", label: "Nom du restaurant" },
      { id: "contact", label: "Ton numéro ou WhatsApp" },
      { id: "ville", label: "Ville" },
    ],
  },
];

// Construit le parcours réel de questions en fonction des réponses déjà données.
export function parcours(reponses: Record<string, any>): Question[] {
  const profil: Profil | undefined = reponses["q1"];
  const communes = QUESTIONS.filter((q) => q.section === "commune");

  if (!profil) return [QUESTIONS[0]];

  const suite = QUESTIONS.filter((q) => q.section === profil);

  const toutes = [...communes, ...suite];

  // Filtre les questions conditionnelles (q16_raisons, q17) selon la réponse à leur dépendance
  return toutes.filter((q) => {
    if (!q.dependDe) return true;
    const valeur = reponses[q.dependDe];
    return q.valeursRequises?.includes(valeur);
  });
}
