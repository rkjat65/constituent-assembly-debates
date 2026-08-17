const genealogyRoot=document.querySelector('[data-provision-genealogy]');

function escProvision(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]))}
function prettyDate(value){const d=new Date(`${value}T00:00:00`);return Number.isNaN(d.getTime())?value:d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}

async function bootProvisionGenealogy(){
  if(!genealogyRoot)return;
  const src=genealogyRoot.dataset.provisionGenealogy;
  const grid=document.getElementById('provisionFamilyGrid');
  const detail=document.getElementById('provisionGenealogyDetail');
  const search=document.getElementById('provisionSearch');
  const count=document.getElementById('provisionFamilyCount');
  try{
    const response=await fetch(src,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    const families=data.families||[];
    if(count)count.textContent=String(families.length);
    const hashId=decodeURIComponent(location.hash.replace(/^#/,''));
    let activeId=families.some(f=>f.id===hashId)?hashId:(families[0]?.id||'');

    function familyCard(family){
      return `<button type="button" id="${escProvision(family.id)}" class="card provision-family-card${family.id===activeId?' active':''}" data-family="${escProvision(family.id)}" aria-pressed="${family.id===activeId}"><span class="provision-family-label">${escProvision(family.label)}</span><h3>${escProvision(family.title)}</h3><p>${escProvision(family.summary)}</p><div class="provision-family-meta"><span>${family.roots?.length||0} indexed stages</span><b>Open genealogy →</b></div></button>`;
    }

    function renderGrid(query=''){
      const needle=query.trim().toLowerCase();
      const visible=families.filter(f=>!needle||`${f.label} ${f.title} ${f.summary} ${(f.keywords||[]).join(' ')}`.toLowerCase().includes(needle));
      grid.innerHTML=visible.map(familyCard).join('')||'<article class="card section-card"><h3>No matching constitutional family</h3><p>Try equality, religion, remedies, Union, labour or minority rights.</p></article>';
      grid.querySelectorAll('[data-family]').forEach(btn=>btn.addEventListener('click',()=>{activeId=btn.dataset.family;history.replaceState(null,'',`#${encodeURIComponent(activeId)}`);renderGrid(search?.value||'');renderDetail(true)}));
    }

    function renderDetail(scroll=false){
      const family=families.find(f=>f.id===activeId)||families[0];
      if(!family)return;
      const roots=(family.roots||[]).map((root,index)=>`<article class="genealogy-stage"><div class="genealogy-stage-index">${String(index+1).padStart(2,'0')}</div><div class="genealogy-stage-line" aria-hidden="true"></div><div class="genealogy-stage-copy"><div class="genealogy-stage-top"><time>${escProvision(prettyDate(root.date))}</time><span>${escProvision(root.stage)}</span></div><h4>${escProvision(root.title)}</h4><p>${escProvision(root.note)}</p><a href="${escProvision(root.url)}">Open dated record →</a></div></article>`).join('');
      detail.innerHTML=`<div class="provision-detail-head"><div><span class="detail-kicker">${escProvision(family.label)}</span><h3>${escProvision(family.title)}</h3><p>${escProvision(family.summary)}</p></div><aside><span>Final constitutional family</span><strong>${escProvision(family.finalFamily)}</strong></aside></div><div class="genealogy-track">${roots}</div><div class="genealogy-warning"><strong>Interpretation rule</strong><p>${escProvision(data.methodNote||'')}</p></div>`;
      if(scroll)detail.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'});
    }

    search?.addEventListener('input',()=>renderGrid(search.value));
    addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.replace(/^#/,''));if(families.some(f=>f.id===id)){activeId=id;renderGrid(search?.value||'');renderDetail()}});
    renderGrid();
    renderDetail();
  }catch(error){
    console.error('Provision genealogy failed to load',error);
    genealogyRoot.innerHTML='<article class="card section-card"><h3>Provision genealogy unavailable</h3><p>The dated debate pages remain available through Chronology and Search.</p></article>';
  }
}

bootProvisionGenealogy();
