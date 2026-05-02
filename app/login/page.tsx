"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const theme = searchParams?.get("theme");
  const themeParam = theme ? `?theme=${theme}` : "";

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = `/${themeParam}`; // Redirect to home
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ── Left Side: Form ── */}
      <div className="w-full flex flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-32 relative">
        <Link 
          href={`/${themeParam}`} 
          className="absolute top-8 left-6 lg:left-20 xl:left-32 text-2xl font-bold tracking-tight font-heading"
        >
          <span className="text-gigit-navy">GIG</span>
          <span className="text-gigit-accent">IT</span>
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading text-foreground mb-2">Selamat Datang</h1>
            <p className="text-gigit-text-secondary text-sm">Masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input 
                  type="email" 
                  placeholder="nama@email.com" 
                  required 
                  className="pl-10 h-11 border-gigit-ice focus-visible:ring-gigit-accent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link href="#" className="text-xs font-semibold text-gigit-blue hover:text-gigit-accent transition-colors">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  className="pl-10 pr-10 h-11 border-gigit-ice focus-visible:ring-gigit-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-11 rounded-xl bg-gigit-blue text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gigit-accent",
                isLoading && "opacity-80 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative flex items-center py-5">
            <div className="flex-grow border-t border-gigit-ice"></div>
            <span className="shrink-0 px-3 text-xs text-gigit-text-secondary">Atau masuk dengan</span>
            <div className="flex-grow border-t border-gigit-ice"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gigit-ice bg-white text-sm font-medium hover:bg-gigit-off-white transition-colors">
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button type="button" className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gigit-ice bg-white text-sm font-medium hover:bg-gigit-off-white transition-colors">
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gigit-text-secondary">
            Belum punya akun?{" "}
            <Link href={`/register${themeParam}`} className="font-semibold text-gigit-blue hover:text-gigit-accent transition-colors">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Side: Image ── */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gigit-navy overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
          alt="Login background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gigit-navy via-gigit-navy/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-16 w-full text-white">
          <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-0 mb-6">
            Dipercaya 10,000+ Klien
          </Badge>
          <h2 className="text-4xl font-bold font-heading leading-tight mb-4 max-w-lg">
            Temukan talenta terbaik untuk proyek impian Anda.
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            Bergabung dengan platform marketplace jasa profesional paling terpercaya di Indonesia.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}
