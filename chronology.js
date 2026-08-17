const chronologyRoot=document.querySelector('[data-chronology]');

function escChronology(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function formatChronologyDate(value){const d=new Date(`${value}T00:00:00`);return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}

(async()=>{
  if(!chronologyRoot)return;
  try{
    const response=await fetch(chronologyRoot.dataset.chronology,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    const records=data.records||[];
    const ready=records.filter(record=>record.status==='ready'&&record.route);
    const latest=ready.at(-1);
    const count=document.getElementById('chronologyCount');
    const latestLabel=document.getElementById('chronologyLatest');
    const sourceLink=document.getElementById('chronologySourceLink');
    if(count)count.textContent=String(ready.length);
    if(latestLabel&&latest)latestLabel.textContent=formatChronologyDate(latest.date);
    if(sourceLink&&data.source?.englishChronologyUrl)sourceLink.href=data.source.englishChronologyUrl;
    let priorVolume='';
    chronologyRoot.innerHTML=records.map(record=>{
      const eraBreak=priorVolume&&record.volume!==priorVolume;
      priorVolume=record.volume;
      const classes=['chronology-item'];
      if(record.status==='ready')classes.push('ready');
      if(eraBreak)classes.push('era-break');
      const icon=record.kind==='granular'?'≡':record.kind==='prepared'?'◆':'•';
      const inner=`<time>${escChronology(formatChronologyDate(record.date))}</time><span class="chronology-dot"></span><div><strong>${escChronology(record.title||record.date)}</strong><small>${escChronology(record.detail||record.status)}</small></div><b>${icon}</b>`;
      return record.status==='ready'&&record.route?`<a class="${classes.join(' ')}" href="${escChronology(record.route)}">${inner}</a>`:`<div class="${classes.join(' ')}">${inner}</div>`;
    }).join('');
  }catch(error){
    console.error('Chronology failed to load',error);
    chronologyRoot.innerHTML='<article class="card section-card"><h3>Chronology temporarily unavailable</h3><p>The dated session routes remain searchable through the archive.</p></article>';
  }
})();
