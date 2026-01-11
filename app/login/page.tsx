"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15, maxWidth: 400, margin: "50px auto" }}>
      <h1>Connexion</h1>

      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Se connecter avec Google
      </button>

      <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
        Se connecter avec GitHub
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          signIn("credentials", {
            email: form.get("email"),
            password: form.get("password"),
            callbackUrl: "/dashboard",
          });
        }}
        style={{ display: "flex", flexDirection: "column", gap: 5 }}
      >
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter avec Email</button>
      </form>
    </div>
  );
}
