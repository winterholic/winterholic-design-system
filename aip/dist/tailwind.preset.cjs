// AIP Tailwind preset · 자동 생성
// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드한다. 다크는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": {
          "canvas": "var(--aip-color-surface-canvas)",
          "subtle": "var(--aip-color-surface-subtle)",
          "default": "var(--aip-color-surface-default)",
          "raised": "var(--aip-color-surface-raised)",
          "sunken": "var(--aip-color-surface-sunken)",
          "overlay": "var(--aip-color-surface-overlay)",
          "inverse": "var(--aip-color-surface-inverse)",
          "brand": "var(--aip-color-surface-brand)",
          "brand-subtle": "var(--aip-color-surface-brand-subtle)",
          "disabled": "var(--aip-color-surface-disabled)"
        },
        "text": {
          "primary": "var(--aip-color-text-primary)",
          "secondary": "var(--aip-color-text-secondary)",
          "tertiary": "var(--aip-color-text-tertiary)",
          "placeholder": "var(--aip-color-text-placeholder)",
          "disabled": "var(--aip-color-text-disabled)",
          "inverse": "var(--aip-color-text-inverse)",
          "on-brand": "var(--aip-color-text-on-brand)",
          "brand": "var(--aip-color-text-brand)",
          "link": "var(--aip-color-text-link)",
          "link-hover": "var(--aip-color-text-link-hover)",
          "success": "var(--aip-color-text-success)",
          "warning": "var(--aip-color-text-warning)",
          "danger": "var(--aip-color-text-danger)",
          "info": "var(--aip-color-text-info)"
        },
        "border": {
          "subtle": "var(--aip-color-border-subtle)",
          "default": "var(--aip-color-border-default)",
          "strong": "var(--aip-color-border-strong)",
          "brand": "var(--aip-color-border-brand)",
          "focus": "var(--aip-color-border-focus)",
          "danger": "var(--aip-color-border-danger)",
          "inverse": "var(--aip-color-border-inverse)"
        },
        "action": {
          "primary": {
            "bg": "var(--aip-color-action-primary-bg)",
            "bg-hover": "var(--aip-color-action-primary-bg-hover)",
            "bg-active": "var(--aip-color-action-primary-bg-active)",
            "text": "var(--aip-color-action-primary-text)"
          },
          "secondary": {
            "bg": "var(--aip-color-action-secondary-bg)",
            "bg-hover": "var(--aip-color-action-secondary-bg-hover)",
            "bg-active": "var(--aip-color-action-secondary-bg-active)",
            "border": "var(--aip-color-action-secondary-border)",
            "text": "var(--aip-color-action-secondary-text)"
          },
          "ghost": {
            "bg": "var(--aip-color-action-ghost-bg)",
            "bg-hover": "var(--aip-color-action-ghost-bg-hover)",
            "bg-active": "var(--aip-color-action-ghost-bg-active)",
            "text": "var(--aip-color-action-ghost-text)"
          },
          "danger": {
            "bg": "var(--aip-color-action-danger-bg)",
            "bg-hover": "var(--aip-color-action-danger-bg-hover)",
            "bg-active": "var(--aip-color-action-danger-bg-active)",
            "text": "var(--aip-color-action-danger-text)"
          },
          "disabled": {
            "bg": "var(--aip-color-action-disabled-bg)",
            "text": "var(--aip-color-action-disabled-text)",
            "border": "var(--aip-color-action-disabled-border)"
          }
        },
        "status": {
          "info": {
            "bg": "var(--aip-color-status-info-bg)",
            "border": "var(--aip-color-status-info-border)",
            "text": "var(--aip-color-status-info-text)",
            "icon": "var(--aip-color-status-info-icon)",
            "solid": "var(--aip-color-status-info-solid)",
            "on-solid": "var(--aip-color-status-info-on-solid)"
          },
          "success": {
            "bg": "var(--aip-color-status-success-bg)",
            "border": "var(--aip-color-status-success-border)",
            "text": "var(--aip-color-status-success-text)",
            "icon": "var(--aip-color-status-success-icon)",
            "solid": "var(--aip-color-status-success-solid)",
            "on-solid": "var(--aip-color-status-success-on-solid)"
          },
          "warning": {
            "bg": "var(--aip-color-status-warning-bg)",
            "border": "var(--aip-color-status-warning-border)",
            "text": "var(--aip-color-status-warning-text)",
            "icon": "var(--aip-color-status-warning-icon)",
            "solid": "var(--aip-color-status-warning-solid)",
            "on-solid": "var(--aip-color-status-warning-on-solid)"
          },
          "danger": {
            "bg": "var(--aip-color-status-danger-bg)",
            "border": "var(--aip-color-status-danger-border)",
            "text": "var(--aip-color-status-danger-text)",
            "icon": "var(--aip-color-status-danger-icon)",
            "solid": "var(--aip-color-status-danger-solid)",
            "on-solid": "var(--aip-color-status-danger-on-solid)"
          },
          "neutral": {
            "bg": "var(--aip-color-status-neutral-bg)",
            "border": "var(--aip-color-status-neutral-border)",
            "text": "var(--aip-color-status-neutral-text)",
            "icon": "var(--aip-color-status-neutral-icon)",
            "solid": "var(--aip-color-status-neutral-solid)",
            "on-solid": "var(--aip-color-status-neutral-on-solid)"
          }
        },
        "highlight": {
          "mark": "var(--aip-color-highlight-mark)",
          "mark-text": "var(--aip-color-highlight-mark-text)",
          "bg": "var(--aip-color-highlight-bg)",
          "border": "var(--aip-color-highlight-border)",
          "text": "var(--aip-color-highlight-text)",
          "icon": "var(--aip-color-highlight-icon)"
        },
        "code": {
          "bg": "var(--aip-color-code-bg)",
          "bg-header": "var(--aip-color-code-bg-header)",
          "border": "var(--aip-color-code-border)",
          "text": "var(--aip-color-code-text)",
          "text-muted": "var(--aip-color-code-text-muted)",
          "comment": "var(--aip-color-code-comment)",
          "keyword": "var(--aip-color-code-keyword)",
          "string": "var(--aip-color-code-string)",
          "function": "var(--aip-color-code-function)",
          "number": "var(--aip-color-code-number)",
          "type": "var(--aip-color-code-type)",
          "punctuation": "var(--aip-color-code-punctuation)",
          "line-number": "var(--aip-color-code-line-number)",
          "line-highlight": "var(--aip-color-code-line-highlight)",
          "line-highlight-marker": "var(--aip-color-code-line-highlight-marker)",
          "added-bg": "var(--aip-color-code-added-bg)",
          "added-sign": "var(--aip-color-code-added-sign)",
          "removed-bg": "var(--aip-color-code-removed-bg)",
          "removed-sign": "var(--aip-color-code-removed-sign)",
          "selection": "var(--aip-color-code-selection)",
          "bg-inline": "var(--aip-color-code-bg-inline)",
          "text-inline": "var(--aip-color-code-text-inline)"
        },
        "lifecycle": {
          "stable": {
            "bg": "var(--aip-color-lifecycle-stable-bg)",
            "border": "var(--aip-color-lifecycle-stable-border)",
            "text": "var(--aip-color-lifecycle-stable-text)"
          },
          "beta": {
            "bg": "var(--aip-color-lifecycle-beta-bg)",
            "border": "var(--aip-color-lifecycle-beta-border)",
            "text": "var(--aip-color-lifecycle-beta-text)"
          },
          "experimental": {
            "bg": "var(--aip-color-lifecycle-experimental-bg)",
            "border": "var(--aip-color-lifecycle-experimental-border)",
            "text": "var(--aip-color-lifecycle-experimental-text)"
          },
          "deprecated": {
            "bg": "var(--aip-color-lifecycle-deprecated-bg)",
            "border": "var(--aip-color-lifecycle-deprecated-border)",
            "text": "var(--aip-color-lifecycle-deprecated-text)"
          }
        },
        "diagram": {
          "canvas": "var(--aip-color-diagram-canvas)",
          "grid": "var(--aip-color-diagram-grid)",
          "zone-bg": "var(--aip-color-diagram-zone-bg)",
          "zone-border": "var(--aip-color-diagram-zone-border)",
          "intent": {
            "fill": "var(--aip-color-diagram-intent-fill)",
            "stroke": "var(--aip-color-diagram-intent-stroke)",
            "text": "var(--aip-color-diagram-intent-text)"
          },
          "runtime": {
            "fill": "var(--aip-color-diagram-runtime-fill)",
            "stroke": "var(--aip-color-diagram-runtime-stroke)",
            "text": "var(--aip-color-diagram-runtime-text)"
          },
          "execution": {
            "fill": "var(--aip-color-diagram-execution-fill)",
            "stroke": "var(--aip-color-diagram-execution-stroke)",
            "text": "var(--aip-color-diagram-execution-text)"
          },
          "permission": {
            "fill": "var(--aip-color-diagram-permission-fill)",
            "stroke": "var(--aip-color-diagram-permission-stroke)",
            "text": "var(--aip-color-diagram-permission-text)"
          },
          "frontend": {
            "fill": "var(--aip-color-diagram-frontend-fill)",
            "stroke": "var(--aip-color-diagram-frontend-stroke)",
            "text": "var(--aip-color-diagram-frontend-text)"
          },
          "backend": {
            "fill": "var(--aip-color-diagram-backend-fill)",
            "stroke": "var(--aip-color-diagram-backend-stroke)",
            "text": "var(--aip-color-diagram-backend-text)"
          },
          "data": {
            "fill": "var(--aip-color-diagram-data-fill)",
            "stroke": "var(--aip-color-diagram-data-stroke)",
            "text": "var(--aip-color-diagram-data-text)"
          },
          "external": {
            "fill": "var(--aip-color-diagram-external-fill)",
            "stroke": "var(--aip-color-diagram-external-stroke)",
            "text": "var(--aip-color-diagram-external-text)"
          },
          "note": {
            "fill": "var(--aip-color-diagram-note-fill)",
            "stroke": "var(--aip-color-diagram-note-stroke)",
            "text": "var(--aip-color-diagram-note-text)"
          },
          "edge": {
            "default": "var(--aip-color-diagram-edge-default)",
            "muted": "var(--aip-color-diagram-edge-muted)",
            "emphasis": "var(--aip-color-diagram-edge-emphasis)",
            "allow": "var(--aip-color-diagram-edge-allow)",
            "reject": "var(--aip-color-diagram-edge-reject)",
            "label": "var(--aip-color-diagram-edge-label)"
          }
        },
        "interactive": {
          "focus-ring": "var(--aip-color-interactive-focus-ring)",
          "selected-bg": "var(--aip-color-interactive-selected-bg)",
          "selected-border": "var(--aip-color-interactive-selected-border)",
          "selected-text": "var(--aip-color-interactive-selected-text)",
          "hover-overlay": "var(--aip-color-interactive-hover-overlay)",
          "pressed-overlay": "var(--aip-color-interactive-pressed-overlay)",
          "selection": "var(--aip-color-interactive-selection)"
        },
        "accent": {
          "blue": "var(--aip-color-accent-blue)",
          "tangerine": "var(--aip-color-accent-tangerine)",
          "yellow": "var(--aip-color-accent-yellow)",
          "charcoal": "var(--aip-color-accent-charcoal)",
          "slate": "var(--aip-color-accent-slate)"
        },
        "chart": {
          "categorical": {
            "1": "var(--aip-color-chart-categorical-1)",
            "2": "var(--aip-color-chart-categorical-2)",
            "3": "var(--aip-color-chart-categorical-3)",
            "4": "var(--aip-color-chart-categorical-4)",
            "5": "var(--aip-color-chart-categorical-5)",
            "6": "var(--aip-color-chart-categorical-6)"
          },
          "sequential": {
            "1": "var(--aip-color-chart-sequential-1)",
            "2": "var(--aip-color-chart-sequential-2)",
            "3": "var(--aip-color-chart-sequential-3)",
            "4": "var(--aip-color-chart-sequential-4)",
            "5": "var(--aip-color-chart-sequential-5)",
            "6": "var(--aip-color-chart-sequential-6)",
            "7": "var(--aip-color-chart-sequential-7)"
          },
          "grid": "var(--aip-color-chart-grid)",
          "axis": "var(--aip-color-chart-axis)",
          "label": "var(--aip-color-chart-label)"
        }
      },
      "spacing": {
        "0": "var(--aip-space-0)",
        "1": "var(--aip-space-1)",
        "2": "var(--aip-space-2)",
        "3": "var(--aip-space-3)",
        "4": "var(--aip-space-4)",
        "5": "var(--aip-space-5)",
        "6": "var(--aip-space-6)",
        "8": "var(--aip-space-8)",
        "10": "var(--aip-space-10)",
        "12": "var(--aip-space-12)",
        "16": "var(--aip-space-16)",
        "20": "var(--aip-space-20)",
        "24": "var(--aip-space-24)",
        "32": "var(--aip-space-32)",
        "px": "var(--aip-space-px)",
        "0.5": "var(--aip-space-0-5)",
        "1.5": "var(--aip-space-1-5)"
      },
      "borderRadius": {
        "none": "var(--aip-radius-none)",
        "xs": "var(--aip-radius-xs)",
        "sm": "var(--aip-radius-sm)",
        "md": "var(--aip-radius-md)",
        "lg": "var(--aip-radius-lg)",
        "xl": "var(--aip-radius-xl)",
        "2xl": "var(--aip-radius-2xl)",
        "full": "var(--aip-radius-full)"
      },
      "borderWidth": {
        "hairline": "var(--aip-border-width-hairline)",
        "strong": "var(--aip-border-width-strong)",
        "accent": "var(--aip-border-width-accent)"
      },
      "boxShadow": {
        "xs": "var(--aip-shadow-xs)",
        "sm": "var(--aip-shadow-sm)",
        "md": "var(--aip-shadow-md)",
        "lg": "var(--aip-shadow-lg)"
      },
      "fontFamily": {
        "sans": "var(--aip-font-family-sans)",
        "mono": "var(--aip-font-family-mono)"
      },
      "fontSize": {
        "xs": "var(--aip-font-size-xs)",
        "sm": "var(--aip-font-size-sm)",
        "md": "var(--aip-font-size-md)",
        "lg": "var(--aip-font-size-lg)",
        "xl": "var(--aip-font-size-xl)",
        "2xl": "var(--aip-font-size-2xl)",
        "3xl": "var(--aip-font-size-3xl)",
        "4xl": "var(--aip-font-size-4xl)",
        "5xl": "var(--aip-font-size-5xl)",
        "6xl": "var(--aip-font-size-6xl)"
      },
      "lineHeight": {
        "none": "var(--aip-font-line-height-none)",
        "tight": "var(--aip-font-line-height-tight)",
        "snug": "var(--aip-font-line-height-snug)",
        "heading": "var(--aip-font-line-height-heading)",
        "normal": "var(--aip-font-line-height-normal)",
        "relaxed": "var(--aip-font-line-height-relaxed)",
        "prose": "var(--aip-font-line-height-prose)"
      },
      "letterSpacing": {
        "tighter": "var(--aip-font-letter-spacing-tighter)",
        "tight": "var(--aip-font-letter-spacing-tight)",
        "snug": "var(--aip-font-letter-spacing-snug)",
        "normal": "var(--aip-font-letter-spacing-normal)",
        "wide": "var(--aip-font-letter-spacing-wide)"
      },
      "fontWeight": {
        "regular": "var(--aip-font-weight-regular)",
        "medium": "var(--aip-font-weight-medium)",
        "semibold": "var(--aip-font-weight-semibold)",
        "bold": "var(--aip-font-weight-bold)"
      },
      "zIndex": {
        "hide": "var(--aip-z-index-hide)",
        "base": "var(--aip-z-index-base)",
        "raised": "var(--aip-z-index-raised)",
        "sticky": "var(--aip-z-index-sticky)",
        "dropdown": "var(--aip-z-index-dropdown)",
        "overlay": "var(--aip-z-index-overlay)",
        "modal": "var(--aip-z-index-modal)",
        "popover": "var(--aip-z-index-popover)",
        "toast": "var(--aip-z-index-toast)",
        "tooltip": "var(--aip-z-index-tooltip)"
      },
      "transitionDuration": {
        "instant": "var(--aip-motion-duration-instant)",
        "fast": "var(--aip-motion-duration-fast)",
        "normal": "var(--aip-motion-duration-normal)",
        "slow": "var(--aip-motion-duration-slow)",
        "tooltip-delay": "var(--aip-motion-duration-tooltip-delay)",
        "feedback": "var(--aip-motion-duration-feedback)",
        "toast": "var(--aip-motion-duration-toast)"
      },
      "transitionTimingFunction": {
        "standard": "var(--aip-motion-easing-standard)",
        "enter": "var(--aip-motion-easing-enter)",
        "exit": "var(--aip-motion-easing-exit)",
        "linear": "var(--aip-motion-easing-linear)"
      },
      "maxWidth": {
        "container-sm": "var(--aip-size-container-sm)",
        "container-prose": "var(--aip-size-container-prose)",
        "container-md": "var(--aip-size-container-md)",
        "container-lg": "var(--aip-size-container-lg)",
        "container-xl": "var(--aip-size-container-xl)"
      },
      "height": {
        "control-xs": "var(--aip-size-control-xs)",
        "control-sm": "var(--aip-size-control-sm)",
        "control-md": "var(--aip-size-control-md)",
        "control-lg": "var(--aip-size-control-lg)"
      },
      "width": {
        "icon-xs": "var(--aip-size-icon-xs)",
        "icon-sm": "var(--aip-size-icon-sm)",
        "icon-md": "var(--aip-size-icon-md)",
        "icon-lg": "var(--aip-size-icon-lg)",
        "icon-xl": "var(--aip-size-icon-xl)"
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
