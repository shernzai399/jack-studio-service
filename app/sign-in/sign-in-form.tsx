"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, UserRound } from "lucide-react";
import { Card, Field, PrimaryButton, inputClass } from "@/components/ui";
import { getInternalSession, signInInternal } from "@/lib/internal-auth";

export function SignInForm() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getInternalSession()) {
      router.replace("/");
    }
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      signInInternal(userId, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-pearl px-4 py-10">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">JACK STUDIO</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Service Sign In</h1>
          <p className="mt-2 text-sm text-moss">Sign in to access internal service and inventory operations.</p>
        </div>

        {error && <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label="ID">
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-moss" size={18} />
              <input className={`${inputClass} w-full pl-10`} value={userId} onChange={(event) => setUserId(event.target.value)} autoComplete="username" />
            </div>
          </Field>
          <Field label="Password">
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-moss" size={18} />
              <input className={`${inputClass} w-full pl-10`} value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" />
            </div>
          </Field>
          <PrimaryButton type="submit">Sign in</PrimaryButton>
        </form>
      </Card>
    </main>
  );
}
