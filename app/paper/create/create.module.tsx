"use client";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";

export default function CreatePaperForm() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  async function handleCreate(e: SubmitEvent) {
    e.preventDefault();
    if (!name || name.trim().length < 1) {
      alert("Please provide a name for your paper!");
      return;
    }
    let body;
    try {
      const res = await fetch("/api/paper", { method: "POST", body: JSON.stringify({ name }) });
      body = await res.json();
    } catch (e) {
      console.error(`Error creating paper!\n${e}`);
      alert(`Error creating your paper: unknown (check browser console)`);
      return;
    }
    router.push(`/paper/${body.id}`);
  }
  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-3 mt-2">
      <div className="flex flex-col gap-1">
        <label className="font-semibold flex justify-between w-64"><p>Name</p> <p className="text-red-400">*</p></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg" />
      </div>
      <button type="submit" className="hover:text-sky-500 p-1 bg-violet-300 dark:bg-violet-900 w-fit rounded-xl"><FontAwesomeIcon icon={faPlusCircle} /> Create</button>
    </form>
  );
}