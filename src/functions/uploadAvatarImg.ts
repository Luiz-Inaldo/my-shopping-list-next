import { supabase } from "@/lib/api";

export async function uploadAvatar(file: File, userId: string) {
  const { data, error } = await supabase.storage
    .from("profile-imgs")
    .upload(`${userId}/profile.jpg`, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("profile-imgs")
    .getPublicUrl(`${userId}/profile.jpg`);

  return urlData.publicUrl;
}
