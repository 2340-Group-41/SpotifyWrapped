import { UserDescriptionType } from "@/util/types";
import { useContext } from "react";
import { LangContext } from "./DarkModeProvider";


export default function UserDescription(props: {
  description: UserDescriptionType,
}) {
  const { description } = props;
  const lang = useContext(LangContext);

  const getDescription = () => {
    console.log("description:");
    console.log(description);
    switch (lang.lang) {
      case "English":
        console.log("english:");
        // @ts-ignore
        return description[0].english;
      case "Chinese":
        // @ts-ignore
        return description[0].chinese;
      case "Korean":
        // @ts-ignore
        return description[0].korean;
    }
  }

  return (
    <div className="max-w-full">
      <div className="flex flex-wrap gap-2 text-3xl">
        <p>{lang.whatsYour}</p>
        <div className="flex">
          <p className="text-secondary">
            {lang.musicPers}
          </p>
          <p>?</p>
        </div>
      </div>
      <p className="text-2xl text-primary mt-12">
        {getDescription()}
      </p>
    </div>
  )
}
