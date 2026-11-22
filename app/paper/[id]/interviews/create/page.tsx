import { BackButton, Loader, PaperNotFound } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import { Suspense } from "react";
import CreateInterviewForm from "./create.module";
import { interviewQuestionTable } from "@/utils/schema/main";
import { eq } from "drizzle-orm";
import Link from "next/link";

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
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { staff: true, interviews: true } });
  const questions = await db.select().from(interviewQuestionTable).where(eq(interviewQuestionTable.paperID, parseInt((await params).id)));
  if (!paper || !paper.staff.find((a) => a.id === session.user.id)) return (<PaperNotFound />);
  return (
    <div className="flex flex-col gap-2">
      <BackButton link={`/paper/${(await params).id}/interviews`} />
      <div className="flex gap-1 align-middle items-center">
        <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faMicrophone} /> Add Interview</h1>
        <h2 className="text-xl pl-1">-</h2>
        <h2 className="text-xl italic">{paper.name}</h2>
      </div>
      {questions.length < 1 && <div className="flex flex-col gap-1 text-lg mt-2">
        <p>You don&apos;t have any questions added yet!</p>
        <p>Add one on the <Link href={`/paper/${(await params).id}/interviews`} className="underline hover:text-sky-500">interviews page</Link> first.</p>
      </div>}
      {questions.length >= 1 && <CreateInterviewForm paperID={(await params).id} questions={questions.map((q) => { return { id: q.id, text: q.question } })} />}
    </div>
  );
}