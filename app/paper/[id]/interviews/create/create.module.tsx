"use client";
import { faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useState, type SubmitEvent, useEffect } from "react";

export default function CreateInterviewForm({ paperID, questions }: { paperID: string, questions: { id: number, text: string, enabled: boolean }[] }) {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [responses, setResponses] = useState<{ id: number, answer: string }[]>([]);
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
    const base = [...responses];
    base.push({ id: questionID, answer: response });
    setResponses(base);
    setQuestionID(0);
    setResponse("");
  }
  function handleRemoveAnswer(id: number) {
    const base = [...responses].filter((res) => res.id !== id);
    setResponses(base);
  }
  async function handleSubmit() {
    let body;
    if (responses.length < 1) {
      alert("Please add at least one response!");
      return;
    }
    if (response.trim().length >= 1) {
      const check = confirm("You have started adding a response, but haven't clicked the Add Response button yet.\nIf you continue before adding it, that response will be lost.\nDo you want to continue anyway?");
      if (!check) return;
    }
    try {
      const res = await fetch("/api/interviews", { method: "POST", body: JSON.stringify({ paperID, name: name.length >= 1 ? name : undefined, responses }) });
      body = await res.json();
    } catch (e) {
      console.error(`Error saving interview!\n${e}`);
      alert(`Error saving interview: unknown (check browser console)`);
      return;
    }
    if (body.error) {
      alert(`Error saving interview: ${body.message} (${body.error})`);
      return;
    }
    router.push(`/paper/${paperID}/interviews/${body.id}`);
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 mx-auto md:mx-0">
            <label className="font-semibold w-81">Name</label>
            <input className="bg-slate-300 dark:bg-slate-800 w-81 p-1 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <form onSubmit={handleAddAnswer} className="flex flex-col gap-2">
            <h2 className="font-semibold text-lg text-center md:text-start">Add Responses</h2>
            <div className="flex flex-col gap-1 mx-auto md:mx-0">
              <label className="font-semibold flex justify-between w-81"><p>Question</p> <p className="text-red-400">*</p></label>
              <select className="bg-slate-300 dark:bg-slate-800 w-81 p-1 rounded-lg" value={questionID.toString()} onChange={(e) => setQuestionID(parseInt(e.target.value))}>
                <option disabled={true} value={0}>-- Select a question --</option>
                {questions.filter((q) => isDisplayable(responses, q)).sort((a, b) => b.id - a.id).map((q) => <option key={q.id} value={q.id}>{q.text}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 mx-auto md:mx-0">
              <label className="font-semibold flex justify-between w-81"><p>Response</p> <p className="text-red-400">*</p></label>
              <textarea rows={6} className="bg-slate-300 dark:bg-slate-800 w-81 p-1 rounded-lg" value={response} onChange={(e) => setResponse(e.target.value)} />
            </div>
            <button type="submit" className="bg-violet-300 dark:bg-violet-800 p-2 rounded-lg w-fit mx-auto md:mx-0 mt-1 hover:text-sky-500"><FontAwesomeIcon icon={faPlus} /> Add Response</button>
          </form>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:col-span-2">
        <h1 className="text-xl font-semibold text-center md:text-start mt-2 md:mt-0">Responses</h1>
        {responses.length < 1 && <div className="flex flex-col text-center md:text-start">
          <p>No responses have been added yet.</p>
          <p>Add some using the form!</p>
        </div>}
        {responses.length >= 1 && <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {responses.sort((a, b) => b.id - a.id).map((response) => <div key={response.id} className="flex flex-col bg-slate-300 dark:bg-slate-800 p-2 rounded-xl">
            <div className="flex gap-3 mb-2 items-center">
              <h2 className="text-lg font-semibold">{(questions.find((q) => q.id === response.id) || { question: "Unknown Question" }).text}</h2>
              <button onClick={() => handleRemoveAnswer(response.id)} className="hover:text-sky-500 bg-red-300 dark:bg-red-600 rounded-lg p-1"><FontAwesomeIcon icon={faTrash} /></button>
            </div>
            <ResponseEditor id={response.id} responses={responses} setResponses={setResponses} />
          </div>)}
        </div>}
      </div>
      <button type="button" onClick={handleSubmit} className="bg-slate-300 dark:bg-slate-800 p-2 rounded-lg w-fit mx-auto md:mx-0 hover:text-sky-500 mt-6"><FontAwesomeIcon icon={faSave} /> Save Interview</button>
    </div>
  )
}
export function isDisplayable(responses: { id: number }[], question: { id: number, enabled: boolean }) {
  const usedIDs: number[] = [];
  for (const res of responses) usedIDs.push(res.id);
  if (usedIDs.includes(question.id)) return false;
  return question.enabled;
}
export function ResponseEditor({ id, responses, setResponses }: { id: number, responses: { id: number, answer: string }[], setResponses: Dispatch<SetStateAction<{ id: number, answer: string }[]>> }) {
  const [response, setResponse] = useState<string>((responses.find((res) => res.id === id) || { answer: "" }).answer);
  useEffect(() => {
    const base = [...responses].filter((res) => res.id !== id);
    base.push({ id, answer: response });
    setResponses(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);
  return (
    <textarea rows={4} className="bg-slate-300 dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-900 w-full p-1 rounded-lg" value={response} onChange={(e) => setResponse(e.target.value)} />
  )
}