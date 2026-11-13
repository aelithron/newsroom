import { auth } from "@/utils/auth";
import { faNewspaper, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import crypto from "crypto";
import { headers } from "next/headers";
import { Suspense } from "react";
import SignOutButton from "./signout.module";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <div className="flex align-middle items-center mb-2">
        <FontAwesomeIcon icon={faNewspaper} size="xl" />
        <h1 className="font-semibold text-2xl">Newsroom (dev!)</h1>
      </div>
      <Suspense>
        <MainButtons />
      </Suspense>
    </main>
  );
}
async function MainButtons() {
  const session = await auth.api.getSession({ headers: await headers() });
  let gravatarURL = "";
  if (session && session.user.email) gravatarURL = `https://gravatar.com/avatar/${crypto.createHash("sha256").update(session.user.email.toLowerCase().trim()).digest("hex")}`;
  return (
    <div>
      {!session && <Link href={"/auth"} className="mt-2 p-2 bg-violet-300 dark:bg-violet-600 rounded-xl hover:text-sky-500 w-fit"><FontAwesomeIcon icon={faUserPlus} /> Sign In / Sign Up</Link>}
      {session && <div className="bg-slate-200 dark:bg-slate-900 flex justify-between w-100 gap-2 align-middle text-center p-3 rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={session.user.image || gravatarURL} alt="Profile Picture" className="rounded-lg" height="90" width="90" />
        <div className="flex flex-col text-center align-middle justify-center">
          <h1 className="text-lg">Hello, {session.user.name}!</h1>
          <div className="flex gap-2 mt-2">
            <Link href={"/paper"} className="p-2 bg-violet-300 dark:bg-violet-600 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faNewspaper} /> Go to Papers</Link>
            <SignOutButton />
          </div>
        </div>
      </div>}
    </div>
  )
}
