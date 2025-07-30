"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/"); // Redirect to home or dashboard
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-700">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 border rounded-md"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full px-4 py-3 border rounded-md"
      />
      {error && <div className="text-red-600 text-center">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="text-center mt-2">
        <a href="/signup" className="text-blue-600 hover:underline">Don't have an account? Sign up</a>
      </div>
    </form>
  );
}
