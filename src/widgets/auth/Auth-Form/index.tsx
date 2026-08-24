"use client";

import { useState, FormEvent } from "react";
import { useLogin, useRegister } from "@/entities/auth/hooks";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const login = useLogin();
  const register = useRegister();

  const isPending = login.isPending || register.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login.mutate({ email, password });
    } else {
      register.mutate({ email, password, name: name || undefined });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-80 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          {mode === "login" ? "Login" : "Registration"}
        </h1>

        {mode === "register" && (
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white rounded p-2 disabled:opacity-50"
        >
          {isPending ? "Loading..." : mode === "login" ? "Login" : "Register"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full text-sm text-blue-600"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Have an account? Login"}
        </button>
      </form>
    </div>
  );
}
