const https = require('https');
const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\безопасный интернет';
const modsJsonPath = path.join(rootDir, 'data', 'mods.json');
const heroesJsonPath = path.join(rootDir, 'data', 'dota_heroes_api.json');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'DotaModHub-App' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'DotaModHub-App' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        try { fs.unlinkSync(destPath); } catch(e) {}
        return downloadFile(res.headers.location, destPath).then(resolve);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(destPath); } catch(e) {}
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', () => {
      file.close();
      try { fs.unlinkSync(destPath); } catch(e) {}
      resolve(false);
    });
  });
}

async function run() {
  console.log('Fetching repository tree from GitHub...');
  const repoData = await fetchJson('https://api.github.com/repos/h6rd/Dota2PornFxWeb/git/trees/main?recursive=1');
  if (!repoData || !repoData.tree) {
    console.error('Failed to fetch tree from GitHub');
    return;
  }

  const existingMods = JSON.parse(fs.readFileSync(modsJsonPath, 'utf8'));
  const existingIds = new Set(existingMods.map(m => (m.id || '').toLowerCase()));
  const existingUrls = new Set(existingMods.map(m => (m.download_url || '').toLowerCase()));
  const existingTitles = new Set(existingMods.map(m => (m.title || '').toLowerCase()));

  const heroesRaw = fs.readFileSync(heroesJsonPath, 'utf8').replace(/^\uFEFF/, '');
  const heroesList = JSON.parse(heroesRaw);

  const heroMap = new Map();
  for (const h of heroesList) {
    const locName = h.localized_name;
    const internal = h.name.replace('npc_dota_hero_', '');
    heroMap.set(locName.toLowerCase(), {
      name: locName,
      internal: internal,
      attr: h.primary_attr === 'agi' ? 'agility' : h.primary_attr === 'str' ? 'strength' : h.primary_attr === 'int' ? 'intelligence' : 'universal'
    });
  }
  // Extra aliases
  heroMap.set('io', { name: 'Io', internal: 'wisp', attr: 'universal' });
  heroMap.set('anti-mage', { name: 'Anti-Mage', internal: 'antimage', attr: 'agility' });
  heroMap.set('shadow shaman', { name: 'Shadow Shaman', internal: 'shadow_shaman', attr: 'intelligence' });
  heroMap.set('spirit breaker', { name: 'Spirit Breaker', internal: 'spirit_breaker', attr: 'strength' });
  heroMap.set('kez', { name: 'Kez', internal: 'kez', attr: 'agility' });
  heroMap.set('ringmaster', { name: 'Ringmaster', internal: 'ringmaster', attr: 'intelligence' });

  const previewPaths = new Set(repoData.tree.filter(x => x.type === 'blob' && x.path.startsWith('assets/previews/')).map(x => x.path));
  const repoFiles = repoData.tree.filter(x => x.type === 'blob' && (x.path.endsWith('.zip') || x.path.endsWith('.vpk')));

  const toAdd = [];

  for (const f of repoFiles) {
    const fileName = f.path.split('/').pop().replace(/\.(zip|vpk)$/i, '');
    if (fileName.includes('Legion Commander Chen') || fileName.includes('Chen Infernal Psychic')) continue;

    const parts = f.path.split('/');
    const cat = parts[2] || 'heroes';
    const rawUrl = 'https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/' + f.path.split('/').map(encodeURIComponent).join('/');
    const titleLower = fileName.toLowerCase();

    if (existingUrls.has(rawUrl.toLowerCase()) || existingTitles.has(titleLower)) continue;

    const previewRel = `assets/previews/${cat}/${fileName}.webp`;
    const remotePreviewUrl = `https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/previews/${encodeURIComponent(cat)}/${encodeURIComponent(fileName)}.webp`;
    const hasRemotePreview = previewPaths.has(previewRel);

    // Detect hero
    let matchedHero = null;
    let matchedAttr = 'universal';
    let matchedInternal = 'dota2_logo_symbol';

    for (const [key, val] of heroMap.entries()) {
      if (titleLower.includes(key)) {
        matchedHero = val.name;
        matchedAttr = val.attr;
        matchedInternal = val.internal;
        break;
      }
    }

    if (!matchedHero) {
      if (cat === 'couriers') matchedHero = 'Курьеры';
      else if (cat === 'creeps' || cat === 'creep-deny') matchedHero = 'Крипы';
      else if (cat === 'backgrounds') matchedHero = 'Фоны';
      else if (cat === 'hero-sounds') matchedHero = 'Звуки';
      else if (cat === 'huds') matchedHero = 'Интерфейс';
      else if (cat === 'mega-kill') matchedHero = 'Мега-киллы';
      else if (cat === 'terrains') matchedHero = 'Ландшафты';
      else matchedHero = 'Dota 2';
    }

    const heroIconLocal = matchedInternal !== 'dota2_logo_symbol' 
      ? `assets/heroes/${matchedInternal}.png`
      : `assets/heroes/dota2_logo_symbol.png`;

    const remoteHeroIcon = matchedInternal !== 'dota2_logo_symbol'
      ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${matchedInternal}.png`
      : `assets/heroes/dota2_logo_symbol.png`;

    const sizeMb = (f.size / (1024 * 1024)).toFixed(1);

    const safeId = `${cat}-${fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-|-$/g, '');

    toAdd.push({
      id: safeId,
      title: fileName,
      hero: matchedHero,
      hero_icon: heroIconLocal,
      attribute: matchedAttr,
      category: cat,
      preview: previewRel,
      download_url: rawUrl,
      author: 'Steam Workshop',
      file_size: `${sizeMb} MB`,
      has_effects: true,
      has_icons: false,
      media_preview: null,
      remote_preview: remotePreviewUrl,
      remote_hero_icon: remoteHeroIcon,
      hasRemotePreview: hasRemotePreview
    });
  }

  console.log(`Found ${toAdd.length} new mods to add!`);

  // Download previews in parallel batches
  console.log('Downloading preview images locally for offline autonomy...');
  let downloadedCount = 0;
  for (let i = 0; i < toAdd.length; i += 10) {
    const batch = toAdd.slice(i, i + 10);
    await Promise.all(batch.map(async (m) => {
      if (m.hasRemotePreview) {
        const localDest = path.join(rootDir, m.preview);
        if (!fs.existsSync(localDest)) {
          const ok = await downloadFile(m.remote_preview, localDest);
          if (ok) downloadedCount++;
        } else {
          downloadedCount++;
        }
      }
    }));
    process.stdout.write(`Progress: ${Math.min(i + 10, toAdd.length)}/${toAdd.length}\r`);
  }
  console.log(`\nDownloaded / verified ${downloadedCount} preview images locally.`);

  // Clean helper property
  toAdd.forEach(m => delete m.hasRemotePreview);

  const updatedCatalog = [...existingMods, ...toAdd];
  fs.writeFileSync(modsJsonPath, JSON.stringify(updatedCatalog, null, 2), 'utf8');
  console.log(`Updated mods.json! Total mods now: ${updatedCatalog.length} (added ${toAdd.length})`);
}

run().catch(console.error);
