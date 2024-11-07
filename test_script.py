# test_script.py
import sys
import speech_recognition as sr

def recognize_speech():
    recognizer = sr.Recognizer()
    # Додатковий код для розпізнавання мовлення
    return "Speech recognition is working!"

if __name__ == "__main__":
    print(recognize_speech())


def test_function(input_data=""):
    return f"Python script received: {input_data}" if input_data else "Python script is working without input!"

if __name__ == "__main__":
    # Перевіряємо, чи є передані аргументи
    user_input = sys.argv[1] if len(sys.argv) > 1 else ""
    result = test_function(user_input)
    print(result)  # Простий вивід результату


