import { useState } from 'react';
import { ArrowRight, BookOpenText, Plug, MagnifyingGlass, Bell, Code } from '@phosphor-icons/react';

export const TUTORIALS = [
  ['Collect', 'Connect your first source', 'Choose between cloud discovery, a Linux host Agent, and application instrumentation. Verify the signal you actually need.', 'collect-data', 'overview'],
  ['Investigate', 'Find out why telemetry is missing', 'Separate collection problems from stale data, restrictive filters, and an incorrect investigation scope.', 'troubleshooting', 'missing-telemetry'],
  ['Investigate', 'Read a metric before acting on it', 'Understand units, aggregation, and resource context before treating a change as a problem.', 'telemetry', 'metrics'],
  ['Investigate', 'Follow a request across services', 'Use spans to locate the slow or failing part of an instrumented request.', 'telemetry', 'traces'],
  ['Respond', 'Create a useful first monitor', 'Start with a condition that has an owner and a clear response—not just a threshold.', 'monitoring', 'first-monitor'],
  ['Respond', 'Deliver alerts by email', 'Prepare SMTP settings, choose notification events, and verify receipt at the destination.', 'notifications', 'email'],
];

export default function DocumentationHome({ onPage }) {
  const [category, setCategory] = useState('All');
  return <div className="documentation-home">
    <header className="library-hero">
      <p className="eyebrow">THE ASTRA HANDBOOK</p>
      <h1>Understand your systems.<br/>Know what to do next.</h1>
      <p>Learn what ASTRA observes, how to interpret the evidence, and how to turn a question about your systems into a focused investigation.</p>
      <button className="primary-doc-link" onClick={() => onPage('get-started', 'quickstart')}>Start with ASTRA <ArrowRight size={18}/></button>
      <button className="text-doc-link" onClick={() => onPage('get-started', 'concepts')}>Understand the core concepts <ArrowRight size={16}/></button>
    </header>
    <section className="learning-intro" aria-labelledby="learn-title">
      <div><p className="eyebrow">NEW TO OBSERVABILITY?</p><h2 id="learn-title">Start with a question,<br/>not a dashboard.</h2></div>
      <div><p>“Is this host running out of memory?” and “Why did this request fail?” need different evidence. Metrics describe changes over time. Logs record individual events. Traces explain the path of an instrumented request.</p><p>ASTRA brings that evidence into resource and service context. Start with one source, confirm what arrived, then choose the view that can answer your question.</p><button className="text-doc-link" onClick={() => onPage('get-started', 'welcome')}>How ASTRA fits together <ArrowRight size={16}/></button></div>
    </section>
    <section className="handbook-entry" aria-label="Ways to use the documentation">
      {[
        [Plug, 'Connect a system', 'Understand the access and collection options before enabling a source.', 'collect-data', 'overview'],
        [MagnifyingGlass, 'Investigate a change', 'Find the affected workload and compare evidence in the same time window.', 'infrastructure', 'workloads'],
        [Bell, 'Help the right team respond', 'Define a useful monitor and deliver its state changes to an approved destination.', 'monitoring', 'first-monitor'],
      ].map(([Icon,title,copy,area,page]) => <button key={title} onClick={() => onPage(area,page)}><Icon size={26}/><h3>{title}</h3><p>{copy}</p><span>Read the guide <ArrowRight size={15}/></span></button>)}
    </section>
    <section className="tutorial-library" aria-labelledby="tutorial-title">
      <div className="library-heading"><div><p className="eyebrow">LEARN BY DOING</p><h2 id="tutorial-title">Practical guides</h2></div><p>Choose the outcome you need.</p></div>
      <div className="library-filters" aria-label="Filter guides">{['All','Collect','Investigate','Respond'].map(value => <button aria-pressed={category === value} key={value} onClick={() => setCategory(value)}>{value}</button>)}</div>
      <div className="tutorial-list">{TUTORIALS.filter(row => category === 'All' || row[0] === category).map(([kind,title,copy,area,page]) => <button key={title} onClick={() => onPage(area,page)}><small>{kind}</small><div><h3>{title}</h3><p>{copy}</p></div><ArrowRight size={20}/></button>)}</div>
    </section>
    <section className="reference-shelf"><div><Code size={26}/><h2>Looking for a precise detail?</h2><p>Use reference material when you already know the task and need a definition, field, or contract.</p></div><nav aria-label="Reference guides">{[['API and ingestion','api-reference'],['Permissions and access','permissions'],['Log attributes','log-reference'],['Glossary','glossary']].map(([title,id]) => <button key={id} onClick={() => onPage('reference',id)}>{title}<ArrowRight size={16}/></button>)}</nav></section>
    <aside className="reading-help"><BookOpenText size={24}/><div><h2>Not sure where to begin?</h2><p>If data is missing, start with collection checks. If you can see data but cannot explain it, start with the signal guide. If an action is unavailable, check your organization and permissions.</p></div><button className="text-doc-link" onClick={() => onPage('troubleshooting','troubleshoot-collection')}>Find a starting point <ArrowRight size={16}/></button></aside>
  </div>;
}
