"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import type { HeroRegion, HeroSectionProps } from "@/types/hero";
import { HERO_FLAG_KEY, regionFromFlag } from "@/lib/hero-flag";
import { HeroDefault } from "./HeroDefault";
import { HeroUk } from "./HeroUk";
import { HeroUs } from "./HeroUs";
import "./hero.css";

/**
 * Renders the hero chosen by PostHog feature flags.
 * Country targeting uses PostHog GeoIP on the flag request — not Vercel headers.
 */
export function HeroSection({ region: regionOverride, className }: HeroSectionProps) {
  const [region, setRegion] = useState<HeroRegion | null>(regionOverride ?? null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    // Prop override is for local previews; still report to PostHog.
    if (regionOverride) {
      setRegion(regionOverride);

      if (!hasTrackedView.current) {
        hasTrackedView.current = true;
        posthog.capture("hero_viewed", {
          hero: regionOverride,
          hero_flag_key: HERO_FLAG_KEY,
          decision_source: "override",
        });
      }

      return;
    }

    /**
     * Reads the multivariate flag after PostHog has evaluated GeoIP targeting.
     */
    function applyFlagFromPostHog(): void {
      const flagValue = posthog.getFeatureFlag(HERO_FLAG_KEY);

      // undefined means flags have not loaded yet — wait for onFeatureFlags.
      if (flagValue === undefined) {
        return;
      }

      const { region: nextRegion, flagVariant } = regionFromFlag(flagValue);
      setRegion(nextRegion);

      if (!hasTrackedView.current) {
        hasTrackedView.current = true;
        posthog.capture("hero_viewed", {
          hero: nextRegion,
          hero_flag_key: HERO_FLAG_KEY,
          hero_flag_variant: flagVariant,
          decision_source: "posthog_flag",
        });
      }
    }

    applyFlagFromPostHog();
    posthog.onFeatureFlags(applyFlagFromPostHog);
  }, [regionOverride]);

  // Brief placeholder while PostHog loads GeoIP-targeted flags.
  if (!region) {
    return (
      <section
        className={`hero hero--world ${className ?? ""}`.trim()}
        aria-busy="true"
        aria-label="Loading Hoggies hero"
      />
    );
  }

  if (region === "us") {
    return <HeroUs className={className} />;
  }

  if (region === "uk") {
    return <HeroUk className={className} />;
  }

  return <HeroDefault className={className} />;
}
