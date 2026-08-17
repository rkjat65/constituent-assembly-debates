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
