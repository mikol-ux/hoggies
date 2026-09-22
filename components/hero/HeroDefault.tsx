import Image from "next/image";
import type { HeroProps } from "@/types/hero";
import "./hero.css";

/**
 * Default hero for visitors outside the US and UK, or when region is unknown.
 */
export function HeroDefault({ className = "" }: HeroProps) {
  return (
    <section className={`hero ${className}`.trim()} aria-label="Hoggies hero">
      <div className="hero__media" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__content">
        <p className="hero__brand">Hoggies</p>
        <h1 className="hero__headline">Food worth gathering for.</h1>
        <p className="hero__copy">
          Slow-cooked classics, fresh sides, and delivery that arrives hot.
        </p>
        <div className="hero__actions">
          <a className="hero__cta" href="#order">
            Start an order
          </a>
          <a className="hero__cta hero__cta--ghost" href="#menu">
            Explore the menu
          </a>
        </div>
      </div>
    </section>
  );
}
