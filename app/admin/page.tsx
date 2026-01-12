import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, UserWithRole } from "../lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as UserWithRole;
  if (user.role !== "admin") redirect("/choix");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <p>Bonjour {user.name}, vous êtes admin.</p>

      <a href="/dashboard" className="m-2 p-2 bg-blue-500 text-white rounded inline-block">Dashboard</a>
      <a href="/choix" className="m-2 p-2 bg-gray-500 text-white rounded inline-block">Retour au choix</a>

      <div className="mt-4"><LogoutButton /></div>
    </div>
  );
}
