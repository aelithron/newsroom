import { faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { CSSProperties, ReactNode } from "react";
import { ClockLoader, PulseLoader } from "react-spinners";

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
export function Loader({ children }: { children?: ReactNode }) {
  const override: CSSProperties = { alignItems: "flex-end", display: "flex", marginBottom: 4 };
  return (
    <div data-loader className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col min-h-screen align-middle justify-center text-center items-center gap-4">
      <ClockLoader color={"#8b5cf6"} size={150} />
      {!children ? <div className="text-2xl font-semibold flex"><p>Loading</p><PulseLoader cssOverride={override} color="var(--foreground)" size={4} /></div>: <div className="text-2xl font-semibold flex"><p>Loading {children}</p><PulseLoader color="var(--foreground)" cssOverride={override} size={4} /></div>}
    </div>
  ) 
}