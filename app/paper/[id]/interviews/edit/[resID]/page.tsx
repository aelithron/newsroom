import { BackButton, ItemNotFound, Loader, NoPermission, PaperNotFound } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import { Suspense } from "react";
import InterviewEditor from "./edit.module";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Interview" };
export default function Page({ params }: { params: Promise<{ id: string, resID: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <Suspense fallback={<Loader>Interview Editor</Loader>}><EditInterview params={params} /></Suspense>
    </main>
  )
}
async function EditInterview({ params }: { params: Promise<{ id: string, resID: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return (<PaperNotFound />);
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { staff: true, interviews: true, questions: true } });
  if (!paper || !paper.staff.find((a) => a.userID === session.user.id)) return (<PaperNotFound />);
  if (!["manager", "writer"].includes(paper.staff.find((e) => e.userID === session.user.id)!.role)) return (<NoPermission backLink={`/paper/${(await params).id}/interviews`} />);
  const resID = parseInt((await params).resID);
  const interview = paper.interviews.find((res) => res.id === resID);
  if (!interview) return (<ItemNotFound item="Interview" backLink={`/paper/${(await params).id}/interviews`} />);
  return (
    <div className="flex flex-col gap-2">
      <BackButton link={`/paper/${(await params).id}/interviews/${(await params).resID}`} />
      <div className="flex flex-col md:flex-row gap-1 align-middle items-center">
        <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faMicrophone} /> Edit Interview</h1>
        <h2 className="text-xl pl-1 hidden md:block">-</h2>
        <h2 className="text-xl italic">{paper.name}</h2>
      </div>
      <InterviewEditor interview={interview} questions={paper.questions} />
    </div>
  );
}