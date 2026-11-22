"use client";
import { faPencil, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type SubmitEvent, type Dispatch, type SetStateAction } from "react";

export default function CreateQuestions({ paperID, initQuestions }: { paperID: number, initQuestions: { id: number, text: string, enabled: boolean }[] }) {
  const [allQuestions, setAllQuestions] = useState<{ id: number, text: string, enabled: boolean }[]>(initQuestions);
  const [question, setQuestion] = useState<string>("");
  const [showDisabled, setShowDisabled] = useState<boolean>(false);
  const [editedID, setEditedID] = useState<number | null>(null);
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
      <div className="flex gap-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        <div className="flex gap-2 bg-slate-300 dark:bg-slate-800 rounded-lg px-2 py-1 items-center">
          <input type="checkbox" checked={showDisabled} onChange={(e) => setShowDisabled(e.target.checked)} />
          <label className="text-sm">Show Disabled</label>
        </div>
      </div>
      {(!showDisabled ? allQuestions.filter((q) => q.enabled) : allQuestions).sort((a, b) => a.id - b.id).map((question) => <div key={question.id}>
        {editedID !== question.id && <div className="flex gap-2 items-center">
          <p>{question.text}</p>
          <button onClick={() => setEditedID(question.id)} className="bg-violet-300 dark:bg-violet-800 p-1 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faPencil} /></button>
        </div>}
        {editedID === question.id && <EditQuestion id={question.id} origText={question.text} origEnabled={question.enabled} allQuestions={allQuestions} setAllQuestions={setAllQuestions} setEditedID={setEditedID} />}
      </div>)}
      {allQuestions.length < 1 && <div className="flex flex-col gap-1">
        <p>No questions yet!</p>
        <p>Add one with the box above.</p>
      </div>}
    </div>
  )
}

function EditQuestion({ id, origText, origEnabled, allQuestions, setAllQuestions, setEditedID }: { id: number, origText: string, origEnabled: boolean, allQuestions: { id: number, text: string, enabled: boolean }[], setAllQuestions: Dispatch<SetStateAction<{ id: number, text: string, enabled: boolean }[]>>, setEditedID: Dispatch<SetStateAction<number | null>> }) {
  const [text, setText] = useState<string>(origText);
  const [enabled, setEnabled] = useState<boolean>(origEnabled);
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setEditedID(null);
  }
  async function handleDelete() {
    setAllQuestions([...allQuestions].filter((q) => q.id !== id));
    setEditedID(null);
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input value={text} onChange={(e) => setText(e.target.value)} className="bg-slate-300 dark:bg-slate-800 p-2 rounded-lg w-81" />
      <div className="flex gap-3">
        <div className="flex gap-2 items-center bg-slate-300 dark:bg-slate-800 py-1 px-2 rounded-lg">
          <label className="text-sm">Enabled?</label>
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        </div>
        <button type="submit" className="bg-violet-300 dark:bg-violet-800 p-1 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faSave} /> Save</button>
        <button type="button" onClick={handleDelete} className="bg-red-300 dark:bg-red-500 p-1 rounded-lg hover:text-sky-500"><FontAwesomeIcon icon={faTrash} /> Delete</button>
      </div>
    </form>
  )
}