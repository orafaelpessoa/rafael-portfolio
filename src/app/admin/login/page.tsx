"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/src/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          router.push("/admin");
        } catch (err2: any) {
          setError("Erro ao criar usuário: " + err2.message);
        }
      } else {
        setError("Erro ao fazer login: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg flex flex-col gap-4 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-purple-400 text-center">
          Login Admin
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-500 py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar / Cadastrar"}
        </button>
      </form>
    </div>
  );
}
