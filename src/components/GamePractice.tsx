import { ArrowLeft, Wrench } from "phosphor-react";
import { useStore } from "../store";

type GamePracticeProps = {};

export function GamePractice({}: GamePracticeProps): JSX.Element | null {
  const stopGame = useStore((state) => state.stopGame);

  return (
    <div className="rounded-2xl shadow-md bg-white flex flex-col items-stretch p-3 space-y-3 h-full">
      <button
        onClick={stopGame}
        className="flex flex-row space-x-3 py-2 px-4 items-center rounded-xl bg-slate-900 text-white self-start hover:bg-slate-800"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </button>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex space-y-4 items-center flex-col">
          <Wrench className="w-20 h-20 text-slate-800" weight="duotone" />
          <p className="text-2xl font-semibold text-slate-600">
            En constructions...
          </p>
        </div>
      </div>
    </div>
  );
}
