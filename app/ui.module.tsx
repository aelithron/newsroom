import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight, faArrowLeft, faHome, faLock, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { CSSProperties, ReactNode, ViewTransition } from "react";
import { ClockLoader, PulseLoader } from "react-spinners";

export function BackButton({ link, className }: { link: string, className?: string }) {
  return (<Link href={link} className={`p-1 bg-slate-300 dark:bg-slate-800 rounded-xl w-fit hover:text-sky-500 text-lg md:text-base ${className === undefined ? className : ""}`}><FontAwesomeIcon icon={faArrowLeft} /></Link>);
}
export function Loader({ children }: { children?: ReactNode }) {
  const override: CSSProperties = { alignItems: "flex-end", display: "flex", marginBottom: 4 };
  return (
    <ViewTransition exit={"loader-exit"} default={"none"}>
      <div data-loader className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col min-h-screen align-middle justify-center text-center items-center gap-4">
        <ClockLoader color={"#8b5cf6"} size={150} />
        {!children ? <div className="text-2xl font-semibold flex"><p>Loading</p><PulseLoader cssOverride={override} color="var(--foreground)" size={4} /></div>: <div className="text-2xl font-semibold flex"><p>Loading {children}</p><PulseLoader color="var(--foreground)" cssOverride={override} size={4} /></div>}
      </div>
    </ViewTransition>
  ) 
}
export function MenuCard({ link, icon, title, desc }: { link: string, icon: IconProp, title: string, desc: string }) {
  return (
    <Link href={link} className="flex p-2 rounded-lg bg-slate-300 dark:bg-slate-800 justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold hover:text-sky-500"><FontAwesomeIcon icon={icon} /> {title}</h1>
        <p className="text-lg">{desc}</p>
      </div>
      <FontAwesomeIcon icon={faAngleRight} size="2xl" className="hover:text-sky-500" />
    </Link>
  )
}
export function RoleParser({ role }: { role: string | null }) {
  switch (role) {
    case "reader":
      return <p>Role: Reader</p>
    case "writer":
      return <p>Role: Writer</p>
    case "manager":
      return <p>Role: Manager</p>
    default:
      return null;
  }
}
export function NoPermission({ backLink }: { backLink?: string }) {
  return (
    <div className="flex flex-col min-h-screen text-center justify-center align-middle items-center gap-8 fixed inset-0">
      <p className="text-3xl font-semibold">No Permission</p>
      <FontAwesomeIcon icon={faLock} className="text-5xl" />
      <p>You don&apos;t have permission to access this resource.</p>
      <Link href={backLink || "/paper"} className="bg-violet-300 dark:bg-violet-800 rounded-lg p-1 w-fit mt-2 hover:text-sky-500 text-xl"><FontAwesomeIcon icon={faHome} /> Go Home</Link>
    </div>
  )
}
export function PaperNotFound() {
  return (
    <div className="flex flex-col min-h-screen text-center justify-center align-middle items-center gap-8 fixed inset-0">
      <p className="text-3xl font-semibold">Paper Not Found</p>
      <FontAwesomeIcon icon={faQuestion} className="text-5xl" />
      <p>Either this paper doesn&apos;t exist, or you don&apos;t have access to it.</p>
      <Link href="/paper" className="bg-violet-300 dark:bg-violet-800 rounded-lg p-1 w-fit mt-2 hover:text-sky-500 text-xl"><FontAwesomeIcon icon={faHome} /> Go Home</Link>
    </div>
  );
}
export function ItemNotFound({ item, backLink }: { item: "Interview", backLink?: string }) {
  return (
    <div className="flex flex-col min-h-screen text-center justify-center align-middle items-center gap-8 fixed inset-0">
      <p className="text-3xl font-semibold">{item} Not Found</p>
      <FontAwesomeIcon icon={faQuestion} className="text-5xl" />
      <Link href={backLink || "/paper"} className="bg-violet-300 dark:bg-violet-800 rounded-lg p-1 w-fit mt-2 hover:text-sky-500 text-xl"><FontAwesomeIcon icon={faArrowLeft} /> Go Back</Link>
    </div>
  );
}