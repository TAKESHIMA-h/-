import React from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const clips = [
  {src: 'clips/clip1.mp4', label: '視線を止める、最初の1秒'},
  {src: 'clips/clip2.mp4', label: '伝えたい瞬間だけを切り抜く'},
  {src: 'clips/clip3.mp4', label: 'デザインで世界観を統一する'},
];

const Fade: React.FC<React.PropsWithChildren<{duration: number}>> = ({children, duration}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, duration - 10, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const ClipScene: React.FC<{src: string; label: string; index: number}> = ({src, label, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, config: {damping: 14, mass: 0.8}});
  const zoom = interpolate(frame, [0, 120], [1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{backgroundColor: '#111'}}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}}
      />
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.88) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          bottom: 150,
          transform: `translateY(${(1 - intro) * 55}px)`,
          opacity: intro,
          fontFamily: 'Noto Sans CJK JP, sans-serif',
          color: 'white',
        }}
      >
        <div style={{fontSize: 28, letterSpacing: 4, fontWeight: 700, color: '#FFD54A'}}>
          0{index + 1} / DESIGN CUT
        </div>
        <div style={{fontSize: 70, lineHeight: 1.25, fontWeight: 900, marginTop: 18}}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 12}});
  const line = interpolate(frame, [4, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#F3D347', padding: 72, justifyContent: 'center'}}>
      <div style={{fontFamily: 'Noto Sans CJK JP, sans-serif', color: '#111', transform: `scale(${0.92 + scale * 0.08})`}}>
        <div style={{fontSize: 32, fontWeight: 800, letterSpacing: 5}}>CLAUDE CODE × VIDEO</div>
        <div style={{fontSize: 105, fontWeight: 900, lineHeight: 1.03, marginTop: 42}}>
          ただの切り抜きを、<br />作品に変える。
        </div>
        <div style={{height: 14, backgroundColor: '#111', width: `${line * 100}%`, marginTop: 48}} />
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 24], [60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', padding: 76}}>
      <div style={{fontFamily: 'Noto Sans CJK JP, sans-serif', color: 'white', textAlign: 'center', transform: `translateY(${y}px)`}}>
        <div style={{fontSize: 30, color: '#FFD54A', fontWeight: 800, letterSpacing: 5}}>EDIT. DESIGN. EXPORT.</div>
        <div style={{fontSize: 88, fontWeight: 900, lineHeight: 1.15, marginTop: 34}}>素材を差し替えるだけで、<br />縦動画が完成。</div>
        <div style={{fontSize: 34, marginTop: 58, opacity: 0.7}}>1080 × 1920 / 15 sec / MP4</div>
      </div>
    </AbsoluteFill>
  );
};

export const ClaudeCodeReel: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#111'}}>
      <Sequence from={0} durationInFrames={75}>
        <Fade duration={75}><Hook /></Fade>
      </Sequence>

      {clips.map((clip, index) => (
        <Sequence key={clip.src} from={75 + index * 90} durationInFrames={90}>
          <Fade duration={90}><ClipScene {...clip} index={index} /></Fade>
        </Sequence>
      ))}

      <Sequence from={345} durationInFrames={105}>
        <Fade duration={105}><EndCard /></Fade>
      </Sequence>
    </AbsoluteFill>
  );
};
