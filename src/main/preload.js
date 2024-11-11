const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Функція для запуску Python-скрипта (голосовий помічник)
  startVoiceAssistant: () => ipcRenderer.send("run-python-script"),
  // running: (cb) => ipcRenderer.on("mainCannel", (_, data) => cb(data)),
  onAssistantMessage: (callback) =>
    ipcRenderer.on("assistant-message", (event, message) => callback(message)),

  // Обробка вихідних повідомлень з Python-скрипта
  // onPythonOutput: (callback) =>
  //   ipcRenderer.on("python-output", (event, data) => {
  //     callback(data); // Передаємо отримані дані в рендер-процес
  //   }),
});

// Створюємо безпечний інтерфейс для рендер процесу, надаючи доступ до певних функцій
// contextBridge.exposeInMainWorld("electron", {
//   runPythonTest: () => ipcRenderer.send("run-python-script"),
//   onPythonOutput: (callback) =>
//     ipcRenderer.on("python-output", (event, result) => callback(result)), // передаємо тільки результат
// });
