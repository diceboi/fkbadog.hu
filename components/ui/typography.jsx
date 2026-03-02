/**
 * FK Tető – Typography UI Components
 *
 * Perfect Fourth fluid type scale (ratio 1.333) using CSS clamp()
 * Viewport range: 320px → 1440px
 *
 * Usage:
 *   import { H1, H2, H3, H4, H5, H6, P, Lead, Small, Span, Label } from "@/components/ui/typography"
 *
 *   <H1>Bádogos és Tetőfedő Anyag</H1>
 *   <Lead>Prémium alumínium szellőzők...</Lead>
 *   <P>Lorem ipsum...</P>
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ── Heading Components ────────────────────────────────────────────────────────

/**
 * H1 — fluid: clamp(2.375rem, 4.643vw + 1.446rem, 5.625rem)
 * ~38px → ~90px  |  Perfect Fourth × 5
 */
export function H1({ children, className, style, as: Tag = "h1", ...props }) {
  return (
    <Tag className={cx("type-h1", className)} style={style} {...props}>
      {children}
    </Tag>
  );
}

/**
 * H2 — fluid: clamp(1.778rem, 2.483vw + 1.281rem, 3.516rem)
 * ~28px → ~56px  |  Perfect Fourth × 4
 */
export function H2({ children, className, style, as: Tag = "h2", ...props }) {
  return (
    <Tag className={cx("type-h2", className)} style={style} {...props}>
      {children}
    </Tag>
  );
}

/**
 * H3 — fluid: clamp(1.333rem, 1.862vw + 0.961rem, 2.637rem)
 * ~21px → ~42px  |  Perfect Fourth × 3
 */
export function H3({ children, className, style, as: Tag = "h3", ...props }) {
  return (
    <Tag className={cx("type-h3", className)} style={style} {...props}>
      {children}
    </Tag>
  );
}

/**
 * H4 — fluid: clamp(1rem, 1.396vw + 0.721rem, 1.978rem)
 * ~16px → ~31px  |  Perfect Fourth × 2
 */
export function H4({ children, className, style, as: Tag = "h4", ...props }) {
  return (
    <Tag className={cx("type-h4", className)} style={style} {...props}>
      {children}
    </Tag>
  );
}

/**
 * H5 — fluid: clamp(0.875rem, 0.654vw + 0.744rem, 1.333rem)
 * ~14px → ~21px  |  Perfect Fourth × 1
 */
export function H5({ children, className, style, as: Tag = "h5", ...props }) {
  return (
    <Tag className={cx("type-h5", className)} style={style} {...props}>
      {children}
    </Tag>
  );
}

/**
 * H6 — fluid: clamp(0.75rem, 0.357vw + 0.679rem, 1rem)
 * ~12px → ~16px  |  Perfect Fourth × 0
 */
export function H6({ children, className, style, as: Tag = "h6", ...props }) {
  return (
    <Tag className={cx("type-h6", className)} style={style} {...props}>
      {children}
    </Tag>
  );
}

// ── Body Text Components ──────────────────────────────────────────────────────

/**
 * Lead — larger introductory paragraph
 * fluid: clamp(1.0625rem, 0.357vw + 0.991rem, 1.3125rem)
 * ~17px → ~21px
 */
export function Lead({ children, className, style, ...props }) {
  return (
    <p className={cx("type-lead", className)} style={style} {...props}>
      {children}
    </p>
  );
}

/**
 * P — standard body text
 * fluid: clamp(0.9375rem, 0.268vw + 0.884rem, 1.125rem)
 * ~15px → ~18px
 */
export function P({ children, className, style, ...props }) {
  return (
    <p className={cx("type-p", className)} style={style} {...props}>
      {children}
    </p>
  );
}

/**
 * Small — supporting / footnote text
 * fluid: clamp(0.75rem, 0.179vw + 0.714rem, 0.875rem)
 * ~12px → ~14px
 */
export function Small({ children, className, style, ...props }) {
  return (
    <small className={cx("type-small", className)} style={style} {...props}>
      {children}
    </small>
  );
}

/**
 * Span — inline text wrapper (no block behaviour)
 */
export function Span({ children, className, style, ...props }) {
  return (
    <span className={cx("type-span", className)} style={style} {...props}>
      {children}
    </span>
  );
}

/**
 * Label — uppercase tracking label / eyebrow text
 * Used for section labels, badges, overlines
 */
export function Label({ children, className, style, as: Tag = "span", ...props }) {
  return (
    <Tag className={cx("type-label", className)} style={style} {...props}>
      {children}
    </Tag>
  );
}

/**
 * Caption — tiny descriptive text, e.g. below images
 * ~11px → ~12px
 */
export function Caption({ children, className, style, ...props }) {
  return (
    <p className={cx("type-caption", className)} style={style} {...props}>
      {children}
    </p>
  );
}
