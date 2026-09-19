// winterholic-base Tailwind preset · 자동 생성
// tailwind.config: { presets: [require('winterholic-base/dist/tailwind.preset.cjs')] }
// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드해야 한다. 다크모드는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": {
          "canvas": "var(--sg-color-surface-canvas)",
          "default": "var(--sg-color-surface-default)",
          "raised": "var(--sg-color-surface-raised)",
          "sunken": "var(--sg-color-surface-sunken)",
          "sunken-strong": "var(--sg-color-surface-sunken-strong)",
          "overlay": "var(--sg-color-surface-overlay)",
          "inverse": "var(--sg-color-surface-inverse)",
          "brand": "var(--sg-color-surface-brand)",
          "brand-subtle": "var(--sg-color-surface-brand-subtle)",
          "disabled": "var(--sg-color-surface-disabled)"
        },
        "text": {
          "primary": "var(--sg-color-text-primary)",
          "secondary": "var(--sg-color-text-secondary)",
          "tertiary": "var(--sg-color-text-tertiary)",
          "placeholder": "var(--sg-color-text-placeholder)",
          "disabled": "var(--sg-color-text-disabled)",
          "inverse": "var(--sg-color-text-inverse)",
          "on-brand": "var(--sg-color-text-on-brand)",
          "brand": "var(--sg-color-text-brand)",
          "link": "var(--sg-color-text-link)",
          "link-hover": "var(--sg-color-text-link-hover)",
          "success": "var(--sg-color-text-success)",
          "warning": "var(--sg-color-text-warning)",
          "danger": "var(--sg-color-text-danger)",
          "info": "var(--sg-color-text-info)"
        },
        "border": {
          "subtle": "var(--sg-color-border-subtle)",
          "default": "var(--sg-color-border-default)",
          "strong": "var(--sg-color-border-strong)",
          "input-strict": "var(--sg-color-border-input-strict)",
          "brand": "var(--sg-color-border-brand)",
          "focus": "var(--sg-color-border-focus)",
          "danger": "var(--sg-color-border-danger)",
          "inverse": "var(--sg-color-border-inverse)"
        },
        "action": {
          "primary": {
            "bg": "var(--sg-color-action-primary-bg)",
            "bg-hover": "var(--sg-color-action-primary-bg-hover)",
            "bg-active": "var(--sg-color-action-primary-bg-active)",
            "text": "var(--sg-color-action-primary-text)"
          },
          "primary-strict": {
            "bg": "var(--sg-color-action-primary-strict-bg)",
            "bg-hover": "var(--sg-color-action-primary-strict-bg-hover)",
            "bg-active": "var(--sg-color-action-primary-strict-bg-active)",
            "text": "var(--sg-color-action-primary-strict-text)"
          },
          "secondary": {
            "bg": "var(--sg-color-action-secondary-bg)",
            "bg-hover": "var(--sg-color-action-secondary-bg-hover)",
            "bg-active": "var(--sg-color-action-secondary-bg-active)",
            "border": "var(--sg-color-action-secondary-border)",
            "text": "var(--sg-color-action-secondary-text)"
          },
          "outline": {
            "bg": "var(--sg-color-action-outline-bg)",
            "bg-hover": "var(--sg-color-action-outline-bg-hover)",
            "bg-active": "var(--sg-color-action-outline-bg-active)",
            "border": "var(--sg-color-action-outline-border)",
            "border-hover": "var(--sg-color-action-outline-border-hover)",
            "text": "var(--sg-color-action-outline-text)",
            "text-hover": "var(--sg-color-action-outline-text-hover)"
          },
          "ghost": {
            "bg": "var(--sg-color-action-ghost-bg)",
            "bg-hover": "var(--sg-color-action-ghost-bg-hover)",
            "bg-active": "var(--sg-color-action-ghost-bg-active)",
            "text": "var(--sg-color-action-ghost-text)"
          },
          "danger": {
            "bg": "var(--sg-color-action-danger-bg)",
            "bg-hover": "var(--sg-color-action-danger-bg-hover)",
            "bg-active": "var(--sg-color-action-danger-bg-active)",
            "text": "var(--sg-color-action-danger-text)"
          },
          "disabled": {
            "bg": "var(--sg-color-action-disabled-bg)",
            "text": "var(--sg-color-action-disabled-text)",
            "border": "var(--sg-color-action-disabled-border)"
          }
        },
        "finance": {
          "up": {
            "text": "var(--sg-color-finance-up-text)",
            "solid": "var(--sg-color-finance-up-solid)",
            "bg": "var(--sg-color-finance-up-bg)",
            "border": "var(--sg-color-finance-up-border)",
            "muted": "var(--sg-color-finance-up-muted)",
            "on-bg": "var(--sg-color-finance-up-on-bg)"
          },
          "down": {
            "text": "var(--sg-color-finance-down-text)",
            "solid": "var(--sg-color-finance-down-solid)",
            "bg": "var(--sg-color-finance-down-bg)",
            "border": "var(--sg-color-finance-down-border)",
            "muted": "var(--sg-color-finance-down-muted)",
            "on-bg": "var(--sg-color-finance-down-on-bg)"
          },
          "flat": {
            "text": "var(--sg-color-finance-flat-text)",
            "solid": "var(--sg-color-finance-flat-solid)",
            "bg": "var(--sg-color-finance-flat-bg)",
            "border": "var(--sg-color-finance-flat-border)",
            "muted": "var(--sg-color-finance-flat-muted)",
            "on-bg": "var(--sg-color-finance-flat-on-bg)"
          },
          "flash-up": "var(--sg-color-finance-flash-up)",
          "flash-down": "var(--sg-color-finance-flash-down)",
          "us-up": {
            "text": "var(--sg-color-finance-us-up-text)",
            "solid": "var(--sg-color-finance-us-up-solid)",
            "bg": "var(--sg-color-finance-us-up-bg)",
            "border": "var(--sg-color-finance-us-up-border)",
            "muted": "var(--sg-color-finance-us-up-muted)",
            "on-bg": "var(--sg-color-finance-us-up-on-bg)"
          },
          "us-down": {
            "text": "var(--sg-color-finance-us-down-text)",
            "solid": "var(--sg-color-finance-us-down-solid)",
            "bg": "var(--sg-color-finance-us-down-bg)",
            "border": "var(--sg-color-finance-us-down-border)",
            "muted": "var(--sg-color-finance-us-down-muted)",
            "on-bg": "var(--sg-color-finance-us-down-on-bg)"
          },
          "us-flash-up": "var(--sg-color-finance-us-flash-up)",
          "us-flash-down": "var(--sg-color-finance-us-flash-down)"
        },
        "status": {
          "success": {
            "bg": "var(--sg-color-status-success-bg)",
            "border": "var(--sg-color-status-success-border)",
            "text": "var(--sg-color-status-success-text)",
            "icon": "var(--sg-color-status-success-icon)",
            "solid": "var(--sg-color-status-success-solid)",
            "on-solid": "var(--sg-color-status-success-on-solid)"
          },
          "warning": {
            "bg": "var(--sg-color-status-warning-bg)",
            "border": "var(--sg-color-status-warning-border)",
            "text": "var(--sg-color-status-warning-text)",
            "icon": "var(--sg-color-status-warning-icon)",
            "solid": "var(--sg-color-status-warning-solid)",
            "on-solid": "var(--sg-color-status-warning-on-solid)"
          },
          "danger": {
            "bg": "var(--sg-color-status-danger-bg)",
            "border": "var(--sg-color-status-danger-border)",
            "text": "var(--sg-color-status-danger-text)",
            "icon": "var(--sg-color-status-danger-icon)",
            "solid": "var(--sg-color-status-danger-solid)",
            "on-solid": "var(--sg-color-status-danger-on-solid)"
          },
          "info": {
            "bg": "var(--sg-color-status-info-bg)",
            "border": "var(--sg-color-status-info-border)",
            "text": "var(--sg-color-status-info-text)",
            "icon": "var(--sg-color-status-info-icon)",
            "solid": "var(--sg-color-status-info-solid)",
            "on-solid": "var(--sg-color-status-info-on-solid)"
          },
          "neutral": {
            "bg": "var(--sg-color-status-neutral-bg)",
            "border": "var(--sg-color-status-neutral-border)",
            "text": "var(--sg-color-status-neutral-text)",
            "icon": "var(--sg-color-status-neutral-icon)",
            "solid": "var(--sg-color-status-neutral-solid)",
            "on-solid": "var(--sg-color-status-neutral-on-solid)"
          }
        },
        "interactive": {
          "focus-ring": "var(--sg-color-interactive-focus-ring)",
          "focus-ring-soft": "var(--sg-color-interactive-focus-ring-soft)",
          "selected-bg": "var(--sg-color-interactive-selected-bg)",
          "selected-border": "var(--sg-color-interactive-selected-border)",
          "selected-text": "var(--sg-color-interactive-selected-text)",
          "hover-overlay": "var(--sg-color-interactive-hover-overlay)",
          "pressed-overlay": "var(--sg-color-interactive-pressed-overlay)",
          "row-hover": "var(--sg-color-interactive-row-hover)"
        },
        "chart": {
          "series": {
            "1": "var(--sg-color-chart-series-1)",
            "2": "var(--sg-color-chart-series-2)",
            "3": "var(--sg-color-chart-series-3)",
            "4": "var(--sg-color-chart-series-4)",
            "5": "var(--sg-color-chart-series-5)",
            "6": "var(--sg-color-chart-series-6)",
            "7": "var(--sg-color-chart-series-7)",
            "8": "var(--sg-color-chart-series-8)",
            "other": "var(--sg-color-chart-series-other)"
          },
          "overlay": {
            "ma5": "var(--sg-color-chart-overlay-ma5)",
            "ma20": "var(--sg-color-chart-overlay-ma20)",
            "ma60": "var(--sg-color-chart-overlay-ma60)",
            "ma120": "var(--sg-color-chart-overlay-ma120)",
            "bollinger": "var(--sg-color-chart-overlay-bollinger)",
            "bollinger-fill": "var(--sg-color-chart-overlay-bollinger-fill)"
          },
          "candle": {
            "up": "var(--sg-color-chart-candle-up)",
            "down": "var(--sg-color-chart-candle-down)",
            "up-wick": "var(--sg-color-chart-candle-up-wick)",
            "down-wick": "var(--sg-color-chart-candle-down-wick)",
            "volume-up": "var(--sg-color-chart-candle-volume-up)",
            "volume-down": "var(--sg-color-chart-candle-volume-down)"
          },
          "sparkline": {
            "up": "var(--sg-color-chart-sparkline-up)",
            "down": "var(--sg-color-chart-sparkline-down)",
            "flat": "var(--sg-color-chart-sparkline-flat)",
            "fill-opacity": "var(--sg-color-chart-sparkline-fill-opacity)"
          },
          "heat": {
            "up-3": "var(--sg-color-chart-heat-up-3)",
            "up-2": "var(--sg-color-chart-heat-up-2)",
            "up-1": "var(--sg-color-chart-heat-up-1)",
            "zero": "var(--sg-color-chart-heat-zero)",
            "down-1": "var(--sg-color-chart-heat-down-1)",
            "down-2": "var(--sg-color-chart-heat-down-2)",
            "down-3": "var(--sg-color-chart-heat-down-3)"
          },
          "grid": "var(--sg-color-chart-grid)",
          "axis": "var(--sg-color-chart-axis)",
          "label": "var(--sg-color-chart-label)",
          "reference": "var(--sg-color-chart-reference)",
          "crosshair": "var(--sg-color-chart-crosshair)",
          "tooltip-bg": "var(--sg-color-chart-tooltip-bg)"
        },
        "blue": {
          "50": "var(--sg-blue-50)",
          "100": "var(--sg-blue-100)",
          "200": "var(--sg-blue-200)",
          "300": "var(--sg-blue-300)",
          "400": "var(--sg-blue-400)",
          "500": "var(--sg-blue-500)",
          "600": "var(--sg-blue-600)",
          "700": "var(--sg-blue-700)",
          "800": "var(--sg-blue-800)",
          "900": "var(--sg-blue-900)",
          "950": "var(--sg-blue-950)"
        },
        "gray": {
          "50": "var(--sg-gray-50)",
          "100": "var(--sg-gray-100)",
          "200": "var(--sg-gray-200)",
          "300": "var(--sg-gray-300)",
          "400": "var(--sg-gray-400)",
          "500": "var(--sg-gray-500)",
          "600": "var(--sg-gray-600)",
          "700": "var(--sg-gray-700)",
          "800": "var(--sg-gray-800)",
          "900": "var(--sg-gray-900)",
          "950": "var(--sg-gray-950)"
        },
        "red": {
          "50": "var(--sg-red-50)",
          "100": "var(--sg-red-100)",
          "200": "var(--sg-red-200)",
          "300": "var(--sg-red-300)",
          "400": "var(--sg-red-400)",
          "500": "var(--sg-red-500)",
          "600": "var(--sg-red-600)",
          "700": "var(--sg-red-700)",
          "800": "var(--sg-red-800)",
          "900": "var(--sg-red-900)",
          "950": "var(--sg-red-950)"
        },
        "green": {
          "50": "var(--sg-green-50)",
          "100": "var(--sg-green-100)",
          "200": "var(--sg-green-200)",
          "300": "var(--sg-green-300)",
          "400": "var(--sg-green-400)",
          "500": "var(--sg-green-500)",
          "600": "var(--sg-green-600)",
          "700": "var(--sg-green-700)",
          "800": "var(--sg-green-800)",
          "900": "var(--sg-green-900)",
          "950": "var(--sg-green-950)"
        },
        "yellow": {
          "50": "var(--sg-yellow-50)",
          "100": "var(--sg-yellow-100)",
          "200": "var(--sg-yellow-200)",
          "300": "var(--sg-yellow-300)",
          "400": "var(--sg-yellow-400)",
          "500": "var(--sg-yellow-500)",
          "600": "var(--sg-yellow-600)",
          "700": "var(--sg-yellow-700)",
          "800": "var(--sg-yellow-800)",
          "900": "var(--sg-yellow-900)",
          "950": "var(--sg-yellow-950)"
        },
        "orange": {
          "50": "var(--sg-orange-50)",
          "100": "var(--sg-orange-100)",
          "200": "var(--sg-orange-200)",
          "300": "var(--sg-orange-300)",
          "400": "var(--sg-orange-400)",
          "500": "var(--sg-orange-500)",
          "600": "var(--sg-orange-600)",
          "700": "var(--sg-orange-700)",
          "800": "var(--sg-orange-800)",
          "900": "var(--sg-orange-900)",
          "950": "var(--sg-orange-950)"
        },
        "violet": {
          "50": "var(--sg-violet-50)",
          "100": "var(--sg-violet-100)",
          "200": "var(--sg-violet-200)",
          "300": "var(--sg-violet-300)",
          "400": "var(--sg-violet-400)",
          "500": "var(--sg-violet-500)",
          "600": "var(--sg-violet-600)",
          "700": "var(--sg-violet-700)",
          "800": "var(--sg-violet-800)",
          "900": "var(--sg-violet-900)",
          "950": "var(--sg-violet-950)"
        },
        "magenta": {
          "50": "var(--sg-magenta-50)",
          "100": "var(--sg-magenta-100)",
          "200": "var(--sg-magenta-200)",
          "300": "var(--sg-magenta-300)",
          "400": "var(--sg-magenta-400)",
          "500": "var(--sg-magenta-500)",
          "600": "var(--sg-magenta-600)",
          "700": "var(--sg-magenta-700)",
          "800": "var(--sg-magenta-800)",
          "900": "var(--sg-magenta-900)",
          "950": "var(--sg-magenta-950)"
        }
      },
      "spacing": {
        "0": "var(--sg-space-0)",
        "1": "var(--sg-space-1)",
        "2": "var(--sg-space-2)",
        "3": "var(--sg-space-3)",
        "4": "var(--sg-space-4)",
        "5": "var(--sg-space-5)",
        "6": "var(--sg-space-6)",
        "7": "var(--sg-space-7)",
        "8": "var(--sg-space-8)",
        "10": "var(--sg-space-10)",
        "12": "var(--sg-space-12)",
        "16": "var(--sg-space-16)",
        "px": "var(--sg-space-px)",
        "0.5": "var(--sg-space-0-5)",
        "1.5": "var(--sg-space-1-5)",
        "2.5": "var(--sg-space-2-5)",
        "3.5": "var(--sg-space-3-5)"
      },
      "borderRadius": {
        "none": "var(--sg-radius-none)",
        "xs": "var(--sg-radius-xs)",
        "sm": "var(--sg-radius-sm)",
        "md": "var(--sg-radius-md)",
        "lg": "var(--sg-radius-lg)",
        "xl": "var(--sg-radius-xl)",
        "2xl": "var(--sg-radius-2xl)",
        "3xl": "var(--sg-radius-3xl)",
        "full": "var(--sg-radius-full)"
      },
      "boxShadow": {
        "xs": "var(--sg-shadow-xs)",
        "sm": "var(--sg-shadow-sm)",
        "md": "var(--sg-shadow-md)",
        "lg": "var(--sg-shadow-lg)",
        "xl": "var(--sg-shadow-xl)",
        "inner": "var(--sg-shadow-inner)",
        "sticky": "var(--sg-shadow-sticky)"
      },
      "fontFamily": {
        "sans": "var(--sg-font-family-sans)",
        "mono": "var(--sg-font-family-mono)",
        "display": "var(--sg-font-family-display)"
      },
      "fontSize": {
        "2xs": "var(--sg-font-size-2xs)",
        "xs": "var(--sg-font-size-xs)",
        "sm": "var(--sg-font-size-sm)",
        "md": "var(--sg-font-size-md)",
        "lg": "var(--sg-font-size-lg)",
        "xl": "var(--sg-font-size-xl)",
        "2xl": "var(--sg-font-size-2xl)",
        "3xl": "var(--sg-font-size-3xl)",
        "4xl": "var(--sg-font-size-4xl)",
        "5xl": "var(--sg-font-size-5xl)",
        "6xl": "var(--sg-font-size-6xl)"
      },
      "lineHeight": {
        "none": "var(--sg-font-line-height-none)",
        "tight": "var(--sg-font-line-height-tight)",
        "snug": "var(--sg-font-line-height-snug)",
        "normal": "var(--sg-font-line-height-normal)",
        "relaxed": "var(--sg-font-line-height-relaxed)"
      },
      "letterSpacing": {
        "tighter": "var(--sg-font-letter-spacing-tighter)",
        "tight": "var(--sg-font-letter-spacing-tight)",
        "snug": "var(--sg-font-letter-spacing-snug)",
        "normal": "var(--sg-font-letter-spacing-normal)"
      },
      "fontWeight": {
        "regular": "var(--sg-font-weight-regular)",
        "medium": "var(--sg-font-weight-medium)",
        "semibold": "var(--sg-font-weight-semibold)",
        "bold": "var(--sg-font-weight-bold)",
        "extrabold": "var(--sg-font-weight-extrabold)"
      },
      "zIndex": {
        "hide": "var(--sg-z-index-hide)",
        "base": "var(--sg-z-index-base)",
        "raised": "var(--sg-z-index-raised)",
        "sticky-panel": "var(--sg-z-index-sticky-panel)",
        "dropdown": "var(--sg-z-index-dropdown)",
        "sticky": "var(--sg-z-index-sticky)",
        "overlay": "var(--sg-z-index-overlay)",
        "sheet": "var(--sg-z-index-sheet)",
        "modal": "var(--sg-z-index-modal)",
        "popover": "var(--sg-z-index-popover)",
        "toast": "var(--sg-z-index-toast)",
        "tooltip": "var(--sg-z-index-tooltip)"
      },
      "transitionDuration": {
        "instant": "var(--sg-motion-duration-instant)",
        "fast": "var(--sg-motion-duration-fast)",
        "normal": "var(--sg-motion-duration-normal)",
        "slow": "var(--sg-motion-duration-slow)",
        "flash": "var(--sg-motion-duration-flash)",
        "chart": "var(--sg-motion-duration-chart)",
        "skeleton-cycle": "var(--sg-motion-duration-skeleton-cycle)",
        "toast": "var(--sg-motion-duration-toast)",
        "toast-long": "var(--sg-motion-duration-toast-long)"
      },
      "transitionTimingFunction": {
        "out": "var(--sg-motion-easing-out)",
        "in-out": "var(--sg-motion-easing-in-out)",
        "in": "var(--sg-motion-easing-in)",
        "linear": "var(--sg-motion-easing-linear)"
      },
      "maxWidth": {
        "container-sm": "var(--sg-size-container-sm)",
        "container-md": "var(--sg-size-container-md)",
        "container-lg": "var(--sg-size-container-lg)",
        "container-xl": "var(--sg-size-container-xl)",
        "container-2xl": "var(--sg-size-container-2xl)",
        "container-prose": "var(--sg-size-container-prose)"
      },
      "height": {
        "control-xs": "var(--sg-size-control-xs)",
        "control-sm": "var(--sg-size-control-sm)",
        "control-md": "var(--sg-size-control-md)",
        "control-lg": "var(--sg-size-control-lg)",
        "control-xl": "var(--sg-size-control-xl)"
      },
      "width": {
        "icon-xs": "var(--sg-size-icon-xs)",
        "icon-sm": "var(--sg-size-icon-sm)",
        "icon-md": "var(--sg-size-icon-md)",
        "icon-lg": "var(--sg-size-icon-lg)",
        "icon-xl": "var(--sg-size-icon-xl)",
        "icon-2xl": "var(--sg-size-icon-2xl)"
      }
    },
    "screens": {
      "xs": "375px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px"
    }
  }
};
