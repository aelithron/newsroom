import { BackButton, Loader, MenuCard, NoPermission, PaperNotFound } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faBriefcase, faGear, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Paper Administration" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <Suspense fallback={<Loader>Administration</Loader>}><AdminHome params={params} /></Suspense>
    </main>
  );
}
async function AdminHome({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return (<PaperNotFound />);
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { staff: true } });
  if (!paper || !paper.staff.find((a) => a.userID === session.user.id)) return (<PaperNotFound />);
  if (paper.staff.find((a) => a.userID === session.user.id)!.role !== "manager") return (<NoPermission backLink={`/paper/${(await params).id}`} />)
  return (
    <div className="flex flex-col gap-2">
      <BackButton link={`/paper/${(await params).id}`} className="mb-2" />
      <div className="flex flex-col md:flex-row gap-1 align-middle items-center">
        <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faBriefcase} /> Administration</h1>
        <h2 className="text-xl pl-1 hidden md:block">-</h2>
        <h2 className="text-xl italic">{paper.name}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-1 gap-4">
        <MenuCard link={`/paper/${(await params).id}/admin/general`} icon={faGear} title="General" desc="View/change general paper settings!" />
        <MenuCard link={`/paper/${(await params).id}/admin/staff`} icon={faUsers} title="Staff" desc="See and edit the paper's staff!" />
      </div>
    </div>
  )
}