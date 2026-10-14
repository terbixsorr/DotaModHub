const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  console.log('=== ОБНОВЛЕНИЕ РЕЛИЗА И ЗАГРУЗКА EXE НА GITHUB ===');

  const out = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n' }).toString();
  const token = out.match(/password=(.+)/)[1].trim();

  const repo = 'terbixsorr/DotaModHub';
  const targetTag = 'v1.5.0';
  const exePath = path.join(__dirname, '..', 'DotaModHub-v1.5.0.exe');

  if (!fs.existsSync(exePath)) {
    console.error('Ошибка: Файл DotaModHub-v1.5.0.exe не найден!');
    process.exit(1);
  }

  const exeStats = fs.statSync(exePath);
  console.log(`Файл для загрузки: ${exePath} (${(exeStats.size / (1024 * 1024)).toFixed(2)} MB)`);

  console.log(`1. Получение релиза ${targetTag} из GitHub...`);
  const getRelRes = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${targetTag}`, {
    headers: {
      'Authorization': 'token ' + token,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'NodeJS-ReleaseUploader'
    }
  });

  if (!getRelRes.ok) {
    console.error(`Ошибка получения релиза: ${getRelRes.status} ${getRelRes.statusText}`);
    process.exit(1);
  }

  const relData = await getRelRes.json();
  console.log(`Релиз найден: ID ${relData.id}, Name: ${relData.name}`);

  // Удаление старого ассета если есть
  if (Array.isArray(relData.assets)) {
    for (const asset of relData.assets) {
      if (asset.name === 'DotaModHub-v1.5.0.exe') {
        console.log(`Удаление старого ассета ${asset.name} (ID: ${asset.id})...`);
        const delRes = await fetch(`https://api.github.com/repos/${repo}/releases/assets/${asset.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'token ' + token,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'NodeJS-ReleaseUploader'
          }
        });
        console.log(`Статус удаления: ${delRes.status}`);
      }
    }
  }

  console.log('2. Загрузка нового файла через curl.exe в GitHub Releases...');
  const uploadUrl = relData.upload_url.replace('{?name,label}', `?name=DotaModHub-v1.5.0.exe`);

  const curlCmd = `curl.exe -L -X POST -H "Authorization: token ${token}" -H "Accept: application/vnd.github.v3+json" -H "Content-Type: application/octet-stream" --data-binary "@${exePath}" "${uploadUrl}"`;

  const curlOut = execSync(curlCmd, { maxBuffer: 10 * 1024 * 1024 }).toString();
  const uploadData = JSON.parse(curlOut);

  if (uploadData.id && uploadData.browser_download_url) {
    console.log(`\n🎉 EXE ФАЙЛ УСПЕШНО ЗАГРУЖЕН В GITHUB RELEASES!`);
    console.log(`ID: ${uploadData.id}`);
    console.log(`Размер: ${(uploadData.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`URL: ${uploadData.browser_download_url}`);
  } else {
    console.error('Неожиданный ответ от GitHub:', curlOut);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Фатальная ошибка:', err);
  process.exit(1);
});
