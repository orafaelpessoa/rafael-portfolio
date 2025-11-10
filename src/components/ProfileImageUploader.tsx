"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { uploadProfileImage, updateUserAvatar } from "@/src/lib/profile";

export default function ProfileImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setPreview(URL.createObjectURL(file));

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const publicUrl = await uploadProfileImage(file);
      await updateUserAvatar(user.id, publicUrl);

      alert("Foto de perfil atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar foto de perfil:", err);
      alert("Falha ao atualizar foto de perfil.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <label className="cursor-pointer bg-purple-600 px-4 py-2 rounded text-white hover:bg-purple-700 transition">
        {uploading ? "Enviando..." : "Alterar Foto de Perfil"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
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
