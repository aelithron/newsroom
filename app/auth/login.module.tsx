"use client"
import { authClient } from "@/utils/auth";
import { type SetStateAction, type Usable, useState } from "react";

type AuthTypes = { email: string, setEmail: Usable<SetStateAction<string>>, password: string, setPassword: Usable<SetStateAction<string>> }
export default function AuthForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  return (
    <div className="flex flex-col">
      
    </div> 
  )
}
function SignUpForm({ email, setEmail, password, setPassword }: AuthTypes) {
  async function emailAuth() {
    //await authClient.signIn.email({  });
  }
  return (
    <div className="flex flex-col">
      
    </div> 
  )
}
function SignInForm({ email, setEmail, password, setPassword }: AuthTypes) {
  async function emailAuth() {
    //await authClient.signIn.email({  });
  }
  return (
    <div className="flex flex-col">
      
    </div> 
  )
}