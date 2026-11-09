import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <div className="flex align-middle items-center">
        <FontAwesomeIcon icon={faBook} />
        <h1 className="font-semibold text-lg">Newsroom</h1>
      </div>
    </main>
  );
}
