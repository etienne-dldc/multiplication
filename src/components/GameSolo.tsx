import clsx from "clsx";
import { ArrowLeft, Wrench } from "phosphor-react";
import { useCallback, useEffect, useReducer } from "react";
import { TimeRange, useTimeRange } from "../hooks/useTimeRange";
import { useStore } from "../store";
import { Timer } from "./Timer";

type GameSoloProps = {};

type Question = {
  a: number;
  b: number;
  timer: TimeRange;
  correct: null | boolean;
};

type State = {
  rounds: number;
  timer: number;
  score: number;
  question: null | Question;
};

type Action =
  | { type: "start" }
  | { type: "incorrect" }
  | { type: "correct" }
  | { type: "next" };

function reducer(state: State, action: Action): State {
  if (action.type === "start") {
    if (state.question) {
      return state;
    }
    return {
      ...state,
      question: getQuestion(state.timer),
    };
  }
  if (action.type === "incorrect") {
    if (!state.question) {
      return state;
    }
    return {
      ...state,
      question: {
        ...state.question,
        correct: false,
      },
    };
  }
  if (action.type === "correct") {
    if (!state.question) {
      return state;
    }
    return {
      ...state,
      question: {
        ...state.question,
        correct: true,
      },
    };
  }
  if (action.type === "next") {
    if (!state.question) {
      return state;
    }
    if (state.rounds === 0) {
      return state;
    }
    return {
      ...state,
      score: state.question.correct === true ? state.score + 1 : state.score,
      rounds: state.rounds - 1,
      question: getQuestion(state.timer),
    };
  }
  return state;
}

export function GameSolo({}: GameSoloProps): JSX.Element | null {
  const stopGame = useStore((state) => state.stopGame);
  const settings = useStore((state) => state.settings.solo);
  const [state, dispatch] = useReducer(reducer, {
    rounds: settings.rounds,
    timer: settings.times,
    score: 0,
    question: null,
  });

  const isDone = state.rounds === 0;

  const anim = useTimeRange(state.question?.timer ?? null);

  useEffect(() => {
    if (state.question && state.question.correct === null) {
      console.log(anim);
      if (anim && anim.animating === false && anim.position === "end") {
        dispatch({ type: "incorrect" });
      }
    }
  }, [anim, state.question]);

  const onTimerClick = useCallback(() => {
    if (anim?.animating === true) {
      return;
    }
    if (state.question === null) {
      return dispatch({ type: "start" });
    }
    if (isDone) {
      console.log("TODO");
      return;
    }
    dispatch({ type: "next" });
  }, [anim?.animating, isDone, state.question]);

  const a = state.question?.a ?? "a";
  const b = state.question?.b ?? "b";
  const result = state.question ? state.question.a * state.question.b : "??";

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

  return (
    <div className="rounded-2xl shadow-md bg-white flex flex-col items-stretch p-3 space-y-3 h-full">
      <div className="rounded-xl bg-sky-200 p-3 space-y-3">
        <h3 className="uppercase font-semibold tracking-wider text-slate-900 ml-1 text-sm">
          Score
        </h3>
        <p className="border border-slate-400 rounded-lg overflow-hidden text-center text-slate-900 text-lg p-2 font-semibold">
          {state.score} / {settings.rounds - state.rounds} (Il reste{" "}
          {state.rounds} questions)
        </p>
      </div>
      <div className="flex-1 flex flex-col items-stretch justify-around">
        <div />
        <p
          className={clsx(
            "text-center text-4xl font-mono my-10",
            state.question ? "text-slate-900" : "text-slate-400"
          )}
        >
          {a} {"\u00D7"} {b} = {result}
        </p>
        <div className="flex flex-col items-center justify-center">
          <Timer
            className="cursor-pointer"
            size={250}
            strokeWidth={20}
            color="#6366f1"
            bgColor="#dbeafe"
            timer={state.question?.timer ?? null}
            disabledContent={<p>Go !</p>}
            startContent={<p>Pr??t ?</p>}
            endContent={<p>{isDone ? "Fin" : "Suivant"}</p>}
            onClick={onTimerClick}
          />
        </div>
        <div />
      </div>
      <div className="flex flex-col p-6 space-y-6">
        <button
          onClick={() => dispatch({ type: "correct" })}
          className={clsx(
            "rounded-xl border border-green-600 hover:bg-green-600 hover:text-white p-5 text-xl font-semibold tracking-wider",
            state.question?.correct === true
              ? "bg-green-600 text-white"
              : "text-green-900"
          )}
        >
          Bonne R??ponse
        </button>
        <button
          onClick={() => dispatch({ type: "incorrect" })}
          className={clsx(
            "rounded-xl border border-red-600 hover:bg-red-600 hover:text-white p-5 text-xl font-semibold tracking-wider",
            state.question?.correct === false
              ? "bg-red-600 text-white"
              : "text-red-900"
          )}
        >
          Mauvaise r??ponse
        </button>
      </div>
    </div>
  );
}

function getQuestion(duration: number): Question {
  const a = 1 + Math.floor(Math.random() * 10);
  const b = 1 + Math.floor(Math.random() * 10);
  const now = Date.now();
  const offset = 500;
  return {
    a,
    b,
    timer: [now + offset, now + offset + duration],
    correct: null,
  };
}
