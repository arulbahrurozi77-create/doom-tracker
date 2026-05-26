"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {

    if (!email || !password) {
      alert("Please fill all fields")
      return
    }

    localStorage.setItem("isLoggedIn", "true")

    router.push("/")

  }

  return (

    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white p-5">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-900" />

      {/* GRID */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* GLOW */}
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[180px] opacity-30 animate-pulse" />

      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-pink-500 rounded-full blur-[180px] opacity-20 animate-pulse" />

      <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-cyan-500 rounded-full blur-[150px] opacity-20" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-[35px] p-10 shadow-2xl">

        <h1 className="text-5xl font-black text-center bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          DoomTracker
        </h1>

        <p className="text-slate-300 text-center mt-4">
          Login to your AI Dashboard
        </p>

        {/* INPUTS */}
        <div className="mt-10 space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-5 rounded-2xl bg-slate-900/70 border border-slate-700 text-white outline-none focus:ring-4 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-5 rounded-2xl bg-slate-900/70 border border-slate-700 text-white outline-none focus:ring-4 focus:ring-pink-500"
          />

          <button
            onClick={handleLogin}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Login 🚀
          </button>

        </div>

        {/* REGISTER */}
        <div className="text-center mt-8">

          <span className="text-slate-400">
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="ml-2 text-indigo-400 font-bold hover:text-pink-400"
          >
            Register
          </button>

        </div>

      </div>

    </div>

  )

}