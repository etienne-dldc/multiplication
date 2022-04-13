import clsx from "clsx";
import {
  formatTime,
  GAME_DIFFICULTY_NAME,
  GAME_MODE_NAME,
  useStore,
} from "../store";
import { Plus, Minus } from "phosphor-react";
import { Fragment } from "react";

const explications = {
  solo: (
    <Fragment>
      Vous devez entrer la bonne réponse dans le temps imparti.
      <br />
      Chaque bonne réponse vous donne un point.
    </Fragment>
  ),
  duo: (
    <Fragment>
      Utiliser l'application pour interroger un autre joueur.
      <br />
      La réponse s'affiche en même temps que la question.
      <br />
      Chaque bonne réponse rapporte un point.
    </Fragment>
  ),
  practice: (
    <Fragment>
      La réponse s'affiche à la fin du temps imparti.
      <br />
      Pas de comptage des points.
    </Fragment>
  ),
};

const difficultyExplain = {
  easy: "Uniquement les tables de 1, 2, 3, 4 et 5",
  normal: "Toutes les tables de multiplication de 1 à 10",
  hard: "Uniquement les tables de 3, 4, 6, 7, 8 et 9",
};

const titleStyle = `uppercase font-semibold tracking-wider text-slate-900 ml-1 text-sm`;

export function Settings(): JSX.Element | null {
  const currentMode = useStore((state) => state.mode);
  const settings = useStore((state) => state.settings[state.mode]);
  const setMode = useStore((state) => state.setMode);
  const setDifficulty = useStore((state) => state.setDifficulty);
  const increaseTime = useStore((state) => state.increaseTime);
  const decreaseTime = useStore((state) => state.decreaseTime);
  const increaseRounds = useStore((state) => state.increaseRounds);
  const decreaseRounds = useStore((state) => state.decreaseRounds);
  const startGame = useStore((state) => state.startGame);

  return (
    <div className="rounded-2xl shadow-md bg-white flex flex-col items-stretch p-3 space-y-3">
      <h2 className="text-lg text-slate-900 font-semibold tracking-wider mx-2 text-center">
        Réglages
      </h2>
      <div className="rounded-xl bg-cyan-200 p-3 space-y-3">
        <h3 className={titleStyle}>Mode de jeu</h3>
        <div className="flex flex-row items-stretch divide-x divide-slate-900 border border-slate-900 rounded-lg overflow-hidden">
          {(["solo", "duo", "practice"] as const).map((mode) => (
            <SelectButton
              key={mode}
              active={currentMode === mode}
              onClick={() => setMode(mode)}
            >
              {GAME_MODE_NAME[mode]}
            </SelectButton>
          ))}
        </div>
        <p className="px-3 text-center text-sm">{explications[currentMode]}</p>
      </div>
      <div className="rounded-xl bg-sky-200 p-3 space-y-3">
        <h3 className={titleStyle}>Rounds</h3>
        <Counter
          value={`${settings.rounds} questions`}
          onPlus={increaseRounds}
          onMinus={decreaseRounds}
        />
      </div>
      <div className="rounded-xl bg-teal-200 p-3 space-y-3">
        <h3 className={titleStyle}>Minuteur</h3>
        <Counter
          value={formatTime(settings.times)}
          onPlus={increaseTime}
          onMinus={decreaseTime}
        />
      </div>
      <div className="rounded-xl bg-cyan-200 p-3 space-y-3">
        <h3 className={titleStyle}>Difficulté</h3>
        <div className="flex flex-row items-stretch divide-x divide-slate-900 border border-slate-900 rounded-lg overflow-hidden">
          {(["easy", "normal", "hard"] as const).map((difficulty) => (
            <SelectButton
              key={difficulty}
              active={settings.difficulty === difficulty}
              onClick={() => setDifficulty(difficulty)}
            >
              {GAME_DIFFICULTY_NAME[difficulty]}
            </SelectButton>
          ))}
        </div>
        <p className="px-3 text-center text-sm">
          {difficultyExplain[settings.difficulty]}
        </p>
      </div>
      <button
        onClick={startGame}
        className="rounded-xl border border-blue-900 hover:bg-blue-900 text-blue-900 hover:text-white p-3 text-lg font-semibold tracking-wider"
      >
        Démarrer !
      </button>
    </div>
  );
}

type SelectButtonProps = {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

const buttonStyle = {
  normal: "hover:bg-slate-400",
  active: "bg-slate-900 text-white hover:bg-slate-800",
};

export function SelectButton({
  children,
  active,
  onClick,
}: SelectButtonProps): JSX.Element | null {
  return (
    <button
      className={clsx(
        "flex-1 text-lg p-2 font-semibold",
        buttonStyle[active ? "active" : "normal"]
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type CounterProps = {
  value: string;
  onPlus: () => void;
  onMinus: () => void;
};

export function Counter({
  value,
  onMinus,
  onPlus,
}: CounterProps): JSX.Element | null {
  return (
    <div className="flex flex-row items-stretch divide-x divide-slate-900 border border-slate-900 rounded-lg overflow-hidden">
      <button
        onClick={onMinus}
        className="p-3 hover:bg-slate-900 hover:text-white flex items-center justify-center"
      >
        <Minus className="w-5 h-5" weight="bold" />
      </button>
      <span className="flex-1 text-center p-2 text-xl">{value}</span>
      <button
        onClick={onPlus}
        className="p-3 hover:bg-slate-900 hover:text-white flex items-center justify-center"
      >
        <Plus className="w-5 h-5" weight="bold" />
      </button>
    </div>
  );
}
