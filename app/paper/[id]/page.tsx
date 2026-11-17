import { BackButton, PaperNotFound } from "@/app/ui.module";
import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight, faMicrophone, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <BackButton link="/paper" className="mb-2" />
      <Suspense fallback={<p>Loading...</p>}>
        <PaperHome params={params} />
      </Suspense>
    </main>
  );
}
async function PaperHome({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return (<PaperNotFound />);
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt((await params).id) }, with: { staff: true } });
  if (!paper || !paper.staff.find((a) => a.id === session.user.id)) return (<PaperNotFound />);
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-semibold text-2xl"><FontAwesomeIcon icon={faNewspaper} /> {paper.name}</h1>
      <h2>Welcome, {session.user.name}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MenuCard link={`/paper/${(await params).id}/interviews`} icon={faMicrophone} title="Interviews" desc="See and add interviews!" />
      </div>
    </div>
  );
}
function MenuCard({ link, icon, title, desc }: { link: string, icon: IconProp, title: string, desc: string }) {
  return (
    <Link href={link} className="flex p-2 rounded-lg bg-slate-300 dark:bg-slate-800 justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold hover:text-sky-500"><FontAwesomeIcon icon={icon} /> {title}</h1>
        <p className="text-lg">{desc}</p>
      </div>
      <FontAwesomeIcon icon={faAngleRight} size="2xl" className="hover:text-sky-500" />
    </Link>
  )
}