const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  nativeImage,
} = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const { PythonShell } = require("python-shell");
const { execFile } = require("child_process");
const { menuTemplate } = require("./templates");

const isDev = process.env.NODE_ENV === "development";
let mainWindow;
let tray;
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Якщо екземпляр вже існує, закриваємо новий
  app.quit();
} else {
  // Якщо це перший екземпляр, продовжуємо запуск програми
  app.on("second-instance", () => {
    // Виконується, якщо користувач намагається відкрити другий екземпляр
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  // Закриваємо застосунок, якщо всі вікна закриті (не стосується macOS)
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
function createMenu() {
  // Створення меню
  const menu = new Menu.buildFromTemplate(menuTemplate);
  // Встановлюємо меню для програми
  Menu.setApplicationMenu(menu);
}
// Створення  трею
function createTray() {
  const iconPath = path.join(
    __dirname,
    "..",
    "assets",
    "voice-assistant-32.png"
  );
  // Створення іконки
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);
  tray.setToolTip("Voice-assistant");
  tray.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    backgroundColor: "#dfe6e9",
    width: 1000,
    height: 600,
    minWidth: 300,
    minHeight: 250,
    show: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  createTray();
  createMenu();
  startPythonscript();
  if (isDev) {
    mainWindow.on("ready-to-show", () => mainWindow.show());
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.on("ready-to-show", () => mainWindow.show());
    mainWindow.loadFile(path.join(__dirname, "../../dist/renderer/index.html"));
  }
}

// function running() {
//   mainWindow.webContents.on("did-finish-load", () => {
//     mainWindow.webContents.send("mainCannel", { message: "App is running!" });
//   });
// }

const pathToScript = path.join(__dirname, "..", "..", "test_script.py");

function startPythonscript() {
  const pythonProcess = spawn("python", [pathToScript], { encoding: "utf8" });

  pythonProcess.stdout.on("data", (data) => {
    const messages = data.toString("utf8").trim().split("\n");
    messages.forEach((message) => {
      mainWindow.webContents.send("assistant-message", message);
    });
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString("utf8").trim());
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process closed with code ${code}`);
  });
}

app.whenReady().then(createWindow);

// ipcMain.on("run-python-script", (event) => {
//   startPythonscript();
// console.log("Отримано запит на запуск Python");

// const process = execFile(
//   "python",
//   [pathToScript],
//   { cwd: __dirname },
//   (err, stdout, stderr) => {
//     if (err) {
//       console.error("Помилка запуску скрипта:", err);
//       console.error("Деталі:", stderr); // Виводимо додаткові деталі помилки
//       event.sender.send("python-output", "Error");
//       return;
//     }

//     // Обробка виводу (stdout) з Python
//     process.stdout.on("data", (data) => {
//       const output = data.toString();
//       let parsedOutput;

//       try {
//         parsedOutput = JSON.parse(output); // Розбираємо JSON-вихід
//       } catch (e) {
//         console.error("Error parsing JSON output:", e);
//         return;
//       }

//       // Обробка команд на основі output
//       if (parsedOutput.command === "record_text") {
//         // Виклик відповідної функції в Electron
//         handleRecordText();
//       } else if (parsedOutput.command === "unknown") {
//         console.log("Команда не розпізнана.");
//       }
//     });

//     process.stderr.on("data", (data) => {
//       console.error(`Error: ${data}`);
//     });

//     process.on("close", (code) => {
//       console.log(`Voice assistant process exited with code ${code}`);
//     });

//     // !!! Було !!!
//     // console.log("Результат від Python:", stdout);
//     // // Відправка результату на фронт
//     // event.sender.send("python-output", stdout);
//   }
// );

// ipcMain.on("start-voice-assistant", () => {
//   startVoiceAssistant();
// });

// function startVoiceAssistant() {
//   const process = spawn("python", [pathToScript]);
//   console.log("process", process);

//   process.stdout.on("data", (data) => {
//     console.log("Відповідь від помічника:", data.toString().trim());
//     // Тут можна обробляти отриманий текст або надсилати його на фронтенд
//   });

//   process.stdout.on("data", (data) => {
//     const output = data.toString();
//     console.log("data", data.toString());

//     // let parsedOutput;
//     // Надсилаємо результат виконання Python скрипта в renderer
//     mainWindow.webContents.send("python-output", output);
//     process.stderr.on("data", (data) => {
//       console.error(`Error: ${data}`);
//     });

//     process.on("close", (code) => {
//       console.log(`Voice assistant process exited with code ${code}`);
//     });

//     // try {
//     //   parsedOutput = JSON.parse(output); // Розбираємо JSON-вихід
//     // } catch (e) {
//     //   console.error("Error parsing JSON output:", e);
//     //   return;
//     // }

//     // Обробка команд на основі output
//     // if (parsedOutput.command === "record_text") {
//     //   // Виклик відповідної функції в Electron
//     //   handleRecordText();
//     // } else if (parsedOutput.command === "unknown") {
//     //   console.log("Команда не розпізнана.");
//     // }
//   });

//   // process.stderr.on("data", (data) => {
//   //   console.error(`Error: ${data}`);
//   // });

//   // process.on("close", (code) => {
//   //   console.log(`Voice assistant process exited with code ${code}`);
//   // });
// }

// function handleRecordText() {
//   // Дії для виконання команди запису тексту
//   console.log("Handling 'record_text' command");
//   // Наприклад, відкрити нове вікно або зберегти текст
// }
