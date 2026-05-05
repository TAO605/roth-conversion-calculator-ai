export interface AccessibilityAuditCheck {
  label: string;
  standard: string;
  routeSample: string;
  action: string;
}

export interface AccessibilityAuditGroup {
  id: string;
  title: string;
  goal: string;
  checks: AccessibilityAuditCheck[];
}

function check(label: string, standard: string, routeSample: string, action: string): AccessibilityAuditCheck {
  return { label, standard, routeSample, action };
}

export function buildAccessibilityAuditGroups(): AccessibilityAuditGroup[] {
  return [
    {
      id: "keyboard",
      title: "Keyboard Navigation",
      goal: "Ensure users can operate the calculator and major content paths without a mouse.",
      checks: [
        check(
          "Complete calculator with keyboard only",
          "Keyboard navigation",
          "/#calculator",
          "Tab through inputs, scenario controls, result actions, share/copy buttons, and FAQ links without losing focus.",
        ),
        check(
          "Verify visible focus states",
          "WCAG 2.1 AA",
          "/",
          "Confirm links, buttons, inputs, and toggles show a visible focus indicator in light and dark mode.",
        ),
        check(
          "Check skip-free nav order",
          "Keyboard navigation",
          "/site-index",
          "Confirm long navigation and dense link pages follow a logical top-to-bottom order.",
        ),
      ],
    },
    {
      id: "screen-reader",
      title: "Screen Reader Support",
      goal: "Make calculator inputs, results, charts, and compliance pages understandable to assistive technology.",
      checks: [
        check(
          "Verify screen reader labels",
          "Apple VoiceOver",
          "/#calculator",
          "Use VoiceOver or another screen reader to confirm inputs, selects, warnings, and result cards have meaningful labels.",
        ),
        check(
          "Review heading hierarchy",
          "WCAG 2.1 AA",
          "/blog/what-is-a-roth-conversion-2026",
          "Inspect h1-h3 order so article and hub pages are navigable by heading.",
        ),
        check(
          "Check chart alternatives",
          "WCAG 2.1 AA",
          "/#calculator",
          "Confirm chart-adjacent result tables and summaries communicate key values without relying only on visuals.",
        ),
      ],
    },
    {
      id: "visual",
      title: "Visual Contrast and Layout",
      goal: "Keep Apple-style UI polish while meeting accessible contrast and responsive layout expectations.",
      checks: [
        check(
          "Check color contrast in light and dark mode",
          "WCAG 2.1 AA",
          "/seo-monitoring",
          "Review body text, muted text, badges, warnings, and links against both backgrounds.",
        ),
        check(
          "Confirm no text overlap on mobile",
          "WCAG 2.1 AA",
          "/",
          "Test narrow viewport navigation, calculator cards, and result actions for wrapping without overlap.",
        ),
        check(
          "Verify non-color cues",
          "WCAG 2.1 AA",
          "/#calculator",
          "Confirm warnings and statuses use labels or text, not color alone.",
        ),
      ],
    },
    {
      id: "motion",
      title: "Motion and Preferences",
      goal: "Respect users who prefer reduced motion while keeping the interface responsive.",
      checks: [
        check(
          "Respect reduced motion preferences",
          "Reduced motion",
          "/",
          "Enable reduced motion in the OS or browser and verify nonessential transitions do not block use.",
        ),
        check(
          "Check loading states",
          "WCAG 2.1 AA",
          "/#calculator",
          "Confirm lazy-loaded modules show stable placeholders and do not create confusing movement.",
        ),
      ],
    },
    {
      id: "forms",
      title: "Forms and Error States",
      goal: "Keep calculator inputs clear for mobile and assistive-technology users.",
      checks: [
        check(
          "Validate mobile input labels and errors",
          "WCAG 2.1 AA",
          "/#calculator",
          "Enter empty, negative, and very large values and confirm guidance remains readable and associated with fields.",
        ),
        check(
          "Check touch target sizing",
          "WCAG 2.1 AA",
          "/#calculator",
          "Review sliders, toggles, select controls, and action buttons on mobile-size viewports.",
        ),
        check(
          "Confirm disclaimer readability",
          "WCAG 2.1 AA",
          "/disclaimer",
          "Verify required educational disclaimer text remains readable and not hidden behind interactions.",
        ),
      ],
    },
  ];
}

export function getAccessibilityAuditSummary(groups: AccessibilityAuditGroup[]) {
  const checks = groups.flatMap((group) => group.checks);

  return {
    totalGroups: groups.length,
    totalChecks: checks.length,
    standards: Array.from(new Set(checks.map((check) => check.standard))),
  };
}
