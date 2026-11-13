"use client"
import { authClient } from "@/utils/auth-client"
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SignOutButton() {
  async function signOut() {
    await authClient.signOut();
  }
  return (
    <button onClick={() => signOut()} className="p-2 bg-red-300 dark:bg-red-600 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faSignOut} /> Sign Out</button>
  )
}