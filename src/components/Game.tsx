import { useStore } from "../store";
import { GameDuo } from "./GameDuo";
import { GamePractice } from "./GamePractice";
import { GameSolo } from "./GameSolo";

type GameProps = {};

export function Game({}: GameProps): JSX.Element | null {
  const gameMode = useStore((state) => state.settings.mode);

  if (gameMode === "practice") {
    return <GamePractice />;
  }
  if (gameMode === "solo") {
    return <GameSolo />;
  }
  if (gameMode === "duo") {
    return <GameDuo />;
  }
  throw new Error(`Unknown game mode: ${gameMode}`);
}
