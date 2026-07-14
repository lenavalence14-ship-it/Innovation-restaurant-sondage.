# Sondage — Modernisation de la restauration africaine

Sondage mobile plein écran, swipe vertical façon TikTok, avec branchement
Client / Gérant et espace admin protégé par mot de passe.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind
- Supabase (Postgres) pour stocker les réponses et les leads
- Vercel pour l'hébergement

## 1. Mettre le code sur GitHub

```bash
cd resto-sondage
git init
git add .
git commit -m "Sondage restauration africaine"
```

Crée un repo vide sur GitHub (ne coche aucune case d'initialisation : pas de
README, pas de .gitignore, pas de licence — le projet les a déjà), puis :

```bash
git remote add origin https://github.com/TON_USER/TON_REPO.git
git branch -M main
git push -u origin main
```

## 2. Créer le projet Supabase

1. Va sur https://supabase.com, crée un nouveau projet.
2. Une fois créé, va dans **SQL Editor** > **New query**.
3. Colle tout le contenu de `supabase/schema.sql` et clique **Run**.
   Ça crée les tables `reponses` et `leads`, avec la sécurité (RLS) déjà
   configurée : le public peut écrire mais pas lire, seul l'admin peut lire.
4. Va dans **Project Settings > API**, note ces 3 valeurs :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (secrète, jamais
     dans le code, jamais dans un commit — uniquement dans les variables
     d'environnement Vercel)

## 3. Déployer sur Vercel

1. Va sur https://vercel.com, **Add New > Project**, importe ton repo GitHub.
2. Avant de cliquer Deploy, ouvre **Environment Variables** et ajoute :

   | Nom | Valeur |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | (depuis Supabase) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (depuis Supabase) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (depuis Supabase) |
   | `ADMIN_PASSWORD` | `Gédéonsondage` |

3. Clique **Deploy**.

Chaque `git push` sur `main` redéploie automatiquement.

## Utilisation

- Lien public du sondage : `https://ton-projet.vercel.app`
- Espace admin (résultats) : `https://ton-projet.vercel.app/admin`
  → mot de passe : celui défini dans `ADMIN_PASSWORD`

## Modifier le mot de passe admin plus tard

Vercel > ton projet > Settings > Environment Variables > modifie
`ADMIN_PASSWORD` > redéploie (Deployments > ⋯ > Redeploy).

## Développement local

```bash
npm install
cp .env.example .env.local   # puis remplis les vraies valeurs
npm run dev
```
