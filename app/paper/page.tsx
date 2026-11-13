import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { staffTable } from "@/utils/schema/main";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { eq } from "drizzle-orm";
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
  const papers = await db.select().from(staffTable).where(eq(staffTable.userID, session.user.id));
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {papers.map((paper) => <div key={paper.paperID} className="flex flex-col bg-slate-200 dark:bg-slate-800 p-2 rounded-lg">
        {paper.paperID}
      </div>)}
    </div>
  );
}