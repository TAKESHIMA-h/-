import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FONT = "'Noto Sans CJK JP', 'IPAPGothic', 'IPAGothic', sans-serif";
const YELLOW = '#F3D347';
const INK = '#0D0D0F';

// ---------- Animated background (pure code, no footage) ----------
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const hue = Math.sin(frame / 90) * 10;
  const shift = Math.sin(frame / 60) * 12;

  const dots = new Array(46).fill(0).map((_, i) => {
    const seedX = random(`x${i}`);
    const seedY = random(`y${i}`);
    const size = 4 + random(`s${i}`) * 10;
    const speed = 0.3 + random(`v${i}`) * 0.9;
    const x = seedX * width;
    const y = (seedY * height + frame * speed * 6) % (height + 60) - 30;
    const o = 0.05 + random(`o${i}`) * 0.18;
    return {x, y, size, o};
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at ${50 + shift}% 8%, hsl(${48 + hue} 90% 58%) 0%, #17140b 42%, ${INK} 100%)`,
      }}
    >
      {/* faint grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          maskImage: 'radial-gradient(80% 60% at 50% 40%, black, transparent)',
        }}
      />
      {/* floating dots */}
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: YELLOW,
            opacity: d.o,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// word-by-word rise-in helper
const Words: React.FC<{text: string; size: number; delay?: number; color?: string}> = ({
  text,
  size,
  delay = 0,
  color = 'white',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 14px'}}>
      {text.split(' ').map((w, i) => {
        const p = spring({frame: frame - delay - i * 6, fps, config: {damping: 16, mass: 0.7}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: size,
              lineHeight: 1.08,
              color,
              transform: `translateY(${(1 - p) * 70}px)`,
              opacity: p,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Scene A: Hook ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [10, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{padding: 84, justifyContent: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 800, letterSpacing: 6, fontSize: 30, color: YELLOW}}>
        NO FOOTAGE · JUST CODE
      </div>
      <div style={{height: 30}} />
      <Words text="素材ゼロから、" size={112} />
      <Words text="動画をつくる。" size={112} delay={8} color={YELLOW} />
      <div style={{height: 12, width: `${bar * 46}%`, background: YELLOW, marginTop: 40, borderRadius: 8}} />
    </AbsoluteFill>
  );
};

// ---------- Scene B: Feature cards ----------
const Card: React.FC<{i: number; no: string; title: string; body: string}> = ({i, no, title, body}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - i * 14, fps, config: {damping: 18, mass: 0.9}});
  return (
    <div
      style={{
        transform: `translateX(${(1 - p) * -80}px)`,
        opacity: p,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 28,
        padding: '34px 38px',
        display: 'flex',
        gap: 28,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 52,
          color: INK,
          background: YELLOW,
          width: 96,
          height: 96,
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {no}
      </div>
      <div style={{fontFamily: FONT, color: 'white'}}>
        <div style={{fontSize: 46, fontWeight: 900}}>{title}</div>
        <div style={{fontSize: 30, fontWeight: 600, opacity: 0.7, marginTop: 6}}>{body}</div>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <AbsoluteFill style={{padding: 72, justifyContent: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 800, letterSpacing: 5, fontSize: 30, color: YELLOW, marginBottom: 36}}>
        できること
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
        <Card i={0} no="01" title="背景も文字も生成" body="グラデ・図形・粒子をコードで" />
        <Card i={1} no="02" title="動きは自由自在" body="バネ・イージングで滑らかに" />
        <Card i={2} no="03" title="MP4まで自動" body="そのまま書き出し・投稿へ" />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene C: animated counter + bars ----------
const Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = Math.round(interpolate(frame, [6, 60], [0, 1080], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const bars = [0.55, 0.8, 0.35, 0.95, 0.65, 0.85];
  return (
    <AbsoluteFill style={{padding: 84, justifyContent: 'center', alignItems: 'flex-start'}}>
      <div style={{fontFamily: FONT, fontWeight: 800, letterSpacing: 5, fontSize: 30, color: YELLOW}}>RESOLUTION</div>
      <div style={{fontFamily: FONT, fontWeight: 900, color: 'white', fontSize: 190, lineHeight: 1}}>
        {count}
        <span style={{fontSize: 70, color: YELLOW}}>×1920</span>
      </div>
      <div style={{display: 'flex', gap: 20, alignItems: 'flex-end', height: 360, marginTop: 50}}>
        {bars.map((b, i) => {
          const g = spring({frame: frame - 20 - i * 8, fps, config: {damping: 14}});
          return (
            <div
              key={i}
              style={{
                width: 118,
                height: b * 360 * g,
                borderRadius: 16,
                background: i % 2 ? YELLOW : 'rgba(255,255,255,0.85)',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene D: End / CTA ----------
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 13}});
  const ring = interpolate(frame, [0, 40], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80}}>
      <div
        style={{
          fontFamily: FONT,
          textAlign: 'center',
          color: 'white',
          transform: `scale(${0.9 + p * 0.1})`,
        }}
      >
        <div style={{fontSize: 34, color: YELLOW, fontWeight: 800, letterSpacing: 6}}>CLAUDE CODE × VIDEO</div>
        <div style={{fontSize: 100, fontWeight: 900, lineHeight: 1.08, marginTop: 28}}>
          あなたのテーマで、<br />1本つくろう。
        </div>
        <div
          style={{
            margin: '54px auto 0',
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: `10px solid ${YELLOW}`,
            clipPath: `inset(0 ${(1 - ring) * 100}% 0 0)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{fontSize: 40, fontWeight: 900, color: YELLOW}}>▶ 15s</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Transition wrapper (cross fade) ----------
const Fade: React.FC<React.PropsWithChildren<{d: number}>> = ({children, d}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, d - 12, d], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

export const ScratchReel: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      <Background />
      <Sequence from={0} durationInFrames={96}>
        <Fade d={96}><Hook /></Fade>
      </Sequence>
      <Sequence from={90} durationInFrames={162}>
        <Fade d={162}><Features /></Fade>
      </Sequence>
      <Sequence from={246} durationInFrames={114}>
        <Fade d={114}><Showcase /></Fade>
      </Sequence>
      <Sequence from={354} durationInFrames={96}>
        <Fade d={96}><EndCard /></Fade>
      </Sequence>
    </AbsoluteFill>
  );
};
