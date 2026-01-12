import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, UserWithRole } from "../lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as UserWithRole;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      <p>
        Nom : {user.name ?? "Non défini"}<br />
        Email : {user.email ?? "Non défini"}<br />
        Rôle : {user.role ?? "user"}
      </p>

      <a href="/choix" className="m-2 p-2 bg-gray-500 text-white rounded inline-block">Retour au choix</a>
      {user.role === "admin" && <a href="/admin" className="m-2 p-2 bg-red-500 text-white rounded inline-block">Admin</a>}

      <div className="mt-4"><LogoutButton /></div>
    </div>
  );
}
