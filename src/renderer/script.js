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
document.getElementById("run-button").addEventListener("click", () => {
  // Перевірка на наявність функцій
  if (window.electron && window.electron.runPythonTest) {
    window.electron.runPythonTest(); // Викликаємо функцію runPythonTest
  } else {
    console.error("runPythonTest не доступна або об'єкт electron не знайдений");
  }
});

// Отримуємо результат виконання Python скрипта
if (window.electron && window.electron.onPythonTestResult) {
  window.electron.onPythonTestResult((result) => {
    console.log("Результат Python тесту:", result);

    // Виведення результату в HTML
    document.getElementById("result").textContent = result;
  });
} else {
  console.error("onPythonTestResult не доступна");
}
