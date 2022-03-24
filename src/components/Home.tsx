import { Fragment } from "react";
import { Games } from "./Games";
import { Settings } from "./Settings";

type HomeProps = {};

export function Home({}: HomeProps): JSX.Element | null {
  return (
    <Fragment>
      <Settings />
      <Games />
    </Fragment>
  );
}
