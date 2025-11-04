import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/lib/firebase";

export async function uploadImage(file: File, folder: string = "projects") {
  if (!file) throw new Error("Nenhum arquivo selecionado.");

  const fileRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  return url;
}
