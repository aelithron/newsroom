import { Suspense } from "react";
import AuthForm from "./login.module";
import { Metadata } from "next";
import { Loader } from "../ui.module";
import { GeneralHeader } from "../framing.module";

export const metadata: Metadata = { title: "Sign In / Sign Up" }
export default async function Page({ searchParams }: { searchParams: Promise<{ hint: string }> }) {
  return (
    <main>
      <Suspense fallback={<Loader />}> 
        <GeneralHeader />
        <div className="flex flex-col min-h-screen p-8 md:px-20">
          <AuthFormLoader searchParams={searchParams} />
        </div>
      </Suspense>
    </main>
  )
}
// i hate cache components more than words can explain
async function AuthFormLoader({ searchParams }: { searchParams: Promise<{ hint: string }> }) {
  let defaultMode: "signIn" | "signUp" = "signIn";
  if ((await searchParams).hint && (await searchParams).hint.trim().toLowerCase() === "signup") defaultMode = "signUp";
  return <AuthForm key={defaultMode} defaultMode={defaultMode} />
}