// merrivoo Tailwind preset · 자동 생성
// tailwind.config: { presets: [require('merrivoo/dist/tailwind.preset.cjs')] }
// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드해야 한다. 다크모드는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": {
          "canvas": "var(--mv-color-surface-canvas)",
          "default": "var(--mv-color-surface-default)",
          "raised": "var(--mv-color-surface-raised)",
          "sunken": "var(--mv-color-surface-sunken)",
          "overlay": "var(--mv-color-surface-overlay)",
          "inverse": "var(--mv-color-surface-inverse)",
          "brand": "var(--mv-color-surface-brand)",
          "brand-subtle": "var(--mv-color-surface-brand-subtle)",
          "disabled": "var(--mv-color-surface-disabled)",
          "glass": "var(--mv-color-surface-glass)"
        },
        "text": {
          "primary": "var(--mv-color-text-primary)",
          "secondary": "var(--mv-color-text-secondary)",
          "tertiary": "var(--mv-color-text-tertiary)",
          "placeholder": "var(--mv-color-text-placeholder)",
          "disabled": "var(--mv-color-text-disabled)",
          "inverse": "var(--mv-color-text-inverse)",
          "on-brand": "var(--mv-color-text-on-brand)",
          "brand": "var(--mv-color-text-brand)",
          "link": "var(--mv-color-text-link)",
          "link-hover": "var(--mv-color-text-link-hover)",
          "success": "var(--mv-color-text-success)",
          "warning": "var(--mv-color-text-warning)",
          "danger": "var(--mv-color-text-danger)",
          "info": "var(--mv-color-text-info)"
        },
        "border": {
          "subtle": "var(--mv-color-border-subtle)",
          "default": "var(--mv-color-border-default)",
          "strong": "var(--mv-color-border-strong)",
          "input-strict": "var(--mv-color-border-input-strict)",
          "brand": "var(--mv-color-border-brand)",
          "focus": "var(--mv-color-border-focus)",
          "danger": "var(--mv-color-border-danger)",
          "inverse": "var(--mv-color-border-inverse)",
          "gold": "var(--mv-color-border-gold)"
        },
        "action": {
          "primary": {
            "bg": "var(--mv-color-action-primary-bg)",
            "bg-hover": "var(--mv-color-action-primary-bg-hover)",
            "bg-active": "var(--mv-color-action-primary-bg-active)",
            "text": "var(--mv-color-action-primary-text)"
          },
          "secondary": {
            "bg": "var(--mv-color-action-secondary-bg)",
            "bg-hover": "var(--mv-color-action-secondary-bg-hover)",
            "bg-active": "var(--mv-color-action-secondary-bg-active)",
            "border": "var(--mv-color-action-secondary-border)",
            "text": "var(--mv-color-action-secondary-text)"
          },
          "ghost": {
            "bg": "var(--mv-color-action-ghost-bg)",
            "bg-hover": "var(--mv-color-action-ghost-bg-hover)",
            "bg-active": "var(--mv-color-action-ghost-bg-active)",
            "text": "var(--mv-color-action-ghost-text)"
          },
          "danger": {
            "bg": "var(--mv-color-action-danger-bg)",
            "bg-hover": "var(--mv-color-action-danger-bg-hover)",
            "bg-active": "var(--mv-color-action-danger-bg-active)",
            "text": "var(--mv-color-action-danger-text)"
          },
          "disabled": {
            "bg": "var(--mv-color-action-disabled-bg)",
            "text": "var(--mv-color-action-disabled-text)",
            "border": "var(--mv-color-action-disabled-border)"
          }
        },
        "status": {
          "success": {
            "bg": "var(--mv-color-status-success-bg)",
            "border": "var(--mv-color-status-success-border)",
            "text": "var(--mv-color-status-success-text)",
            "icon": "var(--mv-color-status-success-icon)",
            "solid": "var(--mv-color-status-success-solid)",
            "on-solid": "var(--mv-color-status-success-on-solid)"
          },
          "warning": {
            "bg": "var(--mv-color-status-warning-bg)",
            "border": "var(--mv-color-status-warning-border)",
            "text": "var(--mv-color-status-warning-text)",
            "icon": "var(--mv-color-status-warning-icon)",
            "solid": "var(--mv-color-status-warning-solid)",
            "on-solid": "var(--mv-color-status-warning-on-solid)"
          },
          "danger": {
            "bg": "var(--mv-color-status-danger-bg)",
            "border": "var(--mv-color-status-danger-border)",
            "text": "var(--mv-color-status-danger-text)",
            "icon": "var(--mv-color-status-danger-icon)",
            "solid": "var(--mv-color-status-danger-solid)",
            "on-solid": "var(--mv-color-status-danger-on-solid)"
          },
          "info": {
            "bg": "var(--mv-color-status-info-bg)",
            "border": "var(--mv-color-status-info-border)",
            "text": "var(--mv-color-status-info-text)",
            "icon": "var(--mv-color-status-info-icon)",
            "solid": "var(--mv-color-status-info-solid)",
            "on-solid": "var(--mv-color-status-info-on-solid)"
          },
          "neutral": {
            "bg": "var(--mv-color-status-neutral-bg)",
            "border": "var(--mv-color-status-neutral-border)",
            "text": "var(--mv-color-status-neutral-text)",
            "icon": "var(--mv-color-status-neutral-icon)",
            "solid": "var(--mv-color-status-neutral-solid)",
            "on-solid": "var(--mv-color-status-neutral-on-solid)"
          }
        },
        "interactive": {
          "focus-ring": "var(--mv-color-interactive-focus-ring)",
          "selected-bg": "var(--mv-color-interactive-selected-bg)",
          "selected-border": "var(--mv-color-interactive-selected-border)",
          "selected-text": "var(--mv-color-interactive-selected-text)",
          "hover-overlay": "var(--mv-color-interactive-hover-overlay)",
          "pressed-overlay": "var(--mv-color-interactive-pressed-overlay)"
        },
        "accent": {
          "gold": "var(--mv-color-accent-gold)",
          "burgundy": "var(--mv-color-accent-burgundy)",
          "fir": "var(--mv-color-accent-fir)",
          "indigo": "var(--mv-color-accent-indigo)",
          "snow": "var(--mv-color-accent-snow)"
        },
        "scene": {
          "scrim-top": "var(--mv-color-scene-scrim-top)",
          "scrim-bottom": "var(--mv-color-scene-scrim-bottom)",
          "glow": "var(--mv-color-scene-glow)",
          "ground-shadow": "var(--mv-color-scene-ground-shadow)",
          "hit-ring": "var(--mv-color-scene-hit-ring)",
          "tint": "var(--mv-color-scene-tint)"
        },
        "burgundy": {
          "50": "var(--mv-burgundy-50)",
          "100": "var(--mv-burgundy-100)",
          "200": "var(--mv-burgundy-200)",
          "300": "var(--mv-burgundy-300)",
          "400": "var(--mv-burgundy-400)",
          "500": "var(--mv-burgundy-500)",
          "600": "var(--mv-burgundy-600)",
          "700": "var(--mv-burgundy-700)",
          "800": "var(--mv-burgundy-800)",
          "900": "var(--mv-burgundy-900)",
          "950": "var(--mv-burgundy-950)"
        },
        "gold": {
          "50": "var(--mv-gold-50)",
          "100": "var(--mv-gold-100)",
          "200": "var(--mv-gold-200)",
          "300": "var(--mv-gold-300)",
          "400": "var(--mv-gold-400)",
          "500": "var(--mv-gold-500)",
          "600": "var(--mv-gold-600)",
          "700": "var(--mv-gold-700)",
          "800": "var(--mv-gold-800)",
          "900": "var(--mv-gold-900)",
          "950": "var(--mv-gold-950)"
        },
        "sand": {
          "50": "var(--mv-sand-50)",
          "100": "var(--mv-sand-100)",
          "200": "var(--mv-sand-200)",
          "300": "var(--mv-sand-300)",
          "400": "var(--mv-sand-400)",
          "500": "var(--mv-sand-500)",
          "600": "var(--mv-sand-600)",
          "700": "var(--mv-sand-700)",
          "800": "var(--mv-sand-800)",
          "900": "var(--mv-sand-900)",
          "950": "var(--mv-sand-950)"
        },
        "fir": {
          "50": "var(--mv-fir-50)",
          "100": "var(--mv-fir-100)",
          "200": "var(--mv-fir-200)",
          "300": "var(--mv-fir-300)",
          "400": "var(--mv-fir-400)",
          "500": "var(--mv-fir-500)",
          "600": "var(--mv-fir-600)",
          "700": "var(--mv-fir-700)",
          "800": "var(--mv-fir-800)",
          "900": "var(--mv-fir-900)",
          "950": "var(--mv-fir-950)"
        },
        "indigo": {
          "50": "var(--mv-indigo-50)",
          "100": "var(--mv-indigo-100)",
          "200": "var(--mv-indigo-200)",
          "300": "var(--mv-indigo-300)",
          "400": "var(--mv-indigo-400)",
          "500": "var(--mv-indigo-500)",
          "600": "var(--mv-indigo-600)",
          "700": "var(--mv-indigo-700)",
          "800": "var(--mv-indigo-800)",
          "900": "var(--mv-indigo-900)",
          "950": "var(--mv-indigo-950)"
        },
        "sky": {
          "50": "var(--mv-sky-50)",
          "100": "var(--mv-sky-100)",
          "200": "var(--mv-sky-200)",
          "300": "var(--mv-sky-300)",
          "400": "var(--mv-sky-400)",
          "500": "var(--mv-sky-500)",
          "600": "var(--mv-sky-600)",
          "700": "var(--mv-sky-700)",
          "800": "var(--mv-sky-800)",
          "900": "var(--mv-sky-900)",
          "950": "var(--mv-sky-950)"
        },
        "red": {
          "50": "var(--mv-red-50)",
          "100": "var(--mv-red-100)",
          "200": "var(--mv-red-200)",
          "300": "var(--mv-red-300)",
          "400": "var(--mv-red-400)",
          "500": "var(--mv-red-500)",
          "600": "var(--mv-red-600)",
          "700": "var(--mv-red-700)",
          "800": "var(--mv-red-800)",
          "900": "var(--mv-red-900)",
          "950": "var(--mv-red-950)"
        },
        "amber": {
          "50": "var(--mv-amber-50)",
          "100": "var(--mv-amber-100)",
          "200": "var(--mv-amber-200)",
          "300": "var(--mv-amber-300)",
          "400": "var(--mv-amber-400)",
          "500": "var(--mv-amber-500)",
          "600": "var(--mv-amber-600)",
          "700": "var(--mv-amber-700)",
          "800": "var(--mv-amber-800)",
          "900": "var(--mv-amber-900)",
          "950": "var(--mv-amber-950)"
        }
      },
      "spacing": {
        "0": "var(--mv-space-0)",
        "1": "var(--mv-space-1)",
        "2": "var(--mv-space-2)",
        "3": "var(--mv-space-3)",
        "4": "var(--mv-space-4)",
        "5": "var(--mv-space-5)",
        "6": "var(--mv-space-6)",
        "8": "var(--mv-space-8)",
        "10": "var(--mv-space-10)",
        "12": "var(--mv-space-12)",
        "16": "var(--mv-space-16)",
        "20": "var(--mv-space-20)",
        "px": "var(--mv-space-px)",
        "0.5": "var(--mv-space-0-5)",
        "1.5": "var(--mv-space-1-5)"
      },
      "borderRadius": {
        "none": "var(--mv-radius-none)",
        "xs": "var(--mv-radius-xs)",
        "sm": "var(--mv-radius-sm)",
        "md": "var(--mv-radius-md)",
        "lg": "var(--mv-radius-lg)",
        "xl": "var(--mv-radius-xl)",
        "2xl": "var(--mv-radius-2xl)",
        "full": "var(--mv-radius-full)"
      },
      "boxShadow": {
        "xs": "var(--mv-shadow-xs)",
        "sm": "var(--mv-shadow-sm)",
        "md": "var(--mv-shadow-md)",
        "lg": "var(--mv-shadow-lg)",
        "xl": "var(--mv-shadow-xl)",
        "inner": "var(--mv-shadow-inner)",
        "gold": "var(--mv-shadow-gold)"
      },
      "fontFamily": {
        "sans": "var(--mv-font-family-sans)",
        "mono": "var(--mv-font-family-mono)",
        "display": "var(--mv-font-family-display)"
      },
      "fontSize": {
        "xs": "var(--mv-font-size-xs)",
        "sm": "var(--mv-font-size-sm)",
        "md": "var(--mv-font-size-md)",
        "lg": "var(--mv-font-size-lg)",
        "xl": "var(--mv-font-size-xl)",
        "2xl": "var(--mv-font-size-2xl)",
        "3xl": "var(--mv-font-size-3xl)",
        "4xl": "var(--mv-font-size-4xl)",
        "5xl": "var(--mv-font-size-5xl)",
        "6xl": "var(--mv-font-size-6xl)"
      },
      "lineHeight": {
        "tight": "var(--mv-font-line-height-tight)",
        "snug": "var(--mv-font-line-height-snug)",
        "normal": "var(--mv-font-line-height-normal)",
        "relaxed": "var(--mv-font-line-height-relaxed)"
      },
      "letterSpacing": {
        "tighter": "var(--mv-font-letter-spacing-tighter)",
        "tight": "var(--mv-font-letter-spacing-tight)",
        "normal": "var(--mv-font-letter-spacing-normal)",
        "wide": "var(--mv-font-letter-spacing-wide)"
      },
      "fontWeight": {
        "regular": "var(--mv-font-weight-regular)",
        "medium": "var(--mv-font-weight-medium)",
        "semibold": "var(--mv-font-weight-semibold)",
        "bold": "var(--mv-font-weight-bold)"
      },
      "zIndex": {
        "hide": "var(--mv-z-index-hide)",
        "base": "var(--mv-z-index-base)",
        "scene-background": "var(--mv-z-index-scene-background)",
        "scene-environment": "var(--mv-z-index-scene-environment)",
        "scene-atmosphere": "var(--mv-z-index-scene-atmosphere)",
        "scene-tree": "var(--mv-z-index-scene-tree)",
        "scene-lighting": "var(--mv-z-index-scene-lighting)",
        "scene-ornaments": "var(--mv-z-index-scene-ornaments)",
        "scene-foreground": "var(--mv-z-index-scene-foreground)",
        "scene-fx-top": "var(--mv-z-index-scene-fx-top)",
        "ui": "var(--mv-z-index-ui)",
        "sticky": "var(--mv-z-index-sticky)",
        "sheet": "var(--mv-z-index-sheet)",
        "modal": "var(--mv-z-index-modal)",
        "toast": "var(--mv-z-index-toast)",
        "tooltip": "var(--mv-z-index-tooltip)"
      },
      "transitionDuration": {
        "instant": "var(--mv-motion-duration-instant)",
        "fast": "var(--mv-motion-duration-fast)",
        "normal": "var(--mv-motion-duration-normal)",
        "slow": "var(--mv-motion-duration-slow)",
        "slower": "var(--mv-motion-duration-slower)",
        "scene-enter": "var(--mv-motion-duration-scene-enter)",
        "scene-reveal": "var(--mv-motion-duration-scene-reveal)",
        "twinkle": "var(--mv-motion-duration-twinkle)",
        "skeleton-cycle": "var(--mv-motion-duration-skeleton-cycle)"
      },
      "transitionTimingFunction": {
        "standard": "var(--mv-motion-easing-standard)",
        "decelerate": "var(--mv-motion-easing-decelerate)",
        "accelerate": "var(--mv-motion-easing-accelerate)",
        "spring": "var(--mv-motion-easing-spring)",
        "soft-out": "var(--mv-motion-easing-soft-out)",
        "linear": "var(--mv-motion-easing-linear)"
      },
      "maxWidth": {
        "container-phone": "var(--mv-size-container-phone)",
        "container-tablet": "var(--mv-size-container-tablet)",
        "container-tablet-l": "var(--mv-size-container-tablet-l)"
      },
      "height": {
        "control-xs": "var(--mv-size-control-xs)",
        "control-sm": "var(--mv-size-control-sm)",
        "control-md": "var(--mv-size-control-md)",
        "control-lg": "var(--mv-size-control-lg)",
        "control-xl": "var(--mv-size-control-xl)"
      },
      "width": {
        "icon-xs": "var(--mv-size-icon-xs)",
        "icon-sm": "var(--mv-size-icon-sm)",
        "icon-md": "var(--mv-size-icon-md)",
        "icon-lg": "var(--mv-size-icon-lg)",
        "icon-xl": "var(--mv-size-icon-xl)",
        "icon-2xl": "var(--mv-size-icon-2xl)"
      }
    },
    "screens": {
      "sm": "375px",
      "md": "431px",
      "lg": "600px",
      "xl": "1025px"
    }
  }
};
