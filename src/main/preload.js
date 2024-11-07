const { contextBridge, ipcRenderer } = require("electron");

// Створюємо безпечний інтерфейс для рендер процесу, надаючи доступ до певних функцій
contextBridge.exposeInMainWorld("electron", {
  runPythonTest: () => ipcRenderer.send("run-python-test"),
  onPythonTestResult: (callback) =>
    ipcRenderer.on("python-test-result", (event, result) => callback(result)), // передаємо тільки результат
});
