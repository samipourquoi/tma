import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useUser } from "../hooks/use-user";
import { GET_ArchiveResult, POST } from "hamlet/api";
import { fetcher } from "../api";
const Heart = dynamic(() => import("react-animated-heart"), { ssr: false });

export const LikeButton: React.FC<{
  archive: GET_ArchiveResult,
  onLike(): void;
}> = ({ archive, onLike }) => {
  const user = useUser();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (user)
      setPressed(archive.likes.includes(user.id));
  }, [user]);

  return user ? (
    <div className="flex items-center">
      <div className="w-[40px] h-[40px]">
        <div className={`heart ${pressed ? "heart-active" : ""}`} onClick={() => {
          setPressed(!pressed);
          onLike();
        }}/>
      </div>
      <span className={`ml-0.5 ${pressed ? "text-red-400" : "text-gray-400"}`}>
        {archive.likes.length}
      </span>
    </div>
  ) : null;
}
