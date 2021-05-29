declare module "react-animated-heart" {
  import React from "react";

  const Heart: React.FC<{
    isClick: boolean,
    onClick: () => void
  }>;

  export = Heart;
}
