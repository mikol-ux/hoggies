"use client";

import posthog from "posthog-js";
import type { HeroCtaProps } from "@/types/hero";

/**
 * Hero CTA link that reports clicks to PostHog for funnel monitoring.
 * Country is added automatically by PostHog GeoIP on the client event.
 */
export function HeroCta({
  href,
  children,
  className = "",
  hero,
  action,
}: HeroCtaProps) {
  /**
   * Captures a CTA click before navigation so PostHog can attribute conversions by hero.
   */
  function handleClick(): void {
    posthog.capture("hero_cta_clicked", {
      hero,
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
