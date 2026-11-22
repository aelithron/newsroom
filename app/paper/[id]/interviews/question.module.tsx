"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type SubmitEvent } from "react";

export default function CreateQuestions({ paperID, initQuestions }: { paperID: number, initQuestions: { id: number, text: string, enabled: boolean }[] }) {
  const [allQuestions, setAllQuestions] = useState<{ id: number, text: string, enabled: boolean }[]>(initQuestions);
  const [question, setQuestion] = useState<string>("");
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!question) {
      alert("No question was entered, please provide one!");
      return;
    }
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
    newQuestions.push({ text: question, id, enabled: true });
    setAllQuestions(newQuestions);
    setQuestion("");
  }
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">New Question:</h2>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-semibold flex justify-between w-81"><p>Question</p> <p className="text-red-400">*</p></label>
          <input className="bg-slate-300 dark:bg-slate-800 w-81 p-1 rounded-lg" value={question} onChange={(e) => setQuestion(e.target.value)} />
        </div>
        <button type="submit" className="bg-violet-300 dark:bg-violet-800 p-2 rounded-lg hover:text-sky-500 h-fit my-auto"><FontAwesomeIcon icon={faPlus} /></button>
      </form>
      <h2 className="text-xl font-semibold">Questions:</h2>
      {allQuestions.map((question) => <div key={question.id}>
        {question.text}
      </div>)}
      {allQuestions.length < 1 && <div className="flex flex-col gap-1">
        <p>No questions yet!</p>
        <p>Add one with the box above.</p>
      </div>}
    </div>
  )
}