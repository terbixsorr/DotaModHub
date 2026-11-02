const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  console.log('=== ЗАГРУЗКА DotaModHub-v1.6.0.exe В АССЕТЫ ТЕКУЩЕГО РЕЛИЗА ===');

  const out = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n' }).toString();
  const token = out.match(/password=(.+)/)[1].trim();

  const repo = 'terbixsorr/DotaModHub';
  const releaseId = 411947230; // Релиз, открытый у пользователя на скриншоте (v1.5.0)
  const exePath = path.resolve(__dirname, '..', 'DotaModHub-v1.6.0.exe');

  if (!fs.existsSync(exePath)) {
    console.error(`Ошибка: Файл ${exePath} не найден!`);
    process.exit(1);
  }

  const exeStats = fs.statSync(exePath);
  console.log(`Файл: ${exePath} (${(exeStats.size / (1024 * 1024)).toFixed(2)} MB)`);

  const relRes = await fetch(`https://api.github.com/repos/${repo}/releases/${releaseId}`, {
    headers: {
      'Authorization': 'token ' + token,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'NodeJS'
    }
  });

  if (!relRes.ok) {
    console.error(`Ошибка получения релиза: ${relRes.status} ${relRes.statusText}`);
    process.exit(1);
  }

  const relData = await relRes.json();
  console.log(`Релиз: ID ${relData.id}, Name: ${relData.name}`);

  // Проверяем, есть ли уже DotaModHub-v1.6.0.exe
  if (Array.isArray(relData.assets)) {
    for (const asset of relData.assets) {
      if (asset.name === 'DotaModHub-v1.6.0.exe') {
        console.log(`Удаление существующего ассета v1.6.0 (ID: ${asset.id}) перед новой загрузкой...`);
        await fetch(`https://api.github.com/repos/${repo}/releases/assets/${asset.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'token ' + token,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'NodeJS'
          }
        });
      }
    }
  }

  console.log('Загрузка DotaModHub-v1.6.0.exe в список файлов релиза через curl...');
  const uploadUrl = relData.upload_url.replace('{?name,label}', '?name=DotaModHub-v1.6.0.exe');

  const curlCmd = `curl.exe -L -X POST -H "Authorization: token ${token}" -H "Accept: application/vnd.github.v3+json" -H "Content-Type: application/octet-stream" --data-binary "@${exePath}" "${uploadUrl}"`;

  const curlOut = execSync(curlCmd, { maxBuffer: 20 * 1024 * 1024 }).toString();
  const uploadData = JSON.parse(curlOut);

  if (uploadData.id && uploadData.browser_download_url) {
    console.log(`\n🎉 ФАЙЛ DotaModHub-v1.6.0.exe УСПЕШНО ДОБАВЛЕН В РЕЛИЗ!`);
    console.log(`ID ассета: ${uploadData.id}`);
    console.log(`Размер: ${(uploadData.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`URL скачивания: ${uploadData.browser_download_url}`);
  } else {
    console.error('Ошибка ответа GitHub:', curlOut);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Фатальная ошибка:', err);
  process.exit(1);
});
