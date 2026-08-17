const granularRoot=document.querySelector('[data-granular-session]');

function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function initials(name){return String(name||'').replace(/Dr\.|Mr\.|Mrs\.|Sardar|Pandit|The Hon.?ble/gi,'').trim().split(/\s+/).slice(0,2).map(p=>p[0]||'').join('').toUpperCase()||'•'}
function media(person,prefix){if(person?.portrait)return `<img src="${prefix}${esc(person.portrait)}" alt="Illustrated portrait of ${esc(person.name)}">`;return `<span class="speaker-initial" aria-hidden="true">${esc(initials(person?.name))}</span>`}

async function bootGranular(){
  if(!granularRoot)return;
  const src=granularRoot.dataset.granularSession;
  const prefix=granularRoot.dataset.assetPrefix||'';
  try{
    const response=await fetch(src,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    const people=new Map((data.speakers||[]).map(p=>[p.id,p]));
    const interventions=data.interventions||[];
    const filters=document.getElementById('speakerFilters');
    const stream=document.getElementById('interventionStream');
    const matrix=document.getElementById('speakerMatrix');
    const count=document.getElementById('interventionCount');
    if(count)count.textContent=String(interventions.length);
    if(filters){
      const all=`<button class="speaker-filter active" type="button" data-speaker="all"><span class="speaker-initial">ALL</span><b>All speakers</b></button>`;
      filters.innerHTML=all+(data.speakers||[]).map(person=>`<button class="speaker-filter" type="button" data-speaker="${esc(person.id)}">${media(person,prefix)}<b>${esc(person.shortName||person.name)}</b></button>`).join('');
      filters.querySelectorAll('.speaker-filter').forEach(btn=>btn.addEventListener('click',()=>{
        filters.querySelectorAll('.speaker-filter').forEach(b=>b.classList.toggle('active',b===btn));
        const target=btn.dataset.speaker;
        stream?.querySelectorAll('.intervention').forEach(row=>row.classList.toggle('hidden',target!=='all'&&row.dataset.speaker!==target));
      }));
    }
    if(stream){
      stream.innerHTML=interventions.map((item,index)=>{
        const person=people.get(item.speakerId)||{name:item.speaker||'Assembly'};
        const tags=(item.tags||[]).map(t=>`<span>${esc(t)}</span>`).join('');
        const quote=item.excerpt?`<div class="actual-words">${esc(item.excerpt)}</div>`:'';
        const source=item.sourceUrl||data.session?.primarySource?.recordUrl;
        return `<article class="intervention" id="${esc(item.id)}" data-speaker="${esc(item.speakerId)}"><div class="intervention-seq">${String(index+1).padStart(2,'0')}</div><div class="intervention-speaker">${media(person,prefix)}<div><strong>${esc(person.name)}</strong><small>${esc(person.role||'Member')}</small></div></div><div class="intervention-body"><div class="intervention-topline"><span class="paragraph-ref">${esc(item.paragraphRef||'Session record')}</span><span class="intervention-kind">${esc(item.kind||'Intervention')}</span></div><p>${esc(item.summary)}</p>${quote}<div class="intervention-tags">${tags}</div>${source?`<a class="source-mini" href="${esc(source)}" target="_blank" rel="noreferrer">Verify in primary record ↗</a>`:''}</div></article>`;
      }).join('');
    }
    if(matrix){
      matrix.innerHTML=(data.speakers||[]).map(person=>{const href=person.profile?`${prefix}${person.profile}`:'#interventionStream';return `<a class="card speaker-matrix-card" href="${esc(href)}">${media(person,prefix)}<div><h4>${esc(person.name)}</h4><p>${esc(person.positionSummary||person.role||'')}</p><span class="stance">${esc(person.stance||'Session participant')}</span></div></a>`}).join('');
    }
  }catch(error){
    console.error('Granular session failed to load',error);
    if(granularRoot)granularRoot.innerHTML='<article class="card section-card"><h3>Detailed timeline unavailable</h3><p>The primary source link remains available above.</p></article>';
  }
}
bootGranular();