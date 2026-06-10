import React from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const YELLOW = "rgb(255, 237, 0)";
const TOTAL_FRAMES = 116;
const START_DELAY_SECONDS = 0.08;
const LETTER_REVEAL_SECONDS = 0.48;
const LETTER_STAGGER_SECONDS = 0.105;
const DRAW_EASE = Easing.bezier(0.16, 1, 0.3, 1);

const paths = [
  "M 545 837.945312 L 545 1025.832031 L 505.425781 1025.832031 L 505.425781 752.125 L 542.5 752.125 L 610.40625 881.6875 L 677.898438 752.125 L 714.972656 752.125 L 714.972656 1025.832031 L 673.308594 1025.832031 L 673.308594 838.777344 L 622.488281 935.84375 L 597.074219 935.84375 Z M 545 837.945312",
  "M 1346.691406 848.257812 L 1346.691406 790.871094 L 1465.417969 790.871094 L 1465.417969 752.125 L 1303.78125 752.125 L 1303.78125 805.125 C 1303.78125 828.878906 1322.96875 848.125 1346.691406 848.257812",
  "M 1346.691406 987.089844 L 1346.691406 905.433594 L 1454.589844 905.433594 L 1454.589844 867.523438 L 1346.691406 867.523438 L 1346.691406 867.328125 L 1303.78125 867.328125 L 1303.78125 1025.832031 L 1469.171875 1025.832031 L 1469.171875 987.089844 Z M 1346.691406 987.089844",
  "M 331.667969 848.257812 L 331.667969 790.871094 L 450.394531 790.871094 L 450.394531 752.125 L 288.753906 752.125 L 288.753906 805.125 C 288.753906 828.878906 307.941406 848.125 331.667969 848.257812",
  "M 331.667969 987.089844 L 331.667969 905.433594 L 439.566406 905.433594 L 439.566406 867.523438 L 331.667969 867.523438 L 331.667969 867.328125 L 288.753906 867.328125 L 288.753906 1025.832031 L 454.144531 1025.832031 L 454.144531 987.089844 Z M 331.667969 987.089844",
  "M 829.589844 894.605469 L 848.898438 902.175781 C 852.53125 887.070312 851.917969 866.675781 832.089844 849.644531 C 828.386719 847.554688 825.175781 845.1875 822.503906 842.59375 C 822.441406 842.550781 822.386719 842.507812 822.324219 842.464844 L 822.34375 842.421875 C 815.5625 835.726562 812.089844 827.621094 812.089844 819.207031 C 812.089844 798.367188 828.339844 783.792969 856.664062 783.792969 C 884.996094 783.792969 902.078125 801.28125 902.078125 825.449219 L 902.078125 832.949219 L 944.570312 832.949219 L 944.570312 827.113281 C 944.570312 778.375 908.742188 747.957031 856.664062 747.957031 C 804.175781 747.957031 770.847656 780.453125 770.847656 822.109375 C 770.847656 860.023438 795.007812 881.269531 829.589844 894.605469",
  "M 882.078125 869.609375 L 873.488281 866.308594 C 869.484375 880.386719 868.640625 900.050781 884.945312 917.21875 C 890.566406 920.394531 895.214844 924.132812 898.882812 928.480469 C 899.046875 928.578125 899.175781 928.695312 899.34375 928.792969 L 899.257812 928.945312 C 904.441406 935.292969 907.492188 943.011719 907.492188 952.925781 C 907.492188 976.671875 889.582031 994.175781 857.085938 994.175781 C 825.835938 994.175781 807.089844 977.511719 807.089844 952.507812 L 807.089844 942.925781 L 765.015625 942.925781 L 765.015625 950.847656 C 765.015625 999.585938 803.339844 1029.996094 858.332031 1029.996094 C 912.90625 1029.996094 949.570312 997.089844 949.570312 948.351562 C 949.570312 899.179688 914.992188 882.105469 882.078125 869.609375",
  "M 234.136719 837.121094 L 234.136719 830.867188 C 234.136719 779.628906 197.898438 747.957031 143.738281 747.957031 C 85.828125 747.957031 50 782.546875 50 837.527344 L 50 940.433594 C 50 995.425781 87.910156 1030 142.902344 1030 C 197.476562 1030 234.136719 996.671875 234.136719 942.929688 L 234.136719 889.195312 L 163.238281 889.195312 C 145.160156 890.273438 130.800781 905.039062 130.605469 923.347656 L 193.730469 923.347656 L 193.730469 943.347656 C 193.730469 971.679688 175.816406 991.261719 142.902344 991.261719 C 111.242188 991.261719 92.910156 970.429688 92.910156 940.433594 L 92.910156 837.527344 C 92.910156 807.539062 111.242188 786.710938 143.316406 786.710938 C 174.980469 786.710938 192.476562 804.621094 192.476562 830.445312 L 192.476562 837.121094 Z M 234.136719 837.121094",
  "M 1563.359375 967.953125 L 1563.359375 752.125 L 1520.449219 752.125 L 1520.449219 924.824219 C 1520.449219 948.570312 1539.636719 967.8125 1563.359375 967.953125",
  "M 1563.359375 987.09375 L 1563.359375 987.019531 L 1520.449219 987.019531 L 1520.449219 1025.832031 L 1675.839844 1025.832031 L 1675.839844 987.09375 Z M 1563.359375 987.09375",
  "M 1757.523438 967.953125 L 1757.523438 752.125 L 1714.609375 752.125 L 1714.609375 924.824219 C 1714.609375 948.570312 1733.796875 967.8125 1757.523438 967.953125",
  "M 1757.523438 987.09375 L 1757.523438 987.019531 L 1714.609375 987.019531 L 1714.609375 1025.832031 L 1870 1025.832031 L 1870 987.09375 Z M 1757.523438 987.09375",
  "M 1084 830.328125 L 1059.59375 949.601562 L 1021.269531 752.125 L 978.355469 752.125 L 1038.347656 1025.832031 L 1077.503906 1025.832031 L 1108.585938 875.78125 C 1109.097656 861.8125 1105.40625 841.921875 1084 830.328125",
  "M 1218.320312 752.125 L 1179.574219 950.011719 L 1139.167969 752.125 L 1102.5 752.125 L 1118.730469 826.796875 L 1118.753906 826.699219 L 1159.996094 1025.832031 L 1199.15625 1025.832031 L 1259.148438 752.125 Z M 1218.320312 752.125",
];

const letters = [
  { id: "g", x: 48, y: 744, width: 190, height: 290, pathIndexes: [7] },
  { id: "e1", x: 286, y: 748, width: 171, height: 282, pathIndexes: [3, 4] },
  { id: "m", x: 503, y: 748, width: 215, height: 282, pathIndexes: [0] },
  { id: "s", x: 762, y: 744, width: 190, height: 290, pathIndexes: [5, 6] },
  { id: "w", x: 976, y: 748, width: 286, height: 282, pathIndexes: [12, 13] },
  { id: "e2", x: 1301, y: 748, width: 171, height: 282, pathIndexes: [1, 2] },
  { id: "l1", x: 1518, y: 748, width: 160, height: 282, pathIndexes: [8, 9] },
  { id: "l2", x: 1712, y: 748, width: 161, height: 282, pathIndexes: [10, 11] },
];

const organicStrokes = {
  g: [
    {
      path: "M 177 787 C 113 779 74 816 74 883 C 74 963 101 1002 145 1003 C 188 1004 215 974 214 925",
      width: 92,
      delay: 0,
      duration: 0.4,
      points: [[177, 787], [91, 824], [88, 952], [146, 1003], [214, 925]],
    },
    {
      path: "M 134 909 C 155 905 181 906 225 906",
      width: 62,
      delay: 0.18,
      duration: 0.24,
      points: [[134, 909], [179, 906], [225, 906]],
    },
  ],
  e1: [
    {
      path: "M 328 777 C 326 834 327 927 328 1005",
      width: 84,
      delay: 0,
      duration: 0.38,
      points: [[328, 777], [327, 882], [328, 1005]],
    },
    {
      path: "M 323 775 C 357 777 407 776 455 776",
      width: 68,
      delay: 0.06,
      duration: 0.26,
      points: [[323, 775], [389, 776], [455, 776]],
    },
    {
      path: "M 326 887 C 358 888 397 888 444 887",
      width: 60,
      delay: 0.16,
      duration: 0.24,
      points: [[326, 887], [385, 888], [444, 887]],
    },
    {
      path: "M 326 1006 C 367 1007 413 1006 456 1006",
      width: 68,
      delay: 0.24,
      duration: 0.22,
      points: [[326, 1006], [391, 1007], [456, 1006]],
    },
  ],
  m: [
    {
      path: "M 525 1008 C 525 941 525 850 525 776",
      width: 74,
      delay: 0,
      duration: 0.32,
      points: [[525, 1008], [525, 890], [525, 776]],
    },
    {
      path: "M 529 782 C 558 834 586 887 610 927",
      width: 78,
      delay: 0.06,
      duration: 0.28,
      points: [[529, 782], [573, 872], [610, 927]],
    },
    {
      path: "M 610 927 C 633 887 662 832 695 776",
      width: 78,
      delay: 0.16,
      duration: 0.28,
      points: [[610, 927], [658, 842], [695, 776]],
    },
    {
      path: "M 695 776 C 695 852 695 944 695 1008",
      width: 76,
      delay: 0.24,
      duration: 0.24,
      points: [[695, 776], [695, 898], [695, 1008]],
    },
  ],
  s: [
    {
      path: "M 922 826 C 918 786 891 767 850 767 C 809 767 788 789 788 821 C 788 854 820 874 864 887",
      width: 86,
      delay: 0,
      duration: 0.34,
      points: [[922, 826], [890, 768], [795, 807], [864, 887]],
    },
    {
      path: "M 802 947 C 806 988 835 1011 872 1009 C 915 1006 931 980 927 949 C 923 918 897 902 854 888",
      width: 88,
      delay: 0.17,
      duration: 0.32,
      points: [[802, 947], [837, 1010], [924, 981], [854, 888]],
    },
  ],
  w: [
    {
      path: "M 1000 770 C 1018 854 1036 939 1058 1005",
      width: 76,
      delay: 0,
      duration: 0.29,
      points: [[1000, 770], [1033, 929], [1058, 1005]],
    },
    {
      path: "M 1058 1005 C 1077 930 1094 867 1111 812",
      width: 76,
      delay: 0.08,
      duration: 0.28,
      points: [[1058, 1005], [1088, 889], [1111, 812]],
    },
    {
      path: "M 1111 812 C 1128 884 1145 950 1162 1005",
      width: 76,
      delay: 0.17,
      duration: 0.27,
      points: [[1111, 812], [1140, 937], [1162, 1005]],
    },
    {
      path: "M 1162 1005 C 1185 926 1209 831 1236 770",
      width: 78,
      delay: 0.25,
      duration: 0.25,
      points: [[1162, 1005], [1201, 854], [1236, 770]],
    },
  ],
  e2: [
    {
      path: "M 1343 777 C 1343 835 1343 928 1344 1005",
      width: 84,
      delay: 0,
      duration: 0.38,
      points: [[1343, 777], [1343, 884], [1344, 1005]],
    },
    {
      path: "M 1338 775 C 1375 776 1424 776 1466 776",
      width: 68,
      delay: 0.06,
      duration: 0.24,
      points: [[1338, 775], [1402, 776], [1466, 776]],
    },
    {
      path: "M 1342 887 C 1374 888 1411 888 1456 887",
      width: 60,
      delay: 0.16,
      duration: 0.22,
      points: [[1342, 887], [1399, 888], [1456, 887]],
    },
    {
      path: "M 1343 1006 C 1384 1007 1432 1007 1469 1006",
      width: 68,
      delay: 0.23,
      duration: 0.22,
      points: [[1343, 1006], [1407, 1007], [1469, 1006]],
    },
  ],
  l1: [
    {
      path: "M 1542 770 C 1542 837 1542 924 1542 1004",
      width: 84,
      delay: 0,
      duration: 0.34,
      points: [[1542, 770], [1542, 890], [1542, 1004]],
    },
    {
      path: "M 1542 1006 C 1584 1007 1631 1007 1676 1006",
      width: 70,
      delay: 0.18,
      duration: 0.24,
      points: [[1542, 1006], [1610, 1007], [1676, 1006]],
    },
  ],
  l2: [
    {
      path: "M 1736 770 C 1736 838 1736 925 1736 1004",
      width: 84,
      delay: 0,
      duration: 0.34,
      points: [[1736, 770], [1736, 890], [1736, 1004]],
    },
    {
      path: "M 1736 1006 C 1777 1007 1828 1007 1871 1006",
      width: 70,
      delay: 0.18,
      duration: 0.24,
      points: [[1736, 1006], [1805, 1007], [1871, 1006]],
    },
  ],
};

const clampProgress = (frame, start, end) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: DRAW_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const pointAtProgress = (points, progress) => {
  if (!points || points.length === 0) return [0, 0];
  if (points.length === 1) return points[0];

  const segmentCount = points.length - 1;
  const scaled = Math.min(segmentCount - 0.0001, Math.max(0, progress) * segmentCount);
  const index = Math.floor(scaled);
  const local = scaled - index;
  const [x1, y1] = points[index];
  const [x2, y2] = points[index + 1];

  return [x1 + (x2 - x1) * local, y1 + (y2 - y1) * local];
};

function OrganicStroke({ frame, fps, letterStart, stroke, strokeIndex }) {
  const strokeStart = letterStart + stroke.delay * fps;
  const strokeEnd = strokeStart + stroke.duration * fps;
  const progress = clampProgress(frame, strokeStart, strokeEnd);
  const opacity = interpolate(progress, [0, 0.04, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <path
      d={stroke.path}
      fill="none"
      opacity={opacity}
      pathLength="1"
      stroke="white"
      strokeDasharray="1"
      strokeDashoffset={1 - progress}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={stroke.width}
      style={{
        transform: `translate(${Math.sin((frame + strokeIndex * 11) * 0.11) * 0.55}px, ${
          Math.cos((frame + strokeIndex * 7) * 0.09) * 0.45
        }px)`,
      }}
    />
  );
}

function OrganicInkTip({ frame, fps, letterStart, stroke }) {
  const strokeStart = letterStart + stroke.delay * fps;
  const strokeEnd = strokeStart + stroke.duration * fps;
  const rawProgress = interpolate(frame, [strokeStart, strokeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = clampProgress(frame, strokeStart, strokeEnd);
  const activeOpacity = interpolate(rawProgress, [0, 0.06, 0.86, 1], [0, 0.76, 0.48, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const [cx, cy] = pointAtProgress(stroke.points, eased);
  const radius = interpolate(rawProgress, [0, 0.42, 1], [7.5, 11, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (activeOpacity <= 0.01) return null;

  return (
    <g opacity={activeOpacity} filter="url(#gemswell-ink-tip)">
      <circle cx={cx} cy={cy} fill="rgb(255, 255, 210)" r={radius} />
      <circle cx={cx} cy={cy} fill={YELLOW} opacity="0.62" r={radius * 1.9} />
    </g>
  );
}

function LetterReveal({ letter, index }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = START_DELAY_SECONDS * fps + index * LETTER_STAGGER_SECONDS * fps;
  const end = start + LETTER_REVEAL_SECONDS * fps;
  const strokes = organicStrokes[letter.id] ?? [];
  const progress = clampProgress(frame, start, end);
  const blur = interpolate(progress, [0, 0.24, 1], [2.4, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 0.08, 1], [0, 0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const maskId = `gemswell-draw-mask-${letter.id}`;

  return (
    <>
      <defs>
        <mask height="1080" id={maskId} maskUnits="userSpaceOnUse" width="1920" x="0" y="0">
          <rect fill="black" height="1080" width="1920" x="0" y="0" />
          {strokes.map((stroke, strokeIndex) => (
            <OrganicStroke
              frame={frame}
              fps={fps}
              key={`${letter.id}-stroke-${strokeIndex}`}
              letterStart={start}
              stroke={stroke}
              strokeIndex={strokeIndex}
            />
          ))}
        </mask>
      </defs>
      <g mask={`url(#${maskId})`} opacity={opacity} style={{ filter: `blur(${blur}px)` }}>
        {letter.pathIndexes.map((pathIndex) => (
          <path
            d={paths[pathIndex]}
            fill={YELLOW}
            fillOpacity="1"
            fillRule="nonzero"
            key={pathIndex}
          />
        ))}
      </g>
      {strokes.map((stroke, strokeIndex) => (
        <OrganicInkTip
          frame={frame}
          fps={fps}
          key={`${letter.id}-tip-${strokeIndex}`}
          letterStart={start}
          stroke={stroke}
        />
      ))}
    </>
  );
}

function GemswellWordmarkComposition() {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg
        aria-hidden="true"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox="0 0 1920 1080"
        width="100%"
      >
        <defs>
          <filter id="gemswell-ink-tip" x="-180%" y="-180%" width="460%" height="460%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {letters.map((letter, index) => (
          <LetterReveal index={index} key={letter.id} letter={letter} />
        ))}
      </svg>
    </AbsoluteFill>
  );
}

export function GemswellWordmarkRemotion() {
  return (
    <div aria-label="GEMSWELL" className="hero-wordmark hero-wordmark-player">
      <Player
        acknowledgeRemotionLicense
        autoPlay
        component={GemswellWordmarkComposition}
        compositionHeight={1080}
        compositionWidth={1920}
        controls={false}
        durationInFrames={TOTAL_FRAMES}
        fps={60}
        initiallyMuted
        logLevel="error"
        loop={false}
        moveToBeginningWhenEnded={false}
        numberOfSharedAudioTags={0}
        overflowVisible
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
