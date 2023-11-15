import cv2
import pyaudio
import wave
import threading

def record_audio(filename, duration):
    # Audio recording settings
    chunk = 1024
    fmt = pyaudio.paInt16
    channels = 1
    sample_rate = 44100

    # Initialize PyAudio
    audio = pyaudio.PyAudio()

    # Open stream
    stream = audio.open(format=fmt, channels=channels, rate=sample_rate, input=True, frames_per_buffer=chunk)

    print("Recording audio...")
    frames = []

    # Record for the set duration
    for i in range(0, int(sample_rate / chunk * duration)):
        data = stream.read(chunk)
        frames.append(data)

    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    audio.terminate()

    # Save the recorded data as a WAV file
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(audio.get_sample_size(fmt))
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(frames))

def record_video(filename, duration=10):
    # Initialize the video capture object
    cap = cv2.VideoCapture(0)

    # Define the codec and create VideoWriter object
    fourcc = cv2.VideoWriter_fourcc(*'MP4V') # Using MP4 format
    out = cv2.VideoWriter(filename, fourcc, 30.0, (640, 480)) # Adjusted to 30 fps

    start_time = datetime.datetime.now()
    print("Recording video...")

    while (datetime.datetime.now() - start_time).seconds < duration:
        ret, frame = cap.read()
        if ret:
            out.write(frame)
            cv2.imshow('Recording...', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        else:
            break

    # Release everything
    cap.release()
    out.release()
    cv2.destroyAllWindows()

# Run audio and video recording in parallel
duration = 10  # seconds
audio_thread = threading.Thread(target=record_audio, args=('output_audio.wav', duration))
video_thread = threading.Thread(target=record_video, args=('output_video.mp4', duration))

audio_thread.start()
video_thread.start()

audio_thread.join()
video_thread.join()

# Post-processing to synchronize audio and video can be done here
