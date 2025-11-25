import { supabase } from "./supabase-client";

export interface Project {
  id?: string;
  title: string;
  description?: string;
  image_url?: string | null;        // Imagem principal
  gallery_images?: string[] | null;  // Galeria opcional
  github_url?: string | null;
  live_url?: string | null;
  created_at?: string;
}

/* ---------------------------------------------------------
   UPLOAD DE UMA IMAGEM
--------------------------------------------------------- */
export const uploadImage = async (file: File): Promise<string> => {
  const filePath = `projects/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-storage")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("portfolio-storage")
    .getPublicUrl(filePath);

  if (!data?.publicUrl) throw new Error("Erro ao obter URL pública da imagem");

  return data.publicUrl;
};

/* ---------------------------------------------------------
   UPLOAD DE VÁRIAS IMAGENS
--------------------------------------------------------- */
export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  const uploaded: string[] = [];

  for (const file of files) {
    const url = await uploadImage(file);
    uploaded.push(url);
  }

  return uploaded;
};

/* ---------------------------------------------------------
   BUSCAR PROJETOS
--------------------------------------------------------- */
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      description,
      image_url,
      gallery_images,
      github_url,
      live_url,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
};

/* ---------------------------------------------------------
   ADICIONAR PROJETO
--------------------------------------------------------- */
export const addProject = async (project: Project) => {
  const { error } = await supabase.from("projects").insert([
    {
      title: project.title,
      description: project.description,
      image_url: project.image_url || null,
      gallery_images: project.gallery_images || null,
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
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.image_url !== undefined && { image_url: data.image_url }),
      ...(data.gallery_images !== undefined && { gallery_images: data.gallery_images }),
      ...(data.github_url !== undefined && { github_url: data.github_url }),
      ...(data.live_url !== undefined && { live_url: data.live_url }),
    })
    .eq("id", id);

  if (error) throw error;
};
