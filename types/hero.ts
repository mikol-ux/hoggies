/** Supported hero region variants. */
export type HeroRegion = "us" | "uk" | "default";

/** PostHog multivariate flag keys for regional heroes. */
export type HeroFlagVariant = "us-hero" | "uk-hero" | "default-hero";

/** Props shared by every regional hero section. */
export type HeroProps = {
  className?: string;
};

/** Props for the region-aware hero selector. */
export type HeroSectionProps = {
  region?: HeroRegion;
  className?: string;
};
