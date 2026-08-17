import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const manifestPath=path.join(root,'assets','portraits','manifest.json');
const dataDir=path.join(root,'data');
const generic=/^(?:several|unidentified|unnamed|assembly|members?|credentials|register|delegates?|the house|collective)/i;
const special=new Map([
  ['Dr. B. R. Ambedkar','br-ambedkar'],
  ['B. R. Ambedkar','br-ambedkar'],
  ['Dr. Rajendra Prasad','rajendra-prasad'],
  ['Rajendra Prasad','rajendra-prasad'],
  ['Dr. Sachchidananda Sinha','sachchidananda-sinha'],
  ['Sachchidananda Sinha','sachchidananda-sinha'],
  ['Jawaharlal Nehru','jawaharlal-nehru'],
  ['J. B. Kripalani','jb-kripalani'],
  ['Dr. Sarvepalli Radhakrishnan','sarvepalli-radhakrishnan'],
  ['S. Radhakrishnan','sarvepalli-radhakrishnan'],
  ['K. M. Munshi','km-munshi'],
  ['N. Gopalaswami Ayyangar','gopalaswami-ayyangar'],
  ['Sardar Vallabhbhai Patel','vallabhbhai-patel'],
  ['Vallabhbhai Patel','vallabhbhai-patel'],
  ['B. Pattabhi Sitaramayya','pattabhi-sitaramayya'],
  ['Pattabhi Sitaramayya','pattabhi-sitaramayya'],
  ['P. R. Thakur','pr-thakur']
]);
function slug(name){
  if(special.has(name))return special.get(name);
  return name.normalize('NFKD').replace(/[’']/g,'').replace(/&/g,' and ').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
}
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
manifest.portraits ||= {};
const sessionFiles=fs.readdirSync(dataDir).filter(name=>/^session-\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort();
const names=new Set();
for(const file of sessionFiles){
  const data=JSON.parse(fs.readFileSync(path.join(dataDir,file),'utf8'));
  for(const speaker of data.speakers||[]){
    const name=String(speaker?.name||'').trim();
    if(!name||generic.test(name))continue;
    names.add(name);
  }
}
let added=0;
for(const name of [...names].sort((a,b)=>a.localeCompare(b))){
  if(manifest.portraits[name])continue;
  manifest.portraits[name]=`assets/portraits/${slug(name)}.webp`;
  added++;
}
// Stable alphabetical ordering keeps the file usable as an upload checklist.
manifest.portraits=Object.fromEntries(Object.entries(manifest.portraits).sort(([a],[b])=>a.localeCompare(b)));
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(`Portrait manifest synced from ${sessionFiles.length} session data files: ${names.size} named speakers discovered, ${added} new entries added, ${Object.keys(manifest.portraits).length} total mappings.`);
