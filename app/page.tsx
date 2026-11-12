import { faNewspaper, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <div className="flex align-middle items-center">
        <FontAwesomeIcon icon={faNewspaper} size="xl" />
        <h1 className="font-semibold text-2xl">Newsroom (dev!)</h1>
      </div>
      <Link href={"/auth"} className="mt-2 p-2 bg-violet-300 dark:bg-violet-600 rounded-xl hover:text-sky-500 w-fit"><FontAwesomeIcon icon={faUserPlus} /> Sign In / Sign Up</Link>
    </main>
  );
}
