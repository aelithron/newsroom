import { BackButton, Loader, MenuCard, PaperNotFound } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faBriefcase, faFileLines, faMicrophone, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Paper" };
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <Suspense fallback={<Loader>Paper</Loader>}>
        <PaperHome params={params} />
      </Suspense>
    </main>
  );
}
async function PaperHome({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return (<PaperNotFound />);
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { memberships: true } });
  if (!paper || !paper.memberships.find((a) => a.id === session.user.id)) return (<PaperNotFound />);
  return (
    <div className="flex flex-col gap-2">
      <BackButton link="/paper" className="mb-2" />
      <h1 className="font-semibold text-2xl text-center md:text-start"><FontAwesomeIcon icon={faNewspaper} /> {paper.name}</h1>
      <h2 className="text-center md:text-start">Welcome, {session.user.name}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-1">
        <MenuCard link={`/paper/${paper.id}/articles`} icon={faFileLines} title="Articles" desc="Write and manage articles!" />
        <MenuCard link={`/paper/${paper.id}/interviews`} icon={faMicrophone} title="Interviews" desc="View and add interviews!" />
        <MenuCard link={`/paper/${paper.id}/admin`} icon={faBriefcase} title="Administration" desc="Manage this paper's settings!" />
      </div>
    </div>
  );
}
