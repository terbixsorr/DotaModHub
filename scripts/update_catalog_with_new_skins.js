const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const rootDir = 'c:\\безопасный интернет';
const modsJsonPath = path.join(rootDir, 'data', 'mods.json');
const modsDataJsPath = path.join(rootDir, 'data', 'mods-data.js');
const heroesJsonPath = path.join(rootDir, 'data', 'dota_heroes_api.json');

const distAppDir = path.join(rootDir, 'dist', 'DotaModHub-win32-x64', 'resources', 'app');
const appDataAppDir = 'C:\\Users\\terbix\\AppData\\Local\\Programs\\DotaModHub\\resources\\app';

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'DotaModHub-CatalogUpdater' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadWithCurl(url, destPath) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  try {
    const cmd = `curl.exe -s -L -o "${destPath}" "${url}"`;
    execSync(cmd);
    return fs.existsSync(destPath) && fs.statSync(destPath).size > 0;
  } catch (e) {
    return false;
  }
}

async function run() {
  console.log('=== ОБНОВЛЕНИЕ КАТАЛОГА СКИНОМ И ДОБАВЛЕНИЕ НОВЫХ МОДОВ ===');

  const localMods = JSON.parse(fs.readFileSync(modsJsonPath, 'utf8'));
  const localUrls = new Set(localMods.map(m => (m.download_url || '').toLowerCase().trim()));
  const localTitles = new Set(localMods.map(m => (m.title || '').toLowerCase().trim()));
  const localFiles = new Set(localMods.map(m => {
    const fn = (m.download_url || '').split('/').pop();
    return decodeURIComponent(fn).toLowerCase().replace(/\.(zip|vpk)$/i, '');
  }));

  console.log(`Текущее количество модов в каталоге: ${localMods.length}`);

  console.log('1. Получение данных каталога и дерева файлов из GitHub...');
  const data = await getJson('https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/data/mods.json');
  const treeData = await getJson('https://api.github.com/repos/h6rd/Dota2PornFxWeb/git/trees/main?recursive=1');
  const allBlobs = treeData.tree.filter(x => x.type === 'blob');
  const blobPaths = new Map(allBlobs.map(x => [x.path.toLowerCase(), x]));
  const previewBlobs = new Set(allBlobs.filter(x => x.path.startsWith('assets/previews/')).map(x => x.path));

  // Load hero mapping
  const heroesRaw = fs.readFileSync(heroesJsonPath, 'utf8').replace(/^\uFEFF/, '');
  const heroesList = JSON.parse(heroesRaw);
  const heroMap = new Map();
  for (const h of heroesList) {
    const locName = h.localized_name;
    let internal = h.name.replace('npc_dota_hero_', '');
    if (internal === 'nevermore') internal = 'shadow_fiend';
    if (internal === 'zuus') internal = 'zuus';
    if (internal === 'skeleton_king') internal = 'wraith_king';
    if (internal === 'windrunner') internal = 'windranger';
    if (internal === 'necrolyte') internal = 'necrophos';
    if (internal === 'queenofpain') internal = 'queen_of_pain';

    heroMap.set(locName.toLowerCase(), {
      name: locName,
      internal: internal,
      attr: h.primary_attr === 'agi' ? 'agility' : h.primary_attr === 'str' ? 'strength' : h.primary_attr === 'int' ? 'intelligence' : 'universal'
    });
  }
  heroMap.set('io', { name: 'Io', internal: 'wisp', attr: 'universal' });
  heroMap.set('anti-mage', { name: 'Anti-Mage', internal: 'antimage', attr: 'agility' });
  heroMap.set('shadow shaman', { name: 'Shadow Shaman', internal: 'shadow_shaman', attr: 'intelligence' });
  heroMap.set('spirit breaker', { name: 'Spirit Breaker', internal: 'spirit_breaker', attr: 'strength' });
  heroMap.set('kez', { name: 'Kez', internal: 'kez', attr: 'agility' });
  heroMap.set('ringmaster', { name: 'Ringmaster', internal: 'ringmaster', attr: 'intelligence' });
  heroMap.set('wraith king', { name: 'Wraith King', internal: 'wraith_king', attr: 'strength' });
  heroMap.set('faceless void', { name: 'Faceless Void', internal: 'faceless_void', attr: 'agility' });
  heroMap.set('spectre', { name: 'Spectre', internal: 'spectre', attr: 'agility' });
  heroMap.set('crystal maiden', { name: 'Crystal Maiden', internal: 'crystal_maiden', attr: 'intelligence' });
  heroMap.set('earthshaker', { name: 'Earthshaker', internal: 'earthshaker', attr: 'strength' });
  heroMap.set('phantom assassin', { name: 'Phantom Assassin', internal: 'phantom_assassin', attr: 'agility' });
  heroMap.set('ancient apparition', { name: 'Ancient Apparition', internal: 'ancient_apparition', attr: 'intelligence' });
  heroMap.set('tidehunter', { name: 'Tidehunter', internal: 'tidehunter', attr: 'strength' });
  heroMap.set('dazzle', { name: 'Dazzle', internal: 'dazzle', attr: 'universal' });
  heroMap.set('slardar', { name: 'Slardar', internal: 'slardar', attr: 'strength' });
  heroMap.set('gyrocopter', { name: 'Gyrocopter', internal: 'gyrocopter', attr: 'agility' });
  heroMap.set('chen', { name: 'Chen', internal: 'chen', attr: 'universal' });
  heroMap.set('terrorblade', { name: 'Terrorblade', internal: 'terrorblade', attr: 'agility' });
  heroMap.set('vengeful spirit', { name: 'Vengeful Spirit', internal: 'vengefulspirit', attr: 'universal' });
  heroMap.set('naga siren', { name: 'Naga Siren', internal: 'naga_siren', attr: 'agility' });
  heroMap.set('weaver', { name: 'Weaver', internal: 'weaver', attr: 'agility' });

  const missingMods = [];

  function processMod(item, category) {
    if (!item) return;
    const cat = category || item.category || 'heroes';

    if (Array.isArray(item.styles) && item.styles.length > 0) {
      for (const st of item.styles) {
        const title = (item.name ? item.name + ' (' + st.label + ')' : st.file.replace(/\.(zip|vpk)$/i, '')).trim();
        const fileName = (st.file || '').replace(/\.(zip|vpk)$/i, '').trim();
        const fnLower = fileName.toLowerCase();
        const expectedPath = ('assets/files/' + cat + '/' + st.file).toLowerCase();
        const blob = blobPaths.get(expectedPath);

        if (blob && !localFiles.has(fnLower) && !localTitles.has(title.toLowerCase())) {
          missingMods.push({
            title: title,
            rawName: fileName,
            file: st.file,
            path: blob.path,
            size: blob.size,
            category: cat,
            preview: st.preview || item.preview || (fileName + '.webp'),
            author: (item.links && item.links.find(l => l.type === 'author')) ? item.links.find(l => l.type === 'author').url : 'Community Workshop',
            source: 'Dota2PornFx / Steam Workshop',
            tags: item.tags || { effects: true, icons: false }
          });
        }
      }
    } else if (item.file) {
      const fileName = item.file.replace(/\.(zip|vpk)$/i, '').trim();
      const fnLower = fileName.toLowerCase();
      const expectedPath = ('assets/files/' + cat + '/' + item.file).toLowerCase();
      const blob = blobPaths.get(expectedPath);

      if (blob && !localFiles.has(fnLower) && !localTitles.has((item.name || fileName).toLowerCase())) {
        missingMods.push({
          title: item.name || fileName,
          rawName: fileName,
          file: item.file,
          path: blob.path,
          size: blob.size,
          category: cat,
          preview: item.preview || (fileName + '.webp'),
          author: (item.links && item.links.find(l => l.type === 'author')) ? item.links.find(l => l.type === 'author').url : 'Community Workshop',
          source: 'Dota2PornFx / Steam Workshop',
          tags: item.tags || { effects: true, icons: false }
        });
      }
    }
  }

  function walk(val, cat) {
    if (!val) return;
    if (Array.isArray(val)) {
      for (const it of val) processMod(it, cat);
    } else if (typeof val === 'object') {
      if (val.groups) {
        walk(val.groups, cat);
      } else {
        for (const k of Object.keys(val)) walk(val[k], cat || k);
      }
    }
  }

  walk(data.modsData, null);

  // Also check direct files
  const alreadyFoundFiles = new Set(missingMods.map(m => m.rawName.toLowerCase()));
  const allModBlobs = allBlobs.filter(x => x.path.startsWith('assets/files/') && (x.path.endsWith('.zip') || x.path.endsWith('.vpk')));
  for (const f of allModBlobs) {
    const fn = f.path.split('/').pop().replace(/\.(zip|vpk)$/i, '');
    const fnLower = fn.toLowerCase();
    if (!localFiles.has(fnLower) && !alreadyFoundFiles.has(fnLower)) {
      const parts = f.path.split('/');
      const cat = parts[2] || 'heroes';
      missingMods.push({
        title: fn,
        rawName: fn,
        file: f.path.split('/').pop(),
        path: f.path,
        size: f.size,
        category: cat,
        preview: fn + '.webp',
        author: 'Dota 2 Community',
        source: 'Dota2PornFx / Steam Workshop',
        tags: { effects: true, icons: false }
      });
      alreadyFoundFiles.add(fnLower);
    }
  }

  console.log(`\n2. Найдено ${missingMods.length} новых модификаций для добавления:`);

  const formattedNewMods = [];

  for (const m of missingMods) {
    const fnLower = m.rawName.toLowerCase();
    const titleLower = m.title.toLowerCase();

    let matchedHero = null;
    let matchedAttr = 'universal';
    let matchedInternal = 'dota2_logo_symbol';

    for (const [key, val] of heroMap.entries()) {
      if (fnLower.includes(key) || titleLower.includes(key)) {
        matchedHero = val.name;
        matchedAttr = val.attr;
        matchedInternal = val.internal;
        break;
      }
    }

    if (!matchedHero) {
      if (m.category === 'creep-deny' || m.category === 'creeps') {
        matchedHero = 'Крипы';
        matchedAttr = 'other';
        matchedInternal = 'creep';
      } else if (m.category === 'huds' || m.category === 'parts') {
        matchedHero = 'Интерфейс';
        matchedAttr = 'other';
        matchedInternal = 'hud';
      } else if (m.category === 'pedestal') {
        matchedHero = 'Пьедестал';
        matchedAttr = 'other';
        matchedInternal = 'pedestal';
      } else if (m.category === 'ranks') {
        matchedHero = 'Ранги';
        matchedAttr = 'other';
        matchedInternal = 'rank';
      } else if (m.category === 'mega-kill') {
        matchedHero = 'Мега-киллы';
        matchedAttr = 'other';
        matchedInternal = 'announcer';
      } else if (m.category === 'sounds') {
        matchedHero = 'Звуки';
        matchedAttr = 'other';
        matchedInternal = 'sound';
      } else {
        matchedHero = 'Dota 2';
        matchedAttr = 'other';
        matchedInternal = 'dota2_logo_symbol';
      }
    }

    // Determine preview image path
    let previewRel = `assets/previews/${m.category}/${m.preview}`;
    let remotePreviewUrl = `https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/previews/${encodeURIComponent(m.category)}/${encodeURIComponent(m.preview)}`;

    if (!previewBlobs.has(previewRel)) {
      // Fallback
      if (previewBlobs.has(`assets/previews/${m.category}/${m.rawName}.webp`)) {
        previewRel = `assets/previews/${m.category}/${m.rawName}.webp`;
        remotePreviewUrl = `https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/previews/${encodeURIComponent(m.category)}/${encodeURIComponent(m.rawName)}.webp`;
      } else if (m.category === 'mega-kill') {
        previewRel = `assets/previews/mega-kill/portal.webp`;
        remotePreviewUrl = `https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/previews/mega-kill/portal.webp`;
      } else {
        previewRel = `assets/heroes/${matchedInternal}.png`;
        remotePreviewUrl = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${matchedInternal}.png`;
      }
    }

    const heroIconLocal = fs.existsSync(path.join(rootDir, 'assets', 'heroes', `${matchedInternal}.png`))
      ? `assets/heroes/${matchedInternal}.png`
      : 'assets/heroes/dota2_logo_symbol.png';

    const remoteHeroIcon = matchedInternal !== 'dota2_logo_symbol'
      ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${matchedInternal}.png`
      : 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png';

    const rawDownloadUrl = 'https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/' + m.path.split('/').map(encodeURIComponent).join('/');
    const sizeMb = (m.size / (1024 * 1024)).toFixed(1);
    const safeId = `${m.category}-${m.rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-|-$/g, '');

    const newModEntry = {
      id: safeId,
      title: m.title,
      hero: matchedHero,
      hero_icon: heroIconLocal,
      attribute: matchedAttr,
      category: m.category,
      preview: previewRel,
      download_url: rawDownloadUrl,
      author: `${m.author} (Dota2PornFx)`,
      source: 'Dota2PornFx / Steam Workshop',
      source_url: 'https://github.com/h6rd/Dota2PornFxWeb',
      file_size: `${sizeMb} MB`,
      has_effects: m.tags && m.tags.effects !== undefined ? !!m.tags.effects : true,
      has_icons: m.tags && m.tags.icons !== undefined ? !!m.tags.icons : false,
      media_preview: null,
      remote_preview: remotePreviewUrl,
      remote_hero_icon: remoteHeroIcon,
      is_recently_added: true
    };

    formattedNewMods.push(newModEntry);
    console.log(` + [${m.category}] ${m.title} | Автор: ${m.author} | Размер: ${sizeMb} MB`);
  }

  // 3. Скачивание всех картинок превью
  console.log('\n3. Скачивание превью-изображений для автономной работы...');
  let downloadedCount = 0;
  for (const m of formattedNewMods) {
    if (m.preview.startsWith('assets/previews/')) {
      const localDest = path.join(rootDir, m.preview);
      const distDest = path.join(distAppDir, m.preview);
      const appDataDest = path.join(appDataAppDir, m.preview);

      if (!fs.existsSync(localDest) || fs.statSync(localDest).size === 0) {
        const ok = downloadWithCurl(m.remote_preview, localDest);
        if (ok) {
          downloadedCount++;
          try {
            fs.mkdirSync(path.dirname(distDest), { recursive: true });
            fs.copyFileSync(localDest, distDest);
          } catch(e) {}
          try {
            fs.mkdirSync(path.dirname(appDataDest), { recursive: true });
            fs.copyFileSync(localDest, appDataDest);
          } catch(e) {}
        }
      } else {
        downloadedCount++;
        try {
          fs.mkdirSync(path.dirname(distDest), { recursive: true });
          fs.copyFileSync(localDest, distDest);
        } catch(e) {}
        try {
          fs.mkdirSync(path.dirname(appDataDest), { recursive: true });
          fs.copyFileSync(localDest, appDataDest);
        } catch(e) {}
      }
    }
  }
  console.log(`Всего загружено/проверено ${downloadedCount} картинок превью.`);

  // 4. Добавляем новые моды в начало каталога
  const updatedCatalog = [...formattedNewMods, ...localMods];
  console.log(`\n4. Сохранение каталога: было ${localMods.length}, стало ${updatedCatalog.length} модов (+${formattedNewMods.length})`);

  fs.writeFileSync(modsJsonPath, JSON.stringify(updatedCatalog, null, 2), 'utf8');

  // Генерируем mods-data.js
  const jsContent = `window.MODS_DATA = ${JSON.stringify(updatedCatalog, null, 2)};\n`;
  fs.writeFileSync(modsDataJsPath, jsContent, 'utf8');

  // Копируем в dist и AppData
  console.log('5. Синхронизация файлов mods.json и mods-data.js в dist и AppData...');
  fs.copyFileSync(modsJsonPath, path.join(distAppDir, 'data', 'mods.json'));
  fs.copyFileSync(modsDataJsPath, path.join(distAppDir, 'data', 'mods-data.js'));
  fs.copyFileSync(modsJsonPath, path.join(appDataAppDir, 'data', 'mods.json'));
  fs.copyFileSync(modsDataJsPath, path.join(appDataAppDir, 'data', 'mods-data.js'));

  console.log('\n🎉 ОБНОВЛЕНИЕ КАТАЛОГА УСПЕШНО ЗАВЕРШЕНО!');
}

run().catch(err => {
  console.error('Ошибка при обновлении:', err);
  process.exit(1);
});
