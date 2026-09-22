import Image from "next/image";
import type { HeroProps } from "@/types/hero";
import { HeroCta } from "./HeroCta";
import "./hero.css";

/**
 * US-region hero with clear United States labeling and American market copy.
 */
export function HeroUs({ className = "" }: HeroProps) {
  return (
    <section
      className={`hero hero--us ${className}`.trim()}
      aria-label="Hoggies United States hero"
      data-hero="us"
    >
      <div className="hero__media" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__content">
        <p className="hero__region">United States</p>
        <p className="hero__brand">Hoggies</p>
        <h1 className="hero__headline">Made for American weekends.</h1>
        <p className="hero__copy">
          Slow-smoked sandwiches built for the USA — bold sides and nationwide delivery from $12.
        </p>
        <div className="hero__actions">
          <HeroCta className="hero__cta" href="#order" hero="us" action="order">
            Order across the US
          </HeroCta>
          <HeroCta className="hero__cta hero__cta--ghost" href="#menu" hero="us" action="menu">
            See the US menu
          </HeroCta>
        </div>
      </div>
    </section>
  );
}
