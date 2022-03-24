import { useStore, Game as IGame } from "../store";

type GamesProps = {};

export function Games({}: GamesProps): JSX.Element | null {
  const games = useStore((state) => state.games);

  return (
    <div className="rounded-lg shadow-md bg-white flex-1">
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

export function Game({}: GameProps): JSX.Element | null {
  return null;
}
