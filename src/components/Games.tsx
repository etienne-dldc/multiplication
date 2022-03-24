import { useStore, Game as IGame } from "../store";

export function Games(): JSX.Element | null {
  const games = useStore((state) => state.games);

  return (
    <div className="rounded-2xl shadow-md bg-white flex-1">
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
  return null;
}
