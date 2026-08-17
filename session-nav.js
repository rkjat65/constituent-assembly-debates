(async()=>{
  const match=location.pathname.match(/\/sessions\/(\d{4}-\d{2}-\d{2})\.html$/);
  if(!match)return;
  const currentDate=match[1];
  const prefix='../';
  if(!document.querySelector('link[data-session-nav-css]')){const css=document.createElement('link');css.rel='stylesheet';css.href=`${prefix}session-nav.css`;css.dataset.sessionNavCss='true';document.head.appendChild(css)}
  try{
    const response=await fetch(`${prefix}data/chronology.json`,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    const records=(data.records||[]).filter(record=>record.date);
    const currentIndex=records.findIndex(record=>record.date===currentDate);
    if(currentIndex<0)return;
    const previous=[...records.slice(0,currentIndex)].reverse().find(record=>record.status==='ready'&&record.route);
    const next=records.slice(currentIndex+1).find(record=>record.status==='ready'&&record.route);
    const immediateNext=records[currentIndex+1];
    const format=date=>new Date(`${date}T00:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();
    const label=record=>record?.title||format(record?.date||'');
    const nav=document.createElement('nav');
    nav.className='session-continuity card';
    nav.setAttribute('aria-label','Chronological session navigation');
    const prevHtml=previous?`<a class="session-continuity-link previous" href="${prefix}${previous.route}" data-session-prev><span>← ${format(previous.date)}</span><strong>${label(previous)}</strong></a>`:`<span class="session-continuity-link disabled"><span>← Previous sitting</span><strong>Start of prepared archive</strong></span>`;
    let nextHtml='';
    if(next){nextHtml=`<a class="session-continuity-link next" href="${prefix}${next.route}" data-session-next><span>${format(next.date)} →</span><strong>${label(next)}</strong></a>`}
    else if(immediateNext){nextHtml=`<a class="session-continuity-link next pending" href="${prefix}chronology.html"><span>${format(immediateNext.date)} · being structured →</span><strong>${label(immediateNext)}</strong></a>`}
    else{nextHtml=`<a class="session-continuity-link next pending" href="${prefix}chronology.html"><span>Continue in chronology →</span><strong>See archive status</strong></a>`}
    nav.innerHTML=`${prevHtml}<div class="session-continuity-center"><span>Chronological reading</span><a href="${prefix}chronology.html">All sittings</a></div>${nextHtml}`;
    const source=document.querySelector('.source-strip');
    if(source)source.before(nav);else document.querySelector('.workspace')?.append(nav);
    document.addEventListener('keydown',event=>{
      if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
      if(event.key==='['&&previous){location.href=`${prefix}${previous.route}`}
      if(event.key===']'&&next){location.href=`${prefix}${next.route}`}
    });
  }catch(error){console.warn('Chronological session navigation unavailable',error)}
})();
