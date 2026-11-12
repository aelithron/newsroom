import { auth } from "@/utils/auth";
import { faNewspaper, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import crypto from "crypto";
import { user } from "@/utils/schema/auth";

export default async function Home() {
  const session = await auth.api.getSession();
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <div className="flex align-middle items-center">
        <FontAwesomeIcon icon={faNewspaper} size="xl" />
        <h1 className="font-semibold text-2xl">Newsroom (dev!)</h1>
      </div>
      {!session && <Link href={"/auth"} className="mt-2 p-2 bg-violet-300 dark:bg-violet-600 rounded-xl hover:text-sky-500 w-fit"><FontAwesomeIcon icon={faUserPlus} /> Sign In / Sign Up</Link>}
      {session && <div className="bg-slate-200 dark:bg-slate-900 flex justify-between w-fit mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={session.user.image || `https://gravatar.com/avatar/${crypto.createHash("sha256").update(session.user.email.toLowerCase().trim()).digest('hex')}`} alt="Profile Picture" />
        <div>
          <h1 className="text-lg">Hello, {session.user.name}!</h1>
        </div>
      </div>}
      
    </main>
  );
}
