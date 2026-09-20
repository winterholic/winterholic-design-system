// notting Tailwind preset · 자동 생성
// tailwind.config: { presets: [require('notting/dist/tailwind.preset.cjs')] }
// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드해야 한다. 다크모드는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": {
          "canvas": "var(--nt-color-surface-canvas)",
          "default": "var(--nt-color-surface-default)",
          "raised": "var(--nt-color-surface-raised)",
          "sunken": "var(--nt-color-surface-sunken)",
          "overlay": "var(--nt-color-surface-overlay)",
          "inverse": "var(--nt-color-surface-inverse)",
          "brand": "var(--nt-color-surface-brand)",
          "brand-subtle": "var(--nt-color-surface-brand-subtle)",
          "disabled": "var(--nt-color-surface-disabled)"
        },
        "text": {
          "primary": "var(--nt-color-text-primary)",
          "secondary": "var(--nt-color-text-secondary)",
          "tertiary": "var(--nt-color-text-tertiary)",
          "placeholder": "var(--nt-color-text-placeholder)",
          "disabled": "var(--nt-color-text-disabled)",
          "inverse": "var(--nt-color-text-inverse)",
          "on-brand": "var(--nt-color-text-on-brand)",
          "brand": "var(--nt-color-text-brand)",
          "link": "var(--nt-color-text-link)",
          "link-hover": "var(--nt-color-text-link-hover)",
          "success": "var(--nt-color-text-success)",
          "warning": "var(--nt-color-text-warning)",
          "danger": "var(--nt-color-text-danger)",
          "info": "var(--nt-color-text-info)",
          "ai": "var(--nt-color-text-ai)"
        },
        "border": {
          "subtle": "var(--nt-color-border-subtle)",
          "default": "var(--nt-color-border-default)",
          "strong": "var(--nt-color-border-strong)",
          "input-strict": "var(--nt-color-border-input-strict)",
          "brand": "var(--nt-color-border-brand)",
          "focus": "var(--nt-color-border-focus)",
          "danger": "var(--nt-color-border-danger)",
          "ai": "var(--nt-color-border-ai)",
          "inverse": "var(--nt-color-border-inverse)"
        },
        "action": {
          "primary": {
            "bg": "var(--nt-color-action-primary-bg)",
            "bg-hover": "var(--nt-color-action-primary-bg-hover)",
            "bg-active": "var(--nt-color-action-primary-bg-active)",
            "text": "var(--nt-color-action-primary-text)"
          },
          "secondary": {
            "bg": "var(--nt-color-action-secondary-bg)",
            "bg-hover": "var(--nt-color-action-secondary-bg-hover)",
            "bg-active": "var(--nt-color-action-secondary-bg-active)",
            "border": "var(--nt-color-action-secondary-border)",
            "text": "var(--nt-color-action-secondary-text)"
          },
          "ghost": {
            "bg": "var(--nt-color-action-ghost-bg)",
            "bg-hover": "var(--nt-color-action-ghost-bg-hover)",
            "bg-active": "var(--nt-color-action-ghost-bg-active)",
            "text": "var(--nt-color-action-ghost-text)"
          },
          "ai": {
            "bg": "var(--nt-color-action-ai-bg)",
            "bg-hover": "var(--nt-color-action-ai-bg-hover)",
            "bg-active": "var(--nt-color-action-ai-bg-active)",
            "text": "var(--nt-color-action-ai-text)"
          },
          "danger": {
            "bg": "var(--nt-color-action-danger-bg)",
            "bg-hover": "var(--nt-color-action-danger-bg-hover)",
            "bg-active": "var(--nt-color-action-danger-bg-active)",
            "text": "var(--nt-color-action-danger-text)"
          },
          "danger-ghost": {
            "bg": "var(--nt-color-action-danger-ghost-bg)",
            "bg-hover": "var(--nt-color-action-danger-ghost-bg-hover)",
            "text": "var(--nt-color-action-danger-ghost-text)"
          },
          "disabled": {
            "bg": "var(--nt-color-action-disabled-bg)",
            "text": "var(--nt-color-action-disabled-text)",
            "border": "var(--nt-color-action-disabled-border)"
          }
        },
        "status": {
          "success": {
            "bg": "var(--nt-color-status-success-bg)",
            "border": "var(--nt-color-status-success-border)",
            "text": "var(--nt-color-status-success-text)",
            "icon": "var(--nt-color-status-success-icon)",
            "solid": "var(--nt-color-status-success-solid)",
            "on-solid": "var(--nt-color-status-success-on-solid)"
          },
          "warning": {
            "bg": "var(--nt-color-status-warning-bg)",
            "border": "var(--nt-color-status-warning-border)",
            "text": "var(--nt-color-status-warning-text)",
            "icon": "var(--nt-color-status-warning-icon)",
            "solid": "var(--nt-color-status-warning-solid)",
            "on-solid": "var(--nt-color-status-warning-on-solid)"
          },
          "danger": {
            "bg": "var(--nt-color-status-danger-bg)",
            "border": "var(--nt-color-status-danger-border)",
            "text": "var(--nt-color-status-danger-text)",
            "icon": "var(--nt-color-status-danger-icon)",
            "solid": "var(--nt-color-status-danger-solid)",
            "on-solid": "var(--nt-color-status-danger-on-solid)"
          },
          "info": {
            "bg": "var(--nt-color-status-info-bg)",
            "border": "var(--nt-color-status-info-border)",
            "text": "var(--nt-color-status-info-text)",
            "icon": "var(--nt-color-status-info-icon)",
            "solid": "var(--nt-color-status-info-solid)",
            "on-solid": "var(--nt-color-status-info-on-solid)"
          },
          "neutral": {
            "bg": "var(--nt-color-status-neutral-bg)",
            "border": "var(--nt-color-status-neutral-border)",
            "text": "var(--nt-color-status-neutral-text)",
            "icon": "var(--nt-color-status-neutral-icon)",
            "solid": "var(--nt-color-status-neutral-solid)",
            "on-solid": "var(--nt-color-status-neutral-on-solid)"
          }
        },
        "ai": {
          "bg": "var(--nt-color-ai-bg)",
          "border": "var(--nt-color-ai-border)",
          "text": "var(--nt-color-ai-text)",
          "icon": "var(--nt-color-ai-icon)",
          "solid": "var(--nt-color-ai-solid)",
          "on-solid": "var(--nt-color-ai-on-solid)",
          "stream": "var(--nt-color-ai-stream)"
        },
        "citation": {
          "bg": "var(--nt-color-citation-bg)",
          "bg-hover": "var(--nt-color-citation-bg-hover)",
          "text": "var(--nt-color-citation-text)",
          "marker": "var(--nt-color-citation-marker)",
          "stale-bg": "var(--nt-color-citation-stale-bg)",
          "stale-text": "var(--nt-color-citation-stale-text)"
        },
        "mark": {
          "highlight": "var(--nt-color-mark-highlight)",
          "highlight-text": "var(--nt-color-mark-highlight-text)",
          "selection": "var(--nt-color-mark-selection)",
          "block-hover": "var(--nt-color-mark-block-hover)",
          "drop-indicator": "var(--nt-color-mark-drop-indicator)"
        },
        "diff": {
          "added-bg": "var(--nt-color-diff-added-bg)",
          "added-text": "var(--nt-color-diff-added-text)",
          "added-marker": "var(--nt-color-diff-added-marker)",
          "removed-bg": "var(--nt-color-diff-removed-bg)",
          "removed-text": "var(--nt-color-diff-removed-text)",
          "removed-marker": "var(--nt-color-diff-removed-marker)",
          "changed-bg": "var(--nt-color-diff-changed-bg)",
          "changed-text": "var(--nt-color-diff-changed-text)",
          "changed-marker": "var(--nt-color-diff-changed-marker)",
          "conflict-bg": "var(--nt-color-diff-conflict-bg)",
          "conflict-border": "var(--nt-color-diff-conflict-border)"
        },
        "workflow": {
          "backlog": {
            "solid": "var(--nt-color-workflow-backlog-solid)",
            "bg": "var(--nt-color-workflow-backlog-bg)",
            "text": "var(--nt-color-workflow-backlog-text)"
          },
          "todo": {
            "solid": "var(--nt-color-workflow-todo-solid)",
            "bg": "var(--nt-color-workflow-todo-bg)",
            "text": "var(--nt-color-workflow-todo-text)"
          },
          "in-progress": {
            "solid": "var(--nt-color-workflow-in-progress-solid)",
            "bg": "var(--nt-color-workflow-in-progress-bg)",
            "text": "var(--nt-color-workflow-in-progress-text)"
          },
          "review": {
            "solid": "var(--nt-color-workflow-review-solid)",
            "bg": "var(--nt-color-workflow-review-bg)",
            "text": "var(--nt-color-workflow-review-text)"
          },
          "done": {
            "solid": "var(--nt-color-workflow-done-solid)",
            "bg": "var(--nt-color-workflow-done-bg)",
            "text": "var(--nt-color-workflow-done-text)"
          },
          "canceled": {
            "solid": "var(--nt-color-workflow-canceled-solid)",
            "bg": "var(--nt-color-workflow-canceled-bg)",
            "text": "var(--nt-color-workflow-canceled-text)"
          }
        },
        "priority": {
          "urgent": "var(--nt-color-priority-urgent)",
          "high": "var(--nt-color-priority-high)",
          "medium": "var(--nt-color-priority-medium)",
          "low": "var(--nt-color-priority-low)",
          "none": "var(--nt-color-priority-none)"
        },
        "decision": {
          "proposed": {
            "solid": "var(--nt-color-decision-proposed-solid)",
            "bg": "var(--nt-color-decision-proposed-bg)",
            "text": "var(--nt-color-decision-proposed-text)"
          },
          "accepted": {
            "solid": "var(--nt-color-decision-accepted-solid)",
            "bg": "var(--nt-color-decision-accepted-bg)",
            "text": "var(--nt-color-decision-accepted-text)"
          },
          "deprecated": {
            "solid": "var(--nt-color-decision-deprecated-solid)",
            "bg": "var(--nt-color-decision-deprecated-bg)",
            "text": "var(--nt-color-decision-deprecated-text)"
          },
          "superseded": {
            "solid": "var(--nt-color-decision-superseded-solid)",
            "bg": "var(--nt-color-decision-superseded-bg)",
            "text": "var(--nt-color-decision-superseded-text)"
          },
          "rejected": {
            "solid": "var(--nt-color-decision-rejected-solid)",
            "bg": "var(--nt-color-decision-rejected-bg)",
            "text": "var(--nt-color-decision-rejected-text)"
          }
        },
        "fidelity": {
          "lossless": {
            "solid": "var(--nt-color-fidelity-lossless-solid)",
            "bg": "var(--nt-color-fidelity-lossless-bg)",
            "text": "var(--nt-color-fidelity-lossless-text)"
          },
          "normalized": {
            "solid": "var(--nt-color-fidelity-normalized-solid)",
            "bg": "var(--nt-color-fidelity-normalized-bg)",
            "text": "var(--nt-color-fidelity-normalized-text)"
          },
          "degraded": {
            "solid": "var(--nt-color-fidelity-degraded-solid)",
            "bg": "var(--nt-color-fidelity-degraded-bg)",
            "text": "var(--nt-color-fidelity-degraded-text)"
          },
          "dropped": {
            "solid": "var(--nt-color-fidelity-dropped-solid)",
            "bg": "var(--nt-color-fidelity-dropped-bg)",
            "text": "var(--nt-color-fidelity-dropped-text)"
          },
          "opaque": {
            "solid": "var(--nt-color-fidelity-opaque-solid)",
            "bg": "var(--nt-color-fidelity-opaque-bg)",
            "text": "var(--nt-color-fidelity-opaque-text)"
          }
        },
        "code": {
          "bg": "var(--nt-color-code-bg)",
          "bg-inline": "var(--nt-color-code-bg-inline)",
          "text": "var(--nt-color-code-text)",
          "comment": "var(--nt-color-code-comment)",
          "punctuation": "var(--nt-color-code-punctuation)",
          "keyword": "var(--nt-color-code-keyword)",
          "string": "var(--nt-color-code-string)",
          "number": "var(--nt-color-code-number)",
          "function": "var(--nt-color-code-function)",
          "line-number": "var(--nt-color-code-line-number)",
          "line-highlight": "var(--nt-color-code-line-highlight)"
        },
        "interactive": {
          "focus-ring": "var(--nt-color-interactive-focus-ring)",
          "selected-bg": "var(--nt-color-interactive-selected-bg)",
          "selected-border": "var(--nt-color-interactive-selected-border)",
          "selected-text": "var(--nt-color-interactive-selected-text)",
          "hover-overlay": "var(--nt-color-interactive-hover-overlay)",
          "pressed-overlay": "var(--nt-color-interactive-pressed-overlay)"
        },
        "accent": {
          "verdigris": "var(--nt-color-accent-verdigris)",
          "periwinkle": "var(--nt-color-accent-periwinkle)",
          "coral": "var(--nt-color-accent-coral)",
          "paper": "var(--nt-color-accent-paper)",
          "ink": "var(--nt-color-accent-ink)"
        },
        "chart": {
          "categorical": {
            "1": "var(--nt-color-chart-categorical-1)",
            "2": "var(--nt-color-chart-categorical-2)",
            "3": "var(--nt-color-chart-categorical-3)",
            "4": "var(--nt-color-chart-categorical-4)",
            "5": "var(--nt-color-chart-categorical-5)",
            "6": "var(--nt-color-chart-categorical-6)",
            "7": "var(--nt-color-chart-categorical-7)",
            "8": "var(--nt-color-chart-categorical-8)"
          },
          "sequential": {
            "1": "var(--nt-color-chart-sequential-1)",
            "2": "var(--nt-color-chart-sequential-2)",
            "3": "var(--nt-color-chart-sequential-3)",
            "4": "var(--nt-color-chart-sequential-4)",
            "5": "var(--nt-color-chart-sequential-5)",
            "6": "var(--nt-color-chart-sequential-6)",
            "7": "var(--nt-color-chart-sequential-7)",
            "8": "var(--nt-color-chart-sequential-8)"
          },
          "diverging": {
            "negative": "var(--nt-color-chart-diverging-negative)",
            "mid": "var(--nt-color-chart-diverging-mid)",
            "positive": "var(--nt-color-chart-diverging-positive)"
          },
          "grid": "var(--nt-color-chart-grid)",
          "axis": "var(--nt-color-chart-axis)",
          "label": "var(--nt-color-chart-label)"
        },
        "teal": {
          "50": "var(--nt-teal-50)",
          "100": "var(--nt-teal-100)",
          "200": "var(--nt-teal-200)",
          "300": "var(--nt-teal-300)",
          "400": "var(--nt-teal-400)",
          "500": "var(--nt-teal-500)",
          "600": "var(--nt-teal-600)",
          "700": "var(--nt-teal-700)",
          "800": "var(--nt-teal-800)",
          "900": "var(--nt-teal-900)",
          "950": "var(--nt-teal-950)"
        },
        "periwinkle": {
          "50": "var(--nt-periwinkle-50)",
          "100": "var(--nt-periwinkle-100)",
          "200": "var(--nt-periwinkle-200)",
          "300": "var(--nt-periwinkle-300)",
          "400": "var(--nt-periwinkle-400)",
          "500": "var(--nt-periwinkle-500)",
          "600": "var(--nt-periwinkle-600)",
          "700": "var(--nt-periwinkle-700)",
          "800": "var(--nt-periwinkle-800)",
          "900": "var(--nt-periwinkle-900)",
          "950": "var(--nt-periwinkle-950)"
        },
        "coral": {
          "50": "var(--nt-coral-50)",
          "100": "var(--nt-coral-100)",
          "200": "var(--nt-coral-200)",
          "300": "var(--nt-coral-300)",
          "400": "var(--nt-coral-400)",
          "500": "var(--nt-coral-500)",
          "600": "var(--nt-coral-600)",
          "700": "var(--nt-coral-700)",
          "800": "var(--nt-coral-800)",
          "900": "var(--nt-coral-900)",
          "950": "var(--nt-coral-950)"
        },
        "neutral": {
          "50": "var(--nt-neutral-50)",
          "100": "var(--nt-neutral-100)",
          "200": "var(--nt-neutral-200)",
          "300": "var(--nt-neutral-300)",
          "400": "var(--nt-neutral-400)",
          "500": "var(--nt-neutral-500)",
          "600": "var(--nt-neutral-600)",
          "700": "var(--nt-neutral-700)",
          "800": "var(--nt-neutral-800)",
          "900": "var(--nt-neutral-900)",
          "950": "var(--nt-neutral-950)"
        },
        "green": {
          "50": "var(--nt-green-50)",
          "100": "var(--nt-green-100)",
          "200": "var(--nt-green-200)",
          "300": "var(--nt-green-300)",
          "400": "var(--nt-green-400)",
          "500": "var(--nt-green-500)",
          "600": "var(--nt-green-600)",
          "700": "var(--nt-green-700)",
          "800": "var(--nt-green-800)",
          "900": "var(--nt-green-900)",
          "950": "var(--nt-green-950)"
        },
        "amber": {
          "50": "var(--nt-amber-50)",
          "100": "var(--nt-amber-100)",
          "200": "var(--nt-amber-200)",
          "300": "var(--nt-amber-300)",
          "400": "var(--nt-amber-400)",
          "500": "var(--nt-amber-500)",
          "600": "var(--nt-amber-600)",
          "700": "var(--nt-amber-700)",
          "800": "var(--nt-amber-800)",
          "900": "var(--nt-amber-900)",
          "950": "var(--nt-amber-950)"
        }
      },
      "spacing": {
        "0": "var(--nt-space-0)",
        "1": "var(--nt-space-1)",
        "2": "var(--nt-space-2)",
        "3": "var(--nt-space-3)",
        "4": "var(--nt-space-4)",
        "5": "var(--nt-space-5)",
        "6": "var(--nt-space-6)",
        "8": "var(--nt-space-8)",
        "10": "var(--nt-space-10)",
        "12": "var(--nt-space-12)",
        "16": "var(--nt-space-16)",
        "20": "var(--nt-space-20)",
        "24": "var(--nt-space-24)",
        "32": "var(--nt-space-32)",
        "px": "var(--nt-space-px)",
        "0.5": "var(--nt-space-0-5)",
        "1.5": "var(--nt-space-1-5)"
      },
      "borderRadius": {
        "none": "var(--nt-radius-none)",
        "xs": "var(--nt-radius-xs)",
        "sm": "var(--nt-radius-sm)",
        "md": "var(--nt-radius-md)",
        "lg": "var(--nt-radius-lg)",
        "xl": "var(--nt-radius-xl)",
        "2xl": "var(--nt-radius-2xl)",
        "full": "var(--nt-radius-full)"
      },
      "boxShadow": {
        "xs": "var(--nt-shadow-xs)",
        "sm": "var(--nt-shadow-sm)",
        "md": "var(--nt-shadow-md)",
        "lg": "var(--nt-shadow-lg)",
        "xl": "var(--nt-shadow-xl)",
        "inner": "var(--nt-shadow-inner)",
        "brand": "var(--nt-shadow-brand)",
        "ai": "var(--nt-shadow-ai)"
      },
      "fontFamily": {
        "sans": "var(--nt-font-family-sans)",
        "mono": "var(--nt-font-family-mono)",
        "display": "var(--nt-font-family-display)"
      },
      "fontSize": {
        "2xs": "var(--nt-font-size-2xs)",
        "xs": "var(--nt-font-size-xs)",
        "sm": "var(--nt-font-size-sm)",
        "md": "var(--nt-font-size-md)",
        "lg": "var(--nt-font-size-lg)",
        "xl": "var(--nt-font-size-xl)",
        "2xl": "var(--nt-font-size-2xl)",
        "3xl": "var(--nt-font-size-3xl)",
        "4xl": "var(--nt-font-size-4xl)",
        "5xl": "var(--nt-font-size-5xl)",
        "6xl": "var(--nt-font-size-6xl)"
      },
      "lineHeight": {
        "none": "var(--nt-font-line-height-none)",
        "tight": "var(--nt-font-line-height-tight)",
        "snug": "var(--nt-font-line-height-snug)",
        "normal": "var(--nt-font-line-height-normal)",
        "relaxed": "var(--nt-font-line-height-relaxed)",
        "prose": "var(--nt-font-line-height-prose)",
        "loose": "var(--nt-font-line-height-loose)"
      },
      "letterSpacing": {
        "tighter": "var(--nt-font-letter-spacing-tighter)",
        "tight": "var(--nt-font-letter-spacing-tight)",
        "snug": "var(--nt-font-letter-spacing-snug)",
        "normal": "var(--nt-font-letter-spacing-normal)",
        "wide": "var(--nt-font-letter-spacing-wide)"
      },
      "fontWeight": {
        "regular": "var(--nt-font-weight-regular)",
        "medium": "var(--nt-font-weight-medium)",
        "semibold": "var(--nt-font-weight-semibold)",
        "bold": "var(--nt-font-weight-bold)"
      },
      "zIndex": {
        "hide": "var(--nt-z-index-hide)",
        "base": "var(--nt-z-index-base)",
        "raised": "var(--nt-z-index-raised)",
        "sidebar": "var(--nt-z-index-sidebar)",
        "dropdown": "var(--nt-z-index-dropdown)",
        "sticky": "var(--nt-z-index-sticky)",
        "overlay": "var(--nt-z-index-overlay)",
        "modal": "var(--nt-z-index-modal)",
        "popover": "var(--nt-z-index-popover)",
        "toast": "var(--nt-z-index-toast)",
        "tooltip": "var(--nt-z-index-tooltip)"
      },
      "transitionDuration": {
        "instant": "var(--nt-motion-duration-instant)",
        "fast": "var(--nt-motion-duration-fast)",
        "normal": "var(--nt-motion-duration-normal)",
        "slow": "var(--nt-motion-duration-slow)",
        "slower": "var(--nt-motion-duration-slower)",
        "skeleton-cycle": "var(--nt-motion-duration-skeleton-cycle)",
        "stream-caret": "var(--nt-motion-duration-stream-caret)",
        "flash": "var(--nt-motion-duration-flash)"
      },
      "transitionTimingFunction": {
        "standard": "var(--nt-motion-easing-standard)",
        "decelerate": "var(--nt-motion-easing-decelerate)",
        "accelerate": "var(--nt-motion-easing-accelerate)",
        "spring": "var(--nt-motion-easing-spring)",
        "linear": "var(--nt-motion-easing-linear)"
      },
      "maxWidth": {
        "container-sm": "var(--nt-size-container-sm)",
        "container-md": "var(--nt-size-container-md)",
        "container-lg": "var(--nt-size-container-lg)",
        "container-xl": "var(--nt-size-container-xl)",
        "container-2xl": "var(--nt-size-container-2xl)",
        "container-prose": "var(--nt-size-container-prose)"
      },
      "height": {
        "control-xs": "var(--nt-size-control-xs)",
        "control-sm": "var(--nt-size-control-sm)",
        "control-md": "var(--nt-size-control-md)",
        "control-lg": "var(--nt-size-control-lg)",
        "control-xl": "var(--nt-size-control-xl)"
      },
      "width": {
        "icon-xs": "var(--nt-size-icon-xs)",
        "icon-sm": "var(--nt-size-icon-sm)",
        "icon-md": "var(--nt-size-icon-md)",
        "icon-lg": "var(--nt-size-icon-lg)",
        "icon-xl": "var(--nt-size-icon-xl)",
        "icon-2xl": "var(--nt-size-icon-2xl)"
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
