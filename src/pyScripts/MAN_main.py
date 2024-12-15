from MAN_commands import VoiceAssistant
import sys
import io

# Встановлюємо кодування UTF-8 для stdout і stderr
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

# Словник команд
commands_dict = {
    'commands': {
        'record_audio': ['записати аудіо', 'збережи аудіо', 'аудіозапис', "аудіо", "запиши аудіо", "зберегти аудіо"],
        'record_text': ['записати текст', 'запиши текст', 'текстовий запис', "текст"],
        'add_task': ['додати завдання', 'створити задачу', 'замітка', "створити замітку", "завдання"],
        'search_google': ['шукати', 'знайди в гуглі', 'запит в гугл', "пошук", "шукай"],
        'search_youtube': ['відео', "знайди на ютубі"],
        'reboot_pc': ["перезавантажити пристрій", "перезавантажити комп'ютер"],
        'shutdown_pc': ["вимкнути пристрій", "завершити роботу", "вимкни комп'ютер"],
        'set_reminder': ['нагадати', 'поставити нагадування', 'нагадування'],
        'weather': ['погода', 'погода в місті', 'температура', 'яка погода'],
        'cancel_shutdown': ['скасувати вимкнення'],
        'cancel_reboot': ['скасувати перезавантаження'],
        'get_current_time': ['яка година', 'котра година', 'скільки часу', 'скільки зараз часу'],
        'get_current_date': ['дата', 'яка сьогодні дата', 'яка дата', 'сьогоднішня дата'],
        'calculate': ['обчислити', 'обчислення', 'порахуй', 'обчисли', 'калькулятор'],
        'set_timer': ['таймер'],
        'stop_working': ['стоп', "вийти", "бувай", "досить"]
    }
}

def main():
    # Ініціалізуємо голосового помічника
    assistant = VoiceAssistant()
    assistant.speak("Привіт. Я голосова помічниця. Що ви хочете зробити?")

    while True:
        # Перевірка, чи вже "говоримо"
        if assistant.is_speaking:
            continue

        # Слухаємо команду користувача
        command = assistant.listen_command()
        if not command:
            continue

        # Перевіряємо, яка команда була подана
        if any(cmd in command for cmd in commands_dict['commands']['record_audio']):
            assistant.record_audio()
        elif any(cmd in command for cmd in commands_dict['commands']['record_text']):
            assistant.record_text()
        elif any(cmd in command for cmd in commands_dict['commands']['add_task']):
            assistant.add_task()
        elif any(cmd in command for cmd in commands_dict['commands']['search_google']):
            assistant.search_google()
        elif any(cmd in command for cmd in commands_dict['commands']['search_youtube']):
            assistant.search_youtube()
        elif any(cmd in command for cmd in commands_dict['commands']['reboot_pc']):
            assistant.reboot_pc()
        elif any(cmd in command for cmd in commands_dict['commands']['shutdown_pc']):
            assistant.shutdown_pc()
        elif any(cmd in command for cmd in commands_dict['commands']['set_reminder']):
            assistant.set_reminder()
        elif any(cmd in command for cmd in commands_dict['commands']['cancel_shutdown']):
            assistant.cancel_shutdown()
        elif any(cmd in command for cmd in commands_dict['commands']['cancel_reboot']):
            assistant.cancel_shutdown()  # Можна об'єднати обидві команди в одну
        elif any(cmd in command for cmd in commands_dict['commands']['get_current_time']):
            assistant.get_current_time()
        elif any(cmd in command for cmd in commands_dict['commands']['get_current_date']):
            assistant.get_current_date()
        elif any(cmd in command for cmd in commands_dict['commands']['set_timer']):
            assistant.set_timer()
        elif any(cmd in command for cmd in commands_dict['commands']['calculate']):
            assistant.calculate()
        elif any(cmd in command for cmd in commands_dict['commands']['weather']):
            assistant.speak("В якому місті ви хочете дізнатися погоду?")
            city_name = assistant.listen_command()
            weather_info = assistant.get_weather(city_name)
            assistant.speak(weather_info)
        elif any(cmd in command for cmd in commands_dict['commands']['stop_working']):
            assistant.speak("До побачення!")
            break
        else:
            assistant.speak("Вибачте, я не зрозуміла вашу команду.")


if __name__ == "__main__":
    print("Привіт. Я голосова помічниця. Слухаю ваші команди...", flush=True)
    main()
