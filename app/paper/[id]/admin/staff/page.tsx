import { BackButton, Loader, PaperNotFound, RoleParser } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import crypto from "crypto";

export const metadata: Metadata = { title: "Staff | Paper Admin" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <Suspense fallback={<Loader>Staff</Loader>}><StaffList params={params} /></Suspense>
    </main>
  );
}
async function StaffList({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return (<PaperNotFound />);
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { memberships: true, staff: true } });
  if (!paper || !paper.memberships.find((a) => a.id === session.user.id)) return (<PaperNotFound />);
  return (
    <div className="flex flex-col gap-2">
      <BackButton link={`/paper/${(await params).id}`} className="mb-2" />
      <div className="flex flex-col md:flex-row gap-1 align-middle items-center">
        <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faUsers} /> Staff</h1>
        <h2 className="text-xl pl-1 hidden md:block">-</h2>
        <h2 className="text-xl italic">{paper.name}</h2>
      </div>
      <div className="flex flex-col gap-2">
        {paper.staff.filter((staff) => staff.role === "manager").map((staff) => <StaffCard key={staff.userID} user={paper.memberships.find((entry) => entry.id === staff.userID)} role={staff.role} />)}
        {paper.staff.filter((staff) => staff.role === "writer").map((staff) => <StaffCard key={staff.userID} user={paper.memberships.find((entry) => entry.id === staff.userID)} role={staff.role} />)}
        {paper.staff.filter((staff) => staff.role === "reader").map((staff) => <StaffCard key={staff.userID} user={paper.memberships.find((entry) => entry.id === staff.userID)} role={staff.role} />)}
      </div>
    </div>
  )
}
function StaffCard({ user, role }: { user: { id: string, name: string, email: string, image: string | null } | undefined, role: string }) {
  if (!user) return null;
  const gravatarURL = `https://gravatar.com/avatar/${crypto.createHash("sha256").update(user.email.toLowerCase().trim()).digest("hex")}`;
  return (
    <div className="flex gap-2 p-1 rounded-lg bg-slate-300 dark:bg-slate-800 w-fit">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={user.image || gravatarURL} alt="User Profile Picture" width={60} height={60} className="rounded-lg" />
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-lg">{user.name}</h2>
        <RoleParser role={role} />
      </div>
    </div>
  )
}