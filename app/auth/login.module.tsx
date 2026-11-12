"use client"
import { authClient } from "@/utils/auth";
import { faNewspaper, faSignIn, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type SetStateAction, type Dispatch, useState } from "react";

type AuthTypes = { email: string, setEmail: Dispatch<SetStateAction<string>>, password: string, setPassword: Dispatch<SetStateAction<string>> }
export default function AuthForm() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-semibold text-center"><FontAwesomeIcon icon={faUser} />  {mode === "signUp" ? "Sign up for" : "Sign in to"} <FontAwesomeIcon icon={faNewspaper} /> Newsroom</h1>
      <div className="grid grid-cols-2 grid-rows-1 gap-4 mt-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg w-fit mx-auto mb-4">
        <button onClick={() => setMode("signIn")} className={`p-2 text-lg ${mode === "signIn" ? "bg-violet-300 dark:bg-violet-600" : "bg-violet-200 dark:bg-violet-800"} rounded-lg`}><FontAwesomeIcon icon={faSignIn} /> Sign In</button>
        <button onClick={() => setMode("signUp")} className={`p-2 text-lg ${mode === "signUp" ? "bg-violet-300 dark:bg-violet-600" : "bg-violet-200 dark:bg-violet-800"} rounded-lg`}><FontAwesomeIcon icon={faUserPlus} /> Sign Up</button>
      </div>
      {mode === "signIn" && <SignInForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} />}
      {mode === "signUp" && <SignUpForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} />}
    </div> 
  )
}
function SignUpForm({ email, setEmail, password, setPassword }: AuthTypes) {
  async function emailAuth() {
    //await authClient.signUp.email({  });
  }
  return (
    <form className="flex flex-col justify-center text-center">
      
    </form>
  )
}
function SignInForm({ email, setEmail, password, setPassword }: AuthTypes) {
  async function emailAuth(e: React.SubmitEvent) {
    e.preventDefault();
    await authClient.signIn.email({ email, password });
  }
  return (
    <form className="flex flex-col justify-center text-center gap-0.5" onSubmit={(e) => emailAuth(e)}>
      <label className="font-semibold">Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg mx-auto" />
      <label className="font-semibold mt-2">Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg mx-auto" />
    </form>
  )
}