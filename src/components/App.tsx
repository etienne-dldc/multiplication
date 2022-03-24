import { useStore } from "../store";
import { Game } from "./Game";
import { Home } from "./Home";

export function App() {
  const playing = useStore((state) => state.playing);

  return (
    <div className="max-w-lg m-4 sm:m-8 w-full flex flex-col space-y-4">
      {playing ? <Game /> : <Home />}
    </div>
  );
}
