import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GeneralHeader } from "./framing.module";

export default function Home() {
  return (
    <main>
      <GeneralHeader />
      <div className="flex flex-col min-h-screen p-8 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          <div className="flex flex-col gap-2">
            <div className="flex align-middle items-center gap-1">
              <FontAwesomeIcon icon={faNewspaper} size="2xl" />
              <h1 className="font-semibold text-3xl">Newsroom</h1>
              <p className="bg-amber-300 dark:bg-amber-600 p-1 rounded-lg ml-2 text-lg font-semibold">Early Beta</p>
            </div>
            <h2 className="font-semibold text-xl mt-3">Plan, Write, and Publish News Articles</h2>
            <div className="text-lg wrap-break-word mt-2">
              Newsroom is a powerful tool for coordinating, writing, and publishing news articles.
              It has features for papers of any size and type, and is designed for school newspapers first.
            </div>
          </div>
          <div className="flex flex-col gap-2">

          </div>
        </div>
      </div>
    </main>
  );
}