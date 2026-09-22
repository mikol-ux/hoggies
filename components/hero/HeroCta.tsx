"use client";

import posthog from "posthog-js";
import type { HeroCtaProps } from "@/types/hero";

/**
 * Hero CTA link that reports clicks to PostHog for funnel monitoring.
 */
export function HeroCta({
  href,
  children,
  className = "",
  hero,
  country,
  action,
}: HeroCtaProps) {
  /**
   * Captures a CTA click before navigation so PostHog can attribute conversions by hero.
   */
  function handleClick(): void {
    posthog.capture("hero_cta_clicked", {
      hero,
      country,
      cta: action,
      href,
    });
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
