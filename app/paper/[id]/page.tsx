import { BackButton } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faHome, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <BackButton link="/paper" className="mb-2" />
      <Suspense fallback={<p>Loading...</p>}>
        <PaperHome params={params} />
      </Suspense>
    </main>
  );
}
async function PaperHome({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { staff: true } });
  if (!paper) {
    return (
      <div className="flex flex-col">
        <p className="text-lg font-semibold">Paper not found!</p>
        <Link href="/paper" className="bg-violet-300 dark:bg-violet-800 rounded-lg p-1 w-fit mt-2 hover:text-sky-500"><FontAwesomeIcon icon={faHome} /> Go Home</Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faNewspaper} /> {paper.name}</h1>
      <h2>Welcome, {session.user.name}!</h2>
    </div>
  );
}