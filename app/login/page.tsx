"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[32px] border border-slate-800/90 bg-slate-900/95 p-8 shadow-[0_32px_80px_-48px_rgba(15,23,42,0.95)] backdrop-blur-sm">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Sign in</p>
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="text-slate-400">Access your video dashboard and upload your next reel.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <label className="block text-sm font-medium text-slate-300">
            Email
            <input
              className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Password
            <input
              className="mt-2 w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-500/70"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to Imageo?{' '}
          <Link href="/register" className="font-semibold text-white transition hover:text-cyan-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
