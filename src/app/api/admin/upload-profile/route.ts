// src/app/api/admin/upload-profile/route.ts
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in env");
}

// cliente usado apenas para verificar token (anon)
// (não eleva privilégios)
const supabaseClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// cliente com service role (APENAS SERVER)
const supabaseServer = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: Request) {
  try {
    // 1) extrai token bearer enviado pelo client
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2) valida token com cliente anon (supabase.auth.getUser)
    const { data: userData, error: userErr } = await supabaseClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = userData.user.id;

    // 3) pega multipart/form-data -> arquivo
    const form = await req.formData();
    const file = form.get("file") as Blob | null;
    const folder = (form.get("folder") as string) || "profile";
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // convert Blob -> ArrayBuffer -> Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileNameRaw = (form.get("filename") as string) || `profile_${Date.now()}`;
    const ext = (file as any).type ? file.type.split("/").pop() : "jpg";
    const filePath = `${folder}/${userId}_${Date.now()}.${ext}`;

    // 4) upload via service role (ignora RLS do storage)
    const { error: uploadError } = await supabaseServer.storage
      .from("profile-images") // <= ajuste para o nome do seu bucket exato
      .upload(filePath, buffer, {
        contentType: (file as any).type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("uploadError", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 5) cria URL pública (ou Signed URL se privado)
    const { data: urlData } = supabaseServer.storage.from("profile-images").getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl ?? null;

    // 6) grava/atualiza a tabela profile com upsert usando service role
    // garante que o registro do usuário (id) existe e tem avatar_url
    const { error: upsertErr } = await supabaseServer
      .from("profile")
      .upsert({ id: userId, avatar_url: publicUrl }, { onConflict: "id" });

    if (upsertErr) {
      console.error("upsertErr", upsertErr);
      return NextResponse.json({ error: upsertErr.message }, { status: 500 });
    }

    return NextResponse.json({ avatar_url: publicUrl });
  } catch (err: any) {
    console.error("API upload profile error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
