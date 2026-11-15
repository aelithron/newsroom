import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Your Papers" }
export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <h1 className="text-2xl font-semibold"><FontAwesomeIcon icon={faNewspaper} /> Your Papers</h1>
      <Suspense><Papers /></Suspense>
    </main>
  );
}

async function Papers() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const userInfo = await db.query.user.findFirst({ where: { id: session.user.id }, with: { papers: true } });
  if (!userInfo) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {userInfo.papers.map((paper) => <div key={paper.id} className="flex flex-col bg-slate-200 dark:bg-slate-800 p-2 rounded-lg">
        {paper.name}
      </div>)}
    </div>
  );
}