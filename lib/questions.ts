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
  // Sous-texte descriptif (pour Q2, Q15...)
  description?: string;
  options?: ChoixOption[];
  // Affiche le carrousel d'images associé au profil courant
  avecCarrousel?: boolean;
  // Réduit la taille du carrousel — utile quand la question a une description
  // longue et/ou beaucoup d'options (ex: Q15), pour éviter que le contenu déborde de l'écran.
  carrouselCompact?: boolean;
  // Désactive le spacer qui pousse les options vers le bas — utile uniquement
  // pour les questions à contenu dense (ex: Q15) où ce spacer créerait un grand
  // vide entre la description et les options. Ne pas activer sur les questions
  // courtes (comme Q2), qui doivent garder leurs boutons en bas d'écran.
  collerOptionsApresDescription?: boolean;
  // Colle les options juste sous la description au lieu de les pousser en bas
  // de l'écran — utile sur les questions à contenu dense (ex: Q15).
  optionsCollees?: boolean;
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
    titre: "Tu es ?",
    options: [
      { id: "client", label: "🍽️ Un client qui va au restaurant pour manger." },
      { id: "gerant", label: "👨‍🍳 Gérant ou employé d'un restaurant." },
    ],
  },
  {
    id: "q2",
    section: "commune",
    type: "choix_unique",
    titre: "Lequel choisirais-tu ?",
    description:
      "Imagine que tu arrives dans deux restaurants proposant les mêmes plats, aux mêmes prix.\n\nDans le premier, tu consultes le menu sur ton téléphone grâce à un QR Code. Tu peux voir chaque plat en photo ou en vidéo plein écran comme sur TikTok et passer ta commande directement depuis ta table.\n\nDans le second, tu consultes un menu papier et la commande est prise par un serveur.",
    avecCarrousel: true,
    options: [
      { id: "numerique", label: "Le restaurant avec le menu numérique." },
      { id: "papier", label: "Le restaurant avec le menu papier." },
    ],
  },
  {
    id: "q3",
    section: "commune",
    type: "choix_unique",
    titre: "Quand tu vas au restaurant, attendre avant de pouvoir commander, c'est quelque chose qui t'arrive :",
    options: [
      { id: "tres_souvent", label: "Très souvent." },
      { id: "parfois", label: "Parfois." },
      { id: "rarement", label: "Rarement." },
      { id: "jamais", label: "Jamais." },
    ],
  },
  {
    id: "q4",
    section: "commune",
    type: "choix_unique",
    titre: "T'est-il déjà arrivé de quitter un restaurant avant de commander ?",
    options: [
      { id: "oui", label: "Oui." },
      { id: "non", label: "Non." },
    ],
  },
  {
    id: "q5",
    section: "commune",
    type: "choix_unique",
    titre: "Quelle était la principale raison ?",
    dependDe: "q4",
    valeursRequises: ["oui"],
    options: [
      { id: "attente", label: "L'attente." },
      { id: "menu_pas_envie", label: "Le menu ne m'a pas donné envie." },
      { id: "trop_rempli", label: "Le restaurant était trop rempli." },
      {
        id: "autre",
        label: "Autre :",
        texteConditionnel: true,
        placeholderTexte: "Précise",
      },
    ],
  },

  // ---------- SECTION CLIENT ----------
  {
    id: "q6",
    section: "client",
    type: "choix_unique",
    titre:
      "T'est-il déjà arrivé d'attendre un serveur juste pour poser une question sur un plat (composition, allergènes, niveau d'épices...) ?",
    options: [
      { id: "oui", label: "Oui." },
      { id: "non", label: "Non." },
    ],
  },
  {
    id: "q7",
    section: "client",
    type: "choix_unique",
    titre: "Quand tu choisis un plat, qu'est-ce qui peut t'aider le plus à prendre une décision ?",
    avecCarrousel: true,
    options: [
      { id: "photo_video", label: "Voir une photo ou une vidéo." },
      { id: "description", label: "Lire la description sur le menu." },
      { id: "serveur", label: "Demander conseil au serveur." },
    ],
  },
  {
    id: "q8",
    section: "client",
    type: "choix_unique",
    titre:
      "T'est-il déjà arrivé de ne pas commander un plat parce que tu ne savais pas vraiment à quoi il ressemblait ?",
    options: [
      { id: "oui", label: "Oui." },
      { id: "non", label: "Non." },
    ],
  },
  {
    id: "q9",
    section: "client",
    type: "choix_unique",
    titre: "Si tu pouvais consulter les avis des autres clients sur chaque plat avant de commander, tu les regarderais ?",
    options: [
      { id: "oui", label: "Oui." },
      { id: "non", label: "Non." },
      { id: "sais_pas", label: "Je ne sais pas." },
    ],
  },
  {
    id: "q10",
    section: "client",
    type: "choix_unique",
    titre: "Si un restaurant proposait un menu numérique comme celui présenté plus haut, serais-tu prêt à l'utiliser ?",
    options: [
      { id: "oui", label: "Oui." },
      { id: "non", label: "Non." },
      { id: "essayer_dabord", label: "J'aimerais d'abord l'essayer." },
    ],
  },
  {
    id: "q10_raison",
    section: "client",
    type: "texte_court",
    titre: "Pourquoi ?",
    dependDe: "q10",
    valeursRequises: ["non"],
  },

  // ---------- SECTION GÉRANT / PROPRIÉTAIRE ----------
  {
    id: "q11",
    section: "gerant",
    type: "choix_unique",
    titre: "À quelle fréquence des clients repartent sans commander dans ton restaurant ?",
    options: [
      { id: "jamais", label: "Jamais." },
      { id: "rarement", label: "Rarement." },
      { id: "souvent", label: "Souvent." },
      { id: "tres_souvent", label: "Très souvent." },
    ],
  },
  {
    id: "q12",
    section: "gerant",
    type: "choix_unique",
    titre: "D'après toi, quelle est la raison principale ?",
    options: [
      { id: "attente", label: "L'attente." },
      { id: "menu_pas_envie", label: "Le menu ne donne pas assez envie." },
      { id: "prix", label: "Les prix." },
      { id: "trop_monde", label: "Trop de monde." },
      {
        id: "autre",
        label: "Autre :",
        texteConditionnel: true,
        placeholderTexte: "Précise",
      },
    ],
  },
  {
    id: "q13",
    section: "gerant",
    type: "choix_unique",
    titre: "T'arrive-t-il de modifier ton menu (prix, nouveaux plats, ruptures...) ?",
    options: [
      { id: "souvent", label: "Souvent." },
      { id: "de_temps_en_temps", label: "De temps en temps." },
      { id: "rarement", label: "Rarement." },
    ],
  },
  {
    id: "q14",
    section: "gerant",
    type: "texte_court",
    titre: "En moyenne, combien dépenses-tu chaque mois pour imprimer ou réimprimer tes menus ?",
  },
  {
    id: "q15",
    section: "gerant",
    type: "choix_unique",
    titre: "Qu'est-ce qui te ferait encore hésiter à utiliser ce système ?",
    description:
      "Imagine maintenant que ton restaurant dispose d'un système qui permet :\n\n– aux clients de consulter ton menu sur leur téléphone ;\n– de présenter chaque plat en photo ou en vidéo plein écran ;\n– de recevoir les commandes directement depuis les tables ;\n– de modifier ton menu à tout moment sans réimpression ;\n– de suivre les plats les plus consultés et les plus commandés sans demander aux clients.",
    avecCarrousel: false,
    collerOptionsApresDescription: true,
    optionsCollees: true,
    options: [
      { id: "rien", label: "Rien." },
      { id: "prix", label: "Le prix." },
      { id: "prefere_papier", label: "Je préfère le menu papier." },
      {
        id: "autre",
        label: "Autre :",
        texteConditionnel: true,
        placeholderTexte: "Précise",
      },
    ],
  },
  {
    id: "q16",
    section: "gerant",
    type: "choix_unique",
    titre: "Si cette solution était disponible aujourd'hui à un tarif adapté à ton restaurant, serais-tu intéressé ?",
    options: [
      { id: "oui", label: "Oui." },
      { id: "peut_etre", label: "Peut-être." },
      { id: "non", label: "Non." },
    ],
  },
  {
    id: "q16_raisons",
    section: "gerant",
    type: "choix_unique",
    titre: "Quelle est la principale raison ?",
    dependDe: "q16",
    valeursRequises: ["non", "peut_etre"],
    options: [
      { id: "prix", label: "Le prix." },
      { id: "pas_interet", label: "Je ne vois pas encore l'intérêt." },
      { id: "complique", label: "Ça me paraît compliqué." },
      { id: "clients_papier", label: "Mes clients préfèrent le papier." },
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
    titre: "Tu fais partie des premiers restaurateurs intéressés.",
    description:
      "Les premiers inscrits seront contactés en priorité pour tester la solution et bénéficier des conditions de lancement.",
    dependDe: "q16",
    valeursRequises: ["oui"],
    champs: [
      { id: "nom_restaurant", label: "Nom du restaurant" },
      { id: "contact", label: "Numéro / WhatsApp" },
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

  // Filtre les questions conditionnelles selon la réponse à leur dépendance
  return toutes.filter((q) => {
    if (!q.dependDe) return true;
    const valeur = reponses[q.dependDe];
    return q.valeursRequises?.includes(valeur);
  });
}
