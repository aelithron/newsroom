import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreatePaperForm from "./create.module";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { GeneralHeader } from "@/app/framing.module";
import { BackButton } from "@/app/ui.module";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Create Paper" };
export default function Page() {
  return (
    <main>
      <GeneralHeader />
      <div className="flex flex-col min-h-screen p-8 md:px-20">
        <BackButton link="/paper" />
        <h1 className="text-2xl font-semibold mt-2 text-center md:text-start"><FontAwesomeIcon icon={faPlus} /> Create a Paper</h1>
        <Suspense fallback={<p className="text-center md:text-start">Note: If you are looking to join a paper, ask your manager/admin to invite you instead.</p>}><Notice /></Suspense>
        <CreatePaperForm />
      </div>
    </main>
  )
}
async function Notice() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return <p className="text-center md:text-start">Note: If you are looking to join a paper, ask your manager/admin to invite you instead.</p>
  return (<p className="text-center md:text-start">Note: If you are looking to join a paper, ask your manager/admin to invite you instead (with the email address <b>{session.user.email}</b>).</p>);
}