"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Connexion Email / Password
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // on gère la redirection nous-mêmes
      });

      if (res?.ok) {
        window.location.href = "/choix";
      } else {
        setError(
          res?.error === "CredentialsSignin"
            ? "Email ou mot de passe invalide"
            : res?.error || "Une erreur est survenue"
        );
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // Connexion OAuth
  const handleOAuthLogin = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/choix" });
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h1>Connexion</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Formulaire Email / Password */}
      <form
        onSubmit={handleEmailLogin}
        style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading || !email || !password}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      {/* Boutons OAuth */}
      <button
        onClick={() => handleOAuthLogin("google")}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      >
        Se connecter avec Google
      </button>

      <button
        onClick={() => handleOAuthLogin("github")}
        style={{ width: "100%", padding: 10 }}
      >
        Se connecter avec GitHub
      </button>
    </div>
  );
}
