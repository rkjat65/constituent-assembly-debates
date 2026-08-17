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
    // Exact transcript-name aliases that intentionally share a canonical generated portrait.
    if(portraitRegistry.has('Dr. Sarvepalli Radhakrishnan'))portraitRegistry.set('S. Radhakrishnan',portraitRegistry.get('Dr. Sarvepalli Radhakrishnan'));
    if(portraitRegistry.has('Dr. Rajendra Prasad'))portraitRegistry.set('Rajendra Prasad',portraitRegistry.get('Dr. Rajendra Prasad'));
    if(portraitRegistry.has('Dr. B. R. Ambedkar'))portraitRegistry.set('B. R. Ambedkar',portraitRegistry.get('Dr. B. R. Ambedkar'));
    if(portraitRegistry.has('Dr. Sachchidananda Sinha'))portraitRegistry.set('Sachchidananda Sinha',portraitRegistry.get('Dr. Sachchidananda Sinha'));
  }catch(error){console.warn('Portrait manifest unavailable; using initials.',error);portraitRegistry=new Map()}
}

function media(person,prefix){
  const portrait=portraitRegistry.get(person?.name);
  if(portrait)return `<img data-generated-portrait data-fallback="${esc(initials(person?.name))}" src="${prefix}${esc(portrait)}" alt="Generated editorial portrait of ${esc(person.name)}" loading="lazy" decoding="async">`;
  return `<span class="speaker-initial" aria-hidden="true">${esc(initials(person?.name))}</span>`;
}
function wirePortraitFallbacks(scope){
  scope?.querySelectorAll('img[data-generated-portrait]').forEach(img=>{
    img.addEventListener('error',()=>{const fallback=document.createElement('span');fallback.className='speaker-initial';fallback.setAttribute('aria-hidden','true');fallback.textContent=img.dataset.fallback||'•';img.replaceWith(fallback)},{once:true});
  });
}

async function bootGranular(){
  if(!granularRoot)return;
  const src=granularRoot.dataset.granularSession;
  const prefix=granularRoot.dataset.assetPrefix||'';
  try{
    const [response]=await Promise.all([fetch(src,{cache:'no-store'}),loadPortraitRegistry(prefix)]);
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    const people=new Map((data.speakers||[]).map(p=>[p.id,p]));
    const interventions=data.interventions||[];
    const filters=document.getElementById('speakerFilters');
    const stream=document.getElementById('interventionStream');
    const matrix=document.getElementById('speakerMatrix');
    const count=document.getElementById('interventionCount');
    if(count)count.textContent=String(interventions.length);

    const visibleCountFor=id=>id==='all'?interventions.length:interventions.filter(item=>item.speakerId===id).length;
    if(filters){
      const all=`<button class="speaker-filter active" type="button" data-speaker="all" aria-pressed="true"><span class="speaker-initial">ALL</span><b>All speakers</b><small>${interventions.length}</small></button>`;
      filters.innerHTML=all+(data.speakers||[]).map(person=>`<button class="speaker-filter" type="button" data-speaker="${esc(person.id)}" aria-pressed="false">${media(person,prefix)}<b>${esc(person.shortName||person.name)}</b><small>${visibleCountFor(person.id)}</small></button>`).join('');
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
        const quote=item.excerpt?`<div class="actual-words">${esc(item.excerpt)}</div>`:'';
        const source=item.sourceUrl||data.session?.primarySource?.recordUrl;
        return `<article class="intervention" id="${esc(item.id)}" data-speaker="${esc(item.speakerId)}" tabindex="-1"><div class="intervention-seq">${String(index+1).padStart(2,'0')}</div><div class="intervention-speaker">${media(person,prefix)}<div><strong>${esc(person.name)}</strong><small>${esc(person.role||'Member')}</small></div></div><div class="intervention-body"><div class="intervention-topline"><span class="paragraph-ref">${esc(item.paragraphRef||'Session record')}</span><span class="intervention-kind">${esc(item.kind||'Intervention')}</span></div><p>${esc(item.summary)}</p>${quote}<div class="intervention-tags">${tags}</div>${source?`<a class="source-mini" href="${esc(source)}" target="_blank" rel="noreferrer">Verify in primary record ↗</a>`:''}</div></article>`;
      }).join('');
      wirePortraitFallbacks(stream);
    }

    if(matrix){
      matrix.innerHTML=(data.speakers||[]).map(person=>{const href=person.profile?`${prefix}${person.profile}`:`${prefix}search.html?q=${encodeURIComponent(person.name)}`;return `<a class="card speaker-matrix-card" href="${esc(href)}">${media(person,prefix)}<div><h4>${esc(person.name)}</h4><p>${esc(person.positionSummary||person.role||'')}</p><span class="stance">${esc(person.stance||'Session participant')}</span></div></a>`}).join('');
      wirePortraitFallbacks(matrix);
    }

    // Deep links should land on the exact intervention after the asynchronous timeline has rendered.
    if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target){requestAnimationFrame(()=>{target.classList.add('deep-linked');target.scrollIntoView({block:'center'});target.focus({preventScroll:true});setTimeout(()=>target.classList.remove('deep-linked'),1800)})}}
  }catch(error){
    console.error('Granular session failed to load',error);
    if(granularRoot)granularRoot.innerHTML='<article class="card section-card"><h3>Detailed timeline unavailable</h3><p>The primary source link remains available above.</p></article>';
  }
}
bootGranular();