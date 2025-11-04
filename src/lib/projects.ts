import { db, storage } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
}

const projectCollection = collection(db, "projects");

export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};

export const fetchProjects = async (): Promise<Project[]> => {
  const snapshot = await getDocs(projectCollection);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Project[];
};

export const addProject = async (project: Project) => {
  await addDoc(projectCollection, {
    ...project,
    createdAt: serverTimestamp(),
  });
};

export const deleteProject = async (id: string) => {
  const projectRef = doc(db, "projects", id);
  await deleteDoc(projectRef);
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  const projectRef = doc(db, "projects", id);
  await updateDoc(projectRef, { ...data, updatedAt: serverTimestamp() });
};
