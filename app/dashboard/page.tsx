import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/nextauth/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenue {session.user?.email}</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch("/api/auth/signout", { method: "POST" });
          window.location.href = "/login";
        }}
      >
        <button type="submit">Déconnexion</button>
      </form>
    </div>
  );
}
