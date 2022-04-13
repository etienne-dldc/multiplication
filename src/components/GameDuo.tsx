import { ArrowLeft } from "phosphor-react";

type GameDuoProps = {};

import clsx from "clsx";
import { useCallback, useEffect, useReducer } from "react";
import { TimeRange, useTimeRange } from "../hooks/useTimeRange";
import { GameDifficulty, GAME_DIFFICULTY_TABLES, useStore } from "../store";
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
  difficulty: GameDifficulty;
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
      question: getQuestion(state.timer, state.difficulty, null),
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
      question: getQuestion(state.timer, state.difficulty, state.question),
    };
  }
  return state;
}

export function GameDuo({}: GameDuoProps): JSX.Element | null {
  const settings = useStore((state) => state.settings.duo);
  const stopGame = useStore((state) => state.stopGame);
  const endGame = useStore((state) => state.endGame);
  const [state, dispatch] = useReducer(reducer, {
    rounds: settings.rounds,
    timer: settings.times,
    difficulty: settings.difficulty,
    score: 0,
    question: null,
  });

  const isDone = state.rounds === 1;

  const timer =
    state.question === null
      ? null
      : state.question.correct === null
      ? state.question.timer
      : null;

  const anim = useTimeRange(timer);

  useEffect(() => {
    if (state.question && state.question.correct === null) {
      if (anim && anim.animating === false && anim.position === "end") {
        dispatch({ type: "incorrect" });
      }
    }
  }, [anim, state.question]);

  const a = state.question?.a ?? "a";
  const b = state.question?.b ?? "b";
  const result = state.question ? state.question.a * state.question.b : "??";

  const correct = state.question?.correct ?? null;

  const doneRounds =
    settings.rounds - state.rounds + (correct === null ? 0 : 1);
  const score = state.score + (correct === true ? 1 : 0);

  const onTimerClick = useCallback(() => {
    if (anim?.animating === true) {
      return;
    }
    if (state.question === null) {
      return dispatch({ type: "start" });
    }
    if (isDone) {
      endGame(score);
      return;
    }
    dispatch({ type: "next" });
  }, [anim?.animating, endGame, isDone, score, state.question]);

  return (
    <div className="rounded-2xl shadow-md bg-white flex flex-col items-stretch p-3 space-y-3 h-full">
      <button
        onClick={() => {
          if (isDone) {
            endGame(score);
            return;
          }
          stopGame();
        }}
        className="flex flex-row space-x-3 py-2 px-4 items-center rounded-xl bg-slate-900 text-white self-start hover:bg-slate-800"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </button>
      <div className="rounded-xl bg-sky-200 p-3 space-y-3">
        <h3 className="uppercase font-semibold tracking-wider text-slate-900 ml-1 text-sm">
          Score
        </h3>
        <p className="text-center text-slate-900 text-3xl p-2 font-semibold flex items-center flex-row justify-evenly">
          <span>
            {doneRounds === 0 ? "-" : score} / {doneRounds}
          </span>
          <span>
            {doneRounds === 0 ? "-" : Math.round((score / doneRounds) * 100)}%
          </span>
        </p>
      </div>
      <div className="flex-1 flex flex-col items-stretch justify-center">
        <div className="flex-1 flex flex-col items-stretch justify-around max-h-[500px]">
          <p className="text-center text-2xl font-mono">
            {state.rounds === 1
              ? `Dernière question !`
              : `Il reste ${state.rounds} questions`}
          </p>
          <p
            className={clsx(
              "text-center text-4xl font-mono",
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
              timer={timer}
              disabledContent={
                <p>{isDone ? "Fin" : state.question ? "Suivant" : "Go !"}</p>
              }
              startContent={<p>Prêt ?</p>}
              endContent={<p>{isDone ? "Fin" : "Suivant"}</p>}
              onClick={onTimerClick}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 space-y-6">
        <button
          onClick={() => dispatch({ type: "correct" })}
          className={clsx(
            "rounded-xl border border-green-600 hover:bg-green-600 hover:text-white p-5 text-xl font-semibold tracking-wider",
            correct === true ? "bg-green-600 text-white" : "text-green-900"
          )}
        >
          Bonne Réponse
        </button>
        <button
          onClick={() => dispatch({ type: "incorrect" })}
          className={clsx(
            "rounded-xl border border-red-600 hover:bg-red-600 hover:text-white p-5 text-xl font-semibold tracking-wider",
            correct === false ? "bg-red-600 text-white" : "text-red-900"
          )}
        >
          Mauvaise réponse
        </button>
      </div>
    </div>
  );
}

function getQuestion(
  duration: number,
  difficulty: GameDifficulty,
  prevQuestion: null | Question
): Question {
  const aNums = GAME_DIFFICULTY_TABLES[difficulty].filter(
    (v) => v !== prevQuestion?.a
  );
  const bNums = GAME_DIFFICULTY_TABLES[difficulty];
  const a = aNums[Math.floor(Math.random() * aNums.length)];
  const b = bNums[Math.floor(Math.random() * bNums.length)];
  const now = Date.now();
  const offset = 500;
  return {
    a,
    b,
    timer: [now + offset, now + offset + duration],
    correct: null,
  };
}
