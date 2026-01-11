"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ChoixPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/login"); // redirection si non connecté
    }
  }, [session, router]);

  const goToDashboard = () => router.push("/dashboard");
  const goToProfile = () => router.push("/profile");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenue {session?.user?.name}</h1>
      <p>Choisis où aller :</p>
      <button onClick={goToDashboard} className="m-2 p-2 bg-blue-500 text-white rounded">
        Dashboard
      </button>
      <button onClick={goToProfile} className="m-2 p-2 bg-green-500 text-white rounded">
        Profil
      </button>
    </div>
  );
}
