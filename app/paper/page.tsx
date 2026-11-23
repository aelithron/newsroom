import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faNewspaper, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { Loader } from "../ui.module";
import { GeneralHeader } from "../framing.module";

export const metadata: Metadata = { title: "Your Papers" }
export default function Page() {
  return (
    <main>
      <Suspense fallback={<Loader>Papers</Loader>}>
        <GeneralHeader />
        <div className="flex flex-col min-h-screen p-8 md:px-20">
          <div className="flex gap-2 align-middle">
            <h1 className="text-2xl font-semibold"><FontAwesomeIcon icon={faNewspaper} /> Your Papers</h1>
            <Link href={"/paper/create"} className="hover:text-sky-500 bg-slate-300 dark:bg-slate-800 p-1 rounded-xl"><FontAwesomeIcon icon={faPlus} /> Create</Link>
          </div>
          <Papers />
        </div>
      </Suspense>
    </main>
  );
}

async function Papers() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const userInfo = await db.query.user.findFirst({ where: { id: session.user.id }, with: { papers: true } });
  if (!userInfo) return null;
  if (userInfo.papers.length < 1) {
    return (
      <div className="flex flex-col gap-1 mt-2">
        <p>You aren&apos;t a staff member on any papers!</p>
        <p>Please ask your manager/admin to add <b>{session.user.email}</b> to a paper.</p>
        <p>Alternatively, <Link href={"/paper/create"} className="underline hover:text-sky-500">create one here</Link>.</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
      {userInfo.papers.map((paper) => <Link key={paper.id} href={`/paper/${paper.id}`} className="flex flex-col bg-slate-200 dark:bg-slate-800 p-2 rounded-lg">
        <h1 className="hover:text-sky-500 font-semibold text-lg"><FontAwesomeIcon icon={faNewspaper} /> {paper.name}</h1>
      </Link>)}
    </div>
  );
}