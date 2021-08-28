import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useUser } from "../hooks/use-user";
import { LikeAttributes } from "@tma/api/attributes";

const Heart = dynamic(() => import("react-animated-heart"), { ssr: false });

export const LikeButton: React.FC<{
  likes: LikeAttributes[],
  onLike(): void;
}> = ({ likes, onLike }) => {
  const user = useUser();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (user.data)
      setPressed(likes.some(like => like.userID == user.data?.id));
  }, [user]);

  return user ? (
    <div className="flex items-center">
      <div className="w-[40px] h-[40px]">
        <div className={`heart ${pressed ? "heart-active" : ""} ${user.data == null ? "cursor-not-allowed" : ""}`} onClick={() => {
          if (user.data) {
            setPressed(!pressed);
            onLike();
          }
        }}/>
      </div>
      <span className={`ml-0.5 ${pressed ? "text-red-400" : "text-gray-400"}`}>
        {likes.length}
      </span>
    </div>
  ) : null;
}
