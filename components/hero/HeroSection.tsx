import { cookies, headers } from "next/headers";
import type { HeroRegion, HeroSectionProps } from "@/types/hero";
import { createPostHogClient } from "@/lib/posthog";
import { HeroDefault } from "./HeroDefault";
import { HeroUk } from "./HeroUk";
import { HeroUs } from "./HeroUs";

const HERO_FLAG_KEY = "hero-section-regional";

/**
 * Maps a Vercel country code to a regional hero when flags are unavailable.
 */
function regionFromCountry(countryCode: string): HeroRegion {
  if (countryCode === "US") {
    return "us";
  }

  if (countryCode === "GB") {
    return "uk";
  }

  return "default";
}

/**
 * Maps a PostHog flag variant to a regional hero.
 */
function regionFromFlag(variant: string | boolean | undefined): HeroRegion | null {
  if (variant === "us-hero") {
    return "us";
  }

  if (variant === "uk-hero") {
    return "uk";
  }

  if (variant === "default-hero" || variant === true) {
    return "default";
  }

  return null;
}

/**
 * Returns a stable anonymous distinct id for server-side PostHog calls.
 */
async function getDistinctId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get("ph_distinct_id")?.value;

  if (existing) {
    return existing;
  }

  return crypto.randomUUID();
}

/**
 * Chooses the regional hero from an explicit override, PostHog flag, or country.
 */
async function resolveHeroRegion(override?: HeroRegion): Promise<HeroRegion> {
  if (override) {
    return override;
  }

  const headersList = await headers();
  const countryCode = headersList.get("x-vercel-ip-country") || "US";
  const posthog = createPostHogClient();

  if (!posthog) {
    return regionFromCountry(countryCode);
  }

  try {
    const distinctId = await getDistinctId();
    const variant = await posthog.getFeatureFlag(HERO_FLAG_KEY, distinctId, {
      personProperties: {
        $geoip_country_code: countryCode,
      },
    });

    return regionFromFlag(variant) ?? regionFromCountry(countryCode);
  } finally {
    await posthog.shutdown();
  }
}

/**
 * Renders the US, UK, or default hero based on region or PostHog targeting.
 */
export async function HeroSection({ region, className }: HeroSectionProps) {
  const resolvedRegion = await resolveHeroRegion(region);

  if (resolvedRegion === "us") {
    return <HeroUs className={className} />;
  }

  if (resolvedRegion === "uk") {
    return <HeroUk className={className} />;
  }

  return <HeroDefault className={className} />;
}
