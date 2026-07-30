import React from 'react';
import {Composition} from 'remotion';
import {ClaudeCodeReel} from './Video';

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
    </>
  );
};
