const granularRoot=document.querySelector('[data-granular-session]');

function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function initials(name){return String(name||'').replace(/Dr\.|Mr\.|Mrs\.|Sardar|Pandit|The Hon.?ble|Sri|Shri|Seth|Sir|Maulana|Rajkumari/gi,'').trim().split(/\s+/).slice(0,2).map(p=>p[0]||'').join('').toUpperCase()||'•'}

let portraitRegistry=new Map();
async function loadPortraitRegistry(prefix){
  try{
    const response=await fetch(`${prefix}assets/portraits/manifest.json`,{cache:'no-store'});
    if(!response.ok)throw new Error(`portrait manifest HTTP ${response.status}`);
    const manifest=await response.json();
    portraitRegistry=new Map(Object.entries(manifest.portraits||{}));
    if(portraitRegistry.has('Dr. Sarvepalli Radhakrishnan'))portraitRegistry.set('S. Radhakrishnan',portraitRegistry.get('Dr. Sarvepalli Radhakrishnan'));
    if(portraitRegistry.has('Dr. Rajendra Prasad'))portraitRegistry.set('Rajendra Prasad',portraitRegistry.get('Dr. Rajendra Prasad'));
    if(portraitRegistry.has('Dr. B. R. Ambedkar'))portraitRegistry.set('B. R. Ambedkar',portraitRegistry.get('Dr. B. R. Ambedkar'));
    if(portraitRegistry.has('Dr. Sachchidananda Sinha'))portraitRegistry.set('Sachchidananda Sinha',portraitRegistry.get('Dr. Sachchidananda Sinha'));
  }catch(error){console.warn('Portrait manifest unavailable; using initials.',error);portraitRegistry=new Map()}
}

function media(person,prefix,thumb=false){
  let portrait=portraitRegistry.get(person?.name);
  if(portrait&&thumb)portrait=portrait.replace('/portraits/','/portraits/thumbs/');
  if(portrait)return `<img data-generated-portrait data-fallback="${esc(initials(person?.name))}" src="${prefix}${esc(portrait)}" alt="Generated editorial portrait of ${esc(person.name)}" loading="lazy" decoding="async">`;
  return `<span class="speaker-initial" aria-hidden="true">${esc(initials(person?.name))}</span>`;
}
function wirePortraitFallbacks(scope){
  scope?.querySelectorAll('img[data-generated-portrait]').forEach(img=>{
    img.addEventListener('error',()=>{const fallback=document.createElement('span');fallback.className='speaker-initial';fallback.setAttribute('aria-hidden','true');fallback.textContent=img.dataset.fallback||'•';img.replaceWith(fallback)},{once:true});
  });
}

function pdlFileNameFromDate(date){
  const match=String(date||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match?`cad_${match[3]}-${match[2]}-${match[1]}.pdf`:'';
}
function derivePdfUrl(session){
  const explicit=session?.primarySource?.pdfUrl;
  if(explicit)return explicit;
  const record=session?.primarySource?.recordUrl||'';
  const file=session?.primarySource?.fileName||pdlFileNameFromDate(session?.date);
  const match=record.match(/handle\/123456789\/(\d+)/);
  if(match&&file)return `https://eparlib.sansad.in/bitstream/123456789/${match[1]}/1/${encodeURIComponent(file)}`;
  return '';
}

function normalizeReaderLabels(){
  const head=granularRoot?.querySelector('.granular-head')||granularRoot?.closest('.granular-card')?.querySelector('.granular-head');
  if(!head)return;
  const title=head.querySelector('h3');
  const copy=head.querySelector('p');
  const legend=head.querySelector('.granular-legend');
  if(title)title.textContent='The debate, in speaking order';
  if(copy)copy.textContent='Follow the interventions as a conversation between members. Editorial summaries explain each turn; the official Parliament transcript is placed immediately after this reader.';
  if(legend)legend.innerHTML='<span>Guided cards = editorial navigation</span><span>Official transcript = primary record</span>';
}

function makeOfficialReader(data,afterNode){
  const source=data.session?.primarySource||{};
  const pdfUrl=derivePdfUrl(data.session);
  if(!afterNode||!source.recordUrl)return;
  const section=document.createElement('section');
  section.className='official-reader card';
  section.id='officialTranscript';
  section.innerHTML=`<div class="official-reader-head"><div><span class="reader-kicker">PRIMARY RECORD</span><h3>Read the official debate text</h3><p>This is the Parliament Digital Library record. The conversation cards above are a navigation and comprehension layer, not a substitute for the transcript.</p></div><div class="official-reader-actions"><a class="ghost-btn button-link" href="${esc(source.recordUrl)}" target="_blank" rel="noreferrer">Open record ↗</a>${pdfUrl?`<a class="primary-link" href="${esc(pdfUrl)}" target="_blank" rel="noreferrer">Open PDF ↗</a>`:''}</div></div>${pdfUrl?`<div class="official-frame-wrap"><iframe class="official-frame" src="${esc(pdfUrl)}#view=FitH" title="Official Parliament Digital Library debate transcript"></iframe><div class="official-frame-fallback"><strong>If your browser blocks the embedded PDF, use “Open PDF”.</strong><span>The authoritative source remains Parliament Digital Library / Lok Sabha Secretariat.</span></div></div>`:`<div class="official-reader-empty">The official record is linked above. An embeddable PDF URL is not available for this sitting yet.</div>`}`;
  afterNode.insertAdjacentElement('afterend',section);
  const actions=document.querySelector('.page-header .header-actions');
  if(actions&&!actions.querySelector('a[href="#officialTranscript"]')){const link=document.createElement('a');link.className='ghost-btn button-link';link.href='#officialTranscript';link.innerHTML='▧&nbsp; Official transcript';actions.insertBefore(link,actions.firstChild)}
}

async function bootGranular(){
  if(!granularRoot)return;
  const src=granularRoot.dataset.granularSession;
  const prefix=granularRoot.dataset.assetPrefix||'';
  try{
    const [response]=await Promise.all([fetch(src,{cache:'no-store'}),loadPortraitRegistry(prefix)]);
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    normalizeReaderLabels();
    const people=new Map((data.speakers||[]).map(p=>[p.id,p]));
    const interventions=data.interventions||[];
    const filters=document.getElementById('speakerFilters');
    const stream=document.getElementById('interventionStream');
    const matrix=document.getElementById('speakerMatrix');
    const count=document.getElementById('interventionCount');
    if(count)count.textContent=String(interventions.length);

    const visibleCountFor=id=>id==='all'?interventions.length:interventions.filter(item=>item.speakerId===id).length;
    if(filters){
      const all=`<button class="speaker-filter active" type="button" data-speaker="all" aria-pressed="true"><span class="speaker-initial">ALL</span><b>Whole debate</b><small>${interventions.length}</small></button>`;
      filters.innerHTML=all+(data.speakers||[]).map(person=>`<button class="speaker-filter" type="button" data-speaker="${esc(person.id)}" aria-pressed="false">${media(person,prefix,true)}<b>${esc(person.shortName||person.name)}</b><small>${visibleCountFor(person.id)}</small></button>`).join('');
      wirePortraitFallbacks(filters);
      filters.querySelectorAll('.speaker-filter').forEach(btn=>btn.addEventListener('click',()=>{
        filters.querySelectorAll('.speaker-filter').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
        const target=btn.dataset.speaker;
        stream?.querySelectorAll('.intervention').forEach(row=>row.classList.toggle('hidden',target!=='all'&&row.dataset.speaker!==target));
        const firstVisible=stream?.querySelector('.intervention:not(.hidden)');
        if(firstVisible&&target!=='all')firstVisible.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'});
      }));
    }

    if(stream){
      stream.innerHTML=interventions.map((item,index)=>{
        const person=people.get(item.speakerId)||{name:item.speaker||'Assembly'};
        const tags=(item.tags||[]).map(t=>`<span>${esc(t)}</span>`).join('');
        const quote=item.excerpt?`<blockquote class="actual-words"><span>Exact words</span>${esc(item.excerpt)}</blockquote>`:'';
        const source=item.sourceUrl||data.session?.primarySource?.recordUrl;
        const role=person.role||'Member';
        return `<article class="intervention debate-turn" id="${esc(item.id)}" data-speaker="${esc(item.speakerId)}" tabindex="-1"><div class="turn-rail"><span class="turn-number">${String(index+1).padStart(2,'0')}</span>${media(person,prefix,true)}</div><div class="turn-card"><header class="turn-speaker"><div><strong>${esc(person.name)}</strong><small>${esc(role)}</small></div><div class="turn-meta"><span class="paragraph-ref">${esc(item.paragraphRef||'Session record')}</span><span class="intervention-kind">${esc(item.kind||'Intervention')}</span></div></header><div class="turn-copy"><p>${esc(item.summary)}</p>${quote}</div><footer class="turn-footer"><div class="intervention-tags">${tags}</div>${source?`<a class="source-mini" href="${esc(source)}" target="_blank" rel="noreferrer">Read exact record ↗</a>`:''}</footer></div></article>`;
      }).join('');
      wirePortraitFallbacks(stream);
    }

    if(matrix){
      matrix.innerHTML=(data.speakers||[]).map(person=>{const href=person.profile?`${prefix}${person.profile}`:`${prefix}search.html?q=${encodeURIComponent(person.name)}`;return `<a class="card speaker-matrix-card" href="${esc(href)}">${media(person,prefix,true)}<div><h4>${esc(person.name)}</h4><p>${esc(person.positionSummary||person.role||'')}</p><span class="stance">${esc(person.stance||'Session participant')}</span></div></a>`}).join('');
      wirePortraitFallbacks(matrix);
    }

    const granularCard=granularRoot.closest('.granular-card')||granularRoot;
    if(!document.getElementById('officialTranscript'))makeOfficialReader(data,granularCard);

    if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target){requestAnimationFrame(()=>{target.classList.add('deep-linked');target.scrollIntoView({block:'center'});target.focus({preventScroll:true});setTimeout(()=>target.classList.remove('deep-linked'),1800)})}}
  }catch(error){
    console.error('Granular session failed to load',error);
    if(granularRoot)granularRoot.innerHTML='<article class="card section-card"><h3>Detailed reading unavailable</h3><p>The primary source link remains available above.</p></article>';
  }
}
bootGranular();