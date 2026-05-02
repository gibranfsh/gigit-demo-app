"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, User, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type AccountType = "klien" | "freelancer";

function RegisterForm() {
  const searchParams = useSearchParams();
  const theme = searchParams?.get("theme");
  const themeParam = theme ? `?theme=${theme}` : "";

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("klien");

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
      {/* ── Left Side: Image ── */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gigit-navy overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
          alt="Register background"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gigit-navy via-gigit-navy/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-16 w-full text-white">
          <Badge className="bg-gigit-accent text-white border-0 mb-6 gap-1.5 px-3 py-1">
            <CheckCircle2 className="size-3.5" /> Platform #1 di Indonesia
          </Badge>
          <h2 className="text-4xl font-bold font-heading leading-tight mb-4 max-w-lg">
            Mulai Perjalanan Anda Bersama GIGIT.
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            Baik Anda mencari talenta luar biasa atau peluang proyek baru, semuanya ada di sini.
          </p>
        </div>
      </div>

      {/* ── Right Side: Form ── */}
      <div className="w-full flex flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-32 relative">
        <div className="absolute top-8 right-6 lg:right-20 xl:right-32">
          <p className="text-sm text-gigit-text-secondary">
            Sudah punya akun?{" "}
            <Link href={`/login${themeParam}`} className="font-semibold text-gigit-blue hover:text-gigit-accent transition-colors">
              Masuk
            </Link>
          </p>
        </div>

        {/* Mobile Logo */}
        <Link 
          href={`/${themeParam}`} 
          className="lg:hidden absolute top-8 left-6 text-2xl font-bold tracking-tight font-heading"
        >
          <span className="text-gigit-navy">GIG</span>
          <span className="text-gigit-accent">IT</span>
        </Link>

        <div className="mx-auto w-full max-w-sm mt-8 lg:mt-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading text-foreground mb-2">Buat Akun</h1>
            <p className="text-gigit-text-secondary text-sm">Pilih tipe akun dan isi data diri Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type Toggle */}
            <div className="flex bg-gigit-off-white p-1 rounded-xl border border-gigit-ice mb-6">
              <button
                type="button"
                onClick={() => setAccountType("klien")}
                className={cn(
                  "flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer",
                  accountType === "klien" 
                    ? "bg-white text-gigit-navy shadow-sm" 
                    : "text-gigit-text-secondary hover:text-gigit-navy"
                )}
              >
                Saya Klien
              </button>
              <button
                type="button"
                onClick={() => setAccountType("freelancer")}
                className={cn(
                  "flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer",
                  accountType === "freelancer" 
                    ? "bg-white text-gigit-navy shadow-sm" 
                    : "text-gigit-text-secondary hover:text-gigit-navy"
                )}
              >
                Saya Freelancer
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Nama Anda" 
                  required 
                  className="pl-10 h-11 border-gigit-ice focus-visible:ring-gigit-accent"
                />
              </div>
            </div>

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
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Minimal 8 karakter" 
                  required 
                  minLength={8}
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
                "w-full h-11 rounded-xl bg-gigit-blue text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gigit-accent mt-4 cursor-pointer",
                isLoading && "opacity-80 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Membuat Akun...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <p className="text-xs text-gigit-text-secondary text-center mt-4">
              Dengan mendaftar, Anda menyetujui{" "}
              <Link href="#" className="text-gigit-blue hover:underline">Syarat & Ketentuan</Link> serta{" "}
              <Link href="#" className="text-gigit-blue hover:underline">Kebijakan Privasi</Link> kami.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RegisterForm />
    </Suspense>
  );
}
