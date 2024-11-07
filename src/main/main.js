const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { PythonShell } = require("python-shell");

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Задайте шлях до preload.js, якщо він використовується
      nodeIntegration: false, // Замість true ставимо false для безпеки
      contextIsolation: true, // Увімкнення contextIsolation для використання contextBridge
    },
  });

  if (isDev) {
    win.webContents.openDevTools();
    win.loadURL("http://localhost:5173"); // Завантаження з Vite у режимі розробки
  } else {
    win.loadFile(path.join(__dirname, "../../dist/renderer/index.html")); // Завантаження з dist після білду
  }
}

// Обробка виклику Python-функцій з фронтенду
const { execFile } = require("child_process");
const pathToScript = path.join(__dirname, "..", "..", "test_script.py");
ipcMain.on("run-python-test", (event) => {
  console.log("Отримано запит на запуск Python");

  execFile(
    "python",
    [pathToScript],
    { cwd: __dirname },
    (err, stdout, stderr) => {
      if (err) {
        console.error("Помилка запуску скрипта:", err);
        console.error("Деталі:", stderr); // Виводимо додаткові деталі помилки
        event.sender.send("python-test-result", "Error");
        return;
      }

      console.log("Результат від Python:", stdout);
      // Відправка результату на фронт
      event.sender.send("python-test-result", stdout);
    }
  );
});

app.whenReady().then(createWindow);
