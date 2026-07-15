// Données et logique du mini-test viral "Ton niveau d'exigence au restaurant".
// Indépendant du sondage principal — voir cahier des charges "Mini-test viral après sondage principal".

export type Dimension = "patience" | "qualite" | "service" | "presentation" | "fiabilite";

export type OptionMiniTest = {
  id: string;
  emoji: string;
  texte: string;
  // Points attribués à la dimension de la question (0-100, "intensité")
  points: number;
};

export type QuestionMiniTest = {
  id: string;
  dimension: Dimension;
  titre: string;
  options: OptionMiniTest[];
};

export const QUESTIONS_MINI_TEST: QuestionMiniTest[] = [
  {
    id: "mt1",
    dimension: "patience",
    titre: "Ta commande met le double du temps annoncé. Tu fais quoi ?",
    options: [
      { id: "attend", emoji: "😌", texte: "J'attends, c'est pas grave", points: 30 },
      { id: "check_heure", emoji: "👀", texte: "Je commence à checker l'heure toutes les 2 min", points: 65 },
      { id: "part", emoji: "🚪", texte: "Je demande l'addition et je pars", points: 100 },
    ],
  },
  {
    id: "mt2",
    dimension: "qualite",
    titre: "Le plat arrive : correct, sans plus. Tu réagis comment ?",
    options: [
      { id: "ca_passe", emoji: "🤷", texte: "Ça passe, j'ai mangé", points: 30 },
      { id: "reviendra_pas", emoji: "😐", texte: "Je finis mais je reviendrai pas", points: 65 },
      { id: "dit_serveur", emoji: "🙅", texte: "Je le dis direct au serveur", points: 100 },
    ],
  },
  {
    id: "mt3",
    dimension: "service",
    titre: "Le plat est excellent, mais le serveur t'a limite ignoré toute la soirée. Ton avis sur le resto ?",
    options: [
      { id: "osef", emoji: "🍽️", texte: "Osef, la bouffe était top", points: 30 },
      { id: "gache", emoji: "😕", texte: "Ça gâche un peu l'expérience", points: 65 },
      { id: "note_mal", emoji: "🚫", texte: "Je note en mal, le service c'est la moitié de l'expérience", points: 100 },
    ],
  },
  {
    id: "mt4",
    dimension: "presentation",
    titre: "Deux plats identiques en goût. L'un est juste posé dans l'assiette, l'autre est dressé comme sur Instagram. Ça change quoi pour toi ?",
    options: [
      { id: "rien_gout", emoji: "🍲", texte: "Rien, seul le goût compte", points: 30 },
      { id: "donne_envie", emoji: "📸", texte: "Ça donne plus envie, clairement", points: 65 },
      { id: "choisis_style", emoji: "✨", texte: "Je choisis celui qui est stylé, direct", points: 100 },
    ],
  },
  {
    id: "mt5",
    dimension: "fiabilite",
    titre: "Le menu annonçait un plat \"épicé\", il arrive fade. Ça te fait quoi ?",
    options: [
      { id: "pas_grave", emoji: "😅", texte: "Bon bah c'est pas grave", points: 30 },
      { id: "agace", emoji: "🤨", texte: "Ça m'agace un peu, fallait être honnête", points: 65 },
      { id: "casse_confiance", emoji: "❌", texte: "Ça casse complètement ma confiance dans le menu", points: 100 },
    ],
  },
];

export type ScoresMiniTest = {
  patience: number;
  qualite: number;
  service: number;
  presentation: number;
  fiabilite: number;
};

export type ProfilMiniTest = {
  id: string;
  etoiles: number; // 1 à 5
  nom: string;
  emoji: string;
  description: string;
  seuilMin: number;
  seuilMax: number;
};

export const PROFILS_MINI_TEST: ProfilMiniTest[] = [
  {
    id: "detendu",
    etoiles: 1,
    nom: "Client détendu",
    emoji: "💆🏽",
    seuilMin: 0,
    seuilMax: 40,
    description:
      "Toi, tu vas au resto pour manger, pas pour disséquer chaque détail. Attente un peu longue ? Pas grave. Présentation moyenne ? Osef, tant que c'est bon. Tu es probablement la personne la plus reposante à inviter au restaurant — zéro drame, juste envie de passer un bon moment.",
  },
  {
    id: "attentif",
    etoiles: 2,
    nom: "Client attentif",
    emoji: "🧘🏽",
    seuilMin: 41,
    seuilMax: 55,
    description:
      "Tu remarques les choses, sans en faire un plat (sans mauvais jeu de mots). Un service un peu lent te chiffonne, une présentation soignée te fait sourire — mais tu ne vas pas gâcher ta soirée pour ça. Équilibré, sans prise de tête.",
  },
  {
    id: "selectif",
    etoiles: 3,
    nom: "Client sélectif",
    emoji: "💁🏽",
    seuilMin: 56,
    seuilMax: 70,
    description:
      "Toi, tu compares. Le menu, les avis, la déco — tu prends tout en compte avant de te décider. Une fois sur place, tu sais vite si ça vaut le coup ou pas. Les restaurateurs qui bossent bien, c'est toi qui les repères en premier.",
  },
  {
    id: "exigeant",
    etoiles: 4,
    nom: "Client exigeant",
    emoji: "🙎🏽",
    seuilMin: 71,
    seuilMax: 85,
    description:
      "La qualité globale de l'expérience, c'est non-négociable pour toi. Un bon plat ne suffit pas si le service est nul, et l'inverse non plus. Tu remarques tout — et tu n'as aucun problème à le faire savoir.",
  },
  {
    id: "expert",
    etoiles: 5,
    nom: "Expert des bonnes adresses",
    emoji: "🧏🏽",
    seuilMin: 86,
    seuilMax: 100,
    description:
      "Toi, t'as un radar. Tu sais reconnaître un bon resto avant même d'avoir goûté quoi que ce soit — l'ambiance, le service, le menu, tout compte. Tes potes te demandent toujours \"on va où ce soir ?\" — et ils ont raison de le faire.",
  },
];

// Libellé court "ce qui compte le plus pour toi" par dimension — déduit au moment du calcul (point validé : déduction directe).
const LIBELLE_DIMENSION: Record<Dimension, { emoji: string; texte: string }> = {
  patience: { emoji: "⏱️", texte: "Un service rapide" },
  qualite: { emoji: "🔥", texte: "Qualité des plats" },
  service: { emoji: "🤝", texte: "L'attitude du personnel" },
  presentation: { emoji: "📸", texte: "La présentation des plats" },
  fiabilite: { emoji: "📈", texte: "Informations fiables" },
};

const LIBELLE_TOLERANCE: Record<Dimension, string> = {
  patience: "L'attente",
  qualite: "La qualité des plats",
  service: "Le service",
  presentation: "La présentation",
  fiabilite: "La fiabilité des informations",
};

export function calculerScoreGlobal(scores: ScoresMiniTest): number {
  const somme =
    scores.patience + scores.qualite + scores.service + scores.presentation + scores.fiabilite;
  return Math.round(somme / 5);
}

export function trouverProfil(scoreGlobal: number): ProfilMiniTest {
  const profil = PROFILS_MINI_TEST.find(
    (p) => scoreGlobal >= p.seuilMin && scoreGlobal <= p.seuilMax
  );
  // Filet de sécurité : un score de 100 pile doit tomber dans "expert", jamais undefined.
  return profil ?? PROFILS_MINI_TEST[PROFILS_MINI_TEST.length - 1];
}

// Retourne les 2 dimensions dominantes (scores les plus hauts), pour "ce qui compte le plus pour toi".
export function dimensionsDominantes(scores: ScoresMiniTest): { emoji: string; texte: string }[] {
  const entrees = Object.entries(scores) as [Dimension, number][];
  const triees = [...entrees].sort((a, b) => b[1] - a[1]);
  return triees.slice(0, 2).map(([dim]) => LIBELLE_DIMENSION[dim]);
}

// Retourne la dimension la plus basse (point de tolérance), générée dynamiquement (point validé).
export function pointDeTolerance(scores: ScoresMiniTest): string {
  const entrees = Object.entries(scores) as [Dimension, number][];
  const [dimMinKey] = entrees.sort((a, b) => a[1] - b[1])[0];
  return LIBELLE_TOLERANCE[dimMinKey];
}
