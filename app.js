document.documentElement.classList.add('js');

const pathParts=window.location.pathname.split('/').filter(Boolean);
const nested=pathParts.some(p=>p==='sessions'||p==='speakers'||p==='topics');
const rootPrefix=nested?'../':'';

function ensureStylesheet(href,key){if(document.querySelector(`link[data-style-key="${key}"]`))return;const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.dataset.styleKey=key;document.head.appendChild(link)}
ensureStylesheet(`${rootPrefix}ux.css`,'archive-ux');
if(document.querySelector('[data-granular-session],.transcript-card'))ensureStylesheet(`${rootPrefix}debate-reader.css`,'debate-reader');

const themeToggle=document.getElementById('themeToggle');
const storedTheme=localStorage.getItem('cad-theme');
if(storedTheme==='dark')document.body.classList.add('dark');
function refreshThemeIcon(){if(!themeToggle)return;const dark=document.body.classList.contains('dark');themeToggle.textContent=dark?'☾':'☼';themeToggle.setAttribute('aria-pressed',String(dark));themeToggle.title=dark?'Use light theme':'Use dark theme'}
refreshThemeIcon();
if(themeToggle){themeToggle.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('cad-theme',document.body.classList.contains('dark')?'dark':'light');refreshThemeIcon()})}

document.querySelectorAll('.main-nav').forEach(nav=>{if(![...nav.querySelectorAll('.nav-item')].some(a=>a.textContent.trim().endsWith('Committees'))){const anchor=[...nav.querySelectorAll('.nav-item')].find(a=>a.textContent.trim().endsWith('Documents'));const link=document.createElement('a');link.href=`${rootPrefix}committees.html`;link.className='nav-item';link.innerHTML='<span>◫</span>Committees';if(anchor)nav.insertBefore(link,anchor);else nav.appendChild(link)}});

const navRoutes={Home:`${rootPrefix}index.html`,Sessions:`${rootPrefix}chronology.html`,Speakers:`${rootPrefix}speakers.html`,Topics:`${rootPrefix}themes.html`,Chronology:`${rootPrefix}chronology.html`,Committees:`${rootPrefix}committees.html`,Documents:`${rootPrefix}documents.html`,Provisions:`${rootPrefix}provisions.html`,'Visual Atlas':`${rootPrefix}visual-atlas.html`,Search:`${rootPrefix}search.html`};
document.querySelectorAll('.main-nav').forEach(nav=>{
  [...nav.querySelectorAll('.nav-item')].forEach(link=>{const label=link.textContent.trim();Object.entries(navRoutes).forEach(([name,url])=>{if(label.endsWith(name))link.setAttribute('href',url)})});
  [...nav.querySelectorAll('.nav-item')].forEach(link=>{const label=link.textContent.trim();if(label.endsWith('Chronology')||label.includes('My Library'))link.remove()});
  const order=['Home','Sessions','Speakers','Topics','Committees','Provisions','Documents','Search','Visual Atlas'];
  order.forEach(name=>{const item=[...nav.querySelectorAll('.nav-item')].find(a=>a.textContent.trim().endsWith(name));if(item)nav.appendChild(item)});
  [...nav.querySelectorAll('.nav-item')].forEach(link=>{const label=link.textContent.trim();if(label.endsWith('Sessions'))link.innerHTML='<span>▦</span>Read Debates';if(label.endsWith('Documents'))link.innerHTML='<span>▧</span>Sources';if(label.endsWith('Visual Atlas'))link.classList.add('nav-supporting')});
});

const activeNav=document.querySelector('.main-nav .nav-item.active');
if(activeNav&&window.matchMedia('(max-width:820px)').matches){requestAnimationFrame(()=>activeNav.scrollIntoView({block:'nearest',inline:'center'}))}

document.querySelectorAll('img').forEach(img=>{img.decoding='async';if(!img.closest('.profile-hero,.home-scene')&&!img.hasAttribute('loading'))img.loading='lazy';img.addEventListener('error',()=>{img.style.display='none';const parent=img.parentElement;if(parent&&!parent.querySelector('.portrait-fallback')){const fallback=document.createElement('div');fallback.className='portrait-fallback';fallback.setAttribute('role','img');fallback.setAttribute('aria-label',img.alt||'Visual asset unavailable');fallback.textContent=img.alt||'Visual asset unavailable';parent.appendChild(fallback)}},{once:true})});

const progress=document.createElement('div');progress.className='page-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
let progressQueued=false;
function paintProgress(){progressQueued=false;const max=document.documentElement.scrollHeight-innerHeight;const ratio=max>0?Math.min(1,Math.max(0,scrollY/max)):0;progress.style.width=`${ratio*100}%`}
addEventListener('scroll',()=>{if(!progressQueued){progressQueued=true;requestAnimationFrame(paintProgress)}},{passive:true});paintProgress();

document.querySelectorAll('[data-share]').forEach(btn=>{btn.addEventListener('click',async()=>{const shareData={title:document.title,url:window.location.href};try{if(navigator.share){await navigator.share(shareData)}else if(navigator.clipboard){await navigator.clipboard.writeText(window.location.href);const old=btn.textContent;btn.textContent='✓ Link copied';setTimeout(()=>btn.textContent=old,1600)}}catch(error){if(error?.name!=='AbortError')console.warn('Share unavailable',error)}})});

document.querySelectorAll('.bookmark-btn,.save-mini').forEach((btn,index)=>{const key=`cad-bookmark:${window.location.pathname}:${index}`;const sync=()=>{const saved=localStorage.getItem(key)==='saved';btn.classList.toggle('saved',saved);btn.setAttribute('aria-pressed',String(saved));if(btn.classList.contains('bookmark-btn'))btn.textContent=saved?'✓  Saved':'♧  Bookmark'};sync();btn.addEventListener('click',()=>{localStorage.setItem(key,localStorage.getItem(key)==='saved'?'':'saved');sync()})});

document.querySelectorAll('.play-mini,.excerpt-btn').forEach(btn=>{btn.addEventListener('click',()=>{const row=btn.closest('.timeline-row');if(!row)return;document.querySelectorAll('.timeline-row').forEach(r=>r.classList.remove('active'));row.classList.add('active');row.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'})})});

const profileRoutes={
  'Dr. Sachchidananda Sinha':'sachchidananda-sinha.html','J. B. Kripalani':'jb-kripalani.html','Jawaharlal Nehru':'jawaharlal-nehru.html','Dr. Rajendra Prasad':'rajendra-prasad.html','Dr. B. R. Ambedkar':'br-ambedkar.html','S. Radhakrishnan':'sarvepalli-radhakrishnan.html','Dr. Sarvepalli Radhakrishnan':'sarvepalli-radhakrishnan.html','Syama Prasad Mookerjee':'syama-prasad-mookerjee.html','Syama Prasad Mukherjee':'syama-prasad-mookerjee.html','K. M. Munshi':'km-munshi.html'
};
document.querySelectorAll('.speaker-card').forEach(card=>{const name=card.querySelector('.speaker-copy h3')?.textContent.trim();const button=card.querySelector('.outline-btn');if(name&&button&&profileRoutes[name]&&button.tagName!=='A')button.addEventListener('click',()=>{window.location.href=`${rootPrefix}speakers/${profileRoutes[name]}`})});

function parseSittingDate(){const text=document.querySelector('.session-meta-line span')?.textContent.trim()||'';const d=new Date(text);if(Number.isNaN(d.getTime()))return '';const yyyy=d.getFullYear();const mm=String(d.getMonth()+1).padStart(2,'0');const dd=String(d.getDate()).padStart(2,'0');return `${yyyy}-${mm}-${dd}`}
function pdlPdfForLegacy(recordUrl,date){const handle=String(recordUrl||'').match(/handle\/123456789\/(\d+)/);const parts=String(date||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!handle||!parts)return '';return `https://eparlib.sansad.in/bitstream/123456789/${handle[1]}/1/cad_${parts[3]}-${parts[2]}-${parts[1]}.pdf`}
function upgradeLegacySessionReader(){
  const outline=document.querySelector('.transcript-card');
  if(!outline||document.querySelector('[data-granular-session]'))return;
  const heading=outline.querySelector('.transcript-head h3');
  if(heading)heading.innerHTML='Guided sitting outline <small>Editorial navigation</small>';
  const timecode=document.querySelector('.readalong-bar .timecode');if(timecode)timecode.textContent='Guided outline';
  const record=[...document.querySelectorAll('a[href*="eparlib.sansad.in/handle/123456789/"]')].map(a=>a.href).find(Boolean);
  const date=parseSittingDate();const pdf=pdlPdfForLegacy(record,date);
  if(!record||document.getElementById('officialTranscript'))return;
  const reader=document.createElement('section');reader.className='official-reader card legacy-official-reader';reader.id='officialTranscript';
  reader.innerHTML=`<div class="official-reader-head"><div><span class="reader-kicker">PRIMARY RECORD</span><h3>Read the official debate text</h3><p>The outline above is editorial. This panel opens the Parliament Digital Library record itself.</p></div><div class="official-reader-actions"><a class="ghost-btn button-link" href="${record}" target="_blank" rel="noreferrer">Record ↗</a>${pdf?`<a class="primary-link" href="${pdf}" target="_blank" rel="noreferrer">PDF ↗</a>`:''}</div></div>${pdf?`<div class="official-frame-wrap"><iframe class="official-frame" src="${pdf}#view=FitH" title="Official Parliament Digital Library debate transcript"></iframe><div class="official-frame-fallback"><strong>If the embedded PDF is blocked, open the PDF directly.</strong><span>Parliament Digital Library / Lok Sabha Secretariat.</span></div></div>`:''}`;
  const source=document.querySelector('.source-strip');if(source)source.parentNode.insertBefore(reader,source);else outline.insertAdjacentElement('afterend',reader);
  const actions=document.querySelector('.page-header .header-actions');if(actions&&!actions.querySelector('a[href="#officialTranscript"]')){const link=document.createElement('a');link.className='ghost-btn button-link';link.href='#officialTranscript';link.innerHTML='▧&nbsp; Official text';actions.insertBefore(link,actions.firstChild)}
}
upgradeLegacySessionReader();

document.addEventListener('keydown',e=>{const tag=document.activeElement?.tagName;if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(tag)&&!document.getElementById('archiveSearch')){e.preventDefault();window.location.href=`${rootPrefix}search.html`}});

if(pathParts.includes('sessions')&&!document.querySelector('script[data-session-nav]')){const sessionNav=document.createElement('script');sessionNav.src=`${rootPrefix}session-nav.js`;sessionNav.defer=true;sessionNav.dataset.sessionNav='true';document.body.appendChild(sessionNav)}
