import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const skipDirs=new Set(['.git','.github','node_modules']);
function walk(dir){const out=[];for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.isDirectory()&&skipDirs.has(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())out.push(...walk(full));else out.push(full)}return out}
const files=walk(root);const htmlFiles=files.filter(f=>f.endsWith('.html'));const jsonFiles=files.filter(f=>f.endsWith('.json'));const svgFiles=files.filter(f=>f.endsWith('.svg'));const failures=[];const checked=[];
function rel(file){return path.relative(root,file).split(path.sep).join('/')}
function isExternal(value){return /^(?:https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(value)}
function resolveLocal(sourceFile,rawValue){const value=rawValue.trim();if(!value||value==='#'||value.startsWith('#')||isExternal(value))return null;const clean=decodeURIComponent(value.split('#')[0].split('?')[0]);if(!clean)return null;if(clean.startsWith('/'))return path.join(root,clean.replace(/^\/+/,''));return path.resolve(path.dirname(sourceFile),clean)}

for(const htmlFile of htmlFiles){const html=fs.readFileSync(htmlFile,'utf8');const attributes=[...html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)];for(const match of attributes){const raw=match[1];const target=resolveLocal(htmlFile,raw);if(!target)continue;let candidate=target;if(fs.existsSync(candidate)&&fs.statSync(candidate).isDirectory())candidate=path.join(candidate,'index.html');checked.push(`${rel(htmlFile)} -> ${raw}`);if(!fs.existsSync(candidate))failures.push(`${rel(htmlFile)} references missing local target: ${raw}`)}const oldPortraitRefs=[...html.matchAll(/assets\/[^"']*-illustrated\.svg/gi)];for(const match of oldPortraitRefs)failures.push(`${rel(htmlFile)} still references retired SVG personality asset: ${match[0]}`)}

for(const jsonFile of jsonFiles){try{JSON.parse(fs.readFileSync(jsonFile,'utf8'))}catch(error){failures.push(`${rel(jsonFile)} is invalid JSON: ${error.message}`)}}
for(const svgFile of svgFiles){const svg=fs.readFileSync(svgFile,'utf8');if(!svg.includes('<svg'))failures.push(`${rel(svgFile)} is not valid SVG markup`);if(!svg.includes('<title'))failures.push(`${rel(svgFile)} is missing an accessible <title>`)}

const required=['index.html','chronology.html','speakers.html','themes.html','documents.html','provisions.html','visual-atlas.html','search.html','search.js','explorer-detail.css','visuals.css','styles.css','app.js','assets/sachchidananda-sinha-illustrated.webp','assets/jb-kripalani-illustrated.webp','assets/nehru-illustrated.webp','assets/rajendra-prasad-engraved.svg','assets/assembly-hall-panorama.svg','assets/objectives-resolution-visual.svg','sessions/1946-12-09.html','sessions/1946-12-10.html','sessions/1946-12-11.html','sessions/1946-12-13.html','speakers/sachchidananda-sinha.html','speakers/rajendra-prasad.html','speakers/jb-kripalani.html','speakers/jawaharlal-nehru.html','topics/rules-procedure.html','topics/objectives-resolution.html','data/session-1946-12-11.json','data/session-1946-12-12.json','data/search-index.json'];
for(const item of required){if(!fs.existsSync(path.join(root,item)))failures.push(`Required site file missing: ${item}`)}

if(failures.length){console.error('\nStatic archive integrity check FAILED:\n');for(const failure of failures)console.error(`  - ${failure}`);console.error(`\nChecked ${htmlFiles.length} HTML files, ${jsonFiles.length} JSON files, ${svgFiles.length} SVG files and ${checked.length} local references.`);process.exit(1)}
console.log(`Static archive integrity check passed: ${htmlFiles.length} HTML files, ${jsonFiles.length} JSON files, ${svgFiles.length} SVG files, ${checked.length} local references, ${required.length} required routes/assets.`);