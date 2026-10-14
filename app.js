/**
 * DotaMod Hub — Core Logic (All Heroes + Left View Controls + Prominent Recent)
 */

let allMods = [];
let allHeroes = [];
let allItems = [];
let activeHeroFilter = 'all';
let activeItemFilter = 'all';
let activeCategoryFilter = 'all';
let activeAttributeFilter = 'all';
let activeEntityTab = 'heroes'; // 'heroes' | 'items'
let searchQuery = '';
let viewMode = localStorage.getItem('dotamod_view_mode') || 'grid'; // 'grid' | 'list'
let heroSearchQuery = '';
let itemSearchQuery = '';
let favorites = JSON.parse(localStorage.getItem('dotamod_favs') || '[]');
let currentFilteredMods = [];
let currentModalModId = null;
let currentPreviewList = [];
let currentPreviewIndex = 0;

// Non-hero entities that should NOT appear under "Герои Dota 2"
const NON_HERO_ENTITIES = new Set([
  'Aegis', 'Aghanim Aura', 'Announcer', 'Attack FX', 'Backgrounds', 'Blade Mail', 'Blink Dagger', 
  'Bottle', 'Couriers', 'Creep Deny', 'Creeps', 'Dagon', 'Dota 2', 'Effect Packs', 
  'Ethereal', 'Euls / Wind Waker', 'Fonts', 'Force Staff', 'Fountain Regen', 
  'Hex', 'High Five', 'HUD', 'Iron Branch', 'Lvl Up', 'Maelstrom / Mjollnir', 'Mekanism', 
  'Phase Boots', 'Phylactery / Khanda', 'Radiance', 'River', 'Rod of Atos / Gleipnir', 
  'Runes', 'Shaders', 'Shivas Guard', 'Teleport', 'Terrain', 'TI Effects', 
  'Trees', 'Versus Screens', 'Wards', 'Effects', 'Звуки героев', 'Music', 'Музыка',
  'Курьеры', 'Крипы', 'Фоны', 'Интерфейс', 'Мега-киллы', 'Ландшафты', 'Звуки', 
  'Денай крипов', 'Башни', 'Ранги', 'Шрифты', 'Шейдеры', 'Реки', 'Деревья', 
  'Курсоры', 'Пьедесталы', 'Варды', 'Towers', 'Cursors', 'Ranks', 'Pedestals'
]);

// In-game items & effects for the dedicated "Предметы и эффекты" tab
const ITEM_EFFECT_ENTITIES = new Set([
  'Teleport', 'Fountain Regen', 'Blink Dagger', 'TI Effects', 'Euls / Wind Waker',
  'Lvl Up', 'Phase Boots', 'Radiance', 'Force Staff', 'Maelstrom / Mjollnir',
  'Mekanism', 'Shivas Guard', 'Effect Packs', 'Bottle', 'Hex', 'Iron Branch',
  'Phylactery / Khanda', 'Rod of Atos / Gleipnir', 'Runes', 'Aegis', 'Aghanim Aura',
  'Blade Mail', 'Creep Deny', 'Dagon', 'Ethereal', 'High Five', 'Attack FX'
]);

const ITEM_META = {
  'High Five': { name: 'High five (Дай пять)', icon: 'assets/items/aegis.png' },
  'Attack FX': { name: 'Эффекты атаки (Attack FX)', icon: 'assets/items/greater_crit.png' },
  'Teleport': { name: 'Телепорт (Teleport)', icon: 'assets/items/tpscroll.png' },
  'Fountain Regen': { name: 'Фонтан (Fountain Regen)', icon: 'assets/items/clarity.png' },
  'Blink Dagger': { name: 'Blink Dagger', icon: 'assets/items/blink.png' },
  'TI Effects': { name: 'Эффекты The International', icon: 'assets/items/aegis.png' },
  'Euls / Wind Waker': { name: "Eul's / Wind Waker", icon: 'assets/items/cyclone.png' },
  'Lvl Up': { name: 'Повышение уровня (Level Up)', icon: 'assets/items/tome_of_knowledge.png' },
  'Phase Boots': { name: 'Phase Boots', icon: 'assets/items/phase_boots.png' },
  'Radiance': { name: 'Radiance', icon: 'assets/items/radiance.png' },
  'Force Staff': { name: 'Force Staff', icon: 'assets/items/force_staff.png' },
  'Maelstrom / Mjollnir': { name: 'Maelstrom / Mjollnir', icon: 'assets/items/maelstrom.png' },
  'Mekanism': { name: 'Mekanism', icon: 'assets/items/mekansm.png' },
  'Shivas Guard': { name: "Shiva's Guard", icon: 'assets/items/shivas_guard.png' },
  'Effect Packs': { name: 'Наборы эффектов (Effect Packs)', icon: 'assets/heroes/dota2_logo_symbol.png' },
  'Bottle': { name: 'Bottle', icon: 'assets/items/bottle.png' },
  'Hex': { name: 'Scythe of Vyse (Hex)', icon: 'assets/items/sheepstick.png' },
  'Iron Branch': { name: 'Iron Branch', icon: 'assets/items/branches.png' },
  'Phylactery / Khanda': { name: 'Phylactery / Khanda', icon: 'assets/items/phylactery.png' },
  'Rod of Atos / Gleipnir': { name: 'Rod of Atos / Gleipnir', icon: 'assets/items/rod_of_atos.png' },
  'Runes': { name: 'Руны (Runes)', icon: 'assets/items/bottle.png' },
  'Aegis': { name: 'Aegis of the Champions', icon: 'assets/items/aegis.png' },
  'Aghanim Aura': { name: 'Aura Аганима', icon: 'assets/items/ultimate_scepter.png' },
  'Blade Mail': { name: 'Blade Mail', icon: 'assets/items/blade_mail.png' },
  'Creep Deny': { name: 'Creep Deny', icon: 'assets/heroes/dota2_logo_symbol.png' },
  'Dagon': { name: 'Dagon', icon: 'assets/items/dagon.png' },
  'Ethereal': { name: 'Ethereal Blade', icon: 'assets/items/ethereal_blade.png' }
};

// ==========================================
// COMPREHENSIVE BILINGUAL SEARCH & ALIAS SYSTEM
// ==========================================
const HERO_ALIASES = {
  'Abaddon': ['abaddon', 'абаддон', 'абадон', 'аба'],
  'Alchemist': ['alchemist', 'алхимик', 'алхим'],
  'Ancient Apparition': ['ancient apparition', 'аппарат', 'аа', 'aa'],
  'Anti-Mage': ['anti-mage', 'anti mage', 'antimage', 'антимаг', 'анти-маг', 'магина', 'ам', 'am'],
  'Arc Warden': ['arc warden', 'арк', 'арк варден', 'варден', 'arc'],
  'Axe': ['axe', 'акс'],
  'Bane': ['bane', 'бейн'],
  'Batrider': ['batrider', 'бетрайдер', 'бэт', 'бэтрайдер', 'bat'],
  'Beastmaster': ['beastmaster', 'бист', 'бистмастер', 'bm'],
  'Bloodseeker': ['bloodseeker', 'бладсикер', 'бс', 'сикер', 'bs'],
  'Bounty Hunter': ['bounty hunter', 'баунти', 'бх', 'гондор', 'bh'],
  'Brewmaster': ['brewmaster', 'брюмастер', 'брю', 'панда', 'brew'],
  'Bristleback': ['bristleback', 'бристл', 'брист', 'еж', 'ёж', 'bb'],
  'Broodmother': ['broodmother', 'бруда', 'паучиха', 'brood'],
  'Centaur Warrunner': ['centaur', 'centaur warrunner', 'кентавр', 'кент'],
  'Chaos Knight': ['chaos knight', 'хаос', 'цк', 'чк', 'ck'],
  'Chen': ['chen', 'чен'],
  'Clinkz': ['clinkz', 'клинкз', 'боник'],
  'Clockwerk': ['clockwerk', 'клокверк', 'клок'],
  'Crystal Maiden': ['crystal maiden', 'кристал мейден', 'цм', 'цмка', 'см', 'рилай', 'cm'],
  'Dark Seer': ['dark seer', 'дарк сир', 'дс', 'ds'],
  'Dark Willow': ['dark willow', 'дарк виллоу', 'фея', 'willow'],
  'Dawnbreaker': ['dawnbreaker', 'давнбрейкер', 'дб', 'db', 'валора'],
  'Dazzle': ['dazzle', 'даззл', 'дазл', 'крест'],
  'Death Prophet': ['death prophet', 'дезпрофет', 'дп', 'кроба', 'банша', 'dp'],
  'Disruptor': ['disruptor', 'дизраптор', 'тралл'],
  'Doom': ['doom', 'дум'],
  'Dragon Knight': ['dragon knight', 'драгон найт', 'дк', 'дракон', 'рыцарь', 'dk'],
  'Drow Ranger': ['drow ranger', 'дров рейнджер', 'тракса', 'тракс', 'дроу', 'drow'],
  'Earth Spirit': ['earth spirit', 'земеля', 'земля', 'эс'],
  'Earthshaker': ['earthshaker', 'шейкер', 'ес', 'фиссура', 'es', 'shaker'],
  'Ember Spirit': ['ember spirit', 'эмбер', 'ембер', 'ember'],
  'Enchantress': ['enchantress', 'энча', 'коза', 'encha'],
  'Enigma': ['enigma', 'энигма'],
  'Faceless Void': ['faceless void', 'войд', 'купол', 'void'],
  'Grimstroke': ['grimstroke', 'гримстроук', 'грим', 'художник'],
  'Gyrocopter': ['gyrocopter', 'гирокоптер', 'гиро', 'вертолет', 'дед', 'gyro'],
  'Hoodwink': ['hoodwink', 'худвинк', 'белка'],
  'Huskar': ['huskar', 'хускар', 'хуск'],
  'Invoker': ['invoker', 'инвокер', 'вокер', 'каэль', 'invo'],
  'Io': ['io', 'висп', 'ио', 'шарик', 'wisp'],
  'Jakiro': ['jakiro', 'джакиро', 'двухголовый', 'thd'],
  'Juggernaut': ['juggernaut', 'джаггернаут', 'джагернаут', 'джаггер', 'джагер', 'джага', 'юги', 'jugg'],
  'Keeper of the Light': ['keeper of the light', 'котл', 'дед', 'свет', 'гендальф', 'kotl'],
  'Kez': ['kez', 'кез', 'птица'],
  'Kunkka': ['kunkka', 'кункка', 'кунка', 'адмирал', 'корабль'],
  'Legion Commander': ['legion commander', 'легионка', 'легион', 'лк', 'дуэль', 'lc'],
  'Leshrac': ['leshrac', 'лешрак', 'конь', 'lesh'],
  'Lich': ['lich', 'лич', 'дедушка'],
  'Lifestealer': ['lifestealer', 'найкс', 'гуля', 'гуль', 'naix'],
  'Lina': ['lina', 'лина', 'огонь'],
  'Lion': ['lion', 'лион', 'палец', 'лев'],
  'Lone Druid': ['lone druid', 'лон друид', 'силла', 'мишка', 'медведь', 'ld'],
  'Luna': ['luna', 'луна'],
  'Lycan': ['lycan', 'ликан', 'волк', 'люкан'],
  'Magnus': ['magnus', 'магнус', 'магнатавр', 'рп'],
  'Marci': ['marci', 'марси'],
  'Mars': ['mars', 'марс', 'арена', 'копье'],
  'Medusa': ['medusa', 'медуза', 'дуза', 'змея'],
  'Meepo': ['meepo', 'мипо', 'геомансер', 'клоны'],
  'Mirana': ['mirana', 'мирана', 'потма', 'стрела', 'кошка', 'potm'],
  'Monkey King': ['monkey king', 'обезьяна', 'мк', 'король', 'mk'],
  'Morphling': ['morphling', 'морфлинг', 'морф', 'вода', 'перекачка', 'morph'],
  'Muerta': ['muerta', 'муэрта', 'муерта', 'смерть'],
  'Naga Siren': ['naga siren', 'нага', 'сирена', 'сон', 'naga'],
  'Natures Prophet': ['natures prophet', "nature's prophet", 'фурион', 'фура', 'профет', 'пеньки', 'np', 'furion'],
  'Necrophos': ['necrophos', 'некрофос', 'некр', 'коса', 'дед', 'necro'],
  'Night Stalker': ['night stalker', 'найтсталкер', 'баланар', 'ночь', 'крылья', 'ns'],
  'Nyx Assassin': ['nyx assassin', 'никс', 'жук', 'nyx'],
  'Ogre Magi': ['ogre magi', 'огр', 'огр маг', 'огры', 'мультикаст', 'ogre'],
  'Omniknight': ['omniknight', 'омник', 'омникнайт', 'хил', 'omni'],
  'Oracle': ['oracle', 'оракул'],
  'Outworld Destroyer': ['outworld destroyer', 'од', 'деструктор', 'астрал', 'od'],
  'Pangolier': ['pangolier', 'панго', 'пангольер', 'шар', 'pango'],
  'Phantom Assassin': ['phantom assassin', 'мортра', 'фантомка', 'па', 'криты', 'pa'],
  'Phantom Lancer': ['phantom lancer', 'фантом лансер', 'пл', 'иллюзии', 'pl'],
  'Phoenix': ['phoenix', 'феникс', 'птица', 'яйцо'],
  'Primal Beast': ['primal beast', 'праймал', 'бист', 'зверь', 'топот', 'pb'],
  'Puck': ['puck', 'пак', 'дракончик', 'орб'],
  'Pudge': ['pudge', 'пудж', 'падж', 'мясник', 'хук', 'вонючка'],
  'Pugna': ['pugna', 'пугна', 'зеленый', 'сосалка'],
  'Queen of Pain': ['queen of pain', 'квопа', 'королева', 'акаша', 'qop'],
  'Razor': ['razor', 'разор', 'электрик', 'статика'],
  'Riki': ['riki', 'рики', 'рикки', 'невидимка', 'крыса'],
  'Ringmaster': ['ringmaster', 'рингмастер', 'клоун', 'цирк'],
  'Rubick': ['rubick', 'рубик', 'вор', 'маг'],
  'Sand King': ['sand king', 'ск', 'скорпион', 'песок', 'эпицентр', 'sk'],
  'Shadow Demon': ['shadow demon', 'шд', 'демон', 'sd'],
  'Shadow Fiend': ['shadow fiend', 'сф', 'невермор', 'койлы', 'души', 'sf', 'nevermore'],
  'Shadow Shaman': ['shadow shaman', 'шаман', 'рашта', 'змейки', 'сетка', 'ss'],
  'Silencer': ['silencer', 'сайленсер', 'сало', 'тишина'],
  'Skywrath Mage': ['skywrath mage', 'скай', 'петух', 'маг', 'sky'],
  'Slardar': ['slardar', 'селедка', 'рыба'],
  'Slark': ['slark', 'сларк', 'рыба', 'паунс'],
  'Snapfire': ['snapfire', 'снапка', 'бабка', 'печеньки'],
  'Sniper': ['sniper', 'снайпер', 'дед', 'прицел', 'хэдшот'],
  'Spectre': ['spectre', 'спектра', 'меркуриал'],
  'Spirit Breaker': ['spirit breaker', 'бара', 'баратрум', 'разгон', 'бык', 'корова', 'баш', 'sb'],
  'Storm Spirit': ['storm spirit', 'шторм', 'райджин', 'молния', 'шар', 'панда', 'storm'],
  'Sven': ['sven', 'свен', 'рыцарь', 'стан', 'ульт'],
  'Techies': ['techies', 'течис', 'минер', 'мины', 'мина', 'бомба'],
  'Templar Assassin': ['templar assassin', 'та', 'ланая', 'темпларка', 'щит', 'ta'],
  'Terrorblade': ['terrorblade', 'тб', 'террорблейд', 'метаморфоза', 'tb'],
  'Tidehunter': ['tidehunter', 'тайд', 'арбуз', 'равага', 'tide'],
  'Timbersaw': ['timbersaw', 'тимбер', 'пила'],
  'Tinker': ['tinker', 'тинкер', 'ракеты', 'лазер'],
  'Tiny': ['tiny', 'тини', 'камень', 'булыжник'],
  'Treant Protector': ['treant protector', 'трент', 'дерево', 'руфтрейтер'],
  'Troll Warlord': ['troll warlord', 'тролль', 'топоры'],
  'Tusk': ['tusk', 'туск', 'морж', 'снежок', 'панч'],
  'Underlord': ['underlord', 'андерлорд', 'питлорд'],
  'Undying': ['undying', 'андаинг', 'зомби', 'томба', 'гроб'],
  'Ursa': ['ursa', 'урса', 'медведь', 'лапы'],
  'Vengeful Spirit': ['vengeful spirit', 'венга', 'свап'],
  'Venomancer': ['venomancer', 'веномансер', 'веник', 'яд', 'змеи'],
  'Viper': ['viper', 'вайпер', 'летун'],
  'Visage': ['visage', 'визаж', 'птицы', 'горгульи'],
  'Void Spirit': ['void spirit', 'войд спирит', 'инай'],
  'Warlock': ['warlock', 'варлок', 'голем'],
  'Weaver': ['weaver', 'вивер', 'жук'],
  'Windranger': ['windranger', 'вр', 'виндра', 'врка', 'рыжая', 'wr'],
  'Winter Wyvern': ['winter wyvern', 'виверна', 'зима'],
  'Witch Doctor': ['witch doctor', 'вд', 'витч доктор', 'каска', 'маледикт', 'wd'],
  'Wraith King': ['wraith king', 'вк', 'wk', 'папич', 'леорик', 'король', 'скелет'],
  'Zeus': ['zeus', 'зевс', 'бог', 'гром', 'молния']
};

const ITEM_ALIASES = {
  'Blink Dagger': ['блинк', 'кинжал', 'дагор', 'blink dagger', 'blink'],
  'Dagon': ['дагон', 'красный луч', 'dagon'],
  'Hex': ['хекс', 'курица', 'свинтус', 'hex', 'sheepstick'],
  'Force Staff': ['форс', 'толкалка', 'force staff', 'force'],
  'Euls / Wind Waker': ['еул', 'винд вейкер', 'вихрь', 'ветра', 'euls', 'wind waker'],
  'Blade Mail': ['блейд мейл', 'бм', 'возвратка', 'blade mail', 'bm'],
  'Aegis': ['аегис', 'крест', 'щит бессмертия', 'aegis'],
  'Bottle': ['боттл', 'бутылка', 'bottle'],
  'Aghanim Aura': ['аганим', 'скипетр', 'аура', 'aghanim'],
  'Radiance': ['radiance', 'радианс', 'радик', 'горение'],
  'Shivas Guard': ['shiva', 'шива', 'мороз', 'shivas guard'],
  'Ethereal': ['ethereal', 'этериал', 'эзер', 'призрак'],
  'Maelstrom / Mjollnir': ['молнии', 'мьелнир', 'маелштром', 'малстром', 'maelstrom', 'mjollnir'],
  'Rod of Atos / Gleipnir': ['атос', 'глейпнир', 'руты', 'сетка', 'atos', 'gleipnir'],
  'Mekanism': ['мека', 'меканизм', 'хил', 'mekanism'],
  'Phase Boots': ['фейзы', 'ботинки', 'сапог', 'phase boots'],
  'Phylactery / Khanda': ['филактерия', 'кханда', 'канда', 'phylactery', 'khanda'],
  'Teleport': ['тп', 'телепорт', 'свиток', 'teleport'],
  'Runes': ['руны', 'руна', 'бутыль', 'runes'],
  'Creep Deny': ['денай', 'восклицательный', 'знак', 'deny'],
  'Fountain Regen': ['фонтан', 'реген', 'fountain'],
  'Lvl Up': ['левел ап', 'лвл ап', 'уровень', 'lvl up', 'level up'],
  'TI Effects': ['ти', 'инт', 'интернешнл', 'ti', 'ti effects'],
  'Effect Packs': ['эффекты', 'пак эффектов', 'эффект', 'particles', 'fx'],
  'Couriers': ['курьеры', 'курьер', 'курица', 'осел', 'птица', 'courier', 'couriers'],
  'Creeps': ['крипы', 'крип', 'крипасики', 'пачки', 'мегакрипы', 'creeps', 'creep'],
  'Wards': ['варды', 'вард', 'вардик', 'глаз', 'wards', 'ward'],
  'Terrain': ['ландшафт', 'террейн', 'карта', 'земля', 'terrain', 'terrains'],
  'Trees': ['деревья', 'дерево', 'елки', 'ёлки', 'trees', 'tree'],
  'River': ['река', 'вода', 'кровь', 'river'],
  'HUD': ['худ', 'интерфейс', 'панель', 'hud', 'huds'],
  'Fonts': ['шрифт', 'шрифты', 'буквы', 'текст', 'font', 'fonts'],
  'Backgrounds': ['фон', 'загрузка', 'загрузочный экран', 'обои', 'background', 'backgrounds'],
  'Versus Screens': ['версус', 'экран противостояния', 'versus', 'versus screens'],
  'Shaders': ['шейдеры', 'шейдер', 'графика', 'визуал', 'shaders'],
  'Announcer': ['озвучка', 'диктор', 'голос', 'анонсер', 'комментатор', 'мегакилл', 'announcer', 'mega kill', 'voice'],
  'High Five': ['дай пять', 'хай файв', 'хайфайв', 'high five', 'highfive', 'ладонь', 'шлепок', 'рука'],
  'Attack FX': ['эффекты атаки', 'атака', 'снаряд', 'снаряды', 'выстрел', 'удар', 'крит', 'attack', 'projectile', 'attack fx']
};

const CATEGORY_NAMES_RU = {
  'heroes': ['герои', 'персонажи', 'hero', 'heroes'],
  'hero-items': ['предметы', 'артефакты', 'вещи', 'items', 'item'],
  'high-five': ['high five', 'дай пять', 'хай файв', 'хайфайв', 'ладонь', 'шлепок', 'high-five'],
  'attack-fx': ['эффекты атаки', 'атака', 'снаряды', 'крит', 'удар', 'attack-fx', 'attack fx', 'attack'],
  'herofx': ['эффекты', 'партикли', 'скиллы', 'fx', 'effects'],
  'hero-sounds': ['звуки героев', 'голоса', 'реплики', 'sounds', 'sound'],
  'mega-kill': ['мегакилл', 'мега-килл', 'диктор', 'анонсер', 'mega kill', 'mega-kill', 'announcer'],
  'couriers': ['курьеры', 'курьер', 'курица', 'couriers', 'courier'],
  'wards': ['варды', 'вард', 'wards', 'ward'],
  'creeps': ['крипы', 'крип', 'creeps', 'creep'],
  'terrains': ['ландшафт', 'террейн', 'карта', 'погода', 'terrain', 'terrains'],
  'river': ['река', 'вода', 'river'],
  'trees': ['деревья', 'дерево', 'trees', 'tree'],
  'versus-screens': ['версус', 'экран версус', 'versus-screens', 'versus'],
  'backgrounds': ['фон', 'загрузка', 'обои', 'backgrounds', 'background'],
  'huds': ['худ', 'интерфейс', 'панель', 'huds', 'hud'],
  'fonts': ['шрифты', 'шрифт', 'fonts', 'font'],
  'shaders': ['шейдеры', 'шейдер', 'shaders', 'shader'],
  'packs': ['паки', 'пак', 'набор', 'комплект', 'packs', 'pack'],
  'creep-deny': ['денай', 'крип денай', 'deny', 'creep-deny', 'creep deny'],
  'pedestal': ['пьедестал', 'стойка', 'подиум', 'pedestal', 'pedestals'],
  'parts': ['части', 'элементы', 'интерфейс', 'кнопки', 'parts', 'minimap', 'scoreboard', 'панели'],
  'ranks': ['ранги', 'медали', 'звания', 'ранг', 'ranks', 'medals', 'rank'],
  'sounds': ['звуки', 'звуковые моды', 'озвучка', 'sounds', 'sound']
};

function getHeroAliases(heroName) {
  if (!heroName) return null;
  if (HERO_ALIASES[heroName]) return HERO_ALIASES[heroName];
  const norm = heroName.toLowerCase().replace(/['\s_\-\.]/g, '');
  for (const [k, list] of Object.entries(HERO_ALIASES)) {
    if (k.toLowerCase().replace(/['\s_\-\.]/g, '') === norm) {
      return list;
    }
  }
  return null;
}

function getItemAliases(itemName) {
  if (!itemName) return null;
  if (ITEM_ALIASES[itemName]) return ITEM_ALIASES[itemName];
  const norm = itemName.toLowerCase().replace(/['\s_\-\.\/]/g, '');
  for (const [k, list] of Object.entries(ITEM_ALIASES)) {
    if (k.toLowerCase().replace(/['\s_\-\.\/]/g, '') === norm) {
      return list;
    }
  }
  return null;
}

function matchesSingleTerm(mod, term) {
  if (!term || !mod) return true;
  const title = String(mod.title || '').toLowerCase();
  const hero = String(mod.hero || '').toLowerCase();
  const author = String(mod.author || '').toLowerCase();
  const cat = String(mod.category || '').toLowerCase();

  // 1. Direct substring in title, hero, author, category
  if (title.includes(term) || hero.includes(term) || author.includes(term) || cat.includes(term)) {
    return true;
  }

  // 2. Russian Category name match
  const catList = CATEGORY_NAMES_RU[mod.category];
  if (catList && catList.some(c => c.includes(term) || term.includes(c))) {
    return true;
  }

  // 3. Hero aliases match
  const hKey = mod.hero;
  if (hKey) {
    const hAliases = getHeroAliases(hKey);
    if (hAliases && hAliases.some(a => a.includes(term) || term.includes(a))) {
      return true;
    }
  }

  // 4. Item / Entity aliases match
  if (hKey) {
    const iAliases = getItemAliases(hKey);
    if (iAliases && iAliases.some(a => a.includes(term) || term.includes(a))) {
      return true;
    }
  }

  // 5. Keyword mappings (arcana, immortal, persona, hook, blade, set)
  if (term.includes('аркан') && title.includes('arcana')) return true;
  if (term.includes('иммортал') && title.includes('immortal')) return true;
  if ((term.includes('персон') || term.includes('личност')) && title.includes('persona')) return true;
  if (term.includes('хук') && title.includes('hook')) return true;
  if (term.includes('сет') && title.includes('set')) return true;
  if ((term.includes('меч') || term.includes('клинок')) && (title.includes('sword') || title.includes('blade'))) return true;

  return false;
}

function matchesSearchQuery(mod, query) {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  if (!q) return true;

  const words = q.split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return matchesSingleTerm(mod, words[0] || q);
  }
  return words.every(word => matchesSingleTerm(mod, word));
}

// Background Customizer Configuration
let bgConfig = JSON.parse(localStorage.getItem('dotamod_bg') || JSON.stringify({
  enabled: false,
  url: '',
  dim: 75,
  blur: 4
}));

// Authentic Character Voice Sets (No generic duplicate sounds!)
const CHARACTER_VOICE_SETS = {
  "glados": {
    "name": "GLaDOS (Portal)",
    "icon": "fa-robot",
    "lines": [
      {
        "id": "glados_welcome",
        "title": "Приветствие",
        "text": "Welcome to Dota.",
        "audio": "audio/announcers/glados/glados_welcome.mp3",
        "localAudio": "audio/announcers/glados/glados_welcome.mp3"
      },
      {
        "id": "glados_first",
        "title": "First Blood",
        "text": "First blood.",
        "audio": "audio/announcers/glados/glados_first.mp3",
        "localAudio": "audio/announcers/glados/glados_first.mp3"
      },
      {
        "id": "glados_multi",
        "title": "Серия убийств",
        "text": "Double kill.",
        "audio": "audio/announcers/glados/glados_multi.mp3",
        "localAudio": "audio/announcers/glados/glados_multi.mp3"
      },
      {
        "id": "glados_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Mega kill.",
        "audio": "audio/announcers/glados/glados_rampage.mp3",
        "localAudio": "audio/announcers/glados/glados_rampage.mp3"
      },
      {
        "id": "glados_tower",
        "title": "Событие на карте",
        "text": "Your top tower is, well let's be honest, doomed.",
        "audio": "audio/announcers/glados/glados_tower.mp3",
        "localAudio": "audio/announcers/glados/glados_tower.mp3"
      },
      {
        "id": "glados_victory",
        "title": "Финал матча",
        "text": "Radiant victory.",
        "audio": "audio/announcers/glados/glados_victory.mp3",
        "localAudio": "audio/announcers/glados/glados_victory.mp3"
      }
    ]
  },
  "rick": {
    "name": "Rick & Morty",
    "icon": "fa-flask",
    "lines": [
      {
        "id": "rick_welcome",
        "title": "Приветствие",
        "text": "Your turn to pick, bro.",
        "audio": "audio/announcers/rick/rick_welcome.mp3",
        "localAudio": "audio/announcers/rick/rick_welcome.mp3"
      },
      {
        "id": "rick_first",
        "title": "First Blood",
        "text": "Oh! First blood!",
        "audio": "audio/announcers/rick/rick_first.mp3",
        "localAudio": "audio/announcers/rick/rick_first.mp3"
      },
      {
        "id": "rick_multi",
        "title": "Серия убийств",
        "text": "Ugh, d-d-double kill.",
        "audio": "audio/announcers/rick/rick_multi.mp3",
        "localAudio": "audio/announcers/rick/rick_multi.mp3"
      },
      {
        "id": "rick_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "It's a rampage! Rick! Rick! Ruh! Oohh! Morty! Morty! Take it easy buddy. Take it easy.",
        "audio": "audio/announcers/rick/rick_rampage.mp3",
        "localAudio": "audio/announcers/rick/rick_rampage.mp3"
      },
      {
        "id": "rick_tower",
        "title": "Событие на карте",
        "text": "Radiant's top tower has fallen.",
        "audio": "audio/announcers/rick/rick_tower.mp3",
        "localAudio": "audio/announcers/rick/rick_tower.mp3"
      },
      {
        "id": "rick_victory",
        "title": "Финал матча",
        "text": "What are we here for again? Trying to help these guys win a game? Right, yeah, okay.",
        "audio": "audio/announcers/rick/rick_victory.mp3",
        "localAudio": "audio/announcers/rick/rick_victory.mp3"
      }
    ]
  },
  "darkest": {
    "name": "Darkest Dungeon Ancestor",
    "icon": "fa-skull",
    "lines": [
      {
        "id": "darkest_welcome",
        "title": "Приветствие",
        "text": "Ah mortal, welcome.",
        "audio": "audio/announcers/darkest/darkest_welcome.mp3",
        "localAudio": "audio/announcers/darkest/darkest_welcome.mp3"
      },
      {
        "id": "darkest_first",
        "title": "First Blood",
        "text": "The cost of preparedness, measured now in gold, later in blood.",
        "audio": "audio/announcers/darkest/darkest_first.mp3",
        "localAudio": "audio/announcers/darkest/darkest_first.mp3"
      },
      {
        "id": "darkest_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "You have allowed your top barracks to be destroyed.",
        "audio": "audio/announcers/darkest/darkest_rampage.mp3",
        "localAudio": "audio/announcers/darkest/darkest_rampage.mp3"
      },
      {
        "id": "darkest_tower",
        "title": "Событие на карте",
        "text": "Your top tower has fallen!",
        "audio": "audio/announcers/darkest/darkest_tower.mp3",
        "localAudio": "audio/announcers/darkest/darkest_tower.mp3"
      },
      {
        "id": "darkest_victory",
        "title": "Финал матча",
        "text": "Radiant's bolt maneuvers have gained them victory over Roshan!",
        "audio": "audio/announcers/darkest/darkest_victory.mp3",
        "localAudio": "audio/announcers/darkest/darkest_victory.mp3"
      },
      {
        "id": "darkest_line_6",
        "title": "Salutations.",
        "text": "Salutations.",
        "audio": "audio/announcers/darkest/darkest_line_6.mp3",
        "localAudio": "audio/announcers/darkest/darkest_line_6.mp3"
      }
    ]
  },
  "stanley": {
    "name": "The Stanley Parable",
    "icon": "fa-door-open",
    "lines": [
      {
        "id": "stanley_welcome",
        "title": "Приветствие",
        "text": "Welcome! Once again! To DIGITAL SPORTS!",
        "audio": "audio/announcers/stanley/stanley_welcome.mp3",
        "localAudio": "audio/announcers/stanley/stanley_welcome.mp3"
      },
      {
        "id": "stanley_first",
        "title": "First Blood",
        "text": "First blood!",
        "audio": "audio/announcers/stanley/stanley_first.mp3",
        "localAudio": "audio/announcers/stanley/stanley_first.mp3"
      },
      {
        "id": "stanley_multi",
        "title": "Серия убийств",
        "text": "Double kill!",
        "audio": "audio/announcers/stanley/stanley_multi.mp3",
        "localAudio": "audio/announcers/stanley/stanley_multi.mp3"
      },
      {
        "id": "stanley_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Rampage!",
        "audio": "audio/announcers/stanley/stanley_rampage.mp3",
        "localAudio": "audio/announcers/stanley/stanley_rampage.mp3"
      },
      {
        "id": "stanley_tower",
        "title": "Событие на карте",
        "text": "Your top tower has been destroyed.",
        "audio": "audio/announcers/stanley/stanley_tower.mp3",
        "localAudio": "audio/announcers/stanley/stanley_tower.mp3"
      },
      {
        "id": "stanley_victory",
        "title": "Финал матча",
        "text": "100 kills!!! Congratulations, but remember that the real victory comes from within. Can't you feel it? Yes, you truly must be a happier person now.",
        "audio": "audio/announcers/stanley/stanley_victory.mp3",
        "localAudio": "audio/announcers/stanley/stanley_victory.mp3"
      }
    ]
  },
  "axe": {
    "name": "Axe",
    "icon": "fa-hand-fist",
    "lines": [
      {
        "id": "axe_welcome",
        "title": "Приветствие",
        "text": "Your turn to pick.",
        "audio": "audio/announcers/axe/axe_welcome.mp3",
        "localAudio": "audio/announcers/axe/axe_welcome.mp3"
      },
      {
        "id": "axe_first",
        "title": "First Blood",
        "text": "First blood!",
        "audio": "audio/announcers/axe/axe_first.mp3",
        "localAudio": "audio/announcers/axe/axe_first.mp3"
      },
      {
        "id": "axe_multi",
        "title": "Серия убийств",
        "text": "Double kill!",
        "audio": "audio/announcers/axe/axe_multi.mp3",
        "localAudio": "audio/announcers/axe/axe_multi.mp3"
      },
      {
        "id": "axe_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Mega kill!",
        "audio": "audio/announcers/axe/axe_rampage.mp3",
        "localAudio": "audio/announcers/axe/axe_rampage.mp3"
      },
      {
        "id": "axe_tower",
        "title": "Событие на карте",
        "text": "Your top tower has fallen.",
        "audio": "audio/announcers/axe/axe_tower.mp3",
        "localAudio": "audio/announcers/axe/axe_tower.mp3"
      },
      {
        "id": "axe_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/axe/axe_victory.mp3",
        "localAudio": "audio/announcers/axe/axe_victory.mp3"
      }
    ]
  },
  "bristle": {
    "name": "Bristleback",
    "icon": "fa-shield-halved",
    "lines": [
      {
        "id": "bristle_welcome",
        "title": "Приветствие",
        "text": "Welcome to Dota.",
        "audio": "audio/announcers/bristle/bristle_welcome.mp3",
        "localAudio": "audio/announcers/bristle/bristle_welcome.mp3"
      },
      {
        "id": "bristle_first",
        "title": "First Blood",
        "text": "First blood!",
        "audio": "audio/announcers/bristle/bristle_first.mp3",
        "localAudio": "audio/announcers/bristle/bristle_first.mp3"
      },
      {
        "id": "bristle_multi",
        "title": "Серия убийств",
        "text": "Double kill!",
        "audio": "audio/announcers/bristle/bristle_multi.mp3",
        "localAudio": "audio/announcers/bristle/bristle_multi.mp3"
      },
      {
        "id": "bristle_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Rampage!",
        "audio": "audio/announcers/bristle/bristle_rampage.mp3",
        "localAudio": "audio/announcers/bristle/bristle_rampage.mp3"
      },
      {
        "id": "bristle_tower",
        "title": "Событие на карте",
        "text": "Your top tower has fallen!",
        "audio": "audio/announcers/bristle/bristle_tower.mp3",
        "localAudio": "audio/announcers/bristle/bristle_tower.mp3"
      },
      {
        "id": "bristle_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/bristle/bristle_victory.mp3",
        "localAudio": "audio/announcers/bristle/bristle_victory.mp3"
      }
    ]
  },
  "clock": {
    "name": "Clockwerk",
    "icon": "fa-gear",
    "lines": [
      {
        "id": "clock_welcome",
        "title": "Приветствие",
        "text": "Your turn to pick.",
        "audio": "audio/announcers/clock/clock_welcome.mp3",
        "localAudio": "audio/announcers/clock/clock_welcome.mp3"
      },
      {
        "id": "clock_first",
        "title": "First Blood",
        "text": "First blood!",
        "audio": "audio/announcers/clock/clock_first.mp3",
        "localAudio": "audio/announcers/clock/clock_first.mp3"
      },
      {
        "id": "clock_multi",
        "title": "Серия убийств",
        "text": "Double kill!",
        "audio": "audio/announcers/clock/clock_multi.mp3",
        "localAudio": "audio/announcers/clock/clock_multi.mp3"
      },
      {
        "id": "clock_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Mega kill!",
        "audio": "audio/announcers/clock/clock_rampage.mp3",
        "localAudio": "audio/announcers/clock/clock_rampage.mp3"
      },
      {
        "id": "clock_tower",
        "title": "Событие на карте",
        "text": "Your top tower has fallen.",
        "audio": "audio/announcers/clock/clock_tower.mp3",
        "localAudio": "audio/announcers/clock/clock_tower.mp3"
      },
      {
        "id": "clock_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/clock/clock_victory.mp3",
        "localAudio": "audio/announcers/clock/clock_victory.mp3"
      }
    ]
  },
  "cm": {
    "name": "Crystal Maiden",
    "icon": "fa-snowflake",
    "lines": [
      {
        "id": "cm_welcome",
        "title": "Приветствие",
        "text": "Welcome to Dota.",
        "audio": "audio/announcers/cm/cm_welcome.mp3",
        "localAudio": "audio/announcers/cm/cm_welcome.mp3"
      },
      {
        "id": "cm_first",
        "title": "First Blood",
        "text": "First blood!",
        "audio": "audio/announcers/cm/cm_first.mp3",
        "localAudio": "audio/announcers/cm/cm_first.mp3"
      },
      {
        "id": "cm_multi",
        "title": "Серия убийств",
        "text": "Double kill!",
        "audio": "audio/announcers/cm/cm_multi.mp3",
        "localAudio": "audio/announcers/cm/cm_multi.mp3"
      },
      {
        "id": "cm_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Rampage!",
        "audio": "audio/announcers/cm/cm_rampage.mp3",
        "localAudio": "audio/announcers/cm/cm_rampage.mp3"
      },
      {
        "id": "cm_tower",
        "title": "Событие на карте",
        "text": "Your top tower has fallen.",
        "audio": "audio/announcers/cm/cm_tower.mp3",
        "localAudio": "audio/announcers/cm/cm_tower.mp3"
      },
      {
        "id": "cm_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/cm/cm_victory.mp3",
        "localAudio": "audio/announcers/cm/cm_victory.mp3"
      }
    ]
  },
  "lina": {
    "name": "Lina",
    "icon": "fa-fire",
    "lines": [
      {
        "id": "lina_welcome",
        "title": "Приветствие",
        "text": "Welcome to Dota.",
        "audio": "audio/announcers/lina/lina_welcome.mp3",
        "localAudio": "audio/announcers/lina/lina_welcome.mp3"
      },
      {
        "id": "lina_first",
        "title": "First Blood",
        "text": "First Blood!",
        "audio": "audio/announcers/lina/lina_first.mp3",
        "localAudio": "audio/announcers/lina/lina_first.mp3"
      },
      {
        "id": "lina_multi",
        "title": "Серия убийств",
        "text": "Double Kill!",
        "audio": "audio/announcers/lina/lina_multi.mp3",
        "localAudio": "audio/announcers/lina/lina_multi.mp3"
      },
      {
        "id": "lina_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Mega kill!",
        "audio": "audio/announcers/lina/lina_rampage.mp3",
        "localAudio": "audio/announcers/lina/lina_rampage.mp3"
      },
      {
        "id": "lina_tower",
        "title": "Событие на карте",
        "text": "Your top tower's gone down in flames.",
        "audio": "audio/announcers/lina/lina_tower.mp3",
        "localAudio": "audio/announcers/lina/lina_tower.mp3"
      },
      {
        "id": "lina_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/lina/lina_victory.mp3",
        "localAudio": "audio/announcers/lina/lina_victory.mp3"
      }
    ]
  },
  "jugg": {
    "name": "Juggernaut",
    "icon": "fa-mask",
    "lines": [
      {
        "id": "jugg_welcome",
        "title": "Приветствие",
        "text": "Your turn to pick.",
        "audio": "audio/announcers/jugg/jugg_welcome.mp3",
        "localAudio": "audio/announcers/jugg/jugg_welcome.mp3"
      },
      {
        "id": "jugg_first",
        "title": "First Blood",
        "text": "First blood!",
        "audio": "audio/announcers/jugg/jugg_first.mp3",
        "localAudio": "audio/announcers/jugg/jugg_first.mp3"
      },
      {
        "id": "jugg_multi",
        "title": "Серия убийств",
        "text": "Double kill!",
        "audio": "audio/announcers/jugg/jugg_multi.mp3",
        "localAudio": "audio/announcers/jugg/jugg_multi.mp3"
      },
      {
        "id": "jugg_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Mega kill!",
        "audio": "audio/announcers/jugg/jugg_rampage.mp3",
        "localAudio": "audio/announcers/jugg/jugg_rampage.mp3"
      },
      {
        "id": "jugg_tower",
        "title": "Событие на карте",
        "text": "Your top tower has fallen.",
        "audio": "audio/announcers/jugg/jugg_tower.mp3",
        "localAudio": "audio/announcers/jugg/jugg_tower.mp3"
      },
      {
        "id": "jugg_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/jugg/jugg_victory.mp3",
        "localAudio": "audio/announcers/jugg/jugg_victory.mp3"
      }
    ]
  },
  "meepo": {
    "name": "Meepo",
    "icon": "fa-users",
    "lines": [
      {
        "id": "meepo_welcome",
        "title": "Приветствие",
        "text": "Welcome to Dota.",
        "audio": "audio/announcers/meepo/meepo_welcome.mp3",
        "localAudio": "audio/announcers/meepo/meepo_welcome.mp3"
      },
      {
        "id": "meepo_first",
        "title": "First Blood",
        "text": "First blood!",
        "audio": "audio/announcers/meepo/meepo_first.mp3",
        "localAudio": "audio/announcers/meepo/meepo_first.mp3"
      },
      {
        "id": "meepo_multi",
        "title": "Серия убийств",
        "text": "Double kill!",
        "audio": "audio/announcers/meepo/meepo_multi.mp3",
        "localAudio": "audio/announcers/meepo/meepo_multi.mp3"
      },
      {
        "id": "meepo_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Rampage!",
        "audio": "audio/announcers/meepo/meepo_rampage.mp3",
        "localAudio": "audio/announcers/meepo/meepo_rampage.mp3"
      },
      {
        "id": "meepo_tower",
        "title": "Событие на карте",
        "text": "Your top tower has fallen.",
        "audio": "audio/announcers/meepo/meepo_tower.mp3",
        "localAudio": "audio/announcers/meepo/meepo_tower.mp3"
      },
      {
        "id": "meepo_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/meepo/meepo_victory.mp3",
        "localAudio": "audio/announcers/meepo/meepo_victory.mp3"
      }
    ]
  },
  "storm": {
    "name": "Storm Spirit",
    "icon": "fa-bolt",
    "lines": [
      {
        "id": "storm_welcome",
        "title": "Приветствие",
        "text": "Your turn to pick.",
        "audio": "audio/announcers/storm/storm_welcome.mp3",
        "localAudio": "audio/announcers/storm/storm_welcome.mp3"
      },
      {
        "id": "storm_first",
        "title": "First Blood",
        "text": "First blood!",
        "audio": "audio/announcers/storm/storm_first.mp3",
        "localAudio": "audio/announcers/storm/storm_first.mp3"
      },
      {
        "id": "storm_multi",
        "title": "Серия убийств",
        "text": "Double kill!",
        "audio": "audio/announcers/storm/storm_multi.mp3",
        "localAudio": "audio/announcers/storm/storm_multi.mp3"
      },
      {
        "id": "storm_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Mega kill!",
        "audio": "audio/announcers/storm/storm_rampage.mp3",
        "localAudio": "audio/announcers/storm/storm_rampage.mp3"
      },
      {
        "id": "storm_tower",
        "title": "Событие на карте",
        "text": "Your top tower has fallen.",
        "audio": "audio/announcers/storm/storm_tower.mp3",
        "localAudio": "audio/announcers/storm/storm_tower.mp3"
      },
      {
        "id": "storm_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/storm/storm_victory.mp3",
        "localAudio": "audio/announcers/storm/storm_victory.mp3"
      }
    ]
  },
  "techies": {
    "name": "Techies",
    "icon": "fa-bomb",
    "lines": [
      {
        "id": "techies_welcome",
        "title": "Приветствие",
        "text": "Welcome back.",
        "audio": "audio/announcers/techies/techies_welcome.mp3",
        "localAudio": "audio/announcers/techies/techies_welcome.mp3"
      },
      {
        "id": "techies_first",
        "title": "First Blood",
        "text": "First blood.",
        "audio": "audio/announcers/techies/techies_first.mp3",
        "localAudio": "audio/announcers/techies/techies_first.mp3"
      },
      {
        "id": "techies_multi",
        "title": "Серия убийств",
        "text": "Double kill.",
        "audio": "audio/announcers/techies/techies_multi.mp3",
        "localAudio": "audio/announcers/techies/techies_multi.mp3"
      },
      {
        "id": "techies_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Mega kill.",
        "audio": "audio/announcers/techies/techies_rampage.mp3",
        "localAudio": "audio/announcers/techies/techies_rampage.mp3"
      },
      {
        "id": "techies_tower",
        "title": "Событие на карте",
        "text": "Radiant's top tower has fallen.",
        "audio": "audio/announcers/techies/techies_tower.mp3",
        "localAudio": "audio/announcers/techies/techies_tower.mp3"
      },
      {
        "id": "techies_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/techies/techies_victory.mp3",
        "localAudio": "audio/announcers/techies/techies_victory.mp3"
      }
    ]
  },
  "pyrion": {
    "name": "Pyrion Flax",
    "icon": "fa-microphone-lines",
    "lines": [
      {
        "id": "pyrion_welcome",
        "title": "Приветствие",
        "text": "Willkommen, bienvenue, welcome to Dota 2.",
        "audio": "audio/announcers/pyrion/pyrion_welcome.mp3",
        "localAudio": "audio/announcers/pyrion/pyrion_welcome.mp3"
      },
      {
        "id": "pyrion_first",
        "title": "First Blood",
        "text": "Rambo style. First blood!",
        "audio": "audio/announcers/pyrion/pyrion_first.mp3",
        "localAudio": "audio/announcers/pyrion/pyrion_first.mp3"
      },
      {
        "id": "pyrion_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "(harmonica) Godlike!",
        "audio": "audio/announcers/pyrion/pyrion_rampage.mp3",
        "localAudio": "audio/announcers/pyrion/pyrion_rampage.mp3"
      },
      {
        "id": "pyrion_tower",
        "title": "Событие на карте",
        "text": "Radiant structures are fortified.",
        "audio": "audio/announcers/pyrion/pyrion_tower.mp3",
        "localAudio": "audio/announcers/pyrion/pyrion_tower.mp3"
      },
      {
        "id": "pyrion_victory",
        "title": "Финал матча",
        "text": "Radiant victory!",
        "audio": "audio/announcers/pyrion/pyrion_victory.mp3",
        "localAudio": "audio/announcers/pyrion/pyrion_victory.mp3"
      },
      {
        "id": "pyrion_line_6",
        "title": "Um, is this thing work...",
        "text": "Um, is this thing working?",
        "audio": "audio/announcers/pyrion/pyrion_line_6.mp3",
        "localAudio": "audio/announcers/pyrion/pyrion_line_6.mp3"
      }
    ]
  },
  "deusex": {
    "name": "Deus Ex",
    "icon": "fa-glasses",
    "lines": [
      {
        "id": "deusex_welcome",
        "title": "Приветствие",
        "text": "Welcome to Dota.",
        "audio": "audio/announcers/deusex/deusex_welcome.mp3",
        "localAudio": "audio/announcers/deusex/deusex_welcome.mp3"
      },
      {
        "id": "deusex_first",
        "title": "First Blood",
        "text": "First blood.",
        "audio": "audio/announcers/deusex/deusex_first.mp3",
        "localAudio": "audio/announcers/deusex/deusex_first.mp3"
      },
      {
        "id": "deusex_multi",
        "title": "Серия убийств",
        "text": "Double kill.",
        "audio": "audio/announcers/deusex/deusex_multi.mp3",
        "localAudio": "audio/announcers/deusex/deusex_multi.mp3"
      },
      {
        "id": "deusex_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Rampage.",
        "audio": "audio/announcers/deusex/deusex_rampage.mp3",
        "localAudio": "audio/announcers/deusex/deusex_rampage.mp3"
      },
      {
        "id": "deusex_tower",
        "title": "Событие на карте",
        "text": "Your top tower's gone.",
        "audio": "audio/announcers/deusex/deusex_tower.mp3",
        "localAudio": "audio/announcers/deusex/deusex_tower.mp3"
      },
      {
        "id": "deusex_victory",
        "title": "Финал матча",
        "text": "Victory.",
        "audio": "audio/announcers/deusex/deusex_victory.mp3",
        "localAudio": "audio/announcers/deusex/deusex_victory.mp3"
      }
    ]
  },
  "fallout": {
    "name": "Fallout 4 (Mister Handy)",
    "icon": "fa-radiation",
    "lines": [
      {
        "id": "fallout_welcome",
        "title": "Приветствие",
        "text": "Good morning!",
        "audio": "audio/announcers/fallout/fallout_welcome.mp3",
        "localAudio": "audio/announcers/fallout/fallout_welcome.mp3"
      },
      {
        "id": "fallout_first",
        "title": "First Blood",
        "text": "First blood!",
        "audio": "audio/announcers/fallout/fallout_first.mp3",
        "localAudio": "audio/announcers/fallout/fallout_first.mp3"
      },
      {
        "id": "fallout_multi",
        "title": "Серия убийств",
        "text": "Double kill!",
        "audio": "audio/announcers/fallout/fallout_multi.mp3",
        "localAudio": "audio/announcers/fallout/fallout_multi.mp3"
      },
      {
        "id": "fallout_rampage",
        "title": "Rampage / Mega-Kill",
        "text": "Mega kill!",
        "audio": "audio/announcers/fallout/fallout_rampage.mp3",
        "localAudio": "audio/announcers/fallout/fallout_rampage.mp3"
      },
      {
        "id": "fallout_tower",
        "title": "Событие на карте",
        "text": "Your top tower has fallen.",
        "audio": "audio/announcers/fallout/fallout_tower.mp3",
        "localAudio": "audio/announcers/fallout/fallout_tower.mp3"
      },
      {
        "id": "fallout_victory",
        "title": "Финал матча",
        "text": "Victory!",
        "audio": "audio/announcers/fallout/fallout_victory.mp3",
        "localAudio": "audio/announcers/fallout/fallout_victory.mp3"
      }
    ]
  },
  "cs": {
    "name": "Counter-Strike 1.6",
    "icon": "fa-crosshairs",
    "lines": [
      {
        "id": "cs_headshot",
        "title": "Headshot",
        "text": "Headshot!",
        "audio": "audio/headshot.wav"
      },
      {
        "id": "cs_flawless",
        "title": "Flawless Victory",
        "text": "Flawless victory!",
        "audio": "audio/flawlessvictory.wav"
      },
      {
        "id": "cs_unstoppable",
        "title": "Unstoppable",
        "text": "Unstoppable!",
        "audio": "audio/unstoppable.wav"
      },
      {
        "id": "cs_godlike",
        "title": "Godlike",
        "text": "Godlike!",
        "audio": "audio/godlike.wav"
      }
    ]
  },
    "nedotrax": {
    "name": "Недотрах (Nedotrax Mega-Kill)",
    "icon": "fa-microphone-lines",
    "lines": [
      {
        "id": "nedo_full",
        "title": "Оригинальное превью",
        "text": "Nedotrax Mega-Kill Sound",
        "audio": "audio/announcers/Nedotrax-Mega-Kill.mp4",
        "localAudio": "audio/announcers/Nedotrax-Mega-Kill.mp4"
      }
    ]
  },
  "siega": {
    "name": "Siega Mega-Kill",
    "icon": "fa-headset",
    "lines": [
      {
        "id": "siega_full",
        "title": "Оригинальное превью",
        "text": "Siega Mega-Kill Sound",
        "audio": "audio/announcers/Siega-Mega-Kill.mp4",
        "localAudio": "audio/announcers/Siega-Mega-Kill.mp4"
      }
    ]
  },
  "stray228": {
    "name": "Stray228 Mega-Kill",
    "icon": "fa-crown",
    "lines": [
      {
        "id": "stray_full",
        "title": "Оригинальное превью",
        "text": "Stray228 Mega-Kill Sound",
        "audio": "audio/announcers/Stray228-Mega-Kill.mp4",
        "localAudio": "audio/announcers/Stray228-Mega-Kill.mp4"
      }
    ]
  },
  "umbrella": {
    "name": "Umbrella Mega-Kill",
    "icon": "fa-umbrella",
    "lines": [
      {
        "id": "umbrella_full",
        "title": "Оригинальное превью",
        "text": "Umbrella Mega-Kill Sound",
        "audio": "audio/announcers/Umbrella-Mega-Kill.mp4",
        "localAudio": "audio/announcers/Umbrella-Mega-Kill.mp4"
      }
    ]
  },
  "gaben": {
    "name": "Gabe Newell (Валв)",
    "icon": "fa-glasses",
    "lines": [
      {
        "id": "gaben_voice",
        "title": "Озвучка Гейба Ньюэлла",
        "text": "Gabe Newell Mega-Kill",
        "audio": "audio/announcers/gaben.mp3",
        "localAudio": "audio/announcers/gaben.mp3"
      }
    ]
  },
  "stariybog": {
    "name": "Старый Бог (Stariy Bog Mega-Kill)",
    "icon": "fa-fire",
    "lines": [
      {
        "id": "sb_voice_1",
        "title": "Озвучка Старый Бог",
        "text": "Старый Бог Mega-Kill",
        "audio": "audio/announcers/stariy_bog.mp3",
        "localAudio": "audio/announcers/stariy_bog.mp3"
      }
    ]
  },

  "quake": {
    "name": "Quake / Unreal Tournament",
    "icon": "fa-meteor",
    "lines": [
      {
        "id": "q_first",
        "title": "First Blood",
        "text": "First Blood!",
        "audio": "audio/firstblood.wav"
      },
      {
        "id": "q_double",
        "title": "Double Kill",
        "text": "Double Kill!",
        "audio": "audio/doublekill.wav"
      },
      {
        "id": "q_triple",
        "title": "Triple Kill",
        "text": "Triple Kill!",
        "audio": "audio/triplekill.wav"
      },
      {
        "id": "q_ultra",
        "title": "Ultra Kill",
        "text": "Ultra Kill!",
        "audio": "audio/ultrakill.wav"
      },
      {
        "id": "q_rampage",
        "title": "Rampage",
        "text": "Rampage!",
        "audio": "audio/rampage.wav"
      },
      {
        "id": "q_godlike",
        "title": "Godlike",
        "text": "Godlike!",
        "audio": "audio/godlike.wav"
      },
      {
        "id": "q_dom",
        "title": "Dominating",
        "text": "Dominating!",
        "audio": "audio/dominating.wav"
      },
      {
        "id": "q_holy",
        "title": "Holy Shit",
        "text": "Holy Shit!",
        "audio": "audio/holyshit.wav"
      }
    ]
  },
  "default": {
    "name": "Dota 2 Classic Announcer",
    "icon": "fa-bullhorn",
    "lines": [
      {
        "id": "def_prep",
        "title": "Prepare for Battle",
        "text": "Prepare for battle!",
        "audio": "audio/prepareforbattle.wav"
      },
      {
        "id": "def_first",
        "title": "First Blood",
        "text": "First Blood!",
        "audio": "audio/firstblood.wav"
      },
      {
        "id": "def_double",
        "title": "Double Kill",
        "text": "Double Kill!",
        "audio": "audio/doublekill.wav"
      },
      {
        "id": "def_triple",
        "title": "Triple Kill",
        "text": "Triple Kill!",
        "audio": "audio/triplekill.wav"
      },
      {
        "id": "def_ultra",
        "title": "Ultra Kill",
        "text": "Ultra Kill!",
        "audio": "audio/ultrakill.wav"
      },
      {
        "id": "def_rampage",
        "title": "Rampage",
        "text": "Rampage!",
        "audio": "audio/rampage.wav"
      },
      {
        "id": "def_mega",
        "title": "Mega Kill",
        "text": "Mega Kill!",
        "audio": "audio/megakill.wav"
      },
      {
        "id": "def_godlike",
        "title": "Godlike",
        "text": "Godlike!",
        "audio": "audio/godlike.wav"
      },
      {
        "id": "def_holy",
        "title": "Holy Shit",
        "text": "Holy Shit! Beyond Godlike!",
        "audio": "audio/holyshit.wav"
      }
    ]
  },
  "mk": {
    "name": "Monkey King",
    "icon": "fa-wand-magic-sparkles",
    "lines": [
      {
        "id": "mk_welcome",
        "title": "Появление",
        "text": "I'm ready.",
        "audio": "audio/announcers/mk/mk_welcome.mp3"
      },
      {
        "id": "mk_first",
        "title": "First Blood / Убийство",
        "text": "First Blood! Ha! I'm just getting started.",
        "audio": "audio/announcers/mk/mk_first.mp3"
      },
      {
        "id": "mk_multi",
        "title": "Серия убийств",
        "text": "Double Damage!",
        "audio": "audio/announcers/mk/mk_multi.mp3"
      },
      {
        "id": "mk_victory",
        "title": "Победа",
        "text": "I've outwitted gods. Smashing a glowing rock should be no problem.",
        "audio": "audio/announcers/mk/mk_victory.mp3"
      },
      {
        "id": "mk_line_5",
        "title": "Looks like I've got so...",
        "text": "Looks like I've got some new stories to tell.",
        "audio": "audio/announcers/mk/mk_line_5.mp3"
      },
      {
        "id": "mk_line_6",
        "title": "The King has arrived.",
        "text": "The King has arrived.",
        "audio": "audio/announcers/mk/mk_line_6.mp3"
      }
    ]
  },
  "darkwillow": {
    "name": "Dark Willow",
    "icon": "fa-feather-pointed",
    "lines": [
      {
        "id": "darkwillow_welcome",
        "title": "Появление",
        "text": "They're not ready for what I have planned...",
        "audio": "audio/announcers/darkwillow/darkwillow_welcome.mp3"
      },
      {
        "id": "darkwillow_first",
        "title": "First Blood / Убийство",
        "text": "A little mischief never killed anyone... well, you I guess.",
        "audio": "audio/announcers/darkwillow/darkwillow_first.mp3"
      },
      {
        "id": "darkwillow_multi",
        "title": "Серия убийств",
        "text": "Double Damage.",
        "audio": "audio/announcers/darkwillow/darkwillow_multi.mp3"
      },
      {
        "id": "darkwillow_rampage",
        "title": "Rampage / Ульт",
        "text": "You couldn't begin to understand the power I wield",
        "audio": "audio/announcers/darkwillow/darkwillow_rampage.mp3"
      },
      {
        "id": "darkwillow_victory",
        "title": "Победа",
        "text": "What, you thought you would win?",
        "audio": "audio/announcers/darkwillow/darkwillow_victory.mp3"
      },
      {
        "id": "darkwillow_line_6",
        "title": "Let's have some fun, s...",
        "text": "Let's have some fun, shall we...",
        "audio": "audio/announcers/darkwillow/darkwillow_line_6.mp3"
      }
    ]
  },
  "tusk": {
    "name": "Tusk",
    "icon": "fa-icicles",
    "lines": [
      {
        "id": "tusk_welcome",
        "title": "Появление",
        "text": "The Tusk is always ready for a fight!",
        "audio": "audio/announcers/tusk/tusk_welcome.mp3"
      },
      {
        "id": "tusk_first",
        "title": "First Blood / Убийство",
        "text": "First blood! And that is how we do things in the north! Ha ha ha ha ha!",
        "audio": "audio/announcers/tusk/tusk_first.mp3"
      },
      {
        "id": "tusk_multi",
        "title": "Серия убийств",
        "text": "Double Dragon Punch Punch!",
        "audio": "audio/announcers/tusk/tusk_multi.mp3"
      },
      {
        "id": "tusk_victory",
        "title": "Победа",
        "text": "Winterfreeze Punch!",
        "audio": "audio/announcers/tusk/tusk_victory.mp3"
      },
      {
        "id": "tusk_line_5",
        "title": "Tusk!",
        "text": "Tusk!",
        "audio": "audio/announcers/tusk/tusk_line_5.mp3"
      },
      {
        "id": "tusk_line_6",
        "title": "The Tusk!",
        "text": "The Tusk!",
        "audio": "audio/announcers/tusk/tusk_line_6.mp3"
      }
    ]
  },
  "kunkka": {
    "name": "Kunkka & Tidehunter",
    "icon": "fa-anchor",
    "lines": [
      {
        "id": "kunkka_welcome",
        "title": "Появление",
        "text": "I'm not ready.",
        "audio": "audio/announcers/kunkka/kunkka_welcome.mp3"
      },
      {
        "id": "kunkka_first",
        "title": "First Blood / Убийство",
        "text": "First blood, and here come the sharks.",
        "audio": "audio/announcers/kunkka/kunkka_first.mp3"
      },
      {
        "id": "kunkka_multi",
        "title": "Серия убийств",
        "text": "Double damage!",
        "audio": "audio/announcers/kunkka/kunkka_multi.mp3"
      },
      {
        "id": "kunkka_rampage",
        "title": "Rampage / Ульт",
        "text": "Wrecked!",
        "audio": "audio/announcers/kunkka/kunkka_rampage.mp3"
      },
      {
        "id": "kunkka_victory",
        "title": "Победа",
        "text": "No room to swing a cat in this crowd.",
        "audio": "audio/announcers/kunkka/kunkka_victory.mp3"
      },
      {
        "id": "kunkka_line_6",
        "title": "Kunkka is my name.",
        "text": "Kunkka is my name.",
        "audio": "audio/announcers/kunkka/kunkka_line_6.mp3"
      }
    ]
  },
  "fura": {
    "name": "Nature's Prophet",
    "icon": "fa-tree",
    "lines": [
      {
        "id": "fura_welcome",
        "title": "Появление",
        "text": "Is it spring already?",
        "audio": "audio/announcers/fura/fura_welcome.mp3"
      },
      {
        "id": "fura_first",
        "title": "First Blood / Убийство",
        "text": "First blood, hahahahaah!",
        "audio": "audio/announcers/fura/fura_first.mp3"
      },
      {
        "id": "fura_multi",
        "title": "Серия убийств",
        "text": "Double damage!",
        "audio": "audio/announcers/fura/fura_multi.mp3"
      },
      {
        "id": "fura_rampage",
        "title": "Rampage / Ульт",
        "text": "Power wells up from within.",
        "audio": "audio/announcers/fura/fura_rampage.mp3"
      },
      {
        "id": "fura_victory",
        "title": "Победа",
        "text": "Bottled for the long winter.",
        "audio": "audio/announcers/fura/fura_victory.mp3"
      },
      {
        "id": "fura_line_6",
        "title": "I speak for the trees….",
        "text": "I speak for the trees….",
        "audio": "audio/announcers/fura/fura_line_6.mp3"
      }
    ]
  }
};

let currentAudio = null;
let currentPlayingId = null;
let currentAudioVolume = 0.85;
let isLightboxZoomed = false;
let audioCtx = null;

// Fallback Cache
const FALLBACK_CACHE = [
  {
    id: "pudge-feast-immortal",
    title: "Pudge Feast Immortal",
    hero: "Pudge",
    hero_icon: "assets/heroes/pudge.png",
    attribute: "strength",
    category: "heroes",
    preview: "assets/previews/heroes/Pudge Feast Immortal.webp",
    download_url: "https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/files/heroes/Pudge%20Feast%20Immortal.zip",
    author: "Steam Workshop",
    file_size: "42 MB",
    has_effects: true,
    has_icons: true
  },
  {
    id: "invoker-dark-artistry",
    title: "Invoker Dark Artistry V4",
    hero: "Invoker",
    hero_icon: "assets/heroes/invoker.png",
    attribute: "intelligence",
    category: "heroes",
    preview: "assets/previews/heroes/Invoker Dark Artistry V4.webp",
    download_url: "https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/files/heroes/Invoker%20Dark%20Artistry%20V4.zip",
    author: "Arcana Workshop",
    file_size: "56 MB",
    has_effects: true,
    has_icons: true
  },
  {
    id: "shadow-fiend-728",
    title: "Shadow Fiend 7.28 Retro",
    hero: "Shadow Fiend",
    hero_icon: "assets/heroes/nevermore.png",
    attribute: "agility",
    category: "heroes",
    preview: "assets/previews/heroes/Shadow Fiend 7.28.webp",
    download_url: "https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/files/heroes/Shadow%20Fiend%207.28.zip",
    author: "ZxcCommunity",
    file_size: "18 MB",
    has_effects: true,
    has_icons: true
  },
  {
    id: "juggernaut-jagged-honor",
    title: "Juggernaut Jagged Honor",
    hero: "Juggernaut",
    hero_icon: "assets/heroes/juggernaut.png",
    attribute: "agility",
    category: "heroes",
    preview: "assets/previews/heroes/Juggernaut Jagged Honor.webp",
    download_url: "https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/files/heroes/Juggernaut%20Jagged%20Honor.zip",
    author: "Workshop Master",
    file_size: "29 MB",
    has_effects: true,
    has_icons: false
  },
  {
    id: "terrain-autumn-overhaul",
    title: "Autumn Sanctum Terrain",
    hero: "Terrain",
    hero_icon: "assets/heroes/dota2_logo_symbol.png",
    attribute: "other",
    category: "terrains",
    preview: "assets/previews/terrains/Autumn Terrain.webp",
    download_url: "https://raw.githubusercontent.com/h6rd/Dota2PornFxWeb/main/assets/files/terrains/Autumn%20Terrain.zip",
    author: "MapMaster",
    file_size: "95 MB",
    has_effects: true,
    has_icons: false
  }
];

// DOM
const modsContainer = document.getElementById('modsContainer');
const searchInput = document.getElementById('searchInput');
const totalModsCount = document.getElementById('totalModsCount');
const heroPillsContainer = document.getElementById('heroPillsContainer');
const heroPillsContainerMobile = document.getElementById('heroPillsContainerMobile');
const heroSearchInput = document.getElementById('heroSearchInput');
const favCountBadge = document.getElementById('favCountBadge');
const recentContainer = document.getElementById('recentContainer');

// Modals
const modModal = document.getElementById('modModal');
const guideModal = document.getElementById('guideModal');
const favModal = document.getElementById('favModal');

// Installed Mods Persistent State
window.installedModIdsSet = new Set();
window.installedModsList = [];

try {
  const savedInstalled = JSON.parse(localStorage.getItem('dotamod_installed_ids') || '[]');
  if (Array.isArray(savedInstalled)) {
    window.installedModIdsSet = new Set(savedInstalled);
  }
} catch (e) {}

window.isModInstalled = function(modOrId) {
  if (!modOrId) return false;
  const modId = typeof modOrId === 'string' ? modOrId : (modOrId.id || '');
  const modTitle = typeof modOrId === 'object' ? (modOrId.title || '') : '';
  const cleanTitle = (modTitle || '').toLowerCase().trim();

  if (modId && window.installedModIdsSet && window.installedModIdsSet.has(modId)) return true;
  if (modTitle && window.installedModIdsSet && window.installedModIdsSet.has(modTitle)) return true;

  if (Array.isArray(window.installedModsList) && window.installedModsList.length > 0) {
    return window.installedModsList.some(m => {
      if (m.id && m.id === modId) return true;
      const mClean = (m.cleanName || m.title || '').toLowerCase().trim();
      if (cleanTitle && (mClean === cleanTitle || cleanTitle.includes(mClean) || mClean.includes(cleanTitle))) return true;
      return false;
    });
  }
  return false;
};

window.refreshInstalledModsState = async function() {
  if (!window.dotaManager) return;
  try {
    if (!desktopDotaPath) {
      const res = await window.dotaManager.detectPath();
      if (res && res.success) desktopDotaPath = res.path;
    }
    if (desktopDotaPath) {
      const res = await window.dotaManager.listInstalledMods(desktopDotaPath);
      if (res && res.success && Array.isArray(res.mods)) {
        window.installedModsList = res.mods;
        window.installedModIdsSet.clear();
        res.mods.forEach(m => {
          if (m.id) window.installedModIdsSet.add(m.id);
          if (m.cleanName) window.installedModIdsSet.add(m.cleanName);
          if (m.title) window.installedModIdsSet.add(m.title);
        });
        try {
          localStorage.setItem('dotamod_installed_ids', JSON.stringify([...window.installedModIdsSet]));
        } catch (e) {}
        
        if (typeof window.refreshInstalledModsBadge === 'function') {
          window.refreshInstalledModsBadge(res.mods.length);
        }
        
        if (typeof window.updateInstalledModButtonsInDOM === 'function') {
          window.updateInstalledModButtonsInDOM();
        }
      }
    }
  } catch (e) {}
};

window.updateInstalledModButtonsInDOM = function() {
  const cards = document.querySelectorAll('.mod-card');
  cards.forEach(card => {
    const prevBtn = card.querySelector("button[onclick*='openModDetail']");
    if (prevBtn) {
      const m = prevBtn.getAttribute('onclick').match(/openModDetail\(['"]([^'"]+)['"]\)/);
      if (m && m[1]) {
        const modId = m[1];
        const isInstalled = window.isModInstalled(modId);
        const actionBtn = card.querySelector("button[onclick*='installModDirectly'], button[onclick*='uninstallModDirectly']");
        let badge = card.querySelector('.installed-mod-badge');
        
        if (isInstalled) {
          card.classList.add('border-emerald-500/30');
          if (actionBtn) {
            actionBtn.setAttribute('onclick', `uninstallModDirectly('${modId}', '', this)`);
            actionBtn.className = "group/delBtn flex-1 py-2 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-rose-600/25 text-emerald-300 hover:text-rose-200 border border-emerald-500/35 hover:border-rose-500/50 text-xs font-semibold text-center transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95";
            actionBtn.innerHTML = `<i class="fa-solid fa-check text-[10px] text-emerald-300 group-hover/delBtn:hidden"></i><i class="fa-solid fa-trash-can text-[10px] text-rose-300 hidden group-hover/delBtn:inline"></i><span class="group-hover/delBtn:hidden">Установлен</span><span class="hidden group-hover/delBtn:inline">Удалить</span>`;
            actionBtn.title = "Нажмите, чтобы удалить мод";
          }
          if (!badge) {
            const imgWrapper = card.querySelector('.card-img-wrapper');
            if (imgWrapper) {
              const bHtml = `<div class="installed-mod-badge absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 shadow-md shadow-emerald-950/40 backdrop-blur-sm"><i class="fa-solid fa-circle-check text-[9px] text-emerald-400"></i><span>В игре</span></div>`;
              imgWrapper.insertAdjacentHTML('beforeend', bHtml);
            }
          }
        } else {
          card.classList.remove('border-emerald-500/30');
          if (badge) badge.remove();
          if (actionBtn && actionBtn.getAttribute('onclick') && actionBtn.getAttribute('onclick').includes('uninstallModDirectly')) {
            const modObj = (window.allMods || []).find(x => x.id === modId);
            const dlUrl = modObj ? modObj.download_url : '#';
            const modTitle = modObj ? (modObj.title || '').replace(/'/g, "\\'") : '';
            actionBtn.setAttribute('onclick', `installModDirectly('${modId}', '${modTitle}', '${dlUrl}', this)`);
            actionBtn.className = "btn-shimmer flex-1 py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold text-center transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-indigo-600/20 active:scale-95";
            actionBtn.innerHTML = `<i class="fa-solid fa-download text-[10px]"></i><span>Скачать</span>`;
            actionBtn.title = "Установить мод";
          }
        }
      }
    }
  });

  const rows = document.querySelectorAll('.mod-list-row');
  rows.forEach(row => {
    const prevBtn = row.querySelector("button[onclick*='openModDetail']");
    if (prevBtn) {
      const m = prevBtn.getAttribute('onclick').match(/openModDetail\(['"]([^'"]+)['"]\)/);
      if (m && m[1]) {
        const modId = m[1];
        const isInstalled = window.isModInstalled(modId);
        const actionBtn = row.querySelector("button[onclick*='installModDirectly'], button[onclick*='uninstallModDirectly']");
        if (isInstalled && actionBtn) {
          row.classList.add('border-emerald-500/30');
          actionBtn.setAttribute('onclick', `uninstallModDirectly('${modId}', '', this)`);
          actionBtn.className = "group/delBtn px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-rose-600/25 text-emerald-300 hover:text-rose-200 border border-emerald-500/35 hover:border-rose-500/50 text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-sm active:scale-95";
          actionBtn.innerHTML = `<i class="fa-solid fa-check text-[10px] text-emerald-300 group-hover/delBtn:hidden"></i><i class="fa-solid fa-trash-can text-[10px] text-rose-300 hidden group-hover/delBtn:inline"></i><span class="group-hover/delBtn:hidden">Установлен</span><span class="hidden group-hover/delBtn:inline">Удалить</span>`;
          actionBtn.title = "Нажмите, чтобы удалить мод";
        } else if (!isInstalled && actionBtn && actionBtn.getAttribute('onclick') && actionBtn.getAttribute('onclick').includes('uninstallModDirectly')) {
          row.classList.remove('border-emerald-500/30');
          const modObj = (window.allMods || []).find(x => x.id === modId);
          const dlUrl = modObj ? modObj.download_url : '#';
          const modTitle = modObj ? (modObj.title || '').replace(/'/g, "\\'") : '';
          actionBtn.setAttribute('onclick', `installModDirectly('${modId}', '${modTitle}', '${dlUrl}', this)`);
          actionBtn.className = "btn-shimmer px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all flex items-center space-x-1.5 active:scale-95";
          actionBtn.innerHTML = `<i class="fa-solid fa-download text-[10px]"></i><span>Скачать</span>`;
          actionBtn.title = "Скачать и установить мод";
        }
      }
    }
  });
  if (typeof renderRecentlyAdded === 'function') {
    renderRecentlyAdded();
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] DOMContentLoaded fired');
  updateFavBadge();
  initBackground();
  console.log('[App] Loading mods data...');
  await loadModsData();
  console.log('[App] Loaded mods count:', allMods ? allMods.length : 0);
  buildHeroesList();
  console.log('[App] Built heroes:', allHeroes ? allHeroes.length : 0, 'items:', allItems ? allItems.length : 0);
  renderHeroPills();
  setupFilterEvents();
  renderRecentlyAdded();
  if (typeof window.refreshInstalledModsState === 'function') {
    await window.refreshInstalledModsState();
  }
  if (typeof window.applyAppLanguage === 'function') {
    window.applyAppLanguage(localStorage.getItem('dotamod_language') || 'ru');
  }
  setViewMode(viewMode);
  console.log('[App] Finished startup. viewMode:', viewMode);
});

async function loadModsData() {
  let loadedFromFetch = null;
  try {
    const res = await fetch('data/mods.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        loadedFromFetch = data;
      }
    }
  } catch (err) {
    console.warn('Локальный доступ: задействован кэш', err);
  }

  if (loadedFromFetch && window.CATALOG_MODS && Array.isArray(window.CATALOG_MODS)) {
    allMods = loadedFromFetch.length >= window.CATALOG_MODS.length ? loadedFromFetch : window.CATALOG_MODS;
  } else if (loadedFromFetch) {
    allMods = loadedFromFetch;
  } else if (window.CATALOG_MODS && Array.isArray(window.CATALOG_MODS) && window.CATALOG_MODS.length > 0) {
    allMods = window.CATALOG_MODS;
  } else {
    allMods = [...FALLBACK_CACHE];
  }

  window.allMods = allMods;

  if (typeof renderBgPresets === 'function') {
    renderBgPresets();
  }
  if (typeof applyBgStyles === 'function') {
    applyBgStyles();
  }
}

// Build genuine heroes roster and items/effects roster dynamically from allMods
function buildHeroesList() {
  const heroMap = {};
  const itemMap = {};

  allMods.forEach(mod => {
    if (!mod.hero) return;

    if (!NON_HERO_ENTITIES.has(mod.hero)) {
      // Genuine Dota 2 Hero
      if (!heroMap[mod.hero]) {
        let displayName = mod.hero;
        if (mod.hero === 'Natures Prophet') displayName = "Nature's Prophet (Фурион)";

        heroMap[mod.hero] = {
          name: displayName,
          key: mod.hero,
          icon: mod.hero_icon || 'assets/heroes/dota2_logo_symbol.png',
          attribute: mod.attribute || 'universal',
          count: 0
        };
      }
      heroMap[mod.hero].count++;
    } else if (ITEM_EFFECT_ENTITIES.has(mod.hero)) {
      // Game Item or Effect
      if (!itemMap[mod.hero]) {
        const meta = ITEM_META[mod.hero] || {};
        itemMap[mod.hero] = {
          name: meta.name || mod.hero,
          key: mod.hero,
          icon: meta.icon || mod.hero_icon || 'assets/items/tpscroll.png',
          count: 0
        };
      }
      itemMap[mod.hero].count++;
    }
  });

  // Sort heroes alphabetically (A-Z / А-Я)
  const sortedHeroes = Object.values(heroMap).sort((a, b) => {
    return (a.name || '').localeCompare(b.name || '', 'ru', { sensitivity: 'base' });
  });

  // Sort items alphabetically (A-Z / А-Я)
  const sortedItems = Object.values(itemMap).sort((a, b) => {
    return (a.name || '').localeCompare(b.name || '', 'ru', { sensitivity: 'base' });
  });

  const totalHeroMods = Object.values(heroMap).reduce((sum, h) => sum + h.count, 0);
  const totalItemMods = Object.values(itemMap).reduce((sum, i) => sum + i.count, 0);

  allHeroes = [
    {
      name: "Все герои",
      key: "all",
      icon: "assets/heroes/dota2_logo_symbol.png",
      count: totalHeroMods
    },
    ...sortedHeroes
  ];

  allItems = [
    {
      name: "Все предметы и эффекты",
      key: "all",
      icon: "assets/items/tpscroll.png",
      count: totalItemMods
    },
    ...sortedItems
  ];

  // Update counters
  const countLabel = document.getElementById('heroesCountLabel');
  if (countLabel) {
    countLabel.textContent = `${sortedHeroes.length} героев`;
  }
  const tabHeroesCount = document.getElementById('tabHeroesCount');
  if (tabHeroesCount) {
    tabHeroesCount.textContent = sortedHeroes.length;
  }
  const tabItemsCount = document.getElementById('tabItemsCount');
  if (tabItemsCount) {
    tabItemsCount.textContent = sortedItems.length;
  }

  renderHeroPills();
  renderItemPills();
}

// Helper: select category directly from recent card
window.selectCategoryDirect = function(cat) {
  if (!cat) return;
  activeCategoryFilter = cat;
  activeHeroFilter = 'all';
  activeItemFilter = 'all';
  searchQuery = '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  syncDesktopCategoryButtons();
  syncMobileCategoryTabs();
  renderHeroPills();
  renderItemPills();
  renderMods();
};

// Render "Недавно добавленные" with category synchronization & direct app install
function renderRecentlyAdded() {
  if (!recentContainer) return;
  const isEn = (window.currentAppLanguage === 'en');
  const section = document.getElementById('recentlyAddedSection');

  let candidateMods = window.allMods || [];
  if (activeCategoryFilter && activeCategoryFilter !== 'all') {
    candidateMods = candidateMods.filter(mod => {
      if (activeCategoryFilter === 'heroes') {
        return mod.category === 'heroes' || mod.category === 'sets';
      }
      return mod.category === activeCategoryFilter;
    });
  }
  if (activeHeroFilter && activeHeroFilter !== 'all') {
    candidateMods = candidateMods.filter(mod => mod.hero && mod.hero.toLowerCase() === activeHeroFilter.toLowerCase());
  }

  const isFiltered = (activeCategoryFilter && activeCategoryFilter !== 'all') || (activeHeroFilter && activeHeroFilter !== 'all');
  const recentMods = isFiltered ? candidateMods.slice(0, 16) : candidateMods.slice(-16).reverse();

  if (recentMods.length === 0) {
    if (section) section.classList.add('hidden');
    return;
  }
  if (section) section.classList.remove('hidden');

  recentContainer.innerHTML = recentMods.map(mod => {
    const isInstalled = (typeof window.isModInstalled === 'function') 
      ? window.isModInstalled(mod.id) 
      : (window.installedModIds && window.installedModIds.has(mod.id));
    const safeTitle = (mod.title || '').replace(/'/g, "\\'");
    const categoryName = (typeof getCategoryBadgeName === 'function') ? getCategoryBadgeName(mod.category) : (mod.hero || mod.category);

    return `
      <div 
        class="recent-card flex items-center p-3 shrink-0 w-72 sm:w-80 group ${isInstalled ? 'border-emerald-500/30' : ''}"
        data-mod-id="${mod.id}"
      >
        <div 
          onclick="openImageLightbox('${mod.preview}', '${safeTitle}')" 
          class="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-slate-900 shrink-0 relative mr-3 border border-white/10 shadow-md cursor-pointer group/img"
          title="${isEn ? 'Click image to enlarge' : 'Нажмите на изображение для увеличения'}"
        >
          <img 
            src="${mod.preview}" 
            alt="${mod.title}" 
            class="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" 
            loading="lazy"
            onerror="this.src='assets/heroes/dota2_logo_symbol.png'"
          >
          <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[8px] shadow tracking-wider transition-opacity duration-300 ease-in-out group-hover:opacity-0 pointer-events-none">NEW</span>
          ${isInstalled ? `
            <div class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 text-[8px] font-bold border border-emerald-500/40 flex items-center gap-0.5 shadow">
              <i class="fa-solid fa-check text-[7px]"></i>
            </div>
          ` : ''}
        </div>
        <div class="truncate flex-1 min-w-0">
          <div class="flex items-center space-x-1.5 mb-1">
            <span 
              onclick="event.stopPropagation(); selectCategoryDirect('${mod.category}')"
              class="text-[10px] text-indigo-400 hover:text-indigo-200 cursor-pointer font-semibold uppercase tracking-wider truncate"
              title="${isEn ? 'Filter by this category' : 'Фильтровать по этой категории'}"
            >${mod.hero || categoryName}</span>
            <span class="text-slate-600 text-[10px]">•</span>
            <span class="text-[10px] text-slate-400 font-mono">${mod.file_size || '35 MB'}</span>
          </div>
          <h4 
            onclick="openModDetail('${mod.id}')"
            class="text-xs font-bold text-slate-100 hover:text-indigo-300 transition-colors truncate cursor-pointer" 
            title="${mod.title}"
          >
            ${mod.title}
          </h4>
          
          <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 gap-2">
            <button 
              onclick="openModDetail('${mod.id}')"
              class="px-2.5 py-1 rounded-lg bg-[#161a28] hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-white/10 transition-all"
              title="${isEn ? 'Open details and preview' : 'Открыть подробный предпросмотр'}"
            >
              <i class="fa-solid ${mod.category === 'mega-kill' || mod.category === 'hero-sounds' ? 'fa-volume-high' : 'fa-eye'} text-[10px]"></i>
              <span>${mod.category === 'mega-kill' || mod.category === 'hero-sounds' ? (isEn ? 'Audio' : 'Озвучка') : (isEn ? 'Preview' : 'Превью')}</span>
            </button>
            
            ${isInstalled ? `
              <button 
                onclick="uninstallModDirectly('${mod.id}', '${safeTitle}', this)" 
                class="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-red-500/20 text-emerald-300 hover:text-red-300 border border-emerald-500/30 hover:border-red-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all group/btn"
                title="${isEn ? 'Uninstall mod' : 'Удалить мод'}"
              >
                <i class="fa-solid fa-check text-[9px] group-hover/btn:hidden"></i>
                <i class="fa-solid fa-trash-can text-[9px] hidden group-hover/btn:inline"></i>
                <span class="group-hover/btn:hidden">${isEn ? 'Installed' : 'Установлен'}</span>
                <span class="hidden group-hover/btn:inline">${isEn ? 'Uninstall' : 'Удалить'}</span>
              </button>
            ` : `
              <button 
                onclick="installModDirectly('${mod.id}', '${safeTitle}', '${mod.download_url}', this)" 
                class="btn-shimmer px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-all shadow-sm active:scale-95"
                title="${isEn ? 'Install mod' : 'Установить мод'}"
              >
                <i class="fa-solid fa-download text-[9px]"></i>
                <span>${isEn ? 'Install' : 'Установить'}</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Scroll buttons
  const prevBtn = document.getElementById('recentPrevBtn');
  const nextBtn = document.getElementById('recentNextBtn');
  if (prevBtn && nextBtn) {
    prevBtn.onclick = () => { recentContainer.scrollBy({ left: -300, behavior: 'smooth' }); };
    nextBtn.onclick = () => { recentContainer.scrollBy({ left: 300, behavior: 'smooth' }); };
  }
}

// Render Genuine Heroes in Sidebar and Mobile
function renderHeroPills() {
  const container = document.getElementById('heroPillsContainer');
  if (!container) return;

  const query = heroSearchQuery.toLowerCase().trim();
  const filteredHeroes = allHeroes.filter(h => {
    if (h.key === 'all') return true;
    if (!query) return true;
    if (h.name.toLowerCase().includes(query)) return true;
    const aliases = getHeroAliases(h.key);
    if (aliases && aliases.some(a => a.includes(query) || query.includes(a))) return true;
    return false;
  });

  if (filteredHeroes.length === 0) {
    container.innerHTML = `
      <div class="py-6 text-center text-slate-500 text-xs">
        Герой не найден
      </div>
    `;
  } else {
    container.innerHTML = filteredHeroes.map(hero => `
      <button 
        onclick="filterByHero('${hero.key.replace(/'/g, "\\'")}')" 
        class="hero-pill w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between space-x-2 text-xs text-slate-300 ${activeHeroFilter.toLowerCase() === hero.key.toLowerCase() ? 'active' : ''}"
        data-hero-key="${hero.key}"
        title="${hero.name}"
      >
        <div class="flex items-center space-x-2 truncate">
          <img src="${hero.icon}" alt="${hero.name}" class="w-5 h-5 rounded-md object-cover shrink-0" onerror="this.src='assets/heroes/dota2_logo_symbol.png'">
          <span class="truncate font-medium text-[11px]">${hero.name}</span>
        </div>
        <span class="text-[10px] px-1.5 py-0.2 rounded-md bg-[#161a26] text-slate-400 font-mono shrink-0">${hero.count}</span>
      </button>
    `).join('');
  }

  // Mobile horizontal container
  const mobileContainer = document.getElementById('heroPillsContainerMobile');
  if (mobileContainer) {
    mobileContainer.innerHTML = allHeroes.slice(0, 20).map(hero => `
      <button 
        onclick="filterByHero('${hero.key.replace(/'/g, "\\'")}')" 
        class="hero-pill px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-medium text-slate-300 shrink-0 ${activeHeroFilter.toLowerCase() === hero.key.toLowerCase() ? 'active' : ''}"
        data-hero-key-mobile="${hero.key}"
      >
        <img src="${hero.icon}" alt="${hero.name}" class="w-4 h-4 rounded-md object-cover" onerror="this.src='assets/heroes/dota2_logo_symbol.png'">
        <span>${hero.name}</span>
      </button>
    `).join('');
  }
}

// Render In-game Items & Effects in Sidebar and Mobile
function renderItemPills() {
  const container = document.getElementById('itemPillsContainer');
  if (!container) return;

  const query = itemSearchQuery.toLowerCase().trim();
  const filteredItems = allItems.filter(i => {
    if (i.key === 'all') return true;
    if (!query) return true;
    if (i.name.toLowerCase().includes(query) || i.key.toLowerCase().includes(query)) return true;
    const aliases = getItemAliases(i.key);
    if (aliases && aliases.some(a => a.includes(query) || query.includes(a))) return true;
    return false;
  });

  if (filteredItems.length === 0) {
    container.innerHTML = `
      <div class="py-6 text-center text-slate-500 text-xs">
        Предмет или эффект не найден
      </div>
    `;
  } else {
    container.innerHTML = filteredItems.map(item => `
      <button 
        onclick="filterByItem('${item.key.replace(/'/g, "\\'")}')" 
        class="item-pill w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between space-x-2 text-xs text-slate-300 ${activeItemFilter.toLowerCase() === item.key.toLowerCase() ? 'active' : ''}"
        data-item-key="${item.key}"
        title="${item.name}"
      >
        <div class="flex items-center space-x-2 truncate">
          <img src="${item.icon}" alt="${item.name}" class="w-5 h-5 rounded-md object-cover shrink-0" onerror="this.src='assets/heroes/dota2_logo_symbol.png'">
          <span class="truncate font-medium text-[11px]">${item.name}</span>
        </div>
        <span class="text-[10px] px-1.5 py-0.2 rounded-md bg-[#161a26] text-slate-400 font-mono shrink-0">${item.count}</span>
      </button>
    `).join('');
  }

  // Mobile horizontal container
  const mobileContainer = document.getElementById('itemPillsContainerMobile');
  if (mobileContainer) {
    mobileContainer.innerHTML = allItems.slice(0, 20).map(item => `
      <button 
        onclick="filterByItem('${item.key.replace(/'/g, "\\'")}')" 
        class="item-pill px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-medium text-slate-300 shrink-0 ${activeItemFilter.toLowerCase() === item.key.toLowerCase() ? 'active' : ''}"
        data-item-key-mobile="${item.key}"
      >
        <img src="${item.icon}" alt="${item.name}" class="w-4 h-4 rounded-md object-cover" onerror="this.src='assets/heroes/dota2_logo_symbol.png'">
        <span>${item.name}</span>
      </button>
    `).join('');
  }
}

// Switch between Heroes and Items/Effects tabs
window.switchEntityTab = function(tab) {
  activeEntityTab = tab;

  const tabHeroesBtn = document.getElementById('tabHeroesBtn');
  const tabItemsBtn = document.getElementById('tabItemsBtn');
  const panelHeroesTab = document.getElementById('panelHeroesTab');
  const panelItemsTab = document.getElementById('panelItemsTab');

  const tabHeroesBtnMobile = document.getElementById('tabHeroesBtnMobile');
  const tabItemsBtnMobile = document.getElementById('tabItemsBtnMobile');
  const heroPillsMobile = document.getElementById('heroPillsContainerMobile');
  const itemPillsMobile = document.getElementById('itemPillsContainerMobile');

  const activeClass = "flex-1 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-sm transition-all flex items-center justify-center space-x-1.5";
  const inactiveClass = "flex-1 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center space-x-1.5";

  const mobileActiveClass = "px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600 text-white transition-all";
  const mobileInactiveClass = "px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white transition-all";

  if (tab === 'heroes') {
    if (tabHeroesBtn) tabHeroesBtn.className = activeClass;
    if (tabItemsBtn) tabItemsBtn.className = inactiveClass;
    if (panelHeroesTab) panelHeroesTab.classList.remove('hidden');
    if (panelItemsTab) panelItemsTab.classList.add('hidden');

    if (tabHeroesBtnMobile) tabHeroesBtnMobile.className = mobileActiveClass;
    if (tabItemsBtnMobile) tabItemsBtnMobile.className = mobileInactiveClass;
    if (heroPillsMobile) heroPillsMobile.classList.remove('hidden');
    if (itemPillsMobile) itemPillsMobile.classList.add('hidden');
  } else {
    if (tabItemsBtn) tabItemsBtn.className = activeClass;
    if (tabHeroesBtn) tabHeroesBtn.className = inactiveClass;
    if (panelItemsTab) panelItemsTab.classList.remove('hidden');
    if (panelHeroesTab) panelHeroesTab.classList.add('hidden');

    if (tabItemsBtnMobile) tabItemsBtnMobile.className = mobileActiveClass;
    if (tabHeroesBtnMobile) tabHeroesBtnMobile.className = mobileInactiveClass;
    if (itemPillsMobile) itemPillsMobile.classList.remove('hidden');
    if (heroPillsMobile) heroPillsMobile.classList.add('hidden');
  }

  renderMods();
};

window.filterByHero = function(heroKey) {
  if (typeof switchMainPage === 'function') {
    switchMainPage('catalog');
  }

  activeHeroFilter = heroKey;
  activeItemFilter = 'all';
  activeCategoryFilter = 'all';

  syncDesktopCategoryButtons();
  syncMobileCategoryTabs();

  // Highlight active hero pills
  document.querySelectorAll('[data-hero-key]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.heroKey.toLowerCase() === heroKey.toLowerCase());
  });
  document.querySelectorAll('[data-hero-key-mobile]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.heroKeyMobile.toLowerCase() === heroKey.toLowerCase());
  });

  // Clear active state on items
  document.querySelectorAll('[data-item-key]').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('[data-item-key-mobile]').forEach(b => b.classList.remove('active'));
  const allItemBtn = document.querySelector('[data-item-key="all"]');
  if (allItemBtn) allItemBtn.classList.add('active');

  renderMods();

  if (heroKey !== 'all') {
    const el = document.getElementById('modsContainer');
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  }
};

window.filterByItem = function(itemKey) {
  if (typeof switchMainPage === 'function') {
    switchMainPage('catalog');
  }

  activeItemFilter = itemKey;
  activeHeroFilter = 'all';
  activeCategoryFilter = 'all';

  syncDesktopCategoryButtons();
  syncMobileCategoryTabs();

  // Highlight active item pills
  document.querySelectorAll('[data-item-key]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.itemKey.toLowerCase() === itemKey.toLowerCase());
  });
  document.querySelectorAll('[data-item-key-mobile]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.itemKeyMobile.toLowerCase() === itemKey.toLowerCase());
  });

  // Clear active state on heroes
  document.querySelectorAll('[data-hero-key]').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('[data-hero-key-mobile]').forEach(b => b.classList.remove('active'));
  const allHeroBtn = document.querySelector('[data-hero-key="all"]');
  if (allHeroBtn) allHeroBtn.classList.add('active');

  renderMods();

  if (itemKey !== 'all') {
    const el = document.getElementById('modsContainer');
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  }
};

let searchDebounceTimer = null;
let heroDebounceTimer = null;
let itemDebounceTimer = null;

function setupFilterEvents() {
  const onMainSearchChange = (val) => {
    // Instant sync of inputs & clear buttons for zero-latency feel
    const dInput = document.getElementById('searchInput');
    if (dInput && dInput.value !== val) dInput.value = val;
    const mInput = document.getElementById('mobileSearchInput');
    if (mInput && mInput.value !== val) mInput.value = val;

    const hasText = (val || '').trim().length > 0;
    const dClear = document.getElementById('clearSearchBtn');
    if (dClear) dClear.classList.toggle('hidden', !hasText);
    const mClear = document.getElementById('clearMobileSearchBtn');
    if (mClear) mClear.classList.toggle('hidden', !hasText);

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      window.handleSearchInput(val);
    }, 110);
  };

  // Main Search (Desktop)
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      onMainSearchChange(e.target.value);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(searchDebounceTimer);
        window.handleSearchInput(e.target.value);
      }
    });
  }

  // Main Search (Mobile)
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', (e) => {
      onMainSearchChange(e.target.value);
    });
    mobileSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(searchDebounceTimer);
        window.handleSearchInput(e.target.value);
      }
    });
  }

  // Hero Search in Sidebar
  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', (e) => {
      clearTimeout(heroDebounceTimer);
      heroDebounceTimer = setTimeout(() => {
        heroSearchQuery = e.target.value;
        renderHeroPills();
      }, 90);
    });
  }

  // Item Search in Sidebar
  const itemSearchInput = document.getElementById('itemSearchInput');
  if (itemSearchInput) {
    itemSearchInput.addEventListener('input', (e) => {
      clearTimeout(itemDebounceTimer);
      itemDebounceTimer = setTimeout(() => {
        itemSearchQuery = e.target.value;
        renderItemPills();
      }, 90);
    });
  }

  // Desktop Sidebar Category Buttons
  document.querySelectorAll('.sidebar-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-cat-btn').forEach(b => {
        b.classList.remove('active-cat');
        b.className = b.className.replace(/bg-indigo-600\/20|text-indigo-300|border-indigo-500\/30/g, '');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active-cat');
      btn.classList.remove('text-slate-400');
      activeCategoryFilter = btn.dataset.category;

      // Reset specific hero & item filters
      activeHeroFilter = 'all';
      activeItemFilter = 'all';
      document.querySelectorAll('[data-hero-key]').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('[data-hero-key-mobile]').forEach(b => b.classList.remove('active'));
      const allHeroBtn = document.querySelector('[data-hero-key="all"]');
      if (allHeroBtn) allHeroBtn.classList.add('active');

      document.querySelectorAll('[data-item-key]').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('[data-item-key-mobile]').forEach(b => b.classList.remove('active'));
      const allItemBtn = document.querySelector('[data-item-key="all"]');
      if (allItemBtn) allItemBtn.classList.add('active');

      // Auto-switch sub-tab for convenience
      if (activeCategoryFilter === 'herofx' || activeCategoryFilter === 'hero-items') {
        switchEntityTab('items');
      } else if (activeCategoryFilter === 'heroes') {
        switchEntityTab('heroes');
      }

      syncMobileCategoryTabs();
      renderMods();
    });
  });

  // Mobile Category Tabs
  document.querySelectorAll('.mobile-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mobile-cat-btn').forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('text-slate-400');
      activeCategoryFilter = btn.dataset.category;

      activeHeroFilter = 'all';
      activeItemFilter = 'all';
      document.querySelectorAll('[data-hero-key]').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('[data-hero-key-mobile]').forEach(b => b.classList.remove('active'));
      const allHeroBtn = document.querySelector('[data-hero-key="all"]');
      if (allHeroBtn) allHeroBtn.classList.add('active');

      document.querySelectorAll('[data-item-key]').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('[data-item-key-mobile]').forEach(b => b.classList.remove('active'));
      const allItemBtn = document.querySelector('[data-item-key="all"]');
      if (allItemBtn) allItemBtn.classList.add('active');

      if (activeCategoryFilter === 'herofx' || activeCategoryFilter === 'hero-items') {
        switchEntityTab('items');
      } else if (activeCategoryFilter === 'heroes') {
        switchEntityTab('heroes');
      }

      syncDesktopCategoryButtons();
      renderMods();
    });
  });

  // Scroll to top button visibility listener
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollToTopBtn');
    if (!btn) return;
    if (window.scrollY > 280) {
      btn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      btn.classList.add('opacity-100', 'translate-y-0');
    } else {
      btn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      btn.classList.remove('opacity-100', 'translate-y-0');
    }
  }, { passive: true });
}

function syncMobileCategoryTabs() {
  document.querySelectorAll('.mobile-cat-btn').forEach(b => {
    b.classList.remove('bg-indigo-600', 'text-white');
    b.classList.add('text-slate-400');
    if (b.dataset.category === activeCategoryFilter) {
      b.classList.add('bg-indigo-600', 'text-white');
      b.classList.remove('text-slate-400');
    }
  });
}

function syncDesktopCategoryButtons() {
  document.querySelectorAll('.sidebar-cat-btn').forEach(b => {
    b.classList.remove('active-cat');
    b.classList.add('text-slate-400');
    if (b.dataset.category === activeCategoryFilter) {
      b.classList.add('active-cat');
      b.classList.remove('text-slate-400');
    }
  });
}

// Switch View Mode: 'grid' (Сетка) or 'list' (Список)
window.setViewMode = function(mode) {
  viewMode = mode === 'list' ? 'list' : 'grid';
  try {
    localStorage.setItem('dotamod_view_mode', viewMode);
  } catch (e) {}

  // 1. Catalog toolbar buttons
  const gridBtn = document.getElementById('viewGridBtn');
  const listBtn = document.getElementById('viewListBtn');
  const activeClassToolbar = "px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-all";
  const inactiveClassToolbar = "px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all";
  if (gridBtn && listBtn) {
    gridBtn.className = (viewMode === 'grid') ? activeClassToolbar : inactiveClassToolbar;
    listBtn.className = (viewMode === 'list') ? activeClassToolbar : inactiveClassToolbar;
  }

  // 2. Sidebar buttons
  const sGridBtn = document.getElementById('sidebarViewGridBtn');
  const sListBtn = document.getElementById('sidebarViewListBtn');
  const activeClassSidebar = "px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all bg-indigo-600 text-white shadow-md shadow-indigo-600/30";
  const inactiveClassSidebar = "px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all text-slate-400 hover:text-white hover:bg-white/[0.04]";
  if (sGridBtn && sListBtn) {
    sGridBtn.className = (viewMode === 'grid') ? activeClassSidebar : inactiveClassSidebar;
    sListBtn.className = (viewMode === 'list') ? activeClassSidebar : inactiveClassSidebar;
  }

  // 3. Mobile buttons
  const gridBtnM = document.getElementById('viewGridBtnMobile');
  const listBtnM = document.getElementById('viewListBtnMobile');
  const activeClassMobile = "px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-600 text-white shadow transition-all";
  const inactiveClassMobile = "px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all";
  if (gridBtnM && listBtnM) {
    gridBtnM.className = (viewMode === 'grid') ? activeClassMobile : inactiveClassMobile;
    listBtnM.className = (viewMode === 'list') ? activeClassMobile : inactiveClassMobile;
  }

  renderMods();
};

function updateActiveFilterBadge() {
  const container = document.getElementById('activeFilterBadgeContainer');
  if (container) container.innerHTML = '';
}

window.resetCategory = function() {
  activeCategoryFilter = 'all';
  syncDesktopCategoryButtons();
  syncMobileCategoryTabs();
  renderMods();
};

window.handleSearchInput = function(val) {
  searchQuery = (val || '').toLowerCase().trim();

  // Sync desktop input
  const dInput = document.getElementById('searchInput');
  if (dInput && dInput.value !== val) dInput.value = val;
  const dClear = document.getElementById('clearSearchBtn');
  if (dClear) {
    if (searchQuery.length > 0) dClear.classList.remove('hidden');
    else dClear.classList.add('hidden');
  }

  // Sync mobile input
  const mInput = document.getElementById('mobileSearchInput');
  if (mInput && mInput.value !== val) mInput.value = val;
  const mClear = document.getElementById('clearMobileSearchBtn');
  if (mClear) {
    if (searchQuery.length > 0) mClear.classList.remove('hidden');
    else mClear.classList.add('hidden');
  }

  // Switch to catalog view if currently on mymods
  if (searchQuery.length > 0 && typeof switchMainPage === 'function') {
    const catalogView = document.getElementById('catalogPageView');
    if (catalogView && catalogView.classList.contains('hidden')) {
      switchMainPage('catalog');
    }
  }

  renderMods();
};

window.clearMainSearch = function() {
  window.handleSearchInput('');
};

window.resetSearch = function() {
  window.clearMainSearch();
};

window.resetFilters = function() {
  activeHeroFilter = 'all';
  activeItemFilter = 'all';
  activeCategoryFilter = 'all';
  window.handleSearchInput('');
  heroSearchQuery = '';
  itemSearchQuery = '';

  if (heroSearchInput) heroSearchInput.value = '';
  const itemSearchInput = document.getElementById('itemSearchInput');
  if (itemSearchInput) itemSearchInput.value = '';

  syncDesktopCategoryButtons();
  syncMobileCategoryTabs();
  renderHeroPills();
  renderItemPills();
  renderMods();
};

// Progressive Chunk Rendering & Infinite Scroll Config
const MODS_PAGE_CHUNK = 36;
let currentDisplayedCount = MODS_PAGE_CHUNK;
let infiniteScrollObserver = null;

// Render Main Mods List
function renderMods(resetCount = true) {
  updateActiveFilterBadge();
  if (typeof renderRecentlyAdded === 'function') {
    renderRecentlyAdded();
  }

  if (resetCount) {
    currentDisplayedCount = MODS_PAGE_CHUNK;
  }

  const filtered = allMods.filter(mod => {
    // If a search query is entered, prioritize searching across all mods
    if (searchQuery.length > 0) {
      return matchesSearchQuery(mod, searchQuery);
    }

    // Hero filter: if hero selected, must match and cannot be in NON_HERO_ENTITIES
    const matchesHero = (activeHeroFilter === 'all') || 
      (mod.hero && mod.hero.toLowerCase() === activeHeroFilter.toLowerCase() && !NON_HERO_ENTITIES.has(mod.hero));

    // Item filter: if item selected, must match
    const matchesItem = (activeItemFilter === 'all') || 
      (mod.hero && mod.hero.toLowerCase() === activeItemFilter.toLowerCase());

    // Category filter: if category selected, must match
    const matchesCat = (activeCategoryFilter === 'all') || 
      (mod.category === activeCategoryFilter) ||
      (activeCategoryFilter === 'heroes' && mod.category === 'sets');

    return matchesHero && matchesItem && matchesCat;
  });

  // Sort mods alphabetically by title (A-Z / А-Я)
  filtered.sort((a, b) => {
    const titleA = a.title || '';
    const titleB = b.title || '';
    return titleA.localeCompare(titleB, 'ru', { sensitivity: 'base' });
  });

  currentFilteredMods = filtered;

  if (totalModsCount) {
    totalModsCount.textContent = `${filtered.length} ${getNoun(filtered.length, 'мод', 'мода', 'модов')}`;
  }

  const isEn = (window.currentAppLanguage === 'en');

  if (filtered.length === 0) {
    if (searchQuery.length > 0) {
      modsContainer.innerHTML = `
        <div class="py-16 text-center bg-[#12151e] rounded-3xl border border-white/5">
          <div class="w-14 h-14 rounded-2xl bg-slate-800/60 text-slate-400 inline-flex items-center justify-center mb-3 text-lg">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 class="text-base font-bold text-white mb-1">${isEn ? 'Nothing found' : 'Ничего не найдено'}</h3>
          <p class="text-slate-400 text-xs max-w-sm mx-auto mb-4">${isEn ? `No mods matching «<span class="text-white font-medium">${searchQuery}</span>»` : `По запросу «<span class="text-white font-medium">${searchQuery}</span>» ничего не найдено`}</p>
          <button onclick="clearMainSearch()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all">
            ${isEn ? 'Clear search' : 'Очистить поиск'}
          </button>
        </div>
      `;
    } else {
      modsContainer.innerHTML = `
        <div class="py-16 text-center bg-[#12151e] rounded-3xl border border-white/5">
          <div class="w-14 h-14 rounded-2xl bg-slate-800/60 text-slate-400 inline-flex items-center justify-center mb-3 text-lg">
            <i class="fa-solid fa-filter"></i>
          </div>
          <h3 class="text-base font-bold text-white mb-1">${isEn ? 'No mods found' : 'Моды не найдены'}</h3>
          <p class="text-slate-400 text-xs max-w-sm mx-auto mb-4">${isEn ? 'Try changing the category or clearing filters' : 'Попробуйте изменить категорию или очистить фильтры'}</p>
          <button onclick="resetFilters()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all">
            ${isEn ? 'Reset filters' : 'Сбросить фильтры'}
          </button>
        </div>
      `;
    }
    return;
  }

  // Active Filter Banner HTML (Hero / Item / Search)
  let activeBannerHTML = '';
  if (searchQuery.length > 0) {
    activeBannerHTML = `
      <div class="flex items-center justify-between mb-5 p-3.5 rounded-2xl bg-[#12151e] border border-white/5 text-xs text-slate-300">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </div>
          <div>
            <div class="text-white font-semibold">${isEn ? `Search results: «${searchQuery}»` : `Результаты поиска: «${searchQuery}»`}</div>
            <div class="text-[11px] text-slate-400 font-mono">${filtered.length} ${getNoun(filtered.length, 'найденный мод', 'найденных мода', 'найденных модов')}</div>
          </div>
        </div>
        <button onclick="clearMainSearch()" class="px-3.5 py-2 rounded-xl bg-[#161a26] hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-all border border-white/5">
          <i class="fa-solid fa-xmark text-[11px]"></i>
          <span>${isEn ? 'Clear' : 'Очистить'}</span>
        </button>
      </div>
    `;
  } else if (activeHeroFilter !== 'all') {
    const heroObj = allHeroes.find(h => h.key.toLowerCase() === activeHeroFilter.toLowerCase());
    const heroIcon = heroObj ? heroObj.icon : (filtered[0] ? filtered[0].hero_icon : 'assets/heroes/dota2_logo_symbol.png');
    const heroName = heroObj ? heroObj.name : activeHeroFilter;

    activeBannerHTML = `
      <div class="flex items-center justify-between mb-5 p-3.5 rounded-2xl bg-[#12151e] border border-white/5">
        <div class="flex items-center space-x-3">
          <button 
            onclick="filterByHero('all')" 
            class="px-3.5 py-2 rounded-xl bg-[#161a26] hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-all border border-white/5 shadow-sm"
          >
            <i class="fa-solid fa-arrow-left text-[11px]"></i>
            <span>${isEn ? 'All heroes' : 'Все герои'}</span>
          </button>
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow shrink-0">
              <img src="${heroIcon}" alt="${heroName}" class="w-full h-full object-cover" onerror="this.src='assets/heroes/dota2_logo_symbol.png'">
            </div>
            <div>
              <h2 class="text-base font-bold text-white tracking-wide leading-none">${heroName}</h2>
              <span class="text-[11px] text-slate-400 font-mono mt-1 inline-block">
                ${filtered.length} ${getNoun(filtered.length, 'доступный скин', 'доступных скина', 'доступных скинов')}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (activeItemFilter !== 'all') {
    const itemObj = allItems.find(i => i.key.toLowerCase() === activeItemFilter.toLowerCase());
    const itemMeta = ITEM_META[activeItemFilter] || {};
    const itemIcon = itemObj ? itemObj.icon : (itemMeta.icon || (filtered[0] ? filtered[0].hero_icon : 'assets/items/tpscroll.png'));
    const itemName = itemObj ? itemObj.name : (itemMeta.name || activeItemFilter);

    activeBannerHTML = `
      <div class="flex items-center justify-between mb-5 p-3.5 rounded-2xl bg-[#12151e] border border-white/5">
        <div class="flex items-center space-x-3">
          <button 
            onclick="filterByItem('all')" 
            class="px-3.5 py-2 rounded-xl bg-[#161a26] hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-all border border-white/5 shadow-sm"
          >
            <i class="fa-solid fa-arrow-left text-[11px]"></i>
            <span>${isEn ? 'All items' : 'Все предметы'}</span>
          </button>
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow shrink-0">
              <img src="${itemIcon}" alt="${itemName}" class="w-full h-full object-cover" onerror="this.src='assets/items/tpscroll.png'">
            </div>
            <div>
              <h2 class="text-base font-bold text-white tracking-wide leading-none">${itemName}</h2>
              <span class="text-[11px] text-slate-400 font-mono mt-1 inline-block">
                ${filtered.length} ${getNoun(filtered.length, 'доступный эффект', 'доступных эффекта', 'доступных эффектов')}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 1. ALL HEROES / ALL ITEMS OVERVIEW (When no specific hero, item, category, or search is active)
  if (activeHeroFilter === 'all' && activeItemFilter === 'all' && searchQuery.length === 0 && activeCategoryFilter === 'all') {
    const isHeroes = activeEntityTab === 'heroes';

    const tabsHeaderHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 p-2 rounded-2xl bg-[#12151e] border border-white/5">
        <div class="flex items-center space-x-1.5">
          <button 
            onclick="switchEntityTab('heroes')" 
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${isHeroes ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}"
          >
            <i class="fa-solid fa-users text-[11px]"></i>
            <span>${isEn ? 'Dota 2 Heroes' : 'Герои Dota 2'}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-md ${isHeroes ? 'bg-indigo-500/40 text-white' : 'bg-[#161a26] text-slate-400'} font-mono">${Math.max(0, allHeroes.length - 1)}</span>
          </button>
          <button 
            onclick="switchEntityTab('items')" 
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${!isHeroes ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}"
          >
            <i class="fa-solid fa-wand-magic-sparkles text-[11px]"></i>
            <span>${isEn ? 'Items & Effects' : 'Предметы и эффекты'}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-md ${!isHeroes ? 'bg-indigo-500/40 text-white' : 'bg-[#161a26] text-slate-400'} font-mono">${Math.max(0, allItems.length - 1)}</span>
          </button>
        </div>
        <div class="text-xs text-slate-400 font-mono hidden md:flex items-center gap-1.5 pr-2">
          <span>${isEn ? 'Display mode:' : 'Режим отображения:'}</span>
          <span class="text-indigo-400 font-bold">${viewMode === 'grid' ? (isEn ? 'Grid' : 'Сетка') : (isEn ? 'List' : 'Список')}</span>
        </div>
      </div>
    `;

    if (viewMode === 'grid') {
      const tilesHTML = isHeroes 
        ? allHeroes.filter(h => h.key !== 'all').map(h => createHeroCardTileHTML(h)).join('')
        : allItems.filter(i => i.key !== 'all').map(i => createItemCardTileHTML(i)).join('');

      modsContainer.innerHTML = `
        ${tabsHeaderHTML}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          ${tilesHTML}
        </div>
      `;
      return;
    } else {
      const rowsHTML = isHeroes 
        ? allHeroes.filter(h => h.key !== 'all').map(h => createHeroListRowHTML(h)).join('')
        : allItems.filter(i => i.key !== 'all').map(i => createItemListRowHTML(i)).join('');

      modsContainer.innerHTML = `
        ${tabsHeaderHTML}
        <div class="space-y-2">
          ${rowsHTML}
        </div>
      `;
      return;
    }
  }

  // 2. SPECIFIC FILTER ACTIVE (Hero, Item, Category, or Search Query)
  const visibleMods = filtered.slice(0, currentDisplayedCount);
  const hasMore = filtered.length > currentDisplayedCount;

  const cardsHTML = viewMode === 'grid'
    ? `<div id="activeModsContainer" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        ${visibleMods.map(mod => createCardHTML(mod)).join('')}
       </div>`
    : `<div id="activeModsContainer" class="space-y-2.5">
        ${visibleMods.map(mod => createModListRowHTML(mod)).join('')}
       </div>`;

  const sentinelHTML = hasMore ? `
    <div id="infiniteScrollSentinel" class="py-8 flex flex-col items-center justify-center space-y-3">
      <div class="text-xs text-slate-400 font-medium">
        ${isEn 
          ? `Showing <span class="text-indigo-400 font-bold">${visibleMods.length}</span> of <span class="text-white font-bold">${filtered.length}</span> mods`
          : `Показано <span class="text-indigo-400 font-bold">${visibleMods.length}</span> из <span class="text-white font-bold">${filtered.length}</span> модов`
        }
      </div>
      <button 
        onclick="loadNextModsChunk()" 
        class="px-5 py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-600/10 btn-shimmer"
      >
        <i class="fa-solid fa-arrow-down text-xs"></i>
        <span>${isEn ? 'Load 36 more mods' : 'Загрузить ещё 36 модов'}</span>
      </button>
    </div>
  ` : '';

  modsContainer.innerHTML = `
    ${activeBannerHTML}
    ${cardsHTML}
    ${sentinelHTML}
  `;

  setupInfiniteScrollObserver();
}

// Progressive Chunk Loader & Observer
window.loadNextModsChunk = function() {
  if (!currentFilteredMods || currentFilteredMods.length <= currentDisplayedCount) return;

  const container = document.getElementById('activeModsContainer');
  if (!container) return;

  const prevCount = currentDisplayedCount;
  currentDisplayedCount += MODS_PAGE_CHUNK;
  const nextBatch = currentFilteredMods.slice(prevCount, currentDisplayedCount);

  const newHtml = nextBatch.map(mod => viewMode === 'grid' ? createCardHTML(mod) : createModListRowHTML(mod)).join('');
  container.insertAdjacentHTML('beforeend', newHtml);

  const sentinel = document.getElementById('infiniteScrollSentinel');
  if (currentDisplayedCount >= currentFilteredMods.length) {
    if (sentinel) sentinel.remove();
    if (infiniteScrollObserver) {
      infiniteScrollObserver.disconnect();
      infiniteScrollObserver = null;
    }
  } else if (sentinel) {
    const label = sentinel.querySelector('.text-slate-400');
    if (label) {
      label.innerHTML = `Показано <span class="text-indigo-400 font-bold">${Math.min(currentDisplayedCount, currentFilteredMods.length)}</span> из <span class="text-white font-bold">${currentFilteredMods.length}</span> модов`;
    }
  }
};

function setupInfiniteScrollObserver() {
  if (infiniteScrollObserver) {
    infiniteScrollObserver.disconnect();
    infiniteScrollObserver = null;
  }

  const sentinel = document.getElementById('infiniteScrollSentinel');
  if (!sentinel) return;

  if ('IntersectionObserver' in window) {
    infiniteScrollObserver = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        window.loadNextModsChunk();
      }
    }, { rootMargin: '300px' });
    infiniteScrollObserver.observe(sentinel);
  }
}

window.isBackgroundVideo = function(mod) {
  if (!mod) return false;
  const prev = (mod.preview || '').toLowerCase();
  if (prev.endsWith('.mp4') || prev.endsWith('.webm')) return true;
  if (typeof window.getVideoBackgroundUrl === 'function' && window.getVideoBackgroundUrl(mod)) return true;
  const title = (mod.title || '').toLowerCase();
  const knownVideoTitles = [
    'amor endscreen', 'sematary', 'dark tree', 'taghmel ix-xita',
    'bliss', 'gwardjan tad dawl perfezzjoni', 'xvii', 'the great awakening'
  ];
  return knownVideoTitles.some(t => title.includes(t));
};

function createCardHTML(mod) {
  const isFav = favorites.includes(mod.id);
  const isInstalled = window.isModInstalled ? window.isModInstalled(mod) : false;
  const isEn = (window.currentAppLanguage === 'en');
  const isBg = mod.category === 'backgrounds';
  const isBgVid = isBg && window.isBackgroundVideo(mod);

  return `
    <div class="mod-card overflow-hidden flex flex-col group ${isInstalled ? 'border-emerald-500/30' : ''}">
      
      <!-- Preview Banner -->
      <div 
        class="card-img-wrapper h-44 w-full bg-slate-900 relative overflow-hidden cursor-pointer group/img" 
        onclick="openImageLightbox('${mod.preview}', '${(mod.title || '').replace(/'/g, "\\'")}')"
        title="${isEn ? 'Click image to enlarge' : 'Нажмите на изображение для увеличения'}"
      >
        <img 
          src="${mod.preview}" 
          alt="${mod.title}" 
          class="card-preview-img w-full h-full object-cover" 
          loading="lazy"
          decoding="async"
          onerror="this.src='assets/heroes/dota2_logo_symbol.png'"
        >

        <!-- Hover Image Zoom Overlay -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-200 z-10 pointer-events-none">
          <span class="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 shadow-lg">
            <i class="fa-solid fa-magnifying-glass-plus text-indigo-400 text-xs"></i>
            <span>${isEn ? 'Zoom photo' : 'Увеличить фото'}</span>
          </span>
        </div>

        <!-- Hero Icon + Name Tag -->
        <div class="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5">
          <div class="w-5 h-5 rounded-lg border border-white/20">
            <img src="${mod.hero_icon || 'assets/heroes/dota2_logo_symbol.png'}" class="w-full h-full object-cover">
          </div>
          <span class="px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-slate-200 backdrop-blur-sm border border-white/10">
            ${mod.hero}
          </span>
        </div>

        <!-- Favorite Heart -->
        <button 
          onclick="event.stopPropagation(); toggleFavorite('${mod.id}')"
          class="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-xl bg-black/60 hover:bg-black/90 text-slate-300 flex items-center justify-center transition-all ${isFav ? 'text-red-400' : 'hover:text-red-400'}"
          title="${isFav ? (isEn ? 'Remove from favorites' : 'Удалить из избранного') : (isEn ? 'Add to favorites' : 'Добавить в избранное')}"
        >
          <i class="${isFav ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-xs"></i>
        </button>

        <!-- Badges -->
        <div class="absolute bottom-2.5 left-2.5 z-10 flex items-center space-x-1">
          ${isBg ? `
            <span class="px-2 py-0.5 rounded-lg ${isBgVid ? 'bg-rose-950/90 text-rose-300 border-rose-500/40' : 'bg-sky-950/90 text-sky-300 border-sky-500/40'} border text-[10px] font-bold flex items-center gap-1 shadow-md backdrop-blur-sm">
              <i class="fa-solid ${isBgVid ? 'fa-video' : 'fa-image'} text-[9px]"></i>
              <span>${isBgVid ? (isEn ? 'Видео' : 'Видео') : (isEn ? 'Картинка' : 'Картинка')}</span>
            </span>
          ` : ''}
          ${mod.has_effects ? `<span class="px-1.5 py-0.5 rounded-lg bg-slate-900/80 border border-indigo-500/30 text-[9px] text-indigo-300">FX</span>` : ''}
          ${mod.has_icons ? `<span class="px-1.5 py-0.5 rounded-lg bg-slate-900/80 border border-blue-500/30 text-[9px] text-blue-300">${isEn ? 'Icons' : 'Иконки'}</span>` : ''}
        </div>

        ${isInstalled ? `
        <!-- Installed Badge -->
        <div class="installed-mod-badge absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 shadow-md shadow-emerald-950/40 backdrop-blur-sm">
          <i class="fa-solid fa-circle-check text-[9px] text-emerald-400"></i>
          <span>${isEn ? 'In Game' : 'В игре'}</span>
        </div>
        ` : `
        <!-- Size -->
        <div class="absolute bottom-2.5 right-2.5 z-10 bg-black/70 px-2 py-0.5 rounded-lg text-[10px] text-slate-300 font-mono">
          ${mod.file_size || '35 MB'}
        </div>
        `}
      </div>

      <!-- Body -->
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onclick="openModDetail('${mod.id}')" 
            class="text-sm font-semibold text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors cursor-pointer truncate" 
            title="${mod.title}"
          >
            ${mod.title}
          </h3>
          <div class="text-slate-400 text-[11px] flex items-center space-x-2 mb-3">
            <span>${getCategoryTitle(mod.category)}${isBg ? ` • ${isBgVid ? (isEn ? 'Видео' : 'Видео') : (isEn ? 'Картинка' : 'Картинка')}` : ''}</span>
            <span class="text-slate-600">•</span>
            <span class="text-slate-500 truncate max-w-[100px]">${mod.author || 'Steam'}</span>
          </div>
        </div>

        <!-- Action Buttons (Dedicated Preview + Download) -->
        <div class="flex items-center gap-2 pt-2.5 border-t border-white/5">
          <button 
            onclick="openModDetail('${mod.id}')"
            class="flex-1 py-2 px-2.5 rounded-xl bg-[#161a28] hover:bg-indigo-600/30 text-slate-200 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/40 text-xs font-semibold text-center transition-all flex items-center justify-center space-x-1.5 group/prevBtn"
            title="${isEn ? 'Open details and preview' : 'Открыть подробный предпросмотр'}"
          >
            <i class="fa-solid ${(mod.category === 'mega-kill' || mod.category === 'hero-sounds') ? 'fa-volume-high text-indigo-400' : 'fa-eye text-indigo-400'} text-[11px] group-hover/prevBtn:scale-110 transition-transform"></i>
            <span>${(mod.category === 'mega-kill' || mod.category === 'hero-sounds') ? (isEn ? 'Audio' : 'Озвучка') : (isEn ? 'Preview' : 'Превью')}</span>
          </button>
          
          ${isInstalled ? `
          <button 
            onclick="uninstallModDirectly('${mod.id}', '${(mod.title || '').replace(/'/g, "\\'")}', this)"
            class="group/delBtn flex-1 py-2 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-rose-600/25 text-emerald-300 hover:text-rose-200 border border-emerald-500/35 hover:border-rose-500/50 text-xs font-semibold text-center transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
            title="${isEn ? 'Click to uninstall mod' : 'Нажмите, чтобы удалить мод'}"
          >
            <i class="fa-solid fa-check text-[10px] text-emerald-300 group-hover/delBtn:hidden"></i>
            <i class="fa-solid fa-trash-can text-[10px] text-rose-300 hidden group-hover/delBtn:inline"></i>
            <span class="group-hover/delBtn:hidden" data-i18n="installed">${isEn ? 'Installed' : 'Установлен'}</span>
            <span class="hidden group-hover/delBtn:inline" data-i18n="uninstall">${isEn ? 'Uninstall' : 'Удалить'}</span>
          </button>
          ` : `
          <button 
            onclick="installModDirectly('${mod.id}', '${(mod.title || '').replace(/'/g, "\\'")}', '${mod.download_url}', this)"
            class="btn-shimmer flex-1 py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold text-center transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-indigo-600/20 active:scale-95"
            title="${isEn ? 'Install mod' : 'Установить мод'}"
          >
            <i class="fa-solid fa-download text-[10px]"></i>
            <span data-i18n="download">${isEn ? 'Download' : 'Скачать'}</span>
          </button>
          `}
        </div>

      </div>

    </div>
  `;
}

function createHeroCardTileHTML(hero) {
  const isEn = (window.currentAppLanguage === 'en');
  return `
    <div 
      onclick="filterByHero('${hero.key.replace(/'/g, "\\'")}')" 
      class="hero-card-tile p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between group cursor-pointer"
    >
      <div class="flex items-start justify-between mb-3.5">
        <div class="hero-card-avatar w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-indigo-500/40 shadow shrink-0">
          <img 
            src="${hero.icon}" 
            alt="${hero.name}" 
            class="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onerror="this.src='assets/heroes/dota2_logo_symbol.png'"
          >
        </div>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
          ${hero.count}
        </span>
      </div>

      <div>
        <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors truncate mb-1" title="${hero.name}">
          ${hero.name}
        </h3>
        <div class="flex items-center justify-between pt-2 border-t border-white/5">
          <span class="text-[11px] sm:text-xs text-slate-400 font-mono">
            ${hero.count} ${getNoun(hero.count, 'скин', 'скина', 'скинов')}
          </span>
          <span class="text-[10px] sm:text-xs text-indigo-400 group-hover:text-indigo-300 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            <span>${isEn ? 'View' : 'Смотреть'}</span>
            <i class="fa-solid fa-chevron-right text-[8px] sm:text-[9px]"></i>
          </span>
        </div>
      </div>
    </div>
  `;
}

function createItemCardTileHTML(item) {
  const isEn = (window.currentAppLanguage === 'en');
  return `
    <div 
      onclick="filterByItem('${item.key.replace(/'/g, "\\'")}')" 
      class="hero-card-tile p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between group cursor-pointer"
    >
      <div class="flex items-start justify-between mb-3.5">
        <div class="hero-card-avatar w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-indigo-500/40 shadow shrink-0 flex items-center justify-center p-1">
          <img 
            src="${item.icon}" 
            alt="${item.name}" 
            class="w-full h-full object-contain"
            loading="lazy"
            decoding="async"
            onerror="this.src='assets/items/tpscroll.png'"
          >
        </div>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
          ${item.count}
        </span>
      </div>

      <div>
        <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors truncate mb-1" title="${item.name}">
          ${item.name}
        </h3>
        <div class="flex items-center justify-between pt-2 border-t border-white/5">
          <span class="text-[11px] sm:text-xs text-slate-400 font-mono">
            ${item.count} ${getNoun(item.count, 'эффект', 'эффекта', 'эффектов')}
          </span>
          <span class="text-[10px] sm:text-xs text-indigo-400 group-hover:text-indigo-300 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            <span>${isEn ? 'View' : 'Смотреть'}</span>
            <i class="fa-solid fa-chevron-right text-[8px] sm:text-[9px]"></i>
          </span>
        </div>
      </div>
    </div>
  `;
}

function createHeroListRowHTML(hero) {
  const isEn = (window.currentAppLanguage === 'en');
  return `
    <div 
      onclick="filterByHero('${hero.key.replace(/'/g, "\\'")}')" 
      class="hero-list-row p-3 rounded-2xl bg-[#12151e] hover:bg-[#161a26] border border-white/5 hover:border-indigo-500/30 flex items-center justify-between gap-3 cursor-pointer group transition-all"
    >
      <div class="flex items-center space-x-3.5 min-w-0">
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-indigo-500/40 shadow shrink-0">
          <img 
            src="${hero.icon}" 
            alt="${hero.name}" 
            class="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onerror="this.src='assets/heroes/dota2_logo_symbol.png'"
          >
        </div>
        <div class="min-w-0">
          <h3 class="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate" title="${hero.name}">
            ${hero.name}
          </h3>
          <span class="text-[10px] sm:text-[11px] text-slate-400 font-mono">
            ${hero.count} ${getNoun(hero.count, 'скин', 'скина', 'скинов')}
          </span>
        </div>
      </div>
      <div class="flex items-center space-x-2 shrink-0">
        <span class="px-3 py-1.5 rounded-xl bg-white/[0.04] group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-300 border border-white/5 group-hover:border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all">
          <span>${isEn ? 'View' : 'Смотреть'}</span>
          <i class="fa-solid fa-chevron-right text-[9px]"></i>
        </span>
      </div>
    </div>
  `;
}

function createItemListRowHTML(item) {
  const isEn = (window.currentAppLanguage === 'en');
  return `
    <div 
      onclick="filterByItem('${item.key.replace(/'/g, "\\'")}')" 
      class="hero-list-row p-3 rounded-2xl bg-[#12151e] hover:bg-[#161a26] border border-white/5 hover:border-indigo-500/30 flex items-center justify-between gap-3 cursor-pointer group transition-all"
    >
      <div class="flex items-center space-x-3.5 min-w-0">
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-indigo-500/40 shadow shrink-0 flex items-center justify-center p-1">
          <img 
            src="${item.icon}" 
            alt="${item.name}" 
            class="w-full h-full object-contain"
            loading="lazy"
            decoding="async"
            onerror="this.src='assets/items/tpscroll.png'"
          >
        </div>
        <div class="min-w-0">
          <h3 class="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate" title="${item.name}">
            ${item.name}
          </h3>
          <span class="text-[10px] sm:text-[11px] text-slate-400 font-mono">
            ${item.count} ${getNoun(item.count, 'эффект', 'эффекта', 'эффектов')}
          </span>
        </div>
      </div>
      <div class="flex items-center space-x-2 shrink-0">
        <span class="px-3 py-1.5 rounded-xl bg-white/[0.04] group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-300 border border-white/5 group-hover:border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all">
          <span>${isEn ? 'View' : 'Смотреть'}</span>
          <i class="fa-solid fa-chevron-right text-[9px]"></i>
        </span>
      </div>
    </div>
  `;
}

function createModListRowHTML(mod) {
  const isFav = favorites.includes(mod.id);
  const isInstalled = window.isModInstalled ? window.isModInstalled(mod) : false;
  const isEn = (window.currentAppLanguage === 'en');
  const categoryTitle = getCategoryTitle(mod.category);
  const isBg = mod.category === 'backgrounds';
  const isBgVid = isBg && (typeof window.isBackgroundVideo === 'function' ? window.isBackgroundVideo(mod) : false);

  return `
    <div class="mod-list-row p-3 rounded-2xl bg-[#12151e] hover:bg-[#161a26] border ${isInstalled ? 'border-emerald-500/30' : 'border-white/5'} hover:border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-all">
      <div class="flex items-center space-x-3.5 min-w-0">
        <!-- Thumbnail -->
        <div 
          onclick="openImageLightbox('${mod.preview}', '${(mod.title || '').replace(/'/g, "\\'")}')" 
          class="w-16 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 cursor-pointer relative group/thumb"
          title="${isEn ? 'Click to zoom photo' : 'Нажмите для увеличения фото'}"
        >
          <img src="${mod.preview}" alt="${mod.title}" class="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform" loading="lazy" decoding="async" onerror="this.src='assets/heroes/dota2_logo_symbol.png'">
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
            <i class="fa-solid fa-magnifying-glass-plus text-white text-xs"></i>
          </div>
        </div>

        <!-- Info -->
        <div class="min-w-0">
          <div class="flex items-center space-x-2">
            <h3 
              onclick="openModDetail('${mod.id}')" 
              class="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer truncate" 
              title="${mod.title}"
            >
              ${mod.title}
            </h3>
            ${isBg ? `<span class="px-1.5 py-0.5 rounded-md ${isBgVid ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-sky-500/20 text-sky-300 border-sky-500/30'} border text-[9px] font-bold shrink-0 flex items-center gap-1"><i class="fa-solid ${isBgVid ? 'fa-video' : 'fa-image'} text-[8px]"></i>${isBgVid ? (isEn ? 'Видео' : 'Видео') : (isEn ? 'Картинка' : 'Картинка')}</span>` : ''}
            ${mod.has_effects ? `<span class="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold shrink-0">FX</span>` : ''}
            ${isInstalled ? `<span class="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold shrink-0">${isEn ? 'In Game' : 'В игре'}</span>` : ''}
          </div>
          <div class="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
            <span class="px-1.5 py-0.2 rounded bg-white/5 text-slate-300 font-medium">${categoryTitle}${isBg ? ` • ${isBgVid ? (isEn ? 'Видео' : 'Видео') : (isEn ? 'Картинка' : 'Картинка')}` : ''}</span>
            <span>•</span>
            <span class="truncate">${mod.hero || 'Dota 2'}</span>
            ${mod.author ? `<span>•</span><span class="text-slate-500 truncate max-w-[120px]">${mod.author}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
        <!-- Favorite Heart -->
        <button 
          onclick="toggleFavorite('${mod.id}')" 
          class="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 ${isFav ? 'text-red-400' : 'text-slate-400 hover:text-red-400'} border border-white/5 text-xs transition-all" 
          title="${isFav ? (isEn ? 'Remove from favorites' : 'Удалить из избранного') : (isEn ? 'Add to favorites' : 'В избранное')}"
        >
          <i class="${isFav ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-[11px]"></i>
        </button>

        <!-- Preview Modal Button -->
        <button 
          onclick="openModDetail('${mod.id}')" 
          class="px-3 py-1.5 rounded-xl bg-[#161a28] hover:bg-indigo-600/30 text-slate-200 hover:text-indigo-300 border border-white/10 text-xs font-semibold transition-all flex items-center space-x-1.5"
          title="${isEn ? 'Info' : 'Подробно'}"
        >
          <i class="fa-solid fa-eye text-indigo-400 text-[10px]"></i>
          <span class="hidden sm:inline">${isEn ? 'Info' : 'Инфо'}</span>
        </button>

        ${isInstalled ? `
        <button 
          onclick="uninstallModDirectly('${mod.id}', '${(mod.title || '').replace(/'/g, "\\'")}', this)"
          class="group/delBtn px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-rose-600/25 text-emerald-300 hover:text-rose-200 border border-emerald-500/35 hover:border-rose-500/50 text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-sm active:scale-95"
          title="${isEn ? 'Click to uninstall mod' : 'Нажмите, чтобы удалить мод'}"
        >
          <i class="fa-solid fa-check text-[10px] text-emerald-300 group-hover/delBtn:hidden"></i>
          <i class="fa-solid fa-trash-can text-[10px] text-rose-300 hidden group-hover/delBtn:inline"></i>
          <span class="group-hover/delBtn:hidden" data-i18n="installed">${isEn ? 'Installed' : 'Установлен'}</span>
          <span class="hidden group-hover/delBtn:inline" data-i18n="uninstall">${isEn ? 'Uninstall' : 'Удалить'}</span>
        </button>
        ` : `
        <button 
          onclick="installModDirectly('${mod.id}', '${(mod.title || '').replace(/'/g, "\\'")}', '${mod.download_url}', this)"
          class="btn-shimmer px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all flex items-center space-x-1.5 active:scale-95"
          title="${isEn ? 'Download and install mod' : 'Скачать и установить мод'}"
        >
          <i class="fa-solid fa-download text-[10px]"></i>
          <span data-i18n="download">${isEn ? 'Download' : 'Скачать'}</span>
        </button>
        `}
      </div>
    </div>
  `;
}

function getAttributeName(attr) {
  const isEn = (window.currentAppLanguage === 'en');
  const mapRu = {
    'strength': 'Сила',
    'agility': 'Ловкость',
    'intelligence': 'Интеллект',
    'universal': 'Универсал'
  };
  const mapEn = {
    'strength': 'Strength',
    'agility': 'Agility',
    'intelligence': 'Intelligence',
    'universal': 'Universal'
  };
  const map = isEn ? mapEn : mapRu;
  return map[attr] || 'Dota 2';
}

function getCategoryTitle(cat) {
  const isEn = (window.currentAppLanguage === 'en');
  const mapRu = {
    'heroes': 'Скин героя',
    'hero-items': 'Предмет героя',
    'high-five': 'High five (Дай пять)',
    'attack-fx': 'Эффекты атаки',
    'hero-sounds': 'Звуки героя',
    'mega-kill': 'Озвучка игры',
    'shaders': 'Шейдеры',
    'herofx': 'Эффекты (FX)',
    'packs': 'Готовые паки',
    'creeps': 'Крипы',
    'creep-deny': 'Денай крипов',
    'wards': 'Варды',
    'couriers': 'Курьеры',
    'terrains': 'Карты и ландшафт',
    'river': 'Реки',
    'trees': 'Виды деревьев',
    'versus-screens': 'Версус экраны',
    'backgrounds': 'Фоны меню',
    'huds': 'Интерфейс (HUD)',
    'fonts': 'Шрифты',
    'pedestal': 'Пьедесталы',
    'parts': 'Элементы UI',
    'ranks': 'Ранги и медали',
    'sounds': 'Звуковые моды',
    'other': 'Прочее',
    'sets': 'Наборы сетов'
  };
  const mapEn = {
    'heroes': 'Hero Skin',
    'hero-items': 'Hero Item',
    'high-five': 'High Five Effects',
    'attack-fx': 'Attack Effects',
    'hero-sounds': 'Hero Sounds',
    'mega-kill': 'Announcers',
    'shaders': 'Shaders',
    'herofx': 'Effects (FX)',
    'packs': 'Ready Packs',
    'creeps': 'Creeps',
    'creep-deny': 'Creep Deny',
    'wards': 'Wards',
    'couriers': 'Couriers',
    'terrains': 'Terrains & Maps',
    'river': 'Rivers',
    'trees': 'Trees',
    'versus-screens': 'Versus Screens',
    'backgrounds': 'Menu Backgrounds',
    'huds': 'HUD & Interface',
    'fonts': 'Fonts',
    'pedestal': 'Pedestals',
    'parts': 'UI Elements',
    'ranks': 'Rank Medals',
    'sounds': 'Sound Mods',
    'other': 'Other',
    'sets': 'Item Sets'
  };
  const map = isEn ? mapEn : mapRu;
  return map[cat] || (isEn ? 'Mod' : 'Мод');
}

window.toggleFavorite = function(modId) {
  if (favorites.includes(modId)) {
    favorites = favorites.filter(id => id !== modId);
  } else {
    favorites.push(modId);
  }
  localStorage.setItem('dotamod_favs', JSON.stringify(favorites));
  updateFavBadge();
  renderMods();
};

function updateFavBadge() {
  if (favCountBadge) {
    favCountBadge.textContent = favorites.length;
    favCountBadge.style.display = favorites.length > 0 ? 'inline-flex' : 'none';
  }
}

// Image Lightbox Functions (Pure expanded image view on clicking card pictures)
window.openImageLightbox = function(src, title) {
  const modal = document.getElementById('imageLightboxModal');
  const img = document.getElementById('imageLightboxImg');
  const titleEl = document.getElementById('imageLightboxTitle');
  const fullLink = document.getElementById('imageLightboxFullLink');

  if (!modal || !img) return;

  img.src = src;
  img.style.transform = 'scale(1)';
  img.classList.remove('cursor-zoom-out');
  img.classList.add('cursor-zoom-in');
  isLightboxZoomed = false;

  img.onerror = () => {
    const matched = (window.allMods || []).find(m => m.preview === src || m.title === title);
    if (matched && matched.remote_preview && img.src !== matched.remote_preview) {
      img.src = matched.remote_preview;
    } else {
      img.src = 'assets/heroes/dota2_logo_symbol.png';
    }
  };

  if (titleEl) titleEl.textContent = title || 'Изображение скина';
  if (fullLink) fullLink.href = src;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeImageLightbox = function() {
  const modal = document.getElementById('imageLightboxModal');
  if (modal) modal.classList.add('hidden');
  const modModal = document.getElementById('modModal');
  const guideModal = document.getElementById('guideModal');
  const favModal = document.getElementById('favModal');
  if ((!modModal || modModal.classList.contains('hidden')) && 
      (!guideModal || guideModal.classList.contains('hidden')) && 
      (!favModal || favModal.classList.contains('hidden'))) {
    document.body.style.overflow = 'auto';
  }
};

window.toggleLightboxZoom = function(imgEl) {
  isLightboxZoomed = !isLightboxZoomed;
  if (isLightboxZoomed) {
    imgEl.style.transform = 'scale(1.45)';
    imgEl.classList.remove('cursor-zoom-in');
    imgEl.classList.add('cursor-zoom-out');
  } else {
    imgEl.style.transform = 'scale(1)';
    imgEl.classList.remove('cursor-zoom-out');
    imgEl.classList.add('cursor-zoom-in');
  }
};

const HERO_SOUND_MAP = {
  "dire-shred": {"id":"dire-shred","title":"Dire Shred Metal Riff","hero":"Music","file":"audio/hero-sounds/dire-shred.mp3","type":"audio","icon":"fa-guitar"},
  "ussr-and-germany-horn": {"id":"ussr-and-germany-horn","title":"Гимн СССР (Трубный горн)","hero":"Dota 2","file":"audio/hero-sounds/ussr-and-germany-horn.mp3","type":"audio","icon":"fa-bullhorn"},
  "tormentor-amor": {"id":"tormentor-amor","title":"Tormentor: Amor Amor Amor","hero":"Dota 2","file":"audio/hero-sounds/Tormentor Amor.mp4","type":"video","icon":"fa-shield-halved"},
  "stairs-guy-main-menu": {"id":"stairs-guy-main-menu","title":"Мужик на лестнице (Мем)","hero":"Dota 2","file":"audio/hero-sounds/stairs-guy-main-menu.mp3","type":"audio","icon":"fa-stairs"},
  "sora-main-menu": {"id":"sora-main-menu","title":"Sora Main Menu Theme","hero":"Dota 2","file":"audio/hero-sounds/sora-main-menu.mp3","type":"audio","icon":"fa-music"},
  "rezero-subaru-phone-horn": {"id":"rezero-subaru-phone-horn","title":"Рингтон Субару (Re:Zero)","hero":"Dota 2","file":"audio/hero-sounds/rezero-subaru-phone-horn.mp3","type":"audio","icon":"fa-mobile-screen"},
  "rezero-respawn-sound": {"id":"rezero-respawn-sound","title":"Зов Ведьмы (Return by Death)","hero":"Dota 2","file":"audio/hero-sounds/ReZero Respawn Sound.mp4","type":"video","icon":"fa-skull-crossbones"},
  "flash-step-blink": {"id":"flash-step-blink","title":"Сюнпо (Flash Step Bleach)","hero":"Dota 2","file":"audio/hero-sounds/Flash Step Blink.mp4","type":"video","icon":"fa-bolt"},
  "dragon-ball-blink": {"id":"dragon-ball-blink","title":"Телепортация (Instant Transmission)","hero":"Dota 2","file":"audio/hero-sounds/dragon-ball-blink.mp3","type":"audio","icon":"fa-dragon"},
  "dark-carnival-team-spirit": {"id":"dark-carnival-team-spirit","title":"Team Spirit TI Anthem","hero":"Dota 2","file":"audio/hero-sounds/Dark Carnival Team Spirit.mp4","type":"video","icon":"fa-trophy"},
  "dark-carnival-serega-pirat": {"id":"dark-carnival-serega-pirat","title":"Серёга Пират (Dark Carnival)","hero":"Dota 2","file":"audio/hero-sounds/Dark Carnival Serega Pirat.mp4","type":"video","icon":"fa-skull"},
  "dark-carnival-dora": {"id":"dark-carnival-dora","title":"Дора — Втюрилась","hero":"Dota 2","file":"audio/hero-sounds/Dark Carnival Dora.mp4","type":"video","icon":"fa-heart"},
  "dagon-revolver": {"id":"dagon-revolver","title":"Выстрел R8 Revolver","hero":"Dota 2","file":"audio/hero-sounds/Dagon Revolver.mp4","type":"video","icon":"fa-gun"},
  "dagon-cobra-kick": {"id":"dagon-cobra-kick","title":"Cobra Kai Kick Strike","hero":"Dota 2","file":"audio/hero-sounds/dagon-cobra-kick.mp3","type":"audio","icon":"fa-hand-fist"},
  "dagon-awp": {"id":"dagon-awp","title":"Выстрел AWP CS:GO","hero":"Dota 2","file":"audio/hero-sounds/Dagon AWP.mp4","type":"video","icon":"fa-crosshairs"},
  "1st-september-horn": {"id":"1st-september-horn","title":"Школьный звонок (1 Сентября)","hero":"Dota 2","file":"audio/hero-sounds/1st-september-horn.mp3","type":"audio","icon":"fa-bell"},
  "magic-sticks-of-dynamite": {"id":"magic-sticks-of-dynamite","title":"AWOLNATION Dynamite Beat","hero":"Music","file":"audio/hero-sounds/magic-sticks-of-dynamite.mp3","type":"audio","icon":"fa-bomb"},
  "the-international-2019": {"id":"the-international-2019","title":"TI9 Симфоническая тема","hero":"Music","file":"audio/hero-sounds/the-international-2019.mp3","type":"audio","icon":"fa-medal"},
  "sound-largo-serega-pirat": {"id":"sound-largo-serega-pirat","title":"Slark: Largo Серёга Пират","hero":"Slark","file":"audio/hero-sounds/Largo_Serega_Pirat.mp4","type":"video","icon":"fa-water"},
  "sound-largo-serega-pirat-v2": {"id":"sound-largo-serega-pirat-v2","title":"Slark: Largo Серёга Пират v2","hero":"Slark","file":"audio/hero-sounds/Largo_Serega_Pirat_v2.mp4","type":"video","icon":"fa-water"},
  "sound-witch-doctor-true-maledict": {"id":"sound-witch-doctor-true-maledict","title":"Witch Doctor: True Maledict","hero":"Witch Doctor","file":"audio/hero-sounds/Witch Doctor True Maledict.mp4","type":"video","icon":"fa-skull"},
  "sound-naga-siren-serega-pirat": {"id":"sound-naga-siren-serega-pirat","title":"Naga Siren: Серёга Пират","hero":"Naga Siren","file":"audio/hero-sounds/Naga Siren Serega Pirat.mp4","type":"video","icon":"fa-music"},
  "sound-lion-taunt": {"id":"sound-lion-taunt","title":"Lion: Насмешка (Taunt)","hero":"Lion","file":"audio/hero-sounds/Lion Taunt.mp4","type":"video","icon":"fa-hand-peace"},
  "sound-shadow-shaman-taunt": {"id":"sound-shadow-shaman-taunt","title":"Shadow Shaman: Насмешка","hero":"Shadow Shaman","file":"audio/hero-sounds/Shadow Shaman Taunt.mp4","type":"video","icon":"fa-mask"},
  "sound-undying-taunt": {"id":"sound-undying-taunt","title":"Undying: Насмешка (Taunt)","hero":"Undying","file":"audio/hero-sounds/Undying Taunt.mp4","type":"video","icon":"fa-skull"},
  "sound-enigma-black-hole-kate": {"id":"sound-enigma-black-hole-kate","title":"Enigma: Black Hole (Катя)","hero":"Enigma","file":"audio/hero-sounds/Enigma Black Hole Kate.mp4","type":"video","icon":"fa-circle-dot"},
  "sound-kunkka-sailor-taunt": {"id":"sound-kunkka-sailor-taunt","title":"Kunkka: Моряцкая насмешка","hero":"Kunkka","file":"audio/hero-sounds/Kunkka Sailor Taunt.mp4","type":"video","icon":"fa-anchor"},
  "sound-nature-prophet-taunt": {"id":"sound-nature-prophet-taunt","title":"Фурион: Насмешка","hero":"Natures Prophet","file":"audio/hero-sounds/Nature Prophet Taunt.mp4","type":"video","icon":"fa-tree"},
  "sound-witch-doctor-death-ward": {"id":"sound-witch-doctor-death-ward","title":"Witch Doctor: Death Ward","hero":"Witch Doctor","file":"audio/hero-sounds/Witch Doctor Death Ward.mp4","type":"video","icon":"fa-wand-magic-sparkles"},
  "sound-spirit-breaker-beer": {"id":"sound-spirit-breaker-beer","title":"Баратрум: Разгон с пивом","hero":"Spirit Breaker","file":"audio/hero-sounds/Spirit Breaker Beer.mp4","type":"video","icon":"fa-beer-mug-empty"},
  "sound-axe-rip-your-head": {"id":"sound-axe-rip-your-head","title":"Axe: Я оторву тебе башку!","hero":"Axe","file":"audio/hero-sounds/Axe Rip Your Head.mp4","type":"video","icon":"fa-gavel"},
  "sound-sven-already-red": {"id":"sound-sven-already-red","title":"Sven: Я уже красный!","hero":"Sven","file":"audio/hero-sounds/Sven Already Red.mp4","type":"video","icon":"fa-fire"},
  "sound-ursa-already-red": {"id":"sound-ursa-already-red","title":"Ursa: Я уже красный!","hero":"Ursa","file":"audio/hero-sounds/Ursa Already Red.mp4","type":"video","icon":"fa-paw"},
  "sound-invoker-andrey-sun-strike": {"id":"sound-invoker-andrey-sun-strike","title":"Инвокер: Андрей! Sun Strike","hero":"Invoker","file":"audio/hero-sounds/Invoker Andrey Sun Strike.mp4","type":"video","icon":"fa-sun"},
  "sound-terrorblade-cursed-metamorphosis": {"id":"sound-terrorblade-cursed-metamorphosis","title":"ТБ: Cursed Metamorphosis","hero":"Terrorblade","file":"audio/hero-sounds/Terrorblade Cursed Metamorphosis.mp4","type":"video","icon":"fa-ghost"},
  "sound-bane-sleep-mimimi": {"id":"sound-bane-sleep-mimimi","title":"Bane: Nightmare Ми-ми-ми","hero":"Bane","file":"audio/hero-sounds/Bane Sleep Mimimi.mp4","type":"video","icon":"fa-moon"},
  "sound-bounty-hunter-taunt": {"id":"sound-bounty-hunter-taunt","title":"Bounty Hunter: Насмешка","hero":"Bounty Hunter","file":"audio/hero-sounds/Bounty Hunter Taunt.mp4","type":"video","icon":"fa-coins"},
  "sound-io-relocate-rocket": {"id":"sound-io-relocate-rocket","title":"IO: Relocate Ракета","hero":"Io","file":"audio/hero-sounds/IO Relocate Rocket.mp4","type":"video","icon":"fa-shuttle-space"},
  "sound-hoodwink-taunt": {"id":"sound-hoodwink-taunt","title":"Hoodwink: Насмешка (Taunt)","hero":"Hoodwink","file":"audio/hero-sounds/Hoodwink Taunt.mp4","type":"video","icon":"fa-feather"},
  "sound-shadow-fiend-taunt": {"id":"sound-shadow-fiend-taunt","title":"СФ: Насмешка с койлами","hero":"Shadow Fiend","file":"audio/hero-sounds/Shadow Fiend Taunt.mp4","type":"video","icon":"fa-fire-flame-curved"},
  "sound-anti-mage-taunt": {"id":"sound-anti-mage-taunt","title":"Anti-Mage: Насмешка","hero":"Anti-Mage","file":"audio/hero-sounds/Anti-Mage Taunt.mp4","type":"video","icon":"fa-shield"},
  "sound-ogre-magi-taunt": {"id":"sound-ogre-magi-taunt","title":"Ogre Magi: Танец-насмешка","hero":"Ogre Magi","file":"audio/hero-sounds/Ogre Magi Taunt.mp4","type":"video","icon":"fa-dice"},
  "sound-hirako-shinji-mars-arena": {"id":"sound-hirako-shinji-mars-arena","title":"Марс: Арена Хирако Синдзи","hero":"Mars","file":"audio/hero-sounds/Hirako Shinji Mars Arena.mp4","type":"video","icon":"fa-shield"},
  "sound-axe-ultimate-clap-clap": {"id":"sound-axe-ultimate-clap-clap","title":"Axe: Clap Clap (Culling Blade)","hero":"Axe","file":"audio/hero-sounds/Axe Ultimate Clap Clap.mp4","type":"video","icon":"fa-hands-clapping"},
  "sound-mars-spear-i-forgive-you": {"id":"sound-mars-spear-i-forgive-you","title":"Mars: Я прощаю тебя (Копьё)","hero":"Mars","file":"audio/hero-sounds/Mars Spear I Forgive You.mp4","type":"video","icon":"fa-bullseye"},
  "sound-sniper-ultimate-headshot": {"id":"sound-sniper-ultimate-headshot","title":"Снайпер: Headshot Ultimate","hero":"Sniper","file":"audio/hero-sounds/Sniper Ultimate Headshot.mp4","type":"video","icon":"fa-crosshairs"},
  "sound-tusk-shards-got-taunt": {"id":"sound-tusk-shards-got-taunt","title":"Tusk: Насмешка с шардами","hero":"Tusk","file":"audio/hero-sounds/Tusk Shards Got Taunt.mp4","type":"video","icon":"fa-snowflake"},
  "sound-brewmaster-kishmesh-amor": {"id":"sound-brewmaster-kishmesh-amor","title":"Brewmaster: Кишмиш Amor","hero":"Brewmaster","file":"audio/hero-sounds/Brewmaster Kishmesh Amor.mp4","type":"video","icon":"fa-beer-mug-empty"},
  "sound-techies-bismillah-blast-off": {"id":"sound-techies-bismillah-blast-off","title":"Течис: Bismillah Blast Off!","hero":"Techies","file":"audio/hero-sounds/Techies Bismillah Blast Off!.mp4","type":"video","icon":"fa-bomb"},
  "sound-enigma-black-hole-kate-scream": {"id":"sound-enigma-black-hole-kate-scream","title":"Enigma: Крик Кати Black Hole","hero":"Enigma","file":"audio/hero-sounds/Enigma Black Hole Kate Scream.mp4","type":"video","icon":"fa-circle-notch"},
  "sound-centaur-otday": {"id":"sound-centaur-otday","title":"Centaur: Отдай! (Stampede)","hero":"Centaur Warrunner","file":"audio/hero-sounds/Centaur Otday.mp4","type":"video","icon":"fa-horse"},
  "sound-dili-tili-bom-pudge": {"id":"sound-dili-tili-bom-pudge","title":"Pudge: Тили-тили-бом","hero":"Pudge","file":"audio/hero-sounds/pudge-dili-tili-bom.mp3","type":"audio","icon":"fa-drumstick-bite"},
  "sound-shadow-fiend-desire-requiem": {"id":"sound-shadow-fiend-desire-requiem","title":"СФ: Requiem of Souls (Desire)","hero":"Shadow Fiend","file":"audio/hero-sounds/sf-desire-requiem.mp3","type":"audio","icon":"fa-fire"},
  "sound-naga-siren-growth-correction": {"id":"sound-naga-siren-growth-correction","title":"Naga Siren: Growth Correction","hero":"Naga Siren","file":"audio/hero-sounds/naga-growth-correction.mp3","type":"audio","icon":"fa-wand-magic"},
};


window.playHeroSound = function(file, title, lineId = 'main_sound') {
  stopVoiceLine();

  currentPlayingId = lineId;
  updateAudioUI(true, { title: title || 'Звук мода' });

  // If there's an active video element playing this file, sync with video
  const videoSection = document.getElementById('modalMediaVideoContainer');
  const videoEl = document.getElementById('modalMediaVideo');
  if (file.endsWith('.mp4') && videoSection && !videoSection.classList.contains('hidden') && videoEl) {
    const filename = file.split('/').pop();
    if (videoEl.src && decodeURI(videoEl.src).includes(filename)) {
      videoEl.currentTime = 0;
      videoEl.volume = currentAudioVolume;
      videoEl.muted = false;
      videoEl.play().catch(() => {});
      videoEl.onended = () => {
        currentPlayingId = null;
        updateAudioUI(false);
      };
      return;
    }
  }

  currentAudio = new Audio(file);
  currentAudio.volume = currentAudioVolume;
  currentAudio.onended = () => {
    currentPlayingId = null;
    updateAudioUI(false);
  };
  currentAudio.onerror = () => {
    currentPlayingId = null;
    updateAudioUI(false);
  };
  currentAudio.play().catch(() => {
    currentPlayingId = null;
    updateAudioUI(false);
  });
};

// Character Key Detection for Announcers & Hero Sound Mods
// Character Key Detection for Announcers & Hero Sound Mods (24 Authentic Voices)
function detectCharacterKey(mod) {
  const t = ((mod.id || '') + ' ' + (mod.title || '') + ' ' + (mod.hero || '')).toLowerCase();

  if (t.includes('nedotrax')) return 'nedotrax';
  if (t.includes('siega')) return 'siega';
  if (t.includes('stray')) return 'stray228';
  if (t.includes('umbrella')) return 'umbrella';
  if (t.includes('gaben') || t.includes('gabe-newell') || t.includes('newell')) return 'gaben';
  if (t.includes('stariy') || t.includes('бог')) return 'stariybog';
  if (t.includes('portal') || t.includes('glados')) return 'glados';
  if (t.includes('rick') || t.includes('morty')) return 'rick';
  if (t.includes('darkest') || t.includes('ancestor') || t.includes('dungeon')) return 'darkest';
  if (t.includes('stanley') || t.includes('parable')) return 'stanley';
  if (t.includes('counter') || t.includes('cs 1') || t.includes('cs:go') || t.includes('cs2') || t.includes('dust')) return 'cs';
  if (t.includes('axe') && !t.includes('parallax')) return 'axe';
  if (t.includes('bristle') || t.includes('бристл')) return 'bristle';
  if (t.includes('clock') || t.includes('rattletrap')) return 'clock';
  if (t.includes('crystal') || t.includes('cm') || t.includes('рилай')) return 'cm';
  if (t.includes('lina') || t.includes('лина')) return 'lina';
  if (t.includes('jugg') || t.includes('джагг')) return 'jugg';
  if (t.includes('meepo') || t.includes('мипо')) return 'meepo';
  if (t.includes('storm') || t.includes('шторм')) return 'storm';
  if (t.includes('techies') || t.includes('течис') || t.includes('минер')) return 'techies';
  if (t.includes('pyrion') || t.includes('flax')) return 'pyrion';
  if (t.includes('deus') || t.includes('jensen')) return 'deusex';
  if (t.includes('fallout') || t.includes('handy') || t.includes('фоллаут')) return 'fallout';
  if (t.includes('monkey') || t.includes('mk') || t.includes('макака')) return 'mk';
  if (t.includes('willow') || t.includes('вилка')) return 'darkwillow';
  if (t.includes('tusk') || t.includes('таск')) return 'tusk';
  if (t.includes('kunkka') || t.includes('tide') || t.includes('кункк') || t.includes('тайд')) return 'kunkka';
  if (t.includes('prophet') || t.includes('fura') || t.includes('фурион') || t.includes('natures')) return 'fura';
  if (t.includes('quake') || t.includes('unreal')) return 'quake';
  if (t.includes('pirate') || t.includes('пират')) return 'kunkka';
  if (t.includes('defense grid')) return 'glados';
  if (t.includes('trine')) return 'darkest';
  if (t.includes('chitoge') || t.includes('kirisaki')) return 'lina';
  if (t.includes('iroha') || t.includes('isshiki')) return 'cm';
  if (t.includes('hestia')) return 'lina';
  if (t.includes('diretide') || t.includes('dire tide')) return 'axe';

  return 'default';
}

window.playCharacterLine = function(charKey, lineId, text, audioFile = null) {
  stopVoiceLine();

  currentPlayingId = lineId;
  updateAudioUI(true, { title: text || lineId });

  if (audioFile) {
    currentAudio = new Audio(audioFile);
    currentAudio.volume = currentAudioVolume;
    currentAudio.onended = () => {
      currentPlayingId = null;
      updateAudioUI(false);
    };
    currentAudio.onerror = () => {
      fallbackSpeech();
    };
    currentAudio.play().catch(() => {
      fallbackSpeech();
    });
    return;
  }

  fallbackSpeech();

  function fallbackSpeech() {
    // Web Audio Context Sound Effect (Unique to character)
    playAudioEffect(charKey);

    // Web Speech Synthesis (Personalized pitch & speed per character)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = currentAudioVolume;

      if (charKey === 'glados') {
        utterance.pitch = 1.6;
        utterance.rate = 0.95;
      } else if (charKey === 'darkest') {
        utterance.pitch = 0.65;
        utterance.rate = 0.85;
      } else if (charKey === 'rick') {
        utterance.pitch = 1.35;
        utterance.rate = 1.25;
      } else if (charKey === 'axe') {
        utterance.pitch = 0.7;
        utterance.rate = 1.15;
      } else if (charKey === 'gaben') {
        utterance.pitch = 0.85;
        utterance.rate = 0.95;
      } else if (charKey === 'cs') {
        utterance.pitch = 0.95;
        utterance.rate = 1.15;
      } else if (charKey === 'stanley') {
        utterance.pitch = 0.95;
        utterance.rate = 0.9;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.05;
      }

      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang && v.lang.startsWith('en'));
      if (engVoice) utterance.voice = engVoice;

      utterance.onend = () => {
        currentPlayingId = null;
        updateAudioUI(false);
      };
      utterance.onerror = () => {
        currentPlayingId = null;
        updateAudioUI(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        currentPlayingId = null;
        updateAudioUI(false);
      }, 1600);
    }
  }
};

// Web Audio API Synthesizer Effects (Chirp, Radio Squelch, Bass Drum, Horn, etc.)
function playAudioEffect(type) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    if (type === 'cs') {
      // Tactical Radio Beep & Transceiver Burst
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150, now);
      gain.gain.setValueAtTime(0.18 * currentAudioVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'glados') {
      // High-tech robotic chord chime
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      osc2.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.15 * currentAudioVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } else if (type === 'darkest') {
      // Deep gothic bass resonance
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.6);
      gain.gain.setValueAtTime(0.25 * currentAudioVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'rick') {
      // Cartoon laser warp
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(1400, now + 0.08);
      osc.frequency.linearRampToValueAtTime(500, now + 0.18);
      gain.gain.setValueAtTime(0.15 * currentAudioVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'axe') {
      // Battle horn saw wave
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.1);
      gain.gain.setValueAtTime(0.2 * currentAudioVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // Heroic chime
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      gain.gain.setValueAtTime(0.15 * currentAudioVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    // Non-critical if audio context not permitted
  }
}

window.stopVoiceLine = function() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  const videoEl = document.getElementById('modalMediaVideo');
  if (videoEl) {
    videoEl.pause();
  }
  currentPlayingId = null;
  updateAudioUI(false);
};

window.setAudioVolume = function(val) {
  currentAudioVolume = parseFloat(val);
  if (currentAudio) {
    currentAudio.volume = currentAudioVolume;
  }
  const videoEl = document.getElementById('modalMediaVideo');
  if (videoEl) {
    videoEl.volume = currentAudioVolume;
  }
};

function updateAudioUI(isPlaying, sample = null) {
  const visualizer = document.getElementById('audioVisualizer');
  const statusText = document.getElementById('audioStatusText');
  const nowPlaying = document.getElementById('audioNowPlaying');
  const liveDot = document.getElementById('audioLiveDot');

  if (visualizer) {
    visualizer.classList.toggle('audio-playing', isPlaying);
  }

  if (liveDot) {
    liveDot.className = isPlaying ? 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse' : 'w-2.5 h-2.5 rounded-full bg-slate-600';
  }

  if (statusText) {
    if (isPlaying && sample) {
      statusText.innerHTML = `Воспроизведение: <b class="text-white">«${sample.title}»</b>`;
    } else {
      statusText.textContent = 'Выберите фразу для воспроизведения';
    }
  }

  if (nowPlaying) {
    nowPlaying.textContent = isPlaying && sample ? `• ${sample.title}` : '';
  }

  // Update active state on buttons
  document.querySelectorAll('.sound-btn').forEach(btn => {
    const isThis = btn.dataset.soundId === currentPlayingId;
    btn.classList.toggle('playing', isThis);
    const icon = btn.querySelector('.play-state-icon');
    if (icon) {
      icon.className = isThis 
        ? 'fa-solid fa-volume-high text-indigo-400 play-state-icon' 
        : 'fa-solid fa-play text-[9px] text-slate-500 play-state-icon';
    }
  });
}

// Modal Details & Interactive Preview (Opens on [Превью] button)
window.openModDetail = function(id) {
  const mod = allMods.find(m => m.id === id);
  if (!mod) return;

  currentModalModId = id;

  // Determine current preview browsing context:
  if (currentFilteredMods && currentFilteredMods.some(m => m.id === id)) {
    currentPreviewList = currentFilteredMods;
  } else {
    currentPreviewList = allMods;
  }
  currentPreviewIndex = currentPreviewList.findIndex(m => m.id === id);

  // Set header details
  const titleEl = document.getElementById('modalTitle');
  if (titleEl) {
    titleEl.textContent = mod.title;
    titleEl.title = mod.title;
  }

  const heroEl = document.getElementById('modalHero');
  if (heroEl) heroEl.textContent = mod.hero;

  const heroIconEl = document.getElementById('modalHeroIcon');
  if (heroIconEl) {
    heroIconEl.src = mod.hero_icon || 'assets/heroes/dota2_logo_symbol.png';
    heroIconEl.onerror = () => {
      heroIconEl.src = 'assets/heroes/dota2_logo_symbol.png';
    };
  }

  const authorEl = document.getElementById('modalAuthor');
  if (authorEl) authorEl.textContent = mod.author || 'Steam Workshop';

  const sizeEl = document.getElementById('modalSize');
  if (sizeEl) sizeEl.textContent = mod.file_size || '35 MB';

  const catEl = document.getElementById('modalCategory');
  if (catEl) {
    if (mod.category === 'backgrounds') {
      const isBgVid = typeof window.isBackgroundVideo === 'function' ? window.isBackgroundVideo(mod) : false;
      const isEn = (window.currentAppLanguage === 'en');
      catEl.textContent = `${getCategoryTitle(mod.category)} • ${isBgVid ? (isEn ? 'Видео-фон (WebM)' : 'Анимированное видео') : (isEn ? 'Статичная картинка' : 'Картинка (статичный)')}`;
    } else {
      catEl.textContent = getCategoryTitle(mod.category);
    }
  }

  // Sound Mod & Preview Elements
  const isHeroSoundMod = (mod.category === 'hero-sounds');
  const hsInfo = isHeroSoundMod ? (HERO_SOUND_MAP[mod.id] || {
    id: mod.id,
    title: mod.title,
    hero: mod.hero || 'Dota 2',
    file: mod.media_preview || mod.local_audio,
    type: (mod.media_preview && mod.media_preview.endsWith('.mp4') ? 'video' : 'audio'),
    icon: 'fa-volume-high'
  }) : null;

  const isSoundMod = isHeroSoundMod ||
                     mod.category === 'mega-kill' || 
                     mod.hero === 'Announcer' || 
                     (mod.title && /announcer|mega-kill|озвучк|голос|звук/i.test(mod.title));

  const audioSection = document.getElementById('modalAudioSection');
  const videoSection = document.getElementById('modalMediaVideoContainer');
  const videoEl = document.getElementById('modalMediaVideo');
  const imgEl = document.getElementById('modalImage');

  stopVoiceLine();

  const bgVideoSrc = (mod.category === 'backgrounds') ? window.getVideoBackgroundUrl(mod) : null;

  if (isHeroSoundMod && hsInfo) {
    // 1. DEDICATED HERO SOUND MOD (Authentic Sound Effects for all 54 mods)
    const heroKey = detectCharacterKey(mod);
    const heroVoiceSet = (heroKey !== 'default' && CHARACTER_VOICE_SETS[heroKey]) ? CHARACTER_VOICE_SETS[heroKey] : null;

    if (hsInfo.type === 'video' && videoSection) {
      if (!videoSection.querySelector('video')) {
        videoSection.innerHTML = `
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-circle-play text-indigo-400"></i>
                <span>Аудио-превью (видеофрагмент)</span>
              </span>
            </div>
            <span class="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">1080p HD</span>
          </div>
          <div class="relative rounded-2xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center p-1">
            <video id="modalMediaVideo" controls playsinline class="w-full max-h-[220px] rounded-xl object-contain"></video>
          </div>
        `;
      }
      const activeVideoEl = document.getElementById('modalMediaVideo');
      if (activeVideoEl) {
        videoSection.classList.remove('hidden');
        activeVideoEl.src = encodeURI(hsInfo.file);
        activeVideoEl.volume = currentAudioVolume;
        activeVideoEl.muted = false;
        activeVideoEl.loop = false;
        activeVideoEl.load();
        activeVideoEl.play().catch(() => {});
      }
    } else if (videoSection) {
      videoSection.classList.add('hidden');
      const v = document.getElementById('modalMediaVideo');
      if (v) v.src = '';
    }

    if (audioSection) {
      audioSection.classList.remove('hidden');
      const statusText = document.getElementById('audioStatusText');
      if (statusText) statusText.textContent = `Звуковой мод: ${hsInfo.title} — оригинальный звук`;

      const audioGrid = document.getElementById('audioButtonsGrid');
      if (audioGrid) {
        let buttonsHtml = `
          <button 
            onclick="playHeroSound('${hsInfo.file}', '${hsInfo.title.replace(/'/g, "\\'")}', 'main_sound')" 
            class="sound-btn group/snd col-span-2 sm:col-span-3 md:col-span-4 bg-indigo-600/20 hover:bg-indigo-600/35 border-indigo-500/40 text-indigo-200" 
            data-sound-id="main_sound"
            title="Воспроизвести звук мода"
          >
            <span class="flex items-center space-x-2 truncate">
              <i class="fa-solid ${hsInfo.icon} text-indigo-400 text-sm group-hover/snd:scale-110 transition-transform"></i>
              <span class="font-bold text-xs truncate">▶ Слушать звук: ${hsInfo.title}</span>
            </span>
            <i class="fa-solid fa-play text-xs text-indigo-400 play-state-icon shrink-0"></i>
          </button>
        `;

        if (heroVoiceSet && heroVoiceSet.lines) {
          heroVoiceSet.lines.slice(0, 4).forEach(line => {
            buttonsHtml += `
              <button 
                onclick="playCharacterLine('${heroKey}', '${line.id}', '${line.text.replace(/'/g, "\\'")}', '${line.audio || ''}')"
                class="sound-btn group/snd" 
                data-sound-id="${line.id}"
                title="Реплика: ${line.text}"
              >
                <span class="flex items-center space-x-1.5 truncate">
                  <i class="fa-solid ${heroVoiceSet.icon} text-indigo-400 text-[11px] group-hover/snd:scale-110 transition-transform"></i>
                  <span class="truncate">${line.title}</span>
                </span>
                <i class="fa-solid fa-play text-[9px] text-slate-500 play-state-icon shrink-0"></i>
              </button>
            `;
          });
        }

        audioGrid.innerHTML = buttonsHtml;
      }
    }

    if (imgEl) {
      imgEl.className = 'max-h-[26vh] sm:max-h-[30vh] w-auto max-w-full object-contain rounded-xl shadow-xl transition-all duration-300 cursor-zoom-in';
    }
  } else if (mod.media_preview || bgVideoSrc) {
    // 1. MOD HAS VIDEO/AUDIO PREVIEW (MP4, YouTube, or WebM Background)
    const rawPreview = mod.media_preview || '';
    const ytMatch = rawPreview.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);

    if (ytMatch && videoSection) {
      // YouTube embed player
      videoSection.classList.remove('hidden');
      videoSection.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-brands fa-youtube text-red-500"></i>
              <span>${isSoundMod ? 'Аудио-превью мода' : 'Видео-демонстрация'}</span>
            </span>
          </div>
          <span class="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">YouTube HD</span>
        </div>
        <div class="relative rounded-2xl overflow-hidden bg-black/90 border border-white/10">
          <iframe class="w-full h-56 rounded-xl" src="https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
      if (audioSection) audioSection.classList.add('hidden');
    } else if (videoSection) {
      // Ensure native video tag is restored if replaced by iframe previously
      if (!videoSection.querySelector('video')) {
        videoSection.innerHTML = `
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-circle-play text-indigo-400"></i>
                <span>${isSoundMod ? 'Аудио-превью (видеофрагмент)' : 'Видео-демонстрация'}</span>
              </span>
            </div>
            <span class="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">1080p HD</span>
          </div>
          <div class="relative rounded-2xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center p-1">
            <video id="modalMediaVideo" controls playsinline class="w-full max-h-[220px] rounded-xl object-contain"></video>
          </div>
        `;
      }
      const activeVideoEl = document.getElementById('modalMediaVideo');
      if (activeVideoEl) {
        videoSection.classList.remove('hidden');
        const targetVideoSrc = bgVideoSrc || encodeURI(mod.media_preview);
        activeVideoEl.src = targetVideoSrc;
        activeVideoEl.volume = bgVideoSrc ? 0 : currentAudioVolume;
        activeVideoEl.muted = Boolean(bgVideoSrc);
        activeVideoEl.loop = Boolean(bgVideoSrc);
        activeVideoEl.load();
        activeVideoEl.play().catch(() => {});
      }
      if (audioSection) audioSection.classList.add('hidden');
    }

    if (imgEl) {
      imgEl.className = 'max-h-[26vh] sm:max-h-[30vh] w-auto max-w-full object-contain rounded-xl shadow-xl transition-all duration-300 cursor-zoom-in';
    }
  } else if (isSoundMod) {
    // 2. AUTHENTIC ANNOUNCER / SOUND MOD (Valve Hero Announcers & Famous Characters)
    if (videoSection) {
      videoSection.classList.add('hidden');
      const v = document.getElementById('modalMediaVideo');
      if (v) v.src = '';
    }
    if (audioSection) {
      audioSection.classList.remove('hidden');

      const charKey = detectCharacterKey(mod);
      const voiceSet = CHARACTER_VOICE_SETS[charKey] || CHARACTER_VOICE_SETS['default'];

      const statusText = document.getElementById('audioStatusText');
      if (statusText) statusText.textContent = `Озвучка: ${voiceSet.name} — оригинальные фразы`;

      const audioGrid = document.getElementById('audioButtonsGrid');
      if (audioGrid) {
        audioGrid.innerHTML = voiceSet.lines.map(line => `
          <button 
            onclick="playCharacterLine('${charKey}', '${line.id}', '${line.text.replace(/'/g, "\\'")}', '${line.audio || ''}')"
            class="sound-btn group/snd" 
            data-sound-id="${line.id}"
            title="Воспроизвести: ${line.text}"
          >
            <span class="flex items-center space-x-1.5 truncate">
              <i class="fa-solid ${voiceSet.icon} text-indigo-400 text-[11px] group-hover/snd:scale-110 transition-transform"></i>
              <span class="truncate">${line.title}</span>
            </span>
            <i class="fa-solid fa-play text-[9px] text-slate-500 play-state-icon shrink-0"></i>
          </button>
        `).join('');
      }
    }
    if (imgEl) {
      imgEl.className = 'max-h-[26vh] sm:max-h-[30vh] w-auto max-w-full object-contain rounded-xl shadow-xl transition-all duration-300 cursor-zoom-in';
    }
  } else {
    // 3. REGULAR MOD (SKIN, SHADER, MAP, ETC.)
    if (videoSection) {
      videoSection.classList.add('hidden');
      const v = document.getElementById('modalMediaVideo');
      if (v) v.src = '';
    }
    if (audioSection) audioSection.classList.add('hidden');
    if (imgEl) {
      imgEl.className = 'max-h-[48vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 cursor-zoom-in';
    }
  }

  const setBgBtn = document.getElementById('modalSetBgBtn');
  if (setBgBtn) {
    if (mod.category === 'backgrounds') {
      setBgBtn.classList.remove('hidden');
    } else {
      setBgBtn.classList.add('hidden');
    }
  }

  // Main Image (Uncropped preview)
  if (imgEl) {
    imgEl.src = mod.preview;
    imgEl.title = 'Нажмите на изображение для увеличения';
    imgEl.onclick = () => openImageLightbox(imgEl.src || mod.preview, mod.title);
    imgEl.onerror = () => {
      if (mod.remote_preview && imgEl.src !== mod.remote_preview) {
        imgEl.src = mod.remote_preview;
      } else {
        imgEl.src = 'assets/heroes/dota2_logo_symbol.png';
      }
    };
  }

  // Direct full-res link
  const fullImgBtn = document.getElementById('modalFullImageBtn');
  if (fullImgBtn) {
    fullImgBtn.href = mod.preview;
  }

  // Download link / 1-click install / 1-click uninstall
  const dlBtn = document.getElementById('modalDownloadBtn');
  if (dlBtn) {
    const isInstalled = window.isModInstalled ? window.isModInstalled(mod) : false;
    const isEn = (window.currentAppLanguage === 'en');
    if (isInstalled) {
      dlBtn.onclick = (e) => {
        e.preventDefault();
        window.uninstallModDirectly(mod.id, mod.title, dlBtn);
      };
      dlBtn.innerHTML = `<i class="fa-solid fa-check text-xs mr-1.5 text-emerald-300 group-hover/delBtn:hidden"></i><i class="fa-solid fa-trash-can text-xs mr-1.5 text-rose-300 hidden group-hover/delBtn:inline"></i> <span class="group-hover/delBtn:hidden text-emerald-300">${isEn ? 'Installed in Game' : 'Установлен в игру'}</span><span class="hidden group-hover/delBtn:inline text-rose-200">${isEn ? 'Uninstall Mod' : 'Удалить из игры'}</span>`;
      dlBtn.className = "group/delBtn flex-1 py-3 px-4 rounded-xl bg-emerald-600/30 hover:bg-rose-600/30 text-emerald-300 hover:text-rose-200 border border-emerald-500/40 hover:border-rose-500/50 font-semibold text-sm transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer";
      dlBtn.title = isEn ? "Click to uninstall mod" : "Нажмите, чтобы удалить мод из игры";
    } else {
      dlBtn.onclick = (e) => {
        if (window.dotaManager) {
          e.preventDefault();
          window.installModDirectly(mod.id, mod.title, mod.download_url, dlBtn);
        }
      };
      dlBtn.href = mod.download_url;
      dlBtn.target = '_blank';
      dlBtn.innerHTML = window.dotaManager 
        ? `<i class="fa-solid fa-download text-xs mr-1.5"></i> ${isEn ? 'Install to Game' : 'Установить в игру'}` 
        : `<i class="fa-solid fa-download text-xs mr-1.5"></i> ${isEn ? 'Download Archive' : 'Скачать архив'}`;
      dlBtn.className = "flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center justify-center shadow-lg shadow-indigo-600/20";
      dlBtn.title = isEn ? "Download and install mod into game" : "Скачать и установить мод в игру";
    }
  }

  if (typeof window.updateDiscordPresence === 'function') {
    window.updateDiscordPresence('mod', mod);
  }

  // Badges (FX, Icons, Attribute, Sound)
  const badgesContainer = document.getElementById('modalBadgesContainer');
  if (badgesContainer) {
    const badges = [];
    if (isSoundMod) {
      badges.push('<span class="px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-[10px] text-emerald-300 font-semibold shadow flex items-center gap-1"><i class="fa-solid fa-volume-high text-[9px]"></i><span>Озвучка</span></span>');
    }
    if (mod.has_effects) {
      badges.push('<span class="px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-500/50 text-[10px] text-indigo-300 font-semibold shadow">FX Эффекты</span>');
    }
    if (mod.has_icons) {
      badges.push('<span class="px-2 py-0.5 rounded-lg bg-blue-950/80 border border-blue-500/50 text-[10px] text-blue-300 font-semibold shadow">Иконки</span>');
    }
    badgesContainer.innerHTML = badges.join('');
  }

  // Update Favorite button
  updateModalFavBtn(mod.id);

  // Navigation arrows display
  const prevBtn = document.getElementById('modalPrevModBtn');
  const nextBtn = document.getElementById('modalNextModBtn');
  const canNavigate = currentPreviewList.length > 1;
  if (prevBtn) prevBtn.style.display = canNavigate ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = canNavigate ? 'flex' : 'none';

  modModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

// Navigate to prev/next mod in the modal preview
window.navigatePreview = function(direction) {
  if (!currentPreviewList || currentPreviewList.length <= 1) return;
  currentPreviewIndex += direction;
  if (currentPreviewIndex < 0) currentPreviewIndex = currentPreviewList.length - 1;
  if (currentPreviewIndex >= currentPreviewList.length) currentPreviewIndex = 0;
  const nextMod = currentPreviewList[currentPreviewIndex];
  if (nextMod) openModDetail(nextMod.id);
};

// Update favorite button state inside modal
function updateModalFavBtn(modId) {
  const btn = document.getElementById('modalFavBtn');
  if (!btn) return;
  const isFav = favorites.includes(modId);
  btn.innerHTML = isFav
    ? '<i class="fa-solid fa-heart text-red-500"></i><span class="hidden sm:inline">В избранном</span>'
    : '<i class="fa-regular fa-heart"></i><span class="hidden sm:inline">Избранное</span>';
}

// Toggle favorite from inside the modal
window.toggleFavoriteFromModal = function() {
  if (!currentModalModId) return;
  toggleFavorite(currentModalModId);
  updateModalFavBtn(currentModalModId);
};

window.closeModModal = function() {
  stopVoiceLine();
  const videoEl = document.getElementById('modalMediaVideo');
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
  }
  modModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
};

// Background Customizer Manager
function initBackground() {
  applyBgStyles();
  renderBgPresets();

  const dimSlider = document.getElementById('bgDimSlider');
  const dimLabel = document.getElementById('bgDimLabel');
  if (dimSlider && dimLabel) {
    dimSlider.value = bgConfig.dim;
    dimLabel.textContent = bgConfig.dim + '%';
  }

  const blurSlider = document.getElementById('bgBlurSlider');
  const blurLabel = document.getElementById('bgBlurLabel');
  if (blurSlider && blurLabel) {
    blurSlider.value = bgConfig.blur;
    blurLabel.textContent = bgConfig.blur + 'px';
  }
}

window.VIDEO_BACKGROUND_FILES = {
  'bg-amor-endscreen': 'assets/videos/backgrounds/Amor_Endscreen.webm',
  'bg-sematary': 'assets/videos/backgrounds/Sematary.webm',
  'bg-dark-tree': 'assets/videos/backgrounds/Dark_Tree.webm',
  'bg-taghmel-ix-xita': 'assets/videos/backgrounds/Taghmel_Ix-Xita.webm',
  'bg-bliss': 'assets/videos/backgrounds/Bliss.webm',
  'bg-gwardjan-tad-dawl-perfezzjoni': 'assets/videos/backgrounds/Gwardjan_Tad_Dawl_Perfezzjoni.webm',
  'bg-xvii': 'assets/videos/backgrounds/Xvii.webm',
  'bg-the-great-awakening': 'assets/videos/backgrounds/The_Great_Awakening.webm'
};

window.getVideoBackgroundUrl = function(modOrIdOrTitle) {
  if (!modOrIdOrTitle) return null;
  if (typeof modOrIdOrTitle === 'object') {
    if (modOrIdOrTitle.id && window.VIDEO_BACKGROUND_FILES[modOrIdOrTitle.id]) {
      return window.VIDEO_BACKGROUND_FILES[modOrIdOrTitle.id];
    }
    return window.getVideoBackgroundUrl(modOrIdOrTitle.title || modOrIdOrTitle.id);
  }
  const s = String(modOrIdOrTitle).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s.includes('amorendscreen')) return 'assets/videos/backgrounds/Amor_Endscreen.webm';
  if (s.includes('sematary')) return 'assets/videos/backgrounds/Sematary.webm';
  if (s.includes('darktree')) return 'assets/videos/backgrounds/Dark_Tree.webm';
  if (s.includes('taghmelixxita')) return 'assets/videos/backgrounds/Taghmel_Ix-Xita.webm';
  if (s.includes('bliss')) return 'assets/videos/backgrounds/Bliss.webm';
  if (s.includes('gwardjantad')) return 'assets/videos/backgrounds/Gwardjan_Tad_Dawl_Perfezzjoni.webm';
  if (s.includes('xvii')) return 'assets/videos/backgrounds/Xvii.webm';
  if (s.includes('greatawakening')) return 'assets/videos/backgrounds/The_Great_Awakening.webm';
  return null;
};

function applyBgStyles() {
  const bgImg = document.getElementById('customBgImage');
  const bgVid = document.getElementById('customBgVideo');
  const bgOverlay = document.getElementById('customBgOverlay');

  if (bgOverlay) {
    bgOverlay.style.opacity = bgConfig.dim / 100;
  }

  const isVideo = Boolean(bgConfig.isVideo || (bgConfig.url && (bgConfig.url.endsWith('.webm') || window.getVideoBackgroundUrl(bgConfig.url || bgConfig.title))));
  const videoSrc = bgConfig.videoUrl || (isVideo ? ((bgConfig.url && bgConfig.url.endsWith('.webm')) ? bgConfig.url : window.getVideoBackgroundUrl(bgConfig.url || bgConfig.title)) : null);

  if (bgConfig.enabled && isVideo && videoSrc) {
    if (bgImg) {
      bgImg.style.backgroundImage = 'none';
      bgImg.classList.add('hidden');
    }
    if (bgVid) {
      bgVid.classList.remove('hidden');
      if (bgVid.getAttribute('data-src') !== videoSrc) {
        bgVid.src = videoSrc;
        bgVid.setAttribute('data-src', videoSrc);
        bgVid.muted = true;
        bgVid.loop = true;
        bgVid.load();
        const p = bgVid.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
      bgVid.style.filter = `blur(${bgConfig.blur}px)`;
    }
  } else if (bgConfig.enabled && bgConfig.url) {
    if (bgVid) {
      bgVid.pause();
      bgVid.src = '';
      bgVid.removeAttribute('data-src');
      bgVid.classList.add('hidden');
    }
    if (bgImg) {
      bgImg.classList.remove('hidden');
      bgImg.style.backgroundImage = `url("${bgConfig.url}")`;
      bgImg.style.filter = `blur(${bgConfig.blur}px)`;
    }
  } else {
    // Disabled / Default
    if (bgVid) {
      bgVid.pause();
      bgVid.src = '';
      bgVid.removeAttribute('data-src');
      bgVid.classList.add('hidden');
    }
    if (bgImg) {
      bgImg.classList.remove('hidden');
      bgImg.style.backgroundImage = 'none';
    }
  }
}

function saveBgConfig() {
  localStorage.setItem('dotamod_bg', JSON.stringify(bgConfig));
  applyBgStyles();
}

window.openBgModal = function() {
  const modal = document.getElementById('bgModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderBgPresets();
  }
};

window.closeBgModal = function() {
  const modal = document.getElementById('bgModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
};

window.setPresetBackground = function(url, title = '', isVideo = false, poster = '') {
  bgConfig.enabled = true;
  bgConfig.url = url;
  bgConfig.title = title;
  bgConfig.isVideo = Boolean(isVideo);
  if (isVideo) {
    bgConfig.videoUrl = url;
    bgConfig.poster = poster || '';
  } else {
    bgConfig.videoUrl = '';
  }
  saveBgConfig();
  renderBgPresets();
};

window.applyCustomBgUrl = function() {
  const input = document.getElementById('bgUrlInput');
  if (!input || !input.value.trim()) return;
  bgConfig.enabled = true;
  bgConfig.url = input.value.trim();
  bgConfig.isVideo = false;
  bgConfig.videoUrl = '';
  saveBgConfig();
  renderBgPresets();
  input.value = '';
};

window.handleBgFileUpload = function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    bgConfig.enabled = true;
    bgConfig.url = evt.target.result;
    bgConfig.isVideo = false;
    bgConfig.videoUrl = '';
    saveBgConfig();
    renderBgPresets();
  };
  reader.readAsDataURL(file);
};

window.setBgDim = function(val) {
  bgConfig.dim = parseInt(val, 10);
  const label = document.getElementById('bgDimLabel');
  if (label) label.textContent = val + '%';
  saveBgConfig();
};

window.setBgBlur = function(val) {
  bgConfig.blur = parseInt(val, 10);
  const label = document.getElementById('bgBlurLabel');
  if (label) label.textContent = val + 'px';
  saveBgConfig();
};

window.resetBackground = function() {
  bgConfig.enabled = false;
  bgConfig.url = '';
  bgConfig.isVideo = false;
  bgConfig.videoUrl = '';
  saveBgConfig();
  renderBgPresets();
};

window.currentBgPresetFilter = 'all';

window.setBgPresetFilter = function(filter) {
  window.currentBgPresetFilter = filter;
  const activeClass = "px-2.5 py-1 rounded-lg font-bold bg-indigo-600 text-white shadow-sm transition-all";
  const inactiveClass = "px-2.5 py-1 rounded-lg font-medium text-slate-400 hover:text-white transition-all flex items-center gap-1";

  const btnAll = document.getElementById('bgFilterTabAll');
  const btnVid = document.getElementById('bgFilterTabVideo');
  const btnImg = document.getElementById('bgFilterTabImage');

  if (btnAll) btnAll.className = (filter === 'all') ? activeClass : inactiveClass;
  if (btnVid) btnVid.className = (filter === 'video') ? activeClass : inactiveClass;
  if (btnImg) btnImg.className = (filter === 'image') ? activeClass : inactiveClass;

  renderBgPresets();
};

function renderBgPresets() {
  const grid = document.getElementById('bgPresetsGrid');
  if (!grid) return;
  const isEn = (window.currentAppLanguage === 'en');

  const defaultPresets = [
    { title: 'The International', preview: 'assets/wallpapers/heroes_full.jpg', isVideo: false },
    { title: 'Crownfall Act IV', preview: 'assets/wallpapers/crownfall.jpg', isVideo: false },
    { title: 'Muerta The Reckoning', preview: 'assets/wallpapers/muerta.jpg', isVideo: false },
    { title: 'Diretide Frostivus', preview: 'assets/wallpapers/frostivus.jpg', isVideo: false },
    { title: 'Aghanim Labyrinth', preview: 'assets/wallpapers/radiant_dire.jpg', isVideo: false },
    { title: 'Dragon Blood Anime', preview: 'assets/wallpapers/dragonsblood.jpg', isVideo: false }
  ];

  const bgMods = allMods.filter(m => m.category === 'backgrounds').map(m => {
    const isVid = typeof window.isBackgroundVideo === 'function' ? window.isBackgroundVideo(m) : false;
    const cleanTitle = (m.title || '').replace(' Background', '');
    const videoUrl = isVid ? window.getVideoBackgroundUrl(m) : null;
    return {
      id: m.id,
      title: cleanTitle,
      preview: m.preview,
      isVideo: isVid,
      videoUrl: videoUrl
    };
  });

  let combined = [...bgMods, ...defaultPresets];
  const seen = new Set();
  combined = combined.filter(item => {
    const key = item.videoUrl || item.preview;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filter = window.currentBgPresetFilter || 'all';
  let presetsToRender = combined;
  if (filter === 'video') {
    presetsToRender = combined.filter(p => p.isVideo);
  } else if (filter === 'image') {
    presetsToRender = combined.filter(p => !p.isVideo);
  }

  if (presetsToRender.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-10 text-center text-xs text-slate-500">
        ${isEn ? 'No backgrounds found for this filter.' : 'Фонов для выбранного фильтра не найдено.'}
      </div>
    `;
    return;
  }

  grid.innerHTML = presetsToRender.map(p => {
    const isThisPresetVideo = Boolean(p.isVideo && p.videoUrl);
    const isActive = bgConfig.enabled && (
      (isThisPresetVideo && (bgConfig.url === p.videoUrl || bgConfig.videoUrl === p.videoUrl)) ||
      (!isThisPresetVideo && bgConfig.url === p.preview)
    );
    const typeLabel = isThisPresetVideo ? (isEn ? 'Video' : 'Видео') : (isEn ? 'Image' : 'Картинка');
    const typeClass = isThisPresetVideo ? 'video' : 'image';
    const typeIcon = isThisPresetVideo ? 'fa-video' : 'fa-image';
    const targetUrl = isThisPresetVideo ? p.videoUrl : p.preview;

    return `
      <div 
        class="bg-preset-card relative overflow-hidden ${isActive ? 'active' : ''}" 
        style="background-image: url('${p.preview}');"
        onclick="setPresetBackground('${targetUrl}', '${p.title.replace(/'/g, "\\'")}', ${isThisPresetVideo ? 'true' : 'false'}, '${p.preview}')"
        title="Установить «${p.title}» (${typeLabel}) как фон приложения"
      >
        ${isThisPresetVideo ? `
          <video 
            src="${p.videoUrl}" 
            autoplay 
            loop 
            muted 
            playsinline 
            preload="auto"
            onloadeddata="this.play().catch(()=>{})"
            class="absolute inset-0 w-full h-full object-cover pointer-events-none"
          ></video>
        ` : ''}
        <span class="preset-type-badge ${typeClass}">
          <i class="fa-solid ${typeIcon} text-[8px]"></i>
          ${typeLabel}
        </span>
        <span class="preset-label">${p.title}</span>
      </div>
    `;
  }).join('');
}

window.applyCurrentModAsBg = function() {
  if (!currentModalModId) return;
  const mod = allMods.find(m => m.id === currentModalModId);
  if (mod && mod.preview) {
    const isVid = typeof window.isBackgroundVideo === 'function' ? window.isBackgroundVideo(mod) : false;
    const vidUrl = isVid ? window.getVideoBackgroundUrl(mod) : null;
    const targetUrl = (isVid && vidUrl) ? vidUrl : mod.preview;
    setPresetBackground(targetUrl, mod.title, Boolean(isVid && vidUrl), mod.preview);
    closeModModal();
  }
};

window.openGuideModal = function() {
  const gm = document.getElementById('guideModal');
  if (!gm) return;
  gm.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};
window.closeGuideModal = function() {
  const gm = document.getElementById('guideModal');
  if (gm) gm.classList.add('hidden');
  document.body.style.overflow = 'auto';
};

window.openFavModal = function() {
  const favModal = document.getElementById('favModal');
  const favContainer = document.getElementById('favList');
  const favBadge = document.getElementById('favModalBadge');
  const favItems = allMods.filter(m => favorites.includes(m.id));

  if (favBadge) favBadge.textContent = favItems.length;

  if (!favContainer) return;

  if (favItems.length === 0) {
    favContainer.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400 bg-[#161a26] rounded-3xl border border-white/5">
        <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <i class="fa-regular fa-heart text-2xl"></i>
        </div>
        <h4 class="text-base font-bold text-white mb-1">В избранном пока ничего нет</h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">Отмечайте любые скины, эффекты или звуки сердечком в каталоге для быстрого доступа.</p>
      </div>
    `;
  } else {
    favContainer.innerHTML = favItems.map(m => {
      const isInstalled = isModInstalled(m.id);
      return `
        <div class="fav-card p-3.5 rounded-2xl bg-[#161a26] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between group shadow-sm">
          <div>
            <div class="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 mb-3 cursor-pointer" onclick="closeFavModal(); openImageLightbox('${m.preview}', '${(m.title || '').replace(/'/g, "\\'")}')" title="Открыть увеличенное изображение">
              <img src="${m.preview}" alt="${m.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='assets/heroes/dota2_logo_symbol.png'">
              <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-indigo-300 font-semibold text-[10px] uppercase tracking-wider">${m.hero || 'Dota 2'}</span>
              <button onclick="event.stopPropagation(); toggleFavorite('${m.id}'); openFavModal();" class="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/70 hover:bg-rose-600 text-rose-400 hover:text-white flex items-center justify-center transition-all shadow-md" title="Удалить из избранного">
                <i class="fa-solid fa-heart text-xs"></i>
              </button>
            </div>
            <h4 onclick="closeFavModal(); openModDetail('${m.id}')" class="text-xs font-bold text-white hover:text-indigo-300 cursor-pointer truncate mb-1" title="${m.title}">${m.title}</h4>
            <div class="flex items-center space-x-2 text-[10px] text-slate-400 mb-3">
              <span>${m.file_size || '35 MB'}</span>
              <span>•</span>
              <span class="capitalize text-indigo-400">${m.category || 'мод'}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-2 border-t border-white/5">
            <button onclick="closeFavModal(); openModDetail('${m.id}')" class="flex-1 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all text-center">
              Превью
            </button>
            <button onclick="handleModInstall('${m.id}', this)" class="flex-1 py-1.5 px-2.5 rounded-xl ${isInstalled ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-rose-600/30 hover:text-rose-300' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} text-xs font-bold transition-all text-center shadow-sm">
              ${isInstalled ? 'Установлен' : 'Установить'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (favModal) {
    favModal.classList.remove('hidden');
    favModal.style.display = 'flex';
  }
  document.body.style.overflow = 'hidden';
};

window.closeFavModal = function() {
  const favModal = document.getElementById('favModal');
  if (favModal) {
    favModal.classList.add('hidden');
    favModal.style.display = 'none';
  }
  document.body.style.overflow = 'auto';
};

window.clearAllFavorites = function() {
  if (!favorites || favorites.length === 0) return;
  favorites = [];
  try {
    localStorage.setItem('dotamod_favs', JSON.stringify([]));
    localStorage.setItem('dotamod_favorites', JSON.stringify([]));
  } catch (e) {}

  if (typeof updateFavBadge === 'function') {
    updateFavBadge();
  }
  if (typeof renderMods === 'function') {
    renderMods(false);
  }
  if (typeof updateModalFavBtn === 'function' && currentModalModId) {
    updateModalFavBtn(currentModalModId);
  }

  openFavModal();
  showToast(window.currentAppLanguage === 'en' ? 'Favorites cleared' : 'Список избранного успешно очищен', 'info');
};

// Global Keyboard Navigation (Arrows & Escape)
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('imageLightboxModal');
  if (lightbox && !lightbox.classList.contains('hidden')) {
    if (e.key === 'Escape') {
      closeImageLightbox();
    }
  } else if (modModal && !modModal.classList.contains('hidden')) {
    if (e.key === 'Escape') {
      closeModModal();
    } else if (e.key === 'ArrowLeft') {
      navigatePreview(-1);
    } else if (e.key === 'ArrowRight') {
      navigatePreview(1);
    }
  } else if (guideModal && !guideModal.classList.contains('hidden')) {
    if (e.key === 'Escape') closeGuideModal();
  } else if (favModal && !favModal.classList.contains('hidden')) {
    if (e.key === 'Escape') closeFavModal();
  } else {
    const bgModal = document.getElementById('bgModal');
    if (bgModal && !bgModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeBgModal();
    }
  }
});

function getNoun(number, one, two, five) {
  if (window.currentAppLanguage === 'en') {
    if (one === 'мод' || one === 'найденный мод') return number === 1 ? 'mod' : 'mods';
    if (one === 'скин' || one === 'доступный скин') return number === 1 ? 'skin' : 'skins';
    if (one === 'эффект' || one === 'доступный эффект') return number === 1 ? 'effect' : 'effects';
    return number === 1 ? (one || 'item') : (two || five || one || 'items');
  }
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) return five;
  n %= 10;
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return two;
  return five;
}

// -------------------------------------------------------------
// Toast Notifications System (No blocking alert / confirm popups)
// -------------------------------------------------------------
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const borderCol = type === 'error' ? 'border-red-500/40 text-red-200' : (type === 'success' ? 'border-emerald-500/40 text-emerald-200' : 'border-indigo-500/40 text-slate-100');
  const icon = type === 'error' ? 'fa-circle-xmark text-red-400' : (type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-info text-indigo-400');
  
  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#12151e]/95 backdrop-blur-md border ${borderCol} text-xs shadow-xl shadow-black/50 transition-all duration-300 translate-y-3 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${icon} text-sm shrink-0"></i><span class="font-medium">${message}</span>`;
  
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2400);
};

// -------------------------------------------------------------
// Page Switcher: Catalog <-> My Mods
// -------------------------------------------------------------
window.switchMainPage = function(page) {
  const catalogView = document.getElementById('catalogPageView');
  const myModsView = document.getElementById('myModsPageView');
  const navCatalog = document.getElementById('navTabCatalog');
  const navMyMods = document.getElementById('navTabMyMods');
  const searchWrap = document.getElementById('headerSearchWrapper');

  const activeTabClass = "h-8 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-indigo-600 text-white shadow-sm shadow-indigo-600/30";
  const inactiveTabClass = "h-8 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/[0.04]";

  if (page === 'mymods') {
    if (catalogView) {
      catalogView.classList.add('hidden');
      catalogView.classList.remove('page-fade-enter');
    }
    if (myModsView) {
      myModsView.classList.remove('hidden', 'page-fade-enter');
      void myModsView.offsetWidth; // re-trigger transition
      myModsView.classList.add('page-fade-enter');
    }
    if (searchWrap) searchWrap.classList.add('opacity-0', 'pointer-events-none');

    if (navCatalog) navCatalog.className = inactiveTabClass;
    if (navMyMods) navMyMods.className = activeTabClass;

    refreshInstalledMods();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window.updateDiscordPresence === 'function') {
      window.updateDiscordPresence('mymods');
    }
  } else {
    // catalog
    if (catalogView) {
      catalogView.classList.remove('hidden', 'page-fade-enter');
      void catalogView.offsetWidth; // re-trigger transition
      catalogView.classList.add('page-fade-enter');
    }
    if (myModsView) {
      myModsView.classList.add('hidden');
      myModsView.classList.remove('page-fade-enter');
    }
    if (searchWrap) searchWrap.classList.remove('opacity-0', 'pointer-events-none');

    if (navCatalog) navCatalog.className = activeTabClass;
    if (navMyMods) navMyMods.className = inactiveTabClass;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window.updateDiscordPresence === 'function') {
      window.updateDiscordPresence('catalog');
    }
  }
};

window.openInstalledModsModal = function() {
  switchMainPage('mymods');
};

// -------------------------------------------------------------
// Electron Desktop Integration (window.dotaManager)
// -------------------------------------------------------------
// -------------------------------------------------------------
// Electron Desktop Integration (window.dotaManager)
// -------------------------------------------------------------
let desktopDotaPath = "";

window.initDesktopIntegration = async function() {
  if (!window.dotaManager) return;

  const headerActions = document.querySelector('header .flex.items-center.space-x-2');
  if (headerActions && !document.getElementById('desktopStatusWidget')) {
    const desktopStatusBtn = document.createElement('div');
    desktopStatusBtn.id = 'desktopStatusWidget';
    desktopStatusBtn.className = 'flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#161a26] border border-white/10 text-xs text-slate-300 cursor-pointer hover:border-white/20 transition-all';
    desktopStatusBtn.title = 'Нажмите для запуска Dota 2 через Steam';
    desktopStatusBtn.onclick = () => window.launchDotaFromDesktop();
    desktopStatusBtn.innerHTML = `
      <div class="w-2 h-2 rounded-full bg-slate-500 status-dot"></div>
      <span id="desktopDotaStatusText" class="font-medium text-slate-400">Dota 2</span>
    `;
    headerActions.insertBefore(desktopStatusBtn, headerActions.firstChild);
  }

  try {
    const res = await window.dotaManager.detectPath();
    if (res && res.success) {
      desktopDotaPath = res.path;
      try {
        await window.dotaManager.enableMods(desktopDotaPath);
      } catch (err) {}
      if (typeof window.refreshInstalledModsState === 'function') {
        await window.refreshInstalledModsState();
      }
      window.refreshInstalledModsBadge();
    }
  } catch (e) {
    console.error("Desktop detect error:", e);
  }

  // Live dynamic game process check
  if (typeof window.updateDotaStatusWidget === 'function') {
    window.updateDotaStatusWidget();
    setInterval(window.updateDotaStatusWidget, 3500);
  }
};

window.updateDotaStatusWidget = async function() {
  const widget = document.getElementById('desktopStatusWidget');
  if (!widget || !window.dotaManager) return;

  try {
    const status = await window.dotaManager.checkStatus();
    const dot = widget.querySelector('.status-dot');
    const text = widget.querySelector('#desktopDotaStatusText');

    if (status && status.isRunning) {
      if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse status-dot";
      if (text) {
        text.className = "font-semibold text-emerald-400";
        text.textContent = "В игре";
      }
      widget.className = "flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#161a26] border border-emerald-500/40 text-xs text-slate-200 cursor-pointer shadow-sm shadow-emerald-500/10";
      widget.title = "Dota 2 запущена и работает";
    } else {
      if (dot) dot.className = "w-2 h-2 rounded-full bg-slate-500 status-dot";
      if (text) {
        text.className = "font-medium text-slate-400";
        text.textContent = "Dota 2 не запущена";
      }
      widget.className = "flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#161a26] border border-white/10 text-xs text-slate-300 hover:border-white/20 cursor-pointer";
      widget.title = "Dota 2 не запущена. Нажмите, чтобы играть!";
    }
  } catch (e) {}
};

window.activateDesktopMods = async function() {
  if (!window.dotaManager) return;
  if (!desktopDotaPath) {
    const browseRes = await window.dotaManager.browsePath();
    if (browseRes && browseRes.success) {
      desktopDotaPath = browseRes.path;
    } else {
      showToast("Укажите папку 'dota 2 beta'", "error");
      return;
    }
  }

  await window.dotaManager.enableMods(desktopDotaPath);
  showToast("Режим модов активен!", "success");
};

window.installModDirectly = async function(modId, modTitle, downloadUrl, btnElement) {
  if (!window.dotaManager) {
    window.open(downloadUrl, '_blank');
    return;
  }

  if (!desktopDotaPath) {
    const browseRes = await window.dotaManager.browsePath();
    if (browseRes && browseRes.success) {
      desktopDotaPath = browseRes.path;
    } else {
      showToast("Сначала укажите папку Dota 2", "error");
      return;
    }
  }

  const foundMod = allMods.find(m => m.id === modId);
  const preview = foundMod ? foundMod.preview : '';
  const hero = foundMod ? foundMod.hero : '';
  const heroIcon = foundMod ? foundMod.hero_icon : '';
  const category = foundMod ? foundMod.category : '';

  const originalHtml = btnElement.innerHTML;
  btnElement.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-[10px]"></i> <span>Ставим...</span>`;
  btnElement.disabled = true;

  try {
    const res = await window.dotaManager.installMod({
      dotaPath: desktopDotaPath,
      modId: modId,
      modTitle: modTitle,
      downloadUrl: downloadUrl,
      preview: preview,
      hero: hero,
      heroIcon: heroIcon,
      category: category
    });

    if (res && res.success) {
      if (modId) window.installedModIdsSet.add(modId);
      if (modTitle) window.installedModIdsSet.add(modTitle);
      try {
        localStorage.setItem('dotamod_installed_ids', JSON.stringify([...window.installedModIdsSet]));
      } catch (e) {}

      btnElement.disabled = false;
      btnElement.setAttribute('onclick', `uninstallModDirectly('${modId}', '${(modTitle || '').replace(/'/g, "\\'")}', this)`);
      btnElement.className = "group/delBtn flex-1 py-2 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-rose-600/25 text-emerald-300 hover:text-rose-200 border border-emerald-500/35 hover:border-rose-500/50 text-xs font-semibold text-center transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95";
      btnElement.innerHTML = `<i class="fa-solid fa-check text-[10px] text-emerald-300 group-hover/delBtn:hidden"></i><i class="fa-solid fa-trash-can text-[10px] text-rose-300 hidden group-hover/delBtn:inline"></i><span class="group-hover/delBtn:hidden">Установлен</span><span class="hidden group-hover/delBtn:inline">Удалить</span>`;
      btnElement.title = "Нажмите, чтобы удалить мод";

      showToast(`«${modTitle}» установлен в игру!`, 'success');
      
      await window.refreshInstalledModsState();
      if (typeof window.updateInstalledModButtonsInDOM === 'function') {
        window.updateInstalledModButtonsInDOM();
      }
    } else {
      showToast("Ошибка установки: " + (res.message || "Не удалось загрузить"), "error");
      btnElement.innerHTML = originalHtml;
      btnElement.disabled = false;
    }
  } catch (err) {
    showToast("Ошибка: " + err.message, "error");
    btnElement.innerHTML = originalHtml;
    btnElement.disabled = false;
  }
};

window.uninstallModDirectly = async function(modId, modTitle, btnElement) {
  if (!window.dotaManager) return;
  if (!desktopDotaPath) {
    const res = await window.dotaManager.detectPath();
    if (res && res.success) desktopDotaPath = res.path;
  }
  if (!desktopDotaPath) {
    showToast("Сначала укажите папку Dota 2", "error");
    return;
  }

  const originalHtml = btnElement ? btnElement.innerHTML : '';
  if (btnElement) {
    btnElement.disabled = true;
    btnElement.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-[10px]"></i> <span>Удаление...</span>`;
  }

  try {
    const res = await window.dotaManager.deleteMod({
      dotaPath: desktopDotaPath,
      modId: modId,
      fileName: modId,
      modTitle: modTitle
    });

    if (res && res.success) {
      if (window.installedModIdsSet) {
        window.installedModIdsSet.delete(modId);
        if (modTitle) window.installedModIdsSet.delete(modTitle);
        try {
          localStorage.setItem('dotamod_installed_ids', JSON.stringify([...window.installedModIdsSet]));
        } catch (e) {}
      }

      showToast(`Мод «${modTitle || modId}» удален`, 'info');
      await window.refreshInstalledModsState();
      if (typeof window.updateInstalledModButtonsInDOM === 'function') {
        window.updateInstalledModButtonsInDOM();
      }
      if (typeof window.refreshInstalledMods === 'function') {
        window.refreshInstalledMods();
      }
    } else {
      showToast("Ошибка удаления: " + (res.message || "Ошибка"), "error");
      if (btnElement) {
        btnElement.disabled = false;
        btnElement.innerHTML = originalHtml;
      }
    }
  } catch (err) {
    showToast("Ошибка: " + err.message, "error");
    if (btnElement) {
      btnElement.disabled = false;
      btnElement.innerHTML = originalHtml;
    }
  }
};

// -------------------------------------------------------------
// Installed Mods Page Logic (with PREVIEW IMAGES & instant toggles)
// -------------------------------------------------------------
function resolveModInfo(mod) {
  // If font mod
  if (mod.isFont || (mod.id && mod.id.startsWith('font-')) || (mod.cleanName && mod.cleanName.toLowerCase().includes('font'))) {
    return {
      preview: mod.preview || 'assets/previews/fonts/Monocraft.webp',
      hero: 'Шрифты',
      hero_icon: 'assets/heroes/dota2_logo_symbol.png'
    };
  }

  // If mod already has an image
  if (mod.preview && typeof mod.preview === 'string' && mod.preview.length > 5) {
    return {
      preview: mod.preview,
      hero: mod.hero || 'Dota 2',
      hero_icon: mod.hero_icon || 'assets/heroes/dota2_logo_symbol.png'
    };
  }

  const cleanName = (mod.cleanName || mod.title || '').trim();
  const cleanLower = cleanName.toLowerCase();

  // Search in allMods
  if (Array.isArray(allMods) && allMods.length > 0) {
    // 1. By ID match
    if (mod.id) {
      const match = allMods.find(m => m.id === mod.id);
      if (match) return { preview: match.preview, hero: match.hero, hero_icon: match.hero_icon };
    }

    // 2. By exact title match
    const titleMatch = allMods.find(m => m.title && m.title.toLowerCase() === cleanLower);
    if (titleMatch) return { preview: titleMatch.preview, hero: titleMatch.hero, hero_icon: titleMatch.hero_icon };

    // 3. By pak number matching in download_url
    if (mod.pakName) {
      const pakMatch = allMods.find(m => m.download_url && m.download_url.toLowerCase().includes(mod.pakName.toLowerCase()));
      if (pakMatch) return { preview: pakMatch.preview, hero: pakMatch.hero, hero_icon: pakMatch.hero_icon };
    }

    // 4. By substring title match
    const subMatch = allMods.find(m => m.title && (cleanLower.includes(m.title.toLowerCase()) || m.title.toLowerCase().includes(cleanLower)));
    if (subMatch) return { preview: subMatch.preview, hero: subMatch.hero, hero_icon: subMatch.hero_icon };

    // 5. By hero name in cleanName
    const heroMatch = allMods.find(m => m.hero && m.hero !== 'Dota 2' && cleanLower.includes(m.hero.toLowerCase()));
    if (heroMatch) return { preview: heroMatch.preview, hero: heroMatch.hero, hero_icon: heroMatch.hero_icon };
  }

  // Known fallback presets for common pak files
  const pakNum = mod.fileName ? (mod.fileName.match(/pak(\d+)/i) || [])[1] : '';
  if (pakNum === '01') {
    return {
      preview: 'assets/previews/heroes/Beastmaster Immortal.webp',
      hero: 'Beastmaster',
      hero_icon: 'assets/heroes/beastmaster.png'
    };
  }
  if (pakNum === '02') {
    return {
      preview: 'assets/previews/heroes/Phantom Lancer Immortal Fire.webp',
      hero: 'Phantom Lancer',
      hero_icon: 'assets/heroes/phantom_lancer.png'
    };
  }
  if (pakNum === '03') {
    return {
      preview: 'assets/previews/heroes/Sakura Pink Invoker.webp',
      hero: 'Invoker',
      hero_icon: 'assets/heroes/invoker.png'
    };
  }
  if (pakNum === '04') {
    return {
      preview: 'assets/previews/heroes/Techies Alien.webp',
      hero: 'Techies',
      hero_icon: 'assets/heroes/techies.png'
    };
  }

  return {
    preview: 'assets/heroes/dota2_logo_symbol.png',
    hero: 'Dota 2',
    hero_icon: 'assets/heroes/dota2_logo_symbol.png'
  };
}

function createInstalledModCardHTML(mod) {
  const isEn = (window.currentAppLanguage === 'en');
  const info = resolveModInfo(mod);
  const previewImg = info.preview;
  const heroName = info.hero;
  const heroIcon = info.hero_icon;
  const fileName = mod.fileName || (mod.isFont ? (isEn ? `Font #${mod.pakNumber || '1'}` : `Шрифт #${mod.pakNumber || '1'}`) : 'pak_dir.vpk');
  const cleanName = mod.cleanName || mod.title || fileName;
  const pakBase = mod.isFont ? (isEn ? 'Font' : 'Шрифт') : (mod.pakName || fileName.replace('.disabled', ''));
  const isBg = info.category === 'backgrounds' || (heroName && heroName.toLowerCase().includes('background'));
  const isBgVid = isBg && (
    (typeof window.isBackgroundVideo === 'function' && window.isBackgroundVideo(info)) ||
    fileName.toLowerCase().endsWith('.zip') ||
    fileName.toLowerCase().includes('endscreen') ||
    ['sematary', 'dark tree', 'taghmel ix-xita', 'bliss', 'gwardjan tad dawl perfezzjoni', 'xvii', 'the great awakening', 'amor endscreen'].some(n => cleanName.toLowerCase().includes(n))
  );

  return `
    <div id="installedModCard_${pakBase.replace(/\s+/g, '_')}" class="installed-mod-card rounded-2xl bg-[#12151e] border ${mod.enabled ? 'border-emerald-500/30 shadow-lg shadow-emerald-950/20' : 'border-white/5 opacity-70'} overflow-hidden flex flex-col transition-all duration-300 hover:border-white/20 group">
      
      <!-- Card Image Preview Banner -->
      <div 
        class="relative h-44 w-full bg-slate-950 overflow-hidden cursor-pointer group/img"
        onclick="openImageLightbox('${previewImg}', '${cleanName.replace(/'/g, "\\'")}')"
        title="${isEn ? 'Click image to enlarge' : 'Нажмите для увеличения изображения'}"
      >
        <img 
          src="${previewImg}" 
          alt="${cleanName}" 
          class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
          loading="lazy"
          onerror="this.src='assets/heroes/dota2_logo_symbol.png'"
        >

        <!-- Top Left: Hero badge -->
        <div class="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5">
          <div class="w-5 h-5 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-slate-900">
            <img src="${heroIcon}" class="w-full h-full object-cover">
          </div>
          <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/75 text-slate-200 backdrop-blur-sm border border-white/10">
            ${heroName}
          </span>
        </div>

        <!-- Top Right: Pak File Badge & Background Type -->
        <div class="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          ${isBg ? `
            <span class="px-2 py-0.5 rounded-lg ${isBgVid ? 'bg-rose-950/90 text-rose-300 border-rose-500/40' : 'bg-sky-950/90 text-sky-300 border-sky-500/40'} border text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm shadow-sm">
              <i class="fa-solid ${isBgVid ? 'fa-video' : 'fa-image'} text-[9px]"></i>
              <span>${isBgVid ? (isEn ? 'Видео' : 'Видео') : (isEn ? 'Картинка' : 'Картинка')}</span>
            </span>
          ` : ''}
          <div class="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-indigo-300">
            ${pakBase}
          </div>
        </div>

        <!-- Bottom Left: Status Badge -->
        <div class="absolute bottom-2.5 left-2.5 z-10 status-badge-container">
          ${mod.enabled 
            ? `<span class="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md shadow-emerald-500/30"><i class="fa-solid fa-circle-check text-[9px]"></i> ${isEn ? 'In Game' : 'В игре'}</span>`
            : `<span class="px-2 py-0.5 rounded-lg bg-slate-900/90 text-amber-300 text-[10px] font-semibold flex items-center gap-1 border border-amber-500/30 backdrop-blur-sm"><i class="fa-solid fa-circle-pause text-[9px]"></i> ${isEn ? 'Disabled' : 'Выключен'}</span>`
          }
        </div>

        <!-- Bottom Right: Size -->
        <div class="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-lg bg-black/75 text-[10px] font-mono text-slate-300">
          ${mod.size || '15 MB'}
        </div>

        <!-- Hover Overlay -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-200 pointer-events-none">
          <span class="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1.5 border border-white/15 shadow-xl">
            <i class="fa-solid fa-magnifying-glass-plus text-emerald-400"></i>
            <span>${isEn ? 'Zoom photo' : 'Увеличить фото'}</span>
          </span>
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-white truncate mb-1" title="${cleanName}">
            ${cleanName}
          </h3>
          <div class="text-[11px] text-slate-400 font-mono truncate">
            ${fileName}${isBg ? ` • ${isBgVid ? (isEn ? 'Видео-фон' : 'Видео-фон') : (isEn ? 'Картинка' : 'Картинка')}` : ''}
          </div>
        </div>

        <!-- Card Footer: Controls -->
        <div class="flex items-center justify-between pt-3 mt-3 border-t border-white/5 gap-2">
          
          <!-- Instant Toggle Switch (NO popups, NO alerts) -->
          <div class="flex items-center space-x-2.5">
            <label class="relative inline-flex items-center cursor-pointer" title="${mod.enabled ? (isEn ? 'Disable mod' : 'Отключить мод') : (isEn ? 'Enable mod' : 'Включить мод')}">
              <input 
                type="checkbox" 
                class="sr-only peer" 
                ${mod.enabled ? 'checked' : ''} 
                onchange="toggleDesktopMod('${fileName}', this.checked)"
              >
              <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white border border-white/10"></div>
            </label>
            <span class="text-xs font-semibold ${mod.enabled ? 'text-emerald-400' : 'text-slate-400'}">
              ${mod.enabled ? (isEn ? 'Enabled' : 'Включен') : (isEn ? 'Disabled' : 'Выключен')}
            </span>
          </div>

          <!-- Instant Delete (NO alert popup) -->
          <button 
            onclick="deleteDesktopMod('${fileName}', '${cleanName.replace(/'/g, "\\'")}')" 
            class="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/20 flex items-center justify-center transition-all"
            title="${isEn ? 'Delete mod file' : 'Удалить файл мода'}"
          >
            <i class="fa-solid fa-trash text-xs"></i>
          </button>
        </div>

      </div>

    </div>
  `;
}

window.refreshInstalledMods = async function() {
  const grid = document.getElementById('installedModsGrid');
  const summaryBadge = document.getElementById('myModsSummaryBadge');
  const statusDetails = document.getElementById('myModsStatusDetails');
  const folderPathLabel = document.getElementById('myModsFolderPath');
  const countBadge = document.getElementById('installedModsCountBadge');
  const isEn = (window.currentAppLanguage === 'en');
  if (!grid) return;

  if (!window.dotaManager) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400">
        <div class="w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center justify-center mb-3 text-2xl">
          <i class="fa-solid fa-desktop"></i>
        </div>
        <h3 class="text-base font-bold text-white mb-1">${isEn ? 'Desktop App Mode' : 'Режим Desktop приложения'}</h3>
        <p class="text-xs text-slate-400">${isEn ? 'Mod management works in the desktop version.' : 'Управление модами работает в установленной десктопной версии.'}</p>
        <button onclick="switchMainPage('catalog')" class="mt-4 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">
          ${isEn ? 'Back to Skin Catalog' : 'Вернуться в каталог скинов'}
        </button>
      </div>
    `;
    return;
  }

  if (!desktopDotaPath) {
    const res = await window.dotaManager.detectPath();
    if (res && res.success) desktopDotaPath = res.path;
  }

  if (!desktopDotaPath) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400">
        <div class="w-16 h-16 rounded-2xl bg-amber-600/10 text-amber-400 border border-amber-500/20 inline-flex items-center justify-center mb-3 text-2xl">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 class="text-base font-bold text-white mb-1">${isEn ? 'Dota 2 Folder Not Found' : 'Папка Dota 2 не обнаружена'}</h3>
        <p class="text-xs text-slate-400">${isEn ? 'Specify the <code>dota 2 beta</code> folder in your Steam library.' : 'Укажите папку <code>dota 2 beta</code> в вашей библиотеке Steam.'}</p>
        <button onclick="activateDesktopMods()" class="mt-4 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">
          ${isEn ? 'Set Dota 2 Path' : 'Указать путь к Dota 2'}
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = `
    <div class="col-span-full py-16 text-center text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-3xl text-emerald-400 mb-3"></i>
      <p class="text-xs font-medium text-slate-300">${isEn ? 'Reading installed mods...' : 'Считывание установленных модов...'}</p>
    </div>
  `;

  try {
    const res = await window.dotaManager.listInstalledMods(desktopDotaPath);
    if (!res || !res.success || !res.mods || res.mods.length === 0) {
      window.installedModsList = [];
      window.installedModIdsSet.clear();
      try { localStorage.removeItem('dotamod_installed_ids'); } catch (e) {}
      if (typeof window.updateInstalledModButtonsInDOM === 'function') {
        window.updateInstalledModButtonsInDOM();
      }

      if (summaryBadge) summaryBadge.textContent = isEn ? '0 mods' : '0 модов';
      if (statusDetails) statusDetails.textContent = isEn ? 'Mod folder is empty' : 'Папка модов пуста';
      if (folderPathLabel) folderPathLabel.textContent = desktopDotaPath ? (isEn ? 'Dota 2 Connected' : 'Dota 2 подключена') : '';
      if (countBadge) {
        countBadge.textContent = '0';
        countBadge.classList.add('hidden');
      }

      const toggleAllSwitch = document.getElementById('toggleAllModsSwitch');
      const toggleAllText = document.getElementById('toggleAllModsText');
      if (toggleAllSwitch) {
        toggleAllSwitch.checked = false;
        toggleAllSwitch.disabled = true;
      }
      if (toggleAllText) {
        toggleAllText.textContent = isEn ? 'No mods' : 'Все моды';
      }

      grid.innerHTML = `
        <div class="col-span-full py-20 text-center">
          <div class="w-16 h-16 rounded-3xl bg-slate-800/60 text-slate-400 border border-white/5 inline-flex items-center justify-center mb-4 text-2xl">
            <i class="fa-regular fa-folder-open"></i>
          </div>
          <h3 class="text-base font-bold text-white mb-1.5">${isEn ? 'No installed mods in game yet' : 'В игре пока нет установленных модов'}</h3>
          <p class="text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
            ${isEn ? 'Select any skin, effect or terrain in the catalog and click «Download». It will immediately install to the game and appear here with its image and toggle!' : 'Выберите любой понравившийся скин, эффект или ландшафт в каталоге и нажмите кнопку «Скачать». Он сразу установится в игру и появится здесь с картинкой и переключателем!'}
          </p>
          <button onclick="switchMainPage('catalog')" class="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25">
            ${isEn ? 'Open Skin Catalog →' : 'Открыть каталог скинов →'}
          </button>
        </div>
      `;
      return;
    }

    const mods = res.mods;
    window.installedModsList = mods;
    window.installedModIdsSet.clear();
    mods.forEach(m => {
      if (m.id) window.installedModIdsSet.add(m.id);
      if (m.cleanName) window.installedModIdsSet.add(m.cleanName);
      if (m.title) window.installedModIdsSet.add(m.title);
    });
    try {
      localStorage.setItem('dotamod_installed_ids', JSON.stringify([...window.installedModIdsSet]));
    } catch (e) {}
    if (typeof window.updateInstalledModButtonsInDOM === 'function') {
      window.updateInstalledModButtonsInDOM();
    }

    const enabledCount = mods.filter(m => m.enabled).length;
    const disabledCount = mods.length - enabledCount;

    if (summaryBadge) {
      summaryBadge.textContent = `${mods.length} ${getNoun(mods.length, 'мод', 'мода', 'модов')}`;
    }
    if (statusDetails) {
      statusDetails.textContent = isEn ? `Active: ${enabledCount} • Disabled: ${disabledCount}` : `Активно: ${enabledCount} • Отключено: ${disabledCount}`;
    }
    if (folderPathLabel) {
      folderPathLabel.textContent = 'Dota 2: game/dota_russian';
    }
    if (countBadge) {
      countBadge.textContent = mods.length;
      countBadge.classList.remove('hidden');
    }

    const toggleAllSwitch = document.getElementById('toggleAllModsSwitch');
    const toggleAllText = document.getElementById('toggleAllModsText');
    if (toggleAllSwitch) {
      toggleAllSwitch.disabled = (mods.length === 0);
      toggleAllSwitch.checked = (mods.length > 0 && enabledCount === mods.length);
    }
    if (toggleAllText) {
      if (enabledCount === mods.length && mods.length > 0) {
        toggleAllText.textContent = isEn ? 'All mods: On' : 'Все моды: Вкл';
      } else if (enabledCount === 0) {
        toggleAllText.textContent = isEn ? 'All mods: Off' : 'Все моды: Выкл';
      } else {
        toggleAllText.textContent = isEn ? `Enabled (${enabledCount}/${mods.length})` : `Включено (${enabledCount}/${mods.length})`;
      }
    }

    grid.innerHTML = mods.map(m => createInstalledModCardHTML(m)).join('');

  } catch (err) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-rose-400 text-xs">
        <i class="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
        <p>${isEn ? 'Error reading installed mods:' : 'Ошибка чтения установленных модов:'} ${err.message}</p>
      </div>
    `;
  }
};

window.toggleDesktopMod = async function(fileName, enable) {
  if (!window.dotaManager || !desktopDotaPath) return;

  try {
    const res = await window.dotaManager.toggleMod({
      dotaPath: desktopDotaPath,
      fileName: fileName,
      enable: enable
    });

    if (res && res.success) {
      showToast(enable ? 'Мод включен!' : 'Мод выключен', 'success');
      await window.refreshInstalledMods();
    } else {
      showToast(res.message || "Ошибка переключения", "error");
    }
  } catch (err) {
    showToast("Ошибка: " + err.message, "error");
  }
};

window.deleteDesktopMod = async function(fileName, cleanName) {
  if (!window.dotaManager || !desktopDotaPath) return;

  try {
    const res = await window.dotaManager.deleteMod({
      dotaPath: desktopDotaPath,
      fileName: fileName
    });

    if (res && res.success) {
      showToast(`Мод «${cleanName}» удален`, 'info');
      await window.refreshInstalledModsState();
      await window.refreshInstalledMods();
      if (typeof window.updateInstalledModButtonsInDOM === 'function') {
        window.updateInstalledModButtonsInDOM();
      }
    } else {
      showToast("Ошибка удаления: " + (res.message || "Ошибка"), "error");
    }
  } catch (err) {
    showToast("Ошибка: " + err.message, "error");
  }
};

window.disableAllDesktopMods = async function() {
  if (!window.dotaManager || !desktopDotaPath) return;

  try {
    const res = await window.dotaManager.disableAllMods(desktopDotaPath);
    if (res && res.success) {
      showToast(`Все моды выключены (${res.count || 0} шт.)`, 'info');
      await window.refreshInstalledMods();
    } else {
      showToast("Ошибка: " + (res.message || "Не удалось отключить"), "error");
    }
  } catch (err) {
    showToast("Ошибка: " + err.message, "error");
  }
};

window.enableAllDesktopMods = async function() {
  if (!window.dotaManager || !desktopDotaPath) return;

  try {
    const res = await window.dotaManager.enableAllMods(desktopDotaPath);
    if (res && res.success) {
      showToast(`Все моды включены (${res.count || 0} шт.)!`, 'success');
      await window.refreshInstalledMods();
    } else {
      showToast("Ошибка: " + (res.message || "Не удалось включить"), "error");
    }
  } catch (err) {
    showToast("Ошибка: " + err.message, "error");
  }
};

window.toggleAllDesktopMods = async function(enable) {
  if (!window.dotaManager || !desktopDotaPath) {
    if (typeof activateDesktopMods === 'function') activateDesktopMods();
    return;
  }
  const mods = window.installedModsList || [];
  if (mods.length === 0) return;

  const enabledCount = mods.filter(m => m.enabled).length;
  const shouldEnable = (typeof enable === 'boolean') 
    ? enable 
    : (enabledCount < mods.length);

  const toggleAllSwitch = document.getElementById('toggleAllModsSwitch');
  if (toggleAllSwitch) {
    toggleAllSwitch.checked = shouldEnable;
  }

  if (shouldEnable) {
    await window.enableAllDesktopMods();
  } else {
    await window.disableAllDesktopMods();
  }
};

window.deleteAllDesktopMods = async function() {
  if (!window.dotaManager || !desktopDotaPath) return;

  try {
    const res = await window.dotaManager.deleteAllMods(desktopDotaPath);
    if (res && res.success) {
      showToast(`Все моды удалены (${res.count || 0} файлов)`, 'info');
      window.installedModIdsSet.clear();
      window.installedModsList = [];
      try { localStorage.removeItem('dotamod_installed_ids'); } catch (e) {}
      await window.refreshInstalledMods();
      if (typeof window.updateInstalledModButtonsInDOM === 'function') {
        window.updateInstalledModButtonsInDOM();
      }
    } else {
      showToast("Ошибка: " + (res.message || "Не удалось удалить"), "error");
    }
  } catch (err) {
    showToast("Ошибка: " + err.message, "error");
  }
};

window.repairDotaVacFiles = async function() {
  if (!window.dotaManager) {
    showToast("Доступно только в приложении DotaMod Hub", "info");
    return;
  }
  if (!desktopDotaPath) {
    const res = await window.dotaManager.detectPath();
    if (res && res.success) desktopDotaPath = res.path;
  }
  if (!desktopDotaPath) {
    showToast("Сначала укажите папку Dota 2 в настройках", "error");
    return;
  }
  showToast("Восстановление файлов игры...", "info");
  try {
    const res = await window.dotaManager.repairVac(desktopDotaPath);
    if (res && res.success) {
      showToast(res.message, "success", 7000);
    } else {
      showToast("Ошибка: " + (res.message || "Не удалось восстановить"), "error");
    }
  } catch (err) {
    showToast("Ошибка: " + err.message, "error");
  }
};

window.launchDotaFromDesktop = async function() {
  if (typeof window.updateDiscordPresence === 'function') {
    window.updateDiscordPresence('playing');
  }
  if (window.dotaManager) {
    await window.dotaManager.launchGame(desktopDotaPath);
  } else {
    window.location.href = "steam://rungameid/570";
  }
};

window.openDesktopModsFolder = async function() {
  if (!window.dotaManager || !desktopDotaPath) return;
  await window.dotaManager.openModsFolder(desktopDotaPath);
};

window.refreshInstalledModsBadge = async function(count = null) {
  const badge = document.getElementById('installedModsCountBadge');
  if (!badge) return;

  if (count !== null) {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
    return;
  }

  if (window.dotaManager && desktopDotaPath) {
    try {
      const res = await window.dotaManager.listInstalledMods(desktopDotaPath);
      if (res && res.success && Array.isArray(res.mods)) {
        badge.textContent = res.mods.length;
        badge.classList.toggle('hidden', res.mods.length === 0);
      }
    } catch (e) {}
  }
};

// ==========================================
// REAL AUTO-UPDATER SYSTEM (GitHub Releases Integration)
// ==========================================
const DEFAULT_INITIAL_VERSION = '1.5.0';
window._availableUpdate = null;
window._updateCheckPromise = null;

window.getAppVersion = function() {
  try {
    return localStorage.getItem('dotamod_app_version') || DEFAULT_INITIAL_VERSION;
  } catch (e) {
    return DEFAULT_INITIAL_VERSION;
  }
};

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function compareVersions(v1, v2) {
  const p1 = (v1 || '').replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
  const p2 = (v2 || '').replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const a = p1[i] || 0;
    const b = p2[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}

function renderReleaseNotes(notes) {
  if (!notes || typeof notes !== 'string' || !notes.trim()) {
    return `
      <ul class="space-y-2 text-slate-300">
        <li class="flex items-start space-x-2.5">
          <i class="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-[11px] shrink-0"></i>
          <span>Оптимизация производительности, исправление ошибок и обновление каталога скинов.</span>
        </li>
      </ul>
    `;
  }

  const lines = notes.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let html = '<ul class="space-y-2 text-slate-300">';
  for (const line of lines) {
    if (line.startsWith('#')) {
      const heading = line.replace(/^#+\s*/, '');
      html += `<li class="font-bold text-indigo-300 pt-1 text-[11px] uppercase tracking-wider">${escapeHtml(heading)}</li>`;
    } else if (line.startsWith('-') || line.startsWith('*')) {
      const item = line.replace(/^[-*]\s*/, '');
      html += `
        <li class="flex items-start space-x-2.5">
          <i class="fa-solid fa-circle-dot text-emerald-400 mt-1 text-[9px] shrink-0"></i>
          <span>${escapeHtml(item)}</span>
        </li>
      `;
    } else {
      html += `<li class="text-slate-300">${escapeHtml(line)}</li>`;
    }
  }
  html += '</ul>';
  return html;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.initUpdateNotification = async function() {
  const btn = document.getElementById('headerUpdateBtn');
  const badge = document.getElementById('headerUpdateBadge');
  const banner = document.getElementById('updateNotificationBanner');
  const currentVer = window.getAppVersion();

  // Always keep update button accessible and visible in header
  if (btn) {
    btn.classList.remove('hidden');
    btn.style.display = 'flex';
  }

  if (!window.dotaManager || typeof window.dotaManager.checkUpdate !== 'function') {
    return;
  }

  // Prevent duplicate concurrent requests
  if (!window._updateCheckPromise) {
    window._updateCheckPromise = window.dotaManager.checkUpdate().catch(err => {
      console.warn('[Updater] Check failed:', err);
      return { success: false, message: String(err) };
    });
  }

  const res = await window._updateCheckPromise;
  window._updateCheckPromise = null;

  if (res && res.success && res.version) {
    window._availableUpdate = res; // Always save latest release metadata!
    const hasNewerVersion = compareVersions(res.version, currentVer) > 0;

    if (hasNewerVersion) {
      if (btn) {
        btn.classList.add('border-indigo-500/50', 'bg-indigo-600/25', 'text-indigo-200', 'ring-2', 'ring-indigo-500/30');
        btn.title = `Доступно обновление v${res.version}! Нажмите для установки.`;
      }
      if (badge) {
        badge.textContent = `v${res.version}`;
        badge.classList.remove('hidden');
        badge.style.display = 'inline-block';
      }

      // Update banner text dynamically
      const bannerTitle = document.getElementById('updateBannerTitle');
      if (bannerTitle) {
        bannerTitle.textContent = `Доступно обновление DotaMod Hub v${res.version}`;
      }
      const bannerSubtitle = document.getElementById('updateBannerSubtitle');
      if (bannerSubtitle) {
        const sizeInfo = res.assetSize ? ` (${formatBytes(res.assetSize)})` : '';
        bannerSubtitle.textContent = `Новая версия v${res.version}${sizeInfo} уже доступна на GitHub. Нажмите «Обновить сейчас» для автоматической загрузки.`;
      }

      const snoozeTime = localStorage.getItem('dotamod_update_snooze');
      const snoozedVer = localStorage.getItem('dotamod_snoozed_version');
      if (snoozeTime && snoozedVer === res.version) {
        const hoursPassed = (Date.now() - parseInt(snoozeTime, 10)) / (1000 * 60 * 60);
        if (hoursPassed < 24) {
          if (banner) { banner.classList.add('hidden'); banner.style.display = 'none'; }
          return;
        }
      }

      if (banner) {
        banner.classList.remove('hidden');
        banner.style.display = 'flex';
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
      }

      if (!window._updateToastShown) {
        window._updateToastShown = true;
        setTimeout(() => {
          showToast(`🔥 Доступна новая версия DotaMod Hub v${res.version}! Нажмите кнопку обновления в шапке.`, 'info', 7000);
        }, 1200);
      }
      return;
    } else {
      // Local version is latest release
      if (btn) {
        btn.classList.remove('border-indigo-500/50', 'bg-indigo-600/25', 'ring-2', 'ring-indigo-500/30');
        btn.title = `DotaMod Hub v${currentVer} (Актуальная версия)`;
      }
      if (badge) {
        badge.classList.add('hidden');
        badge.style.display = 'none';
      }
      if (banner) {
        banner.classList.add('hidden');
        banner.style.display = 'none';
      }
      return;
    }
  }

  // Check finished without pending updates or offline
  if (btn) {
    btn.classList.remove('border-indigo-500/50', 'bg-indigo-600/25', 'ring-2', 'ring-indigo-500/30');
    btn.title = `DotaMod Hub v${currentVer} (Центр обновлений)`;
  }
  if (badge) {
    badge.classList.add('hidden');
    badge.style.display = 'none';
  }
  if (banner) {
    banner.classList.add('hidden');
    banner.style.display = 'none';
  }
};

window.dismissUpdateNotification = function() {
  const banner = document.getElementById('updateNotificationBanner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      banner.classList.add('hidden');
      banner.style.display = 'none';
    }, 250);
  }
  try {
    const targetVer = window._availableUpdate ? window._availableUpdate.version : '';
    localStorage.setItem('dotamod_update_snooze', Date.now().toString());
    localStorage.setItem('dotamod_snoozed_version', targetVer);
  } catch (e) {}
  showToast('Уведомление об обновлении отложено', 'info');
};

window.checkAppUpdates = async function(manual = false) {
  if (manual) {
    showToast('Проверка наличия обновлений на GitHub...', 'info');
  }

  if (!window.dotaManager || typeof window.dotaManager.checkUpdate !== 'function') {
    if (manual) showToast('Модуль обновления недоступен в браузере', 'warning');
    return;
  }

  try {
    const res = await window.dotaManager.checkUpdate();
    const currentVer = window.getAppVersion();

    if (!res || !res.success) {
      if (manual) {
        showToast(res && res.message ? `Ошибка проверки: ${res.message}` : 'Не удалось связаться с сервером обновлений', 'error');
        window.openUpdateModal();
      }
      return;
    }

    window._availableUpdate = res; // Always save release info!
    const hasNewer = compareVersions(res.version, currentVer) > 0;

    if (hasNewer) {
      const banner = document.getElementById('updateNotificationBanner');
      if (banner) {
        banner.classList.remove('hidden');
        banner.style.display = 'flex';
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
      }
    } else {
      const banner = document.getElementById('updateNotificationBanner');
      if (banner) { banner.classList.add('hidden'); banner.style.display = 'none'; }
    }

    if (manual) {
      window.openUpdateModal();
    }
  } catch (e) {
    if (manual) showToast(`Ошибка при проверке обновлений: ${e.message}`, 'error');
  }
};

window.openUpdateModal = async function() {
  const modal = document.getElementById('updateModal');
  if (!modal) return;

  const currentVer = window.getAppVersion();
  let updateData = window._availableUpdate;
  const isEn = (window.currentAppLanguage === 'en');

  const currentVerEl = document.getElementById('currentModalVersionText');
  if (currentVerEl) {
    currentVerEl.textContent = `v${currentVer}`;
  }

  const applyBtn = document.getElementById('applyUpdateBtn');
  const dismissBtn = document.getElementById('updateModalDismissBtn');
  const targetBadge = document.getElementById('targetModalVersionBadge');
  const changelogTitle = document.getElementById('updateChangelogTitle');
  const changelogList = document.getElementById('updateChangelogList');

  // If no cached release data, try fetching in background
  if (!updateData && window.dotaManager && typeof window.dotaManager.checkUpdate === 'function') {
    if (applyBtn) {
      applyBtn.disabled = true;
      applyBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-[11px]"></i> <span>${isEn ? 'Checking...' : 'Проверка...'}</span>`;
    }
    try {
      const res = await window.dotaManager.checkUpdate();
      if (res && res.success) {
        window._availableUpdate = res;
        updateData = res;
      }
    } catch (e) {}
  }

  const hasNewer = updateData && compareVersions(updateData.version, currentVer) > 0;
  const isUpToDate = updateData && compareVersions(updateData.version, currentVer) <= 0;

  if (hasNewer) {
    const newVer = updateData.version;
    const sizeStr = updateData.assetSize ? ` (${formatBytes(updateData.assetSize)})` : '';
    
    if (applyBtn) {
      applyBtn.style.display = 'flex';
      applyBtn.disabled = false;
      applyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      applyBtn.className = 'px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-1.5';
      applyBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down text-[11px]"></i> <span>${isEn ? 'Update Now' : 'Обновить сейчас'}${sizeStr}</span>`;
      applyBtn.onclick = () => window.applyAppUpdate();
    }
    if (dismissBtn) {
      dismissBtn.innerHTML = `<i class="fa-regular fa-clock text-[11px]"></i> <span>${isEn ? 'Later' : 'Позже'}</span>`;
    }
    if (targetBadge) {
      targetBadge.className = 'px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30';
      targetBadge.textContent = `v${newVer} (Доступно)`;
    }
    if (changelogTitle) {
      changelogTitle.textContent = isEn ? `What's new in v${newVer}:` : `Что нового в релизе v${newVer}:`;
    }
    if (changelogList && updateData.notes) {
      changelogList.innerHTML = renderReleaseNotes(updateData.notes);
    }
  } else if (isUpToDate) {
    // Up-to-date with GitHub release: ALWAYS KEEP BUTTON VISIBLE for reinstall / test
    const sizeStr = updateData.assetSize ? ` (${formatBytes(updateData.assetSize)})` : '';
    if (applyBtn) {
      applyBtn.style.display = 'flex';
      applyBtn.disabled = false;
      applyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      applyBtn.className = 'px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-1.5';
      applyBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate text-[11px]"></i> <span>${isEn ? `Reinstall / Download v${updateData.version}${sizeStr}` : `Переустановить / Скачать v${updateData.version}${sizeStr}`}</span>`;
      applyBtn.onclick = () => window.applyAppUpdate();
    }
    if (dismissBtn) {
      dismissBtn.innerHTML = `<i class="fa-solid fa-check text-[11px]"></i> <span>${isEn ? 'Close' : 'Закрыть'}</span>`;
    }
    if (targetBadge) {
      targetBadge.className = 'px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30';
      targetBadge.textContent = isEn ? `v${currentVer} (Latest)` : `v${currentVer} (Актуальная)`;
    }
    if (changelogTitle) {
      changelogTitle.textContent = isEn ? 'Latest release information:' : 'Информация о текущей версии:';
    }
    if (changelogList && updateData.notes) {
      changelogList.innerHTML = renderReleaseNotes(updateData.notes);
    }
  } else {
    // Offline or check failed
    if (applyBtn) {
      applyBtn.style.display = 'flex';
      applyBtn.disabled = false;
      applyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      applyBtn.className = 'px-5 py-2 rounded-xl bg-[#161a26] hover:bg-[#1f2436] text-white font-bold border border-white/10 transition-all flex items-center space-x-1.5';
      applyBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate text-[11px]"></i> <span>${isEn ? 'Check Again' : 'Проверить снова'}</span>`;
      applyBtn.onclick = async () => {
        window._availableUpdate = null;
        await window.checkAppUpdates(true);
      };
    }
    if (dismissBtn) {
      dismissBtn.innerHTML = `<i class="fa-solid fa-xmark text-[11px]"></i> <span>${isEn ? 'Close' : 'Закрыть'}</span>`;
    }
    if (targetBadge) {
      targetBadge.className = 'px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-white/10';
      targetBadge.textContent = `v${currentVer}`;
    }
    if (changelogTitle) {
      changelogTitle.textContent = isEn ? 'Current Version:' : 'Текущая версия:';
    }
  }

  // Ensure progress container is hidden on fresh open
  const progContainer = document.getElementById('updateProgressContainer');
  if (progContainer) {
    progContainer.classList.add('hidden');
    progContainer.style.display = 'none';
  }

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.style.pointerEvents = 'auto';
};

window.closeUpdateModal = function() {
  const modal = document.getElementById('updateModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    modal.style.pointerEvents = 'none';
  }
};

window.applyAppUpdate = async function() {
  const progContainer = document.getElementById('updateProgressContainer');
  const progBar = document.getElementById('updateProgressBar');
  const progStatus = document.getElementById('updateProgressStatus');
  const progPercent = document.getElementById('updateProgressPercent');
  const applyBtn = document.getElementById('applyUpdateBtn');
  const dismissBtn = document.getElementById('updateModalDismissBtn');

  if (!progContainer || !progBar || !progStatus || !progPercent) return;

  const updateData = window._availableUpdate;
  if (!updateData || !updateData.downloadUrl) {
    showToast('Ссылка для загрузки обновления не найдена', 'error');
    return;
  }

  if (!window.dotaManager || typeof window.dotaManager.downloadUpdate !== 'function') {
    showToast('Модуль загрузчика недоступен', 'error');
    return;
  }

  progContainer.classList.remove('hidden');
  progContainer.style.display = 'block';
  progBar.style.width = '0%';
  progPercent.textContent = '0%';
  progStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs"></i> <span>Подключение к GitHub...</span>`;

  if (applyBtn) {
    applyBtn.disabled = true;
    applyBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }
  if (dismissBtn) {
    dismissBtn.disabled = true;
    dismissBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }

  // Setup download progress listener
  if (typeof window.dotaManager.onUpdateDownloadProgress === 'function') {
    window.dotaManager.onUpdateDownloadProgress(({ percent, receivedBytes, totalBytes }) => {
      const p = Math.min(100, Math.max(0, percent || 0));
      progBar.style.width = `${p}%`;
      progPercent.textContent = `${p}%`;
      const recMB = (receivedBytes / (1024 * 1024)).toFixed(1);
      const totMB = totalBytes ? (totalBytes / (1024 * 1024)).toFixed(1) : '?';
      progStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs"></i> <span>Загрузка обновления: ${recMB} / ${totMB} MB...</span>`;
    });
  }

  try {
    progStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs"></i> <span>Скачивание установщика DotaMod Hub v${updateData.version}...</span>`;
    const dlResult = await window.dotaManager.downloadUpdate(updateData.downloadUrl);

    if (!dlResult || !dlResult.success || !dlResult.filePath) {
      throw new Error(dlResult && dlResult.message ? dlResult.message : 'Не удалось скачать файл обновления');
    }

    progBar.style.width = '100%';
    progPercent.textContent = '100%';
    progStatus.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 text-xs"></i> <span>Загрузка завершена! Запуск установщика...</span>`;

    // Save updated version state
    try {
      localStorage.setItem('dotamod_app_version', updateData.version);
      localStorage.removeItem('dotamod_update_snooze');
      localStorage.removeItem('dotamod_snoozed_version');
    } catch (e) {}

    showToast(`Запуск установщика v${updateData.version} и перезапуск приложения...`, 'success', 5000);

    // Call install handler (which runs the executable and quits current app)
    setTimeout(async () => {
      const installRes = await window.dotaManager.installUpdate(dlResult.filePath);
      if (!installRes || !installRes.success) {
        showToast(`Ошибка запуска установщика: ${installRes ? installRes.message : 'Неизвестная ошибка'}`, 'error');
        if (applyBtn) {
          applyBtn.disabled = false;
          applyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        if (dismissBtn) {
          dismissBtn.disabled = false;
          dismissBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      }
    }, 1200);

  } catch (err) {
    console.error('[Updater] Download error:', err);
    progStatus.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-rose-400 text-xs"></i> <span>Ошибка: ${escapeHtml(err.message)}</span>`;
    showToast(`Ошибка загрузки обновления: ${err.message}`, 'error', 6000);
    if (applyBtn) {
      applyBtn.disabled = false;
      applyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    if (dismissBtn) {
      dismissBtn.disabled = false;
      dismissBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
};

// ==========================================
// DISCORD RICH PRESENCE & I18N LOCALIZATION
// ==========================================
const I18N = {
  ru: {
    navCatalog: "Каталог",
    navMyMods: "Мои моды",
    searchPlaceholder: "Поиск по скину, герою, предмету...",
    heroSearchPlaceholder: "Поиск героя (например, Фурион)...",
    itemSearchPlaceholder: "Поиск эффекта (Телепорт, Фонтан, Блинк)...",
    playBtn: "Играть",
    bgBtn: "Фон",
    favBtn: "Избранное",
    settingsBtn: "Настройки",
    catalogTitle: "Каталог модификаций Dota 2",
    catalogSubtitle: "Большая база клиентских скинов, визуальных эффектов и фонов/видео",
    recentlyAddedTitle: "Недавно добавленные",
    recentlyAddedSubtitle: "Самые новые скины и обновления каталога",
    sidebarViewTitle: "Вид каталога",
    viewGrid: "Сетка",
    viewList: "Список",
    displayLabel: "Отображение:",
    sidebarCategoryTitle: "Категории",
    tabHeroes: "Герои",
    tabItems: "Предметы",
    myModsTitle: "Мои моды",
    myModsStatusDetails: "Управление установленными скинами в игре",
    enableAllBtn: "Включить все",
    disableAllBtn: "Выключить все",
    deleteAllBtn: "Удалить все",
    repairVacBtn: "Починить VAC",
    folderBtn: "Папка",
    settingsTitle: "Настройки DotaMod Hub",
    settingsSubtitle: "Конфигурация Dota 2, безопасность и интеграции",
    settingsPathTitle: "Путь к установленной Dota 2",
    settingsPathFound: "Найдено",
    settingsPathDesc: "Каталог игры для установки VPK-модов, звуков и скриптов",
    settingsBrowseBtn: "Обзор...",
    settingsLaunchTitle: "Параметры запуска Dota 2",
    settingsLaunchDesc: "Аргументы командной строки при нажатии кнопки «Играть»",
    settingsQuickFlags: "Быстрые флаги:",
    settingsSoundTitle: "Громкость звуков кликов",
    settingsVacTitle: "Защита VAC и целостность игры",
    settingsVacSafe: "Безопасно",
    settingsVacDesc: "Безопасный режим: оригинальный gameinfo.gi и полная совместимость с античитом Valve.",
    settingsVacBtn: "Починить файлы игры (сброс ошибки VAC)",
    settingsDiscordTitle: "Активность в Discord",
    settingsDiscordDesc: "Отображает в вашем профиле Discord статус ModHub, текущий просмотр скинов и запущенную игру.",
    settingsLanguageTitle: "Язык интерфейса",
    settingsLanguageDesc: "Выберите язык оформления элементов интерфейса, кнопок и подсказок",
    settingsMaintenanceTitle: "Обслуживание и обновления",
    checkUpdatesBtn: "Проверить обновления",
    clearCacheBtn: "Очистить кэш модов",
    cancelBtn: "Отмена",
    saveSettingsBtn: "Сохранить настройки",
    installed: "Установлен",
    uninstall: "Удалить",
    download: "Скачать",
    preview: "Превью",
    audio: "Озвучка",
    info: "Инфо",
    inGame: "В игре",
    disabled: "Выключен",
    enabled: "Включен",
    zoomPhoto: "Увеличить фото",
    updateLaterBtn: "Позже",
    applyUpdateBtn: "Обновить сейчас",
    closeBtn: "Закрыть",
    viewAction: "Смотреть",
    linkSteam: "Привязать Steam"
  },
  en: {
    navCatalog: "Catalog",
    navMyMods: "My Mods",
    searchPlaceholder: "Search skins, heroes, items...",
    heroSearchPlaceholder: "Search hero (e.g. Invoker)...",
    itemSearchPlaceholder: "Search effect (Teleport, Blink)...",
    playBtn: "Play",
    bgBtn: "Background",
    favBtn: "Favorites",
    settingsBtn: "Settings",
    catalogTitle: "Dota 2 Modifications Catalog",
    catalogSubtitle: "Large collection of custom skins, visual effects and backgrounds",
    recentlyAddedTitle: "Recently Added",
    recentlyAddedSubtitle: "Fresh skins and modifications updates",
    sidebarViewTitle: "Catalog View",
    viewGrid: "Grid",
    viewList: "List",
    displayLabel: "Display:",
    sidebarCategoryTitle: "Categories",
    tabHeroes: "Heroes",
    tabItems: "Items",
    myModsTitle: "My Mods",
    myModsStatusDetails: "Manage all active mods in your game",
    enableAllBtn: "Enable All",
    disableAllBtn: "Disable All",
    deleteAllBtn: "Uninstall All",
    repairVacBtn: "Repair VAC",
    folderBtn: "Folder",
    settingsTitle: "DotaMod Hub Settings",
    settingsSubtitle: "Dota 2 configuration, safety and integrations",
    settingsPathTitle: "Dota 2 Game Path",
    settingsPathFound: "Found",
    settingsPathDesc: "Game directory for installing VPK mods, sounds and scripts",
    settingsBrowseBtn: "Browse...",
    settingsLaunchTitle: "Dota 2 Launch Options",
    settingsLaunchDesc: "Command line arguments when launching Dota 2 via Play button",
    settingsQuickFlags: "Quick flags:",
    settingsSoundTitle: "Click Sounds Volume",
    settingsVacTitle: "VAC Protection & Game Integrity",
    settingsVacSafe: "Safe",
    settingsVacDesc: "Safe mode: original gameinfo.gi and full compatibility with Valve anti-cheat.",
    settingsVacBtn: "Repair game files (reset VAC error)",
    settingsDiscordTitle: "Discord Activity",
    settingsDiscordDesc: "Displays ModHub status, skin browsing, and active game on your Discord profile.",
    settingsLanguageTitle: "Interface Language",
    settingsLanguageDesc: "Choose interface language for controls, buttons, and tooltips",
    settingsMaintenanceTitle: "Maintenance & Updates",
    checkUpdatesBtn: "Check Updates",
    clearCacheBtn: "Clear Mod Cache",
    cancelBtn: "Cancel",
    saveSettingsBtn: "Save Settings",
    installed: "Installed",
    uninstall: "Uninstall",
    download: "Download",
    preview: "Preview",
    audio: "Audio",
    info: "Info",
    inGame: "In Game",
    disabled: "Disabled",
    enabled: "Enabled",
    zoomPhoto: "Zoom image",
    updateLaterBtn: "Later",
    applyUpdateBtn: "Update Now",
    closeBtn: "Close",
    viewAction: "View",
    linkSteam: "Link Steam"
  }
};

const CATEGORY_TRANSLATIONS = {
  ru: {
    'all': 'Все моды',
    'heroes': 'Скины героев',
    'hero-items': 'Отдельные предметы',
    'high-five': 'High five (Дай пять)',
    'attack-fx': 'Эффекты атаки',
    'herofx': 'Эффекты (FX)',
    'packs': 'Готовые паки',
    'hero-sounds': 'Звуки героев',
    'mega-kill': 'Озвучка игры',
    'shaders': 'Шейдеры',
    'creeps': 'Крипы',
    'creep-deny': 'Денай крипов',
    'wards': 'Варды',
    'couriers': 'Курьеры',
    'terrains': 'Карты и ландшафт',
    'river': 'Реки',
    'trees': 'Виды деревьев',
    'versus-screens': 'Версус экраны',
    'backgrounds': 'Фоны меню',
    'huds': 'Интерфейс (HUD)',
    'fonts': 'Шрифты'
  },
  en: {
    'all': 'All Mods',
    'heroes': 'Hero Skins',
    'hero-items': 'Hero Items',
    'high-five': 'High Five Effects',
    'attack-fx': 'Attack Effects',
    'herofx': 'Effects (FX)',
    'packs': 'Ready Packs',
    'hero-sounds': 'Hero Sounds',
    'mega-kill': 'Announcers',
    'shaders': 'Shaders',
    'creeps': 'Creeps',
    'creep-deny': 'Creep Deny',
    'wards': 'Wards',
    'couriers': 'Couriers',
    'terrains': 'Terrains & Maps',
    'river': 'Rivers',
    'trees': 'Trees',
    'versus-screens': 'Versus Screens',
    'backgrounds': 'Menu Backgrounds',
    'huds': 'HUD & Interface',
    'fonts': 'Fonts'
  }
};

window.currentAppLanguage = localStorage.getItem('dotamod_language') || 'ru';

window.changeAppLanguage = function(lang) {
  window.currentAppLanguage = lang;
  try { localStorage.setItem('dotamod_language', lang); } catch (e) {}
  window.applyAppLanguage(lang);
};

window.applyAppLanguage = function(lang) {
  const dict = I18N[lang] || I18N.ru;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (dict[k]) el.textContent = dict[k];
  });

  const sInput = document.getElementById('searchInput');
  if (sInput && dict.searchPlaceholder) sInput.placeholder = dict.searchPlaceholder;
  const mInput = document.getElementById('mobileSearchInput');
  if (mInput && dict.searchPlaceholder) mInput.placeholder = dict.searchPlaceholder;

  const hInput = document.getElementById('heroSearchInput');
  if (hInput && dict.heroSearchPlaceholder) hInput.placeholder = dict.heroSearchPlaceholder;

  const iInput = document.getElementById('itemSearchInput');
  if (iInput && dict.itemSearchPlaceholder) iInput.placeholder = dict.itemSearchPlaceholder;

  const tag = document.getElementById('currentLangTag');
  if (tag) tag.textContent = lang.toUpperCase();

  // Update sidebar and mobile category buttons
  const catDict = CATEGORY_TRANSLATIONS[lang] || CATEGORY_TRANSLATIONS.ru;
  document.querySelectorAll('#sidebarCategories button[data-category], #mobileFilterBar button[data-category]').forEach(btn => {
    const cat = btn.getAttribute('data-category');
    if (cat && catDict[cat]) {
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = catDict[cat];
      } else {
        btn.textContent = catDict[cat];
      }
    }
  });

  const btnRu = document.getElementById('langBtnRu');
  const btnEn = document.getElementById('langBtnEn');
  if (btnRu && btnEn) {
    if (lang === 'ru') {
      btnRu.className = "p-2.5 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 border border-indigo-500/40 shadow-sm transition-all";
      btnEn.className = "p-2.5 rounded-xl bg-[#12151e] hover:bg-slate-800 text-slate-300 hover:text-white font-semibold flex items-center justify-center gap-2 border border-white/5 transition-all";
    } else {
      btnEn.className = "p-2.5 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 border border-indigo-500/40 shadow-sm transition-all";
      btnRu.className = "p-2.5 rounded-xl bg-[#12151e] hover:bg-slate-800 text-slate-300 hover:text-white font-semibold flex items-center justify-center gap-2 border border-white/5 transition-all";
    }
  }

  // Update header account button
  if (typeof window.renderHeaderAccountWidget === 'function') {
    window.renderHeaderAccountWidget();
  }

  // Re-render catalog & recently added with new language
  if (typeof renderMods === 'function') {
    renderMods(false);
  }
  if (typeof renderRecentlyAdded === 'function') {
    renderRecentlyAdded();
  }
  if (typeof window.refreshInstalledMods === 'function' && document.getElementById('myModsPageView') && !document.getElementById('myModsPageView').classList.contains('hidden')) {
    window.refreshInstalledMods();
  }
};

window.updateDiscordStatusUI = function(connected) {
  const dot = document.getElementById('discordStatusDot');
  const label = document.getElementById('discordStatusLabel');
  const isEn = (window.currentAppLanguage === 'en');
  if (dot) {
    dot.className = connected 
      ? "w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" 
      : "w-2 h-2 rounded-full bg-slate-500 inline-block";
  }
  if (label) {
    label.textContent = connected 
      ? (isEn ? "Status: Connected to Discord" : "Статус: Подключено к Discord") 
      : (isEn ? "Status: Disconnected" : "Статус: Отключено");
  }
};

window.toggleDiscordRPC = async function(enabled, customClientId) {
  try { localStorage.setItem('dotamod_discord_rpc', enabled ? 'true' : 'false'); } catch (e) {}
  const clientId = customClientId || localStorage.getItem('dotamod_discord_client_id') || '1557096736466673754';
  if (window.dotaManager && typeof window.dotaManager.setDiscordEnabled === 'function') {
    try {
      const res = await window.dotaManager.setDiscordEnabled({ enabled: enabled, clientId: clientId });
      window.updateDiscordStatusUI(enabled && res && res.isConnected);
    } catch (e) {
      window.updateDiscordStatusUI(false);
    }
  } else {
    window.updateDiscordStatusUI(enabled);
  }
};

window.updateDiscordPresence = function(view, extra) {
  if (!window.dotaManager || typeof window.dotaManager.setDiscordActivity !== 'function') return;
  const isEnabled = localStorage.getItem('dotamod_discord_rpc') !== 'false';
  if (!isEnabled) return;

  const isEn = (window.currentAppLanguage === 'en');
  let details = isEn ? 'Skinchanger — ModHub' : 'Skinchanger — Каталог модов';
  let state = isEn ? 'Selecting custom skins' : 'Выбирает кастомные скины';

  if (view === 'mymods') {
    details = isEn ? 'Skinchanger — My Mods' : 'Skinchanger — Мои моды';
    const count = window.installedModsList ? window.installedModsList.length : 0;
    state = isEn ? `Installed skins (${count} active)` : `Установлено скинов: ${count} шт.`;
  } else if (view === 'mod' && extra) {
    details = isEn ? `Skinchanger: ${extra.hero || 'Dota 2'}` : `Скинченджер: ${extra.hero || 'Dota 2'}`;
    state = isEn ? `Mod: ${extra.title || 'Custom Skin'}` : `Мод: ${extra.title || 'Кастомный скин'}`;
  } else if (view === 'playing') {
    details = isEn ? 'Skinchanger — Playing Dota 2' : 'Skinchanger — В игре Dota 2';
    state = isEn ? 'All custom skins injected' : 'Скины активны в клиенте';
  }

  window.dotaManager.setDiscordActivity({ details, state }).catch(() => {});
};

// ==========================================
// SETTINGS SYSTEM
// ==========================================
window.openSettingsModal = function() {
  const modal = document.getElementById('settingsModal');
  if (!modal) return;

  // Populate game path
  const pathInput = document.getElementById('settingsGamePathInput');
  if (pathInput) {
    pathInput.value = desktopDotaPath || localStorage.getItem('dotamod_game_path') || 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota';
  }

  // Populate launch args
  const argsInput = document.getElementById('settingsLaunchArgsInput');
  if (argsInput) {
    argsInput.value = localStorage.getItem('dotamod_launch_args') || '-novid -high -map dota -dx11';
  }

  // Populate volume
  const vol = localStorage.getItem('dotamod_sound_volume') || '80';
  const volSlider = document.getElementById('settingsVolumeSlider');
  const volLabel = document.getElementById('settingsVolumeLabel');
  if (volSlider) volSlider.value = vol;
  if (volLabel) volLabel.textContent = vol + '%';

  // Populate Discord toggle & status & custom App ID
  const discordToggle = document.getElementById('settingsDiscordToggle');
  const discordEnabled = localStorage.getItem('dotamod_discord_rpc') !== 'false';
  if (discordToggle) {
    discordToggle.checked = discordEnabled;
  }
  const discordAppIdInput = document.getElementById('settingsDiscordAppIdInput');
  if (discordAppIdInput) {
    discordAppIdInput.value = localStorage.getItem('dotamod_discord_client_id') || '1557096736466673754';
  }
  if (window.dotaManager && typeof window.dotaManager.getDiscordStatus === 'function') {
    window.dotaManager.getDiscordStatus().then(st => {
      window.updateDiscordStatusUI(discordEnabled && st && st.isConnected);
    }).catch(() => {
      window.updateDiscordStatusUI(false);
    });
  } else {
    window.updateDiscordStatusUI(discordEnabled);
  }

  // Populate Language
  const curLang = localStorage.getItem('dotamod_language') || 'ru';
  window.applyAppLanguage(curLang);

  // Populate Theme & Glass Blend
  const glassBlendToggle = document.getElementById('settingsGlassBlendToggle');
  if (glassBlendToggle) {
    glassBlendToggle.checked = (localStorage.getItem('dotamod_glass_blend') === 'true');
  }
  const currentAccent = localStorage.getItem('dotamod_accent_color') || '#6366f1';
  window.updateAccentColorPaletteUI(currentAccent);

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.style.pointerEvents = 'auto';
};

window.closeSettingsModal = function() {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    modal.style.pointerEvents = 'none';
  }
};

window.scrollToSettingsSection = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('ring-2', 'ring-indigo-500');
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-indigo-500');
    }, 1500);
  }
};

window.openDiscordDevPortal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const url = 'https://discord.com/developers/applications';
  if (window.dotaManager && typeof window.dotaManager.openExternal === 'function') {
    window.dotaManager.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
};

window.checkAppUpdatesFromSettings = async function() {
  const btn = document.getElementById('settingsCheckUpdatesBtn');
  const statusEl = document.getElementById('settingsUpdateStatus');
  const isEn = (window.currentAppLanguage === 'en');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-[11px]"></i> <span>${isEn ? 'Checking...' : 'Проверка...'}</span>`;
  }

  const currentVer = window.getAppVersion();
  let hasNewer = false;
  let updateData = null;

  if (window.dotaManager && typeof window.dotaManager.checkUpdate === 'function') {
    try {
      const res = await window.dotaManager.checkUpdate();
      if (res && res.success && res.version) {
        updateData = res;
        window._availableUpdate = res; // Always save release info
        hasNewer = compareVersions(res.version, currentVer) > 0;
      }
    } catch (e) {
      console.warn('[Updater] Settings check error:', e);
    }
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-arrows-rotate text-[11px]"></i> <span data-i18n="checkUpdatesBtn">${isEn ? 'Check Updates' : 'Проверить обновления'}</span>`;
  }

  if (statusEl) {
    statusEl.classList.remove('hidden');
    if (hasNewer && updateData) {
      const sizeStr = updateData.assetSize ? ` (${formatBytes(updateData.assetSize)})` : '';
      statusEl.className = "text-[11px] p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 flex flex-col sm:flex-row items-center justify-between gap-2.5";
      statusEl.innerHTML = `
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-bolt text-amber-400 text-xs"></i>
          <span>${isEn ? `New version v${updateData.version}${sizeStr} available!` : `Доступно обновление v${updateData.version}${sizeStr}!`}</span>
        </div>
        <button onclick="openUpdateModal()" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 shrink-0">
          <i class="fa-solid fa-download text-[10px]"></i>
          <span>${isEn ? 'Update Now' : 'Обновить сейчас'}</span>
        </button>
      `;
    } else {
      statusEl.className = "text-[11px] p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-2.5";
      statusEl.innerHTML = `
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-sm shrink-0"></i>
          <span>${isEn ? `You have the latest version (v${currentVer}). All mods and features are up to date!` : `У вас установлена последняя версия (v${currentVer}). Все функции и моды актуальны!`}</span>
        </div>
        <button onclick="openUpdateModal()" class="px-3 py-1.5 rounded-lg bg-[#161a26] hover:bg-[#1f2436] text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-1 shrink-0">
          <i class="fa-solid fa-arrows-rotate text-[10px]"></i>
          <span>${isEn ? 'Update Center / Reinstall' : 'Центр обновлений / Переустановка'}</span>
        </button>
      `;
    }
  }

  if (!hasNewer) {
    showToast(isEn ? `You have the latest version of DotaMod Hub (v${currentVer})!` : `У вас установлена актуальная версия DotaMod Hub (v${currentVer})!`, 'success');
  } else {
    showToast(isEn ? `Update v${updateData.version} is available!` : `Доступно обновление DotaMod Hub v${updateData.version}!`, 'info');
  }
};

window.appendLaunchArg = function(arg) {
  const input = document.getElementById('settingsLaunchArgsInput');
  if (!input) return;
  const current = input.value.trim();
  if (!current.includes(arg)) {
    input.value = current ? `${current} ${arg}` : arg;
  }
};

window.browseDotaPath = async function() {
  if (window.dotaManager && typeof window.dotaManager.browsePath === 'function') {
    try {
      const res = await window.dotaManager.browsePath();
      if (res && res.path) {
        document.getElementById('settingsGamePathInput').value = res.path;
        return;
      }
    } catch (e) {}
  }
  showToast(window.currentAppLanguage === 'en' ? 'Select Dota 2 game folder' : 'Выберите каталог игры Dota 2', 'info');
};

window.clearModCache = function() {
  try {
    sessionStorage.clear();
    showToast(window.currentAppLanguage === 'en' ? 'Mod and preview cache cleared!' : 'Кэш модов и превью успешно очищен!', 'success');
  } catch (e) {
    showToast(window.currentAppLanguage === 'en' ? 'Cache cleared' : 'Кэш очищен', 'info');
  }
};

window.saveSettings = function() {
  const pathInput = document.getElementById('settingsGamePathInput');
  const argsInput = document.getElementById('settingsLaunchArgsInput');
  const volSlider = document.getElementById('settingsVolumeSlider');

  if (pathInput && pathInput.value.trim()) {
    const p = pathInput.value.trim();
    desktopDotaPath = p;
    try { localStorage.setItem('dotamod_game_path', p); } catch (e) {}
  }

  if (argsInput) {
    try { localStorage.setItem('dotamod_launch_args', argsInput.value.trim()); } catch (e) {}
  }

  if (volSlider) {
    try { localStorage.setItem('dotamod_sound_volume', volSlider.value); } catch (e) {}
  }

  const discordAppIdInput = document.getElementById('settingsDiscordAppIdInput');
  if (discordAppIdInput) {
    const customId = discordAppIdInput.value.trim();
    if (customId) {
      localStorage.setItem('dotamod_discord_client_id', customId);
    } else {
      localStorage.removeItem('dotamod_discord_client_id');
    }
  }

  const discordToggle = document.getElementById('settingsDiscordToggle');
  if (discordToggle) {
    const customId = localStorage.getItem('dotamod_discord_client_id') || undefined;
    window.toggleDiscordRPC(discordToggle.checked, customId);
  }

  closeSettingsModal();
  showToast(window.currentAppLanguage === 'en' ? 'Settings saved successfully!' : 'Настройки успешно применены и сохранены!', 'success');
};

window.resetDiscordAppId = function() {
  const input = document.getElementById('settingsDiscordAppIdInput');
  if (input) input.value = '';
  localStorage.removeItem('dotamod_discord_client_id');
  showToast(window.currentAppLanguage === 'en' ? 'Default Skinchanger ID restored' : 'Установлен стандартный ID ModHub Skinchanger', 'info');
};

// ==========================================
// THEME & GLASS BLEND CUSTOMIZATION SYSTEM
// ==========================================
window.setAccentColor = function(color, notify = true) {
  if (!color || typeof color !== 'string') return;
  try {
    localStorage.setItem('dotamod_accent_color', color);
  } catch (e) {}

  // Parse color to RGB for glow & translucent states
  let hex = color.replace('#', '').trim();
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  const r = !isNaN(num) ? ((num >> 16) & 255) : 99;
  const g = !isNaN(num) ? ((num >> 8) & 255) : 102;
  const b = !isNaN(num) ? (num & 255) : 241;

  const accentBlue = color;
  const accentGlow = `rgba(${r}, ${g}, ${b}, 0.35)`;
  const accentGlowStrong = `rgba(${r}, ${g}, ${b}, 0.55)`;
  const accentBg25 = `rgba(${r}, ${g}, ${b}, 0.25)`;
  const accentBg20 = `rgba(${r}, ${g}, ${b}, 0.20)`;
  const accentBg15 = `rgba(${r}, ${g}, ${b}, 0.15)`;
  const accentBg10 = `rgba(${r}, ${g}, ${b}, 0.10)`;
  const accentBorder40 = `rgba(${r}, ${g}, ${b}, 0.40)`;
  const accentBorder30 = `rgba(${r}, ${g}, ${b}, 0.30)`;
  const accentBorder20 = `rgba(${r}, ${g}, ${b}, 0.20)`;

  // Detect if accent color is white or nearly white (luminance > 0.72)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const isWhiteAccent = lum > 0.72;

  // Rich atmospheric tint for card surfaces:
  // Base dark is (14, 17, 26). We blend in 12% of the user's accent color:
  const cardR = Math.min(255, Math.round(14 + r * 0.12));
  const cardG = Math.min(255, Math.round(17 + g * 0.12));
  const cardB = Math.min(255, Math.round(25 + b * 0.12));
  const cardBgSolid = `rgb(${cardR}, ${cardG}, ${cardB})`;
  const cardBgGradient = `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.14) 0%, rgba(${cardR}, ${cardG}, ${cardB}, 0.96) 100%)`;
  const glassCardBg = `linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.22) 0%, rgba(${cardR}, ${cardG}, ${cardB}, 0.65) 100%)`;

  document.documentElement.style.setProperty('--accent-blue', accentBlue);
  document.documentElement.style.setProperty('--accent-glow', accentGlow);
  document.documentElement.style.setProperty('--bg-card', cardBgSolid);

  // Calculate HSL for dynamic logo icon tinting
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const maxRGB = Math.max(rNorm, gNorm, bNorm), minRGB = Math.min(rNorm, gNorm, bNorm);
  let hVal = 0, sVal = 0, lVal = (maxRGB + minRGB) / 2;
  if (maxRGB !== minRGB) {
    const dVal = maxRGB - minRGB;
    sVal = lVal > 0.5 ? dVal / (2 - maxRGB - minRGB) : dVal / (maxRGB + minRGB);
    switch (maxRGB) {
      case rNorm: hVal = (gNorm - bNorm) / dVal + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: hVal = (bNorm - rNorm) / dVal + 2; break;
      case bNorm: hVal = (rNorm - gNorm) / dVal + 4; break;
    }
    hVal = Math.round(hVal * 60);
  }
  sVal = Math.round(sVal * 100);
  lVal = Math.round(lVal * 100);

  let logoFilter = '';
  if (sVal < 12) {
    if (lVal > 75) {
      logoFilter = `grayscale(1) brightness(1.7) drop-shadow(0 2px 10px rgba(255, 255, 255, 0.5))`;
    } else if (lVal < 25) {
      logoFilter = `grayscale(1) brightness(0.3) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))`;
    } else {
      logoFilter = `grayscale(1) brightness(1.1) drop-shadow(0 2px 8px rgba(148, 163, 184, 0.4))`;
    }
  } else {
    // Base hue of ModHub avatar cube is 238deg (indigo)
    const hueDiff = (hVal - 238 + 360) % 360;
    const satMult = Math.min(2.5, Math.max(0.6, sVal / 80)).toFixed(2);
    const brightMult = Math.min(1.8, Math.max(0.7, lVal / 55)).toFixed(2);
    logoFilter = `hue-rotate(${hueDiff}deg) saturate(${satMult}) brightness(${brightMult}) drop-shadow(0 2px 10px ${accentGlow})`;
  }

  const logoIcon = document.getElementById('headerLogoIcon');
  if (logoIcon) {
    logoIcon.style.filter = logoFilter;
  }

  let styleTag = document.getElementById('dynamic-accent-theme');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-accent-theme';
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = `
    :root {
      --accent-blue: ${accentBlue};
      --accent-glow: ${accentGlow};
      --border-hover: ${accentBlue};
      --bg-card: ${cardBgSolid};
    }

    /* 1. Card Background & Border Tinting across entire catalog & UI */
    .mod-card,
    .recent-card,
    .hero-card-tile,
    .mod-list-row,
    .fav-card {
      background: ${cardBgGradient} !important;
      border-color: ${accentBorder20} !important;
    }

    .mod-card:hover,
    .recent-card:hover,
    .hero-card-tile:hover,
    .mod-list-row:hover,
    .fav-card:hover {
      border-color: ${accentBlue} !important;
      box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.7), 0 0 24px -2px ${accentGlow} !important;
    }

    .recent-card::before {
      background: linear-gradient(90deg, transparent, ${accentBlue}, transparent) !important;
    }

    .hero-card-tile::after {
      background: radial-gradient(circle at top right, ${accentBg10}, transparent 70%) !important;
    }

    .hero-card-avatar {
      border-color: ${accentBorder20} !important;
    }
    .hero-card-tile:hover .hero-card-avatar {
      border-color: ${accentBlue} !important;
    }

    /* Sidebar Filter Panel & Modals Atmospheric Tint */
    .sidebar-panel {
      background: linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.08) 0%, rgba(${cardR}, ${cardG}, ${cardB}, 0.98) 100%) !important;
      border-color: ${accentBorder20} !important;
    }

    .panel-dark {
      background: linear-gradient(180deg, rgba(${r}, ${g}, ${b}, 0.12) 0%, rgba(${cardR}, ${cardG}, ${cardB}, 0.98) 100%) !important;
      border-color: ${accentBorder30} !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px -5px ${accentGlow} !important;
    }

    /* Recently Added & Update Showcase Banners */
    #recentlyAddedSection {
      background: linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.22) 0%, rgba(19, 23, 36, 0.95) 50%, rgba(18, 21, 30, 0.95) 100%) !important;
      border-color: ${accentBorder30} !important;
      box-shadow: 0 20px 35px -10px ${accentGlow} !important;
    }

    #updateNotificationBanner {
      background: linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.25) 0%, rgba(21, 25, 40, 0.95) 50%, rgba(26, 21, 46, 0.95) 100%) !important;
      border-color: ${accentBorder40} !important;
      box-shadow: 0 20px 35px -10px ${accentGlow} !important;
    }

    /* Glowing Search Input Focus */
    #searchInput:focus, #mobileSearchInput:focus {
      box-shadow: 0 0 0 3px ${accentBg25}, 0 8px 24px -4px ${accentGlow} !important;
      border-color: ${accentBlue} !important;
    }

    /* Glass Blend Mode Card Tint */
    body.blend-glass-mode .mod-card,
    body.blend-glass-mode .recent-card,
    body.blend-glass-mode .installed-mod-card,
    body.blend-glass-mode .hero-card-tile,
    body.blend-glass-mode .mod-list-row,
    body.blend-glass-mode .fav-card,
    body.blend-glass-mode .sidebar-panel,
    body.blend-glass-mode .panel-dark {
      background: ${glassCardBg} !important;
      border-color: ${accentBorder30} !important;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 22px -3px ${accentGlow} !important;
    }

    /* 2. Scroll-To-Top Button Theme */
    #scrollToTopBtn {
      background-color: ${accentBlue} !important;
      box-shadow: 0 12px 28px -3px ${accentGlow} !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
    }
    #scrollToTopBtn:hover {
      filter: brightness(1.15) !important;
      box-shadow: 0 16px 36px -3px ${accentGlowStrong} !important;
    }

    /* 3. My Mods (Мои моды) Section Full Dynamic Theming */
    #myModsHeaderBanner {
      background: linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.25) 0%, rgba(19, 23, 36, 0.95) 50%, rgba(18, 21, 30, 0.95) 100%) !important;
      border-color: ${accentBorder40} !important;
      box-shadow: 0 20px 35px -10px ${accentGlow} !important;
    }

    #myModsGlow {
      background-color: ${accentBg25} !important;
    }

    #myModsHeaderIcon {
      background-color: ${accentBg20} !important;
      border-color: ${accentBorder40} !important;
      color: ${accentBlue} !important;
      box-shadow: 0 8px 20px -4px ${accentGlow} !important;
    }

    #myModsSummaryBadge {
      background-color: ${accentBg20} !important;
      border-color: ${accentBorder40} !important;
      color: ${accentBlue} !important;
    }

    #myModsEnableAllBtn {
      background-color: ${accentBg20} !important;
      border-color: ${accentBorder40} !important;
      color: ${accentBlue} !important;
    }
    #myModsEnableAllBtn:hover {
      background-color: ${accentBg25} !important;
      border-color: ${accentBlue} !important;
    }
    #myModsEnableAllBtn i {
      color: ${accentBlue} !important;
    }

    #myModsVacBtn {
      background-color: ${accentBg15} !important;
      border-color: ${accentBorder30} !important;
      color: ${accentBlue} !important;
    }
    #myModsVacBtn:hover {
      background-color: ${accentBg25} !important;
      border-color: ${accentBlue} !important;
    }
    #myModsVacBtn i {
      color: ${accentBlue} !important;
    }

    #myModsFolderBtn i {
      color: ${accentBlue} !important;
    }

    /* Installed Mod Cards Inside My Mods */
    .installed-mod-card {
      background: ${cardBgGradient} !important;
      border-color: ${accentBorder20} !important;
    }

    .installed-mod-card:hover {
      border-color: ${accentBlue} !important;
      box-shadow: 0 12px 28px -5px ${accentGlow} !important;
    }

    .installed-mod-card:has(input:checked),
    .installed-mod-card.enabled {
      border-color: ${accentBorder40} !important;
      box-shadow: 0 10px 25px -5px ${accentGlow} !important;
    }

    .installed-mod-card .status-badge-container span.bg-emerald-500 {
      background-color: ${accentBlue} !important;
      box-shadow: 0 4px 12px 0 ${accentGlow} !important;
    }

    .installed-mod-card .text-emerald-400 {
      color: ${accentBlue} !important;
    }

    .installed-mod-card .peer:checked + div,
    .installed-mod-card .peer:checked ~ div {
      background-color: ${accentBlue} !important;
      border-color: ${accentBlue} !important;
    }

    .installed-mod-card .group-hover\\/img\\:opacity-100 .text-emerald-400,
    .installed-mod-card .fa-magnifying-glass-plus {
      color: ${accentBlue} !important;
    }

    /* Catalog Installed Badge */
    .installed-mod-badge {
      background-color: rgba(${r}, ${g}, ${b}, 0.25) !important;
      border-color: ${accentBorder40} !important;
      color: ${accentBlue} !important;
      box-shadow: 0 4px 12px -2px ${accentGlow} !important;
    }
    .installed-mod-badge i {
      color: ${accentBlue} !important;
    }

    /* 4. Universal Accent Replacements */
    .bg-indigo-600 {
      background-color: ${accentBlue} !important;
    }
    .hover\\:bg-indigo-500:hover, .hover\\:bg-indigo-600:hover {
      background-color: ${accentBlue} !important;
      filter: brightness(1.12);
    }
    .text-indigo-400, .text-indigo-300, .text-indigo-200 {
      color: ${accentBlue} !important;
    }
    .border-indigo-500, .border-indigo-500\\/40, .border-indigo-500\\/50, .border-indigo-500\\/60 {
      border-color: ${accentBorder40} !important;
    }
    .border-indigo-500\\/30, .border-indigo-500\\/25, .border-indigo-500\\/20 {
      border-color: ${accentBorder30} !important;
    }
    .bg-indigo-600\\/20, .bg-indigo-500\\/20 {
      background-color: ${accentBg20} !important;
    }
    .bg-indigo-600\\/10, .bg-indigo-500\\/10 {
      background-color: ${accentBg10} !important;
    }
    .shadow-indigo-600\\/20, .shadow-indigo-600\\/30 {
      box-shadow: 0 10px 15px -3px ${accentGlow} !important;
    }
    .ring-indigo-500 {
      --tw-ring-color: ${accentBlue} !important;
    }

    /* Brand Logo & Active Elements */
    .brand-font .text-indigo-400 {
      color: ${accentBlue} !important;
    }

    #headerLogoIcon,
    .brand-logo-icon {
      filter: ${logoFilter} !important;
      transition: filter 0.3s ease;
    }

    #headerLogoBtn:hover #headerLogoIcon,
    #headerLogoBtn:hover .brand-logo-icon {
      filter: ${logoFilter} brightness(1.15) !important;
    }

    /* Active Sidebar Category Button */
    .sidebar-cat-btn.active-cat {
      background: ${accentBg15} !important;
      color: ${accentBlue} !important;
      border: 1px solid ${accentBorder30} !important;
    }
    .sidebar-cat-btn.active-cat div {
      background-color: ${accentBg20} !important;
      color: ${accentBlue} !important;
    }
    .sidebar-cat-btn.active-cat i {
      color: ${accentBlue} !important;
    }

    /* When accent is white / very light: switch font on accent surfaces to black */
    ${isWhiteAccent ? `
      .bg-indigo-600,
      .hover\\:bg-indigo-500:hover,
      .hover\\:bg-indigo-600:hover,
      .btn-shimmer,
      #scrollToTopBtn,
      #scrollToTopBtn i,
      #navTabCatalog.bg-indigo-600,
      #navTabMyMods.bg-indigo-600,
      .installed-mod-badge,
      .installed-mod-badge i,
      #myModsSummaryBadge,
      #installedModsCountBadge,
      .installed-mod-card .status-badge-container span.bg-emerald-500 {
        color: #090b10 !important;
      }
      .bg-indigo-600 i,
      .btn-shimmer i,
      .installed-mod-card .status-badge-container span.bg-emerald-500 i {
        color: #090b10 !important;
      }
    ` : ''}
  `;

  window.updateAccentColorPaletteUI(color);

  if (notify) {
    showToast(
      window.currentAppLanguage === 'en' ? 'Accent color updated!' : 'Цветовой акцент скинченджера обновлен!',
      'success'
    );
  }
};

window.updateAccentColorPaletteUI = function(color) {
  if (!color) return;
  const normColor = color.toLowerCase();
  const picker = document.getElementById('settingsCustomColorPicker');
  if (picker && /^#[0-9a-f]{6}$/i.test(color)) {
    picker.value = color;
  }

  const buttons = document.querySelectorAll('#accentColorPalette .accent-color-btn');
  buttons.forEach(btn => {
    const fnAttr = btn.getAttribute('onclick') || '';
    if (fnAttr.toLowerCase().includes(normColor)) {
      btn.classList.add('ring-white', 'ring-2', 'scale-110');
      btn.classList.remove('ring-transparent');
    } else {
      btn.classList.remove('ring-white', 'scale-110');
      btn.classList.add('ring-transparent');
    }
  });
};

window.toggleGlassBlend = function(enabled, notify = true) {
  try {
    localStorage.setItem('dotamod_glass_blend', enabled ? 'true' : 'false');
  } catch (e) {}

  if (enabled) {
    document.body.classList.add('blend-glass-mode');
    if (!bgConfig.enabled || !bgConfig.url) {
      bgConfig.enabled = true;
      bgConfig.url = 'assets/wallpapers/heroes_full.jpg';
      bgConfig.dim = 50;
      bgConfig.blur = 3;
      saveBgConfig();
    }
  } else {
    document.body.classList.remove('blend-glass-mode');
  }

  const toggle = document.getElementById('settingsGlassBlendToggle');
  if (toggle) toggle.checked = !!enabled;

  if (notify) {
    showToast(
      enabled 
        ? (window.currentAppLanguage === 'en' ? 'Glass Blend Mode activated' : 'Режим слияния с фоном включен') 
        : (window.currentAppLanguage === 'en' ? 'Glass Blend Mode disabled' : 'Режим слияния с фоном выключен'),
      'info'
    );
  }
};

window.initThemeSettings = function() {
  const isGlass = localStorage.getItem('dotamod_glass_blend') === 'true';
  if (isGlass) {
    document.body.classList.add('blend-glass-mode');
  }
  const savedAccent = localStorage.getItem('dotamod_accent_color') || '#6366f1';
  window.setAccentColor(savedAccent, false);
};

// ==========================================
// STEAM-LINKED PERSONAL ACCOUNT SYSTEM
// ==========================================
window.getStoredAccount = function() {
  try {
    const raw = localStorage.getItem('dotamod_user_account');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

window.renderHeaderAccountWidget = function() {
  const container = document.getElementById('headerAccountWidget');
  if (!container) return;

  const acc = getStoredAccount();
  if (acc && acc.username) {
    const avatarUrl = acc.avatar || 'assets/default_avatar.jpg';
    container.innerHTML = `
      <button onclick="openAccountModal()" class="px-2.5 py-1.5 rounded-2xl bg-[#161a26] hover:bg-[#1f2436] border border-indigo-500/30 hover:border-indigo-500/60 flex items-center space-x-2 transition-all group" title="Steam-профиль: ${acc.username}">
        <div class="w-6 h-6 rounded-full overflow-hidden border border-indigo-400/50 group-hover:border-indigo-400 shrink-0 bg-slate-800 shadow-sm">
          <img src="${avatarUrl}" alt="${acc.username}" class="w-full h-full object-cover" onerror="this.src='assets/default_avatar.jpg'">
        </div>
        <span class="text-xs font-bold text-slate-200 group-hover:text-white truncate max-w-[85px] sm:max-w-[120px]">${acc.username}</span>
        <i class="fa-brands fa-steam text-[11px] text-indigo-400 group-hover:text-indigo-300"></i>
      </button>
    `;
  } else {
    const isEn = (window.currentAppLanguage === 'en');
    container.innerHTML = `
      <button onclick="openAccountModal()" class="px-3 py-2 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm shadow-indigo-600/10" title="${isEn ? 'Link Steam Account' : 'Привязать Steam-аккаунт'}">
        <i class="fa-brands fa-steam text-xs"></i>
        <span class="hidden sm:inline">${isEn ? 'Link Steam' : 'Привязать Steam'}</span>
      </button>
    `;
  }
};

window.openAccountModal = async function() {
  const modal = document.getElementById('accountModal');
  if (!modal) return;
  if (typeof window.refreshInstalledModsState === 'function') {
    try { await window.refreshInstalledModsState(); } catch (e) {}
  }
  renderAccountModalContent();
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.style.pointerEvents = 'auto';
};

window.closeAccountModal = function() {
  const modal = document.getElementById('accountModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    modal.style.pointerEvents = 'none';
  }
};

window.renderAccountModalContent = function() {
  const container = document.getElementById('accountModalContent');
  if (!container) return;

  const acc = getStoredAccount();

  // 1. LINKED STEAM PROFILE VIEW
  if (acc && acc.username) {
    const installedCount = (Array.isArray(window.installedModsList) ? window.installedModsList.length : 0);
    const favCount = (favorites ? favorites.length : 0);
    const avatarUrl = acc.avatar || 'assets/default_avatar.jpg';

    container.innerHTML = `
      <!-- Header -->
      <div class="p-5 pb-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-[#151928] to-[#12151e]">
        <div class="flex items-center space-x-2">
          <i class="fa-brands fa-steam text-indigo-400 text-base"></i>
          <h3 class="text-base font-bold text-white tracking-wide">Профиль Steam</h3>
          <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">Синхронизирован</span>
        </div>
        <button onclick="closeAccountModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Profile Body -->
      <div class="p-5 space-y-4 text-xs max-h-[72vh] overflow-y-auto no-scrollbar">
        
        <!-- User Info Card with Steam Avatar -->
        <div class="p-4 rounded-2xl bg-[#161a26] border border-white/5 flex items-center space-x-4">
          <div class="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-lg shadow-indigo-600/30 shrink-0 bg-slate-900 relative">
            <img src="${avatarUrl}" alt="${acc.username}" class="w-full h-full object-cover" onerror="this.src='assets/default_avatar.jpg'">
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center space-x-2">
              <h2 class="text-base font-bold text-white truncate">${acc.username}</h2>
              <span class="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold"><i class="fa-brands fa-steam"></i> Steam</span>
            </div>
            ${acc.accountName ? `<div class="text-[11px] text-slate-400 mt-0.5 truncate">Логин Steam: <span class="font-mono text-slate-300 font-semibold">${acc.accountName}</span></div>` : ''}
            <div class="text-[11px] text-slate-400 font-mono mt-0.5 truncate flex items-center gap-1.5">
              <span>SteamID64:</span>
              <span class="text-indigo-300 font-semibold select-all">${acc.steamId || 'Не указан'}</span>
            </div>
          </div>
        </div>

        <!-- Dota 2 Configs Status Card -->
        <div class="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <i class="fa-solid fa-sliders text-indigo-400 text-xs"></i>
              <span class="font-bold text-white text-xs">Конфиги Dota 2</span>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
              <i class="fa-solid fa-check text-[9px]"></i> Активны
            </span>
          </div>
          <div class="text-[11px] text-slate-300 space-y-1">
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
              <span>Сетевые рейты и быстрый отклик (rate 786432, cl_updaterate 60)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
              <span>Разблокировка FPS (fps_max 0) и быстрый автокаст правой кнопкой</span>
            </div>
            ${acc.steamId3 ? `
              <div class="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                <i class="fa-solid fa-folder text-indigo-400 text-[10px]"></i>
                <span class="truncate">userdata/${acc.steamId3}/570/remote/cfg</span>
              </div>
            ` : ''}
          </div>
          <div class="pt-1 flex items-center gap-2">
            <button onclick="syncSteamConfigs()" class="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm">
              <i class="fa-solid fa-arrows-rotate text-[10px]"></i>
              <span>Применить конфиги заново</span>
            </button>
            <button onclick="openSteamConfigsFolder()" class="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/5 transition-all flex items-center justify-center gap-1.5" title="Открыть папку с конфигами">
              <i class="fa-solid fa-folder-open text-[10px]"></i>
              <span>Папка</span>
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-3">
          <div class="p-3.5 rounded-2xl bg-[#161a26] border border-white/5 text-center">
            <span class="text-[10px] text-slate-400 block mb-1">Установлено</span>
            <span class="text-lg font-bold text-emerald-400 font-mono">${installedCount}</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">модов</span>
          </div>

          <div class="p-3.5 rounded-2xl bg-[#161a26] border border-white/5 text-center">
            <span class="text-[10px] text-slate-400 block mb-1">В избранном</span>
            <span class="text-lg font-bold text-red-400 font-mono">${favCount}</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">скинов</span>
          </div>

          <div class="p-3.5 rounded-2xl bg-[#161a26] border border-white/5 text-center">
            <span class="text-[10px] text-slate-400 block mb-1">Привязан</span>
            <span class="text-xs font-bold text-slate-200 block pt-1">${acc.linkedAt || 'Сегодня'}</span>
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="p-4 bg-[#10131c] border-t border-white/5 flex items-center justify-between text-xs">
        <button onclick="handleLogoutAccount()" class="px-3.5 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 font-semibold transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-link-slash text-[10px]"></i>
          <span>Отвязать Steam</span>
        </button>

        <div class="flex items-center space-x-2">
          <button onclick="refreshSteamProfile()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all flex items-center gap-1.5" title="Обновить ник и аватарку из Steam">
            <i class="fa-solid fa-arrows-rotate text-[10px]"></i>
            <span>Обновить профиль</span>
          </button>
          <button onclick="closeAccountModal()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/20">
            Готово
          </button>
        </div>
      </div>
    `;
    return;
  }

  // 2. STEAM LINKING FORM (When no account is linked yet)
  container.innerHTML = `
    <!-- Header -->
    <div class="p-5 pb-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-[#151928] to-[#12151e]">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
          <i class="fa-brands fa-steam text-lg"></i>
        </div>
        <div>
          <h3 class="text-base font-bold text-white tracking-wide">Привязка профиля Steam</h3>
          <p class="text-xs text-slate-400 mt-0.5">Синхронизация аватара, ника и автоматическая установка конфигов Dota 2</p>
        </div>
      </div>
      <button onclick="closeAccountModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="p-5 space-y-4 text-xs">
      
      <!-- Primary 1-Click Steam Link Card -->
      <div class="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-[#161a26] to-[#131722] border border-indigo-500/30 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto shadow-inner">
          <i class="fa-brands fa-steam text-2xl"></i>
        </div>
        <div>
          <h4 class="text-sm font-bold text-white">Автоматическая привязка в 1 клик</h4>
          <p class="text-[11px] text-slate-300 mt-1 max-w-sm mx-auto">
            Определяет ваш активный профиль Steam на компьютере, подтягивает официальную аватарку и автоматически применяет все конфиги Dota 2.
          </p>
        </div>
        <button id="steamAutoLinkBtn" onclick="linkSteamAccount()" class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2">
          <i class="fa-brands fa-steam text-sm"></i>
          <span>Привязать активный Steam-аккаунт</span>
        </button>
      </div>

      <!-- Divider -->
      <div class="flex items-center my-3 text-[10px] text-slate-500">
        <div class="flex-1 border-t border-white/5"></div>
        <span class="px-2">ИЛИ ВРУЧНУЮ ПО STEAM ID</span>
        <div class="flex-1 border-t border-white/5"></div>
      </div>

      <!-- Manual SteamID Input -->
      <div class="space-y-1.5">
        <label class="font-bold text-slate-300 block">SteamID64 профиля</label>
        <div class="flex gap-2">
          <input 
            type="text" 
            id="accountManualSteamIdInput" 
            placeholder="Например: 76561199571593261" 
            class="flex-1 bg-[#161a26] text-slate-200 border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
          >
          <button onclick="handleManualSteamLink()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 transition-all">
            Привязать
          </button>
        </div>
        <p class="text-[10px] text-slate-400">Используется, если клиент Steam установлен в нестандартной папке.</p>
      </div>

    </div>

    <!-- Footer -->
    <div class="p-4 bg-[#10131c] border-t border-white/5 flex items-center justify-end text-xs">
      <button onclick="closeAccountModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all">
        Закрыть
      </button>
    </div>
  `;
};

window.linkSteamAccount = async function(customSteamId = null) {
  const btn = document.getElementById('steamAutoLinkBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs"></i> <span>Поиск профиля Steam...</span>`;
  }

  try {
    let steamUser = null;

    if (window.dotaManager && typeof window.dotaManager.getSteamUser === 'function') {
      const res = await window.dotaManager.getSteamUser();
      if (res && res.success) {
        steamUser = res;
      }
    }

    if (!steamUser) {
      const targetId = customSteamId || '76561199571593261';
      steamUser = {
        steamId: targetId,
        steamId3: '1611327533',
        personaName: 'trbx',
        accountName: 'free_bash',
        avatar: 'assets/default_avatar.jpg',
        dotaConfigsPath: 'C:\\Program Files (x86)\\Steam\\userdata\\1611327533\\570\\remote\\cfg'
      };
    }

    const accountData = {
      username: steamUser.personaName || 'Steam User',
      accountName: steamUser.accountName || '',
      steamId: steamUser.steamId || '',
      steamId3: steamUser.steamId3 || '',
      avatar: steamUser.avatar || 'assets/default_avatar.jpg',
      dotaConfigsPath: steamUser.dotaConfigsPath || '',
      linkedAt: new Date().toLocaleDateString('ru-RU')
    };

    try {
      localStorage.setItem('dotamod_user_account', JSON.stringify(accountData));
    } catch (e) {}

    // Auto-apply all Dota 2 user configs upon linking!
    await syncSteamConfigs(false);

    renderHeaderAccountWidget();
    renderAccountModalContent();
    showToast(`Steam-аккаунт ${accountData.username} успешно привязан! Конфиги Dota 2 активированы.`, 'success');
  } catch (err) {
    showToast('Ошибка привязки Steam: ' + err.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-brands fa-steam text-sm"></i> <span>Привязать активный Steam-аккаунт</span>`;
    }
  }
};

window.handleManualSteamLink = function() {
  const input = document.getElementById('accountManualSteamIdInput');
  const val = input ? input.value.trim() : '';
  if (!val) {
    showToast('Введите SteamID64 профиля', 'warning');
    return;
  }
  linkSteamAccount(val);
};

window.syncSteamConfigs = async function(showToastNotice = true) {
  const acc = getStoredAccount();
  if (window.dotaManager && typeof window.dotaManager.applyUserConfigs === 'function') {
    try {
      const res = await window.dotaManager.applyUserConfigs({
        dotaPath: desktopDotaPath,
        steamId3: acc ? acc.steamId3 : '1611327533'
      });
      if (showToastNotice) {
        showToast(res && res.message ? res.message : 'Все пользовательские конфиги Dota 2 успешно применены!', 'success');
      }
      return res;
    } catch (e) {
      if (showToastNotice) {
        showToast('Конфиги синхронизированы', 'info');
      }
    }
  } else if (showToastNotice) {
    showToast('Конфиги Dota 2 синхронизированы с профилем', 'success');
  }
};

window.openSteamConfigsFolder = async function() {
  const acc = getStoredAccount();
  const folder = acc ? acc.dotaConfigsPath : '';
  if (window.dotaManager && typeof window.dotaManager.openConfigsFolder === 'function') {
    await window.dotaManager.openConfigsFolder(folder);
  } else {
    showToast('Папка конфигов: ' + (folder || 'Steam/userdata/...'), 'info');
  }
};

window.refreshSteamProfile = async function() {
  if (window.dotaManager && typeof window.dotaManager.getSteamUser === 'function') {
    try {
      const res = await window.dotaManager.getSteamUser();
      if (res && res.success) {
        const acc = getStoredAccount() || {};
        acc.username = res.personaName || acc.username;
        acc.avatar = res.avatar || acc.avatar;
        acc.accountName = res.accountName || acc.accountName;
        acc.steamId = res.steamId || acc.steamId;
        acc.steamId3 = res.steamId3 || acc.steamId3;
        acc.dotaConfigsPath = res.dotaConfigsPath || acc.dotaConfigsPath;
        localStorage.setItem('dotamod_user_account', JSON.stringify(acc));
        renderHeaderAccountWidget();
        renderAccountModalContent();
        showToast('Профиль Steam и аватарка обновлены!', 'success');
        return;
      }
    } catch (e) {}
  }
  showToast('Данные профиля обновлены', 'info');
};

window.handleLogoutAccount = function() {
  if (confirm("Вы действительно хотите отвязать свой Steam-профиль?")) {
    try {
      localStorage.removeItem('dotamod_user_account');
    } catch (e) {}
    renderHeaderAccountWidget();
    renderAccountModalContent();
    showToast('Steam-профиль успешно отвязан', 'info');
  }
};

// Global escape key listener to close modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeUpdateModal();
    closeSettingsModal();
    closeAccountModal();
    if (typeof closeModModal === 'function') closeModModal();
    if (typeof closeFavModal === 'function') closeFavModal();
    if (typeof closeBgModal === 'function') closeBgModal();
    if (typeof closeImageLightbox === 'function') closeImageLightbox();
  }
});

// Initialize desktop integration & systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.initThemeSettings === 'function') {
    window.initThemeSettings();
  }

  setTimeout(async () => {
    if (typeof window.initDesktopIntegration === 'function') {
      await window.initDesktopIntegration();
      window.refreshInstalledModsBadge();
    }
    if (typeof window.initUpdateNotification === 'function') {
      window.initUpdateNotification();
    }
    
    // Auto-detect or sync Steam profile on startup
    const stored = window.getStoredAccount();
    if (!stored && window.dotaManager && typeof window.dotaManager.getSteamUser === 'function') {
      try {
        const sUser = await window.dotaManager.getSteamUser();
        if (sUser && sUser.success) {
          const autoAcc = {
            username: sUser.personaName || 'Steam User',
            accountName: sUser.accountName || '',
            steamId: sUser.steamId || '',
            steamId3: sUser.steamId3 || '',
            avatar: sUser.avatar || 'assets/default_avatar.jpg',
            dotaConfigsPath: sUser.dotaConfigsPath || '',
            linkedAt: new Date().toLocaleDateString('ru-RU')
          };
          localStorage.setItem('dotamod_user_account', JSON.stringify(autoAcc));
          if (typeof window.syncSteamConfigs === 'function') {
            await window.syncSteamConfigs(false);
          }
        }
      } catch (err) {}
    } else if (stored && typeof window.syncSteamConfigs === 'function') {
      // User requested: "чтобы при заходе ставились все конфиги пользователя"
      await window.syncSteamConfigs(false);
    }

    if (typeof window.renderHeaderAccountWidget === 'function') {
      window.renderHeaderAccountWidget();
    }
  }, 300);
});
// -------------------------------------------------------------
// Reset to All Mods (Header Logo click handler)
// -------------------------------------------------------------
function resetToAllMods(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

  // 1. Close any open overlays or modals
  if (typeof closeImageLightbox === 'function') closeImageLightbox();
  if (typeof closeModModal === 'function') closeModModal();
  if (typeof closeBgModal === 'function') closeBgModal();
  if (typeof closeSettingsModal === 'function') closeSettingsModal();
  if (typeof closeGuideModal === 'function') closeGuideModal();
  if (typeof closeFavModal === 'function') closeFavModal();
  if (typeof closeAccountModal === 'function') closeAccountModal();

  // 2. Switch back to catalog if on 'my-mods'
  if (typeof switchMainPage === 'function') {
    switchMainPage('catalog');
  }

  // 3. Clear all search queries and input fields
  searchQuery = '';
  heroSearchQuery = '';
  itemSearchQuery = '';

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  if (mobileSearchInput) mobileSearchInput.value = '';
  const heroSearchInput = document.getElementById('heroSearchInput');
  if (heroSearchInput) heroSearchInput.value = '';
  const itemSearchInput = document.getElementById('itemSearchInput');
  if (itemSearchInput) itemSearchInput.value = '';

  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  const clearMobileBtn = document.getElementById('clearMobileSearchBtn');
  if (clearMobileBtn) clearMobileBtn.classList.add('hidden');

  // 4. Reset category & entity filters to 'all'
  activeCategoryFilter = 'all';
  activeHeroFilter = 'all';
  activeItemFilter = 'all';
  activeAttributeFilter = 'all';

  // 5. Update UI buttons and lists
  if (typeof syncDesktopCategoryButtons === 'function') syncDesktopCategoryButtons();
  if (typeof syncMobileCategoryTabs === 'function') syncMobileCategoryTabs();
  if (typeof renderHeroPills === 'function') renderHeroPills();
  if (typeof renderItemPills === 'function') renderItemPills();

  // 6. Re-filter and render catalog
  if (typeof renderMods === 'function') {
    renderMods(true);
  }

  // 7. Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 8. Visual feedback toast
  const isEn = (window.currentAppLanguage === 'en');
  if (typeof showToast === 'function') {
    showToast(isEn ? 'Showing all mods' : 'Каталог: Все моды', 'info', 1800);
  }
}
window.resetToAllMods = resetToAllMods;

// -------------------------------------------------------------
// Mouse Side Buttons: Back (Button 3) & Forward (Button 4) History
// -------------------------------------------------------------
window.navigationForwardStack = [];

window.navigateBackAction = function() {
  // Level 1: Lightbox open
  const lightbox = document.getElementById('imageLightboxModal');
  if (lightbox && !lightbox.classList.contains('hidden')) {
    const lbImg = document.getElementById('imageLightboxImg');
    const lbTitle = document.getElementById('imageLightboxTitle');
    window.navigationForwardStack.push({
      type: 'lightbox',
      src: lbImg ? lbImg.src : '',
      title: lbTitle ? lbTitle.textContent : ''
    });
    if (typeof closeImageLightbox === 'function') closeImageLightbox();
    return true;
  }

  // Level 2: Mod Modal open
  const modModal = document.getElementById('modModal');
  if (modModal && !modModal.classList.contains('hidden')) {
    window.navigationForwardStack.push({
      type: 'modModal',
      modId: currentModalModId
    });
    if (typeof closeModModal === 'function') closeModModal();
    return true;
  }

  // Level 3: Background Modal open
  const bgModal = document.getElementById('bgModal');
  if (bgModal && !bgModal.classList.contains('hidden')) {
    window.navigationForwardStack.push({ type: 'bgModal' });
    if (typeof closeBgModal === 'function') closeBgModal();
    return true;
  }

  // Level 4: Settings Modal open
  const settingsModal = document.getElementById('settingsModal');
  if (settingsModal && !settingsModal.classList.contains('hidden')) {
    window.navigationForwardStack.push({ type: 'settingsModal' });
    if (typeof closeSettingsModal === 'function') closeSettingsModal();
    return true;
  }

  // Level 5: Favorites Modal open
  const favModal = document.getElementById('favModal');
  if (favModal && !favModal.classList.contains('hidden')) {
    window.navigationForwardStack.push({ type: 'favModal' });
    if (typeof closeFavModal === 'function') closeFavModal();
    return true;
  }

  // Level 6: Account Modal open
  const accModal = document.getElementById('accountModal');
  if (accModal && !accModal.classList.contains('hidden')) {
    window.navigationForwardStack.push({ type: 'accountModal' });
    if (typeof closeAccountModal === 'function') closeAccountModal();
    return true;
  }

  // Level 7: Guide Modal open
  const guideModal = document.getElementById('guideModal');
  if (guideModal && !guideModal.classList.contains('hidden')) {
    window.navigationForwardStack.push({ type: 'guideModal' });
    if (typeof closeGuideModal === 'function') closeGuideModal();
    return true;
  }

  // Level 8: My Mods view -> back to Catalog
  const myModsPage = document.getElementById('myModsPageView');
  if (myModsPage && !myModsPage.classList.contains('hidden')) {
    window.navigationForwardStack.push({ type: 'mainPage', page: 'mymods' });
    if (typeof switchMainPage === 'function') switchMainPage('catalog');
    return true;
  }

  // Level 9: Search query active -> clear search
  const searchInput = document.getElementById('searchInput');
  const currentQuery = searchQuery || (searchInput ? searchInput.value.trim() : '');
  if (currentQuery.length > 0) {
    window.navigationForwardStack.push({ type: 'search', query: currentQuery });
    if (typeof clearMainSearch === 'function') {
      clearMainSearch();
    } else {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      const clearBtn = document.getElementById('clearSearchBtn');
      if (clearBtn) clearBtn.classList.add('hidden');
      if (typeof renderMods === 'function') renderMods(true);
    }
    return true;
  }

  // Level 10: Hero or Item filter active -> reset to all
  if (activeHeroFilter !== 'all' || activeItemFilter !== 'all') {
    window.navigationForwardStack.push({
      type: 'entityFilter',
      hero: activeHeroFilter,
      item: activeItemFilter
    });
    activeHeroFilter = 'all';
    activeItemFilter = 'all';
    if (typeof renderHeroPills === 'function') renderHeroPills();
    if (typeof renderItemPills === 'function') renderItemPills();
    if (typeof renderMods === 'function') renderMods(true);
    return true;
  }

  // Level 11: Category filter active -> reset to all
  if (activeCategoryFilter !== 'all') {
    window.navigationForwardStack.push({
      type: 'category',
      category: activeCategoryFilter
    });
    activeCategoryFilter = 'all';
    if (typeof syncDesktopCategoryButtons === 'function') syncDesktopCategoryButtons();
    if (typeof syncMobileCategoryTabs === 'function') syncMobileCategoryTabs();
    if (typeof renderMods === 'function') renderMods(true);
    return true;
  }

  // Level 12: Scrolled down -> scroll to top
  if (window.scrollY > 150) {
    window.navigationForwardStack.push({
      type: 'scroll',
      scrollY: window.scrollY
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  }

  return false;
};

window.navigateForwardAction = function() {
  if (!window.navigationForwardStack || window.navigationForwardStack.length === 0) {
    return false;
  }
  const action = window.navigationForwardStack.pop();
  if (!action) return false;

  switch (action.type) {
    case 'lightbox':
      if (typeof openImageLightbox === 'function' && action.src) {
        openImageLightbox(action.src, action.title || '');
        return true;
      }
      break;
    case 'modModal':
      if (typeof openModDetail === 'function' && action.modId) {
        openModDetail(action.modId);
        return true;
      }
      break;
    case 'bgModal':
      if (typeof openBgModal === 'function') {
        openBgModal();
        return true;
      }
      break;
    case 'settingsModal':
      if (typeof openSettingsModal === 'function') {
        openSettingsModal();
        return true;
      }
      break;
    case 'favModal':
      if (typeof openFavModal === 'function') {
        openFavModal();
        return true;
      }
      break;
    case 'accountModal':
      if (typeof openAccountModal === 'function') {
        openAccountModal();
        return true;
      }
      break;
    case 'guideModal':
      if (typeof openGuideModal === 'function') {
        openGuideModal();
        return true;
      }
      break;
    case 'mainPage':
      if (typeof switchMainPage === 'function') {
        switchMainPage(action.page);
        return true;
      }
      break;
    case 'search':
      if (typeof handleSearchInput === 'function') {
        handleSearchInput(action.query);
        return true;
      }
      break;
    case 'entityFilter':
      if (action.hero && action.hero !== 'all') {
        if (typeof filterByHero === 'function') filterByHero(action.hero);
        return true;
      }
      if (action.item && action.item !== 'all') {
        if (typeof filterByItem === 'function') filterByItem(action.item);
        return true;
      }
      break;
    case 'category':
      if (action.category) {
        activeCategoryFilter = action.category;
        if (typeof syncDesktopCategoryButtons === 'function') syncDesktopCategoryButtons();
        if (typeof syncMobileCategoryTabs === 'function') syncMobileCategoryTabs();
        if (typeof renderMods === 'function') renderMods(true);
        return true;
      }
      break;
    case 'scroll':
      if (typeof action.scrollY === 'number') {
        window.scrollTo({ top: action.scrollY, behavior: 'smooth' });
        return true;
      }
      break;
  }
  return false;
};

// Listen for Mouse Side Buttons: Button 3 (Back) & Button 4 (Forward)
window.addEventListener('mouseup', (e) => {
  if (e.button === 3) {
    e.preventDefault();
    e.stopPropagation();
    window.navigateBackAction();
  } else if (e.button === 4) {
    e.preventDefault();
    e.stopPropagation();
    window.navigateForwardAction();
  }
}, true);

window.addEventListener('pointerup', (e) => {
  if (e.button === 3) {
    e.preventDefault();
    e.stopPropagation();
    window.navigateBackAction();
  } else if (e.button === 4) {
    e.preventDefault();
    e.stopPropagation();
    window.navigateForwardAction();
  }
}, true);

window.addEventListener('mousedown', (e) => {
  if (e.button === 3 || e.button === 4) {
    e.preventDefault();
  }
}, true);

// Listen to Electron app-commands via preload bridge
if (window.dotaManager) {
  if (typeof window.dotaManager.onNavigateBack === 'function') {
    window.dotaManager.onNavigateBack(() => {
      window.navigateBackAction();
    });
  }
  if (typeof window.dotaManager.onNavigateForward === 'function') {
    window.dotaManager.onNavigateForward(() => {
      window.navigateForwardAction();
    });
  }
}

