import { faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function BackButton({ link, className }: { link: string, className?: string }) {
  return (<Link href={link} className={`p-1 bg-slate-300 dark:bg-slate-800 rounded-xl w-fit hover:text-sky-500 ${className === undefined ? className : ""}`}><FontAwesomeIcon icon={faArrowLeft} /></Link>);
}
export function PaperNotFound() {
  return (
    <div className="flex flex-col">
      <p className="text-lg font-semibold">Paper not found!</p>
      <Link href="/paper" className="bg-violet-300 dark:bg-violet-800 rounded-lg p-1 w-fit mt-2 hover:text-sky-500"><FontAwesomeIcon icon={faHome} /> Go Home</Link>
    </div>
  );
}