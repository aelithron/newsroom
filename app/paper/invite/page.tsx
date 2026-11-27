import { GeneralHeader } from "@/app/framing.module";
import { BackButton, Loader, RoleParser } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { faEnvelope, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import { Suspense } from "react";
import crypto from "crypto";

export default function Page() {
  return (
    <main>
      <Suspense fallback={<Loader>Invites</Loader>}>
        <GeneralHeader />
        <div className="flex flex-col min-h-screen p-8 md:px-20">
          <BackButton link="/paper" />
          <h1 className="text-2xl font-semibold mt-2 text-center md:text-start"><FontAwesomeIcon icon={faEnvelope} /> Invites</h1>
          <p className="text-center md:text-start my-1">By accepting an invite, the paper&apos;s staff can see your name, email, and profile picture.</p>
          <InvitePage />
        </div>
      </Suspense>
    </main>
  )
}
async function InvitePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const userInfo = await db.query.user.findFirst({ where: { id: session.user.id }, with: { invites: true, invitedPapers: true, invitingUsers: true } });
  if (!userInfo) return null;
  const validInvites = [];
  const usedPapers: number[] = [];
  for (const invite of userInfo.invites) {
    if (invite.status !== "pending" || usedPapers.includes(invite.paperID)) continue;
    usedPapers.push(invite.paperID);
    validInvites.push(invite);
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      {validInvites.map((invite) => <div key={invite.id} className="flex flex-col gap-2 bg-slate-300 dark:bg-slate-800 rounded-lg p-2">
        <h2 className="font-semibold text-lg"><FontAwesomeIcon icon={faNewspaper} /> {(userInfo.invitedPapers.find((paper) => paper.id === invite.paperID) || { name: "Unknown/Invalid Paper" }).name}</h2>
        <RoleParser role={invite.role} />
        <div className="flex gap-1 items-center">
          <p>Inviter: </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={inviterPFP(userInfo.invitingUsers.find((user) => user.id === invite.inviter) || { image: null, email: null })} alt="Profile Picture" height={30} width={30} className="rounded-lg" referrerPolicy="no-referrer" />
          <p>{(userInfo.invitingUsers.find((user) => user.id === invite.inviter) || { name: "Unknown" }).name}</p>
          {userInfo.invitingUsers.find((user) => user.id === invite.inviter) && <p className="text-sm">({userInfo.invitingUsers.find((user) => user.id === invite.inviter)!.email})</p>}
        </div>
      </div>)}
      {validInvites.length < 1 && <div className="text-center md:text-start md:col-span-2">
        <p>There are no valid invites for you to accept.</p>
        <p>If you are waiting on one, make sure it was sent to {session.user.email}.</p>
      </div>}
    </div>
  )
}
function inviterPFP(user: { image: string | null, email: string | null }): string {
  if (user.image && user.image.trim().length > 1) return user.image.trim();
  if (user.email && user.email.trim().length > 1) { return `https://gravatar.com/avatar/${crypto.createHash("sha256").update(user.email.toLowerCase().trim()).digest("hex")}` }
  return "https://gravatar.com/avatar/";
}