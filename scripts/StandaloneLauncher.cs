using System;
using System.IO;
using System.IO.Compression;
using System.Diagnostics;
using System.Threading;
using System.Windows.Forms;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Text;

namespace DotaModHubLauncher {
    public class SplashForm : Form {
        private ProgressBar pBar;
        private Label lblStatus;
        private Label lblTitle;
        private Label lblSub;

        public SplashForm() {
            this.FormBorderStyle = FormBorderStyle.None;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Size = new Size(420, 210);
            this.BackColor = Color.FromArgb(16, 19, 28); // #10131c
            this.TopMost = true;

            lblTitle = new Label();
            lblTitle.Text = "DOTAMOD HUB";
            lblTitle.Font = new Font("Segoe UI", 16, FontStyle.Bold);
            lblTitle.ForeColor = Color.White;
            lblTitle.Location = new Point(20, 24);
            lblTitle.Size = new Size(380, 32);
            lblTitle.TextAlign = ContentAlignment.MiddleCenter;
            this.Controls.Add(lblTitle);

            lblSub = new Label();
            lblSub.Text = "Dota 2 Ultimate Modding Suite • v1.5.0";
            lblSub.Font = new Font("Segoe UI", 8, FontStyle.Regular);
            lblSub.ForeColor = Color.FromArgb(99, 102, 241); // indigo-500
            lblSub.Location = new Point(20, 56);
            lblSub.Size = new Size(380, 20);
            lblSub.TextAlign = ContentAlignment.MiddleCenter;
            this.Controls.Add(lblSub);

            lblStatus = new Label();
            lblStatus.Text = "Подготовка к первому запуску...";
            lblStatus.Font = new Font("Segoe UI", 9, FontStyle.Regular);
            lblStatus.ForeColor = Color.FromArgb(148, 163, 184); // slate-400
            lblStatus.Location = new Point(25, 100);
            lblStatus.Size = new Size(370, 24);
            lblStatus.TextAlign = ContentAlignment.MiddleCenter;
            this.Controls.Add(lblStatus);

            pBar = new ProgressBar();
            pBar.Style = ProgressBarStyle.Marquee;
            pBar.MarqueeAnimationSpeed = 25;
            pBar.Location = new Point(40, 136);
            pBar.Size = new Size(340, 10);
            this.Controls.Add(pBar);

            Label lblFooter = new Label();
            lblFooter.Text = "Автономная сборка • Единый исполняемый файл";
            lblFooter.Font = new Font("Segoe UI", 7, FontStyle.Regular);
            lblFooter.ForeColor = Color.FromArgb(71, 85, 105);
            lblFooter.Location = new Point(20, 172);
            lblFooter.Size = new Size(380, 16);
            lblFooter.TextAlign = ContentAlignment.MiddleCenter;
            this.Controls.Add(lblFooter);
        }

        public void SetStatus(string text) {
            if (this.InvokeRequired) {
                this.BeginInvoke(new Action<string>(SetStatus), text);
                return;
            }
            lblStatus.Text = text;
        }
    }

    static class Program {
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern uint GetModuleFileName(IntPtr hModule, [Out] StringBuilder lpFilename, uint nSize);

        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern uint GetShortPathName(string lpszLongPath, [Out] StringBuilder lpszShortPath, uint cchBuffer);

        static string GetSafeSelfPath() {
            StringBuilder sb = new StringBuilder(2048);
            GetModuleFileName(IntPtr.Zero, sb, (uint)sb.Capacity);
            string longPath = sb.ToString();

            StringBuilder sbShort = new StringBuilder(2048);
            if (GetShortPathName(longPath, sbShort, (uint)sbShort.Capacity) > 0) {
                return sbShort.ToString();
            }
            return longPath;
        }

        [STAThread]
        static void Main(string[] args) {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string appDir = Path.Combine(localAppData, "Programs", "DotaModHub");
            string targetExe = Path.Combine(appDir, "DotaModHub.exe");
            string markerFile = Path.Combine(appDir, ".v150_installed");
            string selfPath = GetSafeSelfPath();

            bool forceUpdate = false;
            if (args != null) {
                foreach (string a in args) {
                    if (a == "--update" || a == "--force" || a == "-f") forceUpdate = true;
                }
            }

            // If already extracted, verify that the current launcher executable hasn't been updated
            bool isUpToDate = false;
            if (File.Exists(targetExe) && File.Exists(markerFile)) {
                try {
                    DateTime markerTime = File.GetLastWriteTimeUtc(markerFile);
                    DateTime selfTime = File.GetLastWriteTimeUtc(selfPath);
                    if (selfTime <= markerTime.AddSeconds(5)) {
                        isUpToDate = true;
                    }
                } catch {
                    isUpToDate = true;
                }
            }

            if (isUpToDate && !forceUpdate) {
                LaunchApp(targetExe, appDir, args);
                return;
            }

            SplashForm splash = new SplashForm();
            splash.Show();
            Application.DoEvents();

            Thread worker = new Thread(() => {
                try {
                    splash.SetStatus("Распаковка ресурсов DotaMod Hub...");

                    if (!Directory.Exists(appDir)) {
                        Directory.CreateDirectory(appDir);
                    }

                    selfPath = GetSafeSelfPath();
                    using (FileStream fs = new FileStream(selfPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)) {
                        if (fs.Length < 16) {
                            throw new Exception("Некорректный размер файла сборки.");
                        }

                        fs.Seek(-8, SeekOrigin.End);
                        byte[] lenBytes = new byte[8];
                        fs.Read(lenBytes, 0, 8);
                        long payloadLen = BitConverter.ToInt64(lenBytes, 0);

                        if (payloadLen <= 0 || payloadLen > fs.Length) {
                            throw new Exception("Ресурсы приложения не найдены внутри исполняемого файла.");
                        }

                        long payloadStart = fs.Length - 8 - payloadLen;
                        fs.Seek(payloadStart, SeekOrigin.Begin);

                        string tempZip = Path.Combine(Path.GetTempPath(), "dmh_extract_" + Guid.NewGuid().ToString("N") + ".zip");
                        try {
                            using (FileStream zipFs = new FileStream(tempZip, FileMode.Create, FileAccess.Write, FileShare.None)) {
                                byte[] buffer = new byte[1024 * 1024]; // 1MB buffer
                                long remaining = payloadLen;
                                while (remaining > 0) {
                                    int toRead = (int)Math.Min(buffer.Length, remaining);
                                    int read = fs.Read(buffer, 0, toRead);
                                    if (read <= 0) break;
                                    zipFs.Write(buffer, 0, read);
                                    remaining -= read;
                                }
                            }

                            splash.SetStatus("Ожидание завершения предыдущего процесса...");
                            for (int r = 0; r < 25; r++) {
                                try {
                                    Process[] procs = Process.GetProcessesByName("DotaModHub");
                                    if (procs.Length == 0) break;
                                } catch {}
                                Thread.Sleep(200);
                            }

                            splash.SetStatus("Установка компонентов...");
                            using (ZipArchive archive = ZipFile.OpenRead(tempZip)) {
                                foreach (ZipArchiveEntry entry in archive.Entries) {
                                    if (string.IsNullOrEmpty(entry.Name)) {
                                        // Directory
                                        string dirPath = Path.Combine(appDir, entry.FullName);
                                        if (!Directory.Exists(dirPath)) Directory.CreateDirectory(dirPath);
                                        continue;
                                    }
                                    string destPath = Path.Combine(appDir, entry.FullName);
                                    string destDir = Path.GetDirectoryName(destPath);
                                    if (!Directory.Exists(destDir)) Directory.CreateDirectory(destDir);
                                    
                                    int retries = 0;
                                    while (true) {
                                        try {
                                            entry.ExtractToFile(destPath, true);
                                            break;
                                        } catch (IOException) {
                                            retries++;
                                            if (retries >= 10) throw;
                                            Thread.Sleep(250);
                                        }
                                    }
                                }
                            }
                            File.WriteAllText(markerFile, DateTime.UtcNow.ToString("o"));
                            File.SetLastWriteTimeUtc(markerFile, DateTime.UtcNow.AddMinutes(5));
                        } finally {
                            if (File.Exists(tempZip)) {
                                try { File.Delete(tempZip); } catch {}
                            }
                        }
                    }

                    splash.SetStatus("Запуск DotaMod Hub...");
                    Thread.Sleep(500);

                    splash.Invoke(new Action(() => {
                        splash.Hide();
                        LaunchApp(targetExe, appDir, args);
                        Application.Exit();
                    }));
                } catch (Exception ex) {
                    MessageBox.Show("Ошибка при распаковке DotaMod Hub:\n" + ex.ToString(), "DotaMod Hub Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    Application.Exit();
                }
            });

            worker.IsBackground = true;
            worker.Start();

            Application.Run(splash);
        }

        static void LaunchApp(string exePath, string workDir, string[] args) {
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = exePath;
            psi.WorkingDirectory = workDir;
            if (args != null && args.Length > 0) {
                psi.Arguments = string.Join(" ", args);
            }
            psi.UseShellExecute = true;
            Process.Start(psi);
        }
    }
}
