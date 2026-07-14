import { createClient } from "@supabase/supabase-js";

// N'importer ce fichier que dans du code serveur (route handlers API, jamais dans un composant "use client").
// SUPABASE_SERVICE_ROLE_KEY contourne le Row Level Security : elle ne doit jamais être préfixée NEXT_PUBLIC_
// et ne doit jamais atteindre le bundle envoyé au navigateur.
export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
