import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const genealogyPath=path.join(root,'data/provision-genealogy.json');
const searchPath=path.join(root,'data/search-provisions.json');
const failures=[];

function fail(message){failures.push(message)}
function readJson(file){try{return JSON.parse(fs.readFileSync(file,'utf8'))}catch(error){fail(`${path.relative(root,file)} invalid JSON: ${error.message}`);return null}}
function targetFor(url){const [filePart,hash='']=url.split('#');return {file:path.join(root,filePart),filePart,hash}}
function anchorExists(file,filePart,hash){
  const escaped=hash.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const html=fs.readFileSync(file,'utf8');
  if(new RegExp(`id=["']${escaped}["']`).test(html))return true;
  const sessionMatch=filePart.match(/^sessions\/(\d{4}-\d{2}-\d{2})\.html$/);
  if(!sessionMatch)return false;
  const dataFile=path.join(root,`data/session-${sessionMatch[1]}.json`);
  if(!fs.existsSync(dataFile))return false;
  try{
    const session=JSON.parse(fs.readFileSync(dataFile,'utf8'));
    return (session.interventions||[]).some(item=>item.id===hash);
  }catch{return false}
}

const genealogy=readJson(genealogyPath);
const search=readJson(searchPath);
if(genealogy){
  const families=genealogy.families||[];
  if(!Array.isArray(families)||!families.length)fail('Provision genealogy must contain families.');
  const ids=new Set();
  for(const family of families){
    if(!family.id)fail('Provision family missing id.');
    if(ids.has(family.id))fail(`Duplicate provision family id: ${family.id}`);
    ids.add(family.id);
    if(!family.finalFamily||!family.summary)fail(`Provision family ${family.id} missing finalFamily or summary.`);
    if(!Array.isArray(family.roots)||!family.roots.length)fail(`Provision family ${family.id} has no debate roots.`);
    for(const rootItem of family.roots||[]){
      if(!rootItem.date||!rootItem.url||!rootItem.title)fail(`Provision family ${family.id} contains an incomplete root.`);
      if(/^https?:/i.test(rootItem.url))continue;
      const {file,filePart,hash}=targetFor(rootItem.url);
      if(!fs.existsSync(file)){fail(`Provision family ${family.id} points to missing route: ${rootItem.url}`);continue}
      if(hash&&!anchorExists(file,filePart,hash))fail(`Provision family ${family.id} points to missing anchor #${hash} in ${filePart} or its granular session data`);
    }
  }
  if(Array.isArray(search)){
    const indexed=new Set(search.map(item=>(item.url||'').replace(/^provisions\.html#/,'')).filter(Boolean));
    for(const family of families){if(!indexed.has(family.id))fail(`Provision family ${family.id} is missing from data/search-provisions.json`)}
  }
}
if(search&&!Array.isArray(search))fail('data/search-provisions.json must contain an array.');

if(failures.length){console.error('\nProvision genealogy validation FAILED:\n');for(const item of failures)console.error(`  - ${item}`);process.exit(1)}
console.log(`Provision genealogy validation passed: ${genealogy?.families?.length||0} constitutional families and ${search?.length||0} search entries.`);
