const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  console.log('=== СОЗДАНИЕ РЕЛИЗА v1.6.0 И ЗАГРУЗКА EXE НА GITHUB ===');

  const out = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n' }).toString();
  const token = out.match(/password=(.+)/)[1].trim();

  const repo = 'terbixsorr/DotaModHub';
  const targetTag = 'v1.6.0';
  const targetName = '🎮 DotaMod Hub v1.6.0 — Масштабное расширение каталога и устойчивость к блокировкам';
  const exePath = path.join(__dirname, '..', 'DotaModHub-v1.6.0.exe');

  if (!fs.existsSync(exePath)) {
    console.error(`Ошибка: Файл ${exePath} не найден! Дождитесь завершения сборки.`);
    process.exit(1);
  }

  const exeStats = fs.statSync(exePath);
  console.log(`Файл для загрузки: ${exePath} (${(exeStats.size / (1024 * 1024)).toFixed(2)} MB)`);

  console.log(`1. Проверка наличия релиза ${targetTag} на GitHub...`);
  let relRes = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${targetTag}`, {
    headers: {
      'Authorization': 'token ' + token,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'NodeJS-ReleaseUploader'
    }
  });

  let relData = null;
  if (relRes.status === 404) {
    console.log(`Релиз ${targetTag} не найден. Создаём новый релиз...`);
    const releaseBody = `## 🚀 Что нового в версии 1.6.0:

### 📦 1. Расширение каталога до 1 886 скинов и модов
- Добавлено **+215 новых предметов**, сетов, аркан, кастомных WebM-фонов, озвучек и визуальных эффектов.
- Единый отказоустойчивый источник данных \`SkinCatalog\` — полное исключение рассинхронизации названий, ID и карточек.
- Все изображения проверены на диске (0 битых ссылок, 0 дубликатов).

### 🛡️ 2. Устойчивость к блокировкам Windows (EBUSY Resilience)
- Динамический пул слотов расширен от \`pak02\` до \`pak999\`.
- Упреждающее обнаружение занятых файлов: если слот занят другим процессом, приложение автоматически выделяет свободный номер без ошибок и сбоев.
- Механизм безопасной записи \`safeCopyFile\` и \`safeUnlink\` с отложенным переименованием.
- Single-instance архитектура: защита от взаимной блокировки файлов при повторном запуске.

### ⭐ 3. Исправление скачивания из «Избранного»
- Скачивание и установка модов напрямую из раздела «Избранное» переведены на единый пайплайн с мгновенным обновлением статуса кнопок.

### 🔒 4. 100% совместимость с Valve Anti-Cheat (VAC)
- Чистая изоляция модов без перезаписи системных файлов \`game/dota\` и оригинального \`gameinfo.gi\`.`;

    const createRes = await fetch(`https://api.github.com/repos/${repo}/releases`, {
      method: 'POST',
      headers: {
        'Authorization': 'token ' + token,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'NodeJS-ReleaseUploader'
      },
      body: JSON.stringify({
        tag_name: targetTag,
        target_commitish: 'main',
        name: targetName,
        body: releaseBody,
        draft: false,
        prerelease: false
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error(`Ошибка при создании релиза: ${createRes.status} ${createRes.statusText}\n${errText}`);
      process.exit(1);
    }

    relData = await createRes.json();
    console.log(`Релиз успешно создан! ID: ${relData.id}`);
  } else if (relRes.ok) {
    relData = await relRes.json();
    console.log(`Релиз уже существует: ID ${relData.id}, Name: ${relData.name}`);
  } else {
    console.error(`Ошибка GitHub API: ${relRes.status} ${relRes.statusText}`);
    process.exit(1);
  }

  // Если в v1.6.0 уже был ассет DotaModHub-v1.6.0.exe, удаляем только его для перезаписи
  if (Array.isArray(relData.assets)) {
    for (const asset of relData.assets) {
      if (asset.name === 'DotaModHub-v1.6.0.exe') {
        console.log(`Удаление предыдущей версии ассета ${asset.name} (ID: ${asset.id})...`);
        await fetch(`https://api.github.com/repos/${repo}/releases/assets/${asset.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'token ' + token,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'NodeJS-ReleaseUploader'
          }
        });
      }
    }
  }

  console.log('2. Загрузка файла DotaModHub-v1.6.0.exe через curl.exe в GitHub Releases...');
  const uploadUrl = relData.upload_url.replace('{?name,label}', '?name=DotaModHub-v1.6.0.exe');

  const curlCmd = `curl.exe -L -X POST -H "Authorization: token ${token}" -H "Accept: application/vnd.github.v3+json" -H "Content-Type: application/octet-stream" --data-binary "@${exePath}" "${uploadUrl}"`;

  const curlOut = execSync(curlCmd, { maxBuffer: 15 * 1024 * 1024 }).toString();
  const uploadData = JSON.parse(curlOut);

  if (uploadData.id && uploadData.browser_download_url) {
    console.log(`\n🎉 ФАЙЛ DotaModHub-v1.6.0.exe УСПЕШНО ЗАГРУЖЕН В РЕЛИЗ v1.6.0!`);
    console.log(`ID ассета: ${uploadData.id}`);
    console.log(`Размер: ${(uploadData.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Скачать: ${uploadData.browser_download_url}`);
    console.log(`Страница релиза: ${relData.html_url}`);
  } else {
    console.error('Неожиданный ответ от GitHub:', curlOut);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Фатальная ошибка:', err);
  process.exit(1);
});
