import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background, Ribbon, Rise, Fade, FREDDIE, Person} from './GreatPersonReel';

const FONT = "'Noto Sans CJK JP', 'IPAPGothic', 'IPAGothic', sans-serif";
const GOLD = '#E9C46A';
const GOLD_SOFT = '#F0D89B';
const INK = '#0B0713';

// small caps section label
const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: FONT, fontWeight: 800, letterSpacing: 6, fontSize: 28, color: GOLD, marginBottom: 26}}>
    {children}
  </div>
);

// ---------- 1. Hook (cold open) ----------
const Hook: React.FC<{person: Person}> = ({person}) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [18, 44], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{padding: 84, justifyContent: 'center'}}>
      <div style={{height: 10, width: `${line * 30}%`, background: GOLD, borderRadius: 8, marginBottom: 40}} />
      <Rise text={person.hook ?? ''} size={116} color="white" />
    </AbsoluteFill>
  );
};

// ---------- 2. Intro (compact) ----------
const Intro: React.FC<{person: Person}> = ({person}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const badge = spring({frame, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{padding: 84, justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: FONT,
          alignSelf: 'flex-start',
          background: GOLD,
          color: INK,
          fontWeight: 900,
          fontSize: 28,
          letterSpacing: 3,
          padding: '10px 24px',
          borderRadius: 999,
          transform: `scale(${0.8 + badge * 0.2})`,
          marginBottom: 28,
        }}
      >
        VOL.{person.index}
      </div>
      <Rise text={person.name} size={90} />
      <div style={{fontFamily: FONT, color: GOLD_SOFT, fontWeight: 700, fontSize: 38, marginTop: 24}}>{person.role}</div>
      <div style={{fontFamily: FONT, color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 30, marginTop: 6, letterSpacing: 2}}>
        {person.nameEn} · {person.years}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. Story (new scene) ----------
const Story: React.FC<{person: Person}> = ({person}) => {
  return (
    <AbsoluteFill style={{padding: 84, justifyContent: 'center'}}>
      <Label>STORY / 背景</Label>
      <Rise text={person.story ?? ''} size={58} color="white" weight={800} />
    </AbsoluteFill>
  );
};

// ---------- 4. Quote (compact) ----------
const Quote: React.FC<{person: Person}> = ({person}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mark = spring({frame, fps, config: {damping: 11}});
  const enShow = interpolate(frame, [34, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{padding: 84, justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 230,
          lineHeight: 0.5,
          color: GOLD,
          transform: `scale(${mark}) translateY(36px)`,
          height: 110,
        }}
      >
        “
      </div>
      <Rise text={person.quoteJa} size={88} color="white" delay={6} />
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          color: GOLD_SOFT,
          fontSize: 36,
          marginTop: 36,
          opacity: enShow,
          borderLeft: `4px solid ${GOLD}`,
          paddingLeft: 22,
        }}
      >
        {person.quoteEn}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5. Lessons (compact, quick stagger) ----------
const LessonRow: React.FC<{i: number; no: number; t: string; d: string}> = ({i, no, t, d}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 8 - i * 12, fps, config: {damping: 18, mass: 0.8}});
  return (
    <div style={{transform: `translateX(${(1 - p) * -60}px)`, opacity: p, display: 'flex', gap: 24, alignItems: 'center'}}>
      <div style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 900, fontSize: 68, color: GOLD, width: 76, textAlign: 'center', flexShrink: 0}}>
        {no}
      </div>
      <div style={{fontFamily: FONT}}>
        <div style={{fontSize: 46, fontWeight: 900, color: 'white', lineHeight: 1.12}}>{t}</div>
        <div style={{fontSize: 28, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: 4}}>{d}</div>
      </div>
    </div>
  );
};

const Lessons: React.FC<{person: Person}> = ({person}) => {
  return (
    <AbsoluteFill style={{padding: 76, justifyContent: 'center'}}>
      <Label>この偉人から学んだこと</Label>
      <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
        {person.lessons.map((l, i) => (
          <LessonRow key={i} i={i} no={i + 1} t={l.t} d={l.d} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6. End (compact CTA) ----------
const End: React.FC<{person: Person}> = ({person}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 13}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80}}>
      <div style={{fontFamily: FONT, textAlign: 'center', transform: `scale(${0.92 + p * 0.08})`}}>
        <div style={{fontSize: 70, fontWeight: 900, color: 'white', lineHeight: 1.2}}>
          あなたも、<br />“伝説”を生きろ。
        </div>
        <div style={{marginTop: 40, display: 'inline-block', border: `3px solid ${GOLD}`, color: GOLD, fontWeight: 800, fontSize: 30, padding: '14px 36px', borderRadius: 999}}>
          保存して、明日の自分へ ▶
        </div>
        <div style={{fontSize: 26, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 34, letterSpacing: 3}}>
          偉人に学ぶ VOL.{person.index} · {person.nameEn}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 6-scene, story-driven flow (compare with the 4-scene GreatPersonReel)
export const GreatPersonReelStory: React.FC<{person: Person}> = ({person}) => {
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      <Background />
      <Ribbon />
      <Sequence from={0} durationInFrames={78}>
        <Fade d={78}><Hook person={person} /></Fade>
      </Sequence>
      <Sequence from={72} durationInFrames={84}>
        <Fade d={84}><Intro person={person} /></Fade>
      </Sequence>
      <Sequence from={150} durationInFrames={102}>
        <Fade d={102}><Story person={person} /></Fade>
      </Sequence>
      <Sequence from={246} durationInFrames={90}>
        <Fade d={90}><Quote person={person} /></Fade>
      </Sequence>
      <Sequence from={330} durationInFrames={84}>
        <Fade d={84}><Lessons person={person} /></Fade>
      </Sequence>
      <Sequence from={408} durationInFrames={42}>
        <Fade d={42}><End person={person} /></Fade>
      </Sequence>
    </AbsoluteFill>
  );
};

export {FREDDIE};
