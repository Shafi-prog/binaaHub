"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-700">Sign Up</h2>
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
      {success && <div className="text-green-600 text-center">Signup successful! Redirecting...</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <div className="text-center mt-2">
        <a href="/login" className="text-blue-600 hover:underline">Already have an account? Login</a>
      </div>
    </form>
  );
}
