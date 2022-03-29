import { Fragment } from "react";
import { GamesHistory } from "./GamesHistory";
import { Settings } from "./Settings";

type HomeProps = {};

// TODO: Rainbow text

export function Home({}: HomeProps): JSX.Element | null {
  return (
    <Fragment>
      <h1 className="text-white text-center text-3xl m-2">
        {"\u00D7"}{" "}
        <span className="uppercase text-2xl font-mono tracking-wider">
          Multiplications
        </span>{" "}
        {"\u00D7"}
      </h1>
      <Settings />
      <GamesHistory />
    </Fragment>
  );
}
