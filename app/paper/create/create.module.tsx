"use client";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type SubmitEvent } from "react";

export default function CreatePaperForm() {
  const [name, setName] = useState<string>("");
  async function handleCreate(e: SubmitEvent) {
    e.preventDefault();
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