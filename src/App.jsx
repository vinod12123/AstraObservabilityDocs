import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpenText,
  Brain,
  CaretDown,
  ChartBar,
  Check,
  Cloud,
  Code,
  Cube,
  Database,
  FlowArrow,
  Gauge,
  Gear,
  Hash,
  Heartbeat,
  House,
  Lifebuoy,
  List,
  MagnifyingGlass,
  Moon,
  Newspaper,
  Plug,
  Question,
  Sparkle,
  Sun,
  Wallet,
  X,
} from "@phosphor-icons/react";
import { ALL_PAGES, DOC_SECTIONS, findPage, findPageById } from "./docsData";

const ASTRA_APP_URL =
  import.meta.env.VITE_ASTRA_APP_URL || "http://localhost:3000";

const ICONS = {
  bell: Bell,
  book: BookOpenText,
  brain: Brain,
  chart: ChartBar,
  cloud: Cloud,
  cube: Cube,
  database: Database,
  flow: FlowArrow,
  gauge: Gauge,
  gear: Gear,
  lifebuoy: Lifebuoy,
  newspaper: Newspaper,
  sparkle: Sparkle,
  wallet: Wallet,
};

const GOALS = [
  {
    id: "new",
    label: "New to ASTRA",
    note: "Get set up and see value",
    icon: Sparkle,
  },
  {
    id: "connect",
    label: "Connect data",
    note: "Ingest your telemetry",
    icon: Database,
  },
  {
    id: "investigate",
    label: "Investigate",
    note: "Find and understand issues",
    icon: MagnifyingGlass,
  },
  {
    id: "respond",
    label: "Respond",
    note: "Take action and resolve",
    icon: Bell,
  },
];

const JOURNEYS = {
  new: [
    [
      "Connect your environment",
      "Choose the collection path that matches your systems.",
      "collect-data",
      "overview",
    ],
    [
      "Verify telemetry",
      "Confirm that data is arriving and correctly scoped.",
      "collect-data",
      "collection-health",
    ],
    [
      "Explore your entities",
      "Navigate workloads, services, and relationships.",
      "infrastructure",
      "workloads",
    ],
    [
      "Create your first monitor",
      "Detect an issue and route it to responders.",
      "monitoring",
      "first-monitor",
    ],
  ],
  connect: [
    [
      "Choose a source",
      "Compare cloud, Agent, Kubernetes, and OTLP collection.",
      "collect-data",
      "overview",
    ],
    [
      "Configure access",
      "Follow the least-privilege setup for your source.",
      "collect-data",
      "aws",
    ],
    [
      "Verify collection",
      "Review activity, coverage, and actionable errors.",
      "collect-data",
      "collection-health",
    ],
    [
      "Explore the result",
      "Open the canonical workload or service.",
      "infrastructure",
      "workloads",
    ],
  ],
  investigate: [
    [
      "Start with a workload",
      "Choose the affected infrastructure or service.",
      "infrastructure",
      "workloads",
    ],
    [
      "Review signals",
      "Compare metrics, logs, traces, requests, and events.",
      "telemetry",
      "metrics",
    ],
    [
      "Follow relationships",
      "Use topology to understand dependencies.",
      "infrastructure",
      "topology",
    ],
    [
      "Capture the finding",
      "Create a dashboard or continue with ASTRA AI.",
      "astra-intelligence",
      "analyzer",
    ],
  ],
  respond: [
    [
      "Review the incident",
      "Understand impact, evidence, and affected entities.",
      "monitoring",
      "incidents",
    ],
    [
      "Confirm impact",
      "Validate scope using telemetry and topology.",
      "monitoring",
      "triage",
    ],
    [
      "Notify owners",
      "Route updates to messaging or ITSM destinations.",
      "notifications",
      "notification-overview",
    ],
    [
      "Track recovery",
      "Watch health and telemetry return to normal.",
      "infrastructure",
      "service-health",
    ],
  ],
};

const HOME_AREAS = [
  [
    "Infrastructure",
    "Hosts, Kubernetes, databases, cloud resources, and topology",
    Cloud,
    "infrastructure",
    "overview",
  ],
  [
    "Applications and services",
    "APM, services, requests, errors, and sessions",
    Cube,
    "applications",
    "overview",
  ],
  [
    "Explore telemetry",
    "Metrics, logs, traces, and runtime events",
    ChartBar,
    "telemetry",
    "metrics",
  ],
  [
    "Monitor and respond",
    "Triage, monitors, incidents, and synthetics",
    Bell,
    "monitoring",
    "triage",
  ],
  [
    "Costs and optimization",
    "Unit economics, attribution, and optimization",
    Wallet,
    "costs",
    "unit-economics",
  ],
  [
    "ASTRA Intelligence",
    "AI-assisted investigations, analysis, and code context",
    Brain,
    "astra-intelligence",
    "astra-agents",
  ],
];

const POPULAR = [
  ["Install the Linux Host Agent", "collect-data", "host-agent"],
  ["Connect an AWS account", "collect-data", "aws"],
  ["Send OpenTelemetry data", "collect-data", "opentelemetry"],
  ["Explore infrastructure topology", "infrastructure", "topology"],
];

function AstraMark() {
  return (
    <img
      className="astra-mark"
      src="/astra-icon.svg"
      alt=""
      aria-hidden="true"
    />
  );
}

function routeFromHash() {
  const route = window.location.hash.replace(/^#\/?/, "");
  if (!route) return null;
  const [sectionId, pageId] = route.split("/");
  return findPage(sectionId, pageId) ? { sectionId, pageId } : null;
}

function Sidebar({
  route,
  expanded,
  onToggle,
  onHome,
  onPage,
  mobileNavOpen,
  onClose,
}) {
  return (
    <aside
      className={`sidebar ${mobileNavOpen ? "is-open" : ""}`}
      aria-label="Documentation navigation"
    >
      <div className="mobile-sidebar-head">
        <span>Documentation</span>
        <button type="button" onClick={onClose} aria-label="Close navigation">
          <X size={20} />
        </button>
      </div>
      <button
        className={!route ? "home-row is-active" : "home-row"}
        type="button"
        onClick={onHome}
      >
        <House size={18} weight="fill" />
        <span>Home</span>
      </button>
      <nav className="docs-tree">
        {DOC_SECTIONS.map((section) => {
          const Icon = ICONS[section.icon];
          const isOpen = expanded.has(section.id);
          const isCurrent = route?.sectionId === section.id;
          return (
            <div
              className={isCurrent ? "tree-group is-current" : "tree-group"}
              key={section.id}
            >
              <button
                className="tree-trigger"
                type="button"
                onClick={() => onToggle(section.id)}
                aria-expanded={isOpen}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{section.label}</span>
                <span className="page-count">{section.pages.length}</span>
                <CaretDown
                  className={isOpen ? "caret is-open" : "caret"}
                  size={14}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="tree-children">
                  {section.pages.map((item) => (
                    <button
                      key={item.id}
                      className={
                        route?.sectionId === section.id &&
                        route?.pageId === item.id
                          ? "tree-page is-active"
                          : "tree-page"
                      }
                      type="button"
                      onClick={() => onPage(section.id, item.id)}
                    >
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="nav-context">
        Viewing
        <strong>
          {route
            ? findPage(route.sectionId, route.pageId)?.page.title
            : "Documentation home"}
        </strong>
      </div>
    </aside>
  );
}

function SearchBox({ query, setQuery, results, onPage, compact = false }) {
  return (
    <div className={compact ? "search-wrap is-compact" : "search-wrap"}>
      <div className="hero-search">
        <MagnifyingGlass size={compact ? 18 : 21} aria-hidden="true" />
        <input
          id={compact ? "global-search" : "docs-search"}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search documentation, guides, and product areas"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <X size={17} />
          </button>
        )}
        {!compact && <kbd>Ctrl K</kbd>}
      </div>
      {!compact && (
        <button className="search-button" type="button">
          Search
        </button>
      )}
      {query && (
        <div className="search-results" role="listbox">
          {results.length ? (
            results.map((result) => (
              <button
                key={`${result.sectionId}-${result.id}`}
                type="button"
                onClick={() => onPage(result.sectionId, result.id)}
              >
                <span>
                  <small>{result.sectionLabel}</small>
                  {result.title}
                </span>
                <ArrowRight size={14} />
              </button>
            ))
          ) : (
            <p>
              No matching guides. Try infrastructure, logs, Agent, or monitors.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function HomePage({ goal, setGoal, onPage, query, setQuery, results }) {
  return (
    <>
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">ASTRA DOCUMENTATION</p>
        <h1 id="page-title">What do you want to accomplish?</h1>
        <p className="hero-copy">
          Choose a goal and get a guided path to help you be successful with
          ASTRA.
        </p>
        <SearchBox
          query={query}
          setQuery={setQuery}
          results={results}
          onPage={onPage}
        />
      </section>

      <section className="goals" aria-label="Choose a documentation goal">
        {GOALS.map(({ id, label, note, icon: Icon }) => (
          <button
            key={id}
            className={goal === id ? "goal is-active" : "goal"}
            type="button"
            onClick={() => setGoal(id)}
            aria-pressed={goal === id}
          >
            <Icon size={25} weight={goal === id ? "duotone" : "regular"} />
            <span>
              <strong>{label}</strong>
              <small>{note}</small>
            </span>
          </button>
        ))}
      </section>

      <section className="journey" aria-labelledby="journey-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GUIDED PATH</p>
            <h2 id="journey-title">Your journey to value</h2>
          </div>
          <p>Follow these steps to move from setup to useful insight.</p>
        </div>
        <div className="journey-track">
          {JOURNEYS[goal].map(([title, copy, sectionId, pageId], index) => (
            <article className="journey-step" key={title}>
              <div className="step-marker">
                <span>{index + 1}</span>
                <i />
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <button type="button" onClick={() => onPage(sectionId, pageId)}>
                Open guide <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel recommended">
          <div className="panel-title">
            <div>
              <p className="eyebrow">GET STARTED</p>
              <h2>Recommended next</h2>
            </div>
            <span>1 of 4 complete</span>
          </div>
          <div className="progress" aria-label="25 percent complete">
            <i />
          </div>
          {[
            [
              "Ingest your first data source",
              "Connect a system and start receiving telemetry.",
              true,
              "collect-data",
              "overview",
            ],
            [
              "Explore your data",
              "Navigate canonical entities and view telemetry.",
              false,
              "infrastructure",
              "workloads",
            ],
            [
              "Create a monitor",
              "Set up an alert to detect an issue.",
              false,
              "monitoring",
              "first-monitor",
            ],
            [
              "Build a dashboard",
              "Visualize the measurements your team relies on.",
              false,
              "dashboards-reports",
              "dashboards",
            ],
          ].map(([title, copy, done, sectionId, pageId]) => (
            <button
              className="check-row"
              type="button"
              key={title}
              onClick={() => onPage(sectionId, pageId)}
            >
              <span className={done ? "check is-done" : "check"}>
                {done && <Check size={15} weight="bold" />}
              </span>
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
              <ArrowRight size={15} />
            </button>
          ))}
          <button
            className="inline-link"
            type="button"
            onClick={() => onPage("get-started", "quickstart")}
          >
            View the full getting started guide <ArrowRight size={14} />
          </button>
        </article>

        <article className="panel product-areas">
          <div className="panel-title">
            <div>
              <p className="eyebrow">BROWSE</p>
              <h2>Browse by product area</h2>
              <p>Find documentation for a specific area of ASTRA.</p>
            </div>
          </div>
          <div className="product-grid">
            {HOME_AREAS.map(([title, copy, Icon, sectionId, pageId]) => (
              <button
                type="button"
                key={title}
                onClick={() => onPage(sectionId, pageId)}
              >
                <Icon size={20} />
                <span>
                  <strong>{title}</strong>
                  <small>{copy}</small>
                </span>
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="link-panel">
          <div className="link-panel-head">
            <h2>
              <BookOpenText size={19} /> Popular guides
            </h2>
            <button
              type="button"
              onClick={() => onPage("get-started", "quickstart")}
            >
              View all guides <ArrowRight size={13} />
            </button>
          </div>
          {POPULAR.map(([title, sectionId, pageId]) => (
            <button
              type="button"
              onClick={() => onPage(sectionId, pageId)}
              key={title}
            >
              {title}
              <ArrowRight size={13} />
            </button>
          ))}
        </article>
        <article className="link-panel">
          <div className="link-panel-head">
            <h2>
              <Heartbeat size={19} /> Recently updated
            </h2>
            <button
              type="button"
              onClick={() => onPage("whats-new", "latest-docs")}
            >
              View all updates <ArrowRight size={13} />
            </button>
          </div>
          {[
            [
              "Linux Host Agent collection guide",
              "Oct 4, 2026",
              "collect-data",
              "host-agent",
            ],
            [
              "Infrastructure topology",
              "Oct 2, 2026",
              "infrastructure",
              "topology",
            ],
            ["Monitor alert noise", "Sep 30, 2026", "monitoring", "monitors"],
            [
              "Microsoft Teams integration",
              "Sep 28, 2026",
              "notifications",
              "teams",
            ],
          ].map(([title, date, sectionId, pageId], index) => (
            <button
              type="button"
              onClick={() => onPage(sectionId, pageId)}
              key={title}
            >
              <span>
                {title}
                {index === 0 && <em>NEW</em>}
              </span>
              <time>{date}</time>
            </button>
          ))}
        </article>
      </section>
    </>
  );
}

function ArticlePage({ section, page, onHome, onPage }) {
  const related = page.related.map(findPageById).filter(Boolean).slice(0, 3);
  return (
    <div className="article-layout">
      <article className="article">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <button type="button" onClick={onHome}>
            Docs
          </button>
          <ArrowRight size={12} />
          <span>{section.label}</span>
          <ArrowRight size={12} />
          <strong>{page.title}</strong>
        </nav>
        <header className="article-hero">
          <p className="eyebrow">{section.label.toUpperCase()}</p>
          <h1>{page.title}</h1>
          <p>{page.summary}</p>
          <div className="article-meta">
            <span>
              <Hash size={14} /> {section.id}/{page.id}
            </span>
            <span>Customer guide</span>
          </div>
        </header>

        <section id="overview" className="article-section">
          <h2>Overview</h2>
          <p>
            {page.summary} This guide explains the supported workflow and the
            evidence you can expect to see in ASTRA.
          </p>
        </section>

        <section id="capabilities" className="article-section">
          <h2>What you can do</h2>
          <div className="capability-list">
            {page.capabilities.map((item) => (
              <div key={item}>
                <span>
                  <Check size={14} weight="bold" />
                </span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="steps" className="article-section">
          <h2>How to use it</h2>
          <ol className="article-steps">
            {page.steps.map((item, index) => (
              <li key={item}>
                <span>{index + 1}</span>
                <div>
                  <strong>{item}</strong>
                  <p>
                    Complete this step in the relevant ASTRA view, then confirm
                    the expected status or data before continuing.
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="note" id="permissions">
          <Question size={20} weight="duotone" />
          <div>
            <strong>Access and data scope</strong>
            <p>
              ASTRA shows only the organizations, projects, environments, and
              telemetry permitted by your current role. Contact your
              organization administrator if an expected option is unavailable.
            </p>
          </div>
        </aside>

        <section id="next" className="article-section related-guides">
          <h2>Related guides</h2>
          <div>
            {related.length ? (
              related.map((item) => (
                <button
                  type="button"
                  key={`${item.sectionId}-${item.id}`}
                  onClick={() => onPage(item.sectionId, item.id)}
                >
                  <small>{item.sectionLabel}</small>
                  <strong>{item.title}</strong>
                  <span>{item.summary}</span>
                  <ArrowRight size={16} />
                </button>
              ))
            ) : (
              <button type="button" onClick={onHome}>
                <small>ASTRA Docs</small>
                <strong>Browse all guides</strong>
                <span>
                  Return to the documentation home and choose another goal.
                </span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </section>

        <div className="article-footer-actions">
          <button type="button" onClick={onHome}>
            <ArrowLeft size={15} /> Documentation home
          </button>
          <span>
            Was this page helpful? <button type="button">Yes</button>
            <button type="button">No</button>
          </span>
        </div>
      </article>
      <aside className="on-this-page">
        <strong>On this page</strong>
        <a href="#overview">Overview</a>
        <a href="#capabilities">What you can do</a>
        <a href="#steps">How to use it</a>
        <a href="#permissions">Access and data scope</a>
        <a href="#next">Related guides</a>
      </aside>
    </div>
  );
}

export function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("astra-docs-theme") || "light",
  );
  const [goal, setGoal] = useState("new");
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [route, setRoute] = useState(routeFromHash);
  const [expanded, setExpanded] = useState(
    () => new Set([routeFromHash()?.sectionId || "get-started"]),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("astra-docs-theme", theme);
  }, [theme]);

  useEffect(() => {
    const syncRoute = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector("#global-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const searchResults = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return ALL_PAGES.filter((item) => {
      const text =
        `${item.sectionLabel} ${item.title} ${item.summary} ${item.capabilities.join(" ")}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    }).slice(0, 8);
  }, [query]);

  const onToggle = (sectionId) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });

  const onHome = () => {
    window.location.hash = "";
    setRoute(null);
    setMobileNavOpen(false);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPage = (sectionId, pageId) => {
    setExpanded((current) => new Set([...current, sectionId]));
    window.location.hash = `${sectionId}/${pageId}`;
    setRoute({ sectionId, pageId });
    setMobileNavOpen(false);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const active = route ? findPage(route.sectionId, route.pageId) : null;

  return (
    <div className="docs-app">
      <header className="topbar">
        <button
          className="mobile-menu"
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
        >
          <List size={22} />
        </button>
        <button
          className="brand"
          type="button"
          onClick={onHome}
          aria-label="ASTRA Docs home"
        >
          <AstraMark />
          <strong>ASTRA</strong>
          <span>Docs</span>
        </button>
        <SearchBox
          compact
          query={query}
          setQuery={setQuery}
          results={searchResults}
          onPage={onPage}
        />
        <nav className="top-actions" aria-label="Utility navigation">
          <button
            type="button"
            onClick={() => onPage("whats-new", "release-notes")}
          >
            What's new
          </button>
          <button
            type="button"
            onClick={() => onPage("troubleshooting", "troubleshoot-collection")}
          >
            Support
          </button>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            <Sun size={17} weight={theme === "light" ? "fill" : "regular"} />
            <Moon size={17} weight={theme === "dark" ? "fill" : "regular"} />
          </button>
          <a
            className="open-astra"
            href={ASTRA_APP_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open ASTRA <ArrowRight size={15} />
          </a>
        </nav>
      </header>

      <Sidebar
        route={route}
        expanded={expanded}
        onToggle={onToggle}
        onHome={onHome}
        onPage={onPage}
        mobileNavOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      {mobileNavOpen && (
        <button
          className="scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main className={active ? "main is-article" : "main"} id="top">
        {active ? (
          <ArticlePage
            section={active.section}
            page={active.page}
            onHome={onHome}
            onPage={onPage}
          />
        ) : (
          <HomePage
            goal={goal}
            setGoal={setGoal}
            onPage={onPage}
            query={query}
            setQuery={setQuery}
            results={searchResults}
          />
        )}
        <footer id="support">
          <div>
            <AstraMark />
            <span>
              <strong>ASTRA Docs</strong>
              <small>Guidance for observing what matters.</small>
            </span>
          </div>
          <nav>
            <button
              type="button"
              onClick={() =>
                onPage("troubleshooting", "troubleshoot-collection")
              }
            >
              <Question size={15} /> Support
            </button>
            <button
              type="button"
              onClick={() => onPage("reference", "api-reference")}
            >
              <Code size={15} /> API reference
            </button>
            <button
              type="button"
              onClick={() => onPage("collect-data", "overview")}
            >
              <Plug size={15} /> Integrations
            </button>
          </nav>
        </footer>
      </main>
    </div>
  );
}
