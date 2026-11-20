"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

const BENEFITS = [
  {
    title: "Catat pengeluaran dalam hitungan detik",
    desc: "Masukkan transaksi harian dan kelompokkan per kategori tanpa repot.",
    icon: "M12 5v14M5 12h14",
  },
  {
    title: "Anggaran yang selalu terpantau",
    desc: "Tetapkan batas bulanan dan lihat sisa anggaran Anda kapan saja.",
    icon: "M4 19V9m6 10V5m6 14v-7m4 7H2",
  },
  {
    title: "Analisis keuangan dari AI",
    desc: "Dapatkan ringkasan dan saran berdasarkan pola pengeluaran Anda.",
    icon: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z",
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    if (!name || !email || !password) {
      setErrorMsg("Semua kolom wajib diisi.")
      return
    }

    try {
      setLoading(true)
      const response = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        setErrorMsg(data.detail || "Pendaftaran gagal. Email mungkin sudah terdaftar.")
        return
      }

      router.push("/login")
    } catch {
      setErrorMsg("Gagal terhubung ke server.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full h-12 rounded-lg border border-slate-300 bg-white px-4 text-[15px] text-slate-900 placeholder:text-slate-400 transition focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15"

  return (
    <div className="min-h-screen bg-white text-slate-900 lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ===== Panel kiri: brand + manfaat (hanya desktop) ===== */}
      <aside className="relative hidden overflow-hidden bg-[#0B2540] text-white lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-teal-400/20 blur-[110px]"
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400 text-[15px] font-extrabold text-[#0B2540]">
            DT
          </div>
          <span className="text-lg font-semibold tracking-tight">DoomTracker</span>
        </div>

        <div className="relative max-w-lg">
          <h2 className="text-4xl font-semibold leading-[1.15] tracking-tight xl:text-[2.75rem]">
            Mulai atur keuangan Anda hari ini.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300">
            Buat akun gratis dan kendalikan anggaran serta arus kas dari satu tempat.
          </p>

          <ul className="mt-10 space-y-6">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-4">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-teal-300">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={b.icon} />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">{b.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">{b.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-slate-400">© {new Date().getFullYear()} DoomTracker</p>
      </aside>

      {/* ===== Panel kanan: formulir ===== */}
      <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:min-h-0">
        <div className="w-full max-w-[26rem]">
          {/* logo untuk mobile */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2540] text-[15px] font-extrabold text-teal-300">
              DT
            </div>
            <span className="text-lg font-semibold tracking-tight">DoomTracker</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Buat akun baru</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
            Isi data berikut untuk mulai mengendalikan anggaran dan arus kas Anda.
          </p>

          {errorMsg && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800"
            >
              <svg className="mt-0.5 h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16.5v.01" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-800">
                Nama lengkap
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Contoh: Arul"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-800">
                Alamat email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-800">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-hint"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/15"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3 3l18 18" />
                      <path d="M10.6 6.1A9.8 9.8 0 0112 6c5 0 8.5 4 9.5 6a12.6 12.6 0 01-2.6 3.4M6.5 6.6C4.3 8 2.9 10.1 2.5 12c1 2 4.5 6 9.5 6 1.5 0 2.9-.4 4.1-1" />
                      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M2.5 12C3.5 10 7 6 12 6s8.5 4 9.5 6c-1 2-4.5 6-9.5 6s-8.5-4-9.5-6z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p id="password-hint" className="mt-2 text-xs text-slate-500">
                Gunakan kombinasi huruf dan angka agar akun lebih aman.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0B2540] text-[15px] font-semibold text-white transition hover:bg-[#12365c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {loading ? "Mendaftarkan..." : "Buat akun"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-teal-700 underline-offset-4 transition hover:text-teal-800 hover:underline focus-visible:outline-none focus-visible:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
