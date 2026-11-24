import Image from "next/image";
import notByAI from "@/public/not-by-ai.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faNewspaper, faSignIn, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import crypto from "crypto";
import { UserProfile } from "./framingclient.module";

export async function GeneralHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-center md:justify-between min-w-max gap-2 p-4 md:px-8 bg-violet-300 dark:bg-violet-950 sticky top-0 z-5">
      <Link href="/" className="flex align-middle items-center gap-1 justify-center md:justify-start">
        <div className="flex gap-1 align-middle items-center hover:text-sky-500">
          <FontAwesomeIcon icon={faNewspaper} size="lg" />
          <h1 className="font-semibold text-xl">Newsroom</h1>
        </div>
        <p className="bg-amber-300 dark:bg-amber-600 p-1 rounded-lg ml-1 font-semibold">Beta</p>
      </Link>
      <Suspense fallback={<AuthButtons />}>
        <AuthedButtons />
      </Suspense>
    </header>
  )
}
async function AuthedButtons() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return (<AuthButtons />);
  const gravatarURL = `https://gravatar.com/avatar/${crypto.createHash("sha256").update(session.user.email.toLowerCase().trim()).digest("hex")}`;
  return (
    <div className="flex gap-2 items-center justify-center md:justify-start">
      <Link href={"/paper"} className="hover:text-sky-500"><FontAwesomeIcon icon={faNewspaper} /> Papers</Link>
      <UserProfile imageURL={session.user.image || gravatarURL} name={session.user.name} />
    </div>
  )
}
function AuthButtons() {
  return (
    <div className="flex gap-2 items-center justify-center md:justify-start">
      <Link href={"/auth"} className="py-1 px-2 rounded-lg bg-violet-200 dark:bg-violet-800 hover:text-sky-500"><FontAwesomeIcon icon={faSignIn} /> Sign In</Link>
      <Link href={"/auth?hint=signup"} className="py-1 px-2 rounded-lg bg-violet-300 dark:bg-violet-600 hover:text-sky-500"><FontAwesomeIcon icon={faUserPlus} /> Sign Up</Link>
    </div>
  )
}

export async function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-center md:justify-between min-w-max gap-3 p-4 md:px-8 bg-violet-300 dark:bg-violet-950 items-center">
      <a href="https://github.com/aelithron/newsroom" target="_blank" className="flex gap-1 items-center"><FontAwesomeIcon icon={faGithub} /> Newsroom <p className="underline hover:text-sky-500">{process.env.VERSION || "Unknown Version"}</p></a>
      <div className="flex gap-2">
        <a href="https://notbyai.fyi" target="_blank"><Image src={notByAI} alt="Developed by a human, not AI!" /></a>
      </div>
    </footer>
  )
}