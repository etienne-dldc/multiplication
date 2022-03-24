import clsx from "clsx";
import { useStore } from "../store";
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
      Utiliser l'application pour intéroger un autre joueur.
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

const titleStyle = `uppercase font-semibold tracking-wider text-slate-900 ml-1 text-sm`;

export function Settings(): JSX.Element | null {
  const mode = useStore((state) => state.mode);
  const settings = useStore((state) => state.settings[state.mode]);
  const setMode = useStore((state) => state.setMode);
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
          <SelectButton
            active={mode === "solo"}
            onClick={() => setMode("solo")}
          >
            Solo
          </SelectButton>
          <SelectButton active={mode === "duo"} onClick={() => setMode("duo")}>
            Duo
          </SelectButton>
          <SelectButton
            active={mode === "practice"}
            onClick={() => setMode("practice")}
          >
            Entrainement
          </SelectButton>
        </div>
        <p className="px-3 text-center text-sm">{explications[mode]}</p>
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

function formatTime(time: number): string {
  return (time / 1000).toFixed(1) + (time >= 2000 ? " secondes" : " seconde");
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
