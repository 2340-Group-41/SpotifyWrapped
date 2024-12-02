"use client"
import { DEFAULT_WRAPPED, WrappedInfo } from "@/util/types";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import UserBlock from "../UserBlock";
import Wrapped from "../Wrapped";
import CenteredModal from "../CenteredModal";
import { parseWrapped } from "@/util/helpers";
import DivideY from "../DivideY";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [displayName, setDisplayName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [wrappeds, setWrappeds] = useState<WrappedInfo[]>([]);
  const [wrappedOpen, setWrappedOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      // fetching username and profile picture
      const userRes = await fetch("http://localhost:8000/spotify/get-data/me", {
        credentials: "include", // Include credentials (cookies) in the request
      });
      const userData = await userRes.json();
      setDisplayName(userData.display_name);
      if (userData.images && userData.images[0]) {
        setUserImage(userData.images[0].url);
      }

      // fetching all wrappeds
      const wrappedsRes = await fetch("http://localhost:8000/spotify/get-wrappeds", {
        credentials: "include",
      });
      const wrappedsData = await wrappedsRes.json();
      setWrappeds([...wrappedsData.items.map((w: any) => parseWrapped(w))]);
      console.log("All past wrappeds:");
      console.log(wrappedsData.items);
    })();
  }, []);

  const handleDelete = () => {
    (async () => {
      await fetch("http://localhost:8000/spotify/delete-account", {
        credentials: "include",
      });
      push("/login");
    })();
  }

  const deleteWrapped = (index: number) => {
    (async () => {
      await fetch(`http://localhost:8000/spotify/delete-wrapped/${wrappeds[index].id}`, {
        credentials: "include",
      });
    })();

    wrappeds.filter((_, i) => i !== index);
    setWrappeds([...wrappeds]);
  }

  const openWrapped = (index: number) => {
    setOpenIndex(index);
    setWrappedOpen(true);
  }

  return (
    <div className="w-full flex flex-col items-center gap-12">
      <div className="flex flex-col gap-4 w-full max-w-[35rem]">
        <h1 className="text-center text-3xl font-bold">
          Profile
        </h1>
        <div className="flex justify-center items-center w-full">
          <UserBlock username={displayName} userImage={userImage} className="grow" />
          <Button
            onPress={() => handleDelete()}
            className="bg-red-600 rounded-lg font-bold text-white"
          >
            Delete Account
          </Button>
        </div>
      </div>

      <DivideY />

      <div className="flex flex-col gap-4 w-full max-w-96">
        <h2 className="text-center text-xl font-bold">
          Past Wrappeds
        </h2>
        <p className="text-center text-primary italic">
          Click on one of your past wrappeds to view it!
        </p>
        <div className="flex flex-col divide-y divide-light-border dark:divide-dark-border w-full">
          {wrappeds.map((w, i) =>
            <div key={i} className="flex gap-4 items-center">
              <Button
                onPress={() => openWrapped(i)}
                className="h-16 bg-faint-gray-light dark:bg-faint-gray-dark rounded-lg w-full justify-start grow"
              >
                {(() => {
                  const date = new Date(w.timestamp);
                  return `${date.getMonth() + 1}/${date.getDay() + 1}/${date.getFullYear()} Wrapped${i === 0 ? " — Latest" : ""}`;
                })()}
              </Button>
              <Button
                onPress={() => deleteWrapped(i)}
                className="bg-red-500 font-bold text-white rounded-lg"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <CenteredModal
        isOpen={wrappedOpen}
        setIsOpen={setWrappedOpen}
        className="p-12 rounded-xl w-full max-w-[60rem]"
      >
        <Wrapped wrapped={wrappeds[openIndex]} />
      </CenteredModal>
    </div>
  );
}
