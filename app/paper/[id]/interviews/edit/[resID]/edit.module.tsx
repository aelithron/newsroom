
"use client";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { isDisplayable, ResponseEditor } from "../../create/create.module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function InterviewEditor({ interview, questions }: { interview: { id: number, paperID: number, name: string | null, responses: { q: number, a: string }[] }, questions: { id: number, question: string, enabled: boolean }[] }) {
  const router = useRouter();
  const [name, setName] = useState<string>(interview.name || "");
  const [responses, setResponses] = useState<{ id: number, answer: string }[]>(interview.responses.map((res) => { return { id: res.q, answer: res.a } }));
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
    try {
      let sentName: string | null = name;
      if (name.trim().length < 1) sentName = null;
      const res = await fetch("/api/interviews", { method: "PATCH", body: JSON.stringify({ interviewID: interview.id, paperID: interview.paperID, name: sentName !== interview.name ? sentName : undefined, responses }) });
      body = await res.json();
    } catch (e) {
      console.error(`Error editing interview!\n${e}`);
      alert(`Error editing interview: unknown (check browser console)`);
      return;
    }
    if (body.error) {
      alert(`Error editing interview: ${body.message} (${body.error})`);
      return;
    }
    router.push(`/paper/${interview.paperID}/interviews/${interview.id}`);
  }
  async function handleDelete() {
    const check = confirm(`Are you sure you want to delete this interview?\n\nInterviewed: ${interview.name || "Unknown"}\nResponses: ${interview.responses.length}`);
    if (!check) return;
    let body;
    try {
      const res = await fetch("/api/interviews", { method: "DELETE", body: JSON.stringify({ interviewID: interview.id, paperID: interview.paperID }) });
      body = await res.json();
    } catch (e) {
      console.error(`Error deleting interview!\n${e}`);
      alert(`Error deleting interview: unknown (check browser console)`);
      return;
    }
    if (body.error) {
      alert(`Error deleting interview: ${body.message} (${body.error})`);
      return;
    }
    router.push(`/paper/${interview.paperID}/interviews`);
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div>
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
                {questions.filter((q) => isDisplayable(responses.map((res) => { return { id: res.id } }), q)).sort((a, b) => b.id - a.id).map((q) => <option key={q.id} value={q.id}>{q.question}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold flex justify-between w-81"><p>Response</p> <p className="text-red-400">*</p></label>
              <textarea rows={6} className="bg-slate-300 dark:bg-slate-800 w-81 p-1 rounded-lg" value={response} onChange={(e) => setResponse(e.target.value)} />
            </div>
            <button type="submit" className="bg-violet-300 dark:bg-violet-800 p-2 rounded-lg w-fit mt-1 hover:text-sky-500"><FontAwesomeIcon icon={faPlus} /> Add Response</button>
          </form>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:col-span-2">
        <h1 className="text-xl font-semibold">Responses</h1>
        {responses.length < 1 && <div className="flex flex-col">
          <p>No responses have been added yet.</p>
          <p>Add some using the form!</p>
        </div>}
        {responses.length >= 1 && <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {responses.sort((a, b) => b.id - a.id).map((response) => <div key={response.id} className="flex flex-col bg-slate-300 dark:bg-slate-800 p-2 rounded-xl">
            <div className="flex gap-3 mb-2 items-center">
              <h2 className="text-lg font-semibold">{(questions.find((q) => q.id === response.id) || { question: "Unknown Question" }).question}</h2>
              <button onClick={() => handleRemoveAnswer(response.id)} className="hover:text-sky-500 bg-red-300 dark:bg-red-600 rounded-lg p-1"><FontAwesomeIcon icon={faTrash} /></button>
            </div>
            <ResponseEditor id={response.id} responses={responses} setResponses={setResponses} />
          </div>)}
        </div>}
      </div>
      <div className="flex gap-2 mt-6">
        <button type="button" onClick={handleSubmit} className="bg-slate-300 dark:bg-slate-800 p-2 rounded-lg w-fit hover:text-sky-500"><FontAwesomeIcon icon={faSave} /> Save Interview</button>
        <button type="button" onClick={handleDelete} className="bg-red-300 dark:bg-red-600 p-2 rounded-lg w-fit hover:text-sky-500"><FontAwesomeIcon icon={faTrash} /> Delete Interview</button>
      </div>
    </div>
  )
}