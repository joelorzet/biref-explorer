'use client';

import { type ReactNode, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Minimal hover tooltip. Renders the trigger inline and portals the
 * bubble to document.body with fixed positioning so it escapes every
 * ancestor overflow/stacking context. Purely hover-driven; no click,
 * no focus, no state beyond "am I hovered".
 */
export function Tooltip({ content, children, className = '' }: Props) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const show = () => {
    const node = triggerRef.current;
    if (node) {
      setRect(node.getBoundingClientRect());
    }
  };
  const hide = () => setRect(null);

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: tooltip
          trigger intentionally stays a non-interactive span; the
          children keep their own semantics. */}
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={className}
      >
        {children}
      </span>
      {rect &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[200] w-60 -translate-x-1/2 -translate-y-full rounded-md border border-border-strong bg-bg-panel px-2.5 py-1.5 text-center font-sans text-[10px] leading-snug text-ink shadow-panel ring-1 ring-black/30"
            style={{
              left: rect.left + rect.width / 2,
              top: rect.top - 6,
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
