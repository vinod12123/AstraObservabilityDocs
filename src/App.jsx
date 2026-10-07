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
import GuideArticle from "./GuideArticle";
import DocumentationHome from "./DocumentationHome";
import { GROUPS, getGuide } from "./guideContent";
import "./editorial.css";

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
  const route = window.location.hash.replace(/^#\/?/, "").split('?')[0];
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
        {GROUPS.map((group) => <div className="navigation-group" key={group.label}><p className="navigation-group-label">{group.label}</p>{DOC_SECTIONS.filter(section => group.ids.includes(section.id)).map((section) => {
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
                    <div key={item.id}>
                    <button
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}</div>)}
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
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const choose = (item) => { setOpen(false); onPage(item.sectionId, item.id); };
  return (
    <div className={compact ? "search-wrap is-compact" : "search-wrap"}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <div className="hero-search">
        <MagnifyingGlass size={compact ? 18 : 21} aria-hidden="true" />
        <input
          id={compact ? "global-search" : "docs-search"}
          value={query}
          aria-label="Search documentation"
          role="combobox"
          aria-expanded={open && Boolean(query)}
          aria-controls={compact ? 'header-results' : 'home-results'}
          aria-activedescendant={open && results[selected] ? `${compact ? 'header' : 'home'}-result-${selected}` : undefined}
          onFocus={() => setOpen(true)}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setSelected(0); }}
          onKeyDown={event => {
            if (event.key === 'Escape') { setOpen(false); event.currentTarget.blur(); }
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault(); setOpen(true);
              setSelected(current => Math.max(0, Math.min(results.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1))));
            }
            if (event.key === 'Enter' && results[selected]) { event.preventDefault(); choose(results[selected]); }
          }}
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
        <button className="search-button" type="button" onClick={() => { setOpen(true); document.getElementById('docs-search')?.focus(); }}>
          Search
        </button>
      )}
      {query && open && (
        <div className="search-results" role="listbox" id={compact ? 'header-results' : 'home-results'} aria-label="Matching guides">
          {results.length ? (
            results.map((result, index) => (
              <button
                key={`${result.sectionId}-${result.id}`}
                type="button"
                role="option"
                aria-selected={selected === index}
                id={`${compact ? 'header' : 'home'}-result-${index}`}
                onClick={() => choose(result)}
              >
                <span>
                  <small>{result.sectionLabel}</small>
                  {result.title}
                  <small className="search-excerpt">{result.summary}</small>
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


export function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("astra-docs-theme") || "light",
  );
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
    const syncRoute = () => {
      const next = routeFromHash();
      setRoute(next);
      if (next) setExpanded(current => new Set([...current, next.sectionId]));
    };
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
    return ALL_PAGES.map(item => {
      const title = item.title.toLowerCase();
      const text = `${item.sectionLabel} ${item.title} ${item.summary} ${JSON.stringify(getGuide(DOC_SECTIONS.find(section => section.id === item.sectionId), item).sections)}`.toLowerCase();
      return { item, matches: terms.every(term => text.includes(term)), score: terms.reduce((score,term) => score + (title.includes(term) ? 30 : 0) + Math.min(20,text.split(term).length - 1),0) };
    }).filter(result => result.matches).sort((a,b) => b.score - a.score).slice(0,8).map(result => result.item);
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
  useEffect(() => {
    document.title = active ? `${active.page.title} | ASTRA Docs` : 'ASTRA documentation | Learn, investigate, respond';
  }, [active?.page.id]);

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
            Get help
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
            <GuideArticle
              key={`${active.section.id}/${active.page.id}`}
            section={active.section}
            page={active.page}
            onHome={onHome}
            onPage={onPage}
          />
        ) : (
          <DocumentationHome
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
              <Question size={15} /> Troubleshooting
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
