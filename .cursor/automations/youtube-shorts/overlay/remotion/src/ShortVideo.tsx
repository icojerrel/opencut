import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

export type Word = {word: string; start: number; end: number};

export type ShortProps = {
  width: number;
  height: number;
  fps: number;
  durationSec: number;
  clips: string[];
  clipSec: number;
  transitionSec: number;
  words: Word[];
  hook: string | null;
  captions: {
    font: string;
    fontSize: number;
    wordsPerChunk: number;
    primary: string;
    highlight: string;
  };
  voice: string;
  music: string | null;
  musicVolume: number;
  logo: string | null;
  logoVolume: number;
};

export const defaultShortProps: ShortProps = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationSec: 45,
  clips: [],
  clipSec: 9.5,
  transitionSec: 0.35,
  words: [],
  hook: null,
  captions: {font: 'Arial Black', fontSize: 88, wordsPerChunk: 3, primary: '#ffffff', highlight: '#FFD700'},
  voice: '',
  music: null,
  musicVolume: 0.06,
  logo: null,
  logoVolume: 0.5,
};

const OUTLINE =
  '0 0 18px rgba(0,0,0,0.92), 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, ' +
  '-3px -3px 0 #000, 0 4px 0 #000, 0 -4px 0 #000, 4px 0 0 #000, -4px 0 0 #000';

type Chunk = {words: Word[]; start: number; end: number};

const chunkWords = (words: Word[], per: number): Chunk[] => {
  const chunks: Chunk[] = [];
  for (let i = 0; i < words.length; i += per) {
    const group = words.slice(i, i + per);
    chunks.push({words: group, start: group[0].start, end: group[group.length - 1].end});
  }
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].end = chunks[i + 1].start;
  if (chunks.length) chunks[chunks.length - 1].end += 1.0;
  return chunks;
};

const Captions = ({words, captions}: {words: Word[]; captions: ShortProps['captions']}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const chunks = chunkWords(words, Math.max(1, captions.wordsPerChunk));
  const active = chunks.find((c) => t >= c.start && t < c.end);
  if (!active) return null;

  const chunkPop = interpolate(t - active.start, [0, 0.12, 0.28], [0.92, 1.06, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          marginBottom: '26%',
          maxWidth: '88%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.32em',
          transform: `scale(${chunkPop})`,
          fontFamily: `'${captions.font}', 'Arial Black', Arial, sans-serif`,
          fontSize: captions.fontSize,
          fontWeight: 900,
          textTransform: 'uppercase',
          lineHeight: 1.12,
          textAlign: 'center',
        }}
      >
        {active.words.map((w, i) => {
          const spoken = t >= w.start;
          const pop = spoken
            ? interpolate(t - w.start, [0, 0.07, 0.16], [0.88, 1.18, 1], {
                extrapolateRight: 'clamp',
              })
            : 1;
          return (
            <span
              key={`${w.start}-${i}`}
              style={{
                color: spoken ? captions.highlight : captions.primary,
                textShadow: spoken
                  ? `${OUTLINE}, 0 0 22px ${captions.highlight}88`
                  : OUTLINE,
                transform: `scale(${pop})`,
                display: 'inline-block',
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const HookCard = ({hook, captions}: {hook: string; captions: ShortProps['captions']}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const opacity = interpolate(t, [0, 0.2, 2.4, 2.8], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });
  const slide = interpolate(t, [0, 0.4], [40, 0], {extrapolateRight: 'clamp'});
  const scale = interpolate(t, [0, 0.35], [0.94, 1], {extrapolateRight: 'clamp'});
  if (t > 2.9) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', opacity, pointerEvents: 'none'}}>
      <div
        style={{
          marginTop: '12%',
          maxWidth: '90%',
          transform: `translateY(${slide}px) scale(${scale})`,
          fontFamily: `'${captions.font}', 'Arial Black', Arial, sans-serif`,
          fontSize: captions.fontSize * 0.95,
          fontWeight: 900,
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.16,
          color: '#ffffff',
          textShadow: OUTLINE,
          background: 'linear-gradient(135deg, rgba(88,28,135,0.72) 0%, rgba(15,118,110,0.68) 100%)',
          padding: '0.42em 0.55em',
          borderRadius: 20,
          border: '2px solid rgba(255,215,0,0.55)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        }}
      >
        {hook}
      </div>
    </AbsoluteFill>
  );
};

const KenBurnsClip = ({clip, durationFrames}: {clip: string; durationFrames: number}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, durationFrames], [1.04, 1.12], {
    extrapolateRight: 'clamp',
  });
  const panY = interpolate(frame, [0, durationFrames], [0, -12], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo
        muted
        src={staticFile(clip)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${zoom}) translateY(${panY}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const CinematicOverlay = () => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + 0.05 * Math.sin(frame / 18);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* color grade: purple/teal Shorts look */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(76,29,149,0.18) 0%, transparent 35%, transparent 55%, rgba(13,148,136,0.22) 100%)',
          mixBlendMode: 'soft-light',
        }}
      />
      {/* vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* subtle scan-line texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: pulse * 0.06,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 3px)',
        }}
      />
    </AbsoluteFill>
  );
};

export const ShortVideo = (props: ShortProps) => {
  const {fps} = useVideoConfig();
  const clipFrames = Math.max(1, Math.round(props.clipSec * fps));
  const transFrames = Math.max(1, Math.round(props.transitionSec * fps));

  const series: JSX.Element[] = [];
  props.clips.forEach((clip, i) => {
    const isLast = i === props.clips.length - 1;
    const dur = isLast ? clipFrames + fps : clipFrames;
    series.push(
      <TransitionSeries.Sequence key={`clip-${i}`} durationInFrames={dur}>
        <KenBurnsClip clip={clip} durationFrames={dur} />
      </TransitionSeries.Sequence>
    );
    if (!isLast) {
      series.push(
        <TransitionSeries.Transition
          key={`trans-${i}`}
          presentation={fade()}
          timing={linearTiming({durationInFrames: transFrames})}
        />
      );
    }
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <TransitionSeries>{series}</TransitionSeries>
      <CinematicOverlay />

      {props.hook ? <HookCard hook={props.hook} captions={props.captions} /> : null}
      <Captions words={props.words} captions={props.captions} />

      {props.voice ? <Audio src={staticFile(props.voice)} /> : null}
      {props.music ? <Audio loop src={staticFile(props.music)} volume={props.musicVolume} /> : null}
      {props.logo ? (
        <Sequence from={0}>
          <Audio src={staticFile(props.logo)} volume={props.logoVolume} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
