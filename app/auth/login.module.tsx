"use client"
import { authClient } from "@/utils/auth-client";
import { faNewspaper, faSignIn, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type SetStateAction, type Dispatch, useState } from "react";

type AuthTypes = { email: string, setEmail: Dispatch<SetStateAction<string>>, password: string, setPassword: Dispatch<SetStateAction<string>> }
export default function AuthForm({ defaultMode }: { defaultMode: "signUp" | "signIn" }) {
  const [mode, setMode] = useState<"signIn" | "signUp">(defaultMode);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-semibold text-center"><FontAwesomeIcon icon={faUser} />  {mode === "signUp" ? "Create an account on" : "Sign in to"} <FontAwesomeIcon icon={faNewspaper} /> Newsroom</h1>
      <div className="grid grid-cols-2 grid-rows-1 gap-4 mt-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg w-fit mx-auto mb-4">
        <button onClick={() => setMode("signIn")} className={`p-2 text-lg hover:text-sky-500 ${mode === "signIn" ? "bg-violet-300 dark:bg-violet-600" : "bg-violet-200 dark:bg-violet-800"} rounded-lg`}><FontAwesomeIcon icon={faSignIn} /> Sign In</button>
        <button onClick={() => setMode("signUp")} className={`p-2 text-lg hover:text-sky-500 ${mode === "signUp" ? "bg-violet-300 dark:bg-violet-600" : "bg-violet-200 dark:bg-violet-800"} rounded-lg`}><FontAwesomeIcon icon={faUserPlus} /> Sign Up</button>
      </div>
      {mode === "signIn" && <SignInForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} />}
      {mode === "signUp" && <SignUpForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} />}
    </div> 
  )
}
function SignUpForm({ email, setEmail, password, setPassword }: AuthTypes) {
  const [name, setName] = useState<string>("");
  const [emailConf, setEmailConf] = useState<string>("");
  async function emailAuth(e: React.SubmitEvent) {
    e.preventDefault();
    if (!name || name.trim().length < 1) {
      alert(`You didn't provide your name!`);
      return;
    }
    if (!email || email.trim().length < 1) {
      alert(`You didn't provide an email!`);
      return;
    }
    if (!emailConf || emailConf.trim().length < 1) {
      alert(`You didn't confirm your email!`);
      return;
    }
    if (!password || password.trim().length < 1) {
      alert(`You didn't provide a password!`);
      return;
    }
    if (email.toLowerCase().trim() !== emailConf.toLowerCase().trim()) {
      alert(`Your "Email" doesn't match "Confirm Email", please correct these!`);
      return;
    }
    const res = await authClient.signUp.email({ name: name.trim(), email: email.toLowerCase().trim(), password: password.trim() });
    if (res.error) {
      alert(`Sign up failed! ${res.error.message}`);
      return;
    }
  }
  return (
    <form className="flex flex-col justify-center text-center gap-0.5" onSubmit={(e) => emailAuth(e)}>
      <button type="button" onClick={async () => await authClient.signIn.social({ provider: "google" })} className="hover:text-sky-500 p-1 rounded-lg w-fit mx-auto bg-green-400 dark:bg-green-600"><FontAwesomeIcon icon={faGoogle} /> Sign up with Google</button>
      <label className="font-semibold flex justify-between w-64 mx-auto"><p>Name</p> <p className="text-red-400">*</p></label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg mx-auto" />
      <label className="font-semibold flex justify-between w-64 mx-auto"><p>Email</p> <p className="text-red-400">*</p></label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg mx-auto" />
      <label className="font-semibold flex justify-between w-64 mx-auto"><p>Confirm Email</p> <p className="text-red-400">*</p></label>
      <input type="email" value={emailConf} onChange={(e) => setEmailConf(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg mx-auto" />
      <label className="font-semibold flex justify-between w-64 mx-auto"><p>Password</p> <p className="text-red-400">*</p></label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg mx-auto" />
      <button type="submit" className="bg-violet-500 rounded-xl p-2 w-fit mx-auto mt-3 hover:text-sky-500"><FontAwesomeIcon icon={faUserPlus} /> Sign Up</button>
    </form>
  )
}
function SignInForm({ email, setEmail, password, setPassword }: AuthTypes) {
  async function emailAuth(e: React.SubmitEvent) {
    e.preventDefault();
    if (!email || email.trim().length < 1) {
      alert(`You didn't provide an email!`);
      return;
    }
    if (!password || password.trim().length < 1) {
      alert(`You didn't provide a password!`);
      return;
    }
    const res = await authClient.signIn.email({ email: email.toLowerCase().trim(), password: password.trim() });
    if (res.error) {
      alert(`Login failed! ${res.error.message}`);
      return;
    }
  }
  return (
    <form className="flex flex-col justify-center text-center gap-0.5" onSubmit={(e) => emailAuth(e)}>
      <button type="button" onClick={async () => await authClient.signIn.social({ provider: "google" })} className="hover:text-sky-500 p-1 rounded-lg w-fit mx-auto bg-green-400 dark:bg-green-600"><FontAwesomeIcon icon={faGoogle} /> Sign in with Google</button>
      <label className="font-semibold flex justify-between w-64 mx-auto"><p>Email</p> <p className="text-red-400">*</p></label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg mx-auto" />
      <label className="font-semibold flex justify-between w-64 mx-auto"><p>Password</p> <p className="text-red-400">*</p></label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-300 dark:bg-slate-800 w-64 p-1 rounded-lg mx-auto" />
      <button type="submit" className="bg-violet-500 rounded-xl p-2 w-fit mx-auto mt-3 hover:text-sky-500"><FontAwesomeIcon icon={faSignIn} /> Sign In</button>
    </form>
  )
}