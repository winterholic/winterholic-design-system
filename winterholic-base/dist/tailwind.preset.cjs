// winterholic-base Tailwind preset · 자동 생성
// tailwind.config: { presets: [require('winterholic-base/dist/tailwind.preset.cjs')] }
// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드해야 한다. 다크모드는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": {
          "canvas": "var(--wh-color-surface-canvas)",
          "default": "var(--wh-color-surface-default)",
          "raised": "var(--wh-color-surface-raised)",
          "sunken": "var(--wh-color-surface-sunken)",
          "overlay": "var(--wh-color-surface-overlay)",
          "inverse": "var(--wh-color-surface-inverse)",
          "brand": "var(--wh-color-surface-brand)",
          "brand-subtle": "var(--wh-color-surface-brand-subtle)",
          "disabled": "var(--wh-color-surface-disabled)"
        },
        "text": {
          "primary": "var(--wh-color-text-primary)",
          "secondary": "var(--wh-color-text-secondary)",
          "tertiary": "var(--wh-color-text-tertiary)",
          "placeholder": "var(--wh-color-text-placeholder)",
          "disabled": "var(--wh-color-text-disabled)",
          "inverse": "var(--wh-color-text-inverse)",
          "on-brand": "var(--wh-color-text-on-brand)",
          "brand": "var(--wh-color-text-brand)",
          "link": "var(--wh-color-text-link)",
          "link-hover": "var(--wh-color-text-link-hover)",
          "success": "var(--wh-color-text-success)",
          "warning": "var(--wh-color-text-warning)",
          "danger": "var(--wh-color-text-danger)",
          "info": "var(--wh-color-text-info)"
        },
        "border": {
          "subtle": "var(--wh-color-border-subtle)",
          "default": "var(--wh-color-border-default)",
          "strong": "var(--wh-color-border-strong)",
          "input-strict": "var(--wh-color-border-input-strict)",
          "brand": "var(--wh-color-border-brand)",
          "focus": "var(--wh-color-border-focus)",
          "danger": "var(--wh-color-border-danger)",
          "inverse": "var(--wh-color-border-inverse)"
        },
        "action": {
          "primary": {
            "bg": "var(--wh-color-action-primary-bg)",
            "bg-hover": "var(--wh-color-action-primary-bg-hover)",
            "bg-active": "var(--wh-color-action-primary-bg-active)",
            "text": "var(--wh-color-action-primary-text)"
          },
          "secondary": {
            "bg": "var(--wh-color-action-secondary-bg)",
            "bg-hover": "var(--wh-color-action-secondary-bg-hover)",
            "bg-active": "var(--wh-color-action-secondary-bg-active)",
            "border": "var(--wh-color-action-secondary-border)",
            "text": "var(--wh-color-action-secondary-text)"
          },
          "ghost": {
            "bg": "var(--wh-color-action-ghost-bg)",
            "bg-hover": "var(--wh-color-action-ghost-bg-hover)",
            "bg-active": "var(--wh-color-action-ghost-bg-active)",
            "text": "var(--wh-color-action-ghost-text)"
          },
          "danger": {
            "bg": "var(--wh-color-action-danger-bg)",
            "bg-hover": "var(--wh-color-action-danger-bg-hover)",
            "bg-active": "var(--wh-color-action-danger-bg-active)",
            "text": "var(--wh-color-action-danger-text)"
          },
          "danger-ghost": {
            "bg": "var(--wh-color-action-danger-ghost-bg)",
            "bg-hover": "var(--wh-color-action-danger-ghost-bg-hover)",
            "text": "var(--wh-color-action-danger-ghost-text)"
          },
          "disabled": {
            "bg": "var(--wh-color-action-disabled-bg)",
            "text": "var(--wh-color-action-disabled-text)",
            "border": "var(--wh-color-action-disabled-border)"
          }
        },
        "status": {
          "success": {
            "bg": "var(--wh-color-status-success-bg)",
            "border": "var(--wh-color-status-success-border)",
            "text": "var(--wh-color-status-success-text)",
            "icon": "var(--wh-color-status-success-icon)",
            "solid": "var(--wh-color-status-success-solid)",
            "on-solid": "var(--wh-color-status-success-on-solid)"
          },
          "warning": {
            "bg": "var(--wh-color-status-warning-bg)",
            "border": "var(--wh-color-status-warning-border)",
            "text": "var(--wh-color-status-warning-text)",
            "icon": "var(--wh-color-status-warning-icon)",
            "solid": "var(--wh-color-status-warning-solid)",
            "on-solid": "var(--wh-color-status-warning-on-solid)"
          },
          "danger": {
            "bg": "var(--wh-color-status-danger-bg)",
            "border": "var(--wh-color-status-danger-border)",
            "text": "var(--wh-color-status-danger-text)",
            "icon": "var(--wh-color-status-danger-icon)",
            "solid": "var(--wh-color-status-danger-solid)",
            "on-solid": "var(--wh-color-status-danger-on-solid)"
          },
          "info": {
            "bg": "var(--wh-color-status-info-bg)",
            "border": "var(--wh-color-status-info-border)",
            "text": "var(--wh-color-status-info-text)",
            "icon": "var(--wh-color-status-info-icon)",
            "solid": "var(--wh-color-status-info-solid)",
            "on-solid": "var(--wh-color-status-info-on-solid)"
          },
          "neutral": {
            "bg": "var(--wh-color-status-neutral-bg)",
            "border": "var(--wh-color-status-neutral-border)",
            "text": "var(--wh-color-status-neutral-text)",
            "icon": "var(--wh-color-status-neutral-icon)",
            "solid": "var(--wh-color-status-neutral-solid)",
            "on-solid": "var(--wh-color-status-neutral-on-solid)"
          }
        },
        "interactive": {
          "focus-ring": "var(--wh-color-interactive-focus-ring)",
          "selected-bg": "var(--wh-color-interactive-selected-bg)",
          "selected-border": "var(--wh-color-interactive-selected-border)",
          "selected-text": "var(--wh-color-interactive-selected-text)",
          "hover-overlay": "var(--wh-color-interactive-hover-overlay)",
          "pressed-overlay": "var(--wh-color-interactive-pressed-overlay)"
        },
        "accent": {
          "ice": "var(--wh-color-accent-ice)",
          "aqua": "var(--wh-color-accent-aqua)",
          "mist": "var(--wh-color-accent-mist)",
          "steel": "var(--wh-color-accent-steel)",
          "twilight": "var(--wh-color-accent-twilight)"
        },
        "chart": {
          "categorical": {
            "1": "var(--wh-color-chart-categorical-1)",
            "2": "var(--wh-color-chart-categorical-2)",
            "3": "var(--wh-color-chart-categorical-3)",
            "4": "var(--wh-color-chart-categorical-4)",
            "5": "var(--wh-color-chart-categorical-5)",
            "6": "var(--wh-color-chart-categorical-6)",
            "7": "var(--wh-color-chart-categorical-7)",
            "8": "var(--wh-color-chart-categorical-8)"
          },
          "sequential": {
            "1": "var(--wh-color-chart-sequential-1)",
            "2": "var(--wh-color-chart-sequential-2)",
            "3": "var(--wh-color-chart-sequential-3)",
            "4": "var(--wh-color-chart-sequential-4)",
            "5": "var(--wh-color-chart-sequential-5)",
            "6": "var(--wh-color-chart-sequential-6)",
            "7": "var(--wh-color-chart-sequential-7)",
            "8": "var(--wh-color-chart-sequential-8)"
          },
          "diverging": {
            "negative": "var(--wh-color-chart-diverging-negative)",
            "mid": "var(--wh-color-chart-diverging-mid)",
            "positive": "var(--wh-color-chart-diverging-positive)"
          },
          "grid": "var(--wh-color-chart-grid)",
          "axis": "var(--wh-color-chart-axis)",
          "label": "var(--wh-color-chart-label)"
        },
        "blue": {
          "50": "var(--wh-blue-50)",
          "100": "var(--wh-blue-100)",
          "200": "var(--wh-blue-200)",
          "300": "var(--wh-blue-300)",
          "400": "var(--wh-blue-400)",
          "500": "var(--wh-blue-500)",
          "600": "var(--wh-blue-600)",
          "700": "var(--wh-blue-700)",
          "800": "var(--wh-blue-800)",
          "900": "var(--wh-blue-900)",
          "950": "var(--wh-blue-950)"
        },
        "indigo": {
          "50": "var(--wh-indigo-50)",
          "100": "var(--wh-indigo-100)",
          "200": "var(--wh-indigo-200)",
          "300": "var(--wh-indigo-300)",
          "400": "var(--wh-indigo-400)",
          "500": "var(--wh-indigo-500)",
          "600": "var(--wh-indigo-600)",
          "700": "var(--wh-indigo-700)",
          "800": "var(--wh-indigo-800)",
          "900": "var(--wh-indigo-900)",
          "950": "var(--wh-indigo-950)"
        },
        "cyan": {
          "50": "var(--wh-cyan-50)",
          "100": "var(--wh-cyan-100)",
          "200": "var(--wh-cyan-200)",
          "300": "var(--wh-cyan-300)",
          "400": "var(--wh-cyan-400)",
          "500": "var(--wh-cyan-500)",
          "600": "var(--wh-cyan-600)",
          "700": "var(--wh-cyan-700)",
          "800": "var(--wh-cyan-800)",
          "900": "var(--wh-cyan-900)",
          "950": "var(--wh-cyan-950)"
        },
        "teal": {
          "50": "var(--wh-teal-50)",
          "100": "var(--wh-teal-100)",
          "200": "var(--wh-teal-200)",
          "300": "var(--wh-teal-300)",
          "400": "var(--wh-teal-400)",
          "500": "var(--wh-teal-500)",
          "600": "var(--wh-teal-600)",
          "700": "var(--wh-teal-700)",
          "800": "var(--wh-teal-800)",
          "900": "var(--wh-teal-900)",
          "950": "var(--wh-teal-950)"
        },
        "neutral": {
          "50": "var(--wh-neutral-50)",
          "100": "var(--wh-neutral-100)",
          "200": "var(--wh-neutral-200)",
          "300": "var(--wh-neutral-300)",
          "400": "var(--wh-neutral-400)",
          "500": "var(--wh-neutral-500)",
          "600": "var(--wh-neutral-600)",
          "700": "var(--wh-neutral-700)",
          "800": "var(--wh-neutral-800)",
          "900": "var(--wh-neutral-900)",
          "950": "var(--wh-neutral-950)"
        },
        "green": {
          "50": "var(--wh-green-50)",
          "100": "var(--wh-green-100)",
          "200": "var(--wh-green-200)",
          "300": "var(--wh-green-300)",
          "400": "var(--wh-green-400)",
          "500": "var(--wh-green-500)",
          "600": "var(--wh-green-600)",
          "700": "var(--wh-green-700)",
          "800": "var(--wh-green-800)",
          "900": "var(--wh-green-900)",
          "950": "var(--wh-green-950)"
        },
        "amber": {
          "50": "var(--wh-amber-50)",
          "100": "var(--wh-amber-100)",
          "200": "var(--wh-amber-200)",
          "300": "var(--wh-amber-300)",
          "400": "var(--wh-amber-400)",
          "500": "var(--wh-amber-500)",
          "600": "var(--wh-amber-600)",
          "700": "var(--wh-amber-700)",
          "800": "var(--wh-amber-800)",
          "900": "var(--wh-amber-900)",
          "950": "var(--wh-amber-950)"
        },
        "red": {
          "50": "var(--wh-red-50)",
          "100": "var(--wh-red-100)",
          "200": "var(--wh-red-200)",
          "300": "var(--wh-red-300)",
          "400": "var(--wh-red-400)",
          "500": "var(--wh-red-500)",
          "600": "var(--wh-red-600)",
          "700": "var(--wh-red-700)",
          "800": "var(--wh-red-800)",
          "900": "var(--wh-red-900)",
          "950": "var(--wh-red-950)"
        },
        "purple": {
          "50": "var(--wh-purple-50)",
          "100": "var(--wh-purple-100)",
          "200": "var(--wh-purple-200)",
          "300": "var(--wh-purple-300)",
          "400": "var(--wh-purple-400)",
          "500": "var(--wh-purple-500)",
          "600": "var(--wh-purple-600)",
          "700": "var(--wh-purple-700)",
          "800": "var(--wh-purple-800)",
          "900": "var(--wh-purple-900)",
          "950": "var(--wh-purple-950)"
        },
        "pink": {
          "50": "var(--wh-pink-50)",
          "100": "var(--wh-pink-100)",
          "200": "var(--wh-pink-200)",
          "300": "var(--wh-pink-300)",
          "400": "var(--wh-pink-400)",
          "500": "var(--wh-pink-500)",
          "600": "var(--wh-pink-600)",
          "700": "var(--wh-pink-700)",
          "800": "var(--wh-pink-800)",
          "900": "var(--wh-pink-900)",
          "950": "var(--wh-pink-950)"
        }
      },
      "spacing": {
        "0": "var(--wh-space-0)",
        "1": "var(--wh-space-1)",
        "2": "var(--wh-space-2)",
        "3": "var(--wh-space-3)",
        "4": "var(--wh-space-4)",
        "5": "var(--wh-space-5)",
        "6": "var(--wh-space-6)",
        "8": "var(--wh-space-8)",
        "10": "var(--wh-space-10)",
        "12": "var(--wh-space-12)",
        "16": "var(--wh-space-16)",
        "20": "var(--wh-space-20)",
        "24": "var(--wh-space-24)",
        "32": "var(--wh-space-32)",
        "px": "var(--wh-space-px)",
        "0.5": "var(--wh-space-0-5)",
        "1.5": "var(--wh-space-1-5)"
      },
      "borderRadius": {
        "none": "var(--wh-radius-none)",
        "xs": "var(--wh-radius-xs)",
        "sm": "var(--wh-radius-sm)",
        "md": "var(--wh-radius-md)",
        "lg": "var(--wh-radius-lg)",
        "xl": "var(--wh-radius-xl)",
        "2xl": "var(--wh-radius-2xl)",
        "full": "var(--wh-radius-full)"
      },
      "boxShadow": {
        "xs": "var(--wh-shadow-xs)",
        "sm": "var(--wh-shadow-sm)",
        "md": "var(--wh-shadow-md)",
        "lg": "var(--wh-shadow-lg)",
        "xl": "var(--wh-shadow-xl)",
        "inner": "var(--wh-shadow-inner)",
        "brand": "var(--wh-shadow-brand)"
      },
      "fontFamily": {
        "sans": "var(--wh-font-family-sans)",
        "mono": "var(--wh-font-family-mono)",
        "display": "var(--wh-font-family-display)"
      },
      "fontSize": {
        "2xs": "var(--wh-font-size-2xs)",
        "xs": "var(--wh-font-size-xs)",
        "sm": "var(--wh-font-size-sm)",
        "md": "var(--wh-font-size-md)",
        "lg": "var(--wh-font-size-lg)",
        "xl": "var(--wh-font-size-xl)",
        "2xl": "var(--wh-font-size-2xl)",
        "3xl": "var(--wh-font-size-3xl)",
        "4xl": "var(--wh-font-size-4xl)",
        "5xl": "var(--wh-font-size-5xl)",
        "6xl": "var(--wh-font-size-6xl)"
      },
      "lineHeight": {
        "none": "var(--wh-font-line-height-none)",
        "tight": "var(--wh-font-line-height-tight)",
        "snug": "var(--wh-font-line-height-snug)",
        "normal": "var(--wh-font-line-height-normal)",
        "relaxed": "var(--wh-font-line-height-relaxed)",
        "loose": "var(--wh-font-line-height-loose)"
      },
      "letterSpacing": {
        "tighter": "var(--wh-font-letter-spacing-tighter)",
        "tight": "var(--wh-font-letter-spacing-tight)",
        "snug": "var(--wh-font-letter-spacing-snug)",
        "normal": "var(--wh-font-letter-spacing-normal)",
        "wide": "var(--wh-font-letter-spacing-wide)"
      },
      "fontWeight": {
        "regular": "var(--wh-font-weight-regular)",
        "medium": "var(--wh-font-weight-medium)",
        "semibold": "var(--wh-font-weight-semibold)",
        "bold": "var(--wh-font-weight-bold)"
      },
      "zIndex": {
        "hide": "var(--wh-z-index-hide)",
        "base": "var(--wh-z-index-base)",
        "raised": "var(--wh-z-index-raised)",
        "dropdown": "var(--wh-z-index-dropdown)",
        "sticky": "var(--wh-z-index-sticky)",
        "overlay": "var(--wh-z-index-overlay)",
        "modal": "var(--wh-z-index-modal)",
        "popover": "var(--wh-z-index-popover)",
        "toast": "var(--wh-z-index-toast)",
        "tooltip": "var(--wh-z-index-tooltip)"
      },
      "transitionDuration": {
        "instant": "var(--wh-motion-duration-instant)",
        "fast": "var(--wh-motion-duration-fast)",
        "normal": "var(--wh-motion-duration-normal)",
        "slow": "var(--wh-motion-duration-slow)",
        "slower": "var(--wh-motion-duration-slower)",
        "skeleton-cycle": "var(--wh-motion-duration-skeleton-cycle)"
      },
      "transitionTimingFunction": {
        "standard": "var(--wh-motion-easing-standard)",
        "decelerate": "var(--wh-motion-easing-decelerate)",
        "accelerate": "var(--wh-motion-easing-accelerate)",
        "spring": "var(--wh-motion-easing-spring)",
        "linear": "var(--wh-motion-easing-linear)"
      },
      "maxWidth": {
        "container-sm": "var(--wh-size-container-sm)",
        "container-md": "var(--wh-size-container-md)",
        "container-lg": "var(--wh-size-container-lg)",
        "container-xl": "var(--wh-size-container-xl)",
        "container-2xl": "var(--wh-size-container-2xl)",
        "container-prose": "var(--wh-size-container-prose)"
      },
      "height": {
        "control-xs": "var(--wh-size-control-xs)",
        "control-sm": "var(--wh-size-control-sm)",
        "control-md": "var(--wh-size-control-md)",
        "control-lg": "var(--wh-size-control-lg)",
        "control-xl": "var(--wh-size-control-xl)"
      },
      "width": {
        "icon-xs": "var(--wh-size-icon-xs)",
        "icon-sm": "var(--wh-size-icon-sm)",
        "icon-md": "var(--wh-size-icon-md)",
        "icon-lg": "var(--wh-size-icon-lg)",
        "icon-xl": "var(--wh-size-icon-xl)",
        "icon-2xl": "var(--wh-size-icon-2xl)"
      }
    },
    "screens": {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px"
    }
  }
};
