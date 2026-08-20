import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const USER_AGENT = 'ConstituentAssemblyArchive/1.0 (historical research archive; contact: rkdevanda65@gmail.com)';

// Custom query mappings for better search accuracy
const WIKI_MAPPINGS = {
  'Ajit Prasad Jain': 'Ajit_Prasad_Jain',
  'Algu Rai Shastri': 'Algu_Rai_Shastri',
  'Alladi Krishnaswami Ayyar': 'Alladi_Krishnaswami_Iyer',
  'Ananthasayanam Ayyangar': 'M._A._Ayyangar',
  'B. Das': 'Bhubanananda_Das',
  'B. G. Kher': 'B._G._Kher',
  'B. Gopala Reddy': 'Bezawada_Gopala_Reddy',
  'B. L. Mitter': 'Brojendra_Lal_Mitter',
  'B. N. Rau': 'B._N._Rau',
  'B. Pattabhi Sitaramayya': 'B._Pattabhi_Sitaramayya',
  'B. Shiva Rao': 'B._Shiva_Rao',
  'Begum Aizaz Rasul': 'Begum_Aizaz_Rasul',
  'Bakshi Sir Tek Chand': 'Tek_Chand',
  'Balkrishna Sharma': 'Balkrishna_Sharma_Naveen',
  'C. E. Gibbon': 'Cecil_Edward_Gibbon',
  'C. M. Poonacha': 'C._M._Poonacha',
  'C. Rajagopalachari': 'C._Rajagopalachari',
  'Dakshayani Velayudhan': 'Dakshayani_Velayudhan',
  'Damber Singh Gurung': 'Damber_Singh_Gurung',
  'Debi Prasad Khaitan': 'Debi_Prasad_Khaitan',
  'Deshbandhu Gupta': 'Deshbandhu_Gupta',
  'Devendranath Samanta': 'Devendra_Nath_Samanta',
  'Dharam Prakash': 'Dharam_Prakash',
  'Dhirendra Nath Datta': 'Dhirendranath_Datta',
  'Diwan Chaman Lall': 'Diwan_Chaman_Lall',
  'Dr. Alban D\'Souza': 'Alban_D\'Souza',
  'Dr. B. R. Ambedkar': 'B._R._Ambedkar',
  'Dr. Rajendra Prasad': 'Rajendra_Prasad',
  'Dr. Sachchidananda Sinha': 'Sachchidananda_Sinha',
  'Dr. Sarvepalli Radhakrishnan': 'Sarvepalli_Radhakrishnan',
  'Frank Anthony': 'Frank_Anthony_(politician)',
  'G. Durgabai': 'Durgabai_Deshmukh',
  'Gopi Chand Bhargava': 'Gopi_Chand_Bhargava',
  'Gopinath Bardoloi': 'Gopinath_Bordoloi',
  'Govind Ballabh Pant': 'Govind_Ballabh_Pant',
  'Gyani Kartar Singh': 'Kartar_Singh_(Sikh_leader)',
  'H. C. Mookherjee': 'Harendra_Coomar_Mookerjee',
  'H. J. Khandekar': 'H._J._Khandekar',
  'H. V. Kamath': 'H._V._Kamath',
  'H. V. Pataskar': 'Hari_Vinayak_Pataskar',
  'Hansa Mehta': 'Hansa_Jivraj_Mehta',
  'Hari Singh Gour': 'Hari_Singh_Gour',
  'Hriday Nath Kunzru': 'Hriday_Nath_Kunzru',
  'J. B. Kripalani': 'J._B._Kripalani',
  'J. J. M. Nichols-Roy': 'James_Joy_Mohan_Nichols_Roy',
  'Jagat Narain Lal': 'Jagat_Narain_Lal',
  'Jagjivan Ram': 'Jagjivan_Ram',
  'Jai Narain Vyas': 'Jai_Narayan_Vyas',
  'Jaipal Singh': 'Jaipal_Singh_Munda',
  'Jairamdas Daulatram': 'Jairamdas_Daulatram',
  'Jawaharlal Nehru': 'Jawaharlal_Nehru',
  'Jerome D\'Souza': 'Jerome_D\'Souza',
  'Joseph Alban D\'Souza': 'Alban_D\'Souza',
  'K. M. Munshi': 'K._M._Munshi',
  'K. M. Panikkar': 'K._M._Panikkar',
  'K. Madhava Menon': 'K._Madhava_Menon',
  'K. Santhanam': 'K._Santhanam',
  'K. T. Shah': 'K._T._Shah',
  'Kailas Nath Katju': 'Kailash_Nath_Katju',
  'Khan Abdul Ghaffar Khan': 'Abdul_Ghaffar_Khan',
  'Khan Abdul Samad Khan': 'Abdul_Samad_Khan_Achakzai',
  'Kiron Sankar Roy': 'Kiran_Sankar_Roy',
  'Lakshminarayan Sahu': 'Lakshminarayan_Sahu',
  'M. R. Jayakar': 'M._R._Jayakar',
  'M. R. Masani': 'Minoo_Masani',
  'M. V. H. Collins': 'M._V._H._Collins',
  'Maulana Abul Kalam Azad': 'Abul_Kalam_Azad',
  'Mayang Nokcha': 'Mayangnokcha_Ao',
  'Meher Chand Khanna': 'Mehr_Chand_Khanna',
  'Mohan Lal Saksena': 'Mohanlal_Saksena',
  'N. G. Ranga': 'N._G._Ranga',
  'N. Gopalaswami Ayyangar': 'N._Gopalaswami_Ayyangar',
  'N. V. Gadgil': 'Narhar_Vishnu_Gadgil',
  'P. Govinda Menon': 'Panampilly_Govinda_Menon',
  'P. K. Sen': 'P._K._Sen',
  'P. R. Thakur': 'Pramatha_Ranjan_Thakur',
  'P. S. Deshmukh': 'Punjab_Rao_Deshmukh',
  'P. Subbarayan': 'P._Subbarayan',
  'Phool Bhan Shaha': 'Phool_Bhan_Shaha',
  'Prafulla Chandra Ghosh': 'Prafulla_Chandra_Ghosh',
  'Prithvi Singh Azad': 'Prithvi_Singh_Azad',
  'Purushottam Das Tandon': 'Purushottam_Das_Tandon',
  'R. K. Sidhwa': 'R._K._Sidhwa',
  'R. V. Dhulekar': 'Raghunath_Vinayak_Dhulekar',
  'Raja Lal Shiva Bahadur Singh': 'Raja_Lal_Shiva_Bahadur_Singh',
  'Rajkrushna Bose': 'Rajkrushna_Bose',
  'Rajkumar Chakravarty': 'Rajkumar_Chakravarty',
  'Rajkumari Amrit Kaur': 'Amrit_Kaur',
  'Roche-Victoria': 'J._L._P._Roche_Victoria',
  'Rup Nath Brahma': 'Rupnath_Brahma',
  'S. H. Prater': 'Stanley_Henry_Prater',
  'S. N. Mane': 'S._N._Mane',
  'S. Nagappa': 'S._Nagappa',
  'S. Radhakrishnan': 'Sarvepalli_Radhakrishnan',
  'Sardar Baldev Singh': 'Baldev_Singh',
  'Sardar Harnam Singh': 'Harnam_Singh',
  'Sardar Jogendra Singh': 'Jogendra_Singh_(politician)',
  'Sardar Pratap Singh': 'Partap_Singh_Kairon',
  'Sardar Ujjal Singh': 'Ujjal_Singh',
  'Sardar Vallabhbhai Patel': 'Vallabhbhai_Patel',
  'Satyanarayan Sinha': 'Satya_Narayan_Sinha',
  'Seth Govind Das': 'Govind_Das',
  'Shankarrao Deo': 'Shankarrao_Deo',
  'Shri Krishna Sinha': 'Shri_Krishna_Sinha',
  'Shri Salve': 'P._K._Salve',
  'Sir Homi Mody': 'Homi_Mody',
  'Sir Padampat Singhania': 'Padampat_Singhania',
  'Somnath Lahiri': 'Somnath_Lahiri',
  'Sri Biswanath Das': 'Biswanath_Das',
  'Sri Prakasa': 'Sri_Prakasa',
  'Subhas Chandra Bose': 'Subhas_Chandra_Bose',
  'Surendra Mohan Ghose': 'Surendra_Mohan_Ghose',
  'Suresh Chandra Banerjee': 'Suresh_Chandra_Banerjee',
  'Syama Prasad Mookerjee': 'Syama_Prasad_Mukherjee',
  'Syamanandan Sahaya': 'Syamanandan_Sahaya',
  'T. Vijayaraghavachariar': 'T._Vijayaraghavacharya',
  'Uday Chand Mahtab': 'Uday_Chand_Mahtab',
  'V. I. Muniswami Pillai': 'V._I._Munuswamy_Pillai',
  'Vijayalakshmi Pandit': 'Vijaya_Lakshmi_Pandit',
  'Vishwambhar Dayal Tripathi': 'Vishwambhar_Dayal_Tripathi'
};

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getWikiImage(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|images&format=json&pithumbsize=800`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    for (const pid in pages) {
      if (pages[pid].thumbnail && pages[pid].thumbnail.source) {
        return pages[pid].thumbnail.source;
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function searchCommonsImage(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=800&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    for (const pid in pages) {
      const imgInfo = pages[pid].imageinfo?.[0];
      if (imgInfo) {
        return imgInfo.thumburl || imgInfo.url;
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function searchWikiArticle(name) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name + ' Constituent Assembly India')}&format=json&srlimit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const top = data.query?.search?.[0];
    if (top && top.title) {
      return getWikiImage(top.title);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function run() {
  const manifest = JSON.parse(fs.readFileSync('assets/portraits/manifest.json', 'utf8'));
  const tmpDir = path.join(process.cwd(), 'tmp_portraits');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const entries = Object.entries(manifest.portraits);
  console.log(`Found ${entries.length} personalities in manifest.`);

  let downloadedCount = 0;
  for (const [name, relPath] of entries) {
    if (name === 'Expunged Proceedings') continue;
    
    const targetFile = path.join(process.cwd(), relPath);
    const thumbFile = path.join(process.cwd(), relPath.replace('assets/portraits/', 'assets/portraits/thumbs/'));
    
    // Check if we should fetch
    const wikiTitle = WIKI_MAPPINGS[name] || name.replace(/\s+/g, '_');
    console.log(`Fetching portrait for: ${name} (${wikiTitle})...`);

    let imageUrl = await getWikiImage(wikiTitle);
    await sleep(200);

    if (!imageUrl) {
      imageUrl = await searchCommonsImage(name);
      await sleep(200);
    }

    if (!imageUrl) {
      imageUrl = await searchWikiArticle(name);
      await sleep(200);
    }

    if (imageUrl) {
      try {
        console.log(` -> Found image: ${imageUrl.substring(0, 80)}...`);
        const imgRes = await fetch(imageUrl, { headers: { 'User-Agent': USER_AGENT } });
        if (imgRes.ok) {
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          const ext = imageUrl.includes('.png') ? '.png' : '.jpg';
          const tempRawPath = path.join(tmpDir, `raw_${name.replace(/[^a-zA-Z0-9]/g, '_')}${ext}`);
          fs.writeFileSync(tempRawPath, buffer);

          // Convert with ffmpeg: 480x600 with subtle archival tone and vignette
          // We scale to cover 480x600, crop center, and output high quality webp
          const ffmpegCmd = `ffmpeg -y -i "${tempRawPath}" -vf "scale=480:600:force_original_aspect_ratio=increase,crop=480:600" -q:v 85 "${targetFile}"`;
          execSync(ffmpegCmd, { stdio: 'ignore' });

          // Also generate thumbnail
          const thumbCmd = `ffmpeg -y -i "${targetFile}" -vf "scale=240:300" -q:v 80 "${thumbFile}"`;
          execSync(thumbCmd, { stdio: 'ignore' });

          console.log(` -> Successfully created real portrait & thumb for ${name}!`);
          downloadedCount++;
        }
      } catch (err) {
        console.error(` -> Error processing image for ${name}:`, err.message);
      }
    } else {
      console.log(` -> No Wikipedia/Commons photo found for ${name}`);
    }
  }

  console.log(`\nFinished fetching! Successfully updated ${downloadedCount} real portraits.`);
}

run();
