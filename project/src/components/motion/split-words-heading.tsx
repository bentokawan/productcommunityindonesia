"use client";

import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";

gsap.registerPlugin(ScrollTrigger);

export interface SplitWordsHeadingProps {
  as?: "h1" | "h2" | "h3";
  mode?: "mount" | "scroll";
  className?: string;
  children: ReactNode;
}

function renderSplitContent(node: ReactNode): ReactNode {
  if (
    node === null ||
    node === undefined ||
    typeof node === "boolean"
  ) {
    return node;
  }

  if (typeof node === "string" || typeof node === "number") {
    const parts = String(node).split(/(\s+)/);
    return parts.map((part, idx) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) {
        return <Fragment key={`ws-${idx}`}>{part}</Fragment>;
      }
      return (
        <span
          key={`w-${idx}`}
          className="inline-block overflow-y-clip py-[0.14em] -my-[0.14em] align-bottom"
        >
          <span data-split-word="" className="inline-block">
            {part}
          </span>
        </span>
      );
    });
  }

  if (Array.isArray(node)) {
    return Children.map(node, (child, idx) => (
      <Fragment key={`arr-${idx}`}>{renderSplitContent(child)}</Fragment>
    ));
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(node, {
      children: renderSplitContent(node.props.children),
    });
  }

  return node;
}

export function SplitWordsHeading({
  as: Tag = "h2",
  mode = "scroll",
  className,
  children,
}: SplitWordsHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotionSafe();

  useEffect(() => {
    const el = headingRef.current;
    if (!el || reducedMotion) return;

    const words = el.querySelectorAll<HTMLElement>("[data-split-word]");
    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      if (mode === "mount") {
        gsap.from(words, {
          yPercent: 115,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.04,
          clearProps: "transform",
        });
      } else {
        gsap.from(words, {
          yPercent: 115,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.035,
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      }
    }, headingRef);

    return () => ctx.revert();
  }, [mode, reducedMotion]);

  return (
    <Tag ref={headingRef} className={className}>
      {renderSplitContent(children)}
    </Tag>
  );
}
