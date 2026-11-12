import { Suspense } from "react";
import AuthForm from "./login.module";

export default async function Page({ searchParams }: { searchParams: Promise<{ hint: string }> }) {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <Suspense fallback={<p>Loading...</p>}> 
        <AuthFormLoader searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
// i hate cache components more than words can explain
async function AuthFormLoader({ searchParams }: { searchParams: Promise<{ hint: string }> }) {
  let defaultMode: "signIn" | "signUp" = "signIn";
  if ((await searchParams).hint && (await searchParams).hint.trim().toLowerCase() === "signup") defaultMode = "signUp";
  return <AuthForm defaultMode={defaultMode} />
}