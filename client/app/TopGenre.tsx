import { useContext } from "react";
import { LangContext } from "./DarkModeProvider";


export default function TopGenre(props: {
  topGenre: string,
}) {
  const { topGenre } = props;

  const lang = useContext(LangContext);

  return (
    <div className="max-w-full">
      <div className="flex flex-wrap gap-2 text-3xl">
        <p>{lang.your}</p>
        <p className="text-secondary">
          Top
        </p>
        <p>Genre</p>
      </div>
      <p className="text-2xl text-primary mt-12">
        {topGenre || "Genre"}
      </p>
    </div>
  )
}