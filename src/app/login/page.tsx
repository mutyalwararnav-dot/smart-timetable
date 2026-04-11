"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClayCard } from "@/components/ClayCard";
import { ClayButton } from "@/components/ClayButton";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 tracking-tight mb-2">Welcome Back 👋</h1>
          <p className="text-slate-300">Sign in to manage your timetable</p>
        </div>

        <ClayCard className="p-8 flex flex-col gap-6">
          <ClayButton type="button" variant="secondary" className="w-full flex items-center gap-3" onClick={handleGoogleLogin}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </ClayButton>

          <div className="relative flex items-center justify-center py-2">
            <hr className="w-full border-slate-200 border-opacity-60" />
            <span className="absolute bg-slate-800 px-4 text-sm text-slate-400 font-medium">OR</span>
          </div>

          <form onSubmit={handleEmailLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-200 pl-2">Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl shadow-inner focus:ring-2 font-medium bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-200 pl-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl shadow-inner focus:ring-2 font-medium bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-indigo-500 focus:outline-none transition-all"
              />
              <div className="flex justify-end mt-1">
                <Link href="#" className="text-sm font-semibold text-indigo-400 hover:text-slate-200 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium text-center">{error}</p>
            )}

            <ClayButton isLoading={loading} type="submit" className="w-full mt-2">Sign In</ClayButton>
          </form>
        </ClayCard>

        <p className="text-center mt-8 text-slate-300 font-medium">
          Don't have an account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-slate-100 transition-colors font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
