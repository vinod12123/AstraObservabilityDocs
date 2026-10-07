import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, Check, CaretDown, Copy, X, MagnifyingGlassPlus, BookOpenText } from '@phosphor-icons/react';
import { findPageById, DOC_SECTIONS, ALL_PAGES } from './docsData';
import { getGuide } from './guideContent';

function GuideTabs({ tabs }) {
  const [selected,setSelected]=useState(0);
  return <div className="guide-tabs"><div role="tablist" aria-label="Choose a path">{tabs.map((tab,index)=><button key={tab.title} role="tab" aria-selected={selected===index} id={`tab-${index}`} aria-controls={`panel-${index}`} tabIndex={selected===index?0:-1} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(selected+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;setSelected(next);e.currentTarget.parentElement.children[next].focus();}}} onClick={()=>setSelected(index)}>{tab.title}</button>)}</div><div role="tabpanel" id={`panel-${selected}`} aria-labelledby={`tab-${selected}`}><h3>{tabs[selected].title}</h3><p>{tabs[selected].text}</p><div className="expected-result"><Check size={18}/><p><strong>Verify the result</strong>{tabs[selected].next}</p></div></div></div>;
}

function GuideImage({block}) {
  const dialog=useRef(null);
  return <figure className="guide-figure"><button className="image-expand" onClick={()=>dialog.current.showModal()} aria-label={`Enlarge ${block.title}`}><img src={block.src} alt={block.title} loading="lazy"/><span><MagnifyingGlassPlus size={18}/> Enlarge image</span></button><figcaption>{block.caption}</figcaption><dialog ref={dialog} className="image-dialog" onClick={e=>{if(e.target===dialog.current)dialog.current.close()}}><button autoFocus onClick={()=>dialog.current.close()} aria-label="Close image"><X size={22}/></button><img src={block.src} alt={block.title}/><p>{block.caption}</p></dialog></figure>;
}

function Checklist({items}) {
  const [done,setDone]=useState(new Set());
  return <div className="guide-checklist"><p className="checklist-progress">Your checklist · {done.size} of {items.length} checked</p>{items.map((item,i)=><label key={item}><input type="checkbox" checked={done.has(i)} onChange={()=>setDone(current=>{const next=new Set(current);next.has(i)?next.delete(i):next.add(i);return next})}/><span>{item}</span></label>)}<small>Progress is kept for this page visit only.</small></div>;
}

function CodeExample({block}) {
  const [status,setStatus]=useState('Copy');
  return <div className="guide-code"><header><span>{block.language}</span><button onClick={async()=>{try{await navigator.clipboard.writeText(block.value);setStatus('Copied')}catch{setStatus('Select and copy the text')}}}>{status}</button></header><pre><code>{block.value}</code></pre></div>;
}

export default function GuideArticle({section,page,onHome,onPage}) {
  const guide=getGuide(section,page);
  const [active,setActive]=useState(guide.sections[0].id);
  const [copied,setCopied]=useState(false);
  const [feedback,setFeedback]=useState('');
  const related=page.related.map(findPageById).filter(Boolean).slice(0,3);
  const moveTo=id=>{
    // Keep the page route intact while making individual sections shareable.
    history.replaceState(null,'',`#${section.id}/${page.id}?section=${encodeURIComponent(id)}`);
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  };
  useEffect(()=>{
    const id=new URLSearchParams(location.hash.split('?')[1] || '').get('section');
    if(id) requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}));
  },[section.id,page.id]);
  useEffect(()=>{const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id)},{rootMargin:'-90px 0px -65% 0px'});document.querySelectorAll('.guide-section').forEach(el=>observer.observe(el));return()=>observer.disconnect()},[section.id,page.id]);
  const linkCard=item=><button type="button" className="topic-link" key={`${item.sectionId}/${item.id}`} onClick={()=>onPage(item.sectionId,item.id)}><BookOpenText size={20}/><span><strong>{item.title}</strong><small>{item.summary}</small></span><ArrowRight size={17}/></button>;
  const renderBlock=(block,index)=>{
    switch(block.type){
      case 'text': return <p key={index}>{block.value}</p>;
      case 'code': return <CodeExample key={index} block={block}/>;
      case 'list': return <ul key={index} className="guide-bullets">{block.items.map(item=><li key={item}>{item}</li>)}</ul>;
      case 'table': return <div className="guide-table" key={index}><table><thead><tr>{block.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{block.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
      case 'note': return <aside className="guide-callout" key={index}><strong>{block.title}</strong><p>{block.value}</p></aside>;
      case 'steps': return <ol className="editorial-steps" key={index}>{block.items.map(([title,copy])=><li key={title}><h3>{title}</h3><p>{copy}</p></li>)}</ol>;
      case 'tabs': return <GuideTabs key={index} tabs={block.tabs}/>;
      case 'checklist': return <Checklist key={index} items={block.items}/>;
      case 'image': return <GuideImage key={index} block={block}/>;
      case 'accordion': return <div className="guide-accordions" key={index}>{block.items.map(([title,copy])=><details key={title}><summary>{title}<CaretDown size={16}/></summary><p>{copy}</p></details>)}</div>;
      case 'links': return <div className="topic-directory" key={index}>{block.ids.map(findPageById).filter(Boolean).map(linkCard)}</div>;
      case 'directory': return <div className="topic-directory" key={index}>{ALL_PAGES.filter(item=>item.sectionId===block.sectionId&&item.id!==page.id).map(linkCard)}</div>;
      default: return null;
    }
  };
  return <div className="article-layout editorial-layout"><article className={`article editorial-article type-${guide.type.toLowerCase().replaceAll(' ','-')}`}>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><button onClick={onHome}>Documentation</button><ArrowRight size={12}/><span>{section.label}</span></nav>
    <header className="editorial-heading"><h1>{page.title}</h1><div className="editorial-meta"><span>{guide.type}</span><span><Clock size={14}/>{guide.time} read</span><button onClick={async()=>{try{await navigator.clipboard.writeText(location.href);setCopied(true)}catch{setCopied(false)}}}><Copy size={14}/>{copied?'Link copied':'Copy page link'}</button></div><p className="guide-lead">{page.summary}</p></header>
    <details className="mobile-article-index"><summary>On this page</summary>{guide.sections.map(item=><button key={item.id} onClick={event=>{event.currentTarget.closest('details').open=false;moveTo(item.id)}}>{item.title}</button>)}</details>
    {guide.sections.map(item=><section key={item.id} id={item.id} className="guide-section"><h2>{item.title}<button aria-label={`Link to ${item.title}`} onClick={()=>moveTo(item.id)}>#</button></h2>{item.blocks.map(renderBlock)}</section>)}
    {related.length>0&&<section id="related-guides" className="guide-section"><h2>Continue exploring</h2><div className="topic-directory">{related.map(linkCard)}</div></section>}
    <footer className="guide-footer"><div><strong>Was this guide helpful?</strong><p>Your selection stays in this browser session.</p></div><button aria-pressed={feedback==='yes'} onClick={()=>setFeedback('yes')}>Yes</button><button aria-pressed={feedback==='no'} onClick={()=>setFeedback('no')}>Not yet</button>{feedback&&<span role="status">{feedback==='yes'?'Thanks for your feedback.':'Try the related guides or ask your organization administrator.'}</span>}</footer>
    <button className="back-to-docs" onClick={onHome}><ArrowLeft size={16}/> Documentation home</button>
  </article><aside className="on-this-page editorial-toc"><div className="toc-tags"><small>In this guide</small><span>{section.label}</span><span>{guide.type}</span></div><strong>On this page</strong>{guide.sections.map(item=><button key={item.id} aria-current={active===item.id?'location':undefined} onClick={()=>moveTo(item.id)}>{item.title}</button>)}{related.length>0&&<button onClick={()=>moveTo('related-guides')}>Continue exploring</button>}<div className="toc-help"><BookOpenText size={21}/><strong>Keep learning</strong><p>Follow a task from your first data to an investigation.</p><button onClick={()=>onPage('get-started','quickstart')}>Open quickstart <ArrowRight size={14}/></button></div></aside></div>;
}
