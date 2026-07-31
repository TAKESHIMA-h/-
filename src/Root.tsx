import React from 'react';
import {Composition} from 'remotion';
import {ClaudeCodeReel} from './Video';
import {ScratchReel} from './ScratchReel';
import {GreatPersonReel, FREDDIE} from './GreatPersonReel';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClaudeCodeReel"
        component={ClaudeCodeReel}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ScratchReel"
        component={ScratchReel}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GreatPersonReel"
        component={GreatPersonReel}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{person: FREDDIE}}
      />
    </>
  );
};
