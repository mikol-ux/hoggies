import type { ReactNode } from "react";

/** Supported hero region variants. */
export type HeroRegion = "us" | "uk" | "default";

/** PostHog multivariate flag keys for regional heroes. */
export type HeroFlagVariant = "us-hero" | "uk-hero" | "default-hero";

/** How the hero decision was made for monitoring. */
export type HeroDecisionSource = "posthog_flag" | "posthog_missing" | "override";

/** Full decision used to render and report a hero. */
export type HeroDecision = {
  region: HeroRegion;
  country: string;
  flagKey: string;
  flagVariant: HeroFlagVariant | null;
  source: HeroDecisionSource;
  distinctId: string;
};

/** Props shared by every regional hero section. */
export type HeroProps = {
  className?: string;
  country?: string;
};

/** Props for tracked hero CTA links. */
export type HeroCtaProps = {
  href: string;
  children: ReactNode;
  className?: string;
  hero: HeroRegion;
  country: string;
  action: string;
};

/** Props for the region-aware hero selector. */
export type HeroSectionProps = {
  region?: HeroRegion;
  className?: string;
};
