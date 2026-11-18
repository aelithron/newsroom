"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type SubmitEvent } from "react";

export default function CreateInterviewForm({ paperID, questions }: { paperID: string, questions: { id: number, text: string }[] }) {
  const [name, setName] = useState<string>("");
  const [questionAnswers, setQuestionAnswers] = useState<{ id: number, answer: string }[]>([]);
  const [questionID, setQuestionID] = useState<number>(0);
  const [response, setResponse] = useState<string>("");
  async function handleAddAnswer(e: SubmitEvent) {
    e.preventDefault();
    if (questionID === 0) {
      alert("Please select a question first!");
      return;
    }
    if (response.trim().length < 1) {
      alert("Please enter a response first!");
      return;
    }
    const base = [...questionAnswers];
    base.push({ id: questionID, answer: response });
    setQuestionAnswers(base);
    setQuestionID(0);
    setResponse("");
  }
  async function handleSubmit() {
    
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <label className="font-semibold w-81">Name</label>
        <input className="bg-slate-300 dark:bg-slate-800 w-81 p-1 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <form onSubmit={handleAddAnswer} className="flex flex-col gap-2">
        <h2 className="font-semibold text-lg">Add Responses</h2>
        <div className="flex flex-col gap-1">
          <label className="font-semibold flex justify-between w-81"><p>Question</p> <p className="text-red-400">*</p></label>
          <select className="bg-slate-300 dark:bg-slate-800 w-81 p-1 rounded-lg" value={questionID.toString()} onChange={(e) => setQuestionID(parseInt(e.target.value))}>
            <option disabled={true} value={0}>-- Select a question --</option>
            {questions.map((q) => <option key={q.id} value={q.id}>{q.text}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold flex justify-between w-81"><p>Response</p> <p className="text-red-400">*</p></label>
          <textarea rows={7} className="bg-slate-300 dark:bg-slate-800 w-81 p-1 rounded-lg" value={response} onChange={(e) => setResponse(e.target.value)} />
        </div>
      </form>
      <button type="button" onClick={handleSubmit} className="bg-violet-300 dark:bg-violet-800 p-2 rounded-lg w-fit"><FontAwesomeIcon icon={faPlus} /> Add Interview</button>
    </div>
  )
}