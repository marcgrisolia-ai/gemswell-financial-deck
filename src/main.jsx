import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  benchmarkParks,
  birminghamPortfolioFacts,
  birminghamKpis,
  birminghamRevenue,
  brandStatements,
  highlights,
  investmentTerms,
  leadershipTeam,
  legalDisclaimer,
  madridPortfolioFacts,
  madridKpis,
  madridRevenue,
  madridVenueNotes,
  marketTailwinds,
  navItems,
  platformPillars,
  portfolioMarkets,
  proofBullets,
  restaurantNames,
  services,
  sponsorClaim,
  sponsors,
  teamExpertise,
  thesisBullets,
  venturesDrivers,
  venturesServices,
  wavegardenGroups,
  whySurfRows
} from "./data/content.js";
import { WavegardenVectorLogo } from "./components/WavegardenVectorLogo.jsx";
import "./styles.css";

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const formatUnit = (unit) => (unit ? <span className="unit">{unit}</span> : null);

const sponsorLogos = {
  "Stoneweg InfraSports": {
    className: "infrasports",
    src: asset("/assets/slide-05/infrasports-title.svg")
  },
  TERAS: {
    className: "teras",
    src: asset("/assets/slide-05/teras-title.svg")
  },
  STONEWEG: {
    className: "stoneweg",
    src: asset("/assets/slide-05/stoneweg-title.svg")
  }
};

const splitFacts = (facts) => {
  const midpoint = Math.ceil(facts.length / 2);
  return [facts.slice(0, midpoint), facts.slice(midpoint)];
};

function useScrollProgress() {
  const [state, setState] = useState({ progress: 0, active: "overview" });

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const sections = [...document.querySelectorAll("[data-section]")];
      const marker = Math.min(window.innerHeight * 0.32, 320);
      const active =
        sections.reduce((current, section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= marker ? section.id : current;
        }, sections[0]?.id) || "overview";

      setState({ progress: Math.min(Math.max(progress, 0), 1), active });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return state;
}

function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const nodes = [...document.querySelectorAll(".reveal:not(.wavegarden)")];
    const earlyNodes = [...document.querySelectorAll(".reveal.wavegarden")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
    );
    const earlyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            earlyObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px 34% 0px", threshold: 0.04 }
    );

    nodes.forEach((node) => observer.observe(node));
    earlyNodes.forEach((node) => earlyObserver.observe(node));
    return () => {
      observer.disconnect();
      earlyObserver.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
}

function useHashScroll() {
  useEffect(() => {
    const hashOffsets = {
      madrid: 82,
      birmingham: 82,
      benchmark: 44
    };

    const scrollToHash = () => {
      const id = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const offset = hashOffsets[id] || 0;
          if (!offset) {
            target.scrollIntoView({ block: "start" });
            return;
          }

          const top = target.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: "smooth" });
        });
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);
}

function useHighlightScrollIndex(ref, count) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!count) return undefined;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = ref.current;
        if (!node) return;

        const list = node.querySelector("ol");
        const cards = [...node.querySelectorAll("[data-highlight-card]")];
        if (!cards.length) return;

        const listRect = list.getBoundingClientRect();
        const cardHeight = cards[0].getBoundingClientRect().height;
        const marker = Math.min(window.innerHeight * 0.46, 520);
        const travel = Math.max(listRect.height - cardHeight, 1);
        const progress = Math.min(1, Math.max(0, (marker - listRect.top) / travel));
        const next = Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))));

        setActiveIndex((current) => (current === next ? current : next));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [count, ref]);

  return activeIndex;
}

function App() {
  useReveal();
  useHashScroll();
  const { progress, active } = useScrollProgress();

  return (
    <>
      <ProgressBar progress={progress} />
      <Nav active={active} />
      <main>
        <Hero />
        <Thesis />
        <Platform />
        <Madrid />
        <Birmingham />
        <Benchmark />
        <Investment />
        <Close />
      </main>
    </>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

function Nav({ active }) {
  return (
    <header className="site-header">
      <a className="brand" href="#overview" aria-label="Gemswell overview">
        <span>GEMSWELL</span>
      </a>
      <nav aria-label="Page sections">
        {navItems.map((item) => (
          <a
            className={active === item.id ? "active" : ""}
            href={`#${item.id}`}
            key={item.id}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function SectionHeader({ kicker, title, children, align = "left" }) {
  return (
    <div className={`section-header ${align}`}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

function Hero() {
  return (
    <section id="overview" className="hero" data-section>
      <img className="hero-bg" src={asset("/assets/slide-01/background.jpg")} alt="" />
      <div className="hero-grade" aria-hidden="true" />
      <div className="hero-content reveal is-visible">
        <img className="hero-wordmark static" src={asset("/assets/slide-01/wordmark.svg")} alt="GEMSWELL" />
        <div className="hero-copy">
          <p>Investment opportunity, Mayo 2026</p>
        </div>
      </div>
    </section>
  );
}

function Thesis() {
  return (
    <section id="thesis" className="chapter thesis" data-section>
      <div className="split-layout">
        <div className="split-copy reveal">
          <SectionHeader
            kicker="Opening thesis"
            title="A surf destination platform, not a single venue story."
          >
            Gemswell brings surf culture, hospitality and repeatable park operations into
            dense European catchments with scarce access to consistent waves.
          </SectionHeader>
          <ul className="statement-list">
            {thesisBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <figure className="media-rail reveal">
          <img
            src={asset("/assets/slide-02/madrid-night-vertical.jpg?v=20260610-1606")}
            alt="Gemswell Surf Madrid rendering at night with wave pool and hospitality areas."
          />
          <span className="media-rail-side-fade media-rail-side-fade-left" aria-hidden="true" />
          <span className="media-rail-side-fade media-rail-side-fade-right" aria-hidden="true" />
          <figcaption>Madrid and Birmingham under development, opening March and September 2027 respectively.</figcaption>
        </figure>
      </div>
      <BrandStatements />
    </section>
  );
}

function BrandStatements() {
  return (
    <div className="brand-statements reveal">
      {brandStatements.map((statement) => (
        <article key={statement.label}>
          <p>{statement.label}</p>
          <h3>{statement.copy}</h3>
        </article>
      ))}
    </div>
  );
}

function Platform() {
  return (
    <section id="platform" className="chapter platform" data-section>
      <SectionHeader
        kicker="Platform rationale"
        title="The business case moves through four connected proofs."
        align="center"
      >
        Industry demand, Wavegarden technology, sponsor capability and portfolio
        scalability are separated into readable investor modules.
      </SectionHeader>

      <div className="pillar-grid">
        {platformPillars.map((pillar, index) => (
          <article className="pillar reveal" style={{ "--delay": `${index * 80}ms` }} key={pillar.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{pillar.title}</h3>
            <p>{pillar.copy}</p>
          </article>
        ))}
      </div>

      <WhySurf />
      <Wavegarden />
      <Sponsors />
      <Ventures />
      <Leadership />

      <div className="platform-proof reveal" aria-labelledby="platform-proof-title">
        <div className="platform-proof-intro">
          <p className="kicker">Operating model</p>
          <h3 id="platform-proof-title">Operational leverage, sponsor support and portfolio design.</h3>
        </div>
        <ol className="proof-card-grid">
          {proofBullets.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </div>

      <section className="portfolio-stage reveal" aria-labelledby="portfolio-stage-title">
        <div className="portfolio-stage-copy">
          <p className="kicker">Secured portfolio anchors</p>
          <h3 id="portfolio-stage-title">Two launch markets make the platform thesis tangible.</h3>
        </div>
        <div className="portfolio-stage-grid">
          {portfolioMarkets.map((market, index) => (
          <article className="portfolio-card" key={market.name}>
            <img src={asset(market.image)} alt={market.alt} />
            <div className="portfolio-card-grade" aria-hidden="true" />
            <div className="portfolio-card-content">
              <span className="portfolio-index">{String(index + 1).padStart(2, "0")}</span>
              <p>{market.eyebrow}</p>
              <h4>{market.name}</h4>
              <strong>{market.headline}</strong>
              <em>{market.status}</em>
              <p>{market.copy}</p>
              <ul>
                {market.stats.map((stat) => (
                  <li key={stat}>{stat}</li>
                ))}
              </ul>
            </div>
          </article>
          ))}
        </div>
      </section>
      <MarketFacts title="Location and access detail" columns={[
        { title: "Madrid", facts: madridPortfolioFacts },
        { title: "Birmingham", facts: birminghamPortfolioFacts }
      ]} />
    </section>
  );
}

function WhySurf() {
  return (
    <section className="subchapter why-surf reveal" aria-labelledby="why-surf-title">
      <div className="why-surf-left">
        <div className="subchapter-copy">
          <p className="kicker">Why surf parks?</p>
          <h3 id="why-surf-title">Quality waves solve a real access problem.</h3>
          <p>
            Supplying high quality wave parks is a high value proposition with
            scope for premium pricing, complemented with F&B, retail, events and
            entertainment for a full differentiated experiential offering.
          </p>
        </div>
      </div>
      <div className="why-surf-right">
        <div className="reason-table">
          {whySurfRows.map((row) => (
            <article key={row.label}>
              <h4>{row.label}</h4>
              <p>{row.copy}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="market-proof-band" aria-label="Surf park market proof">
        <div className="market-signal">
          <p className="market-signal-label">Demand proof</p>
          <strong>40M+ user base</strong>
          <span>Projecting a $6.0bn global market by 2030.</span>
          <p className="market-signal-claim">
            Stoneweg InfraSports is seizing upon the demand and untapped opportunity for urban surfing with Gemswell Surf Parks.
          </p>
        </div>
        <div className="market-tailwinds-panel">
          <p className="kicker">Market tailwinds</p>
          <h4>Three signals make the category investable before the technology case begins.</h4>
          <ul className="tailwind-list">
            {marketTailwinds.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Wavegarden() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="subchapter wavegarden reveal" aria-labelledby="wavegarden-title">
      <div className="wavegarden-top">
        <div className="wavegarden-copy">
          <p className="kicker">Leading Wavegarden technology</p>
          <WavegardenVectorLogo />
        </div>
        <h3 className="wavegarden-subtitle" id="wavegarden-title">
          Best quality and highest frequency of waves, using the least water and energy.
        </h3>
        <div className="accordion-stack wavegarden-stack scroll-accordion">
          {wavegardenGroups.map((group, index) => (
            <details
              className={activeIndex === index ? "active" : ""}
              key={group.label}
              open={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
              onFocusCapture={() => setActiveIndex(index)}
            >
              <summary
                onClick={(event) => {
                  event.preventDefault();
                  setActiveIndex(index);
                }}
              >
                {group.label}
              </summary>
              <ul>
                {group.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
        <figure className="wavegarden-visual">
          <img src={asset("/assets/slide-04/wavegarden-collage.jpg?v=20260610-1325")} alt="Wavegarden technology visuals from the source deck." />
          <figcaption>
            <span>11 surf parks operating globally</span>
            <span>Up to 1,000 waves per hour</span>
            <span>Adjustable wave size and shape</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Sponsors() {
  return (
    <section className="subchapter sponsors reveal" aria-labelledby="sponsors-title">
      <SectionHeader
        kicker="Committed sponsors"
        title="Stoneweg InfraSports develops and manages Gemswell Surf Parks."
        align="center"
      >
        TERAS and Stoneweg add digital, sports infrastructure, real estate and
        development capabilities to the platform.
      </SectionHeader>
      <div className="sponsor-grid" id="sponsors-title">
        {sponsors.map((sponsor, index) => {
          const logo = sponsorLogos[sponsor.name];
          const headingId = `sponsor-${index + 1}`;

          return (
            <article key={sponsor.name} aria-labelledby={headingId}>
              <h3 className="sponsor-title" id={headingId} aria-label={sponsor.name}>
                <img
                  aria-hidden="true"
                  alt=""
                  className={`sponsor-title-logo ${logo.className}`}
                  src={logo.src}
                />
              </h3>
              <p>{sponsor.copy}</p>
              {sponsor.bullets.length ? (
                <ul>
                  {sponsor.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
      <p className="yellow-note sponsor-note">{sponsorClaim}</p>
    </section>
  );
}

function Ventures() {
  return (
    <section className="subchapter ventures reveal" aria-labelledby="ventures-title">
      <div className="ventures-intro">
        <div className="ventures-copy">
          <p className="kicker">Gemswell Ventures</p>
          <h3 id="ventures-title">OpCo layer for scalability, performance, upside and optionality.</h3>
          <p>
            Gemswell Ventures designs and implements the park management,
            operations and guest experience, with a focus on scalability and
            profitability.
          </p>
        </div>
        <aside className="ventures-services" aria-label="Key services to the Surf Parks">
          <h4>Key services to the Surf Parks</h4>
          <ul className="service-list single">
            {venturesServices.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </aside>
      </div>
      <VenturesStructure />
      <div className="driver-grid">
        {venturesDrivers.map((driver) => (
          <details key={driver.label} open>
            <summary>{driver.label}</summary>
            <ul>
              {driver.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}

function VenturesStructure() {
  return (
    <div className="ventures-structure" aria-labelledby="ventures-structure-heading">
      <div className="ventures-structure-intro">
        <div className="ventures-structure-title">
          <p className="kicker">Platform control model</p>
          <h4 id="ventures-structure-heading">Ownership and operating structure</h4>
        </div>
        <p>
          KELPA holds the platform entities while Gemswell Ventures acts as the
          OpCo layer connecting Madrid and Birmingham through management agreements.
        </p>
      </div>
      <svg
        className="ventures-structure-chart"
        viewBox="0 0 1100 410"
        role="img"
        aria-labelledby="ventures-structure-chart-title ventures-structure-chart-desc"
      >
        <title id="ventures-structure-chart-title">Gemswell Ventures management structure</title>
        <desc id="ventures-structure-chart-desc">
          KELPA Holding owns Gemswell Ventures, Gemswell Surf Madrid and Gemswell Surf Birmingham. Gemswell Ventures manages Madrid and Birmingham through Surf Park Management Agreements.
        </desc>
        <defs>
          <marker id="arrow-yellow" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path className="chart-arrow-head yellow" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker id="arrow-white" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path className="chart-arrow-head white" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <path className="chart-line yellow" d="M550 98 V128 H175 V154" markerEnd="url(#arrow-yellow)" />
        <path className="chart-line yellow" d="M550 98 V154" markerEnd="url(#arrow-yellow)" />
        <path className="chart-line yellow" d="M550 128 H925 V154" markerEnd="url(#arrow-yellow)" />

        <path className="chart-line agreement" d="M160 252 V300 H550 V254" markerEnd="url(#arrow-white)" />
        <path className="chart-line agreement" d="M160 252 V352 H925 V254" markerEnd="url(#arrow-white)" />
        <text className="chart-agreement-label" x="355" y="292" textAnchor="middle">
          Surf Park Management Agreement
        </text>
        <text className="chart-agreement-label" x="542" y="383" textAnchor="middle">
          Surf Park Management Agreement
        </text>

        <rect className="chart-kelpa-box" x="390" y="20" width="320" height="78" />
        <text className="chart-kelpa-text" x="550" y="54" textAnchor="middle">
          <tspan x="550">KELPA</tspan>
          <tspan x="550" dy="30">(Holding)</tspan>
        </text>

        <rect className="chart-entity-box" x="20" y="160" width="310" height="88" />
        <text className="chart-entity-text" x="175" y="196" textAnchor="middle">
          <tspan x="175">Gemswell Ventures</tspan>
          <tspan x="175" dy="32">(OpCo)</tspan>
        </text>

        <rect className="chart-entity-box" x="395" y="160" width="310" height="88" />
        <text className="chart-entity-text" x="550" y="196" textAnchor="middle">
          <tspan x="550">Gemswell Surf</tspan>
          <tspan x="550" dy="32">Madrid</tspan>
        </text>

        <rect className="chart-entity-box" x="770" y="160" width="310" height="88" />
        <text className="chart-entity-text" x="925" y="196" textAnchor="middle">
          <tspan x="925">Gemswell Surf</tspan>
          <tspan x="925" dy="32">Birmingham</tspan>
        </text>
      </svg>
    </div>
  );
}

function Leadership() {
  const [activePair, setActivePair] = useState(0);

  return (
    <section className="subchapter leadership reveal" aria-labelledby="leadership-title">
      <div className="leadership-intro">
        <p className="kicker">Key members leading the project</p>
        <h3 id="leadership-title">Solid management team across surf, leisure, F&B, consumer, digital and real estate execution.</h3>
        <ul>
          {teamExpertise.map((expertise) => (
            <li key={expertise}>{expertise}</li>
          ))}
        </ul>
        <p className="leadership-attribution">
          Infrastructure &amp; Real Estate sector knowledge, project development and execution, and financial structuring expertise by Stoneweg and Teras.
        </p>
      </div>
      <div className="team-grid">
        {leadershipTeam.map((member, index) => {
          const pairIndex = Math.floor(index / 2);
          const isOpen = pairIndex === activePair;

          return (
          <details className={isOpen ? "active" : ""} key={member.name} open={isOpen}>
            <summary
              onClick={(event) => {
                event.preventDefault();
                setActivePair(pairIndex);
              }}
            >
              <img className="member-photo" src={asset(member.portrait)} alt={member.name} />
              <span className="member-summary">
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </span>
            </summary>
            <ul>
              {member.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </details>
          );
        })}
      </div>
    </section>
  );
}

function MarketFacts({ title, columns }) {
  const isSingleMarket = columns.length === 1;

  return (
    <div className={`market-facts reveal ${isSingleMarket ? "single-market-facts" : ""}`}>
      <h3>{title}</h3>
      <div>
        {columns.map((column) => (
          <article key={column.title}>
            <h4>{column.title}</h4>
            {isSingleMarket ? (
              <div className="market-facts-columns">
                {splitFacts(column.facts).map((group, index) => (
                  <ul key={`${column.title}-${index}`}>
                    {group.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                ))}
              </div>
            ) : (
              <ul>
                {column.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function Madrid() {
  return (
    <section id="madrid" className="chapter market madrid" data-section>
      <MarketHero
        title="Madrid turns surf into a city-scale leisure engine."
        label="Madrid chapter"
        mark="GEMSWELL SURF MADRID"
        image={asset("/assets/slide-09/background.jpg")}
        alt="Aerial rendering of Gemswell Surf Madrid."
      />
      <MarketFacts title="Madrid portfolio detail" columns={[{ title: "Climate, culture, lifestyle and entertainment", facts: madridPortfolioFacts }]} />
      <div className="market-grid madrid-destination">
        <div className="market-copy reveal">
          <p className="kicker">Ciudad del Deporte</p>
          <h3>Ciudad del Deporte unlocks scale, visibility and dwell time.</h3>
          <p>
            The completed site combines stadium, hotel, concert area, surf park,
            Top Golf, padel, climbing, skate and retail into a broader destination.
          </p>
        </div>
        <figure className="market-plan reveal">
          <img src={asset("/assets/slide-11/locations_surfpark_expanded.png")} alt="Top-down layout of Gemswell Surf Madrid." />
          <figcaption>
            {restaurantNames.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </figcaption>
        </figure>
        <div className="venue-notes-panel reveal">
          <p className="kicker">Destination drivers</p>
          <ul className="venue-notes">
            {madridVenueNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div className="amenity-panel reveal">
          <p className="kicker">On-site programme</p>
          <ServiceList />
        </div>
      </div>
      <Figures
        label="Madrid key figures"
        title="Stabilized 2028 model: diversified revenue with F&B weight."
        kpis={madridKpis}
        revenue={madridRevenue}
        total="€25.5 M"
        note="Madrid Surf Park is poised to benefit from weather, culture and lifestyle driving a significant portion of business from F&B, supported by a solid, differentiated and segmented offering in partnership with a leading Restaurante Group."
      />
    </section>
  );
}

function Birmingham() {
  return (
    <section id="birmingham" className="chapter market birmingham" data-section>
      <MarketHero
        title="Birmingham adds scale, youth and a second European anchor."
        label="Birmingham chapter"
        mark="GEMSWELL SURF BIRMINGHAM"
        image={asset("/assets/slide-13/birmingham-hero.jpg")}
        alt="Aerial rendering of Gemswell Surf Birmingham."
      />
      <MarketFacts title="Birmingham portfolio detail" columns={[{ title: "Scale, youth and vibrant talent base", facts: birminghamPortfolioFacts }]} />
      <Figures
        label="Birmingham key figures"
        title="A core surf-led model with robust F&B and entertainment support."
        kpis={birminghamKpis}
        revenue={birminghamRevenue}
        total="£17.2 M"
        note="Birmingham Surf Park core offering focused on surfing, complemented with robust F&B and entertainment offering, leveraging Gemswell Madrid's best-in-class guest experience and value proposition."
      />
    </section>
  );
}

function MarketHero({ label, title, mark, image, alt }) {
  return (
    <div className="market-hero reveal">
      <img src={image} alt={alt} />
      <div className="market-hero-copy">
        <p className="kicker">{label}</p>
        {mark ? <p className="market-wordmark">{mark}</p> : null}
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function ServiceList() {
  return (
    <ul className="service-list">
      {services.map((service) => (
        <li key={service}>{service}</li>
      ))}
    </ul>
  );
}

function Figures({ label, title, kpis, revenue, total, note }) {
  const revenueSegments = useMemo(() => {
    let cursor = 0;
    return revenue.map((item, index) => {
      const start = cursor;
      cursor += item.value;
      return {
        ...item,
        start,
        gap: Math.max(0, 100 - item.value),
        delay: `${index * 120}ms`
      };
    });
  }, [revenue]);

  return (
    <div className="figures reveal">
      <div className="figures-header">
        <p className="kicker">{label}</p>
        <h3>{title}</h3>
      </div>
      <div className="figures-grid">
        <dl className="kpi-list">
          {kpis.map((kpi, index) => (
            <div key={kpi.label} style={{ "--item-delay": `${140 + index * 55}ms` }}>
              <dt>{kpi.label}</dt>
              <dd>
                {kpi.value}
                {formatUnit(kpi.unit)}
              </dd>
            </div>
          ))}
        </dl>
        <div className="donut-wrap">
          <div className="donut" aria-label={`Revenue mix for ${label}`}>
            <svg className="donut-svg" viewBox="0 0 330 330" aria-hidden="true" focusable="false">
              <circle className="donut-track" cx="165" cy="165" r="127.5" pathLength="100" />
              {revenueSegments.map((segment) => (
                <circle
                  className="donut-segment"
                  cx="165"
                  cy="165"
                  key={segment.label}
                  pathLength="100"
                  r="127.5"
                  style={{
                    "--arc": segment.value,
                    "--gap": segment.gap,
                    "--offset": -segment.start,
                    "--segment-delay": segment.delay,
                    stroke: segment.color
                  }}
                />
              ))}
            </svg>
            <div className="donut-center">
              <strong>Total revenue</strong>
              <span>{total}</span>
              <em>Stabilized 2028</em>
            </div>
          </div>
          <ul className="legend">
            {revenue.map((item, index) => (
              <li key={item.label} style={{ "--legend-delay": `${560 + index * 80}ms` }}>
                <span style={{ backgroundColor: item.color }} />
                <p>{item.value}%</p>
                <strong>{item.label}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="yellow-note">{note}</p>
    </div>
  );
}

function Benchmark() {
  const max = Math.max(...benchmarkParks.map((park) => park.hours));

  return (
    <section id="benchmark" className="chapter benchmark" data-section>
      <SectionHeader
        kicker="Proof and benchmark"
        title="Projected surf hours sit below the leading Australian benchmarks."
      >
        The model is ahead of less attractive European locations while retaining
        pricing upside for a world-class surf experience.
      </SectionHeader>
      <div className="benchmark-layout reveal">
        <ul className="statement-list compact">
          <li>11 Wavegarden surf lagoons are operating globally, some since 2019.</li>
          <li>Existing parks show consistent operational success and 35-40% EBITDA margins.</li>
          <li>Proven ability to charge premium pricing for world-class surf experience.</li>
          <li>Gemswell launch pricing is designed for value, with room for growth.</li>
        </ul>
        <div className="bar-chart" aria-label="Surf hours per year benchmark, values in thousands of hours">
          <span className="bar-chart-unit" aria-hidden="true">Surf Hours / Year ('000)</span>
          {benchmarkParks.map((park, index) => (
            <div className="bar-item" key={park.name} style={{ "--bar-delay": `${index * 75}ms` }}>
              <div className="bar-track">
                <span style={{ "--bar-height": `${(park.hours / max) * 100}%` }}>
                  {park.hours}
                </span>
              </div>
              <p>{park.name}</p>
              <small>{park.country}</small>
            </div>
          ))}
        </div>
      </div>
      <BenchmarkTable />
    </section>
  );
}

function BenchmarkTable() {
  return (
    <div className="benchmark-table-wrap reveal" aria-label="Detailed surf park benchmark table">
      <table className="benchmark-table">
        <thead>
          <tr>
            <th>Park</th>
            <th>Surf Hours / Year ('000)</th>
            <th>Price</th>
            <th>Year Open</th>
            <th>Tech</th>
            <th>WG Modules</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {benchmarkParks.map((park) => (
            <tr key={park.name}>
              <th scope="row">{park.name}</th>
              <td>{park.hours}</td>
              <td>{park.price}</td>
              <td>{park.yearOpen}</td>
              <td>{park.tech}</td>
              <td>{park.modules}</td>
              <td>{park.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Investment() {
  return (
    <section id="investment" className="chapter investment" data-section>
      <div className="investment-grid">
        <figure className="investment-photo reveal">
          <img src={asset("/assets/slide-16/surf-investment.jpg")} alt="Surfer riding an artificial wave." />
        </figure>
        <div className="investment-copy reveal">
          <SectionHeader kicker="Investment opportunity" title="Enter through Gemswell Surf." />
          <p className="lead">
            Enter the Surf Parks business through investment in Gemswell Surf, which will own, develop and operate a Surf Park Portfolio initially comprising Madrid + Birmingham + OpCo.
          </p>
          <dl className="terms">
            {investmentTerms.map((term) => (
              <div key={term.label}>
                <dt>{term.label}</dt>
                <dd>{term.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <Structure />
    </section>
  );
}

function Structure() {
  return (
    <div className="structure reveal" aria-label="Investment structure">
      <h3 className="structure-visible-title">Investment ownership path</h3>
      <svg viewBox="0 0 1320 330" role="img" aria-labelledby="structure-title structure-desc">
        <title id="structure-title">Investment ownership path</title>
        <desc id="structure-desc">
          KELPA S.L. receives investor capital. Atletico de Madrid owns 25% of
          Gemswell Madrid, KELPA owns 75% of Gemswell Madrid, approximately 96%
          of Gemswell Birmingham and 100% of Gemswell Ventures OpCo.
        </desc>
        <defs>
          <marker id="structure-arrow-yellow" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker id="structure-arrow-white" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <g className="structure-lines" aria-hidden="true">
          <path className="line-yellow" d="M 75 100 V 150 H 122" />
          <path className="line-yellow" d="M 242 150 H 382" />
          <path className="line-yellow" d="M 502 150 H 600" />
          <path className="line-yellow" d="M 720 150 H 990" />
          <path className="line-yellow" d="M 1110 150 H 1198" />
          <path className="line-yellow line-arrow" d="M 260 150 V 205" />
          <path className="line-yellow" d="M 660 70 V 124" />
          <path className="line-yellow line-arrow" d="M 660 178 V 205" />
          <path className="line-yellow line-arrow" d="M 1198 150 V 205" />
          <path className="line-white line-arrow-white" d="M 870 47 H 945" />
        </g>

        <image className="structure-crest" href={asset("/assets/slide-16/atletico-crest.png")} x="44" y="18" width="64" height="60" preserveAspectRatio="xMidYMid meet" />

        <g className="structure-node kelpa-node">
          <rect x="475" y="18" width="390" height="58" />
          <text x="495" y="55">KELPA, S.L.</text>
          <image href={asset("/assets/slide-16/flag-spain-clean.svg")} x="790" y="30" width="56" height="34" preserveAspectRatio="xMidYMid meet" />
        </g>

        <g className="structure-node investor-node">
          <rect x="950" y="26" width="278" height="44" />
          <text x="1089" y="56">Investors</text>
        </g>

        <g className="structure-percent" transform="translate(130 132)">
          <rect width="104" height="38" />
          <text x="52" y="26">25%</text>
        </g>
        <g className="structure-percent" transform="translate(390 132)">
          <rect width="104" height="38" />
          <text x="52" y="26">75%</text>
        </g>
        <g className="structure-percent" transform="translate(608 132)">
          <rect width="104" height="38" />
          <text x="52" y="26">c.96%</text>
        </g>
        <g className="structure-percent" transform="translate(998 132)">
          <rect width="104" height="38" />
          <text x="52" y="26">100%</text>
        </g>

        <g className="structure-company" transform="translate(42 218)">
          <rect width="395" height="62" />
          <text x="18" y="38">Gemswell Madrid</text>
          <image href={asset("/assets/slide-16/flag-spain-clean.svg")} x="319" y="18" width="56" height="34" preserveAspectRatio="xMidYMid meet" />
        </g>
        <g className="structure-company" transform="translate(475 218)">
          <rect width="390" height="62" />
          <text x="18" y="38">Gemswell Birmingham</text>
          <image href={asset("/assets/slide-16/flag-uk.png")} x="314" y="17" width="58" height="36" preserveAspectRatio="xMidYMid meet" />
        </g>
        <g className="structure-company" transform="translate(950 218)">
          <rect width="365" height="62" />
          <text x="18" y="38">Gemswell Ventures (OpCo)</text>
          <image href={asset("/assets/slide-16/flag-spain-clean.svg")} x="291" y="18" width="56" height="34" preserveAspectRatio="xMidYMid meet" />
        </g>
      </svg>
    </div>
  );
}

function Close() {
  const highlightsRef = useRef(null);
  const activeHighlight = useHighlightScrollIndex(highlightsRef, highlights.length);

  return (
    <section id="contact" className="chapter close" data-section>
      <div className="highlights reveal" ref={highlightsRef}>
        <SectionHeader
          title="Six reasons the opportunity holds together."
          align="center"
        />
        <ol>
          {highlights.map((highlight, index) => (
            <li
              aria-current={index === activeHighlight ? "step" : undefined}
              className={index === activeHighlight ? "is-active" : undefined}
              data-highlight-card
              key={highlight}
            >
              {highlight}
            </li>
          ))}
        </ol>
      </div>
      <div className="contact-panel reveal">
        <div>
          <strong className="contact-mark">GEMSWELL</strong>
          <h2>Gemswell Surf Parks</h2>
        </div>
        <address>
          <strong>Ramón Romero</strong>
          <span>Chief Investment Officer, TERAS CAPITAL</span>
          <span>Managing Director, STONEWEG INFRASPORTS</span>
          <a href="tel:+34699595231">+34 699 59 52 31</a>
          <a href="mailto:ramon.romero@teras.capital">ramon.romero@teras.capital</a>
          <a href="mailto:ramon.romero@stoneweg.com">ramon.romero@stoneweg.com</a>
        </address>
      </div>
      <details className="disclaimer reveal">
        <summary>Legal Disclaimer / Important Information</summary>
        {legalDisclaimer.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </details>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
