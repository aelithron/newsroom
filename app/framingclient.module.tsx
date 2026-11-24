"use client";
import { authClient } from "@/utils/auth-client";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export function UserProfile({ imageURL, name }: { imageURL: string, name: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  async function signOut() {
    await authClient.signOut();
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/";
  }
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageURL} alt="Profile Picture" height={40} width={40} className="rounded-lg ml-2" />
      </button>
      {isOpen && <div className="absolute z-10 top-20 mx-auto md:mx-0 -translate-x-10 md:translate-x-0 md:top-17 md:right-[-25] w-80 bg-violet-300 dark:bg-violet-950 p-2 rounded-lg flex justify-between gap-4 items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageURL} alt="Profile Picture" height={60} width={60} className="rounded-lg ml-2" />
        <div className="flex flex-col gap-2 w-80">
          <h2>Hello, {name}!</h2>
          <button onClick={() => signOut()} className="py-1 px-2 bg-red-300 dark:bg-red-600 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faSignOut} /> Sign Out</button>
        </div>
      </div>}
    </div>
  )
}