# test_script.py
import sys
import os
from docx import Document
import speech_recognition as sr
sys.stdout.reconfigure(encoding='utf-8')
import json

commands_dict = {
    'commands': {
        'record_text': ['записати текст', 'запиши текст', 'текстовий запис', "текст"]
    }
}

def listen_command():
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as mic:
            recognizer.adjust_for_ambient_noise(mic, duration=0.5)
            audio = recognizer.listen(mic, timeout=10)
            print(recognizer.recognize_google(audio, language='uk-UA').lower(), flush=True)
            return recognizer.recognize_google(audio, language='uk-UA').lower()
    except sr.UnknownValueError:
        return ''

def record_text():
    print("Скажіть, як назвати текстовий файл.", flush=True)
    filename = listen_command()
    file_path = os.path.join(os.path.expanduser("~"), 'Downloads', f"{filename}.docx")
    print("Що потрібно записати текстом?", flush=True)
    text = listen_command().capitalize() + "."
    document = Document()
    document.add_paragraph(text)
    document.save(file_path)
    print("Текст записано та збережено у ваші завантаження.", flush=True)

def main():
    while True:
        command = listen_command()
        if command:
            if any(keyword in command for keyword in commands_dict['commands']['record_text']):
                
                record_text()
            else:
                print("Незрозуміла команда", flush=True)

if __name__ == "__main__":
    print("Привіт. Я голосова помічниця. Слухаю ваші команди...", flush=True)
    main()
