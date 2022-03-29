import { Fragment } from "react";
import { useStore } from "../store";
import { GamesHistory } from "./GamesHistory";
import { Settings } from "./Settings";

type HomeProps = {};

// TODO: Rainbow text

export function Home({}: HomeProps): JSX.Element | null {
  const clear = useStore((state) => state.clear);

  return (
    <Fragment>
      <h1 className="text-transparent bg-clip-text font-extrabold text-center text-3xl m-2 bg-gradient-to-r from-green-200 via-green-400 to-purple-700">
        {"\u00D7"}{" "}
        <span className="uppercase text-2xl font-mono tracking-widest">
          Multiplications
        </span>{" "}
        {"\u00D7"}
      </h1>
      <Settings />
      <GamesHistory />
      <button
        className="text-slate-400 underline"
        onClick={() => {
          if (
            window.confirm(
              "Êtes-vous sûr de vouloir supprimer toutes les données ?"
            )
          ) {
            clear();
          }
        }}
      >
        Effacer toutes les données
      </button>
    </Fragment>
  );
}
