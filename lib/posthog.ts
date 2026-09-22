import { PostHog } from "posthog-node";
import type { HeroDecision, HeroFlagVariant, HeroRegion } from "@/types/hero";

/** PostHog multivariate flag that controls which hero is shown. */
export const HERO_FLAG_KEY = "hero-section-regional";

/**
 * Creates a short-lived PostHog Node client for server-side flags and events.
 */
export function createPostHogClient(): PostHog | null {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    return null;
  }

  return new PostHog(projectToken, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });
}

/**
 * Maps a PostHog flag variant to a regional hero.
 * Unknown values fall through to the default hero so PostHog stays in control.
 */
export function regionFromFlag(variant: string | boolean | undefined): {
  region: HeroRegion;
  flagVariant: HeroFlagVariant | null;
} {
  if (variant === "us-hero") {
    return { region: "us", flagVariant: "us-hero" };
  }

  if (variant === "uk-hero") {
    return { region: "uk", flagVariant: "uk-hero" };
  }

  if (variant === "default-hero") {
    return { region: "default", flagVariant: "default-hero" };
  }

  return { region: "default", flagVariant: null };
}

/**
 * Returns true when the country code is a real ISO value (not unknown).
 */
export function isKnownCountry(country: string): boolean {
  return Boolean(country) && country !== "ZZ" && country !== "XX" && country !== "T1";
}

/**
 * Sends a hero impression event so PostHog can monitor views by country and variant.
 * Only sets person country when known, so we never overwrite GeoIP with ZZ.
 */
export function captureHeroViewed(posthog: PostHog, decision: HeroDecision): void {
  const knownCountry = isKnownCountry(decision.country);

  if (knownCountry) {
    posthog.capture({
      distinctId: decision.distinctId,
      event: "hero_viewed",
      properties: {
        hero: decision.region,
        country: decision.country,
        $geoip_country_code: decision.country,
        hero_flag_key: decision.flagKey,
        hero_flag_variant: decision.flagVariant,
        decision_source: decision.source,
        country_known: true,
        $set: {
          country: decision.country,
          $geoip_country_code: decision.country,
          last_hero_seen: decision.region,
          last_hero_country: decision.country,
        },
      },
    });
    return;
  }

  // Unknown country: do not $set country/ZZ over PostHog's own GeoIP data.
  posthog.capture({
    distinctId: decision.distinctId,
    event: "hero_viewed",
    properties: {
      hero: decision.region,
      hero_flag_key: decision.flagKey,
      hero_flag_variant: decision.flagVariant,
      decision_source: decision.source,
      country_known: false,
      $set: {
        last_hero_seen: decision.region,
      },
    },
  });
}
