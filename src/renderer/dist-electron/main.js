"use strict";
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  nativeImage
} = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const { menuTemplate } = require("./templates");
const isDev = process.env.NODE_ENV === "development";
let mainWindow;
let tray;
let pythonProcess;
let lastMessage = "";
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app.whenReady().then(createWindow);
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
  const menu = new Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
function createTray() {
  const iconPath = path.join(
    __dirname,
    "..",
    "assets",
    "voice-assistant-32.png"
  );
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
    width: 1e3,
    height: 600,
    minWidth: 300,
    minHeight: 250,
    show: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
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
const pathToScript = path.join(__dirname, "..", "pyScripts", "MAN_main.py");
function startPythonscript() {
  if (pythonProcess) {
    console.log("Python script is already running.");
    return;
  }
  pythonProcess = spawn("python", [pathToScript], { encoding: "utf8" });
  pythonProcess.stdout.on("data", (data) => {
    const messages = data.toString("utf8").trim().split("\n");
    messages.forEach((message) => {
      if (message !== lastMessage) {
        lastMessage = message;
        mainWindow.webContents.send("assistant-message", message);
      }
    });
  });
  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString("utf8").trim());
  });
  pythonProcess.on("close", (code) => {
    console.log(`Python process closed with code ${code}`);
    pythonProcess = null;
  });
}
ipcMain.on("run-python-script", () => {
  if (pythonProcess) {
    console.log("Python script is already running.");
    return;
  }
  console.log("Starting Python script...");
  const pathToScript2 = path.join(__dirname, "..", "pyScripts", "MAN_main.py");
  pythonProcess = spawn("python", [pathToScript2], { encoding: "utf8" });
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
    pythonProcess = null;
  });
});
app.on("quit", () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});
app.whenReady().then(createWindow);
