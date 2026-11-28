"use client";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function InviteControls({ inviteID, paperID }: { inviteID: number, paperID: number }) {
  const router = useRouter();
  async function handleStatus(accepted: boolean) {
    let body;
    try {
      const res = await fetch("/api/invites", { method: "PUT", body: JSON.stringify({ inviteID, accepted }) });
      body = await res.json();
    } catch (e) {
      console.error(`Error ${accepted ? "accepting" : "declining"} invite!\n${e}`);
      alert(`Error ${accepted ? "accepting" : "declining"} invite: unknown (check browser console)`);
      return;
    }
    if (body.error) {
      alert(`Error ${accepted ? "accepting" : "declining"} invite: ${body.message} (${body.error})`)
      return;
    }
    if (accepted) {
      router.push(`/paper/${paperID}`);
    } else {
      window.location.reload();
    }
  }
  return (
    <div className="flex gap-2">
      <button onClick={() => handleStatus(true)} className="bg-green-300 dark:bg-green-600 rounded-lg px-2 py-1 hover:text-sky-500"><FontAwesomeIcon icon={faCheck} /> Accept</button>
      <button onClick={() => handleStatus(false)} className="bg-red-300 dark:bg-red-500 rounded-lg px-2 py-1 hover:text-sky-500"><FontAwesomeIcon icon={faX} /> Decline</button>
    </div>
  )
}