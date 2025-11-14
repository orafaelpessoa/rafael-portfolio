import { supabase } from "./supabase";

export interface Project {
  id?: string;
  title: string;
  description: string;
  image_url?: string;            // imagem principal
  images_url?: string[] | null;  // array de imagens extras
  github_url?: string | null;
  live_url?: string | null;
  created_at?: string;
}

/* ---------------------------------------------------------
   UPLOAD DE 1 IMAGEM
--------------------------------------------------------- */
export const uploadImage = async (file: File): Promise<string> => {
  const filePath = `projects/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-storage")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("portfolio-storage")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

/* ---------------------------------------------------------
   UPLOAD DE VÁRIAS IMAGENS (array)
--------------------------------------------------------- */
export const uploadMultipleImages = async (
  files: File[]
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const url = await uploadImage(file);
    uploadedUrls.push(url);
  }

  return uploadedUrls;
};

/* ---------------------------------------------------------
   BUSCA DE PROJETOS (já no novo padrão)
--------------------------------------------------------- */
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, image_url, images_url, github_url, live_url, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
};

/* ---------------------------------------------------------
   ADICIONAR PROJETO (compatível com as novas colunas)
--------------------------------------------------------- */
export const addProject = async (project: Project) => {
  const { error } = await supabase.from("projects").insert([
    {
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      images_url: project.images_url || null,
      github_url: project.github_url || null,
      live_url: project.live_url || null,
    },
  ]);

  if (error) throw error;
};

/* ---------------------------------------------------------
   DELETAR PROJETO
--------------------------------------------------------- */
export const deleteProject = async (id: string) => {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
};

/* ---------------------------------------------------------
   ATUALIZAR PROJETO
--------------------------------------------------------- */
export const updateProject = async (id: string, data: Partial<Project>) => {
  const { error } = await supabase
    .from("projects")
    .update({
      ...data,
      image_url: data.image_url,
      images_url: data.images_url,
      github_url: data.github_url,
      live_url: data.live_url,
    })
    .eq("id", id);

  if (error) throw error;
};
