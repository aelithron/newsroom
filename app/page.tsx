import { auth } from "@/utils/auth";
import { faNewspaper, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import crypto from "crypto";
import { headers } from "next/headers";
import { Suspense } from "react";
import SignOutButton from "./signout.module";
import { GeneralHeader } from "./framing.module";

export default function Home() {
  return (
    <main>
      <GeneralHeader />
      <div className="flex flex-col min-h-screen p-8 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          <div className="flex flex-col gap-2">
            <div className="flex align-middle items-center gap-1">
              <FontAwesomeIcon icon={faNewspaper} size="2xl" />
              <h1 className="font-semibold text-3xl">Newsroom</h1>
              <p className="bg-amber-300 dark:bg-amber-600 p-1 rounded-lg ml-2 text-lg font-semibold">Early Beta</p>
            </div>
            <h2 className="font-semibold text-xl mt-3">Plan, Write, and Publish News Articles</h2>
            <div className="text-lg wrap-break-word mt-2">
              Newsroom is a powerful tool for coordinating, writing, and publishing news articles.
              It has features for papers of any size and type, and is designed for school newspapers first.
            </div>
          </div>
          <div className="flex flex-col gap-2">

          </div>
        </div>
      </div>
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
