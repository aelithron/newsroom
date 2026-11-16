import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function BackButton({ link, className }: { link: string, className: string }) {
  return (<Link href={link} className={`p-1 bg-slate-300 dark:bg-slate-800 rounded-xl w-fit hover:text-sky-500 ${className}`}><FontAwesomeIcon icon={faArrowLeft} /></Link>);
}