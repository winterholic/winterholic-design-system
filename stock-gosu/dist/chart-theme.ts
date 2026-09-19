// stock-gosu chart theme · 자동 생성 — 손으로 고치지 말고 tokens/src/color.*.json 을 고친 뒤 node tokens/build.mjs
// recharts 는 SVG fill/stroke 에 CSS var() 를 못 쓰므로 raw hex 를 여기서 가져간다. DOM 스타일(툴팁 등)은 CSS 변수를 쓴다.
// 사용: const t = currentChartTheme(); <Line stroke={t.series['1']} /> — 다크는 data-theme / prefers-color-scheme 로 고른다.
export const chartLight = {
  "series": {
    "1": "#3182F6",
    "2": "#EB6834",
    "3": "#1BAF7A",
    "4": "#EDA100",
    "5": "#E87BA4",
    "6": "#008300",
    "7": "#4A3AA7",
    "8": "#E34948",
    "other": "#6B7684"
  },
  "overlay": {
    "ma5": "#F59B00",
    "ma20": "#EB6834",
    "ma60": "#807ED0",
    "ma120": "#4E5968",
    "bollinger": "#64A8FF",
    "bollinger-fill": "#64A8FF14"
  },
  "candle": {
    "up": "#F04452",
    "down": "#3182F6",
    "up-wick": "#E0263A",
    "down-wick": "#216FE8",
    "volume-up": "#F0445280",
    "volume-down": "#3182F680"
  },
  "sparkline": {
    "up": "#F04452",
    "down": "#3182F6",
    "flat": "#8B95A1",
    "fill-opacity": "0.12"
  },
  "heat": {
    "up-3": "#E0263A",
    "up-2": "#F04452",
    "up-1": "#FFA7A5",
    "zero": "#E5E8EB",
    "down-1": "#64A8FF",
    "down-2": "#3182F6",
    "down-3": "#216FE8"
  },
  "grid": "#E5E8EB",
  "axis": "#8B95A1",
  "label": "#4E5968",
  "reference": "#B0B8C1",
  "crosshair": "#6B7684",
  "tooltip-bg": "#FFFFFFF5",
  "finance": {
    "up": {
      "text": "#E0263A",
      "solid": "#F04452",
      "bg": "#FFEEEE",
      "border": "#FCCECC",
      "muted": "#FFA7A5",
      "on-bg": "#9F2430"
    },
    "down": {
      "text": "#216FE8",
      "solid": "#3182F6",
      "bg": "#E8F3FF",
      "border": "#90C2FF",
      "muted": "#64A8FF",
      "on-bg": "#1B64DA"
    },
    "flat": {
      "text": "#6B7684",
      "solid": "#8B95A1",
      "bg": "#F2F4F6",
      "border": "#E5E8EB",
      "muted": "#D1D6DB",
      "on-bg": "#4E5968"
    },
    "flash-up": "#F0445226",
    "flash-down": "#3182F626",
    "us-up": {
      "text": "#088467",
      "solid": "#088467",
      "bg": "#E7F8F3",
      "border": "#8AF3D0",
      "muted": "#60DCB7",
      "on-bg": "#046952"
    },
    "us-down": {
      "text": "#E0263A",
      "solid": "#F04452",
      "bg": "#FFEEEE",
      "border": "#FCCECC",
      "muted": "#FFA7A5",
      "on-bg": "#9F2430"
    },
    "us-flash-up": "#03B48826",
    "us-flash-down": "#F0445226"
  }
} as const;
export const chartDark = {
  "series": {
    "1": "#64A8FF",
    "2": "#F97E50",
    "3": "#4FD1A5",
    "4": "#F5C24B",
    "5": "#FCA4C3",
    "6": "#4CBF4C",
    "7": "#9E9EE4",
    "8": "#F07A79",
    "other": "#8B95A1"
  },
  "overlay": {
    "ma5": "#FFB200",
    "ma20": "#F97E50",
    "ma60": "#9E9EE4",
    "ma120": "#D1D6DB",
    "bollinger": "#4593FC",
    "bollinger-fill": "#64A8FF1F"
  },
  "candle": {
    "up": "#FD7678",
    "down": "#64A8FF",
    "up-wick": "#FFA7A5",
    "down-wick": "#90C2FF",
    "volume-up": "#FD767880",
    "volume-down": "#64A8FF80"
  },
  "sparkline": {
    "up": "#FD7678",
    "down": "#64A8FF",
    "flat": "#8B95A1",
    "fill-opacity": "0.16"
  },
  "heat": {
    "up-3": "#FD7678",
    "up-2": "#E0263A",
    "up-1": "#7C1622",
    "zero": "#333D4B",
    "down-1": "#1957C2",
    "down-2": "#216FE8",
    "down-3": "#64A8FF"
  },
  "grid": "#333D4B",
  "axis": "#8B95A1",
  "label": "#D1D6DB",
  "reference": "#6B7684",
  "crosshair": "#B0B8C1",
  "tooltip-bg": "#191F28F5",
  "finance": {
    "up": {
      "text": "#FD7678",
      "solid": "#FD7678",
      "bg": "#420109",
      "border": "#7C1622",
      "muted": "#9F2430",
      "on-bg": "#FFA7A5"
    },
    "down": {
      "text": "#64A8FF",
      "solid": "#64A8FF",
      "bg": "#021D46",
      "border": "#1957C2",
      "muted": "#1B64DA",
      "on-bg": "#90C2FF"
    },
    "flat": {
      "text": "#B0B8C1",
      "solid": "#8B95A1",
      "bg": "#333D4B",
      "border": "#4E5968",
      "muted": "#6B7684",
      "on-bg": "#D1D6DB"
    },
    "flash-up": "#FD767833",
    "flash-down": "#64A8FF33",
    "us-up": {
      "text": "#15C39A",
      "solid": "#15C39A",
      "bg": "#04261C",
      "border": "#01503E",
      "muted": "#046952",
      "on-bg": "#60DCB7"
    },
    "us-down": {
      "text": "#FD7678",
      "solid": "#FD7678",
      "bg": "#420109",
      "border": "#7C1622",
      "muted": "#9F2430",
      "on-bg": "#FFA7A5"
    },
    "us-flash-up": "#15C39A33",
    "us-flash-down": "#FD767833"
  }
} as const;
export type ChartTheme = typeof chartLight;
/** 카테고리 시리즈 8색. 고정 순서·순환 금지. 9번째부터는 other('기타')로 접는다. */
export const seriesColors = (t: ChartTheme = chartLight): readonly string[] => [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (t.series as Record<string, string>)[String(i)]);
export const seriesColor = (index: number, t: ChartTheme = chartLight): string => seriesColors(t)[index] ?? t.series.other;
export const isDarkTheme = (): boolean => typeof document !== 'undefined' && (document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches));
export const currentChartTheme = (): ChartTheme => (isDarkTheme() ? (chartDark as unknown as ChartTheme) : chartLight);
/** 공통 축·격자 스펙 — 모든 차트가 같은 문법으로 보이게 */
export const axisProps = (t: ChartTheme = chartLight) => ({ axisLine: false as const, tickLine: false as const, tick: { fontSize: 11, fill: t.axis } });
export const gridProps = (t: ChartTheme = chartLight) => ({ stroke: t.grid, strokeDasharray: '2 5', vertical: false as const });
export const chartMargin = { top: 8, right: 8, left: 0, bottom: 0 } as const;
export const chartAnimationDuration = 300;
