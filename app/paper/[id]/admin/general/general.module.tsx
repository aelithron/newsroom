"use client";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SubmitEvent, useState } from "react";

export default function GeneralAdmin({ paperID, curName }: { paperID: number, curName: string }) {
  const [name, setName] = useState<string>(curName);
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!name || name.trim().length < 1) {
      alert("Please provide a name for your paper!");
      return;
    }
    if (name.trim() === curName.trim()) return;
    let body;
    try {
      const res = await fetch("/api/paper", { method: "PATCH", body: JSON.stringify({ paperID, name }) });
      body = await res.json();
    } catch (e) {
      console.error(`Error editing the paper!\n${e}`);
      alert(`Error editing the paper: unknown (check browser console)`);
      return;
    }
    if (body.error) {
      alert(`Error editing the paper: ${body.message} (${body.error})`)
      return;
    }
    window.location.reload();
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1 mx-auto md:mx-0">
        <label className="font-semibold flex justify-between w-64"><p>Paper Name</p> <p className="text-red-400">*</p></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg" />
      </div>
      <button type="submit" className="w-fit p-1 rounded-lg bg-violet-300 dark:bg-violet-800 hover:text-sky-500 mx-auto md:mx-0"><FontAwesomeIcon icon={faSave} /> Save</button>
    </form>
  )
}