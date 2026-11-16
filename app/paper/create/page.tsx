import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreatePaperForm from "./create.module";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function Page() {
  
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <h1 className="text-2xl font-semibold"><FontAwesomeIcon icon={faPlus} /> Create a Paper</h1>
      <Suspense><Notice /></Suspense>
      <CreatePaperForm />
    </main>
  )
}
async function Notice() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return <p>Note: If you are looking to join a paper, ask your manager/admin to add you instead.</p>
  return (<p>Note: If you are looking to join a paper, ask your manager/admin to add you instead (under the email address <b>{session.user.email}</b>).</p>);
}