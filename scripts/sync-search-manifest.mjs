import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const dataDir=path.join(root,'data');
const output=path.join(dataDir,'search-manifest.json');
const preferred=['search-index.json','search-speakers-granular.json','search-committees.json','search-provisions.json'];
const discovered=fs.readdirSync(dataDir)
  .filter(name=>/^search-.+\.json$/.test(name)&&name!=='search-manifest.json')
  .sort((a,b)=>a.localeCompare(b));
const sources=[...preferred,...discovered]
  .filter((name,index,list)=>list.indexOf(name)===index)
  .filter(name=>fs.existsSync(path.join(dataDir,name)))
  .map(name=>`data/${name}`);
const manifest={schemaVersion:1,sources};
fs.writeFileSync(output,JSON.stringify(manifest,null,2)+'\n');
console.log(`Search manifest synced: ${sources.length} source files.`);
