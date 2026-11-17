import { BackButton, PaperNotFound } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import { Suspense } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <Suspense fallback={<p>Loading...</p>}><PaperInterviews params={params} /></Suspense>
    </main>
  )
}
async function PaperInterviews({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { staff: true } });
  if (!paper || !paper.staff.find((a) => a.id === session.user.id)) return (<PaperNotFound />);
  return (
    <div className="flex flex-col gap-2">
      <BackButton link={`/paper/${(await params).id}`} />
      <div className="flex gap-1 align-middle items-center">
        <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faMicrophone} /> Interviews</h1>
        <h2 className="text-xl pl-1">-</h2>
        <h2 className="text-xl italic">{paper.name}</h2>
      </div>
    </div>
  );
}