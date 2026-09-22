import type { HeroFlagVariant, HeroRegion } from "@/types/hero";

/** PostHog multivariate flag that controls which hero is shown. */
export const HERO_FLAG_KEY = "hero-section-regional";

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
