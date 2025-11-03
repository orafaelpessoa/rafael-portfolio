"use client";

import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
}

export default function AdminPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const snap = await getDocs(collection(db, "projetos"));
        const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Projeto[];
        setProjetos(lista);
      } catch (err) {
        console.error("Erro ao carregar projetos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjetos();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-8">Projetos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetos.map((p) => (
          <div key={p.id} className="bg-neutral-900 p-6 rounded-lg shadow-md">
            <img
              src={p.imagem}
              alt={p.titulo}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold text-purple-400">{p.titulo}</h3>
            <p className="text-gray-300 mt-2">{p.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
