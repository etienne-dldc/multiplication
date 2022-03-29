import { useStore, Game as IGame, GAME_MODE_NAME, formatTime } from "../store";

export function GamesHistory(): JSX.Element | null {
  const games = useStore((state) => state.games);

  return (
    <div className="rounded-2xl shadow-md bg-white flex-1 space-y-3 p-3">
      <h2 className="text-lg text-slate-900 font-semibold tracking-wider mx-2 text-center">
        Parties précédentes
      </h2>
      {games.length === 0 ? (
        <div className="h-full flex flex-col items-stretch justify-center">
          <p className="text-center text-lg font-semibold tracking-wider text-slate-700">
            Aucune partie
          </p>
        </div>
      ) : (
        games.map((game) => {
          return <Game game={game} key={game.id} />;
        })
      )}
    </div>
  );
}

type GameProps = {
  game: IGame;
};

export function Game({ game }: GameProps): JSX.Element | null {
  return (
    <div className="bg-red-300 rounded-xl p-2">
      <p className="uppercase font-normal tracking-wider text-slate-900 ml-1 text-sm">
        Mode: <span className="font-semibold">{GAME_MODE_NAME[game.mode]}</span>{" "}
        ({game.rounds} questions, {formatTime(game.time)})
      </p>
      <p className="text-center text-slate-900 text-3xl p-2 font-semibold flex items-center flex-row justify-evenly">
        <span>
          {game.score} / {game.rounds}
        </span>
        <span>{Math.round((game.score / game.rounds) * 100)}%</span>
      </p>
    </div>
  );
}
