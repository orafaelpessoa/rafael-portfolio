import { supabase } from "./supabase";

export async function uploadProfileImage(file: File) {
  const filePath = `profile/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("portfolio-storage")
    .upload(filePath, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("portfolio-storage")
    .getPublicUrl(filePath);

  return urlData?.publicUrl || "";
}

export async function updateUserAvatar(userId: string, avatarUrl: string) {
  const { error } = await supabase
    .from("profile")
    .upsert({ user_id: userId, avatar_url: avatarUrl });

  if (error) throw error;
}
