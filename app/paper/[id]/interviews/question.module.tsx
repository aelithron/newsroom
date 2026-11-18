"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type SubmitEvent } from "react";

export default function CreateQuestions({ paperID, initQuestions }: { paperID: number, initQuestions: { id: number, text: string }[] }) {
  const [allQuestions, setAllQuestions] = useState<{ id: number, text: string }[]>(initQuestions);
  const [question, setQuestion] = useState<string>("");
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    let id;
    try {
      const res = await fetch("/api/interviews/questions", { method: "POST", body: JSON.stringify({ paperID, question }) });
      const body = await res.json();
      if (body.error) {
        alert(`There was an error creating your question: ${body.message} (${body.error})`);
        return;
      }
      id = body.id;
    } catch (e) {
      console.error(`Error creating a question: ${e}`);
      alert("There was an error creating your question! Check console for more info on this.");
      return;
    }
    const newQuestions = [...allQuestions];
    newQuestions.push({ text: question, id });
    setAllQuestions(newQuestions);
    setQuestion("");
  }
  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2 bg-slate-300 dark:bg-slate-800 p-2 rounded-lg">
        <input />
        <button type="submit" className="bg-violet-300 dark:bg-violet-800 p-2 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faPlus} /></button>
      </form>
    </div>
  )
}