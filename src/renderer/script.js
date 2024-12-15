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

if (window.electron && window.electron.onShowRebootInput) {
  window.electron.onShowRebootInput((promptText) => {
    const rebootSection = document.getElementById("reboot-pc-section");
    const promptLabel = document.getElementById("reboot-prompt-label");

    // Відображаємо секцію з введенням хвилин
    rebootSection.style.display = "block";
    promptLabel.textContent = promptText; // Встановлюємо текст із Python
  });
}

if (window.electron && window.electron.onShowTimerInput)
  window.electron.onShowTimerInput((promptText) => {
    const timerSection = document.getElementById("timer-pc-section");
    const promptLabel = document.getElementById("timer-prompt-label");

    // Відображаємо секцію з введенням хвилин
    timerSection.style.display = "block";
    promptLabel.textContent = promptText; // Встановлюємо текст із Python
  });

if (window.electron && window.electron.onShowShutdownInput)
  window.electron.onShowShutdownInput((promptText) => {
    const shutdownSection = document.getElementById("shutdown-pc-section");
    const promptLabel = document.getElementById("shutdown-prompt-label");

    // Відображаємо секцію з введенням хвилин
    shutdownSection.style.display = "block";
    promptLabel.textContent = promptText; // Встановлюємо текст із Python
  });

if (window.electron && window.electron.onShowReminderInput)
  window.electron.onShowReminderInput((promptText) => {
    const reminderSection = document.getElementById("reminder-pc-section");
    const promptLabel = document.getElementById("reminder-prompt-label");

    // Відображаємо секцію з введенням хвилин
    reminderSection.style.display = "block";
    promptLabel.textContent = promptText; // Встановлюємо текст із Python
  });

// Надсилаємо хвилини для перезавантаження
document.getElementById("reboot-pc-btn").addEventListener("click", () => {
  const minutes = document.getElementById("reboot-minutes").value;

  if (!minutes || minutes <= 0) {
    alert("Будь ласка, введіть коректну кількість хвилин!");
    return;
  }

  // Надсилаємо хвилини у Python
  window.electron.sendRebootMinutes(minutes);

  // Ховаємо секцію після відправлення
  document.getElementById("reboot-pc-section").style.display = "none";
});

// Надсилаємо хвилини для таймеру
document.getElementById("timer-pc-btn").addEventListener("click", () => {
  const minutes = document.getElementById("timer-minutes").value;

  if (!minutes || minutes <= 0) {
    alert("Будь ласка, введіть коректну кількість хвилин!");
    return;
  }

  // Надсилаємо хвилини у Python
  window.electron.sendTimerMinutes(minutes);

  // Ховаємо секцію після відправлення
  document.getElementById("timer-pc-section").style.display = "none";
});

// Надсилаємо хвилини для вимкнення
document.getElementById("shutdown-pc-btn").addEventListener("click", () => {
  const minutes = document.getElementById("shutdown-minutes").value;

  if (!minutes || minutes <= 0) {
    alert("Будь ласка, введіть коректну кількість хвилин!");
    return;
  }

  // Надсилаємо хвилини у Python
  window.electron.sendShutdownMinutes(minutes);

  // Ховаємо секцію після відправлення
  document.getElementById("shutdown-pc-section").style.display = "none";
});

// Надсилаємо хвилини для нагадування
document.getElementById("reminder-pc-btn").addEventListener("click", () => {
  const minutes = document.getElementById("reminder-minutes").value;

  if (!minutes || minutes <= 0) {
    alert("Будь ласка, введіть коректну кількість хвилин!");
    return;
  }

  // Надсилаємо хвилини у Python
  window.electron.sendReminderMinutes(minutes);

  // Ховаємо секцію після відправлення
  document.getElementById("reminder-pc-section").style.display = "none";
});
