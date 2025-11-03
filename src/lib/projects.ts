import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Project } from "./types";


const projectsCollection = collection(db, "projects");

export const addProject = async (project: Omit<Project, "id" | "createdAt">) => {
  const docRef = await addDoc(projectsCollection, {
    ...project,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getProjects = async (): Promise<Project[]> => {
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Project, "id">),
  }));
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, data);
};

export const deleteProject = async (id: string) => {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
};
