const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Функція для запуску Python-скрипта (голосовий помічник)
  startVoiceAssistant: () => ipcRenderer.send("run-python-script"),
  // running: (cb) => ipcRenderer.on("mainCannel", (_, data) => cb(data)),
  onAssistantMessage: (callback) =>
    ipcRenderer.on("assistant-message", (event, message) => callback(message)),
  onShowRebootInput: (callback) =>
    ipcRenderer.on("show-reboot-input", (event, promptText) =>
      callback(promptText)
    ),
  sendRebootMinutes: (minutes) =>
    ipcRenderer.send("send-reboot-minutes", minutes),

  onShowTimerInput: (callback) =>
    ipcRenderer.on("show-timer-input", (event, promptText) =>
      callback(promptText)
    ),
  sendTimerMinutes: (minutes) =>
    ipcRenderer.send("send-timer-minutes", minutes),

  onShowShutdownInput: (callback) =>
    ipcRenderer.on("show-shutdown-input", (event, promptText) =>
      callback(promptText)
    ),
  sendShutdownMinutes: (minutes) =>
    ipcRenderer.send("send-shutdown-minutes", minutes),

  onShowReminderInput: (callback) =>
    ipcRenderer.on("show-reminder-input", (event, promptText) =>
      callback(promptText)
    ),
  sendReminderMinutes: (minutes) =>
    ipcRenderer.send("send-reminder-minutes", minutes),

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
