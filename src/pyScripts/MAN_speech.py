from gtts import gTTS
from io import BytesIO
import pygame
import speech_recognition as sr


recognizer = sr.Recognizer()

def speak(text, is_speaking_ref):
    if is_speaking_ref[0]:
        return

    is_speaking_ref[0] = True
    try:
        tts = gTTS(text=text, lang='uk')
        audio = BytesIO()
        tts.write_to_fp(audio)
        audio.seek(0)

        pygame.mixer.init()
        pygame.mixer.music.load(audio, "mp3")
        pygame.mixer.music.play()

        while pygame.mixer.music.get_busy():
            pygame.time.wait(100)

        audio.close()
    finally:
        is_speaking_ref[0] = False
        pygame.mixer.quit()


def listen_command():
    
    try:
        with sr.Microphone() as mic:
            recognizer.adjust_for_ambient_noise(mic, duration=0.5)
            audio = recognizer.listen(mic, timeout=10)
            command = recognizer.recognize_google(audio, language='uk-UA').lower()
            print(command, flush=True)
            return command
    except sr.UnknownValueError:
        return ''
    except Exception as e:
        return ''

# def listen_command():
#     try:
#         with sr.Microphone() as mic:
#             recognizer.adjust_for_ambient_noise(mic, duration=0.5)  # Один раз на початку
#             print("Слухаю команду...")
#             audio = recognizer.listen(mic, timeout=10)
#             command = recognizer.recognize_google(audio, language='uk-UA').lower()
#             print(command, flush=True)
#             return command
#     except sr.UnknownValueError:
#         return ''
#     except sr.RequestError:
#         return 'Помилка підключення до сервера Google.'