import create, { GetState, SetState, StateCreator, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import produce, { Draft } from "immer";
import { nanoid } from "nanoid";

// solo: need to enter the response
// duo: show the answer from the start with right / wrong buttons
// practice: show the answer after timer not counting points
export type GameMode = "solo" | "duo" | "practice";

export type GameDifficulty = "easy" | "normal" | "hard";

export type Game = {
  id: string;
  mode: GameMode;
  time: number;
  rounds: number; // total number of rounds
  score: number; // number of correct answers
};

export type GameSettings = {
  rounds: number;
  times: number; // in ms
  difficulty: GameDifficulty;
};

export type State = {
  mode: GameMode;
  settings: Record<GameMode, GameSettings>;
  games: Array<Game>;
  playing: boolean;
  // actions
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: GameDifficulty) => void;
  increaseTime: () => void;
  decreaseTime: () => void;
  increaseRounds: () => void;
  decreaseRounds: () => void;
  startGame: () => void;
  stopGame: () => void;
  endGame: (score: number) => void;
  clear: () => void;
};

const TIMES = [
  1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
  11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000,
];

const ROUND = [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export const GAME_MODE_NAME = {
  solo: "Solo",
  duo: "Duo",
  practice: "Entrainement",
} as const;

export const GAME_DIFFICULTY_NAME = {
  easy: "Facile",
  normal: "Normal",
  hard: "Difficile",
} as const;

export const GAME_DIFFICULTY_TABLES = {
  easy: [1, 2, 3, 4, 5, 10],
  normal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  hard: [3, 4, 6, 7, 8, 9],
};

const initialSettings: Record<GameMode, GameSettings> = {
  solo: { rounds: 20, times: 5000, difficulty: "easy" },
  duo: { rounds: 20, times: 5000, difficulty: "easy" },
  practice: { rounds: 20, times: 5000, difficulty: "easy" },
};

export const useStore = create<State>(
  persist(
    withImmer((set) => ({
      mode: "solo",
      settings: initialSettings,
      games: [],
      playing: false,
      setMode: (mode: GameMode) =>
        set((state) => {
          state.mode = mode;
        }),
      setDifficulty: (difficulty: GameDifficulty) =>
        set((state) => {
          state.settings[state.mode].difficulty = difficulty;
        }),
      increaseTime: () =>
        set((state) => {
          state.settings[state.mode].times = arrayNext(
            TIMES,
            state.settings[state.mode].times
          );
        }),
      decreaseTime: () =>
        set((state) => {
          state.settings[state.mode].times = arrayPrev(
            TIMES,
            state.settings[state.mode].times
          );
        }),
      increaseRounds: () =>
        set((state) => {
          state.settings[state.mode].rounds = arrayNext(
            ROUND,
            state.settings[state.mode].rounds
          );
        }),
      decreaseRounds: () =>
        set((state) => {
          state.settings[state.mode].rounds = arrayPrev(
            ROUND,
            state.settings[state.mode].rounds
          );
        }),
      startGame: () =>
        set((state) => {
          state.playing = true;
        }),
      stopGame: () =>
        set((state) => {
          state.playing = false;
        }),
      endGame: (score) =>
        set((state) => {
          state.games.push({
            id: nanoid(10),
            mode: state.mode,
            score: score,
            rounds: state.settings[state.mode].rounds,
            time: state.settings[state.mode].times,
          });
          state.playing = false;
        }),
      clear: () =>
        set((state) => {
          state.mode = "duo";
          state.settings = initialSettings;
          state.games = [];
          state.playing = false;
        }),
    })),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { name: "MULTIPLICATIONS_V2", partialize: ({ playing, ...state }) => state }
  )
);

function withImmer<
  T extends State,
  CustomSetState extends SetState<T>,
  CustomGetState extends GetState<T>,
  CustomStoreApi extends StoreApi<T>
>(
  config: StateCreator<
    T,
    (partial: ((draft: Draft<T>) => void) | T, replace?: boolean) => void,
    CustomGetState,
    CustomStoreApi
  >
): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> {
  return (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState =
          typeof partial === "function"
            ? produce(partial as (state: Draft<T>) => T)
            : (partial as T);
        return set(nextState, replace);
      },
      get,
      api
    );
}

function arrayNext<T>(arr: Array<T>, current: T): T {
  const index = arr.indexOf(current);
  if (index === -1) {
    return arr[0];
  }
  if (index === arr.length - 1) {
    return current;
  }
  return arr[index + 1];
}

function arrayPrev<T>(arr: Array<T>, current: T): T {
  const index = arr.indexOf(current);
  if (index === -1) {
    return arr[0];
  }
  if (index === 0) {
    return current;
  }
  return arr[index - 1];
}

export function formatTime(time: number): string {
  return (time / 1000).toFixed(1) + (time >= 2000 ? " secondes" : " seconde");
}
