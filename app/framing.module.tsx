import Image from "next/image";
import notByAI from "@/public/not-by-ai.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Suspense } from "react";

export async function GeneralHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-center md:justify-between min-w-max gap-2 p-4 md:px-8 bg-violet-300 dark:bg-violet-950 sticky top-0 z-50">
      <Link href="/" className="flex align-middle items-center gap-1">
        <div className="flex gap-1 align-middle items-center hover:text-sky-500">
          <FontAwesomeIcon icon={faNewspaper} size="lg" />
          <h1 className="font-semibold text-xl">Newsroom</h1>
        </div>
        <p className="bg-amber-300 dark:bg-amber-600 p-1 rounded-lg ml-1 font-semibold">Beta</p>
      </Link>
      <Suspense fallback={<AuthButtons />}>
        <UserProfile />
      </Suspense>
    </header>
  )
}
function UserProfile() {
  return (
    <div>

    </div>
  )
}
function AuthButtons() {
  return (
    <div>

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