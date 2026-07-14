import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (session?.value !== "valide") {
    return NextResponse.json({ erreur: "Non autorisé." }, { status: 401 });
  }

  const supabase = supabaseServer();

  const { data: reponses, error: erreurReponses } = await supabase
    .from("reponses")
    .select("*")
    .order("created_at", { ascending: false });

  if (erreurReponses) {
    return NextResponse.json({ erreur: erreurReponses.message }, { status: 500 });
  }

  const { data: leads, error: erreurLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (erreurLeads) {
    return NextResponse.json({ erreur: erreurLeads.message }, { status: 500 });
  }

  return NextResponse.json({ reponses, leads });
}
