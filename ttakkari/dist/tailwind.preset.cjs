// Ttakkari Tailwind preset · 자동 생성
// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드한다. 다크는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": {
          "canvas": "var(--tk-color-surface-canvas)",
          "subtle": "var(--tk-color-surface-subtle)",
          "default": "var(--tk-color-surface-default)",
          "raised": "var(--tk-color-surface-raised)",
          "sunken": "var(--tk-color-surface-sunken)",
          "muted": "var(--tk-color-surface-muted)",
          "overlay": "var(--tk-color-surface-overlay)",
          "inverse": "var(--tk-color-surface-inverse)",
          "brand": "var(--tk-color-surface-brand)",
          "brand-subtle": "var(--tk-color-surface-brand-subtle)",
          "agent-subtle": "var(--tk-color-surface-agent-subtle)",
          "disabled": "var(--tk-color-surface-disabled)"
        },
        "text": {
          "primary": "var(--tk-color-text-primary)",
          "secondary": "var(--tk-color-text-secondary)",
          "tertiary": "var(--tk-color-text-tertiary)",
          "placeholder": "var(--tk-color-text-placeholder)",
          "disabled": "var(--tk-color-text-disabled)",
          "inverse": "var(--tk-color-text-inverse)",
          "on-brand": "var(--tk-color-text-on-brand)",
          "brand": "var(--tk-color-text-brand)",
          "link": "var(--tk-color-text-link)",
          "link-hover": "var(--tk-color-text-link-hover)",
          "agent": "var(--tk-color-text-agent)",
          "success": "var(--tk-color-text-success)",
          "warning": "var(--tk-color-text-warning)",
          "danger": "var(--tk-color-text-danger)",
          "info": "var(--tk-color-text-info)"
        },
        "border": {
          "subtle": "var(--tk-color-border-subtle)",
          "default": "var(--tk-color-border-default)",
          "strong": "var(--tk-color-border-strong)",
          "brand": "var(--tk-color-border-brand)",
          "focus": "var(--tk-color-border-focus)",
          "agent": "var(--tk-color-border-agent)",
          "danger": "var(--tk-color-border-danger)",
          "inverse": "var(--tk-color-border-inverse)"
        },
        "action": {
          "primary": {
            "bg": "var(--tk-color-action-primary-bg)",
            "bg-hover": "var(--tk-color-action-primary-bg-hover)",
            "bg-active": "var(--tk-color-action-primary-bg-active)",
            "text": "var(--tk-color-action-primary-text)"
          },
          "secondary": {
            "bg": "var(--tk-color-action-secondary-bg)",
            "bg-hover": "var(--tk-color-action-secondary-bg-hover)",
            "bg-active": "var(--tk-color-action-secondary-bg-active)",
            "border": "var(--tk-color-action-secondary-border)",
            "text": "var(--tk-color-action-secondary-text)"
          },
          "ghost": {
            "bg": "var(--tk-color-action-ghost-bg)",
            "bg-hover": "var(--tk-color-action-ghost-bg-hover)",
            "bg-active": "var(--tk-color-action-ghost-bg-active)",
            "text": "var(--tk-color-action-ghost-text)"
          },
          "danger": {
            "bg": "var(--tk-color-action-danger-bg)",
            "bg-hover": "var(--tk-color-action-danger-bg-hover)",
            "bg-active": "var(--tk-color-action-danger-bg-active)",
            "text": "var(--tk-color-action-danger-text)"
          },
          "disabled": {
            "bg": "var(--tk-color-action-disabled-bg)",
            "text": "var(--tk-color-action-disabled-text)",
            "border": "var(--tk-color-action-disabled-border)"
          }
        },
        "status": {
          "info": {
            "bg": "var(--tk-color-status-info-bg)",
            "border": "var(--tk-color-status-info-border)",
            "text": "var(--tk-color-status-info-text)",
            "icon": "var(--tk-color-status-info-icon)",
            "solid": "var(--tk-color-status-info-solid)",
            "on-solid": "var(--tk-color-status-info-on-solid)"
          },
          "success": {
            "bg": "var(--tk-color-status-success-bg)",
            "border": "var(--tk-color-status-success-border)",
            "text": "var(--tk-color-status-success-text)",
            "icon": "var(--tk-color-status-success-icon)",
            "solid": "var(--tk-color-status-success-solid)",
            "on-solid": "var(--tk-color-status-success-on-solid)"
          },
          "warning": {
            "bg": "var(--tk-color-status-warning-bg)",
            "border": "var(--tk-color-status-warning-border)",
            "text": "var(--tk-color-status-warning-text)",
            "icon": "var(--tk-color-status-warning-icon)",
            "solid": "var(--tk-color-status-warning-solid)",
            "on-solid": "var(--tk-color-status-warning-on-solid)"
          },
          "danger": {
            "bg": "var(--tk-color-status-danger-bg)",
            "border": "var(--tk-color-status-danger-border)",
            "text": "var(--tk-color-status-danger-text)",
            "icon": "var(--tk-color-status-danger-icon)",
            "solid": "var(--tk-color-status-danger-solid)",
            "on-solid": "var(--tk-color-status-danger-on-solid)"
          },
          "neutral": {
            "bg": "var(--tk-color-status-neutral-bg)",
            "border": "var(--tk-color-status-neutral-border)",
            "text": "var(--tk-color-status-neutral-text)",
            "icon": "var(--tk-color-status-neutral-icon)",
            "solid": "var(--tk-color-status-neutral-solid)",
            "on-solid": "var(--tk-color-status-neutral-on-solid)"
          }
        },
        "agent": {
          "live": "var(--tk-color-agent-live)",
          "on-ink": "var(--tk-color-agent-on-ink)",
          "bg": "var(--tk-color-agent-bg)",
          "border": "var(--tk-color-agent-border)",
          "text": "var(--tk-color-agent-text)",
          "avatar-bg": "var(--tk-color-agent-avatar-bg)",
          "avatar-fg": "var(--tk-color-agent-avatar-fg)",
          "avatar-dot": "var(--tk-color-agent-avatar-dot)"
        },
        "run": {
          "queued": {
            "bg": "var(--tk-color-run-queued-bg)",
            "border": "var(--tk-color-run-queued-border)",
            "text": "var(--tk-color-run-queued-text)",
            "icon": "var(--tk-color-run-queued-icon)"
          },
          "running": {
            "bg": "var(--tk-color-run-running-bg)",
            "border": "var(--tk-color-run-running-border)",
            "text": "var(--tk-color-run-running-text)",
            "icon": "var(--tk-color-run-running-icon)"
          },
          "waiting": {
            "bg": "var(--tk-color-run-waiting-bg)",
            "border": "var(--tk-color-run-waiting-border)",
            "text": "var(--tk-color-run-waiting-text)",
            "icon": "var(--tk-color-run-waiting-icon)"
          },
          "succeeded": {
            "bg": "var(--tk-color-run-succeeded-bg)",
            "border": "var(--tk-color-run-succeeded-border)",
            "text": "var(--tk-color-run-succeeded-text)",
            "icon": "var(--tk-color-run-succeeded-icon)"
          },
          "failed": {
            "bg": "var(--tk-color-run-failed-bg)",
            "border": "var(--tk-color-run-failed-border)",
            "text": "var(--tk-color-run-failed-text)",
            "icon": "var(--tk-color-run-failed-icon)"
          },
          "cancelled": {
            "bg": "var(--tk-color-run-cancelled-bg)",
            "border": "var(--tk-color-run-cancelled-border)",
            "text": "var(--tk-color-run-cancelled-text)",
            "icon": "var(--tk-color-run-cancelled-icon)"
          }
        },
        "policy": {
          "allowed": {
            "bg": "var(--tk-color-policy-allowed-bg)",
            "border": "var(--tk-color-policy-allowed-border)",
            "text": "var(--tk-color-policy-allowed-text)",
            "icon": "var(--tk-color-policy-allowed-icon)"
          },
          "approval": {
            "bg": "var(--tk-color-policy-approval-bg)",
            "border": "var(--tk-color-policy-approval-border)",
            "text": "var(--tk-color-policy-approval-text)",
            "icon": "var(--tk-color-policy-approval-icon)"
          },
          "blocked": {
            "bg": "var(--tk-color-policy-blocked-bg)",
            "border": "var(--tk-color-policy-blocked-border)",
            "text": "var(--tk-color-policy-blocked-text)",
            "icon": "var(--tk-color-policy-blocked-icon)"
          },
          "restricted": {
            "bg": "var(--tk-color-policy-restricted-bg)",
            "border": "var(--tk-color-policy-restricted-border)",
            "text": "var(--tk-color-policy-restricted-text)",
            "icon": "var(--tk-color-policy-restricted-icon)"
          }
        },
        "filetype": {
          "doc": {
            "bg": "var(--tk-color-filetype-doc-bg)",
            "fg": "var(--tk-color-filetype-doc-fg)"
          },
          "pdf": {
            "bg": "var(--tk-color-filetype-pdf-bg)",
            "fg": "var(--tk-color-filetype-pdf-fg)"
          },
          "slide": {
            "bg": "var(--tk-color-filetype-slide-bg)",
            "fg": "var(--tk-color-filetype-slide-fg)"
          },
          "sheet": {
            "bg": "var(--tk-color-filetype-sheet-bg)",
            "fg": "var(--tk-color-filetype-sheet-fg)"
          },
          "image": {
            "bg": "var(--tk-color-filetype-image-bg)",
            "fg": "var(--tk-color-filetype-image-fg)"
          },
          "code": {
            "bg": "var(--tk-color-filetype-code-bg)",
            "fg": "var(--tk-color-filetype-code-fg)"
          },
          "other": {
            "bg": "var(--tk-color-filetype-other-bg)",
            "fg": "var(--tk-color-filetype-other-fg)"
          }
        },
        "ink": {
          "bg": "var(--tk-color-ink-bg)",
          "bg-header": "var(--tk-color-ink-bg-header)",
          "border": "var(--tk-color-ink-border)",
          "text": "var(--tk-color-ink-text)",
          "text-muted": "var(--tk-color-ink-text-muted)",
          "comment": "var(--tk-color-ink-comment)",
          "keyword": "var(--tk-color-ink-keyword)",
          "string": "var(--tk-color-ink-string)",
          "function": "var(--tk-color-ink-function)",
          "number": "var(--tk-color-ink-number)",
          "type": "var(--tk-color-ink-type)",
          "punctuation": "var(--tk-color-ink-punctuation)",
          "line-number": "var(--tk-color-ink-line-number)",
          "line-highlight": "var(--tk-color-ink-line-highlight)",
          "line-highlight-marker": "var(--tk-color-ink-line-highlight-marker)",
          "added-bg": "var(--tk-color-ink-added-bg)",
          "added-sign": "var(--tk-color-ink-added-sign)",
          "removed-bg": "var(--tk-color-ink-removed-bg)",
          "removed-sign": "var(--tk-color-ink-removed-sign)",
          "selection": "var(--tk-color-ink-selection)",
          "caret": "var(--tk-color-ink-caret)",
          "hover": "var(--tk-color-ink-hover)",
          "log-time": "var(--tk-color-ink-log-time)",
          "log-info": "var(--tk-color-ink-log-info)",
          "log-debug": "var(--tk-color-ink-log-debug)",
          "log-tool": "var(--tk-color-ink-log-tool)",
          "log-ok": "var(--tk-color-ink-log-ok)",
          "log-warn": "var(--tk-color-ink-log-warn)",
          "log-error": "var(--tk-color-ink-log-error)",
          "bg-inline": "var(--tk-color-ink-bg-inline)",
          "text-inline": "var(--tk-color-ink-text-inline)"
        },
        "viewer": {
          "desk": "var(--tk-color-viewer-desk)",
          "page": "var(--tk-color-viewer-page)",
          "page-border": "var(--tk-color-viewer-page-border)",
          "frame-bg": "var(--tk-color-viewer-frame-bg)",
          "checker-a": "var(--tk-color-viewer-checker-a)",
          "checker-b": "var(--tk-color-viewer-checker-b)",
          "grid-line": "var(--tk-color-viewer-grid-line)",
          "grid-head": "var(--tk-color-viewer-grid-head)",
          "grid-head-text": "var(--tk-color-viewer-grid-head-text)"
        },
        "highlight": {
          "mark": "var(--tk-color-highlight-mark)",
          "mark-text": "var(--tk-color-highlight-mark-text)",
          "mark-active": "var(--tk-color-highlight-mark-active)",
          "mark-active-text": "var(--tk-color-highlight-mark-active-text)"
        },
        "presence": {
          "online": "var(--tk-color-presence-online)",
          "connecting": "var(--tk-color-presence-connecting)",
          "offline": "var(--tk-color-presence-offline)"
        },
        "interactive": {
          "focus-ring": "var(--tk-color-interactive-focus-ring)",
          "selected-bg": "var(--tk-color-interactive-selected-bg)",
          "selected-border": "var(--tk-color-interactive-selected-border)",
          "selected-text": "var(--tk-color-interactive-selected-text)",
          "hover-overlay": "var(--tk-color-interactive-hover-overlay)",
          "pressed-overlay": "var(--tk-color-interactive-pressed-overlay)",
          "selection": "var(--tk-color-interactive-selection)"
        },
        "accent": {
          "blue": "var(--tk-color-accent-blue)",
          "mint": "var(--tk-color-accent-mint)",
          "mint-soft": "var(--tk-color-accent-mint-soft)",
          "ink": "var(--tk-color-accent-ink)",
          "paper": "var(--tk-color-accent-paper)"
        },
        "chart": {
          "categorical": {
            "1": "var(--tk-color-chart-categorical-1)",
            "2": "var(--tk-color-chart-categorical-2)",
            "3": "var(--tk-color-chart-categorical-3)",
            "4": "var(--tk-color-chart-categorical-4)",
            "5": "var(--tk-color-chart-categorical-5)",
            "6": "var(--tk-color-chart-categorical-6)"
          },
          "sequential": {
            "1": "var(--tk-color-chart-sequential-1)",
            "2": "var(--tk-color-chart-sequential-2)",
            "3": "var(--tk-color-chart-sequential-3)",
            "4": "var(--tk-color-chart-sequential-4)",
            "5": "var(--tk-color-chart-sequential-5)",
            "6": "var(--tk-color-chart-sequential-6)",
            "7": "var(--tk-color-chart-sequential-7)"
          },
          "grid": "var(--tk-color-chart-grid)",
          "axis": "var(--tk-color-chart-axis)",
          "label": "var(--tk-color-chart-label)"
        }
      },
      "spacing": {
        "0": "var(--tk-space-0)",
        "1": "var(--tk-space-1)",
        "2": "var(--tk-space-2)",
        "3": "var(--tk-space-3)",
        "4": "var(--tk-space-4)",
        "5": "var(--tk-space-5)",
        "6": "var(--tk-space-6)",
        "8": "var(--tk-space-8)",
        "10": "var(--tk-space-10)",
        "12": "var(--tk-space-12)",
        "16": "var(--tk-space-16)",
        "20": "var(--tk-space-20)",
        "24": "var(--tk-space-24)",
        "px": "var(--tk-space-px)",
        "0.5": "var(--tk-space-0-5)",
        "1.5": "var(--tk-space-1-5)"
      },
      "borderRadius": {
        "none": "var(--tk-radius-none)",
        "xs": "var(--tk-radius-xs)",
        "sm": "var(--tk-radius-sm)",
        "md": "var(--tk-radius-md)",
        "lg": "var(--tk-radius-lg)",
        "xl": "var(--tk-radius-xl)",
        "2xl": "var(--tk-radius-2xl)",
        "full": "var(--tk-radius-full)"
      },
      "borderWidth": {
        "hairline": "var(--tk-border-width-hairline)",
        "strong": "var(--tk-border-width-strong)",
        "accent": "var(--tk-border-width-accent)"
      },
      "boxShadow": {
        "xs": "var(--tk-shadow-xs)",
        "sm": "var(--tk-shadow-sm)",
        "md": "var(--tk-shadow-md)",
        "lg": "var(--tk-shadow-lg)"
      },
      "fontFamily": {
        "sans": "var(--tk-font-family-sans)",
        "mono": "var(--tk-font-family-mono)"
      },
      "fontSize": {
        "xs": "var(--tk-font-size-xs)",
        "sm": "var(--tk-font-size-sm)",
        "md": "var(--tk-font-size-md)",
        "lg": "var(--tk-font-size-lg)",
        "xl": "var(--tk-font-size-xl)",
        "2xl": "var(--tk-font-size-2xl)",
        "3xl": "var(--tk-font-size-3xl)",
        "4xl": "var(--tk-font-size-4xl)"
      },
      "lineHeight": {
        "none": "var(--tk-font-line-height-none)",
        "snug": "var(--tk-font-line-height-snug)",
        "heading": "var(--tk-font-line-height-heading)",
        "normal": "var(--tk-font-line-height-normal)",
        "relaxed": "var(--tk-font-line-height-relaxed)",
        "prose": "var(--tk-font-line-height-prose)"
      },
      "letterSpacing": {
        "tight": "var(--tk-font-letter-spacing-tight)",
        "snug": "var(--tk-font-letter-spacing-snug)",
        "normal": "var(--tk-font-letter-spacing-normal)",
        "wide": "var(--tk-font-letter-spacing-wide)"
      },
      "fontWeight": {
        "regular": "var(--tk-font-weight-regular)",
        "medium": "var(--tk-font-weight-medium)",
        "semibold": "var(--tk-font-weight-semibold)",
        "bold": "var(--tk-font-weight-bold)"
      },
      "zIndex": {
        "hide": "var(--tk-z-index-hide)",
        "base": "var(--tk-z-index-base)",
        "raised": "var(--tk-z-index-raised)",
        "sticky": "var(--tk-z-index-sticky)",
        "dropdown": "var(--tk-z-index-dropdown)",
        "overlay": "var(--tk-z-index-overlay)",
        "modal": "var(--tk-z-index-modal)",
        "popover": "var(--tk-z-index-popover)",
        "toast": "var(--tk-z-index-toast)",
        "tooltip": "var(--tk-z-index-tooltip)"
      },
      "transitionDuration": {
        "instant": "var(--tk-motion-duration-instant)",
        "fast": "var(--tk-motion-duration-fast)",
        "normal": "var(--tk-motion-duration-normal)",
        "slow": "var(--tk-motion-duration-slow)",
        "tooltip-delay": "var(--tk-motion-duration-tooltip-delay)",
        "live": "var(--tk-motion-duration-live)",
        "feedback": "var(--tk-motion-duration-feedback)",
        "toast": "var(--tk-motion-duration-toast)"
      },
      "transitionTimingFunction": {
        "standard": "var(--tk-motion-easing-standard)",
        "enter": "var(--tk-motion-easing-enter)",
        "exit": "var(--tk-motion-easing-exit)",
        "linear": "var(--tk-motion-easing-linear)"
      },
      "maxWidth": {
        "container-sm": "var(--tk-size-container-sm)",
        "container-prose": "var(--tk-size-container-prose)",
        "container-thread": "var(--tk-size-container-thread)",
        "container-md": "var(--tk-size-container-md)",
        "container-lg": "var(--tk-size-container-lg)",
        "container-xl": "var(--tk-size-container-xl)"
      },
      "height": {
        "control-xs": "var(--tk-size-control-xs)",
        "control-sm": "var(--tk-size-control-sm)",
        "control-md": "var(--tk-size-control-md)",
        "control-lg": "var(--tk-size-control-lg)"
      },
      "width": {
        "icon-xs": "var(--tk-size-icon-xs)",
        "icon-sm": "var(--tk-size-icon-sm)",
        "icon-md": "var(--tk-size-icon-md)",
        "icon-lg": "var(--tk-size-icon-lg)",
        "icon-xl": "var(--tk-size-icon-xl)"
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
