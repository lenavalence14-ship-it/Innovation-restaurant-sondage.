-- Schéma du sondage "Modernisation de la restauration africaine"
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query > coller > Run

create table if not exists reponses (
  id uuid primary key default gen_random_uuid(),
  profil text not null check (profil in ('client', 'gerant')),
  reponses jsonb not null default '{}'::jsonb,
  complet boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  reponse_id uuid references reponses(id) on delete cascade,
  nom_restaurant text not null,
  contact text not null,
  ville text not null,
  created_at timestamptz not null default now()
);

-- RLS : on autorise l'insertion/mise à jour publique (le sondage est anonyme et public),
-- mais on bloque la lecture publique. Seule la clé service_role (utilisée uniquement
-- côté serveur, jamais exposée au client) peut lire les résultats pour l'admin.
alter table reponses enable row level security;
alter table leads enable row level security;

create policy "insertion publique reponses"
  on reponses for insert
  to anon
  with check (true);

create policy "mise a jour publique reponses"
  on reponses for update
  to anon
  using (true)
  with check (true);

create policy "insertion publique leads"
  on leads for insert
  to anon
  with check (true);

-- Pas de policy SELECT pour anon => lecture publique refusée par défaut.
-- L'admin lit via la clé service_role dans les routes API serveur.

create index if not exists idx_reponses_profil on reponses(profil);
create index if not exists idx_reponses_complet on reponses(complet);
