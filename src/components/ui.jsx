import { Link } from "react-router-dom";
import { Reveal } from "../lib/motion";

export function ArrowIcon({ className = "h-3 w-3" }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 2.5h6v6M9.5 2.5 2.5 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Asterisk({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 1.5v13M2.4 4.25l11.2 7.5M13.6 4.25 2.4 11.75"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Pill button with the black circular arrow. Renders as Link or <a>. */
export function PillButton({
  to,
  href,
  children,
  accent = false,
  className = "",
  ...rest
}) {
  const cls = `btn-pill ${accent ? "btn-pill-accent" : ""} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <span className="arrow-dot">
        <ArrowIcon />
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} {...rest}>
      {inner}
    </Link>
  );
}

export function Eyebrow({ children, className = "" }) {
  return <p className={`t-eyebrow ${className}`}>{children}</p>;
}

/**
 * The reference's repeating section head: eyebrow on a hairline, then a
 * large statement, optionally with supporting copy and an action to the right.
 */
export function SectionHeader({
  eyebrow,
  title,
  body,
  action,
  align = "split",
  className = "",
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <Reveal variant="fade" duration={0.8}>
          <div className="hairline mb-4" />
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}

      <div
        className={
          align === "split"
            ? "mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16"
            : "mt-6 max-w-3xl"
        }
      >
        <Reveal className="max-w-2xl">
          <h2 className="t-h1 text-balance">{title}</h2>
        </Reveal>

        {(body || action) && (
          <Reveal delay={0.08} className="md:max-w-sm md:shrink-0">
            {body && <p className="t-body">{body}</p>}
            {action && <div className={body ? "mt-6" : ""}>{action}</div>}
          </Reveal>
        )}
      </div>
    </div>
  );
}

/** Numbered index label — "01", "02" — used through the process sections. */
export function Ordinal({ n, className = "" }) {
  return (
    <span className={`t-eyebrow tabular-nums ${className}`}>
      {String(n).padStart(2, "0")}
    </span>
  );
}
