// winterholic-base Tailwind preset · 자동 생성
// tailwind.config: { presets: [require('winterholic-base/dist/tailwind.preset.cjs')] }
// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드해야 한다. 다크모드는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": {
          "canvas": "var(--yg-color-surface-canvas)",
          "default": "var(--yg-color-surface-default)",
          "raised": "var(--yg-color-surface-raised)",
          "sunken": "var(--yg-color-surface-sunken)",
          "line": "var(--yg-color-surface-line)",
          "deep": "var(--yg-color-surface-deep)",
          "overlay": "var(--yg-color-surface-overlay)",
          "inverse": "var(--yg-color-surface-inverse)",
          "brand": "var(--yg-color-surface-brand)",
          "brand-subtle": "var(--yg-color-surface-brand-subtle)",
          "disabled": "var(--yg-color-surface-disabled)",
          "stage": "var(--yg-color-surface-stage)"
        },
        "text": {
          "primary": "var(--yg-color-text-primary)",
          "secondary": "var(--yg-color-text-secondary)",
          "tertiary": "var(--yg-color-text-tertiary)",
          "decorative": "var(--yg-color-text-decorative)",
          "placeholder": "var(--yg-color-text-placeholder)",
          "disabled": "var(--yg-color-text-disabled)",
          "inverse": "var(--yg-color-text-inverse)",
          "on-brand": "var(--yg-color-text-on-brand)",
          "brand": "var(--yg-color-text-brand)",
          "link": "var(--yg-color-text-link)",
          "link-hover": "var(--yg-color-text-link-hover)",
          "success": "var(--yg-color-text-success)",
          "warning": "var(--yg-color-text-warning)",
          "danger": "var(--yg-color-text-danger)",
          "info": "var(--yg-color-text-info)"
        },
        "border": {
          "ink": "var(--yg-color-border-ink)",
          "subtle": "var(--yg-color-border-subtle)",
          "default": "var(--yg-color-border-default)",
          "faint": "var(--yg-color-border-faint)",
          "brand": "var(--yg-color-border-brand)",
          "focus": "var(--yg-color-border-focus)",
          "danger": "var(--yg-color-border-danger)",
          "inverse": "var(--yg-color-border-inverse)"
        },
        "action": {
          "primary": {
            "bg": "var(--yg-color-action-primary-bg)",
            "bg-hover": "var(--yg-color-action-primary-bg-hover)",
            "bg-active": "var(--yg-color-action-primary-bg-active)",
            "text": "var(--yg-color-action-primary-text)",
            "border": "var(--yg-color-action-primary-border)",
            "shadow-color": "var(--yg-color-action-primary-shadow-color)"
          },
          "secondary": {
            "bg": "var(--yg-color-action-secondary-bg)",
            "bg-hover": "var(--yg-color-action-secondary-bg-hover)",
            "bg-active": "var(--yg-color-action-secondary-bg-active)",
            "text": "var(--yg-color-action-secondary-text)",
            "border": "var(--yg-color-action-secondary-border)",
            "shadow-color": "var(--yg-color-action-secondary-shadow-color)"
          },
          "ghost": {
            "bg": "var(--yg-color-action-ghost-bg)",
            "bg-hover": "var(--yg-color-action-ghost-bg-hover)",
            "bg-active": "var(--yg-color-action-ghost-bg-active)",
            "text": "var(--yg-color-action-ghost-text)",
            "border": "var(--yg-color-action-ghost-border)",
            "shadow-color": "var(--yg-color-action-ghost-shadow-color)"
          },
          "danger": {
            "bg": "var(--yg-color-action-danger-bg)",
            "bg-hover": "var(--yg-color-action-danger-bg-hover)",
            "bg-active": "var(--yg-color-action-danger-bg-active)",
            "text": "var(--yg-color-action-danger-text)",
            "border": "var(--yg-color-action-danger-border)",
            "shadow-color": "var(--yg-color-action-danger-shadow-color)"
          },
          "disabled": {
            "bg": "var(--yg-color-action-disabled-bg)",
            "text": "var(--yg-color-action-disabled-text)",
            "border": "var(--yg-color-action-disabled-border)",
            "shadow-color": "var(--yg-color-action-disabled-shadow-color)"
          }
        },
        "rarity": {
          "common": {
            "solid": "var(--yg-color-rarity-common-solid)",
            "accent": "var(--yg-color-rarity-common-accent)",
            "text": "var(--yg-color-rarity-common-text)",
            "glow": "var(--yg-color-rarity-common-glow)"
          },
          "rare": {
            "solid": "var(--yg-color-rarity-rare-solid)",
            "accent": "var(--yg-color-rarity-rare-accent)",
            "text": "var(--yg-color-rarity-rare-text)",
            "glow": "var(--yg-color-rarity-rare-glow)"
          },
          "epic": {
            "solid": "var(--yg-color-rarity-epic-solid)",
            "accent": "var(--yg-color-rarity-epic-accent)",
            "text": "var(--yg-color-rarity-epic-text)",
            "glow": "var(--yg-color-rarity-epic-glow)"
          },
          "legend": {
            "solid": "var(--yg-color-rarity-legend-solid)",
            "accent": "var(--yg-color-rarity-legend-accent)",
            "text": "var(--yg-color-rarity-legend-text)",
            "glow": "var(--yg-color-rarity-legend-glow)"
          },
          "unique": {
            "solid": "var(--yg-color-rarity-unique-solid)",
            "accent": "var(--yg-color-rarity-unique-accent)",
            "text": "var(--yg-color-rarity-unique-text)",
            "glow": "var(--yg-color-rarity-unique-glow)"
          },
          "moment": {
            "solid": "var(--yg-color-rarity-moment-solid)",
            "accent": "var(--yg-color-rarity-moment-accent)",
            "text": "var(--yg-color-rarity-moment-text)",
            "glow": "var(--yg-color-rarity-moment-glow)"
          }
        },
        "status": {
          "success": {
            "bg": "var(--yg-color-status-success-bg)",
            "border": "var(--yg-color-status-success-border)",
            "text": "var(--yg-color-status-success-text)",
            "icon": "var(--yg-color-status-success-icon)",
            "solid": "var(--yg-color-status-success-solid)",
            "on-solid": "var(--yg-color-status-success-on-solid)"
          },
          "warning": {
            "bg": "var(--yg-color-status-warning-bg)",
            "border": "var(--yg-color-status-warning-border)",
            "text": "var(--yg-color-status-warning-text)",
            "icon": "var(--yg-color-status-warning-icon)",
            "solid": "var(--yg-color-status-warning-solid)",
            "on-solid": "var(--yg-color-status-warning-on-solid)"
          },
          "danger": {
            "bg": "var(--yg-color-status-danger-bg)",
            "border": "var(--yg-color-status-danger-border)",
            "text": "var(--yg-color-status-danger-text)",
            "icon": "var(--yg-color-status-danger-icon)",
            "solid": "var(--yg-color-status-danger-solid)",
            "on-solid": "var(--yg-color-status-danger-on-solid)"
          },
          "info": {
            "bg": "var(--yg-color-status-info-bg)",
            "border": "var(--yg-color-status-info-border)",
            "text": "var(--yg-color-status-info-text)",
            "icon": "var(--yg-color-status-info-icon)",
            "solid": "var(--yg-color-status-info-solid)",
            "on-solid": "var(--yg-color-status-info-on-solid)"
          },
          "neutral": {
            "bg": "var(--yg-color-status-neutral-bg)",
            "border": "var(--yg-color-status-neutral-border)",
            "text": "var(--yg-color-status-neutral-text)",
            "icon": "var(--yg-color-status-neutral-icon)",
            "solid": "var(--yg-color-status-neutral-solid)",
            "on-solid": "var(--yg-color-status-neutral-on-solid)"
          }
        },
        "chip": {
          "red": "var(--yg-color-chip-red)",
          "blue": "var(--yg-color-chip-blue)",
          "yellow": "var(--yg-color-chip-yellow)",
          "jade": "var(--yg-color-chip-jade)",
          "plum": "var(--yg-color-chip-plum)"
        },
        "interactive": {
          "focus-ring": "var(--yg-color-interactive-focus-ring)",
          "selected-bg": "var(--yg-color-interactive-selected-bg)",
          "selected-border": "var(--yg-color-interactive-selected-border)",
          "selected-text": "var(--yg-color-interactive-selected-text)",
          "hover-overlay": "var(--yg-color-interactive-hover-overlay)",
          "pressed-overlay": "var(--yg-color-interactive-pressed-overlay)",
          "tab-active": "var(--yg-color-interactive-tab-active)",
          "nav-active": "var(--yg-color-interactive-nav-active)"
        },
        "band": {
          "1": "var(--yg-color-band-1)",
          "2": "var(--yg-color-band-2)",
          "3": "var(--yg-color-band-3)",
          "4": "var(--yg-color-band-4)",
          "5": "var(--yg-color-band-5)"
        },
        "fx": {
          "aura-warm": "var(--yg-color-fx-aura-warm)",
          "aura-cold": "var(--yg-color-fx-aura-cold)",
          "foil": "var(--yg-color-fx-foil)",
          "ray": "var(--yg-color-fx-ray)",
          "twinkle": "var(--yg-color-fx-twinkle)",
          "unique-mist": "var(--yg-color-fx-unique-mist)",
          "jade-spark": "var(--yg-color-fx-jade-spark)"
        },
        "chart": {
          "track": "var(--yg-color-chart-track)",
          "fill": "var(--yg-color-chart-fill)",
          "fill-2": "var(--yg-color-chart-fill-2)",
          "grid": "var(--yg-color-chart-grid)",
          "axis": "var(--yg-color-chart-axis)",
          "label": "var(--yg-color-chart-label)"
        },
        "hanji": {
          "2": "var(--yg-hanji-2)",
          "bright": "var(--yg-hanji-bright)",
          "base": "var(--yg-hanji-base)",
          "dark": "var(--yg-hanji-dark)",
          "deep": "var(--yg-hanji-deep)"
        },
        "dancheong": {
          "red": "var(--yg-dancheong-red)",
          "red-deep": "var(--yg-dancheong-red-deep)",
          "blue": "var(--yg-dancheong-blue)",
          "blue-deep": "var(--yg-dancheong-blue-deep)",
          "yellow": "var(--yg-dancheong-yellow)",
          "yellow-deep": "var(--yg-dancheong-yellow-deep)",
          "white": "var(--yg-dancheong-white)",
          "black": "var(--yg-dancheong-black)"
        },
        "ink": {
          "1": "var(--yg-ink-1)",
          "2": "var(--yg-ink-2)",
          "3": "var(--yg-ink-3)",
          "4": "var(--yg-ink-4)"
        },
        "korean": {
          "jade": "var(--yg-korean-jade)",
          "persimmon": "var(--yg-korean-persimmon)",
          "indigo": "var(--yg-korean-indigo)",
          "plum": "var(--yg-korean-plum)",
          "gold": "var(--yg-korean-gold)",
          "gold-bright": "var(--yg-korean-gold-bright)",
          "twilight": "var(--yg-korean-twilight)",
          "moon-white": "var(--yg-korean-moon-white)"
        },
        "holo": {
          "red": "var(--yg-holo-red)",
          "blue": "var(--yg-holo-blue)",
          "yellow": "var(--yg-holo-yellow)",
          "jade": "var(--yg-holo-jade)",
          "plum": "var(--yg-holo-plum)"
        },
        "stage": {
          "bg": "var(--yg-stage-bg)",
          "bg-deep": "var(--yg-stage-bg-deep)",
          "text": "var(--yg-stage-text)"
        },
        "background": "var(--yg-color-surface-canvas)",
        "foreground": "var(--yg-color-text-primary)"
      },
      "spacing": {
        "0": "var(--yg-space-0)",
        "1": "var(--yg-space-1)",
        "2": "var(--yg-space-2)",
        "3": "var(--yg-space-3)",
        "4": "var(--yg-space-4)",
        "5": "var(--yg-space-5)",
        "6": "var(--yg-space-6)",
        "7": "var(--yg-space-7)",
        "8": "var(--yg-space-8)",
        "9": "var(--yg-space-9)",
        "10": "var(--yg-space-10)",
        "11": "var(--yg-space-11)",
        "12": "var(--yg-space-12)",
        "px": "var(--yg-space-px)"
      },
      "borderRadius": {
        "none": "var(--yg-radius-none)",
        "xs": "var(--yg-radius-xs)",
        "sm": "var(--yg-radius-sm)",
        "md": "var(--yg-radius-md)",
        "lg": "var(--yg-radius-lg)",
        "frame": "var(--yg-radius-frame)",
        "paper-bar": "var(--yg-radius-paper-bar)",
        "full": "var(--yg-radius-full)"
      },
      "boxShadow": {
        "stamp": "var(--yg-shadow-stamp)",
        "stamp-blue": "var(--yg-shadow-stamp-blue)",
        "stamp-ink": "var(--yg-shadow-stamp-ink)",
        "stamp-pressed": "var(--yg-shadow-stamp-pressed)",
        "stamp-disabled": "var(--yg-shadow-stamp-disabled)",
        "paper": "var(--yg-shadow-paper)",
        "paper-lg": "var(--yg-shadow-paper-lg)",
        "foil": "var(--yg-shadow-foil)",
        "holo": "var(--yg-shadow-holo)",
        "deep": "var(--yg-shadow-deep)",
        "none": "var(--yg-shadow-none)"
      },
      "fontFamily": {
        "myeongjo": "var(--yg-font-family-myeongjo)",
        "batang": "var(--yg-font-family-batang)",
        "brush": "var(--yg-font-family-brush)",
        "rank": "var(--yg-font-family-rank)",
        "hand": "var(--yg-font-family-hand)",
        "ui": "var(--yg-font-family-ui)",
        "mono": "var(--yg-font-family-mono)",
        "sans": "var(--yg-font-family-ui)"
      },
      "fontSize": {
        "2xs": "var(--yg-font-size-2xs)",
        "xs": "var(--yg-font-size-xs)",
        "sm": "var(--yg-font-size-sm)",
        "md": "var(--yg-font-size-md)",
        "lg": "var(--yg-font-size-lg)",
        "xl": "var(--yg-font-size-xl)",
        "2xl": "var(--yg-font-size-2xl)",
        "3xl": "var(--yg-font-size-3xl)",
        "4xl": "var(--yg-font-size-4xl)",
        "5xl": "var(--yg-font-size-5xl)",
        "brush-lg": "var(--yg-font-size-brush-lg)"
      },
      "lineHeight": {
        "none": "var(--yg-font-line-height-none)",
        "tight": "var(--yg-font-line-height-tight)",
        "snug": "var(--yg-font-line-height-snug)",
        "normal": "var(--yg-font-line-height-normal)",
        "relaxed": "var(--yg-font-line-height-relaxed)",
        "loose": "var(--yg-font-line-height-loose)"
      },
      "letterSpacing": {
        "tight": "var(--yg-font-letter-spacing-tight)",
        "normal": "var(--yg-font-letter-spacing-normal)",
        "wide": "var(--yg-font-letter-spacing-wide)",
        "wider": "var(--yg-font-letter-spacing-wider)"
      },
      "fontWeight": {
        "regular": "var(--yg-font-weight-regular)",
        "medium": "var(--yg-font-weight-medium)",
        "semibold": "var(--yg-font-weight-semibold)",
        "bold": "var(--yg-font-weight-bold)",
        "heading": "var(--yg-font-weight-heading)"
      },
      "zIndex": {
        "hide": "var(--yg-z-index-hide)",
        "base": "var(--yg-z-index-base)",
        "raised": "var(--yg-z-index-raised)",
        "fx": "var(--yg-z-index-fx)",
        "capsule": "var(--yg-z-index-capsule)",
        "floating-finder": "var(--yg-z-index-floating-finder)",
        "dropdown": "var(--yg-z-index-dropdown)",
        "sticky": "var(--yg-z-index-sticky)",
        "tabbar": "var(--yg-z-index-tabbar)",
        "cta": "var(--yg-z-index-cta)",
        "overlay": "var(--yg-z-index-overlay)",
        "sheet": "var(--yg-z-index-sheet)",
        "modal": "var(--yg-z-index-modal)",
        "popover": "var(--yg-z-index-popover)",
        "toast": "var(--yg-z-index-toast)",
        "tooltip": "var(--yg-z-index-tooltip)",
        "stage": "var(--yg-z-index-stage)"
      },
      "transitionDuration": {
        "instant": "var(--yg-motion-duration-instant)",
        "fast": "var(--yg-motion-duration-fast)",
        "normal": "var(--yg-motion-duration-normal)",
        "flip": "var(--yg-motion-duration-flip)",
        "fade-in": "var(--yg-motion-duration-fade-in)",
        "shake-soft": "var(--yg-motion-duration-shake-soft)",
        "shake-strong": "var(--yg-motion-duration-shake-strong)",
        "shake-vivid": "var(--yg-motion-duration-shake-vivid)",
        "arrive": "var(--yg-motion-duration-arrive)",
        "float": "var(--yg-motion-duration-float)",
        "pulse": "var(--yg-motion-duration-pulse)",
        "holo-shift": "var(--yg-motion-duration-holo-shift)",
        "holo-rotate": "var(--yg-motion-duration-holo-rotate)",
        "twinkle": "var(--yg-motion-duration-twinkle)",
        "prelude": "var(--yg-motion-duration-prelude)",
        "toast": "var(--yg-motion-duration-toast)"
      },
      "transitionTimingFunction": {
        "out": "var(--yg-motion-easing-out)",
        "in-out": "var(--yg-motion-easing-in-out)",
        "in": "var(--yg-motion-easing-in)",
        "linear": "var(--yg-motion-easing-linear)"
      },
      "maxWidth": {
        "container-panel": "var(--yg-size-container-panel)",
        "container-doc": "var(--yg-size-container-doc)",
        "container-wide": "var(--yg-size-container-wide)",
        "container-content": "var(--yg-size-container-content)",
        "container-phone": "var(--yg-size-container-phone)",
        "container-frame": "var(--yg-size-container-frame)",
        "container-cta": "var(--yg-size-container-cta)"
      },
      "height": {
        "control-xs": "var(--yg-size-control-xs)",
        "control-sm": "var(--yg-size-control-sm)",
        "control-md": "var(--yg-size-control-md)",
        "control-lg": "var(--yg-size-control-lg)",
        "control-cta": "var(--yg-size-control-cta)"
      },
      "width": {
        "icon-xs": "var(--yg-size-icon-xs)",
        "icon-sm": "var(--yg-size-icon-sm)",
        "icon-md": "var(--yg-size-icon-md)",
        "icon-nav": "var(--yg-size-icon-nav)",
        "icon-lg": "var(--yg-size-icon-lg)",
        "icon-xl": "var(--yg-size-icon-xl)",
        "icon-2xl": "var(--yg-size-icon-2xl)"
      }
    },
    "screens": {
      "xs": "375px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px"
    }
  }
};
