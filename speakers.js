const registryGrid=document.getElementById('portraitRegistryGrid');
const registrySearch=document.getElementById('personalitySearch');
const registryTotal=document.getElementById('registryTotal');
const registryReady=document.getElementById('registryReady');

function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function initials(name){return String(name||'').replace(/Dr\.|Mr\.|Mrs\.|Sardar|Pandit|The Hon.?ble|Sri|Shri|Seth|Sir|Maulana|Rajkumari/gi,'').trim().split(/\s+/).slice(0,2).map(p=>p[0]||'').join('').toUpperCase()||'•'}
function thumbnailPath(file){return String(file||'').replace('/portraits/','/portraits/thumbs/')}
const profileRoutes={
  'Dr. Sachchidananda Sinha':'speakers/sachchidananda-sinha.html',
  'Dr. Rajendra Prasad':'speakers/rajendra-prasad.html',
  'Dr. B. R. Ambedkar':'speakers/br-ambedkar.html',
  'Jawaharlal Nehru':'speakers/jawaharlal-nehru.html',
  'J. B. Kripalani':'speakers/jb-kripalani.html',
  'S. Radhakrishnan':'speakers/sarvepalli-radhakrishnan.html',
  'Dr. Sarvepalli Radhakrishnan':'speakers/sarvepalli-radhakrishnan.html',
  'Syama Prasad Mookerjee':'speakers/syama-prasad-mookerjee.html',
  'Syama Prasad Mukherjee':'speakers/syama-prasad-mookerjee.html',
  'K. M. Munshi':'speakers/km-munshi.html',
  'Alladi Krishnaswami Ayyar':'speakers/alladi-krishnaswami-ayyar.html',
  'Hansa Mehta':'speakers/hansa-mehta.html',
  'Sardar Vallabhbhai Patel':'speakers/vallabhbhai-patel.html',
  'Vallabhbhai Patel':'speakers/vallabhbhai-patel.html',
  'Dakshayani Velayudhan':'speakers/dakshayani-velayudhan.html',
  'Jaipal Singh':'speakers/jaipal-singh.html',
  'Begum Aizaz Rasul':'speakers/begum-aizaz-rasul.html',
  'Frank Anthony':'speakers/frank-anthony.html',
  'Maulana Abul Kalam Azad':'speakers/maulana-abul-kalam-azad.html',
  'Abul Kalam Azad':'speakers/maulana-abul-kalam-azad.html',
  'G. Durgabai':'speakers/g-durgabai.html',
  'Durgabai Deshmukh':'speakers/g-durgabai.html'
};

let cards=[];
function refreshReadyCount(){if(registryReady)registryReady.textContent=String(cards.filter(card=>card.classList.contains('ready')).length)}
function renderRegistry(manifest){
  if(!registryGrid)return;
  const entries=Object.entries(manifest.portraits||{});
  if(registryTotal)registryTotal.textContent=String(entries.length);
  registryGrid.innerHTML=entries.map(([name,file])=>{
    const href=profileRoutes[name]||`search.html?q=${encodeURIComponent(name)}`;
    const thumb=thumbnailPath(file);
    return `<a class="card registry-person" href="${esc(href)}" data-name="${esc(name.toLowerCase())}"><div class="registry-media"><span class="registry-initials">${esc(initials(name))}</span><img src="${esc(thumb)}" data-full="${esc(file)}" alt="Generated editorial portrait of ${esc(name)}" loading="lazy" decoding="async"><span class="registry-status">Checking image</span></div><div class="registry-copy"><h4>${esc(name)}</h4><p>${profileRoutes[name]?'Dedicated personality profile available.':'Indexed personality · opens relevant debate records.'}</p><b>${profileRoutes[name]?'Open profile →':'Find interventions →'}</b></div></a>`;
  }).join('');
  cards=[...registryGrid.querySelectorAll('.registry-person')];
  cards.forEach(card=>{
    const img=card.querySelector('img');const initialsNode=card.querySelector('.registry-initials');const status=card.querySelector('.registry-status');
    img.addEventListener('load',()=>{card.classList.add('ready');initialsNode.style.display='none';status.textContent='Generated portrait';refreshReadyCount()});
    img.addEventListener('error',()=>{
      if(!img.dataset.retried&&img.dataset.full){img.dataset.retried='true';img.src=img.dataset.full;return}
      img.remove();status.textContent='Awaiting image';refreshReadyCount()
    });
  });
  refreshReadyCount();
}
function applySearch(){const q=(registrySearch?.value||'').trim().toLowerCase();cards.forEach(card=>card.classList.toggle('hidden',q&&!card.dataset.name.includes(q)))}
registrySearch?.addEventListener('input',applySearch);

fetch('assets/portraits/manifest.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}).then(renderRegistry).catch(error=>{console.error('Portrait registry unavailable',error);if(registryGrid)registryGrid.innerHTML='<article class="card section-card"><h3>Portrait registry unavailable</h3><p>The main Personality Explorer remains available above.</p></article>'});
