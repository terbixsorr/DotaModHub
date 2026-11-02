const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== СБОРКА АВТОНОМНОГО SINGLE EXE DOTAMOD HUB v1.6.0 ===');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_PAYLOAD = fs.existsSync(path.join(ROOT_DIR, 'dist', 'DotaModHub-win32-x64'))
  ? path.join(ROOT_DIR, 'dist', 'DotaModHub-win32-x64')
  : path.join(ROOT_DIR, 'DotaModHub', 'dist', 'DotaModHub-win32-x64');
const TEMP_ZIP = path.join(ROOT_DIR, 'temp_payload.zip');
const STUB_EXE = path.join(ROOT_DIR, 'launcher_stub.exe');
const TARGET_EXE = path.join(ROOT_DIR, 'DotaModHub-v1.6.0.exe');
const ICON_PATH = fs.existsSync(path.join(ROOT_DIR, 'dist', 'app.ico'))
  ? path.join(ROOT_DIR, 'dist', 'app.ico')
  : path.join(ROOT_DIR, 'DotaModHub', 'dist', 'app.ico');
const CSC_PATH = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';

if (!fs.existsSync(DIST_PAYLOAD)) {
  console.error('Ошибка: Папка dist/DotaModHub-win32-x64 не найдена!');
  process.exit(1);
}

if (fs.existsSync(TEMP_ZIP)) {
  try { fs.unlinkSync(TEMP_ZIP); } catch (e) {}
}

console.log('1. Упаковка файлов приложения в payload.zip (Optimal compression)...');
console.log(`Источник: ${DIST_PAYLOAD}`);
const psZipCmd = `[System.IO.Compression.ZipFile]::CreateFromDirectory('${DIST_PAYLOAD}', '${TEMP_ZIP}', [System.IO.Compression.CompressionLevel]::Optimal, $false)`;
execSync(`powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; ${psZipCmd}"`, { stdio: 'inherit' });

const zipStats = fs.statSync(TEMP_ZIP);
console.log(`Размер архива: ${(zipStats.size / (1024 * 1024)).toFixed(2)} MB`);

console.log('2. Компиляция C# лаунчера через csc.exe...');
const launcherCs = path.join(__dirname, 'StandaloneLauncher.cs');
const cscCmd = `"${CSC_PATH}" /target:winexe /out:"${STUB_EXE}" /win32icon:"${ICON_PATH}" /reference:System.Windows.Forms.dll,System.Drawing.dll,System.IO.Compression.dll,System.IO.Compression.FileSystem.dll,Microsoft.CSharp.dll "${launcherCs}"`;
execSync(cscCmd, { stdio: 'inherit' });

console.log('3. Сборка единого бинарного файла...');
const stubBytes = fs.readFileSync(STUB_EXE);
const zipBytes = fs.readFileSync(TEMP_ZIP);

const lenBuf = Buffer.alloc(8);
lenBuf.writeBigInt64LE(BigInt(zipBytes.length), 0);

const outStream = fs.createWriteStream(TARGET_EXE);
outStream.write(stubBytes);
outStream.write(zipBytes);
outStream.write(lenBuf);
outStream.end();

outStream.on('finish', () => {
  const exeStats = fs.statSync(TARGET_EXE);
  console.log(`\n🎉 СБОРКА УСПЕШНО ЗАВЕРШЕНА!`);
  console.log(`Файл: ${TARGET_EXE}`);
  console.log(`Итоговый размер EXE: ${(exeStats.size / (1024 * 1024)).toFixed(2)} MB`);

  console.log('Очистка временных файлов...');
  try { fs.unlinkSync(TEMP_ZIP); } catch (e) {}
  try { fs.unlinkSync(STUB_EXE); } catch (e) {}
  console.log('Готово!');
});
