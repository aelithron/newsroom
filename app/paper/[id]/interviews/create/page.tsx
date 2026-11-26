import { BackButton, Loader, NoPermission, PaperNotFound } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import { Suspense } from "react";
import CreateInterviewForm from "./create.module";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Add Interview" };
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <Suspense fallback={<Loader>Interview Creator</Loader>}><CreateInterviewPage params={params} /></Suspense>
    </main>
  )
}
async function CreateInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return (<PaperNotFound />);
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { staff: true, interviews: true, questions: true } });
  if (!paper || !paper.staff.find((a) => a.userID === session.user.id)) return (<PaperNotFound />);
  if (!["manager", "writer"].includes(paper.staff.find((e) => e.userID === session.user.id)!.role)) return (<NoPermission backLink={`/paper/${(await params).id}/interviews`} />);
  return (
    <div className="flex flex-col gap-2">
      <BackButton link={`/paper/${(await params).id}/interviews`} />
      <div className="flex flex-col md:flex-row gap-1 align-middle items-center">
        <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faMicrophone} /> Add Interview</h1>
        <h2 className="text-xl pl-1 hidden md:block">-</h2>
        <h2 className="text-xl italic">{paper.name}</h2>
      </div>
      {paper.questions.length < 1 && <div className="flex flex-col gap-1 text-lg mt-2">
        <p>You don&apos;t have any questions added yet!</p>
        <p>Add one on the <Link href={`/paper/${(await params).id}/interviews`} className="underline hover:text-sky-500">interviews page</Link> first.</p>
      </div>}
      {paper.questions.length >= 1 && <CreateInterviewForm paperID={(await params).id} questions={paper.questions.map((q) => { return { id: q.id, text: q.question, enabled: q.enabled } })} />}
    </div>
  );
}