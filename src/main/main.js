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
const { menuTemplate } = require("./templates");

const isDev = process.env.NODE_ENV === "development";
let mainWindow;
let tray;
let pythonProcess; // Глобальна змінна для Python-процесу
let lastMessage = ""; // Зберігаємо останнє повідомлення для уникнення дублювання
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

// Створення трею
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
    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.on("ready-to-show", () => mainWindow.show());
    mainWindow.loadFile(path.join(__dirname, "../../dist/renderer/index.html"));
  }
}

const pathToScript = path.join(__dirname, "..", "pyScripts", "MAN_main.py");

function startPythonscript() {
  // Уникаємо повторного запуску Python-процесу
  if (pythonProcess) {
    console.log("Python script is already running.");
    return;
  }

  pythonProcess = spawn("python", [pathToScript], { encoding: "utf8" });

  pythonProcess.stdout.on("data", (data) => {
    const messages = data.toString("utf8").trim().split("\n");
    messages.forEach((message) => {
      if (message.startsWith("PROMPT:")) {
        // Розбиваємо повідомлення на тип і текст
        const [type, ...rest] = message.replace("PROMPT:", "").split(" ");
        const promptText = rest.join(" ").trim();

        if (type === "TIMER") {
          console.log(promptText);
          mainWindow.webContents.send("show-timer-input", promptText);
        } else if (type === "REBOOT") {
          console.log(promptText);
          mainWindow.webContents.send("show-reboot-input", promptText);
        } else if (type === "SHUTDOWN") {
          console.log(promptText);
          mainWindow.webContents.send("show-shutdown-input", promptText);
        } else if (type === "REMINDER") {
          console.log(promptText);
          mainWindow.webContents.send("show-reminder-input", promptText);
        } else {
          console.error(`Невідомий тип PROMPT: ${type}`);
        }
      } else {
        // Інші повідомлення (наприклад, assistant-message)
        mainWindow.webContents.send("assistant-message", message);
      }
    });
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString("utf8").trim());
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process closed with code ${code}`);
    pythonProcess = null; // Очищаємо процес після завершення
  });
}

ipcMain.on("run-python-script", () => {
  // Перевіряємо, чи Python-скрипт уже запущений
  if (pythonProcess) {
    console.log("Python script is already running.");
    return;
  }

  console.log("Starting Python script...");
  const pathToScript = path.join(__dirname, "..", "pyScripts", "MAN_main.py");
  pythonProcess = spawn("python", [pathToScript], { encoding: "utf8" });

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
    pythonProcess = null; // Звільняємо змінну після завершення процесу
  });
});

ipcMain.on("send-reboot-minutes", (event, minutes) => {
  if (pythonProcess) {
    pythonProcess.stdin.write(`${minutes}\n`);
  } else {
    console.error("Python process не запущений.");
  }
});

ipcMain.on("send-timer-minutes", (event, minutes) => {
  if (pythonProcess) {
    pythonProcess.stdin.write(`${minutes}\n`);
  } else {
    console.error("Python process не запущений.");
  }
});

ipcMain.on("send-shutdown-minutes", (event, minutes) => {
  if (pythonProcess) {
    pythonProcess.stdin.write(`${minutes}
`);
  } else {
    console.error("Python process не запущений.");
  }
});

ipcMain.on("send-reminder-minutes", (event, minutes) => {
  if (pythonProcess) {
    pythonProcess.stdin.write(`${minutes}
`);
  } else {
    console.error("Python process не запущений.");
  }
});

app.on("quit", () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});

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
