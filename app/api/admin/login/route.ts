import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

export async function POST(req: NextRequest) {
  const { motDePasse } = await req.json();
  const attendu = process.env.ADMIN_PASSWORD;

  if (!attendu) {
    return NextResponse.json(
      { erreur: "ADMIN_PASSWORD non configuré côté serveur." },
      { status: 500 }
    );
  }

  if (motDePasse !== attendu) {
    return NextResponse.json({ erreur: "Mot de passe incorrect." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "valide", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });

  return NextResponse.json({ ok: true });
}
