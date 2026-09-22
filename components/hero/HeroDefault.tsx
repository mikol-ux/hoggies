import Image from "next/image";
import type { HeroProps } from "@/types/hero";
import { HeroCta } from "./HeroCta";
import "./hero.css";

/**
 * Default hero for visitors outside the US and UK, labeled as the worldwide experience.
 */
export function HeroDefault({ className = "", country = "ZZ" }: HeroProps) {
  return (
    <section
      className={`hero hero--world ${className}`.trim()}
      aria-label="Hoggies worldwide hero"
      data-hero="default"
      data-country={country}
    >
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
        <p className="hero__region">Worldwide</p>
        <p className="hero__brand">Hoggies</p>
        <h1 className="hero__headline">Same great food, wherever you are.</h1>
        <p className="hero__copy">
          Serving guests outside the US and UK — slow-cooked classics and local delivery that arrives hot.
        </p>
        <div className="hero__actions">
          <HeroCta className="hero__cta" href="#order" hero="default" country={country} action="order">
            Order worldwide
          </HeroCta>
          <HeroCta className="hero__cta hero__cta--ghost" href="#menu" hero="default" country={country} action="menu">
            Explore the menu
          </HeroCta>
        </div>
      </div>
    </section>
  );
}
