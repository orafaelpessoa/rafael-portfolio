// src/app/api/admin/upload-profile/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase-client";   // client anon
import { supabaseServer } from "@/src/lib/supabase-server.ts";   // service role

export async function POST(req: Request) {
  try {
    // 1) Extrai o token Bearer enviado pelo client
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Valida token COM O CLIENTE ANON
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;

    // 3) Pega multipart/form-data e extrai o arquivo
    const form = await req.formData();
    const file = form.get("file") as Blob | null;
    const folder = (form.get("folder") as string) || "profile";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // converte Blob -> Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = (file as any).type ? file.type.split("/").pop() : "jpg";
    const filePath = `${folder}/${userId}_${Date.now()}.${ext}`;

    // 4) Upload com SERVICE ROLE (ignora RLS)
    const { error: uploadError } = await supabaseServer.storage
      .from("profile-images") // <-- confirme o nome do bucket
      .upload(filePath, buffer, {
        contentType: (file as any).type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("uploadError", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 5) URL pública (ou signed URL se privado)
    const { data: urlData } =
      supabaseServer.storage.from("profile-images").getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl ?? null;

    // 6) Upsert na tabela `profile`
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
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
