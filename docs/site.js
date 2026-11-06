/**
 * DotaMod Hub — Interactive Landing + Catalog Engine
 */

// ─────────────────────────────────────────
// 1. DATA — Featured Mods Catalog
// ─────────────────────────────────────────
const MODS = [
  // ARCANAS
  { id:'abaddon-bloody-fallen', title:'Abaddon: Bloody Fallen King', hero:'Abaddon', category:'arcanas', badge:'Arcana FX', rarity:'Arcana', author:'Community', preview:'assets/previews/heroes/Abaddon Bloody Fallen King.webp', heroIcon:'assets/heroes/axe.png', description:'Кроваво-алая аура меча и переработанные анимации Mist Coil и Borrowed Time.' },
  { id:'pudge-aberrant-observer', title:'Pudge: Aberrant Observer', hero:'Pudge', category:'arcanas', badge:'Премиум', rarity:'Arcana', author:'Dota2PornFx', preview:'assets/previews/heroes/Aberrant Observer Pudge.webp', heroIcon:'assets/heroes/pudge.png', description:'Полная замена модели и крюка с кастомными частицами Rot и новыми звуками Dismember.' },
  { id:'alchemist-darkbrew', title:'Alchemist: Darkbrew Enforcer', hero:'Alchemist', category:'arcanas', badge:"Collector's Cache", rarity:'Mythical', author:'Valve', preview:'assets/previews/heroes/Alchemist Darkbrew Enforcer.webp', heroIcon:'assets/heroes/axe.png', description:'Редчайший сет с золотыми колбами и эффектами Chemical Rage.' },
  { id:'ancient-apparition-sanity', title:'Ancient Apparition: Sanity Despair', hero:'Ancient Apparition', category:'arcanas', badge:'Custom FX', rarity:'Immortal', author:'Community', preview:'assets/previews/heroes/Ancient Apparition Sanity.webp', heroIcon:'assets/heroes/invoker.png', description:'Кастомный ледяной вихрь и неоновый Blast с эффектом разрушения кристалла.' },
  { id:'drow-arcana', title:'Drow Ranger: Japan Arcana', hero:'Drow Ranger', category:'arcanas', badge:'Arcana', rarity:'Arcana', author:'Community', preview:'assets/previews/heroes/Drow Ranger Japan Arcana.webp', heroIcon:'assets/heroes/phantom_assassin.png', description:'Элегантная японская тематика с переработанными анимациями Marksmanship.' },
  { id:'drow-crimson', title:'Drow Ranger: Crimson Stalker', hero:'Drow Ranger', category:'arcanas', badge:'Immortal', rarity:'Immortal', author:'Valve', preview:'assets/previews/heroes/Drow Ranger Crimson Stalker.webp', heroIcon:'assets/heroes/phantom_assassin.png', description:'Алая лучница с кровавыми стрелами — официальный эксклюзив Battle Pass.' },
  { id:'shadow-fiend-cursed', title:'Shadow Fiend: Cursed', hero:'Shadow Fiend', category:'arcanas', badge:'Custom', rarity:'Arcana', author:'Community', preview:'assets/previews/heroes/Cursed Shadow Fiend.webp', heroIcon:'assets/heroes/nevermore.png', description:'Мрачный образ с тёмными крыльями и фиолетовым свечением Requiem.' },
  { id:'shadow-fiend-diabolical', title:'Shadow Fiend: Diabolical', hero:'Shadow Fiend', category:'arcanas', badge:'Arcana FX', rarity:'Arcana', author:'Dota2PornFx', preview:'assets/previews/heroes/Diabolical Shadow Fiend.webp', heroIcon:'assets/heroes/nevermore.png', description:'Дьявольский дизайн с полной заменой частиц Necromastery и Requiem of Souls.' },
  { id:'invoker-chaos', title:'Invoker: Chaos', hero:'Invoker', category:'arcanas', badge:'Arcana', rarity:'Arcana', author:'Community', preview:'assets/previews/heroes/Chaos Invoker.webp', heroIcon:'assets/heroes/invoker.png', description:'Хаотичный Инвокер с вихрями энергии на каждом орбе.' },
  { id:'invoker-dark-reaper', title:'Invoker: Dark Reaper', hero:'Invoker', category:'arcanas', badge:'Custom FX', rarity:'Immortal', author:'Community', preview:'assets/previews/heroes/Dark Reaper Invoker.webp', heroIcon:'assets/heroes/invoker.png', description:'Мрачный жнец с косой вместо шара — полная переработка модели.' },
  { id:'phantom-lancer-crimson', title:'Phantom Lancer: Crimson', hero:'Phantom Lancer', category:'arcanas', badge:'Immortal', rarity:'Immortal', author:'Valve', preview:'assets/previews/heroes/Crimson Phantom Lancer.webp', heroIcon:'assets/heroes/phantom_assassin.png', description:'Алые иллюзии с кровавым следом при каждом раздвоении.' },
  { id:'abaddon-endless-night', title:'Abaddon: Endless Night', hero:'Abaddon', category:'arcanas', badge:'Custom', rarity:'Mythical', author:'Community', preview:'assets/previews/heroes/Abaddon Endless Night.webp', heroIcon:'assets/heroes/axe.png', description:'Вечная ночь вокруг Abaddon — переработанная аура и новые частицы Mist Coil.' },

  // SOUNDS
  { id:'sound-sf-requiem', title:'Shadow Fiend: Requiem (Desire)', hero:'Shadow Fiend', category:'sounds', badge:'Ульт XVII', rarity:'Immortal', author:'XVII Sound', preview:'assets/previews/heroes/Cursed Shadow Fiend.webp', heroIcon:'assets/heroes/nevermore.png', audio:'audio/hero-sounds/sf-desire-requiem.mp3', description:'Мощный басовый дроп при касте Requiem of Souls. Качает каждую драку.' },
  { id:'sound-pudge-dili', title:'Pudge: Тили-Тили-Бом (Rot)', hero:'Pudge', category:'sounds', badge:'Хоррор', rarity:'Rare', author:'Community', preview:'assets/previews/heroes/Aberrant Observer Pudge.webp', heroIcon:'assets/heroes/pudge.png', audio:'audio/hero-sounds/pudge-dili-tili-bom.mp3', description:'Пугающая колыбельная вместо стандартного шипения Rot.' },
  { id:'sound-gaben', title:'Gabe Newell Mega-Kills', hero:'Dota 2', category:'sounds', badge:'Официальный', rarity:'Immortal', author:'Valve', preview:'assets/previews/announcers/Lina.webp', heroIcon:'assets/heroes/axe.png', audio:'audio/announcers/gaben.mp3', description:'Сам Гейб Ньюэлл комментирует ваши мультикиллы с фирменным сарказмом.' },
  { id:'sound-stariy-bog', title:'Старый Бог (Mega-Kill)', hero:'Dota 2', category:'sounds', badge:'Стример-пак', rarity:'Mythical', author:'Community', preview:'assets/previews/announcers/Meepo.webp', heroIcon:'assets/heroes/axe.png', audio:'audio/announcers/stariy_bog.mp3', description:'Эмоциональные крики и фирменные реакции на Rampage и падение вышек.' },
  { id:'sound-axe', title:'Axe: Announcer Pack', hero:'Axe', category:'sounds', badge:'Голос Valve', rarity:'Mythical', author:'Valve', preview:'assets/previews/announcers/Tusk.webp', heroIcon:'assets/heroes/axe.png', audio:'audio/announcers/axe/axe_welcome.mp3', description:'Брутальный комментатор Axe с оригинальными репликами из студии Valve.' },
  { id:'sound-dagon-cobra', title:'Dagon: Cobra Kick FX', hero:'Dagon', category:'sounds', badge:'Эффект предмета', rarity:'Rare', author:'Community', preview:'assets/previews/hero-sounds/Anti Mage Taunt Tt.webp', heroIcon:'assets/heroes/dagon.png', audio:'audio/hero-sounds/dagon-cobra-kick.mp3', description:'Звук удара кобры вместо стандартного выстрела Dagon.' },
  { id:'sound-dire-shred', title:'Dire Shred Bass Drop', hero:'Dota 2', category:'sounds', badge:'Мем', rarity:'Legendary', author:'Community', preview:'assets/previews/hero-sounds/Arc Warden Xvii.webp', heroIcon:'assets/heroes/spirit_breaker.png', audio:'audio/hero-sounds/dire-shred.mp3', description:'Эпичный бас-дроп вместо звука разрушения трона Dire.' },
  { id:'sound-dark-willow', title:'Dark Willow Announcer', hero:'Dark Willow', category:'sounds', badge:'Анонсер', rarity:'Immortal', author:'Valve', preview:'assets/previews/announcers/Dark Willow.webp', heroIcon:'assets/heroes/lina.png', description:'Коварные и остроумные комментарии Dark Willow на каждое событие матча.' },
  { id:'sound-darkest-dungeon', title:'Darkest Dungeon Announcer', hero:'Narrator', category:'sounds', badge:'Кросс-игра', rarity:'Mythical', author:'Red Hook Studios', preview:'assets/previews/announcers/Darkest Dungeon.webp', heroIcon:'assets/heroes/nevermore.png', description:'Мрачный нарратор из Darkest Dungeon провозглашает вашу победу или гибель.' },

  // BACKGROUNDS
  { id:'bg-blossom-rem', title:'Blossom Rem — Живое меню', hero:'Интерфейс', category:'backgrounds', badge:'WebM 1080p', rarity:'Mythical', author:'DotaMod Hub', preview:'assets/previews/backgrounds/Blossom Rem.webp', heroIcon:'assets/heroes/crystal_maiden.png', description:'Плавная анимированная сцена главного меню в 60 FPS с падающими лепестками сакуры.' },
  { id:'bg-beneath-seventh', title:'Beneath the Seventh Sky', hero:'Интерфейс', category:'backgrounds', badge:'WebM 60FPS', rarity:'Immortal', author:'Valve', preview:'assets/previews/backgrounds/Beneath the Seventh.webp', heroIcon:'assets/heroes/rubick.png', description:'Панорама ночного Скайраса с летящими кораблями и мерцающими рунами.' },
  { id:'bg-black-minimal', title:'Deep Void: Minimal Black', hero:'Оптимизация', category:'backgrounds', badge:'+30 FPS', rarity:'Rare', author:'Perf Team', preview:'assets/previews/backgrounds/Black Background.webp', heroIcon:'assets/heroes/invoker.png', description:'Ультралегкий минималистичный фон для максимальной частоты кадров.' },
  { id:'bg-anime', title:'Anime Menu Background', hero:'Интерфейс', category:'backgrounds', badge:'Аниме', rarity:'Legendary', author:'Community', preview:'assets/previews/backgrounds/Anime.webp', heroIcon:'assets/heroes/crystal_maiden.png', description:'Яркий аниме-фон главного меню с детализированными персонажами.' },
  { id:'bg-bliss', title:'Bliss — Zen Menu', hero:'Интерфейс', category:'backgrounds', badge:'Zen', rarity:'Mythical', author:'Community', preview:'assets/previews/backgrounds/Bliss.webp', heroIcon:'assets/heroes/rubick.png', description:'Спокойная дзен-атмосфера с туманными холмами и мягким светом.' },
  { id:'bg-amor-endscreen', title:'Amor — Endscreen FX', hero:'Интерфейс', category:'backgrounds', badge:'Финальный экран', rarity:'Rare', author:'Community', preview:'assets/previews/backgrounds/Amor Endscreen.webp', heroIcon:'assets/heroes/lina.png', description:'Красивая анимация на экране завершения игры с частицами.' },

  // TERRAINS
  { id:'terrain-autumn', title:'Осенний ландшафт (Autumn)', hero:'Карта', category:'terrains', badge:'Карта', rarity:'Immortal', author:'Valve / Enhanced', preview:'assets/previews/terrains/Autumn.webp', heroIcon:'assets/heroes/weaver.png', description:'Золотые кроны деревьев, туманная река и теплый рассеянный свет по всей карте.' },
  { id:'terrain-dark-poly', title:'Dark Poly + Clean Trees', hero:'Карта', category:'terrains', badge:'Киберспорт', rarity:'Immortal', author:'Competitive', preview:'assets/previews/terrains/DarkPoly+Trees.webp', heroIcon:'assets/heroes/weaver.png', description:'Упрощённая геометрия и контрастная сетка для идеальной видимости вардов.' },
  { id:'terrain-bedrock', title:'Bedrock Terrain', hero:'Карта', category:'terrains', badge:'Мрак', rarity:'Mythical', author:'Community', preview:'assets/previews/terrains/Bedrock.webp', heroIcon:'assets/heroes/tinker.png', description:'Каменный, пещерный ландшафт с красноватым подсветом.' },
  { id:'terrain-crownfall', title:'Crownfall Terrain', hero:'Карта', category:'terrains', badge:'Crownfall', rarity:'Immortal', author:'Valve', preview:'assets/previews/terrains/Crownfall.webp', heroIcon:'assets/heroes/rubick.png', description:'Официальный ландшафт ивента Crownfall с уникальными текстурами реки и башен.' },
  { id:'terrain-dark-terrain', title:'Dark Terrain Overhaul', hero:'Карта', category:'terrains', badge:'Ночной', rarity:'Mythical', author:'Community', preview:'assets/previews/terrains/Dark Terrain.webp', heroIcon:'assets/heroes/nevermore.png', description:'Полная ночная карта с тёмным небом и фиолетовым свечением по всей карте.' },
  { id:'terrain-darkpoly', title:'DarkPoly Minimal', hero:'Карта', category:'terrains', badge:'Minimal', rarity:'Rare', author:'Community', preview:'assets/previews/terrains/DarkPoly.webp', heroIcon:'assets/heroes/tinker.png', description:'Минималистичный полигональный стиль без лишних деталей — чистота и скорость.' },

  // ITEM EFFECTS
  { id:'item-aegis-hearts', title:'Aegis: Hearts FX', hero:'Aegis', category:'items', badge:'Эффект предмета', rarity:'Immortal', author:'Community', preview:'assets/previews/item-effects/Aegis Hearts.webp', heroIcon:'assets/heroes/juggernaut.png', description:'Летящие сердечки вместо стандартного свечения Aegis of Immortality.' },
  { id:'item-blue-dagon', title:'Blue Dagon FX', hero:'Dagon', category:'items', badge:'Синий', rarity:'Rare', author:'Community', preview:'assets/previews/item-effects/Blue Dagon.webp', heroIcon:'assets/heroes/dagon.png', description:'Переработанный синий луч Dagon вместо стандартного фиолетового.' },
  { id:'item-bp2022-agha-aura1', title:'BP 2022: Aghanim Aura I', hero:'Aghanim', category:'items', badge:'Battle Pass', rarity:'Mythical', author:'Valve', preview:'assets/previews/item-effects/BP 2022 Aghanim Aura I.webp', heroIcon:'assets/heroes/rubick.png', description:'Первый вариант ауры Aghanim из Battle Pass 2022 с синим свечением.' },
  { id:'item-bp2022-agha-aura2', title:'BP 2022: Aghanim Aura II', hero:'Aghanim', category:'items', badge:'Battle Pass', rarity:'Mythical', author:'Valve', preview:'assets/previews/item-effects/BP 2022 Aghanim Aura II.webp', heroIcon:'assets/heroes/rubick.png', description:'Второй вариант ауры Aghanim из Battle Pass 2022 с золотым переливом.' },
  { id:'item-bp2022-blink', title:'BP 2022: Blink Dagger FX', hero:'Blink Dagger', category:'items', badge:'Battle Pass', rarity:'Mythical', author:'Valve', preview:'assets/previews/item-effects/BP 2022 Blink Dagger.webp', heroIcon:'assets/heroes/faceless_void.png', description:'Переработанный след телепортации Blink Dagger в стиле Battle Pass 2022.' },
  { id:'item-bp2022-bottle', title:'BP 2022: Bottle FX', hero:'Bottle', category:'items', badge:'Battle Pass', rarity:'Rare', author:'Valve', preview:'assets/previews/item-effects/BP 2022 Bottle.webp', heroIcon:'assets/heroes/juggernaut.png', description:'Анимированный флакон Bottle с пузырящейся жидкостью из Battle Pass 2022.' },
];

// ─────────────────────────────────────────
// 2. PAGE NAVIGATION
// ─────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const page = document.getElementById('page-' + name);
  const btn  = document.getElementById('nav-' + name);
  if (page) page.classList.add('active');
  if (btn)  btn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'catalog') renderCatalog();
}

// ─────────────────────────────────────────
// 3. CATALOG
// ─────────────────────────────────────────
let currentCategory = 'all';

function setCatFilter(el, cat) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  currentCategory = cat;
  filterCatalog();
}

function filterCatalog() {
  const q = (document.getElementById('catalogSearch')?.value || '').toLowerCase().trim();
  const filtered = MODS.filter(m => {
    const catOk  = currentCategory === 'all' || m.category === currentCategory;
    const termOk = !q || m.title.toLowerCase().includes(q) || m.hero.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    return catOk && termOk;
  });
  renderCards(filtered);
}

function renderCatalog() {
  renderCards(MODS);
}

function renderCards(list) {
  const grid  = document.getElementById('catalogGrid');
  const empty = document.getElementById('catalogEmpty');
  const count = document.getElementById('catalogCount');

  if (!grid) return;

  if (count) count.textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');

  const rarityClass = {
    'Arcana':   'rarity-arcana',
    'Immortal': 'rarity-immortal',
    'Mythical': 'rarity-mythical',
    'Legendary':'rarity-legendary',
    'Rare':     'rarity-rare',
  };

  const catIcon = {
    arcanas: 'fa-wand-sparkles text-amber-400',
    sounds:  'fa-headphones text-purple-400',
    backgrounds: 'fa-panorama text-cyan-400',
    terrains: 'fa-map text-emerald-400',
    items:   'fa-sparkles text-rose-400',
  };

  grid.innerHTML = list.map(m => `
    <div class="mod-card glass-panel rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500/40 transition-all duration-200"
         onclick="openModal('${m.id}')">
      <!-- Preview image -->
      <div class="relative h-44 overflow-hidden bg-slate-900">
        <img src="${m.preview}" alt="${m.title}"
             class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
             onerror="this.src='assets/logo.png'; this.style.objectFit='contain'; this.style.padding='2rem'">
        <div class="absolute inset-0" style="background:linear-gradient(to top, rgba(10,15,25,0.9) 0%, transparent 60%)"></div>
        <!-- Badges -->
        <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur">${m.badge}</span>
        </div>
        <!-- Audio play button -->
        ${m.audio ? `
        <button onclick="event.stopPropagation(); playCardAudio('${m.id}', '${m.audio}', '${m.title.replace(/'/g, "\\'")}')"
                class="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 flex items-center justify-center text-white text-xs backdrop-blur transition-colors"
                id="play-btn-${m.id}" title="Слушать превью">
          <i class="fa-solid fa-play" id="play-icon-${m.id}"></i>
        </button>` : ''}
        <!-- Category badge -->
        <div class="absolute bottom-2.5 left-2.5">
          <span class="text-[10px] text-slate-400"><i class="fa-solid ${catIcon[m.category] || 'fa-box text-slate-400'} mr-1"></i>${m.hero}</span>
        </div>
      </div>
      <!-- Card body -->
      <div class="p-4">
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3 class="font-bold text-sm text-white leading-tight line-clamp-2">${m.title}</h3>
          <span class="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${rarityClass[m.rarity] || 'text-slate-400 border-slate-700'}" style="background:rgba(0,0,0,0.3)">${m.rarity}</span>
        </div>
        <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">${m.description}</p>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-[10px] text-slate-500">by ${m.author}</span>
          <button class="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 text-[10px] font-bold transition-colors">
            Подробнее →
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────
// 4. MODAL
// ─────────────────────────────────────────
let currentModalAudio = null;
let modalAudioSrc = '';

function openModal(id) {
  const m = MODS.find(x => x.id === id);
  if (!m) return;

  document.getElementById('modalImg').src     = m.preview;
  document.getElementById('modalImg').alt     = m.title;
  document.getElementById('modalTitle').textContent  = m.title;
  document.getElementById('modalDesc').textContent   = m.description;
  document.getElementById('modalHeroTag').textContent = m.hero + ' · ' + m.author;
  document.getElementById('modalBadge').textContent  = m.badge;

  const rarityEl = document.getElementById('modalRarity');
  const rarityClass = { Arcana:'#f59e0b', Immortal:'#a78bfa', Mythical:'#818cf8', Legendary:'#34d399', Rare:'#60a5fa' };
  rarityEl.textContent = m.rarity;
  rarityEl.style.color = rarityClass[m.rarity] || '#94a3b8';
  rarityEl.style.borderColor = (rarityClass[m.rarity] || '#64748b') + '50';

  const audioSection = document.getElementById('modalAudioSection');
  if (m.audio) {
    audioSection.classList.remove('hidden');
    document.getElementById('modalAudioLabel').textContent = m.title;
    modalAudioSrc = m.audio;
    resetModalAudio();
  } else {
    audioSection.classList.add('hidden');
    modalAudioSrc = '';
  }

  const modal = document.getElementById('modModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modModal')) return;
  document.getElementById('modModal').classList.add('hidden');
  document.getElementById('modModal').classList.remove('flex');
  document.body.style.overflow = '';
  stopModalAudio();
}

// ─────────────────────────────────────────
// 5. AUDIO SYSTEM
// ─────────────────────────────────────────
let currentPlayingId = null;
const globalAudio = document.getElementById('globalAudio');

function playCardAudio(id, src, title) {
  if (currentPlayingId === id) {
    stopGlobalAudio();
    return;
  }
  stopGlobalAudio();

  currentPlayingId = id;
  globalAudio.src = src;
  globalAudio.play().catch(() => {});

  // Update play button icon
  const icon = document.getElementById('play-icon-' + id);
  if (icon) icon.className = 'fa-solid fa-stop';

  // Show audio bar
  const bar = document.getElementById('globalAudioBar');
  document.getElementById('audioBarTitle').textContent = title;
  bar.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
  bar.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

  globalAudio.onended = () => stopGlobalAudio();
}

function stopGlobalAudio() {
  if (currentPlayingId) {
    const icon = document.getElementById('play-icon-' + currentPlayingId);
    if (icon) icon.className = 'fa-solid fa-play';
    currentPlayingId = null;
  }
  globalAudio.pause();
  globalAudio.src = '';

  const bar = document.getElementById('globalAudioBar');
  bar.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  bar.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
}

// Modal audio
let modalAudioEl = null;
function toggleModalAudio() {
  if (!modalAudioSrc) return;

  if (!modalAudioEl) {
    modalAudioEl = new Audio(modalAudioSrc);
    modalAudioEl.addEventListener('timeupdate', () => {
      const pct = (modalAudioEl.currentTime / modalAudioEl.duration) * 100 || 0;
      const prog = document.getElementById('modalAudioProgress');
      if (prog) prog.style.width = pct + '%';
    });
    modalAudioEl.addEventListener('ended', resetModalAudio);
  }

  if (modalAudioEl.paused) {
    modalAudioEl.play().catch(() => {});
    document.getElementById('modalPlayIcon').className = 'fa-solid fa-stop';
    document.querySelectorAll('#modModal .eq-bar').forEach(b => b.style.animationPlayState = 'running');
  } else {
    modalAudioEl.pause();
    document.getElementById('modalPlayIcon').className = 'fa-solid fa-play';
    document.querySelectorAll('#modModal .eq-bar').forEach(b => b.style.animationPlayState = 'paused');
  }
}

function stopModalAudio() {
  if (modalAudioEl) {
    modalAudioEl.pause();
    modalAudioEl.currentTime = 0;
    modalAudioEl = null;
  }
  resetModalAudio();
}

function resetModalAudio() {
  const icon = document.getElementById('modalPlayIcon');
  const prog = document.getElementById('modalAudioProgress');
  if (icon) icon.className = 'fa-solid fa-play';
  if (prog) prog.style.width = '0%';
  document.querySelectorAll('#modModal .eq-bar').forEach(b => b.style.animationPlayState = 'paused');
}

// ─────────────────────────────────────────
// 6. GITHUB API — Downloads & Version
// ─────────────────────────────────────────
async function fetchGitHubReleaseInfo() {
  try {
    const [latestRes, allRes] = await Promise.all([
      fetch('https://api.github.com/repos/terbixsorr/DotaModHub/releases/latest'),
      fetch('https://api.github.com/repos/terbixsorr/DotaModHub/releases?per_page=100')
    ]);

    if (latestRes.ok) {
      const data = await latestRes.json();
      ['githubReleaseTag', 'githubReleaseTagStat'].forEach(id => {
        const el = document.getElementById(id);
        if (el && data.tag_name) el.textContent = data.tag_name;
      });
    }

    if (allRes.ok) {
      const releases = await allRes.json();
      let total = 0;
      releases.forEach(r => (r.assets || []).forEach(a => { total += a.download_count || 0; }));

      const el = document.getElementById('totalDownloads');
      if (el) animateCounter(el, total > 0 ? total : 0);
    }
  } catch (e) {
    console.debug('GitHub API:', e);
    const el = document.getElementById('totalDownloads');
    if (el && el.textContent === '—') el.textContent = '0';
  }
}

function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();
  (function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(target * eased).toLocaleString('ru-RU');
    if (p < 1) requestAnimationFrame(update);
  })(start);
}

// ─────────────────────────────────────────
// 7. ANIME.JS ANIMATIONS
// ─────────────────────────────────────────
function initAnimations() {
  if (typeof anime === 'undefined') return;
  anime({
    targets: '.anime-hero-fade',
    opacity: [0, 1], translateY: [20, 0],
    delay: anime.stagger(100, { start: 150 }),
    duration: 800, easing: 'easeOutCubic'
  });
}

// ─────────────────────────────────────────
// 8. KEYBOARD ESC TO CLOSE MODAL
// ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('modModal').classList.add('hidden');
    document.getElementById('modModal').classList.remove('flex');
    document.body.style.overflow = '';
    stopModalAudio();
  }
});

// ─────────────────────────────────────────
// 9. INIT
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetchGitHubReleaseInfo();
  initAnimations();
  renderCatalog(); // pre-render so filter tabs work immediately
});
