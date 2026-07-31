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
const GOLD = '#E9C46A';
const GOLD_SOFT = '#F0D89B';
const INK = '#0B0713';

export type Lesson = {t: string; d: string};
export type Person = {
  index: string;
  name: string;
  nameEn: string;
  role: string;
  years: string;
  quoteEn: string;
  quoteJa: string;
  lessons: Lesson[];
};

// ---- First entry in the "Lessons from Legends" series ----
export const FREDDIE: Person = {
  index: '01',
  name: 'フレディ・マーキュリー',
  nameEn: 'FREDDIE MERCURY',
  role: 'Queen ボーカリスト',
  years: '1946 – 1991',
  quoteEn: "I won't be a rock star. I will be a legend.",
  quoteJa: 'スターにはならない。\n伝説になる。',
  lessons: [
    {t: '根拠なき自信を持て', d: '信じ抜いた者だけが伝説になる'},
    {t: '個性こそ最大の武器', d: '人と違う自分を、恐れない'},
    {t: '中途半端に生きるな', d: '一瞬に、全力を注ぎ込む'},
  ],
};

// ---------- Shared animated background ----------
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const drift = Math.sin(frame / 80) * 8;

  const specks = new Array(40).fill(0).map((_, i) => {
    const size = 2 + random(`s${i}`) * 6;
    const speed = 0.2 + random(`v${i}`) * 0.7;
    const x = random(`x${i}`) * width;
    const y = (random(`y${i}`) * height - frame * speed * 5 + height) % (height + 40) - 20;
    const o = 0.06 + random(`o${i}`) * 0.22;
    return {x, y, size, o};
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 90% at ${50 + drift}% 12%, #3a1d5c 0%, #1b1030 40%, ${INK} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(233,196,106,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(233,196,106,0.05) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage: 'radial-gradient(85% 70% at 50% 38%, black, transparent)',
        }}
      />
      {specks.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: GOLD,
            opacity: d.o,
            filter: 'blur(0.3px)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// persistent series ribbon
const Ribbon: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 88,
      left: 64,
      right: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: FONT,
      color: GOLD,
      fontWeight: 800,
      letterSpacing: 4,
      fontSize: 26,
    }}
  >
    <span>偉人に学ぶ</span>
    <span style={{opacity: 0.7}}>LESSONS FROM LEGENDS</span>
  </div>
);

// word-by-word rise
const Rise: React.FC<{text: string; size: number; delay?: number; color?: string; weight?: number}> = ({
  text,
  size,
  delay = 0,
  color = 'white',
  weight = 900,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{whiteSpace: 'pre-line'}}>
      {text.split('\n').map((line, li) => (
        <div key={li} style={{display: 'flex', flexWrap: 'wrap', gap: '0 12px'}}>
          {line.split(' ').map((w, i) => {
            const p = spring({
              frame: frame - delay - (li * 3 + i) * 5,
              fps,
              config: {damping: 16, mass: 0.7},
            });
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontFamily: FONT,
                  fontWeight: weight,
                  fontSize: size,
                  lineHeight: 1.16,
                  color,
                  transform: `translateY(${(1 - p) * 60}px)`,
                  opacity: p,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------- Scene 1: Intro ----------
const Intro: React.FC<{person: Person}> = ({person}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const badge = spring({frame, fps, config: {damping: 12}});
  const line = interpolate(frame, [14, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{padding: 84, justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: FONT,
          alignSelf: 'flex-start',
          background: GOLD,
          color: INK,
          fontWeight: 900,
          fontSize: 30,
          letterSpacing: 3,
          padding: '12px 26px',
          borderRadius: 999,
          transform: `scale(${0.8 + badge * 0.2})`,
          marginBottom: 34,
        }}
      >
        VOL.{person.index}
      </div>
      <Rise text={person.name} size={96} />
      <div style={{height: 14, width: `${line * 40}%`, background: GOLD, borderRadius: 8, margin: '30px 0'}} />
      <div style={{fontFamily: FONT, color: GOLD_SOFT, fontWeight: 700, fontSize: 40}}>{person.role}</div>
      <div style={{fontFamily: FONT, color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontSize: 32, marginTop: 8, letterSpacing: 2}}>
        {person.nameEn} · {person.years}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 2: Quote ----------
const Quote: React.FC<{person: Person}> = ({person}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mark = spring({frame, fps, config: {damping: 11}});
  const enShow = interpolate(frame, [40, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const enY = interpolate(frame, [40, 70], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{padding: 84, justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 260,
          lineHeight: 0.5,
          color: GOLD,
          opacity: 0.9,
          transform: `scale(${mark}) translateY(40px)`,
          height: 120,
        }}
      >
        “
      </div>
      <Rise text={person.quoteJa} size={92} color="white" delay={6} />
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          color: GOLD_SOFT,
          fontSize: 38,
          lineHeight: 1.4,
          marginTop: 40,
          opacity: enShow,
          transform: `translateY(${enY}px)`,
          borderLeft: `4px solid ${GOLD}`,
          paddingLeft: 24,
        }}
      >
        {person.quoteEn}
      </div>
      <div style={{fontFamily: FONT, color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 30, marginTop: 26, letterSpacing: 2, opacity: enShow}}>
        — {person.nameEn}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 3: Lessons ----------
const LessonRow: React.FC<{i: number; no: number; l: Lesson}> = ({i, no, l}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 10 - i * 16, fps, config: {damping: 18, mass: 0.9}});
  return (
    <div
      style={{
        transform: `translateX(${(1 - p) * -70}px)`,
        opacity: p,
        display: 'flex',
        gap: 26,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: 84,
          color: GOLD,
          width: 96,
          flexShrink: 0,
          textAlign: 'center',
        }}
      >
        {no}
      </div>
      <div style={{fontFamily: FONT}}>
        <div style={{fontSize: 50, fontWeight: 900, color: 'white', lineHeight: 1.15}}>{l.t}</div>
        <div style={{fontSize: 30, fontWeight: 600, color: 'rgba(255,255,255,0.62)', marginTop: 6}}>{l.d}</div>
      </div>
    </div>
  );
};

const Lessons: React.FC<{person: Person}> = ({person}) => {
  return (
    <AbsoluteFill style={{padding: 76, justifyContent: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, color: 'white', fontSize: 56, marginBottom: 44}}>
        この偉人から<br />
        <span style={{color: GOLD}}>学んだこと</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
        {person.lessons.map((l, i) => (
          <LessonRow key={i} i={i} no={i + 1} l={l} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 4: End ----------
const End: React.FC<{person: Person}> = ({person}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 13}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80}}>
      <div style={{fontFamily: FONT, textAlign: 'center', transform: `scale(${0.92 + p * 0.08})`}}>
        <div style={{fontSize: 32, color: GOLD, fontWeight: 800, letterSpacing: 5}}>今日の一歩</div>
        <div style={{fontSize: 78, fontWeight: 900, color: 'white', lineHeight: 1.2, marginTop: 30}}>
          あなたも、<br />“伝説”を生きろ。
        </div>
        <div
          style={{
            marginTop: 54,
            display: 'inline-block',
            border: `3px solid ${GOLD}`,
            color: GOLD,
            fontWeight: 800,
            fontSize: 32,
            padding: '16px 40px',
            borderRadius: 999,
            letterSpacing: 2,
          }}
        >
          保存して、明日の自分へ ▶
        </div>
        <div style={{fontSize: 28, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 40, letterSpacing: 3}}>
          偉人に学ぶ VOL.{person.index} · {person.nameEn}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Fade: React.FC<React.PropsWithChildren<{d: number}>> = ({children, d}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, d - 12, d], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

export const GreatPersonReel: React.FC<{person: Person}> = ({person}) => {
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      <Background />
      <Ribbon />
      <Sequence from={0} durationInFrames={112}>
        <Fade d={112}><Intro person={person} /></Fade>
      </Sequence>
      <Sequence from={104} durationInFrames={150}>
        <Fade d={150}><Quote person={person} /></Fade>
      </Sequence>
      <Sequence from={246} durationInFrames={126}>
        <Fade d={126}><Lessons person={person} /></Fade>
      </Sequence>
      <Sequence from={366} durationInFrames={84}>
        <Fade d={84}><End person={person} /></Fade>
      </Sequence>
    </AbsoluteFill>
  );
};
