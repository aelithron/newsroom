import Image from "next/image";
import notByAI from "@/public/not-by-ai.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export async function GeneralHeader() {
  return (
    <header>

    </header>
  )
}

export async function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-center md:justify-between min-w-max p-4 bg-slate-300 dark:bg-slate-800 items-center">
      <a href="https://github.com/aelithron/newsroom" target="_blank" className="flex gap-1"><FontAwesomeIcon icon={faGithub} /> Newsroom <p className="underline hover:text-sky-500">{process.env.VERSION || "Unknown Version"}</p></a>
      <div className="flex gap-2">
        <a href="https://notbyai.fyi" target="_blank"><Image src={notByAI} alt="Developed by a human, not AI!" /></a>
      </div>
    </footer>
  )
}