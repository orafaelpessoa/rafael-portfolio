import { supabase } from "./supabase";

export async function uploadProfileImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-images") 
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("projects").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function updateUserAvatar(userId: string, imageUrl: string) {
  const { error } = await supabase
    .from("profile")
    .upsert({ id: userId, image_url: imageUrl });

  if (error) throw error;
}
