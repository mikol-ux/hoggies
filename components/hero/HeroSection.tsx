// Next.js server helpers: read request cookies and headers on the server.
import { cookies, headers } from "next/headers";
// Shared types for which hero to show and the component props.
import type { HeroDecision, HeroRegion, HeroSectionProps } from "@/types/hero";
// PostHog helpers for flag evaluation and impression monitoring.
import {
  HERO_FLAG_KEY,
  captureHeroViewed,
  createPostHogClient,
  regionFromFlag,
} from "@/lib/posthog";
// The three visual hero variants we can render.
import { HeroDefault } from "./HeroDefault";
import { HeroUk } from "./HeroUk";
import { HeroUs } from "./HeroUs";

/**
 * Reads the PostHog distinct id from the browser cookie when available.
 * Falls back to a generated id so server-side capture still works.
 */
async function getDistinctId(): Promise<string> {
  const cookieStore = await cookies();
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

  // Prefer the official posthog-js cookie so server and client share one person.
  if (projectToken) {
    const posthogCookie = cookieStore.get(`ph_${projectToken}_posthog`)?.value;

    if (posthogCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(posthogCookie)) as {
          distinct_id?: string;
        };

        if (parsed.distinct_id) {
          return parsed.distinct_id;
        }
      } catch {
        // Ignore malformed cookies and fall through to a generated id.
      }
    }
  }

  // Optional app cookie used when the PostHog cookie is not present yet.
  const existing = cookieStore.get("ph_distinct_id")?.value;

  if (existing) {
    return existing;
  }

  return crypto.randomUUID();
}

/**
 * Reads the visitor country from cookie, hosting geo headers, then optional local override.
 * Local `next dev` has no Vercel geo, so set DEV_COUNTRY=US (or GB) while testing.
 */
async function getRequestCountry(headersList: Headers): Promise<string> {
  const cookieStore = await cookies();
  const cookieCountry = cookieStore.get("visitor_country")?.value;

  if (cookieCountry && cookieCountry !== "ZZ") {
    return cookieCountry.toUpperCase();
  }

  const vercelCountry = headersList.get("x-vercel-ip-country");
  if (vercelCountry && vercelCountry !== "ZZ") {
    return vercelCountry.toUpperCase();
  }

  const cloudflareCountry = headersList.get("cf-ipcountry");
  if (cloudflareCountry && cloudflareCountry !== "XX" && cloudflareCountry !== "T1") {
    return cloudflareCountry.toUpperCase();
  }

  const devCountry = process.env.DEV_COUNTRY;
  if (devCountry) {
    return devCountry.toUpperCase();
  }

  // Unknown country (typical on localhost without DEV_COUNTRY).
  return "ZZ";
}

/**
 * Asks PostHog which hero to show, then records a monitored impression.
 * Country is only a PostHog person property — targeting rules live in the dashboard.
 */
async function decideAndTrackHero(override?: HeroRegion): Promise<HeroDecision> {
  const headersList = await headers();
  const country = await getRequestCountry(headersList);
  const distinctId = await getDistinctId();
  const posthog = createPostHogClient();
  const knownCountry = country !== "ZZ";

  let decision: HeroDecision;

  // Explicit prop override is for local testing; still reported to PostHog.
  if (override) {
    decision = {
      region: override,
      country,
      flagKey: HERO_FLAG_KEY,
      flagVariant: null,
      source: "override",
      distinctId,
    };
  } else if (!posthog) {
    // Without PostHog credentials the app cannot make a flag decision.
    decision = {
      region: "default",
      country,
      flagKey: HERO_FLAG_KEY,
      flagVariant: null,
      source: "posthog_missing",
      distinctId,
    };
  } else {
    // Ask PostHog which multivariate variant this visitor should receive.
    // Only pass country when known so we do not poison targeting with ZZ.
    const personProperties = knownCountry
      ? {
          country,
          $geoip_country_code: country,
        }
      : undefined;

    const variant = await posthog.getFeatureFlag(HERO_FLAG_KEY, distinctId, {
      personProperties,
    });

    const { region, flagVariant } = regionFromFlag(variant);

    decision = {
      region,
      country,
      flagKey: HERO_FLAG_KEY,
      flagVariant,
      source: "posthog_flag",
      distinctId,
    };
  }

  // Report every impression so Insights can break down views by hero and country.
  if (posthog) {
    try {
      captureHeroViewed(posthog, decision);
    } finally {
      await posthog.shutdown();
    }
  }

  return decision;
}

/**
 * Renders the hero chosen by PostHog and monitored via hero_viewed events.
 */
export async function HeroSection({ region, className }: HeroSectionProps) {
  const decision = await decideAndTrackHero(region);

  if (decision.region === "us") {
    return <HeroUs className={className} country={decision.country} />;
  }

  if (decision.region === "uk") {
    return <HeroUk className={className} country={decision.country} />;
  }

  return <HeroDefault className={className} country={decision.country} />;
}
