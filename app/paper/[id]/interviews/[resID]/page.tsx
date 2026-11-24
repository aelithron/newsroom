import { BackButton, Loader, PaperNotFound } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faMicrophone, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "View Interview" };
export default function Page({ params }: { params: Promise<{ id: string, resID: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <Suspense fallback={<Loader>Interview</Loader>}><ViewInterview params={params} /></Suspense>
    </main>
  )
}
async function ViewInterview({ params }: { params: Promise<{ id: string, resID: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return (<PaperNotFound />);
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { memberships: true, interviews: true, questions: true } });
  if (!paper || !paper.memberships.find((a) => a.id === session.user.id)) return (<PaperNotFound />);
  const resID = parseInt((await params).resID);
  const interview = paper.interviews.find((res) => res.id === resID);
  if (!interview) return (<div></div>);
  return (
    <div className="flex flex-col gap-2">
      <BackButton link={`/paper/${(await params).id}/interviews`} />
      <div className="flex gap-1 align-middle items-center">
        <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faMicrophone} /> Interview with {interview.name || "Unknown"}</h1>
        <h2 className="text-xl pl-1">-</h2>
        <h2 className="text-xl italic">{paper.name}</h2>
        <Link href={`/paper/${(await params).id}/interviews/edit/${(await params).resID}`} className="hover:text-sky-500 p-1 rounded-lg bg-violet-300 dark:bg-violet-800 ml-2"><FontAwesomeIcon icon={faPencil} /> Edit</Link>
      </div>
      {interview.responses.sort((a, b) => b.q - a.q).map((response) => <div key={response.q} className="bg-slate-300 dark:bg-slate-800 p-2 rounded-lg flex flex-col w-fit">
        <h2 className="text-lg font-semibold">{(paper.questions.find(((question) => question.id === response.q)) || { question: "Unknown Question" }).question}</h2>
        <p>{response.a}</p>
      </div>)}
    </div>
  );
}