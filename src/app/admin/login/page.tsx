"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else if (data.user) {
      router.push("/admin/dashboard");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <motion.form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-purple-400 mb-4 text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="E-mail"
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-500 py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Login"}
        </button>
      </motion.form>
    </section>
  );
}
