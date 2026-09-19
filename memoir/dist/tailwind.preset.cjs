// winterholic-base Tailwind preset · 자동 생성
// tailwind.config: { presets: [require('winterholic-base/dist/tailwind.preset.cjs')] }
// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드해야 한다. 다크모드는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": "var(--mm-color-surface-default)",
        "text": {
          "primary": "var(--mm-color-text-primary)",
          "secondary": "var(--mm-color-text-secondary)",
          "tertiary": "var(--mm-color-text-tertiary)",
          "placeholder": "var(--mm-color-text-placeholder)",
          "disabled": "var(--mm-color-text-disabled)",
          "inverse": "var(--mm-color-text-inverse)",
          "on-brand": "var(--mm-color-text-on-brand)",
          "on-pink": "var(--mm-color-text-on-pink)",
          "on-interactive": "var(--mm-color-text-on-interactive)",
          "brand": "var(--mm-color-text-brand)",
          "link": "var(--mm-color-text-link)",
          "link-hover": "var(--mm-color-text-link-hover)",
          "success": "var(--mm-color-text-success)",
          "warning": "var(--mm-color-text-warning)",
          "danger": "var(--mm-color-text-danger)",
          "info": "var(--mm-color-text-info)"
        },
        "border": {
          "ghost": "var(--mm-color-border-ghost)",
          "subtle": "var(--mm-color-border-subtle)",
          "default": "var(--mm-color-border-default)",
          "strong": "var(--mm-color-border-strong)",
          "input-strict": "var(--mm-color-border-input-strict)",
          "brand": "var(--mm-color-border-brand)",
          "interactive": "var(--mm-color-border-interactive)",
          "focus": "var(--mm-color-border-focus)",
          "danger": "var(--mm-color-border-danger)",
          "inverse": "var(--mm-color-border-inverse)"
        },
        "action": {
          "primary": {
            "bg": "var(--mm-color-action-primary-bg)",
            "bg-hover": "var(--mm-color-action-primary-bg-hover)",
            "bg-active": "var(--mm-color-action-primary-bg-active)",
            "text": "var(--mm-color-action-primary-text)"
          },
          "secondary": {
            "bg": "var(--mm-color-action-secondary-bg)",
            "bg-hover": "var(--mm-color-action-secondary-bg-hover)",
            "bg-active": "var(--mm-color-action-secondary-bg-active)",
            "border": "var(--mm-color-action-secondary-border)",
            "text": "var(--mm-color-action-secondary-text)"
          },
          "ghost": {
            "bg": "var(--mm-color-action-ghost-bg)",
            "bg-hover": "var(--mm-color-action-ghost-bg-hover)",
            "bg-active": "var(--mm-color-action-ghost-bg-active)",
            "text": "var(--mm-color-action-ghost-text)"
          },
          "interactive": {
            "bg": "var(--mm-color-action-interactive-bg)",
            "bg-hover": "var(--mm-color-action-interactive-bg-hover)",
            "bg-active": "var(--mm-color-action-interactive-bg-active)",
            "text": "var(--mm-color-action-interactive-text)"
          },
          "danger": {
            "bg": "var(--mm-color-action-danger-bg)",
            "bg-hover": "var(--mm-color-action-danger-bg-hover)",
            "bg-active": "var(--mm-color-action-danger-bg-active)",
            "text": "var(--mm-color-action-danger-text)"
          },
          "danger-ghost": {
            "bg": "var(--mm-color-action-danger-ghost-bg)",
            "bg-hover": "var(--mm-color-action-danger-ghost-bg-hover)",
            "text": "var(--mm-color-action-danger-ghost-text)"
          },
          "disabled": {
            "bg": "var(--mm-color-action-disabled-bg)",
            "text": "var(--mm-color-action-disabled-text)",
            "border": "var(--mm-color-action-disabled-border)"
          }
        },
        "chip": {
          "bg": "var(--mm-color-chip-bg)",
          "text": "var(--mm-color-chip-text)",
          "bg-hover": "var(--mm-color-chip-bg-hover)",
          "bg-active": "var(--mm-color-chip-bg-active)",
          "text-active": "var(--mm-color-chip-text-active)",
          "tag-bg": "var(--mm-color-chip-tag-bg)",
          "tag-text": "var(--mm-color-chip-tag-text)",
          "all-bg": "var(--mm-color-chip-all-bg)",
          "all-text": "var(--mm-color-chip-all-text)"
        },
        "status": {
          "success": {
            "bg": "var(--mm-color-status-success-bg)",
            "border": "var(--mm-color-status-success-border)",
            "text": "var(--mm-color-status-success-text)",
            "icon": "var(--mm-color-status-success-icon)",
            "solid": "var(--mm-color-status-success-solid)",
            "on-solid": "var(--mm-color-status-success-on-solid)"
          },
          "warning": {
            "bg": "var(--mm-color-status-warning-bg)",
            "border": "var(--mm-color-status-warning-border)",
            "text": "var(--mm-color-status-warning-text)",
            "icon": "var(--mm-color-status-warning-icon)",
            "solid": "var(--mm-color-status-warning-solid)",
            "on-solid": "var(--mm-color-status-warning-on-solid)"
          },
          "danger": {
            "bg": "var(--mm-color-status-danger-bg)",
            "border": "var(--mm-color-status-danger-border)",
            "text": "var(--mm-color-status-danger-text)",
            "icon": "var(--mm-color-status-danger-icon)",
            "solid": "var(--mm-color-status-danger-solid)",
            "on-solid": "var(--mm-color-status-danger-on-solid)"
          },
          "info": {
            "bg": "var(--mm-color-status-info-bg)",
            "border": "var(--mm-color-status-info-border)",
            "text": "var(--mm-color-status-info-text)",
            "icon": "var(--mm-color-status-info-icon)",
            "solid": "var(--mm-color-status-info-solid)",
            "on-solid": "var(--mm-color-status-info-on-solid)"
          },
          "secure": {
            "bg": "var(--mm-color-status-secure-bg)",
            "border": "var(--mm-color-status-secure-border)",
            "text": "var(--mm-color-status-secure-text)",
            "icon": "var(--mm-color-status-secure-icon)",
            "solid": "var(--mm-color-status-secure-solid)",
            "on-solid": "var(--mm-color-status-secure-on-solid)"
          },
          "neutral": {
            "bg": "var(--mm-color-status-neutral-bg)",
            "border": "var(--mm-color-status-neutral-border)",
            "text": "var(--mm-color-status-neutral-text)",
            "icon": "var(--mm-color-status-neutral-icon)",
            "solid": "var(--mm-color-status-neutral-solid)",
            "on-solid": "var(--mm-color-status-neutral-on-solid)"
          }
        },
        "interactive": {
          "focus-ring": "var(--mm-color-interactive-focus-ring)",
          "selected-bg": "var(--mm-color-interactive-selected-bg)",
          "selected-border": "var(--mm-color-interactive-selected-border)",
          "selected-text": "var(--mm-color-interactive-selected-text)",
          "hover-overlay": "var(--mm-color-interactive-hover-overlay)",
          "pressed-overlay": "var(--mm-color-interactive-pressed-overlay)",
          "row-hover": "var(--mm-color-interactive-row-hover)"
        },
        "category": {
          "dashboard": "var(--mm-color-category-dashboard)",
          "calendar": "var(--mm-color-category-calendar)",
          "general": "var(--mm-color-category-general)",
          "simple": "var(--mm-color-category-simple)",
          "code": "var(--mm-color-category-code)",
          "command": "var(--mm-color-category-command)",
          "bookmark": "var(--mm-color-category-bookmark)",
          "video": "var(--mm-color-category-video)",
          "secure": "var(--mm-color-category-secure)",
          "private": "var(--mm-color-category-private)"
        },
        "code": {
          "bg": "var(--mm-color-code-bg)",
          "text": "var(--mm-color-code-text)",
          "comment": "var(--mm-color-code-comment)",
          "keyword": "var(--mm-color-code-keyword)",
          "string": "var(--mm-color-code-string)",
          "number": "var(--mm-color-code-number)",
          "function": "var(--mm-color-code-function)",
          "gutter": "var(--mm-color-code-gutter)",
          "line-highlight": "var(--mm-color-code-line-highlight)",
          "inline-bg": "var(--mm-color-code-inline-bg)",
          "inline-text": "var(--mm-color-code-inline-text)"
        },
        "chart": {
          "categorical": {
            "1": "var(--mm-color-chart-categorical-1)",
            "2": "var(--mm-color-chart-categorical-2)",
            "3": "var(--mm-color-chart-categorical-3)",
            "4": "var(--mm-color-chart-categorical-4)",
            "5": "var(--mm-color-chart-categorical-5)"
          },
          "grid": "var(--mm-color-chart-grid)",
          "axis": "var(--mm-color-chart-axis)",
          "label": "var(--mm-color-chart-label)",
          "heat": {
            "0": "var(--mm-color-chart-heat-0)",
            "1": "var(--mm-color-chart-heat-1)",
            "2": "var(--mm-color-chart-heat-2)",
            "3": "var(--mm-color-chart-heat-3)",
            "4": "var(--mm-color-chart-heat-4)"
          }
        },
        "pink": {
          "50": "var(--mm-pink-50)",
          "100": "var(--mm-pink-100)",
          "200": "var(--mm-pink-200)",
          "300": "var(--mm-pink-300)",
          "400": "var(--mm-pink-400)",
          "500": "var(--mm-pink-500)",
          "600": "var(--mm-pink-600)",
          "700": "var(--mm-pink-700)",
          "800": "var(--mm-pink-800)",
          "900": "var(--mm-pink-900)",
          "950": "var(--mm-pink-950)"
        },
        "blue": {
          "50": "var(--mm-blue-50)",
          "100": "var(--mm-blue-100)",
          "200": "var(--mm-blue-200)",
          "300": "var(--mm-blue-300)",
          "400": "var(--mm-blue-400)",
          "500": "var(--mm-blue-500)",
          "600": "var(--mm-blue-600)",
          "700": "var(--mm-blue-700)",
          "800": "var(--mm-blue-800)",
          "900": "var(--mm-blue-900)",
          "950": "var(--mm-blue-950)"
        },
        "neutral": {
          "50": "var(--mm-neutral-50)",
          "100": "var(--mm-neutral-100)",
          "200": "var(--mm-neutral-200)",
          "300": "var(--mm-neutral-300)",
          "400": "var(--mm-neutral-400)",
          "500": "var(--mm-neutral-500)",
          "600": "var(--mm-neutral-600)",
          "700": "var(--mm-neutral-700)",
          "800": "var(--mm-neutral-800)",
          "900": "var(--mm-neutral-900)",
          "950": "var(--mm-neutral-950)"
        },
        "red": {
          "50": "var(--mm-red-50)",
          "100": "var(--mm-red-100)",
          "200": "var(--mm-red-200)",
          "300": "var(--mm-red-300)",
          "400": "var(--mm-red-400)",
          "500": "var(--mm-red-500)",
          "600": "var(--mm-red-600)",
          "700": "var(--mm-red-700)",
          "800": "var(--mm-red-800)",
          "900": "var(--mm-red-900)",
          "950": "var(--mm-red-950)"
        },
        "green": {
          "50": "var(--mm-green-50)",
          "100": "var(--mm-green-100)",
          "200": "var(--mm-green-200)",
          "300": "var(--mm-green-300)",
          "400": "var(--mm-green-400)",
          "500": "var(--mm-green-500)",
          "600": "var(--mm-green-600)",
          "700": "var(--mm-green-700)",
          "800": "var(--mm-green-800)",
          "900": "var(--mm-green-900)",
          "950": "var(--mm-green-950)"
        },
        "amber": {
          "50": "var(--mm-amber-50)",
          "100": "var(--mm-amber-100)",
          "200": "var(--mm-amber-200)",
          "300": "var(--mm-amber-300)",
          "400": "var(--mm-amber-400)",
          "500": "var(--mm-amber-500)",
          "600": "var(--mm-amber-600)",
          "700": "var(--mm-amber-700)",
          "800": "var(--mm-amber-800)",
          "900": "var(--mm-amber-900)",
          "950": "var(--mm-amber-950)"
        },
        "primary": "var(--mm-brand-pink)",
        "primary-dark": "var(--mm-brand-rose)",
        "secondary": "var(--mm-brand-periwinkle)",
        "secondary-dark": "var(--mm-brand-indigo)",
        "on-surface": "var(--mm-color-text-primary)",
        "surface-low": "var(--mm-color-surface-canvas)",
        "sub-pink": "var(--mm-color-surface-blush)",
        "sub-cream": "var(--mm-color-surface-cream)"
      },
      "spacing": {
        "0": "var(--mm-space-0)",
        "1": "var(--mm-space-1)",
        "2": "var(--mm-space-2)",
        "3": "var(--mm-space-3)",
        "4": "var(--mm-space-4)",
        "5": "var(--mm-space-5)",
        "6": "var(--mm-space-6)",
        "8": "var(--mm-space-8)",
        "10": "var(--mm-space-10)",
        "12": "var(--mm-space-12)",
        "16": "var(--mm-space-16)",
        "20": "var(--mm-space-20)",
        "24": "var(--mm-space-24)",
        "px": "var(--mm-space-px)",
        "0.5": "var(--mm-space-0-5)",
        "1.5": "var(--mm-space-1-5)"
      },
      "borderRadius": {
        "none": "var(--mm-radius-none)",
        "xs": "var(--mm-radius-xs)",
        "sm": "var(--mm-radius-sm)",
        "md": "var(--mm-radius-md)",
        "lg": "var(--mm-radius-lg)",
        "xl": "var(--mm-radius-xl)",
        "2xl": "var(--mm-radius-2xl)",
        "full": "var(--mm-radius-full)"
      },
      "boxShadow": {
        "none": "var(--mm-shadow-none)",
        "soft": "var(--mm-shadow-soft)",
        "ambient": "var(--mm-shadow-ambient)",
        "modal": "var(--mm-shadow-modal)",
        "inner": "var(--mm-shadow-inner)",
        "focus": "var(--mm-shadow-focus)"
      },
      "fontFamily": {
        "sans": "var(--mm-font-family-sans)",
        "mono": "var(--mm-font-family-mono)",
        "display": "var(--mm-font-family-display)"
      },
      "fontSize": {
        "2xs": "var(--mm-font-size-2xs)",
        "xs": "var(--mm-font-size-xs)",
        "sm": "var(--mm-font-size-sm)",
        "md": "var(--mm-font-size-md)",
        "lg": "var(--mm-font-size-lg)",
        "xl": "var(--mm-font-size-xl)",
        "2xl": "var(--mm-font-size-2xl)",
        "3xl": "var(--mm-font-size-3xl)",
        "4xl": "var(--mm-font-size-4xl)",
        "5xl": "var(--mm-font-size-5xl)",
        "6xl": "var(--mm-font-size-6xl)"
      },
      "lineHeight": {
        "none": "var(--mm-font-line-height-none)",
        "tight": "var(--mm-font-line-height-tight)",
        "snug": "var(--mm-font-line-height-snug)",
        "normal": "var(--mm-font-line-height-normal)",
        "relaxed": "var(--mm-font-line-height-relaxed)",
        "loose": "var(--mm-font-line-height-loose)"
      },
      "letterSpacing": {
        "tighter": "var(--mm-font-letter-spacing-tighter)",
        "tight": "var(--mm-font-letter-spacing-tight)",
        "snug": "var(--mm-font-letter-spacing-snug)",
        "normal": "var(--mm-font-letter-spacing-normal)",
        "wide": "var(--mm-font-letter-spacing-wide)"
      },
      "fontWeight": {
        "regular": "var(--mm-font-weight-regular)",
        "medium": "var(--mm-font-weight-medium)",
        "semibold": "var(--mm-font-weight-semibold)",
        "bold": "var(--mm-font-weight-bold)",
        "extrabold": "var(--mm-font-weight-extrabold)"
      },
      "zIndex": {
        "hide": "var(--mm-z-index-hide)",
        "base": "var(--mm-z-index-base)",
        "raised": "var(--mm-z-index-raised)",
        "fab": "var(--mm-z-index-fab)",
        "dropdown": "var(--mm-z-index-dropdown)",
        "sticky": "var(--mm-z-index-sticky)",
        "overlay": "var(--mm-z-index-overlay)",
        "modal": "var(--mm-z-index-modal)",
        "popover": "var(--mm-z-index-popover)",
        "toast": "var(--mm-z-index-toast)",
        "tooltip": "var(--mm-z-index-tooltip)"
      },
      "transitionDuration": {
        "instant": "var(--mm-motion-duration-instant)",
        "fast": "var(--mm-motion-duration-fast)",
        "normal": "var(--mm-motion-duration-normal)",
        "slide": "var(--mm-motion-duration-slide)",
        "slow": "var(--mm-motion-duration-slow)",
        "shake": "var(--mm-motion-duration-shake)",
        "lock": "var(--mm-motion-duration-lock)",
        "skeleton-cycle": "var(--mm-motion-duration-skeleton-cycle)",
        "toast": "var(--mm-motion-duration-toast)",
        "blob": "var(--mm-motion-duration-blob)"
      },
      "transitionTimingFunction": {
        "out": "var(--mm-motion-easing-out)",
        "in-out": "var(--mm-motion-easing-in-out)",
        "in": "var(--mm-motion-easing-in)",
        "ease": "var(--mm-motion-easing-ease)",
        "linear": "var(--mm-motion-easing-linear)"
      },
      "maxWidth": {
        "container-sm": "var(--mm-size-container-sm)",
        "container-md": "var(--mm-size-container-md)",
        "container-lg": "var(--mm-size-container-lg)",
        "container-xl": "var(--mm-size-container-xl)",
        "container-full": "var(--mm-size-container-full)",
        "container-prose": "var(--mm-size-container-prose)"
      },
      "height": {
        "control-xs": "var(--mm-size-control-xs)",
        "control-sm": "var(--mm-size-control-sm)",
        "control-md": "var(--mm-size-control-md)",
        "control-lg": "var(--mm-size-control-lg)",
        "control-xl": "var(--mm-size-control-xl)"
      },
      "width": {
        "icon-xs": "var(--mm-size-icon-xs)",
        "icon-sm": "var(--mm-size-icon-sm)",
        "icon-md": "var(--mm-size-icon-md)",
        "icon-lg": "var(--mm-size-icon-lg)",
        "icon-xl": "var(--mm-size-icon-xl)",
        "icon-2xl": "var(--mm-size-icon-2xl)"
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
