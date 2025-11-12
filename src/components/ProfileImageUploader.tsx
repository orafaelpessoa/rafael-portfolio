// src/components/ProfileImageUploader.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function ProfileImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setPreview(URL.createObjectURL(file));

      // pega session / token do usuário atual
      const { data: sessionData } = await supabase.auth.getSession();
      const access_token = sessionData?.session?.access_token;
      if (!access_token) throw new Error("Usuário não autenticado");

      // envia para nosso endpoint server-side
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);
      formData.append("folder", "profile");

      const res = await fetch("/api/admin/upload-profile", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) {
        console.error("Erro ao atualizar foto de perfil:", result);
        alert("Falha ao atualizar foto de perfil.");
        return;
      }

      alert("Foto de perfil atualizada com sucesso!");
      // opcional: atualizar UI global (recarregar dados do profile)
    } catch (err) {
      console.error("Erro ao atualizar foto de perfil:", err);
      alert("Falha ao atualizar foto de perfil.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <label className="cursor-pointer bg-purple-600 px-4 py-2 rounded text-white hover:bg-purple-700 transition">
        {uploading ? "Enviando..." : "Alterar Foto de Perfil"}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 rounded-full object-cover border border-gray-600"
        />
      )}
    </div>
  );
}
