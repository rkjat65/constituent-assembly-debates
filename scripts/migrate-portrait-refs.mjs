import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const skip=new Set(['.git','node_modules']);
const replacements=new Map([
  ['assets/sachchidananda-sinha-illustrated.webp','assets/portraits/sachchidananda-sinha.webp'],
  ['assets/jb-kripalani-illustrated.webp','assets/portraits/jb-kripalani.webp'],
  ['assets/nehru-illustrated.webp','assets/portraits/jawaharlal-nehru.webp'],
  ['assets/rajendra-prasad-archival.jpg','assets/portraits/rajendra-prasad.webp'],
  ['assets/br-ambedkar-archival-1946.jpg','assets/portraits/br-ambedkar.webp'],
  ['Custom illustrated archival portrait','Generated editorial portrait'],
  ['Custom illustrated portrait','Generated editorial portrait'],
  ['Generated archival caricature','Generated editorial portrait'],
  ['Archival portrait','Generated editorial portrait'],
  ['Archival photograph','Generated editorial portrait']
]);
const galleryFiles=new Set(['index.html','themes.html','visual-atlas.html','speakers.html']);
const profileLinkReplacements=new Map([
  ['search.html?q=Sarvepalli%20Radhakrishnan','speakers/sarvepalli-radhakrishnan.html'],
  ['search.html?q=Syama%20Prasad%20Mookerjee','speakers/syama-prasad-mookerjee.html'],
  ['search.html?q=K.%20M.%20Munshi','speakers/km-munshi.html']
]);

function walk(dir){
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.isDirectory()&&skip.has(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())out.push(...walk(full));
    else if(/\.(?:html|json)$/i.test(entry.name))out.push(full);
  }
  return out;
}

let changed=0;
for(const file of walk(root)){
  const before=fs.readFileSync(file,'utf8');
  let after=before;
  for(const [from,to] of replacements)after=after.split(from).join(to);
  const relative=path.relative(root,file).split(path.sep).join('/');
  if(galleryFiles.has(relative)){
    after=after.replace(/assets\/portraits\/(?!thumbs\/)([^"'<>]+\.webp)/g,'assets/portraits/thumbs/$1');
    for(const [from,to] of profileLinkReplacements)after=after.split(from).join(to);
  }
  if(after!==before){
    fs.writeFileSync(file,after);
    changed++;
    console.log(`updated ${relative}`);
  }
}
console.log(`Portrait source migration updated ${changed} files.`);
