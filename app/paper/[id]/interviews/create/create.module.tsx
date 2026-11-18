"use client";
import { useState, type SubmitEvent } from "react";

export default function CreateInterviewForm({ paperID, questions }: { paperID: string, questions: { id: number, text: string }[] }) {
  const [name, setName] = useState<string>("");
  const [questionAnswers, setQuestionAnswers] = useState<{ id: number, answer: string }[]>([]);
  const [questionID, setQuestionID] = useState<number | null>(null);
  const [response, setResponse] = useState<string>("");
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-slate-300 dark:bg-slate-800">
      <div>

      </div>
    </form>
  )
}