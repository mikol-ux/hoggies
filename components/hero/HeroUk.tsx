import Image from "next/image";
import type { HeroProps } from "@/types/hero";
import "./hero.css";

/**
 * UK-region hero with British spelling, pricing cue, and a cooler visual tone.
 */
export function HeroUk({ className = "" }: HeroProps) {
  return (
    <section className={`hero hero--uk ${className}`.trim()} aria-label="Hoggies United Kingdom hero">
      <div className="hero__media" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__content">
        <p className="hero__brand">Hoggies</p>
        <h1 className="hero__headline">Your new favourite weekend treat.</h1>
        <p className="hero__copy">
          Proper slow-cooked rolls, seasonal sides, and UK-wide delivery from £9.
        </p>
        <div className="hero__actions">
          <a className="hero__cta" href="#order">
            Order now
          </a>
          <a className="hero__cta hero__cta--ghost" href="#menu">
            Browse the menu
          </a>
        </div>
      </div>
    </section>
  );
}
