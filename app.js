document.documentElement.classList.add('js');

const pathParts=window.location.pathname.split('/').filter(Boolean);
const nested=pathParts.some(p=>p==='sessions'||p==='speakers'||p==='topics');
const rootPrefix=nested?'../':'';

// Load shared UX polish from a single file so every static route stays consistent.
if(!document.querySelector('link[data-archive-ux]')){
  const ux=document.createElement('link');
  ux.rel='stylesheet';ux.href=`${rootPrefix}ux.css`;ux.dataset.archiveUx='true';
  document.head.appendChild(ux);
}

const themeToggle=document.getElementById('themeToggle');
const storedTheme=localStorage.getItem('cad-theme');
if(storedTheme==='dark')document.body.classList.add('dark');
function refreshThemeIcon(){if(!themeToggle)return;const dark=document.body.classList.contains('dark');themeToggle.textContent=dark?'☾':'☼';themeToggle.setAttribute('aria-pressed',String(dark));themeToggle.title=dark?'Use light theme':'Use dark theme'}
refreshThemeIcon();
if(themeToggle){themeToggle.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('cad-theme',document.body.classList.contains('dark')?'dark':'light');refreshThemeIcon()})}

// Keep navigation correct from root pages and nested /sessions/, /speakers/ and /topics/ routes.
const navRoutes={Home:`${rootPrefix}index.html`,Sessions:`${rootPrefix}chronology.html`,Speakers:`${rootPrefix}speakers.html`,Topics:`${rootPrefix}themes.html`,Chronology:`${rootPrefix}chronology.html`,Documents:`${rootPrefix}documents.html`,Provisions:`${rootPrefix}provisions.html`,'Visual Atlas':`${rootPrefix}visual-atlas.html`,Search:`${rootPrefix}search.html`};
document.querySelectorAll('.main-nav .nav-item').forEach(link=>{const label=link.textContent.trim();Object.entries(navRoutes).forEach(([name,url])=>{if(label.endsWith(name))link.setAttribute('href',url)})});

// On narrow screens, keep the current destination visible inside the horizontal nav rail.
const activeNav=document.querySelector('.main-nav .nav-item.active');
if(activeNav&&window.matchMedia('(max-width:820px)').matches){requestAnimationFrame(()=>activeNav.scrollIntoView({block:'nearest',inline:'center'}))}

// Make non-critical imagery cheap to load and never leave a blank visual box on failure.
document.querySelectorAll('img').forEach(img=>{
  img.decoding='async';
  if(!img.closest('.profile-hero,.home-scene')&&!img.hasAttribute('loading'))img.loading='lazy';
  img.addEventListener('error',()=>{
    img.style.display='none';
    const parent=img.parentElement;
    if(parent&&!parent.querySelector('.portrait-fallback')){
      const fallback=document.createElement('div');fallback.className='portrait-fallback';fallback.setAttribute('role','img');fallback.setAttribute('aria-label',img.alt||'Visual asset unavailable');fallback.textContent=img.alt||'Visual asset unavailable';parent.appendChild(fallback)
    }
  },{once:true})
});

// Thin reading-progress indicator on longer pages; passive scroll listener avoids jank.
const progress=document.createElement('div');progress.className='page-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
let progressQueued=false;
function paintProgress(){progressQueued=false;const max=document.documentElement.scrollHeight-innerHeight;const ratio=max>0?Math.min(1,Math.max(0,scrollY/max)):0;progress.style.width=`${ratio*100}%`}
addEventListener('scroll',()=>{if(!progressQueued){progressQueued=true;requestAnimationFrame(paintProgress)}},{passive:true});paintProgress();

document.querySelectorAll('[data-share]').forEach(btn=>{btn.addEventListener('click',async()=>{const shareData={title:document.title,url:window.location.href};try{if(navigator.share){await navigator.share(shareData)}else if(navigator.clipboard){await navigator.clipboard.writeText(window.location.href);const old=btn.textContent;btn.textContent='✓ Link copied';setTimeout(()=>btn.textContent=old,1600)}}catch(error){if(error?.name!=='AbortError')console.warn('Share unavailable',error)}})});

document.querySelectorAll('.bookmark-btn,.save-mini').forEach((btn,index)=>{const key=`cad-bookmark:${window.location.pathname}:${index}`;const sync=()=>{const saved=localStorage.getItem(key)==='saved';btn.classList.toggle('saved',saved);btn.setAttribute('aria-pressed',String(saved));if(btn.classList.contains('bookmark-btn'))btn.textContent=saved?'✓  Saved':'♧  Bookmark'};sync();btn.addEventListener('click',()=>{localStorage.setItem(key,localStorage.getItem(key)==='saved'?'':'saved');sync()})});

document.querySelectorAll('.play-mini,.excerpt-btn').forEach(btn=>{btn.addEventListener('click',()=>{const row=btn.closest('.timeline-row');if(!row)return;document.querySelectorAll('.timeline-row').forEach(r=>r.classList.remove('active'));row.classList.add('active');row.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'})})});

// Turn debate-page profile buttons into real personality routes.
const profileRoutes={'Dr. Sachchidananda Sinha':'sachchidananda-sinha.html','J. B. Kripalani':'jb-kripalani.html','Jawaharlal Nehru':'jawaharlal-nehru.html','Dr. Rajendra Prasad':'rajendra-prasad.html','Dr. B. R. Ambedkar':'br-ambedkar.html'};
document.querySelectorAll('.speaker-card').forEach(card=>{const name=card.querySelector('.speaker-copy h3')?.textContent.trim();const button=card.querySelector('.outline-btn');if(name&&button&&profileRoutes[name]&&button.tagName!=='A')button.addEventListener('click',()=>{window.location.href=`${rootPrefix}speakers/${profileRoutes[name]}`})});

// Slash opens archive search from any non-form context.
document.addEventListener('keydown',e=>{const tag=document.activeElement?.tagName;if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(tag)&&!document.getElementById('archiveSearch')){e.preventDefault();window.location.href=`${rootPrefix}search.html`}});

// Legacy My Library links remain non-functional until the public archive index is mature.
document.querySelectorAll('.main-nav .nav-item').forEach(link=>{if(link.textContent.includes('My Library')&&link.getAttribute('href')==='#'){link.addEventListener('click',e=>{e.preventDefault();link.title='Library will be added after the core public archive is indexed'})}});
