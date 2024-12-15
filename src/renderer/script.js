// const { ipcRenderer } = require("electron");

// function runPythonTest() {
//   console.log("Кнопка натиснута, надсилаємо запит на запуск Python");
//   ipcRenderer.send("run-python-test");

//   ipcRenderer.once("python-test-result", (event, result) => {
//     console.log("Результат від Python отримано в інтерфейсі:", result);
//     document.getElementById("result").innerText = result;
//   });
// }

// Викликаємо функцію для запуску Python скрипта
document
  .getElementById("start-voice-assistant")
  .addEventListener("click", () => {
    // Перевірка на наявність функцій для запуску Python скрипта
    if (window.electron && window.electron.startVoiceAssistant) {
      window.electron.startVoiceAssistant();
    } else {
      console.error(
        "startVoiceAssistant не доступна або об'єкт electron не знайдений"
      );
    }
  });
// if (window.electron && window.electron.running) {
//   window.electron.running((data) => {
//     console.log("data", data);

//     document.getElementById("run-info").innerHTML += `<p>${data.message}</p>`;
//   });
// }

// Отримуємо результат виконання Python скрипта, що прослуховує команди
if (
  window.electron &&
  window.electron.onAssistantMessage &&
  !window.electron.listenerAdded
) {
  window.electron.listenerAdded = true; // Встановлюємо прапорець лише один раз

  const messagesDisplayed = new Set(); // Зберігаємо унікальні повідомлення

  window.electron.onAssistantMessage((message) => {
    // Додаємо тільки якщо повідомлення ще не було показано
    if (!messagesDisplayed.has(message)) {
      console.log("message", message);
      document.getElementById("output").innerHTML += `<p>${message}</p>`;
      messagesDisplayed.add(message); // Позначаємо повідомлення як оброблене
    }
  });
} else if (!window.electron || !window.electron.onAssistantMessage) {
  console.error("onAssistantMessage не доступна");
}
