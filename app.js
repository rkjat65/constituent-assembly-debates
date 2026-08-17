const themeToggle=document.getElementById('themeToggle');
const storedTheme=localStorage.getItem('cad-theme');
if(storedTheme==='dark')document.body.classList.add('dark');

function refreshThemeIcon(){
  if(!themeToggle)return;
  themeToggle.textContent=document.body.classList.contains('dark')?'☾':'☼';
}
refreshThemeIcon();

if(themeToggle){
  themeToggle.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
    localStorage.setItem('cad-theme',document.body.classList.contains('dark')?'dark':'light');
    refreshThemeIcon();
  });
}

// Keep navigation correct whether the current page lives at repository root or /sessions/.
const inSessions=window.location.pathname.includes('/sessions/');
const rootPrefix=inSessions?'../':'';
const navRoutes={
  'Home':`${rootPrefix}index.html`,
  'Sessions':`${rootPrefix}chronology.html`,
  'Speakers':`${rootPrefix}speakers.html`,
  'Topics':`${rootPrefix}themes.html`,
  'Chronology':`${rootPrefix}chronology.html`,
  'Provisions':`${rootPrefix}themes.html`
};
document.querySelectorAll('.main-nav .nav-item').forEach(link=>{
  const label=link.textContent.trim();
  Object.entries(navRoutes).forEach(([name,url])=>{
    if(label.endsWith(name))link.setAttribute('href',url);
  });
});

// Never leave an empty portrait box if a future asset path is wrong.
document.querySelectorAll('img').forEach(img=>{
  img.addEventListener('error',()=>{
    img.style.display='none';
    const parent=img.parentElement;
    if(parent && !parent.querySelector('.portrait-fallback')){
      const fallback=document.createElement('div');
      fallback.className='portrait-fallback';
      fallback.textContent=img.alt?.replace('Custom illustrated archival portrait of ','').replace('Custom illustrated portrait of ','')||'Portrait asset';
      parent.appendChild(fallback);
    }
  },{once:true});
});

document.querySelectorAll('[data-share]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const shareData={title:document.title,url:window.location.href};
    try{
      if(navigator.share){
        await navigator.share(shareData);
      }else if(navigator.clipboard){
        await navigator.clipboard.writeText(window.location.href);
        const old=btn.textContent;
        btn.textContent='✓ Link copied';
        setTimeout(()=>btn.textContent=old,1600);
      }
    }catch(error){
      if(error?.name!=='AbortError')console.warn('Share unavailable',error);
    }
  });
});

document.querySelectorAll('.bookmark-btn,.save-mini').forEach((btn,index)=>{
  const key=`cad-bookmark:${window.location.pathname}:${index}`;
  if(localStorage.getItem(key)==='saved')btn.classList.add('saved');
  btn.addEventListener('click',()=>{
    const saved=btn.classList.toggle('saved');
    localStorage.setItem(key,saved?'saved':'');
    if(btn.classList.contains('bookmark-btn'))btn.textContent=saved?'✓  Saved':'♧  Bookmark';
  });
});

document.querySelectorAll('.play-mini,.excerpt-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const row=btn.closest('.timeline-row');
    if(!row)return;
    document.querySelectorAll('.timeline-row').forEach(r=>r.classList.remove('active'));
    row.classList.add('active');
    row.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
});