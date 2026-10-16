import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { tokens, fonts, sec } from "./tokens";

// ─────────────────────────────────────────────────────────────────────────────
//  UTILITY HOOKS
// ─────────────────────────────────────────────────────────────────────────────
function useFade(
  startFrame: number,
  durationIn = sec(1),
  durationOut = sec(1),
  totalDuration = sec(8)
) {
  const frame = useCurrentFrame();
  const t = frame - startFrame;
  const fadeIn = interpolate(t, [0, durationIn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(t, [totalDuration - durationOut, totalDuration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(fadeIn, fadeOut);
}

// ─────────────────────────────────────────────────────────────────────────────
//  PARCHMENT BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
const ParchmentBg: React.FC<{ seed?: number }> = ({ seed = 0 }) => {
  const frame = useCurrentFrame();
  const flicker =
    1 + Math.sin(frame * 0.7 + seed) * 0.003 + Math.sin(frame * 2.3 + seed) * 0.002;
  return (
    <AbsoluteFill style={{ background: tokens.parchment, filter: `brightness(${flicker})` }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="paper-texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              seed={seed + 1}
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>
          <filter id="grain">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.9"
              numOctaves="1"
              seed={frame + seed}
              result="g"
            />
            <feColorMatrix type="saturate" values="0" in="g" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <pattern id="hatch-45" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke={tokens.inkDeep} strokeWidth="0.7" opacity="0.55" />
          </pattern>
          <pattern id="hatch-135" width="8" height="8" patternTransform="rotate(135)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke={tokens.inkDeep} strokeWidth="0.7" opacity="0.45" />
          </pattern>
          <pattern id="crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="8" y2="8" stroke={tokens.inkDeep} strokeWidth="0.7" opacity="0.5" />
            <line x1="8" y1="0" x2="0" y2="8" stroke={tokens.inkDeep} strokeWidth="0.7" opacity="0.5" />
          </pattern>
          <pattern id="stipple" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.7" fill={tokens.inkDeep} opacity="0.4" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill={tokens.parchment} />
        <rect width="1920" height="1080" fill={tokens.parchmentMid} filter="url(#paper-texture)" opacity="0.18" />
        <rect width="1920" height="1080" fill="transparent" filter="url(#grain)" opacity="0.06" />
      </svg>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  VIGNETTE
// ─────────────────────────────────────────────────────────────────────────────
const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 90% 85% at 50% 50%, transparent 40%, rgba(26,18,8,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
//  ORNATE FRAME
// ─────────────────────────────────────────────────────────────────────────────
const OrnateFrame: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      <rect x="28" y="18" width="1864" height="1044" fill="none" stroke={tokens.inkDeep} strokeWidth="2.5" />
      <rect x="36" y="26" width="1848" height="1028" fill="none" stroke={tokens.inkDeep} strokeWidth="0.8" />
      {[[38, 28], [1882, 28], [38, 1052], [1882, 1052]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <circle r="10" fill={tokens.parchment} stroke={tokens.inkDeep} strokeWidth="1.5" />
          <circle r="5" fill={tokens.inkDeep} />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

// ─────────────────────────────────────────────────────────────────────────────
//  SCENE 1: TITLE
// ─────────────────────────────────────────────────────────────────────────────
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60 },
    delay: 20,
  });
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 55 },
    delay: 60,
  });
  const scrollFade = interpolate(frame, [210, 256], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ParchmentBg seed={0} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: logoProgress }}>
        <g transform="translate(960,340)">
          <circle r={120} fill={tokens.parchment} stroke={tokens.inkDeep} strokeWidth="2.5" />
          {[0, 120, 240].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <path d="M0,0 L0,-80 Q20,-70 30,-50 Q40,-30 20,-10 Z" fill={tokens.inkDeep} opacity="0.85" />
              <circle cx="0" cy="-88" r="10" fill={tokens.inkDeep} />
            </g>
          ))}
        </g>
      </svg>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: titleProgress * scrollFade }}>
        <text x="960" y="530" fontFamily={fonts.display} fontSize="82" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="8">
          百年阴影
        </text>
        <line x1="340" y1="555" x2="1580" y2="555" stroke={tokens.inkDeep} strokeWidth="1.5" />
        <text x="960" y="600" fontFamily={fonts.display} fontSize="34" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="12">
          西西里的无尽往事
        </text>
      </svg>
      <OrnateFrame opacity={titleProgress * scrollFade} />
      <Vignette strength={0.6} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  SCENE 2: ARREST
// ─────────────────────────────────────────────────────────────────────────────
const ArrestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, config: { damping: 24, stiffness: 40 } });
  const textOpacity = interpolate(frame, [60, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [420, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ParchmentBg seed={5} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: reveal * fadeOut }}>
        <rect x="0" y="0" width="1920" height="380" fill={tokens.parchmentMid} />
        <rect x="0" y="800" width="1920" height="280" fill={tokens.parchmentMid} />
        <g transform="translate(700, 200)">
          <rect x="0" y="0" width="520" height="550" fill={tokens.parchment} stroke={tokens.inkDeep} strokeWidth="2.5" />
          {[80, 220, 360].map((wx) =>
            [120, 260, 400].map((wy) => (
              <rect key={`${wx}-${wy}`} x={wx} y={wy} width="60" height="80" fill={tokens.inkDeep} opacity="0.75" />
            ))
          )}
          <rect x="200" y="430" width="120" height="120" fill={tokens.inkDeep} opacity="0.8" />
          <text x="260" y="510" fontFamily={fonts.serif} fontSize="14" fill={tokens.parchment} textAnchor="middle" letterSpacing="3">
            CLINICA PRIVATA
          </text>
        </g>
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 13) * Math.PI;
          const cx = 960 + Math.cos(angle) * 420;
          const cy = 820 - Math.abs(Math.sin(angle)) * 80;
          return (
            <g key={i} transform={`translate(${cx},${cy})`}>
              <rect x="-12" y="-90" width="24" height="55" rx="3" fill={tokens.inkDeep} />
              <circle cx="0" cy="-100" r="13" fill={tokens.inkDeep} />
              <line x1="10" y1="-80" x2="10" y2="-140" stroke={tokens.inkDeep} strokeWidth="3" />
              <line x1="-6" y1="-35" x2="-8" y2="0" stroke={tokens.inkDeep} strokeWidth="5" />
              <line x1="6" y1="-35" x2="8" y2="0" stroke={tokens.inkDeep} strokeWidth="5" />
            </g>
          );
        })}
      </svg>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: textOpacity * fadeOut }}>
        <rect x="60" y="60" width="560" height="220" fill={tokens.inkDeep} opacity="0.82" rx="2" />
        <text x="340" y="110" fontFamily={fonts.display} fontSize="20" fill={tokens.parchment} textAnchor="middle" letterSpacing="5" opacity="0.8">
          A.D. MMXXIII · PALERMO
        </text>
        <line x1="80" y1="122" x2="600" y2="122" stroke={tokens.parchment} strokeWidth="0.6" opacity="0.3" />
        <text x="340" y="155" fontFamily={fonts.display} fontSize="32" fill={tokens.accentGold} textAnchor="middle" letterSpacing="3">
          马泰奥·梅西纳·德纳罗
        </text>
        <text x="340" y="190" fontFamily={fonts.serif} fontSize="19" fill={tokens.parchment} textAnchor="middle" letterSpacing="2" opacity="0.85">
          Matteo Messina Denaro
        </text>
        <text x="340" y="224" fontFamily={fonts.serif} fontSize="16" fill={tokens.parchment} textAnchor="middle" opacity="0.65" letterSpacing="2">
          逃亡三十年 · 落网巴勒莫 · 年六十一
        </text>
      </svg>
      <OrnateFrame opacity={0.6} />
      <Vignette strength={0.65} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  SCENE 3: ORIGINS
// ─────────────────────────────────────────────────────────────────────────────
const OriginsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapReveal = spring({ frame, fps, config: { damping: 22, stiffness: 35 } });
  const fadeOut = interpolate(frame, [480, 544], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ParchmentBg seed={12} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: mapReveal * fadeOut }}>
        <g transform="translate(260, 180)">
          <path d="M400,20 L710,40 L820,120 L780,250 L680,340 L540,390 L360,370 L200,300 L120,220 L130,130 Z" fill={tokens.parchmentMid} stroke={tokens.inkDeep} strokeWidth="3" />
          <circle cx="180" cy="110" r="12" fill={tokens.darkRed} stroke={tokens.inkDeep} strokeWidth="2" />
          <text x="200" y="95" fontFamily={fonts.serif} fontSize="18" fill={tokens.inkDeep} letterSpacing="2">
            PALERMO
          </text>
          <text x="460" y="450" fontFamily={fonts.display} fontSize="24" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="6" opacity="0.7">
            SICILIA
          </text>
        </g>
        <g transform="translate(1200, 140)">
          <line x1="0" y1="0" x2="0" y2="680" stroke={tokens.inkDeep} strokeWidth="2" />
          {[
            { y: 1861, label: "意大利统一", x: 360 },
            { y: 1893, label: "西西里大旱 / 农民运动失败", x: 420 },
            { y: 1900, label: "黑手党正式扎根", x: 380 },
          ].map((e, i) => {
            const yPos = i * 220 + 50;
            return (
              <g key={i} transform={`translate(0,${yPos})`}>
                <circle cx="0" cy="0" r="8" fill={tokens.darkRed} stroke={tokens.inkDeep} strokeWidth="1.5" />
                <line x1="8" y1="0" x2="40" y2="0" stroke={tokens.inkDeep} strokeWidth="1.2" />
                <rect x="40" y="-28" width={e.x} height="60" fill={tokens.parchment} stroke={tokens.inkDeep} strokeWidth="1.2" rx="2" />
                <text x="60" y="-8" fontFamily={fonts.display} fontSize="20" fill={tokens.darkRed} letterSpacing="3">
                  {e.y}
                </text>
                <text x="60" y="18" fontFamily={fonts.serif} fontSize="16" fill={tokens.inkDeep} letterSpacing="1">
                  {e.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <OrnateFrame opacity={0.6} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  SCENE 4: TRUST & SOCIAL CAPITAL
// ─────────────────────────────────────────────────────────────────────────────
const TrustScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, config: { damping: 20, stiffness: 40 } });
  const fadeOut = interpolate(frame, [460, 512], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ParchmentBg seed={20} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: reveal * fadeOut }}>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#stipple)" opacity="0.08" />
        <g transform="translate(660,480)">
          <circle r="38" fill={tokens.inkDeep} stroke={tokens.inkDeep} strokeWidth="2" />
          <text x="0" y="0" fontFamily={fonts.serif} fontSize="16" fill={tokens.parchment} textAnchor="middle" dominantBaseline="middle" letterSpacing="1">
            黑手党
          </text>
        </g>
        {[
          { id: "blood", x: 430, y: 280, label: "血缘", fill: tokens.darkRed },
          { id: "neigh", x: 880, y: 260, label: "邻里", fill: tokens.prussianBlue },
          { id: "recip", x: 970, y: 520, label: "互惠", fill: tokens.ochre },
          { id: "job", x: 880, y: 720, label: "就业", fill: tokens.sepia },
          { id: "legal", x: 430, y: 720, label: "法律援助", fill: tokens.sepia },
        ].map((n, i) => (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}>
            <circle r="26" fill={n.fill} stroke={tokens.inkDeep} strokeWidth="2" />
            <text x="0" y="0" fontFamily={fonts.serif} fontSize="14" fill={tokens.parchment} textAnchor="middle" dominantBaseline="middle" letterSpacing="1">
              {n.label}
            </text>
          </g>
        ))}
        <g transform="translate(1100, 180)">
          <rect x="0" y="0" width="720" height="200" fill={tokens.parchmentMid} stroke={tokens.inkDeep} strokeWidth="1.5" rx="2" />
          <text x="360" y="40" fontFamily={fonts.display} fontSize="20" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="4">
            社会资本——帕特南
          </text>
          <line x1="30" y1="52" x2="690" y2="52" stroke={tokens.inkDeep} strokeWidth="0.8" />
          <text x="40" y="85" fontFamily={fonts.serif} fontSize="17" fill={tokens.inkDeep} letterSpacing="1" fontStyle="italic">
            "信任、规范与公民参与网络"
          </text>
          <text x="40" y="115" fontFamily={fonts.serif} fontSize="15" fill={tokens.inkDeep} letterSpacing="1" opacity="0.8">
            北部：横向开放网络 → 民主治理
          </text>
          <text x="40" y="145" fontFamily={fonts.serif} fontSize="15" fill={tokens.darkRed} letterSpacing="1" opacity="0.9">
            南部：垂直封闭血缘 → 黑手党整合
          </text>
        </g>
      </svg>
      <OrnateFrame opacity={0.55} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  SCENE 5-9: 简化版本（核心内容保留）
// ─────────────────────────────────────────────────────────────────────────────
const NorthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, config: { damping: 22, stiffness: 38 } });
  const fadeOut = interpolate(frame, [420, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ParchmentBg seed={30} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: reveal * fadeOut }}>
        <text x="960" y="80" fontFamily={fonts.display} fontSize="38" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="6">
          向北扩张的"服务"
        </text>
        <g transform="translate(80, 140)">
          <rect x="0" y="0" width="800" height="600" fill={tokens.parchmentMid} stroke={tokens.inkDeep} strokeWidth="2" rx="2" />
          <text x="400" y="40" fontFamily={fonts.display} fontSize="22" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="4">
            1950s · 经济奇迹
          </text>
          <line x1="20" y1="52" x2="780" y2="52" stroke={tokens.inkDeep} strokeWidth="0.8" opacity="0.4" />
          {[
            "• 约400万南方人北上务工",
            "• 建筑业需大量廉价非正式劳工",
            "• 黑手党充当劳工中介 + 保护费",
            "• 帮企业规避税费 → 用工成本腰斩",
            "• 威胁移民 + 其南方家属 → 缄默",
            "• 强国家执法 → 中介价值反而更高",
          ].map((line, i) => (
            <text
              key={i}
              x="36"
              y={90 + i * 76}
              fontFamily={fonts.serif}
              fontSize="18"
              fill={tokens.inkDeep}
              letterSpacing="1"
              opacity="0.82"
            >
              {line}
            </text>
          ))}
        </g>
      </svg>
      <OrnateFrame opacity={0.55} />
      <Vignette />
    </AbsoluteFill>
  );
};

const LegacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, config: { damping: 22, stiffness: 40 } });
  const fadeOut = interpolate(frame, [430, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ParchmentBg seed={40} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: reveal * fadeOut }}>
        <text x="960" y="80" fontFamily={fonts.display} fontSize="38" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="6">
          子承父业
        </text>
        <g transform="translate(200, 180)">
          <rect x="0" y="0" width="1520" height="700" fill={tokens.parchmentMid} stroke={tokens.inkDeep} strokeWidth="2" rx="2" />
          <text x="760" y="50" fontFamily={fonts.display} fontSize="22" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="4">
            2024年巴勒莫大规模逮捕：181名成员
          </text>
          <line x1="20" y1="62" x2="1500" y2="62" stroke={tokens.inkDeep} strokeWidth="0.8" opacity="0.4" />
          {[
            ["181", "总逮捕人数"],
            ["118", "50岁以下"],
            ["40", "35岁以下"],
            ["全部", "巴勒莫本地出生"],
          ].map(([num, desc], i) => (
            <g key={i} transform={`translate(0,${120 + i * 140})`}>
              <text x="80" y="0" fontFamily={fonts.display} fontSize="52" fill={tokens.accentGold} letterSpacing="2">
                {num}
              </text>
              <text x="80" y="46" fontFamily={fonts.serif} fontSize="18" fill={tokens.inkDeep} letterSpacing="2" opacity="0.85">
                {desc}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <OrnateFrame opacity={0.55} />
      <Vignette />
    </AbsoluteFill>
  );
};

const ModernScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, config: { damping: 22, stiffness: 38 } });
  const fadeOut = interpolate(frame, [430, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ParchmentBg seed={55} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: reveal * fadeOut }}>
        <text x="960" y="80" fontFamily={fonts.display} fontSize="38" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="6">
          旧病新伤
        </text>
        <g transform="translate(80, 140)">
          <rect x="0" y="0" width="800" height="600" fill={tokens.parchmentMid} stroke={tokens.inkDeep} strokeWidth="2" rx="2" />
          <text x="400" y="40" fontFamily={fonts.display} fontSize="22" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="4">
            传统 vs 数字化
          </text>
          <line x1="20" y1="52" x2="780" y2="52" stroke={tokens.inkDeep} strokeWidth="0.8" opacity="0.4" />
          {[
            "传统：pizzini纸条 / 敲诈勒索 / 隐匿战略",
            "",
            "数字化：加密通信 / 比特币 / NFT洗钱",
            "",
            "2020封控：免费食物 + 贷款（利率300%）",
            "",
            "贩毒通道：南美 → 光荣会 → 焦亚陶罗港",
          ].map((line, i) => (
            <text
              key={i}
              x="36"
              y={90 + i * 66}
              fontFamily={fonts.serif}
              fontSize="16"
              fill={tokens.inkDeep}
              letterSpacing="1"
              opacity={line === "" ? 0 : 0.82}
            >
              {line}
            </text>
          ))}
        </g>
      </svg>
      <OrnateFrame opacity={0.55} />
      <Vignette />
    </AbsoluteFill>
  );
};

const EradicationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, config: { damping: 22, stiffness: 38 } });
  const fadeOut = interpolate(frame, [430, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ParchmentBg seed={70} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: reveal * fadeOut }}>
        <text x="960" y="80" fontFamily={fonts.display} fontSize="38" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="6">
          根除为何如此之难
        </text>
        <g transform="translate(80, 140)">
          <rect x="0" y="0" width="1760" height="800" fill={tokens.parchmentMid} stroke={tokens.inkDeep} strokeWidth="2" rx="2" />
          <text x="880" y="50" fontFamily={fonts.display} fontSize="20" fill={tokens.inkDeep} textAnchor="middle" letterSpacing="3">
            路径依赖 / 国家能力悖论 / 社会资本错位 / 代际传递
          </text>
          <line x1="20" y1="62" x2="1740" y2="62" stroke={tokens.inkDeep} strokeWidth="0.8" opacity="0.4" />
          {[
            "1900年黑手党活跃地区 → 1921年识字率平均↓10%",
            "1961/1971年高等教育水平与半世纪前黑手党活动指数负相关",
            "",
            "首席检察官Melillo：'手段日益复杂，如认为游戏结束会是最大错误'",
            "",
            "克劳迪娅·卡拉曼纳（少年检察官）：",
            "如果我们想让他们做出不同选择，就必须给他们工作、稳定、尊严。",
            "否则，恶性循环又会重新开始。",
          ].map((line, i) => (
            <text
              key={i}
              x="40"
              y={100 + i * 80}
              fontFamily={fonts.serif}
              fontSize={line.includes("卡拉曼纳") ? 16 : 15}
              fill={line === "" || line.includes("卡拉曼纳") || line.includes("如果") ? tokens.darkRed : tokens.inkDeep}
              letterSpacing="1"
              opacity={line === "" ? 0 : 0.85}
              fontStyle={line.includes("如果") ? "italic" : "normal"}
            >
              {line}
            </text>
          ))}
        </g>
      </svg>
      <OrnateFrame opacity={0.55} />
      <Vignette />
    </AbsoluteFill>
  );
};

const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, config: { damping: 24, stiffness: 35 } });
  const endFade = interpolate(frame, [980, 1088], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ParchmentBg seed={80} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: 0.16 }}>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#crosshatch)" />
      </svg>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: reveal * 0.55 * endFade }}>
        <g transform="translate(0,600)">
          <path d="M300,0 L300,-180 Q360,-260 420,-180 L420,0 Z" fill={tokens.inkDeep} opacity="0.7" />
          <rect x="460" y="-220" width="60" height="220" fill={tokens.inkDeep} opacity="0.65" />
          {[560, 680, 810, 960, 1100, 1250, 1380, 1500].map((bx, i) => {
            const bh = 80 + (i % 5) * 40;
            return <rect key={i} x={bx} y={-bh} width={90} height={bh} fill={tokens.inkDeep} opacity={0.5} />;
          })}
        </g>
      </svg>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: endFade }}>
        <rect x="220" y="200" width="1480" height="400" fill={tokens.inkDeep} opacity="0.84" rx="2" />
        <text x="960" y="280" fontFamily={fonts.display} fontSize="44" fill={tokens.accentGold} textAnchor="middle" letterSpacing="4">
          "如果我们想让他们做出不同的选择，
        </text>
        <text x="960" y="340" fontFamily={fonts.display} fontSize="44" fill={tokens.accentGold} textAnchor="middle" letterSpacing="4">
          就必须给他们一些东西。
        </text>
        <text x="960" y="400" fontFamily={fonts.display} fontSize="36" fill={tokens.parchment} textAnchor="middle" letterSpacing="4">
          工作、稳定、尊严。
        </text>
        <text x="960" y="480" fontFamily={fonts.serif} fontSize="20" fill={tokens.parchment} textAnchor="middle" letterSpacing="3" opacity="0.8" fontStyle="italic">
          否则，恶性循环又会重新开始。"
        </text>
        <text x="960" y="540" fontFamily={fonts.serif} fontSize="18" fill={tokens.sepia} textAnchor="middle" letterSpacing="3" opacity="0.7" fontStyle="italic">
          —— 克劳迪娅·卡拉曼纳，巴勒莫少年检察官
        </text>
      </svg>
      <OrnateFrame opacity={0.7 * endFade} />
      <Vignette strength={0.7} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN COMPOSITION
// ─────────────────────────────────────────────────────────────────────────────
export const CosaNostra: React.FC = () => {
  const frame = useCurrentFrame();
  const dissolveFrames = [256, 736, 1280, 1792, 2272, 2752, 3232, 3712];
  const dissolveOpacity = dissolveFrames.reduce((acc, center) => {
    const dist = Math.abs(frame - center);
    const fade = dist < 24 ? 1 - dist / 24 : 0;
    return Math.max(acc, fade * 0.85);
  }, 0);

  return (
    <AbsoluteFill style={{ background: tokens.parchment }}>
      <Sequence from={0} durationInFrames={256}>
        <TitleScene />
      </Sequence>
      <Sequence from={256} durationInFrames={480}>
        <ArrestScene />
      </Sequence>
      <Sequence from={736} durationInFrames={544}>
        <OriginsScene />
      </Sequence>
      <Sequence from={1280} durationInFrames={512}>
        <TrustScene />
      </Sequence>
      <Sequence from={1792} durationInFrames={480}>
        <NorthScene />
      </Sequence>
      <Sequence from={2272} durationInFrames={480}>
        <LegacyScene />
      </Sequence>
      <Sequence from={2752} durationInFrames={480}>
        <ModernScene />
      </Sequence>
      <Sequence from={3232} durationInFrames={480}>
        <EradicationScene />
      </Sequence>
      <Sequence from={3712} durationInFrames={1088}>
        <ConclusionScene />
      </Sequence>
      <AbsoluteFill style={{ background: tokens.inkDeep, opacity: dissolveOpacity, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
