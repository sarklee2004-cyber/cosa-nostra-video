import React from "react";
import { Composition } from "remotion";
import { CosaNostra } from "./CosaNostra";

export const Root: React.FC = () => {
  return (
    <Composition
      id="CosaNostra"
      component={CosaNostra}
      durationInFrames={4800}
      fps={32}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
