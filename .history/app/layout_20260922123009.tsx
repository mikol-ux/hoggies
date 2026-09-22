import { headers } from 'next/headers';
import { PostHog } from 'posthog-node';

export default async function HeroSection() {
	const headersList = await headers();
	// Vercel gives you a two-letter uppercase code like 'US', 'GB', 'NG'
	const countryCode = headersList.get('x-vercel-ip-country') || 'US';

	const posthog = new PostHog('<YOUR_API_KEY>', { host: 'https://posthog.com' });

	// Evaluate flag by passing the Vercel country code directly into personProperties
	const variant = await posthog.getFeatureFlag(
		'hero-section-regional',
		'user_distinct_id_here',
		{
			personProperties: {
				$geoip_country_code: countryCode
			}
		}
	);

	// Render your component based on the variant
	if (variant === 'us-hero') return <UsHero />;
	if (variant === 'uk-hero') return <UkHero />;
	return <DefaultHero />;
}
