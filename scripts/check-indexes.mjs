import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const dataDir=path.join(root,'data');
const failures=[];
const posix=p=>p.split(path.sep).join('/');
const exists=relative=>fs.existsSync(path.join(root,relative));

function readJson(relative){
  try{return JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'))}
  catch(error){failures.push(`${relative} is invalid JSON: ${error.message}`);return null}
}

const manifest=readJson('data/search-manifest.json');
const manifestSources=new Set(Array.isArray(manifest?.sources)?manifest.sources:[]);
if(!manifestSources.size)failures.push('data/search-manifest.json has no sources');

const preferred=['data/search-index.json','data/search-speakers-granular.json','data/search-committees.json'];
const discovered=fs.readdirSync(dataDir)
  .filter(name=>/^search-(?:session|speakers|theme)-.+\.json$/.test(name))
  .map(name=>`data/${name}`);
const expectedSearchSources=[...new Set([...preferred,...discovered])].filter(exists);
for(const source of expectedSearchSources){if(!manifestSources.has(source))failures.push(`Search source missing from manifest: ${source}`)}
for(const source of manifestSources){if(!exists(source)){failures.push(`Search manifest references missing file: ${source}`);continue}const data=readJson(source);if(!Array.isArray(data)){failures.push(`${source} must contain a JSON array`);continue}for(const [index,item] of data.entries()){if(!item||typeof item!=='object'){failures.push(`${source}[${index}] is not an object`);continue}for(const field of ['type','title','url'])if(!item[field])failures.push(`${source}[${index}] missing ${field}`);const url=String(item.url||'');if(url&&!/^(?:https?:|mailto:|tel:|\/\/)/i.test(url)){const clean=decodeURIComponent(url.split('#')[0].split('?')[0]);if(clean&&!exists(clean))failures.push(`${source}[${index}] references missing local route: ${url}`)}}}

const chronology=readJson('data/chronology.json');
const records=Array.isArray(chronology?.records)?chronology.records:[];
if(!records.length)failures.push('data/chronology.json has no records');
const seenDates=new Set();let previous='';
for(const [index,record] of records.entries()){
  if(!record?.date){failures.push(`Chronology record ${index} has no date`);continue}
  if(seenDates.has(record.date))failures.push(`Duplicate chronology date: ${record.date}`);seenDates.add(record.date);
  if(previous&&record.date<previous)failures.push(`Chronology is not ascending at ${record.date}`);previous=record.date;
  if(record.status==='ready'){
    if(!record.route)failures.push(`Ready chronology record ${record.date} has no route`);
    else if(!exists(record.route))failures.push(`Ready chronology route missing for ${record.date}: ${record.route}`);
  }
}

if(failures.length){console.error('\nArchive index consistency check FAILED:\n');for(const failure of failures)console.error(`  - ${failure}`);process.exit(1)}
console.log(`Archive index consistency passed: ${records.length} chronology records, ${manifestSources.size} search sources, ${expectedSearchSources.length} discoverable search indexes.`);
