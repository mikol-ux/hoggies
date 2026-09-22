import Image from "next/image";
import type { HeroProps } from "@/types/hero";
import { HeroCta } from "./HeroCta";
import "./hero.css";

/**
 * UK-region hero with clear United Kingdom labeling and British market copy.
 */
export function HeroUk({ className = "", country = "GB" }: HeroProps) {
  return (
    <section
      className={`hero hero--uk ${className}`.trim()}
      aria-label="Hoggies United Kingdom hero"
      data-hero="uk"
      data-country={country}
    >
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
        <p className="hero__region">United Kingdom</p>
        <p className="hero__brand">Hoggies</p>
        <h1 className="hero__headline">Proper British comfort food.</h1>
        <p className="hero__copy">
          Slow-cooked rolls made for the UK — seasonal sides and delivery from £9, coast to coast.
        </p>
        <div className="hero__actions">
          <HeroCta className="hero__cta" href="#order" hero="uk" country={country} action="order">
            Order across the UK
          </HeroCta>
          <HeroCta className="hero__cta hero__cta--ghost" href="#menu" hero="uk" country={country} action="menu">
            See the UK menu
          </HeroCta>
        </div>
      </div>
    </section>
  );
}
