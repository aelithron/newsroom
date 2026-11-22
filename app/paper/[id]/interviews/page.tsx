import { BackButton, Loader, PaperNotFound } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faMicrophone, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import CreateQuestions from "./question.module";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <Suspense fallback={<Loader>Interviews</Loader>}><PaperInterviews params={params} /></Suspense>
    </main>
  )
}
async function PaperInterviews({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return (<PaperNotFound />);
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { staff: true, interviews: true, questions: true } });
  if (!paper || !paper.staff.find((a) => a.id === session.user.id)) return (<PaperNotFound />);
  return (
    <div className="flex flex-col gap-2">
      <BackButton link={`/paper/${(await params).id}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-2">
          <div className="flex gap-1 align-middle items-center">
            <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faMicrophone} /> Interviews</h1>
            <h2 className="text-xl pl-1">-</h2>
            <h2 className="text-xl italic">{paper.name}</h2>
          </div>
          <Link href={`/paper/${(await params).id}/interviews/create`} className="bg-violet-300 dark:bg-violet-800 p-1 rounded-lg hover:text-sky-500 w-fit"><FontAwesomeIcon icon={faPlus} /> Add Interview</Link>
          {paper.interviews.length < 1 && <div className="flex flex-col gap-1 mt-2 text-lg lg:col-span-2">
            <p>This paper doesn&apos;t have any interviews yet!</p>
            <p>Add one with the button above, or ask another team member to.</p>
          </div>}
          {paper.interviews.length >= 1 && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paper.interviews.map((interview) => <div key={interview.id} className="flex flex-col p-2 bg-slate-300 dark:bg-slate-800 rounded-lg">
              {interview.name}
            </div>)}
          </div>}
        </div>
        <CreateQuestions paperID={parseInt((await params).id)} initQuestions={paper.questions.map((question) => { return { id: question.id, text: question.question, enabled: question.enabled } })} />
      </div>
    </div>
  );
}