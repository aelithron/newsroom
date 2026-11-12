import AuthForm from "./login.module";

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <AuthForm />
    </main>
  )
}