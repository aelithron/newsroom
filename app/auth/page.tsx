import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthForm from "./login.module";

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:px-20">
      <h1 className="text-xl font-semibold text-center">Welcome to <FontAwesomeIcon icon={faNewspaper} size="lg" /> Newsroom!</h1>
      <AuthForm />
    </main>
  )
}