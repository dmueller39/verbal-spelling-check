// @flow
import React, { useState } from "react";

import type { VerbalGameResult, VerbalGame } from "./types";
import { getEnglishGamePlan } from "./gameLogic";
import Level from "./Level";
import Menu from "./Menu";

const OPTIONS = [{ name: "Play", getGamePlan: getEnglishGamePlan }];

export default function Verbal() {
  const [game, setGame] = useState((null: ?VerbalGame));
  if (game == null) {
    return <Menu options={OPTIONS} setGame={setGame} />;
  } else {
    const onComplete = (result: VerbalGameResult) => {
      window.top.postMessage(window.location.href + " - complete", "*");

      setGame(null);
    };

    return <Level game={game} onComplete={onComplete} />;
  }
}
