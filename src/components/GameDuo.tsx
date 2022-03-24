type GameDuoProps = {};

import clsx from "clsx";
import { useCallback, useEffect, useReducer } from "react";
import { TimeRange, useTimeRange } from "../hooks/useTimeRange";
import { useStore } from "../store";
import { Timer } from "./Timer";

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

export function GameDuo({}: GameDuoProps): JSX.Element | null {
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
      <div className="rounded-xl bg-sky-200 p-3 space-y-3">
        <h3 className="uppercase font-semibold tracking-wider text-slate-900 ml-1 text-sm">
          Score
        </h3>
        <p className="border border-slate-400 rounded-lg overflow-hidden text-center text-slate-900 text-lg p-2 font-semibold">
          {state.score} / {settings.rounds - state.rounds}
        </p>
        <p className="text-center text-sm">Il reste {state.rounds} questions</p>
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
            startContent={<p>Prêt ?</p>}
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
          Bonne Réponse
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
          Mauvaise réponse
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
